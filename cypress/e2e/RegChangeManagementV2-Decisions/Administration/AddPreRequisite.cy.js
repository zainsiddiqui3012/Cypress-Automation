import dataFile from "../../../fixtures/RegChangeManagementV2-Decisions/administration.json";
import RegChangeV2Menu from "../../../support/POM/RegChangeManagementV2-Decisions/RegChangeV2Menu";
import regChangeMenu from "../../../fixtures/RegChangeManagementV2-Decisions/RegChangeMenu.json";
import PreRequisites from "../../../support/POM/RegChangeManagementV2-Decisions/AddPreRequisites";

describe(
  "The PreRequisites for Regulatory Change V2 (Administration)",
  {
    tags: [
      "@regression",
      "@pd32744",
      "@cms",
      "@regchangev2",
      "@predict",
    ],
  },
  () => {
    const preRequisites = new PreRequisites();
    const menu = new RegChangeV2Menu();
    const filePath =
      "cypress/fixtures/RegChangeManagementV2-Decisions/administratio.json";
    context("Administration sub-module", { tags: "@customer" }, () => {
      beforeEach(() => {
        const customerUser = Cypress.env("REG_CHANGE_V2").CUSTOMER;
        cy.loginWithSession(
          "Login with Reg Change V2 customer user",
          customerUser.USERNAME,
          customerUser.PASSWORD,
          customerUser.KEY
        );
      });
      it("Add And Delete Change Type", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.changeType,
          true
        );

        preRequisites.addInGrid(
          dataFile.changeType,
          dataFile.automatedChangeType
        );
      });

      it("Edit Change Type", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.changeType,
          true
        );

        preRequisites.editLastRow(dataFile.automatedChangeType, dataFile.edit);
      });
      it("Add and Delete Nature of Change", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.natureOfChange,
          true
        );
      
        preRequisites.addInGrid(
          dataFile.natureofChange,
          dataFile.automatedNatureofChange,
          true
        );
      });

        it("Edit Nature of Change", () => {
          menu.navigateToScreen(
            regChangeMenu.regulatoryChangeManagement.natureOfChange,
            true
          );

          preRequisites.editLastRow(
            dataFile.automatedNatureofChange,
            dataFile.edit
          );
        });
      it("Add and Delete Magnitude", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.magnitude,
          true
        );

        preRequisites.addInGrid(
          dataFile.magnitude,
          dataFile.automatedMagnitude
        );
      });
      it("Edit Magnitude", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.magnitude,
          true
        );

        preRequisites.editLastRow(dataFile.automatedMagnitude, dataFile.edit);
      });
      it("Add Action plan Template instruction", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.actionPlanTemplate,
          true
        );

        preRequisites.addDescription(dataFile.actionplanText);
      });
      it("Add Evaluate Impact Template instruction", () => {
        menu.navigateToScreen(
          regChangeMenu.regulatoryChangeManagement.evaluateImpactTemplate,
          true
        );

        preRequisites.addDescription(dataFile.evaluateImpactText);
      });
    });
  }
);
