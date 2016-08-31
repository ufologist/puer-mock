var fs = require('fs');
var Mock = require('mockjs');
var stripJsonComments = require('strip-json-comments');

var MOCK_JS_FILE = './_mockserver.js';
var MOCK_CONFIG_FILE = './_mockserver.json';
var mockConfigFileWatcher;

var CORS_HEADER = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
    'Access-Control-Allow-Credentials': 'true'
};

function getMockConfig(mockConfigFile) {
    // 不使用 require('./mock-api.json') 因为他会缓存文件的内容, 并不是每次都重新读取
    var mockConfigContent = fs.readFileSync(mockConfigFile, {encoding: 'utf-8'});
    // 通过 stripJsonComments 让 JSON 文件中可以使用注释
    return JSON.parse(stripJsonComments(mockConfigContent));
}

// 生成 route 配置
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
                    var mockResponse = Mock.mock(mock.response);

                    // enable CORS
                    // https://github.com/expressjs/cors
                    response.set(CORS_HEADER);

                    // 直接使用 JSONP 方式, 没有 JSONP 参数时生成 JSON, 有 JSONP 参数则生成 JSONP
                    // 例如: http://a.com/a => 接口输出 JSON
                    //       http://a.com/a?callback=a => 接口输出 JSONP
                    response.jsonp(mockResponse);
                };
            })(mock);
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

// 将 API 进行分组排列
function groupApiByModuleName(mockConfig) {
    // clone mockConfig
    var _mockConfig = JSON.parse(JSON.stringify(mockConfig));

    var apiMockConifg = _mockConfig.api;
    for (var routeKey in apiMockConifg) {
        var mock = apiMockConifg[routeKey];
        // 分组了就不需要原来的属性了
        delete apiMockConifg[routeKey];

        var moduleName = '';
        if (mock.info && mock.info.module) {
            moduleName = mock.info.module;
        }
        if (!apiMockConifg[moduleName]) {
            apiMockConifg[moduleName] = {};
        }

        apiMockConifg[moduleName][routeKey] = mock;
    }

    return _mockConfig;
}

/**
 * 获取 puer mock route 的配置信息
 * 
 * @param mockJsFile {string} mock js file
 * @param mockConfigFile {string} mock server config file
 * @return mock route 的配置信息
 */
function puerMock(mockJsFile, mockConfigFile, renderApiDoc) {
    var _mockJsFile = mockJsFile || MOCK_JS_FILE;
    var _mockConfigFile = mockConfigFile || MOCK_CONFIG_FILE;

    // 监听 mockJsFile 是否改动了, 改动后修改 mockJsFile 的修改时间,
    // 以激发 puer 本身的监听, 让其重新加载 mockJsFile, 则会重新加载 mockConfigFile,
    // 达到刷新 mockConfigFile 的目的
    // 
    // 我们这里先监听文件再读取 JSON, 以防止出现 JSON 读取异常(例如格式错误)造成程序不重新加载的问题
    mockConfigFileWatcher = watchFile(_mockConfigFile, function() {
        mockConfigFileWatcher.close();
        fs.utimes(_mockJsFile, new Date(), new Date());
    });

    var mockConfig = getMockConfig(_mockConfigFile);
    var routeConfig = generateRouteConfig(mockConfig);
    var groupMockConfig = groupApiByModuleName(mockConfig);

    // 列出所有的 mock API 作为一个接口文档
    routeConfig['GET /_apidoc'] = function(request, response, next) {
        // _apidoc 也使用 CORS 方式来提供, 这样更加便于自定义 _apidoc 的 UI
        // 这样你可以将 _apidoc 也作为一个 API, 完全可以自己写一套 UI 来获取解析 _apidoc 提供的 JSON 数据
        response.set(CORS_HEADER);

        if (renderApiDoc) {
            response.send(renderApiDoc(groupMockConfig));
        } else {
            response.jsonp(groupMockConfig);
        }
    };

    return routeConfig;
}

module.exports = puerMock;