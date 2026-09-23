import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class QuestionBank_PO{

    tasksDropdownClick() {
        // cy.get('[data-target="#addRiskControlItemName"]').click();
        // cy.switchToIframe('#mytarget').click({force:true});
        // cy.get("[href='\#tools-dropdown-items']").click();
        // cy.wait(1000);
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        // cy.get('@iframe').find('#cm_bi_reports').invoke('show').click({force:true})
        // cy.wait(500);
        cy.get('@iframe').find('#my_bfsi_Event').trigger('mouseover');
        cy.wait(10000);
    }

    incidentDropdownClick() {
        // cy.get('[data-target="#addRiskControlItemName"]').click();
        // cy.switchToIframe('#mytarget').click({force:true});
        // cy.get("[href='\#tools-dropdown-items']").click();
        // cy.wait(1000);
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        // cy.get('@iframe').find('#cm_bi_reports').invoke('show').click({force:true})
        // cy.wait(500);
        cy.get('@iframe').find('#my_bfsi_incident').trigger('mouseover');
        cy.wait(10000);
    }

    complaintSelectClick(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find("#website_link_lnk").click({force:true});
        cy.visit('https://stage.360factors.com/casemanagement/secure/CreateIssue!default.jspa?issuetype=11000')
    }

    assessmentSelectClick(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find("#assessment-link").click();
    }
    // waitforAssessmenttobevisible(){
    //     cy.get('#mytarget').then($iframe =>{
    //         cy.contains('Create Assessment', { timeout: 40000 }).should('be.visible');
    //     })
    // }
    typeSummary(summary) {
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        
        cy.get('@iframe').find("[name='summary']").type(summary);
        
    }
    assigneeSelect(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#assign-to-me-trigger').click({force:true});
    }

    assessmentTemplateClick(assessmentTemplate){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#customfield_16704-input').type(assessmentTemplate);
    }

    assessmentCategorySelect(assessmentCategory){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#s2id_select_customfield_19118').type(assessmentCategory);
    }

    createButtonClick(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#issue-create-submit').click({force:true});
        cy.wait(1000)
    }
    clickEditButton(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#edit-issue').click({force:true});
        cy.wait(1000)
    }
    editDescription(description){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#description-wiki-edit').type(description);
        cy.wait(2000)
    }
    clickUpdateButton(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#issue-edit-submit').click({force:true});
        cy.wait(2000)
    }
    assertDescriptionValue(){
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#issue-edit-submit').click({force:true});
        cy.wait(2000)
    }

}
export default QuestionBank_PO;