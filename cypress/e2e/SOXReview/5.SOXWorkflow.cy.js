import locators from "../../fixtures/locators.json";

import dayjs from "dayjs";
/// <reference types= "cypress" />

import Assessment from "../../fixtures/SoxReview/Assessment.json";
import SOXCreation_PO from "../../support/POM/SOXReview_PO/SoxCreation_PO";
import Assessment_PO from "../../support/POM/SOXReview_PO/Assessment_PO";
import SoxPre from "../../fixtures/SoxReview/SOXCreationForm.json";

describe(
  "Sox Review Workflow with Pre-Requisites",
  { tags: ["@regression", "@cms", "@sox-review", "@jira", "@customer"] },
  () => {
    const Asse = new Assessment_PO();
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
      cy.wait(10000);
      sox.EnterSummary(SoxPre.SummarywithMandatory);
      sox.SelectOG();
      sox.CreateBtn();
      cy.wait(10000);

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

      Asse.GoToAssessment();
      Asse.fillAssessment();
      Asse.ClickSubmit();
      cy.wait(5000);
    });

    Assessment.forEach((test) => {
      it(test.CompleteTest, { tags: "@smoke" }, () => {
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

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.SOXLink, { timeout: 30000 })
          .click();
        cy.wait(15000);

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Completebtn)
          .click({ force: true });

        cy.wait(40000);

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Status)
          .contains(test.CompleteStatus);
        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Acceptbtn)
          .should("be.visible");
        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Rejectbtn)
          .should("be.visible");
        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Resultbtn)
          .should("be.visible");
        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Previewbtn)
          .should("be.visible");
      });
    });
    describe(
      "Sox Review Workflow with Pre-Requisites",
      { tags: ["@regression", "@cms", "@sox-review", "@jira", "@customer"] },
      () => {
        Assessment.forEach((test) => {
          it(test.ResultTest, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(20000);

            Asse.GoToResults();

            cy.wait(10000);

            cy.get(locators.cms.soxWorkflow.ResultHighRisk).contains(
              "High Risk"
            );
            cy.get(locators.cms.soxWorkflow.ResultSign).should("be.visible");
          });

          it(test.FollowupTest, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(20000);

            Asse.GoToResults();

            cy.wait(10000);

            cy.get(locators.cms.soxWorkflow.ExpandAllbtn).click();
            cy.get(locators.cms.soxWorkflow.FollowUpbtn).click();
            cy.wait(3000);
            cy.get(locators.cms.soxWorkflow.CommentText).type(test.Comment);
            cy.wait(3000);
            cy.get(locators.cms.soxWorkflow.CheckBtn).click();

            cy.get(locators.cms.soxWorkflow.NoteText).contains(test.Comment);

            cy.get(locators.cms.soxWorkflow.Deletebtn).should("be.visible");
            cy.get(locators.cms.soxWorkflow.Editbtn).should("be.visible");
          });

          it(test.TakeActionTest, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(20000);

            Asse.GoToResults();

            cy.wait(10000);

            cy.get(locators.cms.soxWorkflow.TakeActionbtn).click();
            cy.wait(3000);
            cy.get(locators.cms.soxWorkflow.clickFindings).click();
            cy.get(locators.cms.soxWorkflow.TakeActionInput).type("SOX-232");
            cy.wait(3000);
            cy.get(locators.cms.soxWorkflow.Linkbtn).click();
          });

          it(test.ReportTest, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(20000);

            Asse.GoToResults();

            cy.wait(5000);

            Asse.GenerateReport();
          });

          it(test.PreviewTest, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(20000);

            Asse.GoToPreview();

            cy.wait(10000);

            cy.get(locators.cms.soxWorkflow.Printbtn).should("be.visible");
          });

          it(test.ApproveTest, { tags: "@smoke" }, () => {
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

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.SOXLink, { timeout: 30000 })
              .click();
            cy.wait(15000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Acceptbtn)
              .click();

            cy.wait(40000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains(test.ClosedStatus);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Reopenbtn)
              .should("be.visible");
          });

          it(test.ParentStatus, () => {
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
            cy.wait(10000);

            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains("First Review");
          });

          it(test.GenerateQuestion, { tags: "@smoke" }, () => {
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
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.GenerateQuestion)
              .click();
            cy.wait(40000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains(test.FinalStatus);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Subtask)
              .should("have.length", "3");
          });

          it(test.ReopenWorkflow, { tags: "@smoke" }, () => {
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
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.SubtaskLink)
              .click();
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Reopenbtn)
              .click();
            cy.wait(40000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains(test.CompleteStatus);
          });

          it(test.RejectWorkflow, { tags: "@smoke" }, () => {
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
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.SubtaskLink)
              .click();
            cy.wait(15000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Rejectbtn)
              .click();
            cy.wait(40000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains("New");
          });

          it(test.CEOAssessment, { tags: "@smoke" }, () => {
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
              .find(locators.cms.template.SOXLink)
              .click();
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.template.TemplateLink)
              .invoke("removeAttr", "target")
              .click();
            cy.wait(10000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.AccessDenied)
              .should("be.visible");
          });

          it("Cancel Workflow", { tags: "@smoke" }, () => {
            cy.visit(Cypress.config("baseUrl"));
            cy.login(
              Cypress.env("soxusername"),
              Cypress.env("soxpassword"),
              Cypress.env("soxkey")
            );

            sox.SoxMenu();
            cy.wait(15000);
            sox.EnterSummary(SoxPre.SummarywithMandatory);
            sox.AssignToMe();
            sox.SelectOG();

            sox.CreateBtn();

            cy.wait(3000);
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

            cy.wait(15000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Cancelbtn)
              .click();
            cy.wait(20000);
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.Status)
              .contains("Closed");
            cy.switchIframe(locators.cms.ATask.frameId)
              .find(locators.cms.soxWorkflow.ChildStatus)
              .should("have.text", "Closed, Cannot/Will Not complete");
          });
        });
      }
    );
  }
);
