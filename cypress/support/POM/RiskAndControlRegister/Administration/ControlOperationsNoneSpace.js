import locators from "../../../../fixtures/locators.json";
const dataFilePath = "cypress/fixtures/RiskAndControlRegister/Administration/ControlOperationsNoneSpace.json";

class ControlOperationsNoneSpace {
  
  time = 1000;

  /**
   * This function will validate the headers of the grid on Control Operations page
   * @param {Object} headersObj - An object containing header texts for name, content library, and status
   */
  validateHeaders(headersObj) {
    cy.get(locators.risk.administration.controlOperations.headers)
      .contains(headersObj.name)
      .should("be.visible");

    cy.get(locators.risk.administration.controlOperations.headers)
      .contains(headersObj.contentLibrary)
      .should("be.visible");

    cy.get(locators.risk.administration.controlOperations.headers)
      .contains(headersObj.status)
      .should("be.visible");
  }

  // It clicks on Add button to open the form to add new control operation
  clickAddButton() {
    cy.get(locators.risk.administration.controlOperations.addButton)
    .click();
  }

  /**
   * Types the name for the control operation.
   * @param {Object} parametersObj - An object containing parameters 'colName' and 'colValue'.
   * @param {string} controlName - The name of the control operation to be typed.
   */
  typeName(parametersObj, controlName) {
    cy.get(locators.risk.administration.controlOperations.typeControlColumn
    .replace(parametersObj.column, parametersObj.name))
    .dblclick();
    cy.get(locators.risk.administration.controlOperations.textArea)
    .type(controlName);
  }

  /**
   * Filters and selects the last content library for the control operation.
   * @param {Object} parametersObj - An object containing parameters 'column' and 'contentLibrary'.
   * @param {string} contentLibrary - The content library to select
   * @param {string} scrollDirection - The direction to scroll (default is "bottom")
   */
  filterAndSelectLibrary(parametersObj, contentLibrary, scrollDirection) {
    cy.get(locators.risk.administration.controlOperations.typeControlColumn
    .replace(parametersObj.column, parametersObj.contentLibrary))
    .dblclick();

    cy.get(locators.risk.administration.controlOperations.contentLibraryScroll)
    .scrollTo(scrollDirection);
    cy.wait(this.time);

    cy.get(locators.risk.administration.controlOperations.contentLibraryItem)
    .contains(contentLibrary)
    .click();
  }

  /**
   * Selects the status for the control operation.
   * @param {Object} parametersObj - An object containing parameters 'column' and 'status'.
   * @param {string} statusValue - the status to select (e.g., "Active", "Inactive")
   */
  selectStatus(parametersObj, statusValue) {
    cy.get(locators.risk.administration.controlOperations.typeControlColumn
    .replace(parametersObj.column, parametersObj.status))
    .dblclick();
    cy.get(locators.risk.administration.controlOperations.statusItems)
    .contains(statusValue)
    .click();
  }

  /**
   * Verifies the success message after adding a control operation.
   * @param {string} successMessage - the expected success message
   */
  verifySuccessMessage(successMessage) {
    cy.get(locators.risk.administration.controlOperations.toast)
    .should("be.visible")
    .and("contain.text", successMessage);
  }

  /**
   * Verifies the error message after adding a control operation.
   * @param {string} errorMessage - the expected error message
   */
  verifyErrorMessage(errorMessage){
    cy.get(locators.risk.administration.controlOperations.toast)
    .should("be.visible")
    .and("contain.text", errorMessage);
  }

  /**
   * Verifies that a control operation has been added successfully even after refresh of page.
   * @param {object} addDataObj - The object that contains name, content library, and status of the control operation to verify.
   */
  verifyControlOperationAdded(addDataObj){
    cy.reload();
    let found = false;
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .each(($row) => {
      const rowText = $row.text();
      if (rowText.includes(addDataObj.name)) {
        found = true;
        cy.wrap($row).should("contain.text", addDataObj.contentLibrary);
        cy.wrap($row).should("contain.text", addDataObj.status);
      }
    })
    .then(() => {
      expect(found).to.be.true;
    });
  }

  /**
   * It counts the total records present in the grid and set in the data file.
   */
  verifyRecords() {
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .then(($totalRows) => {
      this.updateNoOfRecords(dataFilePath, $totalRows.length);
    });
  }
 
  /**
   * Reload the page to ensure the page is refreshed and then verify the records are same
   * as record is added shown in the grid temporary even with empty name, then upon refresh, its removed
   * @param {number} noOfRecords - it validates against the expected number of records
   */
  verifyControlNotAdded(noOfRecords) {
    cy.reload();
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .then(($totalRows) => {
        expect($totalRows.length).to.equal(noOfRecords);
      }
    );
  }

  /**
   * It updates the control operation by searching it first then update by given values.
   * @param {Object} parametersObj - An object containing parameters 'controlNameKey', 'column', 'name', and 'status'.
   * @param {string} controlName - The name/value of the control that will replace placeholder 'controlNameKey'.
   * @param {object} updateData - The object containing updated values for 'name' and 'status'.
   * @param {object} keyCommands - The object containing key commands like 'backspace' and 'enter'.
   */
  updateControlDefinitionCategory({parametersObj, controlName, updateData, keyCommands}) {
    cy.get(locators.risk.administration.controlOperations.singleControlRecord
    .replace(parametersObj.controlNameKey, controlName))
    .parent()
    .then(($parent) => {
      cy.wrap($parent).find(locators.risk.administration.controlOperations.searchControlColumn
      .replace(parametersObj.column, parametersObj.name))
      .dblclick();
      cy.get(locators.risk.administration.controlOperations.textArea)
      .type(keyCommands.backspace)
      .type(updateData.name + keyCommands.enter);
      cy.wrap($parent).find(locators.risk.administration.controlOperations.searchControlColumn
      .replace(parametersObj.column, parametersObj.status))
      .dblclick();
      cy.get(locators.risk.administration.controlOperations.statusItems)
      .contains(updateData.status)
      .click();
    });
  }

  /**
   * This function will update the control name by adding special characters to it
   * It will first search the control by its name, then it will double click to open the name field
   * It will then add special characters to the existing name and hit enter to save
   * @param {object} parametersObj - An object containing parameters 'column' and 'name'.
   * @param {string} controlName - The name of the control operation to be updated.
   * @param {string} updateData - The special characters to be added to the control name.
   * @param {object} keyCommands - An object containing key commands like 'backspace' and 'enter'.
   */
  updateControlNameWithSpecialCharacter({parametersObj, controlName, updateData, keyCommands}) {
    cy.get(locators.risk.administration.controlOperations.inputFields)
    .first().type(controlName);
    cy.wait(this.time);
    cy.get(locators.risk.administration.controlOperations.searchControlColumn
    .replace(parametersObj.column, parametersObj.name)
    ).dblclick();
    cy.get(locators.risk.administration.controlOperations.textArea)
    .type(keyCommands.backspace)
    .type(updateData + keyCommands.enter);
  }

  /**
   * It searches for the updated control name and verifies the status
   * This is to ensure that the record is updated and not the previous one
   * It takes updated data from file and checks against them in all the records
   * To first find the updated name and then check for its status.
   * @param {string} updatedControlName - The updated name of the control operation to verify.
   * @param {string} updatedStatus - The updated status of the control operation to verify.
   */
  verifyUpdatedControlOperation(updatedControlName, updatedStatus) {
    let updatedFound = false;
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .each(($row) => {
      const rowText = $row.text();
      if (rowText.includes(updatedControlName)) {
        updatedFound = true;
        cy.wrap($row).should("contain.text", updatedStatus);
      }
    })
    .then(() => {
      expect(updatedFound).to.be.true;
    });
  }

  /**
   * This function will verify that the updated control name with special characters is present in the list
   * It will search for the updated control name in all the records and if found, it will set the flag to true
   * At the end, it will assert that the flag is true to ensure that the updated control name is present in the list
   * Exit early if already found else it would iterate further to validate 
   * @param {string} updatedControlName - The updated name of the control operation to verify.
   */
  verifyUpdatedControlNameWithSpecialCharacter(updatedControlName) {
    cy.get(locators.risk.administration.controlOperations.inputFields)
    .first().clear();    
    let updatedFound = false;
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .each(($row) => {
      const rowText = $row.text();
      if (rowText.includes(updatedControlName)) {
        updatedFound = true;
      }
    })
    .then(() => {
      expect(updatedFound).to.be.true;
    });
  }
 
  /**
   * Edit a control operation without making any changes in any field
   * If emptyName is true, then it will call the function to set the name as empty and enter to save.
   * If emptyName is false, then it will call the function to just open all the 3 fields by double clicking and close without making any changes
   * It will then call the function to verify that the same record is present as before by comparing the text of same row before and after
   * 'textBefore' & 'textAfter' in the function are the text content of the entire record 
   * combinely of all 3 columns(name, library, status).
   * Exit early if already found else it would iterate further to validate
   * @param {string} controlNameToSearch - The name of the control to edit.
   * @param {object} parametersObj - An object containing parameters 'column' &'name' used in the function.
   * @param {Object} [options] - Optional configuration object.
   * @param {boolean} [options.emptyName = false] - Whether to set the empty name during edit.
   */
  editWithNoChanges(controlNameToSearch, parametersObj, keyCommands, {emptyName = false} = {}) {    
    let textBefore;
    let controlFound = false;
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .each(($row) => {
      if(controlFound) return;
      textBefore = $row.text();
      if(textBefore.includes(controlNameToSearch)){
        controlFound = true;
        if(emptyName){
          this.clearNameAndSave($row, parametersObj, keyCommands);
        }else {
          this.saveWithoutChange($row, parametersObj);
        }
      }
    })
    .then(() => {
    this.validateNoDataChange(controlNameToSearch, textBefore);
    });
  }

  /**
   * Clears the name field and saves the changes.
   * @param {Object} $row - The jQuery row element
   * @param {Object} parametersObj - An object containing parameters 'column' and 'name'.
   * @param {Object} keyCommands - An object containing key commands like 'backspace' and 'enter'.
   */
  clearNameAndSave($row, parametersObj, keyCommands){
    cy.wrap($row).find(locators.risk.administration.controlOperations.searchControlColumn
    .replace(parametersObj.column, parametersObj.name))
    .dblclick();
    cy.get(locators.risk.administration.controlOperations.textArea)
    .type(keyCommands.backspace + keyCommands.enter);
  }

  /**
   * Saves the control operation without making any changes.
   * @param {Object} $row - The jQuery row element
   * @param {Object} parametersObj - An object containing parameters 'column', 'name', 'contentLibrary', and 'status'.
   */
  saveWithoutChange($row, parametersObj){
    cy.wrap($row).find(locators.risk.administration.controlOperations.searchControlColumn
    .replace(parametersObj.column, parametersObj.name)) 
    .dblclick();
    cy.wrap($row).find(locators.risk.administration.controlOperations.searchControlColumn
    .replace(parametersObj.column, parametersObj.contentLibrary))
    .dblclick();
    cy.wrap($row).find(locators.risk.administration.controlOperations.searchControlColumn
    .replace(parametersObj.column, parametersObj.status))
    .dblclick();
  }

  /**
   * Validates that no data change has occurred for the specified control by comparing the text before and after.
   * @param {string} controlNameToSearch - The name of the control to search for.
   * @param {string} textBefore - The text content of the control before any changes.
   */
  validateNoDataChange(controlNameToSearch, textBefore){
    cy.reload();
    let controlFound = false;
    cy.get(locators.risk.administration.controlOperations.controlRecords)
    .each(($row) => {
      if (controlFound) return;
      let textAfter = $row.text();
      if (textAfter.includes(controlNameToSearch)) {
        controlFound = true;
        expect(textAfter).to.equal(textBefore);
      }
    });
  }

  /**
  * This function takes control name and types in the filter box of name column
  * If verifyFilteredRecords is true, then it will validate that all the records are shown as per search.
  * If verifyFilteredRecords is false, then there will be no records shown and it will not check the records.
  * @param {string} controlName - The name to filter the records by.
  * @param {number} [noOfRecords=0] - The expected number of records after filtering negative input (default is 0).
  * @param {Object} [options] - Optional configuration object.
  * @param {boolean} [options.verifyFilteredRecords=true] - Whether to validate the filtered results.
  */
  filterByName(controlNameToSearch, {verifyFilteredRecords = true} = {}, noOfRecords = 0) {
    controlNameToSearch = controlNameToSearch.toLowerCase();
    cy.get(locators.risk.administration.controlOperations.inputFields)
    .first().type(controlNameToSearch);
    cy.wait(this.time); // wait for records to appear as per filter correctly
    if(verifyFilteredRecords){
      cy.get(locators.risk.administration.controlOperations.controlRecords)
      .each(($controlName) => {
        let text = $controlName.text().trim().toLowerCase();
        expect(text).to.contain(controlNameToSearch);
      })
    }else{
      cy.get(locators.risk.administration.controlOperations.controlRecords)
      .should('have.length', noOfRecords);
    }
  }

  /**
   * This function filters the status by invalid/negative filter which doesn't exist.
   * and verifies that no statuses are shown after typing invalid status in the search status filter.
   * @param {string} status - status to be filtered
   * @param {number} noOfStatuses - number of statuses expected after filtering
   */
  filterByInvalidStatus(status, noOfStatuses){
    cy.get(locators.risk.administration.controlOperations.filterIcons)
    .last()
    .click();
    cy.get(locators.risk.administration.controlOperations.statusFilterSearch)
    .type(status);
    cy.get(locators.risk.administration.controlOperations.statusFilterContainer)
    .children()
    .should('have.length', noOfStatuses);
  }

  /**
   * Updates the data in the specified file based on the provided parameters. 
   * If 'key' is provided, it updates the 'addData.name' field as per given key.
   * If 'key' matches 'keyObject.add', it updates the 'addData.name' field.
   * If 'key' matches 'keyObject.update', it updates the 'updateData.name' field.
   * If 'contentLibrary' is provided, it updates the 'addData.contentLibrary' field.
   * If 'specialCharacters' is provided, it updates the 'updateData.specialCharacters' field.
   * Finally, it writes the updated data back to the specified file.
   * @param {object} fileParamsObj - An object containing parameters 'filePath', 'key', 'keyObject', 'controlNameText', 'specialCharacters', 'specialCharactersText', and 'contentLibrary'.
   */
  updateDataInFile(fileParamsObj) {
    const {filePath, key, keyObject, controlNameText, specialCharacters, specialCharactersText, contentLibrary} = fileParamsObj;
    cy.readFile(filePath).then((fileData) => {
      cy.createRandomString(6).then((randomString) => {
        
        if(key){
            if(key == keyObject.add){
            fileData.addData.name = controlNameText + randomString;
        }else if(key == keyObject.update){
            fileData.updateData.name = controlNameText + randomString;
          }
        }

        if(contentLibrary){
          fileData.addData.contentLibrary = contentLibrary;
        }

        if(specialCharacters){
          fileData.updateData.specialCharacters = specialCharactersText + randomString;
        }
      });
      
      cy.writeFile(filePath, fileData);
    });
  }

  /**
   * Updates the number of records in the specified file.
   * @param {string} filePath - path of the file to be updated
   * @param {number} updatedNoOfRecords - updated number of records
   */
  updateNoOfRecords(filePath, updatedNoOfRecords) {
    cy.readFile(filePath).then((fileData) => {
        fileData.uiConfig.noOfRecords = updatedNoOfRecords; 
        cy.writeFile(filePath, fileData);
    });
  }

  /**
   * Retrieves the last content library from the UI and passes it to the callback.
   * @param {object} parametersObj - The parameters object containing column and contentLibrary.
   * @param {string} scrollDirection - The direction to scroll.
   * @param {Function} callback - The callback function to receive the last content library.
   */
  getLastContentLibrary(parametersObj, scrollDirection, callback){
    cy.get(locators.risk.administration.controlOperations.typeControlColumn
    .replace(parametersObj.column, parametersObj.contentLibrary))   
    .dblclick();

    cy.get(locators.risk.administration.controlOperations.contentLibraryScroll)
    .scrollTo(scrollDirection);
    cy.wait(this.time); // wait to ensure scroll is completed properly before getting the last item

    cy.get(locators.risk.administration.controlOperations.contentLibraryItem)
    .last().then(($contentLibrary) => {
      const text = $contentLibrary.text().trim();
      callback(text);
    });
  }
}

export default ControlOperationsNoneSpace;