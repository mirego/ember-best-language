/* eslint-env node */

'use strict';

const getURLFor = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getURLFor('release'),
    getURLFor('beta'),
    getURLFor('canary')
  ]).then(urls => {
    return {
      useYarn: true,
      scenarios: [
        {
          name: 'ember-lts-3.4-without-fastboot',
          command:
            'ember test --filter "when running inside FastBoot" --invert',
          npm: {
            dependencies: {
              'ember-source': '^3.4.0',
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-lts-3.8-without-fastboot',
          command:
            'ember test --filter "when running inside FastBoot" --invert',
          npm: {
            dependencies: {
              'ember-source': '^3.8.0',
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-release-without-fastboot',
          command:
            'ember test --filter "when running inside FastBoot" --invert',
          npm: {
            dependencies: {
              'ember-source': urls[0],
              'ember-cli-fastboot': null
            }
          }
        },
        {
          name: 'ember-beta-without-fastboot',
          command:
            'ember test --filter "when running inside FastBoot" --invert',
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
          name: 'ember-lts-3.4-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': '^3.4.0'
            }
          }
        },
        {
          name: 'ember-lts-3.8-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': '^3.8.0'
            }
          }
        },
        {
          name: 'ember-release-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': urls[0]
            }
          }
        },
        {
          name: 'ember-beta-with-fastboot',
          npm: {
            dependencies: {
              'ember-source': urls[1]
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
