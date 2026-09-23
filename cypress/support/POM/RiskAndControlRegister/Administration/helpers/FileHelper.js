class FileHelper {
  /**
   * Read data from a JSON file
   * @param {string} filePath - Path to the JSON file
   * @returns {Cypress.Chainable} - Cypress chainable with file data
   */
  static readJsonFile(filePath) {
    return cy.readFile(filePath);
  }

  /**
   * Write data to a JSON file
   * @param {string} filePath - Path to the JSON file
   * @param {object} data - Data to write
   * @returns {Cypress.Chainable} - Cypress chainable
   */
  static writeJsonFile(filePath, data) {
    return cy.writeFile(filePath, data);
  }

  /**
   * Update any nested property in JSON file
   * @param {string} filePath - Path to the JSON file
   * @param {string} type - Type of data (e.g., 'riskCatagory' or 'riskDefinition')
   * @param {string} sectionName - Section name (e.g., 'riskDefinition')
   * @param {string} property - Property name (e.g., 'category')
   * @param {any} value - Value to set
   * @returns {Cypress.Chainable} Cypress promise
   */
  static updateNestedProperty(filePath, type, sectionName, property, value) {
    return this.readJsonFile(filePath).then((readFile) => {
      if (!readFile[type][sectionName]) {
        readFile[type][sectionName] = {};
      }
      readFile[type][sectionName][property] = value;
      return this.writeJsonFile(filePath, readFile);
    });
  }

  /**
   * Update multiple properties in a section
   * @param {string} filePath - Path to the JSON file
   * @param {string} type - Type of data (e.g., 'riskCatagory' or 'riskDefinition')
   * @param {string} sectionName - Section name
   * @param {object} properties - Object with key-value pairs to update
   * @returns {Cypress.Chainable} Cypress promise
   */
  static updateSectionProperties(filePath, type, sectionName, properties) {
    return this.readJsonFile(filePath).then((readFile) => {
      if (!readFile[type][sectionName]) {
        readFile[type][sectionName] = {};
      }
      Object.assign(readFile[type][sectionName], properties);
      return this.writeJsonFile(filePath, readFile);
    });
  }

  /**
   * Update JSON import file properties for specific sections
   * @param {string} filePath - Path to the JSON import file
   * @param {string} sectionName - Name of the section to update
   * @param {number} index - Index of the item in the array to update
   * @param {object} properties - Properties to update
   * @example
   * updateImportJSONFile('path/to/file.json', 'Control Taxonomy', 0, {
   *  'Name*': 'new name' ,
   * 'Content Library*': 'new library'})
   * @returns {Cypress.Chainable} Cypress promise
   */
  static updateImportJSONFileSections(
    filePath,
    sectionName,
    index,
    properties
  ) {
    return cy.readFile(filePath).then((jsonData) => {
      // Validate that section exists and is an array
      if (!jsonData[sectionName]) {
        throw new Error(`Section "${sectionName}" not found in JSON file`);
      }

      if (!Array.isArray(jsonData[sectionName])) {
        throw new Error(`Section "${sectionName}" is not an array`);
      }

      // Validate that the index exists
      if (index >= jsonData[sectionName].length || index < 0) {
        throw new Error(
          `Index ${index} is out of bounds for section "${sectionName}"`
        );
      }

      // Update only the specified properties, preserve existing ones
      Object.keys(properties).forEach((key) => {
        jsonData[sectionName][index][key] = properties[key];
      });

      // Write the updated data back to file
      return cy.writeFile(filePath, jsonData).then(() => {
        cy.log(`Updated ${sectionName}[${index}] with properties:`, properties);
        return cy.wrap(jsonData);
      });
    });
  }

  /**
   * Update multiple sections in JSON import file
   * @param {string} filePath - Path to the JSON import file
   * @param {object} updates - Object containing section updates
   * @example
   * updateMultipleJSONSections(filePath, {
   *   "Control Taxonomy": { index: 0, properties: { "Name*": "new name" } },
   *   "Control Category": { index: 0, properties: { "Name*": "category name" } }
   * })
   * @returns {Cypress.Chainable} Cypress promise
   */
  static updateMultipleJSONSections(filePath, updates) {
    return cy.readFile(filePath).then((jsonData) => {
      Object.keys(updates).forEach((sectionName) => {
        const { index, properties } = updates[sectionName];

        // Validate section exists and is array
        if (!jsonData[sectionName] || !Array.isArray(jsonData[sectionName])) {
          throw new Error(`Section "${sectionName}" not found or not an array`);
        }

        // Validate index
        if (index >= jsonData[sectionName].length || index < 0) {
          throw new Error(`Index ${index} out of bounds for "${sectionName}"`);
        }

        // Update properties
        Object.keys(properties).forEach((key) => {
          jsonData[sectionName][index][key] = properties[key];
        });
      });

      return cy.writeFile(filePath, jsonData).then(() => {
        cy.log(`Updated multiple sections in JSON import file`);
        return cy.wrap(jsonData);
      });
    });
  }

  /**
   * Update specific section data in a file
   * @param {string} filePath - Path to the JSON file
   * @param {string} sectionName - Section name to update
   * @param {string} name - New name value
   * @param {string} categoryPath - Path to the category (e.g., 'riskCatagory')
   * @returns {Cypress.Chainable} - Cypress chainable
   */
  static updateSectionData(
    filePath,
    sectionName,
    name,
    categoryPath = "riskCatagory"
  ) {
    return this.readJsonFile(filePath).then((readData) => {
      const sectionData = readData[categoryPath][sectionName];
      sectionData.name = name;
      categoryPath === "riskCatagory"
        ? (sectionData.riskCategoryId = name)
        : (sectionData.riskDefinitionId = name);
      categoryPath === "controlCategory"
        ? (sectionData.controlCategoryId = name)
        : (sectionData.controlDefinitionId = name);

      return this.writeJsonFile(filePath, readData);
    });
  }

  /**
   * Get section data from file
   * @param {string} filePath - Path to the JSON file
   * @param {string} sectionName - Section name to get
   * @param {string} categoryPath - Path to the category
   * @returns {Cypress.Chainable} - Cypress chainable with section data
   */
  static getSectionData(filePath, sectionName, categoryPath = "riskCatagory") {
    return this.readJsonFile(filePath).then((readData) => {
      return readData[categoryPath][sectionName];
    });
  }

  /**
   * Update risk taxonomy name in target file
   * @param {string} sourceFilePath - Source file path
   * @param {string} targetFilePath - Target file path
   * @param {boolean} updated - Whether to use updated name
   * @param {string} updatedName - Updated name if applicable
   * @returns {Cypress.Chainable} - Cypress chainable
   */
  static updateRiskTaxonomyName(
    sourceFilePath,
    targetFilePath,
    updated = false,
    updatedName = null
  ) {
    const filePath = updated ? targetFilePath : sourceFilePath;

    return this.readJsonFile(filePath).then((readData) => {
      const riskTaxonomyName = updated
        ? updatedName
        : readData.customerProfileData.riskTaxanomy.riskTaxanomyName;

      return this.readJsonFile(targetFilePath).then((targetData) => {
        targetData.riskTaxonomy.riskTaxonomyName = riskTaxonomyName;
        return this.writeJsonFile(targetFilePath, targetData);
      });
    });
  }

  /**
   * Update Control taxonomy name in target file
   * @param {string} sourceFilePath - Source file path
   * @param {string} targetFilePath - Target file path
   * @param {boolean} updated - Whether to use updated name
   * @param {string} updatedName - Updated name if applicable
   * @returns {Cypress.Chainable} - Cypress chainable
   */
  static updateControlTaxonomyName(
    sourceFilePath,
    targetFilePath,
    updated = false,
    updatedName = null
  ) {
    const filePath = updated ? targetFilePath : sourceFilePath;

    return this.readJsonFile(filePath).then((readData) => {
      const controlTaxonomyName = updated
        ? updatedName
        : readData.customerProfileData.controlTaxanomy.controlTaxanomyName;

      return this.readJsonFile(targetFilePath).then((targetData) => {
        targetData.controlTaxonomy.controlTaxonomyName = controlTaxonomyName;
        return this.writeJsonFile(targetFilePath, targetData);
      });
    });
  }
}

export default FileHelper;
