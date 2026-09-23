import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///
const DetailFlyerRisk = require("../../fixtures/RiskModule/Risk Register/DetailFlyerRisk.json");
const ControlFlyerRisk = require("../../fixtures/RiskModule/Risk Register/ControlFlyerRisk.json");
const LinkControlFlyer = require("../../fixtures/RiskModule/Risk Register/LinkControlFlyer.json");
const RiskRegisterForm = require("../../fixtures/RiskModule/Risk Register/RiskRegisterForm.json");
const NegativeImpact = require("../../fixtures/RiskModule/Control_Taxonomy/AddEditNegativeImpact.json");

//Data Provider ///
before(function () {
  cy.fixture("RiskModule/RiskDefintionName.json").then(function (data) {
    global.data = data;
    cy.fixture("RiskModule/Control_Taxonomy/ControlCategoryMapping.json").then(
      function (testdata) {
        global.testdata = testdata;
        cy.fixture(
          "RiskModule/Control_Taxonomy/_Write_NegativeImpactMapping.json"
        ).then(function (ni) {
          global.ni = ni;
          cy.fixture(
            "RiskModule/Control_Taxonomy/_Write_SearchNegativeImpact.json"
          ).then(function (wr) {
            global.wr = wr;
          });
        });
      }
    );
  });
});

describe("Risk Item Instance three Ellipsis Options Risk Register Automation", () => {
  const riskRegister_PO = new RiskRegister_PO();
  const scrollPage = new ScrollPage();

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

  RiskRegisterForm.forEach((test) => {
    it("Search Risk Instance and Add Inherent / Residual - Likelihood and Impact from Risk Register Grid", () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.waitForMyGridLoaderToDisappear(15000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      //  cy.wait(5000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      riskRegister_PO.inherentResidualSelectionGrid(
        test.Approach,
        test.InherentLikelihood,
        test.InherentImpact,
        test.ResidualLikelihood,
        test.ResidualImpact
      );
      cy.wait(3000);
    });
  });

  ///****Risk Instance Detial Flyer from Risk Register  ***/
  DetailFlyerRisk.forEach((test) => {
    it(test.name, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      //cy.wait(3000);
      cy.waitForMyGridLoaderToDisappear(15000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.detailFlyerRiskInstance(
        test.RiskInstanceDescription,
        test.PersonsResponsible,
        test.Frequency,
        test.TimesPer,
        test.FrequencyExplanation,
        test.Outcome,
        test.OutcomeDescription,
        test.ManagementComments,
        test.Context
      );
      cy.wait(3000);
    });
  });

  // ///****Linked Control Instance from Control Flyer from Risk Register  ***/
  LinkControlFlyer.forEach((test) => {
    it(test.name, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      //cy.wait(3000);
      cy.waitForMyGridLoaderToDisappear(15000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.linkControlFlyer(test.ControlTypes);
    });
  });

  ///****Add Control Instance from Control Flyer from Risk Register  ***/
  ControlFlyerRisk.forEach((test) => {
    it(test.name, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      // cy.wait(3000);
      cy.waitForMyGridLoaderToDisappear(15000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.controlFlyerRiskInstance(
        testdata.ControlCategoryTreeMapping,
        test.ControlInstanceID,
        test.ControlName,
        test.ControlDescription,
        test.ControlTypes,
        test.ControlOwner,
        test.ControlTester,
        test.Effectiveness,
        test.Weight,
        test.Implemented,
        test.ControlStrength
      );
    });
  });

  ///****Add Negative Impact from Control Flyer from Risk Register  ***/
  NegativeImpact.forEach((test) => {
    it(test.nameAdd, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      //   cy.wait(3000);
      cy.waitForMyGridLoaderToDisappear(15000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.negativeImpactAdd(
        test.nameNegativeImpact,
        test.Effect,
        ni.ControlCategory_NegativeImpact
      );
    });
  });

  /****Edit Negative Impact from Control Flyer from Risk Register  ***/
  NegativeImpact.forEach((test) => {
    it(test.nameEdit, () => {
      cy.viewport(2000, 1300); // Set viewport to width and height
      // cy.wait(3000);
      cy.waitForMyGridLoaderToDisappear(25000);
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.restoreDefault();
      cy.waitForToastMessageToDisappear(10000);
      riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.negativeImpactEdit(
        test.nameNegativeImpact,
        test.EffectEdit,
        wr.Search_NegativeImpact
      );
    });
  });

  it("Audit Log Flyer open on Risk Register Grid Successfully", () => {
    cy.viewport(2000, 1300); // Set viewport to width and height
    //  cy.wait(7000);
    cy.waitForMyGridLoaderToDisappear(15000);
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.restoreDefault();
    cy.waitForToastMessageToDisappear(10000);
    riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
    scrollPage.scrollPageBottomRight({ force: true });
    riskRegister_PO.clickThreeEllpsiseRiskInstance();
    riskRegister_PO.auditLogFlyer();
  });

  ///****Delete Control Instance from Control Flyer from Risk Register  ***/
  it("Deleted Control instance Successfully from Control Flyer ", () => {

    cy.viewport(2000, 1300); // Set viewport to width and height
    cy.waitForMyGridLoaderToDisappear(25000);
    riskRegister_PO.threeEllipsisMenu();
    riskRegister_PO.restoreDefault();
    cy.waitForToastMessageToDisappear(10000);
    riskRegister_PO.searchRiskInstance(data.RiskDefinitionSearch);
    scrollPage.scrollPageBottomRight({ force: true });
    riskRegister_PO.clickThreeEllpsiseRiskInstance();
    riskRegister_PO.deleteControlFromFlyer();
  });
});
