import {getOwner} from '@ember/application';
import Service, {inject as service} from '@ember/service';
import type FastBootAdapter from 'ember-best-language/services/best-language/fastboot';
import type BrowserAdapter from 'ember-best-language/services/best-language/browser';

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
  @service('best-language/fastboot')
  fastbootAdapter: FastBootAdapter;

  @service('best-language/browser')
  browserAdapter: BrowserAdapter;

  get fastboot(): FastBoot | null {
    return (getOwner(this) as any).lookup('service:fastboot');
  }

  bestLanguage(languages: string[]): Language | null {
    const userLanguages =
      this.fastboot?.isFastBoot || false ? this.fastbootAdapter.fetchLanguages() : this.browserAdapter.fetchLanguages();

    const userLangaguesWithBaseLanguage = userLanguages.map(userLanguage => {
      return {
        ...userLanguage,
        baseLanguage: this.getBaseLanguage(userLanguage.language),
      };
    });

    const supportedUserLanguages = this.intersectLanguages(userLangaguesWithBaseLanguage, languages);

    const sortedLanguages = this.sortLanguagesByScore(supportedUserLanguages);

    return sortedLanguages[0] ? this.mapToLanguage(sortedLanguages[0]) : null;
  }

  bestLanguageOrFirst(languages: string[]): Language {
    const bestLanguage = this.bestLanguage(languages);

    if (bestLanguage) return bestLanguage;

    return {
      baseLanguage: this.getBaseLanguage(languages[0]),
      language: languages[0],
      score: 0,
    };
  }

  private getBaseLanguage(language: string): string {
    return language.replace(/[\-_].+$/, '');
  }

  private intersectLanguages(userLanguages: Language[], languages: string[]): LanguageWithMatch[] {
    return userLanguages.reduce((memo, userLanguage) => {
      const matchesLanguage = languages.find(
        language => language.toLowerCase() === userLanguage.language.toLowerCase()
      );

      if (matchesLanguage) {
        return [...memo, {...userLanguage, matches: matchesLanguage}];
      }

      const matchesBaseLanguage = languages.find(language => {
        return this.getBaseLanguage(language).toLowerCase() === userLanguage.baseLanguage.toLowerCase();
      });

      if (matchesBaseLanguage) {
        return [...memo, {...userLanguage, matches: matchesBaseLanguage}];
      }

      return memo;
    }, []);
  }

  private sortLanguagesByScore(languages: LanguageWithMatch[]): LanguageWithMatch[] {
    return languages.sort(({score: scoreA}, {score: scoreB}) => {
      return scoreB - scoreA;
    });
  }

  private mapToLanguage(language: LanguageWithMatch): Language {
    return {
      baseLanguage: language.baseLanguage,
      language: language.matches,
      score: language.score,
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'best-language': BestLanguage;
  }
}
