import dayjs from "dayjs";

class DateHelper {
  /**
   * Generate current timestamp in specified format
   * @param {string} format - Date format (default: "MM/DD/YYYY hh:mm A")
   * @returns {string} - Formatted date string
   */
  static getCurrentTimestamp(format = "MM/DD/YYYY hh:mm A") {
    return dayjs().format(format);
  }

  /**
   * Generate unique name with timestamp
   * @param {string} baseName - Base name to append timestamp to
   * @param {string} format - Date format
   * @returns {string} - Unique name with timestamp
   */
  static generateUniqueNameWithTimestamp(
    baseName,
    format = "MM/DD/YYYY hh:mm A"
  ) {
    const timestamp = this.getCurrentTimestamp(format);
    return baseName + timestamp;
  }

  /**
   * Get formatted date
   * @param {Date} date - Date object (default: current date)
   * @param {string} format - Date format
   * @returns {string} - Formatted date string
   */
  static formatDate(date = new Date(), format = "MM/DD/YYYY") {
    return dayjs(date).format(format);
  }

  /*******************************************************************************
   * ***************** R I S K -- T Y P E --- M E T H O D S *****************************
   * ******************************************************************************/
  /**
   * Generate unique Risk Type name
   * @param {string} baseName - Base name to append timestamp to
   * @returns {string} - Unique Risk Type name
   */
  static generateUniqueRiskTypeName(baseName = "AutoRiskType") {
    return `${baseName}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Create unique Risk Type test data
   * @param {object} baseData - Base risk type data
   * @returns {object} - Risk type data with unique name
   */
  static createUniqueRiskTypeData(baseData) {
    const uniqueData = { ...baseData };
    if (uniqueData.name) {
      uniqueData.name = this.generateUniqueRiskTypeName(uniqueData.name);
    }
    return uniqueData;
  }

  /**
   * Generate long Risk Type name for validation testing
   * @param {number} length - Length of the name
   * @returns {string} - Long Risk Type name
   */
  static generateLongRiskTypeName(length = 256) {
    return "A".repeat(length);
  }

  /**
   * Generate Risk Type test data with special characters
   * @param {string} baseName - Base name for the risk type
   * @returns {object} - Risk type data with special characters
   */
  static generateSpecialCharsRiskTypeData(baseName = "TestRisk") {
    return {
      name: `${baseName}@#$%^&*()_${Date.now()}`,
      description: "Description with special chars: !@#$%^&*()",
    };
  }

  /**
   * Generate Risk Type data for different test scenarios
   * @param {string} scenario - Test scenario type
   * @returns {object} - Risk type data for the scenario
   */
  static generateRiskTypeDataForScenario(scenario) {
    const scenarios = {
      add: {
        name: this.generateUniqueRiskTypeName("AddTest"),
        description: "Test description for add scenario",
      },
      edit: {
        name: this.generateUniqueRiskTypeName("EditTest"),
        description: "Test description for edit scenario",
      },
      validation: {
        name: this.generateUniqueRiskTypeName("ValidationTest"),
        description: "Test description for validation scenario",
      },
      nameOnly: {
        name: this.generateUniqueRiskTypeName("NameOnly"),
        description: "",
      },
      longName: {
        name: this.generateLongRiskTypeName(256),
        description: "Valid description",
      },
      specialChars: this.generateSpecialCharsRiskTypeData(),
      duplicate: {
        name: "Meeting", // Existing risk type name
        description: "Attempting duplicate",
      },
    };

    return scenarios[scenario] || scenarios["add"];
  }

  /**
   * Generate array of unique Risk Type names
   * @param {number} count - Number of names to generate
   * @param {string} baseName - Base name prefix
   * @returns {Array} - Array of unique names
   */
  static generateMultipleUniqueRiskTypeNames(count, baseName = "MultiTest") {
    const names = [];
    for (let i = 0; i < count; i++) {
      names.push(this.generateUniqueRiskTypeName(`${baseName}_${i + 1}`));
    }
    return names;
  }

  /**
   * Generate Risk Type filter test data
   * @returns {object} - Filter test data
   */
  static generateRiskTypeFilterData() {
    return {
      fullName: "Risk Assessment",
      partialName: "Meet",
      mixedCase: "mEetiNg",
      noResults: "xyz123nonexistent",
      specialChars: "@#$%^&*()",
      blankFilter: "",
    };
  }

  /**
   * Generate Risk Type pagination test data
   * @returns {object} - Pagination test data
   */
  static generateRiskTypePaginationData() {
    return {
      recordsPerPage: ["5", "10", "15", "20", "-1"],
      defaultRecords: "5",
    };
  }

  /**
   * Clean up test data (for future use)
   * @param {Array} createdNames - Array of created risk type names to clean up
   */
  static cleanupRiskTypeTestData(createdNames) {
    // Implementation would depend on your cleanup strategy
  }

  /**
   * Generate unique Risk Type name with timestamp
   * @param {string} baseName - Base name for the risk type
   * @param {string} format - Date format (default: "MM/DD/YYYY_HH:mm:ss")
   * @returns {string} - Unique name with formatted timestamp
   */
  static generateUniqueRiskTypeNameWithTimestamp(
    baseName,
    format = "MM/DD/YYYY_HH:mm:ss"
  ) {
    const timestamp = moment().format(format.replace(/[\/\:]/g, "_"));
    return `${baseName}_${timestamp}`;
  }

  /**
   * Generate Risk Type test data with date-based naming
   * @param {object} baseData - Base risk type data
   * @param {string} dateFormat - Date format to use
   * @returns {object} - Risk type data with date-based unique name
   */
  static generateRiskTypeDataWithDate(
    baseData,
    dateFormat = "MMDDYYYY_HHmmss"
  ) {
    const uniqueData = { ...baseData };
    if (uniqueData.name) {
      uniqueData.name = this.generateUniqueRiskTypeNameWithTimestamp(
        uniqueData.name,
        dateFormat
      );
    }
    return uniqueData;
  }

  /**
   * Get current timestamp for Risk Type naming
   * @returns {string} - Current timestamp
   */
  static getCurrentTimestampForRiskType() {
    return moment().format("YYYY-MM-DD_HH-mm-ss");
  }

  /**
   * Generate Risk Type name with current date
   * @param {string} baseName - Base name for the risk type
   * @returns {string} - Risk type name with current date
   */
  static generateRiskTypeNameWithCurrentDate(baseName = "RiskType") {
    const currentDate = moment().format("MMDDYYYY");
    const currentTime = moment().format("HHmmss");
    return `${baseName}_${currentDate}_${currentTime}`;
  }
}

export default DateHelper;
