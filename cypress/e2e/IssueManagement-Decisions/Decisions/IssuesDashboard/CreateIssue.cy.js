import Agencies from "../../../../support/POM/Regulations/Agencies"
import Areas from "../../../../support/POM/Regulations/Areas";
import Categories from "../../../../support/POM/Regulations/Categories";
import BSASubCategory from "../../../../support/POM/Regulations/BSASubCategory";
import Business_Area_PO from "../../../../support/POM/STARTRCSA_PO/Business_Area_PO"
import OrganizationalHierarchy from "../../../../support/POM/Administration/OrganizationHierarchy";
import Users from "../../../../support/POM/Administration/Users";
import { KriMyTaxonomy } from "../../../../support/POM/RiskModule_PO/KriMyTaxonomy";
import IssueDashboard from "../../../../support/POM/IssueManagement_PO/IssueDashboard"
import BusinessArea from "../../../../fixtures/RCSAAuditLog/BusinessArea.json";
import IssueUtility from "../../../../support/POM/IssueManagement_PO/Decisions/IssueUtility";
import CreateIssue from "../../../../support/POM/IssueManagement_PO/Decisions/CreateIssue";
import Issue_Severity from "../../../../support/POM/IssueManagement_PO/Decisions/Issue_Severity";
import SummaryIssue from "../../../../support/POM/IssueManagement_PO/Decisions/SummaryIssue";
import CustomerProfile from "../../../../support/POM/Administration/CustomerProfile";
const createIssueSetupData = "cypress/fixtures/IssueManagementDecisions/Decisions/CreateIssueSetupData.json";
const organizationalHierarchyData = "cypress/fixtures/Administration/organizationalHierarchy.json";
const businessAreaData = "cypress/fixtures/RCSAAuditLog/BusinessArea.json"
const userFilePath = "cypress/fixtures/Administration/Users.json";
const userCredentials = "cypress/fixtures/Administration/UserCredentials.json";


describe("Verify the functionality of Create Issue", { tags: ["@decision", "@create-issue", "@issue-dashboard", "@regression", "@issue-management", "@issue-managementv2", "@release5.21"] }, () => {

    const agency = new Agencies();
    const areas = new Areas();
    const categories = new Categories();
    const bsaSubCategory = new BSASubCategory();
    const business_Area_PO = new Business_Area_PO();
    const organizationalHierarchy = new OrganizationalHierarchy();
    const users = new Users();
    const risk = new KriMyTaxonomy();
    const issueUtility = new IssueUtility();
    const issueDashboard = new IssueDashboard();
    const createIssue = new CreateIssue();
    const issueSeverity = new Issue_Severity()
    const summaryIssue = new SummaryIssue();
    const customerProfile = new CustomerProfile();
    const issueManagementUser = Cypress.env("ISSUE_USER");
    const noneUser = Cypress.env("kxi").none;

    let keys = {};
    before(() => {
        cy.readFile(createIssueSetupData).then(data => {
            keys = data.keys;
        })
    })

    context("Create Issue Functionality", () => {
        beforeEach(() => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
           
        });

         it("Create Issue with Severity Simple", { tags: ["@smoke", "@severity-simple", "@31069"] }, () => {
             cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then((data) => {
                issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary)
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary)
            });
            cy.readFile(createIssueSetupData).then((data) => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.enterDataInDescription('abc');
                createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                createIssue.selectRegulatorAgency(data.setup.regulatorAgency.regulatorAgencyFullName);
                createIssue.selectIssueType(data.setup.issueType.issueTypeFullName);
                createIssue.enterAssociateProjectExamAudit(data.setup.summary.summaryFullName);
                createIssue.selectResponsibleDepartment(data.OrganizationalHierarchy.OG);
               //cy.readFile(userCredentials).then((credentialUser) => {
                createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.IssueAssignees.Assignee);
                createIssue.selectReporter(data.IssueAssignees.Reporter);
                createIssue.selectSubjectArea(data.setup.category.categoryFullName);
                createIssue.selectDocument(data.documentTree.documentParent, data.documentTree.documentChild);
                createIssue.selectRisk(data.riskTree.riskParent, data.riskTree.riskChild, data.riskTree.riskDisplayName);
                //createIssue.verifyDownloadDocument(data.fileName.documentFileName);
                createIssue.selectRisk(data.riskTree.riskParent, data.riskTree.riskChild, data.riskTree.riskDisplayName);
                createIssue.viewRiskData(data.riskTree.riskView);
                createIssue.selectVendor(data.setup.vendor.vendorFullName);
                createIssue.enterDataInNotifyField(data.notifications.email);
                createIssue.enterDateInIdentificationDate(data.date.currentDate);
                createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
                //createIssue.handleLinkedItemButton(createIssueSetupData, data.keys.existingIssueName, data.keys.childIssueName, data.textVerify.linkeItemModalText);
                //createIssue.addLinkedItemWithCondition(createIssueSetupData, data.validationValues.issueLink, data.validationValues.childLink, data.textVerify.linkeItemModalText, true);
                createIssue.clicksOnTab(data.tabs.keyDates);
                createIssue.enterReportDate(data.date.pastDate, 3);
                 createIssue.enterDueDate(data.date.futureDate, 6);
                createIssue.clicksOnTab(data.tabs.details);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.originalReport, 30);
                issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.recommendation);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.managementResponse);
           // });
                cy.readFile(createIssueSetupData).then((data) => {
                    createIssue.enterDataInRiskArea(data.setup.riskArea);
                    createIssue.clicksOnCreateButton().then(() => {
                        cy.readFile(createIssueSetupData).then((data) => {
                            data.setup.existingIssueName = data.setup.summary.summaryFullName;
                            cy.writeFile(createIssueSetupData, data);
                        })
                    })
                });
            });
        });

        it("Create Issue with Severity Extended", { tags: ["@smoke", "@severity-extended", "@31070"] }, () => {
             cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary)
            });
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                createIssue.selectRegulatorAgency(data.setup.regulatorAgency.regulatorAgencyFullName);
                createIssue.selectIssueType(data.setup.issueType.issueTypeFullName);
                createIssue.enterAssociateProjectExamAudit(data.setup.summary.summaryFullName);
                cy.readFile(organizationalHierarchyData).then(orgHierarchy => {
                    createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
                });
                cy.readFile(businessAreaData).then(businessAreasData => {
                    createIssue.selectBusinessArea(businessAreasData[0].BusinessAreaFullName);
                });

                //cy.readFile(userCredentials).then((credentialUser) => {


                    createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                    createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.IssueAssignees.Assignee);
                    createIssue.selectReporter(data.IssueAssignees.Reporter);
                    createIssue.selectApprover(data.IssueAssignees.Reporter);
                    createIssue.selectSubjectArea(data.setup.category.categoryFullName);
                    createIssue.selectDocument(data.documentTree.documentParent, data.documentTree.documentChild);
                    createIssue.selectRisk(data.riskTree.riskParent, data.riskTree.riskChild, data.riskTree.riskDisplayName);
                    createIssue.viewRiskData(data.riskTree.riskView)
                    createIssue.selectVendor(data.setup.vendor.vendorFullName);
                    createIssue.enterDataInNotifyField(data.notifications.email);
                    createIssue.enterDateInIdentificationDate(data.date.currentDate);
                    createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
                    //createIssue.handleLinkedItemButton(createIssueSetupData, data.keys.existingIssueName, data.keys.childIssueName, data.textVerify.linkeItemModalText);
                    createIssue.clicksOnTab(data.tabs.keyDates);
                    createIssue.enterReportDate(data.date.pastDate, 3);
                    createIssue.enterDueDate(data.date.futureDate, 6);
                    createIssue.enterInValidationTargetDate(data.date.pastDate, 1);
                    createIssue.clicksOnTab(data.tabs.details);
                    issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.originalReport, 30);
                    issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.rootCauseDescription);
                    issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.potentialLoss, 4);
                    issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.actualLoss, 6);
                    issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.numberOfCustomersImpacted, 3);
                    issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.howCustomersAreImpacted);
                    issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.recommendation);
                    issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.managementResponse);
               // });
                cy.readFile(createIssueSetupData).then(data => {
                    createIssue.enterDatInPotentialLoss(data.setup.potentialLoss);
                    createIssue.enterDataInActualLoss(data.setup.actualLoss);
                    createIssue.enterDataInRiskArea(data.setup.riskArea);
                    createIssue.enterDataInNumberOfCustomersImpacted(data.setup.numberOfCustomersImpacted);
                    createIssue.enterDataInHowCustomersImpacted(data.setup.howCustomersAreImpacted);
                    createIssue.clicksOnCreateButton().then(() => {
                        cy.readFile(createIssueSetupData).then(data => {
                            data.setup.existingIssueName = data.setup.summary.summaryFullName;
                            cy.writeFile(createIssueSetupData, data);
                        })
                    })
                });
            });
        });

        it("Should verify error message when user create the form leaving all the mandatory fields blank", { tags: ["@29692", "@31069"] }, () => {
             cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.clicksOnTab(data.tabs.keyDates);
                createIssue.clicksOnTab(data.tabs.summary)
                createIssue.selectRegulatorAgency(data.setup.regulatorAgency.regulatorAgencyFullName);
                createIssue.selectIssueType(data.setup.issueType.issueTypeFullName);
                createIssue.enterAssociateProjectExamAudit(data.setup.summary.summaryFullName);
                cy.readFile(businessAreaData).then(businessAreasData => {
                    createIssue.selectBusinessArea(businessAreasData[0].BusinessAreaFullName);
                });
               //cy.readFile(userCredentials).then((credentialUser) => {
                    createIssue.selectApprover(data.IssueAssignees.Reporter);
                //})
                createIssue.selectSubjectArea(data.setup.category.categoryFullName);
                // createIssue.selectRequirement(data.requirementTree.requirementParent, data.requirementTree.requirementChild);
                createIssue.selectDocument(data.documentTree.documentParent, data.documentTree.documentChild);
                createIssue.selectRisk(data.riskTree.riskParent, data.riskTree.riskChild, data.riskTree.riskDisplayName);
                createIssue.selectVendor(data.setup.vendor.vendorFullName);
                createIssue.enterDataInNotifyField(data.notifications.email);
                createIssue.clicksOnTab(data.tabs.keyDates);
                createIssue.enterReportDate(data.date.pastDate, 3);
                createIssue.enterDueDate(data.date.futureDate, 6);
                createIssue.enterInValidationTargetDate(data.date.pastDate, 1);
                createIssue.clicksOnTab(data.tabs.details);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.originalReport, 30);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.rootCauseDescription);
                issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.potentialLoss, 4);
                issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.actualLoss, 6);
                issueUtility.generateAndStoreRandomNumber(createIssueSetupData, data.keys.numberOfCustomersImpacted, 3);
                issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.howCustomersAreImpacted);
                issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.recommendation);
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.managementResponse);
                cy.readFile(createIssueSetupData).then(data => {
                    //  createIssue.enterDataInOriginalReport(data.setup.originalReport);
                    //  createIssue.selectRootCause(data.setup.rootCause.rootCauseFullName, data.setup.rootCauseDescription);
                    createIssue.enterDatInPotentialLoss(data.setup.potentialLoss);
                    createIssue.enterDataInActualLoss(data.setup.actualLoss);
                    createIssue.enterDataInRiskArea(data.setup.riskArea);
                    createIssue.enterDataInNumberOfCustomersImpacted(data.setup.numberOfCustomersImpacted);
                    createIssue.enterDataInHowCustomersImpacted(data.setup.howCustomersAreImpacted);
                    //  createIssue.enterDataInRecommendation(data.setup.recommendation);
                    //  createIssue.enterDataInManagementResponse(data.setup.managementResponse);
                    createIssue.createButtonValidationError(data.validationMessages.mandatoryFieldsValidation, 9);
                });
            });
            });
           


        it("Verify the string textbox fields with spaces only", { tags: "@27060" }, () => {
             cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(" ");
                //  createIssue.enterDataInDescription(" ");
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                createIssue.enterAssociateProjectExamAudit(" ");
                createIssue.selectResponsibleDepartment(data.OrganizationalHierarchy.OG);
                //cy.readFile(businessAreaData).then((businessAreasData) => {
                    //createIssue.selectBusinessArea(businessAreasData[0].BusinessAreaFullName)
                //});
                //cy.readFile(userCredentials).then((credentialUser) => {
                    createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                    createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.IssueAssignees.Assignee);
                    createIssue.selectReporter(data.IssueAssignees.Reporter);
                    createIssue.selectApprover(data.IssueAssignees.Reporter);
                    createIssue.selectSubjectArea(data.setup.category.categoryFullName);
                    createIssue.enterDataInNotifyField(" ");
                    createIssue.enterDateInIdentificationDate(data.date.currentDate);
                    createIssue.enterDataInOwnerField(" ");
                    createIssue.clicksOnTab(data.tabs.keyDates);
                    createIssue.enterReportDate(data.date.pastDate, data.date.dateAheadThree);
                    createIssue.enterDueDate(data.date.futureDate, data.date.dateAheadSix);
                    createIssue.enterInValidationTargetDate(data.date.pastDate, data.date.dateBeforeOne);
                    createIssue.clicksOnTab(data.tabs.details)
                    issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.howCustomersAreImpacted);
                    //   createIssue.enterDataInOriginalReport(" ");
                    //   createIssue.selectRootCause(data.setup.rootCause.rootCauseFullName, " ");
                    createIssue.enterDataInHowCustomersImpacted(" ");
                    //   createIssue.enterDataInRecommendation(" ");
                    //  createIssue.enterDataInManagementResponse(" ");
                    createIssue.createButtonValidationError(data.validationMessages.spacesOnlyFields, data.lengthOfItem.lenghtValidationCount);
                })
            })
        })

        it("Verify numeric textboxes with String values", { tags: "@27058" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                //generate random string on numeric field
                issueUtility.generateAndStoreRandomString(createIssueSetupData, data.keys.potentialLoss, 4);
                createIssue.clicksOnTab(data.tabs.details);
                cy.readFile(createIssueSetupData).then(data => {
                    createIssue.enterStringDataInNumericField(data.setup.potentialLoss)
                });
            });
        });

        it("Verify numeric textboxes with floating values", { tags: "@27057" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.clicksOnTab(data.tabs.details);
                createIssue.enterStringDataInNumericField(data.validationValues.numericFloatingValues)
            })
        })
        it("Verify validation on numeric textboxes with maximum length value", { tags: "@27058" }, () => {
             cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.clicksOnTab(data.tabs.details);
                createIssue.enterDataInNumericValueWithMaximumCharacters(data.validationValues.numericMaxValidation, data.messages.validationErrorForPotentialLoss, data.messages.validationErrorForActualLoss, data.messages.validationErrorForNoCustomersImpacted);
            })
        })

        it("Verify numeric textboxes with negative values", { tags: "@27058" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary)
                issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary)
            });
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                // createIssue.enterDataInDescription(data.setup.descriptionSummary);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                cy.readFile(organizationalHierarchyData).then(orgHierarchy => {
                    createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
                });
                // FIX: Remove userCredentials usage, use only data from fixture
                createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                createIssue.selectsAssigneeType(data.setup.assignee.assigneeType2, data.setup.assignee.groupAssigneeName);
                createIssue.selectReporter(data.IssueAssignees.Reporter);
                createIssue.enterDateInIdentificationDate(data.date.currentDate);
                createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
                createIssue.clicksOnTab(data.tabs.details);
                createIssue.enterDatInPotentialLoss(data.validationValues.numericNegativeValues);
                createIssue.enterDataInActualLoss(data.validationValues.numericNegativeValues);
                createIssue.enterDataInRiskArea(data.setup.riskArea);
                createIssue.enterDataInNumberOfCustomersImpacted(data.validationValues.numericNegativeValues);
                createIssue.enterDataInHowCustomersImpacted(data.setup.howCustomersAreImpacted);

                createIssue.clicksOnCreateButton().then(() => {
                    // Update existingIssueName with the current issue name after verifying the Edit button
                    cy.readFile(createIssueSetupData).then(data => {
                        data.setup.existingIssueName = data.setup.summary.summaryFullName; // Update existingIssueName
                        cy.writeFile(createIssueSetupData, data); // Save updated JSON
                    })
                })
            });
        })

        it("Verify date fields with incorrect values", { tags: "@27056" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.clicksOnTab(data.tabs.keyDates);
                createIssue.enterStringDataInDatesField(data.validationValues.invalidFormatOfDate)
                createIssue.enterStringDataInDatesField(data.validationValues.numericFloatingValues)
                createIssue.enterStringDataInDatesField(data.validationValues.numericMaxValidation)
                createIssue.enterStringDataInDatesField(data.validationValues.numericNegativeValues)
            })
        });

        it("Verify the field presence of Simple Severity", { tags: "@29684" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
                createIssue.fieldNotPresenceOfSimpleSeverity(data.tabs.keyDates, data.tabs.details);
            })
        });

        it("Verify the field presence of Extended Severity", { tags: "@29684" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.fieldPresenceOfExtendedSeverity(data.tabs.keyDates, data.tabs.details)
            })
        });

        it("Verify the visibility of Linked Item fields depending on the Repeat Finding / issue radio button", { tags: "@27046" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.repeatFindingIssueVisibility(data.setup.repeatFinding.yesOption)
                createIssue.repeatFindingIssueVisibility(data.setup.repeatFinding.noOption)
            })
        });

        it("Verify the Unassigned and Assign to me options for Assignee", { tags: "@27037" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then(data => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                createIssue.clicksOnCreateButton()
                createIssue.assigneeValidation()
                createIssue.selectAssigneeName(data.IssueAssignees.Assignee, true)
                createIssue.verifyAssignee(data.IssueAssignees.Assignee)

            })
        })

         it("Verify the presence/absence of owner dropdown on the issue form after checking/unchecking the relevant checkbox from customer profile screen", { tags: "@29683" }, () => {

            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession("IssueManagementUserLogin",
                issueManagementUser.USERNAME,
                issueManagementUser.PASSWORD,
                issueManagementUser.KEY);
            cy.visitCustomerProfile();
            customerProfile.checkIssueOwnerCheckbox()
            customerProfile.clickSaveButton();
            cy.visitIssueManagementDashboard();
            issueDashboard.clicksOnCreateIssueButton();
            cy.readFile(createIssueSetupData).then((data) => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.verifyOwnerFieldAsTextBoxOrDropDown(data.fields.dropdown)
                cy.visitCustomerProfile();
                customerProfile.unCheckIssueOwnerCheckbox()
                customerProfile.clickSaveButton();
                cy.visitIssueManagementDashboard();
                issueDashboard.clicksOnCreateIssueButton();
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                createIssue.selectSeverity(data.setup.severityExtendedFullName.severityExtendedFullName);
                createIssue.verifyOwnerFieldAsTextBoxOrDropDown(data.fields.textbox)
            })
        })


         it("Verify the Group Assignee and validate the value on the ticket", { tags: "@27041" }, () => {
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    // The remaining part of the test will be covered when we start work on summary view form
    cy.visitCustomerProfile();
    cy.readFile(createIssueSetupData).then((data) => {
        customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType2);
        customerProfile.setIssueProcessOwnerGroup(data.setup.assignee.groupAssigneeName);
        customerProfile.clickSaveButton();
        cy.visitIssueManagementDashboard();
        issueDashboard.clicksOnCreateIssueButton();
        issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
        issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);

        // Now continue the flow after data is generated
        cy.readFile(createIssueSetupData).then((data) => {
           // cy.readFile(userCredentials).then((credentialUser) => {
                createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
                // createIssue.enterDataInDescription(data.setup.descriptionSummary);
                createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
                createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
                cy.readFile(organizationalHierarchyData).then((orgHierarchy) => {
                    createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
                });
                createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.setup.assignee.groupAssigneeName);
                createIssue.selectReporter(data.IssueAssignees.Reporter);
                createIssue.enterDateInIdentificationDate(data.date.currentDate);
                createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
                createIssue.clicksOnCreateButton().then(() => {
                    // Update existingIssueName with the current issue name after verifying the Edit button
                    cy.readFile(createIssueSetupData).then((data) => {
                        data.setup.existingIssueName = data.setup.summary.summaryFullName; // Update existingIssueName
                        cy.writeFile(createIssueSetupData, data); // Save updated JSON
                    })
                    // Need to add validation on summary screen view form.
                })
                });
                // After creation, cleanup or further validation
                cy.visitCustomerProfile();
                customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType1);
                //customerProfile.removeProcessOwnerUser(data.setup.assignee.groupAssigneeName2);
                customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType1);
                customerProfile.clickSaveButton();
            });
        });

    it("Verify different Single assignee user than what is defined in the customer profile and create the form", { tags: "@27043" }, () => {
          cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    
        cy.visitCustomerProfile();
    cy.readFile(createIssueSetupData).then((data) => {
        customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType1);
        customerProfile.defineIssueProcessOwner(data.setup.assignee.singleAssigneeUser);
        customerProfile.clickSaveButton();
        cy.visitIssueManagementDashboard();
        issueDashboard.clicksOnCreateIssueButton();
        issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary)
        issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary)
    });
    cy.readFile(createIssueSetupData).then((data) => {
        createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
        //    createIssue.enterDataInDescription(data.setup.descriptionSummary);
        createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
        createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
        cy.readFile(organizationalHierarchyData).then((orgHierarchy) => {
            createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
        });
        //cy.readFile(userCredentials).then((credentialUser) => {
        createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
        createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.setup.assignee.singleAssigneeUser);
        createIssue.selectReporter(data.IssueAssignees.Reporter);
        createIssue.enterDateInIdentificationDate(data.date.currentDate);
        createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
        createIssue.clicksOnCreateButton().then(() => {
            // Update existingIssueName with the current issue name after verifying the Edit button
            cy.readFile(createIssueSetupData).then((data) => {
                data.setup.existingIssueName = data.setup.summary.summaryFullName; // Update existingIssueName
                cy.writeFile(createIssueSetupData, data); // Save updated JSON
            })
            //Need to add validation on summary screen view form.

            /** There should be correct assignee user then what is defined in the customer profile. 
              with the correct assignee i.e. the one that is defined in customer profile. */
        })
    });
});

it("Verify that select different assignee type than what is defined in the customer profile and create the form", { tags: "@27042" }, () => {
            
            cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    cy.visitCustomerProfile();
    cy.readFile(createIssueSetupData).then((data) => {
        customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType1);
        customerProfile.defineIssueProcessOwner(data.setup.assignee.singleAssigneeUser);
        customerProfile.clickSaveButton();
        cy.visitIssueManagementDashboard();
        issueDashboard.clicksOnCreateIssueButton();
        issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
        issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);
        // Chain the next steps after data is generated
        cy.readFile(createIssueSetupData).then((data) => {
            createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
            // createIssue.enterDataInDescription(data.setup.descriptionSummary);
            createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
            createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
            cy.readFile(organizationalHierarchyData).then((orgHierarchy) => {
                createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
                // Continue only after department is selected
                createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
                createIssue.selectsAssigneeType(data.IssueAssignees.AssigneeTypeSingle, data.setup.assignee.singleAssigneeUser);
                createIssue.selectReporter(data.IssueAssignees.Reporter);
                createIssue.enterDateInIdentificationDate(data.date.currentDate);
                createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
                createIssue.clicksOnCreateButton().then(() => {
                    cy.readFile(createIssueSetupData).then((data) => {
                        data.setup.existingIssueName = data.setup.summary.summaryFullName;
                        cy.writeFile(createIssueSetupData, data);
                    });
                    // Add validation on summary screen view form if needed
                });
                // After issue creation, clean up process owner
                cy.visitCustomerProfile();
                //customerProfile.removeProcessOwnerUser(data.setup.assignee.assigneeType1);
                customerProfile.clickSaveButton();
            });
        });
    });
});

it("Verify that the assignee user, not define any issue process owner in the customer profile", { tags: "@27040" }, () => {
    
      cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    cy.visitCustomerProfile();
    cy.readFile(createIssueSetupData).then((data) => {
        customerProfile.selectsIssueProcessOwnerType(data.setup.assignee.assigneeType1);
        //customerProfile.removeProcessOwnerUser(data.setup.assignee.assigneeType1);
        customerProfile.clickSaveButton();
    });
    cy.visitIssueManagementDashboard();
    issueDashboard.clicksOnCreateIssueButton();
    cy.readFile(createIssueSetupData).then((data) => {
        issueUtility.generateAndStoreItemWithDynamicKey(createIssueSetupData, data.keys.summary);
        issueUtility.generateAndStoreRandomAlphanumeric(createIssueSetupData, data.keys.descriptionSummary);
    });
    cy.readFile(createIssueSetupData).then((data) => {
        createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
        createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
        createIssue.selectIssueSource(data.setup.issueSource.issueSourceFullName);
        cy.readFile(organizationalHierarchyData).then((orgHierarchy) => {
            createIssue.selectResponsibleDepartment(data.setup.responsibleDepartment.name + orgHierarchy.newName);
        });
        createIssue.selectSubmitterName(data.IssueAssignees.submitterName);
        createIssue.selectsAssigneeType(data.setup.assignee.assigneeType1, data.IssueAssignees.submitterName);
        createIssue.selectReporter(data.IssueAssignees.submitterName);
        createIssue.enterDateInIdentificationDate(data.date.currentDate);
        createIssue.enterDataInOwnerField(data.IssueAssignees.submitterName);
        createIssue.clicksOnCreateButton().then(() => {
            cy.readFile(createIssueSetupData).then((data) => {
                data.setup.existingIssueName = data.setup.summary.summaryFullName;
                cy.writeFile(createIssueSetupData, data);
            });
        });
    });
});

it("Verify the special characters and digits in the Issue Source Name Field", { tags: "@27091" }, () => {
      cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    cy.visitIssueSource();
    cy.clickAddFromSubHeader();
    cy.readFile(createIssueSetupData).then((data) => {
        issueUtility.generateAndStoreItemWithSpecialChars(createIssueSetupData, data.keys.issueSource);
    });
    cy.readFile(createIssueSetupData).then((file) => {
        cy.fillAgGridInlineField(file.fields.textArea, file.setup.issueSource.issueSourceFullName);
        cy.log(file.setup.issueSource.issueSourceFullName);
        cy.fillAgGridInlineField(file.fields.select, file.statuses.active);
        cy.verifyToastMessageText(file.messages.successfulStatus, file.timeouts.default);
    });
    cy.visitIssueManagementDashboard();
    issueDashboard.clicksOnCreateIssueButton();
    cy.readFile(createIssueSetupData).then((data) => {
        createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
        createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
        createIssue.selectAndVerifyIssueSource(data.setup.issueSource.issueSourceFullName);
    });
});

it("Verify that the issue Source field with maximum characters in Create Issue form", { tags: "@27090" }, () => {
    
      cy.clearAllCookies();
            cy.ignoreNetworkLogs();
            cy.loginWithSession(
            "IssueManagementUserLogin",
            issueManagementUser.USERNAME,
            issueManagementUser.PASSWORD,
            issueManagementUser.KEY
    );
    cy.visitIssueSource();
    cy.clickAddFromSubHeader();
    cy.readFile(createIssueSetupData).then((data) => {
        issueUtility.generateAndStoreItemWithMaxLength(createIssueSetupData, data.keys.issueSource);
    });
    cy.readFile(createIssueSetupData).then((file) => {
        cy.fillAgGridInlineField(file.fields.textArea, file.setup.issueSource.issueSourceFullName, file.timeouts.delay);
        cy.log(file.setup.issueSource.issueSourceFullName);
        cy.fillAgGridInlineField(file.fields.select, file.statuses.active);
        cy.verifyToastMessageText(file.messages.successfulStatus, file.timeouts.default);
    });
    cy.visitIssueManagementDashboard();
    issueDashboard.clicksOnCreateIssueButton();
    cy.readFile(createIssueSetupData).then((data) => {
        createIssue.enterDataInSummaryField(data.setup.summary.summaryFullName);
        createIssue.selectSeverity(data.setup.severitySimpleFullName.severitySimpleFullName);
        createIssue.selectAndVerifyIssueSource(data.setup.issueSource.issueSourceFullName);
    });
});
});