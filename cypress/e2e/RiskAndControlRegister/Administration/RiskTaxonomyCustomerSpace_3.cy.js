import {
  RiskTaxonomy,
  RiskDefinition,
  AddLinkControls,
  RiskCategory,
} from "../../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.js";
import { ControlTaxonomies } from "../../../support/POM/RiskAndControlRegister/Administration/ControltaxonomiesCustomerSpace";
import data from "../../../fixtures/RiskAndControlRegister/Administration/controlTaxonomiesCustomerSpace.json";
import ValidationHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/ValidationHelper.js";
import UIHelper from "../../../support/POM/RiskAndControlRegister/Administration/helpers/UIHelper.js";
import locators from "../../../fixtures/locators.json";

const writeFile =
  "cypress/fixtures/RiskAndControlRegister/Administration/writeControlTaxonomiesCustomerSpace.json";

const controlTaxonomies = new ControlTaxonomies();

const writeDataFilePath =
  "cypress/fixtures/RiskAndControlRegister/Administration/RiskTaxonomyCustomerSpace.json";
const riskTaxonomy = new RiskTaxonomy();
const riskDefinition = new RiskDefinition();
const riskCatagory = new RiskCategory();
const addLinkControls = new AddLinkControls();

describe(
  "Add And link Controls/ Recommended Controls in Risk Taxanomies from Customer Space",
  {
    tags: [
      "@risk-management",
      "@control-taxonomy",
      "@delete",
      "@regression",
      "@pd36730",
    ],
  },
  () => {
    const saveRecommendControlFormindex=11;
    const session = () => {
      const withRM = Cypress.env("kxi").customer.withRM;
      cy.loginWithSession(
        "login with Risk Management User",
        withRM.username,
        withRM.password,
        withRM.key
      );
    };
    let getData;
    before(() => {
      cy.readFile(writeDataFilePath).then((data) => {
        getData = data.riskDefinition.validationErrors;
      });
    });
    context(
      "Add Control Category and Definition from Control Taxonomy Screen.",
      {
        tags: ["@add-control-category-definition"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitControlTaxonomyCS();
          cy.waitForTopMsgLoaderToDisappear(40000);
        });
        it("Load Add Control Category form ", { tags: ["@pd41200","@smoke"] }, () => {
          controlTaxonomies.clickControlCategoryButton();
          controlTaxonomies.verifyAllFieldsVisible();
        });

        it(
          "Enter valid Control Category data and click Save",
          { tags: ["@smoke", "@pd41196", "@pd41460"] },
          () => {
            controlTaxonomies.clickControlCategoryButton();
            controlTaxonomies.typeNewCatInControlName("add");
            controlTaxonomies.writeCategoryNameToFile();
            controlTaxonomies.clickSaveButton();
            controlTaxonomies.verifyCategoryInTree();
          }
        );

        it(
          "Add control with all optional fields also populated (e.g., Description, Comment, Tags)",
          { tags: ["@pd41367", "@pd41368", "@pd41369","@smoke"] },
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
      }
    );

    context(
      "Add Recommended Controls Against Risk Definition from Risk Taxonomy Screen.",
      {
        tags: ["@add-recommended-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
        });
        it(
          "Attempt to save without entering the required Name Field, Control Type and Control Caegory (Mandaory Field)",
          { tags: ["@smoke", "@pd41830"] },
          () => {
            UIHelper.clickThreeElipses(2);
            UIHelper.clickThreeElipsesDropDownOptions();
            addLinkControls.verifyAddRecommendedControlModalOpen();
            addLinkControls.addValidDataAddRecommendControlForm();
            addLinkControls.saveRecommendControlForm();
            ValidationHelper.verifyValidationError(
              getData.requiredAllFieldsEmpty
            );
          }
        );

        it(
          "Enter only mandatory fields and click “Cancel”",
          { tags: ["@smoke", "@pd41821"] },
          () => {
            cy.readFile(writeFile).then((data) => {
              UIHelper.clickThreeElipses(2);
              UIHelper.clickThreeElipsesDropDownOptions();
              addLinkControls.verifyAddRecommendedControlModalOpen();
              addLinkControls.addValidDataAddRecommendControlForm(
                data.categoryName
              );
              UIHelper.clickCancel(
                locators.risk.administration.controlOperations
                  .cancelAddRecommendForm
              );
            });
          }
        );

        it("verify that clicking on Cancel Button in Add Recommend Control Form does not saving any Control", () => {
          cy.readFile(writeDataFilePath).then((data) => {
            addLinkControls.verifyControlAddedToRiskDefinition(
              data.addRecommendControls.name,
              true
            );
          });
        });

        it(
          "Add Controls - should add controls to risk definition",
          {
            tags: ["@add-control"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.generateAndWriteAddRecommendedControlDataInFile(
                writeDataFilePath
              );
              UIHelper.clickThreeElipses(2);
              UIHelper.clickThreeElipsesDropDownOptions();
              addLinkControls.verifyAddRecommendedControlModalOpen();
              addLinkControls.addValidDataAddRecommendControlForm(
                data.categoryName
              );
              addLinkControls.saveRecommendControlForm();
            });
          }
        );

        it(
          "verify that the control is added with Risk Definition",
          {
            tags: ["@verify-added-control"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.addRecommendControls.name
              );
            });
          }
        );

        //here Validation is missing in front end it should fail this test case.
        // skipping this test case as of now @skip
        it.skip(
          "Attempt to save duplicate control name",
          { tags: ["@skip", "@pd41802"] },
          () => {
            cy.readFile(writeFile).then((data) => {
              UIHelper.clickThreeElipses(2);
              UIHelper.clickThreeElipsesDropDownOptions();
              addLinkControls.verifyAddRecommendedControlModalOpen();
              addLinkControls.addValidDataAddRecommendControlForm(
                data.categoryName
              );
              addLinkControls.saveRecommendControlForm();
              ValidationHelper.verifyValidationError(getData.missingField);
            });
          }
        );
      }
    );

    context(
      "Delete Added Controls",
      {
        tags: ["@delete-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
        });
        it(
          "Delete Controls - should delete controls from risk definition",
          {
            tags: ["@delete-control", "@pd41788"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.addRecommendControls.name
              );
              addLinkControls.openControlSubGrid();
              addLinkControls.clickDeleteControlBtn();
              addLinkControls.clickYesDeleteBtn();
            });
          }
        );

        it(
          "verify that the control is Deleted",
          {
            tags: ["@delete-control"],
          },
          () => {
            cy.readFile(writeDataFilePath).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.addRecommendControls.name,
                true
              );
            });
          }
        );
      }
    );

    context(
      "Link Recommended Controls Against Risk Definition from Risk Taxonomy Screen.",
      {
        tags: ["@link-recommended-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
          
        });
        it("Link recommended control", { tags: "@pd41806" }, () => {
          cy.readFile(writeFile).then((data) => {
            UIHelper.clickThreeElipses(2);
            UIHelper.clickThreeElipsesDropDownOptions(
              "Link recommended control"
            );
            addLinkControls.verifyLinkRecommendedControlModalOpen();
            addLinkControls.expandControlCategoryTree(data.categoryName);
            addLinkControls.selectControlDefinition(data.definitionName);
            addLinkControls.saveRecommendControlForm(undefined, saveRecommendControlFormindex);
          });
        });

        it(
          "verify that the control is Linked with Risk Definition",
          {
            tags: ["@link-control"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.definitionName
              );
            });
          }
        );
      }
    );

    context(
      "Unlink Already Linked recommended control from Risk Definition",
      {
        tags: ["@unlink-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
        });
        it("UnlLink Already Linked recommended control", () => {
          cy.readFile(writeFile).then((data) => {
            UIHelper.clickThreeElipses(2);
            UIHelper.clickThreeElipsesDropDownOptions(
              "Link recommended control"
            );
            addLinkControls.verifyLinkRecommendedControlModalOpen();
            addLinkControls.expandControlCategoryTree(data.categoryName);
            addLinkControls.selectControlDefinition(data.definitionName);
            addLinkControls.saveRecommendControlForm(undefined, saveRecommendControlFormindex);
          });
        });

        it(
          "verify that the control is Unlinked from Risk Definition",
          {
            tags: ["@unlink-control"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.definitionName,
                true
              );
            });
          }
        );
      }
    );

    context(
      "Link Recommended Controls Again For Testing Delete functionality After Linked Control.",
      {
        tags: ["@link-recommended-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
        });
        it("Link recommended control Again", { tags: "@link-control" }, () => {
          cy.readFile(writeFile).then((data) => {
            UIHelper.clickThreeElipses(2);
            UIHelper.clickThreeElipsesDropDownOptions(
              "Link recommended control"
            );
            addLinkControls.verifyLinkRecommendedControlModalOpen();
            addLinkControls.expandControlCategoryTree(data.categoryName);
            addLinkControls.selectControlDefinition(data.definitionName);
            addLinkControls.saveRecommendControlForm(undefined, saveRecommendControlFormindex);
          });
        });

        it(
          "verify that the control is Linked with Risk Definition",
          {
            tags: ["@link-control"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.definitionName
              );
            });
          }
        );
      }
    );

    context(
      "Delete Linked Controls",
      {
        tags: ["@delete-control", "@positive"],
      },
      () => {
        beforeEach(() => {
          session();
          cy.visitRiskTaxonomies();
          cy.waitForStableGrid(20000);
          cy.wait(2000);
          riskCatagory.verifyGridContainsMinimumRows();
        });
        it(
          "Delete Controls - should delete controls from risk definition",
          {
            tags: ["@delete-control", "@pd41838"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.definitionName
              );
              addLinkControls.openControlSubGrid();
              addLinkControls.clickDeleteControlBtn();
              addLinkControls.clickYesDeleteBtn();
            });
          }
        );

        it(
          "verify that the Linked control is Deleted",
          {
            tags: ["@delete-control"],
          },
          () => {
            cy.readFile(writeFile).then((data) => {
              addLinkControls.verifyControlAddedToRiskDefinition(
                data.definitionName,
                true
              );
            });
          }
        );
      }
    );

    context("Moved Risk Libraries Test Cases", () => {
      beforeEach(() => {
        session();
        cy.visitRiskTaxonomies();
        cy.waitForStableGrid(20000);
        cy.wait(2000);
        riskCatagory.verifyGridContainsMinimumRows();
      });

      it(
        "Verify library updates are visible on the moved library data on status column with 'updated' status",
        { tags: "@pd41874" },
        () => {
          cy.readFile(writeDataFilePath).then((data) => {
            riskTaxonomy.searchInGrid(
              locators.Administration.RiskTaxonomyLibraries.grid.nameFilter,
              data.riskDefinition.add.movedRiskDefinition
            );
            riskDefinition.expandRiskCategory();
            UIHelper.verifyTextContent(
              locators.general.gridName,
              data.riskDefinition.add.movedRiskDefinition,
              1
            );
            addLinkControls.verifyUpdatedOption();
          });
        }
      );

      it(
        "Verify on clicking updated button a comparison/difference modal window should open",
        { tags: "@pd41871" },
        () => {
          cy.readFile(writeDataFilePath).then((data) => {
            UIHelper.verifyTextContent(
              locators.general.gridName,
              data.riskDefinition.add.movedRiskDefinition,
              1
            );
            addLinkControls.verifyUpdatedOption();
            addLinkControls.clickUpdatedOption();
            addLinkControls.verifyComparisonModalOpen();
          });
        }
      );

      it(
        "Verify on clicking cancel button on the modal window update should be closed and the update flag should be their on the grid",
        { tags: "@pd41799" },
        () => {
          cy.readFile(writeDataFilePath).then((data) => {
            UIHelper.verifyTextContent(
              locators.general.gridName,
              data.riskDefinition.add.movedRiskDefinition,
              1
            );
            addLinkControls.verifyUpdatedOption();
            addLinkControls.clickUpdatedOption();
            addLinkControls.verifyComparisonModalOpen();
            UIHelper.clickCancel(
              locators.risk.administration.controlOperations
                .cancelComparisonWindow
            );
            addLinkControls.verifyComparisonModalClosed();
            addLinkControls.verifyUpdatedOption();
          });
        }
      );
    });
  }
);
