// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// ไฟล์: cypress/support/commands.js

Cypress.Commands.add('login', (username, password) => {
  // 🌟 สังเกตไหมว่า cy.visit ใส่แค่ '/login' ได้เลย เพราะเรามี baseUrl แล้ว!
  cy.visit('/login') 
  cy.get('input[placeholder="Username"]').type(username)
  cy.get('input[placeholder="Password"]').type(password)
  cy.get('button[type="submit"]').click()
})