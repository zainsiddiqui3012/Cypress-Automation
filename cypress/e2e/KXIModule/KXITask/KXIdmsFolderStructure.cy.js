/// <reference types= "cypress" />

import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";

import kxiDef from "../../../fixtures/KXIModule/FredQuery.json";

describe(
  "DMS Folder Structure for KxI Management",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@dms",
      "@pd23287",
      "@release5.19",
      "@customer",
    ],
  },
  () => {
    context("KXI Update Task button", { tags: ["@decision"] }, () => {
      const kxi = new KXI_POM();
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

      it("Verify Folder is created  for 'KXI Management' module in DMS", () => {
        kxi.navigateToDms();

        kxi.searchInDMS(kxiDef.moduleName);
      });
      it("Add Kxi Definition and kxi Data", () => {
        kxi.navigateToKxiDefAndOpenTaskModal();
        kxi.addKxiDefinition(
          kxiDef.kxiValue,
          kxiDef.Left1,
          kxiDef.Left2,
          kxiDef.Left3,
          kxiDef.Right1,
          kxiDef.Right2,
          kxiDef.Right3
        );
        cy.readFile(writeDataFilePath).then((file) => {
          kxi.addKxiData(file.kxiName, kxiDef.kxiValue);
        });
      });

      it("Verify Folder is created  for 'KXI Update Task' under kxi definition folder in DMS", () => {
        kxi.verifyUpdateTaskFolder();

        kxi.navigateToDms();

        kxi.searchKxiUpdateFolder();
      });
      it("Verify Folder is created  for 'KXI Regular Task' under kxi definition  in DMS", () => {
        cy.readFile(writeDataFilePath).then((file) => {
          kxi.navigateToKxiData(file.kxiName);
        });

        kxi.navigateToDms();

        kxi.searchKxiRegularFolder();
      });

      it("Verify Folder is created  for 'KXI Update Task Child task' under KXi Update folder in DMS", () => {
        kxi.createChildTask();

        kxi.navigateToDms();

        kxi.verifyChildTaskInDMS();
      });
    });
  }
);
