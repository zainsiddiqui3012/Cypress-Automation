import { TIMEOUT } from "dns";
import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";

export default class SOXCreation_PO {
  SoxMenu() {
    cy.get(locators.leftMenuBtn).click();
    cy.get(locators.menu.ComplianceManagement).click({
      multiple: true,
      force: true,
    });
    cy.get(locators.cms.ActivitiesTasks).click({ force: true });
    cy.waitForTopMsgLoaderToDisappear(50000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.ATask.Task, { timeout: 150000 })
      .trigger("mouseover");
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.ATask.SoxReview)
      .click();
  }

  EnterSummary(Summary) {
    cy.wait(30000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Summary)
      .type(Summary);
  }

  clearSummary() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Summary)
      .clear();
  }

  SelectOG() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.OGPlus)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.OGExpand)
      .click();

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.expandParent, { timeout: 10000 })
      .click();
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.SelectChild)
      .click();

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Addbtn)
      .click();
  }

  EnterDescription(Description) {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Description)
      .click({ force: true })
      .type(Description, { force: true });
  }

  OtherFields() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.priortyDropdown)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.priortyDropdown)
      .clear()
      .type("Low")
      .type("{Enter}");

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Reporter)
      .clear();
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Reporter)
      .type("Kath");
    cy.wait(3000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Reporter)
      .type("{Enter}");
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.Category)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.SelectCategory)
      .click();
  }

  CreateBtn() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.CreateBtn)
      .click();
  }
  UpdateBtn() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.UpdateBtn)
      .click();
  }

  validateFields(taskType, status, Summary, OH) {
    cy.wait(3000);
    cy.visit(Cypress.config("JiraUrl"));

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(".focused")
      .children()
      .within(() => {
        cy.get(locators.cms.Sox.issueLink).click({ force: true });
      });

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
      .click();
    cy.wait(15000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.TaskType)
      .contains(taskType);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Status)
      .contains(status);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.SummaryText)
      .contains(Summary);
  }
  validateAllFields(
    taskType,
    status,
    Summary,
    OH,
    Reporter,
    Category,
    Priority,
    Description
  ) {
    cy.wait(3000);
    cy.visit(Cypress.config("JiraUrl"));

    cy.waitForTopMsgLoaderToDisappear(40000);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.openJiraTicket)
      .children()
      .within(() => {
        cy.get(locators.cms.Sox.issueLink).click({ force: true });
      });

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.template.SOXParentLink, { timeout: 30000 })
      .click();
    cy.wait(10000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.TaskType)
      .contains(taskType);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Status)
      .contains(status);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.SummaryText)
      .contains(Summary);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Category)
      .contains(Category);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.priority)
      .contains(Priority);
  }

  SelectDateBYDatePicker() {
    const month = "August 2024";
    const day = "26";

    cy.wait(5000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.DueDatePicker)
      .click();

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.NextButton)
      .click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find('div[class="calendar active"] td[class="title"]') // Replace with the actual selector
      .invoke("text")
      .then((text) => {
        if (text.trim() === month) {
          // If the month is correct, select the day
          cy.switchIframe(locators.cms.ATask.frameId)
            .find(`td:contains("${day}")`)
            .click(); // Replace with actual XPath
        } else {
          // If the month is not correct, click the next button and retry
          cy.switchIframe(locators.cms.ATask.frameId)
            .find(locators.cms.Sox.NextButton)
            .click(); // Replace with the actual selector
        }
      });
  }
  SelectSingleAssignee() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.AssigneeDropdown)
      .clear();
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.AssigneeDropdown)
      .type("Admin User 2");
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.AssigneeDropdown)
      .type("{Enter}");
  }

  AssignToMe() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.AssignTome)
      .click();
  }

  SelectGroupAssignee() {
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.groupRadioButton)
      .click({ force: true });
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.GroupIconbtn)
      .click();
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.Sox.SelectGroup)
      .click();
  }

  CustomerProfileClick() {
    cy.get(locators.leftMenuBtn).click();

    cy.get(locators.menu.administration).click();

    cy.get(locators.administration.CustomerProfile).click();
  }

  SelectAssigneeFromCF(assignee, group = false) {
    if (!group) {
      cy.get(locators.administration.CF.SOxSectiondropdown).click();
    } else {
      cy.get("#s2id_soxProcessOwnerGroupId").click();
    }
    cy.get(locators.administration.CF.SOxSectiondropdownsearch)
      .type(assignee)
      .type("{Enter}");
    cy.get(locators.administration.CF.SaveBtn).click();
  }
}
