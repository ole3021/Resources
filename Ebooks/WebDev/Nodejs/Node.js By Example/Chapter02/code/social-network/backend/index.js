var http = require('http'),
	fs = require('fs'),
	files = {},
	port = 8888,
	debug = true;

var Responder = function(res) {
	var api = {}, files = {};
	api.file = function(filepath) {
		var file;
		if(!files[filepath] || debug) {
			try {
				file = files[filepath] = {
					content: fs.readFileSync(__dirname + "/../" + filepath),
					ext: filepath.split(".").pop().toLowerCase()
				}
			} catch(err) {
				res.writeHead(404, {'Content-Type': 'plain/text'});
				res.end('Missing resource: ' + file);
				return;
			}
		} else {
			file = files[filepath];
		}
		var contentType;
		switch(file.ext) {
			case "css": contentType = "text/css"; break;
			case "html": contentType = "text/html"; break;
			case "js": contentType = "application/javascript"; break;
			case "ico": contentType = "image/ico"; break;
			default: contentType = "text/plain";
		}
		res.writeHead(200, {'Content-Type': contentType});
		res.end(file.content);
	}
	return api;
}

var processPOSTRequest = function(req, callback) {
	var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        callback(JSON.parse(body));
    });
}
var respondJSON = function(json, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(json));	
}
var app = http.createServer(function (req, res) {
	console.log('Request: ' + req.url);
	if(req.url.indexOf('/static') === 0) {
		Responder(res).file(req.url.replace('/static/', 'frontend/build/'));
	} else {
		Responder(res).file('backend/templates/main.html');
	}
}).listen(port, '127.0.0.1');
console.log("Listening on 127.0.0.1:" + port);