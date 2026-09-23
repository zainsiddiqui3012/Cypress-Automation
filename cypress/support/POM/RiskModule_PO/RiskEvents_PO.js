import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class RiskEvents_PO {

    addButton() {
        cy.get(':nth-child(4) > .btn').click();

        
    }


    addRiskEventInfo(riskEventsName) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);


        cy.get('#riskEventName_').type(riskEventsName);
        cy.get('#riskEventName_').type(timeStamp);

        cy.get('#eventDate_').click();
        cy.wait(3000);
        cy.get('#eventDate_').type('{rightArrow}');
        cy.get('#eventDate_').type('{leftArrow}');
        cy.get('#eventDate_').type('{enter}');
        cy.wait(3000);

        cy.get('#closedDate').click();
        cy.wait(3000);
        cy.get('#closedDate').type('{rightArrow}');
        cy.get('#closedDate').type('{leftArrow}');
        cy.get('#closedDate').type('{enter}');

    }

    savebutton() {
        //***Click on Save button */
        cy.get('#btn_save').click();
    }

    filterRiskEvent(riskEventsName) {

        //**Click On Filter Button */
        cy.get('.list-inline > :nth-child(3) > .btn').click();

        cy.get('#riskEventName').type(riskEventsName).type('{backspace}');
        cy.wait(3000);
        cy.get('#riskEventName').type('{downArrow}').type('{enter}');
        cy.wait(3000);

        // ///**Click on Apply Button */
        cy.get('#filterForm > .modal-content > .modal-footer > .btn-primary').click();

        //**Click Edit link */
        cy.get('tr > :nth-child(1) > a').click();

    }

    editRiskEvent(riskEventsName, EventType) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#riskEventName_').clear().type(riskEventsName);
        cy.get('#riskEventName_').type(timeStamp);

        cy.get('#select2-chosen-1').click();
        cy.get('#s2id_autogen1_search').type(EventType).type('{enter}');
    }



}
export default RiskEvents_PO;