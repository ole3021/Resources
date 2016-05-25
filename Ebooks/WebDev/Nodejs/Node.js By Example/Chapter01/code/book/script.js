// var book = require('./book.js');
// console.log('Name: ' + book.name);
// book.read();

var bookA = require('./book.js')();
var bookB = require('./book.js')();
bookA.rate(10);
bookB.rate(20);
console.log(bookA.getPoints(), bookB.getPoints());