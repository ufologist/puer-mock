describe('配置 disabled', function() {
    it('GET /api/disabled', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/disabled',
        }).then(null, function(jqxhr) {
            expect(jqxhr.status).toBe(404);
            done();
        });
    });
});