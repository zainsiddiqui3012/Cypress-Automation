import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO.js";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO.js";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO.js";
import EditAndExitReview_PO from "../../support/POM/STARTRCSA_PO/EditAndExitReviewMode_PO.js";
import Start_RCSA_PO from "../../support/POM/STARTRCSA_PO/Start_RCSA_PO.js";
import Switch_Review_Mode_PO from "../../support/POM/STARTRCSA_PO/Switch_Review_Mode_PO.js";


/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const RCSA_Process = require('../../fixtures/RCSAAuditLog/StartRCSAScreen.json')
const Switch_Review_Mode = require('../../fixtures/RCSAAuditLog/SwitchReviewMode.json')
const EditAndExitReviewMode = require('../../fixtures/RCSAAuditLog/EditAndExitReviewmode.json')

describe("Switch to Edit and Exit Review Mode, Switch To Exit Review Mode, Switch To Edit Review Mode, Modal Visiblity, Toggle btn validation, Cancel btn validation, Risk Review Dropdown validation, Select Parent and Child Ticket in dropdown, Switch To Task, Mark Review, Progress Field Validation on Ticket,", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskRegister_PO = new RiskRegister_PO();
    const start_RCSA_PO = new Start_RCSA_PO();
    const switch_Review_Mode_PO = new Switch_Review_Mode_PO();
    const editAndExitReview_PO = new EditAndExitReview_PO();



    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })

///*****Risk Register - Switch To Exit Review Mode*/
EditAndExitReviewMode.forEach(test => {
    it(test.ClickOnExitReviewTab, () => {

        cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskRegitserClick();
        editAndExitReview_PO.threeEllipsisMenu();
        switch_Review_Mode_PO.switch_Review_Mode_flyer();
          cy.get("#myGrid").getAgGridData();
        switch_Review_Mode_PO.selectOpenParentRiskReviewID();
        switch_Review_Mode_PO.clickonclosebtn();
        switch_Review_Mode_PO.assertSwitchReviewToosterMessage();
        cy.viewport(2000, 1300)
        switch_Review_Mode_PO.ScrollRight();
       editAndExitReview_PO.threeEllipsisMenu();
        switch_Review_Mode_PO.validateExitReviewTab();

    })
}) 


/////*****Edit Review Mode - Validate Modal text, Toogle btn, Cancel btn, Parent Ticket ID's arrangement*/
EditAndExitReviewMode.forEach(test => {
    it(test.EditReviewModalCases, () => {

        cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.visitUrl();
        loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
        loginDetails_PO.clickOn_LoginButton();
        predictMenu_PO.menuClick();
        predictMenu_PO.riskAndControlRegisterClick();
        predictMenu_PO.riskRegitserClick();
        editAndExitReview_PO.threeEllipsisMenu();
        switch_Review_Mode_PO.switch_Review_Mode_flyer();
          cy.get("#myGrid").getAgGridData();
        switch_Review_Mode_PO.selectOpenParentRiskReviewID();
        switch_Review_Mode_PO.clickonclosebtn();
        switch_Review_Mode_PO.assertSwitchReviewToosterMessage();
        switch_Review_Mode_PO.ScrollRight();
        editAndExitReview_PO.threeEllipsisMenu();
        editAndExitReview_PO.validateEditReviewTab();
    })
}) 

   //current

    /////*****To check the RCSA Process Should Start with MultiSelect Business Unit*/
    RCSA_Process.forEach(test => {
        it(test.RCSAProcessFromMultiSelectBusinessUnit, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300)   
            riskRegister_PO.threeEllipsisMenu();
            start_RCSA_PO.startrcsaflyer();
            start_RCSA_PO.assertmodalTitle();
            start_RCSA_PO.selectdatefrombothinputfield();
            start_RCSA_PO.BusinessUnit_MultiSelect(test.BusinessUnit01, test.BusinessUnit02);
            start_RCSA_PO.RCSA_Popup_Save_btn();
         })

    })
    /////*****Edit Review Mode - Select Parent and Child Ticket goto Switch to Open Task and Mark Review */
    EditAndExitReviewMode.forEach(test => {
        it(test.MarkReviewFromEditReviewMode, () => {

            //Login Details
            cy.log(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("rcsa_username"), Cypress.env("rcsa_password"), Cypress.env("rcsa_key"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) 
            riskRegister_PO.threeEllipsisMenu();
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.selectOpenParentRiskReviewID();
            switch_Review_Mode_PO.selectOpenChildRiskReviewID();
            switch_Review_Mode_PO.clickonclosebtn();
            switch_Review_Mode_PO.assertSwitchReviewToosterMessage();
            //Goto Edit Review Tab
            editAndExitReview_PO.threeEllipsisMenu();
            editAndExitReview_PO.validateEditReviewTab();
            switch_Review_Mode_PO.selectOpenChildRiskReviewID();
            switch_Review_Mode_PO.clickonclosebtn();
            switch_Review_Mode_PO.MarkReviewFromSwitchReviewMode();    
        })
    })


})
