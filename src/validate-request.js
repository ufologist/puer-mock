var qs = require('querystring');

var util = require('./util');

// 对 request 请求的参数(即输入)做验证
// 在接口配置中配置期望的值, 然后验证 request 中是否包含这些期望的值
// 例如看 querystring 是否具有某个参数等等
function validateRequest(request, response, mockRequest, onValid) {
    // 因为 puer 没有提供使用 express middleware 的机制, 不能用 body-parser 只好自己解析出 body 内容了
    // 由于是异步的, 只好将所有的验证逻辑都放在 end 事件中了
    request._rawBody = '';
    request.on('data', function(chunk) {
        request._rawBody += chunk;
    });
    request.on('end', function() {
        var requestValues = getRequestValues(request, mockRequest);
        var errors = validateDataType(requestValues);
        if (errors.length > 0) {
            response.set(util.CORS_HEADER)
                    .status(400)
                    .jsonp({
                        status: 400,
                        statusInfo: errors
                    }).end();
        } else { // 验证通过时正常返回接口数据
            onValid();
        }
    });
}

// 获取待验证的期望值和实际值
// {
//     querystring: {
//         "参数名": {
//             expectedValue: "期望值",
//             factValue: "实际值"
//         }
//     },
//     header: {},
//     body: {}
// }
function getRequestValues(request, mockRequestConfig) {
    var querystring = mockRequestConfig ? mockRequestConfig.querystring : {};
    var header = mockRequestConfig ? mockRequestConfig.header : {};
    var body = mockRequestConfig ? mockRequestConfig.body : {};

    var requestValues = {
        querystring: {},
        header: {},
        body: {}
    };

    // 验证请求接口时是否包含特定的 querystring 参数
    if (querystring) {
        for (var expectedName in querystring) {
            // 只验证必传参数
            // 必传参数的规则是在名字的前或后加一个星号(*)作为标识, 从表单必填项获得的灵感
            // 先找出所有的必选参数, 最后一起做验证
            if (expectedName.indexOf('*') != -1) {
                // 去除用作必要参数的标识
                var _expectedName = expectedName.replace(/\*/g, '');
                var expectedValue = querystring[expectedName];
                var factValue = request.query[_expectedName];

                requestValues.querystring[_expectedName] = {
                    expectedValue: expectedValue,
                    factValue: factValue
                };
            }
        }
    }

    // 验证请求接口时是否包含特定的 header
    if (header) {
        for (var expectedName in header) {
            if (expectedName.indexOf('*') != -1) {
                var _expectedName = expectedName.replace(/\*/g, '');
                var expectedValue = header[expectedName];
                var factValue = request.get(_expectedName);

                requestValues.header[_expectedName] = {
                    expectedValue: expectedValue,
                    factValue: factValue ? decodeURIComponent(factValue) : factValue
                };
            }
        }
    }

    // 验证请求接口时是否包含特定的 body 数据
    if (body) {
        // request's "Content-Type" HTTP header field matches the MIME type
        // http://expressjs.com/en/4x/api.html#req.is
        if (request.is('application/x-www-form-urlencoded')) {
            // XXX nodejs 自带的 querystring 无法解析嵌套的对象
            // 例如: querystring 是 a%5Bb%5D%3D1, 解析出来为 {'a[b]': 1}
            // 但是我们想要的是 {a:{b:1}}
            var urlencoded = qs.parse(request._rawBody);

            for (var expectedName in body) {
                if (expectedName.indexOf('*') != -1) {
                    var _expectedName = expectedName.replace(/\*/g, '');
                    var expectedValue = body[expectedName];
                    var factValue = urlencoded[_expectedName];

                    requestValues.body[_expectedName] = {
                        expectedValue: expectedValue,
                        factValue: factValue
                    };
                }
            }
        } else if (request.is('multipart/form-data')) {
            // multipart/form-data 一般用得比较少, 简单的使用正则表达式来解析
            var multipartRegExp = /Content-Disposition:\s*form-data;\s*name\s*=\s*"(\S+)"\s+(\S+)/mg;

            var multipartFormData = {};
            var result = null;
            while ((result = multipartRegExp.exec(request._rawBody)) != null) {
                // 从表单数据中匹配出字段名和字段值
                var fieldName = result[1];
                var fieldValue = result[2];
                multipartFormData[fieldName] = fieldValue;
            }

            for (var expectedName in body) {
                if (expectedName.indexOf('*') != -1) {
                    var _expectedName = expectedName.replace(/\*/g, '');
                    var expectedValue = body[expectedName];
                    var factValue = multipartFormData[_expectedName];

                    requestValues.body[_expectedName] = {
                        expectedValue: expectedValue,
                        factValue: factValue
                    };
                }
            }
        } else if (request.is('json')) {
            var factValue = null;
            try {
                factValue = JSON.parse(decodeURIComponent(request._rawBody));
            } catch (e) {
                factValue = request._rawBody;
                console.warn('body json parse error', e);
            }

            // 在 body 中放置 raw 数据时, 不是 key-value 键值对形式的数据
            // 因此使用 Content-Type MIME 作为 key 来标记
            // 但是不验证里面具体的数据类型, 只验证其是否是 object 类型
            requestValues.body[request.get('Content-Type')] = {
                expectedValue: body,
                factValue: factValue
            };
        } else {
            // 针对其他的 MIME 类似数据不做验证, 都认为他们是字符串
            // 希望扩展的人可以扩展验证规则
            if (!util.isEmptyObject(body)) {
                requestValues.body[request.get('Content-Type')] = {
                    expectedValue: body.toString(),
                    _expectedValue: body,
                    factValue: request._rawBody + ' ' // 不管你有没有传 body, 都伪造了一个非空的值
                };
            }
        }
    }

    return requestValues;
}

// 验证数据类型
function validateDataType(requestValues) {
    // [{
    //     required: true,
    //     type: "string", // string number boolean object
    //     factValue: "实际值",
    //     querystring: "参数名" // header, body
    // }]
    var errors = [];

    for (var paramType in requestValues) {
        var param = requestValues[paramType];

        for (var expectedName in param) {
            var assertion = param[expectedName];
            var expectedValue = assertion.expectedValue;
            var factValue = assertion.factValue;

            var error = null;

            if (typeof expectedValue == 'string') {
                if (!factValue) { // 当参数期望为字符串值时, 只需要判断是否有值即可
                    error = {
                        required: true,
                        type: 'string',
                        factValue: factValue
                    };
                    error[paramType] = expectedName;
                }
            } else if (typeof expectedValue == 'number') {
                if (!Number(factValue)) {
                    error = {
                        required: true,
                        type: 'number',
                        factValue: factValue 
                    };
                    error[paramType] = expectedName;
                }
            } else if (typeof expectedValue == 'boolean') {
                var _factValue = factValue ? factValue.toLowerCase() : factValue;
                if (_factValue != 'true' && _factValue != 'false') {
                    error = {
                        required: true,
                        type: 'boolean',
                        factValue: factValue 
                    };
                    error[paramType] = expectedName;
                }
            } else if (typeof expectedValue == 'object') {
                if (typeof factValue != 'object') {
                    error = {
                        required: true,
                        type: 'object',
                        factValue: factValue 
                    };
                    error[paramType] = expectedName;
                }
            }

            if (error) {
                errors.push(error);
            }
        }
    }

    return errors;
}

module.exports = validateRequest;