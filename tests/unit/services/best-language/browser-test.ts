import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import type BrowserAdapter from 'ember-best-language/services/best-language/browser';

module('Unit | Service | best-language/browser', hooks => {
  setupTest(hooks);

  module('with different language and languages properties', hooks => {
    hooks.before(() => {
      Object.defineProperty(window.navigator, 'languages', {
        configurable: true,
        value: ['fr', 'en-US', 'en'],
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

    module('fetchLanguages', () => {
      test('should prioritize the languages property from the different properties on `navigator`', function (assert) {
        const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

        const expectedLanguages = [
          {language: 'fr', score: 1},
          {language: 'en-US', score: 0.9},
          {language: 'en', score: 0.8},
        ];

        assert.deepEqual(service.fetchLanguages(), expectedLanguages);
      });
    });
  });

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

    module('fetchLanguages', () => {
      test('should fetch the languages from the different properties on `navigator`', function (assert) {
        const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

        const expectedLanguages = [
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.9},
          {language: 'fr', score: 0.8},
        ];

        assert.deepEqual(service.fetchLanguages(), expectedLanguages);
      });
    });

    module('computeScore', () => {
      module('with an array of less than 10 languages', () => {
        const languagesLength = 3;

        test('should return `1` for the first item', function (assert) {
          const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

          assert.equal(service.computeScore(0, languagesLength), 1);
        });

        test('should compute a score, between 1 and 0, for each languages. Each having 0.1 difference.', function (assert) {
          const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

          assert.equal(service.computeScore(0, languagesLength), 1);
          assert.equal(service.computeScore(1, languagesLength), 0.9);
          assert.equal(service.computeScore(2, languagesLength), 0.8);
        });
      });

      module('with an array of more than 10 languages', () => {
        const languagesLength = 15;

        test('should return `1` for the first item', function (assert) {
          const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

          assert.equal(service.computeScore(0, languagesLength), 1);
        });

        test('should compute a score, between 1 and 0, for each languages, with 2 digits precision', function (assert) {
          const service = this.owner.lookup('service:best-language/browser') as BrowserAdapter;

          assert.equal(service.computeScore(0, languagesLength), 1);
          assert.equal(service.computeScore(1, languagesLength), 0.93);
          assert.equal(service.computeScore(2, languagesLength), 0.87);
          assert.equal(service.computeScore(13, languagesLength), 0.13);
          assert.equal(service.computeScore(14, languagesLength), 0.07);
          assert.equal(service.computeScore(15, languagesLength), 0);
        });
      });
    });
  });
});
