//***********Risk Register Feature (Enabled :  Manage Detailed Controls)-(Disabled : Use Assessments to Calculate Inherent Risk) */

import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import RiskAnalysisDimensions_PO from "../../support/POM/RiskModule_PO/RiskAnalysisDimensions_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";
import riskCalculation_PO from "../../support/POM/RiskModule_PO/riskCalculation_PO";

/// <reference types= "cypress" />

////Data Provider ///
const riskCategory = require("../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json");
const riskDefinition = require("../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json");
const ApplicableFlyer = require("../../fixtures/RiskModule/Risk Register/ApplicableFlyer.json");
const RiskRegisterLabels = require("../../fixtures/RiskModule/RiskCalculation/RiskRegisterLabels.json");

//Data Provider ///
before(function () {
  cy.fixture("RiskModule/RiskCategoryName.json").then(function (data) {
    global.data = data;
  });

  cy.fixture("RiskModule/RiskDefintionName.json").then(function (rd) {
    global.rd = rd;
  });
});

describe("Risk Category Screen Automation - Risk Calculation", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskCategory_PO = new RiskCategory_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  riskCategory.forEach((test) => {
    it("Add Category Successfully for Calculation", () => {
      //Login Details
      cy.log(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskAdministrationClick();
      predictMenu_PO.riskTaxonomyClick();
      riskCategory_PO.clickOnMyTaxonomiesTab();
      riskCategory_PO.addCategoryButton();
      riskCategory_PO.addCategoryInfo(
        test.riskCategoryID,
        test.riskName,
        test.description
      );
      riskCategory_PO.savebutton();
    });
  });
});

describe("Risk Defintion Screen Automation - Risk Calculation", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskDefinition_PO = new RiskDefinition_PO();
  const riskCategory_PO = new RiskCategory_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  ///**Add Risk Definition into Category */
  riskDefinition.forEach((test) => {
    it("Add Risk Defintion Successfully for Calculation", () => {
      //Login Details
      cy.log(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskAdministrationClick();
      predictMenu_PO.riskTaxonomyClick();
      riskCategory_PO.clickOnMyTaxonomiesTab();
      riskDefinition_PO.addDefinitionButton();
      riskDefinition_PO.addDefinitionInfo(
        test.riskDefinitionId,
        test.definitionName,
        test.description
      );
      riskDefinition_PO.savebutton();
      cy.wait(7000);
    });
  });
});

describe("Mark Applicable from Risk Register Three Ellipsis Options - Risk Calculation", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  /////*****Applicable flyer - Marked Applicable */
  ApplicableFlyer.forEach((test) => {
    it(test.Applicable, () => {
      //Login Details
      cy.log(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.applicableMarked(test.BU2, data.riskItemSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });
});

describe("Inherent Risk and Residual Risk Calculation via Risk Analysis Dimensions  (Feature : Disable -Use Assessments to Calculate Inherent Risk and Feature : Enabled - Manage Detailed Controls))", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();

  RiskRegisterLabels.forEach((test) => {
    it("Search Risk Instance and Add Inherent / Residual - Likelihood, and Impact, from Risk Register Grid - Risk Calculation", () => {
      //Login Details
      cy.log(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.wait(5000);
      riskRegister_PO.searchRiskInstance(rd.RiskDefinitionSearch);
      ////****Risk Icon Click */
      cy.get(".ag-group-contracted > .ag-icon").should("be.visible").click();
      cy.wait(6000);
      riskRegister_PO.inherentResidualSelectionGrid(
        test.Approach,
        test.InherentLikelihood,
        test.InherentImpact,
        test.ResidualLikelihood,
        test.ResidualImpact
      );
      riskRegister_PO.controlsGridValues(test.Effectiveness, test.Implemented);
      riskRegister_PO.inherentRiskCalculateValue();
      // riskRegister_PO.residualRiskCalculateVale();
      cy.wait(5000);
    });
  });
});

describe("Risk Analysis Dimensions and Risk Register - Calculation", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();
  const scrollPage = new ScrollPage();
  const RiskCalculation_PO = new riskCalculation_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  RiskRegisterLabels.forEach((test) => {
    it("Risk Dimensions -  Inherent Risk - Calculation Verify", () => {
      //Login Details
      cy.log(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskAdministrationClick();
      predictMenu_PO.riskanalysisDimensionsClick();
      RiskCalculation_PO.riskDimensionsTab1(
        test.Likelihood_Tab1_Label,
        test.Likelihood_Tab1_Value,
        test.Likelihood_Tab1_LabelResidual,
        test.Likelihood_Tab1_ValueResidual
      );
      RiskCalculation_PO.riskDimensionsTab2(
        test.Impact_Tab2_Label,
        test.Impact_Tab2_Value,
        test.Impact_Tab2_LabelResidual,
        test.Impact_Tab2_ValueResidual
      );
      RiskCalculation_PO.riskDimensionsTab3();
      ///**Click on Profile */
      RiskCalculation_PO.clickOnprofileButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitserClick();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.wait(3000);

      scrollPage.scrollPageCenterRight({ force: true });
      ///Verify Inherent Risk value - Risk Register*///
      RiskCalculation_PO.iRiskValueCheck();
      ///Verify Residual Risk value - Risk Register*///
      // RiskCalculation_PO.rrRiskValueCheck();

      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.clickOnControlFlyer();
      ///**Inherent Risk calaculation formula*/
      const IR = parseFloat(
        test.Likelihood_Tab1_Value * test.Impact_Tab2_Value
      ).toFixed(4);
      // const IR = test.Likelihood_Tab1_Value * test.Impact_Tab2_Value
      cy.log("===== C A L C U L A T E ", IR);
      cy.frameLoaded("#iframe-risk-register-control-modal");
      cy.wait(10000);
      cy.iframe("#iframe-risk-register-control-modal")
        .find(
          "div.form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)"
        )
        .contains(IR);
    });
  });
});
