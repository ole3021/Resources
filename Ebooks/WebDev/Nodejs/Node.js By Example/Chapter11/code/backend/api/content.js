var ObjectId = require('mongodb').ObjectID;
var helpers = require('./helpers');
var fs = require('fs');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var processPOSTRequest = helpers.processPOSTRequest;
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
    case 'GET':
      getCurrentUser(function(user) {
        if(!user.friends) {
          user.friends = [];
        }
        getDatabaseConnection(function(db) {
          var collection = db.collection('content');
          collection.find({ 
            $query: {
              userId: { $in: [user._id.toString()].concat(user.friends) },
              pageId: { $exists: false }
            },
            $orderby: {
              date: -1
            }
          }).toArray(function(err, result) {
            var getFriendsProfiles = function(db, ids, callback) {
              if(ids && ids.length > 0) {
                var collection = db.collection('users');
                ids.forEach(function(value, index, arr) {
                  arr[index] = ObjectId(value);
                });
                collection.find({ 
                  _id: { $in: ids }
                }).toArray(function(err, friends) {
                  var result = [];
                  friends.forEach(function(friend) {
                    result.push(friend.firstName + ' ' + friend.lastName);
                  });
                  callback(result);
                });  
              } else {
                callback([]);
              }
            }
            var numberOfPosts = result.length;
            var friendsFetched = function() {
              numberOfPosts -= 1;
              if(numberOfPosts === 0) {
                response({
                  posts: result
                }, res);
              }
            }
            result.forEach(function(value, index, arr) {
              arr[index].id = ObjectId(value._id);
              arr[index].ownPost = user._id.toString() === ObjectId(arr[index].userId).toString();
              arr[index].numberOfLikes = arr[index].likes ? arr[index].likes.length : 0;
              delete arr[index].userId;
              delete arr[index]._id;
              getFriendsProfiles(db, arr[index].taggedFriends, function(friends) {
                arr[index].taggedFriends = friends;
                friendsFetched();
              });
            });
          });
        });
      }, req, res);
    break;
    case 'POST':
      var uploadDir = __dirname + '/../static/uploads/';
      var formidable = require('formidable');
      var form = new formidable.IncomingForm();
      form.multiples = true;
      form.parse(req, function(err, formData, files) {
        var data = {
          text: formData.text
        };
        if(formData.pageId) {
          data.pageId = formData.pageId;
        }
        if(formData.eventDate) {
          data.eventDate = formData.eventDate;
        }
        if(formData.taggedFriends) {
          data.taggedFriends = JSON.parse(formData.taggedFriends);
        }
        if(!data.text || data.text === '') {
          error('Please add some text.', res);
        } else {
          var processFiles = function(userId, cb) {
            if(files.files) {
              var fileName = userId + '_' + files.files.name;
              var filePath = uploadDir + fileName;
              fs.rename(files.files.path, filePath, function() {
                cb(fileName);
              });
            } else {
              cb();
            }
          };
          var done = function() {
            response({
              success: 'OK'
            }, res);
          }
          getDatabaseConnection(function(db) {
            getCurrentUser(function(user) {
              var collection = db.collection('content');
              data.userId = user._id.toString();
              data.userName = user.firstName + ' ' + user.lastName;
              data.date = new Date();
              processFiles(user._id, function(file) {
                if(file) {
                  data.file = file;
                }
                collection.insert(data, done);
              });
            }, req, res);
          });
        }
      });
    break;
  };
}