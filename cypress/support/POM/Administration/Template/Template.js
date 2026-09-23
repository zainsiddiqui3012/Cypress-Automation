import locators from "../../../../fixtures/locators.json";
import testData from "../../../../fixtures/Administration/Template/Template.json";
let assessmentData;
import Assessment from "../../../POM/Administration/Assessment";
import KXI_POM from "../../KXIModule/KxI_POM";
import Users from "../Users";
import { should } from "chai";
const dataFilePath = "cypress/fixtures/Administration/Administration.json";
const qbLoc = locators.administration.questionBank;
let assessmentDataString = "";
const templateImport = "cypress/fixtures/Examples/templateImport.json";

const kxiPom = new KXI_POM();
const users = new Users();
class QuestionBank {
  /**
   * Retrieves the assessment data.
   * @returns {Object} The assessment data object.
   * @throws Will throw an error if the assessment data is not loaded.
   */
  get assessmentData() {
    if (!assessmentData) {
      throw new Error(
        "assessmentData is not loaded yet. Please ensure it is initialized before accessing it."
      );
    }
    return assessmentData;
  }

  /**
   * Retrieves the error message from the assessment data.
   * @returns {string} The error message.
   * @throws Will throw an error if the assessment data is not loaded.
   */
  get errorMsg() {
    if (!assessmentData) {
      throw new Error("assessmentData is not loaded yet.");
    }
    return assessmentData.errorMsg;
  }

  /**
   * Retrieves the character limits from the assessment data.
   * @returns {Object} The character limits.
   * @throws Will throw an error if the assessment data is not loaded.
   */
  get charLimits() {
    if (!assessmentData) {
      throw new Error("assessmentData is not loaded yet.");
    }
    return assessmentData.charLimits;
  }

  /**
   * Reads assessment and template import files, retrieves the 'frameworkCustomer' value
   * from the assessment data, and updates the first 'QuestionBanks' entry in the template
   * file with this value under the 'Frameworks*' key. Writes the updated template file back to disk.
   */
  writeFrameworkCustomerImport(){
    cy.readFile(assessmentDataString).then(($assessmentFile) => {
      cy.readFile(templateImport).then(($templateFile) => {
        const frameworkCustomer = $assessmentFile.questionBank.qbSummaryForm.add.frameworkCustomer;
        $templateFile["QuestionBanks"][0]["Frameworks*"] = frameworkCustomer;
        delete $templateFile["QuestionBanks"][0]["Content Library*"];
        delete $templateFile["AssessmentTemplates"][0]["Content Library*"];
        cy.writeFile(templateImport, $templateFile);
      })
    });
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
    });
  }

  /**
   * Searches for a framework or template using the specified search field and value.
   * @param {string} searchField - The locator for the search field.
   * @param {string} searchValue - The value to search for.
   * @param {number} index - The index of the search field.
   */
  searchFrameworkOrTemplate(searchField, searchValue, index) {
    cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").longWait);
    cy.waitForLoaderToDisappear("template", Cypress.env("waits").longWait);
    cy.get(searchField).eq(index).clear().type(searchValue, { delay: 250 });
  }

  /**
   * Searches for a framework using the data from the assessment file.
   * @param {boolean} isCustomerSpace - Indicates if the operation is in a customer space.
   */
  searchFrameWork(isCustomerSpace = false) {
    cy.readFile(assessmentDataString).then((file) => {
      // const frameworkName = isCustomerSpace
      //   ? file.questionBank.qbSummaryForm.add.frameworkCustomer
      //   : file.questionBank.qbSummaryForm.add.framework;
        this.searchFrameworkOrTemplate(
          locators.administration.template.searchTemplate,
          file.questionBank.qbSummaryForm.add.framework,
          0
        );
    });
    cy.get(locators.administration.QB.searchResult, {
      timeout: Cypress.env("waits").mediumWait,
    }).should("have.length", 1);
  }

  /**
   * Searches for a template using the data from the assessment file.
   */
  searchTemplate() {
    cy.readFile(assessmentDataString).then((file) => {
      this.searchFrameworkOrTemplate(
        locators.administration.template.templateGrid,
        file.template.templateSurveyForm.templateName,
        1
      );
    });
  }

  /**
   * Clicks on the saved template link in the search results.
   */
  clickSavedTemplateLink() {
    cy.readFile(assessmentDataString).then((file) => {
      cy.get(locators.administration.QB.searchResult, { timeout: Cypress.env("waits").mediumWait })
        .contains(file.template.templateSurveyForm.templateName)
        .click();
    });
  }

  /**
   * Clicks on the "Sections" tab in the UI.
   */
  clickSectionTab() {
    cy.waitForTopMsgLoaderToDisappear(10000);
    cy.get(locators.general.tabs).contains("Sections").click();
  }

  /**
   * Verifies that the Template grid list is visible and contains at least one result.
   */
  verifyTemplateGridList() {
    cy.waitForLoaderToDisappear("template", Cypress.env("waits").longWait);
    cy.get(locators.administration.QB.searchResult).should("be.visible");
    cy.get(locators.administration.QB.searchResult).should(
      "have.length.greaterThan",
      0
    );
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
  verifySurveyIDCharLimit() {
    this.clickAddBtn();
    this.enterLongSurveyID();
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
  enterLongSurveyID() {
    cy.createRandomAlphaNumeric(257).then(($el) => {
      cy.get(locators.administration.template.surveyID).clear().type($el);
    });
    cy.get(locators.administration.template.surveyID).should(
      "have.attr",
      "maxlength",
      this.charLimits.longQBNameLimit
    );
  }

  /**
   * Verifies that the library survey ID field is non-editable.
   * @param {boolean} isCustomerSpace - Indicates if the operation is in a customer space.
   */
  verifyLibrarySurveyIdNonEditable(isCustomerSpace=false) {
    if(!isCustomerSpace)
    cy.get(locators.administration.template.libraryAssessmentID).should("have.attr", "readonly");
  }

  /**
   * Enters guidance text into the guidance text field and verifies character limit validation.
   */
  enterGuidanceText() {
    testData.guidanceFormat.forEach(($frmt) => {
      cy.get(`[title='${$frmt}']`).click({ delay: 600, force: true });
    });
    cy.createRandomAlphaNumeric(5001).then(($el) => {
      cy.switchToIframe(locators.administration.template.guidanceIframe).then(($iframe) => {
        cy.get($iframe).find("p").type($el);
      });
    });
    cy.get(locators.administration.template.guidanceLimitError)
      .should("have.css", "color", testData.guidanceCharLimitColor) // Assert red color
      .and("be.visible"); // Ensure the element is visible
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
    cy.get(qbLoc.description)
      .clear()
      .type(this.charLimits.longDescriptionLimit);
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
    cy.get(locators.administration.template.continueBtn)
    .scrollIntoView()
    .click({
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
    cy.contains("h3", this.assessmentData.headingTextTemplate).should(
      "be.visible"
    );
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
    cy.get(locators.administration.QB.searchResult).should("not.exist");
  }

  /**
   * Sorts the framework column in ascending and descending order and verifies the result.
   * @param {string} fileType - The file type to read the framework data from.
   */
  sortFrameWork(fileType) {
    cy.get(locators.administration.QB.sortFrameWorkColumn, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .eq(0)
      .click({ force: true })
      .click({ force: true, delay: 1000 });

    cy.readFile(`cypress/fixtures/Administration/${fileType}.json`).then(
      (dataFile) => {
        cy.get(locators.administration.QB.sortFrameWorkColumn, {
          timeout: Cypress.env("waits").mediumWait,
        })
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
   * Verifies the template preview functionality.
   */
  verifyTemplatePreview() {
    for(let i = 0; i < 1; i++) {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.template.previewTemplate).contains(testData.preview).dblclick({delay:1000})};
    cy.get(locators.administration.template.previewTemplateHeading, { timeout: Cypress.env("waits").mediumWait })
      .parent()
      .contains(assessmentData.template.templateSurveyForm.templateName);
  }

  /**
   * Verifies that the template tags are visible in the tag modal.
   */
  verifyTemplateTags() {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.template.tagTemplate).click();
    assessmentData.template.templateSurveyForm.tags.forEach(($tag) => {
      cy.get(locators.administration.template.tagModal).contains($tag).should("be.visible");
    });
  }

  /**
   * Clicks the "Unpublish Template" option and verifies the toast message.
   */
  clickUnpublishTemplate() {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.template.previewTemplate)
      .contains(testData.unPublish)
      .should("be.visible")
      .click();
    cy.get(locators.administration.toastMsg, {
      timeout: Cypress.env("waits").mediumWait,
    }).should("be.visible");
  }

  /**
   * Verifies that the template is marked as "Un-Published".
   */
  verifyUnpublishTemplate() {
    cy.get(locators.administration.QB.threeelipses).should("have.length", 1);
    cy.get(locators.administration.QB.unPublishText, {
      timeout: Cypress.env("waits").mediumWait,
    }).contains("Un-Published");
  }

  /**
   * Clicks the "New Version Template" option to create a new version.
   */
  clickNewVersionTemplate() {
    cy.get(locators.administration.QB.threeelipses)
      .should("have.length", 1)
      .click();
    cy.get(locators.administration.template.newVersionTemplate)
      .should("be.visible")
      .click();
  }

  /**
   * Verifies the creation of a new version of the template and updates the template name.
   */
  verifyNewVersionTemplate() {
    cy.get(locators.administration.template.newVersionModalYes)
      .should("be.visible")
      .click();
    cy.wait(10000);
    cy.readFile(assessmentDataString).then((file) => {
      file.template.templateSurveyForm.templateName =
        file.template.templateSurveyForm.templateName + " v2";
      cy.writeFile(assessmentDataString, file);
    });
  }

  /**
   * Verifies the filter functionality with a specific value.
   * @param {number} tabIndex - The index of the filter tab to apply the filter on.
   * @param {string} sectionName - The section name to filter by (e.g., "add").
   */
  verifyWithFilter(tabIndex, filterValue, verifyStatus = false) {
    cy.readFile(assessmentDataString).then((dataFile) => {
      this.applyFilter(tabIndex, filterValue);
      cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
      cy.waitForLoaderToDisappear("template", Cypress.env("waits").longWait);
      !verifyStatus
        ? cy.get(locators.administration.template.templateColumns).eq(tabIndex).contains(filterValue)
        : cy.get(locators.administration.template.templateColumns).eq(tabIndex).
      should("not.contain", filterValue);
    });
  }

  /**
   * Applies a filter with a specific value.
   * @param {number} tabIndex - The index of the filter tab to apply the filter on.
   * @param {string} filterValue - The value to filter by.
   */
  applyFilter(tabIndex, filterValue) {
    cy.get(locators.administration.template.filterColumnIcon).eq(tabIndex).click();
    cy.get(locators.administration.template.filterColumnSearch)
      .first()
      .should("be.visible")
      .clear()
      .type(filterValue)
      .type("{enter}");
  }

  /**
   * Adds question bank data from an import JSON file and converts it to the required format.
   * @param {boolean} validFormatFile - Whether the file format is valid.
   */
  addUsersDataImportJson(validFormatFile) {
    cy.readFile(templateImport)
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          $json["AssessmentTemplates"][0]["Name*"] = "test import " + $el;
          $json["AssessmentTemplates"][0]["Assessment ID*"] = $el
          cy.writeFile(templateImport, $json);
        });
      })
      .then(() => {
        cy.readFile(templateImport).then(($json) => {
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
    cy.get(locators.general.threeElipses).eq(0).click({force:true, delay:800});
    cy.get(locators.general.importBtn)
      .parent()
      .contains("span", "Import")
      .click({force:true});

    const filePath = validFormatFile
      ? "cypress/downloads/importFile.xlsx"
      : "cypress/downloads/importFile.csv";
    cy.get(locators.general.importChooseFile).selectFile(filePath);

    if (validFormatFile) {
      cy.get(locators.administration.template.submitImportModal).click({
        force: true,
      });
    } else {
      cy.get(locators.administration.template.submitImportModal).should(
        "not.be.visible"
      );
    }
  }

  /**
   * Writes the name of the imported template to the assessment data.
   *
   * @param {string} fileType - The type of file to be processed.
   * Reads the template import file, extracts the name of the first assessment template,
   * and writes it to the assessment data using the specified file type.
   */
  writeImportNameToAssessment(fileType) {
    cy.readFile(templateImport).then((file) => {
      cy.readAndWriteData(
        "templateImport Name",
        file["AssessmentTemplates"][0]["Name*"],
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
    });
  }
}

export default QuestionBank;
