/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

// I covered pd-21993 and pd-21994

describe(
  "Decisions - Task Summary Form for KXI Update Task in Decision Platform and  New Column “Manual Data Entry” and button “Data Entry” on KXI Data Management Screen in Predict.",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@kxi-data",
      "@pd21993",
      "@pd21994",
      "@release5.19",
      "@customer",
    ],
  },
  () => {
    context(
      "KXI Manual Data Entry and Unlink Workflow",
      { tags: ["@withRM"] },
      () => {
        const kxiData = new KXI_POM();
        const predictMenu_PO = new PredictMenu_PO();
        const writeDataFilePath =
          "cypress/fixtures/KXIModule/KXITaskWrite.json";
        const withoutRM = Cypress.env("kxi").customer.decision;
        beforeEach(() => {
          cy.loginWithSession(
            "login - decisions",
            withoutRM.username,
            withoutRM.password,
            withoutRM.key
          );

          predictMenu_PO.menuClick();
          kxiData.kxiManagement();
          kxiData.defineKxi();

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
          "Create Task and Verify Unlink Workflow of KXI Task on decision side",
          { tags: ["@decision"] },
          () => {
            kxiData.optimizeMethods();
            cy.readFile(writeDataFilePath).then((file) => {
              kxiData.createTask(file.kxiName);
              kxiData.verifyUnlink(file.kxiName, kxiDef.modalText);
            });
          }
        );

        it(
          "Create Task and Verify Enter Data Workflow of KXI Task on decision side",
          { tags: ["@decision"] },
          () => {
            kxiData.optimizeMethods();
            cy.readFile(writeDataFilePath).then((file) => {
              kxiData.createTask(file.kxiName);
            });
            kxiData.verifyEnterDatalink();
            kxiData.clickEnterData();
            kxiData.verifyDataEntrybtn(kxiDef.exitDataEntry);
          }
        );
        it(
          "Verify A new column “Manual Data Entry”  should be added on Data screen which should be blank by default, if a recurring task has already been created for a KXI Definition, display a link in Manual Data Entry” column with TASK ID",
          { tags: ["@predict"] },
          () => {
            cy.visitProfile();
            predictMenu_PO.menuClick();
            kxiData.kxiManagement();
            kxiData.kxiDataMenu();
            kxiData.VerifyManualDataEntry();
          }
        );
      }
    );
  }
);
/** This code is not required because it is moved to KXIDataImprovement.js
 * Improvement is done by predict side
 * The improvement ticket is https://360factors.atlassian.net/browse/PD-23555
 */
