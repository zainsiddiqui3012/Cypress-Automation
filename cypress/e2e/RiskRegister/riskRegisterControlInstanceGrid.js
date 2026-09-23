import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///
const ControlGrid = require("../../fixtures/RiskModule/Risk Register/ControlGrid.json");
const LinkControlGrid = require("../../fixtures/RiskModule/Risk Register/LinkControlGrid.json");
const RiskRegisterGridValueUpdate = require("../../fixtures/RiskModule/Risk Register/RiskRegisterGridValueUpdate.json");

//Data Provider ///
before(function () {
  cy.fixture("RiskModule/Control_Taxonomy/ControlCategoryMapping.json").then(
    function (data) {
      global.data = data;
      cy.fixture("RiskModule/RiskDefintionName.json").then(function (testdata) {
        global.testdata = testdata;
      });
    }
  );
});

describe("Control Instance Automation from Inline editor Grid Risk Register Screen", () => {
  const riskRegister_PO = new RiskRegister_PO();
  const scrollPage = new ScrollPage();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  beforeEach(function () {
    cy.loginWithSession(
      "login with Risk Management User",
      Cypress.env("username"),
      Cypress.env("password"),
      Cypress.env("key")
    );
    cy.visitRiskRegister();
    cy.get("#myGrid").getAgGridData();
  });

  /////***Add Control Instance */
  LinkControlGrid.forEach((test) => {
    it(test.name2, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(10000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(testdata.RiskDefinitionSearch);
      scrollPage.scrollPageCenterRight({ force: true });
      riskRegister_PO.addControlGrid(data.ControlCategoryTreeMapping);
      cy.wait(3000);
    });
  });

  /////***Link Control Intance */
  LinkControlGrid.forEach((test) => {
    it(test.name1, () => {
     cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(10000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(testdata.RiskDefinitionSearch);
      // cy.wait(5000);
      scrollPage.scrollPageCenterRight({ force: true });
      riskRegister_PO.linkControlGrid(test.ControlTypes);
    });
  });

  ///****Update Control instance data  ***/
  ControlGrid.forEach((test) => {
    it(test.name, () => {
       cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(10000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(testdata.RiskDefinitionSearch);
      scrollPage.scrollPageCenterRight({ force: true });
      riskRegister_PO.controlGrid(
        test.ControlName,
        test.Effectiveness,
        test.Implemented,
        test.Weight
      );
      scrollPage.controlInlineEditorscrollPage({ force: true });
      riskRegister_PO.editControlValueGrid(test.Description, test.ControlType);
    });
  });

  it("Validation for Control Instance Grid - Inline editor", () => {
     cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(10000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(testdata.RiskDefinitionSearch);
    scrollPage.scrollPageCenterRight();
    riskRegister_PO.validationControlGrid(data.ControlCategoryTreeMapping);
    cy.wait(5000);
  });

  ///****Risk Register Grid values Updated Successfully ***/
  RiskRegisterGridValueUpdate.forEach((test) => {
    it(test.name, () => {
 cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(10000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(testdata.RiskDefinitionSearch);
      riskRegister_PO.addResidualColumnInGrid();
      riskRegister_PO.editRiskRegisterGridData(
        test.RiskName,
        test.Edit_Approach,
        test.Edit_InherentLikelihood,
        test.Edit_InherentImpact,
        test.Edit_ResidualLikelihood,
        test.Edit_ResidualImpact
      );
      cy.wait(5000);
    });
  });
});
