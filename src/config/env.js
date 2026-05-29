import dotenv from 'dotenv';

dotenv.config();

const toBool = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

const toInt = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const config = {
  browser: process.env.BROWSER || 'chrome',
  headless: toBool(process.env.HEADLESS, true),
  implicitWaitMs: toInt(process.env.IMPLICIT_WAIT_MS, 10000),
  pageLoadTimeoutMs: toInt(process.env.PAGE_LOAD_TIMEOUT_MS, 30000),
  baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  credentials: {
    validUsername: process.env.LOGIN_USERNAME || 'tomsmith',
    validPassword: process.env.LOGIN_PASSWORD || 'SuperSecretPassword!',
  },
  // Scenario-level retry (Cucumber --retry)
  scenarioRetryCount: toInt(process.env.SCENARIO_RETRY_COUNT, 0),
  scenarioRetryTagFilter: process.env.SCENARIO_RETRY_TAG_FILTER || '',
  // Action-level retry (WebActions wrapper)
  actionRetryCount: toInt(process.env.ACTION_RETRY_COUNT, 3),
  actionRetryDelayMs: toInt(process.env.ACTION_RETRY_DELAY_MS, 500),
};
