import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import CPDEMOGroupAssignee from "../../../support/POM/CMSModule_PO/CPDEMOGroupAssignee";

const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/CPGroupAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/CPGroupAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/RequiredFieldsValidation.json');

describe("Group Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.", 
    { tags:["@regression", "@cms", "@external-webform","cpdemo","@group-assignee"] }, () => {
    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const CPDEMOIssueForm = new CPDEMOGroupAssignee();

    before(function () {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    customerProfile.forEach((test) => {
        it(test.name, {tags:"@smoke"}, () => {
            cy.log(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.menuClick();
            predictMenu_PO.adminModuleCPDEMO();
            predictMenu_PO.customerProfileCPDEMO();
            CPDEMOIssueForm.setCustomerProfile(test.issueOwnerType, test.issueOwnerTypeName, test.customerProfileUpdatemsg);
        });

    });
    validateRequiredFields.forEach((test) => {
        it(test.name, {tags:"@smoke"} , () => {
            cy.log(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.incidentDropdownClick();
            predictMenu_PO.issueManagementClick();
            CPDEMOIssueForm.validateMandatoryFields(test.assigneeError, test.errorMessageTypeOfIssue, test.errorMessageSummary, test.errorMessageSubName, test.errorMessageIssueIdentificationDate, test.errorMessageIssueDescrp, test.errorMessageIssueSource, test.errorMessageOwners);
        })
    });

    fillIssueForm.forEach((test) => {
        it(test.name, {tags:"@smoke"} , () => {
            cy.log(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.visitUrl();
            loginDetails_PO.loginDetails(
                Cypress.env("usernameCPDEMO"),
                Cypress.env("passwordCPDEMO"),
                Cypress.env("keyCPDEMO")
            );
            loginDetails_PO.clickOn_LoginButton();
            predictMenu_PO.incidentDropdownClick();
            predictMenu_PO.issueManagementClick();
            CPDEMOIssueForm.fillIssueExternalForm(test.summaryForm, test.IssueSource, test.Agency, test.issueDescription, test.issueType, test.owner, test.submitterName, test.responsibleDept, test.potentialLoss, test.actualLoss, test.rootCause)

        })
    });

});
