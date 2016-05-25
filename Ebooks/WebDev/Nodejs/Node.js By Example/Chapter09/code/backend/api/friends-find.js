var ObjectId = require('mongodb').ObjectID;
var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var processPOSTRequest = helpers.processPOSTRequest;
var validEmail = helpers.validEmail;
var getCurrentUser = helpers.getCurrentUser;

module.exports = function(req, res) {
  if(req.session && req.session.user) {
    if(req.method === 'POST') {
      var findFriends = function(db, searchFor, currentFriends) {
        var collection = db.collection('users');
        var regExp = new RegExp(searchFor, 'gi');
        var excludeEmails = [req.session.user.email];
        currentFriends.forEach(function(value, index, arr) {
          arr[index] = ObjectId(value);
        });
        collection.find({
          $and: [
            {
              $or: [
                { firstName: regExp },
                { lastName: regExp }
              ]
            },
            { email: { $nin: excludeEmails } },
            { _id: { $nin: currentFriends } }
          ]
        }).toArray(function(err, result) {
          var foundFriends = [];
          for(var i=0; i<result.length; i++) {
            foundFriends.push({
              id: result[i]._id,
              firstName: result[i].firstName,
              lastName: result[i].lastName
            });
          };
          response({
            friends: foundFriends
          }, res);
        });
      }
      processPOSTRequest(req, function(data) {
        getDatabaseConnection(function(db) {
          getCurrentUser(function(user) {
            findFriends(db, data.searchFor, user.friends || []);
          }, req, res);          
        });
      });
    } else {
      error('This method accepts only POST requests.', res);
    }
  } else {
    error('You must be logged in to use this method.', res);
  }
}