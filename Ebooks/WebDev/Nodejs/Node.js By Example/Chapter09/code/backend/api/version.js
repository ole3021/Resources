var helpers = require('./helpers');
var response = helpers.response;
module.exports = function(req, res) {
  response({
    version: '0.2'
  }, res);
};