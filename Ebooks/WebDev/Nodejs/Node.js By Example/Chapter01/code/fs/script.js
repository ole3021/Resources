var fs = require('fs');
// fs.writeFile('data.txt', 'Hello world!', function (err) {
// 	if(err) throw err;
// 	console.log('It\'s saved!');
// });

fs.readFile('data.txt', function(err, data) {
	if (err) throw err;
	console.log(data.toString());
});