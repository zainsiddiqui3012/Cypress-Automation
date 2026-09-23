import contentLibraryTestData from "../../../fixtures/Administration/ContentLibrary.json";
import Assessment from "./Assessment";
import ContentSource from "./ContentSource";
import qbTestData from "../../../fixtures/Administration/QuestionBank/QuestionBank.json";
import templateTestData from "../../../fixtures/Administration/Template/Template.json";
const contentLibraryString = `cypress/fixtures/Administration/ContentLibrary.json`;
import locators from "../../../fixtures/locators.json";

const assessment = new Assessment();
const contentSource = new ContentSource();
class ContentLibrary {
  waits= Cypress.env("waits");
  /**
   * Searches for a content library by name.
   * @param {string} contentLibraryName - The name of the content library to search for.
   */
  searchContentLibrary(contentLibraryName) {
    cy.get(locators.general.searchTextField)
      .eq(0)
      .dblclick({ force: true })
      .wait(1000)
      .clear()
      .type(contentLibraryName)
      .type("{enter}");

    cy.get(locators.administration.contentSource.contentSourceGrid)
      .should("have.length", 1)
      .contains(contentLibraryName);
  }

  /**
   * Selects a content source from the dropdown.
   * @param {boolean} multipleContentSource - Whether to scroll until the end for multiple content sources.
   */
  selectContentSource(multipleContentSource = false) {
    cy.get(
      locators.administration.contentSource.selectContentSourceDropdown
    ).dblclick();
    assessment.scrollUntilEnd(multipleContentSource);
  }

  /**
   * Adds a content library name.
   * @param {string} contentLibraryName - The name of the content library to add.
   */
  addContentLibraryName(contentLibraryName) {
    cy.get(
      locators.administration.contentSource.contentSourceDescriptionTextArea
    )
      .clear()
      .type(contentLibraryName)
      .tab()
      .tab();
  }

  /**
   * Adds a description to the content library.
   * @param {string} updatedDescription - The description to add to the content library.
   */
  addContentLibraryDescription(updatedDescription) {
    if (updatedDescription != "") {
      cy.get(locators.administration.contentSource.contentSourceDescription)
        .should("have.length", 2)
        .eq(1)
        .dblclick({ force: true });

      cy.get(
        locators.administration.contentSource.contentSourceDescriptionTextArea
      )
        .clear()
        .type(updatedDescription)
        .tab();
    }
  }
  /**
   * Updates the content Library with the provided data file.
   */
  updateContentLibrary() {
    cy.waitForLoaderToDisappear("myGrid", this.waits.longWait);
    cy.readFile(contentLibraryString).then(($file) => {
      // //search the content library in search text box
      this.searchContentLibrary($file.contentLibraryName);

      //updating the name, description of the content library
      //type library name in grid.
      cy.get(locators.administration.contentSource.contentSourceName)
        .eq(1)
        .wait(900)
        .dblclick();
      cy.createRandomString(6).then(($el) => {
        const updatedName = $file.updateBaseContentLibraryName + " " + $el;
        this.addContentLibraryName(updatedName);
        this.addContentLibraryDescription($file.updatedDescription);

        this.selectContentSource(true);

        this.selectContentSource();
        $file.contentLibraryName =
          $file.updateBaseContentLibraryName + " " + $el;
        cy.writeFile(contentLibraryString, $file);
        cy.readAndWriteData(
          "Content Library Update",
          $file.updateBaseContentLibraryName + " " + $el
        );
      });
    });
  }

  /**
   * Toggles the status buttons based on the active status in the test data.
   */
  toggleBtns() {
    cy.get(locators.administration.contentSource.contentSourceGrid)
      .contains("Active")
      .dblclick();

    contentLibraryTestData.active
      ? cy
          .get(locators.administration.contentSource.contentSourceStatus)
          .contains("Active")
          .click()
      : cy
          .get(locators.administration.contentSource.contentSourceStatus)
          .contains("Inactive")
          .click();
  }

  /**
   * Searches for a content Library using a filter Description.
   * @param {number} tabIndex - The index of the tab to select.
   * @param {string} fileName - The name of the file to read data from.
   * @param {string} valueName - The name of the value to search for.
   */
  searchWithFilterDescription() {
    cy.readFile(contentLibraryString).then((dataFile) => {
      cy.get(locators.administration.contentSource.filterIcon).eq(7).click();
      cy.get(locators.administration.contentSource.filterSearch)
        .clear()
        .type(dataFile.updatedDescription, { delay: 250 });
      cy.get(locators.administration.contentSource.contentSourceGrid).should(
        "have.length.greaterThan",
        0
      );
    });
  }

  /**
   * Searches for a content Library using a filter status.
   * @param {number} tabIndex - The index of the tab to select.
   * @param {string} fileName - The name of the file to read data from.
   * @param {string} valueName - The name of the value to search for.
   */
  searchWithFilterStatus() {
    cy.reload();
    cy.readFile(contentLibraryString).then((dataFile) => {
      cy.get(locators.administration.contentSource.statusFilter).eq(-1).click();
      cy.get(locators.administration.contentSource.statusFilterSearch)
        .clear()
        .type(dataFile.unSelectStatusFilter, { delay: 250 });

      cy.get(locators.administration.contentSource.statusFilterSearchResult)
        .contains(dataFile.unSelectStatusFilter)
        .click();

      cy.get(locators.administration.contentSource.statusFilterSearchResult)
        .contains(dataFile.unSelectStatusFilter)
        .should("not.be.checked");

      //closing the status filter
      cy.get(locators.administration.contentSource.statusFilter).eq(-1).click();
    });
  }

  /**
   * ***************************************************************************************************************************************************
   * ************************************<========  Below section is for import use cases ==========>******************************************************
   * ***************************************************************************************************************************************************
   */

  openImportModal(qb=false) {
    //click on three elipses and verify that import option is visible and click on it
    cy.get(locators.general.threeElipses)
    .eq(0)
    .click();
    cy.get(locators.general.importBtn)
      .parent()
      .contains("span", "Import")
      .click();
    //verifying that when import button is clicked modal is opened and visible
    const importModal=
    qb
    ? "#importAssessmentForm"
    : locators.administration.contentLibrary.importModal
    cy.get(importModal).should(
      "be.visible"
    );
  }

  closeImportModal(qb=false) {
    const closeBtn=
    qb
    ? ".btn-default"+':contains(Cancel)'
    : locators.general.closeFilterBtn
    cy.get(closeBtn,{timeout:Cypress.env("waits").mediumWait}).wait(500).click({force:true, multiple:true}).click({force:true, multiple:true});
  }

  /**
   * Verifies the presence and functionality of the "Download File" link in the import modal.
   * Checks that the link is visible, triggers a file download, and asserts the file exists in the downloads folder.
   *
   * @param {boolean} [qb=false] - Set to true if verifying for Question Bank context.
   * @param {boolean} [assessment=false] - Set to true if verifying for Assessment context.
   * @param {boolean} [isCustomerSpace=false] - Set to true if verifying in a customer space context.
   */
  checkForDownloadFileLink(qb=false, assessment=false, isCustomerSpace=false) {
    // verify that "Download File" hyper link is visible in import modal and file is downloading when user clicks on it
    let downloadLocator, downloadString;
    if (qb || assessment) {
      downloadLocator = locators.administration.QB.importModal;
      downloadString = "Download Sample File";
    } else {
      downloadLocator = locators.administration.contentLibrary.SampledownloadFile;
      downloadString = "Download File";
    }

    cy.get(downloadLocator)
      .contains(downloadString)
      .click({force:true, delay:500});
    cy.waitForTopMsgLoaderToDisappear(this.waits.longWait);

    // verify that the file is downloaded in the downloads folder with the correct name
    const downloadedFile = qb && !isCustomerSpace
      ? qbTestData.downloadFileName
      : qb && isCustomerSpace
      ? qbTestData.downloadFileNameCustomer
      : assessment && !isCustomerSpace
      ? templateTestData.downloadFileName
      : assessment && isCustomerSpace
      ? templateTestData.downloadFileNameCustomerSpace
      : contentLibraryTestData.downloadFileName;
    cy.readFile(
      `cypress/downloads/${downloadedFile}`
    ).should("exist");
  }

  uploadFile(fileToUpload) {
    cy.get(locators.administration.contentLibrary.uploadFileBtn).selectFile(
      `cypress/SampleUploadFiles/${fileToUpload}`
    );
  }

  uploadFileImportModal(fileToUpload, qb=false, assessment=false) {
    this.uploadFile(fileToUpload);
    let importModal, importSubmitButton;
    if(qb)
    {
      importModal = locators.administration.QB.importModal;
      importSubmitButton= locators.administration.QB.importUploadFileBtn
    }
    else if(assessment){
      importModal = locators.administration.QB.importModal
      importSubmitButton= locators.administration.template.submitImportModal
    }
    else{
      importModal= locators.administration.contentLibrary.importModal;
      importSubmitButton= locators.administration.contentLibrary.importUploadFileBtn
    }

    cy.get(importModal)
      .contains("Upload File")
      .then(($btn) => {
        const color = $btn.css("color");
        if (color === contentLibraryTestData.invalidUploadedFileColor) {
          // If the button has the color #f4516c, it means the file is in the wrong format
          expect(color).to.equal(
            contentLibraryTestData.invalidUploadedFileColor
          );
          cy.get(importSubmitButton)
            .contains("Import")
            .should("not.be.visible");
        } else {
          // If the button does not have the color #f4516c, it means the file is in the correct format
          expect(color).to.not.equal(
            contentLibraryTestData.invalidUploadedFileColor
          );
          //clicking on import btn
          cy.get(importSubmitButton)
            .contains("Import")
            .should("be.visible")
            .dblclick();
          cy.verifyToastMessageText(
            contentLibraryTestData.validImportSuccessMsg,
            this.waits.longWait
          );
        }
      });
  }
}
export default ContentLibrary;
