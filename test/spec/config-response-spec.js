describe('配置 response', function() {
    it('GET /api/configdemo-response/data', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-response/data',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/configdemo-response/data');
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