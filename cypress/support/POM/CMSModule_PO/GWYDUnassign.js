import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';
class GWYDUnAssignee
{
    setCustomerProfile(issueOwnerType,customerProfileUpdatemsg)
    {
        cy.get('.form-group.m-form__group.row.pb-3:nth-child(34) > .col-md-6 > .m-radio-inline').contains(issueOwnerType).click();
        cy.wait(3000);
        cy.get('.m-form__actions > .btn-primary').click();
        cy.get('div.toast-message').contains(customerProfileUpdatemsg);
    }
    validateMandatoryFields(errorMessageSubName,errorMessageResDept,errorMessageSummary,errorMessageIssueDescrp,errorMessageIssueType,errorMessageAssignee,errorMessageSeverity,errorMessageAgencyEntities,errorMessageIssueSource){
        cy.get('.btn.btn-primary').click();
        cy.wait(4000);
        cy.get('div:nth-of-type(1) > .toast-message').contains(errorMessageSubName);
        cy.get('div:nth-of-type(2) > .toast-message').contains(errorMessageResDept);
        cy.get('div:nth-of-type(3) > .toast-message').contains(errorMessageSummary);
        cy.get('div:nth-of-type(4) > .toast-message').contains(errorMessageIssueDescrp);
        cy.get('div:nth-of-type(5) > .toast-message').contains(errorMessageIssueType);
        cy.get('div:nth-of-type(6) > .toast-message').contains(errorMessageAssignee);
        cy.get('div:nth-of-type(7) > .toast-message').contains(errorMessageSeverity);
        cy.get('div:nth-of-type(8) > .toast-message').contains(errorMessageAgencyEntities);
        cy.get('div:nth-of-type(9) > .toast-message').contains(errorMessageIssueSource);
    
    }
    fillIssueExternalForm(summaryForm,submitterName,responsibleDept,issueType,issueDescription,agencyEntities,severityForm,assignee_owner,issueSource,successMessage)
    {
        const date = dayjs().format("MMM D, YYYY");
        cy.log(date);
        cy.get('input#summary').type(summaryForm);
        cy.wait(3000);
        cy.get('input#submitterName').type(submitterName);
        cy.wait(4000);
        cy.get('select#responsibleDepartment').select(responsibleDept);
        cy.wait(4000);
        cy.get('input#resolutionDueDate').type(date);
        cy.wait(3000)
        cy.get('select#issueType').select(issueType);
        cy.wait(3000)
        cy.get('textarea#issueDescription').type(issueDescription);
        cy.wait(3000);
        cy.get('select#agency').select(agencyEntities);
        cy.wait(3000);
        cy.get('select#severity').select(severityForm);
        cy.wait(3000)
        cy.get('input#owner').type(assignee_owner);
        cy.wait(3000)
        cy.get('select#issueSource').select(issueSource);
        cy.wait(3000);
        cy.get('.btn.btn-primary').click();
        cy.wait(4000);
        cy.get('.m-portlet__body').contains(successMessage);
    }
}
export default GWYDUnAssignee;