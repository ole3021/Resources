var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/styles');

module.exports = function (done) {
  del(config.destination.css + '/**/*.css', { force: true })
    .then(function () { done(); });
};
