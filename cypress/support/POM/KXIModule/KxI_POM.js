/// <reference types= "cypress" />
import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import PredictMenu_PO from "../Menu_PO/PredictMenu_PO";
import KXIRegularTask from "../../../support/POM/KXIModule/KXITask/KXIRegularTask.js";
import KXIChildTask from "../../../support/POM/KXIModule/KXITask/KXIChildTask";
import KXIRegularTaskSummary from "../../../support/POM/KXIModule/KXITask/KXIRegularTaskSummary.js";
import kxiUpdateLogFields from "../../../fixtures/KXIModule/kxiUpdateLogFields.json";
import apiKxi from "../../../fixtures/KXIModule/KXIData/apiAddData.json";
import defdata from "../../../fixtures/KXIModule/KXIData/KXIDataEdit.json";
import "cypress-plugin-tab";
import "cypress-if";
import * as XLSX from "xlsx";
import "cypress-file-upload";
import data from "../../../fixtures/KXIModule/FredQuery.json";
import taskData from "../../../fixtures/KXIModule/KXITaskWriteUpdate.json";

const fs = require("fs");
const path = require("path"); // To resolve paths cross-platform

const importFileName = "importFile";
const importKxi = "cypress/fixtures/KXIModule/importKxiName.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
const taskFilePath = "cypress/fixtures/KXIModule/KXITaskWriteUpdate.json";
const customFilePath = "cypress/fixtures/KXIModule/customFieldWrite.json";
const editcustomFilePath = "cypress/fixtures/KXIModule/customFieldUpdate.json";
const taskRegularFilePath = "cypress/fixtures/KXIModule/KXITaskRegular.json";
const childTask = "cypress/fixtures/KXIModule/KXIChildTask.json";
const createImportJsonData = `cypress/fixtures/Examples/Data/myImportData/importFile.json`;
const defImport = `cypress/fixtures/Examples/exportFile.json`;
const createImportKxiDataJson = `cypress/fixtures/Examples/Data/myImportData/importDataFile.json`;
const exportJSONFile = `cypress/fixtures/Examples/Data/myExportData/exportFile.json`;
const customsFilePath = "cypress/fixtures/KXIModule/CustomFieldArray.json";
const assigneeName = "cypress/fixtures/KXIModule/assigneeName.json";
const jsonFilePath = "cypress/fixtures/KXIModule/KXIData/DataImport.json";
const mainURL = Cypress.env("MAIN_URL");
const getAll = Cypress.env("DECISION_API_GETALLMESSAGES");
const selectPath = Cypress.env("DECISION_API_SELECTPATH");
const generateTokenUrl = Cypress.env("GENERATE_TOKEN");
const addDataUrl = Cypress.env("ADD_KXI_DATA_API");
const timeStamp = dayjs().format("MM/DD/YYYY");
const TIMEOUT_SHORT = 3000;
const TIMEOUT_LONG = 150000;
const timeStamp2 = dayjs(new Date()).subtract(1, "day").format("MM/DD/YYYY");

let exportFile = "Test Export File";
const exportFilePath = "../cypress/downloads";
const category = "cypress/fixtures/KXIModule/writeKxiCategory.json";

export default class KXI_POM {
  menu = new PredictMenu_PO();
  regularTask = new KXIRegularTask();
  childTask = new KXIChildTask();
  Summary = new KXIRegularTaskSummary();

  CheckPeerBranching() {
    cy.get(locators.administration.resellers.RMCheckbox).click({
      multiple: true,
      force: true,
    });
    cy.get(locators.administration.resellers.Submodule).should(
      "not.contain",
      "Peer Benchmarking"
    );
    cy.get(locators.administration.resellers.KxIcheckbox).click({
      multiple: true,
      force: true,
    });
    cy.get(locators.administration.resellers.KxiSubmodule).should(
      "contain",
      "Peer Benchmarking"
    );
  }

  SelectReseller() {
    cy.get(locators.administration.resellers.PagingSelect, {
      timeout: 10000,
    }).select("All");
    cy.waitForElementToVisible(
      locators.administration.resellers.SelectReseller,
      TIMEOUT_LONG
    );
    cy.get(locators.administration.resellers.SelectReseller).click();
  }

  SelectCustomer() {
    cy.get(locators.administration.resellers.PagingSelect, {
      timeout: 10000,
    }).select("All");
    cy.get(locators.administration.customers.reloadBtn, {
      timeout: 50000,
    }).click();
    cy.waitForElementToVisible(
      locators.administration.customers.selectCustomer,
      TIMEOUT_LONG
    );
    cy.get(locators.administration.customers.selectCustomer).click();
  }
  SelectResellerFromCustomer() {
    cy.get(locators.administration.customers.resellerDropdown).click();
    cy.get(locators.administration.customers.resellerDropdownSearch)
      .type("kxireseller")
      .type("{Enter}");
  }

  leftMenuKxiManagement() {
    cy.get(locators.menu.leftMenuKxI).click();
  }
  kxiManagement() {
    cy.get(locators.menu.kxIManagement).first().click();
  }
  kxiDataMenu() {
    cy.get(locators.kxi.kxiMenu.data).first().click();
  }
  lumifyAdmin() {
    cy.get(locators.menu.administration).click();
  }
  defineKxi() {
    cy.get(locators.kxi.DefineKxi).click();
  }
  auditLogBtn(name) {
    this.searchkxiName(name);
    cy.get(locators.kxi.kxiData.auditLogButton, { timeout: 50000 }).click();
    cy.get(locators.kxi.kxiData.auditLogModal, { timeout: 50000 }).should(
      "not.contain",
      "No Record Found"
    );
  }
  columnPickerBtn() {
    /** I add timeout to click column picker button */
    cy.get(locators.kxi.kxiData.columnPicker, { timeout: TIMEOUT_LONG })
      .should("be.visible")
      .click();
  }
  checkSorting() {
    cy.get(locators.kxi.kxiData.cellText).click({
      multiple: true,
      force: true,
    });
    cy.get(locators.kxi.kxiData.sorting).click({ multiple: true });
  }
  VerifyColumnnGroup() {
    cy.get(locators.kxi.kxiData.groupColHeader)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq("KXI Definition");
      });
  }
  verfiyDefaultColumns() {
    cy.get(locators.kxi.kxiData.cellText).should("not.contain", "Type");
    cy.get(locators.kxi.kxiData.cellText).should("not.contain", "Scope");
    cy.get(locators.kxi.kxiData.cellText).should("not.contain", "Metric");
    cy.get(locators.kxi.kxiData.cellText).should(
      "not.contain",
      "Regulatory Area(s)"
    );
    cy.get(locators.kxi.kxiData.cellText).should(
      "not.contain",
      "Business Unit(s)"
    );
  }
  verfiyTaskColumns() {
    cy.get(locators.kxi.kxiData.cellText).should("contain", "Task");
    cy.get(locators.kxi.kxiData.taskLocator, { timeout: 50000 })
      .should("contain", "view action")
      .eq(0)
      .click();
  }
  verfiyTaskButton() {
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 10000 })
      .eq(0)
      .click();
    cy.get(locators.kxi.kxiData.createTaskBtn).should("be.visible").click();
  }
  verfiyColumnsnotChecked() {
    cy.get(locators.kxi.kxiData.typeCheckbox)
      .scrollIntoView()
      .should("not.be.checked");
    cy.get(locators.kxi.kxiData.buCheckbox).should("not.be.checked");
    cy.get(locators.kxi.kxiData.metricCheckbox).should("not.be.checked");
    cy.get(locators.kxi.kxiData.regulatoryAreaCheckbox)
      .scrollIntoView()
      .should("not.be.checked");
    cy.get(locators.kxi.kxiData.scopeCheckbox).should("not.be.checked");
  }
  verfiyBU() {
    cy.get(locators.kxi.kxiData.typeCheckbox)
      .scrollIntoView()
      .should("not.be.checked");
    cy.get(locators.kxi.kxiData.buCheckbox).click({ force: true });
    cy.get(locators.kxi.kxiData.buText)
      .should("be.visible")
      .should("contain", "Business Unit(s)");

    this.columnPickerBtn();
    cy.get(locators.kxi.kxiData.cellText).should("contain", "Business Unit(s)");
  }

  verfiykxiCategory() {
    cy.get(locators.kxi.kxiData.kxicategoryCheckbox)
      .should("not.be.checked")
      .click();

    cy.get(locators.kxi.kxiData.kxiCategoryText)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq("KXI Category");
      });

    cy.get(locators.kxi.kxiData.cellText).should("contain", "KXI Category");
  }
  verifyNameColumn() {
    cy.get(locators.kxi.kxiData.cellText).should("contain", "Name");
  }
  verifyDefaultLayout() {
    cy.visitkxiData();
    cy.get(locators.kxi.kxiData.threeElepsis).should("be.visible").click();
    cy.get(locators.kxi.kxiData.restoreLayout)
      .contains("Restore Default Layout")
      .click();

    this.clearData();
  }
  verifyDefaultView() {
    cy.get(locators.kxi.kxiData.cellText).should("not.contain", "KXI Category");
    cy.get(locators.kxi.kxiData.cellText).should(
      "not.contain",
      "Business Unit(s)"
    );
  }
  verifyColumnPickerFilter() {
    cy.get(locators.kxi.kxiData.kxicategoryCheckbox).should("not.be.checked");
    cy.get(locators.kxi.kxiData.typeCheckbox)
      .scrollIntoView()
      .should("not.be.checked");
    cy.get(locators.kxi.kxiData.buCheckbox).should("not.be.checked");
  }

  verifyKXIDefinitionOnGrid() {
    cy.get(locators.kxi.kxiDefinition.numberOfRecordOnGrid).should(
      "have.length",
      1
    );
  }

  searchKxiDefinitionOnGrid(kxiDef) {
    cy.visitkxiDef();
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.kriDefinitionModalContainer,
      { timeout: 50000 }
    ).should("not.be.visible");
    cy.waitForTopMsgLoaderToDisappear(500000);
    cy.get(locators.kxi.kxiDefinition.numberOfRecordOnGrid, {
      timeout: 200000,
    }).should("be.visible");
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 20000 })
      .should("be.visible")
      .clear({ force: true })
      .type(kxiDef, { delay: 250 });
  }

  verifyKXIDefinitionOnGrid() {
    cy.get(locators.kxi.kxiDefinition.numberOfRecordOnGrid).should(
      "have.length",
      1
    );
  }

  addkxi() {
    cy.get(locators.kxi.kxiDefinition.ellipsesBtn).click();
    cy.get(locators.kxi.kxiDefinition.addBtn).click();
  }

  editKxi() {
    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 })
      .first()
      .click();
  }
  chooseIconLibrary() {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.chooseFromLibrary, {
      timeout: 30000,
    })
      .scrollIntoView()
      .click({ force: true });

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.totalIcon)
      .its("length")
      .should("be.greaterThan", 120);

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.selectIcon).click({
      force: true,
    });

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.iconAddbtn).click({
      force: true,
    });

    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.selectedIconText)
      .should("exist")
      .should("contain", data.imageIcon);
  }

  chooseFromBrowse() {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.browseButton)
      .scrollIntoView()
      .selectFile(
        `cypress/fixtures/KXIModule/KXIDataFREDImport/Attachments/icon.png`
      );
  }
  selectRoles() {
    cy.get(locators.menu.roles).click();
  }
  addRolebtn() {
    cy.get(locators.administration.roles.addRoleBtn).click();
  }

  verifyCategories() {
    cy.get(locators.administration.roles.kxiCategories)
      .scrollIntoView()
      .should("be.visible");
  }
  selectCustomerFromRole() {
    const customerName = "kxi Customer";
    cy.get(locators.administration.roles.addRoleForm.customer).select(
      customerName,
      { force: true }
    );
  }

  navigateToKxiDefAndOpenTaskModal() {
    cy.visitProfile();
    cy.visitkxiDef();
    cy.reload();
  }
  verifyUpdateTaskButton() {
    cy.waitForElementToVisible(
      locators.kxi.updateTask.updateButton,
      TIMEOUT_LONG
    );
    cy.get(locators.kxi.updateTask.updateButton, { timeout: 50000 })
      .should("be.visible")
      .contains("KXI Update Task")
      .trigger("mouseover", { force: true })
      .should("have.attr", "title", "Schedule Recurring Data Entry Task");
  }

  verifyUpdateTaskModal() {
    cy.reload();
    cy.waitForElementToVisible(
      locators.kxi.updateTask.updateButton,
      TIMEOUT_LONG
    );
    cy.waitForLoaderToDisappear("agGrid", TIMEOUT_LONG);
    cy.get(locators.kxi.updateTask.updateButton, {
      timeout: TIMEOUT_LONG,
    })
      .focus()
      .click({ force: true });
    cy.get(locators.kxi.updateTask.updateModal)
      .should("be.visible")
      .contains("KXI Update Task");
  }
  verifyOwnerType() {
    cy.get(locators.kxi.updateTask.modalLabel).contains("Owner Type");
    cy.get(locators.kxi.updateTask.radioButtons).contains("Single");
    cy.get(locators.kxi.updateTask.radioButtons).contains("Group");
  }
  selectColumn() {
    cy.get(locators.kxi.kxiDefinition.colPickerButton).click();
    cy.get(locators.kxi.kxiDefinition.dataEntryTypeCheckbox)
      .scrollIntoView()
      .click();
  }

  getName(query) {
    cy.get(locators.kxi.updateTask.kxiDropdown).click();
    cy.get(locators.kxi.updateTask.kxiOptions).then((uiData) => {
      // Fetch data from the database
      cy.query(query).then((res) => {
        const dbData = res.map((result) => result.name.trim().toLowerCase());
        const dbDataString = dbData.join("");
        const text = uiData.text().trim().toLowerCase();
        expect(dbDataString).to.equal(text);
      });
    });
  }

  verifySingleOwner() {
    cy.get(locators.kxi.updateTask.radioButtons).contains("Single").click();
    cy.get(locators.kxi.updateTask.ownerDropdown).click();
    cy.get(locators.kxi.updateTask.ownerDropdownSearch)
      .type(Cypress.env("kxi").customer.decision.username)
      .type("{Enter}");
  }

  verifyGroupOwner() {
    cy.get(locators.kxi.updateTask.radioButtons).contains("Group").click();
    cy.get(locators.kxi.updateTask.ownerDropdown).click({ force: true });
    cy.get(locators.kxi.updateTask.ownerDropdownSearch)
      .type("kxi")
      .type("{Enter}");
    cy.get(locators.kxi.updateTask.kxiDropdown).click({ force: true });
  }
  verifyKxiDropdown() {
    cy.get(locators.kxi.updateTask.krimultiselect)
      .should("have.attr", "class")
      .and("include", "select2-container-multi");
  }
  optimizeMethods() {
    cy.visitProfile();

    cy.visitkxiDef();

    this.verifyUpdateTaskModal();

    this.verifySingleOwner();
  }

  verifyOneTaskCreatedwithOneManual(kxi) {
    cy.get(locators.kxi.updateTask.kxiDropdown, { timeout: 100000 })
      .should("be.enabled")
      .click();
    cy.get(locators.kxi.updateTask.kxiOptions).should("not.contain", kxi);
    // cy.get(locators.kxi.updateTask.kxiOptions).should("contain", "Kxi mini");
  }
  verifyCreateButton(kxiName) {
    cy.get(locators.kxi.updateTask.kxiDropdown, { timeout: 100000 })
      .should("be.enabled")
      .click();

    cy.wait(TIMEOUT_SHORT);
    cy.get(locators.kxi.updateTask.kxiOptions)
      .contains(kxiName)
      .click({ force: true });

    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");

      cy.get(locators.kxi.updateTask.createButton).click();

      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          const finalURL = mainURL + newTabUrl;

          cy.visit(finalURL);

          cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
            () => {
              cy.get(locators.kxi.decisionTask.decisionTaskTitle, {
                timeout: 20000,
              })
                .should("be.visible")
                .contains("Kxi Update Task");
            }
          );
        });
    });
  }

  verifyWarningMessageDisplayed(msg, kxiName) {
    cy.get(locators.kxi.updateTask.nameKxi)
      .contains(kxiName)
      .should("exist")
      .parents("div[role='row']")
      .within(() => {
        cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 }).click();
      });
    cy.get(
      locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
    ).click();
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeSearch)
      .type("Auto")
      .type("{Enter}");

    cy.get(locators.kxi.updateTask.warningMsg)
      .should("be.visible")
      .then((el) => {
        expect(el.text().trim()).to.eq(msg);
      });
  }

  verifyModalBehaviour(btnLocator) {
    if (btnLocator === true) {
      cy.get(locators.kxi.updateTask.yesBtn).click();
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
      ).contains("Automatic");
    } else {
      cy.get(locators.kxi.updateTask.noBtn).click();
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
      ).contains("Manual");
    }
  }
  verifyTaskLink() {
    cy.visitkxiDef();
    cy.get(locators.kxi.updateTask.taskLink).eq().should("not.exist");
  }

  VerifyManualDataEntry() {
    cy.get(locators.kxi.updateTask.manualDataEntry)
      .scrollIntoView()
      .should("be.visible");
  }
  VerifyManualDataEntryOnDefinition() {
    cy.get(locators.kxi.updateTask.defmanualDataEntry, {
      timeout: 50000,
    }).should("be.visible");
  }
  searchkxiName(kxiName) {
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear()
      .wait(4000)
      .type("{selectall}{backspace}")
      .type(kxiName, { delay: 250 });
  }

  searchSampleDate(time) {
    cy.get(locators.kxi.kxiDefinition.sampleDateSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 300 })
      .type(kxiName, { delay: 250 });
  }

  searchSampleDate(time) {
    cy.get(locators.kxi.kxiDefinition.sampleDateSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 300 })
      .type(time, { delay: 250 });
  }

  clearData() {
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear()
      .wait(4000)
      .type("{selectall}{backspace}");

    cy.get(locators.kxi.kxiDefinition.sampleDateSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 300 });
  }

  verifyTaskSummary(kxiName) {
    cy.get(locators.kxi.updateTask.nameKxi, { timeout: 50000 })
      .should("be.visible")
      .contains(kxiName)
      .parents("div[role='row']")
      .within(() => {
        cy.get(locators.kxi.updateTask.taskLink)
          .as("taskLink")
          .invoke("attr", "href")
          .then((href) => {
            const fullUrl = href.startsWith("http")
              ? href
              : `${mainURL}${href}`;

            cy.get("@taskLink").invoke("removeAttr", "target").first().click();

            cy.visit(fullUrl);
          });
      });

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {});
  }
  getKxiName() {
    const kxiName = cy
      .get(locators.kxi.updateTask.nameKxi)
      .eq(0)
      .should("be.visible")
      .then((el) => {
        el.text().trim();
      });

    return kxiName;
  }
  verifyKxionSummaryForm(kxiName) {
    cy.get(locators.kxi.updateTask.nameKxi)
      .contains(kxiName)
      .should("exist")
      .parents("div[role='row']")
      .within(() => {
        cy.get(locators.kxi.updateTask.taskLink)
          .as("taskLink")
          .invoke("attr", "href")
          .then((href) => {
            const fullUrl = href.startsWith("http")
              ? href
              : `${mainURL}${href}`;

            cy.get("@taskLink").invoke("removeAttr", "target").first().click();

            cy.visit(fullUrl);
          });
      });

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.decisionSummary, {
        timeout: 20000,
      }).should("have.text", "Summary");
      cy.readFile(assigneeName).then((file) => {
        this.verifyAssignee(file.assigneeName);
      });
      cy.get(locators.kxi.decisionTask.decisionLabel, {
        timeout: 20000,
      }).contains(kxiName);
    });
  }
  verifyValidationMsg(user) {
    cy.get(locators.kxi.updateTask.createButton).click();
    cy.get(locators.administration.toastMsg).contains(
      "Please select a owner or group owner."
    );

    cy.get(locators.kxi.updateTask.ownerDropdown).click();
    cy.get(locators.kxi.updateTask.ownerDropdownSearch)
      .type(user)
      .type("{Enter}");
    cy.get(locators.kxi.updateTask.createButton).click();
    cy.get(locators.administration.toastMsg).contains(
      "Please select at least one KXI Definition."
    );
  }
  /**Add Kxi Definition from Define Kxi Screen taking
   * @param {number} kriValue kxi value
   * @param {number} LeftOnene Left Trigger value 1
   *  @param {number} LeftTwo Left Trigger value 2
   *  @param {number} LeftThree Left Trigger value 3
   *  @param {number} RightOne Right Trigger value 1
   * @param {number} RightTwo Right Trigger value 2
   * @param {number} RightThree  Right Trigger value 3
   * @param {string}  userName  Login username for entering owner
   */
  addKxiDefinition(
    kxiValue,
    leftOnene,
    leftTwo,
    leftThree,
    rightOne,
    rightTwo,
    rightThree,
    userName = null,
    customField = null,
    automatic = false,
    edited = false,
    flag = false,
    errorMsg = null,
    viewOwner = null,
    decision = false
  ) {
    if (!edited) {
      //wait for disappearing of toastr message(Jenkins specific)
      cy.wait(4000);
      cy.get(locators.kxi.kxiDefinition.ellipsesBtn, {
        timeout: 30000,
      })
        .if("exists")
        .click();
      cy.get(locators.kxi.kxiDefinition.addBtn).if("exists").click();
    }
    if (automatic === true) {
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
      ).click();
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeSearch)
        .type("Automatic")
        .type("{Enter}");
    } else {
      cy.get(
        locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeDropdown
      ).click();
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.dataEntryTypeSearch)
        .type("Manual")
        .type("{Enter}");
    }

    cy.readFile(writeDataFilePath).then((file) => {
      const kxiName = "ZZ Kxi definition";
      const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
      const finalName = kxiName + timeStamp;

      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.name)
        .clear({ force: true })
        .type(finalName);
      file.kxiName = finalName;
      cy.writeFile(writeDataFilePath, file);

      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.kxiID)
        .clear({ force: true })
        .type("kxi")
        .type(timeStamp);
      this.addDescription(data.description);
      if (decision === false) {
        this.selectCategory(true);
      }

      if (userName) {
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.owner).click();
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.ownerSearch)
          .type(userName)
          .type("{Enter}");
      } else {
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.owner).click();
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.ownerSearch)
          .type(Cypress.env("kxi").customer.decision.username)
          .type("{Enter}");
      }

      if (viewOwner) {
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.viewOwner).click();
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.ownerSearch)
          .type(viewOwner)
          .type("{Enter}");
      }

      if (edited) {
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.kriScoptBusinessUnitRisk
        )
          .parent()
          .click();
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.thresholdPercentageType
        )
          .parent()
          .click();

        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.measurementPeriodDropdown
        )
          .click()
          .then(() => {
            cy.get(
              locators.kxi.kxiDefinition.kriDefinitionForm
                .selectMeasurementPeriodValue
            )
              .contains("div", "Quarterly")
              .click();
          });
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.negativeRadioLeftTrigger
        ).click();
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.positiveRadioRightTrigger
        ).click();
      } else {
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.positiveContent
        ).click();
        cy.get(
          locators.kxi.kxiDefinition.kriDefinitionForm.negativeContent
        ).click();
      }

      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.target)
        .clear({ force: true })
        .type(kxiValue);

      // Left and Right trigger levels
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLevel1)
        .clear({ force: true })
        .type(leftOnene);
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLevel2)
        .clear({ force: true })
        .type(leftTwo);
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.leftTriggerLevel3)
        .clear({ force: true })
        .type(leftThree);

      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLevel1)
        .clear({ force: true })
        .type(rightOne);
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLevel2)
        .clear({ force: true })
        .type(rightTwo);
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.rightTriggerLevel3)
        .clear({ force: true })
        .type(rightThree);

      if (customField === true) {
        cy.readFile(customFilePath).then((file) => {
          cy.get(locators.kxi.kxiDefinition.customField.labelText)
            .contains(file.customName)
            .parent()
            .within(() => {
              this.fillCustomField(file.customName);
            });
        });
      }

      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveButton).click();
      if (flag === true) {
        this.verifyCustomFieldValidationMsg(errorMsg);
      }

      cy.then(() => {
        // Validate it in the grid
        if (flag === true) {
          cy.log("No need to search");
        } else {
          this.searchKxiDefinitionOnGrid(finalName);

          this.verifyKXIDefinitionOnGrid();
        }
      }).then(() => {
        return finalName; // Now we return finalName asynchronously within Cypress command chain
      });
    });
  }

  /**Verify toastr msg for mandatory Custom Field on "Add" flyout of  Define KXI's screen 
   * @param {string} toastMsg the text of Toast Msg
 
   */
  verifyCustomFieldValidationMsg(toastMsg) {
    cy.get(locators.administration.toastMsg)
      .contains(toastMsg)
      .should("be.visible");
  }
  validateKxionCreationForm(kxiName) {
    cy.get(locators.kxi.updateTask.kxiDropdown, { timeout: 50000 })
      .should("be.enabled")
      .click();

    cy.wait(TIMEOUT_SHORT);
    cy.get(locators.kxi.updateTask.kxiOptions)
      .contains(kxiName)
      .click({ force: true });

    cy.window().then((win) => {
      // Stub window.open to capture the new tab/window URL
      cy.stub(win, "open").as("windowOpen");

      // Click the "Create" button to trigger the window.open
      cy.get(locators.kxi.updateTask.createButton).click();

      // Assert window.open was called and extract the URL
      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          // If required, set authentication cookies or tokens before visiting the URL
          const finalURL = mainURL + newTabUrl;

          // Visit the captured URL in the same Cypress window
          cy.visit(finalURL);

          // Wait for the page to load

          // Switch to the iframe and interact with elements inside it
          cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
            () => {
              cy.get(locators.kxi.decisionTask.decisionLabel, {
                timeout: TIMEOUT_LONG,
              }).contains(kxiName);
            }
          );
        });
    });
  }
  getfield(name) {
    cy.url().then((initialUrl) => {
      // Extract query parameters
      const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
      // Extract 'kxiDefId' from the URL
      const OwnerId = urlParams.get("Owner");
      cy.url().should("include", OwnerId);
    });
    return cy
      .contains("label", name)
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.decisionInput)
      .should("be.visible");
  }

  getAttachment(name) {
    return cy
      .contains("label", name)
      .closest("section")
      .next("section")
      .find(locators.kxi.decisionTask.decisionAttachment);
  }

  getAssignee() {
    this.getfield(/^Assignee$/);
  }
  getAttachmentField() {
    this.getAttachment("Attachment(s)");
  }
  verifyUnlink(kxiName, text) {
    cy.wait("@decision", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.intercept("POST", getAll).as("element");

    cy.wait("@element", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame, {
      timeout: 50000,
    }).within(() => {
      cy.get(locators.kxi.decisionTask.decisionUnlink, { timeout: 50000 })
        .contains("Unlink")
        .should("exist")
        .click();
      this.validateModalText(text, kxiName);
      cy.contains(locators.kxi.decisionTask.enterData, "(Enter Data)").should(
        "not.exist"
      );
    });
  }
  verifyEnterDatalink() {
    cy.wait("@decision", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.intercept("POST", getAll).as("element");

    cy.wait("@element", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame, {
      timeout: 50000,
    }).within(() => {
      cy.get(locators.kxi.decisionTask.enterData, { timeout: 50000 })
        .scrollIntoView()
        .should("exist")
        .and("be.visible")
        .and("include.text", "(Enter Data)")
        .click();
    });
  }

  validateModalText(text, kxiName) {
    cy.contains("label", text, { timeout: 20000 }).should("be.visible");
    cy.contains("button", "Yes").click();
    cy.get(locators.kxi.decisionTask.decisionLabel, { timeout: 20000 }).should(
      "not.contain",
      kxiName
    );
  }
  clickEnterData() {
    cy.readFile(writeDataFilePath).then((file) => {
      this.Summary.shouldClicksOnEnterDataLink();
      cy.get(locators.kxi.updateTask.namekxiData, { timeout: 50000 }).should(
        "contain",
        file.kxiName
      );
    });
  }

  /**Enter Kxi data 
   * @param {string} kxiName kxi Defination name from write file
   *  @param {number} kriValue kxi value
   * @param {boolean} customField (optional field) Enter data in added Custom Fields
 
   */
  addKxiData(kxiName, kriValue, customField = null, Automatic = null) {
    cy.visitkxiData();
    cy.get(locators.kxi.kxiData.threeElepsis).click();
    cy.get(locators.kxi.kxiData.clickAdd).click();
    cy.wait(TIMEOUT_SHORT);

    // Promise-based approach to click until dropdown is loaded
    const clickUntilVisible = (maxClicks) => {
      return new Cypress.Promise((resolve, reject) => {
        let clickCount = 0;

        function clickDropdown() {
          // Exit if max click count is exceeded
          if (clickCount >= maxClicks) {
            reject(
              new Error(
                `Max clicks reached (${maxClicks}), "No Results" still visible`
              )
            );
            return;
          }

          cy.get(locators.kxi.kxiData.modal.kxiDefinitionDropdown).click();
          cy.get("body").then(($body) => {
            const noResultsVisible =
              $body.find(locators.kxi.kxiData.modal.noResults).length > 0;

            // Log if "No Results" is found or not
            cy.log(
              `Attempt ${
                clickCount + 1
              }: No Results visible? ${noResultsVisible}`
            );

            if (noResultsVisible) {
              cy.get(locators.kxi.kxiData.modal.noResults, {
                timeout: 10000,
              }).then(($search) => {
                if ($search.is(":visible")) {
                  cy.get(
                    locators.kxi.kxiData.modal.kxiDefinitionDropdownmask
                  ).click();
                  clickCount += 1;
                  cy.log(`Clicking again, attempt ${clickCount}`);
                  clickDropdown(); // Recursive call for multiple attempts
                } else {
                  cy.log(`No Results are not visible, proceeding with search`);
                  resolve(); // If noResults is not visible, resolve the promise
                }
              });
            } else {
              cy.log(`No Results element not found, proceeding with search`);
              resolve(); // No "No Results" message found, resolve
            }
          });
        }

        // Start the recursive click function
        clickDropdown();
      });
    };

    // Call the function with a maximum of 60 attempts
    clickUntilVisible(60)
      .then(() => {
        cy.log("Proceeding after dropdown handling is complete");

        // Now that dropdown handling is complete, proceed with KXI search
        cy.get(locators.kxi.kxiData.modal.kxiSearch)
          .should("be.visible")
          .type(kxiName)
          .type("{Enter}");

        if (Automatic === true) {
          cy.get(locators.kxi.kxiData.modal.noResults, {
            timeout: 10000,
          }).should("be.visible");
        } else {
          const timeStamp = dayjs().format("MM/DD/YYYY");
          cy.get(locators.kxi.kxiData.modal.kriValue, { timeout: 10000 }).type(
            kriValue,
            { force: true }
          );
          cy.get(locators.kxi.kxiData.modal.sampleDate, { timeout: 30000 })
            .type(timeStamp, { force: true })
            .type("{Enter}");

          // Handle custom fields if provided
          if (customField === true) {
            cy.readFile(customFilePath).then((file) => {
              cy.get(locators.kxi.kxiDefinition.customField.labelText)
                .contains(file.customName)
                .parent()
                .within(() => {
                  this.fillCustomField(file.customName);
                });
            });
          }

          // Submit the form and verify submission
          cy.get(locators.kxi.kxiData.modal.submitBtn).click({ force: true });
          cy.waitForElementToVisible(
            locators.administration.users.toastMsg,
            TIMEOUT_LONG
          );
          cy.get(locators.administration.users.toastMsg).should("be.visible");
        }
      })
      .catch((error) => {
        // Handle any errors (like max clicks reached)
        cy.log(error.message);
      });
  }

  /**Verify the Data Entry button visibilty and text
   * Focus on the Data Entry button
   * @param {string} text the text of "Data Entry" button
 
   */
  verifyDataEntrybtn(text) {
    return cy
      .get(locators.kxi.kxiData.dataEntrybtn, { timeout: TIMEOUT_LONG })
      .focus()
      .should("be.visible")
      .should("contain", text); //I pass text as argument and then get from fixture file
  }

  /**Verify  A single "Save All" button is displaying
   */
  verifySaveBtn() {
    cy.get(locators.kxi.kxiData.saveBtn, { timeout: 50000 }).should(
      "be.visible"
    );
  }

  /**Verify the grid should remove individual row-level "Save" buttons*/

  verifyIndividualRowSaveBtn() {
    cy.get(locators.kxi.kxiData.gridSave, { timeout: 10000 }).should(
      "not.be.visible"
    );
  }
  /**Verify validation message should be displayed when user leave this mandatory field
   * leave value field in first row
   * leave sample date field in second row
   * Click Save button
   * Validate error message
   * @param {number} kriValue the kri value
   */
  verifyMandatoryField(kriValue) {
    cy.get(locators.kxi.kxiData.kriColValue, { timeout: 20000 }).eq(1).click();
    cy.get(locators.kxi.kxiData.kriValueInput, { timeout: 20000 })
      .eq(0)
      .type(kriValue);
    cy.get(locators.kxi.kxiData.sampleDateInput, { timeout: 20000 })
      .eq(2)
      .click();

    cy.get(locators.administration.toastMsg, { timeout: 10000 }).contains(
      "Ensure the highlighted field is filled"
    );
  }
  /**Verify Data Entry data is saved Successfully
   * Click Data Entry button
   * Enter kri Value
   * Enter Sample Date one day before
   * Click Save button
   * Validate success message
   * @param {number} kriValue the kri value
   */
  verifyKriValueSavedSuccessfully(kriValue, kxiName) {
    this.verifyDataEntrybtn("Data Entry").click({ force: true });
    this.verifySaveBtn();
    this.searchkxiName(kxiName);
    cy.get(locators.kxi.kxiData.kriColValue, { timeout: TIMEOUT_LONG })
      .eq(1)
      .should("be.visible")
      .focus()
      .click();
    cy.get(locators.kxi.kxiData.kriValueInput, { timeout: TIMEOUT_LONG })
      .eq(0)
      .type(kriValue);
    cy.get(locators.kxi.kxiData.sampleDateInput).eq(1).click();

    // Get the timestamp for 1 day before today
    const timeStamp = dayjs().format("MM/DD/YYYY");
    cy.get(locators.kxi.kxiData.sampleDateInputFocus).eq(0).type(timeStamp);
    cy.get(locators.kxi.kxiData.commentInput).eq(1).focus().click();
    cy.get(locators.kxi.kxiData.saveBtn, { timeout: 20000 })
      .focus()
      .click({ force: true });
    cy.waitForElementToVisible(locators.administration.users.toastMsg, 50000);
    cy.get(locators.administration.users.toastMsg, { timeout: 10000 }).contains(
      "Records Saved Successfully"
    );
  }
  /**Verify Exit Data Entry button text
   * Verify modal is opened by its text
   * Verify text of Data Entry button after existing of modal
   * @param {string} text the text of "Data Entry" button
   *  @param {string} modalTex the text of opened modal
   */
  verifyDataEntrybtnExit(text, modalText) {
    cy.get(locators.kxi.kxiData.dataEntrybtn, { timeout: 200000 })
      .should("be.visible")
      .click({ force: true });
    this.verifyDataEntrybtn(text).click({ force: true });
    cy.get(locators.kxi.kxiData.dataEntryModal.modal)
      .should("be.visible")
      .should("have.text", modalText);
    cy.get(locators.kxi.kxiData.dataEntryModal.yesBtn).click();

    cy.get(locators.kxi.kxiData.dataEntrybtn)
      .should("be.visible")
      .should("have.text", "Data Entry");
  }

  verifyTaskSummaryonkxiData() {
    cy.get(locators.kxi.updateTask.datataskLink)
      .as("taskLink")
      .eq(0)
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("http") ? href : `${mainURL}${href}`;

        // Step 3: Remove the target and click the link
        cy.get("@taskLink")
          .eq(0)
          .invoke("removeAttr", "target")
          .first()
          .click();

        // Step 4: Visit the full URL
        cy.visit(fullUrl);
      });

    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.decisionSummary, {
        timeout: 20000,
      }).should("have.text", "Summary");
    });
  }

  verifyDashboardTitle() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.contains(
        "label",
        locators.kxi.decisionTask.kxiTaskDashboard.dashboardTitle,
        {
          timeout: 120000,
        }
      ).should("be.visible");
    });
  }

  verifyDashboardColumns() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
      ($frame) => {
        [
          taskData.fieldNames.summary,
          taskData.fieldNames.assignee,
          taskData.fieldNames.dueDate,
          taskData.fieldNames.status,
          taskData.fieldNames.createdBy,
          taskData.fieldNames.created,
        ].forEach((column) => {
          cy.get($frame)
            .find(locators.kxi.decisionTask.verifyTaskListColumns, {
              timeout: 1500000,
            })
            .should("be.visible")
            .contains(column, { timeout: 250000 });
        });
      }
    );
  }

  verifyAllTasksSelectedByDefault() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
      ($iframe) => {
        cy.get($iframe)
          .find('[placeholder="Search For Task Status"]', { timeout: 80000 })
          .should("exist")
          .and("be.visible");
        cy.contains("All Tasks").should("exist");
      }
    );
  }

  sortWithCreatedDate() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      for (let i = 0; i < 2; i++) {
        cy.get(locators.kxi.decisionTask.createdDateSplitter)
          .should("exist")
          .and("be.visible")
          .parent()
          .children("button")
          .first()
          .click({ delay: 1500 });

        cy.get(locators.kxi.decisionTask.sortCreatedDate)
          .should("be.visible")
          .last()
          .click({ delay: 1500 });
        cy.wait(3000);
      }
    });
  }

  sortWithStatus() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      for (let i = 0; i < 2; i++) {
        cy.get(locators.kxi.decisionTask.statusSortSplitter)
          .should("exist")
          .and("be.visible")
          .parent()
          .children("button")
          .first()
          .click({ delay: 1500 });

        cy.get(locators.kxi.decisionTask.sortCreatedDate)
          .should("be.visible")
          .last()
          .click({ delay: 1500 });
        cy.wait(3000);
      }
    });
  }

  writeCurrentDate() {
    cy.readFile(taskFilePath).then((file) => {
      const currentDate = dayjs().format("MM/DD/YYYY");
      file.createdDate = currentDate;
      cy.writeFile(taskFilePath, file);
    });
  }

  formatDueDateFormat(dueDate) {
    // Remove leading zeros from date format to match UI display
    // Split the date and remove leading zeros from month and day components
    const dateParts = dueDate.split("/");
    let formattedDueDate = dueDate; // fallback to original

    if (dateParts.length === 3) {
      const month = dateParts[0].replace(/^0+/, "") || "0"; // Remove leading zeros, keep at least one digit
      const day = dateParts[1].replace(/^0+/, "") || "0"; // Remove leading zeros, keep at least one digit
      const year = dateParts[2];
      formattedDueDate = `${month}/${day}/${year}`;
    }
    return formattedDueDate; // Return the formatted date
  }

  verifyDueDate(dueDate) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskSection, { timeout: 180000 })
        .contains(dueDate, { timeout: 80000 })
        .should("be.visible", { timeout: 80000 });
    });
  }

  verifyCreatedTaskName(taskSummary) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.topSortedTask, { timeout: 70000 })
        .eq(0)
        .contains(taskSummary, { timeout: 20000 });
    });
  }

  searchTaskName(taskName) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.searchTaskButton, {
        timeout: 20000,
      }).click({ force: true });
      cy.get(locators.kxi.decisionTask.searchTask, {
        timeout: 20000,
      })
        .click({ force: true })
        .clear({ force: true })
        .type("{selectall}{backspace}", { force: true })
        .type(taskName, { delay: 150, force: true })
        .type("{enter}");
    });
  }

  clickEditButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.verifyTaskListColumns, {
        timeout: 80000,
      })
        .contains("Edit", { timeout: 80000 })
        .should("be.visible")
        .click({ force: true });
    });
  }

  clickAssigneeButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.verifyTaskListColumns, {
        timeout: 80000,
      })
        .contains(data.assignButton, { timeout: 80000 })
        .should("be.visible")
        .click({ force: true });
    });
  }

  clickCommentButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.verifyTaskListColumns, {
        timeout: 80000,
      })
        .contains(data.commentBtn, { timeout: 80000 })
        .should("be.visible")
        .click({ force: true });
    });
  }
  enterComment(comment) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.commentTextarea, { timeout: 80000 })
        .should("be.visible")
        .type(comment, { delay: 150, force: true });
      cy.get(locators.kxi.decisionTask.commentSaveButton, { timeout: 80000 })
        .contains(data.saveButton)
        .should("be.visible")
        .click({ force: true });
    });
  }
  verifyAddedComment(comment) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.commentComponent, { timeout: 100000 })
        .scrollIntoView()
        .wait(10000)
        .click({ force: true });

      cy.get(locators.kxi.decisionTask.commentInGrid, {
        timeout: 100000,
      }).contains(comment);
    });
  }

  clickManageWatcher() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.childTask.morePlaceholder, {
        timeout: 80000,
      }).type(data.mangeWatchers);
      cy.get(locators.kxi.decisionTask.childTask.dataFlowLink, {
        timeout: 5000,
      })
        .eq(2)
        .click();
    });
  }
  selectWatcherUser(watcher) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.childTask.manageWatcherInput, {
        timeout: 100000,
      })
        .type(watcher)
        .type("{enter}");

      cy.wait(2000); // Wait for the watcher to be added
      cy.get(locators.kxi.kxiData.kxiRegularTask.createButton, {
        timeout: 20000,
      })
        .contains(data.saveButton)
        .click();
    });
  }
  validateWatcherUser(watcher) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.childTask.manageInput, {
        timeout: 100000,
      })
        .eq(1)
        .click();

      cy.get("span[title='" + watcher + "']", {
        timeout: 100000,
      }).should("exist");
    });
  }

  selectAssigneeUser(assignee) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.kxiData.kxiRegularTask.assigneeInputSearch)
        .eq(1)
        .type(assignee, {
          delay: 220,
        });
    });
  }

  clickSubmitButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.kxiData.kxiRegularTask.createButton)
        .contains(defdata.kxiDefinition.submitButton)
        .click();
    });
  }

  verifySummaryFieldCharacterLimit(summaryMaxLength) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      // Test with exactly 233 characters (should be accepted)
      const validSummary = "A".repeat(234);

      cy.get(locators.kxi.decisionTask.taskSummaryField, { timeout: 90000 })
        .should("be.visible")
        .and("have.attr", "maxlength", summaryMaxLength);
      // Clear the field and enter 234 characters
      cy.get(locators.kxi.decisionTask.taskSummaryField, { timeout: 90000 })
        .should("be.visible")
        .eq(0)
        .clear({ force: true })
        .type(validSummary, { force: true });

      // Verify the text was entered successfully
      cy.get(locators.kxi.decisionTask.taskSummaryField)
        .eq(0)
        .should("have.value", validSummary);
    });
  }

  editSummaryField(updatedSummaryName, empty = false) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      const summaryInput = cy
        .get(locators.kxi.decisionTask.taskSummaryField, { timeout: 20000 })
        .should("be.visible")
        .eq(0)
        .clear({ force: true });
      if (!empty) {
        summaryInput.type(updatedSummaryName, { delay: 150, force: true });
      }
    });
  }

  clickSaveButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.saveButton, { timeout: 120000 })
        .last()
        .should("be.visible")
        .click({ force: true });
    });
  }

  verifySaveBtnVisible() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.saveButton, { timeout: 120000 })
        .last()
        .should("be.visible");
    });
  }

  editAssigneeField(assigneeName) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskAssignee, { timeout: 20000 })
        .scrollIntoView()
        .clear({ force: true })
        .type(assigneeName, { delay: 150, force: true })
        .type("{enter}");
    });
  }

  editPriorityField(prioritySet) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskPriority, { timeout: 20000 })
        .scrollIntoView()
        .clear({ force: true })
        .type(prioritySet, { delay: 150, force: true })
        .type("{enter}");
    });
  }

  editCategoryField(updatedCategory) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskCategory, { timeout: 50000 })
        .last()
        .scrollIntoView()
        .clear({ force: true })
        .type(updatedCategory, { delay: 150, force: true })
        .type("{enter}");
    });
  }

  editBusinessUnit() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskBusinessUnit, { timeout: 80000 })
        .eq(0)
        .scrollIntoView()
        .should("be.visible")
        // .click({ force: true })
        .type("{downarrow}", { delay: 150 })
        .type("{enter}", { delay: 150 });
    });
  }

  editSite(updatedSiteName) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskSite, { timeout: 100000 })
        .eq(1)
        .scrollIntoView()
        .should("be.visible")
        .type(updatedSiteName, { delay: 150, force: true })
        .type("{enter}", { delay: 150 });
    });
  }

  editRecurrence(recorrunceType) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskRecurrence, { timeout: 80000 })
        .scrollIntoView()
        .should("be.visible")
        .click({ force: true })
        .clear({ force: true })
        .type(recorrunceType, { delay: 150 })
        .type("{enter}", { delay: 150 });
    });
  }

  attachValidFile(fileName = "sample.pdf") {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      // Method 1: Try using the Choose File(s) button
      cy.get(locators.kxi.decisionTask.taskAttachFile, { timeout: 80000 })
        .scrollIntoView()
        .should("be.visible")
        .selectFile(`cypress/attachment/${fileName}`, {
          action: "drag-drop",
          force: true,
        });
    });
  }
  editStatusField(status) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.createdTaskStatus, { timeout: 50000 })
        .contains(status, { timeout: 50000 })
        .should("be.visible")
        .click({ force: true });
    });
  }

  verifyInProgressStatus(status) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.verifyTaskStatus, { timeout: 50000 })
        .contains(status, { timeout: 50000 })
        .should("be.visible");
    });
  }

  editDescriptionField(updatedDescription) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.taskDescriptionField, { timeout: 80000 })
        .should("exist")
        .click({ force: true }) // Focus the editor
        .then(($el) => {
          const editorEl = $el[0];

          // Clear existing content first
          editorEl.focus();

          // Select all content and delete it
          const selection = editorEl.ownerDocument.getSelection();
          const range = editorEl.ownerDocument.createRange();
          range.selectNodeContents(editorEl);
          selection.removeAllRanges();
          selection.addRange(range);

          // Clear the content
          editorEl.ownerDocument.execCommand("delete", false, null);

          // Insert the new content directly
          editorEl.ownerDocument.execCommand(
            "insertText",
            false,
            updatedDescription
          );
        });
    });
  }

  clickCreatedTaskForEdit(taskSummaryName) {
    cy.wait(4000);
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      // Use the existing searchTaskInPage method which handles pagination
      this.searchTaskInPage(taskSummaryName);
    });
  }

  allDataEntryTasks() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.contains(
        "a",
        locators.kxi.decisionTask.kxiTaskDashboard.allDataTasks,
        {
          timeout: 120000,
        }
      )
        .should("be.visible")
        .click();
    });
  }
  navigateToDashboard() {
    cy.visitProfile();
    this.kxitaskDashboadmenu();
  }
  validateTaskButtonOnDashboard(kxiTaskDashboard) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.createRegularButton, {
        timeout: 350000,
      })
        .contains("Create Task", { timeout: 350000 })
        .should("be.visible")
        .click();
    });
    this.createRegularTask(kxiTaskDashboard);
  }
  navigateToDashboardClickDataTasks() {
    this.navigateToDashboard();
    this.allDataEntryTasks();
  }

  clickExportButton() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.verifyTaskListColumns, {
        timeout: 80000,
      })
        .contains(data.exportButton, { timeout: 80000 })
        .should("be.visible")
        .click({ force: true });
    });
  }

  downloadWord() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.kxiData.kxiRegularTask.createButton, {
        timeout: 80000,
      })
        .contains(data.wordDownload, { timeout: 80000 })
        .should("be.visible")
        .click({ force: true });
      cy.get(locators.kxi.kxiData.downloadBtn, {
        timeout: 80000,
      })
        .should("be.visible")
        .click();
    });
  }
  verifyHyperlink() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.summaryLink, {
        timeout: TIMEOUT_LONG,
      }).should("have.prop", "tagName", "A");
    });
  }
  verifyPagination() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.pagination, {
        timeout: TIMEOUT_LONG,
      }).should("exist");
    });
  }
  createUpdateTask(username) {
    this.navigateToKxiDefAndOpenTaskModal();

    this.addKxiDefinition(
      data.kxiValue,
      data.Left1,
      data.Left2,
      data.Left3,
      data.Right1,
      data.Right2,
      data.Right3,
      username,
      null,
      false,
      false,
      false,
      null,
      null,
      true
    );

    this.verifyUpdateTaskModal();

    this.verifySingleOwner();
    cy.readFile(writeDataFilePath).then((file) => {
      this.createTask(file.kxiName);
    });
  }
  verifyNewlyCreatedTask(task) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      this.searchTaskInPage(task);
    });
  }

  searchTaskInPage(task) {
    // Search for the task in the current page
    cy.get(locators.kxi.decisionTask.kxiTaskDashboard.summaryLink, {
      timeout: 150000,
    }).then(($links) => {
      const taskFound = Array.from($links).some((link) =>
        link.innerText.includes(task)
      );

      if (taskFound) {
        // If the task is found, perform any required actions
        cy.log(`Task "${task}" found on this page`);
        cy.get(locators.kxi.decisionTask.kxiTaskDashboard.summaryLink, {
          timeout: 100000,
        })
          .contains(task)
          .scrollIntoView()
          .should("be.visible")
          .click();
      } else {
        // If the task is not found, check if there is a next page
        cy.get(locators.kxi.decisionTask.kxiTaskDashboard.nextButton).then(
          ($nextButton) => {
            if (!$nextButton.prop("disabled")) {
              // If next page is available, click next and search again
              cy.get(
                locators.kxi.decisionTask.kxiTaskDashboard.nextButton
              ).click({ force: true, multiple: true });
              // ).click();
              cy.wait(1000); // Optional: adjust wait time based on loading speed

              this.searchTaskInPage(task); // Recursive call to search the next page
            } else {
              // No more pages, task not found
              throw new Error(
                `Task "${task}" not found after checking all pages`
              );
            }
          }
        );
      }
    });
  }
  verifyStatusofAllTasks() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(
        locators.kxi.decisionTask.kxiTaskDashboard.allTaskSearchplaceholder,
        {
          timeout: TIMEOUT_LONG,
        }
      );
      cy.get(
        locators.kxi.decisionTask.kxiTaskDashboard.allTaskSearchplaceholder,
        {
          timeout: TIMEOUT_LONG,
        }
      );
      cy.get(
        locators.kxi.decisionTask.kxiTaskDashboard.allTaskSearchplaceholder,
        {
          timeout: TIMEOUT_LONG,
        }
      )
        .eq(0)
        .click({ force: true });

      cy.fixture("KXIModule/TaskStatus.json").then((statusData) => {
        // Pass the data to the custom command
        cy.log(JSON.stringify(statusData));
        cy.verifyText(
          locators.kxi.decisionTask.kxiTaskDashboard.comboboxOption,
          statusData
        );
      });
    });
  }

  clickActionButton() {
    cy.window().then((win) => {
      // Stub window.open to capture the new tab/window URL
      cy.stub(win, "open").as("windowOpen");

      cy.wait(3000);
      // Click the "Create" button to trigger the window.open
      cy.get(locators.kxi.kxiData.takeActionButton, { timeout: 50000 })
        .first()
        .click();

      // Assert window.open was called and extract the URL
      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          cy.log(newTabUrl);
          // If required, set authentication cookies or tokens before visiting the URL
          const finalURL = mainURL + newTabUrl;

          // Visit the captured URL in the same Cypress window
          cy.visit(finalURL);
          this.createRegularTask();
        });
    });
  }

  navigateToKxiData(kxiname) {
    cy.visitProfile();

    cy.visitkxiData();
    this.searchkxiName(kxiname);
    this.clickActionButton();
  }
  verifyStatusInGraph() {
    this.verifyTextInIframe(
      locators.kxi.decisionTask.kxiTaskDashboard.statusLocator,
      "KXIModule/TaskStatus.json"
    );
  }

  verifyTaskTabs() {
    this.verifyTextInIframe(
      locators.kxi.decisionTask.kxiTaskDashboard.tabLocator,
      "KXIModule/TaskStatus.json"
    );
  }

  verifyTextInIframe(locator, fixtureFile) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.fixture(fixtureFile).then((statusData) => {
        cy.verifyText(locator, statusData);
      });
    });
  }
  verifyStatusFilter(type) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.filterInput, {
        timeout: TIMEOUT_LONG,
      })
        .type(type, { delay: 250 })
        .type("{Enter}");
      //timeout will not work because the locator is here we wait for filtered data
      cy.wait(5000);

      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.dataEntrycellLocator, {
        timeout: 50000,
      })
        .should("exist") // Ensure elements exist before looping
        .each(($el) => {
          cy.wrap($el).should("have.attr", "title", type); // Wrap the element for better assertion handling
        });
    });
  }

  verifyKXIDefinitionAndCreateUpdateTask() {
    this.searchKxiDefinitionOnGrid(Cypress.env("kxiDefinitionName"));
    this.verifyKXIDefinitionOnGrid();
    cy.visitkxiDef();
    this.verifyUpdateTaskModal();
    this.verifySingleOwner();
  }

  kxitaskDashboadmenu() {
    this.menu.menuClick();
    this.kxiManagement();
    cy.get(locators.menu.kxiTaskDashboard).should("be.visible").click();

    // I covered pd-23199 here
    cy.url().should("include", "decisions.do?page=Kxi_Task_Dashboard");
  }
  verifyDashboartitle() {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.contains(
        "label",
        locators.kxi.decisionTask.kxiTaskDashboard.dashboardTitle,
        {
          timeout: 20000,
        }
      ).should("be.visible");
    });
  }

  verifyAllDataEntryStatusFilter(type) {
    cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(() => {
      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.allDataEntryInput, {
        timeout: TIMEOUT_LONG,
      })
        .as("placeholder")
        .type(type, { delay: 250 });
      cy.get("@placeholder").type("{Enter}");
      //timeout will not work because the locator is here we wait for filtered data
      cy.wait(5000);

      cy.get(locators.kxi.decisionTask.kxiTaskDashboard.dataEntrycellLocator)

        // Ensure elements exist before looping
        .each(($el) => {
          cy.get(
            locators.kxi.decisionTask.kxiTaskDashboard.dataEntrycellLocator
          )
            .invoke("attr", "title")
            .then((titleAttr) => {
              if (titleAttr === type) {
                console.log("title is", titleAttr);

                cy.wrap($el).should("have.attr", "title", type).contains(type);
                // Wrap the element for better assertion handling
              }
            });
        });
    });
  }

  dmsMenu() {
    this.menu.menuClick();
    cy.get(locators.menu.documentManagement).should("be.visible").click();
    cy.get(locators.menu.companyDocuments).should("be.visible").click();
  }
  navigateToDms() {
    cy.visitProfile();

    this.dmsMenu();
  }

  searchInDMS(text) {
    cy.switchIframe(locators.dms.dmsFrame)
      .find(locators.dms.dmsSearch, { timeout: TIMEOUT_LONG })
      .click();

    cy.switchIframe(locators.dms.dmsFrame)
      .find(locators.dms.dmsSearchField)
      .type(text)
      .type("{Enter}");

    cy.switchIframe(locators.dms.dmsFrame)
      .find(locators.dms.folderLocator)
      .should("be.visible")
      .contains(text);
  }
  searchKxiDefFolder() {
    cy.switchIframe(locators.dms.dmsFrame)
      .find(locators.dms.dmsSearch, { timeout: TIMEOUT_LONG })
      .click();
    const timeStamp = dayjs().format("MMM D, YYYY");
    //Searching and Validating kxi Definition Folder
    cy.switchIframe(locators.dms.dmsFrame)
      .find(locators.dms.dmsSearchField)
      .type("kxi Definition")
      .type(timeStamp)
      .type("{Enter}");
    cy.readFile(writeDataFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            cy.log(wrappedEl.text());
            // Log the text of the element to see if it's loading correctly
            if (wrappedEl.text().includes(file.kxiName)) {
              cy.wrap($el)
                .contains(file.kxiName, { timeout: 10000 })
                .should("exist");
            }
          });
        });
    });
  }
  verifyUpdateTaskFolder() {
    this.navigateToKxiDefAndOpenTaskModal();
    this.verifyUpdateTaskModal();

    this.verifySingleOwner();
    cy.readFile(writeDataFilePath).then((file) => {
      this.createTask(file.kxiName);
    });
  }
  searchKxiUpdateFolder() {
    this.searchKxiDefFolder();

    //Expanding kxi Definition Folder
    cy.readFile(writeDataFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            cy.log(wrappedEl.text());
            // Log the text of the element to see if it's loading correctly
            if (wrappedEl.text().includes(file.kxiName)) {
              cy.wrap($el)
                .contains(file.kxiName, { timeout: 10000 })
                .should("exist")
                .parents(locators.dms.parent)
                .siblings(locators.dms.folderExpand)
                .click();
            }
          });
        });
    });
    //Validating Update task
    cy.readFile(taskFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            const task = "KXI Task -";
            const finalTask = task + file.taskName;
            if (wrappedEl.text().includes(finalTask)) {
              cy.wrap($el)
                .contains(finalTask, { timeout: 10000 })
                .should("exist")
                .click();
            }
          });
        });
    });
  }
  searchKxiRegularFolder() {
    this.searchKxiDefFolder();

    cy.readFile(writeDataFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            cy.log(wrappedEl.text());
            // Log the text of the element to see if it's loading correctly
            if (wrappedEl.text().includes(file.kxiName)) {
              cy.wrap($el)
                .contains(file.kxiName, { timeout: 10000 })
                .should("exist")
                .parents(locators.dms.parent)
                .siblings(locators.dms.folderExpand)
                .click();
            }
          });
        });
    });

    cy.readFile(taskRegularFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            const task = "Regular Task -";
            const finalTask = task + file.taskName;
            if (wrappedEl.text().includes(finalTask)) {
              cy.wrap($el).should("contain", finalTask).should("exist").click();
            }
          });
        });
    });
  }

  searchinKxiDef(kxiDef) {
    cy.waitForLoaderToDisappear("agGrid", 80000);
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: TIMEOUT_LONG })
      .should("be.visible", { timeout: 7000 })
      .type("{selectall}{backspace}", { force: true }, { delay: 600 })
      .clear({ force: true })
      .type("{selectall}{backspace}", { delay: 600 })
      .type(kxiDef, { delay: 250 });
  }

  searchinKxiDefForUpdate(kxiDef) {
    cy.visitkxiDef();
    cy.waitForTopMsgLoaderToDisappear(100000);
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: TIMEOUT_LONG })
      .should("be.visible")
      .type(kxiDef, { force: true });
  }
  createChildTask() {
    this.navigateToKxiDefAndOpenTaskModal();
    cy.readFile(writeDataFilePath).then((file) => {
      this.searchinKxiDefForUpdate(file.kxiName);

      cy.get(locators.kxi.updateTask.nameKxi, { timeout: 50000 })
        .should("contain", file.kxiName)
        .should("exist")
        .contains(file.kxiName)
        .parents("div[role='row']") // Navigate to the parent row
        .within(() => {
          cy.get(locators.kxi.updateTask.taskLink, { timeout: 20000 })
            .as("taskLink")
            .invoke("attr", "href")
            .then((href) => {
              const fullUrl = href.startsWith("http")
                ? href
                : `${mainURL}${href}`;

              cy.get("@taskLink")
                .invoke("removeAttr", "target")
                .first()
                .click();

              cy.visit(fullUrl);
            });
        });
      this.childTask.createChildTaskForm("auto");
    });
  }

  verifyChildTaskInDMS() {
    this.searchKxiUpdateFolder();

    // validating and expanding Update Task Folder
    cy.readFile(taskFilePath).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            cy.log(wrappedEl.text());
            // Log the text of the element to see if it's loading correctly
            if (wrappedEl.text().includes(file.taskName)) {
              cy.wrap($el)
                .contains(file.taskName, { timeout: 50000 })
                .should("be.visible")
                .parents(locators.dms.parent)
                .siblings(locators.dms.folderExpand)
                .click();
            }
          });
        });
    });
    // validating child task folder under Kxi Update folder
    cy.readFile(childTask).then((file) => {
      cy.switchIframe(locators.dms.dmsFrame)
        .find(locators.dms.subFolder, { timeout: TIMEOUT_LONG })
        .each(($el) => {
          cy.wrap($el).then((wrappedEl) => {
            const task = "Task -";
            const finalTask = task + file.taskName;
            if (wrappedEl.text().includes(finalTask)) {
              cy.wrap($el)
                .contains(finalTask, { timeout: 10000 })
                .should("exist");
            }
          });
        });
    });
  }

  createRegularTask(kxiTaskDashboard = false) {
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    const taskName = "kxi Regular Task";
    const finalName = taskName + timeStamp;
    cy.readFile(taskFilePath).then((file) => {
      file.taskName = finalName;
      cy.writeFile(taskFilePath, file);
    });
    this.regularTask.createRegularTaskForm(
      finalName,
      Cypress.env("kxi").customer.decision.fullName,
      kxiTaskDashboard
    );
  }

  /**As a pre-Requisite adding kxi Definition 
   * enter values from data file'kxiValues.json'  
   * and then Kxi Data
   * @param {string} filename kxi Definition name from write file
   *  * @param {string} userName Enter owner while adding kxi Definition
 
   */
  addKxiDataAndDefinition(filename, userName) {
    cy.visitkxiDef();
    this.addKxiDefinition(
      data.kxiValue,
      data.Left1,
      data.Left2,
      data.Left3,
      data.Right1,
      data.Right2,
      data.Right3,
      userName
    );
    this.addKxiData(filename, data.kxiValue, true);
  }

  /**Enter data in Custom Fields on KXI Data popup according to Field type
   * @param {string} name Custom Field name from write file
 
   */
  fillCustomField(name) {
    /**Fetching data from fixture Array File */
    cy.fixture("KXIModule/CustomFieldArray.json").then(function (data) {
      if (name.includes(data.textField)) {
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .type(data.textField);
      }
      if (name.includes(data.textArea)) {
        cy.get(locators.kxi.kxiData.customField.customFielTextArea).type(
          data.textArea
        );
      }
      if (name.includes(data.singleSelectList)) {
        cy.get(locators.kxi.kxiData.customField.customFieldSingleList).click();
        cy.get(locators.kxi.kxiData.customField.customFieldSearch, {
          timeout: 5000,
        })
          .type(data.option)
          .type("{Enter}");
      }
      if (name.includes(data.multiSelectList)) {
        cy.get(locators.kxi.kxiData.customField.customFieldMultiList).click();
        cy.get(locators.kxi.kxiData.customField.customFieldOption1).click();
        cy.get(locators.kxi.kxiData.customField.customFieldMultiList).click();
        cy.get(locators.kxi.kxiData.customField.customFieldOption2).click();
      }
      if (name.includes(data.radioButton)) {
        cy.get(locators.kxi.kxiData.customField.customFieldRB).click();
      }
      if (name.includes(data.checkbox)) {
        cy.get(locators.kxi.kxiData.customField.customFieldRB).click();
      }
      if (name.includes(data.datePicker)) {
        cy.get(locators.kxi.kxiData.customField.customFieldDatePicker)
          .type(timeStamp)
          .type("{Enter}");
      }
      if (name.includes(data.uniqueField)) {
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .type(data.uniqueField);
      }
      if (name.includes(data.numberField)) {
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .type(data.numberData);
      }
    });
  }

  /**Search kxi Definition on Data Grid and validate the value of Custom Field Column
   * @param {string} filename kxi Definition name from write file
 
   */
  searchAndValidateCustomFieldInGrid() {
    this.selectColumnForCustomField();
    cy.get("div[col-id='comments']").eq(0).scrollIntoView();
    cy.readFile(customFilePath).then((file) => {
      cy.get(`div[col-id='${file.customName}']`, {
        timeout: TIMEOUT_LONG,
      })
        .should("contain", file.customName)
        .then(($el) => {
          cy.fixture("KXIModule/CustomFieldArray.json").then((valueData) => {
            cy.verifyText($el, valueData);
          });
        });
    });
  }

  /**Search kxi Definition on Data Grid and validate the value of Custom Field Column
   * @param {string} filename kxi Definition name from write file
 
   */
  searchAndValidateDateCustomFieldInGrid(filename) {
    this.selectColumnForCustomField();

    this.searchinKxiDef(filename);

    cy.readFile(customFilePath).then((file) => {
      cy.get(`div[col-id='${file.customName}']`, {
        timeout: TIMEOUT_LONG,
      }).then(($el) => {
        cy.wrap($el).contains(timeStamp);
      });
    });
  }
  /*Open Column picker on Data Screen Search newly added Custom Field Column which will be from Write File  */
  /*Select the searched custom Field column checkbox*/
  selectColumnForCustomField() {
    this.columnPickerBtn();

    cy.get(locators.kxi.kxiData.kxiDefiCheckbox).scrollIntoView().click();
    cy.get(locators.kxi.kxiData.kxiDefiCheckbox).click();
    cy.readFile(customFilePath).then((file) => {
      cy.get(locators.kxi.kxiData.columnPickerFilter)
        .should("be.visible")
        .type(file.customName);
      cy.wait(3000);
      cy.get(
        `div#kriDataGrid [ref=primaryColsListPanel] [aria-label='${file.customName} Column'] input`,
        { timeout: 20000 }
      )
        .scrollIntoView()
        .click({ force: true });
    });
    cy.wait(3000);
    this.columnPickerBtn();
  }
  /*Save time Stamp in Json File */
  saveDateInFile() {
    cy.readFile(customsFilePath).then((file) => {
      file.dateValue = timeStamp;
      cy.writeFile(customsFilePath, file);
    });
  }
  /**Search kxi Definition on Data Grid and validate the custom Field name and Value in Audit Logs
   * @param {string} filename kxi Definition name from write file
 
   */
  ValidateDataCustomFieldInAuditLog(filename) {
    this.searchinKxiDef(filename);
    //timeout for appearing Audit log button in Action Column
    cy.wait(5000);
    cy.get(locators.kxi.kxiData.auditLogButton, {
      timeout: TIMEOUT_LONG,
    }).click();
    cy.readFile(customFilePath).then((file) => {
      cy.get(locators.kxi.kxiData.auditLogModal, {
        timeout: TIMEOUT_LONG,
      }).should("contain", file.customName);
      cy.get(locators.kxi.kxiData.auditLogContent).then(($el) => {
        cy.fixture("KXIModule/CustomFieldArray.json").then((valueData) => {
          cy.verifyText($el, valueData);
        });
      });
    });
  }
  /**Verify Empty value,Sample Date and Comment boxes in Data Entry mode
   * by visiting user profile and kxi Data screen
   * Search newly added data of newly added kxi Definition in Grid
   * Click Data Entry button and Validate text
   * @param {string} text the text of "Data Entry" button
 
   */
  verifyEmptyFields(text, flag = false) {
    cy.visitProfile();

    cy.visitkxiData();

    if (flag === true) {
      cy.readFile(writeDataFilePath).then((file) => {
        this.searchkxiName(file.kxiName);
      });
    }
    this.verifyDataEntrybtn(text).click({ force: true });
    this.verifySaveBtn();
    this.clearData();
    cy.get(locators.kxi.kxiData.kriColValue, { timeout: 50000 })
      .eq(0)
      .should("have.value", "");
    cy.get(locators.kxi.kxiData.sampleDateInput, { timeout: 50000 })
      .eq(0)
      .should("have.value", "");

    cy.get(locators.kxi.kxiData.commentInput).eq(0).should("have.value", "");
  }
  /**Verify newly added data entry on kxi Data Grid by searching definition
   * Click check box and Show All button to show all data against the definition
   * Validate data grid row count
   */
  verifyNewlySavedData() {
    this.verifyDefaultLayout();
    cy.readFile(writeDataFilePath).then((file) => {
      this.searchinKxiDef(file.kxiName);
    });
    cy.get(locators.kxi.kxiData.checkBoxSelectionkxi, {
      timeout: 20000,
    }).click();
    cy.get(locators.kxi.kxiData.showAllButton).click({ force: true });
    cy.get(locators.kxi.kxiData.numberOfRecordOnGrid, {
      timeout: 20000,
    }).should("have.length", 2);
  }
  /**Verify validation message of existing kxi Data on Dat grid
   *Enter same current sample date to same definition
   * Click Save button 
   * Validate error message
   * @param {number} kriValue kxi Value for kxi Data
 
   */
  verifyExistingRecord(kriValue) {
    this.verifyDataEntrybtn("Data Entry").click({ force: true });
    this.verifySaveBtn();
    cy.get(locators.kxi.kxiData.kriColValue, { timeout: 50000 })
      .eq(0)
      .should("be.visible")
      .click();
    cy.get(locators.kxi.kxiData.kriValueInput, { timeout: TIMEOUT_LONG })
      .eq(0)
      .type(kriValue);
    cy.get(locators.kxi.kxiData.sampleDateInput).eq(1).click();

    // Get the timestamp for 1 day before today
    const timeStamp = dayjs().format("MM/DD/YYYY");
    cy.get(locators.kxi.kxiData.sampleDateInputFocus).eq(0).type(timeStamp);
    cy.get(locators.kxi.kxiData.commentInput).eq(1).focus().click();
     cy.get(locators.kxi.kxiData.saveBtn, { timeout: 20000 })
       .focus()
       .click({ force: true });
    cy.verifyToastMessageText(
      "Kxi Value already exists with the given sample date",
      TIMEOUT_SHORT
    );
  }

  /**As a pre-Requisite adding kxi Definition 
   *  enter values from data file'kxiValues.json
   * and then validate Audit Logs 
   * For added Custom Fields by searching kxi Definition
   * click Audit log button in Action Column
   *  * @param {string} userName Enter owner while adding kxi Definition
 
   */
  addKxiDefinitionForAuditLog(userName, edit = false, kxiAllLogs = false) {
    cy.visitkxiDef();
    this.addKxiDefinition(
      data.kxiValue,
      data.Left1,
      data.Left2,
      data.Left3,
      data.Right1,
      data.Right2,
      data.Right3,
      userName,
      true
    );
    this.validateAuditLog(edit, kxiAllLogs);
  }

  /**
   * addKxiDataForAuditLogs will add kxi definitions in kxi Data and check the logs
   * it has two stages 'edit' and 'add'
   * @param {*} dataValue kxi data value against threshold
   * @param {*} dataUpdatedValue on updating the kxi data the data value which we want to update
   * @param {*} manual mark this true if kxi definition datatype is manual
   * @param {*} operation this param will have conditions 'add' or 'edit' based on testcases
   */
  addKxiDataForAuditLogs(
    dataValue,
    dataUpdatedValue,
    manual,
    operation,
    userName = null
  ) {
    cy.readFile(writeDataFilePath).then((file1) => {
      if (operation === "add") {
        this.verifyEditFields(dataValue, manual, userName);
        const formatDate = dayjs().format("MMM DD, YYYY");
        const dateObject = {
          dateValue: formatDate,
        };

        cy.validateKxiDataAuditLogs(
          locators.kxi.kxiData.auditLogButton,
          locators.kxi.kxiData.auditLogContent,
          file1,
          dateObject.dateValue
        );
      }

      if (operation === "edit") {
        cy.visitkxiData();
        cy.waitForLoaderToDisappear("agGrid", 50000);

        this.searchkxiName(file1.kxiName);
        // this.searchinKxiDef(file1.kxiName);
        this.clickKxiDataFields(
          file1.kxiName,
          locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
          locators.kxi.kxiData.kriColValue
        );
        this.addKxiDataFieldValues(
          file1.kxiName,
          locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
          locators.kxi.kxiData.kriColValue,
          dataUpdatedValue
        );

        cy.get(locators.kxi.kxiData.gridSave).click();
        const updatedDate = dayjs(new Date())
          .subtract(1, "day")
          .format("MM-DD-YYYY");

        const formatUpdateDate = dayjs(updatedDate).format("MMM DD, YYYY");
        const updatedDateObject = {
          updatedDateValue: formatUpdateDate,
        };

        this.addKxiDataFieldValues(
          file1.kxiName,
          locators.kxi.insight.linkedKxI.kxiCategorySubGrid,
          locators.kxi.kxiData.sampleDateInput,
          updatedDate
        );

        //for Verification of Updated fields in Audit Logs
        cy.validateKxiDataAuditLogs(
          locators.kxi.kxiData.auditLogButton,
          locators.kxi.kxiData.auditLogContent,
          kxiUpdateLogFields.kxiData,
          updatedDateObject.updatedDateValue
        );
      }
    });
  }

  /**
   * clickKxiDataFields will click the fields of added kxi in kxi data
   * @param {*} kxiName name of kxi definition
   * @param {*} rowLocator its the first locator it will be same every time
   * @param {*} fieldToUpdate fields which we want to edit (datavalue, datevalue)
   */
  clickKxiDataFields(kxiName, rowLocator, fieldToUpdate) {
    cy.get(rowLocator, { timeout: 5000 })
      .find(fieldToUpdate, { timeout: 8000 })
      .dblclick();
  }

  /**
   * addKxiDataFieldsValues will add the updated data values on kxidefinition
   * @param {*} kxiName kxiname
   * @param {*} rowLocator its the first locator it will be same every time
   * @param {*} fieldToUpdate fields which we want to edit (datavalue, datevalue)
   * @param {*} updatedValue updated value added in the fields
   */
  addKxiDataFieldValues(kxiName, rowLocator, fieldToUpdate, updatedValue) {
    cy.get(rowLocator, { timeout: 50000 })
      .find(fieldToUpdate, { timeout: 8000 })
      .type("{selectall}{backspace}")
      .type(updatedValue)
      .type("{enter}", { delay: 200 });
  }

  /**As a pre-Requisite adding kxi Definition and then Kxi Data
  
 
   */
  validatedEditCustomFieldAuditLogs(editText, kxiAllLogs = false) {
    cy.visitkxiDef();
    cy.readFile(writeDataFilePath).then((file) => {
      this.searchKxiDefinitionOnGrid(file.kxiName);
    });
    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 }).should(
      "have.length",
      "1",
      {
        timeout: 9000,
      }
    );
    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 20000 })
      .eq(0)
      .click();
    cy.readFile(customFilePath).then((file) => {
      cy.get(locators.kxi.kxiDefinition.customField.labelText)
        .contains(file.customName)
        .parent()
        .within(() => {
          this.editCustomField(file.customName, editText);
        });
    });
    if (kxiAllLogs) {
      const username = Cypress.env("kxi").customer.withRM3.username;

      this.addKxiDefinition(
        data.kxiValue,
        data.Left1,
        data.Left2,
        data.Left3,
        data.Right1,
        data.Right2,
        data.Right3,
        username,
        null,
        true,
        true
      );
      this.validateAuditLog(true, kxiAllLogs);
    } else {
      cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.saveBtn).click();
      cy.visitkxiDef();
      cy.readFile(writeDataFilePath).then((file) => {
        this.searchKxiDefinitionOnGrid(file.kxiName);
        this.validateAuditLog(true, false);
      });
    }
  }

  /**Enter data in Custom Fields on KXI Definition Edit form
   * @param {string} name Custom Field name from write file
 
   */
  editCustomField(name, editText) {
    /**Fetching data from fixture Array File */
    let finalEdit;
    cy.fixture("KXIModule/CustomFieldArray.json").then(function (data) {
      if (name.includes(data.textField)) {
        finalEdit = editText + data.textField;
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .clear()
          .type(finalEdit);
      }
      if (name.includes(data.textArea)) {
        finalEdit = editText + data.textArea;
        cy.get(locators.kxi.kxiData.customField.customFielTextArea)
          .clear()
          .type(finalEdit);
      }
      if (name.includes(data.radioButton)) {
        cy.get(locators.kxi.kxiData.customField.customFieldRB).click();
        finalEdit = data.radioButton;
      }
      if (name.includes(data.checkbox)) {
        cy.get(locators.kxi.kxiData.customField.customFieldRB).click();
        finalEdit = data.checkbox;
      }
      if (name.includes(data.datePicker)) {
        finalEdit = dayjs(new Date()).subtract(1, "day").format("YYYY-MM-DD");
        cy.get(locators.kxi.kxiData.customField.customFieldDatePicker)
          .clear()
          .type(finalEdit)
          .type("{Enter}");
      }
      if (name.includes(data.uniqueField)) {
        finalEdit = editText + data.uniqueField;
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .clear()
          .type(finalEdit);
      }
      if (name.includes(data.numberField)) {
        finalEdit = "0" + data.numberData;
        cy.get(locators.kxi.kxiData.customField.customFieldInput)
          .scrollIntoView()
          .clear()
          .type(finalEdit);
      }
      cy.readFile(editcustomFilePath).then((file) => {
        file.editcustomName = finalEdit;
        cy.writeFile(editcustomFilePath, file);
      });
    });
  }
  /**Validate Audit logs when we add or edit audit log on kxidata
   * @param {boolean} edit Custom Field edit flag
 
   */
  validateAuditLog(edit, kxiAllLogs = false) {
    cy.wait(4000);
    cy.get(locators.kxi.kxiDefinition.editBtn, { timeout: 50000 }).should(
      "have.length",
      "1",
      {
        timeout: 50000,
      }
    );
    cy.get(locators.kxi.kxiData.auditLogButton, { timeout: 50000 })
      .eq(0)
      .click();
    cy.readFile(customFilePath).then((file) => {
      cy.get(locators.kxi.kxiData.auditLogContent).then(($el) => {
        if (edit === true && kxiAllLogs === false) {
          cy.fixture("KXIModule/customFieldUpdate.json").then((valueData2) => {
            cy.get(locators.kxi.kxiData.auditLogModal).should(
              "contain",
              file.customName
            );
            cy.verifyText($el, valueData2);
          });
        } else if (edit === false && kxiAllLogs === false) {
          cy.fixture("KXIModule/CustomFieldArray.json").then((valueData) => {
            cy.get(locators.kxi.kxiData.auditLogModal).should(
              "contain",
              file.customName
            );
            cy.verifyText($el, valueData);
          });
        } else if (edit === false && kxiAllLogs === true) {
          cy.readFile(writeDataFilePath).then((file) => {
            cy.get(locators.kxi.kxiData.auditLogModal)
              .should("contain", file.kxiName)
              .should("contain", Cypress.env("kxi").customer.withRM3.username);
          });
          cy.fixture("KXIModule/kxiValues.json").then((kxiFormData) => {
            cy.verifyText($el, kxiFormData);
          });
        } else if (edit === true && kxiAllLogs === true) {
          cy.fixture("KXIModule/kxiUpdateLogFields.json").then(
            (kxiUpdateFormData) => {
              cy.verifyText($el, kxiUpdateFormData);
            }
          );
        }
      });
    });
  }

  /**Validate Audit logs when we add or edit audit log for Kxi Definition
   * @param {String} userName Set the owner on kxi definition
 
   */
  verifyAuditLogsOnKxiDefinition(userName, edit) {
    this.addKxiDefinitionForAuditLog(userName);
    this.validatedEditCustomFieldAuditLogs(edit);
  }
  /**Validate edited fields on KXI Data by validating classes
   * @param {number} value Input kri Value
   * @param {boolean} Mannual flag for which type of data edited fields will be validated
 
   */
  verifyEditFields(value = null, mannual = null, userName = null) {
    if (mannual === true) {
      cy.visitkxiDef();
      this.addKxiDefinition(
        data.kxiValue,
        data.Left1,
        data.Left2,
        data.Left3,
        data.Right1,
        data.Right2,
        data.Right3,
        userName
      );

      cy.visitkxiData();

      cy.readFile(writeDataFilePath).then((file) => {
        this.addKxiData(file.kxiName, value);
        this.searchinKxiDef(file.kxiName);
      });
    }
    cy.wait(10000);
    cy.get(locators.kxi.kxiData.editBtn, { timeout: 50000 }).eq(0).click();
    cy.wait(5000);

    cy.get(locators.kxi.kxiData.kriColValue, { timeout: 50000 })
      .eq(1)
      .should("have.attr", "class")
      .should("include", "inlineEditCell");

    cy.get(".ag-cell-focus")
      .type("{selectall}{backspace}")
      .type(defdata.kxiDefinition.newkxiValue)
      .trigger("keydown", { keyCode: 9, which: 9, key: "Tab" })
      .trigger("keyup", { keyCode: 9, which: 9, key: "Tab" });

    cy.get(locators.kxi.kxiData.sampleDateInput)
      .eq(1)
      .should("have.attr", "class")
      .should("include", "inlineEditCell");
    cy.get(".ag-cell-focus")
      .type("{selectall}{backspace}")
      .type(timeStamp2)
      .trigger("keydown", { keyCode: 9, which: 9, key: "Tab" })
      .trigger("keyup", { keyCode: 9, which: 9, key: "Tab" });

    cy.get(locators.kxi.kxiData.commentInput)
      .eq(1)
      .should("have.attr", "class")
      .should("include", "inlineEditCell");

    cy.get(locators.kxi.kxiData.commentTextarea)
      .type("{selectall}{backspace}")
      .type(defdata.kxiDefinition.newComment);

    cy.get(locators.kxi.kxiData.gridSave).first().dblclick();
  }

  getAutoAssigneeOnSummary() {
    return cy.url().then((initialUrl) => {
      const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
      const OwnerId = urlParams.get("Owner");

      // Perform the query to fetch user data
      return cy
        .query(
          `SELECT firstName, lastName FROM predictuser WHERE id=${OwnerId}`
        )
        .then((res) => {
          cy.log("Database result:", res);

          // Safely extract first and last name
          let fullName = "";
          if (res.length > 0) {
            const user = res[0]; // Get the first user object

            cy.log("User:", user);

            // Safely access firstName and lastName, defaulting to empty string if undefined or null
            const userFirstName = user.firstName ? user.firstName.trim() : "";
            const userLastName = user.lastName ? user.lastName.trim() : "";

            fullName = `${userFirstName} ${userLastName}`;
          } else {
            cy.log("No user found with the given OwnerId");
          }

          cy.readFile(assigneeName).then((file) => {
            file.assigneeName = fullName;
            cy.writeFile(assigneeName, file);
          });
        });
    });
  }

  enterDueDate() {
    cy.get(".datepicker-input-conatiner input", { timeout: 20000 })
      .eq(0)
      .should("be.visible")
      .type(dayjs().add(10, "day").format("MM/DD/YYYY"));
  }

  createTask(kxiName) {
    cy.get(locators.kxi.updateTask.kxiDropdown, { timeout: 100000 })
      .should("be.enabled")
      .click();

    cy.wait(TIMEOUT_SHORT);

    cy.get(locators.kxi.updateTask.kxiOptions)
      .contains(kxiName)
      .click({ force: true });

    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");

      cy.get(locators.kxi.updateTask.createButton).click();

      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];
          const finalURL = mainURL + newTabUrl;

          cy.visit(finalURL);

          cy.switchIframe(locators.kxi.decisionTask.decisionFrame).within(
            () => {
              const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
              const taskName = "kxi Update Task";

              cy.get(locators.kxi.decisionTask.summary, { timeout: 20000 })
                .eq(0)
                .type(taskName);

              cy.get(locators.kxi.decisionTask.summary).eq(0).type(timeStamp);
              const finalName = taskName + timeStamp;

              cy.readFile(taskFilePath).then((file) => {
                file.taskName = finalName;
                cy.writeFile(taskFilePath, file);
              });

              this.enterDueDate();
              this.getAssignee();
              this.getAttachmentField();

              cy.intercept("POST", selectPath).as("decision");
              cy.get(locators.kxi.decisionTask.createButton).click();

              this.getAutoAssigneeOnSummary();
            }
          );
        });
    });
  }

  validateAutoAssigneeOnSummary() {
    cy.readFile(writeDataFilePath).then((file) => {
      cy.visitkxiDef();
      this.searchKxiDefinitionOnGrid(file.kxiName);
      this.verifyKXIDefinitionOnGrid();
      this.verifyTaskSummary(file.kxiName);
    });
  }
  verifyAssignee(text) {
    this.getText(/^Assignee$/).then((TicketText) => {
      expect(TicketText.trim()).to.equal(text);
    });
  }

  getText(labelName) {
    return cy
      .contains("label", labelName, { timeout: 50000 })
      .closest("section")
      .next("section")
      .find("label")
      .invoke("text");
  }

  clickCreateTask() {
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 20000 }).should(
      "be.visible"
    );
    cy.wait(5000);
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 20000 }).click();
    cy.window().then((win) => {
      // Stub window.open to capture the new tab/window URL
      cy.stub(win, "open").as("windowOpen");

      // Click the "Create Task" button to trigger the window.open
      cy.get(locators.kxi.kxiData.createTaskBtn).should("be.visible").click();

      // Assert window.open was called and extract the URL
      cy.get("@windowOpen")
        .should("be.called")
        .then((stub) => {
          const newTabUrl = stub.getCall(0).args[0];

          const finalURL = mainURL + newTabUrl;

          // Visit the captured URL in the same Cypress window
          cy.visit(finalURL);
          cy.url().should("include", "page", "Create_Regular_Task");

          this.createRegularTask();
        });
    });
  }
  /**As a pre-Requisite adding kxi Definition
   * enter values from data file'kxiValues.json'
   * and then Kxi Data
   *  * @param {string} userName Enter owner while adding kxi Definition
   */
  addKxiDataAndDefinitionWithoutCF(userName, owner = null, decision = false) {
    cy.visitkxiDef();
    this.addKxiDefinition(
      data.kxiValue,
      data.Left1,
      data.Left2,
      data.Left3,
      data.Right1,
      data.Right2,
      data.Right3,
      userName,
      null,
      false,
      false,
      false,
      null,
      owner,
      decision
    );

    cy.readFile(writeDataFilePath).then((file) => {
      this.addKxiData(file.kxiName, "20");
      this.clearData();
      this.searchinKxiDef(file.kxiName);

      this.clickActionButton();
    });
  }
  validateValuesOnSubGrid() {
    cy.visitkxiData();

    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 20000 })
      .eq(0)
      .should("be.visible");
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.taskArrowLocator).click();

    cy.readFile(taskFilePath).then((file) => {
      cy.get(locators.kxi.kxiData.subGrid.taskName).should(
        "contain",
        file.taskName
      );
    });

    cy.readFile("cypress/fixtures/KXIModule/assigneeName.json").then((data) => {
      cy.get(locators.kxi.kxiData.subGrid.taskAssignee).should(
        "contain",
        data.assigneeName
      );
    });
    cy.get(locators.kxi.kxiData.subGrid.taskType).should(
      "contain",
      "Regular Task"
    );
    cy.readFile("cypress/fixtures/KXIModule/TaskStatus.json").then((data) => {
      cy.get(locators.kxi.kxiData.subGrid.taskStatus).should(
        "contain",
        data.New
      );
    });
    cy.get(locators.kxi.kxiData.subGrid.createdDate).should(
      "contain",
      timeStamp
    );
    cy.get(locators.kxi.kxiData.subGrid.updatedDate).should(
      "contain",
      timeStamp
    );
  }
  validateTaskContOnSubGrid() {
    cy.visitkxiData();

    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 50000 })
      .eq(0)
      .should("be.visible");
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.taskArrowLocator).click();

    cy.get(locators.kxi.kxiData.viewActionCount)
      .should("be.visible")
      .then((el) => {
        const countText = el.text().trim();

        const match = countText.match(/\((\d+)\)/);
        const countNumber = parseInt(match[1], 10);

        cy.get(locators.kxi.kxiData.subGrid.subGridCount)
          .its("length")
          .then((count2) => {
            expect(countNumber).to.equal(count2);
          });
      });
  }

  verifyTaskName() {
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 50000 })
      .eq(0)
      .should("be.visible");
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.taskArrowLocator).click();
    cy.get(locators.kxi.kxiData.subGrid.taskName)
      .should("have.prop", "tagName", "A")
      .as("taskLink")
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("http") ? href : `${mainURL}${href}`;

        cy.get("@taskLink").invoke("removeAttr", "target").first().click();

        cy.visit(fullUrl);
        cy.url().should("include", "Kxi_Regular_Task_Summary_Form");
      });
  }
  verifySummaryNotHyperlink() {
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 50000 })
      .eq(0)
      .should("be.visible");
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.taskArrowLocator).click();
    cy.get(locators.kxi.kxiData.subGrid.taskName, { timeout: 10000 }).should(
      "not.have.attr",
      "href"
    );
  }
  verfiyTaskButtonNotVisible() {
    cy.get(locators.kxi.kxiData.taskArrowLocator, { timeout: 50000 })
      .eq(0)
      .should("be.visible");
    cy.wait(3000);
    cy.get(locators.kxi.kxiData.taskArrowLocator).eq(0).click();
    cy.get(locators.kxi.kxiData.createTaskBtn).should("not.exist");
  }

  /**
   * addkxiImportJson will update the JSON file which want to convert to XLSX
   * this method has conditions
   * if the type is kxiDefinition and the operation is add it will import the KXI definition template for checking the logs
   * if the type is kxiData and the operation is add it will import the kxi Data template for checking the logs
   * @param {String} type this flag will defined the type either its kxiDefinition or kxiData
   * @param {String} operation this flag will be 'add'
   */
  addkxiImportJSON(type, operation) {
    const kxiDef = "kxiDefinition";
    const kxiData = "kxiData";
    if (type === kxiDef && operation === "add") {
      cy.readFile(defImport).then((jsonfile) => {
        const kxiName = "ZZ Kxi definition ";
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        const finalName = kxiName + timeStamp;
        jsonfile["KxI Definition"][0]["Name"] = finalName;
        cy.writeFile(defImport, jsonfile);
        cy.fixture("KXIModule/KXITaskWrite.json").then((file) => {
          file.kxiName = finalName;
          cy.writeFile(writeDataFilePath, file);
        });
        this.convertXlsxtoJson(jsonfile);
      });
    }

    if (type === kxiData) {
      cy.readFile(createImportKxiDataJson).then((jsonfile) => {
        cy.fixture("KXIModule/KXITaskWrite.json").then((file) => {
          jsonfile["KXI Data Entry"][0]["KRI Definition Name*"] = file.kxiName;
          jsonfile["KXI Data Entry"][0]["KRI Value*"] = 20;
          jsonfile["KXI Data Entry"][0]["Comments"] = file.comments;
          cy.writeFile(createImportJsonData, jsonfile);
          this.convertXlsxtoJson(jsonfile);
        });
      });
    }
  }

  /**
   * convertXlsxToJson will convert the JSONFILE to XLSX
   * @param {String,JSON} jsonfile will be the jsonfile that we want to convert
   */
  convertXlsxtoJson(jsonfile, csv = false, qb = false) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Iterate through each key in the jsonfile (each key represents a sheet)
    Object.keys(jsonfile).forEach((sheetName) => {
      const sheetData = jsonfile[sheetName];
      const sheet = XLSX.utils.json_to_sheet(sheetData);

      if (qb) {
        // Post-process the sheet to ensure the "Id" column is blank and formatted as a number
        Object.keys(sheet).forEach((cell) => {
          if (cell.startsWith("A") && sheet[cell].v === 0) {
            sheet[cell].v = ""; // Set the value to blank
            sheet[cell].t = "n"; // Set the type to number
            sheet[cell].z = "0"; // Explicitly set the format to number
          }
        });
      }

      // Append the sheet to the workbook with the sheet name from the JSON file
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    });
    // Write the workbook to a CSV file
    csv
      ? XLSX.writeFile(wb, importFileName + ".csv")
      : XLSX.writeFile(wb, importFileName + ".xlsx");
  }

  exportXlsxToJSON(exportFile) {
    cy.wait(6000);
    let filePath = exportFilePath + "/" + exportFile;

    cy.parseXlsx(filePath).then((jsonData) => {
      cy.exportXlsxFile(jsonData, exportJSONFile);
    });
  }

  /**
   * uploadImportFile will upload the Data and definition file from the import Modal
   */
  uploadImportFile() {
    // Open the file upload modal
    cy.get(locators.kxi.kxiData.threeElepsis).click({ force: true });
    cy.get(locators.kxi.kxiData.importBtn).click({ force: true });
    cy.get(locators.kxi.kxiData.importModal.chooseFile).selectFile(
      "cypress/downloads/importFile.xlsx"
    );
    cy.get(locators.kxi.kxiData.kxiRegularTask.importModal.importBtn).click({
      force: true,
    });
  }

  /**
   * downloadExportFile will download the recent export from KXI Definition screen
   */
  downloadExportFile() {
    cy.visitkxiDef();

    //
    cy.get(locators.kxi.kxiData.threeElepsis).click({ force: true });
    cy.get(locators.kxi.kxiData.exportBtn).click({ force: true });
    //clicking on COMPLETED btn for downloading the export file
    cy.get(locators.kxi.kxiData.kxiRegularTask.importModal.jobQue, {
      timeout: 900000,
    })
      .should("be.visible")
      .eq(0)
      .contains("a", "COMPLETED", { timeout: 90000 })
      .then(($el) => {
        cy.get($el).click();
        cy.get($el)
          .invoke("attr", "onclick")
          .then((value) => {
            let getValue = value.split("'")[1];
            exportFile = getValue.replaceAll("/", "_");
            this.exportXlsxToJSON(exportFile);
          });
      });
  }

  /**
   * verifyImportExportCompleted will check that when importing the file COMPLETED in Modal should be visible which ensures
   * that the file is uploaded successfully
   * @param {Boolean} Import will be true when user wants to import
   * @param {Boolean} Export will be true when user wants to export
   */
  verifyImportExportCompleted(Import = false, Export = false) {
    cy.readFile(writeDataFilePath).then((file) => {
      // cy.wait(9000);
      if (Import === true && Export === false) {
        cy.get(locators.kxi.kxiData.kxiRegularTask.importModal.jobQue, {
          timeout: 9000,
        })
          .should("be.visible")
          .eq(0)
          .contains("a", "COMPLETED", { timeout: 900000 });
        cy.get(
          locators.kxi.kxiData.kxiRegularTask.importModal.closeJobQue
        ).click({ force: true });
        cy.reload();
        this.searchinKxiDef(file.kxiName);
      }
    });
  }

  /**
   * verify data for Automatic kxi Definition is added on Grid by Import
   * @param {String} kxiName kxi definition name fetch from JSON file
   */
  verifyAutomaticKriOnGrid(kxiName) {
    cy.visitkxiData();
    cy.get(locators.kxi.kxiData.dataEntrybtn, { timeout: 200000 })
      .should("be.visible")
      .click({ force: true });

    cy.get(locators.kxi.updateTask.namekxiData, { timeout: 200000 }).should(
      "not.contain",
      kxiName
    );
  }
  /**
   * Write data in JSON file
   * Convert JSON into Excel File
   * then Import Excel file
  
   */
  addkxiDataImportJSON() {
    const value = 20;
    const formattedDate = new Date().toLocaleDateString("en-US");
    cy.readFile(jsonFilePath).then((jsonfile) => {
      // Add newly created KXIDefinition name into the JSON
      cy.fixture("KXIModule/KXITaskWrite.json").then((file) => {
        jsonfile["KXI Data Entry"][0]["KRI Definition Name*"] = file.kxiName;
        jsonfile["KXI Data Entry"][0]["KRI Value*"] = value;

        // Write the updated JSON file to disk
        cy.writeFile(jsonFilePath, jsonfile).then(() => {
          // Now that the JSON file is updated, let's create an Excel workbook
          const wb = XLSX.utils.book_new();

          // Iterate through each key in jsonfile (each key represents a sheet)
          Object.keys(jsonfile).forEach((sheetName) => {
            const sheetData = jsonfile[sheetName];

            // Convert the JSON data to a sheet format
            const sheet = XLSX.utils.json_to_sheet(sheetData);

            // Append the sheet to the workbook
            XLSX.utils.book_append_sheet(wb, sheet, sheetName);
          });

          // Save the workbook as an Excel file
          const excelFilePath = "KRI_Data_Template.xlsx";
          XLSX.writeFile(wb, excelFilePath);

          // Log that the file has been saved (optional for debugging)
          cy.log("Excel file has been saved to: " + excelFilePath);
        });
      });
    });
  }
  /**
   * Click three elipses on Data Screen
   * Click "Import"
   * Click "Browse" placeholder on modal
   * Click "Import" button on modal
   * Validate Import data by searching in Grid
   */

  uploadImportFileData() {
    this.uploadImportFile();

    cy.readFile(writeDataFilePath).then((file) => {
      this.searchinKxiDef(file.kxiName);
      cy.get(locators.kxi.kxiData.numberOfRecordOnGrid, {
        timeout: 50000,
      }).should("have.length", 1);
    });
  }
  /**
   * Generate token from Authentication API
   * For adding Data from API
   */
  generateToken() {
    return cy
      .request({
        method: apiKxi.generateToken.request.method,
        url: generateTokenUrl,
        body: apiKxi.generateToken.request.requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        expect(response.status).to.eq(201);

        return cy.wrap(response.body.auth_token);
      });
  }
  /**
   * Get Definition ID for added kxi definition from kridefination table
   * From Database
   */
  getKxiDefinitionID() {
    cy.wait(3000);
    return cy.readFile(writeDataFilePath).then((file) => {
      const sanitizedKxiName = file.kxiName.trim();
      const query = `SELECT id FROM kridefination WHERE customerId= 1150 AND ownerId=52332 AND NAME='${sanitizedKxiName}'`;
      console.log(query);
      return cy.query(query).then((res) => {
        const DefinitionID = res[0].id;

        return DefinitionID;
      });
    });
  }

  /**
   * Get userKey for login user from predictuser table
   * From Database
   * @param {String} userName login username
   
   */
  getUserkey(userName) {
    let userkey;

    return cy
      .query(`SELECT userkey FROM predictuser WHERE username ='${userName}'`)
      .then((res) => {
        res.forEach((element) => {
          userkey = element.userkey;

          return userkey;
        });
      });
  }

  /**
   * Get Customer API key for login user from customer table
   * From Database
   * @param {String} customerCode Customer key
   
   */
  getApikey(customerCode) {
    let apiKey;

    return cy
      .query(`SELECT apiKey FROM customer WHERE customerCode='${customerCode}'`)
      .then((res) => {
        res.forEach((element) => {
          apiKey = element.apiKey;

          return apiKey;
        });
      });
  }

  /**
   * Write Definition ID, timestamp, user key and Cutomer API key
   * in Json file
   * For running postive case
   * OF add kxi data API
   * @param {String} key Customer key
   *  @param {String} userName login User Name
   */
  writeRequestBody(userName, key) {
    // Use Cypress's chainable commands to streamline the asynchronous calls
    cy.wrap(null)
      .then(() => {
        return this.getKxiDefinitionID();
      })
      .then((ID) => {
        return this.getUserkey(userName).then((userKeyArray) => {
          const userKey = userKeyArray[0]?.userkey;
          return { ID, userKey };
        });
      })
      .then(({ ID, userKey }) => {
        return this.getApikey(key).then((apikeyArray) => {
          const apiKey = apikeyArray[0]?.apiKey;
          return { ID, userKey, apiKey };
        });
      })
      .then(({ ID, userKey, apiKey }) => {
        cy.readFile(writeDataFilePath).then((jsonfile) => {
          // Validate the structure of the JSON file

          // Update the requestBody fields
          jsonfile.kxi_definition_id = parseInt(ID, 10);

          jsonfile.user_key = userKey;
          jsonfile.customer_api_key = apiKey;
          jsonfile.sample_date = timeStamp;

          // Write the updated JSON file back
          cy.writeFile(writeDataFilePath, jsonfile);
        });
      });
  }

  /**
   * Call Method for Write data in json file
   * Call method for generate Token
   * Make API Request for add kxi Data
   * Validate Status Code and kxi definition id in body
   * @param {String} key Customer key
   *  @param {String} userName login User Name
   */
  addKXIDataFromAPI(userName, key) {
    const def = defdata.kxiDefinition;
    this.writeRequestBody(userName, key);
    this.generateToken().then((token) => {
      const apiCall = apiKxi.addKXIData;
      cy.readFile(writeDataFilePath).then((file) => {
        cy.request({
          method: apiCall.request.method,
          url: addDataUrl,
          body: {
            sample_value: file.kriValue,
            sample_date: file.sample_date,
            management_comment: file.comments,
            user_key: file.user_key,
            kxi_definition_id: file.kxi_definition_id,
            customer_api_key: file.customer_api_key,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the generated token
          },
          failOnStatusCode: apiCall.request.failOnStatusCode,
        }).then((response) => {
          // Validate the response

          expect(response).to.not.be.empty;
          expect(response.status).to.eq(apiCall.response.body.status);
          expect(response.body.kxi_definition_id).to.deep.eq(
            file.kxi_definition_id
          );

          // Log the response
        });
      });
    });
  }

  /**
   * Visit Data screen in predict
   * Keep Reloading
   * Validate added kxi Data from API
   * @param {String} kxiName kxi Definition Name will be get from Json file
   */
  validateAddedDataOnUI(kxiName) {
    cy.visitkxiData();

    this.searchkxiName(kxiName);

    cy.get(locators.kxi.kxiData.definitionColumn, { timeout: 50000 }).should(
      "contain",
      kxiName
    );
  }
  /**Verify  A single "Save All" button should save all changes for displayed KXI definitions simultaneously
   * When enter data in Multiple definitions
   * Enter kri Value
   * Enter Current  Sample Date
   * Click Save button
   * Validate success message
   * @param {number} kriValue the kri value
   */

  verifyMultipleDataSaved(kriValue) {
    cy.get(locators.kxi.kxiDefinition.nameSearch, { timeout: 50000 })
      .should("be.visible")
      .type("{selectall}{backspace}", { force: true }, { delay: 300 })
      .clear()
      .wait(4000)
      .type("{selectall}{backspace}");
    this.verifyEmptyFields("Data Entry");
    this.verifySaveBtn();
    // Iterate through all rows
    cy.get(locators.kxi.kxiData.definitionColumn)
      .each(($el, index) => {
        cy.wrap($el)
          .invoke("text")
          .then((definitionText) => {
            cy.log(`Processing row ${index + 1}: ${definitionText}`);

            if (index <= 4) {
              // Input KRI Value
              cy.get(locators.kxi.kxiData.kriColValue)
                .eq(index)
                .should("be.visible")
                .click()
                .type(kriValue);

              // Set Sample Date
              const timeStamp = dayjs().format("MM/DD/YYYY");
              cy.get(locators.kxi.kxiData.sampleDateInput)
                .eq(index)
                .click()
                .type(timeStamp);

              // Input Comment
              cy.get(locators.kxi.kxiData.commentInput).eq(index).click();

              if (index >= 1 && index <= 4)
                cy.get(locators.kxi.kxiData.commentTextarea).type(
                  `Comment for row ${index}`
                );
            }
          });
      })
      .then(() => {
        // Save all entries
        cy.get(locators.kxi.kxiData.saveBtn, { timeout: 20000 }).click({
          force: true,
        });

        cy.waitForElementToVisible(
          locators.administration.users.toastMsg,
          50000
        );
        // Verify success message
        cy.get(locators.administration.users.toastMsg).should(
          "contain",
          "Records Saved Successfully"
        );
      });
  }

  /**Verify Added Multiple kxi Data on data grid
   * @param {number} kriValue the kri value
   */
  validatedAddedMultipleDataSaved(kriValue) {
    // Check if rows exist
    // Set Sample Date
    const timeStamp = dayjs().format("MM/DD/YYYY");
    cy.get(locators.kxi.kxiData.definitionColumn)
      .should("exist")
      .then(($rows) => {
        cy.log(`Found ${$rows.length} rows in the table`);

        // Iterate through all rows
        $rows.each((index, el) => {
          cy.wrap(el)
            .invoke("text")
            .then((definitionText) => {
              cy.log(`Processing row ${index + 1}: ${definitionText}`);

              if (index > 0 && index <= 7) {
                this.searchSampleDate(timeStamp);
                cy.get(locators.kxi.kxiData.kriColValue)
                  .eq(index)
                  .should("be.visible")
                  .and("contain", kriValue);

                cy.get(locators.kxi.kxiData.sampleDateInput)
                  .eq(index)
                  .should("be.visible")
                  .and("contain", timeStamp);
              }
            });
        });
      });
  }

  addDescription(description) {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.description).type(
      description
    );
  }
  selectCategory(decision = false) {
    cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.category).click({
      force: true,
    });
    if (decision === false) {
      // Do nothing or add any logic needed when decision is false
      return;
    } else {
      cy.readFile(category).then((file) => {
        cy.wait(2000);
        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.ownerSearch, {
          timeout: 50000,
        }).type(file.name);

        cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.categoryMatch, {
          timeout: 50000,
        })
          .contains(file.name)
          .click();
      });
    }
  }
}
