import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';
const filename = 'cypress/fixtures/CMSIssue/TicketIdUnassignee.txt'
const filename2 = 'cypress/fixtures/CMSIssue/TicketIdSubtaskUnassignee.txt'
class IssueWorkflowUnAssignee_PO {
    workflowUnAssigneeProcess(acceptanceComment,statusAfterAccept,Subtasksummary,Description,prioritySubtask,site,subjectArea)
    {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        //accept button click
        cy.switchIframe('#mytarget').find('a#action_id_11').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptanceComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('span#status-val.value').contains(statusAfterAccept);
        cy.wait(2000);
        //Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click();
        cy.wait(20000);
        // cy.switchIframe('#mytarget').find('div#issuetype-single-select').contains(issueType);
        // cy.wait(2000);
        cy.switchIframe('#mytarget').find("[name='summary']").type(Subtasksummary);
        cy.wait(2000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
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
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_15906'] ul[class='select2-choices']").type(site);
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
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketIdsubtask');
        cy.wait(1000)
        cy.get('@ticketIdsubtask').then((ticketIdsubtask) => {
            cy.writeFile(filename2,ticketIdsubtask);
            cy.wait(30000);
        });
    }
    validateDataSubtask(issueType,issueSubtaskNewStatus,site,Description,assigneeName)
    {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find("span#type-val").contains(issueType);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueSubtaskNewStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("#customfield_15906-val").contains(site);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("div#description-val").contains(Description);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find("span#assignee-val").contains(assigneeName);
        cy.wait(1000);
    }
    subTaskWorkflowProcess(subtasksubmitButton,statusSubtask,actionPlanStatus,submittedStatus,acceptComment,subtaskcloseStatus)
    {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(subtasksubmitButton).click();
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusSubtask);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('#action_id_51').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('textarea#customfield_18306').type(actionPlanStatus);
        cy.wait(2000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(submittedStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(subtaskcloseStatus);
        cy.wait(1000);
        
    }
    reopenSubtask(reopenStatus,submittedStatus,acceptComment,subtaskcloseStatus)
    {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_91').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(reopenStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_41').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(submittedStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(subtaskcloseStatus);
        cy.wait(1000);
        
    }
    workflowUnAssigneeProcessAfterSubtask(resolveComment,issueResolveStatus,acceptedComment,issueAcceptedStatus)
    {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_31').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(resolveComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueResolveStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_121').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptedComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueAcceptedStatus);
        cy.wait(1000);
    }
    workflowUnAssigneeProcessReturnToOwner(resolveComment,issueResolveStatus,returntoOwnerButton,returntoownerComment,returnToOwnerStatus,resolveAfterRTO,acceptedComment,issueAcceptedStatus)
    {
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#action_id_31').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(resolveComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueResolveStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(returntoOwnerButton).click();
        cy.wait(30000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(returntoownerComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(returnToOwnerStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_31').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(resolveComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueResolveStatus);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(resolveAfterRTO).click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptedComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(issueAcceptedStatus);
        cy.wait(1000);
    }
    
    workflowUnAssigneeProcessReopen(acceptanceComment,statusAfterAccept,Subtasksummary,Description,prioritySubtask,site,subjectArea)
    {
        const dueDate = dayjs().day(5).format("DD/MMM/YYYY");
        cy.log(dueDate);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        //accept button click
        cy.switchIframe('#mytarget').find('a#action_id_11').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptanceComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find('span#status-val.value').contains(statusAfterAccept);
        cy.wait(2000);
        //Create action plan button
        cy.switchIframe('#mytarget').find('#assign-issue12').click();
        cy.wait(20000);
        // cy.switchIframe('#mytarget').find('div#issuetype-single-select').contains(issueType);
        // cy.wait(2000);
        cy.switchIframe('#mytarget').find("[name='summary']").type(Subtasksummary);
        cy.wait(2000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
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
        cy.switchIframe('#mytarget').find("div[id='s2id_select_customfield_15906'] ul[class='select2-choices']").type(site);
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
            cy.writeFile(filename2,ticketIdsubtask);
            cy.wait(30000);
        });
    }
    
    subTaskWorkflowProcessAfterReject(subtasksubmitButton,statusSubtask,acceptComment,subtaskcloseStatus)
    {
        cy.readFile(filename2).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('#opsbar-opsbar-transitions > a').contains(subtasksubmitButton).click();
        cy.wait(30000);
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusSubtask);
        cy.wait(2000);
        cy.wait(1000);
        cy.switchIframe('#mytarget').find('#action_id_71').click();
        cy.wait(20000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('iframe')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(acceptComment)
            })
        });
        cy.wait(3000);
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(20000);
        cy.switchIframe('#mytarget').find("span#status-val").contains(subtaskcloseStatus);
        cy.wait(1000);
        
    }
}
export default IssueWorkflowUnAssignee_PO;