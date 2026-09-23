import locators from "../../fixtures/locators.json";

import dayjs from "dayjs";
/// <reference types= "cypress" />

import SoxPre from "../../fixtures/SoxReview/SOXCreationForm.json";
import SOXCreation_PO from "../../support/POM/SOXReview_PO/SoxCreation_PO";

describe(
  "Sox Review Edit form",
  { tags: ["@regression", "@cms", "@sox-review", "@jira", "@customer"] },
  () => {
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

    it(SoxPre.EditFields, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(15000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();
      cy.wait(15000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.ParentEditBtn)
        .click();
      cy.wait(40000);
      sox.clearSummary();
      sox.EnterSummary(SoxPre.SummarywithAll);
      sox.OtherFields();
      sox.SelectOG();
      sox.UpdateBtn();
      cy.wait(20000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.SummaryText)
        .contains(SoxPre.SummarywithAll);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Category)
        .contains(SoxPre.Category);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.priority)
        .contains(SoxPre.Priority);
    });

    it(SoxPre.EditSummaryLength, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.ParentEditBtn)
        .click();
      cy.wait(40000);
      sox.clearSummary();
      cy.createRandomString(256).then((randomString) => {
        sox.EnterSummary(randomString);
      });

      sox.UpdateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(SoxPre.SummaryLengthMsg);
    });

    it.skip(SoxPre.EditDescLength, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.ParentEditBtn)
        .click();
      cy.wait(40000);

      sox.EnterSummary(SoxPre.SummarywithMandatory);
      cy.createRandomString(32768).then((randomString) => {
        sox.EnterDescription(randomString);
      });

      sox.UpdateBtn();

      cy.wait(10000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(SoxPre.DescLengthMsg);
    });

    it(SoxPre.EditDate, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.ParentEditBtn)
        .click();
      cy.wait(40000);

      sox.EnterSummary(SoxPre.SummarywithMandatory);
      sox.SelectOG();
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.DueDateInput)
        .type(SoxPre.InvalidDueDate);
      sox.UpdateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.DateErrorMessge)
        .contains(SoxPre.DueDateMsg);

      sox.SelectDateBYDatePicker();

      sox.UpdateBtn();

      cy.wait(20000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.DueDate)
        .contains("30/Jan/2025");
    });

    it(SoxPre.EditAssignee, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(15000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink)
        .click();

      cy.wait(15000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.ParentEditBtn)
        .click();
      cy.wait(15000);
      sox.SelectSingleAssignee();

      sox.UpdateBtn();

      cy.wait(20000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee)
        .contains("Admin User 2");
    });

    it(SoxPre.CommentbtnWorkflow, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(15000);

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
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentBtn)
        .click({ force: true });
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentTextArea)
        .click({ force: true });
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentTextArea)
        .type(SoxPre.CommentText, { force: true });
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentBtn2)
        .click({ force: true });
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentAdd)
        .click({ force: true });

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.CommentValue, { timeout: 50000 })
        .contains(SoxPre.CommentText);
    });

    it(SoxPre.AttachFileWorkflow, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      cy.wait(10000);

      cy.visit(Cypress.config("JiraUrl"));

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.wait(10000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink)
        .click();
      cy.wait(5000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.AttachFile)
        .attachFile("testing2.txt");
      cy.wait(5000);
    });
  }
);
