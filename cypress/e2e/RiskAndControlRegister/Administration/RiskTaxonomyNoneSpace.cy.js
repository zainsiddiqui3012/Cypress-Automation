import locators from "../../../fixtures/locators.json";
import {
  RiskTaxonomy,
  RiskCategory,
  RiskDefinition,
  TreeOperations,
  ControlOperations,
  ImportOperations
} from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyNoneSpace";
import Customer from "../../../support/POM/Administration/Customer";
import Assessment from "../../../support/POM/Administration/Assessment";
import customers from "../../../fixtures/Administration/Customers.json";
const data =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyNoneSpace.json";
const sampleImportFile =
  "cypress/attachment/ImportTemplate_RiskTaxonomy_NoneReseller.xlsx";
const customer = new Customer();
const assessment = new Assessment();
const riskTaxonomy = new RiskTaxonomy();
const riskCategory = new RiskCategory();
const riskDefinition = new RiskDefinition();
const treeOperations = new TreeOperations();
const controlOperations = new ControlOperations();
const importOperations = new ImportOperations();

describe(
  "E2E Automation of Risk Taxonomies Screen from None Space (CRUD Operations)",
  {
    tags: [
      "@pd36719",
      "@regression",
      "@risk-management",
      "@none-space",
      "@risk-taxonomy",
      "@risk-category",
      "@risk-definition",
    ],
  },
  () => {
    context(
      "Risk Taxanomies Test Cases.",
      {
        tags: [
          "@update-customers",
          "@create-assign-risk-taxanomies",
          "@create-assign-control-taxanomies",
          "@create-assign-content-libraries",
          "@assign-assessments",
        ],
      },
      () => {
        before(() => {
          assessment.updateAssessmentFile("Assessments_PAP.json");
        });

        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            Cypress.env("kxi").none.username,
            Cypress.env("kxi").none.password,
            Cypress.env("kxi").none.key
          );
        });

        it(
          "Add new Content Source, Content Library for new Risk Taxnomies",
          { tags: ["@pd30332", "@content-source", "@content-libraries","@smoke"] },
          () => {
            cy.readFile(data).then((readData) => {
              const riskTaxanomyData =
                readData.riskTaxonomy.contentLibraryRequired;
              cy.log(
                "this is the Content Library Required Value",
                riskTaxanomyData
              );
              if (riskTaxanomyData) {
                assessment.contentSource(
                  customers.customerProfileData.contentLibrary,
                  true
                );
                assessment.contentLibrary(
                  customers.customerProfileData.contentLibrary,
                  true
                );
              }
            });
          }
        );

        it("Add Risk Taxonomy without Name", { tags: ["@pd42304","@smoke"] }, () => {
          cy.visitRiskTaxonomy();
          cy.readFile(data).then((readData) => {
            riskTaxonomy.addRiskTaxonomyWithoutName(
              readData.riskTaxonomy.emptyRecordError
            );
          });
        });

        it(
          "Add Risk Taxanomy with Content Library from Administration",
          { tags: ["@pd28361", "@risk-taxanomies","@smoke"] },
          () => {
            customer.addRiskTaxonomy();
            //write Risk Taxonomy Name to write JSON file
            riskTaxonomy.writeRiskTaxonomyName();
          }
        );
        it(
          "Verify changing status from Active to Inactive",
          { tags: ["@pd42301"] },
          () => {
            cy.visitRiskTaxonomy();
            cy.readFile(data).then((readData) => {
              riskTaxonomy.searchRiskTaxonomy();
              riskTaxonomy.changedStatus(readData.riskTaxonomy.statusInactive);
              riskTaxonomy.verifyStatus(readData.riskTaxonomy.statusInactive);
            });
          }
        );
        it(
          "Verify changing status from Inactive to Active",
          { tags: ["@pd42301"] },
          () => {
            cy.visitRiskTaxonomy();
            cy.readFile(data).then((readData) => {
              riskTaxonomy.searchRiskTaxonomy();
              riskTaxonomy.changedStatus(readData.riskTaxonomy.statusActive);
              riskTaxonomy.verifyStatus(readData.riskTaxonomy.statusActive);
            });
          }
        );
        it(
          "Add Risk Taxonomy with existing Name",
          { tags: ["@pd42264","@smoke"] },
          () => {
            cy.readFile(data).then((readData) => {
              customer.addRiskTaxonomy(
                readData.riskTaxonomy.duplicateName,
                true
              );
            });
          }
        );
        it(
          "Edit Risk Taxonomy (inline) to invalid data",
          { tags: ["@pd42295"] },
          () => {
            cy.visitRiskTaxonomy();
            riskTaxonomy.searchRiskTaxonomy(false);
            riskTaxonomy.clickSearchedRiskTaxonomy();
            riskTaxonomy.clearExistingName();
            riskTaxonomy.verifyNameError();
          }
        );
        it(
          "Verify filtering Risk Taxonomies by Name",
          { tags: ["@pd42305"] },
          () => {
            cy.visitRiskTaxonomy();
            cy.waitForTopMsgLoaderToDisappear(30000);
            cy.readFile(data).then((readData) => {
              riskTaxonomy.clickFilterIcon(0);
              riskTaxonomy.typeFilterName(
                readData.riskTaxonomy.riskTaxonomyName,
                0
              );
              riskTaxonomy.verifySearchRiskTaxonomyLength();
            });
          }
        );
        it(
          "Verify filtering Risk Taxonomies by Status",
          { tags: ["@pd42305"] },
          () => {
            cy.visitRiskTaxonomy();
            cy.waitForTopMsgLoaderToDisappear(30000);
            cy.readFile(data).then((readData) => {
              riskTaxonomy.clickFilterIcon(3);
              riskTaxonomy.typeStatusName(readData.riskTaxonomy.statusActive);
              // Now Filter with Risk Taxonomy Name
              riskTaxonomy.clickFilterIcon(0);
              riskTaxonomy.typeFilterName(
                readData.riskTaxonomy.riskTaxonomyName,
                0
              );
              riskTaxonomy.verifySearchRiskTaxonomyLength();
            });
          }
        );
        it(
          "Edit Risk Taxonomy (inline) successfully",
          { tags: ["@pd42295","@smoke"] },
          () => {
            cy.readFile(data).then((readData) => {
              cy.createRandomString(5).then((randomString) => {
                const updatedName = `Updated Risk Taxonomy $$$ ${randomString}`;
                cy.visitRiskTaxonomy();
                riskTaxonomy.searchRiskTaxonomy(false);
                riskTaxonomy.clickSearchedRiskTaxonomy();
                riskTaxonomy.typeRiskTaxonomyName(updatedName);
                cy.waitForToastMessageToDisappear(30000);
                riskTaxonomy.typeDescription(
                  readData.riskTaxonomy.descriptionText
                );
                cy.waitForElementToVisible(
                  locators.administration.toastMsg,
                  10000
                );
                cy.reload();
                riskTaxonomy.searchRiskTaxonomy(updatedName);
                riskTaxonomy.writeRiskTaxonomyName(true, updatedName);
              });
            });
          }
        );
        it(
          "Verify viewing Risk Taxonomy details",
          { tags: ["@pd42252","@smoke"] },
          () => {
            cy.visitRiskTaxonomy();
            riskTaxonomy.searchRiskTaxonomy();
            riskTaxonomy.clickViewAction();
            riskTaxonomy.verifyViewActionScreenOpen();
          }
        );
      }
    );
    context("Risk Category Test Cases", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitRiskTaxonomy();
        riskTaxonomy.searchRiskTaxonomy();
        riskTaxonomy.clickViewAction();
        riskTaxonomy.verifyViewActionScreenOpen();
      });

      it(
        "Add Risk Category with valid data",
        { tags: ["@smoke", "@pd42242"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            riskCategory.addRiskCategory(
              "add",
              readData.riskCatagory.add.baseName,
              readData.riskCatagory.add.description
            );
          });
        }
      );
      it(
        "Verify New Risk Category is Added Succesfully",
        { tags: ["@smoke", "@pd42242"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.verifyAddedRiskCategory(
              readData.riskCatagory.add.name
            );
          });
        }
      );

      it(
        "Add Risk Category with missing required field",
        { tags: ["@pd42270","@smoke"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            riskCategory.addRiskCategoryWithMissingName(
              readData.riskCatagory.validationErrors.missingField
            );
          });
        }
      );

      it(
        "Add Risk Category with max name length (255 characters)",
        { tags: ["@pd42245"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            const longName = riskCategory.addRiskCategoryWithMaxLength(
              readData.riskCatagory.nameMaxLength
            );
            riskCategory.verifyAddedRiskCategory(longName);
          });
        }
      );

      it(
        "Add Risk Category exceeding name limit",
        { tags: ["@pd42236"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            riskCategory.addRiskCategoryExceedingNameLimit();
          });
        }
      );

      it(
        "Add Risk Category with max description (5000 characters)",
        { tags: ["@pd42260"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            const createdName =
              riskCategory.addRiskCategoryWithMaxDescription();
            riskCategory.verifyAddedRiskCategory(createdName);
          });
        }
      );

      it(
        "Add Risk Category exceeding description limit",
        { tags: ["@pd42287"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            riskCategory.addRiskCategoryExceedingDescriptionLimit();
          });
        }
      );

      it("Cancel Add Risk Category form", { tags: ["@pd42317"] }, () => {
        cy.readFile(data).then((readData) => {
          riskCategory.clickAddRiskCategory(readData.riskCatagory.formBtnText);
          riskCategory.cancelAddRiskCategory();
          // Verify form is closed and no data is saved
          riskCategory.verifyFormClosed();
        });
      });

      it(
        "Add Risk Category with special characters",
        { tags: ["@pd42242"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.clickAddRiskCategory(
              readData.riskCatagory.formBtnText
            );
            const specialCharName =
              riskCategory.addRiskCategoryWithSpecialChars();
            riskCategory.verifyAddedRiskCategory(specialCharName);
          });
        }
      );

      it("Add duplicate Risk Category name", { tags: ["@pd42260"] }, () => {
        // First, get an existing category name
        cy.readFile(data).then((readData) => {
          const existingName = readData.riskCatagory.add.name;
          riskCategory.clickAddRiskCategory(readData.riskCatagory.formBtnText);
          riskCategory.addDuplicateRiskCategory(existingName);
        });
      });

      it(
        "Edit existing Risk Category",
        { tags: ["@smoke", "@pd42247"] },
        () => {
          cy.readFile(data).then((readData) => {
            const existingCategoryName = readData.riskCatagory.add.name;
            const baseName = readData.riskCatagory.update.baseName;
            riskCategory.editRiskCategory(
              "update",
              baseName,
              existingCategoryName
            );
          });
        }
      );

      it(
        "Verify Risk Category Name is Updated",
        { tags: ["@smoke", "@pd42247"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskCategory.verifyAddedRiskCategory(
              readData.riskCatagory.update.name
            );
            riskCategory.writeRiskCategoryNameInRiskDefinition(
              readData.riskCatagory.update.name
            );
          });
        }
      );
    });
    context("Risk Definition Test Cases", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitRiskTaxonomy();
        riskTaxonomy.searchRiskTaxonomy();
        riskTaxonomy.clickViewAction();
        riskTaxonomy.verifyViewActionScreenOpen();
      });

      it(
        "Add Risk Definition with valid data",
        { tags: ["@smoke", "@pd42250"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionValidData("add");
          });
        }
      );

      it(
        "Verify that Risk Definition is correctly Added",
        { tags: ["@smoke", "@pd42250"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.verifyAddedRiskDefinition(
              readData.riskDefinition.add.riskCategory,
              readData.riskDefinition.add.name
            );
          });
        }
      );

      it(
        "Add Risk Definition with missing required fields",
        { tags: ["@pd42243","@smoke"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionMissingFields(
              readData.riskDefinition.validationErrors.missingField
            );
          });
        }
      );

      it(
        "Add Risk Definition with missing Name",
        { tags: ["@pd42244","@smoke"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionMissingName(
              readData.riskDefinition.validationErrors.missingName,
              readData.riskDefinition.add.riskCategory
            );
          });
        }
      );

      it(
        "Add Risk Definition with missing Risk Category",
        { tags: ["@pd42243","@smoke"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionMissingCategory(
              readData.riskDefinition.validationErrors.missingField
            );
          });
        }
      );

      it(
        "Add Risk Definition with special characters",
        { tags: ["@pd42263"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionWithSpecialChars(
              readData.riskDefinition.specialCharacters,
              readData.riskDefinition.add.riskCategory
            );
            riskCategory.verifyAddedRiskCategory(
              readData.riskDefinition.add.riskCategory
            );
          });
        }
      );

      it(
        "Add Risk Definition with max length name",
        { tags: ["@pd42274"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionMaxLengthName(
              readData.riskDefinition.nameMaxLength
            );
          });
        }
      );

      it(
        "Add Risk Definition with max length description",
        { tags: ["@pd42277"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionMaxLengthDescription(
              readData.riskDefinition.descriptionMaxLength
            );
          });
        }
      );

      it(
        "Add Risk Definition without Library Risk Definition ID",
        { tags: ["@pd42276"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionWithoutLibraryId(
              readData.riskDefinition.validationErrors.missingField
            );
          });
        }
      );

      it(
        "Edit Risk Definition - Change Description",
        { tags: ["@pd42279"] },
        () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.riskDefinition.add.name;
            riskDefinition.verifyAddedRiskDefinition(
              readData.riskDefinition.add.riskCategory,
              definitionName
            );
            riskDefinition.editRiskDefinitionDescription(
              definitionName,
              readData.riskDefinition.update.description
            );
          });
        }
      );

      it(
        "Edit Risk Definition - Change Risk Category",
        { tags: ["@pd42279"] },
        () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.riskDefinition.add.name;
            const riskCategory = readData.riskDefinition.add.riskCategory;
            riskDefinition.verifyAddedRiskDefinition(
              riskCategory,
              definitionName
            );
            riskDefinition.editRiskDefinitionCategory(
              definitionName,
              riskCategory,
              true
            );
          });
        }
      );

      it(
        "Edit Risk Definition - Change From Inactive to Active",
        { tags: ["@pd42279"] },
        () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.riskDefinition.add.name;
            riskDefinition.verifyAddedRiskDefinition(
              readData.riskDefinition.add.riskCategory,
              definitionName
            );
            riskDefinition.editRiskDefinitionStatusInactive(
              definitionName,
              "Active",
              true
            );
          });
        }
      );

      it("Cancel Risk Definition Add", { tags: ["@pd42317"] }, () => {
        cy.readFile(data).then((readData) => {
          riskDefinition.clickAddRiskDefinition(
            readData.riskDefinition.formBtnText
          );
          riskDefinition.cancelRiskDefinitionAdd();
          cy.get("#addRiskSlider").should(
            "not.have.class",
            "m-quick-sidebar--on"
          );
        });
      });

      it(
        "Add Risk Definition with rich text in description",
        { tags: ["@pd42285"] },
        () => {
          cy.readFile(data).then((readData) => {
            riskDefinition.clickAddRiskDefinition(
              readData.riskDefinition.formBtnText
            );
            riskDefinition.addRiskDefinitionWithRichText(
              readData.riskDefinition.add.riskCategory,
              readData.riskDefinition.richTextDescription
            );
            riskCategory.verifyAddedRiskCategory(
              readData.riskDefinition.add.riskCategory
            );
          });
        }
      );

      it("Add duplicate Risk Definition ID", { tags: ["@pd42260"] }, () => {
        cy.readFile(data).then((readData) => {
          const existingId = readData.riskDefinition.add.name;
          riskDefinition.clickAddRiskDefinition(
            readData.riskDefinition.formBtnText
          );
          riskDefinition.addDuplicateRiskDefinitionId(
            existingId,
            readData.riskDefinition.add.riskCategory
          );
        });
      });

      // when the status is Inactive the definition dissappear from the main screen might be the bug.
      it.skip("Edit Risk Definition - Change Status to Inactive", () => {
        cy.readFile(data).then((readData) => {
          const definitionName = readData.riskDefinition.add.name;
          riskDefinition.verifyAddedRiskDefinition(
            readData.riskDefinition.add.riskCategory,
            definitionName
          );
          riskDefinition.editRiskDefinitionStatusInactive(
            definitionName,
            "Inactive",
            true
          );
        });
      });
    });    
    context("Link Control Test Cases", { tags: "link-controls" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitRiskTaxonomy();
        riskTaxonomy.searchRiskTaxonomy();
        riskTaxonomy.clickViewAction();
        riskTaxonomy.verifyViewActionScreenOpen();

        // Navigate to a risk definition and open controls
        cy.readFile(data).then((readData) => {
          const categoryName = readData.riskCatagory.update.name;
          const definitionName = readData.riskDefinition.add.name;
          // Expand category and click on risk definition
          cy.wait(4000); // it was displaying previous page data
          treeOperations.expandCategoryNode(categoryName);
          treeOperations.clickRiskDefinition(categoryName, definitionName);
        });
      });

      it("Cancel Without Saving Controls", { tags: "@pd40673" }, () => {
        cy.readFile(data).then((readData) => {
          controlOperations.setupControlTree();
          controlOperations.selectMultipleControls(
            readData.riskDefinition.controlDefinitions
          );

          // Cancel instead of saving
          controlOperations.clickCancel();

          // Verify we're back to the main risk taxonomy page
          cy.url().should("include", "riskTaxonomy");
        });
      });

      it("Save Without Linking Controls", { tags: "@pd40669" }, () => {
        cy.readFile(data).then((readData) => {
          controlOperations.setupControlTree();
          // Don't select any controls, just save
          controlOperations.clickSave();

          // Verify no controls are selected
          controlOperations.verifyControlUnlinked(
            readData.riskDefinition.controlDef1
          );
          controlOperations.verifyControlUnlinked(
            readData.riskDefinition.controlDef2
          );
        });
      });

      it("Link Single Control", { tags: "@pd40666" }, () => {
        cy.readFile(data).then((readData) => {
          controlOperations.setupControlTree();
          controlOperations.selectSingleControl(
            readData.riskDefinition.controlDef1
          );
          controlOperations.clickSave();

          // Verify control is linked
          controlOperations.verifyControlLinked(
            readData.riskDefinition.controlDef1
          );
        });
      });

      it("Link Multiple Controls", { tags: "@pd40667" }, () => {
        cy.readFile(data).then((readData) => {
          controlOperations.setupControlTree();
          controlOperations.selectSingleControl(
            readData.riskDefinition.controlDef1
          );
          controlOperations.selectMultipleControls(
            readData.riskDefinition.controlDefinitions
          );
          controlOperations.clickSave();

          // Verify both controls are linked
          controlOperations.verifyControlLinked(
            readData.riskDefinition.controlDef1
          );
          controlOperations.verifyControlLinked(
            readData.riskDefinition.controlDef2
          );
        });
      });

      it("Unlink a Control", { tags: "@pd40670" }, () => {
        cy.readFile(data).then((readData) => {
          controlOperations.setupControlTree();

          // unlink Control
          controlOperations.unselectControl(
            readData.riskDefinition.controlDef1
          );
          controlOperations.clickSave();
          controlOperations.verifyControlUnlinked(
            readData.riskDefinition.controlDef1
          );
        });
      });
    });
    context("Tree Operations Test Cases", { tags: "tree-operations" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitRiskTaxonomy();
        riskTaxonomy.searchRiskTaxonomy();
        riskTaxonomy.clickViewAction();
        riskTaxonomy.verifyViewActionScreenOpen();
        cy.wait(3000); // it was displaying previous page data
      });

      it("Expand single category node", { tags: "@pd40626" }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.riskCatagory.update.name;
          treeOperations.expandCategoryNode(categoryName);
        });
      });

      it("Collapse single category node", { tags: "@pd40627" }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.riskCatagory.update.name;
          // First expand, then collapse
          treeOperations.expandCategoryNode(categoryName);
          treeOperations.collapseCategoryNode(categoryName);
        });
      });

      it("Delete a Risk Definition with confirmation", () => {
        cy.readFile(data).then((readData) => {
          const definitionName = readData.riskDefinition.add.name;
          const categoryName = readData.riskCatagory.update.name;
          treeOperations.expandCategoryNode(categoryName); // Ensure parent category is expanded
          treeOperations.deleteRiskDefinition(
            categoryName,
            definitionName,
            true
          );
        });
      });

      it("Attempt to delete without confirmation", { tags: "@pd40632" }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.riskCatagory.update.name;
          treeOperations.deleteRiskCategoryWithChildren(categoryName, false);
        });
      });

      it("Delete a Risk Category with children and confirmation", () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.riskCatagory.update.name;
          treeOperations.deleteRiskCategoryWithChildren(categoryName, true);
        });
      });
    });
    context("Import Test Cases", { tags: "import" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          Cypress.env("kxi").none.username,
          Cypress.env("kxi").none.password,
          Cypress.env("kxi").none.key
        );
        cy.visitRiskTaxonomy();
      });

      it("Open Import Modal", { tags: "pd42286" }, () => {
        importOperations.openImportModal();
      });

      it("Download Sample File", { tags: "@pd42298" }, () => {
        importOperations.openImportModal();
        importOperations.downloadSampleFile();
      });

      it("Import Valid File", { tags: "@pd40677" }, () => {
        const runImportWorkflow = () => {
          return importOperations
            .completeImportWorkflow("COMPLETED")
            .then((importedName) => {
              cy.log(`Received imported name: ${importedName}`);

              cy.readFile(data).then((readData) => {
                readData.riskTaxonomy.riskTaxonomyName = importedName;
                cy.writeFile(data, readData);
                cy.log(`Updated data file with imported name: ${importedName}`);
              });
            });
        };

        cy.task("fileExists", sampleImportFile).then((exists) => {
          if (!exists) {
            // Download file first, then import
            importOperations.openImportModal();
            importOperations.downloadSampleFile().then(() => {
              // Verify download completed
              cy.task("fileExists", sampleImportFile).should("be.true");
              runImportWorkflow();
            });
          } else {
            // File exists, proceed directly
            runImportWorkflow();
          }
        });
      });

      it("Verify that the imported Risk Taxonomy is Added & present in Grid", () => {
        cy.readFile(data).then((readData) => {
          const importedName = readData.riskTaxonomy.riskTaxonomyName;
          riskTaxonomy.searchRiskTaxonomy(importedName);
        });
      });

      it("Import Invalid File Format", { tags: "@pd40679" }, () => {
        importOperations.openImportModal();
        importOperations.importInvalidFileFormat();
      });

      it("Cancel Import", { tags: "@pd40680" }, () => {
        importOperations.openImportModal();
        importOperations.cancelImport();
      });
    });
  }
);
