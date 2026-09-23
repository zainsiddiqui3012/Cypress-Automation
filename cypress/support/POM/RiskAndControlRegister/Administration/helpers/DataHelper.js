import DateHelper from "./DateHelper";

/**
 * DataHelper - Utility class for data generation and manipulation
 */
class DataHelper {
  /**
   * Generate unique name with timestamp
   * @param {string} baseName - Base name to append timestamp to
   * @returns {string} - Unique name with current timestamp
   */
  static generateUniqueName(baseName) {
    return `${baseName}_${Date.now()}`;
  }

  /**
   * Generate unique name with date format
   * @param {string} baseName - Base name to append timestamp to
   * @param {string} format - Date format (default: "MM/DD/YYYY_HH:mm:ss")
   * @returns {string} - Unique name with formatted timestamp
   */
  static generateUniqueNameWithDate(baseName, format = "MM/DD/YYYY_HH:mm:ss") {
    return DateHelper.generateUniqueNameWithTimestamp(baseName, format);
  }

  /**
   * Create test data with unique identifiers
   * @param {object} baseData - Base data object
   * @param {string} nameField - Field name that should be made unique (default: 'name')
   * @returns {object} - Data object with unique name
   */
  static createUniqueTestData(baseData, nameField = "name") {
    const uniqueData = { ...baseData };
    if (uniqueData[nameField]) {
      uniqueData[nameField] = this.generateUniqueName(uniqueData[nameField]);
    }
    return uniqueData;
  }

  /**
   * Generate random string of specified length
   * @param {number} length - Length of random string
   * @param {string} chars - Character set to use (default: alphanumeric)
   * @returns {string} - Random string
   */
  static generateRandomString(
    length,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate string that exceeds maximum length for validation testing
   * @param {number} maxLength - Maximum allowed length
   * @param {number} extraChars - Additional characters beyond max (default: 10)
   * @returns {string} - String that exceeds max length
   */
  static generateOverLengthString(maxLength, extraChars = 10) {
    return this.generateRandomString(maxLength + extraChars);
  }

  /**
   * Create test data variations for different test scenarios
   * @param {object} baseData - Base data object
   * @returns {object} - Object containing different data variations
   */
  static createTestDataVariations(baseData) {
    return {
      valid: this.createUniqueTestData(baseData),
      nameOnly: {
        name: this.generateUniqueName(baseData.name || "TestName"),
      },
      longName: {
        ...baseData,
        name: this.generateOverLengthString(255),
      },
      emptyName: {
        ...baseData,
        name: "",
      },
      duplicate: baseData, // Will be used for duplicate testing
    };
  }

  /**
   * Merge test data with dynamic values
   * @param {object} baseData - Base data object
   * @param {object} overrides - Values to override
   * @returns {object} - Merged data object
   */
  static mergeTestData(baseData, overrides = {}) {
    return { ...baseData, ...overrides };
  }
}

export default DataHelper;
