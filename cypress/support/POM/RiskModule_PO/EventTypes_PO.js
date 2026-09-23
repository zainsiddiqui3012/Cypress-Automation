import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class EventTypes_PO {

    addButton() {
        cy.get(':nth-child(5) > .btn').click();


    }


    addEventTypeInfo(eventName, description) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);


        cy.get('.col-md-6 > #eventName').type(eventName);
        cy.get('.col-md-6 > #eventName').type(timeStamp);

        cy.get('.col-md-6 > #description').type(description);
        cy.get('.col-md-6 > #description').type(timeStamp);


    }

    savebutton() {
        //***Click on Save button */
        cy.get('#btn_save').click();
    }

    filterEventTypes(eventName) {

        //**Click On Filter Button */
        cy.get('.list-inline > :nth-child(3) > .btn').click();

        cy.get('.col-md-9 > #eventName').type(eventName).type('{backspace}');
        cy.wait(5000);
        cy.get('.col-md-9 > #eventName').type('{downArrow}', '{enter}');
        cy.wait(3000);
        cy.get('.form-body > :nth-child(2) > .col-md-3').click();


        ///**Click on Apply Button */
        cy.get('#filterForm > .modal-footer > .btn-primary').click();
        cy.get('td > a').click();


    }

    editEventTypes(eventNameEdit, description) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#eventName').clear().type(eventNameEdit);
        cy.get('#eventName').type(timeStamp);
        cy.get('.col-md-6 > #description').clear().type(description);
        cy.get('.col-md-6 > #description').type(timeStamp);
    }


}
export default EventTypes_PO;