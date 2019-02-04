import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/auth/login');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getEmail() {
    return element(by.id('email'));
  }

  getPassword() {
    return element(by.id('password'));
  }

  getButton() {
    return element(by.buttonText('Войти'));
  }

  getBtn() {
    return element(by.className('btn-floating green'));
  }
}
