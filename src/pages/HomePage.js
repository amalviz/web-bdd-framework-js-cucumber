import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  locators = {
    heading: By.css('h1.heading'),
    subheading: By.css('h2'),
    formAuthenticationLink: By.linkText('Form Authentication'),
  };

  async openHomePage() {
    await this.open('/');
  }

  async getHeadingText() {
    return this.actions.getText(this.locators.heading);
  }

  async navigateToFormAuthentication() {
    await this.actions.click(this.locators.formAuthenticationLink);
  }
}
