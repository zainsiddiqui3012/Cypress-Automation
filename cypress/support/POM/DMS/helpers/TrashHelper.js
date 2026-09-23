import { time } from "console";
import locators from "../../../../fixtures/locators.json";
import data from "../../../../fixtures/DMS/MyDocuments/MyDocuments.json";

const loc = locators.trash;

class TrashHelper {
  /**
   * Switch to Trash iframe
   */
  switchToTrashIframe() {
    cy.frameLoaded(loc.trashIframe);
    cy.iframe(loc.trashIframe).as("trashFrame");
  }

  /**
   * Verify Trash grid is displayed
   */
  verifyTrashGridDisplayed() {
    cy.get("@trashFrame").find(loc.trashGrid).should("be.visible");
  }

  waitForTrashGridToLoad(timeout = 60000) {
    cy.get("@trashFrame").within(() => {
      cy.waitForMyGridLoaderToDisappear(timeout);
    });
  }

  /**
   * Verify grid columns are present
   */
  verifyTrashGridColumns() {
    cy.get("@trashFrame").within(() => {
      cy.get(loc.nameColumn).should("contain.text", "Name");
      cy.get(loc.typeColumn).should("contain.text", "Type");
      cy.get(loc.sizeColumn).should("contain.text", "Size");
      cy.get(loc.deletedByColumn).should("contain.text", "Deleted By");
      cy.get(loc.deletedOnColumn).should("contain.text", "Deleted On");
      cy.get(loc.actionsColumn).should("exist");
      [loc.checkAll, loc.restoreAll, loc.deleteAll].forEach(($loc) => {
        cy.get($loc).should("exist").and("be.visible").and("not.be.disabled");
      });
    });
  }

  /**
   * Template method to click a button inside the Trash iframe
   * @param {string} buttonLocator
   */
  clickButtonInTrashFrame(buttonLocator) {
    cy.get("@trashFrame").find(buttonLocator).should("be.visible").click();
  }

  /**
   * Click Select All button
   */
  clickSelectAll() {
    this.clickButtonInTrashFrame(loc.selectAllButton);
  }

  /**
   * Click Unselect All/Deselect All button
   */
  clickUnselectAll() {
    this.clickButtonInTrashFrame(loc.unselectAllButton);
  }

  /**
   * Template method to verify button visibility state
   * @param {string} visibleButtonLocator
   * @param {string} hiddenButtonLocator
   */
  verifyButtonVisibility(visibleButtonLocator, hiddenButtonLocator) {
    cy.get("@trashFrame").find(visibleButtonLocator).should("be.visible");
    cy.get("@trashFrame").find(hiddenButtonLocator).should("not.be.visible");
  }

  /**
   * Verify Select All button changes to Unselect All
   */
  verifyUnselectAllButtonDisplayed() {
    this.verifyButtonVisibility(loc.unselectAllButton, loc.selectAllButton);
  }

  /**
   * Verify Select All button is displayed
   */
  verifySelectAllButtonDisplayed() {
    this.verifyButtonVisibility(loc.selectAllButton, loc.unselectAllButton);
  }

  /**
   * Template method to verify checkbox state for all documents
   * @param {boolean} shouldBeChecked
   */
  verifyAllDocumentsCheckboxState(shouldBeChecked) {
    cy.get("@trashFrame")
      .find(loc.documentCheckbox)
      .each(($checkbox) => {
        cy.wrap($checkbox).should(
          shouldBeChecked ? "be.checked" : "not.be.checked"
        );
      });
  }

  /**
   * Verify all documents are selected
   */
  verifyAllDocumentsSelected() {
    this.verifyAllDocumentsCheckboxState(true);
  }

  /**
   * Verify all documents are deselected
   */
  verifyAllDocumentsDeselected() {
    this.verifyAllDocumentsCheckboxState(false);
  }

  /**
   * Click Restore button (bulk action)
   */
  clickRestoreButton() {
    cy.get("@trashFrame").find(loc.restoreButton).should("be.visible").click();
  }

  /**
   * Click Delete button (bulk action)
   */
  clickDeleteButton() {
    cy.get("@trashFrame").find(loc.deleteButton).should("be.visible").click();
  }

  /**
   * Verify Select All button is visible
   */
  verifySelectAllButtonVisible() {
    cy.get("@trashFrame")
      .find(loc.selectAllButton)
      .should("be.visible")
      .and("not.be.disabled");
  }

  /**
   * Verify Restore and Delete buttons are present and enabled
   */
  verifyRestoreAndDeleteButtonsPresent() {
    [loc.restoreButton, loc.deleteButton].forEach((button) => {
      cy.get("@trashFrame")
        .find(button)
        .should("be.visible")
        .and("not.be.disabled");
    });
  }

  /**
   * Click View/Eye icon for a document
   * @param {string} documentName
   */
  clickViewDocument(documentName) {
    cy.get("@trashFrame")
      .contains(loc.documentNameLink, documentName, { timeout: 60000 })
      .parents(loc.gridRow)
      .find("[title='Preview']")
      .click();
  }

  /**
   * Click an action button in Action column for a document
   * @param {string} documentName
   * @param {string} actionButtonLocator
   */
  clickDocumentAction(documentName, actionButtonLocator) {
    cy.get("@trashFrame")
      .contains(loc.documentNameLink, documentName)
      .parents(loc.gridRow)
      .find(actionButtonLocator)
      .first()
      .click();
  }

  /**
   * Click Restore button in Action column for a document
   * @param {string} documentName
   */
  clickRestoreDocumentAction(documentName) {
    this.clickDocumentAction(documentName, loc.restoreActionButton);
  }

  /**
   * Click Delete button in Action column for a document
   * @param {string} documentName
   */
  clickDeleteDocumentAction(documentName) {
    this.clickDocumentAction(documentName, loc.deleteActionButton);
  }

  clickDeleteConfirmBtn() {
    this.clickConfirmBtn(loc.deleteConfirmBtn);
  }

  clickRestoreConfirmBtn() {
    this.clickConfirmBtn(loc.restoreConfirmBtn);
  }

  clickConfirmBtn(locator) {
    cy.get("@trashFrame").within(() => {
      cy.get(locator).should("be.visible").click({ delay: 200 });
      cy.waitForToastMessageToDisappear(60000);
    });
  }

  /**
   * Select a document by name using checkbox
   * @param {string} documentName
   */
  selectDocument(documentName) {
    cy.get("@trashFrame")
      .contains(loc.documentNameLink, documentName, { timeout: 60000 })
      .parents(loc.gridRow)
      .find(loc.documentCheckbox)
      .check();
  }

  searchDocument(documentName) {
    cy.get("@trashFrame")
      .find(loc.searchDocument)
      .clear()
      .type("{selectall}{backspace}")
      .type(documentName, { duration: 200 });
  }
  /**
   * Template method to check document presence in Trash
   * @param {string} documentName
   * @param {boolean} shouldExist
   * @param {number} timeout
   */
  verifyDocumentPresenceInTrash(
    documentName,
    shouldExist = true,
    timeout = 30000
  ) {
    const assertion = shouldExist ? "be.visible" : "not.exist";
    cy.get("@trashFrame")
      .contains(loc.documentNameLink, documentName, { timeout })
      .should(assertion);
  }

  /**
   * Verify document is present in Trash
   * @param {string} documentName
   */
  verifyDocumentPresentInTrash(documentName) {
    this.verifyDocumentPresenceInTrash(documentName, true, 30000);
  }

  /**
   * Verify document is not present in Trash
   * @param {string} documentName
   */
  verifyDocumentNotPresentInTrash(documentName) {
    this.waitForTrashGridToLoad(30000);
    this.verifyDocumentPresenceInTrash(documentName, false, 10000);
  }

  /**
   * Verify document viewer/modal opens
   */
  verifyDocumentViewerOpens() {
    cy.get("@trashFrame").within(() => {
      cy.get(loc.previewDocument, { timeout: 40000 })
        .should("be.visible")
        .and("not.contain.text", "The file is not supported!");
    });
  }

  verifyModuleAndClick(moduleName) {
    cy.get(loc.navbar).contains(moduleName).click();
  }

  clickAndVerifyModuleNav(
    mainModule = data.mainModuleName,
    subModule = data.navModuleName
  ) {
    cy.get(loc.leftMenuBtn)
      .click()
      .then(() => {
        this.verifyModuleAndClick(mainModule);
        this.verifyModuleAndClick(subModule);
      });
  }
  /**
   * Verify Trash field is visible in Document Management module
   */
  verifyTrashFieldVisible() {
    cy.get("@trashFrame").within(() => {
      cy.contains(loc.pageBreadCrumb, "Trash").should("be.visible");
    });
  }
  /**
   * Click on Trash field to navigate
   */
  clickTrashField() {
    cy.contains("Trash").click();
  }
}
export default TrashHelper;
