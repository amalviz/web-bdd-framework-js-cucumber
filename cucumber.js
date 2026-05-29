import { config } from './src/config/env.js';

const cucumberConfig = {
  paths: ['features/**/*.feature'],
  import: [
    'src/support/world.js',
    'src/support/hooks.js',
    'src/step-definitions/**/*.js',
  ],
  format: ['progress-bar', 'html:reports/cucumber-report.html'],
  formatOptions: {
    snippetInterface: 'async-await',
  },
};

if (config.scenarioRetryCount > 0) {
  cucumberConfig.retry = config.scenarioRetryCount;
  if (config.scenarioRetryTagFilter) {
    cucumberConfig.retryTagFilter = config.scenarioRetryTagFilter;
  }
}

export default cucumberConfig;
