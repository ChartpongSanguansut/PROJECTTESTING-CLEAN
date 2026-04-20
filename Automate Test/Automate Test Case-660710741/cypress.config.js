// ไฟล์: cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://su-courtbooking.vercel.app', // 🌟 โค้ชเบิ้มให้เพิ่มบรรทัดนี้!
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});