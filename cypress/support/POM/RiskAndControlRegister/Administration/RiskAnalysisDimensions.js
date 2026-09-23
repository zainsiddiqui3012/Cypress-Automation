import dayjs from "dayjs";
import data from "../../../../fixtures/RiskAndControlRegister/Administration/RiskAnalysisDimensions.json";
import locators from "../../../../fixtures/locators.json";
const writeFile =
  "cypress/fixtures/RiskAndControlRegister/Administration/writeRiskAnalysisDimensions.json";

class RiskAnalysis {
  /**
   * Clicks the "Add Dimension" button to create a new dimension row.
   */
  clickAddDimensionButton() {
    cy.get(locators.risk.riskAnalysis.clickAddDimensionButton, {
      timeout: 20000,
    })
      .should("be.visible")
      .click();
  }

  /**
   * Selects a unique value from the last opened Select2 dropdown
   * Works for likelihood, impact, or any new dimension
   * @param {string} locatorType
   */
  selectUniqueValue(locatorType) {
    const valueAppearLocator = `select[name='${locatorType}']`;

    // Step 1: collect already selected values for given dimension
    cy.get(valueAppearLocator).then(($allSelects) => {
      const usedValues = [...$allSelects]
        .map((sel) => sel.value)
        .filter(Boolean);

      // Step 2: get visible dropdown options
      cy.get(locators.risk.riskAnalysis.visibleValueOptions)
        .should("be.visible")
        .then(($options) => {
          const allOptions = [...$options].map((el) => el.textContent.trim());

          // Step 3: find first unused option
          const uniqueOption = allOptions.find(
            (opt) => !usedValues.includes(opt)
          );
          // Save this unique option temporarily (for writing later)
          this.lastSelectedValue = uniqueOption;

          // Step 4: click on that option
          cy.contains(
            locators.risk.riskAnalysis.visibleValueOptions,
            uniqueOption
          ).click({ force: true });
        });
    });
  }

  /**
   * Writes the last selected value to a JSON file.
   * @param {string} key - The key name to store (e.g. "likelihoodValue")
   */
  writeValue(key) {
    cy.readFile(writeFile).then((file) => {
      file[key] = this.lastSelectedValue; // save selected value
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Selects a duplicate value from the last opened Select2 dropdown.
   * Works only if at least one value is already selected in that dimension.
   *
   * @param {string} locatorType - The dimension type (e.g., "likelihoodValue").
   * @throws {Error} If no existing value is found to duplicate.
   */

  selectDuplicateValue(locatorType) {
    const selectLocator = `select[name='${locatorType}']`;
    const containerLocator = `div[id^='s2id_${locatorType}_']`;

    cy.get(selectLocator).then(($allSelects) => {
      const usedValues = [...$allSelects]
        .map((sel) => sel.value)
        .filter(Boolean);

      const duplicateValue = usedValues[0];

      //  Step 1: open dropdown from last row
      cy.get(containerLocator)
        .last()
        .find(locators.risk.riskAnalysis.clickValueOption)
        .click();

      //  Step 2: wait for dropdown options (support both old & new select2)
      cy.get("body")
        .find(locators.risk.riskAnalysis.visibleDropdownOptions)
        .should("be.visible")
        .then(() => {
          //  Step 3: pick the duplicate option
          cy.contains(
            locators.risk.riskAnalysis.visibleDropdownOptions,
            duplicateValue
          ).click();
        });
    });
  }

  /**
   * Picks a unique color for the given type (likelihood or impact).
   * Avoids duplicates by checking already used colors.
   *
   * @param {"likelihood"|"impact"} type
   */
  selectUniqueColor(type) {
    // Step 1: Collect already used colors
    cy.get(locators.risk.riskAnalysis.colorBandInputs).then(($inputs) => {
      const usedColors = $inputs
        .map((i, el) => el.value)
        .get()
        .filter(Boolean);

      // Step 2: Get the last input (for newest row)
      cy.get(locators.risk.riskAnalysis.colorBandInputs)
        .last()
        .invoke("attr", "name")
        .then((targetId) => {
          // Step 3: Open its color picker
          const paletteButton =
            locators.risk.riskAnalysis.paletteButton.replace(
              locators.risk.riskAnalysis.idTarget,
              targetId
            );
          cy.get(paletteButton).should("exist").click({ force: true });

          // Step 4: Collect swatches
          const swatchesContainer =
            locators.risk.riskAnalysis.swatchesContainer.replace(
              locators.risk.riskAnalysis.idTarget,
              targetId
            );

          cy.get(swatchesContainer).then(($swatches) => {
            const available = [...$swatches]
              .filter((el) => !el.classList.contains("clear"))
              .map((el) => ({
                color: el.getAttribute(locators.risk.riskAnalysis.dataColor),
                name: el.getAttribute(locators.risk.riskAnalysis.dataName),
                active: el.classList.contains("active"),
              }));

            // Step 5: Find unused + not active swatch
            const unique = available.find(
              (sw) => !usedColors.includes(sw.name) && !sw.active
            );

            // Step 6: Click that swatch
            const uniqueSwatch = locators.risk.riskAnalysis.uniqueSwatch
              .replace(locators.risk.riskAnalysis.idTarget, targetId)
              .replace(locators.risk.riskAnalysis.colorId, unique.color);

            cy.get(uniqueSwatch).click({ force: true });

            // Step 7: Verify input updated
            const inputByTarget =
              locators.risk.riskAnalysis.colorInputByTarget.replace(
                locators.risk.riskAnalysis.idTarget,
                targetId
              );

            cy.get(inputByTarget).should("have.value", unique.name);
          });
        });
    });
  }

  /**
   * Clicks the "Save" button to save the current dimension configuration.
   */
  clickSaveButton() {
    cy.get(locators.risk.riskAnalysis.saveBtn, { timeout: 10000 }).click();
  }

  /**
   * Checks the stored value is visible in the correct input field
   * Works for likelihood, impact, inherent, etc.
   * @param {string} locatorType - e.g. "likelihoodLabel" | "impactLabel" | "inherentLabel"
   */
  storedValueVisible(locatorType) {
    cy.readFile(writeFile).then((file) => {
      const storedValue = file[locatorType];

      // Find the input with name=locatorType and verify it contains the stored value
      const inputLocator = `input[name='${locatorType}']`;
      cy.get(inputLocator)
        .filter(`[value="${storedValue}"]`)
        .should("exist")
        .and("have.value", storedValue);
    });
  }

  /**
   * Asserts that a validation error is displayed for the label input
   * Works for both likelihood & impact
   * @param {"likelihood"|"impact"} type - The type of dimension
   */
  assertValidationError() {
    // Assert that error class is applied
    cy.get(locators.risk.riskAnalysis.labelValidation).should(
      locators.risk.riskAnalysis.selectClass,
      data.add.likelihoodName.dangerText
    );

    // Assert directly on the form-group with has-danger class for Color
    cy.get(locators.risk.riskAnalysis.colorValidation).should("be.visible");
  }

  /**
   * Clicks a tab inside Risk Analysis Dimensions by its label
   * @param {string} tabName - The visible text of the tab
   */
  clickTab(tabName) {
    cy.get(locators.risk.riskAnalysis.clickImpactTab, { timeout: 2000 })
      .contains(tabName)
      .click();
  }

  /**
   * Generates a unique label name
   * @param {string} prefix - Prefix for the label name
   * @returns {string}
   */
  generateLabel(prefix) {
    return `${prefix}-${dayjs().format("mm-ss-SSS")}`;
  }

  /**
   * Types a label into the input field for a dimension (likelihood, impact, etc.).
   *
   * @param {string} text - The label text to type.
   * @param {string} action - The action type (e.g., "add", "edit").
   * @param {string} inputName - The name attribute of the label input field.
   */
  typeLabel(type, sectionName, locatorType) {
    const prefix = data[sectionName][`${type}Name`].labelPrefix;

    this.labelName = this.generateLabel(prefix);

    const inputLocator = `input[name='${locatorType}']`;
    cy.get(inputLocator).last().clear().type(this.labelName);
  }

  /**
   * Writes the generated label to a JSON file
   * @param {string} type
   */
  writeLabel(type) {
    cy.readFile(writeFile).then((file) => {
      // dynamically assign based on type
      file[`${type}`] = this.labelName;

      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Opens the last added Select2 dropdown (for likelihood, impact, etc.)
   * and waits until the dropdown is visible.
   *
   * @param {string} locatorType - The type of dimension (e.g., "likelihoodValue", "impactValue").
   */
  selectDimensionValue(locatorType) {
    const containerLocator = `div[id^='s2id_${locatorType}_']`;

    cy.get(containerLocator)
      .last()
      .find(locators.risk.riskAnalysis.clickValueOption)
      .click({ force: true });

    cy.get(locators.risk.riskAnalysis.dropdownOpened).should("be.visible");
  }

  /**
   * Specifically verifies that the stored "impactLabel" value
   * is visible in the last Impact input field.
   *
   * @returns {void}
   */
  storedValueImpactVisible() {
    cy.readFile(writeFile).then((file) => {
      const storedValue = file.impactLabel;

      // specifically last impactLabel input pe check karo
      cy.get(locators.risk.riskAnalysis.impactLabelInput)
        .last()
        .should("have.value", storedValue);
    });
  }

  /**
   * Types a unique decimal value (between 1.0 and 9.0) into the last risk value input
   * Generates a random integer, subtracts 0.1, and ensures valid range (>=1.0, <=9.0)
   *
   * @param {string} locatorType - Input locator key from locators.json (default "inherentValueInput")
   * @param {string} key - Key to store in JSON file (default "inherentValue")
   */
  typeRiskValue(locatorType = "inherentValueInput", key = "inherentValue") {
    cy.get(locators.risk.riskAnalysis[locatorType]).then(($inputs) => {
      const usedValues = $inputs
        .map((i, el) => parseFloat(el.value))
        .get()
        .filter((v) => !isNaN(v));

      let newValue;
      do {
        // Random integer between 2–9 (so after -0.1, result is 1.9–8.9)
        let baseValue = Math.floor(Math.random() * 8) + 2; // 2–9
        newValue = parseFloat((baseValue - 0.1).toFixed(1));
      } while (
        usedValues.includes(newValue) ||
        newValue < 1.0 ||
        newValue > 9.0
      );

      cy.get(locators.risk.riskAnalysis[locatorType])
        .last()
        .clear()
        .type(String(newValue));

      // ✅ Save in JSON
      cy.readFile(writeFile).then((file) => {
        file[key] = newValue;
        cy.writeFile(writeFile, file);
      });
    });
  }

  /**
   * Types a duplicate value (previously saved in JSON) into the last input field.
   * Used for testing validation errors.
   *
   * @param {string} locatorType - Input locator key from locators.json
   * @param {string} key - JSON key where stored value exists
   */
  duplicateValue(locatorType, key) {
    cy.readFile(writeFile).then((file) => {
      const storedValue = file[key];
      cy.get(locators.risk.riskAnalysis[locatorType])
        .last()
        .clear()
        .type(String(storedValue));
    });
  }

  /**
   * Types a unique risk label into the last row (Add case for inherent dimension).
   * Uses prefix from fixtures data.
   *
   * @returns {void}
   */
  typeRiskLabelAdd() {
    const prefix = data.add.inherentName.labelPrefix;
    this.labelName = this.generateLabel(prefix);

    cy.get(locators.risk.riskAnalysis.inherentLabelInput)
      .last()
      .clear()
      .type(this.labelName);
  }

  /**
   * Writes the last generated inherent label into the JSON file.
   *
   * @returns {void}
   */
  writeInherentLabel() {
    cy.readFile(writeFile).then((file) => {
      file["inherentLabel"] = this.labelName;
      cy.writeFile(writeFile, file);
    });
  }

  /**
   * Updates the inherent label in the row where the old label was stored.
   * Uses new prefix from update fixture data.
   *
   * @returns {void}
   */
  typeInherentLabelUpdate() {
    const prefix = data.update.inherentName.labelPrefix;
    this.labelName = this.generateLabel(prefix);

    cy.readFile(writeFile).then((file) => {
      const storedValue = file[data.add.inherentName.inherentLabel];

      cy.get(locators.risk.riskAnalysis.inherentLabelInput)
        .filter(`[value="${storedValue}"]`) // jis row me pehle wala value hai
        .clear()
        .type(this.labelName);
    });
  }
  /**
   * Updates an already saved value in JSON and replaces it in the input field
   * Ensures uniqueness across all rows
   * @param {string} locatorType - e.g. "inherentValueInput"
   * @param {string} key - e.g. "inherentValue"
   */
  updateStoredValue(locatorType = "inherentValueInput", key = "inherentValue") {
    cy.readFile(writeFile).then((file) => {
      const oldValue = file[key];

      cy.get(locators.risk.riskAnalysis[locatorType]).then(($inputs) => {
        const usedValues = $inputs
          .map((i, el) => el.value)
          .get()
          .filter(Boolean)
          .map((v) => parseInt(v, 10));

        // All possible values 1–8
        const possibleValues = Array.from({ length: 8 }, (_, i) => i + 1);

        // Filter out values already used in other rows (and also oldValue)
        const availableValues = possibleValues.filter(
          (v) => !usedValues.includes(v) || v === oldValue
        );

        // From available values, remove the oldValue (so it's forced to change)
        const finalChoices = availableValues.filter((v) => v !== oldValue);

        // Randomly pick from unique remaining values
        const newValue =
          finalChoices[Math.floor(Math.random() * finalChoices.length)];

        // Replace in DOM
        cy.get(locators.risk.riskAnalysis[locatorType])
          .filter(`[value="${oldValue}.0"], [value="${oldValue}"]`)
          .should("exist")
          .clear()
          .type(String(newValue));

        // Update JSON file
        file[key] = newValue;
        cy.writeFile(writeFile, file);
      });
    });
  }

  /**
   * Retrieves delete information for a given dimension type
   * from the stored JSON file.
   *
   * @param {Object} file - The JSON object read from writeFile.
   * @param {string} type - The dimension type key (e.g., "impactLabel", "likelihoodLabel").
   * @returns {{labelToDelete: string, inputName: string}}
   * Object containing the label text to delete and the corresponding input name.
   */

  getDeleteInfo(file, type) {
    return {
      labelToDelete: file[type],
      inputName: type,
    };
  }

  /**
   * Deletes the row with the stored label
   * @param {string} type - e.g. "controlStrengthLabels" | "impact" | "likelihood"
   */
  clickDeleteButton(type) {
    cy.readFile(writeFile).then((file) => {
      const { labelToDelete, inputName } = this.getDeleteInfo(file, type);

      // Step 1: Row locate karke Delete link (anchor <a>) click karo
      cy.get(`input[name="${inputName}"]`)
        .filter(`[value="${labelToDelete}"]`)
        .should("exist")
        .parents(locators.risk.riskAnalysis.rowData, { timeout: 10000 })
        .within(() => {
          cy.get(locators.risk.riskAnalysis.clickDeleteButton, {
            timeout: 10000,
          })
            .should("be.visible")
            .click();
        });
    });
  }

  /**
   * Keep clicking the popup delete until the modal closes
   */
  clickDeleteModalButton(retries = 3) {
    // Step 2: Wait short time,
    cy.wait(1000);

    cy.get("body").then(($body) => {
      if ($body.find(locators.risk.riskAnalysis.deletePopup).length > 0) {
        // if modal open  retries remaining -> again click
        cy.get(locators.risk.riskAnalysis.clickPopupBtn, { timeout: 5000 })
          .should("be.visible")
          .click({ force: true });

        // Retry logic
        if (retries > 0) {
          this.clickDeleteModalButton(retries - 1);
        }
      }
    });
  }
  /**
   * Verifies the row is deleted by checking parent row
   */
  verifyRowDeleted() {
    cy.readFile(writeFile).then(() => {
      cy.get("body", { timeout: 20000 })
        .parents(locators.risk.riskAnalysis.rowAllData)
        .should("not.exist");
    });
  }
  /**
   * Types a sequential unique value in last Relative Magnitude input
   * and saves it in writeFile
   */
  typeRelativeMagnitudeValue() {
    cy.get(locators.risk.riskAnalysis.relativeMagnitudeLabelInput).then(
      ($inputs) => {
        const usedValues = $inputs
          .map((i, el) => parseInt(el.value))
          .get()
          .filter((v) => !isNaN(v));

        const nextValue = usedValues.length ? Math.max(...usedValues) + 1 : 1;

        // Type into last input
        cy.get(locators.risk.riskAnalysis.relativeMagnitudeLabelInput)
          .last()
          .clear()
          .type(String(nextValue));

        // Save value in JSON file (inside same scope)
        cy.readFile(writeFile).then((file) => {
          file.relativeMagnitudeValue = nextValue;
          cy.writeFile(writeFile, file);
        });
      }
    );
  }

  /**
   * Types a duplicate value from writeFile into the last Relative Magnitude row
   * to intentionally trigger duplicate validation error.
   */
  typeDuplicateRelativeMagnitudeValue() {
    // Step 1: Read stored value from JSON file
    cy.readFile(writeFile).then((file) => {
      const duplicateValue = file.relativeMagnitudeValue;

      // Step 2: Make sure we have a valid value
      expect(duplicateValue).to.not.be.undefined;

      // Step 3: Type the same value in the last input field
      cy.get(locators.risk.riskAnalysis.relativeMagnitudeLabelInput)
        .last()
        .clear()
        .type(String(duplicateValue));
    });
  }

  updateRelativeMagnitudeValue() {
    cy.readFile(writeFile).then((file) => {
      const label = file.relativeMagnitudeLabels;

      cy.get(locators.risk.riskAnalysis.relativeMagnitudeLabelInput).then(
        ($vals) => {
          const nextValue =
            Math.max(...$vals.map((i, el) => parseFloat(el.value) || 0).get()) +
            1;

          cy.get(locators.risk.riskAnalysis.addRelativeMagLabel).then(
            ($labels) => {
              const match = $labels.filter(`[value="${label}"]`);

              const row = match.length
                ? cy.wrap(match.last())
                : cy.wrap($labels.last());

              row
                .parents(locators.risk.riskAnalysis.rowData)
                .find(locators.risk.riskAnalysis.relativeMagnitudeLabelInput)
                .clear()
                .type(String(nextValue));

              // save new value back to file
              cy.readFile(writeFile).then((data) => {
                data.relativeMagnitudeValue = nextValue;
                cy.writeFile(writeFile, data);
              });
            }
          );
        }
      );
    });
  }

  /**
   * Types a unique value (1–100) in last Control Strength input
   * Ensures value is not already used in other rows
   * Saves it to writeFile
   */
  typeControlStrengthValue() {
    cy.get(locators.risk.riskAnalysis.addControlStrengthValues).then(
      ($inputs) => {
        // Collect all already used numeric values
        const usedValues = $inputs
          .map((i, el) => parseInt(el.value))
          .get()
          .filter((v) => !isNaN(v));

        // Find next unique number (1–100) using Math
        let nextValue = 1;
        while (usedValues.includes(nextValue) && nextValue <= 100) {
          nextValue++;
        }

        // fallback if all numbers 1–100 used
        if (nextValue > 100) nextValue = 1;

        // Type into last input
        cy.get(locators.risk.riskAnalysis.addControlStrengthValues)
          .last()
          .clear({ force: true })
          .type(String(nextValue), { force: true })
          .then(() => {
            cy.readFile(writeFile).then((file) => {
              file.controlStrengthValue = nextValue;
              cy.writeFile(writeFile, file);
            });
          });
      }
    );
  }

  typeDuplicateValue() {
    cy.readFile(writeFile).then((file) => {
      const storedValue = file.controlStrengthValue;

      // specifically last impactLabel input pe check karo
      cy.get(locators.risk.riskAnalysis.controlStrengthLabelInput)
        .last()
        .clear({ force: true })
        .type(storedValue)
        .should("have.value", storedValue);
    });
  }

  /**
   * Updates last Control Strength input with a new unique value (1–100)
   * Saves the updated value in writeFile
   */
  updateControlStrengthValue() {
    cy.get(locators.risk.riskAnalysis.addControlStrengthValues).then(
      ($inputs) => {
        // Collect already used values
        const usedValues = $inputs
          .map((i, el) => parseInt(el.value))
          .get()
          .filter((v) => !isNaN(v));

        // Find next unique value
        let nextValue = 1;
        while (usedValues.includes(nextValue) && nextValue <= 100) {
          nextValue++;
        }

        if (nextValue > 100) nextValue = 1; // fallback if all numbers used

        // Update last input
        cy.get(locators.risk.riskAnalysis.addControlStrengthValues)
          .last()
          .clear({ force: true })
          .type(String(nextValue), { force: true })
          .then(() => {
            // Update writeFile
            cy.readFile(writeFile).then((file) => {
              file.controlStrengthValue = nextValue;
              cy.writeFile(writeFile, file);
            });
          });
      }
    );
  }
  /**
   * Clicks the three-dot (ellipsis) menu in the Risk Analysis screen.
   *
   * @returns {void}
   */
  clickThreeEllipsis() {
    cy.get(locators.risk.controlCategory.threeEllipsis)
      .should("be.visible")
      .click({ force: true });
  }
  /**
   * Clicks the audit button from the ellipsis menu.
   * @returns {void}
   */
  clickAudit() {
    cy.get(locators.risk.riskAnalysis.auditLogButton).click();
  }

  /**
   * Ensures that the modal dialog is opened and visible on the screen.
   *
   * @returns {void}
   */

  verifyAuditLogOpened() {
    cy.get(locators.risk.riskAnalysis.openModel, {
      timeout: 20000,
    }).should("be.visible");
  }

  /**
   * Verifies that the last audit log entry contains the expected label and value.
   * Reads both from the JSON file using given keys.
   *
   * @param {string} labelKey
   * @param {string} valueKey
   */
  verifyLastAuditLogLabelAndValue(labelKey, valueKey) {
    cy.readFile(writeFile).then((file) => {
      const expectedLabel = file[labelKey];
      const expectedValue = file[valueKey];

      cy.get(locators.risk.riskAnalysis.selectAuditLog).then(($li) => {
        cy.wrap($li)
          .find(locators.risk.riskAnalysis.checkAuditName, { timeout: 10000 })
          .should("contain.text", expectedLabel);
        cy.wrap($li)

          .find(locators.risk.riskAnalysis.checkAuditValue, {
            timeout: 10000,
          })
          .should("contain.text", expectedValue);
      });
    });
  }

  /**
   * Generic audit log verifier
   *
   * @param {string} newLabelKey - JSON key for updated label (e.g., "likelihoodLabel")
   * @param {string} labelLocator - Locator for label (e.g., checkUpdatedName, labelText)
   * @param {string} [newValueKey] - (Optional) JSON key for updated value (e.g., "riskValue")
   */
  verifyAuditLog(newLabelKey, labelLocator, newValueKey) {
    cy.readFile(writeFile).then((file) => {
      const newLabel = file[newLabelKey];
      const newValue = newValueKey ? file[newValueKey] : null;

      cy.get(locators.risk.riskAnalysis.selectAuditLog).then(($li) => {
        cy.wrap($li);
        // Common: Verify "modified the"
        cy.contains(
          locators.risk.riskAnalysis.checkModified,
          data.auditLog.modifiedRecord,
          { timeout: 10000 }
        ).should("be.visible");

        // Verify label
        cy.get(labelLocator).should("contain.text", newLabel);

        // Optional value check
        if (newValue) {
          cy.get(locators.risk.riskAnalysis.statusCheck, {
            timeout: 10000,
          }).should("contain.text", newValue);
        }
      });
    });
  }

  /**
   * Verifies last audit log entry after a delete action.
   * Checks that it contains "deleted the" and the expected label.
   *
   * @param {string} labelKey - JSON key for label (e.g., "likelihoodLabel")
   */

  verifyDeletedAuditLog(labelKey) {
    cy.readFile(writeFile).then((file) => {
      const deletedLabel = file[labelKey];

      cy.get(locators.risk.riskAnalysis.selectAuditLog, { timeout: 10000 })
        .should("be.visible")

        .then(($li) => {
          cy.wrap($li);
          // Verify it says "deleted the"
          cy.contains(
            locators.risk.riskAnalysis.checkModified,
            data.auditLog.deletedRecord,
            {
              timeout: 10000,
            }
          ).should("be.exist");

          // Verify the deleted label
          cy.get(locators.risk.riskAnalysis.rowDelete, {
            timeout: 10000,
          }).should("contain.text", deletedLabel);
        });
    });
  }

  /**
   * Verify last audit log contains valid server date/time format
   */
  checkAuditDateTime() {
    cy.get(locators.risk.riskAnalysis.selectAuditLog, { timeout: 10000 })
      .last()
      .scrollIntoView()
      .then(($li) => {
        cy.wrap($li)
          .find(locators.risk.riskAnalysis.timeCheck, { timeout: 10000 })
          .invoke("text")
          .then((dateText) => {
            // Expected format: DD/Mon/YYYY hh:mm AM|PM
            const regex = /^\d{2}\/[A-Za-z]{3}\/\d{4} \d{2}:\d{2} (AM|PM)$/;

            expect(dateText.trim()).to.match(regex);
          });
      });
  }

  /**
   * Verifies last audit log entry has correct  iP address
   */
  verifyAuditLogWithIP() {
    cy.get(locators.risk.riskAnalysis.selectAuditLog, { timeout: 10000 })
      .last({ timeout: 10000 })
      .scrollIntoView()
      .then(($li) => {
        // IP address check
        cy.wrap($li)
          .find(locators.risk.riskAnalysis.ipAddress, { timeout: 10000 })
          .invoke(data.generalText.textName)
          .then((ipText) => {
            // extract "122.50.1.81" from "IP:122.50.1.81"
            const ip = ipText.replace(data.generalText.ipText, "").trim();
            expect(ip).to.match(
              /^(?:\d{1,3}\.){3}\d{1,3}$/ // IPv4 regex
            );
          });
      });
  }

  /**
   * Verifies that the guidance textarea has maxlength attribute set to 1000.
   */
  verifyGuidanceMaxLengthAttribute() {
    cy.get(locators.risk.riskAnalysis.selectGuidance).should(
      "have.attr",
      "maxlength",
      data.generalText.checkMaxLength
    );
  }
}

export default RiskAnalysis;
