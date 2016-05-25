module.exports = function () {
  "use strict";

  return {
    options: {
      ignore: [
        'Attribute "autocomplete" not allowed on element "button" at this point.',
        'Attribute "autocomplete" not allowed on element "input" at this point.',
        'Element "img" is missing required attribute "src".'
      ]
    },
    src: '<%= config.html %>/**/*.html'
  };
};
