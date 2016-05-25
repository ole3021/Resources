var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/vendor');

module.exports = function (done) {
  del(config.destination.vendor + '/*/*.css', { force: true })
    .then(function () { done(); });
};
