import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import Service from '@ember/service';
import BestLanguage from 'ember-best-language/services/best-language';

module('Unit | Service | best-language', hooks => {
  setupTest(hooks);

  module('when running inside FastBoot', () => {
    module('and accept-language header is sent', hooks => {
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

      module('bestLanguage', () => {
        test('should return the best language when one matches', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en', 'es'];

          assert.deepEqual(service.bestLanguage(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en',
            score: 1,
          });
        });

        test('should return the exact match when provided with languages with country codes', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          assert.deepEqual(service.bestLanguage(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en-US',
            score: 1,
          });
        });

        test('should return the closest match when provided with languages with country codes', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'fr'];

          const result = service.bestLanguage(supportedLanguages);

          assert.deepEqual(result, {
            baseLanguage: 'en',
            language: 'en-CA',
            score: 1,
          });
        });

        test('should return `null` when none match', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de', 'es'];

          assert.equal(service.bestLanguage(supportedLanguages), null);
        });
      });

      module('bestLanguageOrFirst', () => {
        test('should return the best language when one matches', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en', 'es'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'en',
            baseLanguage: 'en',
            score: 1,
          });
        });

        test('should return the exact match when provided with languages with country codes', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en-US',
            score: 1,
          });
        });

        test('should return the closest match when provided with languages with country codes', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'fr'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en-CA',
            score: 1,
          });
        });

        test('should return the first supported language when none match', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de-DE', 'es'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'de-DE',
            baseLanguage: 'de',
            score: 0,
          });
        });
      });
    });

    module('and accept-language header is missing', hooks => {
      class FastbootStub extends Service {
        isFastBoot = true;
        request = {
          headers: new Headers(),
        };
      }

      hooks.beforeEach(function () {
        this.owner.register('service:fastboot', FastbootStub);
      });

      module('bestLanguage', () => {
        test('should return `null`', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de', 'es'];

          assert.equal(service.bestLanguage(supportedLanguages), null);
        });
      });

      module('bestLanguageOrFirst', () => {
        test('should return the first supported language', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de', 'es'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'de',
            baseLanguage: 'de',
            score: 0,
          });
        });
      });
    });
  });

  module('when running inside the browser', () => {
    module('with default language and languages properties', hooks => {
      hooks.before(() => {
        Object.defineProperty(window.navigator, 'languages', {
          configurable: true,
          value: ['en-US', 'en', 'fr'],
        });
        Object.defineProperty(window.navigator, 'language', {
          configurable: true,
          value: 'en-US',
        });
        Object.defineProperty(window.navigator, 'userLanguage', {
          configurable: true,
          value: undefined,
        });
      });

      module('bestLanguage', () => {
        test('should return the best language when one matches', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en', 'es'];

          assert.deepEqual(service.bestLanguage(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en',
            score: 1,
          });
        });

        test('should handle supported languages with country code', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          assert.deepEqual(service.bestLanguage(supportedLanguages), {
            baseLanguage: 'en',
            language: 'en-US',
            score: 1,
          });
        });

        test('should return `null` when none match', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de', 'es'];

          assert.equal(service.bestLanguage(supportedLanguages), null);
        });
      });

      module('bestLanguageOrFirst', () => {
        test('should return the best language when one matches', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en', 'es'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'en',
            baseLanguage: 'en',
            score: 1,
          });
        });

        test('should handle supported languages with country code', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'en-US',
            baseLanguage: 'en',
            score: 1,
          });
        });

        test('should return the first supported language when none match', function (assert) {
          const service = this.owner.lookup('service:best-language') as BestLanguage;

          const supportedLanguages = ['de-DE', 'es'];

          assert.deepEqual(service.bestLanguageOrFirst(supportedLanguages), {
            language: 'de-DE',
            baseLanguage: 'de',
            score: 0,
          });
        });
      });
    });
  });
});
