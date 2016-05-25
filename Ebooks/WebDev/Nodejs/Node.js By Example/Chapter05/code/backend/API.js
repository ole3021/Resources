var sha1 = require('sha1');

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
    body += data;
  });
  req.on('end', function () {
    callback(querystring.parse(body));
  });
};
var validEmail = function(value) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

var Router = require('../frontend/js/lib/router')();
Router
.add('api/version', function(req, res) {
  response({
    version: '0.1'
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
.add(function(req, res) {
  response({
    success: true
  }, res);
});

module.exports = function(req, res) {
  Router.check(req.url, [req, res]);
}