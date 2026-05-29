import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class WebDriverFactory {
  static async createDriver() {
    const browser = config.browser.toLowerCase();
    logger.info(`Creating ${browser} driver (headless: ${config.headless})`);

    let builder = new Builder();

    if (browser === 'firefox') {
      const options = new firefox.Options();
      if (config.headless) {
        options.addArguments('-headless');
      }
      builder = builder.forBrowser('firefox').setFirefoxOptions(options);
    } else {
      const options = new chrome.Options();
      if (config.headless) {
        options.addArguments('--headless=new', '--window-size=1920,1080');
      }
      options.addArguments('--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
      // Selenium Manager auto-downloads a matching ChromeDriver
      builder = builder.forBrowser('chrome').setChromeOptions(options);
    }

    const driver = await builder.build();
    await driver.manage().setTimeouts({
      implicit: config.implicitWaitMs,
      pageLoad: config.pageLoadTimeoutMs,
    });
    await driver.manage().window().maximize();

    return driver;
  }
}
