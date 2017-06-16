# ember-best-language

An FastBoot-enabled addon to detect the best language for your user.

## Installation

```shell
$ ember install ember-best-language
```

## Usage

`ember-best-language` provides a service with two methods:

- bestLanguage
- bestLanguageOrFirst

To find out which language is the best one to use among a list of supported languages:

```js
import Ember from 'ember';

const {inject} = Ember;

export default Ember.Route.extend({
  bestLanguage: inject.service('best-language'),

  beforeModel() {
    const bestLanguage = this.get('bestLanguage').bestLanguage(['en', 'fr']);
    // => {language: 'en-US', baseLanguage: 'en', score: 1}
  }
});
```

If none of the user’s languages are supported, `ember-best-language` will return `null`. However, you can use the `bestLanguageOrFirst` method to make it return the first supported language in those cases.

```js
import Ember from 'ember';

const {inject} = Ember;

export default Ember.Route.extend({
  bestLanguage: inject.service('best-language'),

  beforeModel() {
    const bestLanguage = this.get('bestLanguage').bestLanguage(['fr', 'de']);
    // => null

    const bestLanguageOrFirst = this.get('bestLanguage').bestLanguageOrFirst(['fr', 'de']);
    // => {language: 'fr', baseLanguage: 'fr', score: 0}
  }
});
```

## Contributing

```shell
$ git clone https://github.com/mirego/ember-cli-pod-translations
$ cd ember-cli-pod-translations
$ yarn install
```

## Running tests

```shell
$ npm test # Runs `ember try:each` to test the addon against multiple Ember versions
$ ember test
$ ember test --server
```

## Building

```shell
$ ember build
```

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

This addon is inspired by the work of Rémi Prévost in https://github.com/remiprev/plug_best, you should check it out!
