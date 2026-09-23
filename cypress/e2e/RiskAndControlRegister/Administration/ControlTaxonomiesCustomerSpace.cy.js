import {
  ControlTaxonomies,
  ImportOperations,
} from "../../../support/POM/RiskAndControlRegister/Administration/ControltaxonomiesCustomerSpace";
import data from "../../../fixtures/RiskAndControlRegister/Administration/controlTaxonomiesCustomerSpace.json";
import loctaors from "../../../fixtures/locators.json";
const writeFile =
  "cypress/fixtures/RiskAndControlRegister/Administration/writeControlTaxonomiesCustomerSpace.json";
const largeFilePath = "cypress/SampleUploadFiles/exceedSizeFile.xlsx";

const controlTaxonomies = new ControlTaxonomies();
const importOperations = new ImportOperations();
describe(
  "E2E testing of Control Taxonomies ",
  {
    tags: [
      "@pd36732",
      "@regression",
      "@riskandcontrolregister",
      "@control-taxonomies",
      "@control-management",
      "@predict",
      "@customer-space",
      "@control-category",
      "@control-definition",
      "@control-taxonomy",
      "@import",
    ],
  },

  () => {
    const userLogin = Cypress.env("kxi").customer;
    context("Add/Edit Control Category", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlTaxonomyCS();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it("Load Add Control Category form ", { tags: "@pd41200" }, () => {
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.verifyAllFieldsVisible();
      });

      it(
        "Enter valid data and click Save",
        { tags: ["@smoke", "@pd41196", "@pd41460"] },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeNewCatInControlName("add");
          controlTaxonomies.writeCategoryNameToFile();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            10000
          );
          controlTaxonomies.verifyCategoryInTree();
        }
      );

      it(
        "updated control category data and click Save",
        { tags: ["@smoke", "@pd42951"] },
        () => {
          controlTaxonomies.expandSavedControlCategoryParent();
          controlTaxonomies.clickStoredControlName();
          controlTaxonomies.typeNewCatInControlName("update");
          controlTaxonomies.writeCategoryNameToFile();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            1000
          );
          controlTaxonomies.verifyCategoryInTree();
        }
      );
      it(
        "Select a valid control category from the hierarchy",
        { tags: ["@pd41231", "@pd41196", "@pd41472"] },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeNewSubCatInControlName();
          controlTaxonomies.writeSubCategoryNameToFile();
          controlTaxonomies.clickSavedControlCategoryName();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            10000
          );
          controlTaxonomies.expandSavedControlCategoryName();
          controlTaxonomies.verifySubcategoryInTree();
        }
      );
      it(
        "Select nested control category (e.g., “Control Cat Prod Regression.1.1”)",
        { tags: ["@pd41285", "@pd39696"] },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeNewSubCatInControlName();
          controlTaxonomies.writeNestedCategoryNameToFile();
          controlTaxonomies.expandSavedControlCategoryName();
          controlTaxonomies.clickNestedControlCategoryName();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            10000
          );
          controlTaxonomies.expandSubCategory();
          controlTaxonomies.verifyNestedCategoryVisible();
        }
      );
      it(
        "Create duplicate Name under same parent category",
        { tags: "@pd39634" },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeExistingSubCategoryName();
          controlTaxonomies.clickSavedControlCategoryName();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.errorMessages.nameDuplication,
            10000
          );
        }
      );

      it(
        "Create same Name under a different parent",
        { tags: ["@pd39635", "@pd39698"] },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeExistingSubCategoryName();
          controlTaxonomies.clickDifferentParentCategory();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            10000
          );
          controlTaxonomies.verifySubCatInDiffParent();
        }
      );

      it("Leave Name field blank and try to save", { tags: "@pd41217" }, () => {
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.clickSaveButton();
        controlTaxonomies.verifyToastMessage(
          data.errorMessages.errorSaving,
          10000
        );
      });

      it("Enter name exceeding 255 characters", { tags: "@pd41222" }, () => {
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.typeLongNameInControlName();
        controlTaxonomies.clickSaveButton();
        controlTaxonomies.verifyToastMessage(
          data.errorMessages.errorSaving,
          10000
        );
      });

      it("Click Cancel button", { tags: "@pd41239" }, () => {
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.clickCancelButton();
        cy.visitControlTaxonomyCS();
      });

      it("Refresh mid-entry", { tags: "@pd39639" }, () => {
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.typeNewCatInControlName("add");
        cy.reload();
        controlTaxonomies.clickControlCategoryButton();
        controlTaxonomies.verifyControlNameFieldIsBlank();
      });
      it(
        "Test radio button selection resets previous one",
        { tags: "@pd39638" },
        () => {
          controlTaxonomies.expandSavedControlCategoryParent();
          controlTaxonomies.clickSubCategoryName();
          controlTaxonomies.changeParent();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlCategorySaved,
            10000
          );
        }
      );
    });

    context("Add/Edit Control Definition", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlTaxonomyCS();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Add control definition with all mandatory fields filled correctly",
        { tags: ["@smoke", "@pd39640", "@pd39690"] },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeControlDefinitionName("add");
          controlTaxonomies.writeDefName();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();
          controlTaxonomies.clickSaveControlDef();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlDefinitionSaved,
            10000
          );
          cy.visitControlTaxonomyCS();
          controlTaxonomies.expandCategoryByName();
          controlTaxonomies.verifyControlDefUnderCategory();
        }
      );

      it(
        "Add control with all optional fields also populated (e.g., Description, Comment, Tags)",
        { tags: ["@pd41367", "@pd41368", "@pd41369"] },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.fillControlDefId();
          controlTaxonomies.typeControlDefinitionName("add");
          controlTaxonomies.writeDefName();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();
          controlTaxonomies.commentAdd();
          controlTaxonomies.typeDescription();
          controlTaxonomies.selectPrimaryControl();
          controlTaxonomies.selectPreventsFraudYes();
          controlTaxonomies.clickSaveControlDef();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlDefinitionSaved,
            10000
          );
          cy.visitControlTaxonomyCS();
          controlTaxonomies.expandCategoryByName();
          controlTaxonomies.verifyControlDefUnderCategory();
        }
      );
      it(
        "Select values from each dropdown (Design, Operating Effectiveness, Frequency, etc.)",
        { tags: "@pd41389" },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeControlDefinitionName("add");
          controlTaxonomies.writeDefName();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();

          controlTaxonomies.selectControlOperations();

          controlTaxonomies.selectControlFrequency();
          controlTaxonomies.selectDesignAssessment();
          controlTaxonomies.selectOperatingEffectivenessAssessment();
          controlTaxonomies.selectControlExecutionsAssessment();
          controlTaxonomies.clickSaveControlDef();
          cy.visitControlTaxonomyCS();
          controlTaxonomies.expandCategoryByName();
          controlTaxonomies.verifyControlDefUnderCategory();
        }
      );
      it("Add tags using comma, tab, and enter)", { tags: "@pd41387" }, () => {
        controlTaxonomies.clickAddDefBtn();
        controlTaxonomies.addMultipleTags();
      });

      it(
        "Enter mandatory fields and click “Cancel”",
        { tags: "@pd41388" },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeControlDefinitionName("add");
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();
          controlTaxonomies.clickCancelButton();
          cy.visitControlTaxonomyCS();
        }
      );

      // Skipped due to bug: https://360factors.atlassian.net/browse/PD-43218
      it.skip(
        "Attempt to save duplicate control name",
        { tags: "@pd41401" },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeDuplicateControlDef();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();
          controlTaxonomies.clickSaveControlDef();
        }
      );
      it(
        "Attempt to save without entering the required",
        { tags: ["@pd39642", "@pd39643", "@pd39644", "@pd39646", "@pd39648"] },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.clickSaveControlDef();
          controlTaxonomies.verifyToastMessage(
            data.errorMessages.errorSaving,
            10000
          );
        }
      );

      it(
        "updated the def name and click Save",
        { tags: ["@smoke", "@pd42952"] },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeControlDefinitionName("update");
          controlTaxonomies.writeDefName();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.clickControlDefinitionNode();
          controlTaxonomies.clickSaveControlDef();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.controlDefinitionSaved,
            10000
          );
          cy.visitControlTaxonomyCS();
          controlTaxonomies.expandCategoryByName();
          controlTaxonomies.verifyControlDefUnderCategory();
        }
      );
      it(
        "Attempt deletion of last control definition under a category",
        { tags: ["@pd39697"] },
        () => {
          controlTaxonomies.expandSavedControlCategoryParent();
          controlTaxonomies.clickDeleteOnStoredDefinition();
          controlTaxonomies.verifyToastMessage(
            data.successMessage.definitionDelete,
            10000
          );
          controlTaxonomies.expandCategoryByName();
          controlTaxonomies.verifyControlDefDelete();
        }
      );
      it("Enter 1201 characters in", { tags: "@pd41668" }, () => {
        controlTaxonomies.clickAddDefBtn();
        controlTaxonomies.verifyNameMaxLengthAttribute();
      });
    });

    context("Control Taxonomy list view", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlTaxonomyCS();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Click audit log icon beside a control category",
        { tags: ["@smoke", "@pd41428"] },
        () => {
          controlTaxonomies.clickAuditLogButton();
        }
      );

      it(
        "Try adding a control with duplicate name",
        { tags: "@pd39694" },
        () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.typeDuplicateControlName();
          controlTaxonomies.clickSaveButton();
          controlTaxonomies.verifyToastMessage(
            data.errorMessages.nameDuplication,
            10000
          );
        }
      );

      it(
        "Click expand/collapse icon beside a parent category",
        { tags: ["@pd39687"] },
        () => {
          controlTaxonomies.expandCollapseNode();
        }
      );

      it(
        "Duplicate Definition names under different parents",
        { tags: "@pd39698" },
        () => {
          controlTaxonomies.clickAddDefBtn();
          controlTaxonomies.typeDuplicateDefName();
          controlTaxonomies.selectControlTypes();
          controlTaxonomies.selectOtherParentDef();
          controlTaxonomies.clickSaveControlDef();
        }
      );
    });

    context("Import / Export", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitControlTaxonomyCS();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it("Open Import Control Taxonomies modal", { tags: "@pd41715" }, () => {
        importOperations.openImportModal(
          loctaors.risk.controlTaxonomies.clickEllipsesBtn,
          loctaors.risk.controlTaxonomies.clickImportBtn,
          data.import.popupText
        );
      });

      it("Download Sample File", { tags: "@pd41702" }, () => {
        importOperations.openImportModal(
          loctaors.risk.controlTaxonomies.clickEllipsesBtn,
          loctaors.risk.controlTaxonomies.clickImportBtn,
          data.import.popupText
        );
        importOperations.downloadSampleFile();
      });
      it("Upload a non-Excel file ", { tags: "@pd41670" }, () => {
        importOperations.openImportModal(
          loctaors.risk.controlTaxonomies.clickEllipsesBtn,
          loctaors.risk.controlTaxonomies.clickImportBtn,
          data.import.popupText
        );
        importOperations.importInvalidFileFormat();
      });
      it("Click “Cancel” after selecting file", { tags: "@pd41672" }, () => {
        importOperations.openImportModal(
          loctaors.risk.controlTaxonomies.clickEllipsesBtn,
          loctaors.risk.controlTaxonomies.clickImportBtn,
          data.import.popupText
        );
        importOperations.cancelImport();
      });

      it(
        "Upload a valid Excel file with correct structure",
        { tags: ["@smoke", "@pd41695", "pd41696"] },
        () => {
          importOperations.openImportModal(
            loctaors.risk.controlTaxonomies.clickEllipsesBtn,
            loctaors.risk.controlTaxonomies.clickImportBtn,
            data.import.popupText
          );
          importOperations.updateControlTaxonomyImportJSON();
          importOperations.uploadValidConvertedFile();
        }
      );
      it(
        "Verify that the imported Control category is Added in the tree",
        { tags: "@pd41695" },
        () => {
          cy.reload(true);

          cy.readFile(writeFile).then((fileData) => {
            const importedName = fileData.import.importName;
            importOperations.searchControlTaxonomy(importedName);
          });
        }
      );
      it(
        "Upload large Excel file with 1000+ rows",
        { tags: "@pd39679" },
        () => {
          importOperations.openImportModal(
            loctaors.risk.controlTaxonomies.clickEllipsesBtn,
            loctaors.risk.controlTaxonomies.clickImportBtn,
            data.import.popupText
          );

          importOperations.uploadValidConvertedFile(largeFilePath);
        }
      );
    });
  }
);
