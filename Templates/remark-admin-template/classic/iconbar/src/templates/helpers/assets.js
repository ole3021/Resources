(function() {
  module.exports.register = function(Handlebars) {
    var path = require('path');
    var config = require('../../../config.json');

    Handlebars.registerHelper("assets", function(options) {
      var file = options.data.root.file;
      var relative = path.relative(config.templates.pages, path.relative(file.cwd, path.dirname(file.path)));
      var currentPath = path.join(config.html, relative);

      return new Handlebars.SafeString(path.relative(currentPath, config.assets));
    });
  };
}).call(this);
