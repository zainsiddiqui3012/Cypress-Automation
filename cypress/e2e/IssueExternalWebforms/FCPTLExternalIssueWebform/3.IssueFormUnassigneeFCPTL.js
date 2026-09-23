import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import FCPTLUnAssignee from "../../../support/POM/CMSModule_PO/FCPTLUnassignee";
const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLUnAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/FCPTLUnAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/RequiredFieldsValidation.json');
describe("Un Assignee : Submit, Reopen, Reject,Return to owner and Close an Issue Management External WebForm and It's Subtask with Complete workflow process.", () => {
    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const FCPTLIssueForm = new FCPTLUnAssignee();
    
    before(function () {
      cy.clearLocalStorage();
      cy.clearCookies();
    });
    
    customerProfile.forEach((test)=> {
        it(test.name, () => {
            cy.log(
                Cypress.env("usernameCPTL"),
                Cypress.env("passwordCPTL"),
                Cypress.env("keyCPTL")
              );
              loginDetails_PO.visitUrl();
              loginDetails_PO.loginDetails(
                Cypress.env("usernameCPTL"),
                Cypress.env("passwordCPTL"),
                Cypress.env("keyCPTL")
              );
              loginDetails_PO.clickOn_LoginButton();
              predictMenu_PO.menuClick();
              predictMenu_PO.adminModuleCPTL();
              predictMenu_PO.customerProfileCPTL();
              FCPTLIssueForm.setCustomerProfile(test.issueOwnerType,test.customerProfileUpdatemsg);
        });
        
    });
    validateRequiredFields.forEach((test) => {
        it(test.name, () => {
            loginDetails_PO.visitCPTLIssueForm();
            cy.wait(5000);            
            FCPTLIssueForm.validateMandatoryFields(test.errorMessageIssueSource,test.errorMessageOwner,test.errorMessageIssueDescrp,test.errorMessageIssueType,test.errorMessageIssueIdenDate,test.errorMessageSubName,test.errorMessageSummary)
        })
    });
    fillIssueForm.forEach((test) => {
        it(test.name, () => {
            loginDetails_PO.visitCPTLIssueForm();
            cy.wait(5000);            
            FCPTLIssueForm.fillIssueExternalForm(test.summaryForm,test.submitterName,test.responsibleDept,test.issueType,test.issueDescription,test.potentialLoss,test.actualLoss,test.rootCause,test.owner,test.issueSource,test.successMessage)
        })
    });
});