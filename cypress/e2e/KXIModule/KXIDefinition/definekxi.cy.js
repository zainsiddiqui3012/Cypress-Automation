import DefineKxi from "../../../support/POM/KXIModule/KxIDefinition.js";
const testDataPath = "cypress/fixtures/KXIModule/KXIDefinition.json";
import locators from "../../../fixtures/locators.json";
import BA from "../../../support/POM/Administration/BusinessArea.js";

const kxi = new DefineKxi();
const ba = new BA();
describe(
  "E2E Automation of KXI Definition",
  {
    tags: [
      "@kxi",
      "@kxi-definition",
      "@predict",
      "@pd36105",
      "@kxi-managementt",
      "@regression",
    ],
  },
  () => {
    context(
      "Add KXI Definition and verify Mandatory Fields Validations",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with KXI Customer User",
            Cypress.env("kxi").customer.withRM.username,
            Cypress.env("kxi").customer.withRM.password,
            Cypress.env("kxi").customer.withRM.key
          );
          cy.visitkxiDef();
          cy.waitForTopMsgLoaderToDisappear(15000);
          cy.waitForMyGridLoaderToDisappear(200000)
        });
        it(
          "Verify that the Data Entry Type is mandatory",
          { tags: "@pd38875" },
          () => {
            kxi.clickThreeElipses();
            kxi.clickAddKxiBtn();
            kxi.clickFormSaveBtn();
            kxi.verifyMandatoryFieldErrors();
          }
        );
        it("add KXI Definition", () => {
          cy.readFile(testDataPath).then((data) => {
            kxi.clickThreeElipses();
            kxi.clickAddKxiBtn();
            const { kxiDefName, kxiDefId } = kxi.addKxIDefinitionInfo(
              data.add.preName,
              data.add.preName,
              data.add.kxiDescription
            );
            kxi.selectDataEntryType(data.add.dataEntryType);
            kxi.selectOwner(Cypress.env("kxi").customer.withRM.username);
            //select Risk Appetite
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.riskAppetite,
              data.add.riskAppetite
            );
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.kriTypeSelector,
              data.add.kxiType
            );
            //select first Child KRI
            cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.childKriOptions)
              .not("[disabled]")
              .first()
              .invoke("text")
              .then((text) => {
                kxi.selectMethod(locators.kxi.kxiDefinition.kriDefinitionForm.selectedChildKriIds, text);
              });
            //select sibling Child
            cy.get(locators.kxi.kxiDefinition.kriDefinitionForm.siblingKriOptions)
              .not("[disabled]")
              .first()
              .invoke("text")
              .then((text) => {
                kxi.selectMethod(locators.kxi.kxiDefinition.kriDefinitionForm.selectedSiblingKxiIds, text);
              });
            //kri category
            cy.get(
              locators.kxi.kxiDefinition.kriDefinitionForm.kxicategoryID
            ).click();
            cy.dropDownSearchAndSelect(
              locators.general.selectSearch,
              data.add.kriCategory
            );
            //select status
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.status,
              data.add.status
            );
            //select input type
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.inputType,
              data.add.inputType
            );
            //click KRI Scope
            kxi.clickKRIScope(data.add.kriScope);
            //select Business Unit
            kxi.selectMethod(locators.kxi.kxiDefinition.kriDefinitionForm.businessUnit, data.add.bu);
            //select Measurement Period
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.measurementPeriod,
              data.add.measurementPeriod
            );
            kxi.setTriggerComparer(
              data.add.targetValue,
              data.add.leftTriggerLvl1,
              data.add.leftTriggerLvl2,
              data.add.leftTriggerLvl3,
              data.add.rightTriggerLvl1,
              data.add.rightTriggerLvl2,
              data.add.rightTriggerLvl3
            );
            cy.clickSaveButton();
            cy.waitForMyGridLoaderToDisappear(200000);
            kxi.writeKXINameID("add", kxiDefName, kxiDefId);
          });
        });

        it("Search new KXI Definition",()=>{
          cy.readFile(testDataPath).then((data) => {
            kxi.searchKxiDefinition(data.add.kxiDefinitionName);
          });
        })

        it(
          "Verify that user cannot add duplicate KXI definitions",
          { tags: "@pd38870" },
          () => {
            cy.readFile(testDataPath).then((data) => {
              kxi.clickThreeElipses();
              kxi.clickAddKxiBtn();
              kxi.addDuplicateName(
                data.add.kxiDefinitionID,
                data.add.kxiDefinitionName,
                data.add.kxiDescription
              );
              kxi.selectDataEntryType(data.add.dataEntryType);
              kxi.selectOwner(Cypress.env("kxi").customer.withRM.username);
              //select Risk Appetite
              kxi.selectMethod(
                locators.kxi.kxiDefinition.kriDefinitionForm.riskAppetite,
                data.add.riskAppetite
              );
              kxi.selectMethod(
                locators.kxi.kxiDefinition.kriDefinitionForm.kriTypeSelector,
                data.add.kxiType
              );
              //kri category
              cy.get(
                locators.kxi.kxiDefinition.kriDefinitionForm.kxicategoryID
              ).click();
              cy.dropDownSearchAndSelect(
                locators.general.selectSearch,
                data.add.kriCategory
              );
              //select status
              kxi.selectMethod(
                locators.kxi.kxiDefinition.kriDefinitionForm.status,
                data.add.status
              );
              //select input type
              kxi.selectMethod(
                locators.kxi.kxiDefinition.kriDefinitionForm.inputType,
                data.add.inputType
              );
              //click KRI Scope
              kxi.clickKRIScope(data.add.kriScope);
              //select Measurement Period
              kxi.selectMethod(
                locators.kxi.kxiDefinition.kriDefinitionForm.measurementPeriod,
                data.add.measurementPeriod
              );
              kxi.setTriggerComparer(
                data.add.targetValue,
                data.add.leftTriggerLvl1,
                data.add.leftTriggerLvl2,
                data.add.leftTriggerLvl3,
                data.add.rightTriggerLvl1,
                data.add.rightTriggerLvl2,
                data.add.rightTriggerLvl3
              );
              cy.clickSaveButton();
              cy.waitForElementToVisible(
                locators.administration.toastMsg,
                50000
              );
            });
          }
        );
        it(
          "Verify that Assignee field is mandatory",
          { tags: "@pd38875" },
          () => {
            kxi.clickThreeElipses();
            kxi.clickAddKxiBtn();
            kxi.clickFormSaveBtn();
            kxi.verifyMandatoryFieldErrors();
          }
        );

        it(
          "Verify character limit validation for the Summary field",
          { tags: "@pd38874" },
          () => {
            cy.readFile(testDataPath).then((data) => {
              kxi.clickThreeElipses();
              kxi.clickAddKxiBtn();
              kxi.verifyNameMaxLength(data.maxLength);
            });
          }
        );

        it(
          "Verify that the Description field does not allow more than 5000 characters",
          { tags: "@pd38874" },
          () => {
            cy.readFile(testDataPath).then((data) => {
              kxi.clickThreeElipses();
              kxi.clickAddKxiBtn();
              kxi.verifyDescriptionMaxLength(data.descriptionMaxLength);
            });
          }
        );

        it(
          "Verify that the Description field allows up to 5000 characters",
          { tags: "@pd38874" },
          () => {
            cy.readFile(testDataPath).then((data) => {
              kxi.clickThreeElipses();
              kxi.clickAddKxiBtn();
              // Generate exactly 5000 characters
              const validDescription = "A".repeat(5000);
              kxi.verifyDescriptionAllowsValidLength(validDescription);
            });
          }
        );
      }
    );

    context("update KXI Defintion", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitkxiDef();
        cy.waitForTopMsgLoaderToDisappear(15000);
        cy.waitForMyGridLoaderToDisappear(200000)
      });

      it(
        "Verify that the user can edit an existing KXI Definition",
        { tags: ["@pd38877", "@pd38878"] },
        () => {
          cy.readFile(testDataPath).then((data) => {
            kxi.searchKxiDefinition(data.add.kxiDefinitionName);
            kxi.clickEditIcon();
            const { kxiDefName, kxiDefId } = kxi.addKxIDefinitionInfo(
              data.update.preName,
              data.update.preName,
              data.update.kxiDescription
            );
            kxi.selectDataEntryType(data.update.dataEntryType);
            kxi.selectOwner(Cypress.env("kxi").customer.withRM.username);
            //select Risk Appetite
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.riskAppetite,
              data.update.riskAppetite
            );
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.kriTypeSelector,
              data.update.kxiType
            );
            //kri category
            cy.get(
              locators.kxi.kxiDefinition.kriDefinitionForm.kxicategoryID
            ).click();
            cy.dropDownSearchAndSelect(
              locators.general.selectSearch,
              data.update.kriCategory
            );
            //select status
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.status,
              data.update.status
            );
            //select input type
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.inputType,
              data.update.inputType
            );
            //click KRI Scope
            kxi.clickKRIScope(data.update.kriScope);
            //select Measurement Period
            kxi.selectMethod(
              locators.kxi.kxiDefinition.kriDefinitionForm.measurementPeriod,
              data.update.measurementPeriod
            );
            kxi.setTriggerComparer(
              data.update.targetValue,
              data.update.leftTriggerLvl1,
              data.update.leftTriggerLvl2,
              data.update.leftTriggerLvl3,
              data.update.rightTriggerLvl1,
              data.update.rightTriggerLvl2,
              data.update.rightTriggerLvl3
            );
            cy.clickSaveButton();
            kxi.writeKXINameID("update", kxiDefName, kxiDefId);
          });
        }
      );
    });

    context("verify Import Functionalities", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitkxiDef();
        cy.waitForTopMsgLoaderToDisappear(15000);
      });
      it(
        "Verify that invalid file format cannot be uploaded in Import modal",
        { tags: "@pd38869" },
        () => {
          cy.readFile(testDataPath).then((data) => {
            kxi.clickImportBtn();
            ba.uploadFileImportModal(
              data.invalidFormatFile,
              locators.general.uploadImportText,
              locators.general.importSubmitBtn,
              data.invalidImportColor
            );
          });
        }
      );
      // these cases will be failed Bug: https://360factors.atlassian.net/browse/PD-38876
      it(
        "Verify that a valid Excel file can be uploaded",
        { tags: ["@pd38872", "@pd38873"] },
        () => {
          kxi.addUsersDataImportJson(true, false);
          kxi.waitForCompletedStatus(true);
        }
      );
      // these cases will be failed Bug: https://360factors.atlassian.net/browse/PD-38876
      it("verify that imported KXI Definition is added in the grid List", () => {
        cy.readFile(testDataPath).then((data) => {
          kxi.searchKxiDefinition(
            data.update.kxiDefinitionName,
            data.update.kxiDefinitionID
          );
        });
      });
    });
  }
);
