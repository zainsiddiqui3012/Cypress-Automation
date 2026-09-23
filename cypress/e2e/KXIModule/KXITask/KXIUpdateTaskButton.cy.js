/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";
import KxIDefinition from "../../../support/POM/KXIModule/KxIDefinition";
import KXIDefinition from "../../../fixtures/KXIModule/KXIDefinition.json";
import KXIData from "../../../fixtures/KXIModule/KXIData.json";
import KxiData from "../../../support/POM/KXIModule/KxIData";
import KXIRegularTaskSummary from "../../../support/POM/KXIModule/KXITask/KXIRegularTaskSummary";
import UpdateTaskUnlink from "../../../fixtures/KXIModule/UpdateTaskUnlink.json";
// I covered pd-21991 and pd-21992

describe(
  "Predict - KXI Update Task button and Manual Data Entry Column on KXI Definition Management Screen, KxI Update Task Creation on Decisions Platform through KxI Update Task Button",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@release5.19",
      "@customer",
    ],
  },
  () => {
    context("KXI Update Task button", () => {
      const kxiData = new KXI_POM();
      const predictMenu_PO = new PredictMenu_PO();
      const KxiDefinition = new KxIDefinition();
      const kxiRegularTaskSummary = new KXIRegularTaskSummary();
      const kxiDataManagement = new KxiData();
      const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
      const withoutRM = Cypress.env("kxi").customer.decision;
      beforeEach(() => {
        cy.loginWithSession(
          `login - ${withoutRM.username}`,
          withoutRM.username,
          withoutRM.password,
          withoutRM.key
        );
      });

      it(
        "Verify KXI Update Task button should be visible on grid besides 'business Intelligence Report' button",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskButton();
        }
      );
      it(
        "Verify on clicking on KXI Update Task button the popup window should be displayed.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          kxiData.verifyUpdateTaskModal();
        }
      );
      it(
        "Verify 'Owner type' field should be present should have will a Radio select option 'Single' or 'Group'.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          kxiData.verifyUpdateTaskModal();
          kxiData.verifyOwnerType();
        }
      );
      it(
        "Verify 'Owner' should be Appeared only if Owner type is selected as “Single”. Single select from a drop-down list of users in predict.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifySingleOwner();
        }
      );
      it(
        "Verify 'Owner' should be Appeared only if Owner type is selected as “Group”. Group select from a drop-down list of users in predict.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifyGroupOwner();
        }
      );
      it(
        "Verify 'KXI definition' field should be multi select.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifyGroupOwner();
          kxiData.verifyKxiDropdown();
        }
      );

      it("Add Kxi definition ", () => {
        kxiData.navigateToKxiDefAndOpenTaskModal();
        kxiData.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3
        );
      });

      it(
        "Validate Kxi are linked on “KXI Update Task” Creation  form",
        { tags: ["@pd21992", "@decision"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifySingleOwner();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.validateKxionCreationForm(file.kxiName);
          });
        }
      );
      it(
        "Verify clicking on “Create” button, it should open the Create Task form on Decisions Platform with type = “KXI Update Task”",
        { tags: ["@pd21992", "@decision"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifySingleOwner();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.verifyCreateButton(file.kxiName);
          });
        }
      );
      it("Create Task", { tags: ["@pd21992", "@decision"] }, () => {
        kxiData.navigateToKxiDefAndOpenTaskModal();

        kxiData.verifyUpdateTaskModal();

        kxiData.verifySingleOwner();
        cy.readFile(writeDataFilePath).then((file) => {
          kxiData.createTask(file.kxiName);
        });
      });
      it(
        "Validate Auto Assignee on Summary form",
        { tags: ["@pd21992", "@decision"] },
        () => {
          kxiData.validateAutoAssigneeOnSummary(); //Validate Auto assign to the owner on KxI Update Task Add button
        }
      );
      it(
        "Verify only one reoccurring data entry task should be created for one manual entry KxI definition",
        { tags: ["@pd21992", "@decision"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifySingleOwner();

          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.verifyOneTaskCreatedwithOneManual(file.kxiName);
          });
        }
      );

      it(
        "Verify those  'KXI definition' should be displayed which are assigned to the Owner and having data entry type as “Manual” only.",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifyGroupOwner();
          kxiData.getName(kxiDef.groupOwner);
        }
      );

      it(
        "Verify clicking on the link of the Task ID will open the Task Summary form for type = KXI Update Task in a new tab",
        { tags: ["@pd21992", "@decision"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.searchkxiName(file.kxiName);
            kxiData.verifyKxionSummaryForm(file.kxiName);
          });
        }
      );

      it(
        "Validate Kxi are linked on “KXI Update Task” Summary  form",
        { tags: ["@pd21992", "@decision"] },
        () => {
          cy.visitProfile();
          cy.visitkxiDef();

          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.searchkxiName(file.kxiName);
            kxiData.verifyKxionSummaryForm(file.kxiName);
          });
        }
      );

      it(
        "Verify if it has a recurring task associated with it and a user later changes the entry type to Automated or FRED,  the warning message should be displayed",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          cy.readFile(writeDataFilePath).then((file) => {
            kxiData.searchkxiName(file.kxiName);
            kxiData.verifyWarningMessageDisplayed(
              kxiDef.errorMsg,
              file.kxiName
            );
            kxiData.verifyModalBehaviour(false);

            cy.visitkxiDef();
            kxiData.searchkxiName(file.kxiName);
            kxiData.verifyWarningMessageDisplayed(
              kxiDef.errorMsg,
              file.kxiName
            );
            kxiData.verifyModalBehaviour(true);

            // kxiData.verifyTaskLink();
          });
        }
      );
      it(
        "Verify A new column “Manual Data Entry”  should be added which should be blank by default, if a recurring task has already been created for a KXI Definition, display a link in Manual Data Entry” column with TASK ID",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          kxiData.VerifyManualDataEntryOnDefinition();
        }
      );
      it(
        "Verify validation messages of KXI Update task modal",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();

          kxiData.verifyUpdateTaskModal();

          kxiData.verifyValidationMsg(withoutRM.username);
        }
      );

      it(
        "Verify Unlink KXI Update Task on KXI Data Management Screen",
        { tags: ["@pd21991", "@predict"] },
        () => {
          kxiData.navigateToKxiDefAndOpenTaskModal();
          kxiData.verifyUpdateTaskButton();
          kxiData.addkxi();
          KxiDefinition.selectDataEntryType(KXIDefinition.dataEntryType);
          const kxiDefinitionNameWithTimestamp =
            KxiDefinition.addKxIDefinitionInfo(
              KXIDefinition.kxiDefinitionId,
              KXIDefinition.kxiDefinitionName,
              KXIDefinition.kxiDescription
            );
          Cypress.env("kxiDefinitionName", kxiDefinitionNameWithTimestamp);
          KxiDefinition.selectOwner(KXIDefinition.ownerForUpdateTask);
          // kxiData.chooseIconLibrary();
          KxiDefinition.setTriggerComparer(
            KXIDefinition.targetValue,
            KXIDefinition.leftTriggerLvl1,
            KXIDefinition.leftTriggerLvl2,
            KXIDefinition.leftTriggerLvl3,
            KXIDefinition.rightTriggerLvl1,
            KXIDefinition.rightTriggerLvl2,
            KXIDefinition.rightTriggerLvl3
          );
          kxiData.verifyKXIDefinitionAndCreateUpdateTask();
          kxiData.createTask(Cypress.env("kxiDefinitionName"));

          kxiRegularTaskSummary.waitForUpdateTaskSummaryPageToAppear(
            Cypress.env("kxiDefinitionName")
          );
          cy.visitkxiData();
          kxiDataManagement.waitForKXIDATALoaderToDisappear();
          KXIData.forEach((test) => {
            kxiDataManagement.createKXIData(
              Cypress.env("kxiDefinitionName"),
              test.kriValue,
              test.comments,
              test.dateValueCurrent
            );
          });
          kxiDataManagement.verifyUnlinkingOnKXIDataAndTaskSummaryScreen();
          kxiDataManagement.waitForKXIDATALoaderToDisappear();
          kxiData.searchKxiDefinitionOnGrid(Cypress.env("kxiDefinitionName"));
          cy.wait(3000);
          KxiDefinition.verifyNoManualDataEntryRecordInGrid();
        }
      );
    });
  }
);
