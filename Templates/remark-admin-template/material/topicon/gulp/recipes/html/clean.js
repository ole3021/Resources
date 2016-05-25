var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/html');

module.exports = function (done) {
  del(config.destination.html + '/*/*.css', { force: true })
    .then(function () { done(); });
};
