var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var processPOSTRequest = helpers.processPOSTRequest;

module.exports = function(req, res) {
  if(req.session && req.session.user) {
    if(req.method === 'POST') {
      var friendId;
      var updateUserData = function(db, friendId) {
        var collection = db.collection('users');
        collection.update(
          { email: req.session.user.email },
          { $push: { friends: friendId } }, 
          done
        );
      };
      var done = function(err, result) {
        if(err) {
          error('Error updating the data.', res);
        } else {                
          response({
            success: 'OK'
          }, res);
        }
      };
      processPOSTRequest(req, function(data) {
        getDatabaseConnection(function(db) {
          updateUserData(db, data.id);
        });
      });
    } else {
      error('This method accepts only POST requests.', res);
    }
  } else {
    error('You must be logged in to use this method.', res);
  }
}