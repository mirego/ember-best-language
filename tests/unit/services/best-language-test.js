import Ember from 'ember';
import {expect} from 'chai';
import {describe, before, beforeEach, it} from 'mocha';
import {setupTest} from 'ember-mocha';

describe('Unit | Service | best-language', () => {
  setupTest('service:best-language', {
    needs: ['service:fastboot']
  });

  describe('when running inside FastBoot', () => {
    const fastbootStub = Ember.Service.extend({
      isFastBoot: true,
      request: Ember.Object.create({
        headers: Ember.Object.create({
          'Accept-Language': 'en-US,en;q=0.8,fr;q=0.6'
        })
      })
    });

    beforeEach(function() {
      this.register('service:fastboot', fastbootStub);
      this.inject.service('fastboot');
    });

    describe('_fetchHeaderLanguages', () => {
      it('should fetch the languages from the `Accept-Language` header', function() {
        const service = this.subject();

        const expectedLanguages = [
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.8},
          {language: 'fr', score: 0.6}
        ];

        expect(service._fetchHeaderLanguages()).to.deep.equal(expectedLanguages);
      });
    });

    describe('bestLanguage', () => {
      it ('should return the best language when one matches', function() {
        const service = this.subject();

        const supportedLanguages = [
          'en', 'es'
        ];

        expect(service.bestLanguage(supportedLanguages)).to.deep.equal({language: 'en-US', baseLanguage: 'en', score: 1});
      });

      it('should return `null` when none match', function() {
        const service = this.subject();

        const supportedLanguages = [
          'de', 'es'
        ];

        expect(service.bestLanguage(supportedLanguages)).to.deep.equal(null);
      });
    });

    describe('bestLanguageOrFirst', () => {
      it ('should return the best language when one matches', function() {
        const service = this.subject();

        const supportedLanguages = [
          'en', 'es'
        ];

        expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal({language: 'en-US', baseLanguage: 'en', score: 1});
      });

      it('should return the first supported language when none match', function() {
        const service = this.subject();

        const supportedLanguages = [
          'de', 'es'
        ];

        expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal({language: 'de', baseLanguage: 'de', score: 0});
      });
    });
  });

  describe('when running inside the browser', () => {
    const fastbootStub = Ember.Service.extend({
      isFastboot: false
    });

    before(() => {
      Object.defineProperty(window.navigator, 'languages', {value: ['en-US', 'en', 'fr']});
      Object.defineProperty(window.navigator, 'language', {value: 'en-US'});
      Object.defineProperty(window.navigator, 'userLanguage', {value: undefined});
    });

    beforeEach(function() {
      this.register('service:fastboot', fastbootStub);
      this.inject.service('fastboot');
    });

    describe('_fetchBrowserLanguages', () => {
      it('should fetch the languages from the different properties on `navigator`', function() {
        const service = this.subject();

        const expectedLanguages = [
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.9},
          {language: 'fr', score: 0.8}
        ];

        expect(service._fetchBrowserLanguages()).to.deep.equal(expectedLanguages);
      });
    });

    describe('_computeScore', () => {
      describe('with an array of less than 10 languages', () => {
        const languagesLength = 3;

        it('should return `1` for the first item', function() {
          const service = this.subject();

          expect(service._computeScore(0, languagesLength)).to.equal(1);
        });

        it('should compute a score, between 1 and 0, for each languages. Each having 0.1 difference.', function() {
          const service = this.subject();

          expect(service._computeScore(0, languagesLength)).to.equal(1);
          expect(service._computeScore(1, languagesLength)).to.equal(0.9);
          expect(service._computeScore(2, languagesLength)).to.equal(0.8);
        });
      });

      describe('with an array of more than 10 languages', () => {
        const languagesLength = 15;

        it('should return `1` for the first item', function() {
          const service = this.subject();

          expect(service._computeScore(0, languagesLength)).to.equal(1);
        });

        it('should compute a score, between 1 and 0, for each languages, with 2 digits precision', function() {
          const service = this.subject();

          expect(service._computeScore(0, languagesLength)).to.equal(1);
          expect(service._computeScore(1, languagesLength)).to.equal(0.93);
          expect(service._computeScore(2, languagesLength)).to.equal(0.87);
          expect(service._computeScore(13, languagesLength)).to.equal(0.13);
          expect(service._computeScore(14, languagesLength)).to.equal(0.07);
          expect(service._computeScore(15, languagesLength)).to.equal(0);
        });
      });
    });

    describe('bestLanguage', () => {
      it ('should return the best language when one matches', function() {
        const service = this.subject();

        const supportedLanguages = [
          'en', 'es'
        ];

        expect(service.bestLanguage(supportedLanguages)).to.deep.equal({language: 'en-US', baseLanguage: 'en', score: 1});
      });

      it('should return `null` when none match', function() {
        const service = this.subject();

        const supportedLanguages = [
          'de', 'es'
        ];

        expect(service.bestLanguage(supportedLanguages)).to.deep.equal(null);
      });
    });

    describe('bestLanguageOrFirst', () => {
      it ('should return the best language when one matches', function() {
        const service = this.subject();

        const supportedLanguages = [
          'en', 'es'
        ];

        expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal({language: 'en-US', baseLanguage: 'en', score: 1});
      });

      it('should return the first supported language when none match', function() {
        const service = this.subject();

        const supportedLanguages = [
          'de', 'es'
        ];

        expect(service.bestLanguageOrFirst(supportedLanguages)).to.deep.equal({language: 'de', baseLanguage: 'de', score: 0});
      });
    });
  });

  describe('when running in either environment', () => {
    describe('_sortLanguagesByScore', () => {
      it('should sort languages by score descending', function() {
        const service = this.subject();

        const inputLanguages = [
          {language: 'fr', score: 0.6},
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.8}
        ];

        const expectedLanguages = [
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.8},
          {language: 'fr', score: 0.6}
        ];

        expect(service._sortLanguagesByScore(inputLanguages)).to.deep.equal(expectedLanguages);
      });
    });

    describe('_mapWithBaseLanguage', () => {
      it('should add the base language in the language object', function() {
        const service = this.subject();

        const inputLanguages = [
          {language: 'fr', score: 0.6},
          {language: 'en-US', score: 1},
          {language: 'en', score: 0.8}
        ];

        const expectedLanguages = [
          {language: 'fr', baseLanguage: 'fr', score: 0.6},
          {language: 'en-US', baseLanguage: 'en', score: 1},
          {language: 'en', baseLanguage: 'en', score: 0.8}
        ];

        expect(service._mapWithBaseLanguage(inputLanguages)).to.deep.equal(expectedLanguages);
      });
    });

    describe('_intersectLanguages', () => {
      it('should intersect user languages and supported languages', function() {
        const service = this.subject();

        const userLanguages = [
          {language: 'fr', baseLanguage: 'fr', score: 0.6},
          {language: 'en-US', baseLanguage: 'en', score: 1},
          {language: 'en', baseLanguage: 'en', score: 0.8}
        ];

        const supportedLanguages = [
          'en', 'es'
        ];

        const expectedLanguages = [
          {language: 'en-US', baseLanguage: 'en', score: 1},
          {language: 'en', baseLanguage: 'en', score: 0.8}
        ];

        expect(service._intersectLanguages(userLanguages, supportedLanguages)).to.deep.equal(expectedLanguages);
      });
    });
  });
});
