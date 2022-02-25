'use strict';

module.exports = function (env) {
  if (env !== 'test') return {};

  return {
    APP: {
      autoboot: false,
    },
  };
};
