describe('配置 proxy', function() {
    it('GET /api/configdemo-proxy/object', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/configdemo-proxy/object',
        }).then(function(result) {
            expect(result.login).toBe('ufologist');
            done();
        });
    });

    it('GET /users/:username', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/users/ufologist',
        }).then(function(result) {
            expect(result.login).toBe('ufologist');
            done();
        });
    });
});