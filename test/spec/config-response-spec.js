describe('配置 response', function() {
    it('GET /api/configdemo-response/number', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/number',
        }).then(function(result) {
            expect(result).toBe(1);
            done();
        });
    });

    it('GET /api/configdemo-response/boolean', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/boolean',
        }).then(function(result) {
            expect(result).toBe(true);
            done();
        });
    });

    it('GET /api/configdemo-response/string', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/string',
        }).then(function(result) {
            expect(result).toBe('a');
            done();
        });
    });

    it('GET /api/configdemo-response/object', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/object',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/configdemo-response/object');
            done();
        });
    });

    it('GET /api/configdemo-response/array', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/array',
        }).then(function(result) {
            expect(result).toEqual([1, true, false, "a", {"a": 1}, [1, 2], null]);
            done();
        });
    });

    it('GET /api/configdemo-response/null', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/null',
        }).then(function(result) {
            expect(result).toBe(null);
            done();
        });
    });

    it('GET /api/configdemo-response/mock-simple', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/mock-simple',
        }).then(function(result) {
            expect(typeof result).toBe('string');
            done();
        });
    });

    it('GET /api/configdemo-response/mock', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/mock',
        }).then(function(result) {
            expect(result.data.foo.length).toBeTruthy();
            done();
        });
    });

    it('GET /api/fullconfig', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/fullconfig',
            data: {
                querystring1: '1'
            }
        }).then(function(result) {
            expect(result.users.length).toBeTruthy();
            done();
        });
    });

    it('GET /_apidoc', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/_apidoc',
        }).then(function(result) {
            expect(result.api).toBeTruthy();
            done();
        });
    });
});