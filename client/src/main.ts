import {
  enableProdMode,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT,
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'materialize-css/dist/js/materialize';

if (localStorage.getItem('locale') === null) {
  localStorage.setItem('locale', 'en');
}

const locale = localStorage.getItem('locale');
declare const require;
const translations = require(`raw-loader!./assets/messages.${locale}.xlf`);
console.log(translations);
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    { provide: TRANSLATIONS, useValue: translations },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
  ],
});
