import locators from "../../../fixtures/locators.json";
import dayjs from "dayjs";
import Assessment from "../../../fixtures/SoxReview/Assessment.json";

export default class Assessment_PO {
  GoToAssessment() {
    cy.wait(10000);
    //cy.switchIframe(locators.cms.ATask.frameId).find(locators.cms.template.TemplateLink).invoke('removeAttr','target').click();
    // cy.wait(10000);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.template.TemplateLink)
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("http")
          ? href
          : `https://stage.360factors.com${href}`;

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.template.TemplateLink)
          .invoke("removeAttr", "target")
          .click();

        cy.wait(10000);
        cy.visit(fullUrl);
      });
  }

  ClickDraft() {
    cy.get(locators.cms.template.DraftButton).click();
    cy.wait(5000);
  }
  fillAssessment() {
    cy.get(locators.cms.template.SelectHigh).click();

    cy.get(locators.cms.template.UploadFile).attachFile("testing2.txt");
  }
  ClickSubmit() {
    cy.get(locators.cms.template.SubmitButton).click();
    cy.wait(2000);
    cy.get(locators.cms.template.SubmitYesButton).click();
    cy.wait(5000);
  }

  ChangeInlineAssignee() {

    cy.wait(20000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Assignee)
      .click();

    // cy.switchIframe(locators.cms.ATask.frameId).find(locators.cms.soxWorkflow.AssigneeIcon).click();
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.AssigneeField, { timeout: 20000 })
      .clear();
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.AssigneeField)
      .type("test");
    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.AssigneeField)
      .type("{Enter}");

    cy.wait(2000);
    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.OKbtn)
      .click();
  }

  GoToResults() {
    cy.wait(10000);
    //cy.switchIframe(locators.cms.ATask.frameId).find(locators.cms.template.TemplateLink).invoke('removeAttr','target').click();
    // cy.wait(10000);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Resultbtn)
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("https")
          ? href
          : `https://stage.360factors.com${href}`;

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Resultbtn)
          .invoke("removeAttr", "target")
          .click();

        cy.wait(10000);
        cy.visit(fullUrl);
      });
  }

  GoToPreview() {
    cy.wait(10000);
    //cy.switchIframe(locators.cms.ATask.frameId).find(locators.cms.template.TemplateLink).invoke('removeAttr','target').click();
    // cy.wait(10000);

    cy.switchIframe(locators.cms.ATask.frameId)
      .find(locators.cms.soxWorkflow.Previewbtn)
      .invoke("attr", "href")
      .then((href) => {
        const fullUrl = href.startsWith("https")
          ? href
          : `https://stage.360factors.com${href}`;

        cy.switchIframe(locators.cms.ATask.frameId)
          .find(locators.cms.soxWorkflow.Previewbtn)
          .invoke("removeAttr", "target")
          .click();

        cy.wait(10000);
        cy.visit(fullUrl);
      });
  }

  GenerateReport() {
    cy.get(locators.cms.soxWorkflow.Reportbtn).click();

    const fileType = "pdf";
    const fileNameSuffix = "-assessment-report";
    cy.get(locators.cms.soxWorkflow.ticketNo).then(($el) => {
      const text = $el.text();
      console.log(text);
      const trimmedTicketNo = text.trim();
      const filePath = `cypress/downloads/${trimmedTicketNo}${fileNameSuffix}.${fileType}`;
      console.log(filePath);

      cy.wait(10000);

      // cy.readFile(filePath,{timeout:20000}).should('exist');
    });
  }
}
