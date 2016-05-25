var ObjectId = require('mongodb').ObjectID;
var helpers = require('./helpers');
var response = helpers.response;
var error = helpers.error;
var getDatabaseConnection = helpers.getDatabaseConnection;
var getCurrentUser = helpers.getCurrentUser;

module.exports = function(req, res, params) {
  var user;
  if(req.session && req.session.user) {
    user = req.session.user;
  } else {
    error('You must be logged in in order to use this method.', res);
    return;
  }
  switch(req.method) {
    case 'GET':
      getDatabaseConnection(function(db) {
        var query = params && params.id ? { _id: ObjectId(params.id) } : {};
        var collection = db.collection('pages');
        var getPageItems = function(pageId, callback) {
          var collection = db.collection('content');
          collection.find({ 
            $query: {
              pageId: pageId
            },
            $orderby: {
              date: -1
            }
          }).toArray(function(err, result) {
            var comments = [];
            var events = [];
            result.forEach(function(value, index, arr) {
              delete value.userId;
              delete value._id;
              if(value.eventDate) {
                events.push(value);
              } else {
                comments.push(value);                
              }
            });
            events.sort(function(a, b) {
              return a.eventDate > b.eventDate;
            });
            callback(comments, events);
          });
        }
        collection.find({ 
          $query: query,
          $orderby: {
            date: -1
          }
        }).toArray(function(err, result) {
          result.forEach(function(value, index, arr) {
            arr[index].id = value._id;
            delete arr[index]._id;
            delete arr[index].userId;
          });
          if(params.id && result.length > 0) {
            getPageItems(params.id, function(comments, events) {
              result[0].comments = comments;
              result[0].events = events;
              response({
                pages: result
              }, res);
            });
          } else {
            response({
              pages: result
            }, res);
          }
        });
      });
    break;
    case 'POST':
      var formidable = require('formidable');
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, formData, files) {
        var data = {
          title: formData.title,
          description: formData.description
        };
        if(!data.title || data.title === '') {
          error('Please add some title.', res);
        } else if(!data.description || data.description === '') {
          error('Please add some description.', res);
        } else {
          var done = function() {
            response({
              success: 'OK'
            }, res);
          }
          getDatabaseConnection(function(db) {
            getCurrentUser(function(user) {
              var collection = db.collection('pages');
              data.userId = user._id.toString();
              data.userName = user.firstName + ' ' + user.lastName;
              data.date = new Date();
              collection.insert(data, done);
            }, req, res);
          });
        }
      });
    break;
  };
}