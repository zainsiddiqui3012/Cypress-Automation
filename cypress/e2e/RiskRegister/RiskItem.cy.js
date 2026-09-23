import dataFile from "../../fixtures/RiskModule/RiskItem/DataFile.json";
import RiskItem from "../../support/POM/RiskModule_PO/RiskItem_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

describe('Risk Register - Numeric Field Validation', () => {
    const riskRegister = new RiskItem();
    const scrollPage = new ScrollPage();
      beforeEach(() => {
        cy.loginWithSession("login - with Risk Management",Cypress.env("username"),Cypress.env("password"),Cypress.env("key"));
      });

    it.skip('Verify Numeric Custom Field Restricts Non-Numeric Input', { tags: ["@release5.21", "@pd31220", "@regression"] }, () => {

        cy.visit(Cypress.env("RISK_REGISTER"));
        cy.waitForMyGridLoaderToDisappear(30000);
        scrollPage.scrollPageBottomRight({ force: true });
        // Click on the add button
        riskRegister.clickAddButton();

        // Enter a name in the risk item name field
        riskRegister.enterRiskItemName();

        // Scroll down and select a value from the dropdown
        riskRegister.selectRiskItemLevel();

        // Scroll down and validate numeric field input
        riskRegister.testNumericField();

        // Click Save button
        riskRegister.clickSaveButton();

        // Validate error message when the numeric field is empty
        cy.verifyToastMessageContains(dataFile.validationMessage, 20000);
        
        riskRegister.hideValidationMessage();

        // Enter valid numeric data and save again
        riskRegister.enterValidNumber();
        
        // Click Save button
        riskRegister.clickSaveButton();

        // Validate success toast message
        cy.verifyToastMessageText(dataFile.successMessage,20000);
      });

      it.skip('Verify that the edited Risk Item is successfully added and displayed in the grid, and the Numeric Custom Field is added and appears in the Custom Field column.', { tags: ["@release5.21","@pd31220","regression"] }, () => {
       
        cy.visit(Cypress.env("RISK_REGISTER"));
       
        // Search for the added risk item in the grid 
        riskRegister.searchAndVerifyRiskItem();
      });
});
