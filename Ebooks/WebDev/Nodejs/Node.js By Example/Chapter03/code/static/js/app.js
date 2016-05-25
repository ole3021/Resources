(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {};
},{}],2:[function(require,module,exports){
module.exports=require(1)
},{}],3:[function(require,module,exports){
var A = require('./A');
var B = require('./B');

var template = require('../tpl/A/template');
},{"../tpl/A/template":4,"./A":1,"./B":2}],4:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"aside","f":[{"t":7,"e":"h3","f":["Hello ",{"t":2,"r":"name"}]}]}]}
},{}]},{},[3])