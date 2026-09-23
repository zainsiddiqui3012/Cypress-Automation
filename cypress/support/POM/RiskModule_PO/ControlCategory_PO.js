import dayjs from 'dayjs';
import locators from "../../../fixtures/locators.json";

// File paths for writing data
const filename = 'cypress/fixtures/RiskModule/Control_Taxonomy/ControlCategoryMapping.json';
const Write_ControlCategoryNegativeImpact = 'cypress/fixtures/RiskModule/Control_Taxonomy/_Write_NegativeImpactMapping.json';

class ControlCategory_PO {
  // Click the "Add Control" button and wait for the UI to be ready
  addControlButton() {
    cy.get(locators.risk.controlCategory.addButton).click();
    cy.waitForTopMsgLoaderToDisappear(20000)
  }

  // Add a new control category with timestamped values
  addControlCategoryInfo(ControlCategoryID, controlName) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp); // Log the timestamp

    // Populate the Control ID and Name fields with provided values and timestamp
    cy.get(locators.risk.controlCategory.controlIdField).type(ControlCategoryID);
    cy.get(locators.risk.controlCategory.controlIdField).type(timeStamp);
    cy.get(locators.risk.controlCategory.controlNameField).type(controlName);
    cy.get(locators.risk.controlCategory.controlNameField).type(timeStamp);

    cy.waitForTopMsgLoaderToDisappear(20000)// Wait for UI interaction
    cy.writeFile(filename, { ControlCategoryTreeMapping: controlName + timeStamp }, 'utf-8'); // Write data to file
    cy.waitForTopMsgLoaderToDisappear(20000)// Allow file write and UI processing time
  }

  // Add a child category with updated values
  childCategory(ControlCategoryID, controlName) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    // Update Control ID and Name fields with new values
    cy.get(locators.risk.controlCategory.controlIdField).clear().type(ControlCategoryID);
    cy.get(locators.risk.controlCategory.controlIdField).type(timeStamp);
    cy.get(locators.risk.controlCategory.controlNameField).clear().type(controlName);
    cy.get(locators.risk.controlCategory.controlNameField).type(timeStamp);

    // Select the category checkbox
    cy.get(locators.risk.controlCategory.categoryCheckbox).click();
  }

  editCategory(ControlCategoryID, controlName) {
    // Create a timestamp and build the edited category name
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const editedCategoryName = `${controlName} ${timeStamp}`;
  
    // Select the control item from the hierarchy
    cy.get(locators.risk.controlCategory.SelectControlItem).click();
  
    // Wait for the UI to be ready

    cy.waitForTopMsgLoaderToDisappear(20000)

  
    // Update the Control ID and Name fields with new values
    cy.get(locators.risk.controlCategory.controlIdField)
      .clear()
      .type(`${ControlCategoryID} ${timeStamp}`);
    cy.get(locators.risk.controlCategory.controlNameField)
      .clear()
      .type(editedCategoryName);
  
    // Save the changes
    this.saveButton();
  
    // Validate the success toast message
    this.validateToastMessage("Control Category Saved Successfully");
  
    // Proceed to verify the child category using the edited category name
    this.makeChildCategoryViaEdit(editedCategoryName);
  }

  // Add a child category with updated values
  childCategory(ControlCategoryID, controlName) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");

    // Update Control ID and Name fields with new values
    cy.get(locators.risk.controlCategory.controlIdField).clear().type(ControlCategoryID);
    cy.get(locators.risk.controlCategory.controlIdField).type(timeStamp);
    cy.get(locators.risk.controlCategory.controlNameField).clear().type(controlName);
    cy.get(locators.risk.controlCategory.controlNameField).type(timeStamp);

    // Select the category checkbox
    cy.get(locators.risk.controlCategory.categoryCheckbox).eq(0).click();
  }
  
  // Method to verify the child category after editing
  makeChildCategoryViaEdit(editedCategoryName) {
    cy.log(`Verifying Child Category: ${editedCategoryName}`);
  
    // Navigate to the specific parent container
    cy.get(locators.risk.controlCategory.controlItemForm).within(() => {
      // Ensure the tree structure is visible
      cy.get(locators.risk.controlCategory.treeStructure).should("be.visible");
  
      // Click the required radio button within the tree
      cy.get(locators.risk.controlCategory.radioButton).click();
    });
  
    // Allow time for the selection to be processed
    // cy.wait(8000);
    // cy.pause();
  
    // Save any changes after the selection
    this.saveButton();
  
    // Validate the success toast message again
    this.validateToastMessage("Control Category Saved Successfully");
  
    // Expand the tree to verify the presence of the edited category
    cy.get(locators.risk.controlCategory.Treeicon).click();
    
    // Wait for the tree expansion to complete
 
    cy.waitForTopMsgLoaderToDisappear(20000)

  
    // Verify that the edited category appears in the expanded tree
    cy.contains(editedCategoryName, { timeout: 10000 }).should('be.visible');

  }
  

  // Move a control category within the hierarchy
  moveControlCategory(controlCategoryName) {
    cy.get(locators.risk.controlCategory.categoryLevel0).eq(1).click();
    cy.get(locators.risk.controlCategory.categoryLevel1).eq(0).click();
    cy.get(locators.risk.controlCategory.categoryCheckbox).click();

    // Perform the move action
    cy.get(locators.risk.controlCategory.moveButton).click();

    // Verify that the category was moved successfully
    cy.get(locators.risk.controlCategory.verifyMove)
     .should('contain.text', controlCategoryName)
      .then(() => {
        cy.log('Category moved successfully');
      });
  }

  // Add a control category with negative impact data
  addControlCategoryNegativeImpact(ControlCategoryID, controlName) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    // Populate Control ID and Name fields with values and timestamp
    cy.get(locators.risk.controlCategory.controlIdField).type(ControlCategoryID);
    cy.get(locators.risk.controlCategory.controlIdField).type(timeStamp);
    cy.get(locators.risk.controlCategory.controlNameField).type(controlName);
    cy.get(locators.risk.controlCategory.controlNameField).type(timeStamp);
    cy.waitForTopMsgLoaderToDisappear(20000) // Allow interaction time
    cy.writeFile(Write_ControlCategoryNegativeImpact, { ControlCategory_NegativeImpact: controlName + timeStamp }, 'utf-8'); // Write data to file
    cy.waitForTopMsgLoaderToDisappear(20000)
  }

  // Click the "Save" button
  saveButton() {
    cy.get(locators.risk.controlCategory.saveButton)
      .click({ multiple: true });

  }

  // Click the three-ellipsis menu icon
  threeEllipsis() {
    cy.get(locators.risk.controlCategory.threeEllipsis).click();
  }

  // Perform export functionality
  export() {
    cy.get(locators.risk.controlCategory.exportButton).click();
    cy.get(locators.risk.controlCategory.exportSubmit).click();
    cy.wait(10000); // Wait for export completion
  }

  // Perform import functionality
  import() {
    cy.get(locators.risk.controlCategory.importButton).click();
    cy.wait(5000); // Allow UI interaction time
  }

  // Upload and submit a file for import
  importOption() {
    const filepath = 'cypress/downloads/ImportTemplate_ControlTaxonomy_Customer.xlsx';
    cy.wait(5000); // Allow UI preparation
    cy.get(locators.risk.controlCategory.importFileInput).click();
    cy.get(locators.risk.controlCategory.dragDropFileInput).selectFile(filepath, { action: 'drag-drop' });
    cy.get(locators.risk.controlCategory.importSubmitButton).click();
  }

  // Download a sample file
  downloadSampleFile() {
    cy.get(locators.risk.controlCategory.downloadSampleFile).click();
    cy.wait(5000); // Allow file download time
  }

  // Validate the recommended control by matching the mapping
  validateRecommendedControl(ControlCategoryTreeMapping) {
    cy.get(locators.risk.controlCategory.validateRecommendedControl).contains(ControlCategoryTreeMapping);
    cy.wait(5000); // Ensure UI stability
    cy.get(locators.risk.controlCategory.validateRecommendedControl).type('{enter}');
  }

  // Validate the toast message displayed in the UI
  validateToastMessage(expectedMessage) {
    cy.get(locators.risk.controlCategory.toastMessage)
      .should('be.visible')
      .and('have.text', expectedMessage, { timeout: 10000 });
    // cy.wait(5000); // Allow time for the toast message to appear
  }
}

// Export the class for use in other test files
export default ControlCategory_PO;
