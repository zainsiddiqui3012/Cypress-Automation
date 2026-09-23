import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class ControlTypes_PO {

    addButton() {
        cy.get('.btn > :nth-child(1) > .la').click();


    }


    addControlTypeInfo(controlName, description) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);


        cy.get('.col-md-6 > #controlName').type(controlName);
        cy.get('.col-md-6 > #controlName').type(timeStamp);

        cy.get('.col-md-6 > #description').type(description);
        cy.get('.col-md-6 > #description').type(timeStamp);


    }

    savebutton() {
        //***Click on Save button */
        cy.get('#btn_save').click();
    }

    filterControlTypes(controlName) {

        //**Click On Filter Button */
        cy.get('.list-inline > :nth-child(3) > .btn').click();

        cy.get('.col-md-9 > #controlName').type(controlName).type('{backspace}');
        cy.wait(2000);
        cy.get('.col-md-9 > #controlName').type('{downArrow}');
        cy.get('.col-md-9 > #controlName').type('{enter}');
        cy.wait(2000);
   
        ///**Click on Apply Button */
        cy.get('#filterForm > .modal-footer > .btn-primary').click();
        cy.get(':nth-child(1) > td > a').click();

    }

    editControlTypes(controlName, description) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#controlName').clear().type(controlName);
        cy.get('#controlName').type(timeStamp);
        cy.get('.col-md-6 > #description').clear().type(description);
        cy.get('.col-md-6 > #description').type(timeStamp);
    }


}
export default ControlTypes_PO;