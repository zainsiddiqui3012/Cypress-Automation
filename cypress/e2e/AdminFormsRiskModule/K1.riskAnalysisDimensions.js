import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskAnalysisDimensions_PO from "../../support/POM/RiskModule_PO/RiskAnalysisDimensions_PO";


/// <reference types= "cypress" />

////Data Provider ///
const RiskAnalysisDimensions = require('../../fixtures/RiskModule/Risk Dimensions/RiskAnalysisDimensions.json')
const RelativeMagnitudes = require('../../fixtures/RiskModule/Risk Dimensions/RelativeMagnitudes.json')
const ControlStrengthDimensions = require('../../fixtures/RiskModule/Risk Dimensions/ControlStrengthDimensions.json')
const EditRiskAnalysisDimensions = require('../../fixtures/RiskModule/Risk Dimensions/EditRiskAnalysisDimensions.json')
const EditRelativeMagnitudes = require('../../fixtures/RiskModule/Risk Dimensions/EditRelativeMagnitudes.json')
const EditControlStrengthDimensions = require('../../fixtures/RiskModule/Risk Dimensions/EditControlStrengthDimensions.json')
const ValidationRiskAnalysisDimensions = require('../../fixtures/RiskModule/Risk Dimensions/ValidationRiskAnalysisDimensions.json')
const ValidationRelativeMagnitudes = require('../../fixtures/RiskModule/Risk Dimensions/ValidationRelativeMagnitudes.json')
const ValidationControlStrengthDimensions = require('../../fixtures/RiskModule/Risk Dimensions/ValidationControlStrengthDimensions.json')


describe("Risk Analysis Dimensions Screen Automation", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskAnalysisDimensions_PO = new RiskAnalysisDimensions_PO();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    });


    it("Risk Dimensions -  Color Assign Tab1 and Tab 2", () => {

        //Login Details
        cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
        loginDetails_PO.clickOn_LoginButton();

        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskAdministrationClick();
        predictMenu_PO.riskanalysisDimensionsClick();
        riskAnalysisDimensions_PO.ColorSetupTab1();
        riskAnalysisDimensions_PO.savebutton();

        riskAnalysisDimensions_PO.ColorSetupTab2();
        riskAnalysisDimensions_PO.savebutton();
    });

  /*  RiskAnalysisDimensions.forEach(test => {
        it.skip(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3Click();
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3label1(test.lable1, test.lable1_Value);
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3label2(test.lable2, test.lable2_Value);
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3label3(test.lable3, test.lable3_Value);
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3label4(test.lable4, test.lable4_Value);
            // riskAnalysisDimensions_PO.addbutton();
            // riskAnalysisDimensions_PO.tab3label5(test.lable5,test.lable5_Value);
            riskAnalysisDimensions_PO.savebutton();


        });

    });*/

    EditRiskAnalysisDimensions.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3Click();
            // riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.editriskAnalysisDimensionsTab3label(test.lable1, test.lable1_Value, test.lable2, test.lable2_Value, test.lable3, test.lable3_Value, test.lable4, test.lable4_Value);
            riskAnalysisDimensions_PO.savebutton();


        });

    });

   /* RelativeMagnitudes.forEach(test => {
        it.skip(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.relativeMagnitudesTab4Click();
            // riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.relativeMagnitudesSetupTab4(test.Lable1, test.Lable1_Value, test.Lable2, test.Lable2_Value, test.Lable3, test.Lable3_Value, test.Lable4, test.Lable4_Value, test.Lable5, test.Lable5_Value)
            riskAnalysisDimensions_PO.savebutton();


        });

    });*/

    EditRelativeMagnitudes.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.relativeMagnitudesTab4Click();
            // riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.editRelativeMagnitudesSetupTab4(test.Lable1, test.Lable1_Value, test.Lable2, test.Lable2_Value, test.Lable3, test.Lable3_Value, test.Lable4, test.Lable4_Value, test.Lable5, test.Lable5_Value)
            riskAnalysisDimensions_PO.savebutton();


        });

    });


   /* ControlStrengthDimensions.forEach(test => {
        it.skip(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.contrlStrengthDimensionsTab5Click();
            // riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.contrlStrengthDimensionsTab5(test.Lable1, test.Lable1_Value, test.Guidance1, test.Lable2, test.Lable2_Value, test.Guidance2, test.Lable3, test.Lable3_Value, test.Guidance3, test.Lable4, test.Lable4_Value, test.Guidance4, test.Lable5, test.Lable5_Value, test.Guidance5)
            riskAnalysisDimensions_PO.savebutton();

        });

    });*/

    EditControlStrengthDimensions.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.contrlStrengthDimensionsTab5Click();
            // riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.editContrlStrengthDimensionsTab5(test.Lable1, test.Lable1_Value, test.Guidance1, test.Lable2, test.Lable2_Value, test.Guidance2, test.Lable3, test.Lable3_Value, test.Guidance3, test.Lable4, test.Lable4_Value, test.Guidance4, test.Lable5, test.Lable5_Value, test.Guidance5)
            riskAnalysisDimensions_PO.savebutton();

        });

    });
    /////*** Validation cases */ ****/////
    ValidationRiskAnalysisDimensions.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.riskAnalysisDimensionsTab3Click();
            riskAnalysisDimensions_PO.validationriskAnalysisDimensions(test.lable4_Value);
                
            ///Validation Check for Empty Records"
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.savebutton();
            
        });

    });

    ValidationRelativeMagnitudes.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.relativeMagnitudesTab4Click();
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.savebutton();
            cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.')

            ////Validation Check for Empty Records
            riskAnalysisDimensions_PO.validationRelativeMagnitudes(test.label6, test.lable6_Value);
            riskAnalysisDimensions_PO.savebutton();
            cy.get('.toast').contains('Error saving Dimensions. Each dimension should have unique value')


        });

    });

    ValidationControlStrengthDimensions.forEach(test => {
        it(test.name, () => {

            //Login Details
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskAdministrationClick();
            predictMenu_PO.riskanalysisDimensionsClick();
            riskAnalysisDimensions_PO.contrlStrengthDimensionsTab5Click();
            riskAnalysisDimensions_PO.addbutton();
            riskAnalysisDimensions_PO.savebutton();
            cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.')

            ////Validation Check for Empty Records
            riskAnalysisDimensions_PO.validationContrlStrengthDimensions(test.Lable6, test.Lable6_Value, test.Guidance6);
            riskAnalysisDimensions_PO.savebutton();
            // cy.get('.toast').contains('Value is already selected')

        });

    });

});