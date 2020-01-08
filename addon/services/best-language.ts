import {getOwner} from '@ember/application';
import Service from '@ember/service';

declare class FastBoot {
  isFastBoot: boolean;
  request: Request;
}

interface LanguageWithMatch extends Language {
  matches: string;
}

interface Language {
  language: string;
  baseLanguage: string;
  score: number;
}

export default class BestLanguage extends Service {
  get fastboot(): FastBoot | null {
    return getOwner(this).lookup('service:fastboot');
  }

  bestLanguage(languages: string[]): Language | null {
    const userLanguages =
      (this.fastboot && this.fastboot.isFastBoot) || false
        ? this.fetchHeaderLanguages()
        : this.fetchBrowserLanguages();

    const supportedUserLanguages = this.intersectLanguages(
      userLanguages,
      languages
    );

    const sortedLanguages = this.sortLanguagesByScore(supportedUserLanguages);

    return sortedLanguages[0] ? this.mapToLanguage(sortedLanguages[0]) : null;
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const headers = this.fastboot!.request.headers;

    return this.parseHeader(headers.get('Accept-Language') || '');
  }

  private fetchBrowserLanguages(): Language[] {
    const languages = [
      ...(navigator.languages || []),
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
    languages: string[]
  ): LanguageWithMatch[] {
    return userLanguages.reduce((memo, userLanguage) => {
      const matchesLanguage = languages.find(
        language =>
          language.toLowerCase() === userLanguage.language.toLowerCase()
      );

      if (matchesLanguage) {
        return [...memo, {...userLanguage, matches: matchesLanguage}];
      }

      const matchesBaseLanguage = languages.find(language => {
        return (
          this.getBaseLanguage(language).toLowerCase() ===
          userLanguage.baseLanguage.toLowerCase()
        );
      });

      if (matchesBaseLanguage) {
        return [...memo, {...userLanguage, matches: matchesBaseLanguage}];
      }

      return memo;
    }, []);
  }

  private sortLanguagesByScore(
    languages: LanguageWithMatch[]
  ): LanguageWithMatch[] {
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

  private mapToLanguage(language: LanguageWithMatch): Language {
    return {
      baseLanguage: language.baseLanguage,
      language: language.matches,
      score: language.score
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'best-language': BestLanguage;
  }
}
