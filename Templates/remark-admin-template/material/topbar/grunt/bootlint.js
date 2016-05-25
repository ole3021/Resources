module.exports = function () {
  "use strict";

  return {
    options: {
      relaxerror: ['E006', 'E017', 'E018', 'E019', 'E020'],
      showallerrors: false,
      stoponerror: false,
      stoponwarning: false
    },
    src: '<%= config.html %>/**/*.html'
  };
};
