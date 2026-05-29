import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  locators = {
    username: By.id('username'),
    password: By.id('password'),
    submit: By.css('button[type="submit"]'),
    flashMessage: By.id('flash'),
  };

  async openLoginPage() {
    await this.open('/login');
  }

  async login(username, password) {
    await this.actions.type(this.locators.username, username);
    await this.actions.type(this.locators.password, password);
    await this.actions.click(this.locators.submit);
  }

  async getFlashMessage() {
    return this.actions.getText(this.locators.flashMessage);
  }
}
