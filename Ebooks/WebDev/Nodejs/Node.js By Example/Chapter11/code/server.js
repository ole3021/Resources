var http = require('http');
var session = require('cookie-session');
var port = 9000;

var Assets = require('./backend/Assets');
var API = require('./backend/API');
var Default = require('./backend/Default');
var Chat = require('./backend/Chat');

var Router = require('./frontend/js/lib/router')();

Router
.add('static', Assets)
.add('node_modules', Assets)
.add('tests', Assets)
.add('api', API)
.add(Default);

var checkSession = function(req, res) {
  session({
    keys: ['nodejs-by-example']
  })(req, res, function() {
    process(req, res);
  });
}

var process = function(req, res) {
  Router.check(req.url, [req, res]);
}

var app = http.createServer(checkSession).listen(port, '127.0.0.1');
console.log("Listening on 127.0.0.1:" + port);

Chat(app);