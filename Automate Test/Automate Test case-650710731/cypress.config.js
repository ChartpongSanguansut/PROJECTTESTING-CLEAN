const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter', // [สำคัญ 1] บอกให้ใช้ตัวออก Report
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on); // [สำคัญ 2] ลงทะเบียนปลั๊กอิน
    },
  },
});