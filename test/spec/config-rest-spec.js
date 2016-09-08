describe('配置 REST 接口', function() {
    it('POST /api/pet', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/pet',
        }).then(function(result) {
            expect(result.name).toBe('POST /api/pet');
            done();
        });
    });

    it('DELETE /api/pet/:id', function(done) {
        $.ajax({
            type: 'DELETE',
            url: API_ROOT + '/api/pet/1',
        }).then(function(result) {
            expect(result.route).toBe('DELETE /api/pet/:id');
            done();
        });
    });

    it('POST /api/pet/:id/delete', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/pet/1/delete',
        }).then(function(result) {
            expect(result.route).toBe('POST /api/pet/:id/delete');
            done();
        });
    });

    it('PUT /api/pet/:id', function(done) {
        $.ajax({
            type: 'PUT',
            url: API_ROOT + '/api/pet/1',
        }).then(function(result) {
            expect(result.name).toBe('PUT /api/pet/:id');
            done();
        });
    });

    it('POST /api/pet/:id/update', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/pet/1/update',
        }).then(function(result) {
            expect(result.name).toBe('POST /api/pet/:id/update');
            done();
        });
    });

    it('GET /api/pet/:id', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/pet/1',
        }).then(function(result) {
            expect(result.name).toBe('GET /api/pet/:id');
            done();
        });
    });

    it('GET /api/pets/findByStatus', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/pets/findByStatus',
        }).then(function(result) {
            expect(result.pet.length).toBeTruthy();
            done();
        });
    });

    it('POST /api/pet/:id', function(done) {
        $.ajax({
            type: 'POST',
            url: API_ROOT + '/api/pet/1',
        }).then(function(result) {
            expect(result.name).toBe('POST /api/pet/:id');
            done();
        });
    });

    it('POST /api/pet/:id/uploadImage', function(done) {
        var formData = new FormData();
        formData.append('name', 'doggie');
        formData.append('file', '图片文件');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_ROOT + '/api/pet/1/uploadImage');
        xhr.onload = function() {
            expect(JSON.parse(xhr.responseText).route).toBe('POST /api/pet/:id/uploadImage');
            done();
        };
        xhr.send(formData);
    });

    it('GET /api/page/index', function(done) {
        $.ajax({
            type: 'GET',
            url: API_ROOT + '/api/page/index',
        }).then(function(result) {
            expect(result.route).toBe('GET /api/page/index');
            done();
        });
    });

    describe('GET /api/queryUser', function() {
        it('required querystring', function(done) {
            $.ajax({
                type: 'GET',
                url: API_ROOT + '/api/queryUser',
            }).then(null, function(jqxhr) {
                expect(jqxhr.status).toBe(400);
                expect(jqxhr.responseJSON).toEqual({
                    status: 400,
                    statusInfo: [{
                        querystring: 'act',
                        required: true,
                        type: 'string'
                    }]
                });
                done();
            });
        });
        it('has querystring', function(done) {
            $.ajax({
                type: 'GET',
                url: API_ROOT + '/api/queryUser',
                data: {
                    act: 'queryUser'
                }
            }).then(function(result) {
                expect(result.route).toBe('GET /api/queryUser');
                done();
            });
        });
    });
});