const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      charts: true
    }
  },
  e2e: {
    baseUrl: 'http://localhost:3000', // Change if your app is hosted elsewhere
    experimentalStudio: true,

    // SLOW TIMEOUTS
    defaultCommandTimeout: 100000,     // Wait up to 10s for commands like cy.get()
    requestTimeout: 200000,            // Wait up to 20s for API requests
    responseTimeout: 300000,           // Wait up to 30s for API responses
    pageLoadTimeout: 600000,           // Wait up to 60s for page loads

    setupNodeEvents(on, config) {
      // You can use this to add plugins or log info
      console.log('Cypress config loaded');
    }
  }
});
