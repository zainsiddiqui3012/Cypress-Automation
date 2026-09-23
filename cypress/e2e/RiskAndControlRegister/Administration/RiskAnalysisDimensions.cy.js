import RiskAnalysis from "../../../support/POM/RiskAndControlRegister/Administration/RiskAnalysisDimensions";
const riskAnalysis = new RiskAnalysis();
import data from "../../../fixtures/RiskAndControlRegister/Administration/RiskAnalysisDimensions.json";
import locators from "../../../fixtures/locators.json";

describe(
  "E2E testing of Risk Analysis Dimensions screen",
  {
    tags: [
      "@regression",
      "@riskandcontrolregister",
      "@risk-analysis-dimensions",
      "@pd36723",
      "@predict",
      "@customer",
    ],
  },

  () => {
    const userLogin = Cypress.env("kxi").customer;
    context("e2e testing likelihood dimensions", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitRiskAnalysisDimensions();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Save all valid likelihood dimensions",
        { tags: ["@smoke", "@pd40036", "@pd40037", "@pd40040", "@pd40047"] },
        () => {
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.likelihoodName.likelihoodText,
            data.nameField.add,
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.writeLabel(data.add.likelihoodName.likelihoodLabel);
          riskAnalysis.selectDimensionValue(
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.selectUniqueValue(
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.selectUniqueColor(
            data.add.likelihoodName.likelihoodText
          );
          riskAnalysis.clickSaveButton();

          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );

          riskAnalysis.storedValueVisible(
            data.add.likelihoodName.likelihoodLabel
          );
        }
      );

      it(
        "Duplicate Value error on the likelihood tab",
        { tags: "@pd40060" },
        () => {
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.likelihoodName.likelihoodText,
            data.nameField.add,
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.selectDuplicateValue(
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.selectUniqueColor(
            data.add.likelihoodName.likelihoodText
          );
          riskAnalysis.clickSaveButton();

          cy.verifyToastMessageText(
            data.errorMessage.duplicateValue,
            20000
          ).should("be.visible");
        }
      );

      it(
        "Edit existing likelihood dimension",
        { tags: ["@smoke", "@pd40038"] },
        () => {
          riskAnalysis.typeLabel(
            data.add.likelihoodName.likelihoodText,
            data.nameField.update,
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.writeLabel(data.add.likelihoodName.likelihoodLabel);
          riskAnalysis.clickSaveButton();
          riskAnalysis.storedValueVisible(
            data.add.likelihoodName.likelihoodLabel
          );
        }
      );

      it(
        "Delete a likelihood dimension",
        { tags: ["@smoke", "@pd40039"] },
        () => {
          riskAnalysis.clickDeleteButton(
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();
        }
      );

      it(
        "Save without entering Label on the likelihood tab",
        { tags: ["@pd40041", "@pd40042", "@pd40043", "@pd40050"] },
        () => {
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.errorMessage.savingIssue,
            20000
          ).should("be.visible");
          riskAnalysis.assertValidationError();
        }
      );

      //audit log test case - likelihood

      it(
        "Created Record Log check in the Audit log",
        { tags: ["@smoke", "@pd40119", "@pd40118", "@pd40124"] },
        () => {
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.likelihoodName.likelihoodText,
            data.nameField.add,
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.writeLabel(data.add.likelihoodName.likelihoodLabel);
          riskAnalysis.selectDimensionValue(
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.selectUniqueValue(
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.writeValue(data.add.likelihoodName.likelihoodValue);
          riskAnalysis.selectUniqueColor(
            data.add.likelihoodName.likelihoodText
          );
          riskAnalysis.clickSaveButton();
          riskAnalysis.storedValueVisible(
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyLastAuditLogLabelAndValue(
            data.add.likelihoodName.likelihoodLabel,
            data.add.likelihoodName.likelihoodValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Modified Record Log check in the Audit log",
        { tags: ["@pd40121", "@pd40124"] },
        () => {
          riskAnalysis.typeLabel(
            data.add.likelihoodName.likelihoodText,
            data.nameField.update,
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.writeLabel(data.add.likelihoodName.likelihoodLabel);
          riskAnalysis.clickSaveButton();
          riskAnalysis.storedValueVisible(
            data.add.likelihoodName.likelihoodLabel
          );

          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyAuditLog(
            data.add.likelihoodName.likelihoodLabel,
            locators.risk.riskAnalysis.checkAuditValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );

      it(
        "Deleted Record Log check in the Audit log",
        { tags: ["@pd40120", "@pd40124"] },
        () => {
          riskAnalysis.clickDeleteButton(
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();

          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyDeletedAuditLog(
            data.add.likelihoodName.likelihoodLabel
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
    });

    context("e2e testing impact dimensions", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitRiskAnalysisDimensions();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Save all valid impact dimensions",
        { tags: ["@smoke", "@pd40051", "@pd40040"] },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.impactName.impactText,
            data.nameField.add,
            data.add.impactName.impactLabel
          );
          riskAnalysis.writeLabel(data.add.impactName.impactLabel);
          riskAnalysis.selectDimensionValue(data.add.impactName.impactValue);
          riskAnalysis.selectUniqueValue(data.add.impactName.impactValue);
          riskAnalysis.selectUniqueColor(data.add.impactName.impactText);
          riskAnalysis.clickSaveButton();

          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(data.add.impactName.impactLabel);
        }
      );

      it("Edit existing impact dimension", { tags: "@pd40053" }, () => {
        riskAnalysis.clickTab(data.add.impactName.tabName);
        riskAnalysis.typeLabel(
          data.add.impactName.impactText,
          data.nameField.update,
          data.add.impactName.impactLabel
        );
        riskAnalysis.writeLabel(data.add.impactName.impactLabel);
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
          "be.visible"
        );
        riskAnalysis.storedValueVisible(data.add.impactName.impactLabel);
      });

      it(
        "Duplicate Value error on the impact tab",
        { tags: "@pd40045" },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);

          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.impactName.impactText,
            data.nameField.add,
            data.add.impactName.impactLabel
          );
          riskAnalysis.selectDuplicateValue(data.add.impactName.impactValue);
          riskAnalysis.selectUniqueColor(data.add.impactName.impactText);
          riskAnalysis.clickSaveButton();

          cy.verifyToastMessageText(
            data.errorMessage.impactDuplicateValue,
            20000
          ).should("be.visible");
        }
      );

      it("Delete a impact dimension", { tags: ["@smoke", "@pd40054"] }, () => {
        riskAnalysis.clickTab(data.add.impactName.tabName);
        riskAnalysis.clickDeleteButton(data.add.impactName.impactLabel);
        riskAnalysis.clickDeleteModalButton();
        riskAnalysis.clickSaveButton();
        riskAnalysis.verifyRowDeleted();
      });
      it(
        "Save without entering Label on the impact tab",
        { tags: ["@pd40040", "@pd40042", "@pd40043", "@pd40050"] },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.errorMessage.savingIssue,
            20000
          ).should("be.visible");
          riskAnalysis.assertValidationError();
        }
      );

      //audit log test case - impact

      it(
        "Created Record Log check in the Audit log impact dimensions",
        { tags: "@pd40119" },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.impactName.impactText,
            data.nameField.add,
            data.add.impactName.impactLabel
          );
          riskAnalysis.writeLabel(data.add.impactName.impactLabel);
          riskAnalysis.selectDimensionValue(data.add.impactName.impactValue);
          riskAnalysis.selectUniqueValue(data.add.impactName.impactValue);
          riskAnalysis.writeValue(data.add.impactName.impactValue);
          riskAnalysis.selectUniqueColor(data.add.impactName.impactText);
          riskAnalysis.clickSaveButton();

          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(data.add.impactName.impactLabel);
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyLastAuditLogLabelAndValue(
            data.add.impactName.impactLabel,
            data.add.impactName.impactValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );

      it(
        "Modified Record Log check in the Audit log impact dimensions",
        { tags: "@pd40121" },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);
          riskAnalysis.typeLabel(
            data.add.impactName.impactText,
            data.nameField.update,
            data.add.impactName.impactLabel
          );
          riskAnalysis.writeLabel(data.add.impactName.impactLabel);
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(data.add.impactName.impactLabel);
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyAuditLog(
            data.add.impactName.impactLabel,
            locators.risk.riskAnalysis.checkAuditValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );

      it(
        "Deleted Record Log check in the Audit log impact dimensions",
        { tags: "@pd40120" },
        () => {
          riskAnalysis.clickTab(data.add.impactName.tabName);
          riskAnalysis.clickDeleteButton(data.add.impactName.impactLabel);
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();

          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyDeletedAuditLog(data.add.impactName.impactLabel);
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
    });

    context("e2e testing Risk Analysis dimensions", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitRiskAnalysisDimensions();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      //audit log test case - analysis dimensions

      it(
        "Created Record Log check in the Audit log Risk Dimension",
        { tags: "@pd400119" },
        () => {
          riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeRiskLabelAdd();
          riskAnalysis.writeInherentLabel();

          riskAnalysis.typeRiskValue(
            data.add.inherentName.inherentInput,
            data.add.inherentName.inherentValue
          );

          riskAnalysis.selectUniqueColor(data.add.inherentName.inherentText);
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.successMessage.inhertSaved,
            20000
          ).should("be.visible");
          riskAnalysis.storedValueVisible(data.add.inherentName.inherentLabel);
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyLastAuditLogLabelAndValue(
            data.add.inherentName.inherentLabel,
            data.add.inherentName.inherentValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Edit Existing Risk Dimension in the Audit log Risk Dimension",
        { tags: "@pd40072" },
        () => {
          riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
          riskAnalysis.typeInherentLabelUpdate();
          riskAnalysis.writeInherentLabel();
          riskAnalysis.updateStoredValue(
            data.add.inherentName.inherentInput,
            data.add.inherentName.inherentValue
          );
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.successMessage.inhertSaved,
            20000
          ).should("be.visible");
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyAuditLog(
            data.add.inherentName.inherentLabel,
            locators.risk.riskAnalysis.labelText,
            data.add.inherentName.inherentValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Deleted Record Log check in the Audit log impact dimensions",
        { tags: "@pd40120" },
        () => {
          riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
          riskAnalysis.clickDeleteButton(data.add.inherentName.inherentLabel);
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();

          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyDeletedAuditLog(
            data.add.inherentName.inherentLabel
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Add New Risk Dimension Row",
        {
          tags: [
            "@smoke",
            "@pd40068",
            "@pd40074",
            "@pd40076",
            "@pd40081",
            "@pd40082",
          ],
        },
        () => {
          riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeRiskLabelAdd();
          riskAnalysis.writeInherentLabel();

          riskAnalysis.typeRiskValue(
            data.add.inherentName.inherentInput,
            data.add.inherentName.inherentValue
          );

          riskAnalysis.selectUniqueColor(data.add.inherentName.inherentText);
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.successMessage.inhertSaved,
            20000
          ).should("be.visible");
          riskAnalysis.storedValueVisible(data.add.inherentName.inherentLabel);
        }
      );

      it("Save Without Mandatory Fields", { tags: "@pd400469" }, () => {
        riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.errorMessage.savingIssue, 20000).should(
          "be.visible"
        );
        riskAnalysis.assertValidationError();
      });
      it("Save with Duplicate Value", { tags: "@pd40071" }, () => {
        riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeRiskLabelAdd();
        riskAnalysis.duplicateValue(
          data.add.inherentName.inherentInput,
          data.add.inherentName.inherentValue
        );
        riskAnalysis.selectUniqueColor(data.add.inherentName.inherentLabel);
        cy.verifyToastMessageText(data.errorMessage.valueError, 20000).should(
          "be.visible"
        );
      });

      it("Edit Existing Risk Dimension", { tags: "@pd40072" }, () => {
        riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
        riskAnalysis.typeInherentLabelUpdate();
        riskAnalysis.writeInherentLabel();
        riskAnalysis.updateStoredValue(
          data.add.inherentName.inherentInput,
          data.add.inherentName.inherentValue
        );
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(
          data.successMessage.inhertSaved,
          20000
        ).should("be.visible");
      });

      //@skip this test because of https://360factors.atlassian.net/browse/PD-44337 this bug issue

      it.skip("Bulk Edits and Save", { tags: "@pd40080" }, () => {
        riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeRiskLabelAdd();
        riskAnalysis.typeRiskValue(
          data.add.inherentName.inherentInput,
          data.add.inherentName.inherentValue
        );
        riskAnalysis.selectUniqueColor(data.add.inherentName.inherentText);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeRiskLabelAdd();
        riskAnalysis.typeRiskValue(
          data.add.inherentName.inherentInput,
          data.add.inherentName.inherentValue
        );

        riskAnalysis.selectUniqueColor(data.add.inherentName.inherentText);

        riskAnalysis.clickSaveButton();

        cy.verifyToastMessageText(
          data.successMessage.inhertSaved,
          20000
        ).should("be.visible");
        riskAnalysis.storedValueVisible(data.add.inherentName.inherentLabel);
      });

      it("Delete a Risk Dimension", { tags: ["@smoke", "@pd40075"] }, () => {
        riskAnalysis.clickTab(data.add.riskAnalysis.riskTabName);
        riskAnalysis.clickDeleteButton(data.add.inherentName.inherentLabel);
        riskAnalysis.clickDeleteModalButton();
        riskAnalysis.clickSaveButton();
        riskAnalysis.verifyRowDeleted();
      });
    });

    context("e2e testing Relative Magnitudes", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitRiskAnalysisDimensions();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      //audit log test case - Relative Magnitudes

      it(
        "Created Record Log check in the Audit log Relative Magnitudes",
        { tags: "@pd400119" },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeText,
            data.nameField.add,
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.writeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.typeRelativeMagnitudeValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyLastAuditLogLabelAndValue(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels,
            data.add.relativeMagnitudeName.relativeMagnitudeValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Edit Existing Relative Magnitudes in the Audit logs",
        { tags: "@pd40072" },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);

          riskAnalysis.typeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeText,
            data.nameField.update,
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.writeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.updateRelativeMagnitudeValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyAuditLog(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels,
            locators.risk.riskAnalysis.labelText,
            data.add.relativeMagnitudeName.relativeMagnitudeValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Deleted Record Log check in the Audit log Relative Magnitudes",
        { tags: "@pd40120" },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
          riskAnalysis.clickDeleteButton(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyDeletedAuditLog(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );

      it(
        "Add a New Relative Magnitude",
        { tags: ["@smoke", "@pd40084", "@pd40091", "@pd40093"] },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeText,
            data.nameField.add,
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.writeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.typeRelativeMagnitudeValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
            "be.visible"
          );
          riskAnalysis.storedValueVisible(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
        }
      );

      it(
        "Enter Duplicate Values on the relative tab",
        { tags: "@pd40087" },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeText,
            data.nameField.add,
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.writeLabel(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.typeDuplicateRelativeMagnitudeValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.errorMessage.duplicateValue, 20000);
        }
      );
      it("Multiple Validation Failures", { tags: "@pd40097" }, () => {
        riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
        riskAnalysis.clickAddDimensionButton();

        riskAnalysis.typeDuplicateRelativeMagnitudeValue();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.errorMessage.savingIssue, 20000).should(
          "be.visible"
        );
      });
      it(
        "Save Without Entering Label",
        { tags: ["@pd40056", "@pd40086"] },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);

          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.errorMessage.savingIssue,
            20000
          ).should("be.visible");
        }
      );
      it("Update Existing Row", { tags: ["@smoke", "@pd40090"] }, () => {
        riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);

        riskAnalysis.typeLabel(
          data.add.relativeMagnitudeName.relativeMagnitudeText,
          data.nameField.update,
          data.add.relativeMagnitudeName.relativeMagnitudeLabels
        );
        riskAnalysis.writeLabel(
          data.add.relativeMagnitudeName.relativeMagnitudeLabels
        );
        riskAnalysis.updateRelativeMagnitudeValue();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.successMessage.savedRow, 20000).should(
          "be.visible"
        );
        riskAnalysis.storedValueVisible(
          data.add.relativeMagnitudeName.relativeMagnitudeLabels
        );
      });

      it(
        "Delete a Relative Magnitude",
        { tags: ["@smoke", "@pd40089"] },
        () => {
          riskAnalysis.clickTab(data.add.relativeMagnitudeName.tabName);
          riskAnalysis.clickDeleteButton(
            data.add.relativeMagnitudeName.relativeMagnitudeLabels
          );
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();
        }
      );
    });

    context("e2e testing Control Strength", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitRiskAnalysisDimensions();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      //audit log test case - control Strength

      it(
        "Created Record Log check in the Audit log control Strength",
        { tags: "@pd400119" },
        () => {
          riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.controlStrengthName.controlStrengthText,
            data.nameField.add,
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.writeLabel(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.typeControlStrengthValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(data.successMessage.inhertSaved, 200000);
          riskAnalysis.storedValueVisible(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyLastAuditLogLabelAndValue(
            data.add.controlStrengthName.controlStrengthLabels,
            data.add.controlStrengthName.controlStrengthValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Edit Existing control Strength in the Audit log",
        { tags: "@pd40072" },
        () => {
          riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
          riskAnalysis.typeLabel(
            data.add.controlStrengthName.controlStrengthText,
            data.nameField.update,
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.writeLabel(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.updateControlStrengthValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.successMessage.inhertSaved,
            20000
          ).should("be.visible");
          riskAnalysis.storedValueVisible(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyAuditLog(
            data.add.controlStrengthName.controlStrengthLabels,
            locators.risk.riskAnalysis.labelText,
            data.add.controlStrengthName.controlStrengthValue
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );
      it(
        "Deleted Record Log check in the Audit log control Strength",
        { tags: "@pd40120" },
        () => {
          riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
          riskAnalysis.clickDeleteButton(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.clickDeleteModalButton();
          riskAnalysis.clickSaveButton();
          riskAnalysis.verifyRowDeleted();
          riskAnalysis.clickThreeEllipsis();
          riskAnalysis.clickAudit();
          riskAnalysis.verifyAuditLogOpened();
          riskAnalysis.verifyDeletedAuditLog(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.checkAuditDateTime();
          riskAnalysis.verifyAuditLogWithIP();
        }
      );

      it(
        "Add a New Control Strength Level",
        {
          tags: [
            "@smoke",
            "@pd40098",
            "@pd40102",
            "@pd40106",
            "@pd40110",
            "@pd40093",
          ],
        },
        () => {
          riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
          riskAnalysis.clickAddDimensionButton();
          riskAnalysis.typeLabel(
            data.add.controlStrengthName.controlStrengthText,
            data.nameField.add,
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.writeLabel(
            data.add.controlStrengthName.controlStrengthLabels
          );
          riskAnalysis.typeControlStrengthValue();
          riskAnalysis.clickSaveButton();
          cy.verifyToastMessageText(
            data.successMessage.inhertSaved,
            20000
          ).should("be.visible");
          riskAnalysis.storedValueVisible(
            data.add.controlStrengthName.controlStrengthLabels
          );
        }
      );

      it("Save Without Label", { tags: ["@pd40099", "@pd40100"] }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.errorMessage.savingIssue, 20000).should(
          "be.visible"
        );
        riskAnalysis.assertValidationError();
      });
      //two error messages found - needs to be fixed  https://360factors.atlassian.net/browse/PD-43755

      it.skip("Duplicate Value Entry", { tags: "@pd40101" }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeLabel(
          data.add.controlStrengthName.controlStrengthText,
          data.nameField.add,
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.typeDuplicateValue();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(data.errorMessage.controlError, 20000).should(
          "be.visible"
        );
      });

      it("Edit Existing Entry", { tags: "@pd40109" }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.typeLabel(
          data.add.controlStrengthName.controlStrengthText,
          data.nameField.update,
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.writeLabel(
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.updateControlStrengthValue();
        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(
          data.successMessage.inhertSaved,
          20000
        ).should("be.visible");
        riskAnalysis.storedValueVisible(
          data.add.controlStrengthName.controlStrengthLabels
        );
      });

      it("Add Guidance Text > 1000 Characters", { tags: "@pd40105" }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.verifyGuidanceMaxLengthAttribute();
      });
      //@skip this test because of https://360factors.atlassian.net/browse/PD-44337 this bug issue
      it.skip("Add Multiple Rows Rapidly", { tags: "@pd40113" }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeLabel(
          data.add.controlStrengthName.controlStrengthText,
          data.nameField.add,
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.typeControlStrengthValue();

        riskAnalysis.clickAddDimensionButton();
        riskAnalysis.typeLabel(
          data.add.controlStrengthName.controlStrengthText,
          data.nameField.add,
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.typeControlStrengthValue();

        riskAnalysis.clickSaveButton();
        cy.verifyToastMessageText(
          data.successMessage.inhertSaved,
          20000
        ).should("be.visible");
        riskAnalysis.storedValueVisible(
          data.add.controlStrengthName.controlStrengthLabels
        );
      });
      it("Delete Existing Row", { tags: ["@smoke", "@pd40107"] }, () => {
        riskAnalysis.clickTab(data.add.controlStrengthName.tabName);
        riskAnalysis.clickDeleteButton(
          data.add.controlStrengthName.controlStrengthLabels
        );
        riskAnalysis.clickDeleteModalButton();
        riskAnalysis.clickSaveButton();
        riskAnalysis.verifyRowDeleted();
      });
    });
  }
);
