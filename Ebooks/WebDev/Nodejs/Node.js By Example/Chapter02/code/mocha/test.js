var assert = require('assert');

describe('Testing JSON reader', function() {
	it('should get json', function(done) {
		var reader = require('./JSONReader');
		assert.equal(typeof reader, 'object');
		assert.equal(typeof reader.read, 'function');
		done();
	});
});