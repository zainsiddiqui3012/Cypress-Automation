import locators from "../../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO.js";
import KXIGlobalManager from "../../../support/POM/KXIModule/KXIGlobalManager.js";
import Login_POM from "../../../support/POM/LoginPredict_PO/LoginDetails_PO.js";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM.js";
import kGM from "../../../fixtures/KXIModule/KXIGlobalManager.json";
const writeKxiNameFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXIWrite.json";
describe(
  "Predict - KXI Management Role Permissions for Predict (Global KXI-Manager)",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@role",
      "@kxi-engine",
      "@pd22134",
      "@release5.17",
      "@predict",
    ],
  },
  () => {
    let password = Cypress.env("kxi").customer.dummyPassword.password;
    let Key = Cypress.env("kxi").customer.withRM.key;
    const kxiDef = new KXI_POM();
    context(
      "Risk Data changes for Customer with ERM",
      { tags: ["@withRM"] },
      () => {
        const predictMenu_PO = new PredictMenu_PO();
        const kxi = new KXIGlobalManager();
        const Login = new Login_POM();
        const withoutRM_PEER = Cypress.env("kxi").customer.withRM;
        beforeEach(() => {
          cy.loginWithSession(
            `login - ${withoutRM_PEER.username}`,
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
        it(kGM.newSection, () => {
          kxi.navigatetoRole();

          kxi.verifyKXIGlobalManager();
        });
        it(kGM.oldSection, () => {
          kxi.navigatetoRole();
          kxi.verifyKXIDefinitionManagement();
        });

        it(kGM.createPermission, () => {
          kxi.navigatetoRole();
          kxi.verifyCreatePermission();
        });
        it(kGM.unselectReadPermission, () => {
          kxi.navigatetoRole();
          kxi.verifyCreatePermission();
          kxi.verifyReadPermission();
        });

        it(kGM.deletePermission, () => {
          kxi.navigatetoRole();
          kxi.verifyDeletePermission();
        });
        it(kGM.uncheckDelete, () => {
          kxi.navigatetoRole();
          kxi.verifyDeletePermission();
          kxi.verifyDeleteonUncheckingCreate();
        });

        it(kGM.disableUpdate, () => {
          kxi.navigatetoRole();
          kxi.verifyUpdateDisabled();
        });

        it(kGM.uncheckUpdate, () => {
          kxi.navigatetoRole();
          kxi.verifyUpdateDisabled();
          kxi.verifyUpdateUncheck();
        });
      }
    );

    context(
      "KXI Role Permission without Session for ERM Customer",
      { tags: ["@withRM"] },
      () => {
        const predictMenu_PO = new PredictMenu_PO();
        const kxi = new KXIGlobalManager();
        const Login = new Login_POM();

        it(`Create User for ${kGM.readPermission}`, () => {
          const withoutRM = Cypress.env("kxi").customer.withRM;
          cy.visit(Cypress.config("baseUrl"));
          cy.login(withoutRM.username, withoutRM.password, withoutRM.key);

          kxi.roleMenu();
          const roleName = kxi.createRole();
          kxi.AddLocator(locators.administration.roles.readCheckbox);

          kxi.userMenu();
          kxi.createUsers(roleName);

          kxi.addUsername(password);
        });
        it(kGM.readPermission, () => {
          cy.visit(Cypress.config("baseUrl"));
          cy.readFile(writeDataFilePath).then((file) => {
            console.log("Attempting to login");
            cy.login(file.userName, password, Key);
          });

          kxi.verifyKxiDefinitionViewOnly();
        });
        it(`Create User for ${kGM.userBeAbletoDelete}`, () => {
          const withoutRM = Cypress.env("kxi").customer.withRM;
          cy.visit(Cypress.config("baseUrl"));
          cy.login(withoutRM.username, withoutRM.password, withoutRM.key);

          kxi.roleMenu();
          kxi.createRole();

          kxi.AddLocator(locators.administration.roles.deleteCheckbox);
          kxi.userMenu();
          kxi.createUsers();

          kxi.addUsername(password);
        });
        it(kGM.userBeAbletoDelete, () => {
          cy.visit(Cypress.config("baseUrl"));

          cy.readFile(writeDataFilePath).then((file) => {
            cy.login(file.userName, password, Key);

            cy.visitkxiDef();

            /**Calling from KXI_POM class */
            kxiDef.addKxiDefinition(
              kGM.kxiValue,
              kGM.Left1,
              kGM.Left2,
              kGM.Left3,
              kGM.Right1,
              kGM.Right2,
              kGM.Right3,
              file.userName
            );
            kxi.deleteCustomField();

            cy.readFile(writeKxiNameFilePath).then((file) => {
              /**Calling from KXI_POM class */
              kxiDef.addKxiData(file.kxiName, kGM.kxiValue);
              kxiDef.searchkxiName(file.kxiName);
              kxi.deleteKxiData();
            });
          });
        });
        it(`Create User for ${kGM.userBeAbletoCreate}`, () => {
          const withoutRM = Cypress.env("kxi").customer.withRM;
          cy.visit(Cypress.config("baseUrl"));
          cy.login(withoutRM.username, withoutRM.password, withoutRM.key);

          kxi.roleMenu();
          kxi.createRole();

          kxi.AddLocator(locators.administration.roles.createCheckbox);

          kxi.userMenu();
          kxi.createUsers();

          kxi.addUsername(password);
        });

        it(kGM.userBeAbletoCreate, () => {
          cy.visit(Cypress.config("baseUrl"));
          cy.readFile(writeDataFilePath).then((file) => {
            cy.login(file.userName, password, Key);

            /**Calling from KXI_POM class */
            cy.visitkxiDef();
            kxiDef.addKxiDefinition(
              kGM.kxiValue,
              kGM.Left1,
              kGM.Left2,
              kGM.Left3,
              kGM.Right1,
              kGM.Right2,
              kGM.Right3,
              file.userName
            );
            kxi.editKxiDefinition();
            cy.readFile(writeKxiNameFilePath).then((file) => {
              /**Calling from KXI_POM class */
              kxiDef.addKxiData(file.kxiName, kGM.kxiValue);
            });
          });
        });
      }
    );
  }
);
