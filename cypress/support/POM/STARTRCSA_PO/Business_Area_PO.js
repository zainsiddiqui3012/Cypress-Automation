import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';
const businessAreaData = "cypress/fixtures/RCSAAuditLog/BusinessArea.json"

class Business_Area_PO {


    createBusinessAreas(busineesAreaSingleDef, businessAreaDef) {
        //Business Area First Tab
        this.BusinessAreaCat1Addbtn();
        this.BusinessAreaCat1NameField();
        //Business Area Second Tab
        this.BusinessAreaCat2redirection();
        this.BusinessAreaCat2Addbtn();
        this.BusinessAreaCat2NameField();
        //Business Area Third Tab 
        this.BusinessAreaCat3redirection();
        this.BusinessAreaCat3Addbtn();
        this.BusinessAreaCat3NameField(busineesAreaSingleDef);
        this.ValidateBusinessAreaCatToasterMessage();
        this.BusinessAreaCat1dropdown();
        this.ValidateBusinessAreaCatToasterMessage();
        this.BusinessAreaCat2dropdown();
        this.ValidateBusinessAreaCatToasterMessage();
        //Business Area Fourth Tab
        this.BusinessAreasredirection();
        this.BusinessAreasAddbtn();
        this.BusinessAreaCat3NameField(businessAreaDef);
        this.ValidateBusinessAreaCatToasterMessage();
        this.BusinessUnitdropDownFirstValue();
        this.BusinessAreaCat1dropdownlattab();
        this.ValidateBusinessAreaCatToasterMessage();
        this.BusinessAreaCat2dropdownlattab();
        this.ValidateBusinessAreaCatToasterMessage();
    }

    //click on Business Area Category 1 Add Button
    BusinessAreaCat1Addbtn() {
        cy.get('a.btn.btn-success.m-btn.m-btn--custom.m-btn--icon.text-white span span').click();
    }

    //Enter Name and Timestamp in Business Area Category 1 Name Field
    BusinessAreaCat1NameField() {
        //Enter Name and Timestamp in Business Area Category 1 Name Field
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.get('[aria-label="Input Editor"]').click();
        cy.get('[aria-label="Input Editor"]').type("Auto created cat 1 ").type(timeStamp).type('{enter}');
    }

    //Redirect on Business Area Category 2 
    BusinessAreaCat2redirection() {
        cy.get('a').contains('Business Area Categories 2').click();
    }

    //click on Category 2 Add button
    BusinessAreaCat2Addbtn() {
        cy.get('a.btn.btn-success.m-btn.m-btn--custom.m-btn--icon.text-white span span').click();
    }

    //Enter Name and Timestamp in Business Area Category 2 Name Field
    BusinessAreaCat2NameField() {
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.get('[aria-label="Input Editor"]').click();
        cy.get('[aria-label="Input Editor"]').type("Auto created cat 2 ").type(timeStamp).type('{enter}');
    }
    //Redirect on Business Area 3rd Tab
    BusinessAreaCat3redirection() {
        cy.get('a').contains('Business Area Definitions').click().wait(5000);
    }
    //click on Business Area Tab 3 Add button
    BusinessAreaCat3Addbtn() {
        cy.get('a.btn.btn-success.m-btn.m-btn--custom.m-btn--icon.text-white span span').click();
    }

    // Enter Name and Timestamp in Business Area Tab 3 Name Field
    BusinessAreaCat3NameField(BusinessAreaDef) {
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        const businessAreaFullName = `${BusinessAreaDef}${timeStamp}`;

        // Update the BusinessAreaFullName value in the JSON file
        cy.readFile(businessAreaData).then((data) => {
            data[0].BusinessAreaFullName = businessAreaFullName;
            cy.writeFile(businessAreaData, data);
        });

        cy.get('[aria-label="Input Editor"]').click();
        cy.get('[aria-label="Input Editor"]').type(businessAreaFullName).type('{enter}');
    }

    //validate Business Area Cat Tooster Message
    ValidateBusinessAreaCatToasterMessage() {
        cy.get('.toast-message').should('be.visible').contains('Record Saved Successfully').should('be.visible');
    }

    //click on Business Area Category 1 dropdown and also select value 
    BusinessAreaCat1dropdown() {
        cy.get('div[role="gridcell"][col-id*="businessAreaDef1.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport').last().click();
    }
    //click on Business Area Category 2 dropdown and also select value
    BusinessAreaCat2dropdown() {
        cy.waitForToastMessageToDisappear(10000);
        cy.get('#myGrid [role="grid"] div:nth-child(3) div:nth-child(2) [role="presentation"] div > div:nth-child(1) [col-id*="businessAreaDef2.id"]').dblclick();
        cy.get('.ag-virtual-list-viewport').first().click();
    }

    //Click on Business Area Tab
    BusinessAreasredirection() {
        cy.get(':nth-child(4) > .nav-link').click();
    }
    //click on Business Area Add button
    BusinessAreasAddbtn() {
        cy.get('a.btn.btn-success.m-btn.m-btn--custom.m-btn--icon.text-white span span').click();
    }

    //click on Business Unit Dropdown and select value
    BusinessUnitdropdown(Business_Unit_Name) {
        cy.get('div[role="gridcell"][col-id*="organizationUnitBu.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport')
            .contains(Business_Unit_Name).scrollIntoView()
            .click();
    }

    //click on Business Unit Dropdown and select first value
    BusinessUnitdropDownFirstValue() {
        cy.get('div[role="gridcell"][col-id*="organizationUnitBu.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport')
            .first()
            .click();
    }


    //Click on Business Unit Dropdown and select value for Group ROC Case
    BusinessUnitdropdownGroup(Business_Unit_Name) {
        cy.get('div[role="gridcell"][col-id*="organizationUnitBu.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport').scrollTo('bottom');
        cy.get('.ag-virtual-list-viewport')
            .last().click();
    }

    //Click on Business Area Defination Dropdown
    BusinessAreaDefdropdown() {
        cy.get('div[role="gridcell"].[col-id*="businessAreaDef.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport')
            .scrollTo('bottom').last().click();
    }
    //Click on Business Area Category 1 dropdown
    BusinessAreaCat1dropdownlattab() {
        cy.waitForToastMessageToDisappear(10000)
        cy.get('div[role="gridcell"][col-id*="businessAreaCat1.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport', { timeout: 2000 }).first().click();

    }

    //Click on BusinessArea Category 2 dropdown
    BusinessAreaCat2dropdownlattab() {
        cy.waitForToastMessageToDisappear(10000);
        cy.get('div[role="gridcell"][col-id*="businessAreaCat2.id"]:eq(0)').dblclick();
        cy.get('.ag-virtual-list-viewport').first().click();
    }

}
export default Business_Area_PO;