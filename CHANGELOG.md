# CHANGELOG

* v1.2.0 2016-9-14

  特此中秋佳节之际, 发布新版本, 祝大家中秋节快乐.

  * [feat] 新增了对 request 请求的参数(即接口的输入)做验证
  * [feat] [新增了接口配置文档](https://github.com/ufologist/puer-mock/blob/master/_mockserver-config.md)
  * [feat] [新增了接口配置文档的 JSON schema](https://github.com/ufologist/puer-mock/blob/master/_mockserver-schema.json)
  * [feat] 新增了很多的配置示例, [现在配置了 32 个用作示例的接口]((https://github.com/ufologist/puer-mock/blob/master/example/_mockserver.json))
  * [feat] [新增了测试用例](https://github.com/ufologist/puer-mock/tree/master/test)
  * [feat] 重构代码, 拆分为 `puer-mock.js` `route-config.js` `validate-request.js` `util.js`
  * [fix] #1 mockConfigFileWatcher.close is not a function

* v1.1.1 2016-8-31

  * [fix] 修改 `example/_apidoc.html` 根据配置信息生成更好的接口文档

* v1.1.0 2016-8-31

  * [feat] `/_apidoc` 也做为一个接口来提供(使用 CORS 方式), 这样更加便于自定义 `_apidoc` 的 UI. 完全支持自己写一套 UI 来获取解析 `/_apidoc` 提供的 JSON 数据来展现接口文档. 提供了默认的 `example/_apidoc.html` 做为新的接口文档

    ![puer-mock-api-doc-html](https://ufologist.github.io/puer-mock/puer-mock-api-doc-html.png)

* v1.0.1 2016-8-22

  * [fix] 先监听文件再读取 mock server 的 JSON 配置, 以防止出现 JSON 读取异常(例如格式错误)造成程序不再重新加载的问题

* v1.0.0 2016-8-19

  第一个正式版本