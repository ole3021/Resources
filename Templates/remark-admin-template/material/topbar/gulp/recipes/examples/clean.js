var del = require('del');

// config
var config = require('../../../config.json');

// options
var options = require('../../options/examples');

module.exports = function (done) {
  del([config.destination.examples +'/css/', config.destination.examples +'/js/'], { force: true })
    .then(function () { done(); });
};
