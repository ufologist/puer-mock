// _mockserver.js - 提供给 puer 来启动 mock server
// puer -a _mockserver.js
module.exports = require('puer-mock')();

// 如果你不想使用默认的 _mockserver.js 和 _mockserver.json 文件名(例如文件名冲突了)
// 可以传入自己使用的文件名
// 例如: puer -a _mockserver2.js
// module.exports = require('puer-mock')(__filename, './_mockserver2.json');

// 现在 _mockserver 的配置支持 js 文件了, 因此你可以
// module.exports = require('puer-mock')(__filename, './_mockserver-config.js');

// 如果你想自定义 /_apidoc 做出一份更加高大上的接口文档
// module.exports = require('puer-mock')(null, null, function(mockConfig) {
//     // 任你自由发挥
//     return '<pre>' + JSON.stringify(mockConfig, null, 4) + '</pre>';
// });

// 其实你完全可以这样来玩, 发挥你的想象力
// var puerMock = require('puer-mock');
// var routeConfig = puerMock();
// // 例如定义一个常用的 500 接口, 来测试服务器报错的情况
// routeConfig['GET /500'] = function(request, response, next) {
//     response.status(500).end();
// };
// module.exports = routeConfig;