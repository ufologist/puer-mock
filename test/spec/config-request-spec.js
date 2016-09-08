describe('配置 request', function() {
    it('GET /api/configdemo/:id', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo/1',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/configdemo/:id');
            done();
        });
    });

    it('GET /api/configdemo/:id/request', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo/1/request',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/configdemo/:id/request');
            done();
        });
    });

    it('GET /api/configdemo-request/querystring', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-request/querystring',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/configdemo-request/querystring');
            done();
        });
    });

    it('POST /api/configdemo-request/urlencoded', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/configdemo-request/urlencoded',
        }).then(function(result) {
            expect(result.route).toBe('POST /api/configdemo-request/urlencoded');
            done();
        });
    });

    it('POST /api/configdemo-request/json', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/configdemo-request/json',
            contentType: 'application/json',
            data: JSON.stringify({})
        }).then(function(result) {
            expect(result.route).toBe('POST /api/configdemo-request/json');
            done();
        });
    });

    it('POST /api/configdemo-request/formdata', function(done) {
        var formData = new FormData();
        formData.append('formdata1', '1');
        formData.append('formdata2', 1);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_ROOT + '/api/configdemo-request/formdata');
        xhr.onload = function() {
            expect(JSON.parse(xhr.responseText).route).toBe('POST /api/configdemo-request/formdata');
            done();
        };
        xhr.send(formData);
    });

    it('POST /api/configdemo-request/datatype', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/configdemo-request/datatype'
        }).then(function(result) {
            expect(result.route).toBe('POST /api/configdemo-request/datatype');
            done();
        });
    });

    describe('POST /api/configdemo-request/required', function() {
        var querystring = null;
        var body = null;

        beforeEach(function() {
            querystring = {
                querystring1: '1',
                querystring2: 1,
                querystring3: true,
                querystring4: {p: 1}
            };
            body = {
                formurlencoded1: '1',
                formurlencoded2: 1,
                formurlencoded3: true,
                formurlencoded4: {p: 1}
            };
        });

        it('required', function(done) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(JSON.parse(xhr.responseText).route).toBe('POST /api/configdemo-request/required');
                done();
            };
            xhr.send($.param(body));
        });

        it('header', function(done) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        header: 'Content-Type',
                        required: true,
                        type: 'string'
                    }]
                });
                done();
            };
            xhr.send();
        });

        it('querystring datatype string', function(done) {
            querystring.querystring1 = '';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '',
                        querystring: 'querystring1',
                        required: true,
                        type: 'string'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('querystring datatype number', function(done) {
            querystring.querystring2 = 'a';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: 'a',
                        querystring: 'querystring2',
                        required: true,
                        type: 'number'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('querystring datatype boolean', function(done) {
            querystring.querystring3 = '1';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '1',
                        querystring: 'querystring3',
                        required: true,
                        type: 'boolean'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('querystring datatype object', function(done) {
            querystring.querystring4 = '1';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '1',
                        querystring: 'querystring4',
                        required: true,
                        type: 'object'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });

        it('formurlencoded datatype string', function(done) {
            body.formurlencoded1 = '';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '',
                        body: 'formurlencoded1',
                        required: true,
                        type: 'string'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('formurlencoded datatype number', function(done) {
            body.formurlencoded2 = 'a';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: 'a',
                        body: 'formurlencoded2',
                        required: true,
                        type: 'number'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('formurlencoded datatype boolean', function(done) {
            body.formurlencoded3 = '1';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '1',
                        body: 'formurlencoded3',
                        required: true,
                        type: 'boolean'
                    }]
                });
                done();
            };
            xhr.send($.param(body));
        });
        it('formurlencoded datatype object', function(done) {
            // XXX 暂不支持验证 formurlencoded objefct 类型
            body.formurlencoded4 = '1';

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required?' + $.param(querystring));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                expect(JSON.parse(xhr.responseText).route).toBe('POST /api/configdemo-request/required');
                done();
            };
            xhr.send($.param(body));
        });
    });

    describe('POST /api/configdemo-request/required-formdata', function() {
        it('required', function(done) {
            var formData = new FormData();
            formData.append('formdata1', '1');
            formData.append('formdata2', 1);
            formData.append('formdata3', true);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required-formdata');
            xhr.onload = function() {
                expect(JSON.parse(xhr.responseText).route).toBe('POST /api/configdemo-request/required-formdata');
                done();
            };
            xhr.send(formData);
        });

        it('datatype number', function(done) {
            var formData = new FormData();
            formData.append('formdata1', '1');
            formData.append('formdata2', 'a');
            formData.append('formdata3', true);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required-formdata');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: 'a',
                        body: 'formdata2',
                        required: true,
                        type: 'number'
                    }]
                });
                done();
            };
            xhr.send(formData);
        });
        it('datatype boolean', function(done) {
            var formData = new FormData();
            formData.append('formdata1', '1');
            formData.append('formdata2', 1);
            formData.append('formdata3', '1');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', API_ROOT + '/api/configdemo-request/required-formdata');
            xhr.onload = function() {
                expect(xhr.status).toBe(400);
                expect(JSON.parse(xhr.responseText)).toEqual({
                    status: 400,
                    statusInfo: [{
                        factValue: '1',
                        body: 'formdata3',
                        required: true,
                        type: 'boolean'
                    }]
                });
                done();
            };
            xhr.send(formData);
        });
    });

    it('POST /api/configdemo-request/required-json', function(done) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_ROOT + '/api/configdemo-request/required-json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            expect(JSON.parse(xhr.responseText).route).toBe('POST /api/configdemo-request/required-json');
            done();
        };
        xhr.send(JSON.stringify({}));
    });

    it('GET /api/configdemo-request/pagination', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-request/pagination'
        }).then(function(result) {
            expect(result.data.pagination).toBeTruthy();
            expect(result.data.foo.length).toBeTruthy();
            done();
        });
    });
});