import {getOwner} from '@ember/application';
import Service from '@ember/service';

declare class FastBoot {
  isFastBoot: boolean;
  request: Request;
}

export default class FastBootAdapter extends Service {
  get fastboot(): FastBoot | null {
    return (getOwner(this) as any).lookup('service:fastboot');
  }

  fetchLanguages() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const headers = this.fastboot!.request.headers;

    return this.parseHeader(headers.get('Accept-Language') || '');
  }

  parseHeader(header: string) {
    return header.split(',').map(headerItem => this.parseHeaderItem(headerItem));
  }

  parseHeaderItem(item: string) {
    const [language, scoreString = 'q=1.0'] = item.split(';');

    const score = parseFloat(scoreString.split('=')[1]) || 0;

    return {
      language,
      score,
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'best-language/fastboot': FastBootAdapter;
  }
}
