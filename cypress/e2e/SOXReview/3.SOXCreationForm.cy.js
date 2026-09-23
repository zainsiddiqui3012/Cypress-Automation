import locators from "../../fixtures/locators.json";

import dayjs from "dayjs";
/// <reference types= "cypress" />

import test from "../../fixtures/SoxReview/SOXCreationForm.json";
import SOXCreation_PO from "../../support/POM/SOXReview_PO/SoxCreation_PO";

describe(
  "Sox Review Creation form",
  { tags: ["@regression", "@cms", "@sox-review", "@jira", "@customer"] },
  () => {
    const sox = new SOXCreation_PO();

    it(test.CreateSoxMandatoryFields, { tags: "@smoke" }, () => {
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
        .contains(test.soxSingle)
        .click();

      cy.wait(3000);
      sox.SelectAssigneeFromCF(test.AssigneeName);

      sox.SoxMenu();

      sox.EnterSummary(test.SummarywithMandatory);
      sox.SelectOG();
      sox.CreateBtn();

      sox.validateFields(
        test.soxSummary,
        test.openStatus,
        test.SummarywithMandatory,
        test.soxBU
      );
    });

    it(test.CreateSoxAllFields, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithAll);
      sox.EnterDescription(test.description);
      sox.OtherFields();
      sox.SelectOG();
      sox.CreateBtn();

      sox.validateAllFields(
        test.soxSummary,
        test.openStatus,
        test.SummarywithAll,
        test.soxBU,
        test.Reporter,
        test.Category,
        test.Priority,
        test.description
      );
    });

    it(test.ValidateMandatoryField, { tags: "@smoke" }, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);

      sox.CreateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(test.MandatorySummary);
    });

    it(test.ValidateSummaryLength, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);
      cy.createRandomString(256).then((randomString) => {
        sox.EnterSummary(randomString);
      });

      sox.CreateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(test.SummaryLengthMsg);
    });

    //Description TEXT, issue it is not type the text in the SOX Rveiew ticket description
    it.skip(test.ValidateDescLength, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      sox.EnterDescription();

      sox.CreateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(test.DescLengthMsg);
    });

    it(test.ValidateDateFormat, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      sox.SelectOG();

      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.DueDateInput)
        .type(test.InvalidDueDate);
      sox.CreateBtn();

      cy.wait(7000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.DateErrorMessge)
        .contains(test.DueDateMsg);

      sox.SelectDateBYDatePicker();

      sox.CreateBtn();

      cy.wait(3000);
      cy.visit(Cypress.config("JiraUrl"));
      cy.waitForTopMsgLoaderToDisappear(50000);

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.DueDate, { timeout: 30000 })
        .contains(test.soxDate);
    });

    it(test.CreateSoxwithSingle, () => {
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
        .contains(test.soxSingle)
        .click();

      cy.wait(3000);
      sox.SelectAssigneeFromCF(test.AssigneeName);

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      sox.SelectSingleAssignee();
      cy.wait(3000);
      sox.SelectOG();

      sox.CreateBtn();

      cy.wait(3000);
      cy.visit(Cypress.config("JiraUrl"));

      cy.waitForTopMsgLoaderToDisappear(50000);

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();

      cy.wait(15000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee, { timeout: 20000 })
        .contains(test.soxAssignee);
    });

    // It will be used when bug will be resolved
    //BUG-ID : https://360factors.atlassian.net/browse/PD-19054
    it.skip(test.CreateSoxwithGroup, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      sox.SelectGroupAssignee();
      cy.wait(3000);
      sox.SelectOG();

      sox.CreateBtn();

      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee)
        .contains("test");
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.ShortErrorMessage)
        .contains(test.MandatoryOH);
    });

    it(test.CreateSoxwithSingleCF, () => {
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
        .contains(test.soxSingle)
        .click();

      cy.wait(3000);
      sox.SelectAssigneeFromCF(test.AssigneeName);

      sox.SoxMenu();
      cy.wait(3000);
      sox.EnterSummary(test.SummarywithMandatory);
      cy.wait(3000);
      sox.SelectOG();

      sox.CreateBtn();
      cy.wait(3000);
      cy.visit(Cypress.config("JiraUrl"));

      cy.waitForTopMsgLoaderToDisappear(50000);

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.Sox.openJiraTicket)
        .children()
        .within(() => {
          cy.get(locators.cms.Sox.issueLink).click({ force: true });
        });

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
        .click();

      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee, { timeout: 50000 })
        .contains(test.soxAssignee);
    });

    // It will be used when bug will be resolved
    //BUG-ID: https://360factors.atlassian.net/browse/PD-19054
    it.skip(test.CreateSoxwithGroupCF, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.CustomerProfileClick();

      cy.wait(3000);
      cy.get(locators.administration.CF.groupRadioButton)
        .parent()
        .contains(test.soxGroup)
        .click();

      cy.wait(3000);
      sox.SelectAssigneeFromCF(test.AssigneeGroupName, true);

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      cy.wait(3000);
      sox.SelectOG();

      cy.switchIframe("#mytarget")
        .find("div#assignee-single-select input")
        .click()
        .clear()
        .type(test.anotherAssignee)
        .wait(500)
        .type("{enter}");

      sox.CreateBtn();

      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.wait(10000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee)
        .contains(test.anotherAssignee);
    });

    // It will be used when bug will be resolved
    //BUG-ID: https://360factors.atlassian.net/browse/PD-19054
    it.skip(test.CreateSoxwithUnAssCF, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(
        Cypress.env("soxusername"),
        Cypress.env("soxpassword"),
        Cypress.env("soxkey")
      );

      sox.CustomerProfileClick();

      cy.wait(3000);
      cy.get(locators.administration.CF.groupRadioButton)
        .scrollIntoView()
        .parent()
        .contains(test.soxGroup)
        .click();
      cy.wait(3000);
      cy.get(locators.administration.CF.SaveBtn).click();

      sox.SoxMenu();
      cy.wait(10000);
      sox.EnterSummary(test.SummarywithMandatory);
      cy.wait(3000);
      sox.SelectOG();

      sox.CreateBtn();

      cy.waitForTopMsgLoaderToDisappear(50000);
      cy.wait(8000);
      cy.switchIframe(locators.cms.ATask.frameId)
        .find(locators.cms.soxWorkflow.Assignee)
        .contains(test.soxUnassigned);
    });
  }
);
