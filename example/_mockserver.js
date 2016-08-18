// _mockserver.js - 提供给 puer 来启动 mock server
// puer -a _mockserver.js
module.exports = require('puer-mock')();

// 如果你不想使用默认的 _mockserver.js 和 _mockserver.json 文件名, 可以传入自己使用的文件名
// 例如: puer -a _mockserver2.js
// module.exports = require('puer-mock')(__filename, './_mockserver2.json');