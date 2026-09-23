/// <reference path="../../../support/index.d.ts" />
import KXI_POM from "../KXIModule/KxI_POM";
import locators from "../../../fixtures/locators.json";
import Assessment from "./Assessment";
import ContentLibrary from "./ContentLibary";
import dayjs from "dayjs";
import QuestionBank from "./QuestionBank/QuestionBank";
const testDataString = "cypress/fixtures/Administration/BusinessArea.json";

const qbImport = "cypress/fixtures/Examples/baImport.json";
const assessment = new Assessment();
const contentLibrary= new ContentLibrary();
const kxiPom= new KXI_POM();
const questionBank= new QuestionBank()
/**
 * Page Object Model for Business Areas administration in Cypress tests.
 * Provides methods to interact with and verify business area grid, add/update records,
 * handle import/export, and perform various UI actions for business area management.
 *
 * @class BusinessAreas
 */
export default class BusinessAreas {
  /**
   * Verifies the grid list for a specific section tab.
   * @param {String} sectionTabName - The name of the section tab to verify.
   */
  verifyBAGridlist(sectionTabName) {
    cy.get(locators.administration.businessArea.tabs)
      .contains(sectionTabName)
      .click();

    cy.waitForTopMsgLoaderToDisappear(15000);
    cy.waitForLoaderToDisappear("myGrid", 80000);
    cy.get(locators.administration.businessArea.businessAreaGrid).should(
      "have.length.greaterThan",
      0
    );
  }

  /**
   * Clicks the "Add" button.
   */
  clickAddBtn() {
    cy.get(locators.general.addBtn).click({force:true});
  }

  /**
   * Verifies the error message for duplicate records.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isDuplicate - Whether the record is a duplicate.
   * @param {Boolean} isBusinessDefinition - Whether the record is a business definition.
   * @param {Boolean} isCustomerSpace - Whether the record is in Customer Space
   */
  verifyDuplicateRecordError(
    sectionName,
    category,
    isDuplicate,
    isBusinessDefinition = false,
    isCustomerSpace = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      this.clickAddBtn();
      this.submitBARecord(
        sectionName,
        category,
        isDuplicate,
        isBusinessDefinition,
        isCustomerSpace
      );
    });
  }

  /**
   * Verifies the error message for empty records.
   */
  verifyEmptyRecordError() {
    cy.readFile(testDataString).then((dataFile) => {
      this.clickAddBtn();
      this.clickAddBtn();
      cy.verifyToastMessageText(
        dataFile.toastMsgs.emptyRecord,
        Cypress.env("waits").mediumWait
      );
    });
  }

  /**
   * Adds a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isCustomerSpace - Whether record is in Customer Space.
   */
  addBA(sectionName, category, isCustomerSpace = false) {
    this.clickAddBtn();
    this.submitBARecord(sectionName, category, false, false, isCustomerSpace);
  }

  /**
   * Adds a business area definition.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isBusinessDefinition - Whether the record is a business definition.
   * @param {Boolean} isCustomerSpace - Whether the record is from Customer Space.
   */
  addBADef(
    sectionName,
    category,
    isBusinessDefinition,
    isCustomerSpace = false
  ) {
    this.clickAddBtn();
    this.submitBARecord(
      sectionName,
      category,
      false,
      isBusinessDefinition,
      isCustomerSpace
    );
  }

  /**
   * Adds a business area with the specified parameters.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isBusinessArea - Whether the record is a business area.
   */
  addBAreas(sectionName, category, isBusinessArea) {
    this.clickAddBtn();
    this.submitBARecord(
      sectionName,
      category,
      false,
      false,
      true,
      isBusinessArea
    );
  }

  /**
   * Checks for duplicate record toast message.
   * @param {Boolean} isDuplicate - Whether the record is a duplicate.
   */
  checkForDuplicate(isDuplicate) {
    cy.readFile(testDataString).then((dataFile) => {
      !isDuplicate
        ? cy.verifyToastMessageText(
            dataFile.toastMsgs.savedRecord,
            Cypress.env("waits").shortWait
          )
        : cy.verifyToastMessageText(
            dataFile.toastMsgs.duplicateError,
            Cypress.env("waits").shortWait
          );
    });
  }

  /**
   * Submits a business area definition.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isBusinessDefinition - Whether the record is a business definition.
   * @param {Boolean} isCustomerSpace - Whether the record is in Customer Space.
   */
  submitBADef(sectionName, category, isBusinessDefinition, isCustomerSpace) {
    cy.readFile(testDataString).then((dataFile) => {
      if (isBusinessDefinition) {
        switch (isCustomerSpace) {
          case true:
            this.searchBA(sectionName, category);
            cy.get("[col-id='businessAreaDef1.id']")
              .eq(1)
              .dblclick({ force: true })
              .then(() => {
                this.selectBAC();
              });
            break;
          case false:
          default:
            cy.get("body").tab();
            cy.waitForTopMsgLoaderToDisappear(40000);
            // cy.focused().as("focusedElement");
            cy.get("[col-id='businessAreaDef1.id']").eq(1).as("focusedElement");
            cy.get("@focusedElement")
              .dblclick({ force: true })
              .then(() => {
                // Ensure dropdown remains open after double-click
                this.selectBAC();
              });
            break;
        }
        cy.get(locators.general.gridName).eq(0).click();
        cy.get(locators.administration.businessArea.gridType)
          .first()
          .dblclick();
        cy.get(locators.administration.businessArea.selectedType)
          .contains(dataFile[sectionName][category].typeName)
          .click();
      }
    });
  }

  /**
   * Submits a business area with the specified parameters.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isBusinessArea - Whether the record is a business area.
   */
  submitBAreas(sectionName, category, isBusinessArea) {
    cy.readFile(testDataString).then((dataFile) => {
      if (isBusinessArea) {
        switch (isCustomerSpace) {
          case true:
            this.searchBA(sectionName, category);
            cy.get("[col-id='businessAreaDef1.id']")
              .eq(1)
              .dblclick({ force: true })
              .then(() => {
                this.selectBAC();
              });
            break;
          case false:
          default:
            cy.get("body").tab();
            cy.waitForTopMsgLoaderToDisappear(40000);
            // cy.focused().as("focusedElement");
            cy.get("[col-id='businessAreaDef1.id']").eq(1).as("focusedElement");
            cy.get("@focusedElement")
              .dblclick({ force: true })
              .then(() => {
                // Ensure dropdown remains open after double-click
                this.selectBAC();
              });
            break;
        }
        cy.get(locators.general.gridName).eq(0).click();
        cy.get(locators.administration.businessArea.gridType)
          .first()
          .dblclick();
        cy.get(locators.administration.businessArea.selectedType)
          .contains(dataFile[sectionName][category].typeName)
          .click();
      }
    });
  }
  /**
   * Updates a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {String} isCustomerSpace Whether it is updating from customer space
   */
  updateBA(
    sectionName,
    category,
    isBusinessDefinition = false,
    isCustomerSpace = false
  ) {
    cy.get(locators.general.gridName, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .should("have.length", 1)
      .dblclick();
    this.submitBARecord(
      sectionName,
      category,
      false,
      isBusinessDefinition,
      isCustomerSpace
    );
  }

  /**
   * Toggles the status of a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   */
  toggleStatus(sectionName, category) {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get(locators.administration.businessArea.businessAreaGrid).should(
        "have.length",
        1
      );
      cy.wait(1000); //atleast 1 s wait is required here it was'nt opening the status dropdown
      cy.get(locators.administration.businessArea.dropCell).dblclick({
        force: true,
      });
      cy.get(locators.administration.businessArea.selectStatus)
        .contains(dataFile[sectionName][category].status)
        .click();
      cy.waitForTopMsgLoaderToDisappear(50000);
    });
  }

  /**
   * Searches for a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   */
  searchBA(sectionName, category) {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get(locators.administration.businessArea.nameFilterInput, {
        timeout: Cypress.env("waits").mediumWait,
      })
        .clear()
        .type(`${dataFile[sectionName][category].name}{enter}`, { delay: 200 });
      cy.get(locators.administration.businessArea.businessAreaGrid).should(
        "have.length",
        1
      );
    });
  }

  /**
   * Adds a name to a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isDuplicate - Whether the record is a duplicate.
   */
  addBAName(sectionName, category, isDuplicate) {
    cy.readFile(testDataString).then((dataFile) => {
      if (!isDuplicate) {
        const name =
          dataFile[sectionName][category].baseName +
          dayjs().format("YYYY-MM-DD HH:mm:ss");
        cy.get(locators.general.textAreaNameDescription)
          .focus()
          .as("nameField");
        cy.get("@nameField").clear().type(name).tab();
        dataFile[sectionName][category].name = name;
        cy.writeFile(testDataString, dataFile);
      } else {
        cy.get(locators.general.textAreaNameDescription)
          .focus()
          .as("nameField");
        cy.get("@nameField")
          .clear()
          .type(dataFile[sectionName][category].name)
          .tab();
      }
    });
  }

  /**
   * Adds a description to a business area.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isDuplicate - Whether the record is a duplicate.
   */
  addBADescription(sectionName, category, isDuplicate) {
    !isDuplicate
      ? cy
          .get(locators.general.gridDescription)
          .should("have.length", 2)
          .eq(1)
          .dblclick({ force: true })
      : cy
          .get(locators.general.gridDescription)
          .should("have.length", 3)
          .eq(1)
          .dblclick({ force: true });

    cy.readFile(testDataString).then((dataFile) => {
      const description = dataFile[sectionName][category].description;
      if (description) {
        cy.switchToIframe(
          locators.administration.businessArea.descriptionBoxIframe
        )
          .find("p", { timeout: Cypress.env("waits").shortWait })
          .clear()
          .type(description);

        cy.get(locators.general.gridName).click({ multiple: true });
      }
    });
  }

  /**
   * Submits a business area record.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isDuplicate - Whether the record is a duplicate.
   * @param {Boolean} isBusinessDefinition - Whether the record is a business definition.
   * @param {Boolean} isCustomerSpace - Whether the record is in Customer Space.
   */
  submitBARecord(
    sectionName,
    category,
    isDuplicate = false,
    isBusinessDefinition = false,
    isCustomerSpace = false,
    isBusinessArea = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      this.addBAName(sectionName, category, isDuplicate);
      //scrolling to select content library that was created in pre-req
      if (sectionName != "updateBA" && isCustomerSpace == false)
        assessment.scrollUntilEnd();
      this.submitBADef(
        sectionName,
        category,
        isBusinessDefinition,
        isCustomerSpace
      );
      this.checkForDuplicate(isDuplicate);
      this.searchBA(sectionName, category);
      this.addBADescription(sectionName, category, isDuplicate);
    });
  }

  /**
   * Verifies a business area record.
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isCustomerSpace - Whether the record is in customer space.
   */
  verifyBARecord(sectionName, category, isCustomerSpace = false) {
    cy.readFile(testDataString).then((dataFile) => {
      const data = dataFile[sectionName][category];
      const record = cy
        .get(locators.administration.businessArea.searchedBACBAD)
        .should("exist")
        .and("contain.text", data.name)
        .and("contain.text", data.description)
        .and("contain.text", data.status);

      if (!isCustomerSpace) {
        record.and("contain.text", data.contentLibrary);
      }
    });
  }

  /**
   * Sorts the business area grid by columns.
   * @param {String} section - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isBusinessDefinition - Whether the record is a business definition.
   * @param {Boolean} isBusinessArea - Wheter the record is a business area.
   */
  sortBA(
    section,
    category,
    isBusinessDefinition = false,
    isBusinessArea = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      let columns = [];
      // these are grid column names for sorting and it will not be changed so i am not adding this in test data file
      !isBusinessDefinition
        ? (columns = ["Created", "Modified"])
        : (columns = [
            "Created",
            "Modified",
            "Business Area Categories 1",
            "Business Area Categories 2",
          ]);

      if (isBusinessArea) {
        columns = [
          "Created",
          "Modified",
          "Business Area Category 1",
          "Business Area Category 2",
          "Business Area Definition",
        ];
      }

      columns.forEach(($columnName) => {
        cy.get(locators.administration.businessArea.createdSort)
          .contains($columnName)
          .click()
          .click();
        cy.get(locators.administration.businessArea.businessAreaGrid).contains(
          dataFile[section][category].name
        );
      });
    });
  }

  /**
   * Searches for a business area by name using a filter.
   * @param {String} section - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Number} filterIndex - The index of the filter to use.
   */
  searchFilterName(section, category, filterIndex) {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get(locators.general.gridFilter)
        .eq(filterIndex)
        .click({ force: true });
      cy.get(locators.administration.businessArea.gridFilterNameSearch)
        .first()
        .clear()
        .type(dataFile[section][category].name, { delay: 250 });
      cy.get(locators.administration.businessArea.businessAreaGrid)
        .should("have.length", 1)
        .contains(dataFile[section][category].name);
    });
  }

  /**
   * Searches for a business area by column filter.
   * @param {String} section - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Number} filterIndex - The index of the filter to use.
   * @param {String} dataKeyFilterSearch - The key to search for in the filter.
   * @param {Boolean} isCustomerSpace - Whether the record is in customer space.
   */
  searchFilterColumn(
    section,
    category,
    filterIndex,
    dataKeyFilterSearch,
    isCustomerSpace = false,
    isBusinessArea = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      cy.get("body").click();
      cy.get(locators.administration.businessArea.gridFilter)
        .eq(filterIndex)
        .click({ force: true });
      cy.get(locators.administration.businessArea.filterStatus)
        .contains("(Select All)")
        .click();
      if (!isCustomerSpace)
        cy.get(locators.administration.businessArea.filterTypeSearch)
          .clear()
          .type(dataFile[section][category][dataKeyFilterSearch])
          .type("{enter}");

      if (dataKeyFilterSearch != "contentLibrary" && !isBusinessArea) {
        cy.get(locators.administration.businessArea.businessAreaGrid).contains(
          dataFile[section]["Business Definition"].name
        );
      } else {
        cy.get(locators.administration.businessArea.businessAreaGrid).contains(
          dataFile[section][category].name
        );
      }

      cy.reload();
      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.waitForLoaderToDisappear("myGrid", 50000);
    });
  }

  /**
   * Verifies the selection of a business area category (BAC).
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isInActive - Whether the BAC is inactive.
   * @param {Boolean} isCustomerSpace - Whether the record is in customer space.
   */
  verifyBACSelection(
    sectionName,
    category,
    isInActive = false,
    isCustomerSpace = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      this.addBAName(sectionName, category);
      if (!isCustomerSpace) {
        assessment.scrollUntilEnd();
        cy.get("body").tab();
        cy.waitForTopMsgLoaderToDisappear(30000);
        cy.focused().should("exist").dblclick({ force: true });
      } else {
        this.searchBA(sectionName, category);
        cy.get("[col-id='businessAreaDef1.id']")
          .eq(1)
          .dblclick({ force: true });
      }
      this.selectBAC();
      if (isInActive) {
        cy.verifyToastMessageText(
          dataFile.toastMsgs.inActiveBACError,
          Cypress.env("waits").mediumWait
        );
      }
    });
  }

  /**
   * Verifies the selection of a business area definition (BAD).
   * @param {String} sectionName - The section name from the test data.
   * @param {String} category - The category name from the test data.
   * @param {Boolean} isInActive - Whether the BAD is inactive.
   */
  verifyBADSelection(
    sectionName,
    category,
    isInActive = false,
    isBusinessDefinition = false
  ) {
    cy.readFile(testDataString).then((dataFile) => {
      this.addBAName(sectionName, category);
      cy.get("[col-id='organizationUnitBu.id']")
        .eq(1)
        .dblclick()
        .then(() => {
          cy.get(locators.administration.businessArea.selectedType)
            .contains(dataFile[sectionName][category].orgHierarchy)
            .click();
          cy.get("body").tab();
          cy.waitForTopMsgLoaderToDisappear(30000);
          cy.focused().should("exist").dblclick({ force: true });
        });
      cy.get(locators.administration.businessArea.selectedType)
        .contains(dataFile[sectionName][category].typeName)
        .click();
      //open BAC-1 dropdown
      const columns = ["businessAreaCat1.id", "businessAreaCat2.id"];
      if (isBusinessDefinition) {
        columns.forEach((colId) => {
          cy.waitForTopMsgLoaderToDisappear(9000);
          cy.get(`[col-id='${colId}']`)
            .eq(1)
            .should("be.visible")
            .dblclick({ force: true })
            .then(() => {
              assessment.scrollUntilEnd();
            });
        });
      }
      cy.get(locators.administration.toastMsg).click({
        multiple: true,
        force: true,
      });
      cy.waitForToastMessageToDisappear(10000);
      cy.get("body").tab().dblclick({ force: true });
      cy.get("[col-id='businessAreaDef.id']")
        .eq(1)
        .dblclick()
        .then(($elem) => {
          cy.wrap($elem)
            .clear()
            .type(
              `-${dataFile.updateBA["BAC-1"]["name"]}-${dataFile.updateBA["BAC-2"]["name"]}-${dataFile.updateBA["Business Definition"]["name"]}{enter}`
            );
        });
      if (isInActive && isBusinessDefinition) {
        cy.verifyToastMessageText(
          dataFile.toastMsgs.inAciveBusinessDefError,
          Cypress.env("waits").mediumWait
        );
      } else if (!isInActive) {
        cy.verifyToastMessageText(
          dataFile.toastMsgs.savedRecord,
          Cypress.env("waits").mediumWait
        );
        this.searchBA(sectionName, category);
        //adding Description in Business Areas
        cy.get("[col-id='description']").eq(1).dblclick();
        this.addBADescription(sectionName, category, false);
      }
    });
  }

  /**
   * Double-clicks on the grid name element in the UI.
   * Waits for the element to be present with a medium timeout as specified in Cypress environment variables.
   * Ensures that exactly one matching element is found before performing the double-click action.
   */
  clickGridName() {
    cy.get(locators.general.gridName, {
      timeout: Cypress.env("waits").mediumWait,
    })
      .should("have.length", 1)
      .dblclick();
  }
  /**
   * Selects a business area category (BAC).
   *
   */
  selectBAC() {
    for (let i = 0; i < 2; i++) {
      assessment.scrollUntilEnd();
      cy.get("body").tab();
      cy.waitForTopMsgLoaderToDisappear(10000);
      cy.focused().should("exist").dblclick({ force: true });
    }
  }

  //<<<<<<<<<<<======= IMPORT Functions =======>>>>>>>>>>>>>>>>>>********************************************

  /**
   * Opens the import modal by clicking the three ellipses and selecting the Import option.
   * Verifies that the import modal is visible.
   * @param {string} importModalId - The selector for the import modal.
   */
  openImportModal(importModalId) {
    //click on three elipses and verify that import option is visible and click on it
    cy.get(locators.general.threeElipses).click();
    cy.get(locators.general.importBtn)
      .parent()
      .contains("span", "Import")
      .click();
    //verifying that when import button is clicked modal is opened and visible
    cy.get(importModalId).should("be.visible");
  }

  /**
   * Checks for the presence of a download file link in the import modal and verifies the file is downloaded.
   * @param {string} downloadLocator - The selector for the download link.
   * @param {string} downloadString - The text of the download link.
   * @param {string} downloadedFile - The expected downloaded file name.
   */
  checkForDownloadFileLink(downloadLocator, downloadString, downloadedFile) {
    // verify that "Download File" hyper link is visible in import modal and file is downloading when user clicks on it
    cy.get(downloadLocator)
      .contains(downloadString)
      .click({ force: true, delay: 500 });
    cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").longWait);

    // verify that the file is downloaded in the downloads folder with the correct name
    cy.readFile(`cypress/downloads/${downloadedFile}`).should("exist");
  }

  /**
   * Uploads a file in the import modal and verifies the file format.
   * Handles both valid and invalid file format scenarios.
   * @param {string} fileToUpload - The file to upload.
   * @param {string} importModalLocator - The selector for the import modal.
   * @param {string} importSubmitButton - The selector for the import submit button.
   * @param {string} invalidUploadedFileColor - The color indicating an invalid file.
   */
  uploadFileImportModal(
    fileToUpload,
    importModalLocator,
    importSubmitButton,
    invalidUploadedFileColor
  ) {
    contentLibrary.uploadFile(fileToUpload);

    cy.get(importModalLocator)
      .contains("Upload File")
      .then(($btn) => {
        const color = $btn.css("color");
        if (color === invalidUploadedFileColor) {
          // If the button has the color #f4516c, it means the file is in the wrong format
          expect(color).to.equal(invalidUploadedFileColor);
          cy.get(importSubmitButton)
            .contains("Import")
            .should("not.be.visible");
        } else {
          // If the button does not have the color #f4516c, it means the file is in the correct format
          expect(color).to.not.equal(invalidUploadedFileColor);
          //clicking on import btn
          cy.get(importSubmitButton)
            .contains("Import")
            .should("be.visible")
            .dblclick();
          cy.get(locators.administration.toastMsg, {
            timeout: Cypress.env("waits").longWait,
          }).should("be.visible");
        }
      });
  }

  /**
   * Checks for the expected import status in the job queue, retrying if necessary.
   * @param {string} expectedStatus - The status text to look for.
   * @param {number} maxRetries - Maximum number of retries.
   * @param {number} retryDelay - Delay between retries in milliseconds.
   */
  checkForImportStatus(expectedStatus, maxRetries = 50, retryDelay = 200) {
    const checkStatus = (retriesLeft) => {
      cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
      cy.get(locators.administration.businessArea.jobQueStatus)
        .eq(1)
        .should("be.visible")
        .invoke("text")
        .then((statusText) => {
          cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
          if (statusText.includes(expectedStatus)) {
            // Status found, test passes
            expect(statusText).to.include(expectedStatus);
          } else if (retriesLeft > 0) {
            cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
            // Click refresh and retry after delay
            cy.get(locators.administration.businessArea.jobQueReferesh).click();
            cy.wait(retryDelay);
            checkStatus(retriesLeft - 1);
          } else {
            // Max retries reached, fail the test
            throw new Error(
              `Status "${expectedStatus}" not found after maximum retries.`
            );
          }
        });
    };
    checkStatus(maxRetries);
  }

  /**
   * Adds randomized user data to the import JSON file and uploads a valid file.
   * @param {boolean} validFormatFile - Whether to use a valid format file.
   */
  addUsersDataImportJson(validFormatFile) {
    cy.readFile(qbImport)
      .then(($json) => {
        cy.createRandomString(8).then(($el) => {
          $json["Business Area Category 1"][0]["Name*"] =
            "test import BAC-1 " + $el;
          $json["Business Area Category 2"][0]["Name*"] =
            "test import BAC-2 " + $el;
          $json["Business Area Definition"][0]["Name*"] =
            "test import BA Definition " + $el;
          cy.writeFile(qbImport, $json);
        });
      })
      .then(() => {
        cy.readFile(qbImport).then(($json) => {
          kxiPom.convertXlsxtoJson($json, false, false);
          this.uploadValidFile(validFormatFile);
        });
      });
  }

  /**
   * Uploads a valid file for import and submits the import form.
   * @param {boolean} validFormatFile - Whether to use a valid format file.
   */
  uploadValidFile(validFormatFile) {
    const filePath = validFormatFile
      ? "cypress/downloads/importFile.xlsx"
      : "cypress/downloads/importFile.csv";
    cy.get(locators.general.importChooseFile).selectFile(filePath);
    cy.get(locators.administration.businessArea.importSubmitBtn).click();
    cy.waitForElementToVisible(
      locators.administration.toastMsg,
      Cypress.env("waits").mediumWait
    );
  }

  /**
   * Writes the imported name from the import JSON file to the data file.
   */
  writeImportNameToDataFile() {
    cy.readFile(qbImport).then((file) => {
      cy.readAndWriteData(
        "BusinessArea Import",
        file["Business Area Definition"][0]["Name*"],
      );
    });
  }
}
