import Ember from 'ember';

const {inject} = Ember;

export default Ember.Service.extend({
  fastboot: inject.service('fastboot'),

  bestLanguage(languages) {
    const userLanguages = this.get('fastboot.isFastBoot')
      ? this._fetchHeaderLanguages()
      : this._fetchBrowserLanguages();

    const userLanguagesWithBaseLanguage = this._mapWithBaseLanguage(userLanguages);
    const supportedUserLanguages = this._intersectLanguages(userLanguagesWithBaseLanguage, languages);
    const sortedLanguages = this._sortLanguagesByScore(supportedUserLanguages);

    return sortedLanguages[0] || null;
  },

  bestLanguageOrFirst(languages) {
    return this.bestLanguage(languages) || {language: languages[0], baseLanguage: languages[0], score: 0};
  },

  _fetchHeaderLanguages() {
    const headers = this.get('fastboot.request.headers');
    return this._parseHeader(headers.get('Accept-Language'));
  },

  _fetchBrowserLanguages() {
    const languages = []
      .concat(navigator.language)
      .concat(navigator.userLanguage)
      .concat(navigator.languages);

    return Array.from(new Set(languages))
      .filter((language) => !!language)
      .map((language, index, array) => ({
        language,
        score: this._computeScore(index, array.length)
      }));
  },

  _parseHeader(header) {
    return header.split(',')
      .map((headerItem) => this._parseHeaderItem(headerItem));
  },

  _parseHeaderItem(item) {
    const [language, scoreString = 'q=1.0'] = item.split(';');

    const score = parseFloat(scoreString.split('=')[1]) || 0;

    return {language, score};
  },

  _mapWithBaseLanguage(languages) {
    return languages.map((languageObject) => {
      return Object.assign({}, languageObject, {baseLanguage: languageObject.language.split('-')[0]});
    });
  },

  _intersectLanguages(userLanguages, languages) {
    return userLanguages.filter(({baseLanguage}) => languages.includes(baseLanguage));
  },

  _sortLanguagesByScore(languages) {
    return languages.sort(({score: scoreA}, {score: scoreB}) => {
      return scoreB - scoreA;
    });
  },

  _computeScore(index, total) {
    let score;

    if (total <= 10) {
      score = 1 - (index / 10);
    } else {
      score = 1 - (index / total);
    }

    return parseFloat(score.toFixed(2));
  }
});
