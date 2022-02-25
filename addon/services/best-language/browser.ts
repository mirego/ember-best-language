import Service from '@ember/service';

export default class BrowserAdapter extends Service {
  fetchLanguages() {
    const browserLanguages = [...(navigator.languages || []), navigator.language, (navigator as any).userLanguage];

    const languages = browserLanguages.filter((language, index, array) => {
      return !!language && array.indexOf(language) === index;
    });

    return languages.map((language, index, array) => ({
      language,
      score: this.computeScore(index, array.length),
    }));
  }

  computeScore(index: number, total: number): number {
    const scoreDefaultDivider = 10;

    const score = total <= scoreDefaultDivider ? 1 - index / scoreDefaultDivider : 1 - index / total;

    return parseFloat(score.toFixed(2));
  }
}

declare module '@ember/service' {
  interface Registry {
    'best-language/browser': BrowserAdapter;
  }
}
