import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import ScrollPage from "../../support/POM/Functions/ScrollPage";
import OEP_Assessment_PO from "../../support/POM/DAP-OEP-Assessment_PO/DAP_Assessment_PO";
import ControlDefinition_PO from "../../support/POM/RiskModule_PO/ControlDefinition_PO";


/// <reference types= "cypress" />
/// <reference types= "cypress-iframe" />


////Data Provider ///
const controlDefinition = require('../../fixtures/RiskModule/Control_Taxonomy/controlDefinition.json')
const ControlGrid = require('../../fixtures/RiskModule/Risk Register/ControlGrid.json')
const LinkControlGrid = require('../../fixtures/RiskModule/Risk Register/LinkControlGrid.json')
const RiskRegisterGridValueUpdate = require('../../fixtures/RiskModule/Risk Register/RiskRegisterGridValueUpdate.json');
const OepAssessment = require('../../fixtures/DAPOEPAssessment/DAPAssessment.json');

//Data Provider ///
before(function () {
    cy.fixture('DAPOEPAssessment/DAPAssessment.json').then(function (data) {
        global.data = data;
        cy.fixture('RiskModule/RiskDefintionName.json').then(function (testdata) {
            global.testdata = testdata;
        });

    });

});

describe("OEP Control Test Assessment Test Cases", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const riskRegister_PO = new RiskRegister_PO();
    const scrollPage = new ScrollPage();
    const OEPAssessment = new OEP_Assessment_PO();
    const controlDefinition_PO = new ControlDefinition_PO();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();

    })


        /////***Add Control Instance */
        OepAssessment.forEach(test => {
            it(test.DAPAssessmentForm, () => {


            //Login Details
            cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height            
            cy.wait(2000);
            OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);
        })
    
        })

        OepAssessment.forEach(test => {
            it(test.SummaryFieldCase, () => {
    
    
            //Login Details
            cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.riskAndControlRegisterClick();
            predictMenu_PO.riskRegitserClick();
            cy.get("#myGrid").getAgGridData();
            cy.viewport(2000, 1300) // Set viewport to width and height            
            cy.wait(2000);
            OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);
            OEPAssessment.ValidateSummaryField(test.OEPSummaryFieldVal);   
        })

        })


        OepAssessment.forEach(test => {
                it(test.SetDaillyOccurance, () => {
            
    
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);  
                OEPAssessment.SetReccuranceANDReoccurEvery(test.DaillyReoccurance, test.ReoccurEveryone);   
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();
                 
            })
    
            })

            OepAssessment.forEach(test => {
                it(test.SetDaillyOccurancethirty, () => {
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);  
                OEPAssessment.SetReccuranceANDReoccurEvery(test.DaillyReoccurance, test.ReoccurEverythirty);   
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();
                 
            })
    
            })




            OepAssessment.forEach(test => {
                it(test.SetMonthlyOccurance, () => {
                
    
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);   
                OEPAssessment.SetReccuranceANDReoccurEvery(test.WeeklyReoccurance, test.ReoccurEveryone);  
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);  
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();
    
            })
    
            }) 
                        
            OepAssessment.forEach(test => {
                it(test.SetMonthlyOccurancethirty, () => {
                    
    
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);    
                OEPAssessment.SetReccuranceANDReoccurEvery(test.MonthlyReoccurance, test.ReoccurEverythirty);   
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn(); 
    
            })
    
            })   
                            
            OepAssessment.forEach(test => {
                it(test.SetBiyearlyOccurance, () => {
                        
                        
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);         
                OEPAssessment.SetReccuranceANDReoccurEvery(test.BiYearlyReoccurance, test.ReoccurEveryone);  
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();  
    
            })
    
            }) 

            OepAssessment.forEach(test => {
                it(test.SetBiyearlyOccurancethirty, () => {
                        
                        
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);         
                OEPAssessment.SetReccuranceANDReoccurEvery(test.BiYearlyReoccurance, test.ReoccurEverythirty);  
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();  
    
            })
    
            }) 
                                
                                
            OepAssessment.forEach(test => {
                it(test.SetYearlyOccurance, () => {
                            
                            
                //Login Details
                cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.visitUrl();
                loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                loginDetails_PO.clickOn_LoginButton();
                predictMenu_PO.menuClick();
                predictMenu_PO.riskAndControlRegisterClick();
                predictMenu_PO.riskRegitserClick();
                cy.get("#myGrid").getAgGridData();
                cy.viewport(2000, 1300) // Set viewport to width and height            
                cy.wait(2000);
                OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);  
                OEPAssessment.SetReccuranceANDReoccurEvery(test.YearlyReoccurance, test.ReoccurEveryone);  
                OEPAssessment.selectCurrentDate(test.StartDate);
                OEPAssessment.selectCurrentDate(test.EndDate);
                OEPAssessment.SelectTemplate(test.DAPTemplate);
                OEPAssessment.clickoncreatebtn();    
    
                })
        
                })   
                
                OepAssessment.forEach(test => {
                    it(test.SetYearlyOccurancethirty, () => {
                                
                                
                    //Login Details
                    cy.log(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                    loginDetails_PO.visitUrl();
                    loginDetails_PO.loginDetails(Cypress.env("username_dap"), Cypress.env("password_dap"), Cypress.env("key_dap"));
                    loginDetails_PO.clickOn_LoginButton();
                    predictMenu_PO.menuClick();
                    predictMenu_PO.riskAndControlRegisterClick();
                    predictMenu_PO.riskRegitserClick();
                    cy.get("#myGrid").getAgGridData();
                    cy.viewport(2000, 1300) // Set viewport to width and height            
                    cy.wait(2000);
                    OEPAssessment.GotoCreateControlTestForm(test.DAPFormtype, test.DAPAssessmentURL, test.OEPAssessmentURL);  
                    OEPAssessment.SetReccuranceANDReoccurEvery(test.YearlyReoccurance, test.ReoccurEverythirty);  
                    OEPAssessment.selectCurrentDate(test.StartDate);
                    OEPAssessment.selectCurrentDate(test.EndDate);
                    OEPAssessment.SelectTemplate(test.DAPTemplate);
                    OEPAssessment.clickoncreatebtn();  
                      
        
                    })
            
                    })     
    
                        

    })

