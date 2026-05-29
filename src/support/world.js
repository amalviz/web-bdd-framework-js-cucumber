import { setWorldConstructor } from '@cucumber/cucumber';
import { WebActions } from '../actions/WebActions.js';
import { ApiActions } from '../api/ApiActions.js';
import { HomePage } from '../pages/HomePage.js';
import { LoginPage } from '../pages/LoginPage.js';

export class CustomWorld {
  constructor() {
    this.driver = null;
    this.webActions = null;
    this.apiActions = new ApiActions();
    this.homePage = null;
    this.loginPage = null;
    this.testData = {};
  }

  initWeb(driver) {
    this.driver = driver;
    this.webActions = new WebActions(driver);
    this.homePage = new HomePage(this.webActions);
    this.loginPage = new LoginPage(this.webActions);
  }

  resetApi() {
    this.apiActions = new ApiActions();
  }
}

setWorldConstructor(CustomWorld);
