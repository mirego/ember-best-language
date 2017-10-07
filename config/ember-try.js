/* eslint-env node */

module.exports = function() {
  return {
    command: 'ember test',
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          devDependencies: {
            'ember-source': 'lts',
            'ember-cli-fastboot': null
          }
        }
      },
      {
        name: 'ember-latest-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          devDependencies: {
            'ember-source': 'latest',
            'ember-cli-fastboot': null
          }
        }
      },
      {
        name: 'ember-beta-without-fastboot',
        command: 'ember test --filter "when running inside FastBoot" --invert',
        npm: {
          devDependencies: {
            'ember-source': 'beta',
            'ember-cli-fastboot': null
          }
        }
      },
      {
        name: 'ember-lts-with-fastboot',
        npm: {
          devDependencies: {
            'ember-source': 'lts'
          }
        }
      },
      {
        name: 'ember-latest-with-fastboot',

        npm: {
          devDependencies: {
            'ember-source': 'latest'
          }
        }
      },
      {
        name: 'ember-beta-with-fastboot',
        npm: {
          devDependencies: {
            'ember-source': 'beta'
          }
        }
      }
    ]
  };
};
