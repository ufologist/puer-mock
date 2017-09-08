var fs = require('fs');

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

module.exports = {
    watchFile: watchFile,
    unwatchFile: unwatchFile
};