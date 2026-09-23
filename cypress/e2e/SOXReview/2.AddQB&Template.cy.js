import locators from "../../fixtures/locators.json";
import LoginDetails_PO from "../../support/POM/LoginPredict_PO/LoginDetails_PO";
import dayjs from "dayjs";

/// <reference types= "cypress" />

import SoxPre from "../../fixtures/SoxReview/PreRequisites.json";
import PreRequisites_PO from "../../support/POM/SOXReview_PO/PreRequisites_PO";

describe(
  "Add Question Bank and Template for SOX Review From Assessments",
  {
    tags: [
      "@regression",
      "@assessments",
      "@predict",
      "@customer",
    ],
  },
  () => {
    const pre = new PreRequisites_PO();
    it(SoxPre.QBTest, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.AddQB(SoxPre.QBName, SoxPre.QuestionText);
    });
    it(SoxPre.PublishQBTest, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.PublishQB();
    });

    it(SoxPre.AddTemplateTest, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.AddTemplate(SoxPre.TemplateName, SoxPre.SectionName, SoxPre.QBName);
    });

    it(SoxPre.PublishTemplateTest, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      pre.PublishTemplate();
    });

    it(
      SoxPre.SelectTemplateTest,
      {
        tags: ["@smoke", "@cms", "@sox-review-questionaire"],
      },
      () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(
          Cypress.env("soxusername"),
          Cypress.env("soxpassword"),
          Cypress.env("soxkey")
        );

        pre.SelectTemplate(SoxPre.TemplateName);
      }
    );
  }
);
