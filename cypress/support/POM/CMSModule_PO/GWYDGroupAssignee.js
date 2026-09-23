import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIDGrpGWYD.txt'
const filename2 = 'cypress/fixtures/CMSIssueExternalWebforms/TicketIdSubtaskGrpGWYD.txt'

class GWYDGroupAssignee {
    setCustomerProfile(issueOwnerType, issueOwnerTypeName, customerProfileUpdatemsg) {
        cy.get("[name='issueProcessOwnerType'][value='Group']").click({force:true});
        cy.wait(3000);
        cy.get('#s2id_issueProcessOwnerGroupId > .select2-choice').click();
        cy.wait(4000);
        cy.get('#s2id_autogen9_search').type(issueOwnerTypeName).wait(3000).type('{enter}');
        cy.wait(4000);
        cy.get('.m-form__actions > .btn-primary').click();
        cy.get('div.toast-message').contains(customerProfileUpdatemsg);
    }

    validateMandatoryFields(errorMessageSubName, errorMessageResDept, errorMessageSummary, errorMessageIssueDescrp, errorMessageIssueType, errorMessageAssignee, errorMessageSeverity, errorMessageAgencyEntities, errorMessageIssueSource) {
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

    fillIssueExternalForm(summaryForm, submitterName, responsibleDept, issueType, issueDescription, agencyEntities, severityForm, assignee_owner, issueSource, successMessage) {
        const date = dayjs().format("D/MMM/YYYY");
        cy.log(date);
        cy.switchIframe('#mytarget').find('input#summary').type(summaryForm);
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19006').click();
        cy.switchIframe('#mytarget').find('#select2-drop > div').type(responsibleDept).type('{enter}');
        cy.wait(4000);
        cy.switchIframe('#mytarget').find('#customfield_19008').type(date);
        cy.wait(3000)
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19002 > a').click();
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(issueType).type('{enter}');
        cy.wait(3000)
        cy.switchIframe('#mytarget').find('#customfield_19003').type(date);
        cy.wait(3000)
        cy.switchIframe('#mytarget').find('#customfield_19004').type(issueDescription);
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19001').click();
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(agencyEntities).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_21700').click();
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(severityForm).type('{enter}');
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_19013').type(submitterName);
        cy.wait(3000)
        cy.switchIframe('#mytarget').find('#customfield_19007').type(assignee_owner);
        cy.wait(3000)
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19000').click();
        cy.switchIframe('#mytarget').find('#select2-drop > div > input').type(issueSource).type('{enter}');
        cy.wait(3000)
        ///////Group Assignee
        cy.switchIframe('#mytarget').find('#issue-create > div.form-body > div:nth-child(35) > div:nth-child(3)').click();
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_12802').type("GWYDEMO-Issue Management Group");
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
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('input#assignee-input').type(assigneeName).wait(1000).type('{enter}');
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('span#fieldassignee').click();
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('tr:nth-of-type(1) > .issuekey > .issue-link').click();
        cy.wait(30000);

    }
    issueFormDataValidation(summaryForm, submitterName, responsibleDept, issueType, issueDescription, agencyEntities, severityForm, assignee_owner, issueSource, issueFormType, issueStatus, assigneeName, groupAssignee) {

        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(35000);
        cy.switchIframe('#mytarget').find('#summary-val').contains(summaryForm);
        cy.switchIframe('#mytarget').find('div#customfield_19013-val').contains(submitterName);
        cy.switchIframe('#mytarget').find('div#customfield_19006-val').contains(responsibleDept);
        cy.switchIframe('#mytarget').find('div#customfield_19002-val').contains(issueType);
        cy.switchIframe('#mytarget').find('div#customfield_19004-val').contains(issueDescription);
        cy.switchIframe('#mytarget').find('div#customfield_19001-val').contains(agencyEntities);
        cy.switchIframe('#mytarget').find('div#customfield_21700-val').contains(severityForm);
        cy.switchIframe('#mytarget').find('div#customfield_19007-val').contains(assignee_owner);
        cy.switchIframe('#mytarget').find('div#customfield_19000-val').contains(issueSource);
        cy.switchIframe('#mytarget').find('#type-val').contains(issueFormType);
        cy.switchIframe('#mytarget').find('#status-val').contains(issueStatus);
        cy.wait(5000);

    }
    issueFormGroupWorkflowProcess(acceptanceComment, statusAfterAccept, Subtasksummary, Description, prioritySubtask, orgHeirarchy, subjectArea) {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);

        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        ////  accept button click
        cy.switchIframe('#mytarget').find('#action_id_11 > span').click({ force: true });
        cy.wait(35000);
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
        cy.switchIframe('#mytarget').find('#status-val').contains(statusAfterAccept);
        cy.wait(5000);
        // Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click({ force: true });
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#issuetype-field",{timeout:15000}).clear().type("Action Plan").type('{enter}');
        cy.wait(15000);
        cy.switchIframe('#mytarget').find("#summary",{timeout:15000}).type(Subtasksummary);
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
        cy.switchIframe('#mytarget').find("input#priority-field").wait(3000).type(prioritySubtask, '{enter}');
        cy.wait(2000);
        ///////Group Assignee
        cy.switchIframe('#mytarget').find('#multiple_assignee').click({ force: true });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#customfield_12802').type("GWYDEMO-Issue Management Group");
        cy.wait(2000);
        cy.switchIframe('#mytarget').find("input#duedate").type(dueDate);
        cy.wait(50000);
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_18700').wait(3000).type(orgHeirarchy, '{enter}');
        // // cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_18700'] ul[class='select2-choices']").type(orgHeirarchy);
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
        cy.switchIframe('#mytarget').find('#type-val').contains(issueType);
        cy.wait(1000);
        // cy.switchIframe('#mytarget').find('#status-val').contains(issueSubtaskNewStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("div#customfield_18700-val").contains(orgHeirarchy);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("div#description-val").contains(Description);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("span#assignee-val").contains(assigneeName);
        cy.wait(1000);
    }

    subTaskWorkflowProcess(subtasksubmitButton, statusSubtask, actionPlanStatus, submittedStatus, acceptComment, subtaskcloseStatus) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(subtasksubmitButton).click();
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#status-val').contains(statusSubtask);

        ////########Popup is not closed, This is a bug ############///////
        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('#action_id_51').click();
        // cy.wait(20000);
        // cy.switchIframe('#mytarget').find('textarea#customfield_18306').type(actionPlanStatus);
        // cy.wait(2000);
        // cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        // cy.wait(20000);
        cy.switchIframe('#mytarget').xpath('//*[@id="action_id_41"]').wait(10000).click({ force: true });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#status-val').contains(submittedStatus);
        cy.wait(15000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(30000);
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

    reopenSubtask(reopenStatus, submittedStatus, acceptComment, subtaskcloseStatus) {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_91').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#status-val").contains(reopenStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
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
        cy.wait(10000);
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
    workflowGroupAssigneeProcessReturnToOwner(resolveComment, issueResolveStatus, returntoOwnerButton, returntoownerComment, returnToOwnerStatus, resolveAfterRTO, acceptedComment, issueAcceptedStatus) {
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
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(returntoOwnerButton).click();
        cy.wait(30000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(returntoownerComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find("#status-val").contains(returnToOwnerStatus);
        cy.wait(1000);
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
        cy.wait(5000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(resolveAfterRTO).click();
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

    workflowGroupAssigneeProcessReopen(acceptanceComment, statusAfterAccept, Subtasksummary, Description, prioritySubtask, orgHeirarchy, subjectArea, actionPlan) {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);

        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        //accept button click
        cy.switchIframe('#mytarget').find('a#action_id_11').click();
        cy.wait(25000);
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
        cy.wait(2000);
        //Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#issuetype-field").click();
        cy.switchIframe('#mytarget').find("#issuetype-field").type(actionPlan).type('{enter}');
        cy.wait(10000);
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
        cy.wait(40000);
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

    }
    rejectIssueForm(rejectComment, rejectStatus) {
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId');
        cy.wait(1000)
        cy.get('@ticketId').then((ticketId) => {
            cy.writeFile(filename, ticketId);
            cy.wait(3000);
        });
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
    //Reopen issue form
    reopenIssueForm(reopenButton, reopenComment, reopenStatus) {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(reopenButton).click();
        cy.wait(40000);
    }

    rejectSubTask(statusSubtaskreject, submittedStatus, rejectSubtaskButton, rejectSubtaskStatus) {

        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text + '{enter}')
        });
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('#action_id_11').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('#status-val').contains(statusSubtaskreject);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("#status-val").contains(submittedStatus);
        cy.wait(10000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(rejectSubtaskButton).click();
        cy.wait(30000);
        cy.get("#mytarget").then(function ($iframe1) {
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function ($iFrame2) {
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type("reject Subtask Comment")
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('#issue-workflow-transition-submit').click();
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('#status-val').contains(rejectSubtaskStatus);
        cy.wait(3000);

    }


}
export default GWYDGroupAssignee;