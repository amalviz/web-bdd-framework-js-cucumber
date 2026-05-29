import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { WebDriverFactory } from '../drivers/WebDriverFactory.js';
import { logger } from '../utils/logger.js';

setDefaultTimeout(60 * 1000);

const isWebScenario = (pickle) =>
  pickle.tags.some((tag) => tag.name === '@web') ||
  pickle.tags.some((tag) => tag.name === '@ui');

BeforeAll(async function () {
  const reportsDir = path.resolve('reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
});

Before({ tags: '@web or @ui' }, async function () {
  const driver = await WebDriverFactory.createDriver();
  this.initWeb(driver);
});

Before({ tags: '@api' }, async function () {
  this.resetApi();
});

After({ tags: '@web or @ui' }, async function ({ pickle, result }) {
  if (this.driver && result?.status === 'FAILED') {
    try {
      const screenshot = await this.webActions.takeScreenshotAsBase64();
      const filename = `reports/screenshot-${pickle.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
      fs.writeFileSync(filename, screenshot, 'base64');
      logger.info(`Screenshot saved: ${filename}`);
    } catch (error) {
      logger.error(`Failed to capture screenshot: ${error.message}`);
    }
  }

  if (this.driver) {
    await this.driver.quit();
    this.driver = null;
  }
});

AfterAll(async function () {
  logger.info('Test run completed');
});
