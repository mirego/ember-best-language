'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const {maybeEmbroider} = require('@embroider/test-setup');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults);

  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
