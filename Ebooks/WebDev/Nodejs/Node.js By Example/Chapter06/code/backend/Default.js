var fs = require('fs');
var html = fs.readFileSync(__dirname + '/tpl/page.html').toString('utf8');
module.exports = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html + '\n');
}