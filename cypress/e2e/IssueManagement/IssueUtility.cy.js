import IssueUtility from "../../support/POM/IssueManagement_PO/IssueUtility";

describe("Issue Management Utility", () => {
  const issueUtility = new IssueUtility();
  const withoutRM = Cypress.env("ISSUE_USER");

  beforeEach(() => {
    cy.session("login - ", () => {
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withoutRM.USERNAME, withoutRM.PASSWORD, withoutRM.KEY);
    });
  });

  it("", () => {
    cy.visitIssueManagementDashboard();
    issueUtility.clickButton("Create Task");
  });
});
