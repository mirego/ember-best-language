import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import Service from '@ember/service';
import type FastBootAdapter from 'ember-best-language/services/best-language/fastboot';

module('Unit | Service | best-language/fastboot', hooks => {
  setupTest(hooks);

  module('when accept-language header is sent', hooks => {
    hooks.beforeEach(function () {
      class FastbootStub extends Service {
        isFastBoot = true;
        request = {
          headers: new Headers({
            'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6',
          }),
        };
      }

      this.owner.register('service:fastboot', FastbootStub);
    });

    module('fetchHeaderLanguages', () => {
      test('should fetch the languages from the `Accept-Language` header', function (assert) {
        const service = this.owner.lookup('service:best-language/fastboot') as FastBootAdapter;

        const expectedLanguages = [
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.8},
          {language: 'fr', score: 0.6},
        ];

        assert.deepEqual(service.fetchLanguages(), expectedLanguages);
      });
    });
  });

  module('when accept-language header is missing', hooks => {
    class FastbootStub extends Service {
      isFastBoot = true;
      request = {
        headers: new Headers(),
      };
    }

    hooks.beforeEach(function () {
      this.owner.register('service:fastboot', FastbootStub);
    });

    module('fetchHeaderLanguages', () => {
      test('should fetch an empty string from the `Accept-Language` header', function (assert) {
        const service = this.owner.lookup('service:best-language/fastboot') as FastBootAdapter;

        const expectedLanguages = [{language: '', score: 1}];

        assert.deepEqual(service.fetchLanguages(), expectedLanguages);
      });
    });
  });
});
