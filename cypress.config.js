const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  requestTimeout: 10000,
  responseTimeout: 15000,
  pageLoadTimeout: 30000,
  viewportWidth: 1440,
  viewportHeight: 900,
  video: true,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 0,
    openMode: 0,
  },
  env: {
    automationExerciseApiUrl: "https://www.automationexercise.com/api",
    trelloActionUrl:
      "https://api.trello.com/1/actions/592f11060f95a3d3d46a987a",
    advantageCatalogApiUrl:
      "https://www.advantageonlineshopping.com/catalog/api/v1",
  },
  e2e: {
    testIsolation: true,
    baseUrl: "https://www.automationexercise.com",
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    blockHosts: [
      "googlesyndication.com",
      "*.googlesyndication.com",
      "doubleclick.net",
      "*.doubleclick.net",
      "googleadservices.com",
      "*.googleadservices.com",
      "googletagmanager.com",
      "*.googletagmanager.com",
      "google-analytics.com",
      "*.google-analytics.com",
      "adservice.google.com",
      "*.adservice.google.com",
    ],
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      return config;
    },
  },
});