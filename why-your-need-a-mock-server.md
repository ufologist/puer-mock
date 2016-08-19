# 为什么你需要一个 mock server

## 前后端分离之后

前后端分离后, 大家从此进入了所谓的并行开发时代. 一旦完成前后端的(边界)分工, 大家就可以各司其职了.
前端在与后端交互时, 要想有效地提高工作效率, 后端的接口文档就是重中之重了.

## 接口文档还不够

所谓的接口文档, 即一份数据的契约书. 前端的所有逻辑和展现全部依赖接口文档中规定的数据结构.

但是光有接口文档不足以提升前端的开发效率, 因为前端开发时, 必须调用实实在在的接口和数据, 才能看到结果, 尽早跑通所有的前端流程, 这才是效率的根本.

在前后端并行开发的时代, 前端开发时, 后端也才开发, 接口没有开发完, 后端拿什么给前端调用.
那么问题来了, 我们怎么做一份能够调用的接口文档呢?

## 假数据时代

前端不可以傻傻地等后端接口开发完, 才开始做前端的逻辑, 因此我们习惯了做假的接口数据, 让前端工作可以顺利地进行下去.

那么我们都尝试过哪些手段来做假数据呢?
* 原始的静态数据文件

  例如将 mock-data.json 放在项目的根目录, 直接通过 ajax 调用即可.

* 使用 puer 或类似工具提供的 [mock 功能](https://github.com/leeluolee/puer#mock-request)

  需要一个 route.js, 在里面实现接口来提供假数据

  > [**mock请求**](http://leeluolee.github.io/2014/10/24/use-puer-helpus-developer-frontend/#进阶1_mock请求)
  >
  > 假设你的静态页面开发到一定程度，需要与服务器端交互了，而后台服务还完全无法联调，这其实是属于最简单的前后端分离开发的场景。一般而言， 作者会通过以下几种方案。
  > 
  > * 层级1: 通过代码解耦，直接在前端mock数据
  >
  >   这种方式影响较大，而且无论你解耦的如何，都会增加最终上真实环境的切换成本。
  > * 层级2: 通过fiddler等调试代理工具mock数据
  >
  >   优点是到正式环境的切换成本小，但配置成本较大，也接口mock也有局限性并基本上只能是静态数据模拟。
  > * 层级3：利用puer无痛的解决这个问题
  >
  >   puer提供了叫插件(addon)的功能，集成了express的route.js来达到最简的路由配置，可以提供基于真实http请求与相应的动态的mock数据。

**这些方法的弊端很明显了, 用过的都知道, 就是缺乏灵活性, 假数据还不够假, 不方便做随机的输出.**

* 静态数据文件就不用说了, 文件里面就几条死的数据, 肯定做不到随机变化. 假如前端需要看 100 条数据的结果呢? 你是复制粘帖 100 次吗?
* 依靠 puer 可以加入随机因素, 但随机机制还得自己去实现, 不够方便

那么我们使用前端的 Mock 库来实现随机的数据机制, 不就 OK 了吗?
于是我尝试了 [Mock.js](https://github.com/nuysoft/Mock "生成随机数据，拦截 Ajax 请求"), 在前端解决前端的假数据问题.

```html
<script src="http://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
<script src="http://rawgit.com/nuysoft/Mock/refactoring/dist/mock-min.js"></script>
<script>
// 拦截 ajax 请求输出假数据, 相当于定义了一个假的接口
Mock.mock('/api/users', {
    'users|1-10': [{
        'id|+1': 1
    }]
});

$.ajax({
    url: '/api/users',
    success: function(result) {
        console.log(result);
    }
});
</script>
```

因为 Mock.js 可以拦截前端的 ajax 请求, 因此我只要在开发时按照接口文档给出的接口和数据, 让 Mock.js 去拦截接口提供随机的假数据即可, 例如实现一个开发时用的 `mock-api.js`.

```html
<script src="http://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
<script src="http://rawgit.com/nuysoft/Mock/refactoring/dist/mock-min.js"></script>
<script src="mock-api.js"></script>
<script>
// 前端的业务逻辑正常开展, 完全无感知
$.ajax({
    url: '/api/users',
    success: function(result) {
        console.log(result);
    }
});
</script>
```

当后端接口开发完成后, 去掉 `mock-api.js`, 即可切换到后端接口, 前端代码不需要做任何修改.

## mock server 才是未来

在前端使用 Mock.js 是可以造出一个"假的接口", 还可以配置出随机数据, 但毕竟不是真正的后端接口, 还需要在前端引用一段定义假接口的代码(例如 `mock-api.js`), 势必会造成管理上的问题. 想一想如果有 20, 30 个页面都要引用了 `mock-api.js`, 后端接口完成后, 你又需要将 `mock-api.js` 从这些页面中去掉, 是不是觉得有点累赘了.

看来是时候自己写一个 mock server 来提供假接口假数据了, 做出像模像样的后端假接口.

基于上面的那些实践, 突然就有了灵感, puer + mockjs 怎么样? puer 来提供 mock 机制, Mock.js 来提供随机数据, 于是 [puer-mock](https://github.com/ufologist/puer-mock) 就诞生了.

### puer-mock

> puer-mock = Puer + Mock.js = 一个简单易用 mock server, 为你提供可配置的接口和随机数据.

使用了 puer-mock 后, 你只需像这样配置接口

```json
{
    "api": {
        "GET /api/users": {
            "response": {}
        }
    }
}
```

然后查看结果, 调用这个接口

![puer-mock-example](https://ufologist.github.io/puer-mock/puer-mock-example.png)


puer-mock 还提供了内置的 API doc, 可以查看所有你定义的 API

![puer-mock-api-doc](https://ufologist.github.io/puer-mock/puer-mock-api-doc.png?v1)

puer-mock 有哪些特点
* 简单配置即可定义 mock 接口, 不需要你写代码
* 配置接口及时生效, 修改即用
* 支持 JSONP 的方式调用接口
* 支持 CORS 的方式跨域调用
* 帮你输出一份接口文档, 方便在开发过程中沟通交流

**当然 [puer-mock](https://github.com/ufologist/puer-mock) 还不只有这些功能, 让你一秒钟就能拥有一个强大的 mock server, 所以请不要再自己手工做假数据了, 赶快尝试一下让你的工作效率翻番吧!**

## 接口管理平台

如果有一个统一的接口管理平台, 团队协作会更加的高效.

* [RAP](https://github.com/thx/RAP)

  > RAP通过GUI工具帮助WEB工程师更高效的管理接口文档，同时通过分析接口结构自动生成Mock数据、校验真实接口的正确性，使接口文档成为开发流程中的强依赖。有了结构化的API数据，RAP可以做的更多，而我们可以避免更多重复劳动。

* [AMP](https://github.com/gomeplusFED/AMP)

  > Api manage platform

* [Creating Help Pages for ASP.NET Web API](http://www.asp.net/web-api/overview/getting-started-with-aspnet-web-api/creating-api-help-pages)

  > When you create a web API, it is often useful to create a help page, so that other developers will know how to call your API. You could create all of the documentation manually, but it is better to autogenerate as much as possible. ASP.NET Web API provides a library for auto-generating help pages at run time. [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle) that uses ApiExplorer to generate [Swagger](http://swagger.io/) Docs.