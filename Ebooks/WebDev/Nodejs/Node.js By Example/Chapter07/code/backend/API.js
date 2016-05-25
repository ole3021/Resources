var sha1 = require('sha1');
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

var response = function(result, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result) + '\n');
};
var error = function(message, res) {
  res.writeHead(500, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: message}) + '\n');
};

var MongoClient = require('mongodb').MongoClient;
var database;
var getDatabaseConnection = function(callback) {
  if(database) {
    callback(database);
    return;
  } else {
    MongoClient.connect('mongodb://127.0.0.1:27017/nodejs-by-example', function(err, db) {
      if(err) {
        throw err;
      };
      database = db;
      callback(database);
    });
  }
};

var querystring = require('querystring');
var processPOSTRequest = function(req, callback) {
  var body = '';
  req.on('data', function (data) {
    body += data.toString();
  });
  req.on('end', function () {
    callback(querystring.parse(body));
  });
};
var validEmail = function(value) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};
var getCurrentUser = function(callback, req, res) {
  getDatabaseConnection(function(db) {
    var collection = db.collection('users');
    collection.find({ 
      email: req.session.user.email
    }).toArray(function(err, result) {
      if(result.length === 0) {
        error('No such user', res);
      } else {
        callback(result[0]);
      }
    });
  });
};

var Router = require('../frontend/js/lib/router')();
Router
.add('api/version', function(req, res) {
  response({
    version: '0.2'
  }, res);
})
.add('api/user/login', function(req, res) {
  processPOSTRequest(req, function(data) {
    if(!data.email || data.email === '' || !validEmail(data.email)) {
      error('Invalid or missing email.', res);
    } else if(!data.password || data.password === '') {
      error('Please fill your password.', res);
    } else {
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.find({ 
          email: data.email,
          password: sha1(data.password)
        }).toArray(function(err, result) {
          if(result.length === 0) {
            error('Wrong email or password', res);
          } else {
            var user = result[0];
            delete user.password;
            delete user._id;
            req.session.user = user;
            response({
              success: 'OK',
              user: user
            }, res);
          }
        });
      });
    }
  });
})
.add('api/user/logout', function(req, res) {
  delete req.session.user;
  response({
    success: 'OK'
  }, res);
})
.add('api/user', function(req, res) {
  switch(req.method) {
    case 'GET':
      if(req.session && req.session.user) {
        response(req.session.user, res);
      } else {
        response({}, res);
      }
    break;
    case 'PUT':
      processPOSTRequest(req, function(data) {
        if(!data.firstName || data.firstName === '') {
          error('Please fill your first name.', res);
        } else if(!data.lastName || data.lastName === '') {
          error('Please fill your last name.', res);
        } else {
          getDatabaseConnection(function(db) {
            var collection = db.collection('users');
            if(data.password) {
              data.password = sha1(data.password);
            }
            collection.update(
              { email: req.session.user.email },
              { $set: data }, 
              function(err, result) {
                if(err) {
                  err('Error updating the data.');
                } else {
                  if(data.password) delete data.password;
                  for(var key in data) {
                    req.session.user[key] = data[key];
                  }
                  response({
                    success: 'OK'
                  }, res);
                }
              }
            );
          });
        }
      });
    break;
    case 'POST':
      processPOSTRequest(req, function(data) {
        if(!data.firstName || data.firstName === '') {
          error('Please fill your first name.', res);
        } else if(!data.lastName || data.lastName === '') {
          error('Please fill your last name.', res);
        } else if(!data.email || data.email === '' || !validEmail(data.email)) {
          error('Invalid or missing email.', res);
        } else if(!data.password || data.password === '') {
          error('Please fill your password.', res);
        } else {
          getDatabaseConnection(function(db) {
            var collection = db.collection('users');
            data.password = sha1(data.password);
            collection.insert(data, function(err, docs) {
              response({
                success: 'OK'
              }, res);
            });
          });
        }
      });
    break;
    case 'DELETE':
      getDatabaseConnection(function(db) {
        var collection = db.collection('users');
        collection.remove(
          { email: req.session.user.email },
          function(err, docs) {
            delete req.session.user;
            response({
              success: 'OK'
            }, res);
          }
        );
      });
    break;
  };
})
.add('api/friends/find', function(req, res) {
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
})
.add('api/friends/add', function(req, res) {
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
})
.add('api/friends', function(req, res) {
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
            arr[index].id = value.id;
            delete arr[index].password;
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
})
.add('api/content', function(req, res) {
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
              userId: { $in: [user._id.toString()].concat(user.friends) }
            },
            $orderby: {
              date: -1
            }
          }).toArray(function(err, result) {
            result.forEach(function(value, index, arr) {
              arr[index].id = ObjectId(value.id);
              delete arr[index].userId;
            });
            response({
              posts: result
            }, res);
          });
        });
      }, req, res);
    break;
    case 'POST':
      var uploadDir = __dirname + '/../static/uploads/';
      var formidable = require('formidable');
      var form = new formidable.IncomingForm();
      form.multiples = true;
      form.parse(req, function(err, data, files) {
        if(!data.text || data.text === '') {
          error('Please add some text.', res);
        } else {
          var processFiles = function(userId, callback) {
            if(files.files) {
              var fileName = userId + '_' + files.files.name;
              var filePath = uploadDir + fileName;
              fs.rename(files.files.path, filePath, function(err) {
                if(err) throw err;
                callback(fileName);
              });
            } else {
              callback();
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
})
.add(function(req, res) {
  response({
    success: true
  }, res);
});

module.exports = function(req, res) {
  Router.check(req.url, [req, res]);
}