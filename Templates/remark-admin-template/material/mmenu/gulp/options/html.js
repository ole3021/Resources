/**
 * Js
 * configuration
 * object
 *
 */
// config
var config = require('../../config.json');

module.exports = {
  hb: {
    data: [
      config.templates.data + '/**/*.{js,json}'
    ],
    helpers: [
      './node_modules/handlebars-layouts/index.js',
      config.templates.helpers + '/*.js'
    ],
    partials: config.templates.partials + '/**/*.hbs',
    debug: false
  },
  bootlint: {
    relaxerror: ['E006', 'E017', 'E018', 'E019', 'E020'],
    showallerrors: false,
    stoponerror: false,
    stoponwarning: false
  },
  htmllint: {
    ignore: [
      'Attribute "autocomplete" not allowed on element "button" at this point.',
      'Attribute "autocomplete" not allowed on element "input" at this point.',
      'Element "img" is missing required attribute "src".'
    ]
  },
  prettify: {
    'indent_inner_html': false,
    'indent_size': 2,
    'indent_char': ' ',
    'wrap_line_length': 78,
    'brace_style': 'collapse',
    'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u', 'textarea', 'code', 'pre'],
    'preserve_newlines': true,
    'max_preserve_newlines': 2,
    'indent_handlebars': false
  }
};
