import locators from "../../../../fixtures/locators.json";
import KXIRegularTasks from "../../../../fixtures/KXIModule/KXIRegularTasks.json";
export default class KXIRegularTaskSummary {
  waitForTaskSummaryPageToAppear() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.contains("label", KXIRegularTasks.labelTaskTypeValue, {
        timeout: 50000,
      })
        .scrollIntoView()
        .should("exist");
    });
  }
  waitForUpdateTaskSummaryPageToAppear(kxiName) {
    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.get(
        locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
          .linkedKXISectionLabel,
        { timeout: 50000 }
      )
        .contains(KXIRegularTasks.linkedKXI)
        .should("exist")
        .and("be.visible")
        .scrollIntoView();
      cy.contains("label", kxiName, {
        timeout: 50000,
      })
        .should("exist")
        .click();
    });
  }

  verifyTaskAndStatusOfRegularTaskDecision() {
    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      this.verifyLabelsOfRegularTaskSummary();
      this.verifyStatusInProgressOnClickingStartProgressButton();
      this.verifyStatusOpenOnClickingStopProgressButton();
      this.verifyStatusCloseOnClickingCloseButton();
      this.verifyStatusReopenOnClickingReopenButton();
      this.verifyStatusClosedWhenStatusOpen();
    });
  }

  verifyChangedAssignee() {
    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      const labels = KXIRegularTasks.newAssignee;

      this.getElemnt();
      cy.contains("label", labels, { timeout: 50000 }).should("exist");
    });
  }
  waitForGridLoad() {
    const decisionGridUrl = Cypress.env("DECISION_GRID_LOAD");
    const actualUrl =
      typeof decisionGridUrl === "function"
        ? decisionGridUrl()
        : decisionGridUrl;
    cy.log("Setting up intercept for URL:", actualUrl);

    // Use a more flexible pattern to catch the request
    cy.intercept(
      "POST",
      "**/API/ReportViewService/js/GetGridViewResultData**"
    ).as("decision");

    cy.wait("@decision", { timeout: 100000 }).then((interception) => {
      cy.log("Request intercepted:", interception);
      expect(interception.response.statusCode).to.eq(200);
    });
  }

  waitForFormLoad() {
    // Set up intercept and log the URL being used
    const decisionFormUrl = Cypress.env("DECISION_API_FORMLOAD");
    const actualUrl =
      typeof decisionFormUrl === "function"
        ? decisionFormUrl()
        : decisionFormUrl;
    cy.log("Setting up intercept for URL:", actualUrl);

    // Use a more flexible pattern to catch the request
    cy.intercept("POST", "**/API/FormService/js/FormLoadComplete**").as(
      "decision"
    );

    cy.wait("@decision", { timeout: 100000 }).then((interception) => {
      cy.log("Request intercepted:", interception);
      expect(interception.response.statusCode).to.eq(200);
    });
  }

  shouldVerifyLinkedKXIDefinition(kxiDefinition) {
    this.waitForFormLoad(); // wait for form load in decision
    this.waitForGridLoad(); // wait for grid load in decision for locating elements
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.get(
        locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
          .linkedKXISectionLabel
      )
        .contains(KXIRegularTasks.linkedKXI)
        .should("exist")
        .and("be.visible")
        .scrollIntoView();
      cy.get(
        locators.kxi.kxiData.kxiRegularTask.kxiRegularTaskSummary
          .linkedKXIDefinitionLink
      )
        .scrollIntoView()
        .should("be.visible");
    });
  }

  shouldClicksOnKxiDefinitionLink() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.url().then((initialUrl) => {
        // Extract query parameters
        const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
        // Extract 'kxiDefId' from the URL
        const dynamicKriDefinitionId = urlParams.get("kxiDefId");

        const newUrl = `https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid?kriDefinitionId=${dynamicKriDefinitionId}`;

        cy.visit(newUrl);
      });
    });
  }

  shouldClicksOnEnterDataLink() {
    cy.switchIframe(locators.kxi.kxiData.kxiRegularTask.iFrameID).within(() => {
      cy.url().then((initialUrl) => {
        // Extract query parameters
        const urlParams = new URLSearchParams(initialUrl.split("?")[1]);
        // Extract 'kxiDefId' from the URL
        const dynamicKriDefinitionId = urlParams.get("kxiDefIds");

        const newUrl = `https://qa2.360factors.com/predict360/web/kriDataManagment/kriDataGrid?kriDefinitionIds=${dynamicKriDefinitionId}`;

        cy.visit(newUrl);
      });
    });
  }

  verifyLabelExistance(labelLocators) {
    labelLocators.forEach((label) => {
      cy.contains("label", label, { timeout: 200000 })
        .scrollIntoView()
        .should("exist");
    });
  }

  performActionAndVerifyStatus(buttonLabel, expectedLabel) {
    cy.contains("button", buttonLabel, { timeout: 200000 }).as("button");
    cy.get("@button").scrollIntoView().click({ force: true });
    cy.contains("label", expectedLabel, { timeout: 50000 })
      .scrollIntoView()
      .should("exist");
  }

  verifyLabelsOfRegularTaskSummary() {
    const labels = [
      KXIRegularTasks.labelTaskTypeValue,
      KXIRegularTasks.labelStatusNewValue,
      KXIRegularTasks.labelAssigneeTypeValue,
      KXIRegularTasks.labelPriorityValue,
      KXIRegularTasks.labelCategoryValue,
    ];
    this.getElemnt();
    this.verifyLabelExistance(labels);
  }

  getElemnt() {
    const elememtUrl = Cypress.env("DECISION_API_GETALLMESSAGES");
    const actualUrl =
      typeof elememtUrl === "function" ? elememtUrl() : elememtUrl;
    cy.log("Setting up intercept for URL:", actualUrl);

    // Use a more flexible pattern to catch the request
    cy.intercept(
      "POST",
      "**/API/TranslationService/js/GetAllHelpMessages**"
    ).as("decision");

    cy.wait("@decision", { timeout: 50000 }).then((interception) => {
      cy.log("Request intercepted:", interception);
      expect(interception.response.statusCode).to.eq(200);
    });
  }
  verifyStatusInProgressOnClickingStartProgressButton() {
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelStartProgressButtonLabel,
      KXIRegularTasks.labelStatusInProgressValue
    );
  }

  verifyStatusOpenOnClickingStopProgressButton() {
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelStopProgressButtonLabel,
      KXIRegularTasks.labelStatusOpenValue
    );
  }

  verifyStatusCloseOnClickingCloseButton() {
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelStartProgressButtonLabel,
      KXIRegularTasks.labelStatusInProgressValue
    );

    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelCloseButtonLabel,
      KXIRegularTasks.labelStatusCloseValue
    );
  }

  verifyStatusReopenOnClickingReopenButton() {
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelReopenButtonLabel,
      KXIRegularTasks.labelStatusInProgressValue
    );
  }

  verifyStatusClosedWhenStatusOpen() {
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelStopProgressButtonLabel,
      KXIRegularTasks.labelStatusOpenValue
    );
    this.performActionAndVerifyStatus(
      KXIRegularTasks.labelCloseButtonLabel,
      KXIRegularTasks.labelStatusCloseValue
    );
  }
}
