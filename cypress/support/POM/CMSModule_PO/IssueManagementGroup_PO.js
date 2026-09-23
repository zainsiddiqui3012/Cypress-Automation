import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/CMSIssue/TicketIdGroup.txt'
const filename2 = 'cypress/fixtures/CMSIssue/TicketIdSubtaskGroup.txt'

class IssueManagementGroup_PO {

    setCustomerProfile(issueOwnerType, issueOwnerTypeName, customerProfileUpdatemsg) {
        // cy.get(':nth-child(32) > .col-md-6 > .m-radio-inline > :nth-child(2)').click();
        cy.get("[name='issueProcessOwnerType'][value='Group']").click({force:true});
        cy.wait(3000);
        cy.tab().type('{enter}');
        // cy.get('#s2id_issueProcessOwnerId > a > span.select2-arrow').click();
        cy.wait(4000);
        cy.get('#s2id_autogen8_search').type(issueOwnerTypeName).wait(3000).type('{enter}');
        cy.wait(4000);
        cy.get('.m-form__actions > .btn-primary').click();
        cy.waitForElementToVisible("div.toast-message",80000)
    }

    validateMandatoryFields(errorMessageAssignee, errorMessageSummary, errorMessageIssueType, errorMessageSubName, errorMessageIssueIdenDate, errorMessageIssueDescrp, errorMessageIssueSource, errorMessageAgency, errorMessageOwner) {

        cy.switchIframe('#mytarget').find('input#issue-create-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('#assignee-err').contains(errorMessageAssignee);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#assign-to-me-trigger').click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#issue-create-submit').click();
        cy.wait(15000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(1)').contains(errorMessageSummary);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(2)').contains(errorMessageIssueType);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(3)').contains(errorMessageSubName);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(4)').contains(errorMessageIssueIdenDate);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(5)').contains(errorMessageIssueDescrp);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(6)').contains(errorMessageIssueSource);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(7)').contains(errorMessageAgency);
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('.aui-message.aui-message-error > p:nth-child(8)').contains(errorMessageOwner);
        cy.wait(7000);

    }

    fillIssueForm(summary, IssueSource, Agency_Entities, typeOfIssue, issueDescription, audit_exam, issueOwner, rootCause, rootCauseDescription, submitterName, repeatFinding, priority, assigneeType, projectNumber, subjectArea, severity) {
        const date = dayjs().format("DD/MMM/YYYY");
        cy.log(date);
        const resolutiondueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(resolutiondueDate);

        cy.switchIframe('#mytarget').find("[name='summary']").type(summary);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19000").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div[id='select2-drop'] input[type='text']").type(IssueSource).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19001").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("#select2-drop .select2-search .select2-input").type(Agency_Entities).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19002").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("#select2-drop .select2-search .select2-input").type(typeOfIssue).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("input#customfield_19003").type(date).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('textarea[name="customfield_19004"]').type(issueDescription);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input[name="customfield_19005"]').type(audit_exam);
        cy.wait(5000);
        // cy.switchIframe('#mytarget').find('#s2id_select_customfield_20302 > ul.select2-choices').type(responsibleDepartment).wait(3000).type('{enter}');
        // cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19007').type(issueOwner);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19008').type(resolutiondueDate);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('select#customfield_19011').wait(2000).select(rootCause);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('textarea#customfield_19012').type(rootCauseDescription);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19013').type(submitterName);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.form-body > fieldset:nth-of-type(2) > div').contains(repeatFinding).click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('select#customfield_19018').wait(2000).select(priority);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.form-body > div:nth-of-type(24) > div.radio').contains(assigneeType).click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#customfield_12802').type("Bfsi");
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#duedate').type(resolutiondueDate);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input[name="customfield_19019"]').type(projectNumber);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_18100 ul.select2-choices').type(subjectArea);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('div[id="s2id_select_customfield_21700"] a[class="select2-choice"]').click();
        cy.wait(10000);
        const filepath = 'cypress/attachment/testing.txt';
        cy.switchIframe('#mytarget').find('input[type="file"]').selectFile(filepath, { force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('div#select2-drop  .select2-input').type(severity).type('{enter}');
        cy.wait(7000);
        cy.switchIframe('#mytarget').find('#issue-create-submit').click();
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#assignee-val').trigger('mouseover');
        cy.switchIframe('#mytarget').find('#assignee-val').click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#assignee-val').type("Bfsi").wait(2000).type('{enter}').type('{enter}');
        // cy.switchIframe('#mytarget').find('assignee-val').type('{enter}').type("Bfsi").wait(2000).type('{enter}').type('{enter}');
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketIdGroup');
        cy.wait(1000)
        cy.get('@ticketIdGroup').then((ticketIdGroup) => {
            cy.writeFile(filename, ticketIdGroup);
            cy.wait(30000);
        });

    }
    validateData(taskType, assigneeName, reporter, IssueSource, Agency_Entities, typeOfIssue, issueDescription, audit_exam, issueOwner, rootCause, rootCauseDescription, submitterName, repeatFinding, priority, projectNumber, subjectArea, severity) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(50000);
        cy.switchIframe('#mytarget').find('span#type-val').contains(taskType);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('span#assignee-val').contains(assigneeName);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('span#reporter-val').contains(reporter);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19000-val').contains(IssueSource);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19001-val').contains(Agency_Entities);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19002-val').contains(typeOfIssue);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19004-val').contains(issueDescription);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19005-val').contains(audit_exam);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19007-val').contains(issueOwner);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19011-val').contains(rootCause);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19012-val').contains(rootCauseDescription);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19013-val').contains(submitterName);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19014-val').contains(repeatFinding);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19018-val').contains(priority);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19019-val').contains(projectNumber);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_18100-val').contains(subjectArea);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_21700-val').contains(severity);
        cy.wait(10000);


    }
    editIssueForm(description, comment) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('a#edit-issue').click();
        cy.wait(30000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(description)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('textarea#customfield_10636').type(comment);
        cy.wait(3000);

    }

    fillIssueForm(summary, IssueSource, Agency_Entities, typeOfIssue, issueDescription, audit_exam, issueOwner, rootCause, rootCauseDescription, submitterName, repeatFinding, priority, assigneeType, projectNumber, subjectArea, severity) {
        const date = dayjs().format("DD/MMM/YYYY");
        cy.log(date);
        const resolutiondueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(resolutiondueDate);

        cy.switchIframe('#mytarget').find("[name='summary']").type(summary);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19000").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div[id='select2-drop'] input[type='text']").type(IssueSource).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19001").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("#select2-drop .select2-search .select2-input").type(Agency_Entities).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("div#s2id_select_customfield_19002").click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("#select2-drop .select2-search .select2-input").type(typeOfIssue).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find("input#customfield_19003").type(date).wait(3000).type('{enter}');
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('textarea[name="customfield_19004"]').type(issueDescription);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input[name="customfield_19005"]').type(audit_exam);
        cy.wait(5000);
        // cy.switchIframe('#mytarget').find('#s2id_select_customfield_20302 > ul.select2-choices').type(responsibleDepartment).wait(3000).type('{enter}');
        // cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19007').type(issueOwner);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19008').type(resolutiondueDate);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('select#customfield_19011').wait(2000).select(rootCause);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('textarea#customfield_19012').type(rootCauseDescription);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input#customfield_19013').type(submitterName);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.form-body > fieldset:nth-of-type(2) > div').contains(repeatFinding).click();
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('select#customfield_19018').wait(2000).select(priority);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.form-body > div:nth-of-type(24) > div.radio').contains(assigneeType);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('button#assign-to-me-trigger').click();
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('input#duedate').type(resolutiondueDate);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('input[name="customfield_19019"]').type(projectNumber);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_18100 ul.select2-choices').type(subjectArea);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('div[id="s2id_select_customfield_21700"] a[class="select2-choice"]').click();
        cy.wait(10000);
        const filepath = 'cypress/attachment/testing.txt';
        cy.switchIframe('#mytarget').find('input[type="file"]').selectFile(filepath, { force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('div#select2-drop  .select2-input').type(severity).type('{enter}');
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#issue-create-submit').click();
        cy.wait(50000);
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId');
        cy.wait(1000)
        cy.get('@ticketId').then((ticketId) => {
            cy.writeFile(filename, ticketId);
            cy.wait(30000);
        });

    }
    validateData(taskType, assigneeName, reporter, IssueSource, Agency_Entities, typeOfIssue, issueDescription, audit_exam, issueOwner, rootCause, rootCauseDescription, submitterName, repeatFinding, priority, projectNumber, subjectArea, severity) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('span#type-val').contains(taskType);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('span#assignee-val').contains(assigneeName);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('span#reporter-val').contains(reporter);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19000-val').contains(IssueSource);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19001-val').contains(Agency_Entities);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19002-val').contains(typeOfIssue);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19004-val').contains(issueDescription);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19005-val').contains(audit_exam);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19007-val').contains(issueOwner);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19011-val').contains(rootCause);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19012-val').contains(rootCauseDescription);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19013-val').contains(submitterName);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19014-val').contains(repeatFinding);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19018-val').contains(priority);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_19019-val').contains(projectNumber);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_18100-val').contains(subjectArea);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#customfield_21700-val').contains(severity);
        cy.wait(10000);

    }
    rejectIssueForm(rejectComment, rejectStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_21').click();
        cy.wait(30000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(rejectComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#issue-workflow-transition-submit').click();
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('span#status-val').contains(rejectStatus);

    }
    //Reopen issue form
    reopenIssueForm(reopenButton, reopenComment, reopenStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(reopenButton).click();
        cy.wait(30000);
        //reopen comment window popup not appearing

        // cy.get("#mytarget").then(function ($iframe1) {
        //     const iframe2 = $iframe1.contents().find('#mce_0_ifr')
        //     cy.wrap(iframe2).as('iframe2ref')
        //     cy.get('@iframe2ref').then(function ($iFrame2) {
        //         const iframe2contents = $iFrame2.contents().find('#tinymce')
        //         cy.wait(10000);
        //         cy.wrap(iframe2contents).find('p:nth-child(1)').type(reopenComment)


        //     })
        // });
        // cy.wait(10000);
        // cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        // cy.wait(20000);
        // cy.switchIframe('#mytarget').find('#status-val').contains(reopenStatus);
    }

    rejectSubTask(statusSubtaskreject, submittedStatus, rejectSubtaskButton, rejectSubtaskStatus) {

        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_11').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusSubtaskreject);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(submittedStatus);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(rejectSubtaskButton).click();
        cy.wait(30000);
        //adding reject comment and submitted the reject form,
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type("Reject with Automation")
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);

        cy.switchIframe('#mytarget').find('span#status-val').contains(rejectSubtaskStatus);
        cy.wait(3000);

    }



}
export default IssueManagementGroup_PO;