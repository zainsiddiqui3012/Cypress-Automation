import locators from "../../fixtures/locators.json";
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import dayjs from "dayjs";
/// <reference types= "cypress" />

import SoxPre from "../../fixtures/SoxReview/PreRequisites.json";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import PreRequisites_PO from "../../support/POM/SOXReview_PO/PreRequisites_PO";

describe(
  "Add BU for SOX Review From Organizational Hierarchy",
  {
    tags: [
      "@regression",
      "@organizational-hiearachy",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const pre = new PreRequisites_PO();

    it(SoxPre.ParentTest, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.OHMenu();
      pre.addBUParent(
        SoxPre.parentBU,
        SoxPre.CEOprocessOwner,
        SoxPre.PresidentprocessOwner
      );

      cy.wait(3000);
      cy.get(locators.administration.organizationalHierarchy.toastMsg).should(
        "be.visible"
      );
    });

    it(SoxPre.ChildSingle, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.OHMenu();
      pre.addChildBU(SoxPre.childBUSingle);

      pre.editChildBU();

      cy.get(
        locators.administration.organizationalHierarchy
          .singleProcessOwnerDropdown
      ).click();
      cy.get(
        locators.administration.organizationalHierarchy
          .singleProcessOwnerDropdownSearch
      )
        .type(SoxPre.assignee)
        .type("{enter}");

      cy.get("#s2id_bcmUserId").click();

      cy.get(
        locators.administration.organizationalHierarchy
          .singleProcessOwnerDropdownSearch
      )
        .type("fnba.admin2")
        .type("{enter}");

      cy.get(locators.administration.organizationalHierarchy.saveBtn).click();
      cy.wait(3000);
      cy.get(locators.administration.organizationalHierarchy.toastMsg).should(
        "be.visible"
      );
    });

    it(SoxPre.ChildGroup, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.OHMenu();
      pre.addChildBU(SoxPre.childBUGroup);

      pre.editChildBU();

      cy.get(locators.administration.organizationalHierarchy.groupRadioButton)
        .last()
        .contains("Group")
        .click();
      cy.get(
        locators.administration.organizationalHierarchy
          .groupProcessOwnerDropdown
      ).click();
      cy.get(
        locators.administration.organizationalHierarchy
          .singleProcessOwnerDropdownSearch
      )
        .type(SoxPre.group)
        .type("{enter}");

      cy.get("#s2id_bcmUserId").click();

      cy.get(
        locators.administration.organizationalHierarchy
          .singleProcessOwnerDropdownSearch
      )
        .type("fnba.admin2")
        .type("{enter}");

      cy.get(locators.administration.organizationalHierarchy.saveBtn).click();

      cy.get(locators.administration.organizationalHierarchy.toastMsg, {
        timeout: 30000,
      }).should("be.visible");
    });
  }
);
