import { KxiDefinitionPage } from "../../../support/POM/KXIModule/KXIData/KXIAddForm_PO.js";
import { KXIDataImport } from "../../../support/POM/KXIModule/KXIData/KXIDataImport.js";
import kxiData from "../../../fixtures/KXIModule/KXIDataFREDImport/KXIDataFREDImport.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM.js";
import KXIDataEdit from "../../../support/POM/KXIModule/KXIData/KXIDataEdit.js";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";
import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO.js";
import KXIMenu from "../../../support/POM/KXIModule/KXIMenu.js";
import KxIDefinition from "../../../support/POM/KXIModule/KxIDefinition.js";
import KXIDefinition from "../../../fixtures/KXIModule/KXIDefinition.json";
import KXIData from "../../../fixtures/KXIModule/KXIData.json";
import KXIRegularTasks from "../../../fixtures/KXIModule/KXIRegularTasks.json";
import KxiData from "../../../support/POM/KXIModule/KxIData.js";
import KXIRegularTask from "../../../support/POM/KXIModule/KXITask/KXIRegularTask.js";
import KXIRegularTaskSummary from "../../../support/POM/KXIModule/KXITask/KXIRegularTaskSummary.js";
const kxiDataEdit = new KXIDataEdit();
const kxiPage = new KxiDefinitionPage();
const kxiImport = new KXIDataImport();
const kxiPOM = new KXI_POM();
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
describe(
  "KXI-Data Add form Test Cases",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd37777",
      "@pd36106",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("KXI Data Add form Cases with RM User", { tags: "@withRM" }, () => {
      const withRM4 = Cypress.env("kxi").customer.withRM;

      /**
       * Logs in as Risk Management user and navigates to KXI Data screen.
       * Executed before each test case.
       */
      beforeEach(() => {
        cy.loginWithSession(
          "login - with Risk Management",
          withRM4.username,
          withRM4.password,
          withRM4.key
        );

        kxiDataEdit.addKXIDefinition_KXIDataEdit(withRM4.username);
        cy.visitkxiData();
      });

      /**
       * Verify that the KXI Definition dropdown is populated and searchable.
       *
       * @tags @pd38756
       */
      it(
        "Verify that the KXI Definition dropdown is populated correctly.",
        { tags: ["@pd38756"] },
        () => {
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.openDefinitionDropdown(file.kxiName);
            kxiPage.assertDefinitionDropdownContainsSearchText(file.kxiName);
          });
        }
      );

      /**
       * Verify that the KXI Definition field is required.
       *
       * @tags @pd38757
       */
      it(
        "Verify that the KXI Definition field is required.",
        { tags: ["@pd38757"] },
        () => {
          kxiPage.openForm();
          kxiPage.clickSaveButton();
          kxiPage.validateToastMessage();
          kxiPage.validateRequiredField("definitionRequiredLabel");
        }
      );

      /**
       * Verify Description is auto-populated on selecting KXI Definition.
       *
       * @tags @pd38758
       */
      it(
        "Verify that the Description field is auto populated on selecting KXI Definition",
        { tags: ["@pd38758"] },
        () => {
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.searchAndSelectDefinition(file.kxiName);
            kxiPage.validateAutoPopulatedField("descriptionField");
          });
        }
      );

      /**
       * Verify Category is auto-populated on selecting KXI Definition.
       *
       * @tags @pd38759
       */
      it(
        "Verify that the Category field is auto populated on selecting KXI Definition",
        { tags: ["@pd38759"] },
        () => {
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.searchAndSelectDefinition(file.kxiName);
            kxiPage.validateAutoPopulatedField("categoryField");
          });
        }
      );

      /**
       * Verify Type is auto-populated on selecting KXI Definition.
       *
       * @tags @pd38760
       */
      it(
        "Verify that the Type field is auto populated on selecting KXI Definition",
        { tags: ["@pd38760"] },
        () => {
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.searchAndSelectDefinition(file.kxiName);
            kxiPage.validateAutoPopulatedField("typeField");
          });
        }
      );

      /**
       * Verify Target is auto-populated on selecting KXI Definition.
       *
       * @tags @pd38761
       */
      it(
        "Verify that the Target field is auto populated on selecting KXI Definition",
        { tags: ["@pd38761"] },
        () => {
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.searchAndSelectDefinition(file.kxiName);
            kxiPage.validateAutoPopulatedField("targetField");
          });
        }
      );

      /**
       * Verify that the Value field is required.
       *
       * @tags @pd38762
       */
      it(
        "Verify that the Value field is required.",
        { tags: ["@pd38762"] },
        () => {
          kxiPage.openForm();
          kxiPage.clickSaveButton();
          kxiPage.validateToastMessage();
          kxiPage.validateRequiredField("valueRequiredLabel");
        }
      );

      /**
       * Verify that the Sample Date field is required.
       *
       * @tags @pd38763
       */
      it(
        "Verify that the Sample Date field is required.",
        { tags: ["@pd38763"] },
        () => {
          kxiPage.openForm();
          kxiPage.clickSaveButton();
          kxiPage.validateToastMessage();
          kxiPage.validateRequiredField("sampleDateRequiredField");
        }
      );

      /**
       * Verify validation messages when required fields are missing.
       *
       * @tags @pd38764
       */
      it(
        'Verify that a validation message appears when a required field is missing in the "Add" form',
        { tags: ["@pd38764"] },
        () => {
          kxiPage.openForm();
          kxiPage.clickSaveButton();
          kxiPage.validateToastMessage();
          kxiPage.validateRequiredField("definitionRequiredLabel");
          kxiPage.validateRequiredField("sampleDateRequiredField");
          kxiPage.validateRequiredField("valueRequiredLabel");
        }
      );

      /**
       * Verify Sample Date accepts valid date formats.
       *
       * @tags @pd38765
       */
      it(
        'Verify that "Sample Date" accepts valid date formats',
        { tags: ["@pd38765"] },
        () => {
          kxiPage.openForm();
          kxiPage.addSampleDate();
        }
      );

      /**
       * Verify Value can be greater than Target.
       *
       * @tags @pd38766
       */
      it(
        'Verify that entering a "Value" greater than the "Target" is allowed',
        { tags: ["@pd38766"] },
        () => {
          kxiPage.openForm();
          kxiPage.setValueGreaterThanTarget();
          kxiPage.addSampleDate();
          kxiPage.clickSaveButton();
          kxiPage.successToastMessage();
        }
      );

      /**
       * Verify clicking Kaia icon opens chat window.
       *
       * @tags @pd38769
       */
      it(
        "Verify clicking Kaia icon should open chat",
        { tags: ["@pd38769"] },
        () => {
          kxiPage.openAIChat();
          kxiPage.verifyAIChatOpened();
        }
      );

      it(
        "Verify that the Comments field accepts text.Verify that all KXI Definitions are displayed in the list view",
        { tags: ["@pd38766"] },
        () => {
          cy.visitkxiData();
          kxiPage.openForm();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.searchAndSelectDefinition(file.kxiName);
          });
          kxiPage.setKxiValue();
          kxiPage.addSampleDate();
          kxiPage.addComments();
          kxiPage.clickSaveButton();
          kxiPage.successToastMessage();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiPage.validateAddedDataOnUI(file.kxiName);
          });
        }
      );
      /**
       * Verify "Show All" button displays full record list.
       *
       * @tags @pd38767
       */
      it(
        'Verify that the "Show All" button displays all records',
        { tags: ["@pd38767"] },
        () => {
          kxiPage.selectFirstKxiRecord();
          kxiPage.clickShowAllButton();
        }
      );
      /**
       * Verify "Show Latest" button filters to most recent records.
       *
       * @tags @pd38768
       */
      it(
        'Verify that the "Show Latest" button displays only the most recent data',
        { tags: ["@pd38768"] },
        () => {
          kxiPage.selectFirstKxiRecord();
          kxiPage.clickShowLatestBtn();
          kxiPage.scanKxiGrid();
        }
      );
    });

    context("EDIT Cases with RM User", { tags: ["@withRM"] }, () => {
      const withRM = Cypress.env("kxi").customer.withRM;

      beforeEach(() => {
        cy.loginWithSession(
          "login - custom fields",
          withRM.username,
          withRM.password,
          withRM.key
        );
      });

      it(
        "Verify that Edit button is present and visible against each Definition on KXI Data Screen",
        { tags: ["@kxiData", "@withRM"] },
        () => {
          cy.visitkxiData();
          kxiDataEdit.clearNameInput();
          kxiDataEdit.verifyEditBtnAgainstDef();
        }
      );

      it(
        "Verify by clicking Edit button, Edit, Delete and Take Actions buttons gets replaced by Save button",
        { tags: ["@kxiData", "@withRM"] },
        () => {
          cy.visitkxiData();
          kxiDataEdit.clearNameInput();
        }
      );
      it("Verify in case of manual  when click on Edit button .it should show the text box against the column (KRI Value, Sample Date, Comments) in an editable mode", () => {
        kxiPOM.verifyEditFields(kxiDef.kxiValue, true, withRM.username);
      });
    });

    context("KXI Manual Data Entry", { tags: ["@withRM"] }, () => {
      const kxiData = new KXI_POM();
      const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM_PEER.username}`,
          withoutRM_PEER.username,
          withoutRM_PEER.password,
          withoutRM_PEER.key
        );

        kxiDataEdit.addKXIDefinition_KXIDataEdit(withoutRM_PEER.username);
        cy.visitkxiData();
      });

      it(
        "Verify when user clicks 'Entry Data' button the grid should be opened and kxi value,Sample date and comment fields should be blank.",
        { tags: ["@pd26057"] },
        () => {
          kxiData.verifyEmptyFields(kxiDef.dataEntry);
        }
      );
      it(
        "Verify kri Value and Sample Date are mandatory field",
        { tags: ["@pd26062"] },
        () => {
          kxiDataEdit.clearNameInput();
          kxiData.verifyEmptyFields(kxiDef.dataEntry);

          kxiData.verifyMandatoryField(kxiDef.kxiValue);
        }
      );
      it("Verify kri values are saved successfully.", () => {
        cy.readFile(writeDataFilePath).then((file) => {
          kxiData.verifyKriValueSavedSuccessfully(
            kxiDef.kxiValue,
            file.kxiName
          );
        });
      });
      it(
        "Verify when user gives same Sample date to same definition it should display validation message",
        { tags: ["@pd26063"] },
        () => {
          kxiData.verifyExistingRecord(kxiDef.kxiValue);
        }
      );
      it("Verify Data Entry Button can be exit", () => {
        cy.visitkxiData();

        kxiData.verifyDataEntrybtnExit(
          kxiDef.exitDataEntry,
          kxiDef.dataModalText
        );
      });

      it(
        "Verify the grid should remove individual row-level 'Save' buttons and disable auto-saving of values when navigating rows via tab",
        { tags: ["@pd25270", "@pd26064"] },
        () => {
          kxiData.verifyEmptyFields(kxiDef.dataEntry);
          kxiData.verifyIndividualRowSaveBtn();
        }
      );
    });

    context(
      "KXI Data Import Funitionality Validation Cases with RM User",
      {
        tags: "@withRM",
      },
      () => {
        const withRM4 = Cypress.env("kxi").customer.withRM4;

        beforeEach(() => {
          cy.loginWithSession(
            "login - with Risk Management",
            withRM4.username,
            withRM4.password,
            withRM4.key
          );
          cy.visitkxiData();
        });

        /**
         * @TestCase PD-38953
         * @Description Verify that the "Download Sample File" link opens the import modal successfully.
         * @Tags @pd38953
         */
        it(
          'Verify that the "Download Sample File" link works',
          { tags: "@pd38953" },
          () => {
            kxiImport.clickImportBtn();
          }
        );

        /**
         * @TestCase PD-38954
         * @Description Verify that the sample file downloads successfully from the import modal.
         * @Tags @pd38954
         */
        it(
          "Verify that the sample file downloads successfully",
          { tags: "@pd38954" },
          () => {
            kxiImport.clickImportBtn();
            kxiImport.clickDownloadSampleFile();
            kxiImport.verifyDownloadFile();
          }
        );

        /**
         * @TestCase PD-38955
         * @Description Verify that an incomplete file is not processed and no record appears in the grid.
         * @Tags @pd38955
         */
        it(
          "Verify that the system does not allow an incomplete file to be uploaded",
          { tags: "@pd38955" },
          () => {
            const fileName = kxiData.incompleteFile;
            const searchTerm = kxiData.searchText;

            kxiImport.clickImportBtn();
            kxiImport.uploadFileAndIntercept(fileName, kxiData.importFileName);
            kxiImport.verifyToastMessage();
            kxiImport.searchAndVerifyRecordNotPresent(
              searchTerm,
              kxiData.timeout.min
            );
          }
        );

        /**
         * @TestCase PD-38956
         * @Description Verify the error toast appears for an unsupported file format.
         * @Tags @pd38956
         */
        it(
          "Verify the proper error message for an unsupported file type",
          { tags: "@pd38956" },
          () => {
            const fileName = kxiData.invalidFormatFile;

            kxiImport.clickImportBtn();
            kxiImport.uploadInvalidFile(fileName, kxiData.importFileName);
          }
        );
      }
    );
  }
);

context(
  "Verify the Regular Task Feature",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21995",
      "@release5.19",
      "@decision",
      "@customer",
    ],
  },
  () => {
    const kxiPom = new KXI_POM();
    const kxiData = new KxiData();
    const kxiRegularTask = new KXIRegularTask();
    const kxiRegularTaskSummary = new KXIRegularTaskSummary();
    const withoutRM = Cypress.env("kxi").customer.decision;

    beforeEach(() => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(withoutRM.username, withoutRM.password, withoutRM.key);
      kxiDataEdit.addKXIDefinition_KXIDataEdit(withoutRM.username, true);
    });
    KXIData.forEach((test) => {
      it("Should create and verify Regular Task existence and status on Decision platform", () => {
        kxiPom.leftMenuKxiManagement();
        kxiPom.kxiDataMenu();
        cy.readFile(writeDataFilePath).then((file) => {
          kxiData.createKXIData(
            file.kxiName,
            test.kriValue,
            test.comments,
            test.dateValueCurrent
          );
          kxiData.searchFilterName(file.kxiName);
        });

        kxiData.clickActionButton(Cypress.env("MAIN_URL"));

        kxiRegularTask.createRegularTaskForm(
          KXIRegularTasks.summary,
          KXIRegularTasks.assigneeUser
        );
        kxiRegularTaskSummary.verifyTaskAndStatusOfRegularTaskDecision();
      });
    });
  }
);
