import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class controlDefinitionCategories_PO {

    addButton() {
        cy.get('.la-plus-circle').click();
        cy.wait(1000);
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]').dblclick();
        cy.wait(2000);

   }


    addControlInfo(controlName) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('.ag-large-textarea > textarea').type(controlName).type(timeStamp).type('{enter}');
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[3]').dblclick();
        ///Active
        cy.xpath('//*[@id="myGrid"]/div/div[6]/div/div/div[2]/div/div/div[1]').click();
        cy.wait(8000);


    }

    editControlInfo(controlName) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ///Filter first
        // cy.get('[style="width: 377px; left: 0px;"] > .ag-floating-filter-body > .ag-input-text-wrapper > .ag-floating-filter-input').type(controlName);
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[1]/div[2]/div/div[2]/div[1]/div[1]/div/input').type(controlName);
        cy.wait(6000);
        //grid click
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[1]').dblclick();
        cy.wait(4000);
        cy.get('.ag-large-textarea > textarea').clear()
        cy.wait(3000);

    }

    editControlName(NameEdit) {
        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('.ag-large-textarea > textarea').type(NameEdit).type(timeStamp).type('{enter}');
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[3]').dblclick();
        // ///Active
        cy.xpath('//*[@id="myGrid"]/div/div[6]/div/div/div[2]/div/div/div[1]').click();


    }

    inactiveAndActive(NameEdit) {

        ///Filter first
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-pivot-off > div.ag-header-viewport > div > div:nth-child(2) > div:nth-child(1) > div.ag-floating-filter-body > div > input').type(NameEdit);
        cy.wait(6000);
        cy.xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[3]').dblclick();
        ///Inactive 
        cy.xpath('//*[@id="myGrid"]/div/div[6]/div/div/div[2]/div/div/div[2]/div').click();
        cy.wait(2000);

    }



}
export default controlDefinitionCategories_PO;