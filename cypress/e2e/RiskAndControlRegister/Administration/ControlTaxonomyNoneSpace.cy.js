import {
  ControlTaxonomy,
  ControlCategory,
  ControlDefinition,
  TreeOperations,
  ImportOperations,
} from "../../../support/POM/RiskAndControlRegister/Administration/ControlTaxonomyNoneSpace";
import Customer from "../../../support/POM/Administration/Customer";

const data =
  "cypress/fixtures/RiskAndControlRegister/Administration/ControlTaxonomyNoneSpace.json";

const customer = new Customer();
const controlTaxonomy = new ControlTaxonomy();
const controlCategory = new ControlCategory();
const controlDefinition = new ControlDefinition();
const treeOperations = new TreeOperations();
const importOperations = new ImportOperations();
const rmUser = Cypress.env("kxi").none;

describe(
  "E2E Automation of Control Taxonomies Screen from None Space (CRUD Operations, Tree Operations, Import/Export)",
  {
    tags: [
      "@pd36718",
      "@regression",
      "@control-management",
      "@none-space",
      "@control-taxonomy",
      "@control-category",
      "@control-definition",
      "@import",
    ],
  },
  () => {
    context(
      "Control Taxonomies Test Cases",
      { tags: "control-taxonomies" },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
        });

        it("Load Control Taxonomies List", { tags: ["@pd42503", "@smoke"] }, () => {
          cy.visitControlTaxonomy();
          controlTaxonomy.verifyControlTaxonomyGridLoaded();
        });

        it("Add Control Taxonomy without Name", { tags: ["@pd42529","@smoke"] }, () => {
          cy.visitControlTaxonomy();
          cy.readFile(data).then((readData) => {
            controlTaxonomy.addControlTaxonomyWithoutName(
              readData.controlTaxonomy.emptyRecordError
            );
          });
        });

        it(
          "Add Control Taxonomy with Valid Input",
          { tags: ["@smoke", "@pd42525"] },
          () => {
            cy.visitControlTaxonomy();
            customer.addControlTaxonomy();
            controlTaxonomy.writeControlTaxonomyName();
            controlTaxonomy.searchControlTaxonomy();
          }
        );

        it(
          "Add Control Taxonomy – Duplicate Name",
          { tags: "@pd42487" },
          () => {
            cy.visitControlTaxonomy();
            cy.readFile(data).then((readData) => {
              customer.addControlTaxonomy(
                readData.controlTaxonomy.controlTaxonomyName,
                true
              );
              controlTaxonomy.searchControlTaxonomy();
            });
          }
        );

        it("Filter by Name", { tags: "@pd42534" }, () => {
          cy.visitControlTaxonomy();
          cy.readFile(data).then((readData) => {
            controlTaxonomy.clickFilterIcon(7);
            controlTaxonomy.typeFilterName(
              readData.controlTaxonomy.controlTaxonomyName,
              0
            );
            controlTaxonomy.verifySearchControlTaxonomyLength(0);
          });
        });

        // no functionality with Content Library Filter.
        it.skip("Filter by Content Library", { tags: ["@pd42539", "@skip"] }, () => {
          cy.visitControlTaxonomy();
          cy.readFile(data).then((readData) => {
            controlTaxonomy.clickFilterIcon(8);
            controlTaxonomy.typeFilterName(
              readData.controlDefinition.contentLibrary.name,
              0
            );
            controlTaxonomy.verifySearchControlTaxonomyLength(0);
          });
        });

        it("Filter by Status", { tags: "@pd42549" }, () => {
          cy.visitControlTaxonomy();
          cy.readFile(data).then((readData) => {
            controlTaxonomy.clickFilterIcon(10);
            controlTaxonomy.typeStatusName(
              readData.controlTaxonomy.statusActive
            );
            controlTaxonomy.clickFilterIcon(7);
            controlTaxonomy.typeFilterName(
              readData.controlTaxonomy.controlTaxonomyName,
              0
            );
            controlTaxonomy.verifySearchControlTaxonomyLength(0);
          });
        });

        it(
          "Edit Control Taxonomy – Valid Changes",
          { tags: ["@pd42514","@smoke"] },
          () => {
            cy.visitControlTaxonomy();
            cy.readFile(data).then((readData) => {
              cy.createRandomString(5).then((randomString) => {
                const updatedName = `Updated Control Taxonomy $$$ ${randomString}`;
                controlTaxonomy.searchControlTaxonomy(false);
                controlTaxonomy.clickSearchedControlTaxonomy();
                controlTaxonomy.typeControlTaxonomyName(updatedName);
                controlTaxonomy.typeDescription(
                  readData.controlTaxonomy.descriptionText
                );
                controlTaxonomy.writeControlTaxonomyName(true, updatedName);
              });
            });
          }
        );

        it(
          "Change Status from Active to Inactive",
          { tags: "@pd42518" },
          () => {
            cy.visitControlTaxonomy();
            cy.readFile(data).then((readData) => {
              controlTaxonomy.searchControlTaxonomy();
              controlTaxonomy.changedStatus(
                readData.controlTaxonomy.statusInactive
              );
              controlTaxonomy.verifyStatus(
                readData.controlTaxonomy.statusInactive
              );
            });
          }
        );

        it(
          "Change Status from Inactive to Active",
          { tags: "@pd42518" },
          () => {
            cy.visitControlTaxonomy();
            cy.readFile(data).then((readData) => {
              controlTaxonomy.searchControlTaxonomy();
              controlTaxonomy.changedStatus(
                readData.controlTaxonomy.statusActive
              );
              controlTaxonomy.verifyStatus(
                readData.controlTaxonomy.statusActive
              );
            });
          }
        );

        it(
          "Verify viewing Control Taxonomy details",
          { tags: ["@pd42361","@smoke"] },
          () => {
            cy.visitControlTaxonomy();
            controlTaxonomy.searchControlTaxonomy();
            controlTaxonomy.clickViewAction();
            controlTaxonomy.verifyViewActionScreenOpen();
          }
        );
      }
    );

    context(
      "Control Category Test Cases",
      { tags: "control-categories" },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitControlTaxonomy();
          controlTaxonomy.searchControlTaxonomy();
          controlTaxonomy.clickViewAction();
          controlTaxonomy.verifyViewActionScreenOpen();
          cy.wait(3000); // Wait for tree to appear
        });

        it(
          "Add Control Category with valid data",
          { tags: ["@smoke", "@pd42548"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.clickAddControlCategory(
                readData.controlCategory.formBtnText
              );
              controlCategory.addControlCategory(
                "add",
                readData.controlCategory.add.baseName
              );
            });
          }
        );

        it(
          "Verify New Control Category is Added Successfully",
          { tags: ["@smoke", "@pd42548"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.verifyAddedControlCategory(
                readData.controlCategory.add.name
              );
            });
          }
        );

        it(
          "Add Control Category with missing required field",
          { tags: "@pd42489" },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.clickAddControlCategory(
                readData.controlCategory.formBtnText
              );
              controlCategory.addControlCategoryWithMissingName(
                readData.controlCategory.validationErrors.missingField
              );
            });
          }
        );

        it(
          "Add Control Category with max name length (255 characters)",
          { tags: "@pd42486" },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.clickAddControlCategory(
                readData.controlCategory.formBtnText
              );
              const longName = controlCategory.addControlCategoryWithMaxLength(
                readData.controlCategory.nameMaxLength
              );
              controlCategory.verifyAddedControlCategory(longName);
            });
          }
        );

        // no Attribute is added of maxlength in the element.
        it.skip(
          "Add Control Category exceeding name limit",
          { tags: ["@pd42545", "@skip"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.clickAddControlCategory(
                readData.controlCategory.formBtnText
              );
              controlCategory.addControlCategoryExceedingNameLimit();
            });
          }
        );

        it(
          "Add Control Category with special characters",
          { tags: "@pd42528" },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.clickAddControlCategory(
                readData.controlCategory.formBtnText
              );
              const specialCharName =
                controlCategory.addControlCategoryWithSpecialChars();
              controlCategory.verifyAddedControlCategory(specialCharName);
            });
          }
        );

        it("Add duplicate Control Category name", { tags: "@pd42544" }, () => {
          cy.readFile(data).then((readData) => {
            const existingName = readData.controlCategory.add.name;
            controlCategory.clickAddControlCategory(
              readData.controlCategory.formBtnText
            );
            controlCategory.addDuplicateControlCategory(existingName);
          });
        });

        it("Cancel Add Control Category form", { tags: "@pd42495" }, () => {
          cy.readFile(data).then((readData) => {
            controlCategory.clickAddControlCategory(
              readData.controlCategory.formBtnText
            );
            controlCategory.cancelAddControlCategory();
            controlCategory.verifyFormClosed();
          });
        });

        it(
          "Edit existing Control Category",
          { tags: ["@smoke", "@pd42543"] },
          () => {
            cy.readFile(data).then((readData) => {
              const existingCategoryName = readData.controlCategory.add.name;
              const baseName = readData.controlCategory.update.baseName;
              controlCategory.editControlCategory(
                "update",
                baseName,
                existingCategoryName
              );
            });
          }
        );

        it(
          "Verify Control Category Name is Updated",
          { tags: ["@smoke", "@pd42543"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlCategory.verifyAddedControlCategory(
                readData.controlCategory.update.name
              );
              controlCategory.writeControlCategoryNameInControlDefinition(
                readData.controlCategory.update.name
              );
            });
          }
        );
      }
    );
    context(
      "Control Definition Test Cases",
      { tags: "control-definitions" },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            "login with Risk Management User",
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitControlTaxonomy();
          controlTaxonomy.searchControlTaxonomy();
          controlTaxonomy.clickViewAction();
          controlTaxonomy.verifyViewActionScreenOpen();
          cy.wait(3500); // Wait for tree to appear
        });

        it(
          "Add Control Definition with All Valid Fields",
          { tags: ["@smoke", "@pd42498"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionValidData("add");
            });
          }
        );

        it(
          "Attempt Save with Missing Mandatory Fields",
          { tags: ["@pd42517","@smoke"] },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionMissingFields(
                readData.controlDefinition.validationErrors.missingName
              );
            });
          }
        );

        it(
          "Add Control Definition with Missing Name",
          { tags: "@pd42490" },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionMissingName(
                readData.controlDefinition.validationErrors.missingName,
                readData.controlDefinition.add.controlCategory
              );
            });
          }
        );

        it(
          "Add Control Definition with Missing Control Category",
          { tags: "@pd42536" },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionMissingCategory(
                readData.controlDefinition.validationErrors.missingName,
                readData.controlDefinition.add
              );
            });
          }
        );

        it(
          "Add Control Definition with special characters",
          { tags: "@pd42531" },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              const specialCharcters =
                controlDefinition.addControlDefinitionWithSpecialChars(
                  readData.controlDefinition.specialCharacters,
                  readData.controlDefinition.add.controlCategory,
                  readData.controlDefinition.add.controlType
                );
              controlDefinition.verifyAddedControlDefinition(
                readData.controlDefinition.add.controlCategory,
                specialCharcters
              );
            });
          }
        );

        it(
          "Add Control Definition with max length name",
          { tags: "@pd42521" },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionMaxLengthName(
                readData.controlDefinition.nameMaxLength
              );
            });
          }
        );

        it(
          "Add Control Definition with max length description",
          { tags: "@pd42502" },
          () => {
            cy.readFile(data).then((readData) => {
              controlDefinition.clickAddControlDefinition(
                readData.controlDefinition.formBtnText
              );
              controlDefinition.addControlDefinitionMaxLengthDescription(
                readData.controlDefinition.descriptionMaxLength
              );
            });
          }
        );

        it("Add duplicate Control Definition ID", { tags: "@pd42537" }, () => {
          cy.readFile(data).then((readData) => {
            const existingId = readData.controlDefinition.add.name;
            controlDefinition.clickAddControlDefinition(
              readData.controlDefinition.formBtnText
            );
            controlDefinition.addDuplicateControlDefinitionId(
              existingId,
              readData.controlDefinition.add.controlCategory,
              readData.controlDefinition.add.controlType
            );
          });
        });

        it("Cancel Control Definition Add", { tags: "@pd42500" }, () => {
          cy.readFile(data).then((readData) => {
            controlDefinition.clickAddControlDefinition(
              readData.controlDefinition.formBtnText
            );
            controlDefinition.cancelControlDefinitionAdd();
          });
        });

        it(
          "Edit Control Definition - Change Description",
          { tags: "@pd42513" },
          () => {
            cy.readFile(data).then((readData) => {
              const definitionName = readData.controlDefinition.add.name;
              controlDefinition.verifyAddedControlDefinition(
                readData.controlDefinition.add.controlCategory,
                definitionName
              );
              controlDefinition.editControlDefinitionDescription(
                definitionName,
                readData.controlDefinition.update.description
              );
            });
          }
        );

        it("Toggle Primary Control Option", { tags: "@pd42532" }, () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.controlDefinition.add.name;
            controlDefinition.verifyAddedControlDefinition(
              readData.controlDefinition.add.controlCategory,
              definitionName
            );
            controlDefinition.togglePrimaryControlOption(definitionName);
          });
        });

        it("Change Control Type", { tags: "@pd42497" }, () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.controlDefinition.add.name;
            controlDefinition.verifyAddedControlDefinition(
              readData.controlDefinition.add.controlCategory,
              definitionName
            );
            controlDefinition.changeControlType(
              definitionName,
              readData.controlDefinition.update.controlType
            );
          });
        });
      }
    );

    context("Tree Operations Test Cases", { tags: "tree-operations" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlTaxonomy();
        controlTaxonomy.searchControlTaxonomy();
        controlTaxonomy.clickViewAction();
        controlTaxonomy.verifyViewActionScreenOpen();
        cy.wait(3000); // Wait for tree to appear
      });

      it("Load Control Taxonomy Tree", { tags: "@pd42522" }, () => {
        treeOperations.verifyTreeLoaded();
      });

      it("Expand single category node", { tags: "@pd42493" }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.controlCategory.update.name;
          treeOperations.expandCategoryNode(categoryName);
        });
      });

      it("Collapse single category node", { tags: "@pd42488" }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.controlCategory.update.name;
          treeOperations.expandCategoryNode(categoryName);
          treeOperations.collapseCategoryNode(categoryName);
        });
      });

      // no Expand All button functiomality in Control Definition Screen
      it.skip("Expand All", { tags: ["@pd42493", "@skip"] }, () => {
        cy.readFile(data).then((readData) => {
          const categoryName = readData.controlCategory.update.name;
          treeOperations.clickExpandAll(categoryName);
        });
      });

      // no Collapse All button functionality in Control Definition Screen
      it.skip("Collapse All", { tags: ["@pd42488", "@skip"] }, () => {
        treeOperations.clickCollapseAll();
      });

      it(
        "Delete a Control Definition with confirmation",
        { tags: "@pd42311" },
        () => {
          cy.readFile(data).then((readData) => {
            const definitionName = readData.controlDefinition.add.name;
            const categoryName = readData.controlCategory.update.name;
            treeOperations.expandCategoryNode(categoryName);
            treeOperations.deleteControlDefinition(
              categoryName,
              definitionName,
              true
            );
          });
        }
      );

      // no Delete Btn exists in Control Definition Screen for Control Category
      it.skip(
        "Attempt to delete without confirmation",
        { tags: ["@pd42312", "@skip"] },
        () => {
          cy.readFile(data).then((readData) => {
            const categoryName = readData.controlCatagory.update.name;
            treeOperations.deleteControlCategoryWithChildren(
              categoryName,
              false
            );
          });
        }
      );

      // no Delete Btn exists in Control Definition Screen for Control Category
      it.skip(
        "Delete a Control Category with children and confirmation",
        { tags: ["@pd42313", "@skip"] },
        () => {
          cy.readFile(data).then((readData) => {
            const categoryName = readData.controlCatagory.update.name;
            treeOperations.deleteControlCategoryWithChildren(
              categoryName,
              true
            );
          });
        }
      );
    });

    context("Import Test Cases", { tags: "import" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with Risk Management User",
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitControlTaxonomy();
      });

      it("Open Import Modal", { tags: "@pd42523" }, () => {
        importOperations.openImportModal(
          "#importControlForm",
          ".dropdown-item[href='#importControlDialog']",
          "Import Control Taxonomies from Excel file"
        );
      });

      it("Download Sample File", { tags: "@pd42512" }, () => {
        importOperations.openImportModal(
          "#importControlForm",
          ".dropdown-item[href='#importControlDialog']",
          "Import Control Taxonomies from Excel file"
        );
        importOperations.downloadSampleFile();
      });

      it("Import Invalid File Format", { tags: "@pd42515" }, () => {
        importOperations.openImportModal(
          "#importControlForm",
          ".dropdown-item[href='#importControlDialog']",
          "Import Control Taxonomies from Excel file"
        );
        importOperations.importInvalidFileFormat();
      });

      it("Cancel Import", { tags: "@pd42494" }, () => {
        importOperations.openImportModal(
          "#importControlForm",
          ".dropdown-item[href='#importControlDialog']",
          "Import Control Taxonomies from Excel file"
        );
        importOperations.cancelImport();
      });

      it("Import Valid File", { tags: "@pd42504" }, () => {
        importOperations.openImportModal(
          "#importControlForm",
          ".dropdown-item[href='#importControlDialog']",
          "Import Control Taxonomies from Excel file"
        );
        importOperations.updateControlTaxonomyImportJSON();
        importOperations.uploadValidConvertedFile();
      });

      it(
        "Verify that the imported Control Taxonomy is Added & present in Grid",
        { tags: "@pd42393" },
        () => {
          cy.reload(true);
          cy.readFile(data).then((readData) => {
            const importedName = readData.controlTaxonomy.controlTaxonomyName;
            controlTaxonomy.searchControlTaxonomy(importedName);
          });
        }
      );
    });
  }
);
