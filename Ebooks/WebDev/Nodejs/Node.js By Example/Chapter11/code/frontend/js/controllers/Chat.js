module.exports = Ractive.extend({
  template: require('../../tpl/chat'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    messages: [],
    output: '',
    socketConnected: false,
    socket: null
  },
  onconstruct: function() {
    this.data.messages = ['Loading. Please wait.'];
  },
  onrender: function() {    

    var self = this;
    var socket = io('http://localhost:9000');

    var onConnect = function() {
      self.push('messages', 'Connected!');
      self.set('socketConnected', true);
      self.find('input[type="text"]').focus();
    }
    var send = function() {
      socket.emit('client-talking', { text: self.get('text')});
      self.set('text', '');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', function() {
      self.set('socketConnected', false);
      self.push('messages', 'Disconnected!');
    });
    socket.on('server-talking', function(data) {
      var message = '<span style="color:' + data.color + '">';
      message += data.user + ': ' + data.text;
      message += '</span>';
      self.push('messages', message);
    });

    this.on('send', send);
    this.observe('messages', this.updateOutput);
    
    if(socket.connected) {
      onConnect();
    }

    this.find('form').addEventListener('keypress', function(e) {
      if(e.keyCode === 13 && e.target.nodeName === 'INPUT') {
        e.preventDefault();
        send();
      }
    });

  },
  updateOutput: function() {
    this.set('output', this.get('messages').join('<br />'));
    var outputEl = this.find('[data-component="output"]');
    outputEl.scrollTop = outputEl.scrollHeight;
  }
});