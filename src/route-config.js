var fs = require('fs');

var stripJsonComments = require('strip-json-comments');
var Mock = require('mockjs');

var validateRequest = require('./validate-request');
var util = require('./util');

/**
 * 读取 _mockserver.json 配置文件
 */
function getMockConfig(mockConfigFile) {
    // 不使用 require('./_mockserver.json') 因为他会缓存文件的内容, 并不是每次都重新读取
    var mockConfigContent = fs.readFileSync(mockConfigFile, {encoding: 'utf-8'});
    // 通过 stripJsonComments 让 JSON 文件中可以使用注释
    return JSON.parse(stripJsonComments(mockConfigContent));
}

/**
 * 生成 puer route 配置
 */
function generateRouteConfig(mockConfig) {
    var routeConfig = {};

    var apiMockConifg = mockConfig.api;
    for (var routeKey in apiMockConifg) {
        var mock = apiMockConifg[routeKey];

        if (mock.disabled) {
            console.info(routeKey + ' disabled');
        } else {
            // 注意要使用闭包固定住 apiMockConifg 中的数据
            routeConfig[routeKey] = (function(mock) {
                return function(request, response, next) {
                    validateRequest(request, response, mock.request, function() {
                        sendMockData(request, response, mock.response);
                    });
                };
            })(mock);
        }
    }

    return routeConfig;
}

/**
 * 发送接口假数据
 */
function sendMockData(request, response, mockResponse) {
    var mockResponseData = Mock.mock(mockResponse);
    // enable CORS
    // https://github.com/expressjs/cors
    // 由于跨域的 PUT, DELETE 请求需要回应一个 OPTIONS 做 preflight 请求,
    // 但是没有配置这样的路由, 因此没有办法做跨域的 PUT, DELETE 请求
    response.set(util.CORS_HEADER);
    // 直接使用 JSONP 方式, 没有 JSONP 参数时生成 JSON, 有 JSONP 参数则生成 JSONP
    // 例如: http://a.com/a => 接口输出 JSON
    //       http://a.com/a?callback=a => 接口输出 JSONP
    response.jsonp(mockResponseData);
}

module.exports = {
    getMockConfig: getMockConfig,
    generateRouteConfig: generateRouteConfig
};