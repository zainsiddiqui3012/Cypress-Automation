import locators from "../../../../fixtures/locators.json";
import MyDocumentsHelpers from "./../helpers/MyDocumentsHelper";
import companyDocLocators from "../../../../fixtures/DMS/CompanyDocument/CompanyDocument.json";
const path = require("path");
import { should } from "chai";
import { time } from "console";

const helpers = new MyDocumentsHelpers();
const loc = locators.myDocuments;
const companyDocData = companyDocLocators.testData;

class CompanyDocument {
  /**
   * Constructor - Initializes the CompanyDocument page object
   * @description Sets up locators for Company Documents module from fixtures
   */
  constructor() {
    this.locators = locators.companyDocuments;
  }

  /**
  
   */
  fillAndSendForApprovalModal({
    assignTo,
    expiryNote,
    message,
    submit = true,
  }) {
    this.withinDmsFrame(() => {
      // Ensure modal body is visible
      cy.get(".modal-body", { timeout: 20000 }).should("be.visible");

      cy.get(this.locators.editCompanyDocuments.assignToDraft, {
        timeout: 30000,
      }).select(assignTo, { force: true });

      // Wait for results to load
      cy.wait(500);

      // Expiry date: type if provided, otherwise pick tomorrow via datepicker helper
      this.selectTomorrowDate(
        this.locators.editCompanyDocuments.sendForApproval.expireOn
      );

      cy.get(this.locators.editCompanyDocuments.sendForApproval.expiryNote, {
        timeout: 10000,
      })
        .should("be.visible")
        .clear({ force: true })
        .type(expiryNote, { delay: 20, force: true });

      // Message (optional)

      cy.get(this.locators.editCompanyDocuments.sendForApproval.message, {
        timeout: 10000,
      })
        .should("be.visible")
        .clear({ force: true })
        .type(message, { delay: 20, force: true });

      if (submit) {
        // Click Send button
        cy.get(this.locators.editCompanyDocuments.sendForApproval.applyBtn, {
          timeout: 15000,
        })
          .should("be.visible")
          .click({ force: true });
      }
    });
  }
  /**
   * Helper method to execute code within DMS iframe context
   * @description Wraps the callback execution within cy.get("@dmsFrame").within()
   * @param {Function} callback - The callback function to execute within iframe context
   * @returns {void}
   */
  withinDmsFrame(callback) {
    cy.get("@dmsFrame", { timeout: 100000 }).within(callback);
  }

  uploadFile(filePath) {
    helpers.clickAddButton();
    helpers.uploadFile(filePath);
  }

  applyWorkflow(status, assignee, errorMessage = false) {
    this.clickApplyWorkflow();
    this.selectWorkflow(status);
    if (errorMessage === true) {
    } else {
      this.selectAssignee(assignee, status);
      // Only set expiry date for Approval workflow
      // Acknowledgement workflow may not require expiry date
      if (status !== "Acknowledgement") {
        this.selectTomorrowDate(this.locators.workflowSection.expireOnApproval);
      } else {
        this.selectTomorrowDate(this.locators.workflowSection.expireOns);
      }
    }
  }

  applyWorkflowForAcknowledgement(status, assignee) {
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.workflowSection.workProcessDropdown, {
        timeout: 10000,
      })
        .scrollIntoView()
        .select(status, { force: true });
    });

    this.selectAssigneeForInitiateWorkflow(assignee);

    this.selectTomorrowDate(this.locators.workflowSection.expireOn);
    this.applyWorkflowButton();
  }

  applyWorkflowButton() {
    cy.get("@dmsFrame").within(() => {
      cy.get(loc.uploadModal.applyWorkflowButton).should("be.visible").click();
    });
  }

  /**
   * Wait for the AG-Grid to fully load and render
   * @description Ensures the grid container is not empty before proceeding with any operations
   * @returns {void}
   */
  waitForGridLoad() {
    cy.get(this.locators.grid.container, { timeout: 100000 }).should(
      "not.be.empty"
    );
  }

  /**
   * Find folder by name in the left pinned container
   * @description Searches for a folder in the AG-Grid's left pinned container (where folder names are displayed)
   * @param {string} folderName - Name of the folder to find
   * @returns {Cypress.Chainable} Cypress chainable containing the folder row element
   * @internal Used internally by other methods, not directly called from tests
   */
  findFolderByName(folderName) {
    return cy
      .get(this.locators.grid.leftPinnedContainer)
      .find(this.locators.grid.folderName)
      .contains(folderName)
      .parents(this.locators.grid.folderRow);
  }

  /**
   * Expand parent folder by double-clicking
   * @description Double-clicks on a folder to expand it within the DMS iframe context
   * @param {string} folderName - Name of the folder to expand
   * @returns {void}
   * @internal Used internally by expandFolder method
   */
  expandParentFolder(folderName) {
    this.withinDmsFrame(() => {
      cy.contains(folderName)
        .scrollIntoView()
        .dblclick({ delay: 1000, force: true });

      cy.get(this.locators.grid.documentLink, { timeout: 30000 }).should(
        "be.visible"
      );
    });
  }

  /**
   * Switch to DMS iframe context
   * @description Switches Cypress execution context to the DMS iframe using helper method
   * @returns {void}
   * @internal Used internally by multiple methods that need iframe context
   */
  switchToIframe() {
    helpers.switchToIframe();
  }
  /**
   * Remove a file by name
   * @description Navigates to My Company Documents, switches to iframe context, searches for the file by name, and removes it
   * @param {string} fileName - Name of the file to remove
   * @returns {void}
   */
  removeFile(fileName) {
    cy.visitMyCompanyDocument();
    this.switchToIframe();
    this.searchInGrid(fileName);
    this.removeCreatedFile();
  }

  /**
   * Expand folder in the grid
   * @description Expands a folder by switching to iframe context and double-clicking the folder
   * @param {string} folderName - Name of the folder to expand
   * @returns {void}
   * @used Test: Tag, Rename, Access Settings, Download
   */
  expandFolder(folderName) {
    this.switchToIframe();
    this.expandParentFolder(folderName);
  }

  /**
   * Click the three-dot menu (ellipsis) at a specific index after expansion
   * @description Clicks the ellipsis icon at the specified index with force click
   * @param {number} index - Index of the ellipsis button to click
   * @returns {void}
   * @internal Used internally by clickHierarchyThreeEllipses
   */
  clickExpandedThreeEllipses(index) {
    cy.get(locators.general.threeElipses, { timeout: 10000 })
      .eq(index)
      .should("be.visible")
      .click({ force: true });
  }

  /**
   * Click three-dot menu in expanded hierarchy view
   * @description Waits for grid expansion and clicks ellipsis in hierarchy context
   * @param {number} index - Index of the ellipsis button to verify visibility
   * @param {number} heirarchyIndex - Index of the ellipsis button to click in hierarchy
   * @returns {void}
   * @used Test: Tag uploaded file
   */
  clickHierarchyThreeEllipses(index, heirarchyIndex) {
    this.withinDmsFrame(() => {
      cy.get(locators.general.threeElipses).eq(index).should("be.visible");
      cy.wait(2000); // wait for grid to expand
      this.clickExpandedThreeEllipses(heirarchyIndex);
    });
  }

  /**
   * Click three-dot menu (ellipsis) at specific index
   * @description Switches to iframe and clicks the ellipsis button at the specified index
   * @param {number} index - Index of the ellipsis button to click (0-based)
   * @returns {void}
   * @used Tests: Create folder, Rename, Access Settings, Download
   */
  clickThreeEllipses(index) {
    this.switchToIframe();
    this.withinDmsFrame(() => {
      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.get(locators.general.threeElipses)
        .eq(index)
        .should("be.visible", { timeout: 10000 })
        .click();
      cy.wait(3000); // wait for grid to expand
    });
  }

  /**
   * Click three-dot menu button
   * @description Wrapper method that calls clickThreeEllipses
   * @param {number} index - Index of the ellipsis button to click
   * @returns {void}
   * @internal Used internally by createFolder and removeCreatedFolder
   */
  clickThreeDotMenu(index) {
    this.clickThreeEllipses(index);
  }

  /**
   * Remove the created test folder
   * @description Clicks delete option from three-dot menu and confirms deletion using delete folder button
   * @returns {void}
   * @used Test: Create folder (cleanup)
   */
  removeCreatedFolder() {
    this.clickThreeEllipses(1);
    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.delete).should("be.visible").click();
      cy.get(this.locators.actions.deleteFolderButton)
        .eq(0)
        .should("be.visible")
        .click();
    });
  }

  /**
   * Remove the created test folder
   * @description Clicks delete option from three-dot menu and confirms deletion
   * @returns {void}
   * @used Test: Create folder (cleanup)
   */
  removeCreatedFile(index = 1) {
    this.clickThreeEllipses(index);
    this.withinDmsFrame(() => {
      cy.get(loc.itemActions.delete).should("be.visible").click();
      cy.get(this.locators.actions.deleteFile)
        .eq(0)
        .should("be.visible")
        .click();
    });
  }

  /**
   * Verify that the created folder exists in grid
   * @description Searches for the newly created folder and verifies it's visible
   * @returns {void}
   * @used Test: Create folder
   */
  verifyCreatedFolder() {
    this.searchInGrid(companyDocData.testScenarios.createFolder.newFolderName);
    this.withinDmsFrame(() => {
      cy.contains(
        companyDocData.testScenarios.createFolder.newFolderName
      ).should("be.visible");
    });
  }

  /**
   * Create a new folder via three-dot menu
   * @description Opens create folder modal, enters folder details, creates the folder, and dismisses toast notification
   * @param {string} [option="Create Folder"] - The menu option text to select (default: "Create Folder")
   * @returns {void}
   * @used Test: Create folder
   */
  createFolder() {
    this.clickThreeDotMenu(0);
    this.selectFromThreeDotMenu(
      companyDocData.option.createFolder,
      this.locators.createFolderModal.createFolder
    );

    cy.get("@dmsFrame").within(() => {
      // Enter folder name
      cy.get(this.locators.createFolderModal.folderNameInput)
        .dblclick()
        .clear()
        .dblclick()
        .type(companyDocData.testScenarios.createFolder.newFolderName, {
          delay: 100,
        });

      // Add description
      cy.get(this.locators.createFolderModal.descriptionInput)
        .clear()
        .type(companyDocData.testScenarios.createFolder.description, {
          delay: 100,
        });

      // Click create button
      cy.get(this.locators.createFolderModal.createButton).click();
      cy.get(locators.administration.toastMsg).click({
        multiple: true,
        force: true,
      });
    });
  }

  /**
   * Select option from three-dot dropdown menu
   * @description Clicks on a menu option from the three-dot dropdown within iframe context
   * @param {string} option - Option text to click (e.g., 'Create Folder', 'Rename', 'Access Settings')
   * @param {string} loc - Locator selector for the menu option
   * @returns {void}
   * @internal Used internally by createFolder, renameDocument, accessSettings, downloadFile
   */
  selectFromThreeDotMenu(option, loc) {
    cy.get("@dmsFrame").within(() => {
      cy.get(loc, {
        timeout: 10000,
      })
        .contains(option)
        .click();
    });
  }

  /**
   * Access settings for a document or folder
   * @description Opens access settings modal and verifies it's displayed
   * @param {string} [option="Access Settings"] - The menu option text to select (default: "Access Settings")
   * @returns {void}
   * @used Test: Access Settings
   */
  accessSettings() {
    this.selectFromThreeDotMenu(
      companyDocData.option.accessSettings,
      loc.itemActions.accessSettings
    );
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.accessSettingsModal.accessSettings)
        .contains(
          this.locators.accessSettingsModal.accessSettingsTitle,
          companyDocData.option.accessSettings
        )
        .should("be.visible");
    });
  }

  /**
   * Rename a document via three-dot menu
   * @description Opens rename modal, enters new document name, and saves changes
   * @param {string} [option="Rename"] - The menu option text to select (default: "Rename")
   * @returns {void}
   * @used Test: Rename file
   */
  renameDocument() {
    this.selectFromThreeDotMenu(
      companyDocData.option.Rename,
      loc.itemActions.rename
    );

    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.renameModal.documentNameInput, {
        timeout: 10000,
      })
        .should("be.visible")
        .dblclick()
        .clear({ force: true })
        .type(companyDocData.testScenarios.renameDocument.newFileName, {
          delay: 80,
        })
        .should(
          "have.value",
          companyDocData.testScenarios.renameDocument.newFileName
        );

      cy.get(this.locators.renameModal.saveDocumentButton)
        .should("be.visible")
        .click();
    });
  }

  /**
   * Verify rename document and revert to original name
   * @description Opens rename modal, verifies current name matches expected renamed value, then reverts to original name
   * @param {string} [option="Rename"] - The menu option text to select (default: "Rename")
   * @param {number} [index=1] - Index of the ellipsis button to click (default: 1)
   * @returns {void}
   * @used Test: Verify and revert document rename
   */
  verifyRenameDocument(index = 1) {
    this.clickThreeEllipses(index);
    this.selectFromThreeDotMenu(
      companyDocData.option.Rename,
      loc.itemActions.rename
    );

    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.renameModal.documentNameInput, {
        timeout: 10000,
      })
        .should(
          "have.value",
          companyDocData.testScenarios.renameDocument.newFileName
        )
        .clear()
        .click()
        .type(companyDocData.testDocument.name, {
          delay: 80,
        });

      cy.get(this.locators.renameModal.saveDocumentButton)
        .should("be.visible")
        .click();
    });
  }

  /**
   * Add tag to a document
   * @description Opens tag modal, types tag name, selects it, and saves
   * @param {string} tagName - Name of the tag to add
   * @returns {void}
   * @used Test: Tag uploaded file
   */
  addTag(tagName) {
    cy.get("@dmsFrame").within(() => {
      cy.get(loc.itemActions.tag).should("be.visible").click();

      cy.get(loc.tagModal.modal).should("be.visible");
      cy.get(loc.tagModal.tagInput)
        .should("be.visible")
        .type(tagName, { delay: 20, force: true });
      cy.get(this.locators.tagModal.selectedTag).click();
      cy.get(this.locators.tagModal.saveButton).should("be.visible").click();
      cy.get(this.locators.tagModal.tagIcon, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  }

  /**
   * Remove tag from a document
   * @description Opens tag modal, removes existing tag, and saves changes
   * @returns {void}
   * @used Test: Tag uploaded file (cleanup)
   */
  removeTag() {
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.tagModal.tagIcon, { timeout: 10000 })
        .should("be.visible")
        .dblclick();
      cy.get(this.locators.tagModal.removeTag).click();
      cy.get(this.locators.tagModal.saveButton).should("be.visible").click();
      cy.get(this.locators.tagModal.tagIcon, { timeout: 10000 }).should(
        "not.be.visible"
      );
    });
  }

  /**
   * Download file via three-dot menu
   * @description Selects download option and verifies file exists in downloads folder
   * @param {string} fileName - Name of the file to verify in downloads folder
   * @returns {void}
   * @used Test: Download file
   */
  downloadFile(fileName) {
    this.selectFromThreeDotMenu(
      companyDocData.option.download,
      loc.itemActions.download
    );
    cy.readFile(`cypress/downloads/${fileName}`).should("exist");
  }

  /**
   * Search for folder/file in the grid
   * @description Opens search box, enters search term, and submits search
   * @param {string} searchTerm - Term to search for in the grid
   * @returns {void}
   * @used Tests: Tag, Create folder verification, Rename, Access Settings, Download
   */
  searchInGrid(searchTerm) {
    this.switchToIframe();
    cy.get("@dmsFrame").within(() => {
      cy.waitForToastMessageToDisappear(100000);
      cy.get(locators.general.searchIcon, { timeout: 60000 })
        .should("be.visible")
        .click({ delay: 300 })
        .then(() => {
          cy.get(locators.general.searchTextBox, { timeout: 10000 })
            .should("be.visible", { timeout: 10000 })
            .clear({ force: true })
            .type(searchTerm + "{enter}");
        });
      cy.get(this.locators.grid.rows, { timeout: 30000 }).should("be.visible");
    });
  }
  searchInTrash(searchTerm, index = 0) {
    this.switchToIframe();
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.searchTextField, { timeout: 30000 })
        .should("be.visible")
        .eq(index)
        .clear({ force: true })
        .type(searchTerm + "{enter}", { force: true });
    });
  }

  closeUploadModal() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.uploadModal.cancelButton, { timeout: 20000 })
        .should("be.visible")
        .click();
    });
  }
  previewDocument(locator) {
    this.withinDmsFrame(() => {
      cy.get(locator, {
        timeout: 50000,
      }).should("be.visible");
    });
  }

  clickApplyWorkflow() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.workflowSection.applyWorkflowCheckbox, {
        timeout: 10000,
      })
        .scrollIntoView()
        .check({ force: true });
    });
  }
  selectWorkflow(status) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.workflowSection.selectworkflowDropdown, {
        timeout: 10000,
      })
        .scrollIntoView()
        .select(status, { force: true });
    });
  }

  selectAssignee(assignee, workflowType = "Approval") {
    this.withinDmsFrame(() => {
      // Use appropriate assignee locator based on workflow type
      const assigneeLocator =
        workflowType === "Acknowledgement"
          ? this.locators.workflowSection.assignToUsers
          : this.locators.workflowSection.assignToUser;

      cy.get(assigneeLocator, {
        timeout: 10000,
      })
        .should("exist")
        .scrollIntoView()
        .select(assignee, { force: true });
    });
  }

  selectAssigneeForInitiateWorkflow(assignee) {
    this.withinDmsFrame(() => {
      // Use appropriate assignee locator based on workflow type
      const assigneeLocator = this.locators.workflowSection.assignToUsers2;

      cy.get(assigneeLocator, {
        timeout: 10000,
      })
        .scrollIntoView()

        .select(assignee, { force: true });
    });
  }

  /**
   * Select tomorrow's date from date picker
   * @description Opens the date picker and selects tomorrow's date, handling month and year changes
   * @param {string} datePickerInput - CSS selector for the date picker input field
   * @returns {void}
   */
  selectTomorrowDate(datePickerInput) {
    this.withinDmsFrame(() => {
      // Calculate tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.getDate();
      const tomorrowMonth = tomorrow.getMonth();
      const tomorrowYear = tomorrow.getFullYear();

      // Click on the date picker input to open it
      cy.get(datePickerInput, { timeout: 10000 })
        .scrollIntoView()
        .should("be.visible")
        .click();

      // Wait for date picker to be visible
      cy.get(".datepicker-days", { timeout: 10000 }).should("be.visible");

      // Check if we need to navigate to next month or year
      cy.get(".datepicker-days .datepicker-switch")
        .invoke("text")
        .then((headerText) => {
          const [displayedMonth, displayedYear] = headerText.split(" ");

          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          const displayedMonthIndex = monthNames.indexOf(displayedMonth);
          const displayedYearNum = parseInt(displayedYear);

          // Check if tomorrow is in the next year or next month
          if (
            tomorrowYear > displayedYearNum ||
            (tomorrowYear === displayedYearNum &&
              tomorrowMonth > displayedMonthIndex)
          ) {
            cy.get(".datepicker-days .next").click();
            cy.wait(500);
          }
        });

      // Select tomorrow's day
      cy.get(".datepicker-days td.day")
        .not(".old")
        .not(".new")
        .contains(new RegExp(`^${tomorrowDay}$`))
        .click();
    });
  }
  /**
   * Click on a file name link in the document grid
   * @description Finds and clicks on a file link by name within the iframe context
   * @param {string} fileName - Name of the file to click
   * @returns {void}
   */
  clickFileName(fileName) {
    cy.wait(2000); // Wait for grid to stabilize
    cy.get("@dmsFrame", { timeout: 30000 }).then(($iframe) => {
      cy.get($iframe)
        .find("a[href='#document-preview']")
        .contains(fileName)
        .should("be.visible")
        .click({ force: true });
    });
  }

  /**
   * Verify file name link in the document grid
   * @description Finds and clicks on a file link by name within the iframe context
   * @param {string} fileName - Name of the file to click
   * @returns {void}
   */
  verifyFileName(fileName) {
    cy.wait(2000); // Wait for grid to stabilize
    cy.get("@dmsFrame", { timeout: 30000 }).then(($iframe) => {
      cy.get($iframe)
        .find("a[href='#document-preview']")
        .contains(fileName)
        .should("be.visible");
    });
  }

  /**
   * Toggle Microsoft Document Viewer checkbox to specific state
   * @description Sets the checkbox to the desired state (checked or unchecked)
   * @param {boolean} shouldCheck - true to check, false to uncheck
   * @returns {void}
   */
  setMicrosoftDocumentViewerState(shouldCheck) {
    cy.get(locators.administration.customerProfile.microsoftDocumentCheckBox, {
      timeout: 10000,
    })
      .scrollIntoView()
      .then(($checkbox) => {
        const isCurrentlyChecked = $checkbox.is(":checked");

        if (shouldCheck) {
          // Want to check
          if (isCurrentlyChecked) {
            cy.log("✓ Microsoft Document Viewer is already enabled (checked)");
          } else {
            cy.log("✓ Enabling Microsoft Document Viewer (checking)");
            cy.wrap($checkbox).check({ force: true });
          }
        } else {
          // Want to uncheck
          if (isCurrentlyChecked) {
            cy.log("✓ Disabling Microsoft Document Viewer (unchecking)");
            cy.wrap($checkbox).uncheck({ force: true });
          } else {
            cy.log(
              "✓ Microsoft Document Viewer is already disabled (unchecked)"
            );
          }
        }
      });

    cy.contains("a", "Save").scrollIntoView().click({ force: true });
  }

  /**
   * Enable Microsoft Document Viewer checkbox
   * @description Checks the checkbox to enable Microsoft Document Viewer
   * @returns {void}
   */
  enableMicrosoftDocumentViewer() {
    this.setMicrosoftDocumentViewerState(true);
  }

  /**
   * Disable Microsoft Document Viewer checkbox
   * @description Unchecks the checkbox to disable Microsoft Document Viewer
   * @returns {void}
   */
  disableMicrosoftDocumentViewer() {
    this.setMicrosoftDocumentViewerState(false);
  }

  /**
   * Toggle Microsoft Document Viewer checkbox
   * @description Toggles the Microsoft Document Viewer checkbox state
   * @param {boolean} enable - true to enable, false to disable
   * @returns {void}
   */
  toggleMicrosoftDocumentViewer(enable) {
    if (enable) {
      this.enableMicrosoftDocumentViewer();
    } else {
      this.disableMicrosoftDocumentViewer();
    }
  }

  /**
   * Assert view icon visibility for a document
   * @description Asserts whether the view (eye) icon is visible or not in the action column
   * @param {boolean} shouldBeVisible - Whether the icon should be visible (default: true)
   * @returns {void}
   */
  assertViewIconVisible(shouldBeVisible = true) {
    this.withinDmsFrame(() => {
      shouldBeVisible
        ? cy
            .get(this.locators.actions.viewIcon, { timeout: 30000 })
            .should("be.visible")
        : cy
            .get(this.locators.actions.viewIcon, { timeout: 30000 })
            .should("not.exist");
    });
  }
  /**
   * Assert view icon visibility for a document on trash
   * @description Asserts whether the view (eye) icon is visible or not in the trash action column
   * @param {boolean} shouldBeVisible - Whether the icon should be visible (default: true)
   * @returns {void}
   */
  assertViewIconVisibleOnTrash(shouldBeVisible = true) {
    this.withinDmsFrame(() => {
      shouldBeVisible
        ? cy
            .get(this.locators.actions.viewIconOnTrash, { timeout: 30000 })
            .should("be.visible")
        : cy
            .get(this.locators.actions.viewIconOnTrash, { timeout: 30000 })
            .should("not.exist");
    });
  }

  /**
   * Click view icon for a document
   * @description Clicks the view (eye) icon to open document preview
   * @param {number} rowIndex - Index of the row to click (0-based, default is 0 for first row)
   * @returns {void}
   */
  clickViewIcon(rowIndex = 0) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.actions.viewIcon, { timeout: 10000 })
        .eq(rowIndex)
        .should("be.visible")
        .click();
    });
  }

  verifyStatus(status) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.grid.statusColumn, { timeout: 10000 })
        .should("be.visible")
        .should("contain.text", status);
    });
  }
  clickActionsDropdown(option = "Take Action") {
    this.clickThreeEllipses(0);
    this.selectFromThreeDotMenu(option, loc.itemActions.takeAction);
  }
  selectTakeActionOption(action) {
    this.withinDmsFrame(() => {
      cy.get(locators.assignToMe.actionDropdown, { timeout: 10000 }).select(
        action,
        { force: true }
      );
    });
  }

  verifyTakeActionOption(options) {
    this.withinDmsFrame(() => {
      cy.get(locators.assignToMe.actionDropdown, { timeout: 10000 }).within(
        () => {
          cy.get("option").contains(options).should("exist");
        }
      );
    });
  }
  enterMessage(message) {
    this.withinDmsFrame(() => {
      cy.get(locators.assignToMe.messageInput, { timeout: 10000 })
        .clear()
        .type(message, { delay: 50 });
    });
  }
  clickSaveButton() {
    this.withinDmsFrame(() => {
      cy.get(locators.assignToMe.saveButton, { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });
    });
  }
  initiateWorkflowForDocument() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.actions.initateWorkflow, {
        timeout: 10000,
      })
        .should("be.visible")
        .click({ force: true });

      cy.get(this.locators.actions.initateWorkflowModal, {
        timeout: 10000,
      })
        .should("be.visible")
        .and("contain.text", "Initiate Workflow");
    });
  }
  validateMessageValidation() {
    this.withinDmsFrame(() => {
      cy.get(locators.assignToMe.messageInput, { timeout: 10000 })
        .parents(".form-group")
        .should("have.class", "has-danger");
    });
  }

  /**
   * Validate workflow process dropdown options by text
   * @description Validates that the workflow process dropdown contains specific options by their text
   * @param {Array<string>} expectedOptionTexts - Array of expected option texts (e.g., ['Acknowledgement', 'Approval'])
   * @returns {void}
   */
  validateWorkflowProcessDropdownOptions(expectedOptionTexts) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.workflowSection.workProcessDropdown, {
        timeout: 10000,
      })
        .scrollIntoView()
        .within(() => {
          cy.get("option").contains(expectedOptionTexts).should("exist");
        });
    });
  }

  /**
   * Validate workflow process dropdown is visible and contains options
   * @description Checks that the dropdown is visible and has at least one option
   * @returns {void}
   */
  validateWorkflowProcessDropdownVisible() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.workflowSection.workProcessDropdown, {
        timeout: 10000,
      })
        .scrollIntoView()
        .should("be.visible")
        .find("option")
        .should("have.length.greaterThan", 0);
    });
  }

  /**
   * Click Version History action for a specific document
   * @description Clicks the Version History button in the actions column for the given row index within the DMS frame.
   * @param {number} [index=0] - Zero-based index of the Version History action to click.
   * @returns {void}
   * @sideEffects Triggers a UI click on the Version History action using Cypress `cy.get().click()` inside `withinDmsFrame`.
   */
  validateWorkflowProcessDropdownValue(expectedValue) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.workflowSection.workProcessDropdown, {
        timeout: 10000,
      })
        .scrollIntoView()
        .should("have.value", expectedValue);
    });
  }

  clickVersionHistory(index = 0) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.actions.versionHistoryIcon, {
        timeout: 10000,
      })
        .should("be.visible")
        .eq(index)
        .click({ force: true });
    });
  }

  /**
   * Validate new version in Version History AG-Grid
   * @description Validates that a new version appears in the version history AG-Grid with expected properties
   * @param {Object} versionData - The expected version data to validate
   * @param {string|number} versionData.versionNumber - Expected version number (e.g., "1.1", "1.0")
   * @param {string} [versionData.name] - Expected document name
   * @param {string} [versionData.status] - Expected status (e.g., "Draft", "Approved")
   * @param {string} [versionData.type] - Expected file type (e.g., "XLSX File", "PDF File")
  
   * @param {string} [versionData.createdDate] - Expected creation date (e.g., "19/Dec/2025 01:19")
   * @param {string} [versionData.updatedBy] - Expected user who updated (e.g., "DMS_User Automation")
   * @param {string} [versionData.updatedOn] - Expected updated date (e.g., "19/Dec/2025 01:19")
   * @param {boolean} [versionData.isCurrent=false] - Whether this is the current version
   * @returns {void}
   * @example
   * companyDocumentsPage.validateNewVersion({
   *   versionNumber: "1.1",
   *   name: "KxI_Definition_Export_KXIPRE_1765882398292",
   *   status: "Draft",
   *   type: "XLSX File",
   *   size: "168.3 KB",
   *   isCurrent: false
   * });
   */
  validateNewVersion(versionData) {
    this.withinDmsFrame(() => {
      // Verify Version History modal/grid is visible
      cy.get(this.locators.versionHistoryGrid.gridContainer, {
        timeout: 100000,
      }).should("be.visible");

      // Find the version row in AG-Grid by version number
      cy.get(this.locators.versionHistoryGrid.versionCell, {
        timeout: 10000,
      }).contains(versionData.versionNumber.toString());

      // Validate version number (col-id="version")
      cy.get(this.locators.versionHistoryGrid.versionCell).should(
        "contain.text",
        versionData.versionNumber.toString()
      );

      // Validate current version indicator
      if (versionData.isCurrent) {
        cy.get(this.locators.versionHistoryGrid.versionCell).should(
          "contain.text",
          "(Current Version)"
        );
      }

      // Validate document name (col-id="displayName")
      if (versionData.name) {
        cy.get(this.locators.versionHistoryGrid.nameCell).should(
          "contain.text",
          versionData.name
        );
      }

      // Validate status (col-id="status")
      if (versionData.status) {
        cy.get(this.locators.versionHistoryGrid.statusCell).should(
          "contain.text",
          versionData.status
        );
      }

      // Validate file type (col-id="mimeDescription")
      if (versionData.type) {
        cy.get(this.locators.versionHistoryGrid.typeCell).should(
          "contain.text",
          versionData.type
        );
      }

      // Validate file size (col-id="readableFileSize")
      if (versionData.size) {
        cy.get(this.locators.versionHistoryGrid.sizeCell).should(
          "contain.text",
          versionData.size
        );
      }

      // Validate created date (col-id="createdOnStr")
      if (versionData.createdDate) {
        cy.get(this.locators.versionHistoryGrid.createdCell).should(
          "contain.text",
          versionData.createdDate
        );
      }

      // Validate updated by (col-id="modifiedBy")
      if (versionData.updatedBy) {
        cy.get(this.locators.versionHistoryGrid.updatedByCell).should(
          "contain.text",
          versionData.updatedBy
        );
      }

      // Validate updated on date (col-id="updatedOnStr")
      if (versionData.updatedOn) {
        cy.get(this.locators.versionHistoryGrid.updatedOnCell).should(
          "contain.text",
          versionData.updatedOn
        );
      }
    });
  }

  /**
   * Validate version exists in Version History AG-Grid
   * @description Validates that a specific version number exists in the version history AG-Grid
   * @param {string|number} versionNumber - Version number to validate (e.g., "1.1", "1.0")
   * @returns {void}
   */
  validateVersionExists(versionNumber) {
    this.withinDmsFrame(() => {
      cy.get(
        `${this.locators.versionHistoryGrid.gridContainer} ${this.locators.versionHistoryGrid.versionCell}`,
        {
          timeout: 10000,
        }
      )
        .contains(versionNumber.toString())
        .should("be.visible");
    });
  }

  /**
   * Validate current version in Version History AG-Grid
   * @description Validates that the current version is marked correctly with "(Current Version)" label
   * @param {string|number} versionNumber - Expected current version number
   * @returns {void}
   */
  validateCurrentVersion(versionNumber) {
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.versionHistoryGrid.versionCell, {
        timeout: 100000,
      })
        .contains(`${versionNumber} (Current Version)`)
        .should("be.visible");
    });
  }

  /**
   * Validate version count in Version History AG-Grid
   * @description Validates the total number of versions in the version history AG-Grid
   * @param {number} expectedCount - Expected number of versions
   * @returns {void}
   */
  validateVersionCount(expectedCount) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, {
        timeout: 100000,
      }).should("have.length", expectedCount);
    });
  }

  /**
   * Close Version History modal
   * @description Closes the Version History modal by clicking the close button
   * @returns {void}
   */
  closeVersionHistoryModal() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.modalCloseButton, {
        timeout: 10000,
      })
        .should("be.visible")
        .click({ force: true });
    });
  }

  /**
   * Validate version status badge in AG-Grid
   * @description Validates the status badge color and text for a specific version
   * @param {string|number} versionNumber - Version number to find
   * @param {string} status - Expected status text (e.g., "Draft", "Approved")
   * @param {string} [badgeClass] - Expected badge class (e.g., "badge-default", "badge-success")
   * @returns {void}
   */
  validateVersionStatusBadge(versionNumber, status, badgeClass = null) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, { timeout: 10000 })
        .contains(
          this.locators.versionHistoryGrid.versionCell,
          versionNumber.toString()
        )
        .parents(".ag-row")
        .within(() => {
          cy.get(this.locators.versionHistoryGrid.statusBadge)
            .should("be.visible")
            .and("contain.text", status);

          if (badgeClass) {
            cy.get(this.locators.versionHistoryGrid.statusBadge).should(
              "have.class",
              badgeClass
            );
          }
        });
    });
  }

  /**
   * Validate version action buttons availability
   * @description Validates which action buttons are available for a specific version
   * @param {string|number} versionNumber - Version number to find
   * @param {Object} actions - Object with action names as keys and boolean visibility as values
   * @param {boolean} [actions.edit] - Edit button should be visible
   * @param {boolean} [actions.sendForApproval] - Send for approval button should be visible
   * @param {boolean} [actions.delete] - Delete button should be visible
   * @returns {void}
   * @example
   * companyDocumentsPage.validateVersionActionButtons("1.1", {
   *   edit: true,
   *   sendForApproval: true,
   *   delete: true
   * });
   */
  validateVersionActionButtons(versionNumber, actions) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, { timeout: 10000 })
        .contains(
          this.locators.versionHistoryGrid.versionCell,
          versionNumber.toString()
        )
        .parents(".ag-row")
        .within(() => {
          const actionsCell = cy.get(
            this.locators.versionHistoryGrid.actionCell
          );

          if (actions.edit !== undefined) {
            actions.edit
              ? actionsCell.find(".fa-edit.webdavEditLink").should("be.visible")
              : actionsCell.find(".fa-edit.webdavEditLink").should("not.exist");
          }

          if (actions.sendForApproval !== undefined) {
            actions.sendForApproval
              ? actionsCell.find(".initWorkflowModal").should("be.visible")
              : actionsCell.find(".initWorkflowModal").should("not.exist");
          }

          if (actions.delete !== undefined) {
            actions.delete
              ? actionsCell.find(".la-trash").should("be.visible")
              : actionsCell.find(".la-trash").should("not.exist");
          }
        });
    });
  }
  /**
   * Click action button for a specific version in Version History grid
   * @description Finds a version row by version number and clicks the specified action button within that row
   * @param {string|number} versionNumber - Version number to find (e.g., "1.1", "1.0")
   * @param {string} actionButtonLocator - CSS selector for the action button to click (e.g., edit, delete, send for approval)
   * @returns {void}
   * @sideEffects Triggers a UI click on the action button using Cypress `cy.get().click()` inside `withinDmsFrame`
   * @internal Used internally by clickEditVersionButton, clickSendForApprovalButton, and clickDeleteVersionButton
   * @example
   * companyDocumentsPage.clickVersionHistoryActionButton("1.1", this.locators.versionHistoryGrid.editButton);
   */
  clickVersionHistoryActionButton(versionNumber, actionButtonLocator) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, { timeout: 10000 })
        .contains(
          this.locators.versionHistoryGrid.versionCell,
          versionNumber.toString()
        )
        .parents(".ag-row")
        .within(() => {
          cy.get(actionButtonLocator)
            .should("be.visible")
            .click({ force: true });
        });
    });
  }

  /**
   * Click edit button for a specific version
   * @description Clicks the edit button (WebDAV Edit) for a specific version in the AG-Grid
   * @param {string|number} versionNumber - Version number to edit
   * @returns {void}
   */
  clickEditVersionButton(versionNumber) {
    this.clickVersionHistoryActionButton(
      versionNumber,
      this.locators.versionHistoryGrid.editButton
    );
  }

  /**
   * Click send for approval button for a specific version
   * @description Clicks the send for approval button for a specific version in the AG-Grid
   * @param {string|number} versionNumber - Version number to send for approval
   * @returns {void}
   */
  clickSendForApprovalButton(versionNumber) {
    this.clickVersionHistoryActionButton(
      versionNumber,
      this.locators.versionHistoryGrid.sendForApprovalButton
    );
  }

  /**
   * Click delete button for a specific version
   * @description Clicks the delete button for a specific version in the AG-Grid
   * @param {string|number} versionNumber - Version number to delete
   * @returns {void}
   */
  clickDeleteVersionButton(versionNumber) {
    this.clickVersionHistoryActionButton(
      versionNumber,
      this.locators.versionHistoryGrid.deleteButton
    );
  }

  /**
   * Validate document name link in version history
   * @description Validates that the document name link is present and clickable for a specific version
   * @param {string|number} versionNumber - Version number to find
   * @param {string} documentName - Expected document name
   * @returns {void}
   */
  validateDocumentNameLink(versionNumber, documentName) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, { timeout: 10000 })
        .contains(
          this.locators.versionHistoryGrid.versionCell,
          versionNumber.toString()
        )
        .parents(".ag-row")
        .within(() => {
          cy.get(this.locators.versionHistoryGrid.documentNameLink)
            .should("be.visible")
            .and("contain.text", documentName);
        });
    });
  }

  /**
   * Click document name to download file
   * @description Clicks the document name link for a specific version and verifies the file is downloaded
   * @param {string|number} versionNumber - Version number whose document link should be clicked
   * @param {string} fileName - Expected downloaded file name
   * @returns {void}
   */
  clickDocumentNameAndVerifyDownload(versionNumber, fileName) {
    const downloadsFolder = Cypress.config("downloadsFolder");
    const downloadPath = path.join(downloadsFolder, fileName);

    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridRow, { timeout: 30000 })
        .contains(
          this.locators.versionHistoryGrid.versionCell,
          versionNumber.toString()
        )
        .parents(".ag-row")
        .as("versionRow");

      cy.get("@versionRow")
        .find(this.locators.versionHistoryGrid.documentNameLink)
        .should("be.visible")
        .scrollIntoView()
        .click({ force: true });
    });

    cy.readFile(downloadPath, { timeout: 20000 }).should("exist");
  }
  /**
   * Validate bookmark option in version history
   * @description Validates that the bookmark button is present in the version history modal
   * @returns {void}
   * @example
   * companyDocumentsPage.validateBookmark();
   */
  validateBookmark() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.bookmarkButton, {
        timeout: 10000,
      }).should("be.visible");
    });
  }

  /**
   * Verify Version History column headers
   * @description Validates that the Version History grid shows the expected column headers
   * @param {Array<string>} expectedColumns - Column titles to verify (order-sensitive)
   * @returns {void}
   * @example
   * companyDocumentsPage.verifyVersionHistoryColumns([
   *   "Version","Name","Status","Description","Type",
   *   "Size","Created","Updated By","Updated On","Action"
   * ]);
   */
  verifyVersionHistoryColumns(expectedColumns = null) {
    this.withinDmsFrame(() => {
      const expected =
        expectedColumns || companyDocData.versionHistory.columnsOrder;

      // Grab header texts from the first header row
      cy.get(this.locators.versionHistoryGrid.headerCellText, {
        timeout: 30000,
      })
        .should("have.length.greaterThan", 0)
        .then(($cells) => {
          const headers = [];
          $cells.each((_, cell) => {
            headers.push(Cypress.$(cell).text().trim());
          });

          // Verify the headers match the expected list (order-sensitive)
          expected.forEach((col, idx) => {
            expect(headers[idx]).to.equal(
              col,
              `Expected column ${idx + 1} to be "${col}", got "${headers[idx]}"`
            );
          });
        });
    });
  }

  /**
   * Click bookmark button and download file from bookmarks
   * @description Clicks the bookmark button, then clicks the bookmarked file link to download it
   * @param {string} fileName - Name of the file to verify in downloads folder
   * @returns {void}
   * @example
   * companyDocumentsPage.clickBookmarkAndDownload("TestXlsx.xlsx");
   */
  clickBookmarkAndDownload(index = 0) {
    // Open Bookmarks modal inside the iframe
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.bookmarkButton, {
        timeout: 100000,
      })
        .should("be.visible")
        .click({ force: true });

      // Click the bookmarked link outside the iframe and verify download
      return cy
        .get(this.locators.versionHistoryGrid.bookmarksLink, { timeout: 30000 })
        .eq(index)
        .should("be.visible")
        .then(($a) => {
          const name = $a.text().trim();
          cy.wrap(name).as("bookmarkedFileName");
          cy.wrap($a).scrollIntoView().click({ force: true });
          const downloadsFolder = "cypress/downloads/";
          const downloadPath = path.join(downloadsFolder, `${name}.xlsx`);
          cy.readFile(downloadPath, { timeout: 30000 }).should("exist");
          return cy.wrap(name);
        });
    });
  }

  /**
   * Get bookmarked file name and click the link
   * @description Opens Bookmarks, captures the displayed file name, clicks the same link, and exposes the name via alias 'bookmarkedFileName'
   * @returns {Cypress.Chainable<string>} Chainable wrapping the captured file name
   * @example
   * companyDocumentsPage.clickBookmarkGetNameAndClick().then((name) => {
   *   // use name if needed
   * });
   */

  /**
   * Click unlock button in version history
   * @description Clicks the unlock button in the version history modal
   * @returns {void}
   * @example
   * companyDocumentsPage.clickUnlockButton();
   */
  clickUnlockButton() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.unlockButton, {
        timeout: 100000,
      })
        .should("be.visible")
        .click();
    });
  }
  /**
   * Click send for approval button in version history
   * @description Clicks the send for approval icon button to initiate approval workflow for the document version
   * @returns {void}
   */
  clickSendForApprovalIconButton() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.sendForApprovalIconButton, {
        timeout: 30000,
      })
        .should("be.visible")
        .click();
    });
  }
  /**
   * Validate action buttons visibility in version history
   * @description Verifies that all action buttons (Edit, Delete, Send for Approval) are visible in the version history grid
   * @returns {void}
   */
  validateActionButton() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.editFileButton, {
        timeout: 10000,
      }).should("be.visible");
      cy.get(this.locators.versionHistoryGrid.deleteFileButton, {
        timeout: 10000,
      }).should("be.visible");
      cy.get(this.locators.versionHistoryGrid.sendForApprovalIconButton, {
        timeout: 10000,
      }).should("be.visible");
    });
  }

  /**
   * Validate Workflow Status modal
   * @description Validates the Workflow Status modal is visible with correct columns and data
   * @param {Object} [options] - Optional validation parameters
   * @param {Array<string>} [options.expectedColumns] - Expected column headers
   * @param {string} [options.recipientName] - Expected recipient name
   * @param {string} [options.status] - Expected status
   * @returns {void}
   * @example
   * companyDocumentsPage.validateWorkflowStatusModal({
   *   recipientName: "DMS_User Automation",
   *   status: "Assigned"
   * });
   */
  validateWorkflowStatusModal(options = {}) {
    this.withinDmsFrame(() => {
      const expectedColumns =
        options.expectedColumns || companyDocData.workflowStatus.columns;

      // Validate modal is visible
      cy.get(this.locators.workflowStatusModal.modal, { timeout: 30000 })
        .should("be.visible")
        .within(() => {
          // Validate modal title
          cy.get(this.locators.workflowStatusModal.title)
            .should("be.visible")
            .and("contain.text", "Workflow Status");

          // Validate AG-Grid is visible
          cy.get(this.locators.workflowStatusModal.grid, {
            timeout: 10000,
          }).should("be.visible");

          // Validate column headers
          cy.get(this.locators.workflowStatusModal.headerCellText, {
            timeout: 10000,
          })
            .should("have.length", expectedColumns.length)
            .then(($cells) => {
              const headers = [];
              $cells.each((_, cell) => {
                headers.push(Cypress.$(cell).text().trim());
              });

              expectedColumns.forEach((col, idx) => {
                expect(headers[idx]).to.equal(
                  col,
                  `Expected column ${idx + 1} to be "${col}", got "${
                    headers[idx]
                  }"`
                );
              });
            });

          // Validate data if provided
          if (options.recipientName) {
            cy.get(this.locators.workflowStatusModal.gridRow)
              .should("be.visible")
              .and("contain.text", options.recipientName);
          }

          if (options.status) {
            cy.get(this.locators.workflowStatusModal.gridRow)
              .should("be.visible")
              .and("contain.text", options.status);
          }

          // Validate Close button
          cy.get(this.locators.workflowStatusModal.closeButton).should(
            "be.visible"
          );
        });
    });
  }
  /**
   * Validate update file option in version history
   * @description Validates that the update file button and related elements are present in the version history modal
   * @returns {void}
   * @example
   * companyDocumentsPage.validateUpdateFile();
   */
  validateUpdateFile() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.updateFileButton, {
        timeout: 10000,
      })
        .eq(0)
        .should("be.visible")
        .click({ force: true });

      cy.get(loc.uploadModal.fileInput).should("exist");
      cy.get(this.locators.workflowSection.applyWorkflowCheckbox, {
        timeout: 10000,
      }).should("exist");
    });
  }

  /**
   * Validate version history displays versions in descending order
   * @description Validates that versions are displayed from highest to lowest (e.g., 1.1, 1.0)
   * @returns {void}
   * @example
   * companyDocumentsPage.validateVersionOrder();
   */
  validateVersionOrder() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridContainer, {
        timeout: 10000,
      }).should("be.visible");

      // Get all version cells and extract version numbers
      cy.get(this.locators.versionHistoryGrid.versionCell, { timeout: 10000 })
        .should("have.length.greaterThan", 0)
        .then(($cells) => {
          const versions = [];
          $cells.each((index, cell) => {
            // Extract version number (e.g., "1.1" or "1.0 (Current Version)")
            const versionText = Cypress.$(cell).text().trim();
            const versionMatch = versionText.match(/^(\d+\.\d+)/);
            if (versionMatch) {
              versions.push(parseFloat(versionMatch[1]));
            }
          });

          // Validate versions are in descending order
          for (let i = 0; i < versions.length - 1; i++) {
            expect(versions[i]).to.be.greaterThan(
              versions[i + 1],
              `Version ${versions[i]} should be greater than ${versions[i + 1]}`
            );
          }

          cy.log(`✓ Versions are in descending order: ${versions.join(", ")}`);
        });
    });
  }

  /**
   * Validate specific version order
   * @description Validates that versions appear in the expected order
   * @param {Array<string|number>} expectedOrder - Array of version numbers in expected order (e.g., ["1.1", "1.0"])
   * @returns {void}
   * @example
   * companyDocumentsPage.validateSpecificVersionOrder(["1.1", "1.0"]);
   */
  validateSpecificVersionOrder(expectedOrder) {
    this.withinDmsFrame(() => {
      cy.get(this.locators.versionHistoryGrid.gridContainer, {
        timeout: 10000,
      }).should("be.visible");

      cy.get(this.locators.versionHistoryGrid.versionCell, { timeout: 10000 })
        .should("have.length", expectedOrder.length)
        .then(($cells) => {
          const actualVersions = [];
          $cells.each((index, cell) => {
            const versionText = Cypress.$(cell).text().trim();
            const versionMatch = versionText.match(/^(\d+\.\d+)/);
            if (versionMatch) {
              actualVersions.push(versionMatch[1]);
            }
          });

          // Validate each version matches expected order
          expectedOrder.forEach((expectedVersion, index) => {
            expect(actualVersions[index]).to.equal(
              expectedVersion.toString(),
              `Version at position ${index + 1} should be ${expectedVersion}`
            );
          });

          cy.log(
            `✓ Versions match expected order: ${actualVersions.join(", ")}`
          );
        });
    });
  }

  /**
   * Verify that each visible grid column has a filter section
   * @description Ensures every applicable column header renders a floating filter UI (text box/select)
   * @param {Array<string>} [excludeColumns=["Action","Workflow"]] - Column header texts to ignore
   * @returns {void}
   * @example
   * companyDocumentsPage.verifyEachColumnHasFilterSection();
   * companyDocumentsPage.verifyEachColumnHasFilterSection(["Action"]);
   */
  verifyEachColumnHasFilterSection(excludeColumns = ["Action", "Workflow"]) {
    this.withinDmsFrame(() => {
      // Wait for grid to render
      cy.get(this.locators.grid.container, { timeout: 30000 }).should(
        "be.visible"
      );

      // Get the header row with floating filters (second header row in AG-Grid)
      cy.get(
        `${this.locators.grid.container} .ag-header-row:last-child .ag-header-cell`,
        { timeout: 30000 }
      )
        .should("have.length.greaterThan", 0)
        .each(($headerCell, index) => {
          // Check if this header corresponds to an excluded column
          const headerText = Cypress.$($headerCell)
            .closest(".ag-header-row")
            .prev()
            .find(".ag-header-cell")
            .eq(index)
            .find(".ag-header-cell-text")
            .text()
            .trim();

          const isExcluded = excludeColumns.some(
            (col) => col.toLowerCase() === headerText.toLowerCase()
          );

          if (isExcluded) {
            cy.log(
              `⊘ Skipping filter check for excluded column: ${headerText}`
            );
            return;
          }

          // Verify the floating filter input exists in this cell
          cy.wrap($headerCell)
            .find(".ag-floating-filter-body .ag-floating-filter-input")
            .should("exist");

          cy.log(`✓ Filter found for column: ${headerText}`);
        });
    });
  }
  /**
   * Click view log button to open workflow activity log
   * @description Clicks the view log button to display the workflow activity log modal
   * @returns {void}
   */
  clickViewLogButton() {
    this.withinDmsFrame(() => {
      cy.get(this.locators.actions.viewLogButton, {
        timeout: 10000,
      })
        .should("be.visible")
        .click({ force: true });
    });
  }
  /**
   * Update file with new version and apply workflow
   * @description Validates update file option, applies workflow, selects workflow status, and uploads new file version
   * @param {string} filePath - Path to the file to upload (e.g., "cypress/attachment/TestFile.xlsx")
   * @param {string} status - Workflow status to apply (e.g., "Approval", "Acknowledgement")
   * @returns {void}
   */
  updateFile(filePath, status) {
    this.validateUpdateFile();
    this.clickApplyWorkflow();
    this.selectWorkflow(status);
    helpers.uploadFile(filePath);
  }

  /**
   * Validate workflow activity log content
   * @description Verifies that the workflow activity log displays expected entries with correct user, action, status, and timestamp
   * @param {Array<Object>} expectedLogEntries - Array of expected log entries
   * @param {string} expectedLogEntries[].user - Expected user who initiated the action
   * @param {string} expectedLogEntries[].action - Expected action description text
   * @param {string} expectedLogEntries[].status - Expected status badge text (e.g., "In Review", "Approved")
   * @param {string} [expectedLogEntries[].timestamp] - Optional expected timestamp (format: "22 Dec 2025 17:25:23")
   * @returns {void}
   * @example
   * const logEntries = [
   *   { user: "DMS_User Automation", action: "started approval workflow", status: "In Review", timestamp: "22 Dec 2025 17:25:23" }
   * ];
   * companyDocumentsPage.validateWorkflowActivityLog(logEntries);
   */
  validateWorkflowActivityLog(expectedLogEntries) {
    this.withinDmsFrame(() => {
      // Wait for logging container to be visible
      cy.get(this.locators.workflowActivityLog.loggingContainer, {
        timeout: 30000,
      }).should("be.visible");

      // Verify log list exists
      cy.get(this.locators.workflowActivityLog.loggingList, {
        timeout: 10000,
      }).should("exist");

      // Get all log entries
      cy.get(
        `${this.locators.workflowActivityLog.loggingContainer} ${this.locators.workflowActivityLog.logEntry}`,
        { timeout: 10000 }
      )
        .should("have.length.greaterThan", 0)
        .each((logEntryElement, index) => {
          if (index < expectedLogEntries.length) {
            const expectedEntry = expectedLogEntries[index];

            // Wrap the element for easier interaction
            cy.wrap(logEntryElement).within(() => {
              // Verify user name
              cy.get(this.locators.workflowActivityLog.userName, {
                timeout: 10000,
              })
                .should("be.visible")
                .then(($userElement) => {
                  const userText = Cypress.$($userElement).text().trim();
                  const normalized = userText.replace(/\s+/g, " ").trim();
                  const expectedFull = expectedEntry.user;
                  const expectedUsername =
                    expectedEntry.user.match(/\(([^)]+)\)/)?.[1] ||
                    expectedEntry.user;
                  const matches =
                    normalized.includes(expectedFull) ||
                    normalized.includes(expectedUsername);
                  expect(
                    matches,
                    `User at position ${index} should include "${expectedFull}" or "${expectedUsername}" (actual: "${normalized}")`
                  ).to.be.true;
                  cy.log(`✓ User verified: ${normalized}`);
                });

              // Verify action text is present in the log entry
              cy.wrap(logEntryElement).then(($logEntry) => {
                const logText = Cypress.$($logEntry).text();
                expect(logText).to.include(
                  expectedEntry.action,
                  `Action at position ${index} should contain "${expectedEntry.action}"`
                );
                cy.log(`✓ Action verified: ${expectedEntry.action}`);
              });

              // Verify status badge
              cy.get(this.locators.workflowActivityLog.statusBadge, {
                timeout: 10000,
              })
                .should("be.visible")
                .then(($badge) => {
                  const badgeText = Cypress.$($badge).text().trim();
                  expect(badgeText).to.equal(
                    expectedEntry.status,
                    `Status at position ${index} should be ${expectedEntry.status}`
                  );
                  cy.log(`✓ Status badge verified: ${badgeText}`);
                });
            });
          }
        });
    });
  }
  /**
   * Click in review button to view approval status
   * @description Validates the "In Review" status is displayed, then clicks the approval status button to view workflow details
   * @param {string} status - Expected status text to validate (e.g., "In Review")
   * @returns {void}
   */
  clickInReviewButton(status) {
    this.withinDmsFrame(() => {
      // Validate "In Review" status is displayed
      cy.get("span.help-inline", { timeout: 50000 })
        .should("be.visible")
        .and("contain.text", status);

      // Click the "Approval Status:" link
      cy.get(this.locators.versionHistoryGrid.inReviewButton, {
        timeout: 30000,
      })
        .should("be.visible")
        .click({ force: true });
    });
  }

  verifyFolderExists(folderName) {
    cy.get("@dmsFrame").within(() => {
      cy.contains(folderName).should("exist");
    });
  }

  /**
   * Add watchers to a document or folder
   * @description Opens watchers modal, adds a watcher from test data, and verifies success
   * @returns {void}
   */
  addWatchers() {
    this.selectFromThreeDotMenu(
      companyDocData.option.watchers,
      this.locators.actions.watchersMenuItem
    );
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.watchersForm)
        .should("be.visible")
        .get(this.locators.actions.watchersField)
        .click()
        .type(`${companyDocData.testScenarios.watcher.name}{enter}`);
      cy.get(this.locators.actions.watchersSubmitButton).click({ force: true });
      cy.get(this.locators.notifications.toastSuccess).should("be.visible");
    });
  }
  /**
   * Remove watchers from a document or folder
   * @description Opens watchers modal, removes the watcher, and verifies success
   * @returns {void}
   */
  removeWatchers(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.watchers,
        this.locators.actions.watchersMenuItem
      );
      cy.get(this.locators.actions.watchersField).should("be.visible").click();
      cy.get(this.locators.actions.removeWatcher, { timeout: 10000 }).click();
      cy.get(this.locators.actions.watchersSubmitButton).click({ force: true });
      cy.get(this.locators.notifications.toastSuccess).should("be.visible");
    });
  }

  /**
   * View document via three-dot menu
   * @description Clicks the View option from three-dot menu and verifies document viewer is visible
   * @returns {void}
   */
  viewDocIcon(index = 1) {
    this.clickThreeEllipses(index);
    this.selectFromThreeDotMenu(
      companyDocData.option.view,
      this.locators.actions.viewDocumentIcon
    );
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.viewDoc, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  }

  /**
   * Pin a document or folder
   * @description Clicks the Pin option from three-dot menu to pin the item
   * @returns {void}
   */
  pinDoc(index = 1) {
    this.clickThreeEllipses(index);
    this.selectFromThreeDotMenu(
      companyDocData.option.pin,
      this.locators.actions.pinDocument
    );
  }
  /**
   * Unpin a document or folder
   * @description Clicks the Unpin option from three-dot menu and verifies success notification
   * @returns {void}
   */
  unpinDoc() {
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.pinIcon, { timeout: 10000 }).should(
        "be.visible"
      );
      cy.get(locators.general.threeElipses, { timeout: 10000 })
        .last()
        .click({ force: true });
      cy.get("@dmsFrame").within(() => {
        cy.get(this.locators.actions.unpinDocument, { timeout: 10000 })
          .should("be.visible")
          .click();
        cy.get(this.locators.notifications.toastSuccess).should("be.visible");
      });
    });
  }

  /**
   * Clear search in the grid
   * @description Opens search box, clears the search term, and submits to show all items
   * @returns {void}
   */
  unsearchInGrid() {
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.searchIcon, { timeout: 10000 })
        .should("be.visible")
        .click({ delay: 1000, force: true })
        .then(() => {
          cy.get(locators.general.searchTextBox, { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type("{enter}");
        });
    });
  }
  /**
   * Filter documents by workflow status
   * @description Opens filter modal, clears existing filters, selects workflow status, and verifies filtered results
   * @returns {void}
   */
  filterWorkflowStatus(index = 0) {
    this.clickThreeEllipses(index);
    this.selectFromThreeDotMenu(
      companyDocData.option.filter,
      this.locators.actions.filter
    );

    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.clearBtn, { timeout: 10000 })
        .should("be.visible")
        .click();
      cy.get(this.locators.actions.workflowStatus, { timeout: 10000 }).click();
      cy.get(this.locators.actions.workflowStatusFilter).select(
        companyDocData.testScenarios.workflowStatus.status,
        { force: true }
      );

      cy.get(this.locators.actions.filterButton).click();
      cy.get(locators.general.searchIcon, { timeout: 60000 })
        .should("be.visible")
        .click()
        .then(() => {
          cy.get(locators.general.searchTextBox, { timeout: 10000 })
            .should("be.visible")
            .clear()
            .type(companyDocData.testDocument.name + "{enter}");
        });

      cy.get(this.locators.actions.folderLocator, { timeout: 10000 })
        .first()
        .should("have.text", companyDocData.testDocument.name);
    });
  }

  /**
   * Remove workflow status filter
   * @description Opens filter modal, clears all filters, and verifies unfiltered results
   * @returns {void}
   */
  unfilterWorkflowStatus(index = 0) {
    this.clickThreeEllipses(index);
    this.selectFromThreeDotMenu(
      companyDocData.option.filter,
      this.locators.actions.filter
    );

    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.clearBtn, { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.get(this.locators.actions.filterButton).click();
      cy.get(this.locators.actions.folderLocator).should(
        "not.have.text",
        companyDocData.testDocument.name
      );
    });
  }

  bookmarkFile(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.bookmark,
        this.locators.actions.bookmark
      );
      cy.get(this.locators.actions.bookmarkIcon).should("be.visible");
    });
  }

  unbookmarkFile(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.unbookmark,
        this.locators.actions.bookmark
      );
      cy.get(this.locators.actions.bookmarkIcon).should("not.exist");
    });
  }
  viewVersionHistory(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.versionHistory,
        this.locators.actions.versionHistory
      );
    });
    cy.get(this.locators.actions.versionHistoryContainer, {
      timeout: 10000,
    }).should("exist");
  }

  setExpiration(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.setExpiration,
        this.locators.actions.setExpiration
      );
      cy.get(this.locators.actions.expirationInput, {
        timeout: 10000,
      })
        .should("be.visible")
        .type("12/31/2034{enter}");
      cy.get(this.locators.actions.expirationApplyBtn, {
        timeout: 10000,
      }).click();
      cy.get(this.locators.notifications.toastSuccess).should("be.visible");
    });
  }

  clickFolderRadioBtn(loc, folderLoc, folderName) {
    cy.get(loc)
      .contains(folderLoc, folderName)
      .should("be.visible", { timeout: 10000 })
      .dblclick({ delay: 3000 });
  }
  saveFolderMove() {
    cy.get(this.locators.actions.moveSaveBtn)
      .should("not.be.disabled", { timeout: 20000 })
      .click();
    cy
      .get(this.locators.notifications.toastSuccess, { timeout: 20000 })
      .should("be.visible"),
      { timeout: 10000 };
  }

  moveDocument(index = 1) {
    this.clickThreeEllipses(index);
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.moveDocument,
        this.locators.actions.moveDocument
      );
      this.clickFolderRadioBtn(
        this.locators.actions.folderList,
        this.locators.actions.folderText,
        companyDocData.option.moveFolder
      );
      cy.get(this.locators.grid.loaderIcon, {
        timeout: 10000,
      }).should("not.be.visible", { timeout: 20000 });
      this.saveFolderMove();
    });
  }

  verifyDocument(index = 1) {
    this.searchInGrid(companyDocData.option.moveFolder);
    this.expandFolder(companyDocData.option.moveFolder);
    this.clickThreeEllipses(index);
  }

  moveDocumentAgain() {
    cy.get("@dmsFrame").within(() => {
      this.selectFromThreeDotMenu(
        companyDocData.option.moveDocument,
        this.locators.actions.moveDocument
      );
      this.clickFolderRadioBtn(
        this.locators.actions.folderList,
        this.locators.actions.folderText,
        companyDocData.parentFolder.name
      );
      cy.get(this.locators.grid.loaderIcon, {
        timeout: 10000,
      }).should("not.be.visible", { timeout: 20000 });
      this.saveFolderMove();
    });
  }

  openAddBtn() {
    this.switchToIframe();
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.addBtn)
        .should("be.visible", { timeout: 10000 })
        .click();
    });
  }

  verifyFileUploaded() {
    this.switchToIframe();
    cy.get("@dmsFrame").within(() => {
      cy.get(loc.uploadModal.uploadButton).should("be.visible").click();
      cy.get(this.locators.notifications.toastSuccess, {
        timeout: 10000,
      }).should("be.visible");

      cy.get(this.locators.uploadModal.cancelButton).click();
    });
  }
  fileUpload(filePath) {
    cy.get("@dmsFrame").within(() => {
      cy.get(loc.uploadModal.fileInput)
        .should("exist")
        .scrollIntoView()
        .selectFile(filePath, { force: true });

      cy.wait(1000); //wait For file to be loaded in DMS Modal
    });
    cy.wait(2000); // wait was needed here Upload Btn would not be visible until Files are loaded and Uploaded in DMS Modal
  }

  clickWorkFlow() {
    this.switchToIframe();
    cy.get("@dmsFrame").within(() => {
      cy.get(this.locators.actions.applyWorkflowCheckbox).click({
        force: true,
      });
      cy.get(this.locators.actions.workflowDropdown).click();

      cy.get(this.locators.workflowSection.enterWorkflowSearch).type(
        `${companyDocData.statuses.acknowledgement}{enter}`
      );

      cy.get(this.locators.workflowSection.expireOns)
        .scrollIntoView()
        .click()
        .invoke("val", "2026-12-31")
        .trigger("change");

      cy.get(this.locators.workflowSection.assignToUsersDropdown)
        .scrollIntoView()
        .click();

      cy.get(this.locators.workflowSection.assignToUsersInput).type(
        `${companyDocData.statuses.user}{enter}`,
        { force: true }
      );
    });
  }
}

export default CompanyDocument;
