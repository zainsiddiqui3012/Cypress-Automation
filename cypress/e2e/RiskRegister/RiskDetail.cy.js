import RiskDetail from "../../support/POM/RiskRegister/RiskDetail";
import {RiskTaxonomy} from "../../support/POM/RiskAndControlRegister/Administration/RiskTaxonomyNoneSpace";
import RiskRegister_PO from "../../support/POM/RiskModule_PO/RiskRegister_PO";
import RiskCategory_PO from "../../support/POM/RiskModule_PO/RiskCategory_PO";
import RiskDefinition_PO from "../../support/POM/RiskModule_PO/RiskDefinition_PO";
import riskCatData from "../../fixtures/RiskModule/Risk_Process_Taxonomy/riskCategory.json";
import riskDefData from "../../fixtures/RiskModule/Risk_Process_Taxonomy/riskDefinition.json";
import FormHelper from "../../support/POM/RiskAndControlRegister/Administration/helpers/FormHelper";
import locators from "../../fixtures/locators.json";

const riskRegisterData = "cypress/fixtures/RiskRegister/RiskRegister.json";
const riskDetail = new RiskDetail();
const riskRegister_PO = new RiskRegister_PO();
const riskCategory_PO = new RiskCategory_PO();
const riskDefinition_PO = new RiskDefinition_PO();
const riskTaxonomy = new RiskTaxonomy();
const riskDetailData = "cypress/fixtures/RiskRegister/RiskDetail.json";

describe(
  "E2E Automation of Risk Detail Form from Customer Space",
  {
    tags: ["@smoke", "@risk-register", "@risk-detail", "@pd36743"],
  },
  () => {
    const rmUser = Cypress.env("kxi").customer.withRM;

    //blocker: https://360factors.atlassian.net/browse/PD-40834
    //if new Risk category/definition is created it should be added with risk applicability flyover every time
    context.skip(
      "create Risk Category and Risk Definitions from Taxonomies Screen",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login with ${rmUser.username}`,
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitRiskTaxonomies();
        });

        it("create new Risk Category", () => {
          riskCategory_PO.clickOnMyTaxonomiesTab();
          riskCategory_PO.addCategoryButton();
          riskCategory_PO.addCategoryInfo(
            riskCatData[0].riskCategoryID,
            riskCatData[0].riskName,
            riskCatData[0].description
          );
          riskDetail.writeRiskCategoryNameFromRegister();
          riskCategory_PO.savebutton();
        });

        it("create new Risk Definition", () => {
          riskCategory_PO.clickOnMyTaxonomiesTab();
          riskDefinition_PO.addDefinitionButton();
          riskDefinition_PO.addDefinitionInfo(
            riskDefData[0].riskDefinitionId,
            riskDefData[0].definitionName,
            riskDefData[0].description
          );
          riskDetail.writeRiskDefinitionNameFromRegister();
          riskDefinition_PO.savebutton();
        });
      }
    );

    //blocker: https://360factors.atlassian.net/browse/PD-40834
    context.skip(
      "add and verify Risk Category, Definition in Risk Register Grid",
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login with ${rmUser.username}`,
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitRiskRegister();
          cy.waitForStableGrid(300000);
        });

        /////*****Applicable flyer - Marked Applicable */
        it("save Risk Category, definition with Applicable in Risk Applicability Flyover", () => {
          cy.readFile(riskRegisterData).then((data) => {
            data.threeElipsesOptions.riskApplicability.applicabilityStatus.status.forEach(
              (status) => {
                riskRegister_PO.threeEllipsisMenu();
                riskRegister_PO.riskTaxonomyclick();
                riskRegister_PO.markRiskTaxonomy(
                  data.threeElipsesOptions.riskApplicability.businessUnit
                    .selectedBU,
                  data.threeElipsesOptions.riskApplicability.riskCategory,
                  status
                );
                riskRegister_PO.saveRiskTaxonomy();
              }
            );
          });
        });

        it("Verify That Risk Category and Definition is added in Risk Register Grid ", () => {
          cy.readFile(riskRegisterData).then((data) => {
            riskRegister_PO.verifyRiskCategoryInGrid(
              data.threeElipsesOptions.riskApplicability.riskCategory
            );
            riskRegister_PO.expandRiskCategoryInGrid(
              data.threeElipsesOptions.riskApplicability.riskCategory
            );
            riskRegister_PO.verifyRiskDefinitionInGrid(
              data.threeElipsesOptions.riskApplicability.riskDefinition
            );
          });
        });
      }
    );

    context("Add", { tags: "risk-detail-add" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitRiskRegister();
        cy.waitForStableGrid(300000);
      });

      it(
        "Add risk detail with all valid fields filled",
        { tags: ["@smoke", "@pd42650"] },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskRegister_PO.searchRiskDefinition(
              data.riskDetail.add.definitionName
            );
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();

            // Fill form and capture the unique name
            const uniqueName = riskDetail.fillRiskDetailForm(
              data.riskDetail.add
            );
            riskDetail.saveRiskDetail();
            cy.reload(true);
            cy.waitForStableGrid(300000);
            riskRegister_PO.searchRiskDefinition(uniqueName);

            // Write the unique name back to JSON after successful save
            riskDetail.writeRiskDetailName("add", uniqueName);
          });
        }
      );
      it(
        "Reopen saved record for Add Risk Detail to ensure data persistence",
        { tags: "@pd50016" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            // First save a record
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.verifyRiskDetailForm(
              data.riskDetail.add,
              data.riskDetail.add.riskName
            );
            riskDetail.closeRiskDetailForm();
          });
        }
      );
      it(
        "Verify Simple Control Description editor functionality",
        { tags: "@pd42665" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.fillSimpleControlDescription(
              data.riskDetail.add.simpleControlDescription
            );
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            FormHelper.verifyDescription(
              locators.risk.riskRegister.riskDetail
                .simpleControlDescriptionIframe,
              data.riskDetail.add.simpleControlDescription
            );
          });
        }
      );

      it(
        "Enter risk name exceeding 255 characters",
        { tags: "@pd42670" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.enterExcessiveRiskName();
            riskDetail.verifyMaxLengthValidation("riskName", 255);
          });
        }
      );

      it("Leave optional fields empty", { tags: "@pd42649" }, () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.fillOnlyMandatoryFields(data.riskDetail.add);
          riskDetail.saveRiskDetail();
          riskRegister_PO.scrollToHorizontalLeft();
          cy.wait(2000);
          riskRegister_PO.searchRiskDefinition(data.riskDetail.add.riskName);
        });
      });

      it(
        "Select Top/Corporate Risk checkbox and save",
        { tags: "@pd42672" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskRegister_PO.searchRiskDefinition(data.riskDetail.add.riskName);
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.selectTopRiskCheckbox();
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyTopRiskFlagSet();
            riskDetail.closeRiskDetailForm();
          });
        }
      );

      // no validation is showing when Frequency field is filled with alphanumeric values
      it(
        "Attempt to enter letters in Frequency numeric field",
        { tags: "@pd42647" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.enterNonNumericFrequency("abc123");
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            // riskDetail.verifyFrequencyValidationError();
            riskDetail.verifyFrequencyPersisted(
              data.riskDetail.add.frequency.value,
              data.riskDetail.add.frequency.timesPer
            );
            riskDetail.closeRiskDetailForm();
          });
        }
      );

      it(
        "Enter a frequency value and select Times Per",
        { tags: "@pd42662" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.setFrequencyAndTimesPer(
              data.riskDetail.add.frequency.value,
              data.riskDetail.add.frequency.timesPer
            );
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyFrequencyPersisted(
              data.riskDetail.add.frequency.value,
              data.riskDetail.add.frequency.timesPer
            );
          });
        }
      );

      // unable to find the option where sites are created. Skipping for now
      it.skip(
        "Assign multiple values in multi-select fields",
        { tags: "@pd42673" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.selectMultipleSites(data.riskDetail.multiSelect.sites);
            riskDetail.selectMultiplePersonsResponsible(
              data.riskDetail.multiSelect.persons
            );
            riskDetail.saveRiskDetail();
            riskDetail.verifyMultiSelectValuesPersisted(
              data.riskDetail.multiSelect
            );
          });
        }
      );

      // no keyname or field exists as weight in Risk Detail Form. Skipping for now
      it.skip(
        "Verify weighted by set as none, by default wait should be 100%",
        { tags: "@pd50015" },
        () => {
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyDefaultWeight("100%");
        }
      );

      it("Verify multiple Risk Events selection", { tags: "@pd42655" }, () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.selectMultipleRiskEvents(data.riskDetail.add.riskEvents);
          riskDetail.saveRiskDetail();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskEventsPersisted(data.riskDetail.add.riskEvents);
        });
      });

      // no value exists in site dropdown this is the issue it exists in database but not visible in dropdown
      it.skip(
        "Verify Site dropdown multi-select persistence",
        { tags: "@pd50020" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.selectMultipleSites(data.riskDetail.sites);
            riskDetail.saveRiskDetail();
            riskDetail.verifySitesPersisted(data.riskDetail.sites);
          });
        }
      );

      it(
        "Verify Risk Owner selection auto-fills user profile",
        { tags: "@pd42667" },
        () => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.selectRiskOwner("kxi User 2");
          riskDetail.clickSaveButton();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskOwnerAutoFill("kxi User 2");
        }
      );

      it(
        "Verify Persons Responsible field accepts multiple values",
        { tags: "@pd50022" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.selectMultiplePersonsResponsible(
              data.riskDetail.add.personsResponsible
            );
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyPersonsResponsiblePersisted(
              data.riskDetail.add.personsResponsible
            );
          });
        }
      );

      it(
        "Save risk detail with each Relative Magnitude level",
        { tags: "@pd50013" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            data.riskDetail.magnitudeLevels.forEach((magnitude) => {
              riskDetail.verifyGridLength();
              riskDetail.openRiskDetailForm();
              riskDetail.verifyRiskDetailFormOpen();
              riskDetail.selectRelativeMagnitude(magnitude);
              riskDetail.saveRiskDetail();
              cy.reload();
              cy.waitForStableGrid(300000);
              riskDetail.verifyGridLength();
              riskDetail.openRiskDetailForm();
              riskDetail.verifyRiskDetailFormOpen();
              riskDetail.verifyMagnitudePersisted(magnitude);
              riskDetail.closeRiskDetailForm();
            });
          });
        }
      );

      it(
        "Verify numeric-only input for Frequency field",
        { tags: "@pd42656" },
        () => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.verifyFrequencyNumericOnly();
          riskDetail.clickSaveButton();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyFrequencyNumericOnly();
        }
      );

      // no validation is showing when Frequency field is filled with negative values or left empty
      it.skip(
        "Verify error for negative or empty frequency",
        { tags: "@pd42668" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.enterNegativeFrequency("-5");
            riskDetail.verifyFrequencyError(
              data.riskDetail.validationErrors.negativeFrequency
            );
            riskDetail.clearFrequency();
            riskDetail.verifyFrequencyError(
              data.riskDetail.validationErrors.emptyFrequency
            );
          });
        }
      );

      it(
        "Verify Risk Definition tree structure and preselection",
        { tags: "@pd42658" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.verifyPreselectedRiskDefinition(
              data.riskDetail.add.definitionName
            );
            riskDetail.selectDifferentRiskDefinition(
              data.riskDetail.alternateDefinition,
              data.riskDetail.alternativeCategory
            );
            riskDetail.saveRiskDetail();
            riskDetail.clickOkModal();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionChanged(
              data.riskDetail.alternateDefinition
            );
          });
        }
      );

      it("Change the Risk Definition Tree Structure to initial Level", () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.verifyPreselectedRiskDefinition(
            data.riskDetail.alternateDefinition
          );
          riskDetail.selectDifferentRiskDefinition(
            data.riskDetail.add.definitionName,
            data.riskDetail.add.categoryName
          );
          riskDetail.saveRiskDetail();
          riskDetail.clickOkModal();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionChanged(
            data.riskDetail.add.definitionName
          );
        });
      });

      it("Verify Save button functionality", { tags: "@pd42654" }, () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          const uniqueName = riskDetail.fillRiskDetailForm(data.riskDetail.add);
          riskDetail.clickSaveButton();
          riskDetail.verifyDataSavedAndNavigation();
          riskRegister_PO.searchRiskDefinition(uniqueName);
          riskDetail.writeRiskDetailName("add", uniqueName);
        });
      });

      it("Verify Cancel button discards changes", { tags: "@pd42651" }, () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.fillRiskDetailForm(data.riskDetail.add);
          riskDetail.closeRiskDetailForm();
          riskDetail.verifyFormClosed();
        });
      });
    });

    context("Update", { tags: "risk-detail-update" }, () => {
      beforeEach(() => {
        cy.loginWithSession(
          `login with ${rmUser.username}`,
          rmUser.username,
          rmUser.password,
          rmUser.key
        );
        cy.visitRiskRegister();
        cy.waitForStableGrid(300000);
      });

      it("Edit risk detail with all valid fields filled", () => {
        cy.readFile(riskDetailData).then((data) => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          // Fill form and capture the unique name
          const uniqueName = riskDetail.fillRiskDetailForm(
            data.riskDetail.update
          );
          riskDetail.saveRiskDetail();
          cy.reload(true);
          cy.waitForStableGrid(300000);
          riskRegister_PO.searchRiskDefinition(uniqueName);

          // Write the unique name back to JSON after successful save
          riskDetail.writeRiskDetailName("update", uniqueName);
        });
      });

      it(
        "Reopen saved record for Update Risk Detail to ensure data persistence",
        { tags: "@pd50016" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            // First save a record
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.verifyRiskDetailForm(
              data.riskDetail.update,
              data.riskDetail.update.riskName,
              "updated"
            );
            // riskDetail.saveRiskDetail();
            riskDetail.closeRiskDetailForm();
          });
        }
      );

      it(
        "Open flyout, make no changes, and click Cancel",
        { tags: "@pd50017" },
        () => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.closeRiskDetailForm();
          riskDetail.verifyFormClosed();
        }
      );

      // No validation is showing when mandatory fields are cleared and form is saved
      // https://360factors.atlassian.net/browse/PD-44095
      it(
        "Attempt to save risk detail without filling mandatory fields",
        { tags: "@pd42664" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            riskDetail.verifyGridLength();
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyRiskDefinitionTreeLoaded();
            riskDetail.clearMandatoryFields();
            riskDetail.saveRiskDetail();
            cy.reload();
            cy.waitForStableGrid(300000);
            riskRegister_PO.searchRiskDefinition(
              data.riskDetail.add.definitionName
            );
          });
        }
      );

      //skipping this test because we are using existing risk definition
      // and new definitions are not getting added in the flyover
      // if we change the applicability level right now the existing Risk Definition will disappear from the Grid.
      // due to this issue:
      // https://360factors.atlassian.net/browse/PD-40834
      it.skip(
        "Select all applicability levels one by one and save",
        { tags: "@pd50006" },
        () => {
          cy.readFile(riskDetailData).then((data) => {
            data.riskDetail.applicabilityLevels.forEach((level) => {
              riskDetail.verifyGridLength();
              riskDetail.openRiskDetailForm();
              riskDetail.verifyRiskDetailFormOpen();
              riskDetail.verifyRiskDefinitionTreeLoaded();
              riskDetail.selectApplicabilityLevel(level);
              riskDetail.verifyApplicabilityExclusive(level);
              riskDetail.saveRiskDetail();
              cy.reload();
              cy.waitForStableGrid(300000);
              riskDetail.openRiskDetailForm();
              riskDetail.verifyRiskDetailFormOpen();
              riskDetail.verifyApplicabilityPersisted(level);
              riskDetail.closeRiskDetailForm();
            });
          });
        }
      );

      //rightnow we are working on existing risk definition
      // new Definitions are not getting added in the flyover
      // due to this issue:
      // https://360factors.atlassian.net/browse/PD-40834
      it.skip(
        "Delete an existing risk detail from flyout",
        { tags: "@pd50012" },
        () => {
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailForm();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.deleteRiskDetail();
          riskDetail.confirmDeletion();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyRiskDetailDeleted();
        }
      );
    });

    context(
      "Customer Profile Settings Tests",
      { tags: "customer-profile-settings" },
      () => {
        beforeEach(() => {
          cy.loginWithSession(
            `login with ${rmUser.username}`,
            rmUser.username,
            rmUser.password,
            rmUser.key
          );
          cy.visitCustomerProfile();
        });

        it("Check Lock Risk Definitions settings prevent editing option from Customer Profile", () => {
          cy.get("#isRiskItemLocked")
            .scrollIntoView()
            .should("not.be.disabled")
            .check({ force: true });
          cy.get(locators.general.saveBtn).click();
          cy.get("#isRiskItemLocked")
            .scrollIntoView()
            .should("not.be.disabled")
            .and("be.checked");
        });

        it(
          "Verify Lock Risk Definitions setting prevents editing",
          { tags: "@pd50029" },
          () => {
            cy.log(
              "Customer profile setting: Lock Risk Definitions to Risk Items - enabled"
            );
            cy.visitRiskRegister();
            cy.waitForStableGrid(300000);
            riskDetail.openRiskDetailForm();
            riskDetail.verifyRiskDetailFormOpen();
            riskDetail.verifyEditingRestricted();
          }
        );

        it("Uncheck Lock Risk Definitions settings prevent editing from Customer Profile", () => {
          cy.get("#isRiskItemLocked")
            .scrollIntoView()
            .should("not.be.disabled")
            .uncheck({ force: true });
          cy.get(locators.general.saveBtn).click();
          cy.get("#isRiskItemLocked")
            .scrollIntoView()
            .should("not.be.disabled")
            .and("not.be.checked");
        });

        it("Check ROC Option from Customer Profile", () => {
          cy.get("#isRocToCreateNewRiskEnabled")
            .scrollIntoView()
            .should("not.be.disabled")
            .check({ force: true });
          cy.get(locators.general.saveBtn).click();
          cy.get("#isRocToCreateNewRiskEnabled")
            .scrollIntoView()
            .should("not.be.disabled")
            .and("be.checked");
        });
        it(
          "Verify Enable ROC to create new risk setting",
          { tags: "@pd50030" },
          () => {
            cy.log(
              "Customer profile setting: Enable ROC to create new risk - enabled"
            );
            cy.clearAllSessionStorage();
            const buUser = Cypress.env("kxi").customer.BUUser;
            cy.loginWithSession(
              `login with ${buUser.username}`,
              buUser.username,
              buUser.password,
              buUser.key
            );
            cy.readFile(riskDetailData).then((data) => {
              cy.visitRiskRegister();
              riskRegister_PO.searchRiskDefinition(
                data.riskDetail.add.definitionName
              );
              cy.waitForStableGrid(300000);
              riskDetail.openRiskItemForm();
              riskDetail.verifyRiskItemFormOpen();
              const name = riskDetail.fillRiskItemForm(
                data.riskDetail.riskItem
              );
              riskDetail.clickRiskItemFormSaveButton();
              cy.reload();
              cy.waitForStableGrid(300000);
              riskRegister_PO.searchRiskDefinition(name);
              riskDetail.writeRiskDetailName("add", name);
              Cypress.session.clearAllSavedSessions();
            });
          }
        );
        it("Uncheck ROC Option from Customer Profile", () => {
          cy.get("#isRocToCreateNewRiskEnabled")
            .scrollIntoView()
            .should("not.be.disabled")
            .uncheck({ force: true });
          cy.get(locators.general.saveBtn).click();
          cy.get("#isRocToCreateNewRiskEnabled")
            .scrollIntoView()
            .should("not.be.disabled")
            .and("not.be.checked");
        });

        it("Verify that After Uncheck the ROC option 'Add Risk Item' option is not available for BU User", () => {
          cy.clearAllSessionStorage();
          const buUser = Cypress.env("kxi").customer.BUUser;
          cy.loginWithSession(
            `login with ${buUser.username}`,
            buUser.username,
            buUser.password,
            buUser.key
          );
          cy.readFile(riskDetailData).then((data) => {
            cy.visitRiskRegister();
            cy.waitForStableGrid(300000);
            riskDetail.verifyRiskItemFormOptionNotExists();
            Cypress.session.clearAllSavedSessions();
          });
        });

        it("Delete Risk Item from BU User", { tags: "@pd50012" }, () => {
          cy.clearAllSessionStorage();
          const buUser = Cypress.env("kxi").customer.BUUser;
          cy.loginWithSession(
            `login with ${buUser.username}`,
            buUser.username,
            buUser.password,
            buUser.key
          );
          cy.visitRiskRegister();
          riskDetail.verifyGridLength();
          riskDetail.openRiskDetailFormBUUser();
          riskDetail.verifyRiskDetailFormOpen();
          riskDetail.verifyRiskDefinitionTreeLoaded();
          riskDetail.deleteRiskDetail();
          riskDetail.confirmDeletion();
          cy.reload();
          cy.waitForStableGrid(300000);
          riskDetail.verifyRiskDetailDeleted();
        });

        it("remove Risk Items from Risk Taxonomy Screen.", () => {
          cy.readFile(riskDetailData).then((data) => {
            cy.visitRiskTaxonomies();
            cy.waitForTopMsgLoaderToDisappear(50000);
            cy.waitForMyGridLoaderToDisappear(50000);
            riskTaxonomy.searchRiskTaxonomy(
              data.riskDetail.add.riskName
            );
            riskDetail.clickDeleteIcon();
            riskDetail.riskTaxonomyConfirmDeletion();
            cy.reload();
            riskDetail.verifyRiskDetailDeleted();
          });
        });
      }
    );
  }
);
