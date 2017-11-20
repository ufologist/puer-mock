# 测试用例

运行测试的方法

* 在 `example` 目录安装 `puer-mock` 模块
* 将 `module.exports = require('puer-mock')(__filename, 'example/_mockserver.json');` 这句代码放到 `example/_mockserver.js` 中
* 在项目根目录下执行 `puer -a example/_mockserver.js`
* 访问 `http://localhost:8000/test/index.html`