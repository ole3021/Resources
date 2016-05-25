var ObjectId = require('mongodb').ObjectID;
var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var getCurrentUser = helpers.getCurrentUser;

module.exports = function(req, res) {
  var user;
  if(req.session && req.session.user) {
    user = req.session.user;
  } else {
    error('You must be logged in in order to use this method.', res);
    return;
  }
  switch(req.method) {
    case 'POST':
      var formidable = require('formidable');
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, formData, files) {
        if(!formData.postId) {
          error('Please provide ID of a post.', res);
        } else {
          var done = function() {
            response({
              success: 'OK'
            }, res);
          };
          getDatabaseConnection(function(db) {
            getCurrentUser(function(user) {
              var collection = db.collection('content');
              collection
              .find({ _id: ObjectId(formData.postId) })
              .toArray(function(err, result) {
                if(result.length === 0) {
                  error('There is no post with that ID.', res);
                } else {
                  var post = result[0];
                  delete post._id;
                  post.via = post.userName;
                  post.userId = user ._id.toString();
                  post.userName = user.firstName + ' ' + user.lastName;
                  post.date = new Date();
                  post.taggedFriends = [];
                  collection.insert(post, done);
                }
              });
            }, req, res);
          });
        }
      });
    break;
  };
}