const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalStudio: true,
    defaultCommandTimeout: 200000,
    requestTimeout: 200000,
    responseTimeout: 600000,
    pageLoadTimeout: 1200000,

    setupNodeEvents(on, config) {
      // You can add plugins or event hooks here later
    }
  },

  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    charts: true
  }
});
