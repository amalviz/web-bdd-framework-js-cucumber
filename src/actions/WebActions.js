import { By, until, Key } from 'selenium-webdriver';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

/**
 * Reusable Selenium WebDriver actions.
 * All page objects and step definitions should delegate UI interaction here.
 */
export class WebActions {
  constructor(driver) {
    this.driver = driver;
  }

  async #retryAction(label, fn) {
    if (config.actionRetryCount <= 1) {
      return fn();
    }

    return withRetry(fn, {
      maxAttempts: config.actionRetryCount,
      delayMs: config.actionRetryDelayMs,
      label,
    });
  }

  // --- Navigation ---

  async open(url) {
    await this.#retryAction(`open ${url}`, async () => {
      logger.info(`Navigate to: ${url}`);
      await this.driver.get(url);
    });
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }

  async getTitle() {
    return this.driver.getTitle();
  }

  async refresh() {
    await this.driver.navigate().refresh();
  }

  async goBack() {
    await this.driver.navigate().back();
  }

  async goForward() {
    await this.driver.navigate().forward();
  }

  // --- Element location ---

  byCss(selector) {
    return By.css(selector);
  }

  byId(id) {
    return By.id(id);
  }

  byName(name) {
    return By.name(name);
  }

  byXPath(xpath) {
    return By.xpath(xpath);
  }

  byLinkText(text) {
    return By.linkText(text);
  }

  byPartialLinkText(text) {
    return By.partialLinkText(text);
  }

  // --- Waits ---

  async waitForVisible(locator, timeoutMs = 10000) {
    const element = await this.driver.wait(
      until.elementIsVisible(await this.driver.findElement(locator)),
      timeoutMs,
      `Element not visible: ${locator}`,
    );
    return element;
  }

  async waitForClickable(locator, timeoutMs = 10000) {
    const element = await this.driver.wait(
      until.elementIsEnabled(await this.driver.findElement(locator)),
      timeoutMs,
      `Element not clickable: ${locator}`,
    );
    return element;
  }

  async waitForInvisible(locator, timeoutMs = 10000) {
    const element = await this.driver.findElement(locator);
    await this.driver.wait(until.stalenessOf(element), timeoutMs);
  }

  async waitForUrlContains(partialUrl, timeoutMs = 10000) {
    await this.driver.wait(
      async () => (await this.getCurrentUrl()).includes(partialUrl),
      timeoutMs,
      `URL did not contain: ${partialUrl}`,
    );
  }

  async waitForTitleContains(partialTitle, timeoutMs = 10000) {
    await this.driver.wait(
      async () => (await this.getTitle()).includes(partialTitle),
      timeoutMs,
      `Title did not contain: ${partialTitle}`,
    );
  }

  // --- Interactions ---

  async click(locator) {
    await this.#retryAction(`click ${locator}`, async () => {
      const element = await this.waitForClickable(locator);
      logger.info(`Click: ${locator}`);
      await element.click();
    });
  }

  async doubleClick(locator) {
    const element = await this.waitForVisible(locator);
    const actions = this.driver.actions({ bridge: true });
    await actions.doubleClick(element).perform();
  }

  async type(locator, text, { clear = true } = {}) {
    await this.#retryAction(`type ${locator}`, async () => {
      const element = await this.waitForVisible(locator);
      if (clear) {
        await element.clear();
      }
      logger.info(`Type into ${locator}`);
      await element.sendKeys(text);
    });
  }

  async typeSlowly(locator, text, delayMs = 100) {
    const element = await this.waitForVisible(locator);
    await element.clear();
    for (const char of text) {
      await element.sendKeys(char);
      await this.driver.sleep(delayMs);
    }
  }

  async pressKey(key) {
    await this.driver.actions().sendKeys(key).perform();
  }

  async pressEnter(locator) {
    const element = await this.waitForVisible(locator);
    await element.sendKeys(Key.RETURN);
  }

  async clear(locator) {
    const element = await this.waitForVisible(locator);
    await element.clear();
  }

  async submit(locator) {
    const element = await this.waitForVisible(locator);
    await element.submit();
  }

  // --- Reads ---

  async getText(locator) {
    return this.#retryAction(`getText ${locator}`, async () => {
      const element = await this.waitForVisible(locator);
      return element.getText();
    });
  }

  async getAttribute(locator, attribute) {
    const element = await this.waitForVisible(locator);
    return element.getAttribute(attribute);
  }

  async getValue(locator) {
    return this.getAttribute(locator, 'value');
  }

  async isDisplayed(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return element.isDisplayed();
    } catch {
      return false;
    }
  }

  async isEnabled(locator) {
    const element = await this.driver.findElement(locator);
    return element.isEnabled();
  }

  async isSelected(locator) {
    const element = await this.driver.findElement(locator);
    return element.isSelected();
  }

  async getElementCount(locator) {
    const elements = await this.driver.findElements(locator);
    return elements.length;
  }

  // --- Dropdowns ---

  async selectByVisibleText(locator, text) {
    const element = await this.waitForVisible(locator);
    const options = await element.findElements(By.tagName('option'));
    for (const option of options) {
      const optionText = await option.getText();
      if (optionText === text) {
        await option.click();
        return;
      }
    }
    throw new Error(`Option "${text}" not found in dropdown ${locator}`);
  }

  async selectByValue(locator, value) {
    const element = await this.waitForVisible(locator);
    const options = await element.findElements(By.tagName('option'));
    for (const option of options) {
      const optionValue = await option.getAttribute('value');
      if (optionValue === value) {
        await option.click();
        return;
      }
    }
    throw new Error(`Value "${value}" not found in dropdown ${locator}`);
  }

  // --- Checkboxes & radio ---

  async check(locator) {
    const selected = await this.isSelected(locator);
    if (!selected) {
      await this.click(locator);
    }
  }

  async uncheck(locator) {
    const selected = await this.isSelected(locator);
    if (selected) {
      await this.click(locator);
    }
  }

  // --- Frames & windows ---

  async switchToFrame(locatorOrIndex) {
    if (typeof locatorOrIndex === 'number') {
      const frames = await this.driver.findElements(By.tagName('iframe'));
      await this.driver.switchTo().frame(frames[locatorOrIndex]);
    } else {
      const frame = await this.driver.findElement(locatorOrIndex);
      await this.driver.switchTo().frame(frame);
    }
  }

  async switchToDefaultContent() {
    await this.driver.switchTo().defaultContent();
  }

  async switchToWindow(windowHandle) {
    await this.driver.switchTo().window(windowHandle);
  }

  async switchToNewWindow() {
    const handles = await this.driver.getAllWindowHandles();
    await this.switchToWindow(handles[handles.length - 1]);
  }

  async closeCurrentWindow() {
    await this.driver.close();
  }

  async getWindowHandles() {
    return this.driver.getAllWindowHandles();
  }

  // --- Alerts ---

  async acceptAlert() {
    const alert = await this.driver.wait(until.alertIsPresent());
    await alert.accept();
  }

  async dismissAlert() {
    const alert = await this.driver.wait(until.alertIsPresent());
    await alert.dismiss();
  }

  async getAlertText() {
    const alert = await this.driver.wait(until.alertIsPresent());
    return alert.getText();
  }

  async typeInAlert(text) {
    const alert = await this.driver.wait(until.alertIsPresent());
    await alert.sendKeys(text);
  }

  // --- JavaScript ---

  async scrollToElement(locator) {
    const element = await this.driver.findElement(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  async scrollToBottom() {
    await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
  }

  async executeScript(script, ...args) {
    return this.driver.executeScript(script, ...args);
  }

  async highlight(locator) {
    const element = await this.driver.findElement(locator);
    await this.driver.executeScript(
      "arguments[0].style.border='3px solid red'",
      element,
    );
  }

  // --- Screenshots ---

  async takeScreenshot() {
    const image = await this.driver.takeScreenshot();
    return Buffer.from(image, 'base64');
  }

  async takeScreenshotAsBase64() {
    return this.driver.takeScreenshot();
  }
}
