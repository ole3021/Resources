module.exports = function () {
  "use strict";

  return {
    options: {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'collapse',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u', 'textarea', 'code', 'pre'],
      'preserve_newlines': true,
      'max_preserve_newlines': 2,
      'indent_handlebars': false
    },
    html: {
      expand: true,
      cwd: '<%= config.html %>',
      src: ['**/*.html'],
      dest: '<%= config.html %>'
    }
  };
};
