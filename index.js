var fs = require('fs');
var Mock = require('mockjs');
var stripJsonComments = require('strip-json-comments');

var MOCK_JS_FILE = './_mockserver.js';
var MOCK_CONFIG_FILE = './_mockserver.json';
var mockConfigFileWatcher;

function getMockConfig(mockConfigFile) {
    // 不使用 require('./mock-api.json') 因为他会缓存文件的内容, 并不是每次都重新读取
    var mockConfigContent = fs.readFileSync(mockConfigFile, {encoding: 'utf-8'});
    // 通过 stripJsonComments 让 JSON 文件中可以使用注释
    return JSON.parse(stripJsonComments(mockConfigContent));
}

function getRouteConfig(mockConfig) {
    var routeConfig = {};

    for (var routeKey in mockConfig) {
        var routeResponse = mockConfig[routeKey];

        if (routeResponse.disabled) {
            console.info(routeKey + ' disabled');
        } else {
            // 注意要使用闭包固定住 mockConfig 中的数据
            routeConfig[routeKey] = (function(routeResponse) {
                return function(request, response, next) {
                    var mockResponse = Mock.mock(routeResponse.response);
                    // 直接使用 JSONP 方式, 没有 JSONP 参数时生成 JSON, 有 JSONP 参数则生成 JSONP
                    // 例如: http://a.com/a => 接口输出 JSON
                    //       http://a.com/a?callback=a => 接口输出 JSONP
                    response.jsonp(mockResponse);
                };
            })(routeResponse);
        }
    }

    return routeConfig;
}

// 借用 puer 中的 watchFile 函数
function watchFile(filename, callback) {
    var isWin = (process.platform === 'win32');
    if (isWin) {
        return fs.watch(filename, function(event) {
            if (event === 'change') {
                return callback(filename);
            }
        });
    } else {
        return fs.watchFile(filename, {
            interval: 200
        }, function(curr, prev) {
            if (curr.mtime > prev.mtime) {
                return callback(filename);
            }
        });
    }
}

/**
 * 获取 puer mock route 的配置信息
 * 
 * @param mockJsFile {string} mock js file
 * @param mockConfigFile {string} mock server config file
 * @return mock route 的配置信息
 */
function puerMock(mockJsFile, mockConfigFile) {
    var _mockJsFile = mockJsFile || MOCK_JS_FILE;
    var _mockConfigFile = mockConfigFile || MOCK_CONFIG_FILE;
    var mockConfig = getMockConfig(_mockConfigFile);

    // 监听 MOCK_CONFIG_FILE 是否改动了, 改动后修改 mock js file 的修改时间,
    // 以激发 pouer 本身的监听, 让其重新加载 mock js file, 则会重新加载 MOCK_CONFIG_FILE,
    // 达到刷新 MOCK_CONFIG_FILE 的目的
    mockConfigFileWatcher = watchFile(_mockConfigFile, function() {
        mockConfigFileWatcher.close();
        fs.utimes(_mockJsFile, new Date(), new Date());
    });

    return getRouteConfig(mockConfig);
}

module.exports = puerMock;