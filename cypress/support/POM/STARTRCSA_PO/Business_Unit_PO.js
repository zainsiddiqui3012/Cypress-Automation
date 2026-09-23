import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename1 = 'cypress/fixtures/RCSA Audit Log/_write_business_unit.json'
//const filename1 = 'cypress/fixtures/RCSA Audit Log/Business Unit.json'

class Business_Unit_PO{


  OrganinzationHierarchyaddBtn()
  {
    // Click on the "Add" button
    cy.get('.quickSidebarOpenBtn').click();
  }

  CreateBU(BUName)
  {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        //cy.log(timeStamp);
    cy.get('#facilityName').should('be.visible').type(BUName).type(timeStamp);
    cy.wait(5000);
    //*****Data Write into file  ******/
    const businessUnitNameValue = BUName + timeStamp;
    cy.writeFile(filename1, '', 'utf-8', { flag: 'w' }); //clear the existing content in the file
    cy.writeFile(filename1, { Business_Unit_Name: businessUnitNameValue }, 'utf-8');
    cy.wait(30000);

    return businessUnitNameValue;
  }

  processownerdropdown()
  {
    cy.get('#s2id_managerId').click();
    cy.get("#s2id_autogen1_search").type("Automation user").type('{enter}');

  }
  
  copyBUnameANDpasteinvariable()
  {
    
    cy.get('#facilityName').type('{selectall}')

  // Copy the selected text from the source field
  cy.get('#facilityName').invoke('val').then((text) => {
      // Set the value of the target field using the copied text
      cy.get('#facilityName')
        .type(text, { parseSpecialCharSequences: false })
      })
  }

  submitbuform()
  {
    cy.get('#saveBtn').click();
    cy.contains('Organizational Group saved successfully.', { timeout: 50000 }).should('be.visible');
  }

  Buhierarchy_open()
  {
    cy.get("#facilityDiv1 ul li div div spanspan:nth-of-type(1) span").click();
  }
  BU_Modal_close()
  {
     cy.wait(10000);
     cy.get("span.m-quick-sidebar__close.quickSidebarCloseBtn i:nth-child(1)").click(); 
  }


  BU_Reopen_AND_SelectROCSingle(Business_Unit_Name)
  {
      const buName = Business_Unit_Name;

      cy.contains('.aciTreeText .aciLabel', buName)
      .should('exist'); // validate the Business Unit Name

      // Find the "Set as Business Unit" link for the selected Business Unit
  	   cy.contains('.aciTreeText .aciLabel', buName)
      .closest('.aciTreeEntry')
      .find('.aciTreeColumn0 a.btn-outline-primary')
      .click();
      // Apply Assertion
      cy.contains('Converted successfully.').should('be.visible');


      cy.contains('Expand All').click();
      cy.wait(2000);
      cy.xpath("//button[@onclick='javascript: expandNode();']").click();
      cy.wait(5000);
    
    //reopen BU page   
    cy.get('.aciLabel').contains(buName).click();
    cy.wait(2000);

    // Select the radio button with the value "Single"
    cy.wait(5000);
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="Single"]').scrollIntoView().click({ force: true });
    cy.wait(5000);
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="Single"]').scrollIntoView();
    cy.wait(5000);
     // Assert that the radio button is checked
     cy.get('input[name="rocType"][value="Single"]').should('be.checked');
    //Select user in single assignee

    cy.wait(5000);

    const expectedValue = 'Automation User (automation.user)';
    const dropdownSelector = '#s2id_rocId .select2-choice';

    // Assert that the expected value is selected in the dropdown
    cy.get(dropdownSelector)
    .should('contain', expectedValue);

    //Risk Executive Sucessfull
    cy.get('#s2id_riskExecId .select2-chosen').click();
    cy.wait(2000);
    cy.get('#s2id_autogen9_search').type('automation.user').type('{enter}');

    //Process Owner
    cy.wait(2000);
    cy.get('#s2id_managerId').scrollIntoView();
    cy.get('#s2id_managerId').click();
    cy.wait(2000);
    cy.get('#s2id_autogen1_search').type('automation.user').type('{enter}');
  }

  BU_Update()
  {
    cy.get('#saveBtn').click();
    cy.wait(2000);
    cy.contains('Organizational Group updated successfully.', { timeout: 50000 }).should('be.visible');
  }

  BU_Reopen_AND_SelectROC_Group(Business_Unit_Name)
  {


    const buName = Business_Unit_Name;

    cy.contains('.aciTreeText .aciLabel', buName)
    .should('exist'); // validate the Business Unit Name

    // Find the "Set as Business Unit" link for the selected Business Unit
     cy.contains('.aciTreeText .aciLabel', buName)
    .closest('.aciTreeEntry')
    .find('.aciTreeColumn0 a.btn-outline-primary')
    .click();
    // Apply Assertion
    cy.contains('Converted successfully.').should('be.visible');


    //Expand all
    cy.contains('Expand All').click();
    cy.wait(2000);
    cy.xpath("//button[@onclick='javascript: expandNode();']").click();
    cy.wait(10000);
    
     //reopen BU page   
     cy.get('.aciLabel').contains(buName).click();
     cy.wait(2000);

    // Find the label with text 'Group' and click on it
    cy.wait(5000);
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="Group"]').scrollIntoView().click({ force: true });
    cy.wait(5000);
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="Group"]').scrollIntoView();
    cy.wait(5000);
  
    // Find the ROC dropdown and click on it
    cy.get('#s2id_rocGroupId').click();
    cy.get('#s2id_autogen8_search').type('user group roc testing').type('{enter}');

    //Risk Executive Sucessfull
    cy.get('#select2-chosen-9').click();
    cy.wait(2000);
    cy.get('#s2id_autogen9_search').type('automation.user').type('{enter}');

    //Process Owner
    cy.wait(2000)
    cy.get('#s2id_managerId').scrollIntoView();
    cy.get('#s2id_managerId').click();
    cy.wait(2000);
    // cy.get('#s2id_autogen1_search').type('automation.user').type('{enter}');
  }

  BU_Reopen_AND_SelectROC_NA(Business_Unit_Name)
  {

    const buName = Business_Unit_Name;

    cy.contains('.aciTreeText .aciLabel', buName)
    .should('exist'); // validate the Business Unit Name

    // Find the "Set as Business Unit" link for the selected Business Unit
     cy.contains('.aciTreeText .aciLabel', buName)
    .closest('.aciTreeEntry')
    .find('.aciTreeColumn0 a.btn-outline-primary')
    .click();
    // Apply Assertion
    cy.contains('Converted successfully.').should('be.visible');
    cy.contains('Expand All').click();
    cy.wait(2000);
    cy.xpath("//button[@onclick='javascript: expandNode();']").click();
    cy.wait(10000);
    
    //reopen BU page
    cy.wait(10000);
    cy.get('.aciLabel').eq(1).click();
    cy.wait(2000);


    cy.wait(5000);
    
    // Select the radio button with the value "N/A"
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="N/A"]').scrollIntoView().click({ force: true });
    cy.wait(5000);
    cy.get('.m-form__group .m-radio-inline input[name="rocType"][value="N/A"]').scrollIntoView();
    cy.wait(5000);

     // Assert that the radio button is checked
     cy.get('input[name="rocType"][value="N/A"]').should('be.checked');


    //Risk Executive Sucessfull
    cy.get('#s2id_riskExecId').click();
    cy.wait(2000);
    cy.get('#s2id_autogen9_search').type('automation.user').type('{enter}');


    //Process Owner
    cy.wait(2000)
    cy.get('#s2id_managerId').scrollIntoView();
    cy.get('#s2id_managerId').click();
    cy.wait(2000);
    cy.get('#s2id_autogen1_search').type('automation.user').type('{enter}');
    
  }



}
export default Business_Unit_PO;