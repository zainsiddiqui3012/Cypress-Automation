import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class bhcgComplaint_PO {


    fillComplaintForm(summary, fundingBank, firstName, lastName, tier, clientLevel,description) {
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        const date = dayjs().format("MMM D, YYYY");
        cy.log(date);
        cy.get('@iframe').find("[name='summary']").type(summary).type(fundingBank);
        cy.get('@iframe').find("#assign-to-me-trigger").click();
        cy.get('@iframe').find("#customfield_17202").type(firstName);
        cy.get('@iframe').find("#customfield_17201").type(lastName);
        cy.wait(1000);
        cy.get('@iframe').find('#s2id_select_customfield_18631').click();
        cy.get('@iframe').find('#select2-drop > div.select2-search > input.select2-input').type(tier);
        cy.wait(10000);
        cy.get('@iframe').find('#select2-drop > ul > li').click();
        ///***Client Level */
        cy.get('@iframe').find('#s2id_select_customfield_18630').click();
        cy.get('@iframe').xpath('//*[@id="select2-drop"]/div/input').type(clientLevel).type('{enter}');
        ///***Compliance Received */
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18611-trigger').type(date).type('{enter}');
        ///***Assign to me */
        cy.get('@iframe').find("#assign-to-me-trigger").click();
        cy.wait(1000)
        ///***description */
        //cy.get('@iframe').find('textarea#description').type(description);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_0_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(description)
            })
        })
        cy.wait(30000);
        
    }
    informationTab(accountNum, fundingBank, productInvolved, productInvolvedSec, productotherdSec, complaintType, complaintTypeSec, recepientFirstName, recepientLastName, receivingBU) {
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#aui-uid-1').click();
        cy.wait(5000);
        // accountnumber add
        cy.get('@iframe').find('#customfield_18604').type(accountNum)
            .should('have.value', accountNum)
        cy.wait(2000);
        cy.get('@iframe', { timeout: 20000 })
            .find('select#customfield_23710').select(fundingBank);
        cy.wait(5000);
        //select product involved
        cy.get('@iframe').find('#s2id_select_customfield_18606').click();
        cy.get('@iframe').find('#select2-drop > div > input').type(productInvolved).type('{downarrow}{enter}')
        //product involved secondary
        cy.get('@iframe').find('#s2id_select_customfield_20600').type(productInvolvedSec)
        cy.get('@iframe').find('#select2-drop > ul > li > div').click();
        //****Product Other (Secondary)*//
        cy.get('@iframe').find('#customfield_20603').type(productotherdSec)
        //complaint type
        cy.get('@iframe').find('#s2id_select_customfield_18614').click();
        cy.get('@iframe').find('#select2-drop > div > input').type(complaintType).type('{enter}')
        //Recepient first name
        cy.get('@iframe').find('#customfield_18619').type(recepientFirstName)
        cy.get('@iframe').find('#customfield_18620').type(recepientLastName)
        //**BU */
        cy.get('@iframe').find('#s2id_select_customfield_18617').type(receivingBU);
        cy.get('@iframe').find('#select2-drop > ul > li > div').click()
        cy.wait(5000)
    }

    informationDetailsTab(respondentFirstName, respondentLastName, resolutionSummary) {
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#aui-uid-2').click();
        cy.wait(5000)
        cy.get('@iframe').find('#customfield_18621').type(respondentFirstName)
            .should('have.value', respondentFirstName)
        cy.get('@iframe').find('#customfield_18622').type(respondentLastName)
            .should('have.value', respondentLastName)
        cy.get('@iframe').find('#customfield_18626').type(resolutionSummary)
            .should('have.value', resolutionSummary)

    }
    investigationTab(investigationNotes,rootcausedescription) {

        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#aui-uid-3').click();
        cy.wait(2000);
        // cy.get('@iframe').find('textarea#customfield_22400').type(investigationNotes);
        // cy.wait(2000);
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_7_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(investigationNotes)
            })
        })
        cy.get("#mytarget").then(function($iframe1){
            const iframe2 = $iframe1.contents().find('#mce_6_ifr')
            cy.wrap(iframe2).as('iframe2ref')
            cy.get('@iframe2ref').then(function($iFrame2){
                const iframe2contents = $iFrame2.contents().find('#tinymce')
                cy.wrap(iframe2contents).find('p:nth-child(1)').type(rootcausedescription)
            })
        })


    }
    editIssue(summary, refNum, summaryBu, fundingBankEdit, PartyServiceProvider) {

        const date = dayjs().format("MMM D, YYYY");
        cy.log(date);

        cy.frameLoaded('#mytarget');
        ///**Click on Edit Button */
        cy.iframe('#mytarget').find('#edit-issue').click();
        cy.wait(25000);

        // cy.frameLoaded('#mytarget');
        // cy.wait(5000);
        // cy.iframe('#mytarget').find('#summary').clear().wait(1000).type(summary).type(fundingBankEdit);
        // cy.wait(2000);
        cy.iframe('#mytarget').find('#customfield_18605').type(refNum);
        cy.wait(2000);
        cy.iframe('#mytarget').find('#customfield_19100').type(summaryBu);
        ///**Click on Information tab */
        cy.iframe('#mytarget').find('#aui-uid-1').click();
        cy.wait(2000);
        cy.frameLoaded('#mytarget');
        cy.wait(5000);
        cy.iframe('#mytarget').find('select#customfield_23710').select(fundingBankEdit);
        cy.wait(1000);
        //**When Loan was Funded date*/
        cy.iframe('#mytarget').find('#customfield_23708-trigger').type(date).type('{enter}');
        //**Click on Information Details */
        cy.iframe('#mytarget').find('#aui-uid-2').click();
        cy.iframe('#mytarget').find('#customfield_18624').type(PartyServiceProvider);
        cy.wait(2000);

    }

    validateData(firstName, lastName, tier, clientLevel, description, accountNum, productInvolved, productInvolvedSec, productotherdSec, complaintType, recepientFirstName, recepientLastName, receivingBU, fundingBank, respondentFirstName, respondentLastName, investigationNotes) {
        cy.get('#mytarget').then($iframe => {
            const body = $iframe.contents().find('body')
            cy.wrap(body).as('iframe')
        })
        cy.get('@iframe').find('#customfield_17202-val').contains(firstName);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_17201-val').contains(lastName);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18631-val').contains(tier);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18630-val').contains(clientLevel);
        cy.wait(1000);
        cy.get('@iframe').find('#description-val').contains(description);
        cy.wait(1000);
        cy.get('@iframe').find('#tabCell2').click();
        cy.wait(5000);
        cy.get('@iframe').find('#customfield_18604-val').contains(accountNum);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18606-val').contains(productInvolved);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_20600-val').contains(productInvolvedSec);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_20603-val').contains(productotherdSec);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18614-val').contains(complaintType);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18619-val').contains(recepientFirstName);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18620-val').contains(recepientLastName);
        cy.get('@iframe').find('#customfield_18617-val').contains(receivingBU);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_23710-val').contains(fundingBank);
        cy.wait(1000);
        cy.get('@iframe').find('#tabCell3').click();
        cy.wait(5000);
        cy.get('@iframe').find('#customfield_18621-val').contains(respondentFirstName);
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_18622-val').contains(respondentLastName);
        cy.wait(5000);
        cy.get('@iframe').find('#tabCell4').click();
        cy.wait(1000);
        cy.get('@iframe').find('#customfield_22401-val').contains(investigationNotes);
        cy.wait(1000);
    }


    createTaskButton() {

        cy.wait(1000);
        cy.get('@iframe').find("[name='Create']").click();
        cy.wait(20000);


    }

    updateTaskButton() {

        cy.wait(1000);
        cy.iframe('#mytarget').find('#issue-edit-submit').click();
        cy.wait(10000);

    }



}
export default bhcgComplaint_PO;