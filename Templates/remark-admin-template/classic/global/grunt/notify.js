module.exports = function () {
  "use strict";

  return {
    options: {
      enabled: true,
      duration: 2
    },
    js: {
      options: {
        message: 'JS Generated!'
      }
    },
    css: {
      options: {
        message: 'CSS Generated!'
      }
    },
    fonts: {
      options: {
        message: 'Fonts Generated!'
      }
    },
    vendor: {
      options: {
        message: 'Vendor Generated!'
      }
    },
    all: {
      options: {
        message: 'All Generated!'
      }
    }
  };
};
