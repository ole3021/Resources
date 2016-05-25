(function() {
  module.exports.register = function(Handlebars) {
    var path = require('path');
    var config = require('../../../config.json');

    Handlebars.registerHelper("active", function(url, options) {
      var file = options.data.root.file;
      var current = path.relative(config.templates.pages, path.relative(file.cwd, file.path));

      if ((current != null ? current.indexOf(url) : void 0) === 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  };
}).call(this);
