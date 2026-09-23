import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';


class InstructionTemplate_PO {

    writeDescription(Description) {

        cy.switchToIframe('.cke_wysiwyg_frame').clear().type(Description);


    }



    savebutton() {
        //***Click on Save button */
        cy.get('#saveBtn').click();
    }



}
export default InstructionTemplate_PO;