import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import GWYDUnAssignee from "../../../support/POM/CMSModule_PO/GWYDUnAssignee";
const customerProfile = require('../../../fixtures/CMSIssueExternalWebforms/GWYDUnAssigneCustomerProfile.json');
const fillIssueForm = require('../../../fixtures/CMSIssueExternalWebforms/GWYDUnAssignee.json');
const validateRequiredFields = require('../../../fixtures/CMSIssueExternalWebforms/GWYDRequiredFieldsValidation.json');
describe("Un Assignee : GWY DEMO Issue External webform", () => {
    const loginDetails_PO = new LoginDetails_PO();
    const predictMenu_PO = new PredictMenu_PO();
    const GWYDIssueForm = new GWYDUnAssignee();
    
    before(function () {
      cy.clearLocalStorage();
      cy.clearCookies();
    });
    
    customerProfile.forEach((test)=> {
        it(test.name, () => {
            cy.log(
                Cypress.env("usernameGWYD"),
                Cypress.env("passwordGWYD"),
                Cypress.env("keyGWYD")
              );
              loginDetails_PO.visitUrl();
              loginDetails_PO.loginDetails(
                Cypress.env("usernameGWYD"),
                Cypress.env("passwordGWYD"),
                Cypress.env("keyGWYD")
              );
              loginDetails_PO.clickOn_LoginButton();
              predictMenu_PO.menuClick();
              predictMenu_PO.adminModuleGWYD();
              predictMenu_PO.customerProfileGWYD();
              GWYDIssueForm.setCustomerProfile(test.issueOwnerType,test.customerProfileUpdatemsg);
        });
        
    });
    validateRequiredFields.forEach((test) => {
        it(test.name, () => {
            loginDetails_PO.visitGWYDEMOIssueForm();
            cy.wait(5000);            
            GWYDIssueForm.validateMandatoryFields(test.errorMessageSubName,test.errorMessageResDept,test.errorMessageSummary,test.errorMessageIssueDescrp,test.errorMessageIssueType,test.errorMessageAssignee,test.errorMessageSeverity,test.errorMessageAgencyEntities,test.errorMessageIssueSource)
        })
    });
    fillIssueForm.forEach((test) => {
        it(test.name, () => {
            loginDetails_PO.visitGWYDEMOIssueForm();
            cy.wait(5000);            
            GWYDIssueForm.fillIssueExternalForm(test.summaryForm,test.submitterName,test.responsibleDept,test.issueType,test.issueDescription,test.agencyEntities,test.severityForm,test.assignee_owner,test.issueSource,test.successMessage)
        })
    });
});