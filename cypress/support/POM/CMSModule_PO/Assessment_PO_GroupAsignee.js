import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/CMSModule/TicketIdGroup.txt'
const filepath = 'cypress/attachment/testing.txt';


class Assessment_PO_GroupAsignee{

    
    fillForm(summary,groupAssigneeName,assessmentTemplate,assessmentCategory) {
        cy.switchIframe('#mytarget').find("[name='summary']").type(summary);
        cy.switchIframe('#mytarget').find('#multiple_assignee').click({force: true});
        cy.switchIframe('#mytarget').find('#customfield_12802').type(groupAssigneeName);
        cy.switchIframe('#mytarget').find('#customfield_16704-input').type(assessmentTemplate).wait(7000).type('{enter}');
        cy.wait(7000)
        //cy.switchIframe('#mytarget').find('li#aui-uid-1-0').click();
        cy.switchIframe('#mytarget').find('#s2id_select_customfield_19118').type(assessmentCategory);
        cy.switchIframe('#mytarget').find('#issue-create-submit').click({force:true});
        cy.wait(20000)
        cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketIdnew');
        cy.wait(1000)
        cy.get('@ticketIdnew').then((ticketIdnew) => {
            cy.writeFile(filename,ticketIdnew);
            cy.wait(30000);
            });


    }
    editDetails(description){

        cy.switchIframe('#mytarget').find('#edit-issue').click({force:true});
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('#description').click({force:true}).type(description,{force:true});
        cy.wait(2000)
        cy.switchIframe('#mytarget').find('#issue-edit-submit').click({force:true});
        cy.wait(2000)

    }
    validateDataEdit(description,groupAssigneeNamevalidate, Recurrence){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#description-val > div > p').contains(description);
        cy.wait(2000)
        cy.get('@iframe').find('#customfield_12802-val').contains(groupAssigneeNamevalidate);
        cy.wait(2000)
        // cy.get('@iframe').find('#customfield_16704-input').contains(assessmentTemplate);
        // cy.wait(2000)
        cy.get('@iframe').find('#customfield_10701-val').contains(Recurrence);
        cy.wait(2000)
    }
    validateData(statusnew,Recurrence){
        
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusnew);
        cy.wait(2000)
        cy.switchIframe('#mytarget').find('#customfield_10701-val').contains(Recurrence);
        cy.wait(2000)
    }
    workflowProcessTemplate1(statusInprogress,q1Response,q2Response,templateDraft_status,templateSubmit_status){
        //start assessment
        
        cy.wait(30000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(40000);
       
        cy.switchIframe('#mytarget').find('#action_id_721 > span').click();
        cy.wait(10000)
        //verify status as in progress
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusInprogress);
        cy.wait(2000)
        //open template
        cy.switchIframe('#mytarget').find('#descriptiont-val > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').invoke('removeAttr', 'target').click();
        cy.wait(40000);
        //attempt template q1
        cy.switchIframe('#mytarget').find('#section_div_102390 > div.m-portlet__body > div > div:nth-child(1)').contains(q1Response).click();
        cy.wait(2000)
        //attempt template q2
        cy.switchIframe('#mytarget').find('#section_div_102390 > div.m-portlet__body > div > div:nth-child(2)').contains(q2Response).click();
        cy.wait(2000)
        cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').invoke('text').as('ticketId');
        //Save the template as draft
        cy.switchIframe('#mytarget').find('button#draftButton').click();
        cy.wait(60000)
        //verify status of template as draft
        cy.reload();
        cy.wait(40000);
        // cy.wait(30000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(40000);
       
        //cy.wait(30000);
        cy.switchIframe('#mytarget').find('tbody > tr:nth-of-type(1) > td:nth-of-type(2) > span').contains(templateDraft_status);
        cy.wait(20000)
        // cy.reload();
        // cy.wait(30000)
        cy.switchIframe('#mytarget').xpath('//a[starts-with(@href,"/predict360/surveytool/takeSurvey?")]').invoke('removeAttr', 'target').click();
        //cy.switchIframe('#mytarget').find('td:nth-of-type(1) > [target="_blank"]').invoke('removeAttr', 'target').click();
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').invoke('text').as('ticketId2');
        //submit the template
        cy.switchIframe('#mytarget').find('button#saveButton').click();
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('button#submitSurveyButton').click();
        cy.wait(40000)
        cy.reload();
        cy.wait(40000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(30000);
       
        cy.switchIframe('#mytarget').find('.user-content-block1 > table > tbody >tr:nth-child(1) > td:nth-child(2) >span').should('contain.text',templateSubmit_status);
        cy.wait(2000)
    }
    reviewAssessment(reviewMessage,reviewComment,reviewStatus,q1Response,q2Response){
        cy.switchIframe('#mytarget').find('#action_id_741 > span').click();
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('#customfield_16705').type(reviewMessage);
        cy.wait(15000)
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(reviewComment)
            })
        })
        //cy.switchIframe('#mytarget').find('body > div:nth-child(14) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(9) > textarea:nth-child(1)').type(reviewComment);
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('span#status-val.value').should('contain.text', reviewStatus);
        cy.wait(10000)
        // //view results screen
        cy.switchIframe('#mytarget').find('td:nth-of-type(5) > a#template-analyze-btn').invoke('removeAttr', 'target').click();
        cy.wait(20000)
        // //expand all
        cy.switchIframe('#mytarget').find('.btn.btn-primary.surResultSectionTglr').click();
        cy.wait(20000)
        cy.switchIframe('#mytarget').find('table[id="tblQuestion{283298}Answers"] th:nth-child(2)').should('contain.text', q1Response);
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('table[id="tblQuestion{283299}Answers"] th:nth-child(2)').should('contain.text', q2Response);
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').invoke('text').as('ticketId3');
        //cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').click();
         cy.wait(40000)
    }
    reviewAssessmentGroup(reviewMessage,reviewComment,reviewStatus){
        cy.reload();
        cy.wait(40000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(40000)
        
        cy.switchIframe('#mytarget').find('#action_id_741 > span').click();
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('#customfield_16705').type(reviewMessage);
        cy.wait(15000)
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(reviewComment)
            })
        })
        //cy.switchIframe('#mytarget').find('body > div:nth-child(14) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(9) > textarea:nth-child(1)').type(reviewComment);
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('button#assign-to-me-trigger').click();
        cy.wait(10000)
        cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('span#status-val.value').should('contain.text', reviewStatus);
        //cy.wait(10000)
        // //view results screen
        // cy.switchIframe('#mytarget').find('td:nth-of-type(5) > a#template-analyze-btn').invoke('removeAttr', 'target').click();
        // cy.wait(20000)
        // // //expand all
        // cy.switchIframe('#mytarget').find('.btn.btn-primary.surResultSectionTglr').click();
        // cy.wait(20000)
        // cy.switchIframe('#mytarget').find('table[id="tblQuestion{284538}Answers"] th:nth-child(2)').should('contain.text', q1Response);
        // cy.wait(10000)
        // cy.switchIframe('#mytarget').find('table[id="tblQuestion{284539}Answers"] th:nth-child(2)').should('contain.text', q2Response);
        // cy.wait(10000)
        // cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').invoke('text').as('ticketId3');
        //cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').click();
         cy.wait(40000)
    }
    completeAssessment(statusComplete,Close_Reopen){
        //complete button click
        cy.reload();
        cy.wait(50000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(40000);
       
        cy.switchIframe('#mytarget').find('#action_id_781 > span').click();
        cy.wait(20000)
         //verify status
        cy.switchIframe('#mytarget').find('#status-val.value').contains(statusComplete);
        cy.wait(20000)
        //button either close or reopen
        cy.switchIframe('#mytarget').find('div#opsbar-opsbar-transitions > a > span').contains(Close_Reopen).click();
        cy.wait(20000)
        // //close assessment
        // cy.switchIframe('#mytarget').find('#action_id_1051 > span').click();
        //cy.wait(20000)

    }
    
    reopenAssessment(statusReopen){
        //complete button click
        cy.switchIframe('#mytarget').find('#action_id_781 > span').click();
        cy.wait(20000)
         //verify status
        cy.switchIframe('#mytarget').find('#status-val.value').contains(statusReopen);
        cy.wait(20000)
        // //button either close or reopen
        // cy.switchIframe('#mytarget').find('div#opsbar-opsbar-transitions > a > span').contains(Close_Reopen).click();
        // cy.wait(20000)
        // //close assessment
        // cy.switchIframe('#mytarget').find('#action_id_1051 > span').click();
        // cy.wait(20000)

    }
    workflowProcessTemplate2(statusInprogress,q1Response,q2Response,q3Response,q4Response,templateSubmit_status)
    {   cy.readFile(filename).then(text => {
        cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
    });
        cy.wait(50000)
        cy.switchIframe('#mytarget').find('#action_id_721 > span').click();
        cy.wait(10000)
        //verify status as in progress
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusInprogress);
        cy.wait(2000)
       //open template
       cy.switchIframe('#mytarget').find('#descriptiont-val > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').invoke('removeAttr', 'target').click();
       cy.wait(40000);
       //attempt template q1
       cy.switchIframe('#mytarget').find('#section_div_102392 > div.m-portlet__body > div > div:nth-child(1)').contains(q1Response).click();
       cy.wait(2000)
       //attempt template q2
       cy.switchIframe('#mytarget').find('#section_div_102392 > div.m-portlet__body > div > div:nth-child(2)').contains(q2Response).click();
       cy.wait(2000)
       //attempt template q3
       cy.switchIframe('#mytarget').find('#section_div_102392 > div.m-portlet__body > div > div:nth-child(3)').contains(q3Response).click();
       cy.wait(2000)
       //attempt template q4
       // cy.switchIframe('#mytarget').find('#section_div_102197 > .m-portlet__body > :nth-child(1) > :nth-child(2)').contains(q4Response).click();
       // cy.wait(2000)
       // cy.switchIframe('#mytarget').find('#section_div_102197 > .m-portlet__body > :nth-child(1) > :nth-child(3)').contains(q4Response).click();
       // cy.wait(2000)
        cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').invoke('text').as('ticketId2');
        cy.wait(4000)
        cy.switchIframe('#mytarget').find('button#saveButton').click();
        cy.wait(30000)
        cy.switchIframe('#mytarget').find('button#submitSurveyButton').click();
        cy.reload();
        cy.wait(30000);
        cy.readFile(filename).then(text => {
            cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
        });
        cy.wait(50000);
       
        cy.switchIframe('#mytarget').find('.user-content-block1 > table > tbody >tr:nth-child(1) > td:nth-child(2) >span').should('contain.text',templateSubmit_status);
        cy.wait(2000)
        
    }

    workflowProcessTemplate3(statusInprogress,q1Response,q2Response,q2Response2,q3Response,q4Response,q5Response,q6Response,q7Response,q8Response)
    {   cy.readFile(filename).then(text => {
        cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
    });
        cy.wait(40000);
        cy.switchIframe('#mytarget').find('#action_id_721 > span').click();
        cy.wait(10000)
        //verify status as in progress
        cy.switchIframe('#mytarget').find('span#status-val').contains(statusInprogress);
        cy.wait(2000)
        //open template
        cy.switchIframe('#mytarget').find('#descriptiont-val > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').invoke('removeAttr', 'target').click();
        cy.wait(40000);
        //attempt template q1
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(1)').contains(q1Response).click();
        cy.wait(5000)
        //attempt template q2
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(2) > div.mt-3.mb3 > div.fileupload-container > div.custom-file.mb-1 > input').click();
        cy.wait(6000)
        //cy.visit('https://stage.360factors.com/predict360/surveytool/takeSurvey?&id=48656&type=predict.survey.type.singleparty')
        //cy.wait(30000);,
        //upload file
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(2) > div.mt-3.mb3 > div.fileupload-container > div.custom-file.mb-1 > input').selectFile(filepath);
        //attempt template q2
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(2)').contains(q2Response).click();
        cy.wait(2000)
        //attempt template q2
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(2)').contains(q2Response2).click();
        cy.wait(2000)
            //attempt template q3
            //  cy.switchIframe('#mytarget').find('#section_div_102198 > .m-portlet__body > :nth-child(1) > :nth-child(3)').contains(q3Response).click();
            //  cy.wait(2000)
            //  //section 2 q1
            // cy.switchIframe('#mytarget').find('#section_div_102199 > .m-portlet__body > :nth-child(1) > :nth-child(1)').contains(q4Response).click();
            // cy.wait(2000)
        //section 2 q2
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(5)').contains(q5Response).click();
        cy.wait(2000)
        //section q3
        cy.switchIframe('#mytarget').find('#section_div_127079 > div.m-portlet__body > div > div:nth-child(6)').contains(q6Response).click();
        cy.wait(2000)
            //section 3 q1
            // cy.switchIframe('#mytarget').find('#section_div_102200 > .m-portlet__body > :nth-child(1) > :nth-child(1)').contains(q7Response).click();
            // cy.wait(2000)
            //textarea
            // switchIframe('#mytarget').find('#section_div_102200 > .m-portlet__body > :nth-child(1) > :nth-child(1) textarea[name="ans_comment_102200_1028524"]').type(q8Response);
        //   cy.wait(2000);
            // const filepath2 = 'cypress/attachment/testing.txt';
            // cy.switchIframe('#mytarget').find('#section_div_102200 > .m-portlet__body > :nth-child(1) > :nth-child(1) > .mt-3 > .fileupload-container > .custom-file > .custom-file-input').selectFile(filepath2);
            // cy.wait(3000);
        cy.switchIframe('#mytarget').find('button#saveButton').click();
        cy.wait(40000)
        cy.switchIframe('#mytarget').find('button#submitSurveyButton').click();
        cy.wait(50000)

}
closeAfterReopen(statusComplete,CloseTemplate2){
    cy.reload();
    cy.wait(60000);
    cy.readFile(filename).then(text => {
        cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')        
    });
    cy.wait(40000);
    cy.switchIframe('#mytarget').find('#action_id_781 > span').click();
    cy.wait(20000)
     //verify status
    cy.switchIframe('#mytarget').find('#status-val.value').contains(statusComplete);
    cy.wait(20000)
    cy.switchIframe('#mytarget').find('div#opsbar-opsbar-transitions > a > span').contains(CloseTemplate2).click();
    cy.wait(20000)
}
reviewAssessmentTemplate2(reviewMessage,reviewComment,reviewStatus){
    cy.readFile(filename).then(text => {
        cy.switchIframe('#mytarget').find('#quickSearchInput').type(text +'{enter}')       
    });
    cy.wait(40000)
    cy.switchIframe('#mytarget').find('#action_id_741 > span').click();
    cy.wait(10000)
    cy.switchIframe('#mytarget').find('#customfield_16705').type(reviewMessage);
    cy.wait(15000)
    cy.get("#mytarget").then(function($iframe1){
        const iframe2 = $iframe1.contents().find('#mce_0_ifr')
        cy.wrap(iframe2).as('iframe2ref')
        cy.get('@iframe2ref').then(function($iFrame2){
            const iframe2contents = $iFrame2.contents().find('#tinymce')
            cy.wrap(iframe2contents).find('p:nth-child(1)').type(reviewComment)
        })
    })
    //cy.switchIframe('#mytarget').find('body > div:nth-child(14) > div:nth-child(2) > form:nth-child(2) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(9) > textarea:nth-child(1)').type(reviewComment);
    cy.wait(10000)
    cy.switchIframe('#mytarget').find('input#issue-workflow-transition-submit').click();
    cy.wait(40000)
    cy.switchIframe('#mytarget').find('span#status-val.value').should('contain.text', reviewStatus);
    cy.wait(10000)
    // //view results screen
    // cy.switchIframe('#mytarget').find('td:nth-of-type(5) > a#template-analyze-btn').invoke('removeAttr', 'target').click();
    // cy.wait(20000)
    // //expand all
    // cy.switchIframe('#mytarget').find('.btn.btn-primary.surResultSectionTglr').click();
    // cy.wait(20000)
    // cy.switchIframe('#mytarget').find('table[id="tblQuestion{284538}Answers"] th:nth-child(2)').should('contain.text', q1Response);
    // cy.wait(10000)
    // cy.switchIframe('#mytarget').find('table[id="tblQuestion{284539}Answers"] th:nth-child(2)').should('contain.text', q2Response);
    // cy.wait(10000)
    cy.switchIframe('#mytarget').find('a#key-val').invoke('text').as('ticketId3');
    //cy.switchIframe('#mytarget').find('.m-nav.m-nav--inline.m-subheader__breadcrumbs > li:nth-of-type(3) > .m-nav__link > .m-nav__link-text').click();
     cy.wait(40000)
}
// loginWithUser(userNameGroup,userNameGrouppwd,userNameGroupKey){
//     // cy.get('.m-topbar__userpic > img').click();
//     // cy.get('.btn.btn-secondary.m-btn.m-btn--bolder.m-btn--custom.m-btn--label-brand.m-btn--pill').click();
//     cy.wait(30000);
//     cy.get('input#username').type(userNameGroup);
//     cy.get('input#password').type(userNameGrouppwd);
//     cy.get('input#customerKey').type(userNameGroupKey);
// }
advanceSearchClick(){
    cy.switchIframe('#mytarget').find('#search_links_filter_link').click();
    cy.wait(40000);
    cy.switchIframe('#mytarget').find('tr:nth-of-type(1) > .issuekey > .issue-link').click();
    cy.wait(2000); 
}
}
export default Assessment_PO_GroupAsignee;