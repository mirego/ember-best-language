import Service from '@ember/service';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';
import BestLanguage from 'ember-best-language/services/best-language';
import {before, beforeEach, describe, it} from 'mocha';

describe('Unit | Service | best-language', () => {
  setupTest();

  describe('when running inside FastBoot', () => {
    describe('and accept-language header is sent', () => {
      beforeEach(function() {
        class FastbootStub extends Service {
          isFastBoot = true;
          request = {
            headers: new Headers({
              'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6'
            })
          };
        }

        this.owner.register('service:fastboot', FastbootStub);
      });

      describe('fetchHeaderLanguages', () => {
        it('should fetch the languages from the `Accept-Language` header', function() {
          const service = this.owner.lookup('service:best-language');

          const expectedLanguages = [
            {baseLanguage: 'en', language: 'en-US', score: 1},
            {baseLanguage: 'en', language: 'en', score: 0.8},
            {baseLanguage: 'fr', language: 'fr', score: 0.6}
          ];

          expect(service.fetchHeaderLanguages()).to.deep.equal(
            expectedLanguages
          );
        });
      });

      describe('bestLanguage', () => {
        it('should return the best language when one matches', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en', 'es'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal({
            baseLanguage: 'en',
            language: 'en-US',
            score: 1
          });
        });

        it('should handle supported languages with country code', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal({
            baseLanguage: 'en',
            language: 'en-US',
            score: 1
          });
        });

        it('should return `null` when none match', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de', 'es'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal(null);
        });
      });

      describe('bestLanguageOrFirst', () => {
        it('should return the best language when one matches', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en', 'es'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'en-US', baseLanguage: 'en', score: 1}
          );
        });

        it('should handle supported languages with country code', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'en-US', baseLanguage: 'en', score: 1}
          );
        });

        it('should return the first supported language when none match', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de-DE', 'es'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'de-DE', baseLanguage: 'de', score: 0}
          );
        });
      });
    });

    describe('and accept-language header is missing', () => {
      class FastbootStub extends Service {
        isFastBoot = true;
        request = {
          headers: new Headers()
        };
      }

      beforeEach(function() {
        this.owner.register('service:fastboot', FastbootStub);
      });

      describe('fetchHeaderLanguages', () => {
        it('should fetch an empty string from the `Accept-Language` header', function() {
          const service = this.owner.lookup('service:best-language');

          const expectedLanguages = [
            {baseLanguage: '', language: '', score: 1}
          ];

          expect(service.fetchHeaderLanguages()).to.deep.equal(
            expectedLanguages
          );
        });
      });

      describe('bestLanguage', () => {
        it('should return `null`', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de', 'es'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal(null);
        });
      });

      describe('bestLanguageOrFirst', () => {
        it('should return the first supported language', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de', 'es'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'de', baseLanguage: 'de', score: 0}
          );
        });
      });
    });
  });

  describe('when running inside the browser', () => {
    describe('with different language and languages properties', () => {
      before(() => {
        Object.defineProperty(window.navigator, 'languages', {
          configurable: true,
          value: ['fr', 'en-US', 'en']
        });
        Object.defineProperty(window.navigator, 'language', {
          configurable: true,
          value: 'en-US'
        });
        Object.defineProperty(window.navigator, 'userLanguage', {
          configurable: true,
          value: undefined
        });
      });

      describe('fetchBrowserLanguages', () => {
        it('should prioritize the languages property from the different properties on `navigator`', function() {
          const service = this.owner.lookup('service:best-language');

          const expectedLanguages = [
            {baseLanguage: 'fr', language: 'fr', score: 1},
            {baseLanguage: 'en', language: 'en-US', score: 0.9},
            {baseLanguage: 'en', language: 'en', score: 0.8}
          ];

          expect(service.fetchBrowserLanguages()).to.deep.equal(
            expectedLanguages
          );
        });
      });
    });

    describe('with default language and languages properties', () => {
      before(() => {
        Object.defineProperty(window.navigator, 'languages', {
          configurable: true,
          value: ['en-US', 'en', 'fr']
        });
        Object.defineProperty(window.navigator, 'language', {
          configurable: true,
          value: 'en-US'
        });
        Object.defineProperty(window.navigator, 'userLanguage', {
          configurable: true,
          value: undefined
        });
      });

      describe('fetchBrowserLanguages', () => {
        it('should fetch the languages from the different properties on `navigator`', function() {
          const service = this.owner.lookup('service:best-language');

          const expectedLanguages = [
            {baseLanguage: 'en', language: 'en-US', score: 1},
            {baseLanguage: 'en', language: 'en', score: 0.9},
            {baseLanguage: 'fr', language: 'fr', score: 0.8}
          ];

          expect(service.fetchBrowserLanguages()).to.deep.equal(
            expectedLanguages
          );
        });
      });

      describe('computeScore', () => {
        describe('with an array of less than 10 languages', () => {
          const languagesLength = 3;

          it('should return `1` for the first item', function() {
            const service = this.owner.lookup('service:best-language');

            expect(service.computeScore(0, languagesLength)).to.equal(1);
          });

          it('should compute a score, between 1 and 0, for each languages. Each having 0.1 difference.', function() {
            const service = this.owner.lookup('service:best-language');

            expect(service.computeScore(0, languagesLength)).to.equal(1);
            expect(service.computeScore(1, languagesLength)).to.equal(0.9);
            expect(service.computeScore(2, languagesLength)).to.equal(0.8);
          });
        });

        describe('with an array of more than 10 languages', () => {
          const languagesLength = 15;

          it('should return `1` for the first item', function() {
            const service = this.owner.lookup('service:best-language');

            expect(service.computeScore(0, languagesLength)).to.equal(1);
          });

          it('should compute a score, between 1 and 0, for each languages, with 2 digits precision', function() {
            const service = this.owner.lookup('service:best-language');

            expect(service.computeScore(0, languagesLength)).to.equal(1);
            expect(service.computeScore(1, languagesLength)).to.equal(0.93);
            expect(service.computeScore(2, languagesLength)).to.equal(0.87);
            expect(service.computeScore(13, languagesLength)).to.equal(0.13);
            expect(service.computeScore(14, languagesLength)).to.equal(0.07);
            expect(service.computeScore(15, languagesLength)).to.equal(0);
          });
        });
      });

      describe('bestLanguage', () => {
        it('should return the best language when one matches', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en', 'es'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal({
            baseLanguage: 'en',
            language: 'en-US',
            score: 1
          });
        });

        it('should handle supported languages with country code', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal({
            baseLanguage: 'en',
            language: 'en-US',
            score: 1
          });
        });

        it('should return `null` when none match', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de', 'es'];

          expect(service.bestLanguage(supportedLanguages)).to.deep.equal(null);
        });
      });

      describe('bestLanguageOrFirst', () => {
        it('should return the best language when one matches', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en', 'es'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'en-US', baseLanguage: 'en', score: 1}
          );
        });

        it('should handle supported languages with country code', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['en-CA', 'en-US', 'fr'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'en-US', baseLanguage: 'en', score: 1}
          );
        });

        it('should return the first supported language when none match', function() {
          const service: BestLanguage = this.owner.lookup('service:best-language');

          const supportedLanguages = ['de-DE', 'es'];

          expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal(
            {language: 'de-DE', baseLanguage: 'de', score: 0}
          );
        });
      });
    });
  });

  describe('when running in either environment', () => {
    describe('sortLanguagesByScore', () => {
      it('should sort languages by score descending', function() {
        const service = this.owner.lookup('service:best-language');

        const inputLanguages = [
          {baseLanguage: 'fr', language: 'fr', score: 0.6},
          {baseLanguage: 'en', language: 'en-US', score: 1},
          {baseLanguage: 'en', language: 'en', score: 0.8}
        ];

        const expectedLanguages = [
          {baseLanguage: 'en', language: 'en-US', score: 1},
          {baseLanguage: 'en', language: 'en', score: 0.8},
          {baseLanguage: 'fr', language: 'fr', score: 0.6}
        ];

        expect(service.sortLanguagesByScore(inputLanguages)).to.deep.equal(
          expectedLanguages
        );
      });
    });

    describe('intersectLanguages', () => {
      it('should intersect user languages and supported languages', function() {
        const service = this.owner.lookup('service:best-language');

        const userLanguages = [
          {language: 'fr', baseLanguage: 'fr', score: 0.6},
          {language: 'en-US', baseLanguage: 'en', score: 1},
          {language: 'en', baseLanguage: 'en', score: 0.8}
        ];

        const supportedLanguages = ['en', 'es'];

        const expectedLanguages = [
          {language: 'en-US', baseLanguage: 'en', score: 1},
          {language: 'en', baseLanguage: 'en', score: 0.8}
        ];

        expect(
          service.intersectLanguages(userLanguages, supportedLanguages)
        ).to.deep.equal(expectedLanguages);
      });
    });
  });
});
