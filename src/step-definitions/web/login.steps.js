import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { config } from '../../config/env.js';

Given('I am on the login page', async function () {
  await this.loginPage.openLoginPage();
});

When('I login with valid credentials', async function () {
  const { validUsername, validPassword } = config.credentials;
  await this.loginPage.login(validUsername, validPassword);
});

When('I login with username {string} and password {string}', async function (username, password) {
  await this.loginPage.login(username, password);
});

When('I click on the Form Authentication link', async function () {
  await this.homePage.navigateToFormAuthentication();
});

Then('I should see a successful login message', async function () {
  const message = await this.loginPage.getFlashMessage();
  expect(message).to.include('You logged into a secure area!');
});

Then('I should see an invalid login message', async function () {
  const message = await this.loginPage.getFlashMessage();
  expect(message).to.include('Your username is invalid!');
});

Then('the home page heading should be {string}', async function (expectedHeading) {
  const heading = await this.homePage.getHeadingText();
  expect(heading).to.equal(expectedHeading);
});
