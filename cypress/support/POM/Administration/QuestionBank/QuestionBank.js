import locators from "../../../../fixtures/locators.json";
import testData from "../../../../fixtures/Administration/QuestionBank/QuestionBank.json";
// import assessmentData from "../../../../fixtures/Administration/Assessments.json";
let assessmentData;
import Assessment from "../../../POM/Administration/Assessment";
import KXI_POM from "../../KXIModule/KxI_POM";
import Users from "../Users";
const assessment= new Assessment();
const dataFilePath = "cypress/fixtures/Administration/Administration.json";
const qbLoc = locators.administration.questionBank;
// const errorMsg = assessmentData.errorMsg;
// const charLimits = assessmentData.charLimits;
let assessmentDataString = "";
const qbImport = "cypress/fixtures/Examples/qbImport.json";

const kxiPom = new KXI_POM();
const users = new Users();
class QuestionBank {
  get assessmentData() {
    if (!assessmentData) {
      throw new Error("assessmentData is not loaded yet. Please ensure it is initialized before accessing it.");
    }
    return assessmentData;
  }

  get errorMsg() {
    if (!assessmentData) {
      throw new Error("assessmentData is not loaded yet.");
    }
    return assessmentData.errorMsg;
  }

  get charLimits() {
    if (!assessmentData) {
      throw new Error("assessmentData is not loaded yet.");
    }
    return assessmentData.charLimits;
  }

/**
 * Updates the assessmentDataString to point to a new JSON file and loads its content.
 * @param {string} newFileName - The new file name to replace in the assessmentString.
 * @returns {Cypress.Chainable} - Returns a Cypress chainable object for further chaining.
 */
updateAssessmentDataFile(newFileName) {
  const basePath = "cypress/fixtures/Administration/";
  const newFilePath = `${basePath}${newFileName}`;
  assessmentDataString = newFilePath; // Update the global variable

  // Use cy.readFile to dynamically load the JSON file
  return cy.readFile(newFilePath).then((data) => {
    assessmentData = data; // Assign the loaded data to the global variable
    cy.log(`Updated assessmentDataString to: ${assessmentDataString}`);
    cy.log(`Loaded assessmentData: ${JSON.stringify(assessmentData)}`);
  });
}

  /**
   * Verifies that mandatory fields display an error message when left empty.
   */
  verifyMandatoryFieldsError() {
    this.saveForm();
    cy.contains(this.errorMsg.problemInSave).should("be.visible");
  }

  /**
   * Verifies that the question bank name character limit validation works as expected.
   */
  verifyQBNameCharLimit() {
    this.clickAddBtn();
    this.enterLongQuestionBankName();
    this.saveForm();
    cy.contains(this.errorMsg.lessThan255).should("be.visible");
  }

  /**
   * Generates a random string, appends it to a valid question bank name, and inputs the result into the form field.
   * The updated name is saved in the JSON data file.
   */
  enterQuestionBankName() {
    cy.readFile(dataFilePath).then((data) => {
      cy.createRandomAlphaNumeric(10).then((randomString) => {
        const questionBankName = testData.validQuestionBankName + randomString;
        data.questionBankName = questionBankName;
        cy.get(qbLoc.questionBankName).clear().type(questionBankName);
        cy.writeFile(dataFilePath, data);
      });
    });
  }

  /**
   * Inputs a long question bank name into the form field.
   * Used for testing name length validation.
   */
  enterLongQuestionBankName() {
    cy.get(qbLoc.questionBankName).clear().type(this.charLimits.longQBNameLimit);
  }

  /**
   * Selects the question bank status (Active or Inactive) by checking the appropriate radio button.
   * @param {string} status - The status to select ("Active" or "Inactive").
   */
  selectStatus(status) {
    const statusLocator =
      status === "Active" ? qbLoc.statusActive : qbLoc.statusInactive;
    cy.get(statusLocator).check({ force: true });
  }

  /**
   * Selects multiple frameworks from the dropdown based on the data file.
   */
  selectFrameworks() {
    testData.frameworks.forEach((framework) => {
      cy.get(qbLoc.frameworks).select(framework, {
        force: true,
      });
    });
  }

  /**
   * Inputs a valid description into the form field.
   */
  enterDescription() {
    cy.get(qbLoc.description).clear().type(testData.validDescription);
  }

  /**
   * Inputs a long description into the form field.
   * Used for testing description length validation.
   */
  enterLongDescription() {
    cy.get(qbLoc.description).clear().type(this.charLimits.longDescriptionLimit);
  }

  /**
   * Adds multiple valid tags to the form field.
   * The request to fetch available tags is intercepted and waited on for each tag entry.
   */
  addTags() {
    cy.intercept(Cypress.env("GET_TAGS")).as("getTags");
    testData.validTags.forEach((tag) => {
      cy.get(qbLoc.tags).type(`${tag}`, { force: true }).wait("@getTags");
      cy.get(qbLoc.tags).type("{enter}", { force: true });
    });
  }

  /**
   * Adds multiple invalid tags to the form field.
   * The request to fetch available tags is intercepted and waited on for each tag entry.
   */
  enterInvalidTags() {
    cy.intercept(Cypress.env("GET_TAGS")).as("getTags");
    testData.invalidTags.forEach((tag) => {
      cy.get(qbLoc.tags).type(`${tag}`, { force: true }).wait("@getTags");
      cy.get(qbLoc.tags).type("{enter}", { force: true });
    });
  }

  /**
   * Selects a specified type from the dropdown menu.
   * @param {string} type - The type to select (e.g., "Assessment", "DAP Assessment").
   */
  selectTypeSurvey(type) {
    cy.get(qbLoc.type).select(type, { force: true });
  }

  /**
   * Selects a valid type from the dropdown menu as specified in the data file.
   */
  selectType() {
    cy.get(qbLoc.type).select(testData.validType, {
      force: true,
    });
  }

  /**
   * Inputs the Survey Question Bank ID if the type matches one of the valid types that require this field.
   */
  enterSurveyQuestionBankId() {
    if (
      testData.validType === "DAP Assessment" ||
      testData.validType === "OEP Assessment" ||
      testData.validType === "PAP Assessment"
    ) {
      cy.get(qbLoc.surveyQuestionBankId)
        .clear({ force: true })
        .type(testData.validSurveyQuestionBankId, { force: true });
    }
  }

  /**
   * Checks the visibility of the Survey Question Bank ID field.
   * @returns {Cypress.Chainable} Cypress chainable object for visibility assertion.
   */
  isSurveyQuestionBankIdVisible() {
    return cy.get(qbLoc.surveyQuestionBankIdWrapper);
  }

  /**
   * Clicks the save button to submit the form.
   */
  saveForm() {
    cy.get(locators.administration.QB.saveBtn).click({
      force: true,
      multiple: true,
    });
  }

  /**
   * Verifies that the QA grid list is visible and contains at least one result.
   */
  verifyQAGridList() {
    cy.waitForLoaderToDisappear("qb", Cypress.env("waits").longWait);
    cy.get(locators.administration.QB.searchResult).should("be.visible");
    cy.get(locators.administration.QB.searchResult).should(
      "have.length.greaterThan",
      0
    );
  }

  /**
   * Clicks the "Add" button and verifies the visibility of the heading text.
   */
  clickAddBtn() {
    cy.get(locators.general.clickAddBtn).click();
    cy.contains("h3", this.assessmentData.headingTextQB).should("be.visible");
  }

  /**
   * Verifies that the description character limit validation works as expected.
   */
  verifyDescriptionCharLimit() {
    this.clickAddBtn();
    this.enterLongDescription();
    this.saveForm();
    cy.contains(this.errorMsg.lessThan1000).should("be.visible");
  }

  /**
   * Verifies that an inactive question bank cannot be published.
   */
  verifyInactiveQBPublish() {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.QB.selectPublish).click();
    cy.verifyToastMessageText(
      this.assessmentData.saveMsg.inactiveQBpublished,
      Cypress.env("waits").mediumWait
    );
  }

  /**
   * Deletes a question bank and verifies that it no longer exists in the search results.
   */
  deleteQB() {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.QB.deleteTemplate).click();
    // Clicking on "Yes" in the delete modal to delete the template
    cy.get(locators.general.deleteYes).click();
    assessment.searchQB("add", true)
    cy.get(locators.administration.QB.searchResult).should("not.exist");
  }

  /**
   * Sorts the framework column in ascending and descending order and verifies the result.
   */
  sortFrameWork(fileType) {
    cy.get(locators.administration.QB.sortFrameWorkColumn,{timeout: Cypress.env("waits").mediumWait})
      .eq(0)
      .click({ force: true })
      .click({ force: true, delay: 1000 });

    cy.readFile(`cypress/fixtures/Administration/${fileType}.json`).then(
      (dataFile) => {
        cy.get(locators.administration.QB.sortFrameWorkColumn, {timeout: Cypress.env("waits").mediumWait})
          .eq(1)
          .wait(1000)
          .contains(dataFile.questionBank.qbSummaryForm.add.framework);
      }
    );
  }

  /**
   * Verifies the filter functionality when no value is provided or when a random value is used.
   * @param {number} tabIndex - The index of the filter tab to apply the filter on.
   * @param {boolean} isEmptyValue - Whether to test with an empty filter value.
   */
  verifyFilterNoValue(tabIndex, isEmptyValue = false) {
    if (isEmptyValue) {
      cy.get("#filterText").clear().type("{enter}");
      cy.get("div .ag-cell").should("have.length.greaterThan", 1);
    } else {
      cy.createRandomAlphaNumeric(8).then((randomValue) => {
        cy.get("span.ag-icon-filter").eq(tabIndex).click();
        cy.get("#filterText").should("be.visible").clear();
        cy.get("#filterText").clear().type(randomValue);
        cy.get("div .ag-cell").should("have.length", 0);
      });
    }
  }

  /**
   * Verifies the filter functionality with a specific value.
   * @param {number} tabIndex - The index of the filter tab to apply the filter on.
   * @param {string} sectionName - The section name to filter by (e.g., "add").
   */
  verifyWithFilter(tabIndex, sectionName) {
    cy.readFile(assessmentDataString).then((dataFile) => {
      const filterValue =
        sectionName === "add"
          ? dataFile.questionBank.qbSummaryForm.add.framework
          : dataFile.questionBank.qbSummaryForm[sectionName].qbName;

      this.applyFilter(tabIndex, filterValue);
      cy.get("div .ag-cell").contains(filterValue);
    });
  }

  /**
   * Applies a filter with a specific value.
   * @param {number} tabIndex - The index of the filter tab to apply the filter on.
   * @param {string} filterValue - The value to filter by.
   */
  applyFilter(tabIndex, filterValue) {
    cy.get("span.ag-icon-filter").eq(tabIndex).click();
    cy.get("#filterText").should("be.visible").clear().type(filterValue);
  }

  /**
   * Adds question bank data from an import JSON file and converts it to the required format.
   * @param {boolean} validFormatFile - Whether the file format is valid.
   * @param {boolean} isCustomerSpace - Whether the space is a customer space.
   */
  addUsersDataImportJson(validFormatFile, isCustomerSpace=false) {
    cy.readFile(qbImport)
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          $json["Question Bank"][0]["Name*"] = "test import " + $el;
          $json["Question Bank"][0]["Survey Question Bank Id*"] = $el;
          if (isCustomerSpace) {
            delete $json["Question Bank"][0]["Content Library*"];
          }
          cy.writeFile(qbImport, $json);
        });
            })
            .then(() => {
        cy.readFile(qbImport).then(($json) => {
          kxiPom.convertXlsxtoJson($json, false, true);
          this.uploadValidFile(validFormatFile);
        });
      });
  }

  /**
   * Uploads a valid or invalid file for import and verifies the result.
   * @param {boolean} validFormatFile - Whether the file format is valid.
   */
  uploadValidFile(validFormatFile) {
    cy.get(locators.general.threeElipses)
    .eq(0)
    .click();
    cy.get(locators.general.importBtn)
      .parent()
      .contains("span", "Import")
      .click();

    const filePath = validFormatFile
      ? "cypress/downloads/importFile.xlsx"
      : "cypress/downloads/importFile.csv";
    cy.get(locators.general.importChooseFile).selectFile(filePath);

    if (validFormatFile) {
      cy.get(locators.administration.QB.importUploadFileBtn).click({
        force: true,
      });
      cy.verifyToastMessageText(
        testData.importSuccessMsg,
        Cypress.env("waits").mediumWait
      );
    } else {
      cy.get(locators.administration.QB.importUploadFileBtn).should(
        "not.be.visible"
      );
    }
  }

  writeImportNameToAssessment(fileType) {
    cy.readFile(qbImport).then((file) => {
      cy.readAndWriteData(
        "qbImport Name",
        file["Question Bank"][0]["Name*"],
        fileType
      );
    });
  }

  /**
   * Updates the assessmentDataString to point to a new JSON file and loads its content.
   * @param {string} newFileName - The new file name to replace in the assessmentString.
   */
  updateAssessmentDataFile(newFileName) {
    const basePath = "cypress/fixtures/Administration/";
    const newFilePath = `${basePath}${newFileName}`;
    assessmentDataString = newFilePath; // Update the global variable

    // Use cy.readFile to dynamically load the JSON file
    cy.readFile(newFilePath).then((data) => {
      assessmentData = data; // Assign the loaded data to the global variable
      cy.log(`Updated assessmentDataString to: ${assessmentDataString}`);
      cy.log(`Loaded assessmentData: ${JSON.stringify(assessmentData)}`);
    });
  }
}

export default QuestionBank;
