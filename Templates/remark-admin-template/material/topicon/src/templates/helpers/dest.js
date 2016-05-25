(function() {
  module.exports.register = function(Handlebars) {
    var path = require('path');
    var config = require('../../../config.json');

    Handlebars.registerHelper("dest", function(context, options) {
      var file = options.data.root.file;
      var relative = path.relative(path.relative(file.cwd, path.dirname(file.path)), config.templates.pages);

      return new Handlebars.SafeString(path.join(relative, context));
    });
  };
}).call(this);
