import { RiskCategory } from "../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO.js";
import Start_RCSA_PO from "../../support/POM/STARTRCSA_PO/Start_RCSA_PO.js";
import Switch_Review_Mode_PO from "../../support/POM/STARTRCSA_PO/Switch_Review_Mode_PO.js";


/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const RCSA_Process = require('../../fixtures/RCSAAuditLog/StartRCSAScreen.json')
const Switch_Review_Mode = require('../../fixtures/RCSAAuditLog/SwitchReviewMode.json')
const riskCatagory= new RiskCategory();

describe("Switch Review Mode, Modal Visiblity, Toggle btn validation, Cancel btn validation, Risk Review Dropdown validation, Select Parent and Child Ticket in dropdown, Switch To Task, Mark Review, Progress Field Validation on Ticket,", () => {
    const riskRegister_PO = new RiskRegister_PO();
    const start_RCSA_PO = new Start_RCSA_PO();
    const switch_Review_Mode_PO = new Switch_Review_Mode_PO();
    const withRMB = Cypress.env("riskManagement").withRMB;


    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })

    context("Switch Review Mode and RCSA Process Validation",{tags:["@positive"]}, () => {
    beforeEach(()=>{
      cy.loginWithSession(
        "login with DOCS User",
        withRMB.username,
        withRMB.password,
        withRMB.key
      );
      cy.visitRiskRegister();
      cy.waitForMyGridLoaderToDisappear(60000);
      riskRegister_PO.threeEllipsisMenu();
    })

     /////*****Switch To Review Mode - Validate Switch Review Tab on Risk Register three ellipses*/
    Switch_Review_Mode.forEach(test => {
        it(test.SwitchReviewTab,{tags:["@smoke"]}, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
        })
    })

    /////*****Switch To Review Mode - Validate Modal Visiblity*/
    Switch_Review_Mode.forEach(test => {
        it(test.Modalvisiblity,{tags:["@smoke"]}, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.validate_Switch_Review_Mode_Flyer();
        })
    })
     /////*****Switch To Review Mode - Validate Toggle Button*/
    Switch_Review_Mode.forEach(test => {
        it(test.Togglebtn,{tags:["@smoke","@pd42745"]}, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.validate_Switch_Review_Mode_Flyer();
            switch_Review_Mode_PO.validate_toggle_btn();
        })
    })
     /////*****Switch To Review Mode - Validate Cancel Button*/
    Switch_Review_Mode.forEach(test => {
        it(test.Cancelbtn,{tags:["@smoke"]}, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.validate_Switch_Review_Mode_Flyer();
            switch_Review_Mode_PO.validate_toggle_btn();
            switch_Review_Mode_PO.validate_cancel_functionality();
        })
    })
     /////*****Switch To Review Mode - Validate Risk Review dropdown validation*/
    Switch_Review_Mode.forEach(test => {
        it(test.RiskReviewDropdownvalidation, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.riskReviewIDMustArrangeInAscendingOder();
           
        })
    })
    /////*****To check the RCSA Process Should Start with MultiSelect Business Unit*/
    RCSA_Process.forEach(test => {
        it(test.RCSAProcessFromMultiSelectBusinessUnit, () => {
            start_RCSA_PO.startrcsaflyer();
            start_RCSA_PO.assertmodalTitle();
            start_RCSA_PO.selectdatefrombothinputfield();
            start_RCSA_PO.BusinessUnit_MultiSelect(test.BusinessUnit01, test.BusinessUnit02);
            start_RCSA_PO.RCSA_Popup_Save_btn();
         })

    })
    /////*****Switch To Review Mode - Select Parent and Child Ticket and Switch to Open Task*/
    Switch_Review_Mode.forEach(test => {
        it(test.SwitchToOpenTask,{tags:["@pd42740"]}, () => {
            switch_Review_Mode_PO.switch_Review_Mode_flyer();
            switch_Review_Mode_PO.selectOpenParentRiskReviewID();
            switch_Review_Mode_PO.selectOpenChildRiskReviewID();
            switch_Review_Mode_PO.clickonclosebtn();
            switch_Review_Mode_PO.assertSwitchReviewToosterMessage();
            switch_Review_Mode_PO.expandClosedRiskCategory()
            switch_Review_Mode_PO.MarkReviewFromSwitchReviewMode();  
            switch_Review_Mode_PO.closeAllRiskReviews();
        })
    })
/////*****Risk Register - Close RCSA Process and also validate the final progress*/
RCSA_Process.forEach(test => {
    it(test.CloseRCSA, () => {
        cy.visitCMSDashboard();
        start_RCSA_PO.ClickOnAdvanceSearch();
        start_RCSA_PO.SelectSecondChildTicket();
        start_RCSA_PO.closeRCSAPercentagevaldation(test.Finalprogress);
    })
}) 
    })

    context("Switch Review Mode - Negative Scenarios",{tags:["@negative"]}, () => {
    beforeEach(()=>{
      cy.loginWithSession(
        "login with DOCS User",
        withRMB.username,
        withRMB.password,
        withRMB.key
      );
      cy.visitRiskRegister();
      cy.waitForMyGridLoaderToDisappear(60000);
      riskRegister_PO.threeEllipsisMenu();
    })

    it("Try submitting form without selecting any values",{tags:["@smoke","@pd42742"]},()=>{
      riskRegister_PO.threeEllipsisMenu();
      switch_Review_Mode_PO.clickonclosebtn();
      cy.verifyToastMessageText(Switch_Review_Mode[0]["mandatoryError"], 20000);
    })

    it("Enter invalid input (e.g., random text) in Risk Review search",{tags:["@smoke","@pd42741"]}, ()=>{
        switch_Review_Mode_PO.switch_Review_Mode_flyer();
        switch_Review_Mode_PO.selectOpenParentRiskReviewID(true);
        switch_Review_Mode_PO.clickonclosebtn();
        cy.verifyToastMessageText(Switch_Review_Mode[0]["mandatoryError"], 20000);

    })
    it("Select a risk review with no available child tasks",{tags:["@smoke","@pd42744"]},()=>{
        switch_Review_Mode_PO.switch_Review_Mode_flyer();
        switch_Review_Mode_PO.selectOpenParentRiskReviewID();
        switch_Review_Mode_PO.clickonclosebtn();
        cy.waitForStableGrid(300000);
        switch_Review_Mode_PO.gridFullyLoaded();
    })
    })

    context("Switch Review Mode - Closed Mark Cases",{tags:["@closed"]}, () => {
    beforeEach(()=>{
      cy.loginWithSession(
        "login with DOCS User",
        withRMB.username,
        withRMB.password,
        withRMB.key
      );
      cy.visitRiskRegister();
      cy.waitForMyGridLoaderToDisappear(60000);
      riskRegister_PO.threeEllipsisMenu();
    })

    it("Attempt to select a risk review while toggle is set to 'Closed'",{tags:"@pd42745"},()=>{
    switch_Review_Mode_PO.switch_Review_Mode_flyer();
    switch_Review_Mode_PO.toggleReviewModal();
    switch_Review_Mode_PO.selectOpenParentRiskReviewID();
    })

    it("Toggle between Open and Closed states",{tags:["@smoke","@pd42749"]}, ()=>{
    switch_Review_Mode_PO.switch_Review_Mode_flyer();
    switch_Review_Mode_PO.toggleReviewModal();
    switch_Review_Mode_PO.toggleReviewModal();
    switch_Review_Mode_PO.selectOpenParentRiskReviewID();
    })

    it("Select a closed risk review and choose a valid child task",{tags:"@pd42746"}, ()=>{
      switch_Review_Mode_PO.switch_Review_Mode_flyer();
      switch_Review_Mode_PO.toggleReviewModal();
      switch_Review_Mode_PO.selectOpenParentRiskReviewID();
      switch_Review_Mode_PO.selectOpenChildRiskReviewID();
    })

    afterEach(()=>{
      switch_Review_Mode_PO.clickonclosebtn();
      switch_Review_Mode_PO.gridFullyLoaded();
      switch_Review_Mode_PO.expandClosedRiskCategory();
    })
    })

    context("Verify three Elipses Options (Edit Risk Review Mode, Exit Risk Review Mode) and Validate Review Check Disabled",()=>{
    beforeEach(()=>{
      cy.loginWithSession(
        "login with DOCS User",
        withRMB.username,
        withRMB.password,
        withRMB.key
      );
      cy.visitRiskRegister();
      cy.waitForMyGridLoaderToDisappear(60000);
      riskRegister_PO.threeEllipsisMenu();
    })

    it("verify (Edit Risk Review Mode) option under three Elipses", {tags:["@smoke","@pd42747"]}, ()=>{
    switch_Review_Mode_PO.switch_Review_Mode_flyer();
    switch_Review_Mode_PO.selectOpenParentRiskReviewID();
    switch_Review_Mode_PO.clickonclosebtn();
    cy.waitForStableGrid(300000);
    switch_Review_Mode_PO.gridFullyLoaded();
    riskRegister_PO.threeEllipsisMenu();
    switch_Review_Mode_PO.validateEditReviewTab();
    })

    it("verify (Exist Risk Review Mode) option under three Elipses", {tags:["@smoke","@pd42747"]}, ()=>{
    switch_Review_Mode_PO.switch_Review_Mode_flyer();
    switch_Review_Mode_PO.selectOpenParentRiskReviewID();
    switch_Review_Mode_PO.clickonclosebtn();
    cy.waitForStableGrid(300000);
    switch_Review_Mode_PO.gridFullyLoaded();
    riskRegister_PO.threeEllipsisMenu();
    switch_Review_Mode_PO.validateExitReviewTab();
    })

    it("Review column checkboxes should be disabled", {tags:["@smoke","@pd42743"]}, ()=>{
      switch_Review_Mode_PO.expandClosedRiskCategory();
      switch_Review_Mode_PO.validateReviewCheckDisabled();
    })
    })
})
