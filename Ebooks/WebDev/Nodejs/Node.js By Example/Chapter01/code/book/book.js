// exports.name = 'Node.js by example';
// exports.read = function() {
// 	console.log('I\'m reading ' + exports.name);
// }

var ratePoints = 0;
module.exports = function() {
	return {
		rate: function(points) {
			ratePoints = points;
		},
		getPoints: function() {
			return ratePoints;
		}
	}
}