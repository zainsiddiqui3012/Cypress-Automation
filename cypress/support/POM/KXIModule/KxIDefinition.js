import dayjs from "dayjs";
import locators from "../../../fixtures/locators.json";
const testDataPath = "cypress/fixtures/KXIModule/KXIDefinition.json";
const importFilePath = "cypress/fixtures/Examples/kxiImportJson.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
// const path = require("path");
const locKxi = locators.kxi.kxiDefinition;

export default class KxIDefinition {
  kxiPom = new KXI_POM();
  /**
   * Selects a data entry type from the dropdown in the KXI Definition form.
   *
   * @param {string} type - The data entry type to select from the dropdown options.
   */
  selectDataEntryType(type) {
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
    ).click();

    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeOptions
    ).each(($el, index, $list) => {
      if ($el.text() === type) {
        cy.wrap($el).click();
      }
    });
  }
  /**
   * Fills out the KXI Definition form with provided values, appending a timestamp to the ID and Name fields.
   * Waits for the top message loader to disappear before interacting with the form.
   *
   * @param {string} kxiDefinitionId - The base ID for the KXI Definition (timestamp will be appended).
   * @param {string} kxiDefinitionName - The base name for the KXI Definition (timestamp will be appended).
   * @param {string} kxiDescription - The description for the KXI Definition.
   * @returns {{ kxiDefName: string, kxiDefId: string }} An object containing the full KXI Definition name and ID used in the form.
   */
  addKxIDefinitionInfo(kxiDefinitionId, kxiDefinitionName, kxiDescription) {
    cy.waitForTopMsgLoaderToDisappear(50000);
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const fullKxiDefinitionId = kxiDefinitionId + timeStamp;
    const fullKxiDefinitionName = kxiDefinitionName + timeStamp;
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.definitionID)
      .clear()
      .type(fullKxiDefinitionId);
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.name)
      .clear()
      .type(fullKxiDefinitionName);
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.description)
      .clear()
      .type(kxiDescription);
    return { kxiDefName: fullKxiDefinitionName, kxiDefId: fullKxiDefinitionId };
  }

  /**
   * Fills out the KXI Definition form fields with the provided values.
   *
   * @param {string} kxiDefinitionID - The ID to enter in the Definition ID field.
   * @param {string} kxiDefinitionName - The name to enter in the Name field.
   * @param {string} kxiDescription - The description to enter in the Description field.
   */
  addDuplicateName(kxiDefinitionID, kxiDefinitionName, kxiDescription) {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.definitionID).type(
      kxiDefinitionID
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.name).type(
      kxiDefinitionName
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.description).type(
      kxiDescription
    );
  }

  /**
   * Writes the KXI Definition Name and ID to the specified section in the test data file.
   *
   * @param {string} sectionName - The name of the section in the test data file to update.
   * @param {string} kxiDefName - The KXI Definition Name to write.
   * @param {string} kxiDefID - The KXI Definition ID to write.
   */
  writeKXINameID(sectionName, kxiDefName, kxiDefID) {
    cy.readFile(testDataPath).then((data) => {
      data[sectionName].kxiDefinitionName = kxiDefName;
      data[sectionName].kxiDefinitionID = kxiDefID;
      cy.writeFile(testDataPath, data);
    });
  }

  /**
   * Selects an option from a dropdown element using the provided locator and value.
   *
   * @param {string} locator - The selector used to locate the dropdown element.
   * @param {string} value - The value or visible text of the option to select.
   */
  selectMethod(locator, value) {
    cy.get(locator).select(value, { force: true });
  }

  /**
   * Selects an owner type from the owner dropdown in the KXI Definition form.
   *
   * @param {string} type - The owner type to select from the dropdown options.
   */
  selectOwner(type) {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.owner).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.OwnerTypeOptions).each(
      ($el, index, $list) => {
        if ($el.text() === type) {
          cy.wrap($el).click();
        }
      }
    );
  }

  /**
   * Searches for a KXI Definition by name and verifies that exactly one edit button is present.
   * @param {string} kxiDefName - The name of the KXI Definition to search for.
   */
  searchKxiDefinition(kxiDefName) {
    cy.get(locators.kxi.kxiDefinition.searchKxiDefinition,{timeout: 10000}).clear({force: true}).type('{selectall}{backspace}').type(kxiDefName,{delay:200});
    cy.wait(2000)
    cy.get(locators.general.editBtn,{timeout: 10000}).should("have.length", 1);
  }

  // Method to click the "Edit" icon in the UI
  // No parameters are passed here.
  clickEditIcon() {
    cy.get(locators.general.clickEditAction).click();
  }

  /** Method to set trigger comparison values
   *  @param {String} targetValue: The target value for comparison
   * @param {String} leftTriggerLvl1: First level of left trigger
   * @param {String} leftTriggerLvl2: Second level of left trigger
   * @param {String} leftTriggerLvl3: Third level of left trigger
   * @param {String} rightTriggerLvl1: First level of right trigger
   * @param {String} rightTriggerLvl2: Second level of right trigger
   * @param {String} rightTriggerLvl3: Third level of right trigger
   * This method calls 'setTriggerCompareApplicable' internally with the same parameters
   **/
  setTriggerComparer(
    targetValue,
    leftTriggerLvl1,
    leftTriggerLvl2,
    leftTriggerLvl3,
    rightTriggerLvl1,
    rightTriggerLvl2,
    rightTriggerLvl3
  ) {
    this.setTriggerCompareApplicable(
      targetValue,
      leftTriggerLvl1,
      leftTriggerLvl2,
      leftTriggerLvl3,
      rightTriggerLvl1,
      rightTriggerLvl2,
      rightTriggerLvl3
    );
  }

  /**
   * Method to set trigger comparison values and apply them in the form.
   * @param {string} targetValue - The target value for comparison.
   * @param {string} leftTriggerLvl1 - The value for the first level of the left trigger.
   * @param {string} leftTriggerLvl2 - The value for the second level of the left trigger.
   * @param {string} leftTriggerLvl3 - The value for the third level of the left trigger.
   * @param {string} rightTriggerLvl1 - The value for the first level of the right trigger.
   * @param {string} rightTriggerLvl2 - The value for the second level of the right trigger.
   * @param {string} rightTriggerLvl3 - The value for the third level of the right trigger.
   *
   * This method interacts with the KRI definition form, setting values for target,
   * left trigger levels, and right trigger levels while selecting radio buttons for
   * negative and positive triggers.
   */
  setTriggerCompareApplicable(
    targetValue,
    leftTriggerLvl1,
    leftTriggerLvl2,
    leftTriggerLvl3,
    rightTriggerLvl1,
    rightTriggerLvl2,
    rightTriggerLvl3
  ) {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.targetTextBox).type(
      targetValue
    );
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.negativeRadioLeftTrigger
    ).click();
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.positiveRadioRightTrigger
    ).click();
    // Set left trigger values
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl1).type(
      leftTriggerLvl1
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl2).type(
      leftTriggerLvl2
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl3).type(
      leftTriggerLvl3
    );
    // Set right trigger values
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLvl1).type(
      rightTriggerLvl1
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLvl2).type(
      rightTriggerLvl2
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLvl3).type(
      rightTriggerLvl3
    );
  }

  /**
   * setTriggerComparerPartialNotApplicable will set the negative value threshold values and left trigger levels
   * for Right Trigger it will be mark not Applicable.
   * @param {*} targetValue is set threshold value
   * @param {*} leftTriggerLvl1 set leftTrigger value 1
   * @param {*} leftTriggerLvl2 set leftTrigger value 2
   * @param {*} leftTriggerLvl3  set leftTrigger value 3
   */
  setTriggerComparerPartialNotApplicable(
    targetValue,
    leftTriggerLvl1,
    leftTriggerLvl2,
    leftTriggerLvl3
  ) {
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.negativeRadioLeftTrigger
    ).click();

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.targetTextBox).type(
      targetValue
    );

    //left Trigger
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl1).type(
      leftTriggerLvl1
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl2).type(
      leftTriggerLvl2
    );
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLvl3).type(
      leftTriggerLvl3
    );
  }

  /**
   *  Method to verify the length of records in the manual data entry column.
   *  @param {String} length: The expected length (number of records) that should be present in the manual data entry column.
   *  The method scrolls into view and asserts that the number of records in the column matches the expected length.
   **/
  verifyDataOnManualDataEntryColumn(length) {
    cy.get(locators.kxi.kxiDefinition.manualDataEntryRecord)
      .scrollIntoView()
      .should("have.length", length);
  }

  /*
  Method to verify that no manual data entry record exists in the grid.
  This method checks if the manual data entry record is absent in the UI.
  No parameters are passed.
*/
  verifyNoManualDataEntryRecordInGrid() {
    cy.get(locators.kxi.kxiDefinition.manualDataEntryRecord).should(
      "not.exist"
    );
  }

  /**
   * clickThreeElipses will click on Three Elipses icon on the Top left of define KXI Screen
   */
  clickThreeElipses() {
    cy.get(locators.general.threeElipses).click({ force: true });
  }

  /**
   * Method to click the "Add" button to add a new KXI.
   * This method locates the "Add" button using the locator and clicks it.
   * No parameters are passed.
   */
  clickAddKxiBtn() {
    cy.get(locators.kxi.kxiDefinition.addBtn).contains("Add").click();
  }

  /**
   * Method to verify if the form modal is open.
   * This method checks if the KRI definition modal is visible on the UI.
   * No parameters are passed.
   */
  verifyOpenForm() {
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.kriDefinitionModalContainer
    ).should("be.visible");
  }

  /**
   * Method to click the "Save" button on the form.
   * This method locates and clicks the "Save" button on the form.
   * No parameters are passed.
   */
  clickFormSaveBtn() {
    cy.get(locators.general.formSaveBtn).click();
  }

  /**
   * Method to verify mandatory field errors.
   * This method reads data from a file and checks if the appropriate toast message for mandatory field errors is displayed.
   * No parameters are passed.
   */
  verifyMandatoryFieldErrors() {
    cy.readFile(testDataPath).then((data) => {
      cy.verifyToastMessageText(data.toastMsgs.mandatoryError, 20000);
    });
  }

  /**
   * Method to verify the maximum length of a name field.
   * @param {number} maxLength - The maximum length attribute that should be set on the name field.
   * This method checks that the name field has the correct maximum length.
   */
  verifyNameMaxLength(maxLength) {
    cy.get(locKxi.kriDefinitionForm.name).should(
      "have.attr",
      "maxLength",
      maxLength
    );
  }

  verifyDescriptionMaxLength(maxLength) {
    cy.get(locKxi.kriDefinitionForm.description).should(
      "have.attr",
      "maxLength",
      maxLength
    );
  }

  verifyDescriptionAllowsValidLength(validText) {
    cy.get(locKxi.kriDefinitionForm.description)
      .clear()
      .type(validText)
      .should("have.value", validText);
  }

  clickKRIScope(kriScope){
    cy.get("#kriDefinationForm")
    .scrollIntoView()
    .contains(kriScope)
    .click();
  }

  /**
   * clickImportBtn will first click on Three Elipses and then click on Import Button
   *
   */
  clickImportBtn() {
    cy.readFile(testDataPath).then((data) => {
      this.clickThreeElipses();
      cy.get(locators.general.importBtn)
        .parent()
        .contains("span", data.importText)
        .click();
    });
  }

  /**
   * Method to add user data for import in JSON format and optionally convert it to CSV.
   * @param {boolean} [csv=false] - A flag indicating whether to convert the JSON data to CSV format (default is false).
   * This method reads the JSON file, modifies the data by adding a random string to the name and ID,
   * writes the updated data back to the file, and then triggers further steps like conversion to CSV and opening the import modal.
   */
  addUsersDataImportJson(csv = false) {
    cy.readFile(importFilePath)
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          const defName = "import " + $el;
          $json["KxI Definitions"][0]["Name"] = defName;
          $json["KxI Definitions"][0]["Id"] = $el;

          cy.writeFile(importFilePath, $json);
          this.writeKXINameID("update", defName, $el);
        });
      })
      .then(() => {
        cy.readFile(importFilePath).then(($json) => {
          this.kxiPom.convertXlsxtoJson($json, csv);
          this.openImportModal(csv);
        });
      });
  }

  /**
   * Opens the import modal and selects a file for import.
   *
   * @param {boolean} csv - Flag to indicate if the file is csv otherwise xlsx.
   */
  openImportModal(csv = false) {
    cy.readFile(testDataPath).then((data) => {
      cy.get(locators.general.threeElipses).eq(0).click();
      cy.get(locators.general.importBtn)
        .parent()
        .contains("span", data.importText)
        .click();
    });

    const filePath = csv
      ? "cypress/downloads/importFile.csv"
      : "cypress/downloads/importFile.xlsx";
    cy.get(locators.general.importChooseFile).selectFile(filePath);

    cy.get(locators.general.importSubmitBtn).click({ force: true });
    // cy.verifyToastMessageText(users.importSuccessMsg, 60000);
  }

  /**
   * verifyImportExportCompleted will check that when importing the file COMPLETED in Modal should be visible which ensures
   * that the file is uploaded successfully
   * @param {Boolean} Import will be true when user wants to import
   * @param {Boolean} Export will be true when user wants to export
   */
  verifyImportExportCompleted(Import = false, Export = false) {
    cy.readFile(testDataPath).then((file) => {
      // cy.wait(9000);
      if (Import === true && Export === false) {
        cy.get(locators.kxi.kxiData.kxiRegularTask.importModal.jobQue, {
          timeout: 9000,
        })
          .should("be.visible")
          .eq(0)
          .contains("a", file.importStatusComplete, { timeout: 900000 });
        cy.get(
          locators.kxi.kxiData.kxiRegularTask.importModal.closeJobQue
        ).click({ force: true });
        cy.reload();
      }
    });
  }

  /****
   * Waits for "COMPLETED" status in the job queue, clicking refresh until found or retries exhausted.
   * If Import or Export is true, will only check for "COMPLETED" when that operation is requested.
   * @param {Boolean} Import - Set true to check for import completion.
   * @param {Boolean} Export - Set true to check for export completion.
   * @param {number} maxRetries - Maximum number of refresh attempts.
   * @param {number} delay - Delay between refreshes in ms.
   */
  waitForCompletedStatus(
    Import = false,
    Export = false,
    maxRetries = 10,
    delay = 2000
  ) {
    const self = this;
    function checkAndRefresh(retriesLeft) {
      return cy
        .get(locators.kxi.kxiData.kxiRegularTask.importModal.jobQue, {
          timeout: 10000,
        })
        .then(($el) => {
          // Only check for COMPLETED if Import or Export is requested
          if (
            Import &&
            !Export &&
            $el.find(locators.general.jobCompleteStatus).length > 0
          ) {
            // Found "COMPLETED"
            return;
          } else if (retriesLeft > 0) {
            cy.get(locators.general.jobQueReferesh).click({ force: true });
            return cy.wait(delay).then(() => checkAndRefresh(retriesLeft - 1));
          } else {
            throw new Error(
              `COMPLETED status not found after maximum retries :${maxRetries}`
            );
          }
        });
    }
    return checkAndRefresh(maxRetries);
  }
}
