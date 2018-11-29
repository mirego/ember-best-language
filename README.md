# ember-best-language

[![Build Status](https://travis-ci.org/mirego/ember-best-language.svg?branch=master)](https://travis-ci.org/mirego/ember-best-language)

An FastBoot-enabled addon to detect the best language for your user.

## Installation

```shell
$ ember install ember-best-language
```

## How does it work?

`ember-best-language` uses a scoring system to determine the best language to use. The scoring system is based on the `Accept-Language` header on the FastBoot-side. On the client side, we use `navigator.languages` and give a score to each language based on its order in the array.

`ember-best-language` also split language code from country code to make sure that if the user reads `fr-CA` and your system supports `fr`, you will have a match.

This addon is inspired by the work of [Rémi Prévost](https://github.com/remiprev) in [`plug_best`](https://github.com/remiprev/plug_best), you should check it out!

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

__Note: for the time being, we only support an array of language codes without country code e.g. 'es'. PRs welcome! :)__

## Contributing

```shell
$ git clone https://github.com/mirego/ember-best-language
$ cd ember-best-language
$ npm install
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

## License

`ember-best-language` is © 2017-2018 [Mirego](http://www.mirego.com) and may be freely distributed under the [New BSD license](http://opensource.org/licenses/BSD-3-Clause).
See the [`LICENSE.md`](https://github.com/mirego/ember-best-language/blob/master/LICENSE.md) file.

## About Mirego

[Mirego](http://mirego.com) is a team of passionate people who believe that work is a place where you can innovate and have fun. We're a team of [talented people](http://life.mirego.com) who imagine and build beautiful Web and mobile applications. We come together to share ideas and [change the world](http://mirego.org).

We also [love open-source software](http://open.mirego.com) and we try to give back to the community as much as we can.
