const rcsaAuditLogHelpers = require("./rcsaAuditLogHelpers");
const locators = require("../../../fixtures/locators.json");
import testData from "../../../fixtures/RiskRegister/RCSA_AuditLogs.json";

class RCSAAuditLogsPage {
  helpers = rcsaAuditLogHelpers;
  locators = locators.risk.administration.riskCategory.rcsaAuditLog;

  // Test Case Methods
  
  /**
   * Tests valid RCSA review selection with business unit and date range
   * @description Validates that searching with valid RCSA review, business unit, and date range returns results
   * @param None - Uses testData.validTestData
   */
  testValidRCSAReviewAndDateRange() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBu);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
  }

  /**
   * Tests selection of multiple business units
   * @description Validates that multiple business units can be selected and return search results
   * @param None - Uses testData.validTestData.businessUnits
   */
  testMultipleBusinessUnitsSelection() {
    this.helpers.selectMultipleBusinessUnits(
      testData.validTestData.businessUnits
    );
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
  }

  /**
   * Tests validation when date range is missing
   * @description Validates that clicking search without date range shows mandatory error
   * @param None - Expects testData.errors.mandatoryError
   */
  testMissingDateRangeValidation() {
    this.helpers.clickSearch();
    this.helpers.validateErrorMessage(testData.errors.mandatoryError);
  }

  /**
   * Tests validation for invalid date range
   * @description Validates that invalid date range shows appropriate error message
   * @param None - Uses testData.validTestData.rcsaReview and testData.errors.invalidDateError
   */
  testInvalidDateRangeValidation() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.setInvalidDateRange();
    this.helpers.clickSearch();
    this.helpers.validateErrorMessage(testData.errors.invalidDateError);
  }

  /**
   * Tests business unit filter functionality
   * @description Validates that business unit filter correctly filters search results
   * @param None - Uses testData.validTestData.businessUnits[0] and testData.validTestData.selectedBu
   */
  testBusinessUnitFilter() {
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBU1);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
    this.helpers.validateColumnData(
      this.locators.buColumn,
      testData.validTestData.selectedBU1
    );
  }

  /**
   * Tests legal division filter functionality
   * @description Validates that legal division filter correctly filters search results by business unit
   * @param None - Uses testData.validTestData (rcsaReview, selectedBu, dateRange)
   */
  testLegalDivisionFilter() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBu);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateColumnData(
      this.locators.buColumn,
      testData.validTestData.selectedBu
    );
  }

  /**
   * Tests behavior when business unit has no data
   * @description Validates that selecting a business unit with no data shows no records message
   * @param None - Uses testData.validTestData.businessUnits[1]
   */
  testNoDataBusinessUnit() {
    this.helpers.selectBusinessUnit(testData.validTestData.businessUnits[1]);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.noData.startDate,
      testData.validTestData.dateRange.noData.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateNoRecordsMessage();
  }

  /**
   * Tests filtering with all business units selected
   * @description Validates that selecting all business units returns aggregated results
   * @param None - Uses testData.validTestData.businessUnits
   */
  testAllBusinessUnitsFilter() {
    this.helpers.selectMultipleBusinessUnits(
      testData.validTestData.businessUnits
    );
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
  }

  /**
   * Tests validation when RCSA review is missing
   * @description Validates that search can be performed without RCSA review selection
   * @param None - Uses testData.validTestData.dateRange
   */
  testMissingRCSAReviewValidation() {
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
  }

  /**
   * Tests complete search scenario with all filters
   * @description Validates full search workflow including grid columns and field name/change columns
   * @param None - Uses testData.validTestData (rcsaReview, selectedBu, dateRange)
   */
  testCompleteSearchScenario() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBu);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
    this.helpers.validateGridColumns();
    this.helpers.validateFieldNameAndChangeColumns();
  }

  /**
   * Tests IP address filter functionality
   * @description Validates that IP address filter correctly filters audit log results
   * @param None - Uses testData.validTestData.ipAddress
   */
  testIPAddressFilter() {
    this.testCompleteSearchScenario();
    this.helpers.filterByIPAddress(testData.validTestData.ipAddress);
    this.helpers.validateColumnData(
      this.locators.ipAddressColumn,
      testData.validTestData.ipAddress,
      5
    );
  }

  /**
   * Tests multiple filters applied simultaneously
   * @description Validates that multiple filters (risk, IP, BU, user) work together correctly
   * @param None - Uses testData.validTestData and testData.expectedResults.auditResult
   */
  testMultipleFilters() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBu);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.filterByRisk(testData.expectedResults.auditResult.risk);
    this.helpers.filterByIPAddress(testData.validTestData.ipAddress);
    this.helpers.filterByBU(testData.expectedResults.auditResult.bu);
    this.helpers.filterByUser(testData.expectedResults.auditResult.user);
    this.helpers.validateMultipleFiltersApplied();
  }

  /**
   * Tests clearing all applied filters
   * @description Validates that clearing all filters and searching shows mandatory error
   * @param None - Uses testData.validTestData.selectedBu and testData.errors.mandatoryError
   */
  testClearAllFilters() {
    this.testMultipleFilters();
    this.helpers.clearAllFilters();
    this.helpers.selectBusinessUnit(testData.validTestData.selectedBu); // to reset BU to default
    this.helpers.clearRCSAReviewSelection();
    this.helpers.clearDateRange();
    this.helpers.clickSearch();
    this.helpers.validateErrorMessage(testData.errors.mandatoryError);
  }

  /**
   * Tests validation for future date selection
   * @description Validates that selecting a future date shows validation error
   * @param None - Uses testData.validTestData.rcsaReview and testData.errors.invalidDateError
   */
  testFutureDateValidation() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.setFutureDate();
    this.helpers.clickSearch();
    // Should either show validation error or empty results
    this.helpers.validateErrorMessage(testData.errors.invalidDateError);
  }

  /**
   * Tests valid RCSA review ID with date range
   * @description Validates that searching with valid RCSA review ID and date range returns results
   * @param None - Uses testData.validTestData.rcsaReview and testData.validTestData.dateRange
   */
  testValidRCSAReviewID() {
    this.helpers.selectRCSAReview(testData.validTestData.rcsaReview);
    this.helpers.setDateRange(
      testData.validTestData.dateRange.startDate,
      testData.validTestData.dateRange.endDate
    );
    this.helpers.clickSearch();
    this.helpers.validateSearchResults();
  }

  /**
   * Tests field name and change columns validation
   * @description Validates that field name and change columns display correctly in audit logs
   * @param None - Calls testCompleteSearchScenario first
   */
  testFieldNameAndChangeColumns() {
    this.testCompleteSearchScenario();
    this.helpers.validateFieldNameAndChangeColumns();
  }
}

export default RCSAAuditLogsPage;