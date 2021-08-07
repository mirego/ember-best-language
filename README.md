<div align="center">
  <img src="https://user-images.githubusercontent.com/11348/55352478-eaa0b280-548e-11e9-99b2-34f7f34986c0.png" width="600" />
  <p><br />A FastBoot-enabled addon to detect the best language for your user.</p>
  <p>
    <a href="https://travis-ci.com/mirego/ember-best-language"><img src="https://travis-ci.com/mirego/ember-best-language.svg?branch=master" /></a>
    <a href="https://www.npmjs.com/package/ember-best-language"><img src="https://img.shields.io/npm/v/ember-best-language.svg" /></a>
  </p>
</div>

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
import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default class extends Route {
  @service('best-language') bestLanguage;

  beforeModel() {
    const bestLanguage = this.bestLanguage.bestLanguage(['en-US', 'fr']);
    // => {language: 'en-US', baseLanguage: 'en', score: 1}
  }
});
```

If none of the user’s languages are supported, `ember-best-language` will return `null`. However, you can use the `bestLanguageOrFirst` method to make it return the first supported language in those cases.

```js
import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default class extends Route {
  @service('best-language') bestLanguage;

  beforeModel() {
    const bestLanguage = this.bestLanguage.bestLanguage(['fr', 'de', 'en-US']);
    // => null

    const bestLanguageOrFirst = this.bestLanguage.bestLanguageOrFirst(['fr', 'de', 'en-US']);
    // => {language: 'fr', baseLanguage: 'fr', score: 0}
  }
});
```

## Contributing

```shell
$ git clone https://github.com/mirego/ember-best-language
$ cd ember-best-language
$ yarn install
```

## Running tests

```shell
$ yarn test # Runs `ember try:each` to test the addon against multiple Ember versions
$ ember test
$ ember test --server
```

## Building

```shell
$ ember build
```

For more information on using ember-cli, visit <https://ember-cli.com>.

## License

`ember-best-language` is © 2017-2019 [Mirego](http://www.mirego.com) and may be freely distributed under the [New BSD license](http://opensource.org/licenses/BSD-3-Clause). See the [`LICENSE.md`](https://github.com/mirego/ember-best-language/blob/master/LICENSE.md) file.

The flag logo is based on [this lovely icon by Prasanta Kr Dutta](https://thenounproject.com/term/language/1824073), from The Noun Project. Used under a [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/) license.

## About Mirego

[Mirego](http://mirego.com) is a team of passionate people who believe that work is a place where you can innovate and have fun. We're a team of [talented people](http://life.mirego.com) who imagine and build beautiful Web and mobile applications. We come together to share ideas and [change the world](http://mirego.org).

We also [love open-source software](http://open.mirego.com) and we try to give back to the community as much as we can.
