import {computed} from '@ember-decorators/object';
import {getOwner} from '@ember/application';
import Service from '@ember/service';

declare class FastBoot {
  isFastBoot: boolean;
  request: Request;
}

interface Language {
  language: string;
  baseLanguage?: string;
  score: number;
}

export default class BestLanguage extends Service {
  @computed
  get fastboot(): FastBoot | null {
    return getOwner(this).lookup('service:fastboot');
  }

  bestLanguage(languages: string[]): Language | null {
    const userLanguages =
      (this.fastboot && this.fastboot.isFastBoot) || false
        ? this.fetchHeaderLanguages()
        : this.fetchBrowserLanguages();

    const userLanguagesWithBaseLanguage = this.mapWithBaseLanguage(
      userLanguages
    );
    const supportedUserLanguages = this.intersectLanguages(
      userLanguagesWithBaseLanguage,
      languages
    );
    const sortedLanguages = this.sortLanguagesByScore(supportedUserLanguages);

    return sortedLanguages[0] || null;
  }

  bestLanguageOrFirst(languages: string[]): Language {
    return (
      this.bestLanguage(languages) || {
        baseLanguage: languages[0],
        language: languages[0],
        score: 0
      }
    );
  }

  private fetchHeaderLanguages(): Language[] {
    const headers = this.fastboot!.request.headers;

    return this.parseHeader(headers.get('Accept-Language') || '');
  }

  private fetchBrowserLanguages(): Language[] {
    const languages = [
      ...navigator.languages,
      navigator.language,
      (navigator as any).userLanguage
    ];

    return Array.from(new Set(languages))
      .filter(language => !!language)
      .map((language, index, array) => ({
        language,
        score: this.computeScore(index, array.length)
      }));
  }

  private parseHeader(header: string): Language[] {
    return header
      .split(',')
      .map(headerItem => this.parseHeaderItem(headerItem));
  }

  private parseHeaderItem(item: string): Language {
    const [language, scoreString = 'q=1.0'] = item.split(';');

    const score = parseFloat(scoreString.split('=')[1]) || 0;

    return {language, score};
  }

  private mapWithBaseLanguage(languages: Language[]): Language[] {
    return languages.map(languageObject => {
      return {
        ...languageObject,
        baseLanguage: languageObject.language.split('-')[0]
      };
    });
  }

  private intersectLanguages(
    userLanguages: Language[],
    languages: string[]
  ): Language[] {
    return userLanguages.filter(({baseLanguage}) =>
      languages.includes(baseLanguage)
    );
  }

  private sortLanguagesByScore(languages: Language[]): Language[] {
    return languages.sort(({score: scoreA}, {score: scoreB}) => {
      return scoreB - scoreA;
    });
  }

  private computeScore(index: number, total: number): number {
    const scoreDefaultDivider = 10;

    const score =
      total <= scoreDefaultDivider
        ? 1 - index / scoreDefaultDivider
        : 1 - index / total;

    return parseFloat(score.toFixed(2));
  }
}
