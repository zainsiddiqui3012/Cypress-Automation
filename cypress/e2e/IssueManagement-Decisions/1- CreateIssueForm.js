import IssueForm_PO from "../../support/POM/IssueManagement_PO/IssueForm";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import IssueDashboard from "../../support/POM/IssueManagement_PO/IssueDashboard";
import OrganizationalHierarchy from "../../support/POM/Administration/OrganizationHierarchy";
import IssueSummaryView from "../../support/POM/IssueManagement_PO/IssueSummaryView";
import CustomerProfile from "../../support/POM/Administration/CustomerProfile";

const createIssue = new IssueForm_PO();
const sideMenu = new PredictMenu_PO();
const dashboard = new IssueDashboard();
const department = new OrganizationalHierarchy();
const summaryView = new IssueSummaryView();
const customerProfile = new CustomerProfile();

describe("Functional Test Suite", () => {
  let issueData;
  beforeEach(function () {
    cy.fixture('IssueManagementDecisions/CreateIssue').then((data) => {
      issueData = data;
    });
    cy.visit(Cypress.config("baseUrl"));
    cy.login(
      Cypress.env("issueUsername"),
      Cypress.env("issuePassword"),
      Cypress.env("issueKey")
    );
  })
  it("Create the form by filling mandatory fields from all the tabs", () => {
    createIssue.createIssueMandatoryFields(issueData);
  })

  it("Create the form by filling all the fields from all the tabs with unique summary text", () => {
    createIssue.createIssueWithUniqueSummaryText(issueData);
  })

  it("Test the data for the Issue Source on the Issue form", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openIssueSources();
    createIssue.verifyIssueSourceData();
  })

  it("Test the data for the Root Cause on the Issue form", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openRootCauseModule();
    createIssue.verifyRootCauseData();
  })
  it("Test the data for the Issue Types on the Issue form", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openIssueTypes();
    createIssue.verifyIssueTypeData();
  });
  it("Test the data for the Severity on the Issue form", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openSeverityModule();
    createIssue.verifySeverityData();
  });
  it("Check if the multi-select and remove buttons work correctly for the Regulator/Agency dropdown", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openEntitiesModule();
    createIssue.checkAgencyDataMultiSelectAndRemoveBtns();

  });

  // put assertion to verify multi selected agency data on the summary view
  it("Verify if multiple selected options for regulator/agency dropdown appear correctly on the summary view", () => {
    sideMenu.openIssueAdministration();
    sideMenu.openEntitiesModule();
    createIssue.verifyAgencyDataOnIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData);
    createIssue.typeAssignee(issueData.mandatory.assignee)
    createIssue.typeReporter(issueData.mandatory.reporter)
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();

    summaryView.waitForEditBtn();
    // put assertion below

  });

  it("Test the data for the subject area dropdown", () => {
    createIssue.verifySubjectAreaData();
  });

  it("Test the data for the Business Area field", () => {
    createIssue.verifyBusinessAreaData();
  });


  it("Test the data for organizational hierarchy dropdown on the issue form", () => {
    sideMenu.openOrganizationHierarchy();
    department.clickAddBtn();
    department.fillAndSubmitAddBUForm();
    createIssue.verifyDepartmentOnIssueForm();
  });

  // add assertion to ensure that value in issue dropdown contains text 'Inactive'
  it("Test the new active/inactive users on the issue form", () => {
    createIssue.verifyUsersOnIssueForm();
  });

  it("Test string textboxes with the special characters and digits", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillFormWithAllStringFields(issueData, issueData.specialCharacters);
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();
  });

  //put assertion here to check for error on blank string fields
  it("Test the string textbox fields with spaces only", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillFormWithAllStringFields(issueData, issueData.spaces);
    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    //put assertion below


  });

  //put assertion for incorrect length error
  it("Test the string textboxes with incorrect length", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillStringBoxesWithLength(issueData, issueData.stringIncorrectLength)
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();

  });

  //put assertion for incorrect length error
  it("Test the string richtextArea boxes with incorrect length", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.extendedSeverity);
    createIssue.enterDescWithCharLength(issueData.incorrectLength);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);

    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    //add assertion below to ensure incorrect length error

    createIssue.clickSummaryTab();
    createIssue.removeCharacterDesc();
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();

  });

  //Assertion needs to be added for incorrect length error
  it("Test numeric textboxes with incorrect and negative values", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.extendedSeverity);
    createIssue.typeDescriptionText(issueData.mandatory.description);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);

    createIssue.typeActualLoss(issueData.numericValues.string);
    createIssue.typePotentialLoss(issueData.numericValues.string);
    createIssue.typeNoOfCustomersImpacted(issueData.numericValues.string);

    createIssue.verifyNumericFieldsData(0, 0);

    createIssue.typeActualLoss(issueData.numericValues.negative);
    createIssue.typePotentialLoss(issueData.numericValues.negative);
    createIssue.typeNoOfCustomersImpacted(issueData.numericValues.negative);

    createIssue.verifyNumericFieldsData(0, 0);

    createIssue.typeActualLoss(issueData.numericValues.float);
    createIssue.typePotentialLoss(issueData.numericValues.float);
    createIssue.typeNoOfCustomersImpacted(issueData.numericValues.floatRoundOff);

    createIssue.verifyNumericFieldsData(0, 1);

    createIssue.typeActualLoss(issueData.numericValues.large);
    createIssue.typePotentialLoss(issueData.numericValues.large);
    createIssue.typeNoOfCustomersImpacted(issueData.numericValues.large);

    createIssue.verifyNumericFieldsData(issueData.numericValues.max, issueData.numericValues.max);
    createIssue.clickCreateBtn();
    //add assertion below for incorrect character length error


    summaryView.waitForEditBtn();

  });

  //assertion needs to be changed to cater new change
  it("Test date fields with the incorrect values", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.clickDatesTab();
    createIssue.typeIdentificationDate(issueData.date.string);
    createIssue.typeEventOccurence(issueData.date.incorrectFormat);
    createIssue.typeReportDate(issueData.date.incorrectFormat1);
    createIssue.typeDueDate(issueData.date.incorrectFormat2);

    //assertion needs to be changed
    createIssue.verifyBlankDateFields();

  })
  it("Test date fields with past values", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.extendedSeverity);
    createIssue.typeDescriptionText(issueData.mandatory.description);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.clickDatesTab();

    createIssue.typeIdentificationDate(issueData.date.pastValue);
    createIssue.typeEventOccurence(issueData.date.pastValue);
    createIssue.typeReportDate(issueData.date.pastValue);
    createIssue.typeDueDate(issueData.date.pastValue);
    createIssue.typeRemediationTargetDate(issueData.date.pastValue);

    createIssue.clickDetailsTab();
    createIssue.typeOwnerText(issueData.mandatory.owner);
    createIssue.checkNoRadio();
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();

  });

  it("Test date fields with future values", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.extendedSeverity);
    createIssue.typeDescriptionText(issueData.mandatory.description);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.clickDatesTab();

    createIssue.typeIdentificationDate(issueData.date.futureValue);
    createIssue.typeEventOccurence(issueData.date.futureValue);
    createIssue.typeReportDate(issueData.date.futureValue);
    createIssue.typeDueDate(issueData.date.futureValue);
    createIssue.typeRemediationTargetDate(issueData.date.futureValue);

    createIssue.clickDetailsTab();
    createIssue.typeOwnerText(issueData.mandatory.owner);
    createIssue.checkNoRadio();
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();

  });

  it("Test if the read-only fields are disabled", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.typeSeverity(issueData.mandatory.extendedSeverity);
    createIssue.clickDatesTab();

    createIssue.verifyDisabledFields();

  });
  it("Switch between Simple and Extended Severity dropdown option and verify the presence of certain fields", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.typeSeverity(issueData.mandatory.severity);
    createIssue.verifyApproverInvisibility();
    createIssue.verifyDescriptionInvisibility();
    createIssue.verifyBusinessAreaInvisibility();

    createIssue.clickDatesTab();
    createIssue.verifyEventOccurrenceInvisibility();
    createIssue.verifyDueDateInvisibility();
    createIssue.verifyContainmentDateInvisibility();
    createIssue.verifyRemediationTargetDateInvisibility();
    createIssue.verifyRemediationDateInvisibility();

    createIssue.clickDetailsTab();
    createIssue.verifyRootCauseDescInvisibility();
    createIssue.verifyRootCauseInvisibility();

    createIssue.verifyActualLossInvisibility();
    createIssue.verifyPotentialLossInvisibility();
    createIssue.verifyImpactedControlInvisibility();
    createIssue.verifyCustomersImpactedInvisibility();
    createIssue.verifyNoOfCustomerImpactedInvisibility();

    createIssue.clickSummaryTab();
    createIssue.typeSeverity(issueData.mandatory.extendedSeverity);
    cy.wait(2000);
    createIssue.verifyApproverVisibility();
    createIssue.verifyDescriptionVisibility();
    createIssue.verifyBusinessAreaVisibility();

    createIssue.clickDatesTab();
    createIssue.verifyEventOccurrenceVisibility();
    createIssue.verifyDueDateVisibility();
    createIssue.verifyContainmentDateVisibility();
    createIssue.verifyRemediationTargetDateVisibility();
    createIssue.verifyRemediationDateVisibility();

    createIssue.clickDetailsTab();
    createIssue.verifyRootCauseDescVisibility();
    createIssue.verifyRootCauseVisibility();

    createIssue.scrollToPotentialLoss();
    createIssue.verifyActualLossVisibility();
    createIssue.verifyPotentialLossVisibility();
    createIssue.verifyImpactedControlVisibility();
    createIssue.verifyCustomersImpactedVisibility();
    createIssue.verifyNoOfCustomerImpactedVisibility();

  });

  it("Test the presence/absence of owner dropdown on the issue form after checking/unchecking the relevant checkbox from Users screen", () => {

    sideMenu.openCustomerProfile();
    customerProfile.checkIssueOwnerCheckbox();
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.clickDetailsTab();
    createIssue.verifyOwnerTextboxInvisibility();
    createIssue.verifyOwnerDropdownVisibility();

    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    createIssue.verifyErrorMessage(issueData.errors.ownerDropdown);

    sideMenu.openCustomerProfile();
    customerProfile.unCheckIssueOwnerCheckbox();
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.clickDetailsTab();
    createIssue.verifyOwnerTextboxVisibility();
    createIssue.verifyOwnerDropdownInvisibility();

    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    createIssue.verifyErrorMessage(issueData.errors.owner);

  });
  it("Test the default behavior and visibility of linked Items field depending on the Repeat Finding checkbox", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.clickDetailsTab();

    createIssue.verifyLinkedItemBtnInvisibility();
    createIssue.checkYesRadio();
    createIssue.verifyLinkedItemBtnVisibility();
    createIssue.checkNoRadio();
    createIssue.verifyLinkedItemBtnInvisibility();
    createIssue.checkYesRadio();
    createIssue.verifyLinkedItemBtnVisibility();

  });


  it("Test creating issue form by not linking any items when the Repeat Finding radio box is checked", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.clickDatesTab();
    createIssue.typeIdentificationDate(issueData.mandatory.pastDate);
    createIssue.clickDetailsTab();
    createIssue.typeOwnerText(issueData.mandatory.owner);
    createIssue.checkYesRadio();
    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    createIssue.verifyErrorMessage(issueData.errors.linkItems);
  });

  // incomplete -> verify email address for correct recepient
  it("Test creating the issue form by defining incorrect and correct email address in the notify field", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.typeNotify(issueData.emails.multipleValidAndInvalid);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();

    summaryView.waitForEditBtn();


  });
  it("Create Issue form without defining assignee or issue process owner", () => {

    sideMenu.openCustomerProfile();
    customerProfile.removeProcessOwnerUser();
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();

    createIssue.hoverOverCreateBtn();
    createIssue.verifyErrorMessage(issueData.errors.assignee);


  });

  it("Define Issue Process Owner but leave the assignee field blank and create issue form", () => {
    sideMenu.openCustomerProfile();
    customerProfile.defineIssueProcessOwner(issueData.processOwner);
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();

    summaryView.waitForEditBtn();
    summaryView.verifyAssignee(issueData.verifyProcessOwner);

  });

  it("Define both Issue Process Owner and assignee on the issue form and verify the reflection of the correct assignee on the summary view", () => {
    sideMenu.openCustomerProfile();
    customerProfile.defineIssueProcessOwner(issueData.processOwner);
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee)
    createIssue.typeReporter(issueData.mandatory.reporter)
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();

    summaryView.waitForEditBtn();
    summaryView.verifyAssignee(issueData.mandatory.assignee);

  });

  it("Test the visibility of Assignee and Group Assignee fields dependent on the Assignee Type field", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.verifyGroupAssigneeInvisibility();
    createIssue.verifyAssigneeVisibility();

    createIssue.checkGroupRadio();

    createIssue.verifyGroupAssigneeVisibility();
    createIssue.verifyAssigneeInvisibility();

    createIssue.checkSingleRadio();

    createIssue.verifyGroupAssigneeInvisibility();
    createIssue.verifyAssigneeVisibility();

  });
  //put assignee assertion on the summary view form as well
  it("Test if the Assign to Me button gets the correct logged in user ", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.clickAssignToMeBtn();

    createIssue.hoveOverUserProfile();
    createIssue.verifyAssigneeWithLoggedInUser();

    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();
    //add assertion here

  });

  it("Click on the cancel button with and without filling any fields on the form", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.clickCancelBtn();
    cy.wait(5000);

    dashboard.openIssueForm();
    createIssue.typeSummary(issueData.mandatory.summary);
    createIssue.clickCancelBtn();
    cy.wait(5000);

    dashboard.openIssueForm();
    createIssue.typeSeverity(issueData.mandatory.severity);
    createIssue.clickCancelBtn();
    cy.wait(5000);

    dashboard.openIssueForm();
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.clickCancelBtn();
    cy.wait(5000);

    dashboard.openIssueForm();
    createIssue.clickDatesTab();
    createIssue.typeIdentificationDate(issueData.mandatory.pastDate);
    createIssue.clickCancelBtn();
    cy.wait(5000);


  });

  it("Create the form leaving all the mandatory fields blank", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();

    createIssue.verifyErrorMessage(issueData.errors.repeatFinding);
    createIssue.verifyErrorMessage(issueData.errors.issueSource);
    createIssue.verifyErrorMessage(issueData.errors.severity);
    createIssue.verifyErrorMessage(issueData.errors.department);
    createIssue.verifyErrorMessage(issueData.errors.owner);
    createIssue.verifyErrorMessage(issueData.errors.identificationDate);
    createIssue.verifyErrorMessage(issueData.errors.summary);
    createIssue.verifyErrorMessage(issueData.errors.submitter);
    createIssue.verifyErrorMessage(issueData.errors.description);

  });
  it("Create the form by filling mandatory fields only from the summary tab", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.clickCreateBtn();
    createIssue.hoverOverCreateBtn();
    createIssue.verifyErrorMessage(issueData.errors.identificationDate);
    createIssue.verifyErrorMessage(issueData.errors.repeatFinding);
    createIssue.verifyErrorMessage(issueData.errors.owner);
  });
  // add assertion for correct assignee on the summary view form
  it("Select a different assignee user than what is defined in the customer profile and create the form", () => {

    sideMenu.openCustomerProfile();
    customerProfile.defineIssueProcessOwner(issueData.processOwner);
    customerProfile.clickSaveButton();

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();
    //add assertion here

  });

  // Incomplete -> needs to add script for verifying email
  it("Test if the notify users receive the email after form creation", () => {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.typeAssignee(issueData.mandatory.assignee);
    createIssue.typeReporter(issueData.mandatory.reporter);
    createIssue.typeNotify(issueData.emails.multipleCorrect);

    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();
    //add code below for verifying email

  });
  it("Test creating the issue form with the group assignee", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.fillSummaryTabWithoutAssignee(issueData, issueData.mandatory.severity);
    createIssue.defineGroupAssignee(issueData);
    createIssue.fillDatesAndDetailsMandataroyFields(issueData);
    createIssue.clickCreateBtn();
    summaryView.waitForEditBtn();
    summaryView.verifyGroupAssignee(issueData.mandatory.groupAssignee);

  });

  //incomplete test case
  it("Test the View and Download buttons for Documents plugin", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.checkViewAndDownloadDocumentButtons(issueData.documentTitle, issueData.downloadedFile);

  });
  //bug and incomplete test case
  it("Verify the titles and data of Requirements/Risks popups", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.validateRequirementsAndRiskData(issueData.requirementTitle, issueData.riskTitle);

  });
  it("Reporter should have the logged in user selected by default", () => {

    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    createIssue.verifyReporterName();
  });
})

//test case for linked items
//test case for mandatory field check when owner field is a dropdown
//test case when both proces owner and assignee are defined
//add cases for documents/requirements/risks and that uploaded documents save in the correct folder
// on the DMS
//verify multiple values for regulator and agency on the summary view
//change user/group name and see the effect on the form
//adding new vendor and test it's reflection on the create
