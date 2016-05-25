var Friends = require('../models/Friends');

module.exports = Ractive.extend({
  template: require('../../tpl/find-friends'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    loading: false,
    message: '',
    searchFor: '',
    foundFriends: null
  },
  onrender: function() {

    var model = new Friends();
    var self = this;

    this.on('find', function(e) {
      self.set('loading', true);
      self.set('message', '');
      var searchFor = this.get('friendName');
      model.find(searchFor, function(err, res) {
        self.set('loading', false);
        if(res.friends && res.friends.length > 0) {
          self.set('foundFriends', res.friends);
        } else {
          self.set('foundFriends', null);
          self.set('message', 'Sorry, there is no friends matching <strong>' + searchFor + '<strong>');
        }
      });
    });
    this.on('add', function(e, id) {
      this.set('loading', true);
      model.add(id, function(err, res) {
        self.set('loading', false);
        self.set('foundFriends', null);
        if(err) {
          self.set('message', 'Operation failed.');
        } else if(res.success === 'OK') {
          self.set('message', 'Operation successful.');
        }
      });
    });

  }
});