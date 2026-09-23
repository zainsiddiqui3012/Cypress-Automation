/**
 * Test Suite for Deleting Risk Register Risk
 * @module DeleteRiskRegisterTest
 */

import RiskRegisterPage from "../../support/POM/RiskModule_PO/DeleteRisk_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

describe(
  "Delete Risk Register Risk Test Suite",
  {
    tags: [
      "@release5.20.1",
      "@pd33724",
      "@regression",
      "@erm",
      "@risk",
      "@delete-risk",
      "@risk-register"
    ],
  },
  () => {
    const riskRegister_PO = new RiskRegister_PO();
    const scrollPage = new ScrollPage();
    /**
     * Sets up the login session before each test case.
     * Ensures user is authenticated before proceeding with tests.
     */
    beforeEach(() => {
      cy.loginWithSession(
        "login - with Risk Management",
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
    });

    /**
     * Test Case: Deletes a risk from the Risk Register successfully.
     * This test case validates that a risk item is deleted and the success toast message appears.
     * @tags ["@smoke", "@pd31180", "@pd33725"]
     * @pd31180 This Ticket ID is a Bug Ticket ID.
     */
    it(
      "Verify that a risk is successfully deleted from the Risk Register",
      {
        tags: ["@smoke", "@pd31180", "@pd33725"],
      },
      () => {
        cy.viewport(2000, 1300); // Set viewport to width and height
        cy.visitRiskRegister();
        cy.waitForMyGridLoaderToDisappear(10000);
        riskRegister_PO.threeEllipsisMenu();
        riskRegister_PO.restoreDefault();
        cy.waitForToastMessageToDisappear(10000);
        RiskRegisterPage.searchAndVerifyRiskItem();
        scrollPage.scrollPageBottomRight({ force: true });
        RiskRegisterPage.openRiskDetails();
        RiskRegisterPage.deleteRisk();
        RiskRegisterPage.verifyDeletionToast();
      }
    );

    /**
     * Test Case: Verifies that the deleted risk is not displayed in the grid.
     * Confirms that the risk item no longer appears in the grid after deletion.
     * @tags ["@smoke", "@pd31180", "@pd33726"]
     * @pd31180 This Ticket ID is a Bug Ticket ID.
     */
    it(
      "Verify Risk is Not Displayed in the Grid After Deletion",
      {
        tags: ["@smoke", "@pd31180", "@pd33726"],
      },
      () => {
        
        cy.viewport(2000, 1300); // Set viewport to width and height
        cy.visitRiskRegister();
        cy.waitForMyGridLoaderToDisappear(10000);
        riskRegister_PO.threeEllipsisMenu();
        riskRegister_PO.restoreDefault();
        cy.waitForToastMessageToDisappear(10000);
        RiskRegisterPage.searchAndVerifyRiskItem();
        RiskRegisterPage.verifyRiskNotPresent();
      }
    );
  }
);
