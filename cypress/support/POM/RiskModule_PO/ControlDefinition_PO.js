import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

const filename = 'cypress/fixtures/RiskModule/Control_Taxonomy/ControlCategoryMapping.json'

Cypress.Commands.add('readControlCategoryTreeMapping', () => {
  return cy.readFile(filename).then((data) => {
    // Return the RecommendedControlsDefintion from the JSON file
    return data.ControlCategoryTreeMapping;
  });
});

class ControlDefinition_PO {

  addDefinitionButton() {
    // cy.get('[data-target="#addRiskControlItemName"]').click();
    cy.get('[data-target="#addRiskControlItemName"] > :nth-child(1) > span').click();
    cy.wait(10000);

  }


  addDefinitionInfo(controlDefinitionID, definitionName, description, controlFrequency, controlTypes, controlExecution, ControlCategoryTreeMapping) {

    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);


    cy.get('#controlDefinationId').type(controlDefinitionID);
    cy.get('#controlDefinationId').type(timeStamp);

    cy.get('#manageRiskRegisterControlNameForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name').type(definitionName);
    cy.get('#manageRiskRegisterControlNameForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name').type(timeStamp);

    cy.get('#cke_1_contents > .cke_wysiwyg_frame').type(description);
    cy.get('#cke_1_contents > .cke_wysiwyg_frame').type(timeStamp);

    cy.get('#select2-chosen-4').click();
    cy.get('#s2id_autogen4_search').type(controlFrequency).type('{enter}');


    cy.get('#s2id_controlTypeID > .select2-choice > .select2-arrow > b').click();
    cy.get('#s2id_autogen7_search').type(controlTypes).type('{enter}');

    cy.get('#select2-chosen-8').click();
    cy.get('#s2id_autogen8_search').type(controlExecution).type('{enter}');
    cy.wait(2000);
    ///**Control Category Ratio Button click */
    // cy.get('#riskRegisterControlNameDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeText').click();

    cy.readControlCategoryTreeMapping().then((ControlCategoryTreeMapping) => {
      ////***Search Control Category from Tree then click on  Ratio */
      cy.get('#riskRegisterControlNameDiv').contains(ControlCategoryTreeMapping).click();
      cy.wait(5000);
    });

    cy.wait(2000);

  }

  addDefinition_NegativeImpact(controlDefinitionID, definitionName, description, controlFrequency, controlTypes, controlExecution, ControlCategory_NegativeImpact) {

    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);


    cy.get('#controlDefinationId').type(controlDefinitionID);
    cy.get('#controlDefinationId').type(timeStamp);

    cy.get('#manageRiskRegisterControlNameForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name').type(definitionName);
    cy.get('#manageRiskRegisterControlNameForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name').type(timeStamp);

    cy.get('.cke_wysiwyg_frame').type(description);
    cy.get('.cke_wysiwyg_frame').type(timeStamp);

    cy.get('#select2-chosen-4').click();
    cy.get('#s2id_autogen4_search').type(controlFrequency).type('{enter}');


    cy.get('#s2id_controlTypeID > .select2-choice > .select2-arrow > b').click();
    cy.get('#s2id_autogen7_search').type(controlTypes).type('{enter}');

    cy.get('#select2-chosen-8').click();
    cy.get('#s2id_autogen8_search').type(controlExecution).type('{enter}');
    cy.wait(2000);
    ///**Control Category Ratio Button click */
    // cy.get('#riskRegisterControlNameDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeText').click();

    ////***Search Control Category from Tree then click on  Ratio */
    cy.get('#riskRegisterControlNameDiv').contains(ControlCategory_NegativeImpact).click();
    cy.wait(2000);

  }

  ///**Click Save Button */
  savebutton() {
    cy.get('#manageRiskRegisterControlNameForm > .m-portlet__foot > .m-form__actions > .btn-primary').click();
    cy.wait(15000);


  }

  ///**Expand Control Category */
  expandIconClick(ControlCategoryTreeMapping) {
    cy.xpath('//*[@id="riskControlItemsDiv"]/ul/li[1]/div/div/span[1]/span').click();
    // cy.get('#riskControlItemsDiv > [style=""] > .aciTreeInode.aciTreeLast > [aria-level="1"] > .aciTreeEntry > .aciTreeButton > .aciTreePush').click();  
    // cy.wait(8000);
   // cy.get('.aciTreeOpen > .aciTreeUl > .aciTreeLi > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > .aciTreeText').click();
   cy.contains(ControlCategoryTreeMapping).click();
    cy.wait(8000);

  }


  editDefintion(controlDefinitionID, definitionName, description, controlFrequency, controlTypes, controlExecution, optimalRoleTitle, comment) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);


    cy.get('#controlId').clear().type(controlDefinitionID);
    cy.get('#controlId').type(timeStamp);

    cy.get('#field-name').clear().type(definitionName);
    cy.get('#field-name').type(timeStamp);

    cy.get('.cke_wysiwyg_frame').type(description);
    cy.get('.cke_wysiwyg_frame').type(timeStamp);

    cy.get('#select2-chosen-2').click();
    cy.get('#s2id_autogen2_search').type(controlFrequency).type('{enter}');


    cy.get('#select2-chosen-3').click();
    cy.get('#s2id_autogen3_search').type(controlTypes).type('{enter}');

    cy.get('#select2-chosen-4').click();
    cy.get('#s2id_autogen4_search').type(controlExecution).type('{enter}');

    cy.get('[name="optimalRole"]').clear().type(optimalRoleTitle).type(timeStamp);
    cy.get('[name="comments"]').clear().type(comment).type(timeStamp);
    // savebutton
    cy.get('.m-form__actions > .btn-primary').click();
  }


  // savebutton() {
  //     cy.get('#manageRiskRegisterNameForm > .m-portlet__foot > .m-form__actions > #saveBtn').click();

  // }

  // // deleteRiskCategory(){
  // //     cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeEntry > .btn').click();
  // //     cy.get('#deleteRiskCategoryConfirm > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();

  // // }

}
export default ControlDefinition_PO;