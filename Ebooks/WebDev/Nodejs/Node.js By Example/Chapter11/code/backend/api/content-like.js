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
              var userName = user.firstName + ' ' + user.lastName;
              collection.update(
                {
                  $and: [
                    { _id: ObjectId(formData.postId) },
                    { "likes.user": { $nin: [userName] } }
                  ]
                },
                { 
                  $push: { 
                    likes: { user: userName }
                  }
                },
                {w:1}, 
                function(err) {
                  done();
                }
              );
            }, req, res);
          });
        }
      });
    break;
  };
}