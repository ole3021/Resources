var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/scripts');

module.exports = function (done) {
  del(config.destination.js, { force: true })
    .then(function () { done(); });
};
