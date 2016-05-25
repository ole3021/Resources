var http = require('http');
var port = 9000;

var Assets = require('./backend/Assets');
var API = require('./backend/API');
var Default = require('./backend/Default');

var Router = require('./frontend/js/lib/router')();

Router
.add('static', Assets)
.add('api', API)
.add(Default)

var process = function(req, res) {
  Router.check(req.url, [req, res]);
}

var app = http.createServer(process).listen(port, '127.0.0.1');
console.log("Listening on 127.0.0.1:" + port);

