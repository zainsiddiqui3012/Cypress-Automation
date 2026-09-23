import locators from "../../../fixtures/locators.json";
class PredictMenu_PO {
  menuClick() {
    cy.get("#leftMenuBtn", { timeout: 30000 }).click();
  }

  clickOnMyTaxonomiesTab() {
    cy.get("#row-tabs > ul > li:nth-child(2) > a").click();
    cy.wait(5000);
  }

  ///****Click Risk Taxonomy none Space Screen */
  riskTaxonomyClickNoneSpace() {
    cy.get('a[href="/predict360/web/riskTaxonomy/riskTaxonomyGrid"]').click();
    cy.wait(10000);
  }

  administrationModuleClickold() {
    cy.get(
      ".navbar > :nth-child(1) > :nth-child(10) > :nth-child(1) > span",
    ).click();
  }

  administrationModuleClick() {
    cy.get("i.la-wrench").parentsUntil("li").click();
  }

  adminModule() {
    cy.get(".navbar .dropdown:nth-of-type(10) > [href] span")
      .should("be.visible")
      .click();
  }

  adminModuleCPTL() {
    cy.get("nav > ul > li:nth-of-type(6)").should("be.visible").click();
  }

  adminModuleGWYD() {
    cy.get("i.la-wrench").should("be.visible").parentsUntil("li").click();

    cy.get(":nth-child(1) > :nth-child(7) > :nth-child(1)").click({
      multiple: true,
      force: true,
    });
  }

  adminModuleCPDEMO() {
    cy.get(".navbar ul:nth-child(1) > .dropdown:nth-of-type(5) > [href]")
      .should("be.visible")
      .click();
  }

  customerProfileClick() {
    cy.get(".navbar > ul > .dropdown > ul > li:nth-of-type(10) span")
      .should("be.visible")
      .click();
  }

  customerProfileCPTL() {
    cy.get("li:nth-of-type(6) > ul > li:nth-of-type(8) > a")
      .should("be.visible")
      .click();
  }
  customerProfileCPDEMO() {
    cy.get("li:nth-of-type(5) > ul > li:nth-of-type(10) > a")
      .should("be.visible")
      .click();
  }

  customerProfileGWYD() {
    cy.get('a[href="/predict360/manage.do?method=preference"]')
      .should("be.visible")
      .click();
  }

  cmsAdministrationModuleClick() {
    cy.get('[style="display: block;"] > :nth-child(1) > a > span').click();
  }

  activitiesAndTasksClick() {
    cy.get(".navbar").contains("Activities & Tasks").click();
  }

  advanceSearch() {
    cy.findInIframe("#mytarget", "a#search_links_filter_link").click();
    cy.wait(30000);
  }
  assessmentModuleClick() {
    cy.get(
      ".navbar li:nth-of-type(8) > ul:nth-child(2) > li:nth-of-type(1) > [href] span",
    ).click();
  }

  questionBankModuleClick() {
    cy.get("li:nth-of-type(8) > ul  ul > .dropdown > a > span").click();
  }

  myquestionBankModuleClick() {
    cy.get(
      "li:nth-of-type(8) > ul  ul  ul > li:nth-of-type(1) > a > span",
    ).click();
  }

  usersScreenClick() {
    cy.get('[style="display: block;"] > :nth-child(6) > a > span').click();
    cy.screenshot();
  }

  ///****Risk Menu Click */
  riskAndControlRegisterClick() {
    cy.get("span:contains(Risk and Control Register)").click();
  }
  ///****Risk Administration */
  riskAdministrationClick() {
    cy.get(
      '[style="display: block;"] > .dropdown > [href="javascript:void(0)"] > span',
    )
      .should("be.visible")
      .click();
    cy.wait(1000);
  }
  ///****Risk and Process Menu */
  riskAndProcessTaxonomyClick() {
    cy.get("a:contains(Risk And Process Taxonomies)").click();
  }

  ///****Risk New Screen */
  riskTaxonomyClick() {
    cy.get(
      'a[href="/predict360/web/risk-control-taxonomy/load-mytaxonomy"]',
    ).click();
    cy.wait(10000);
  }

  // ///****Risk Register Click */
  riskRegitserClick() {
    cy.get("a:contains(Risk Register)").should("be.visible").click();
    cy.wait(30000);
  }

  // ///****Risk Register Click */
  riskRegitser2Click() {
    cy.get('[style="display: block;"] > :nth-child(2) > a > span').click();
    cy.wait(30000);
  }

  ///****Process Category tab Click */
  processTabClick() {
    cy.get(":nth-child(2) > .nav-link").click();
  }

  businessAreaClick() {
    cy.get(
      "#mCSB_5_container > nav > ul > li.dropdown.open > ul > li:nth-child(13) > a > span",
    ).click();
  }

  ///** save button */
  savebutton() {
    cy.get("#saveBtn").click();
  }

  ///** Control Taxonomy menu click */
  controlTaxonomyClick() {
    cy.get(
      'a[href="/predict360/manageRiskRegisterControlItem.do?method=listRiskRegisterControlItems"]',
    )
      .should("be.visible")
      .click();
    cy.wait(8000);
  }

  ///** Event Types menu click */
  eventtypesClick() {
    cy.get("a:contains(Event Types)").click();
  }

  controlTypesClick() {
    cy.get("a:contains(Control Types)").click();
  }

  riskEventsClick() {
    cy.get("a:contains(Risk Events)").click({ force: true });
  }

  controlOperationClick() {
    cy.get("a:contains(Control Operations)").click();
  }

  controlDefinitionCategoriesClick() {
    cy.get("a:contains(Control Definition Categories)").click();
    cy.wait(5000);
  }

  riskanalysisDimensionsClick() {
    cy.get("a:contains(Risk Analysis Dimensions)").click();
    cy.wait(4000);
  }

  riskanalysisDimensions_ImpactDimensionsTab_Click() {
    cy.get("a:contains(Impact Dimensions)").click();
    cy.wait(3000);
  }
  Impact;

  defaultAssessmentsClick() {
    cy.get("a:contains(Default Assessments)").click();
    cy.wait(5000);
  }

  instructionTemplateClick() {
    cy.get("a:contains(Instruction Template)").click();
  }

  tasksDropdownClick() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe").find("#my_bfsi_Event").trigger("mouseover");
    cy.wait(10000);
  }
  assessmentSelectClick() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe").find("#assessment-link").click();
  }

  incidentDropdownClick() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe").find("#my_bfsi_incident").trigger("mouseover");
    cy.wait(500);
  }

  complaintSelectClick() {
    cy.visit(
      "https://stage.360factors.com/casemanagement/secure/CreateIssue!default.jspa?issuetype=11000",
    );
  }
  clickOnMyTaxonomiesTab() {
    cy.get("#row-tabs > ul > li:nth-child(2) > a").click();
    cy.wait(5000);
  }
  ///****Click Risk Taxonomy none Space Screen */
  riskTaxonomyClickNoneSpace() {
    cy.get('a[href="/predict360/web/riskTaxonomy/riskTaxonomyGrid"]').click();
    cy.wait(10000);
  }
  issueManagementClick() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.get("@iframe").find("#issue_management_link_lnk").click();
  }

  riskLibrariesTab() {
    cy.get('a[href="/predict360/web/risk-control-taxonomy/load-grid"]').click();
    cy.wait(5000);
  }
  riskLibrariesTab() {
    cy.get('a[href="/predict360/web/risk-control-taxonomy/load-grid"]').click();
    cy.wait(5000);
  }

  openIssueDashboard() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.contains(locators.menu.complianceManagement).click({ force: true });
    cy.contains(locators.menu.issueManagement).click({ force: true });
    cy.contains(locators.menu.issueDashboard).click({ force: true });
  }
  openIssueAdministration() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.contains(locators.menu.complianceManagement).click({ force: true });
    cy.contains(locators.menu.issueManagement).click({ force: true });
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.wait(2000);
  }
  openIssueSources() {
    cy.contains(locators.menu.issueSources).click({ force: true });
    cy.waitForElementToVisible(
      locators.issueManagement.administration.issueSources.addBtn,
      30000,
    );
  }
  openIssueTypes() {
    cy.contains(locators.menu.issueTypes).click({ force: true });
    cy.waitForElementToVisible(
      locators.issueManagement.administration.issueSources.addBtn,
      30000,
    );
  }
  openRootCauseModule() {
    cy.contains(locators.menu.rootCause).click({ force: true });
    cy.waitForElementToVisible(
      locators.issueManagement.administration.issueSources.addBtn,
      30000,
    );
  }
  openSeverityModule() {
    cy.contains(locators.menu.severity).click({ force: true });
    cy.waitForElementToVisible(
      locators.issueManagement.administration.issueSources.addBtn,
      30000,
    );
  }
  openEntitiesModule() {
    cy.contains(locators.menu.entities).click({ force: true });
    cy.waitForElementToVisible(
      locators.issueManagement.administration.issueSources.addBtn,
      30000,
    );
  }
  openRegulationsAndObligations() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.contains(locators.menu.regulations).click({ force: true });
    cy.wait(1000);
  }
  openInventory() {
    cy.contains(locators.menu.inventory).click({ force: true });
    cy.wait(1000);
  }
  openRegCategories() {
    this.openRegulationsAndObligations();
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.wait(1000);
    cy.contains(locators.menu.regCategories).click({ force: true });
  }
  openBusinessArea() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.waitForElementToVisible(locators.menu.administrationText, 5000);
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.waitForElementToVisible(locators.menu.businessArea, 5000);
    cy.get(locators.menu.businessArea).click({ force: true });
  }

  openOrganizationHierarchy() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.waitForElementToVisible(locators.menu.administrationText, 5000);
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.waitForElementToVisible(locators.menu.organizationalHierarchy, 5000);
    cy.get(locators.menu.organizationalHierarchy).click({ force: true });
  }
  openUsers() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.waitForElementToVisible(locators.menu.administrationText, 5000);
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.waitForElementToVisible(locators.menu.usersText, 5000);
    cy.contains(locators.menu.usersText).click({ force: true });
    cy.waitForElementToVisible(locators.administration.users.addUserBtn, 30000);
  }
  openCustomerProfile() {
    cy.get(locators.leftMenuBtn).click({ force: true });
    cy.waitForElementToVisible(locators.menu.administrationText, 5000);
    cy.contains(locators.menu.administrationText).click({ force: true });
    cy.waitForElementToVisible(locators.menu.customerProfile, 5000);
    cy.contains(locators.menu.customerProfile).click({ force: true });
  }
  clickOnMyTaxonomiesTab() {
    cy.get("#row-tabs > ul > li:nth-child(2) > a").click();
    cy.wait(5000);
  }

  ///****Click Risk Taxonomy none Space Screen */
  riskTaxonomyClickNoneSpace() {
    cy.get('a[href="/predict360/web/riskTaxonomy/riskTaxonomyGrid"]').click();
    cy.wait(10000);
  }
  ///*** Click KXI Management on Customer Space */
  kxiMenuClick(menuName) {
    cy.contains(menuName).should("be.visible").click();
  }
}

export default PredictMenu_PO;
