var ContentModel = require('../models/Content');
module.exports = Ractive.extend({
  template: require('../../tpl/home'),
  components: {
    navigation: require('../views/Navigation'),
    appfooter: require('../views/Footer')
  },
  data: {
    posting: true
  },
  onrender: function() {
    if(userModel.isLogged()) {
      var model = new ContentModel();
      var self = this;
this.on('post', function() {
  var files = this.find('input[type="file"]').files;
  var formData = new FormData();
  if(files.length > 0) {
    var file = files[0];
    if(file.type.match('image.*')) {
      formData.append('files', file, file.name);
    }
  }
  formData.append('text', this.get('text'));
  model.create(formData, function(error, result) {
    self.set('text', '');
    if(error) {
      self.set('error', error.error);
    } else {
      self.set('error', false);
      self.set('success', 'The post is saved successfully.<br />What about adding another one?');
      getPosts();
    }
  });
});

      var getPosts = function() {
        model.fetch(function(err, result) {
          if(!err) {
            self.set('posts', result.posts);
          }
        });
      };

      getPosts();
    } else {
      this.set('posting', false);
    }
  }
});