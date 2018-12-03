import {computed} from '@ember-decorators/object';
import {getOwner} from '@ember/application';
import Service from '@ember/service';

declare class FastBoot {
  isFastBoot: boolean;
  request: Request;
}

interface Language {
  language: string;
  baseLanguage: string;
  score: number;
}

export default class BestLanguage extends Service {
  @computed
  get fastboot(): FastBoot | null {
    return getOwner(this).lookup('service:fastboot');
  }

  bestLanguage(languages: string[]): Language | null {
    const supportedBaseLanguages = languages.map(language => {
      return this.getBaseLanguage(language);
    });

    const userLanguages =
      (this.fastboot && this.fastboot.isFastBoot) || false
        ? this.fetchHeaderLanguages()
        : this.fetchBrowserLanguages();

    const supportedUserLanguages = this.intersectLanguages(
      userLanguages,
      supportedBaseLanguages
    );

    const sortedLanguages = this.sortLanguagesByScore(supportedUserLanguages);

    return sortedLanguages[0] || null;
  }

  bestLanguageOrFirst(languages: string[]): Language {
    const bestLanguage = this.bestLanguage(languages);

    if (bestLanguage) return bestLanguage;

    return {
      baseLanguage: this.getBaseLanguage(languages[0]),
      language: languages[0],
      score: 0
    };
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
        baseLanguage: this.getBaseLanguage(language),
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

    return {
      language,
      score,
      baseLanguage: this.getBaseLanguage(language)
    };
  }

  private getBaseLanguage(language: string): string {
    return language.replace(/[\-_].+$/, '');
  }

  private intersectLanguages(
    userLanguages: Language[],
    supportedBaseLanguages: string[]
  ): Language[] {
    return userLanguages.filter(({baseLanguage}) => {
      return supportedBaseLanguages.includes(baseLanguage);
    });
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
