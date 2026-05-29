import { config } from '../config/env.js';

/**
 * Base page object — extend for each application page.
 * Delegates all UI work to WebActions for reuse across the framework.
 */
export class BasePage {
  constructor(webActions) {
    this.actions = webActions;
    this.baseUrl = config.baseUrl;
  }

  async open(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    await this.actions.open(url);
  }

  async getPageTitle() {
    return this.actions.getTitle();
  }

  async getCurrentUrl() {
    return this.actions.getCurrentUrl();
  }
}
