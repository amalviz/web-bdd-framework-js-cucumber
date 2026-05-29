# Web BDD Framework (JavaScript + Selenium + Cucumber)

A BDD test automation framework using **JavaScript**, **Selenium WebDriver**, and **Cucumber**. It supports both **web UI** and **REST API** tests with reusable action layers.

## Tech stack

| Layer | Library |
|-------|---------|
| Language | JavaScript (ES modules) |
| BDD | [@cucumber/cucumber](https://github.com/cucumber/cucumber-js) |
| Web | [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) |
| API | [axios](https://axios-http.com/) |
| Assertions | [chai](https://www.chaijs.com/) |

## Project structure

```
├── features/
│   ├── web/                 # Sample UI feature files
│   └── api/                 # Sample API feature files
├── src/
│   ├── actions/
│   │   └── WebActions.js    # Reusable Selenium UI methods
│   ├── api/
│   │   ├── ApiClient.js     # HTTP client wrapper
│   │   └── ApiActions.js    # Reusable API methods
│   ├── config/
│   │   └── env.js           # Environment configuration
│   ├── drivers/
│   │   └── WebDriverFactory.js
│   ├── pages/               # Page Object Model
│   ├── step-definitions/
│   └── support/
│       ├── hooks.js         # Before/After hooks
│       └── world.js         # Shared test context
├── cucumber.js
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- Google Chrome (for web tests)

## Setup

```bash
npm install
cp .env.example .env
```

## Running tests

```bash
# All tests (web + API)
npm test

# Web tests only
npm run test:web

# API tests only
npm run test:api

# Run with visible browser
npm run test:headed

# Generate HTML report
npm run test:report
```

Reports are written to `reports/cucumber-report.html`. Failed web scenarios also save screenshots under `reports/`.

## Configuration

Edit `.env` (see `.env.example`):