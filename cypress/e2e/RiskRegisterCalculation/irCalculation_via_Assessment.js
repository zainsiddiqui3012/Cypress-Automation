//***********Risk Register Feature (Enabled : Use Assessments to Calculate Inherent Risk)-(Disabled :  Manage Detailed Controls) */

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
const ir_Assessment = require("../../fixtures/RiskModule/RiskCalculation/ir_Assessment.json");
/////*****IR via Assessment Calculation */
const ir__via_Assessment_Calculation_Data = require("../../fixtures/RiskModule/RiskCalculation/ir__via_Assessment_Calculation_Data.json");

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
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
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
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
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
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitser2Click();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      riskRegister_PO.threeEllipsisMenu();
      riskRegister_PO.riskTaxonomyclick();
      riskRegister_PO.applicableMarked(test.BU2, data.riskItemSearch);
      riskRegister_PO.saveRiskTaxonomy();
    });
  });
});

describe("Inherent Risk Calculation via Assessment (Feature : Enabled -Use Assessments to Calculate Inherent Risk and Disabled :  Manage Detailed Controls)", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();
  const scrollPage = new ScrollPage();

  ir_Assessment.forEach((test) => {
    it("Search Risk Instance and Add Inherent / Residual - Likelihood, and Impact, from Risk Register Grid - Risk Calculation-via-Assessment", () => {
      //Login Details
      cy.log(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitser2Click();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.wait(3000);

      riskRegister_PO.searchRiskInstance(rd.RiskDefinitionSearch);
      scrollPage.scrollPageCenterRight({ force: true });

      // ****Risk Icon Click */
      cy.get(".ag-group-contracted > .ag-icon").click();
      cy.wait(5000);
      riskRegister_PO.useAssessmentstoCalculateInherentRisk_Enabled(
        test.Approach,
        test.Q1InherentLikelihood,
        test.Q2InherentLikelihood,
        test.Q1InherentImpact,
        test.Q2InherentImpact,
        test.Effectiveness,
        test.Implemented,
        test.ControlStrength,
        test.Q1Assessed,
        test.Q2Assessed,
        test.ResidualLikelihood,
        test.ResidualImpact
      );
      riskRegister_PO.inherent_Likeihood_SurveyLable_RiskRegister();
      riskRegister_PO.inherent_Impact_SurveyLable_RiskRegister();
      riskRegister_PO.inherentRiskCalculateValue();
    });
  });
});

describe("Risk Analysis Dimensions and Risk Register - Risk Calculation-via-Assessment", () => {
  const loginDetails_PO = new LoginDetails_PO();
  const predictMenu_PO = new PredictMenu_PO();
  const riskRegister_PO = new RiskRegister_PO();
  const scrollPage = new ScrollPage();
  const RiskCalculation_PO = new riskCalculation_PO();

  before(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  ir_Assessment.forEach((test) => {
    it("Risk Dimensions -  Inherent Risk - Calculation Verify", () => {
      //Login Details
      cy.log(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskAdministrationClick();
      predictMenu_PO.riskanalysisDimensionsClick();

      ////Inherent Risk - Calculation Verify////
      RiskCalculation_PO.tab1Dimensions_SurveyDataCheck();
      RiskCalculation_PO.tab2Dimensions_SurveyDataCheck();
      RiskCalculation_PO.tab3Dimensions_SurveyDataCheck();
    });
  });

  ir__via_Assessment_Calculation_Data.forEach((test) => {
    it("Inherent Risk - Risk Register - Calculation Verify", () => {
      //Login Details
      cy.log(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.visitUrl();
      loginDetails_PO.loginDetails(
        Cypress.env("username2"),
        Cypress.env("password2"),
        Cypress.env("key2")
      );
      loginDetails_PO.clickOn_LoginButton();

      predictMenu_PO.menuClick();
      predictMenu_PO.riskAndControlRegisterClick();
      predictMenu_PO.riskRegitser2Click();
      cy.get("#myGrid").getAgGridData();
      cy.viewport(2000, 1300); // Set viewport to width and height
      cy.wait(3000);

      scrollPage.scrollPageBottomRight({ force: true });
      riskRegister_PO.clickThreeEllpsiseRiskInstance();
      riskRegister_PO.clickOnControlFlyer();
      ///**Inherent Risk calaculation formula*/

      const IRisk = parseFloat(
        test.Likelihood_Lable * test.Impact_Lable
      ).toFixed(4);
      cy.log("===== C A L C U L A T E ", IRisk);
      cy.frameLoaded("#iframe-risk-register-control-modal");
      cy.wait(20000);
      cy.iframe("#iframe-risk-register-control-modal")
        .find(
          "div.form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1)"
        )
        .contains(IRisk);
    });
  });
});
