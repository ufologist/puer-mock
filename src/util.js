var fs = require('fs');

/**
 * 支持跨域的 header 设置
 */
var CORS_HEADER = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
    'Access-Control-Allow-Credentials': 'true'
};

/**
 * 借用 jQuery.isEmptyObject
 */
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

/**
 * 借用 puer 中的 watchFile 函数
 * 
 * 注意 fs.watch 和 fs.watchFile 的区别
 * fs.watch 监听操作系统提供的各种"事件"实现的, 返回 fs.FSWatcher 可用于后续的关闭 watch, 例如 FSWatcher.close
 * fs.watchFile 原理是轮询, 没有返回值, 要关闭 watchFile, 需要使用 fs.unwatchFile
 * 
 * [fs.watchFile 和 fs.watch 的区别](https://cnodejs.org/topic/51341be4df9e9fcc58efc3af)
 */
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
 * 根据情况 unwatchFile
 */
function unwatchFile(watcher, filename) {
    if (watcher) {
        watcher.close && watcher.close();
    } else {
        fs.unwatchFile(filename);
    }
}

/**
 * 将 mock 配置按照 module 进行分组
 */
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
    unwatchFile: unwatchFile,
    groupApiByModuleName: groupApiByModuleName
};