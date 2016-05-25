var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/fonts');

module.exports = function (done) {
  del(config.destination.fonts + '/*/*.css', { force: true })
    .then(function () { done(); });
};
