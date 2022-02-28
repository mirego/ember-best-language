'use strict';

const getURLFor = require('ember-source-channel-url');
const {embroiderSafe, embroiderOptimized} = require('@embroider/test-setup');

module.exports = async () => {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-3.12-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': '~3.12.0',
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-lts-3.16-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': '~3.16.0',
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-lts-3.20-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': '~3.20.0',
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-lts-3.24-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': '~3.24.0',
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-lts-3.28-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': '~3.28.0',
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-release-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': await getURLFor('release'),
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-beta-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          dependencies: {
            'ember-source': await getURLFor('beta'),
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-canary-without-fastboot',
        allowedToFail: true,
        npm: {
          dependencies: {
            'ember-source': await getURLFor('canary'),
            'ember-cli-fastboot': null,
          },
        },
      },
      {
        name: 'ember-lts-3.12-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': '~3.12.0',
          },
        },
      },
      {
        name: 'ember-lts-3.16-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': '~3.16.0',
          },
        },
      },
      {
        name: 'ember-lts-3.20-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': '~3.20.0',
          },
        },
      },
      {
        name: 'ember-lts-3.24-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': '~3.24.0',
          },
        },
      },
      {
        name: 'ember-lts-3.28-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-release-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': await getURLFor('release'),
          },
        },
      },
      {
        name: 'ember-beta-with-fastboot',
        npm: {
          dependencies: {
            'ember-source': await getURLFor('beta'),
          },
        },
      },
      {
        name: 'ember-canary-with-fastboot',
        allowedToFail: true,
        npm: {
          dependencies: {
            'ember-source': await getURLFor('canary'),
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
