import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import QuestionBank_PO from "../../support/POM/CMSModule_PO/QuestionBank_PO";
import bhcgComplaint_PO from "../../support/POM/BHCG_PO/bhcgComplaint_PO";

/// <reference types= "cypress" />

////Data Provider ///
const complaintbhcg = require('../../fixtures/BHCG/ComplaintForm.json')

describe("BHCG Complaint form", () => {

    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const bhcgcomplaint_PO = new bhcgComplaint_PO();


    complaintbhcg.forEach(test => {
        it(test.name, function () {

            //login
            cy.log(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(Cypress.env("username"), Cypress.env("password"), Cypress.env("key"));
            loginDetails_PO.clickOn_LoginButton();

            // predictMenu_PO.menuClick();
            // predictMenu_PO.activitiesAndTasksClick();
            // predictMenu_PO.cmsAdministrationModuleClick();
            // predictMenu_PO.incidentDropdownClick();
            predictMenu_PO.complaintSelectClick();
            cy.wait(5000);
            bhcgcomplaint_PO.fillComplaintForm(test.summary, test.fundingBank, test.firstName, test.lastName, test.tier, test.clientLevel,test.description);
            bhcgcomplaint_PO.informationTab(test.accountNum, test.fundingBank, test.productInvolved, test.productInvolvedSec, test.productotherdSec, test.complaintType, test.complaintTypeSec, test.recepientFirstName, test.recepientLastName, test.receivingBU);
            bhcgcomplaint_PO.informationDetailsTab(test.respondentFirstName, test.respondentLastName, test.resolutionSummary);
            bhcgcomplaint_PO.investigationTab(test.investigationNotes,test.rootcausedescription);
            bhcgcomplaint_PO.createTaskButton();
            cy.wait(5000);
            bhcgcomplaint_PO.validateData(test.firstName, test.lastName, test.tier, test.clientLevel, test.description, test.accountNum, test.productInvolved, test.productInvolvedSec, test.productotherdSec, test.complaintType, test.recepientFirstName, test.recepientLastName, test.receivingBU, test.fundingBank, test.respondentFirstName, test.respondentLastName, test.investigationNotes);
            bhcgcomplaint_PO.editIssue(test.summary, test.refNum, test.summaryBu, test.fundingBankEdit, test.PartyServiceProvider);
            bhcgcomplaint_PO.updateTaskButton();
        })

    })

})



