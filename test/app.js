const request = require('supertest');
const app = require('../src/index.js');

describe('GET /', () => {
	it('should return 302 "Found" (authenticate with Shopify)', done => {
		request(app)
			.get('/')
			.expect(302, done);
	});
});

describe('GET /shopify/install', () => {
	it('should return 200 OK', done => {
		request(app)
			.get('/shopify/install')
			.expect(200, done);
	});
});

describe('GET /random-url', () => {
	it('should return 404', done => {
		request(app)
			.get('/reset')
			.expect(404, done);
	});
});
