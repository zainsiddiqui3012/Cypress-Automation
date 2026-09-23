import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIDGrp.txt'
const filename2 = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIdSubtaskGrp.txt'

class CPDEMOGroupAssignee {
    setCustomerProfile(issueOwnerType, issueOwnerTypeName, customerProfileUpdatemsg) {

        cy.get('#customerPreferenceForm > div:nth-child(24) > div').contains(issueOwnerType).click();
        cy.wait(3000);
        cy.get('#s2id_issueProcessOwnerGroupId > .select2-choice').click();
        cy.wait(4000);
        cy.get('#s2id_autogen6_search').type(issueOwnerTypeName).wait(3000).type('{enter}');
        cy.wait(4000);
        cy.get('.m-form__actions > .btn-primary').click();
    }

    validateMandatoryFields(assigneeError, errorMessageTypeOfIssue, errorMessageSummary, errorMessageSubName, errorMessageIssueIdentificationDate, errorMessageIssueDescrp, errorMessageIssueSource, errorMessageOwners) {
        cy.switchIframe('#mytarget').find('#issue-create-submit').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('#assignee-err').contains(assigneeError);
        cy.switchIframe('#mytarget').find('#assign-to-me-trigger').click();
        cy.switchIframe('#mytarget').find('#issue-create-submit').click();
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(1)').contains(errorMessageSummary);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(2)').contains(errorMessageTypeOfIssue,);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(3)').contains(errorMessageSubName,);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(4)').contains(errorMessageIssueIdentificationDate,);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(5)').contains(errorMessageIssueDescrp);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(6)').contains(errorMessageIssueSource);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(9)').contains(errorMessageOwners);
    }

    fillIssueExternalForm(summaryForm, IssueSource, Agency, issueDescription, issueType, owner, submitterName, responsibleDept, potentialLoss, actualLoss, rootCause) {
        const date = dayjs().format("D/MMM/YYYY");
        cy.log(date);

        cy.switchIframe('#mytarget').find('input#summary').type(summaryForm);
        cy.wait(3000);
        cy.switchIframe('#mytarget').xpath('//*[@id="s2id_select_customfield_19000"]').click();
        cy.wait(10000);
        cy.switchIframe('#mytarget').xpath('//*[@id="select2-drop"]/div/input').type("Testing").type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19001').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(Agency).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19004').type(issueDescription);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19002').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(issueType).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19003').wait(2000).type(date);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19007').type(owner);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19013').type(submitterName);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19013').type(submitterName);
        // cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19006').click();
        // cy.wait(3000);
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(responsibleDept).type('{enter}');
        cy.wait(3000);
        // cy.switchIframe('#mytarget').find('#customfield_21312').type(date);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21310').type(potentialLoss);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21311').type(actualLoss);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19011').type(rootCause).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div:nth-child(35) > div:nth-child(3) > label').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_12802').wait(2000).type("CPDEMO-issue test compliance");
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#issue-create-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId');
        cy.wait(1000)
        cy.get('@ticketId').then((ticketId) => {
            cy.writeFile(filename, ticketId);
            cy.wait(3000);
        });
    }

}
export default CPDEMOGroupAssignee