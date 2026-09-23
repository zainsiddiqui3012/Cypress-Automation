import RcsaAuditLogsPage from "../../support/POM/RiskRegister/RCSA_AuditLogs";
import rcsaAuditLogHelpers from "../../support/POM/RiskRegister/rcsaAuditLogHelpers";
const rcsaAuditLogsPage = new RcsaAuditLogsPage();

describe(
  "RCSA Audit Logs Test Suite",
  { tags: ["@pd36750", "@rcsa", "@rcsa-audit-logs"] },
  () => {
    let testData;

    const session = () => {
      const withRMB = Cypress.env("riskManagement").withRMB;
      cy.loginWithSession(
        "login with DOCS User",
        withRMB.username,
        withRMB.password,
        withRMB.key
      );
    };

    before(() => {
      cy.fixture("RiskRegister/RCSA_AuditLogs.json").then((data) => {
        testData = data;
      });
    });

    context("Positive Test Cases", { tags: "@positive" }, () => {
      beforeEach(() => {
        session();
        cy.visitRiskRegister();
        rcsaAuditLogHelpers.navigateToRCSAAuditLog();
      });

      it(
        "Select a valid RCSA Review and a valid date range",
        { tags: ["@pd45346", "@smoke"] },
        () => {
          rcsaAuditLogsPage.testValidRCSAReviewAndDateRange();
        }
      );

      it(
        "Select multiple Business Units for a selected RCSA Review",
        { tags: ["@smoke", "@pd45347"] },
        () => {
          rcsaAuditLogsPage.testMultipleBusinessUnitsSelection();
        }
      );

      it("Filter by Business Unit: 'Legal Division' only", () => {
        rcsaAuditLogsPage.testBusinessUnitFilter();
      });

      it(
        "Filter by Business Unit: 'Legal Division' and RCSA Review",
        { tags: "@pd45351" },
        () => {
          rcsaAuditLogsPage.testLegalDivisionFilter();
        }
      );

      it(
        "Filter by Business Unit with no data in that RCSA Review",
        { tags: "@pd45352" },
        () => {
          rcsaAuditLogsPage.testNoDataBusinessUnit();
        }
      );

      it(
        "Select all Business Units and apply filters",
        { tags: "@pd45353" },
        () => {
          rcsaAuditLogsPage.testAllBusinessUnitsFilter();
        }
      );

      it(
        "Select RCSA Review, Business Unit and Date Range, click Search",
        { tags: "@pd45355" },
        () => {
          rcsaAuditLogsPage.testCompleteSearchScenario();
        }
      );

      it(
        "Filter audit grid by IP Address after search",
        { tags: "@pd45356" },
        () => {
          rcsaAuditLogsPage.testIPAddressFilter();
        }
      );

      it(
        "Apply multiple filters (RCSA Review, BU, date range, and IP address)",
        { tags: "@pd45358" },
        () => {
          rcsaAuditLogsPage.testMultipleFilters();
        }
      );

      it(
        "Click Search after clearing all filters",
        { tags: "@pd45359" },
        () => {
          rcsaAuditLogsPage.testClearAllFilters();
        }
      );

      it(
        "Search by a valid RCSA Review ID that exists in the system",
        { tags: "@pd45361" },
        () => {
          rcsaAuditLogsPage.testValidRCSAReviewID();
        }
      );

      it(
        "Search by Business Unit and verify “Field Name” and “Change” columns",
        { tags: "@pd45362" },
        () => {
          rcsaAuditLogsPage.testFieldNameAndChangeColumns();
        }
      );
    });

    context("Negative Test Cases",{tags:"@negaive"}, () => {
      beforeEach(() => {
        session();
        cy.visitRiskRegister();
        rcsaAuditLogHelpers.navigateToRCSAAuditLog();
      });

      it(
        "Select RCSA Review but leave Date Range empty",
        { tags: "@pd45348" },
        () => {
          rcsaAuditLogsPage.testMissingDateRangeValidation();
        }
      );

      it(
        "Select Date Range where From Date > To Date",
        { tags: "@pd45349" },
        () => {
          rcsaAuditLogsPage.testInvalidDateRangeValidation();
        }
      );

      it(
        "Click Search without selecting RCSA Review",
        { tags: "@pd45354" },
        () => {
          rcsaAuditLogsPage.testMissingRCSAReviewValidation();
        }
      );

      it("Select a future date in Date Range", { tags: "@pd45360" }, () => {
        rcsaAuditLogsPage.testFutureDateValidation();
      });
    });

    context("Grid Functionality Tests",{tags:"@filter"}, () => {
      beforeEach(() => {
        // Setup basic search results for grid tests
        session();
        cy.visitRiskRegister();
        rcsaAuditLogHelpers.navigateToRCSAAuditLog();
        rcsaAuditLogsPage.testCompleteSearchScenario();
      });

      it("Should filter by Risk column", () => {
        rcsaAuditLogHelpers.filterByRisk("Risk Def Automation 1 for RCSA - 14-10");
        rcsaAuditLogHelpers.validateColumnData(
          rcsaAuditLogHelpers.locators.riskColumn,
          testData.expectedResults.auditResult.risk
        );
      });

      it("Should filter by BU column", () => {
        rcsaAuditLogHelpers.filterByBU("BU Automation for RCSA 1 - 14-10");
        rcsaAuditLogHelpers.validateColumnData(
          rcsaAuditLogHelpers.locators.buColumn,
          testData.expectedResults.auditResult.bu,
          testData.expectedResults.auditResult.filterIndex.bu
        );
      });

      it("Should filter by Field Name column", () => {
        rcsaAuditLogHelpers.filterByFieldName(
          testData.expectedResults.auditResult.fieldName
        );
        rcsaAuditLogHelpers.validateColumnData(
          rcsaAuditLogHelpers.locators.fieldNameColumn,
          testData.expectedResults.auditResult.fieldName,
          testData.expectedResults.auditResult.filterIndex.columns
        );
      });

      it("Should filter by Change column", () => {
        rcsaAuditLogHelpers.filterByChange(
          testData.expectedResults.auditResult.reviewed
        );
        rcsaAuditLogHelpers.validateColumnData(
          rcsaAuditLogHelpers.locators.changeColumn,
          testData.expectedResults.auditResult.reviewed,
          testData.expectedResults.auditResult.filterIndex.columns
        );
      });

      it("Should filter by User column", () => {
        rcsaAuditLogHelpers.filterByUser(
          testData.expectedResults.auditResult.user
        );
        rcsaAuditLogHelpers.validateColumnData(
          rcsaAuditLogHelpers.locators.userColumn,
          testData.expectedResults.auditResult.user,
          testData.expectedResults.auditResult.filterIndex.columns
        );
      });

      it("Should scroll to bottom of audit grid", () => {
        rcsaAuditLogHelpers.scrollToBottomOfGrid();
      });

      it("Should validate all grid columns are present", () => {
        rcsaAuditLogHelpers.validateGridColumns();
      });
    });
  }
);
