class LoginDetails_PO {
  visitUrl() {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit(Cypress.config("baseUrl"));
  }

  visitCPTLIssueForm() {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit(Cypress.env("CPTLIssueform"));
  }

  visitGWYDEMOIssueForm() {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit(Cypress.env("GWYDEMOIssueForm"));
  }
  visitCPDEMOIssueForm() {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit(Cypress.env("CPDEMOIssueForm"));
  }
  loginDetails(username, password, key) {
    cy.get("#username", { timeout: 20000 }).type(username);
    cy.get("#password", { timeout: 20000 }).type(password);
    cy.get("#customerKey", { timeout: 20000 }).type(key);
  }

  clickOn_LoginButton() {
    cy.get("#m_login_signin_submit > .btn").should("be.visible").click();
    cy.wait(10000);
    cy.get(".m-subheader__title").should("be.visible").contains("Welcome");
  }
}

export default LoginDetails_PO;
