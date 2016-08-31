# CHANGELOG

* v1.1.0 2016-8-31

  * [feat] `/_apidoc` 也做为一个接口来提供(使用 CORS 方式), 这样更加便于自定义 `_apidoc` 的 UI. 完全支持自己写一套 UI 来获取解析 `/_apidoc` 提供的 JSON 数据来展现接口文档. 提供了默认的 `example/_apidoc.html` 做为新的接口文档

    ![puer-mock-api-doc-html](https://ufologist.github.io/puer-mock/puer-mock-api-doc-html.png)

* v1.0.1 2016-8-22

  * [fix]先监听文件再读取 mock server 的 JSON 配置, 以防止出现 JSON 读取异常(例如格式错误)造成程序不再重新加载的问题

* v1.0.0 2016-8-19

  第一个正式版本