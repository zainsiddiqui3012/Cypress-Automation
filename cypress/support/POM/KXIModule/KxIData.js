import { time } from "console";
import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import UpdateTaskUnlink from "../../../fixtures/KXIModule/UpdateTaskUnlink.json";
import { request } from "http";
const definitionGridUrl = Cypress.env("DEFINITION_URL");
const ManualDataEntry = "cypress/fixtures/KXIModule/ManualDataEntryLink.json";
let summaryPageUrl;
export default class KxiData {
  createKXIData(kxiDefinition, kriValue, comments, dateValue) {
    cy.intercept("GET", definitionGridUrl).as("definitions");

    this.addkxi();

    cy.wait("@definitions", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.get(locators.kxi.kxiData.modal.kxiDefinitionDropdown).click();

    cy.get(locators.kxi.kxiData.modal.kxiSearch).should("be.visible");
    this.selectKXIDefinition(kxiDefinition);
    this.setKxIValue(kriValue);
    this.setSampleDateComments(comments, dateValue);
    this.saveKxiDataForm();
    //wait For Modal to disappear
    cy.get(locators.kxi.kxiData.kriDataModalContainer, {
      timeout: 20000,
    }).should("not.be.visible");
    cy.waitForTopMsgLoaderToDisappear(20000);
  }

  addkxi() {
    //wait for disappearing of toastr message(Jenkins specific)
    cy.wait(3000);
    cy.get(locators.kxi.kxiDefinition.ellipsesBtn, { timeout: 20000 }).click();
    cy.get(locators.kxi.kxiData.addBtn).click();
  }

  selectKXIDefinition(kxiDefinition) {
    // Wait for the KXI Definition dropdown data to load when creating KXI Data on the KXI Data screen.
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.modal.kxiSearch).type(kxiDefinition);
    cy.get(locators.kxi.kxiData.modal.kxiSearch)
      .clear()
      .type(kxiDefinition, { delay: 220 });
    cy.get(locators.kxi.kxiData.modal.kxiSearch, { timeout: 5000 }).type(
      "{enter}"
    );
  }

  clickCheckbox() {
    cy.get(locators.kxi.kxiData.checkBoxSelectionkxi).click();
    cy.get(locators.kxi.kxiData.showAllButton).click();
  }
  shouldVerifyShowAllData() {
    cy.get(locators.kxi.kxiData.listOfDataInkxiDataGrid).should(
      "have.length",
      2
    );
    cy.get(locators.kxi.kxiData.showLatestButton).should("be.visible");
  }

  setKxIValue(kriValue) {
    cy.get(locators.kxi.kxiData.kxiValue)
      .scrollIntoView()
      .then(($el) => {
        if ($el.is(":visible")) {
          cy.wrap($el).type(kriValue, { force: true });
        }
      });
  }

  setSampleDateComments(comments, dateValue) {
    let formattedDate;

    if (dateValue === "currentDate") {
      // Current date in MM/DD/YYYY
      formattedDate = dayjs().format("MM/DD/YYYY");
    } else if (dateValue === "previousDate") {
      // Previous date in MM/DD/YYYY
      formattedDate = dayjs().subtract(1, "day").format("MM/DD/YYYY");
    }
    cy.get(locators.kxi.kxiData.sampleDateKxIData).clear().type(formattedDate);

    // Set comments
    cy.get(locators.kxi.kxiData.comments).clear().type(comments);
  }

  saveKxiDataForm() {
    cy.get(locators.kxi.kxiData.saveKxiDataBtn).click();
  }

  searchFilterName(kxiDefinition) {
    cy.get(locators.kxi.kxiData.saveKxiDataBtn, { timeout: 50000 }).should(
      "not.be.visible"
    );
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.kxiFilterName, { timeout: 50000 })
      .click({ delay: 130 })
      .clear()
      .type(kxiDefinition)
      .wait(1000);
  }
  setRestoreDefaults() {
    cy.visitkxiData();
  }

  clickActionButton(newWindowUrl) {
    cy.window().then((win) => {
      // Stub window.open to capture the new tab/window URL
      cy.stub(win, "open").as("windowOpen");

      // Click the "Create" button to trigger the window.open
      cy.get(locators.kxi.kxiData.takeActionButton, { timeout: 50000 })
        .first()
        .click();

      // Assert window.open was called and extract the URL
      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          // Log the captured URL for debugging
          cy.log("Captured new tab URL:", newTabUrl);

          //const mainURL = "https://qa2.360factors.com/predict360/";
          const mainURL = newWindowUrl;
          // If required, set authentication cookies or tokens before visiting the URL
          const finalURL = mainURL + newTabUrl;

          // Visit the captured URL in the same Cypress window
          cy.visit(finalURL);
          // Wait for the page to load
          //cy.wait(5000);
        });
    });
  }

  verifyDataOnManualDataEntryColumn(length) {
    cy.get(locators.kxi.kxiData.manualDataEntryCol, { timeout: 10000 }).should(
      "have.length",
      length
    );
  }
  verifyUnlinkButtonVisible() {
    cy.get(locators.kxi.kxiData.unlinkButton).should("be.visible");
  }

  unlinkKxiDefinitionFromData(labelActions) {
    cy.get(locators.kxi.kxiData.unlinkButton).click();

    cy.get(locators.kxi.kxiData.unlinkConfirmMessage)
      .should("be.visible")
      .then((message) => {
        const actualMessage = message.text().trim();
        expect(actualMessage).to.equal(UpdateTaskUnlink.unlinkPopupMessage);
      });

    if (labelActions === "Yes") {
      cy.get(locators.kxi.kxiData.unlinkConfirmYesButton)
        .should("be.visible")
        .click({ force: true });
    } else {
      cy.get(locators.kxi.kxiData.unlinkConfirmNoButton)
        .wait(500)
        .should("be.visible")
        .click({ force: true });
    }
  }
  getLinkSummaryScreen() {
    cy.get(locators.kxi.kxiData.manualDataEntryCol).then(function (link) {
      summaryPageUrl = link.prop("href");
      cy.readFile(ManualDataEntry).then((file) => {
        file.MANUAL_DATA_ENTRY_LINK = summaryPageUrl;
        cy.writeFile(ManualDataEntry, file);
      });
    });
  }
  visitUnlinkDefSummaryScreen() {
    cy.readFile(ManualDataEntry).then((file) => {
      cy.visit(file.MANUAL_DATA_ENTRY_LINK);
      cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(
        () => {
          cy.get(
            locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
              .linkedKXISectionLabel,
            { timeout: 50000 }
          )
            .scrollIntoView()
            .should("exist")
            .and("be.visible")
            .and("include.text", "Linked KXI");
          cy.contains("label", Cypress.env("kxiDefinitionName")).should(
            "not.exist"
          );
        }
      );
    });
  }
  verifyUnlinkButtonNotVisible() {
    cy.get(locators.kxi.kxiData.toastMessage).contains(
      UpdateTaskUnlink.unlinkSuccessfulToaster
    );
    cy.get(locators.kxi.kxiData.toastSuccess, { timeout: 15000 }).should(
      "not.exist"
    );
    cy.get(locators.kxi.kxiData.unlinkButton).should("not.exist");
  }

  waitForKXIDATALoaderToDisappear() {
    cy.get(locators.kxi.kxiData.loadingIconOnGrid, { timeout: 25000 }).should(
      "not.be.visible"
    );
  }

  verifyUnlinkingOnKXIDataAndTaskSummaryScreen() {
    this.searchFilterName(Cypress.env("kxiDefinitionName"));
    this.verifyDataOnManualDataEntryColumn(
      UpdateTaskUnlink.verifyManualDataEntryOne
    );
    this.verifyUnlinkButtonVisible();
    this.unlinkKxiDefinitionFromData(UpdateTaskUnlink.buttonLabelNo);
    this.verifyUnlinkButtonVisible();
    this.getLinkSummaryScreen();
    this.verifyDataOnManualDataEntryColumn(
      UpdateTaskUnlink.verifyManualDataEntryOne
    );
    this.unlinkKxiDefinitionFromData(UpdateTaskUnlink.buttonLabelYes);
    this.verifyUnlinkButtonNotVisible();
    this.verifyDataOnManualDataEntryColumn(
      UpdateTaskUnlink.verifyManualDataEntryZero
    );
    this.visitUnlinkDefSummaryScreen();
    cy.visitkxiDef();
  }
}
