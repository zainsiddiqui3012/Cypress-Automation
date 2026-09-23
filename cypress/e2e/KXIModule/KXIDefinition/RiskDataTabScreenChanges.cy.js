import locators from "../../../fixtures/locators.json";

/// <reference types= "cypress" />

import PredictMenu_PO from "../../../support/POM/Menu_PO/PredictMenu_PO";
import Category from "../../../fixtures/KXIModule/KXICategories.json";
import KXI_POM from "../../../support/POM/KXIModule/KxI_POM";
import kxiData from "../../../support/POM/KXIModule/KxIData";

describe(
  "KxI definition editor > Risk Data Tab Screen changes - PD-19376",
  {
    tags: [
      "@regression",
      "@kxi-management",
      "@define-kxis",
      "@pd22246",
      "@release5.17",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const KXIData = new kxiData();
    context(
      "Risk Data changes for Customer with ERM",
      { tags: ["@withRM"] },
      () => {
        const predictMenu_PO = new PredictMenu_PO();
           const withoutRM_PEER = Cypress.env("kxi").customer.withRM3;
        beforeEach(() => {
         cy.loginWithSession(
           `login - ${withoutRM_PEER.username}`,
           withoutRM_PEER.username,
           withoutRM_PEER.password,
           withoutRM_PEER.key
         );
        });
        Category.forEach((test) => {
          it(test.RiskDataCategorization, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            cy.get(locators.menu.kxIManagement).click();
            cy.get(locators.kxi.DefineKxi).click();
            KXIData.waitForKXIDATALoaderToDisappear();
            cy.get(locators.kxi.kxiDefinition.editBtn).eq(0).click();
            cy.get(locators.kxi.kxiDefinition.categorizationTab).contains(
              "Categorization"
            );
          });

          it(test.RiskDataBUs, () => {
            cy.visitProfile();

            predictMenu_PO.menuClick();
            cy.get(locators.menu.kxIManagement).click();
            cy.get(locators.kxi.DefineKxi).click();
            KXIData.waitForKXIDATALoaderToDisappear();
            cy.get(locators.kxi.kxiDefinition.editBtn).eq(0).click();
            cy.get(locators.kxi.kxiDefinition.radioButton)
              .contains("Corporate Risk")
              .click();
            cy.get(locators.kxi.kxiDefinition.buDropdown).should("be.disabled");
            cy.get(locators.kxi.kxiDefinition.radioButton)
              .contains("Business Unit Risk")
              .click();
            cy.get(locators.kxi.kxiDefinition.buDropdown).should("be.enabled");
          });
        });
      }
    );
    context("Risk Data changes for Lumify", { tags: ["@withoutRM"] }, () => {
      const predictMenu_PO = new PredictMenu_PO();
      beforeEach(() => {
        cy.session("login - without Risk Management and Peer Banks", () => {
          const withoutRM_PEER = Cypress.env("kxi").customer.withoutRM;
          cy.visit(Cypress.config("baseUrl"));
          cy.login(
            withoutRM_PEER.username,
            withoutRM_PEER.password,
            withoutRM_PEER.key
          );
        });
      });
      Category.forEach((test) => {
        it(test.RiskDataCategorization, () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          cy.get(locators.menu.administrationLumify).click();
          cy.get(locators.kxi.DefineKxi).click();
          KXIData.waitForKXIDATALoaderToDisappear();
          cy.get(locators.kxi.kxiDefinition.lumifyEditBtn).eq(0).click();
          cy.get(locators.kxi.kxiDefinition.categorizationTab).contains(
            "Categorization"
          );
        });

        it(test.RiskDataBUs, () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          cy.get(locators.menu.administrationLumify).click();
          cy.get(locators.kxi.DefineKxi).click();
          KXIData.waitForKXIDATALoaderToDisappear();
          cy.get(locators.kxi.kxiDefinition.lumifyEditBtn).eq(0).click();
          cy.get(locators.kxi.kxiDefinition.radioButton)
            .contains("Corporate Risk")
            .click();
          cy.get(locators.kxi.kxiDefinition.buDropdown).should("be.disabled");
          cy.get(locators.kxi.kxiDefinition.radioButton)
            .contains(" Business Unit Risk")
            .click();
          cy.get(locators.kxi.kxiDefinition.buDropdown).should("be.enabled");
        });

        it(test.LumifyRiskColumnpicker, () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          cy.get(locators.menu.administrationLumify).click();
          cy.get(locators.kxi.DefineKxi).click();
          KXIData.waitForKXIDATALoaderToDisappear();
          cy.get(locators.kxi.kxiDefinition.lumifyEditBtn).eq(0).click();
          cy.get(locators.kxi.kxiDefinition.categorizationTab)
            .contains("Categorization")
            .click();
          cy.get(locators.kxi.kxiDefinition.columnPickerbtn).click();
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "contain",
            "KXIs"
          );
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "not.contain",
            "Risk Definition"
          );
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "not.contain",
            "Risk Definition ID"
          );
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "not.contain",
            "Management Comments"
          );
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "not.contain",
            "BU"
          );
          cy.get(locators.kxi.kxiDefinition.columnPicker).should(
            "not.contain",
            "BA"
          );
        });
        it(test.LumifyColumns, () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          cy.get(locators.menu.administrationLumify).click();
          cy.get(locators.kxi.DefineKxi).click();
          KXIData.waitForKXIDATALoaderToDisappear();
          cy.get(locators.kxi.kxiDefinition.lumifyEditBtn).eq(0).click();
          cy.get(locators.kxi.kxiDefinition.categorizationTab)
            .contains("Categorization")
            .click();

          cy.get(locators.kxi.kxiDefinition.lumifyGrid).should(
            "contain",
            "KXIs"
          );
          cy.get(locators.kxi.kxiDefinition.lumifyGrid).should(
            "contain",
            "Group"
          );
        });
        it(test.LumifyCategories, () => {
          cy.visitProfile();

          predictMenu_PO.menuClick();
          cy.get(locators.menu.administrationLumify).click();
          cy.get(locators.kxi.DefineKxi).click();
          cy.get(locators.kxi.kxiDefinition.lumifyEditBtn).eq(0).click();
          cy.get(locators.kxi.kxiDefinition.categorizationTab)
            .contains("Categorization")
            .click();

          cy.get(locators.kxi.kxiDefinition.riskCategory).should("be.visible");
          cy.get(locators.kxi.kxiDefinition.risksubCategory).should(
            "be.visible"
          );
        });
      });
    });
  }
);
