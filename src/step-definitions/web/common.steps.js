import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { config } from '../../config/env.js';

Given('I navigate to the application home page', async function () {
  await this.homePage.openHomePage();
});

Given('I open the url {string}', async function (url) {
  const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`;
  await this.webActions.open(fullUrl);
});

When('I wait for the page title to contain {string}', async function (title) {
  await this.webActions.waitForTitleContains(title);
});

Then('the page title should contain {string}', async function (expectedTitle) {
  const title = await this.webActions.getTitle();
  expect(title).to.include(expectedTitle);
});

Then('the current url should contain {string}', async function (partialUrl) {
  const url = await this.webActions.getCurrentUrl();
  expect(url).to.include(partialUrl);
});

Then('the element {string} should be visible', async function (cssSelector) {
  const isVisible = await this.webActions.isDisplayed(this.webActions.byCss(cssSelector));
  expect(isVisible).to.be.true;
});

Then('the element {string} should have text {string}', async function (cssSelector, expectedText) {
  const text = await this.webActions.getText(this.webActions.byCss(cssSelector));
  expect(text).to.equal(expectedText);
});
