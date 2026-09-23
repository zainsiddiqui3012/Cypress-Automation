/**
 * @file ActiveRiskDefinition.cy.js
 * @description Test Suite for Adding and Verifying Risk Items in the Risk Applicability Flyer
 */

import RiskItem from "../../support/POM/RiskModule_PO/RiskItem_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

describe(
  "Add and Verify Risk Item Test Suite",
  {
    tags: [
      "@release5.20.2",
      "@pd33749",
      "@regression",
      "@erm",
      "@risk",
      "@risk-apllicability-flyer",
      "@risk-register",
    ],
  },
  () => {
    const riskRegister = new RiskItem();
    const riskRegister_PO = new RiskRegister_PO();
    const scrollPage = new ScrollPage();

    /**
     * Logs in before each test case using session and visits the Risk Register
     */
    beforeEach(() => {
      cy.loginWithSession(
        "login - with Risk Management",
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      cy.visitRiskRegister();
    });

    /**
     * Test Case 1: Add Risk Item Successfully
     * @description Adds a risk item to the Risk Register with valid details
     * @pd31993 This Ticket ID is a Bug Ticket ID.
     */
    it(
      "Verify that the Risk Item added successfully",
      {
        tags: ["@smoke", "@pd31993", "@pd33785"],
      },
      () => {
        cy.viewport(2000, 1300); // Set viewport to width and height
        cy.waitForMyGridLoaderToDisappear(10000);
        riskRegister_PO.threeEllipsisMenu();
        riskRegister_PO.restoreDefault();
        cy.waitForToastMessageToDisappear(10000);
        scrollPage.scrollPageBottomRight({ force: true });
        // Adding a new Risk Item
        riskRegister.clickAddButton();
        riskRegister.enterRiskItemName();
        riskRegister.selectRiskItemLevel();
        riskRegister.clickSaveButton();
      }
    );

    /**
     * Test Case 2: Verify Risk Item is Not Displayed in Flyer Grid
     * @description Confirms the recently added risk item is not displayed in the applicability flyer grid
     * @pd31993 This Ticket ID is a Bug Ticket ID.
     */
    it(
      "Should verify that the created Draft status Risk Item is not displayed in the applicability Flyer Grid after deletion",
      {
        tags: ["@smoke", "@pd31993", "@pd33796"],
      },
      () => {
        riskRegister.openRiskApplicabilityFlyer();
      }
    );
  }
);
