import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIDGrp.txt'
const filename2 = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIdSubtaskGrp.txt'

class FCPTLGroupAssignee {
    setCustomerProfile(issueOwnerType, issueOwnerTypeName, customerProfileUpdatemsg) {
        cy.get('.form-group.m-form__group.row.pb-3:nth-child(29) > .col-md-6 > .m-radio-inline').contains(issueOwnerType).click();
        cy.wait(3000);
        cy.get('#s2id_issueProcessOwnerGroupId > .select2-choice').click();
        cy.wait(4000);
        cy.get('#s2id_autogen6_search').type(issueOwnerTypeName).wait(3000).type('{enter}');
        cy.wait(4000);
        cy.get('.m-form__actions > .btn-primary').click();
        cy.get('div.toast-message').contains(customerProfileUpdatemsg);
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
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div.aui-message.aui-message-error > p:nth-child(7)').contains(errorMessageOwners);
    }

    fillIssueExternalForm(summaryForm, IssueSource, issueDescription, issueType, owner, submitterName, responsibleDept, potentialLoss, actualLoss, rootCause) {
        const date = dayjs().format("D/MMM/YYYY");
        cy.log(date);

        cy.switchIframe('#mytarget').find('input#summary').type(summaryForm);
        cy.wait(3000);
        cy.switchIframe('#mytarget').xpath('//*[@id="s2id_select_customfield_19000"]').click();
        cy.wait(10000);
        cy.switchIframe('#mytarget').xpath('//*[@id="select2-drop"]/div/input').type("Others").type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19004').type(issueDescription);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19002').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(issueType).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19003').type(date);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19007').type(owner);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19013').type(submitterName);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19006').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(responsibleDept).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19016').type(date, { force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21310').type(potentialLoss, { force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21311').type(actualLoss, { force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19011').type(rootCause).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div:nth-child(34) > div:nth-child(3)').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_12802').type("CPTL-Risk Management");
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

    openTicket(assigneeName) {
        cy.switchIframe('#mytarget').find('.criteria-list > li:nth-of-type(4)').click();
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('input#assignee-input').type(assigneeName).wait(1000).type('{enter}');
        cy.wait(2000);
        // cy.switchIframe('#mytarget').find('span#fieldassignee').click();
        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('tr:nth-of-type(1) > .issuekey > .issue-link').click();
        // cy.wait(30000);

    }
    issueFormDataValidation(summaryForm, submitterName, responsibleDept, issueType, issueDescription, potentialLoss, actualLoss, owner, issueSource, issueFormType, issueStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('h1#summary-val').contains(summaryForm);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19013-val').contains(submitterName);
        cy.wait(3000);
        // cy.switchIframe('#mytarget').find('#customfield_19006-val').contains(responsibleDept);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19002-val').contains(issueType);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19004-val').contains(issueDescription);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21310-val').contains(potentialLoss);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_21311-val').contains(actualLoss);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19007-val').contains(owner);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19000-val').wait(3000).contains(issueSource);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#type-val').contains(issueFormType);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#status-val').contains(issueStatus);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId');
        cy.wait(1000)
        cy.get('@ticketId').then((ticketId) => {
            cy.writeFile(filename, ticketId);
            cy.wait(3000);
        });
    }

    issueFormGroupWorkflowProcess(acceptanceComment, statusAfterAccept, Subtasksummary, Description, prioritySubtask, orgHeirarchy, subjectArea) {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);

        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        //accept button click
        cy.switchIframe('#mytarget').find('#action_id_11 > span').click({ force: true });
        cy.wait(3000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptanceComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('#status-val.value').contains(statusAfterAccept);
        cy.wait(10000);
        ///Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click({ force: true });
        cy.wait(20000);

        cy.switchIframe('#mytarget').find("#issuetype-single-select").click();
        cy.switchIframe('#mytarget').find("#issuetype-field").type("Action Plan").type('{enter}');
        cy.wait(12000);
        cy.switchIframe('#mytarget').find("#summary").type(Subtasksummary);
        cy.wait(2000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(Description)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find("input#priority-field").wait(3000).type(prioritySubtask);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('button#assign-to-me-trigger').click();
        cy.wait(2000);
        cy.switchIframe('#mytarget').find("input#duedate").type(dueDate);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18700'] ul[class='select2-choices']").type(orgHeirarchy);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18100'] ul[class='select2-choices']").type(subjectArea);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('input#create-issue-submit').click();
        cy.wait(30000);
        //Subtask click
        cy.switchIframe('#mytarget').find("td[class='stsummary'] a[class='issue-link']").click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('#key-val').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('#key-val').invoke('text').as('ticketIdsubtask');
        cy.wait(1000)
        cy.get('@ticketIdsubtask').then((ticketIdsubtask) => {
            cy.writeFile(filename2, ticketIdsubtask);
            cy.wait(30000);
        });
    }
    validateDataSubtask(issueType, issueSubtaskNewStatus, orgHeirarchy, Description, assigneeName) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find("#type-val").contains(issueType);
        // cy.wait(1000);
        // cy.switchIframe('#mytarget').find("#status-val").contains(issueSubtaskNewStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("div#customfield_18700-val").contains(orgHeirarchy);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("div#description-val").contains(Description);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("span#assignee-val").contains(assigneeName);
        cy.wait(1000);
    }

    rejectIssueForm(rejectComment, rejectStatus) {
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId');
        cy.wait(1000)
        cy.get('@ticketId').then((ticketId) => {
            cy.writeFile(filename, ticketId);
            cy.wait(3000);
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
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('#status-val').contains(rejectStatus);

    }

    reopenSubtask(reopenStatus, submittedStatus, acceptComment, subtaskcloseStatus) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_91').click();
        cy.wait(35000);
        cy.switchIframe('#mytarget').find("#status-val").contains(reopenStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#status-val").contains(submittedStatus);
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find("#status-val").contains(subtaskcloseStatus);
        cy.wait(1000);

    }
    workflowGroupAssigneeProcessAfterSubtask(resolveComment, issueResolveStatus, acceptedComment, issueAcceptedStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_31').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(resolveComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find("#status-val").contains(issueResolveStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptedComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find("#status-val").contains(issueAcceptedStatus);
        cy.wait(1000);
    }
    
    workflowGroupAssigneeProcessReopen(acceptanceComment, statusAfterAccept, Subtasksummary, Description, prioritySubtask, orgHeirarchy, subjectArea) {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);

        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        //accept button click
        cy.switchIframe('#mytarget').find('a#action_id_11').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptanceComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('span#status-val.value').contains(statusAfterAccept);
        cy.wait(2000);
        //Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click();
        cy.wait(20000);
        // cy.switchIframe('#mytarget').find('div#issuetype-single-select').contains(issueType);
        // cy.wait(2000);
        cy.switchIframe('#mytarget').find("[name='summary']").type(Subtasksummary);
        cy.wait(2000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(Description)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find("input#priority-field").wait(3000).type(prioritySubtask);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('button#assign-to-me-trigger').click();
        cy.wait(2000);
        cy.switchIframe('#mytarget').find("input#duedate").type(dueDate);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18700'] ul[class='select2-choices']").type(orgHeirarchy);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18100'] ul[class='select2-choices']").type(subjectArea);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('.select2-result-label').click();
        cy.wait(4000);
        // cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18100'] ul[class='select2-choices']").type(subjectArea);
        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('.select2-result-label').click();
        // cy.wait(4000);
        cy.switchIframe('#mytarget').find('input#create-issue-submit').click();
        cy.wait(30000);
        //Subtask click
        cy.switchIframe('#mytarget').find("tr:nth-of-type(1) > .stsummary > .issue-link").click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketIdsubtask');
        cy.wait(1000)
        cy.get('@ticketIdsubtask').then((ticketIdsubtask) => {
            cy.writeFile(filename2, ticketIdsubtask);
            cy.wait(30000);
        });
    }

    subTaskWorkflowProcessAfterReject(subtasksubmitButton, statusSubtask, acceptComment, subtaskcloseStatus) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(subtasksubmitButton).click();
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('#status-val').contains(statusSubtask);
        cy.wait(2000);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find("#status-val").contains(subtaskcloseStatus);
        cy.wait(2000);

    }
    subTaskWorkflowProcess(subtasksubmitButton, statusSubtask, actionPlanStatus, submittedStatus, acceptComment, subtaskcloseStatus) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('#action_id_11').wait(5000).contains("Start Progress").click();
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('#status-val').contains("In Progress");

        ////########Popup is not closed, This is a bug ############///////

        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('#action_id_51').click();
        // cy.wait(20000);
        // cy.switchIframe('#mytarget').find('textarea#customfield_18306').type(actionPlanStatus);
        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        // cy.wait(20000);
        // cy.switchIframe('#mytarget').find('#action_id_41').click();

        cy.switchIframe('#mytarget').xpath('//*[@id="action_id_41"]').wait(10000).click({ force: true });
        cy.wait(35000);
        cy.switchIframe('#mytarget').find("#status-val").contains(submittedStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#status-val").contains(subtaskcloseStatus);
        cy.wait(1000);

    }
    reopenIssueForm(reopenButton, reopenStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(reopenButton).click();
        cy.wait(35000);
        //reopen comment window popup not appearing
        // cy.get("#mytarget").then(function($iframe1){
        //     const iframe2 = $iframe1.contents().find('iframe')
        //     cy.wrap(iframe2).as('iframe2ref')
        //     cy.get('@iframe2ref').then(function($iFrame2){
        //         const iframe2contents = $iFrame2.contents().find('#tinymce')
        //         cy.wrap(iframe2contents).find('p:nth-child(1)').type(reopenComment)
        //     })
        // });
        // cy.wait(3000);
        // cy.switchIframe('#mytarget').find('#issue-workflow-transition-submit').click();
        // cy.wait(30000)
        cy.switchIframe('#mytarget').find('#status-val').contains(reopenStatus);
    }
    rejectSubTask(statusSubtaskreject, submittedStatus, rejectSubtaskButton, rejectSubtaskStatus) {

        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('#action_id_11').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusSubtaskreject);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#status-val").contains(submittedStatus);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(rejectSubtaskButton).click();
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('#status-val').contains(rejectSubtaskStatus);
        cy.wait(3000);

    }



}

export default FCPTLGroupAssignee