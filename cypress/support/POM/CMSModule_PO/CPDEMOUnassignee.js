import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class CPDEMOUnAssignee
{
    setCustomerProfile(issueOwnerType,customerProfileUpdatemsg)
    {
        cy.get('.form-group.m-form__group.row.pb-3:nth-child(29) > .col-md-6 > .m-radio-inline').contains(issueOwnerType).click();
        cy.wait(3000);
        cy.get('.m-form__actions > .btn-primary').click();
        cy.get('div.toast-message').contains(customerProfileUpdatemsg);
    }

    validateMandatoryFields(errorMessageIssueSource,errorMessageOwner,errorMessageIssueDescrp,errorMessageIssueType,errorMessageIssueIdenDate,errorMessageSubName,errorMessageSummary){
        cy.get('.btn.btn-primary').click();
        cy.wait(4000);
        cy.get('div:nth-of-type(1) > .toast-message').contains(errorMessageIssueSource);
        cy.get('div:nth-of-type(2) > .toast-message').contains(errorMessageOwner);
        cy.get('div:nth-of-type(6) > .toast-message').contains(errorMessageIssueDescrp);
        cy.get('div:nth-of-type(7) > .toast-message').contains(errorMessageIssueType);
        cy.get('div:nth-of-type(8) > .toast-message').contains(errorMessageIssueIdenDate);
        cy.get('div:nth-of-type(10) > .toast-message').contains(errorMessageSubName);
        cy.get('div:nth-of-type(11) > .toast-message').contains(errorMessageSummary);
    }

    fillIssueExternalForm(summaryForm,submitterName,responsibleDept,issueType,issueDescription,potentialLoss,actualLoss,rootCause,owner,errorMessage)
    {
        const date = dayjs().format("MMM D, YYYY");
        cy.log(date);
        cy.get('input#summary').type(summaryForm);
        cy.wait(3000);
        cy.get('input#submitterName').type(submitterName);
        cy.wait(4000);
        cy.get('select#responsibleDepartment').select(responsibleDept);
        cy.wait(4000);
        cy.get('input#dateOpEventOccurred').type(date);
        cy.wait(3000)
        cy.get('input#issueIdentificationDate').type(date);
        cy.wait(3000)
        cy.get('select#issueType').select(issueType);
        cy.wait(3000)
        cy.get('textarea#issueDescription').type(issueDescription);
        cy.wait(3000);
        cy.get('input#potentialLoss').type(potentialLoss);
        cy.wait(3000);
        cy.get('input#actualLoss').type(actualLoss);
        cy.wait(3000);
        cy.get('select#rootCause').select(rootCause);
        cy.wait(3000)
        cy.get('input#owner').type(owner);
        cy.wait(3000)
        cy.get('#resolutionDueDate').type(date);
        cy.wait(3000);
        cy.get('.btn.btn-primary').click();
        cy.wait(4000);
        cy.get('.m-portlet__body').contains(errorMessage);
    }


}
export default CPDEMOUnAssignee;
