import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const RiskCategory = require('../../fixtures/RiskModule/Risk Register/RiskCategory.json')
const RiskDefinition = require('../../fixtures/RiskModule/Risk Register/RiskDefinition.json')
const RiskItem = require('../../fixtures/RiskModule/Risk Register/RiskItem.json')
const Message = require('../../fixtures/RiskModule/Risk Register/Message.json')

//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskDefintionName.json').then(function (data) {
        global.data = data;
    });

});



describe("Risk Category Instance three Ellipsis Options Risk Register Automation", () => {
    const riskRegister_PO = new RiskRegister_PO();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    })

    beforeEach(function () {
     cy.loginWithSession(
      "login with Risk Management User",
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );
cy.visitRiskRegister();
cy.get("#myGrid").getAgGridData();
    })

    ///****Add Risk category from Risk Register Category Instance  ***/
    RiskCategory.forEach(test => {
        it(test.name, () => {
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.waitForMyGridLoaderToDisappear(10000)
             riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.restoreDefault();
            cy.waitForToastMessageToDisappear(10000);
            riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
            riskRegister_PO.riskInstanceThreeEllipsis();
            riskRegister_PO.riskInstanceThreeEllipsisAddRiskCategory(test.name, test.description);
            cy.wait(3000);
        })

    })

    ///****Add Risk Definition from Risk Register Category Instance  ***/
    RiskDefinition.forEach(test => {
        it(test.name, () => {
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.waitForMyGridLoaderToDisappear(15000);
             riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.restoreDefault();
            cy.waitForToastMessageToDisappear(10000);
            riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
            riskRegister_PO.riskInstanceThreeEllipsis();
            riskRegister_PO.riskInstanceThreeEllipsisAddRiskDefinition(test.definitionName, test.description);
            cy.wait(3000);
        })

    })

    ///****Add Risk Item from Risk Register Category Instance  ***/
    RiskItem.forEach(test => {
        it(test.name, () => {
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.waitForMyGridLoaderToDisappear(15000);
             riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.restoreDefault();
            cy.waitForToastMessageToDisappear(10000);
            riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
            riskRegister_PO.riskInstanceThreeEllipsis();
            riskRegister_PO.riskInstanceThreeEllipsisAddRiskItem(test.riskDefinition, test.riskName, test.riskdescription, test.approach, test.BU);
            cy.wait(3000);
        })
    })

    /****Add Messages from Risk Register Category Instance  ***/
    Message.forEach(test => {
        it(test.name, () => {
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.waitForMyGridLoaderToDisappear(15000);
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.restoreDefault();
            cy.waitForToastMessageToDisappear(10000);
            riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
            riskRegister_PO.riskInstanceThreeEllipsis();
            riskRegister_PO.riskInstanceThreeEllipsisMessage(test.Message);
        })

    })

})
