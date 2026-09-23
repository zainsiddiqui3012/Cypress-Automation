import {
  RiskTaxonomy,
  RiskCategory,
  RiskDefinition,
} from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js";
import ValidationHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/ValidationHelper.js";
import locators from "../../../fixtures/locators.json";
import UIHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/UIHelper.js";
const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const riskTaxonomy = new RiskTaxonomy();
const riskCatagory = new RiskCategory();
const riskDefinition = new RiskDefinition();

describe(
  "Risk Definition Customer Space - Comprehensive Tests",
  {
    tags: [
      "@risk-management",
      "@customer",
      "@regression",
      "@risk-definition",
      "@risk-taxonomy",
      "@pd36730"
    ],
  },
  () => {
    const session = () => {
      const withRM = Cypress.env("kxi").customer.withRM;
      cy.loginWithSession(
        "login with Risk Management User",
        withRM.username,
        withRM.password,
        withRM.key
      );
      cy.visitRiskTaxonomies();
    };

    let getData;
    before(()=>{
      cy.readFile(writeDataFilePath).then((data) => {
        getData = data.riskDefinition.validationErrors;
      });
    });

    context(
      "Risk Definition - Negative Test Cases",
      {
        tags: ["@add", "@negative"],
      },
      () => {
        beforeEach(() => {
          session();
        });

        it(
          "Add Risk Definition with missing Name",
          {
            tags: ["@negative", "@validation","@smoke"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            // riskDefinition.addRiskDefinitionWithoutName();
            riskTaxonomy.saveRiskCategory();
            ValidationHelper.verifyValidationError(
              getData.missingName
            );
          }
        );

        it(
          "Add Risk Definition without selecting a Risk Category",
          {
            tags: ["@negative", "@missing-fields","@smoke"],
          },
          () => {
            riskTaxonomy.generateAndWriteRiskDefinitionDataInFile(
              writeDataFilePath
            );
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionWithoutRiskCategory();
            riskDefinition.saveRiskDefinition(
              locators.risk.administration.riskDefinition.customerSpace.saveBtn
            );
            ValidationHelper.verifyValidationError(
              getData.requiredAllFieldsEmpty
            );
          }
        );

        it(
          "Add Risk Definition without selecting Business Area",
          {
            tags: ["@negative", "@missing-fields"],
          },
          () => {
            riskTaxonomy.generateAndWriteRiskDefinitionDataInFile(
              writeDataFilePath
            );
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionWithoutBusinessArea();
            riskDefinition.saveRiskDefinition(
              locators.risk.administration.riskDefinition.customerSpace.saveBtn
            );
            // Verify appropriate error is shown
          }
        );

        it("Verify that Risk Definition is added without Business Area Definitions.", () => {
          riskDefinition
            .getDefinitionDataFromFile(writeDataFilePath, "add")
            .then((data) => {
              // riskDefinition.verifyRiskDefinitionInGrid(
              //   definitionData.riskDefinition.add.name
              // );
              cy.wait(2000); // Wait for grid to load
              riskTaxonomy.searchInGrid(
                locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                data.name
              );
              riskDefinition.expandRiskCategory();
              UIHelper.verifyTextContent(
                locators.general.gridName,
                data.name,
                1
              );
            });
        });

        it(
          "Leave all fields blank and click Save",
          {
            tags: ["@negative", "@validation", "@blank-fields","@smoke"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionWithAllFieldsBlank();
            riskDefinition.saveRiskDefinition(
              locators.risk.administration.riskDefinition.customerSpace.saveBtn
            );
            ValidationHelper.verifyValidationError(
              getData.requiredAllFieldsEmpty
            );
          }
        );
      }
    );

    context(
      "Risk Definition - Positive Test Cases",
      {
        tags: ["@positive", "@add", "@edit"],
      },
      () => {
        beforeEach(() => {
          session();
        });

        it(
          "Add valid Risk Definition",
          {
            tags: ["@smoke", "@positive","@smoke"],
          },
          () => {
            riskTaxonomy.generateAndWriteRiskDefinitionDataInFile(
              writeDataFilePath,
              "add"
            );
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionValidData("add");
            riskDefinition.saveRiskDefinition(
              locators.risk.administration.riskDefinition.customerSpace.saveBtn
            );
          }
        );

        it("verify that Newly Added Risk Definition is added and visible in the grid",{tags:"@smoke"}, () => {
          riskDefinition
            .getDefinitionDataFromFile(writeDataFilePath, "add")
            .then((data) => {
              riskCatagory.verifyGridContainsMinimumRows();
              riskTaxonomy.searchInGrid(
                locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                data.name
              );
              UIHelper.verifyTextContent(
                locators.general.gridName,
                data.name,
                1
              );
            });
        });

        it(
          "Add Risk Definition with maximum characters in Description (5000 chars)",
          {
            tags: ["@boundary", "@positive"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            riskDefinition
              .addRiskDefinitionWithMaxLengthDescription()
              .then((name) => {
                riskDefinition.saveRiskDefinition(
                  locators.risk.administration.riskDefinition.customerSpace
                    .saveBtn
                );
                // Verify success
                cy.reload(true);
                riskTaxonomy.searchInGrid(
                  locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                  name
                );
                UIHelper.verifyTextContent(locators.general.gridName, name, 1);
              });
          }
        );

        it(
          "Add Risk Definition with special characters in Name",
          {
            tags: ["@positive", "@special-chars"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            riskDefinition
              .addRiskDefinitionWithSpecialCharacters()
              .then((name) => {
                riskDefinition.saveRiskDefinition(
                  locators.risk.administration.riskDefinition.customerSpace
                    .saveBtn
                );
                // Verify success
                cy.reload(true);
                riskCatagory.verifyGridContainsMinimumRows();
                riskTaxonomy.searchInGrid(
                  locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                  name
                );
                UIHelper.verifyTextContent(locators.general.gridName, name, 1);
              });
          }
        );

        it(
          "Select Risk Category tree item",
          {
            tags: ["@tree", "@positive"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              riskDefinition.clickAddRiskDefinition();
              riskDefinition.verifyTreeStructureInSelectionPanel(
                data.riskDefinition.add.riskCategory
              );
              riskDefinition.cancelRiskDefinition();
            });
          }
        );

        it(
          "Edit existing Risk Definition successfully",
          {
            tags: ["@edit", "@positive","@smoke"],
          },
          () => {
            // const newName = "Updated Risk Definition " + Date.now();
            const newDescription =
              "Updated comprehensive description for testing";
            riskCatagory.clickEditIconForCategory();

            // Fix: Handle the Promise properly
            riskDefinition
              .generateAndWriteRiskDefinitionDataInFile(
                writeDataFilePath,
                "update"
              )
              .then((newName) => {
                // Now newName is the actual string value, not a Promise
                riskDefinition.editRiskDefinitionSuccess(
                  newName,
                  newDescription
                );
                riskDefinition.saveRiskDefinition(
                  locators.risk.administration.riskDefinition.customerSpace
                    .editSaveBtn
                );
              });
            // riskDefinition.verifyRiskDefinitionInGrid(newName);
          }
        );

        it("verify that Risk Definition is Updated and visible in the grid",{tags:"@smoke"}, () => {
          riskDefinition
            .getDefinitionDataFromFile(writeDataFilePath, "update")
            .then((data) => {
              riskCatagory.verifyGridContainsMinimumRows();
              riskTaxonomy.searchInGrid(
                locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                data.name
              );
              UIHelper.verifyTextContent(
                locators.general.gridName,
                data.name,
                1
              );
            });
        });

        it(
          "For Assessments field's visibility customer should have Assessments module enabled",
          {
            tags: ["@assessments", "@module-dependency", "@positive","@smoke"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.verifyAssessmentFieldsVisibility({
              probability: true,
              impact: true,
              controlEnvironment: true,
            });
            riskDefinition.cancelRiskDefinition();
          }
        );

        it(
          "Assign all three assessment types",
          {
            tags: ["@assessments", "@positive","@smoke"],
          },
          () => {
            riskTaxonomy.generateAndWriteRiskDefinitionDataInFile(
              writeDataFilePath
            );
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionValidData("add");
            riskDefinition.saveRiskDefinition(
              locators.risk.administration.riskDefinition.customerSpace.saveBtn
            );
          }
        );

        it("verify that Newly Added Risk Definition is added and visible in the grid",{tags:"@smoke"}, () => {
          riskDefinition
            .getDefinitionDataFromFile(writeDataFilePath, "add")
            .then((data) => {
              riskCatagory.verifyGridContainsMinimumRows();
              riskTaxonomy.searchInGrid(
                locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                data.name
              );
              UIHelper.verifyTextContent(
                locators.general.gridName,
                data.name,
                1
              );
            });
        });

        it(
          "Cancel button on Add form",
          {
            tags: ["@cancel", "@positive"],
          },
          () => {
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionValidData("add");
            riskDefinition.cancelRiskDefinition();
            // Verify form is closed without saving
          }
        );

        it(
          "Description field allows basic formatting",
          {
            tags: ["@formatting", "@positive", "@rich-text"],
          },
          () => {
            riskTaxonomy.generateAndWriteRiskDefinitionDataInFile(
              writeDataFilePath
            );
            riskDefinition.clickAddRiskDefinition();
            riskDefinition.addRiskDefinitionValidData("add");
            // Test rich text formatting in description
            cy.readFile(writeDataFilePath).then((data) => {
              const richTextDescription =
                data.riskDefinition.richTextDescription;
              // Use CKEditor to add formatting
              cy.window().then((win) => {
                if (
                  win.CKEDITOR &&
                  win.CKEDITOR.instances.riskDefinitionDescription
                ) {
                  win.CKEDITOR.instances.riskDefinitionDescription.setData(
                    richTextDescription
                  );
                }
              });
              riskDefinition.saveRiskDefinition(
                locators.risk.administration.riskDefinition.customerSpace
                  .saveBtn
              );
              // Verify formatting is retained
            });
          }
        );

        it("verify that Newly Added Risk Definition is added and visible in the grid", () => {
          riskDefinition
            .getDefinitionDataFromFile(writeDataFilePath, "add")
            .then((data) => {
              riskTaxonomy.searchInGrid(
                locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
                data.name
              );
              UIHelper.verifyTextContent(
                locators.general.gridName,
                data.name,
                1
              );
            });
        });
      }
    );
  }
);
