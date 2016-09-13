var fs = require('fs');

var CORS_HEADER = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
    'Access-Control-Allow-Credentials': 'true'
};

// jQuery.isEmptyObject
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
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

module.exports = {
    CORS_HEADER: CORS_HEADER,
    isEmptyObject: isEmptyObject,
    watchFile: watchFile,
    groupApiByModuleName: groupApiByModuleName
};