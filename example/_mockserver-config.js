// 支持使用 js 文件来输出 mock 配置的内容
module.exports = {
    api: {
        'GET /mock/config/js': {
            response: {
                c: '@id'
            }
        }
    }
};