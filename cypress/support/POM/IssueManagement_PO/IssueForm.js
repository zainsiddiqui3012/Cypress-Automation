import locators from "../../../fixtures/locators.json";
import IssueSources_PO from "../IssueManagement_PO/IssueSources";
import IssueDashboard from "./IssueDashboard";
import PredictMenu_PO from "../Menu_PO/PredictMenu_PO";
import RegCategories_PO from "..//Regulations/RegCategories_PO";
import BusinessAreas from "../Administration/BusinessArea";
import Users_PO from "../Administration/Users";
import OrganizationalHierarchy from "../Administration/OrganizationHierarchy";
import Severity_PO from "./Severity_PO";
import IssueSummaryView from "./IssueSummaryView";

const issueSource = new IssueSources_PO();
const sideMenu = new PredictMenu_PO();
const dashboard = new IssueDashboard();
const categories = new RegCategories_PO();
const businessArea = new BusinessAreas();
const users = new Users_PO();
const department = new OrganizationalHierarchy();
const severity = new Severity_PO();
const summaryView = new IssueSummaryView();

export default class IssueForm_PO {

  fieldLocator(name) {
    return cy.contains('label', name).closest('section').next('section')
      .find(locators.issueManagement.createForm.textBoxInput)

  }

  fieldLocatorNotify(name) {
    return cy.contains('label', name).closest('section').next('section')
      .find(locators.issueManagement.createForm.Notify)
  }

  fieldLocatorDescription(name) {
    return cy.contains('label', name).closest('section').next('section')
      .find(locators.issueManagement.createForm.Description)
  }
  fieldLocatorPlugInAddBtn(name) {

    return cy.contains('label', name).closest('section').next('section')
      .find(locators.issueManagement.createForm.plugInBtn);
  }

  clickDatesTab() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

      cy.get(locators.issueManagement.createForm.datesTab).click();
      cy.wait(2000);
    });
  }
  clickSummaryTab() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.summaryTab).click();
      cy.wait(2000);
    });
  }

  clickDetailsTab() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

      cy.get(locators.issueManagement.createForm.details).click();
      cy.wait(2000);
    });
  }

  checkNoRadio() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.noButton).check({ force: true })
        .should("be.checked");
      cy.wait(1000);
    });
  }
  checkYesRadio() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.yesButton).check({ force: true })
        .should("be.checked");
      cy.wait(1000);
    });
  }
  getNoRadio() {
    return cy.get(locators.issueManagement.createForm.noButton);
  }

  clickCreateBtn() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.contains('button', 'Create').scrollIntoView({ block: 'center' }).click({ force: true });
        cy.wait(2000);
      });
    });
  }
  hoverOverCreateBtn() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.contains('button', 'Create').scrollIntoView({ block: 'center' }).trigger('mouseover');
        cy.wait(2000);
      });
    });
  }
  clickCancelBtn() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.contains('button', 'Cancel').click({ force: true })
    });
  }
  getVendor() {
    return this.fieldLocator("Vendor");
  }
  typeVendor(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Vendor").type(value)
    });
  }
  getSummary() {
    return this.fieldLocator("Summary");
  }
  typeSummary(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Summary").type(value);
    });
  }
  getSeverity() {
    return this.fieldLocator("Severity");
  }
  typeSeverity(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Severity").type(value, { force: true });
    })
  }
  typeIssueSource(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Issue Source").type(value, { force: true });
    })
  }
  getIssueSource() {
    return this.fieldLocator("Issue Source");
  }
  getEntity() {
    return this.fieldLocator("Regulator or Agency");
  }
  typeEntity(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Regulator or Agency").type(value, { force: true });
    })
  }
  getDepartment() {
    return this.fieldLocator("Responsible Department");
  }
  typeDepartment(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Responsible Department").type(value, { force: true });
    })
  }
  typeAuditField(value) {

    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Associated Project, Exam, or Audit").type(value, { force: true });
    });
  }
  getRootCause() {
    return this.fieldLocator(/^Root Cause$/);
  }
  typeRootCause(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator(/^Root Cause$/).type(value);
      });
    });
  }
  verifyRootCauseVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

        this.fieldLocator(/^Root Cause$/).should("be.visible");
      });
    });
  }
  verifyRootCauseInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

        this.fieldLocator(/^Root Cause$/).should("not.be.visible");
      });
    });
  }

  clickDocumentsAddBtn() {
    this.fieldLocatorPlugInAddBtn('Document').click();
  }

  clickRequirementsAddBtn() {
    this.fieldLocatorPlugInAddBtn('Requirement').click();
    cy.wait(5000);
  }
  clickRisksAddBtn() {
    this.fieldLocatorPlugInAddBtn('Risk').click();
    cy.wait(5000);
  }
  selectPlugInFirstRecord() {
    cy.waitForElementToVisible(locators.issueManagement.createForm.docsFirstRecord, 60000);
    cy.get(locators.issueManagement.createForm.docsFirstRecord).click();
  }

  clickPopupAddBtn() {
    cy.get(locators.issueManagement.createForm.popupAddBtn).filter(':visible').click();
  }
  clickViewBtn() {
    cy.waitForElementToVisible(locators.issueManagement.createForm.viewBtn, 20000);
    cy.get(locators.issueManagement.createForm.viewBtn).filter(':visible').click();
    cy.waitForElementToVisible(locators.issueManagement.createForm.popupCloseBtn, 20000);
  }
  clickDownloadBtn() {
    cy.get(locators.issueManagement.createForm.downloadBtn).filter(':visible').click();
  }

  verifyFileExists(downloadedFilePath) {
    cy.readFile(downloadedFilePath, { timeout: 30000 }).should((fileContent) => {
      expect(fileContent).to.have.length.greaterThan(0);
    })
  }
  getPopupTitle() {
    cy.waitForElementToVisible(locators.issueManagement.createForm.popupTitle, 60000);
    return cy.get(locators.issueManagement.createForm.popupTitle);
  }

  clickCloseBtn() {
    cy.get(locators.issueManagement.createForm.popupCloseBtn).filter(':visible').click();
  }
  typeNotify(notifier) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.contains('label', 'Notify').closest('section').next().find('textarea')
        .type(notifier);
    });
  }
  getRichTextArea(name) {
    return cy.contains('label', name).closest('section').next('section')
      .find(locators.issueManagement.createForm.richTextAreaIFrame)
      .then((iframe) => {
        return cy.switchIframe(iframe).find('p');
      });
  }
  typeOriginalReport(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Original Report').type(value);
      });
    });
  }
  typeDescriptionText(text) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getRichTextArea('Description').type(text);
    });
  }
  removeCharacterDesc() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getRichTextArea('Description').type('{backspace}');
    });
  }
  verifyDescriptionVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getRichTextArea('Description').should("be.visible");
    });
  }
  verifyDescriptionInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getRichTextArea('Description').should("not.be.visible");
    });
  }
  verifyOwnerTextboxVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.get(locators.issueManagement.createForm.owner).should("be.visible")
      })
    })
  }
  verifyOwnerTextboxInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.get(locators.issueManagement.createForm.owner).should("not.be.visible")
      })
    })
  }
  typeOwnerText(ownerName) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.get(locators.issueManagement.createForm.owner).type(ownerName, { force: true });
      });
    });
  }
  verifyLinkedItemBtnVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.contains('label', 'Linked Item(s)').closest('section').next('section')
          .find('button').should("be.visible");
      })
    });
  }
  verifyLinkedItemBtnInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        cy.contains('label', 'Linked Item(s)').closest('section').next('section')
          .find('button').should("not.be.visible");
      })
    });
  }
  getOwnerDropdown() {
    return cy.get(locators.issueManagement.createForm.ownerDropdown);
  }
  verifyOwnerDropdownVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getOwnerDropdown().should("be.visible");
      });
    });
  }
  verifyOwnerDropdownInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getOwnerDropdown().should("not.be.visible");
      });
    });
  }
  typeRootCauseDesc(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Root Cause Description').type(value);
      });
    });
  }
  verifyRootCauseDescInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Root Cause Description').should("not.be.visible");
      });
    });
  }
  verifyRootCauseDescVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Root Cause Description').should("be.visible");
      });
    });
  }
  getPotentialLoss() {
    return this.fieldLocator("Potential Loss");
  }
  verifyPotentialLossInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Potential Loss").should("not.be.visible");
      });
    });
  }
  verifyPotentialLossVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Potential Loss").should("be.visible");
      });
    });
  }
  scrollToPotentialLoss() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Potential Loss").scrollIntoView();
      });
    });
  }
  verifyActualLossInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Actual Loss").should("not.be.visible");
      });
    });
  }
  verifyActualLossVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Actual Loss").should("be.visible");
      });
    });
  }
  typeActualLoss(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Actual Loss").clear().type(value);
      });
    });
  }
  typePotentialLoss(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Potential Loss").clear().type(value);
      });
    });
  }
  typeImpactedControl(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('Impacted Control(s)').type(value, { force: true });
      });
    });
  }
  verifyImpactedControlInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('Impacted Control(s)').should("not.be.visible");
      });
    });
  }
  verifyImpactedControlVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('Impacted Control(s)').should("be.visible");
      });
    });
  }
  getRiskArea() {
    return this.fieldLocator("Risk Area");
  }
  typeRiskArea(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Risk Area").type(value);
      });
    });
  }
  typeNoOfCustomersImpacted(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Number of Customers Impacted").clear().type(value).tab();
      });
    });
  }
  verifyNoOfCustomerImpactedInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Number of Customers Impacted").should("not.be.visible");
      });
    });
  }
  verifyNoOfCustomerImpactedVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator("Number of Customers Impacted").should("be.visible");
      });
    });
  }
  typeCustomersImpacted(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('How Customers are Impacted').type(value, { force: true });
      });
    });
  }
  verifyCustomersImpactedInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('How Customers are Impacted').should("not.be.visible");
      });
    });
  }
  verifyCustomersImpactedVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.fieldLocator('How Customers are Impacted').should("be.visible");
      });
    });
  }
  typeRecommendation(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Recommendation').type(value);
      });
    });
  }
  typeManagementResponse(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.getRichTextArea('Management Response').type(value);
      });
    });
  }
  getAssignee() {
    return this.fieldLocator(/^Assignee$/);
  }

  typeAssignee(name) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator(/^Assignee$/).type(name);
    });
  }
  getReporter() {
    return this.fieldLocator("Reporter");
  }
  typeReporter(name) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Reporter").type(name, { force: true });
    });
  }
  getApprover() {
    return this.fieldLocator("Approver");
  }
  typeApprover(name) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Approver").type(name, { force: true });
    });
  }
  verifyApproverInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Approver").should("not.be.visible");
    });
  }
  verifyApproverVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Approver").should("be.visible");
    });
  }
  getSubmitter() {
    return this.fieldLocator("Submitter Name");
  }
  typeSubmitter(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitter Name").type(value, { force: true });
    })
  }
  getSubjectArea() {
    return this.fieldLocator("Subject Area");
  }
  typeSubjectArea(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Subject Area").type(value, { force: true });
    })
  }
  typeIdentificationDate(date) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Identification Date").type(date);
    })
  }
  typeEventOccurence(date) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Event Occurrence").type(date);
    });
  }
  verifyEventOccurrenceInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Event Occurrence").should("not.be.visible")
    });
  }
  verifyEventOccurrenceVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Event Occurrence").should("be.visible")
    });
  }
  typeReportDate(date) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Report Date").type(date);
    });
  }
  typeDueDate(date) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Due Date").type(date).tab();
    });
  }
  verifyDueDateVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Due Date").should("be.visible")
    });
  }
  verifyDueDateInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Due Date").should("not.be.visible")
    });
  }
  getContainmentDate() {
    return this.fieldLocator("Containment Date");
  }
  verifyDisabledFields() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Containment Date").should("be.disabled");
      this.fieldLocator("Submitted for Validation Date").should("be.disabled");
      this.fieldLocator("Closed Date").should("be.disabled");
    });
  }
  verifyContainmentDateVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Containment Date").should("be.visible")
    });
  }
  verifyContainmentDateInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Containment Date").should("not.be.visible")
    });
  }
  typeRemediationTargetDate(date) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitted for Validation Target Date").type(date);
    });
  }
  verifyRemediationTargetDateInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitted for Validation Target Date").should("not.be.visible");
    });
  }
  verifyRemediationTargetDateVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitted for Validation Target Date").should("be.visible");
    });
  }
  getRemediationDate() {
    return this.fieldLocator("Submitted for Validation Date");
  }
  verifyRemediationDateVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitted for Validation Date").should("be.visible");
    });
  }
  verifyRemediationDateInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Submitted for Validation Date").should("not.be.visible");
    });
  }
  getClosedDate() {
    return this.fieldLocator("Closed Date");
  }
  getIssueType() {
    return this.fieldLocator("Type of Issue");
  }
  typeInIssueTypeField(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Type of Issue").type(value);
    });
  }
  getBusinessArea() {
    return this.fieldLocator("Business Area");
  }
  typeBusinessArea(value) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Business Area").type(value);
    });
  }
  verifyBusinessAreaVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

      this.fieldLocator("Business Area").should("be.visible")
    });
  }
  verifyBusinessAreaInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

      this.fieldLocator("Business Area").should("not.be.visible")
    });
  }
  getResponsibleDepartment() {
    return this.fieldLocator("Responsible Department")
  }
  getSingleSelectDropdownIntelliSense() {
    return cy.get(locators.issueManagement.createForm.singleSelectDropdownIntelliSense);
  }
  clickIssueSourceArrow() {
    cy.get(locators.issueManagement.createForm.issueSourceArrow).click();
    cy.wait(2000);
  }
  clickBA_DropdownArrow() {
    cy.get(locators.issueManagement.createForm.businessAreaDropdownArrow).click();
  }
  clickIssueTypeArrow() {
    cy.get(locators.issueManagement.createForm.issueTypeArrow).click();
  }
  clickRootCauseArrow() {
    cy.get(locators.issueManagement.createForm.rootCauseArrow).click();
  }
  clickSeverityArrow() {
    cy.get(locators.issueManagement.createForm.severityArrow).click();
  }
  getHighlightedOption() {
    return cy.get(locators.issueManagement.createForm.highlightedOption);
  }
  clickRemoveOptionIcon() {
    cy.get(locators.issueManagement.createForm.removeOption).filter(":visible").each(($el) => {
      cy.wrap($el).click({ force: true });
    });
  }
  dropdownIntelliSense() {
    cy.wait(2000);
    return cy.get(locators.issueManagement.createForm.dropdownIntelliSense);
  }
  getSelectedDropdownOption() {
    return cy.get(locators.issueManagement.createForm.selectedDropdownOption);
  }
  removeSelectedOption() {
    cy.wait(2000);
    cy.get(locators.issueManagement.createForm.removeSelectedOption).eq(0).click({ force: true });
  }
  enterDescWithCharLength(char) {
    cy.createRandomString(char).then((randomString) => {
      this.typeDescriptionText(randomString);
      cy.wait(3000);
    });
  }
  checkGroupRadio() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.groupRadio).check({ force: true }).should("be.checked");
      cy.wait(1000);
    });
  }
  checkSingleRadio() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.singleRadio).check({ force: true }).should("be.checked");
    });
    cy.wait(1000);
  }
  getGroupAssignee() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Group Assignee");
    });
  }
  verifyGroupAssigneeInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Group Assignee")
        .should("not.be.visible");
    });
  }
  verifyGroupAssigneeVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator("Group Assignee")
        .should("be.visible");
    });
  }
  verifyAssigneeVisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator(/^Assignee$/)
        .should("be.visible");
    });
  }
  verifyAssigneeInvisibility() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.fieldLocator(/^Assignee$/)
        .should("not.be.visible");
    });
  }
  clickAssignToMeBtn() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.assignToMe).click();
      cy.wait(3000);
    });
  }
  clickAssigneeArrow() {
    cy.get(locators.issueManagement.createForm.assigneeArrow).filter(":visible").click({ force: true });
  }
  hoveOverUserProfile() {
    cy.get(locators.issueManagement.issueDashboard.userProfile).trigger('mouseover');
    cy.wait(1000);
  }
  getLoggedInUserName() {
    return cy.get(locators.issueManagement.issueDashboard.loggedInUser).invoke('text');
  }
  scrollToBottom() {
    cy.get(locators.issueManagement.createForm.popupDiv).scrollTo("bottom");
    cy.wait(2000);
  }
  verifyErrorMessage(msg) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.contains('div', msg).should("exist");
    })
  }
  verifyEditFormTitle() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.contains('label', 'Edit Issue', { timeout: 20000 }).should("be.visible");
    });
  }
  verifySummary(text) {
    this.fieldLocator('Summary').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    });
  }
  verifySeverity(text) {
    this.fieldLocator('Severity').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyIssueSource(text) {
    this.fieldLocator('Issue Source').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyAgency(text) {
    cy.contains('label', 'Regulator or Agency').closest('section').next()
      .find('.dropDownMultiSelectItemSpan')
      .invoke('text').then((EditText) => {
        expect(EditText.trim()).to.equal(text);
      })
  }
  verifyIssueType(text) {
    this.fieldLocator('Type of Issue').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyAuditField(text) {
    this.fieldLocator('Associated Project, Exam, or Audit').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyDepartment(text) {
    this.fieldLocator('Responsible Department').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyBusinessArea(text) {
    this.fieldLocator('Business Area').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifySubmitter(text) {
    this.fieldLocator('Submitter Name').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyAssignee(text) {
    this.fieldLocator(/^Assignee$/).invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyReporter(text) {
    this.fieldLocator('Reporter').scrollIntoView().invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyApprover(text) {
    this.fieldLocator('Approver').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifySubjectArea(text) {
    cy.contains('label', 'Subject Area').closest('section').next().find('span').eq(0)
      .invoke('text').then((EditText) => {
        expect(EditText.trim()).to.equal(text);
      })
  }

  verifyNotifier(text) {
    return cy.contains('label', 'Notify').closest('section').next('section').find('textarea')
      .invoke('val').then((EditText) => {
        expect(EditText.trim()).to.equal(text);
      })
  }
  verifyVendor(text) {
    this.fieldLocator('Vendor').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyEventOccurrence(Date) {
    this.fieldLocator('Event Occurrence').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(Date);
    })
  }
  verifyIdentificationDate(Date) {
    this.fieldLocator('Identification Date').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(Date);
    })
  }
  verifyReportDate(Date) {
    this.fieldLocator('Report Date').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(Date);
    })
  }
  verifyDueDate(Date) {
    this.fieldLocator('Due Date').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(Date);
    })
  }
  verifyRemediationTargetDate(Date) {
    this.fieldLocator('Submitted for Validation Target Date').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(Date);
    })
  }
  verifyOwner(text) {
    this.fieldLocator('Owner').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyRootCause(text) {
    this.fieldLocator('Root Cause').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyPotentialLoss(text) {
    this.fieldLocator('Potential Loss').invoke('val').then((EditText) => {
      expect(Number(EditText.trim())).to.equal(Number(text));
    })
  }
  verifyActualLoss(text) {
    this.fieldLocator('Actual Loss').invoke('val').then((EditText) => {
      expect(Number(EditText.trim())).to.equal(Number(text));
    })
  }
  verifyImpactedControl(text) {
    this.fieldLocator('Impacted Control(s)').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyRiskArea(text) {
    this.fieldLocator('Risk Area').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }

  verifyCustomersImpactedNo(text) {
    this.fieldLocator('Number of Customers Impacted').invoke('val').then((EditText) => {
      expect(Number(EditText.trim())).to.equal(Number(text));
    })
  }

  verifyCustomersImpacted(text) {
    this.fieldLocator('How Customers are Impacted').invoke('val').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyDescription(text) {
    this.getRichTextArea('Description').scrollIntoView().invoke('text').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyOriginalReport(text) {

    this.getRichTextArea('Original Report').invoke('text').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyRootCauseDesc(text) {

    this.getRichTextArea('Root Cause Description').invoke('text').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyRecommendation(text) {

    this.getRichTextArea('Recommendation').invoke('text').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyManagementResponse(text) {
    this.getRichTextArea('Management Response').invoke('text').then((EditText) => {
      expect(EditText.trim()).to.equal(text);
    })
  }
  verifyReporterName() {
    this.getLoggedInUserName().then((loggedInUser) => {
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getReporter().should('contain.value', loggedInUser.trim());
      });
    })
  }

  validateRequirementsAndRiskData(requirementTitle, riskTitle) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.clickRequirementsAddBtn();
      this.getPopupTitle().should('have.text', requirementTitle);
      this.selectPlugInFirstRecord();
      this.clickPopupAddBtn();
      cy.wait(5000);
      this.clickRisksAddBtn();
      this.getPopupTitle().should('have.text', riskTitle);
      this.selectPlugInFirstRecord();
      this.clickPopupAddBtn();
      cy.wait(5000);
    });
  }

  checkViewAndDownloadDocumentButtons(documentTitle, downloadedFile) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.clickDocumentsAddBtn();
      this.getPopupTitle().should('have.text', documentTitle);
      this.selectPlugInFirstRecord();
      this.clickPopupAddBtn();
      this.clickViewBtn();
      this.clickCloseBtn();
      this.clickDownloadBtn();
      cy.wait(5000);
      this.verifyFileExists(downloadedFile);
    });
  }

  fillMandatoryDetailsFields(issueData) {
    this.typeOwnerText(issueData.mandatory.owner);
    this.checkNoRadio();
  }

  fillSummaryTabWithoutAssignee(issueData, severityVal) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getSummary().type(issueData.mandatory.summary);
      this.getSeverity().type(severityVal);
      this.getIssueSource().type(issueData.mandatory.issueSource);
      this.getDepartment().type(issueData.mandatory.department);
      this.getSubmitter().type(issueData.mandatory.submitter);
    });
  }

  defineGroupAssignee(issueData) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.checkGroupRadio();
      cy.wait(1000);
      this.getGroupAssignee().type(issueData.mandatory.groupAssignee);
    });
  }
  fillDatesAndDetailsMandataroyFields(issueData) {
    this.clickDatesTab();
    this.typeIdentificationDate(issueData.mandatory.pastDate);
    this.clickDetailsTab();
    this.fillMandatoryDetailsFields(issueData);
  }

  verifyAssigneeWithLoggedInUser() {
    this.getLoggedInUserName().then((LoggedInUser) => {
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSubmitter().scrollIntoView({ block: 'center' });
        this.clickAssigneeArrow();
        cy.wait(2000);
        this.getHighlightedOption().should("exist").and("contain.text", LoggedInUser.trim());
      });
    });
  }

  verifyBlankDateFields() {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.verifyIdentificationDate('');
      this.verifyEventOccurrence('');
      this.verifyReportDate('');
      this.verifyDueDate('');
    });
  }
  verifyNumericFieldsData(value, secondValue) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
        this.verifyActualLoss(value);
        this.verifyPotentialLoss(value);
        this.verifyCustomersImpactedNo(secondValue);
      });
    });

  }
  fillFormWithAllStringFields(issueData, value) {
    this.typeSummary(value);
    this.typeSeverity(issueData.mandatory.extendedSeverity);
    this.typeIssueSource(issueData.mandatory.issueSource);
    this.typeDepartment(issueData.mandatory.department);
    this.typeSubmitter(value);
    this.typeAuditField(value);
    this.typeDescriptionText(value);
    this.typeAssignee(issueData.mandatory.assignee);
    this.typeReporter(issueData.mandatory.reporter);
    this.clickDatesTab();
    this.typeIdentificationDate(issueData.mandatory.pastDate);
    this.clickDetailsTab();
    this.typeOriginalReport(value);
    this.typeOwnerText(value);
    this.checkNoRadio();
    this.typeRootCauseDesc(value);
    this.typeImpactedControl(value);
    this.typeCustomersImpacted(value);
    this.typeManagementResponse(value);
    this.typeRecommendation(value);
  }

  fillStringBoxesWithLength(issueData, char) {
    cy.createRandomString(char).then((randomString) => {
      this.fillFormWithAllStringFields(issueData, randomString);
    });
  }

  verifyIssueSourceRenamingAndStatus(oldName) {
    cy.createRandomString(7).then((randomString) => {
      issueSource.clearSearchedTextBox().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.typeIssueSource(oldName);
      cy.wait(2000);
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.clickIssueSourceArrow();
        this.getHighlightedOption().should("not.exist");
        this.clickRemoveOptionIcon();
      });
      this.typeIssueSource(randomString);
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.wait(2000);
        this.clickIssueSourceArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });
      sideMenu.openIssueAdministration();
      sideMenu.openIssueSources();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickInactiveOption();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.typeIssueSource(randomString);
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.wait(2000);
        this.clickIssueSourceArrow();
        this.getHighlightedOption().should("not.exist");
      });
    });
  }

  verifyIssueSourceData() {
    let firstValue;
    issueSource.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      issueSource.textArea().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.typeIssueSource(randomString);
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.wait(2000);
        this.clickIssueSourceArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });

      sideMenu.openIssueAdministration();
      sideMenu.openIssueSources();
      issueSource.searchBox().first().type(randomString);
      cy.wait(3000);
      issueSource.clickActionIcon();
      this.verifyIssueSourceRenamingAndStatus(firstValue);
    });

  }
  verifyRootCauseRenamingAndStatus(oldName) {
    cy.createRandomString(7).then((randomString) => {
      issueSource.clearSearchedTextBox().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.clickDetailsTab();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.getRootCause().type(oldName);
          cy.wait(2000);
          this.clickRootCauseArrow();
        });
        this.getHighlightedOption().should("not.exist");
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.clickRemoveOptionIcon();
          this.getRootCause().type(randomString);
          cy.wait(2000);
          this.clickRootCauseArrow();
        });
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });

      sideMenu.openIssueAdministration();
      sideMenu.openRootCauseModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickInactiveOption();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.clickDetailsTab();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.getRootCause().type(randomString);
          cy.wait(2000);
          this.clickRootCauseArrow();
        });
        this.getHighlightedOption().should("not.exist");
      });
    });
  }

  verifyRootCauseData() {
    let firstValue;
    issueSource.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      issueSource.textArea().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      this.clickDetailsTab();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.getRootCause().type(randomString);
          cy.wait(2000);
          this.clickRootCauseArrow();
        });
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });
      sideMenu.openIssueAdministration();
      sideMenu.openRootCauseModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(3000);
      issueSource.clickActionIcon();
      this.verifyRootCauseRenamingAndStatus(firstValue);
    });
  }
  verifyIssueTypeRenamingAndStatus(oldName) {
    cy.createRandomString(7).then((randomString) => {
      issueSource.clearSearchedTextBox().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getIssueType().type(oldName);
        cy.wait(2000);
        this.clickIssueTypeArrow();
        this.getHighlightedOption().should("not.exist");
        this.clickRemoveOptionIcon();
        this.getIssueType().type(randomString);
        cy.wait(2000);
        this.clickIssueTypeArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });
      sideMenu.openIssueAdministration();
      sideMenu.openIssueTypes();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickInactiveOption();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getIssueType().type(randomString);
        cy.wait(2000);
        this.clickIssueTypeArrow();
        this.getHighlightedOption().should("not.exist");
      });

    });
  }
  verifyIssueTypeData() {
    let firstValue;
    issueSource.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      issueSource.textArea().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getIssueType().type(randomString);
        cy.wait(2000);
        this.clickIssueTypeArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });
      sideMenu.openIssueAdministration();
      sideMenu.openIssueTypes();
      issueSource.searchBox().first().type(randomString);
      cy.wait(3000);
      issueSource.clickActionIcon();
      this.verifyIssueTypeRenamingAndStatus(firstValue);
    });
  }
  verifySeverityRenamingAndStatus(oldName) {
    cy.createRandomString(7).then((randomString) => {
      issueSource.clearSearchedTextBox().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSeverity().type(oldName);
        cy.wait(2000);
        this.clickSeverityArrow();
        this.getHighlightedOption().should("not.exist");
        this.clickRemoveOptionIcon();
        this.getSeverity().type(randomString);
        cy.wait(2000);
        this.clickSeverityArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });

      sideMenu.openIssueAdministration();
      sideMenu.openSeverityModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickInactiveOption();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSeverity().type(randomString);
        cy.wait(2000);
        this.clickSeverityArrow();
        this.getHighlightedOption().should("not.exist");
      });
      sideMenu.openIssueAdministration();
      sideMenu.openSeverityModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickDropdownActiveOption();
      severity.clickSeverityDeleteBtn();
      severity.clickSeverityPopupDeleteBtn();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSeverity().type(randomString);
        cy.wait(2000);
        this.clickSeverityArrow();
        this.getHighlightedOption().should("not.exist");
      });
    });
  }
  verifySeverityData() {
    let firstValue;
    issueSource.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      issueSource.textArea().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSeverity().type(randomString);
        cy.wait(2000);
        this.clickSeverityArrow();
        this.getHighlightedOption().should("exist").and("contain.text", randomString);
      });
      sideMenu.openIssueAdministration();
      sideMenu.openSeverityModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(3000);
      severity.clickSeverityEditBtn();
      this.verifySeverityRenamingAndStatus(firstValue);
    });
  }
  verifyAgencyRenamingAndStatus(oldName) {
    cy.createRandomString(7).then((randomString) => {
      issueSource.clearSearchedTextBox().type(randomString).tab();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getEntity().type(oldName);
        cy.wait(2000);
        this.dropdownIntelliSense().should("not.exist");
        this.clickRemoveOptionIcon();
        this.getEntity().type(randomString);
        cy.wait(2000);
        this.dropdownIntelliSense().should("exist");
      });
      sideMenu.openIssueAdministration();
      sideMenu.openEntitiesModule();
      issueSource.searchBox().first().type(randomString);
      cy.wait(2000);
      issueSource.openStatusDropdown();
      cy.wait(2000);
      issueSource.clickInactiveOption();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getEntity().type(randomString);
        cy.wait(2000);
        this.dropdownIntelliSense().should("not.exist");
      });
    });
  }
  verifyAgencyDataOnIssueForm() {
    let firstValue, secondValue;
    issueSource.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      cy.wrap(firstValue).as('firstValue');
      issueSource.textArea().type(randomString).tab();
      cy.wait(2000);
      issueSource.clickActiveOption();
      issueSource.clickAddBtn();
      cy.wait(3000);
      cy.createRandomString(7).then((randomString) => {
        secondValue = randomString;
        issueSource.textArea().type(randomString).tab();
        cy.wait(2000);
        sideMenu.openIssueDashboard();
        dashboard.openIssueForm();
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
          this.getEntity().type(firstValue);
          cy.wait(2000);
          this.dropdownIntelliSense().click();
          cy.wait(2000);
          this.getSelectedDropdownOption().eq(0).should("exist");
          this.getEntity().type(firstValue);
          cy.wait(2000);
          this.dropdownIntelliSense().should("not.exist");
          this.clickRemoveOptionIcon();
          cy.wait(1000);
          this.getEntity().type(secondValue);
          cy.wait(2000);
          this.dropdownIntelliSense().click();
          cy.wait(1000);
          this.getSelectedDropdownOption().eq(1).should("exist")
        });
      });
    });
  }
  checkAgencyDataMultiSelectAndRemoveBtns() {
    this.verifyAgencyDataOnIssueForm();
    cy.get('@firstValue').then((firstValue) => {
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSelectedDropdownOption().eq(0).trigger("mouseover");
        this.removeSelectedOption();
        this.removeSelectedOption();
        this.getSelectedDropdownOption().should("not.exist");
      });
      sideMenu.openIssueAdministration();
      sideMenu.openEntitiesModule();
      issueSource.searchBox().first().type(firstValue);
      cy.wait(3000);
      issueSource.clickActionIcon();
      this.verifyAgencyRenamingAndStatus(firstValue);
    });
  }
  renameSubjectAreaAndVerify(oldName) {
    sideMenu.openRegCategories();
    categories.clickFilterBrn();
    categories.getFilterNameField().type(oldName);
    cy.wait(3000);
    categories.clickApplyBtn();
    categories.clickSearchedCategory();
    cy.createRandomString(7).then((randomString) => {
      categories.getNamefield().clear().type(randomString);
      categories.clickSave();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getSubjectArea().type(randomString);
        cy.wait(2000);
        this.dropdownIntelliSense().click();
        this.getSubjectArea().type(oldName);
        this.dropdownIntelliSense().should("not.exist");
      });
    });
  }
  verifySubjectAreaData() {
    let firstValue;
    sideMenu.openRegCategories();
    categories.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      categories.getNamefield().type(randomString);
      categories.clickSave();
      cy.wait(2000);
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(
        locators.issueManagement.issueDashboard.issueFrame
      ).within(() => {
        this.getSubjectArea().type(randomString);
        cy.wait(2000);
        this.dropdownIntelliSense().click();
      });
      this.renameSubjectAreaAndVerify(firstValue);
    });
  }
  businessAreaInactiveStatus(newValue) {
    sideMenu.openBusinessArea();
    businessArea.clickBusinessArea_Tab();
    businessArea.getSearchbox().type(newValue);
    cy.wait(5000);
    businessArea.openStatusBtn();
    businessArea.clickInactiveOption();
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getBusinessArea().type(newValue);
      cy.wait(2000);
      this.clickBA_DropdownArrow();
      cy.wait(2000)
      this.getHighlightedOption().should("not.exist");
    });
  }
  renameBusinessAreaAndVerify(oldName) {
    sideMenu.openBusinessArea();
    businessArea.clickBusinessArea_Tab();
    businessArea.getSearchbox().type(oldName);
    cy.wait(5000);
    businessArea.editSearchedEntry();
    cy.createRandomString(7).then((randomString) => {
      businessArea.getSearchedTextArea().clear().type(randomString).tab();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(
        locators.issueManagement.issueDashboard.issueFrame
      ).within(() => {
        this.getBusinessArea().type(oldName);
        cy.wait(2000);
        this.clickBA_DropdownArrow();
        cy.wait(2000);
        this.getHighlightedOption().should("not.exist");
        this.clickRemoveOptionIcon();
        this.getBusinessArea().type(randomString);
        cy.wait(2000);
        this.clickBA_DropdownArrow();
        cy.wait(2000);
        this.getHighlightedOption()
          .should("exist")
          .and("contain.text", randomString);
      });
      this.businessAreaInactiveStatus(randomString);
    });
  }

  verifyBusinessAreaData() {
    let firstValue;
    sideMenu.openBusinessArea();
    businessArea.clickBusinessArea_Tab();
    businessArea.clickAddBtn();
    cy.createRandomString(7).then((randomString) => {
      firstValue = randomString;
      businessArea.textArea().type(randomString).tab();
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(
        locators.issueManagement.issueDashboard.issueFrame
      ).within(() => {
        this.getBusinessArea().type(randomString);
        cy.wait(2000);
        this.clickBA_DropdownArrow();
        this.getHighlightedOption()
          .should("exist")
          .and("contain.text", randomString);
      });
      this.renameBusinessAreaAndVerify(firstValue);
    });
  }
  // add assertion to ensure that value in issue dropdown contains text 'Inactive'
  verifyInactiveUsersOnIssueForm(newUser) {
    sideMenu.openUsers();
    users.makeUserInactive(newUser);
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();

    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(
      () => {
        this.getAssignee().type(newUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
        this.getReporter().type(newUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
        this.getApprover().type(newUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
      }
    );
  }

  verifyRenamedUserOnIssueForm(userName) {
    sideMenu.openUsers();
    users.renameUser(userName).then((renamedUser) => {
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getAssignee().type(renamedUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
        this.getReporter().type(renamedUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
        this.getApprover().type(renamedUser);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
      });
      this.verifyInactiveUsersOnIssueForm(renamedUser);
    });
  }
  verifyUsersOnIssueForm() {
    cy.fixture('Administration/users').then((usersData) => {
      sideMenu.openUsers();
      users.createUsers(usersData.firstName, usersData.email, usersData.role)
        .then((userName) => {
          sideMenu.openIssueDashboard();
          dashboard.openIssueForm();
          cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            this.getAssignee().type(userName);
            cy.wait(2000);
            this.getSingleSelectDropdownIntelliSense().should("exist");
            this.getReporter().type(userName);
            cy.wait(2000);
            this.getSingleSelectDropdownIntelliSense().should("exist");
            this.getApprover().type(userName);
            cy.wait(2000);
            this.getSingleSelectDropdownIntelliSense().should("exist");
          });
          this.verifyRenamedUserOnIssueForm(userName)
        });
    });
  }

  verifyInactiveBUOnIssueForm(newBU) {
    sideMenu.openOrganizationHierarchy();
    cy.wait(5000);
    department.clickExpandAllBtn();
    cy.wait(2000);
    department.clickDialogueExpandBtn();
    cy.wait(2000);
    department.makeBUInactive(newBU);
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getResponsibleDepartment().type(newBU);
      cy.wait(2000);
      this.getSingleSelectDropdownIntelliSense().should("not.exist");
    });
  }
  renameBUAndVerifyOnIssueForm(depName) {
    sideMenu.openOrganizationHierarchy();
    cy.wait(5000);
    department.clickExpandAllBtn();
    cy.wait(2000);
    department.clickDialogueExpandBtn();
    cy.wait(2000);
    department.renameBU(depName).then((newName) => {
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(
        locators.issueManagement.issueDashboard.issueFrame
      ).within(() => {
        this.getResponsibleDepartment().type(depName);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("not.exist");
        this.clickRemoveOptionIcon();
        this.getResponsibleDepartment().type(newName);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("exist");
      });
      this.verifyInactiveBUOnIssueForm(newName);
    });
  }
  verifyBUOnIssueForm(depName) {
    sideMenu.openOrganizationHierarchy();
    department.clickExpandAllBtn();
    cy.wait(2000);
    department.clickDialogueExpandBtn();
    cy.wait(2000);
    department.clicksetAsBUBtn(depName);
    cy.wait(2000);
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.getResponsibleDepartment().type(depName);
      cy.wait(2000);
      this.getSingleSelectDropdownIntelliSense().click();
    });
  }
  verifyDepartmentOnIssueForm() {
    cy.fixture('Administration/organizationalHierarchy').then((data) => {
      const depName = data.name;
      sideMenu.openIssueDashboard();
      dashboard.openIssueForm();
      cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
        this.getResponsibleDepartment().type(depName);
        cy.wait(2000);
        this.getSingleSelectDropdownIntelliSense().should("not.exist");
      });
      this.verifyBUOnIssueForm(depName);
      this.renameBUAndVerifyOnIssueForm(depName);
    });
  }
  fillFormWithAllFields(issueData) {
    let summaryText;
    cy.createRandomString(7).then((randomString) => {
      summaryText = randomString;
      this.typeSummary(summaryText);
    });
    this.typeSeverity(issueData.mandatory.extendedSeverity);
    this.typeIssueSource(issueData.mandatory.issueSource);
    this.typeEntity(issueData.allFields.entity);
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.dropdownIntelliSense().click({ force: true });
    });
    this.typeInIssueTypeField(issueData.allFields.issueType);
    this.typeAuditField(issueData.allFields.auditField);
    this.typeDepartment(issueData.mandatory.department);
    this.typeBusinessArea(issueData.allFields.businessArea);
    this.typeSubmitter(issueData.mandatory.submitter);
    this.typeAssignee(issueData.mandatory.assignee);
    this.typeReporter(issueData.mandatory.reporter);
    this.typeApprover(issueData.allFields.approver);
    this.typeSubjectArea(issueData.allFields.subjectArea);
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
      this.dropdownIntelliSense().click({ force: true });
    });
    this.typeDescriptionText(issueData.mandatory.description);
    this.typeVendor(issueData.allFields.vendor);
    this.typeNotify(issueData.emails.singleCorrect);
    this.clickDatesTab();
    this.typeIdentificationDate(issueData.mandatory.pastDate);
    this.typeEventOccurence(issueData.date.pastValue);
    this.typeReportDate(issueData.date.pastValue);
    this.typeDueDate(issueData.date.pastValue);
    this.typeRemediationTargetDate(issueData.date.pastValue);
    this.clickDetailsTab();
    cy.wait(3000);
    this.typeOriginalReport(issueData.allFields.originalReport);
    this.typeOwnerText(issueData.mandatory.owner);
    this.typeRootCause(issueData.allFields.rootCause);
    this.typeRootCauseDesc(issueData.allFields.rootCauseDesc);
    this.checkNoRadio();
    this.typePotentialLoss(issueData.numericValues.valid);
    this.typeActualLoss(issueData.numericValues.valid);
    this.typeImpactedControl(issueData.allFields.impactedControl);
    this.typeRiskArea(issueData.allFields.riskArea);
    this.typeNoOfCustomersImpacted(issueData.numericValues.valid);
    this.typeCustomersImpacted(issueData.allFields.customersImpactedDesc);
    this.typeRecommendation(issueData.allFields.recommendation);
    this.typeManagementResponse(issueData.allFields.managementResponse);
    return cy.wrap(summaryText);
  }

  // function to create issue form with mandatory fields
  createIssueMandatoryFields(issueData) {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    this.fillSummaryTabWithoutAssignee(issueData);
    this.typeAssignee(issueData.mandatory.assignee)
    this.typeReporter(issueData.mandatory.reporter)
    this.fillDatesAndDetailsMandataroyFields(issueData);
    this.clickCreateBtn();
    summaryView.waitForEditBtn();
  }

  //function to create issue form with all fields and verify on the summaryView
  createIssueWithUniqueSummaryText(issueData) {
    sideMenu.openIssueDashboard();
    dashboard.openIssueForm();
    this.fillFormWithAllFields(issueData);
    this.clickCreateBtn();
    summaryView.waitForEditBtn();
    summaryView.verifyDataOnSummaryView(issueData);
  }

  verifyExistingData(issueData) {
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(
      () => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.verifySummary(issueData.mandatory.summary);
          this.verifyIssueSource(issueData.mandatory.IssueSource);
          this.verifySeverity(issueData.mandatory.ExtendedSeverity);
          this.verifyAgency(issueData.AllFields.Entity);
          this.verifyIssueType(issueData.AllFields.IssueType);
          this.verifyAuditField(issueData.AllFields.AuditField);
          this.verifyDepartment(issueData.mandatory.Department);
          this.verifyBusinessArea(issueData.AllFields.BusinessArea);
          this.verifySubmitter(issueData.mandatory.submitter);
          this.verifyAssignee(issueData.mandatory.assignee);
          this.verifyReporter(issueData.mandatory.reporter);
          this.verifyApprover(issueData.AllFields.Approver);
          cy.wait(3000);
          this.verifySubjectArea(issueData.AllFields.SubjectArea);
          this.verifyDescription(issueData.mandatory.Description);
          this.verifyVendor(issueData.AllFields.Vendor);
          this.verifyNotifier(issueData.AllFields.Notifier);
        });
      }
    );
    this.clickDatesTab();
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(
      () => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.verifyIdentificationDate(issueData.mandatory.pastDate);
          this.verifyEventOccurrence(issueData.Date.pastValue);
          this.verifyDueDate(issueData.Date.pastValue);
          this.verifyRemediationTargetDate(issueData.Date.pastValue);
          this.verifyReportDate(issueData.Date.pastValue);
        });
      }
    );
    this.clickDetailsTab();
    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(
      () => {
        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
          this.verifyOriginalReport(issueData.AllFields.OriginalReport);
          this.verifyOwner(issueData.mandatory.owner);
          this.verifyRootCause(issueData.AllFields.RootCause);
          this.verifyRootCauseDesc(issueData.AllFields.RootCauseDesc);
          this.verifyActualLoss(issueData.NumericValues.valid);
          this.verifyPotentialLoss(issueData.NumericValues.valid);
          this.verifyRiskArea(issueData.AllFields.RiskArea);
          this.verifyImpactedControl(issueData.AllFields.ImpactedControl);
          this.verifyCustomersImpactedNo(issueData.NumericValues.valid);
          this.verifyCustomersImpacted(
            issueData.AllFields.CustomersImpactedDesc
          );
          this.verifyRecommendation(issueData.AllFields.Recommendation);
          this.verifyManagementResponse(issueData.AllFields.ManagementResponse);
        });
      }
    );
  }
}
