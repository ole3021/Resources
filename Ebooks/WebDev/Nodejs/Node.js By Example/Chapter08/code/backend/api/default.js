var helpers = require('./helpers');
var response = helpers.response;

module.exports = function(req, res) {
  response({
    success: true
  }, res);
};