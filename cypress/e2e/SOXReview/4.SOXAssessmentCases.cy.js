import locators from "../../fixtures/locators.json";

import dayjs from "dayjs";
/// <reference types= "cypress" />

import Assessment from "../../fixtures/SoxReview/Assessment.json";
import Assessment_PO from "../../support/POM/SOXReview_PO/Assessment_PO";

import SoxPre from "../../fixtures/SoxReview/SOXCreationForm.json";
import SOXCreation_PO from "../../support/POM/SOXReview_PO/SoxCreation_PO";

describe(
  "Sox Review Assessment Template with pre-Requisites",
  { tags: ["@regression", "@cms", "@sox-review","@jira","@customer"] },
  () => {
    const assessment = new Assessment_PO();
    const sox = new SOXCreation_PO();

    before(function () {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.CustomerProfileClick();

      cy.get(locators.administration.CF.SingleRadiobutton)
        .scrollIntoView()
        .parent()
        .contains("Single")
        .click();

      cy.wait(3000);
      sox.SelectAssigneeFromCF(SoxPre.AssigneeName);

      sox.SoxMenu();
      cy.wait(15000);

      sox.EnterSummary(SoxPre.SummarywithMandatory);

      sox.SelectOG();
      sox.CreateBtn();
      cy.wait(10000);
    });

    Assessment.forEach((test) => {
      it(test.AssessmentAgainstsBUChild, { tags: "@smoke" }, () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(
          Cypress.env("soxusername"),
          Cypress.env("soxpassword"),
          Cypress.env("soxkey")
        );

        cy.visit(Cypress.config("JiraUrl"));

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.Sox.openJiraTicket)
          .children()
          .within(() => {
            cy.get(locators.cms.Sox.issueLink).click({ force: true });
          });

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
          .click();
        cy.wait(20000);

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.OH)
          .its("length")
          .then((count1) => {
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.TemplateCount)
              .its("length")
              .then((count2) => {
                // Perform comparison
                if (count1 === count2) {
                  cy.log(
                    "Both elements have the same number of count:",
                    count1
                  );
                } else {
                  cy.log(
                    "The sets have different numbers of elements. Set 1: ",
                    count1,
                    ", Set 2: ",
                    count2
                  );
                }

                // Example assertion
                expect(count1).to.equal(count2);
              });
          });
      });

      it(test.AssessmentAssigneeChanged, () => {
        cy.visit(Cypress.config("baseUrl"));
        cy.login(
          Cypress.env("soxusername"),
          Cypress.env("soxpassword"),
          Cypress.env("soxkey")
        );

        cy.visit(Cypress.config("JiraUrl"));

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.Sox.openJiraTicket)
          .children()
          .within(() => {
            cy.get(locators.cms.Sox.issueLink).click({ force: true });
          });

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.SOXLink, { timeout: 30000 })
          .click();

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.Status)
          .contains("New");

        assessment.ChangeInlineAssignee();

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.TemplateAssignee, { timeout: 50000 })
          .should("have.text", "katherine2");
      });
    });

    describe(
      "Sox Review Assessment Template",
      { tags: ["@regression", "@cms", "@sox-review"] },
      () => {
        before(function () {
          cy.visit(Cypress.config("baseUrl"));
          cy.login(
            Cypress.env("soxusername"),
            Cypress.env("soxpassword"),
            Cypress.env("soxkey")
          );

          sox.CustomerProfileClick();

          cy.get(locators.administration.CF.SingleRadiobutton)
            .scrollIntoView()
            .parent()
            .contains("Single")
            .click();

          sox.SoxMenu();
          cy.wait(15000);

          sox.SoxMenu();
          cy.wait(10000);
          sox.EnterSummary(SoxPre.SummarywithMandatory);
          sox.SelectOG();
          sox.CreateBtn();
          cy.wait(10000);
        });

        Assessment.forEach((test) => {
          it(test.AssessmentDrafted, { tags: "@smoke" }, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(
              Cypress.env("soxusername"),
              Cypress.env("soxpassword"),
              Cypress.env("soxkey")
            );

            cy.visit(Cypress.config("JiraUrl"));

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.Sox.openJiraTicket)
              .children()
              .within(() => {
                cy.get(locators.cms.Sox.issueLink).click({ force: true });
              });

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();

            assessment.GoToAssessment();

            assessment.ClickDraft();
            cy.wait(5000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.Status)
              .contains("Draft");
          });

          it(test.AssessmentSubmitted, { tags: "@smoke" }, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(
              Cypress.env("soxusername"),
              Cypress.env("soxpassword"),
              Cypress.env("soxkey")
            );

            cy.visit(Cypress.config("JiraUrl"));

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.Sox.openJiraTicket)
              .children()
              .within(() => {
                cy.get(locators.cms.Sox.issueLink).click({ force: true });
              });

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();

            assessment.GoToAssessment();

            assessment.fillAssessment();
            assessment.ClickSubmit();
            cy.wait(5000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.Status)
              .contains("Submitted");
          });

          it(test.AssessmentAssigneeNotChanged, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(
              Cypress.env("soxusername"),
              Cypress.env("soxpassword"),
              Cypress.env("soxkey")
            );

            cy.visit(Cypress.config("JiraUrl"));

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.Sox.openJiraTicket)
              .children()
              .within(() => {
                cy.get(locators.cms.Sox.issueLink).click({ force: true });
              });

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.Status)
              .contains("Submitted");

            assessment.ChangeInlineAssignee();

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.TemplateAssignee)
              .should("not.have.text", test.AssigneeName, { timeout: 20000 });
          });

          it(test.ExclamationCase, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(
              Cypress.env("soxusername"),
              Cypress.env("soxpassword"),
              Cypress.env("soxkey")
            );

            cy.visit(Cypress.config("JiraUrl"));

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.Sox.openJiraTicket)
              .children()
              .within(() => {
                cy.get(locators.cms.Sox.issueLink).click({ force: true });
              });

            cy.wait(10000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
              .click();

            cy.wait(5000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.ExclamationSign)
              .should("be.visible");
          });
        });
      }
    );
  }
);
