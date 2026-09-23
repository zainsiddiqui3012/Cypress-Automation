// loginFunction.js

import LoginDetails_PO from '../LoginPredict_PO/LoginDetails_PO';

const loginFunction = () => {
  const loginDetails_PO = new LoginDetails_PO();
  cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
  loginDetails_PO.visitUrl();
  loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
  loginDetails_PO.clickOn_LoginButton();
};

export default loginFunction;
