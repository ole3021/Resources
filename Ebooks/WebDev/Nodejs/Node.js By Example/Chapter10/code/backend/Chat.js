var helpers = require('./api/helpers');
var getCurrentUserBySessionObj = helpers.getCurrentUserBySessionObj;
var getRandomColor = helpers.getRandomColor;
var cookie = require('cookie');

var decode = function(string) {
  var body = new Buffer(string, 'base64').toString('utf8');
  return JSON.parse(body);
};

var users = {};
var broadcastMessage = function(userProfile, message) {
  var user = users[userProfile._id.toString()];
  var userName = userProfile.firstName + ' ' + userProfile.lastName;
  if(user && user.friends && user.friends.length > 0) {
    user.socket.emit('server-talking', {
      text: message,
      user: userName,
      color: user.color
    });
    for(var i=0; i<user.friends.length; i++) {
      var friend = users[user.friends[i]];
      if(friend && friend.socket) {
        friend.socket.emit('server-talking', { 
          text: message,
          user: userName,
          color: user.color
        });
      }
    }
  }
};

module.exports = function(app) {
  var io = require('socket.io')(app);
  io.on('connection', function (socket) {
    var sessionData = cookie.parse(socket.request.headers.cookie);
    sessionData = decode(sessionData['express:sess']);
    if(sessionData && sessionData.user) {
      getCurrentUserBySessionObj(function(err, user) {
        var userId = user._id.toString();
        users[userId] = {
          socket: socket,
          friends: user.friends,
          color: getRandomColor()
        };
        socket.on('client-talking', function (data) {
          broadcastMessage(user, data.text);
        });
        socket.on('disconnect', function() {
          users[userId] = null;
        });
      }, sessionData);
    }

  });
}