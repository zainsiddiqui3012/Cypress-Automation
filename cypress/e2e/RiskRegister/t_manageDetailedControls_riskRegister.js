import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";

/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />

////Data Provider ///

const ApplicableFlyer = require('../../fixtures/RiskModule/Risk Register/ApplicableFlyer.json')
const RiskRegisterForm_ManageDetailedControl = require('../../fixtures/RiskModule/Manage Detailed Controls/RiskRegisterForm_ManageDetailedControl.json')
const DetailFlyer_ManageDetailedControl = require('../../fixtures/RiskModule/Manage Detailed Controls/DetailFlyer_ManageDetailedControl.json')
const SurveyUpdate_InherentRiskProbabilityFlyer = require('../../fixtures/RiskModule/Manage Detailed Controls/SurveyUpdate_InherentRiskProbabilityFlyer.json')
const SurveyUpdate_InherentRiskImpactFlyer = require('../../fixtures/RiskModule/Manage Detailed Controls/SurveyUpdate_InherentRiskImpactFlyer.json')
const SurveyUpdate_ControlEnvironmentFlyer = require('../../fixtures/RiskModule/Manage Detailed Controls/SurveyUpdate_ControlEnvironmentFlyer.json')
const UpdateRiskRegisterGrid_ManageDetailedControl = require('../../fixtures/RiskModule/Manage Detailed Controls/UpdateRiskRegisterGrid_ManageDetailedControl.json')


//Data Provider ///
before(function () {
    cy.fixture('RiskModule/RiskCategoryName.json').then(function (data) {
        global.data = data;
    });

    cy.fixture('RiskModule/RiskDefintionName.json').then(function (rd) {
        global.rd = rd;
    });

});

describe("Risk Register Feature : Manage Detailed Controls Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskRegister_PO = new RiskRegister_PO();
    const scrollPage = new ScrollPage();


    /////*****Applicable flyer - Marked Applicable */
    ApplicableFlyer.forEach(test => {
        it(test.Applicable, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            riskRegister_PO.threeEllipsisMenu();
            riskRegister_PO.riskTaxonomyclick();
            riskRegister_PO.applicableMarked(test.BU2, rd.RiskDefinitionSearch);
            riskRegister_PO.saveRiskTaxonomy();

        })
    })
    RiskRegisterForm_ManageDetailedControl.forEach(test => {
        it("Risk Register Manage Detailed Controls Feature Automation, Search Risk Instance and Add Inherent / Residual - Likelihood and Impact", () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);
            riskRegister_PO.searchRiskInstance(rd.RiskDefinitionSearch);
            // ****Risk Icon Click */
            cy.get('.ag-group-contracted > .ag-icon').click();
            cy.wait(5000);
            riskRegister_PO.manageDetailControls(test.Approach, test.Q1InherentLikelihood, test.Q2InherentLikelihood, test.Q1InherentImpact, test.Q2InherentImpact, test.ControlAdd, test.Effectiveness, test.Implemented, test.ControlStrength, test.Q1Assessed, test.Q2Assessed, test.ResidualLikelihood, test.ResidualImpact);

        })

    })

    // ///****Risk Instance Detial Flyer from Risk Register  ***/
    DetailFlyer_ManageDetailedControl.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);
            scrollPage.scrollPageBottomRight({ force: true });
            riskRegister_PO.clickThreeEllpsiseRiskInstance();
            riskRegister_PO.detailFlyerRiskInstance(test.RiskInstanceDescription, test.PersonsResponsible, test.Frequency, test.TimesPer, test.FrequencyExplanation, test.Outcome, test.OutcomeDescription, test.ManagementComments, test.Context);
            cy.wait(5000);
        })

    })

    // ///****Risk Register grid data Edited  ***/
    UpdateRiskRegisterGrid_ManageDetailedControl.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);

            /////Coloumn Add from right side (Residual Coloumn)
            // cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right > div.ag-side-buttons > div:nth-child(1) > button > span').click()
            // cy.wait(3000);
            // cy.xpath('//*[@id="myGrid"]/div/div[2]/div[3]/div[2]/div[2]/div[2]/div[2]/div[3]/div[2]').type("Residual").type('{enter}');
            // cy.wait(3000);
            // cy.get('#myGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > :nth-child(1) > .ag-side-button-button > .ag-side-button-label').click()
            // cy.wait(3000); 
            
            riskRegister_PO.riskRegisterGridEdit(test.Approach, test.ControlAdd, test.Effectiveness, test.Implemented);
        })
    })

    // ///****Risk Inherent Risk Probability Flyer from Risk Register  ***/
    SurveyUpdate_InherentRiskProbabilityFlyer.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);
            scrollPage.scrollPageBottomRight({ force: true });
            riskRegister_PO.clickThreeEllpsiseRiskInstance();
            riskRegister_PO.inherentRiskProbabilityFlyer(test.Q1InherentLikelihood, test.Q2InherentLikelihood);
        })
    })

    // ///****Risk Inherent Risk Impact Flyer from Risk Register  ***/
    SurveyUpdate_InherentRiskImpactFlyer.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);
            scrollPage.scrollPageBottomRight({ force: true });
            riskRegister_PO.clickThreeEllpsiseRiskInstance();
            riskRegister_PO.inherentRiskImpactFlyer(test.Q1InherentImpact, test.Q2InherentImpact);
        })
    })

    // ///****Risk Control Environment from Risk Register  ***/
    SurveyUpdate_ControlEnvironmentFlyer.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username1"), Cypress.env("password1"), Cypress.env("key1"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height
            cy.wait(3000);
            scrollPage.scrollPageBottomRight({ force: true });
            riskRegister_PO.clickThreeEllpsiseRiskInstance();
            riskRegister_PO.controlEnvironmenttAssessment(test.Q1Assessed, test.Q2Assessed);
        })
    })
})