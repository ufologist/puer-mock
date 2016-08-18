# puer-mock

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/puer-mock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/puer-mock

[Puer](https://github.com/leeluolee/puer) + [Mock.js](https://github.com/nuysoft/Mock) = A Configurable mock server with configurable mock(random) data.

## install

Please install [puer](https://github.com/leeluolee/puer) first.

```
npm install puer-mock
```

## usage

1. Copy `node_modules/puer-mock/example` files to your project root directory
2. cd `your project root`
3. `puer -a _mockserver.js`

## config

You can config mock server in [`_mockserver.json`](https://github.com/ufologist/puer-mock/blob/master/example/_mockserver.json), mock server will auto reload when you changed `_mockserver.json`.

* comment is nice
* config route and mock response data template
* disable a route is convenient

## example

眼见为实耳听为虚, puer-mock 让你一秒钟就能拥有一个强大的 mock server, 所以请不要再自己手工做假数据了, 赶快尝试一下让你的工作效率翻番吧!

![puer-mock-example](https://ufologist.github.io/puer-mock/puer-mock-example.png)

## one more thing

谁需要这个工具
* 前端/APP端
* 任何与后端接口打交道的人
* [为什么你需要一个 mock server]()