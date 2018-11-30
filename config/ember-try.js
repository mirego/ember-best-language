/* eslint-env node */

'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([getChannelURL('release'), getChannelURL('beta'), getChannelURL('canary')]).then((urls) => {
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-2.18-without-fastboot',
          command: 'ember test --filter "when running inside FastBoot" --invert',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({'jquery-integration': true})
          },
          npm: {
            dependencies: {
              'ember-source': '~2.18.0',
              'ember-cli-fastboot': null,
              '@ember/jquery': '^0.5.1'
            }
          }
        },
        {
          name: 'ember-release-without-fastboot',
          command: 'ember test --filter "when running inside FastBoot" --invert',
          npm: {
            dependencies: {
              'ember-source': urls[0],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-beta-without-fastboot',
          command: 'ember test --filter "when running inside FastBoot" --invert',
          npm: {
            dependencies: {
              'ember-source': urls[1],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-canary-without-fastboot',
          allowedToFail: true,
          npm: {
            dependencies: {
              'ember-source': urls[2],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-lts-2.18-with-fastboot',
          env: {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({'jquery-integration': true})
          },
          npm: {
            dependencies: {
              'ember-source': '~2.18.0',
              '@ember/jquery': '^0.5.1'
            }
          }
        },
        {
          name: 'ember-release-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': urls[0],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-beta-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': urls[1],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-canary-with-fastboot',
          allowedToFail: true,
          npm: {
            dependencies: {
              'ember-source': urls[2]
            }
          }
        }
      ]
    };
  });
};
