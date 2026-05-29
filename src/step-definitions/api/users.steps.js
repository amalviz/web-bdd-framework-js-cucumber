import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

When('I request all users from the API', async function () {
  await this.apiActions.getUsers();
});

When('I request user with id {int} from the API', async function (id) {
  await this.apiActions.getUserById(id);
});

When('I create a new user with name {string} and email {string}', async function (name, email) {
  await this.apiActions.createUser({ name, email });
  this.testData.lastCreatedUser = { name, email };
});

When('I delete user with id {int} from the API', async function (id) {
  await this.apiActions.deleteUser(id);
});

Then('the API response status should be {int}', function (expectedStatus) {
  expect(this.apiActions.getStatusCode()).to.equal(expectedStatus);
});

Then('the API response should contain a list of users', function () {
  const body = this.apiActions.getResponseBody();
  expect(body).to.be.an('array');
  expect(body.length).to.be.greaterThan(0);
});

Then('the API response user name should be {string}', function (expectedName) {
  const body = this.apiActions.getResponseBody();
  expect(body.name).to.equal(expectedName);
});

Then('the API response should contain user id {int}', function (expectedId) {
  const body = this.apiActions.getResponseBody();
  expect(body.id).to.equal(expectedId);
});

Then('the created user name should be {string}', function (expectedName) {
  const body = this.apiActions.getResponseBody();
  expect(body.name).to.equal(expectedName);
});

Then('the API response content type should be JSON', function () {
  const contentType = this.apiActions.getResponseHeader('content-type');
  expect(contentType).to.include('application/json');
});
