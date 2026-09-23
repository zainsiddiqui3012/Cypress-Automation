import IssueForm_PO from "../../support/POM/IssueManagement_PO/IssueForm";
import PredictMenu_PO from "../../support/POM/Menu_PO/PredictMenu_PO";
import IssueDashboard from "../../support/POM/IssueManagement_PO/IssueDashboard";
import IssueSources_PO from "../../support/POM/IssueManagement_PO/IssueSources";
import RegCategories_PO from "../../support/POM/Regulations/RegCategories_PO";
import BusinessAreas from "../../support/POM/Administration/BusinessArea";
import OrganizationalHierarchy from "../../support/POM/Administration/OrganizationHierarchy";
import Users_PO from "../../support/POM/Administration/Users";
import IssueSummaryView from "../../support/POM/IssueManagement_PO/IssueSummaryView";
import locators from "../../fixtures/locators.json";
import CustomerProfile from "../../support/POM/Administration/CustomerProfile";

const createIssue = new IssueForm_PO();
const SideMenu = new PredictMenu_PO();
const dashboard = new IssueDashboard();
const issueSource = new IssueSources_PO();
const categories = new RegCategories_PO();
const BA = new BusinessAreas();
const Department = new OrganizationalHierarchy();
const summaryView = new IssueSummaryView();
const Users = new Users_PO();
const CusProfile = new CustomerProfile();


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
    });
    it.only("Verify the title and that all the data is pre populated when we open the Edit Issue form", () => {
        createIssue.createIssueWithUniqueSummaryText(issueData);
        summaryView.clickEditBtn();
        createIssue.verifyEditFormTitle();
        createIssue.verifyExistingData(issueData);
    });
    it("Change the data for every field of the edit issue form and verify on the ticket after saving", () => {

        createIssue.createIssueWithUniqueSummaryText(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            createIssue.verifyEditFormTitle();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSummary().clear().type(issueData.newText)
                    .type(issueData.mandatory.summary);

                // createIssue.getSeverity().clear().type(issueData.newText)
                // .type(issueData.mandatory.ExtendedSeverity);

                createIssue.getIssueSource().clear().type(issueData.newText)
                    .type(issueData.mandatory.IssueSource);

                createIssue.getSelectedDropdownOption().eq(0).trigger("mouseover");
                createIssue.removeSelectedOption();
                cy.wait(3000);

                createIssue.getIssueType().clear().type(issueData.newText)
                    .type(issueData.AllFields.IssueType);

                createIssue.getAuditField().clear().type(issueData.newText)
                    .type(issueData.AllFields.AuditField);

                // createIssue.getDepartment().clear().type(issueData.newText)
                // .type(issueData.mandatory.Department);

                createIssue.getBusinessArea().clear().type(issueData.newText)
                    .type(issueData.AllFields.BusinessArea);
                createIssue.getSubmitter().clear().type(issueData.newText)
                    .type(issueData.mandatory.submitter);
                createIssue.getAssignee().clear().type(issueData.newText)
                    .type(issueData.mandatory.assignee);
                createIssue.getReporter().clear().type(issueData.newText)
                    .type(issueData.mandatory.reporter);
                createIssue.getApprover().clear().type(issueData.newText)
                    .type(issueData.AllFields.Approver);
                createIssue.getSubjectArea().scrollIntoView();
                cy.wait(3000);

                // createIssue.getSelectedDropdownOption().eq(0).trigger("mouseover");
                // createIssue.removeSelectedOption();
                // createIssue.getSelectedDropdownOption().should("not.exist");
                createIssue.getEntity().scrollIntoView();
                createIssue.getEntity().type(issueData.newText)
                    .type(issueData.AllFields.Entity);
            });
            createIssue.dropdownIntelliSense().click({ force: true });
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSelectedDropdownOption().eq(0).should("exist");

                createIssue.getSubjectArea().type(issueData.newText)
                    .type(issueData.AllFields.SubjectArea);
            });
            createIssue.dropdownIntelliSense().click({ force: true });
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSelectedDropdownOption().eq(1).should("exist");

                createIssue.getDescription().clear().type(issueData.newText)
                    .type(issueData.mandatory.Description);
                createIssue.getVendor().clear().type(issueData.newText)
                    .type(issueData.AllFields.Vendor);
                createIssue.getNotify().clear().type(issueData.newText)
                    .type(issueData.AllFields.Notifier);
                createIssue.clickDatesTab();

                createIssue.getIdentificationDate().clear().type(issueData.Date.futureValue);
                createIssue.getEventOccurence().clear().type(issueData.Date.futureValue);
                createIssue.getReportDate().clear().type(issueData.Date.futureValue);
                createIssue.getDueDate().clear().type(issueData.Date.futureValue);
                createIssue.getRemediationTargetDate().clear().type(issueData.Date.futureValue);

                createIssue.clickDetailsTab();


                createIssue.getOriginalReport().clear().type(issueData.newText)
                    .type(issueData.AllFields.OriginalReport);
                createIssue.getOwnerTextbox().clear().type(issueData.newText, { force: true })
                    .type(issueData.mandatory.owner, { force: true });
                // createIssue.getRootCause().clear().type(issueData.AllFields.RootCauseChanged);

                createIssue.getRootCauseDesc().clear().type(issueData.newText)
                    .type(issueData.AllFields.RootCauseDesc);
                createIssue.checkNoRadio();

                createIssue.getPotentialLoss().clear().type(issueData.NumericValues.newValue);
                createIssue.getActualLoss().clear().type(issueData.NumericValues.newValue);
                createIssue.getImpactedControl().clear().type(issueData.newText)
                    .type(issueData.AllFields.ImpactedControl);
                createIssue.getRiskArea().clear().type(issueData.AllFields.RiskAreaChanged);
                createIssue.getNoOfCustomersImpacted().clear().type(issueData.NumericValues.newValue);
                createIssue.getCustomersImpacted().clear().type(issueData.newText)
                    .type(issueData.AllFields.CustomersImpactedDesc);
                createIssue.getRecommendation().clear().type(issueData.newText)
                    .type(issueData.AllFields.Recommendation);
                createIssue.getManagementResponse().clear().type(issueData.newText)
                    .type(issueData.AllFields.ManagementResponse);


            });
            createIssue.clickCreateBtn();
        });
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

            // summaryView.waitForEditBtn();
            cy.wait(15000);
            summaryView.verifyDescriptionText(issueData.newText + issueData.mandatory.Description);
            // summaryView.verifyAgencyText(issueData.AllFields.Entity);
            summaryView.verifyIssueTypeText(issueData.newText + issueData.AllFields.IssueType);
            summaryView.verifyDepartment(issueData.newText + issueData.mandatory.Department);
            summaryView.verifySubmitter(issueData.newText + issueData.mandatory.submitter);
            summaryView.verifySubjectArea(issueData.newText + issueData.AllFields.SubjectArea);
            summaryView.verifyBusinessAreaText(issueData.newText + issueData.AllFields.BusinessArea);
            summaryView.verifyNotifier(issueData.newText + issueData.AllFields.Notifier);
            summaryView.verifyVendor(issueData.newText + issueData.AllFields.Vendor);

            summaryView.verifyOriginalReportText(issueData.newText + issueData.AllFields.OriginalReport);
            summaryView.verifyRootCauseDescText(issueData.newText + issueData.AllFields.RootCauseDesc);
            summaryView.verifyRecommendation(issueData.newText + issueData.AllFields.Recommendation);
            summaryView.verifyManagementResponseText(issueData.newText + issueData.AllFields.ManagementResponse);

            summaryView.verifyOwnerText(issueData.newText + issueData.mandatory.owner);
            summaryView.verifyActualLossText(issueData.NumericValues.newValue);
            summaryView.verifyPotentialLossText(issueData.NumericValues.newValue);
            summaryView.verifyCustomerImpactedNo(issueData.NumericValues.newValue);
            summaryView.verifyHowCustomersImpacted(issueData.newText + issueData.AllFields.CustomersImpactedDesc);
            summaryView.verifyRiskAreaText(issueData.AllFields.RiskAreaChanged);

            // summaryView.verifyReporter(issueData.mandatory.reporter);
            // summaryView.verifyAssignee(issueData.mandatory.assignee);

            summaryView.verifyIdentificationDate(issueData.Date.validateFutDate);
            summaryView.verifyReportDate(issueData.Date.validateFutDate);
            summaryView.verifyDueDate(issueData.Date.validateFutDate);
            summaryView.verifyRemediationTargetDate(issueData.Date.validateFutDate);
            summaryView.verifyEventOccurenceDate(issueData.Date.validateFutDate);


        });


    });
    it("Switch between Simple and Extended Severity dropdown option and verify the presence/absence of certain fields", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity,
                    { force: true });
                cy.wait(2000);
                createIssue.getApprover().should("not.be.visible");
                createIssue.getDescription().should("not.be.visible");
                createIssue.getBusinessArea().should("not.be.visible");

                createIssue.clickDatesTab();

                createIssue.getEventOccurence().should("not.be.visible");
                // createIssue.getDueDate().should("not.be.visible");
                // createIssue.getContainmentDate().should("not.be.visible");
                createIssue.getRemediationTargetDate().should("not.be.visible");
                createIssue.getRemediationDate().should("not.be.visible");

                createIssue.clickDetailsTab();



                createIssue.getRootCauseDesc().should("not.be.visible");
                createIssue.getRootCause().should("not.be.visible");

                createIssue.getCancelBtn();
                cy.wait(3000);

                createIssue.getActualLoss().should("not.be.visible");
                createIssue.getPotentialLoss().should("not.be.visible");
                createIssue.getImpactedControl().should("not.be.visible");
                createIssue.getCustomersImpacted().should("not.be.visible");
                createIssue.getNoOfCustomersImpacted().should("not.be.visible");

            });

            createIssue.clickSummaryTab();
            createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity);
            cy.wait(2000);
            createIssue.getApprover().should("be.visible");
            createIssue.getDescription().should("be.visible");
            createIssue.getBusinessArea().should("be.visible");

            createIssue.clickDatesTab();

            createIssue.getEventOccurence().should("be.visible");
            createIssue.getDueDate().should("be.visible");
            createIssue.getContainmentDate().should("be.visible");
            createIssue.getRemediationTargetDate().should("be.visible");
            createIssue.getRemediationDate().should("be.visible");

            createIssue.clickDetailsTab();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {


                createIssue.getRootCauseDesc().should("be.visible");
                createIssue.getRootCause().should("be.visible");

                createIssue.getActualLoss().scrollIntoView().should("be.visible");
                createIssue.getPotentialLoss().should("be.visible");
                createIssue.getImpactedControl().should("be.visible");
                createIssue.getCustomersImpacted().should("be.visible");
                createIssue.getNoOfCustomersImpacted().should("be.visible");

            });


        });

    });

    it("Test the presence/absence of owner dropdown on the edit issue form after checking/unchecking the relevant checkbox from Users screen", () => {
        SideMenu.openCustomerProfile();
        CusProfile.checkIssueOwnerCheckbox();
        CusProfile.clickSaveButton();
        cy.wait(5000);

        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.clickDetailsTab();
                createIssue.getOwnerTextbox().should("not.be.visible");
                createIssue.getOwnerDropdown().should("be.visible");
            });
        });
        SideMenu.openCustomerProfile();
        CusProfile.unCheckIssueOwnerCheckbox();
        CusProfile.clickSaveButton();
        cy.wait(5000);

        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.clickDetailsTab();
                createIssue.getOwnerTextbox().should("be.visible");
                createIssue.getOwnerDropdown().should("not.be.visible");
            });
        });

    });
    it("Test updating the ticket by removing data from all the mandatory fields on the Edit Issue form", () => {

        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity);
                cy.wait(2000);
                createIssue.getSummary().clear();
                createIssue.getIssueSource().clear();
                // createIssue.getDepartment().clear();
                createIssue.getSubmitter().clear();
                createIssue.getAssignee().clear();
                createIssue.getReporter().clear();

                createIssue.clickDatesTab();
                createIssue.getIdentificationDate().clear();
                createIssue.clickDetailsTab();
                createIssue.getOwnerTextbox().clear();


            });
            createIssue.clickCreateBtn();
            createIssue.hoverOverCreateBtn();


            createIssue.verifyErrorMessage(issueData.Errors.IssueSource);
            createIssue.verifyErrorMessage(issueData.Errors.Reporter);
            // createIssue.verifyErrorMessage(issueData.Errors.Severity);
            createIssue.verifyErrorMessage(issueData.Errors.Department);
            createIssue.verifyErrorMessage(issueData.Errors.Owner);
            createIssue.verifyErrorMessage(issueData.Errors.IdentificationDate);
            createIssue.verifyErrorMessage(issueData.Errors.Summary);
            createIssue.verifyErrorMessage(issueData.Errors.Submitter);
            createIssue.verifyErrorMessage(issueData.Errors.Description);
        });

    });

    it("Test string textboxes with the special characters and digits", () => {

        SideMenu.openIssueDashboard();
        dashboard.openIssueForm();
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {

            createIssue.getSummary().type(issueData.specialCharacters);
            createIssue.getSeverity().type(issueData.mandatory.ExtendedSeverity);
            createIssue.getIssueSource().type(issueData.mandatory.IssueSource)
            createIssue.getDepartment().type(issueData.mandatory.Department)
            createIssue.getSubmitter().type(issueData.specialCharacters);
            createIssue.getAuditField().type(issueData.specialCharacters);


            createIssue.getDescription().type(issueData.specialCharacters);

            createIssue.getAssignee().type(issueData.mandatory.assignee);
            createIssue.getReporter().type(issueData.mandatory.reporter);
            createIssue.clickDatesTab();
            createIssue.getIdentificationDate().type(issueData.mandatory.pastDate);
            createIssue.clickDetailsTab();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getOwnerTextbox().type(issueData.specialCharacters, { force: true })
                    .should('have.value', issueData.specialCharacters);

                createIssue.getOriginalReport().type(issueData.specialCharacters, { force: true });

                createIssue.getRootCauseDesc().type(issueData.specialCharacters);
                createIssue.getImpactedControl().type(issueData.specialCharacters, { force: true });
                createIssue.getCustomersImpacted().type(issueData.specialCharacters, { force: true });
                createIssue.getRecommendation().type(issueData.specialCharacters);
                createIssue.getManagementResponse().type(issueData.specialCharacters);
                createIssue.checkNoRadio();

            });
            createIssue.clickCreateBtn();
        });
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            //   summaryView.waitForEditBtn();
            cy.wait(50000);
            summaryView.clickEditBtn();
            createIssue.verifyEditFormTitle();
            createIssue.clickCreateBtn();
            cy.wait(10000);


        });
    });
    it("Test the string textbox fields with spaces only", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity);
                cy.wait(2000);
                createIssue.getSummary().clear().type(issueData.Spaces);
                createIssue.getSubmitter().clear().type(issueData.Spaces);
                createIssue.getAuditField().type(issueData.Spaces);
                createIssue.getDescription().type(issueData.Spaces);


                createIssue.clickDetailsTab();
                createIssue.getOwnerTextbox().clear().type(issueData.Spaces);
                createIssue.getOriginalReport().type(issueData.Spaces);
                createIssue.getRootCauseDesc().type(issueData.Spaces);
                createIssue.getImpactedControl().type(issueData.Spaces, { force: true });
                createIssue.getCustomersImpacted().type(issueData.Spaces, { force: true });
                createIssue.getRecommendation().type(issueData.Spaces);
                createIssue.getManagementResponse().type(issueData.Spaces);

            });
            createIssue.clickCreateBtn();
        });
    });
    it("Test the string textboxes with incorrect length", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            createIssue.IncorrectLengthStringBoxes().then((randomString) => {
                cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                    createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity);
                    cy.wait(2000);

                    createIssue.getSummary().clear().type(randomString);
                    createIssue.getSubmitter().clear().type(randomString);
                    createIssue.getAuditField().type(randomString);
                    createIssue.getDescription().type(issueData.mandatory.Description);

                    createIssue.clickDetailsTab();
                    createIssue.getOwnerTextbox().clear().type(randomString, { force: true })

                    createIssue.getImpactedControl().type(randomString, { force: true });
                    createIssue.getCustomersImpacted().type(randomString, { force: true });
                });
                createIssue.clickCreateBtn();
                cy.wait(5000);
                cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                    createIssue.clickSummaryTab();
                    cy.wait(2000);
                    createIssue.getSummary().type('{moveToEnd}').type('{backspace}');
                    createIssue.getSubmitter().type('{moveToEnd}').type('{backspace}');
                    createIssue.getAuditField().type('{moveToEnd}').type('{backspace}');

                    createIssue.clickDetailsTab();
                    createIssue.getOwnerTextbox().type('{moveToEnd}').type('{backspace}');

                    createIssue.getImpactedControl().type('{moveToEnd}').type('{backspace}');
                    createIssue.getCustomersImpacted().type('{moveToEnd}').type('{backspace}');
                });
                createIssue.clickCreateBtn();
                cy.wait(5000);


            })
        })

    });
    it("Test the string richtextArea boxes with incorrect length", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            createIssue.richTextIncorrectLength().then((randomString) => {
                cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                    createIssue.getSeverity().clear().type(issueData.mandatory.ExtendedSeverity)
                        .tab();
                    cy.wait(2000);

                    createIssue.getDescription().scrollIntoView({ ensureScrollable: false });
                    cy.wait(2000);

                    createIssue.getDescription().type(randomString, { force: true });
                });
                createIssue.clickCreateBtn();
                cy.wait(5000);
                cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                    createIssue.clickSummaryTab();
                    cy.wait(2000);
                    createIssue.getDescription().scrollIntoView({ ensureScrollable: false });
                    cy.wait(2000);

                    createIssue.getDescription().type('{moveToEnd}').type('{backspace}');
                });
                createIssue.clickCreateBtn();
                cy.wait(5000);

            });

        })


    });
    it("Test numeric textboxes with incorrect and negative values", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSeverity().type(issueData.mandatory.ExtendedSeverity);
                cy.wait(2000);
                createIssue.getDescription().type(issueData.mandatory.Description);
                createIssue.clickDetailsTab();

                createIssue.getActualLoss().type(issueData.NumericValues.string);
                createIssue.getPotentialLoss().type(issueData.NumericValues.string);
                createIssue.getNoOfCustomersImpacted().type(issueData.NumericValues.string).tab();

                createIssue.getActualLoss().should("have.value", 0).clear().type(issueData.NumericValues.Negative);
                createIssue.getPotentialLoss().should("have.value", 0).clear().type(issueData.NumericValues.Negative);
                createIssue.getNoOfCustomersImpacted().should("have.value", 0).clear().type(issueData.NumericValues.Negative).tab();

                createIssue.getActualLoss().should("have.value", 0).clear().type(issueData.NumericValues.float);
                createIssue.getPotentialLoss().should("have.value", 0).clear().type(issueData.NumericValues.float);
                createIssue.getNoOfCustomersImpacted().should("have.value", 0).clear().type(issueData.NumericValues.floatRoundOff).tab();

                createIssue.getActualLoss().should("have.value", 0).clear().type(issueData.NumericValues.Large);
                createIssue.getPotentialLoss().should("have.value", 0).clear().type(issueData.NumericValues.Large);
                createIssue.getNoOfCustomersImpacted().should("have.value", 1).clear().type(issueData.NumericValues.Large);

                createIssue.getActualLoss().should("have.value", issueData.NumericValues.Max);
                createIssue.getPotentialLoss().should("have.value", issueData.NumericValues.Max);
                createIssue.getNoOfCustomersImpacted().should("have.value", issueData.NumericValues.Max);

            });
            createIssue.clickCreateBtn();
        });

    });
    it("Test date fields with the incorrect values", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSeverity().type(issueData.mandatory.ExtendedSeverity);
                cy.wait(2000);

                createIssue.clickDatesTab();
                createIssue.getIdentificationDate().type(issueData.Date.string);
                createIssue.getEventOccurence().type(issueData.Date.incorrectFormat);
                createIssue.getReportDate().type(issueData.Date.incorrectFormat1);
                createIssue.getDueDate().type(issueData.Date.incorrectFormat2).tab();

                createIssue.getIdentificationDate().should('have.value', '');
                createIssue.getEventOccurence().should('have.value', '');
                createIssue.getReportDate().should('have.value', '');
                createIssue.getDueDate().should('have.value', '');
            });
        });

    })
    it("Test date fields with past values", () => {
        createIssueMandatoryFields(issueData);
        cy.wait(40000);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSeverity().type(issueData.mandatory.ExtendedSeverity);
                cy.wait(2000);
                createIssue.getDescription().type(issueData.mandatory.Description);
                createIssue.clickDatesTab();

                createIssue.getIdentificationDate().clear().type(issueData.Date.pastValue);
                createIssue.getEventOccurence().type(issueData.Date.pastValue);
                createIssue.getReportDate().type(issueData.Date.pastValue);
                createIssue.getDueDate().type(issueData.Date.pastValue);
                createIssue.getRemediationTargetDate().type(issueData.Date.pastValue);

                createIssue.clickDetailsTab();

            });
            createIssue.clickCreateBtn();
        });

    });
    it("Test the default behavior and visibility of linked Items field depending on the Repeat Finding checkbox", () => {

        createIssueMandatoryFields(issueData);
        cy.wait(40000);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.clickDetailsTab();

                createIssue.getNoRadio().should('be.checked')
                createIssue.getLinkedItemBtn().should('not.be.visible');
                createIssue.checkYesRadio();
                cy.wait(1000);
                createIssue.getLinkedItemBtn().should('be.visible');
                createIssue.checkNoRadio();
                cy.wait(1000);
                createIssue.getLinkedItemBtn().should('not.be.visible');
                createIssue.checkYesRadio();
            });
        });

    });

    it("Test new data for the Issue Source on the Edit Issue form", () => {

        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openIssueAdministration();
            SideMenu.openIssueSources();
            issueSource.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                issueSource.textArea().type(randomString).tab();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getIssueSource().clear().type(firstValue);
                        cy.wait(2000);
                        createIssue.clickIssueSourceArrow();
                    });
                    createIssue.getHighlightedOption().should("exist").and("contain.text", firstValue);
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.clickIssueSourceArrow();

                    })
                    createIssue.clickCreateBtn();
                    cy.wait(5000);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openIssueSources();
                issueSource.searchBox().first().type(randomString);
                cy.wait(3000);
                issueSource.clickActionIcon();
            });

            cy.createRandomString(7).then((randomString) => {
                issueSource.clearSearchedTextBox().type(randomString).tab();
                cy.wait(2000);
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(firstValue);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                        // });
                        // createIssue.getHighlightedOption().should("not.exist");
                        // cy.get(locators.issueManagement.createForm.popupDiv).within(() => {    
                        // createIssue.clickRemoveOptionIcon();
                        createIssue.getIssueSource().type(randomString);
                        cy.wait(2000);
                        createIssue.clickIssueSourceArrow();
                    })
                    createIssue.getHighlightedOption().should("exist").and("contain.text", randomString);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openIssueSources();
                issueSource.searchBox().first().type(randomString);
                cy.wait(2000);

                issueSource.openStatusDropdown();
                cy.wait(2000);
                issueSource.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getIssueSource().type(randomString);
                        cy.wait(2000);
                        createIssue.clickIssueSourceArrow();

                    });
                    createIssue.getHighlightedOption().should("not.exist");
                });

            });



        })

    });
    it("Test new data for the Regulator or Agency dropdown on the Edit Issue form", () => {

        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openIssueAdministration();
            SideMenu.openEntitiesModule();
            issueSource.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                issueSource.textArea().type(randomString).tab();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                        createIssue.removeSelectedOption();
                        createIssue.getEntity().type(firstValue);
                        cy.wait(2000);
                        createIssue.dropdownIntelliSense().click();
                        cy.wait(2000);
                    });
                    createIssue.getSelectedDropdownOption().eq(0).should("exist");
                    createIssue.clickCreateBtn();
                    cy.wait(5000);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openEntitiesModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(3000);
                issueSource.clickActionIcon();
            });

            cy.createRandomString(7).then((randomString) => {
                issueSource.clearSearchedTextBox().type(randomString).tab();
                cy.wait(2000);
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(firstValue);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                        // });
                        // createIssue.getHighlightedOption().should("not.exist");
                        // cy.get(locators.issueManagement.createForm.popupDiv).within(() => {    
                        // createIssue.clickRemoveOptionIcon();
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                    })
                    // createIssue.getHighlightedOption().should("exist").and("contain.text",randomString);                        
                })
                SideMenu.openIssueAdministration();
                SideMenu.openEntitiesModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(2000);

                issueSource.openStatusDropdown();
                cy.wait(2000);
                issueSource.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {


                        // 

                    });
                    // createIssue.getHighlightedOption().should("not.exist");
                });

            });



        })

    });

    it("Test any new data for the Issue Type dropdown on the edit Issue form", () => {
        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openIssueAdministration();
            SideMenu.openIssueTypes();
            issueSource.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                issueSource.textArea().type(randomString).tab();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getIssueType().type(firstValue);
                        cy.wait(2000);
                        createIssue.clickIssueTypeArrow();
                    });
                    createIssue.getHighlightedOption().should("exist").and("contain.text", firstValue);
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.clickIssueTypeArrow();

                    })
                    createIssue.clickCreateBtn();
                    cy.wait(5000);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openIssueTypes();
                issueSource.searchBox().first().type(randomString);
                cy.wait(3000);
                issueSource.clickActionIcon();
            });

            cy.createRandomString(7).then((randomString) => {
                issueSource.clearSearchedTextBox().type(randomString).tab();
                cy.wait(2000);
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(firstValue);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                        // });
                        // createIssue.getHighlightedOption().should("not.exist");
                        // cy.get(locators.issueManagement.createForm.popupDiv).within(() => {    
                        // createIssue.clickRemoveOptionIcon();
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                    })
                    // createIssue.getHighlightedOption().should("exist").and("contain.text",randomString);                        
                })
                SideMenu.openIssueAdministration();
                SideMenu.openIssueTypes();
                issueSource.searchBox().first().type(randomString);
                cy.wait(2000);

                issueSource.openStatusDropdown();
                cy.wait(2000);
                issueSource.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();

                    });
                    // createIssue.getHighlightedOption().should("not.exist");
                });

            });



        })

    });

    it("Test new data for the Severity dropdown on the edit Issue form", () => {

        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openIssueAdministration();
            SideMenu.openSeverityModule();
            issueSource.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                issueSource.textArea().type(randomString).tab();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getSeverity().type(firstValue);
                        cy.wait(2000);
                        createIssue.clickSeverityArrow();
                    });
                    createIssue.getHighlightedOption().should("exist").and("contain.text", firstValue);
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                        createIssue.clickSeverityArrow();

                    })
                    createIssue.clickCreateBtn();
                    cy.wait(5000);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openSeverityModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(3000);
                issueSource.clickSeverityEditBtn();
            });

            cy.createRandomString(7).then((randomString) => {
                issueSource.clearSearchedTextBox().type(randomString).tab();
                cy.wait(2000);
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(firstValue);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                        // });
                        // createIssue.getHighlightedOption().should("not.exist");
                        // cy.get(locators.issueManagement.createForm.popupDiv).within(() => {    
                        // createIssue.clickRemoveOptionIcon();
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                    })
                    // createIssue.getHighlightedOption().should("exist").and("contain.text",randomString);                        
                })
                SideMenu.openIssueAdministration();
                SideMenu.openSeverityModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(2000);

                issueSource.openStatusDropdown();
                cy.wait(2000);
                issueSource.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();

                    });
                    // createIssue.getHighlightedOption().should("not.exist");
                });

            });



        })

    });

    it("Test new data for the Root Cause dropdown on the Edit Issue form", () => {
        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openIssueAdministration();
            SideMenu.openRootCauseModule();
            issueSource.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                issueSource.textArea().type(randomString).tab();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                        createIssue.clickDetailsTab();
                        createIssue.getRootCause().type(firstValue);
                        cy.wait(2000);
                        createIssue.clickRootCauseArrow();
                    });
                    createIssue.getHighlightedOption().should("exist").and("contain.text", firstValue);
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.clickRootCauseArrow();

                    })
                    createIssue.clickCreateBtn();
                    cy.wait(5000);
                })
                SideMenu.openIssueAdministration();
                SideMenu.openRootCauseModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(3000);
                issueSource.clickActionIcon();
            });

            cy.createRandomString(7).then((randomString) => {
                issueSource.clearSearchedTextBox().type(randomString).tab();
                cy.wait(2000);
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.clickDetailsTab();
                        // createIssue.getIssueSource().type(firstValue);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                        // });
                        // createIssue.getHighlightedOption().should("not.exist");
                        // cy.get(locators.issueManagement.createForm.popupDiv).within(() => {    
                        // createIssue.clickRemoveOptionIcon();
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();
                    })
                    // createIssue.getHighlightedOption().should("exist").and("contain.text",randomString);                        
                })
                SideMenu.openIssueAdministration();
                SideMenu.openRootCauseModule();
                issueSource.searchBox().first().type(randomString);
                cy.wait(2000);

                issueSource.openStatusDropdown();
                cy.wait(2000);
                issueSource.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();
                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.clickDetailsTab();
                        // createIssue.getIssueSource().type(randomString);
                        // cy.wait(2000);
                        // createIssue.clickIssueSourceArrow();

                    });
                    // createIssue.getHighlightedOption().should("not.exist");
                });

            });



        });

    });
    it("Delete the Severity entry that we selected while creating the issue form and verify the behavior in the Edit Issue form", () => {

        //cover two cases after the fix
    });

    it("Test new data for the Subject Area dropdown on the edit issue form", () => {
        createIssueWithUniqueSummaryField(issueData).then((summary) => {

            let firstValue;
            SideMenu.openRegCategories();
            categories.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                categories.getNamefield().type(randomString);
                categories.clickSave();
                cy.wait(2000);

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getSubjectArea().scrollIntoView({ ensureScrollable: false });
                        createIssue.removeSelectedOption();
                        createIssue.getSubjectArea().type(randomString);
                        cy.wait(2000);
                        createIssue.dropdownIntelliSense().click();
                    });
                    createIssue.clickCreateBtn();
                    cy.wait(10000);
                });
                SideMenu.openRegCategories();
                categories.clickFilterBrn();
                categories.getFilterNameField().type(randomString);
                cy.wait(3000);
                categories.clickApplyBtn();
                categories.clickSearchedCategory();

                cy.createRandomString(7).then((randomString) => {
                    categories.getNamefield().clear().type(randomString);
                    categories.clickSave();
                    cy.wait(2000);

                    SideMenu.openIssueDashboard();
                    dashboard.openIssuesTab();
                    dashboard.searchIssueTicket(summary);
                    dashboard.openFirstTicket();

                    cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                        summaryView.clickEditBtn();
                        cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                            createIssue.getSubjectArea().scrollIntoView({ ensureScrollable: false });
                            //write logic here later

                        });
                    });


                });

            });

        });
    });
    it("Test new data for the Business Area dropdown on the edit Issue form", () => {

        createIssueWithUniqueSummaryField(issueData).then((summary) => {
            let firstValue;
            SideMenu.openBusinessArea();
            BA.clickBusinessArea_Tab();
            BA.clickAddBtn();
            cy.createRandomString(7).then((randomString) => {
                firstValue = randomString;
                BA.textArea().type(randomString).tab();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        createIssue.getBusinessArea().type(randomString);
                        cy.wait(2000);
                        createIssue.clickBA_DropdownArrow();
                        createIssue.getHighlightedOption().should("exist").and("contain.text", randomString);


                    });
                    createIssue.clickCreateBtn();
                    cy.wait(10000);
                });
                SideMenu.openBusinessArea();
                BA.clickBusinessArea_Tab();
                BA.getSearchbox().type(randomString);
                cy.wait(5000);

                BA.editSearchedEntry();



            });
            cy.createRandomString(7).then((randomString) => {

                BA.getSearchedTextArea().clear().type(randomString).tab();
                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        //write the logic later
                    });
                });
                SideMenu.openBusinessArea();
                BA.clickBusinessArea_Tab();
                BA.getSearchbox().type(randomString);
                cy.wait(5000);
                BA.openStatusBtn();
                BA.clickInactiveOption();

                SideMenu.openIssueDashboard();
                dashboard.openIssuesTab();
                dashboard.searchIssueTicket(summary);
                dashboard.openFirstTicket();

                cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
                    summaryView.clickEditBtn();
                    cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                        //write the logic later
                    });
                });
            });

        });

    });

    it("Update Issue form by removing assignee, also make sure to remove issue process owner", () => {

        SideMenu.openCustomerProfile();
        CusProfile.removeProcessOwnerUser();
        CusProfile.clickSaveButton();

        createIssueMandatoryFields(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getAssignee().clear();
            });
            createIssue.clickCreateBtn();
        });
    });

    it("Update Issue form by removing assignee, but make sure that issue process owner is defined", () => {

        SideMenu.openCustomerProfile();
        CusProfile.defineIssueProcessOwner(issueData.ProcessOwner);
        CusProfile.clickSaveButton();

        SideMenu.openIssueDashboard();
        createIssueMandatoryFields(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getAssignee().clear();
            });
            createIssue.clickCreateBtn();
        });

    })

    it("Test the visibility of Assignee and Group Assignee fields dependent on the Assignee Type field", () => {
        createIssueMandatoryFields(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getGroupAssignee().should("not.be.visible");
                createIssue.getAssignee().should("be.visible");

                createIssue.checkGroupRadio();
                cy.wait(1000);
                createIssue.getGroupAssignee().should("be.visible");
                createIssue.getAssignee().should("not.be.visible");

                createIssue.checkSingleRadio();
                cy.wait(1000);
                createIssue.getGroupAssignee().should("not.be.visible");
                createIssue.getAssignee().should("be.visible");

            });
        });


    });
    it("Test if the Assign to Me button gets the correct logged in user in the edit mode", () => {

        createIssueMandatoryFields(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getAssignee().clear();
                createIssue.clickAssignToMeBtn();
            });
            createIssue.clickCreateBtn();
            summaryView.verifyAssignee(issueData.loggedInUser);
        });

    });
    it("Click on the cancel button with and without changing any fields in the edit form", () => {

        createIssueMandatoryFields(IssueDate);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getCancelBtn().click();
                cy.wait(2000);
            });
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getSummary().type(newText).type(issueData.mandatory.summary);
                createIssue.getCancelBtn().click();
                cy.wait(2000);
            });
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.getIssueSource().type(newText).type(issueData.mandatory.IssueSource);
                createIssue.getCancelBtn().click();
                cy.wait(2000);
            });
        });

    });

    it("Remove existing notifiers and add new and check the emails", () => {
        createIssueWithUniqueSummaryField(issueData);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getNotify().clear().type(issueData.Emails.Multiple);
            });
            createIssue.clickCreateBtn();
            // call the method to check email for both inboxes
        });


    });
    it("Test the notifier email with multiple emails in the edit mode", () => {
        createIssueWithUniqueSummaryField(issueData);

        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {

                createIssue.getNotify().clear().type(issueData.Emails.MultipleCorrect);
            });
            createIssue.clickCreateBtn();
            // call the method to check email for both new inboxes
        });

    });
    it("Test updating issue form by not linking any items when the Repeat Finding radio box is checked", () => {

        createIssueMandatoryFields(issueData);
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            summaryView.clickEditBtn();
            cy.get(locators.issueManagement.createForm.popupDiv).within(() => {
                createIssue.clickDetailsTab();
                createIssue.checkYesRadio();

            });
            createIssue.clickCreateBtn();
        });


    });
    //need to add test case for organization hierarchy when the fix is ready
    //test cases for linked items
    //test case for owner dropdown if changed after creating the issue form
    //add test case for group changed and email verification
    //test case for mandatory field check when owner field is a dropdown
    //verify issue id in the title as well
    //add cases for documents/requirements/risks and that uploaded documents save in the correct folder
    // on the DMS
    //add test case for severity - irrelevant fields should disappear

});