var ObjectId = require('mongodb').ObjectID;
var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var getCurrentUser = helpers.getCurrentUser;

module.exports = function(req, res) {
  if(req.session && req.session.user) {
    getCurrentUser(function(user) {
      if(!user.friends || user.friends.length === 0) {
        return response({ friends: [] }, res);
      }
      user.friends.forEach(function(value, index, arr) {
        arr[index] = ObjectId(value);
      });
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.find({ 
          _id: { $in: user.friends }
        }).toArray(function(err, result) {
          result.forEach(function(value, index, arr) {
            arr[index].id = value._id;
            delete arr[index].password;
            delete arr[index].friends;
            delete arr[index].email;
            delete arr[index]._id;
          });
          response({
            friends: result
          }, res);
        });
      });
    }, req, res);
  } else {
    error('You must be logged in to use this method.', res);
  }
}