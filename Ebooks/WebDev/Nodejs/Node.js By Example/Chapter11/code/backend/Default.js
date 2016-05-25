var fs = require('fs');
var url = require('url');

var html = fs.readFileSync(__dirname + '/tpl/page.html').toString('utf8');
var htmlWithTests = fs.readFileSync(__dirname + '/tpl/pageTest.html').toString('utf8');

module.exports = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var urlParts = url.parse(req.url, true);
  var parameters = urlParts.query;
  if(typeof parameters.test !== 'undefined') {
    res.end(htmlWithTests + '\n');
  } else {
    res.end(html + '\n');
  }
}