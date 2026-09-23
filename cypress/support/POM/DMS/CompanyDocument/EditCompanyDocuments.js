import dayjs from "dayjs";
import locators from "../../../../fixtures/locators.json";
import MyDocumentsHelper from "../helpers/MyDocumentsHelper";

const loc = locators.companyDocuments.editCompanyDocuments;
const helpers = new MyDocumentsHelper();
class CompanyDocuments {
  getFrame() {
    const frame = locators.myDocuments.iframe;
    cy.frameLoaded(frame);
    return cy.iframe(frame);
  }

  // Helper: Select dropdown option with waits
  selectDropdown(dropdownId, optionText) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wait(1000);
      cy.wrap($body).find(dropdownId).click();
      cy.wait(1000);
      cy.wrap($body).find(loc.dropDown).contains(optionText).click();
      cy.wait(1000);
    });
  }

  // Helper: Get first grid row
  getFirstGridRow() {
    return cy.get("@dmsFrame").then(($body) => {
      return cy.wrap($body).find(loc.getFirstRow, { timeout: 25000 }).first();
    });
  }

  // Helper: Perform take action (approve/reject)
  performTakeAction(actionType, comment) {
    cy.wait(3500); // wait for the options to appear
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).contains("Take Action").click();
      cy.get($body).find("select#action").select(actionType, { force: true });
      cy.wrap($body).find(loc.comment).type(comment);
      cy.wrap($body).find(loc.saveActionBtn).click();
    });
  }

  // Helper: Edit document modal actions
  performEditDocumentAction(actionText) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.editDocument, { timeout: 10000 })
        .first()
        .click({ delay: 1000, force: true });
      cy.wrap($body)
        .find(loc.editDocumentBtn)
        .contains(actionText)
        .click({ delay: 2000 });
      cy.wait(3000);
      cy.wrap($body)
        .find(loc.editDocumentModal)
        .contains("Cancel")
        .click({ force: true });
    });
  }

  // -----------------------------
  verifyAssignedDocument(document) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).contains("a", document).should("be.visible");
    });
  }

  searchDocument(document) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.searchField).click();
      cy.wrap($body)
        .find(loc.searchInput)
        .type("{selectall}{backspace}")
        .type(`${document}{enter}`);
    });
  }

  validateDocument(document) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).contains("a", document).should("be.visible");
    });
  }

  validateFolder(folderName) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.folderRow)
        .eq(1)
        .find(loc.groupValue)
        .should("contain.text", folderName);
    });
  }

  clickEllipses(index = 1) {
    cy.get("@dmsFrame").within(() => {
      cy.get(locators.general.threeElipses)
        .eq(index)
        .should("be.visible")
        .click({ delay: 2000 });
    });
  }

  clickDropdownOption(option) {
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body)
        .find(loc.elipsesOptions, { timeout: 10000 })
        .contains(option)
        .dblclick({ delay: 2500 });
    });
  }

  searchInAssignedToMe(document) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.assignedUserInput)
        .eq(1)
        .type(`${document}{enter}`);
    });
  }

  docExistAssignedToMe(document) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.rowGroup).contains(document);
    });
  }

  verifyCurrentVersion() {
    cy.wait(4000);
    helpers.switchToIframe();
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body)
        .find(loc.versionColumn, { timeout: 25000 })
        .contains("Current Version")
        .should("be.visible");
    });
  }

  verifyCurrentVersionAndStatus(status) {
    cy.wait(2500);
    cy.waitForTopMsgLoaderToDisappear(100000);
    helpers.switchToIframe();
    cy.get("@dmsFrame").then(($doc) => {
      // Get text content properly using Cypress chainables
      cy.wrap($doc)
        .find(loc.versionColumn)
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).to.contain("Current Version");
        });

      cy.wrap($doc)
        .find(loc.statusColumn)
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).to.contain(status);
        });
    });
  }

  verifyCurrentVersionAndStatus2(status) {
    cy.wait(1000);
    helpers.switchToIframe();
    // this.getFirstGridRow().then(($doc) => {
    cy.get("@dmsFrame").then(($doc) => {
      expect($doc.find(loc.statusColumn).eq(1).text().trim()).to.contain(
        status
      );
    });
  }

  validateVersionNotCreated(status) {
    cy.wait(2500); // wait for version history page to navigate
    helpers.switchToIframe();
    cy.get("@dmsFrame").then(($body) => {
      // Assert that only one row has the given status (e.g., "Draft")
      cy.get($body)
        .find(loc.statusColumn)
        .should("contain.text", status)
        .and("have.length", 1);
    });
  }

  openNewFolderFlyer() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.mouseHover).trigger("mouseover");
      cy.wrap($body)
        .find(loc.dropDownContent)
        .contains(loc.dropDownItem, "Create Folder")
        .click();
    });
  }

  validateCheckbox() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .contains("Contains Policies And Procedures")
        .closest("label")
        .find("span")
        .should("be.visible");
    });
  }

  clickCheckbox() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .contains("Contains Policies And Procedures")
        .closest("label")
        .find("span")
        .click();
    });
  }

  createFolder(folderName) {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.folderName).type(folderName);
      cy.wrap($body).find(loc.addFolderBtn).click();
    });
  }

  validateFlyerOptions() {
    cy.wait(1500);
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.wfProcessId).click();
      cy.wrap($body)
        .find(loc.dropDown)
        .contains("Approval", { timeout: 10000 })
        .click();

      cy.wrap($body).find(loc.assignTo).should("be.visible");
      cy.wrap($body).find(loc.expireOn).should("be.visible");
      cy.wrap($body).find(loc.expiryNote).should("be.visible");
      cy.wrap($body).find(loc.assignMsg).should("be.visible");
    });
  }

  validateOptionsPresent() {
    cy.wait(2500);
    cy.waitForTopMsgLoaderToDisappear(100000);
    helpers.switchToIframe();
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.assignToMeHeader, { timeout: 30000 })
        .then(($ele) => {
          const text = $ele.text();
          expect(text).to.include("Update File");
          expect(text).to.include("Bookmarks");
          expect(text).to.include("View Log");
        });
      cy.wrap($body).find(loc.unLockBtnOption).should("contain.text", "Unlock");
    });
  }

  validateOptionNotPresent() {
    // cy.wait(1500);
    helpers.switchToIframe();
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.dropDownOptions)
        .should(($ele) => {
          expect($ele.text()).not.to.include("Initiate Workflow");
        });
    });
  }

  reject() {
    this.performTakeAction("Reject", "Rejecting the document");
  }

  approve() {
    this.performTakeAction("Approve", "Approving the document");
  }

  validateDocumentApproved() {
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body)
        .find(loc.statusColumn)
        .eq(1)
        .should("contain.text", "Approved");
    });
  }

  createNew() {
    this.performEditDocumentAction("Create New");
  }

  createNewWithApproval() {
    this.performEditDocumentAction("Create New with Approval");
  }

  checkDocument() {
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body).find(loc.checkDocumentBox).click().should("be.checked");
    });
  }

  clickBody() {
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body).find("body").dblclick();
    });
  }

  closeModal() {
    cy.get("@dmsFrame").then(($body) => {
      cy.get($body).find(loc.editDocumentModal).should("not.be.visible");
    });
  }

  clickUnlock() {
    cy.wait(2000);
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.unLockBtnOption).contains("Unlock").click();
    });
  }

  validate3Options() {
    cy.wait(1000);
    this.getFirstGridRow().then(($ele) => {
      cy.wrap($ele).find(loc.editDocumentTitle).should("be.visible");
      cy.wrap($ele).find(loc.sendForApprovalTitle).should("be.visible");
      cy.wrap($ele).find(loc.deleteTitle).should("be.visible");
    });
  }

  validateAllUsersShown() {
    cy.wait(1500); // wait for the options to appear
    this.selectDropdown(loc.wfProcessId, "Approval");
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.assignTo).click();
      cy.wrap($body)
        .find(loc.dropDownLi)
        .then(($users) => {
          const text = $users.text();
          expect(text).to.include(Cypress.env("kxi").customer.withRM4.username);
        });
    });
  }

  assignToUser(sendForApproval = false) {
    cy.wait(1500); // wait for the options to appear
    const formattedDate = dayjs().format("MM/DD/YYYY");

    // Template for filling workflow fields
    const fillWorkflowFields = ($body, selectors) => {
      cy.wrap($body).find(selectors.assignTo).click();
      cy.wrap($body)
        .find(loc.dropDownSearch)
        .type(`${Cypress.env("kxi").customer.withRM4.username}{enter}`);
      cy.wait(1500);
      cy.wrap($body)
        .find(selectors.expireOn)
        .type(formattedDate, { force: true });
      cy.wrap($body)
        .find(selectors.expiryNote)
        .type("Expiry note for approval document");
      cy.wrap($body)
        .find(selectors.message)
        .type("Please approve the document");
      cy.wrap($body).find(selectors.applyBtn).first().click();
    };

    cy.get("@dmsFrame").then(($body) => {
      cy.wait(1500);
      if (sendForApproval) {
        fillWorkflowFields($body, {
          assignTo: loc.assignToDraft,
          expireOn: loc.sendForApproval.expireOn,
          expiryNote: loc.sendForApproval.expiryNote,
          message: loc.sendForApproval.message,
          applyBtn: loc.sendForApproval.applyBtn,
        });
      } else {
        cy.wrap($body).find(loc.wfProcessId).click();
        cy.wait(1500);
        cy.wrap($body)
          .find(loc.dropDown)
          .contains("Approval", { timeout: 10000 })
          .click();
        cy.wait(1000);
        fillWorkflowFields($body, {
          assignTo: loc.assignTo,
          expireOn: loc.initiateWorkFlow.expireOn,
          expiryNote: loc.initiateWorkFlow.expiryNote,
          message: loc.initiateWorkFlow.message,
          applyBtn: loc.initiateWorkFlow.applyBtn,
        });
      }
    });
  }

  unlockDocument() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.unlockIcon).click({ force: true });
    });
  }

  unlockDocument2() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.faUnlock).contains("Unlock").click();
    });
  }

  validateSendForApproval() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body)
        .find(loc.dropDownOptions)
        .should(($ele) => {
          expect($ele.text()).to.include("Send For Approval");
        });
    });
  }

  initiateWorkflow() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.initiateWorkFlowTitle).click();
    });
  }

  validateStatus(status) {
    helpers.switchToIframe();
    this.getFirstGridRow().then(($row) => {
      cy.wrap($row)
        .wait(800)
        .find(loc.statusColumn)
        .should("have.text", status, { timeout: 4000 })
        .and("be.visible");
    });
  }

  verifyApprovalFlyer() {
    cy.get("@dmsFrame").then(($body) => {
      cy.wrap($body).find(loc.assignToDraft).should("be.visible");
    });
  }

  writeDataInFile(fileDetails) {
    const { filePath, type, types } = fileDetails;

    cy.readFile(filePath).then((data) => {
      cy.createRandomString(15).then((randomString) => {
        if (type === types.document) {
          data.documentName = `${randomString}`;
        } else {
          data.folderName = `${randomString}`;
        }
        cy.writeFile(filePath, data);
      });
    });
  }
}

export default CompanyDocuments;
