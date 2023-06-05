/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../index');

// eslint-disable-next-line no-undef
describe('GET /', function() {
    it('returns list of countries', function(done) {
    
    request(app)
    .get('/')
    .expect(200, done);
    });
    });


    describe('GET /setmeeting', function() {
        it('returns possible meetings', function(done) {
        
        request(app)
        .get('/?input=[{"from":"2023-09-10T09:00:00.0+01:00","to":"2023-09-10T17:00:00.0+01:00","CC":"ng"},{"from":"2023-09-10T09:00:00.0+08:00", "to":"2023-09-10T17:00:00.0+08:00", "CC":"SG"}]')
        .expect(200, done);
        });
        });