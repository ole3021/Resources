var helpers = require('./helpers');
var response = helpers.response;

module.exports = function(req, res) {
  delete req.session.user;
  response({
    success: 'OK'
  }, res);
}