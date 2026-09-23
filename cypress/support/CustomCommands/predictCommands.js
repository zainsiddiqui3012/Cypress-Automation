import { error } from "console";
import BusinessAreas from "../POM/Administration/BusinessArea";
import InherentRiskCalculations from "../POM/RiskRegister/InherentRiskCalculation";
import { waitForStableGrid } from "./waits";
import * as XLSX from "xlsx";
import "cypress-file-upload";
import locators from "../../fixtures/locators.json";

const leftMenuLocator = "#leftMenuBtn";
const topMsgLoaderLocator = "#topmsg b";
const gridLoaderLocator = "//*[@id='myGrid']//span[contains(.,'Loading')]";
const gridLoaderLocatorForQB =
  "//form[@name='manageSurvey']//span[contains(.,'Loading')]";
const overlayLoaderLoc = "#agGrid-taxonomy div.ag-overlay-panel";
const loaderIds = {
  myGrid: "myGrid",
  agGrid: "agGrid-taxonomy",
  agGridRegChange: "regChangeDataGrid",
  qb: "myQuestionGrid",
  template: "templateGrid",
};
const addBtnLoc = ".m-subheader .la-plus-circle";
const searchTextBoxLoc = "div[ref='eFloatingFilterBody'] input";
const editIconLoc = "div[col-id='action'] a.gridEditIcon";
const linkkriLoader = "//*[@id='linkKriGrid']//span[contains(.,'Loading')]";
const loaderLocator =
  "div.ag-overlay-loading-wrapper span.ag-overlay-loading-center";
/**
 * login method will login the user into the system and make sure profile is visible
 * @param {string} userName user name of the user to login
 * @param {string} password password of the user to login
 * @param {string} key key of the user to login
 */
Cypress.Commands.add("login", (userName, password, key) => {
  cy.get("#username").type(userName);
  cy.get("#password").type(password);
  cy.get("#customerKey").type(key);

  cy.get("#m_login_signin_submit > .btn").should("be.visible").click();
  cy.wait(1500);
  cy.visitProfile();
  cy.waitForElementToVisible(".m-subheader__title", 15000);
  cy.get(".m-subheader__title").should("be.visible").contains("Welcome");
});

/**
 * loginWithSession will create a session for the login which could be later utilized with the sessionName provided in params
 * @param {string} sessionName Name of the session to be created
 * @param {string} userName user name of the user to login
 * @param {string} password password of the user to login
 * @param {string} key key of the user to login
 */
Cypress.Commands.add(
  "loginWithSession",
  (sessionName, userName, password, key) => {
    cy.session(sessionName, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(userName, password, key);
    });
  }
);

/**
 * waitForElementToVisible method will wait for passed locator to be visible for maximum time passed
 * @param {string} locator css-selector of the element
 * @param {number} timeInMilSec maximum wait time in mili seconds
 * @example cy.waitForElementToVisible('h2', 5000)
 */
Cypress.Commands.add("waitForElementToVisible", (locator, timeInMilSec) => {
  cy.get(locator, { timeout: timeInMilSec }).should((elem) => {
    expect(elem).to.be.visible;
  });
});

/**
 * waitForElementToVisible_XPath method will wait for passed locator to be visible for maximum time passed
 * @param {string} locator xpath of the element
 * @param {number} timeInMilSec maximum wait time in mili seconds
 * @example cy.waitForElementToVisible_XPath('//h2', 5000)
 */
Cypress.Commands.add(
  "waitForElementToVisible_XPath",
  (locator, timeInMilSec) => {
    cy.xpath(locator, { timeout: timeInMilSec }).should((elem) => {
      expect(elem).to.be.visible;
    });
  }
);

/**
 * fillAgGridInlineField will either type value or select value for passed field type in case of inline add/edit
 * @param {string} fieldType
 * @param {string} value
 */
Cypress.Commands.add(
  "fillAgGridInlineField",
  (fieldType, value = "", delays = 10) => {
    cy.get(".ag-popup-editor").then(($ele) => {
      if (fieldType == "textArea")
        cy.wrap($ele)
          .find("textarea")
          .clear()
          .type(value, { delay: delays })
          .tab();
      else if (fieldType == "select")
        cy.wrap($ele).contains(".ag-rich-select-row", value).click();
      cy.wait(1000);
    });
  }
);

/**
 * clickAddFromSubHeader custom command will click on the add button with plus icon in it located on subheader
 */
Cypress.Commands.add("clickAddFromSubHeader", () => {
  cy.get(addBtnLoc).should("be.visible").click();
});

/**
 * searchByNameAndStatus custom command will search the Item by its name.
 *
 * @param {string} searchText - The text of the item to search.
 * @param {boolean} isPrimary - If true, searches in the first input box; otherwise, searches in the second.
 * @param {boolean} [truncate=false] - Optional. If true, truncates the searchText to 255 characters before typing.
 */
Cypress.Commands.add(
  "searchByNameAndStatus",
  (searchText, isPrimary, truncate = false) => {
    const finalText = truncate ? searchText.substring(0, 255) : searchText;
    if (isPrimary) {
      cy.get(searchTextBoxLoc)
        .eq(0)
        .should("be.visible")
        .should("not.be.disabled")
        .type(finalText);
    } else {
      cy.get(searchTextBoxLoc)
        .eq(1)
        .should("be.visible")
        .should("not.be.disabled")
        .type(finalText);
    }
  }
);

/**
 * clicksOnEditIcon custom command will edit the record in grid
 */
Cypress.Commands.add("clicksOnActionEditIcon", () => {
  cy.get(editIconLoc).eq(0).should("be.visible").click();
});

/**
 * clickMainMenuItem will click on the left menu and then click on the menu item who's text is passed in parameter
 * @param {string} menuItemText text of the menu item to be clicked
 */
Cypress.Commands.add("clickMainMenuItem", (menuItemText) => {
  cy.get(leftMenuLocator).click();

  cy.get(`.navbar > ul > li > a > span:contains('${menuItemText}')`).click();
});

/**
 * clickSubMenuItem will click on the left menu and will expand menu item using it's text
 * and then click on the sub-menu item using it's text
 * @param {string} menuItemText text of the main item in menu
 * @param {string} subMenuItemText text of the sub menu item
 */
Cypress.Commands.add("clickSubMenuItem", (menuItemText, subMenuItemText) => {
  cy.get(leftMenuLocator).click();

  cy.get(`.navbar > ul > li > a > span:contains('${menuItemText}')`).click();

  cy.contains("a", subMenuItemText).click();
});

/**
 * for QB the my grid loader locator xpath is different
 */
Cypress.Commands.add("waitForMyGridLoaderToDisappearForQB", (timeInMilSec) => {
  // cy.xpath(gridLoaderLocator, { timeout: timeInMilSec }).should("be.visible");
  cy.xpath(gridLoaderLocatorForQB, {
    timeout: timeInMilSec,
  }).should("not.exist");
});

/**
 *waitForLoaderToDisappear will wait for the provided time in Mili seconds
 * for grid loader to not exist
 * @param {String} locator is the locator of the grid
 * @param {number} timeInMilSec time in Mili Seconds
 */

Cypress.Commands.add("waitForLoaderToDisappear", (loaderKey, timeInMilSec) => {
  switch (loaderKey) {
    case "myGrid":
      cy.xpath(`//*[@id='${loaderIds.myGrid}']//span[contains(.,'Loading')]`, {
        timeout: timeInMilSec,
      }).should("not.exist");
      break;
    case "agGrid":
      cy.xpath(`//*[@id='${loaderIds.agGrid}']//span[contains(.,'Loading')]`, {
        timeout: timeInMilSec,
      }).should("not.exist");
      break;

    case "agGrid-RegChange":
      cy.xpath(
        `//*[@id='${loaderIds.agGridRegChange}']//span[contains(.,'Loading')]`,
        {
          timeout: timeInMilSec,
        }
      ).should("not.exist");
      break;

    case "qb":
      cy.xpath(`//*[@id='${loaderIds["qb"]}']//span[contains(.,'Loading')]`, {
        timeout: timeInMilSec,
      }).should("not.exist");
      break;
    case "template":
      cy.xpath(
        `//*[@id='${loaderIds["template"]}']//span[contains(.,'Loading')]`,
        {
          timeout: timeInMilSec,
        }
      ).should("not.exist");
      break;
    default:
      cy.xpath("//span[contains(.,'Loading')]", {
        timeout: timeInMilSec,
      }).should("not.exist");
      break;
  }
});
/**
 * waitForMyGridLoaderToDisappear will first make sure that grid loader is visible and
 * It will wait for the provided time in Mili seconds for grid loader to not exist
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitForMyGridLoaderToDisappear", (timeInMilSec) => {
  cy.xpath(gridLoaderLocator, {
    timeout: timeInMilSec,
  }).should("not.exist");
});
/**
 * waitForMyGridLoaderToDisappear will wait for the provided time in Mili seconds
 * for grid loader to not exist
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitForOverlayLoaderToDisappear", (timeInMilSec) => {
  cy.iframe("#riskTaxonomyApplicabilityFrame")
    .find(overlayLoaderLoc, {
      timeout: timeInMilSec,
    })
    .should("not.be.visible");
});

/**
 * waitForLinkedKriLoaderToDisappear will first make sure that grid loader in linked KRI flyover in insights
 * is visible and, It will wait for the provided time in Mili seconds for grid loader to not exist
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitForLinkedKriLoaderToDisappear", (timeInMilSec) => {
  cy.xpath(linkkriLoader, {
    timeout: timeInMilSec,
  }).should("not.exist");
});

/**
 * waitForTopMsgLoaderToDisappear will first make sure that top loader is visible and
 * It will wait for the provided time in Mili seconds for top loader to it should exist
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitForTopMsgLoaderToAppear", (timeInMilSec) => {
  // cy.get(topMsgLoaderLocator, { timeout: timeInMilSec }).should("be.visible");

  cy.get(topMsgLoaderLocator, { timeout: timeInMilSec }).should("be.visible");
});

Cypress.Commands.add("waitForStableGrid", (timeInMilSec) => {
  cy.get("body").then(($body) => {
    // Only wait for top message loader if it exists
    if ($body.find(topMsgLoaderLocator).length) {
      cy.waitForTopMsgLoaderToDisappear(timeInMilSec);
    }
  });
  // Grid loader is usually present on data ops:
  cy.waitForMyGridLoaderToDisappear(timeInMilSec);
});

/**
 * waitForTopMsgLoaderToDisappear will first make sure that top loader is visible and
 * It will wait for the provided time in Mili seconds for top loader to not exist
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitForTopMsgLoaderToDisappear", (timeInMilSec) => {
  // cy.get(topMsgLoaderLocator, { timeout: timeInMilSec }).should("be.visible");

  cy.get(topMsgLoaderLocator, { timeout: timeInMilSec }).should(
    "not.be.visible"
  );
});

/**
 * verifyToastMessageText will verify the text on the toast message
 * @param {string} msg text of the toast message
 * @param {number} maxTimeout timeout in miliseconds
 */
Cypress.Commands.add("verifyToastMessageText", (msg, maxTimeout) => {
  cy.get(".toast-message", { timeout: maxTimeout }).should("have.text", msg);
});

/**
 * verifyToastMessageContains will verify that the toast message contains the specified text.
 * @param {string} msg - The text expected to be found within the toast message.
 * @param {number} maxTimeout - The maximum time to wait (in milliseconds) for the toast message.
 */
Cypress.Commands.add("verifyToastMessageContains", (msg, maxTimeout) => {
  cy.get(".toast-message", { timeout: maxTimeout }).should("contain.text", msg);
});

/**
 * waitForToastMessageToDisappear will verify the text on the toast message
 *  @param {number} maxTimeout timeout in miliseconds
 */
Cypress.Commands.add("waitForToastMessageToDisappear", (maxTimeout) => {
  cy.get(".toast-message", { timeout: maxTimeout }).should("not.exist");
});

/**
 * waitUntilLoaderNotVisible wait for the provided time in Mili seconds for loader to not visible
 * @param {number} timeInMilSec time in Mili Seconds
 */
Cypress.Commands.add("waitUntilLoaderNotVisible", (maxTimeout) => {
  cy.get(loaderLocator, { timeout: maxTimeout }).should("not.be.visible");
});

/**
 * addRiskCategory will fill out the risk category form and click on save btn
 * @param {string} riskCategoryID text to be typed in Risk Category Id field
 * @param {string} categoryName text to be typed in Name field
 * @param {string} categoryDescription text to be typed in Description field
 */
Cypress.Commands.add(
  "addRiskCategory",
  (riskCategoryID, categoryName, categoryDescription) => {
    cy.get("#manageRiskRegisterItemForm #riskId").type(riskCategoryID);
    cy.get("#manageRiskRegisterItemForm #field-name").type(categoryName);
    cy.get("#manageRiskRegisterItemForm #description").type(
      categoryDescription
    );

    cy.get("#manageRiskRegisterItemForm #saveBtn").click();
  }
);

/**
 * dropDownSearchAndSelect is the custom command used to search and select the text in the dropdown fields
 * this command can be used for the elements which are without <select> element
 * @param {String} searchLocator is the locator of the search element for input text
 * @param {string} searchText is the text which user type in the text input field
 */
Cypress.Commands.add(
  "iframeDropDownSearchAndSelect",
  (iframeName, searchLocator, searchText) => {
    cy.switchIframe(iframeName).then(($iframe) => {
      cy.get($iframe)
        .find(`${searchLocator} input`)
        .type(searchText, { force: true })
        .type("{enter}", { delay: 700, force: true })
        .type("{enter}", { force: true })
        .type("{esc}", { force: true });
    });
  }
);

/**
 * Clicks the "Save" button on the page.
 * Scrolls the button into view and forces the click action.
 * Useful for saving changes in the customer profile administration section.
 */
Cypress.Commands.add("clickSaveButton", () => {
  cy.contains("a", "Save").click({ force: true });
});

/**
 * dropDownSearchAndSelect is the custom command used to search and select the text in the dropdown fields
 * this command can be used for the elements which are without <select> element
 * @param {String} searchLocator is the locator of the search element for input text
 * @param {string} searchText is the text which user type in the text input field
 */
Cypress.Commands.add("dropDownSearchAndSelect", (searchLocator, searchText) => {
  cy.get(searchLocator)
    .find("input")
    .type(searchText, { delay: 200, force: true })
    .type("{enter}", { delay: 700, force: true })
    .type("{enter}", { force: true });
});
/**
 * selectExactElementText will click on the exact element text that are multiples in the same parent,
 * as cy.contains fail if the same keywords/letters are exists in multiple text of the divs
 */
Cypress.Commands.add("selectExactElementText", (locator, textValue) => {
  cy.get(locator)
    .contains(textValue) // Finds all elements containing valueName text
    .each(($el) => {
      const text = $el.text().trim(); // Trim any extra spaces
      if (text === textValue) {
        // Check for exact match
        cy.wrap($el).click(); // Click the element that matches exactly
      }
    });
});

/**
 * uploadFile will remove any previously added file and upload the new file from the specified path.
 * @param {String} file - The file path must not be empty if the user wants to upload a file.
 */
Cypress.Commands.add("uploadFile", (file) => {
  if (file != "") {
    cy.get("input#brandLogo").invoke("val", "").trigger("change");
    cy.get("input#brandLogo").selectFile(file);
  }
});
/**
 * typeOptionalEmptyFieldCondition will be used when the test data value is String and not mandatory (e.g tags, Descriptions)
 * @param {String} fieldName is the field value name from test data
 * @param {String} locator is the field locator
 * it is used for type in optional string fields
 */
Cypress.Commands.add(
  "typeOptionalEmptyFieldCondition",
  (fieldValueText, locator) => {
    if (fieldValueText != "") cy.get(locator).clear().type(fieldValueText);
  }
);
/**
 * clickOptionalBooleanFieldCondition will be used when the test data value is boolean and not mandatory (e.g active, isConsultant)
 * @param {String} fieldName is the field value name from test data
 * @param {String} locator is the field locator
 */
Cypress.Commands.add(
  "clickOptionalBooleanFieldCondition",
  (fieldName, locator) => {
    if (fieldName === true) cy.get(locator).click({ force: true });
  }
);

/**
 * searchFilterName opens the filter, enters the name, selects the status parameter, and performs the search.
 * @param {String} name - The name to be entered in the filter.
 * @param {String} status - The status  to be selected.
 */
Cypress.Commands.add(
  "searchFilterName",
  (name, status, sameLikeName = false, number = 0) => {
    cy.get("#filterForm #name").clear().type(name, { delay: 600 });
    cy.waitForTopMsgLoaderToDisappear(15000);
    !sameLikeName
      ? cy
          .get(".ui-menu-item-wrapper", {
            timeout: Cypress.env("waits").longWait,
          })
          .click({ force: true })
      : cy
          .get(".ui-menu-item-wrapper", {
            timeout: Cypress.env("waits").longWait,
          })
          .eq(number)
          .click({ force: true });
    cy.get("#s2id_filterStatus").click();
    cy.dropDownSearchAndSelect("#select2-drop", status);
    cy.get("#filter-modal .btn").contains("Apply").click();
    // Wait for loader to disappear
    cy.waitForTopMsgLoaderToDisappear(Cypress.env("waits").mediumWait);
  }
);
/**
 * addRiskDefinition will fill out the risk category form and click on save btn
 * @param {string} riskDefinitionID text to be typed in Risk Category Id field
 * @param {string} definitionName text to be typed in Name field
 * @param {string} definitionDescription text to be typed in Description field
 * @param {string} categoryName name of the category
 */
Cypress.Commands.add(
  "addRiskDefinition",
  (riskDefinitionID, definitionName, definitionDescription, categoryName) => {
    cy.get("#manageRiskRegisterNameForm #riskId").type(riskDefinitionID);
    cy.get("#manageRiskRegisterNameForm #field-name").type(definitionName);
    cy.get("#riskRegisterItemDiv > ul")
      .contains(categoryName)
      .find("span.aciTreeCheck")
      .click();

    cy.get("#addRiskSlider #saveBtn").click();
  }
);

/**
 * searchFilterNameWithoutStatus opens the filter, enters the name,find the result and performs the search.
 * @param {String} name - The name to be entered in the filter.
 * @param {String} locator - locator of the name text field it can be different for different filters
 */
Cypress.Commands.add("searchFilterNameWithoutStatus", (name, locator) => {
  cy.get(locator)
    .should("be.visible")
    .clear({ force: true })
    .type(name, { delay: 350 });
  cy.get(".ui-menu-item-wrapper", { timeout: Cypress.env("waits").mediumWait })
    .should("have.length", 1)
    .click({ force: true });
  cy.get("#filter-modal .btn").contains("Apply").click();
  // Wait for loader to disappear
  cy.waitForTopMsgLoaderToDisappear(150000);
});

/**
 * searchFilterAllowEmpty performs a filter search that allows empty or partial values without requiring autocomplete selection.
 * Unlike searchFilterName and searchFilterNameWithoutStatus, this method doesn't wait for or require selecting from autocomplete suggestions.
 *
 * @param {string} name - The text to filter by. Can be empty, partial text, or special characters
 * @param {string} locator - The CSS selector for the filter input field
 *
 */
Cypress.Commands.add("searchFilterAllowEmpty", (name, locator) => {
  cy.get(locator)
    .should("be.visible")
    .clear({ force: true })
    .type(name, { delay: 350 });

  // Skip autocomplete, just apply
  cy.get("#filter-modal .btn").contains("Apply").click();
  cy.waitForTopMsgLoaderToDisappear(15000);
});

// Command to keep hard refreshing until control strength column visibility matches the expected state
Cypress.Commands.add(
  "waitUntilVerifyControlStrengthWithReload",
  (riskDefinition, shouldBeVisible = false) => {
    let attempts = 0;
    const maxAttempts = 25;

    function checkAndRefresh() {
      attempts++;
      cy.log(
        `Attempt ${attempts} - Checking if control strength column ${
          shouldBeVisible ? "is visible" : "is NOT visible"
        }`
      );

      // Search for the risk definition to load the grid
      cy.wait(1000);
      cy.get("#myGrid [aria-label='Risk Filter Input']", { timeout: 30000 })
        .should("be.visible")
        .should("not.be.disabled")
        .clear()
        .type(riskDefinition);

      waitForStableGrid(300000);

      // Scroll horizontally to right to make control strength column visible (if it exists)
      cy.get("#myGrid .ag-body-horizontal-scroll-viewport").scrollTo("right");
      cy.wait(2000);

      // Check if the specific control strength column exists
      cy.get("body").then(($body) => {
        const controlStrengthExists =
          $body.find(".ag-row-level-1 [col-id='controlStrengthLabel']").length >
          0;

        // Determine if we need to continue based on expected state
        const needsRefresh = shouldBeVisible
          ? !controlStrengthExists
          : controlStrengthExists;

        if (needsRefresh && attempts < maxAttempts) {
          const action = shouldBeVisible ? "enabling" : "disabling";
          cy.log(
            `🔄 Control strength column visibility doesn't match expected state (${action}). Performing hard refresh (attempt ${attempts}/${maxAttempts})`
          );

          // Hard refresh to bypass all caches - this preserves session
          cy.reload(true);
          cy.wait(5000); // Wait for page to fully load after hard refresh

          // Wait for loaders after reload
          cy.waitForTopMsgLoaderToDisappear(300000);
          cy.waitForMyGridLoaderToDisappear(300000);

          // Recursive call to check again
          checkAndRefresh();
        } else if (!needsRefresh) {
          const status = shouldBeVisible ? "visible" : "NOT visible";
          cy.log(
            `✅ Control strength column is ${status} - cache clearing successful!`
          );
        } else {
          const expectedState = shouldBeVisible ? "visible" : "not visible";
          cy.log(
            `⚠️ Maximum attempts (${maxAttempts}) reached. Control strength may not be ${expectedState}.`
          );
          throw new Error(
            `Control Strength column did not become ${expectedState} after ${maxAttempts} attempts.`
          );
        }
      });
    }

    checkAndRefresh();
  }
);

/**
 * Configures the inherent risk settings in the application by toggling various checkboxes
 * based on the provided configuration options. it internally calls toggleFlag method to perform the toggling action.
 * when toggling round flag it also calls warningBtnCheck method to handle any warning that may appear after toggling.
 * turning on round flag requires use assessment to be on first so in case of turning on round flag we also turn on use assessment flag first.
 * @param {Object} options - Configuration options for inherent risk setup.
 * @param {boolean} options.assessment - Whether the "Use Assessments" feature should be enabled (true) or disabled (false).
 * @param {boolean} options.round - Whether the "Round Inherent" option should be enabled (true) or disabled (false).
 * @param {boolean} options.manageDetailControl - Whether the "Manage Detailed Controls" option should be enabled (true) or disabled (false).
 * @param {boolean} options.controlStrength - Whether the "Control Strength" feature should be enabled (true) or disabled (false).
 */
Cypress.Commands.add(
  "configureSettings",
  ({ assessment, round, manageDetailControl, controlStrength }) => {
    const customerProfile = locators.administration.customerProfile;
    const controlStrengthLocator =
      locators.risk.riskRegister.calculations.controlStrengthModuleCustomer;

    cy.toggleFlag(customerProfile.manageDetails, manageDetailControl);
    cy.toggleFlag(controlStrengthLocator, controlStrength);

    // checking round first because it requires use assessment to be on first
    cy.toggleFlag(customerProfile.useAssessments, round);
    cy.toggleFlag(customerProfile.isRoundInherent, round, {
      acceptWarning: true,
    });

    cy.toggleFlag(customerProfile.useAssessments, assessment);
  }
);

/**
 * Toggles a checkbox based on the desired state. if the current state is different from desired state,
 * it clicks the checkbox to change its state and it internally calls warningBtnCheck method to handle any warning that may appear after toggling.
 * @param {string} locator - The locator of the checkbox to toggle.
 * @param {boolean} enable - whether to enable (true) or disable (false) the checkbox.
 * @param {Object} options - additional options (optional).
 * @param {boolean} options.acceptWarning - whether to accept warning after toggling as it is shown in case of turning on/off round flag only
 */
Cypress.Commands.add(
  "toggleFlag",
  (locator, enable = false, { acceptWarning = false } = {}) => {
    const inherentRiskCalc = new InherentRiskCalculations();

    cy.get(locator).then(($checkbox) => {
      const isChecked = $checkbox.prop("checked");

      if (enable !== isChecked) {
        cy.wrap($checkbox).click({ force: true });
        if (acceptWarning) inherentRiskCalc.clickWarningBtn();
      }
    });
  }
);

/**
 * it waits for the given element to become visible (after we have toggled the assessment feature)
 * with retries and hard refreshes untill the element is found or max attempts reached.
 * when assessment feature is enabled, the likelihood dropdown changes to an iframe based assessment frame
 * and when disabled it goes back to normal dropdown.
 * @param {object} details - details for waiting for element after dropdown click
 * @param {string} details.riskName - name of the risk to search
 * @param {string} details.scroll - scroll position to navigate to
 * @param {boolean} [details.isAssessment=false] - whether to look for the assessment if true or normal dropdown if false
 * @param {number} [details.maxAttempts=10] - maximum number of attempts to try
 */
Cypress.Commands.add("waitForAssessmentToggle", (details) => {
  const inherentRiskCalc = new InherentRiskCalculations();

  const { riskName, scroll, isAssessment = false, maxAttempts = 10 } = details;

  const dropdownLocator = locators.risk.riskRegister.inherentLikelihood;
  const targetLocator = isAssessment
    ? locators.risk.riskRegister.calculations.withAssessment
        .likelihoodAssessmentFrame
    : locators.risk.riskRegister.selectLikelihoodImpactOptions;

  let attemptCount = 0;

  const attemptValidation = () => {
    attemptCount++;
    cy.wait(1000);
    cy.waitForStableGrid(10000);
    // Click the dropdown
    cy.get(dropdownLocator, { timeout: 15000 })
      .should("be.visible")
      .dblclick({ force: true });

    // Check if target element is visible
    cy.get("body").then(($body) => {
      const isTargetVisible = $body.find(targetLocator).is(":visible");

      if (isTargetVisible) {
        // Success! Target element is visible
        cy.log(
          `✅ Target element found and visible after ${attemptCount} attempt(s)`
        );
      } else {
        // Check if max attempts reached
        if (attemptCount >= maxAttempts) {
          cy.log(
            `❌ Max attempts (${maxAttempts}) reached. Target element not found.`
          );
          throw new Error(
            `Target element '${targetLocator}' did not become visible after ${maxAttempts} attempts and hard refreshes.`
          );
        } else {
          // Perform hard refresh and retry
          cy.log(
            `🔄 Performing hard refresh (attempt ${attemptCount}/${maxAttempts})`
          );
          cy.reload(true); // Hard refresh
          cy.waitForStableGrid(30000);
          inherentRiskCalc.searchRisk(riskName);
          inherentRiskCalc.scrollRight(scroll);

          // Recursive call
          attemptValidation();
        }
      }
    });
  };

  // Start the recursive validation
  attemptValidation();
});

/**
 * clickDoubleRightPaginationBtn will click on the double right arrow pagination button
 * to navigate to the last page of the pagination.
 */
Cypress.Commands.add("clickDoubleRightPaginationBtn", () => {
  cy.waitForTopMsgLoaderToDisappear(40000);
  cy.get(".la.la-angle-double-right").click();
});

/**
 * clickRightPaginationBtn will click on the single right arrow pagination button
 * to navigate to the next page of the pagination.
 */
Cypress.Commands.add("clickRightPaginationBtn", () => {
  cy.waitForTopMsgLoaderToDisappear(40000);
  cy.get(".la.la-angle-right").click();
});
/**
 * readAndWriteData is used to dynamically update test data files by linking resellers, customers, roles, users, and content-related data.
 * When a new reseller is created, its name is added to related files.
 * Similarly, customer names, customer keys, and role names are updated in user test data files.
 * Additionally, this function updates content-related information such as Question Banks, Assessments, Content Sources, and Content Libraries.
 * This automation ensures data consistency across multiple JSON fixture files.
 *
 * @param {String} key - Defines the type of data to update (e.g., 'Reseller', 'Customer', 'Role', 'Question Bank', 'Content Source Update', 'Content Library Update', etc.).
 * @param {String} data - The value to be written in the respective file (e.g., reseller name, customer name, customer key, content source name, etc.).
 */
Cypress.Commands.add(
  "readAndWriteData",
  (key, data, fileType = "Assessments") => {
    const basePath = "cypress/fixtures/Administration/";
    const filePaths = {
      Customers: `${basePath}Customers.json`,
      Roles: `${basePath}Roles.json`,
      Users: `${basePath}Users.json`,
      UserCredentials: `${basePath}UserCredentials.json`,
      ContentLibrary: `${basePath}ContentLibrary.json`,
      UserGroup: `${basePath}UserGroup.json`,
      BusinessArea: `${basePath}BusinessArea.json`,
      Assessments: `${basePath}${fileType}.json`,
      qbImport: `cypress/fixtures/Examples/qbImport.json`,
      templateImport: `cypress/fixtures/Examples/templateImport.json`,
    };

    const updateFile = (filePath, updateCallback) => {
      cy.readFile(filePath).then((file) => {
        updateCallback(file);
        cy.writeFile(filePath, file);
      });
    };

    const keyMappings = {
      Reseller: () => {
        updateFile(
          filePaths.Customers,
          (file) => (file.addCustomer.resellerName = data)
        );
        updateFile(filePaths.Roles, (file) => (file.addRole.reseller = data));
        updateFile(filePaths.Users, (file) => (file.addUser.reseller = data));
      },
      Customer: () => {
        updateFile(filePaths.Roles, (file) => (file.addRole.customer = data));
        updateFile(filePaths.Users, (file) => (file.addUser.customer = data));
      },
      Key: () => {
        updateFile(filePaths.UserCredentials, (file) => (file.key = data));
      },
      Role: () => {
        updateFile(filePaths.Users, (file) => {
          file.updateUser.role = [];
          file.updateUser.role.push(data);
        });
      },
      "Role KXI User": () => {
        updateFile(filePaths.Users, (file) => {
          file.updateUser.kxiUserRoles = [];
          file.updateUser.kxiUserRoles.push(data);
        });
      },
      BusinessArea: () => {
        updateFile(filePaths.BusinessArea, (file) => {
          file.addBA["BAC-1"].contentLibrary = data;
          file.addBA["BAC-2"].contentLibrary = data;
          file.addBA["Business Definition"].contentLibrary = data;
          file.updateBA["BAC-1"].contentLibrary = data;
          file.updateBA["BAC-2"].contentLibrary = data;
          file.updateBA["Business Definition"].contentLibrary = data;
        });
      },
      "BusinessArea Import": () => {
        updateFile(filePaths.BusinessArea, (file) => {
          file.updateBA["Business Definition"]["name"] = data;
        });
      },
      "Question Bank": () => {
        updateFile(
          filePaths.Customers,
          (file) =>
            (file.customerProfileData.questionBank.questionBankName = data)
        );
        updateFile(filePaths.Assessments, (file) => {
          file.template.sections.forEach((section) => {
            section.associateQB = data;
          });
        });
      },
      "Question Bank CustomerSpace": () => {
        updateFile(
          filePaths.Customers,
          (file) =>
            (file.customerProfileData.questionBank.questionBankName = data)
        );
        updateFile(filePaths.Assessments, (file) => {
          file.template.sectionsCustomerSpace.forEach((section) => {
            section.associateQB = data;
          });
        });
      },
      Assessment: () => {
        updateFile(
          filePaths.Customers,
          (file) => (file.customerProfileData.assessment.assessmentName = data)
        );
      },
      "Content Source Update": () => {
        updateFile(
          filePaths.ContentLibrary,
          (file) => (file.contentSourceName = data)
        );
      },
      "Content Library Update": () => {
        updateFile(
          filePaths.ContentLibrary,
          (file) => (file.contentLibraryName = data)
        );
      },
      "UserGroup Reseller": () => {
        updateFile(filePaths.UserGroup, (file) => {
          file.addUserGroup.reseller = data;
        });
      },
      "UserGroup Customer": () => {
        updateFile(filePaths.UserGroup, (file) => {
          file.addUserGroup.customer = data;
        });
      },
      "UserGroup Roles": () => {
        updateFile(filePaths.UserGroup, (file) => {
          file.updateUserGroup.roles = [];
          file.updateUserGroup.roles.push(data);
        });
      },
      "UserGroup KXI User Roles": () => {
        updateFile(filePaths.UserGroup, (file) => {
          file.updateUserGroup.kxiUserRoles = [];
          file.updateUserGroup.kxiUserRoles.push(data);
        });
      },
      "UserGroups User": () => {
        updateFile(filePaths.Users, (file) => {
          file.addUser.userGroup = [];
          file.updateUser.userGroup = [];
          file.addUser.userGroup.push(data);
          file.updateUser.userGroup.push(data);
        });
      },
      "UserGroups Customer User": () => {
        updateFile(filePaths.Users, (file) => {
          file.addUser.kxiCustomerUserGroup = [];
          file.updateUser.kxiCustomerUserGroup = [];
          file.addUser.kxiCustomerUserGroup.push(data);
          file.updateUser.kxiCustomerUserGroup.push(data);
        });
      },
      "qbImport Name": () => {
        updateFile(filePaths.Assessments, (file) => {
          file.questionBank.qbSummaryForm.update.qbName = data;
        });
      },
      "qbImport Framework": () => {
        updateFile(filePaths.qbImport, (file) => {
          file["Question Bank"][0]["Frameworks*"] = data;
        });
      },
      "qbImport ContentLibrary": () => {
        updateFile(filePaths.qbImport, (file) => {
          file["Question Bank"][0]["Content Library*"] = data;
        });
      },
      "templateImport Name": () => {
        updateFile(filePaths.Assessments, (file) => {
          file.template.templateSurveyForm.templateName = data;
        });
      },
      "templateImport Framework": () => {
        updateFile(filePaths.templateImport, (file) => {
          file["QuestionBanks"][0]["Frameworks*"] = data;
        });
      },
      "templateImport ContentLibrary": () => {
        updateFile(filePaths.templateImport, (file) => {
          file["QuestionBanks"][0]["Content Library*"] = data;
          file["AssessmentTemplates"][0]["Content Library*"] = data;
        });
      },
    };

    if (keyMappings[key]) {
      keyMappings[key]();
    } else {
      throw new Error(`Invalid key: ${key}`);
    }
  }
);
/**
 * visitProfile will visit the Profile(Home) page after login
 * and verify profile heading is visible
 */
Cypress.Commands.add("visitProfile", () => {
  // cy.visit(Cypress.env("profile_Url"));
  cy.visitWithNetwork(Cypress.env("profile_Url"), 150000);
  //ensuring that we are on the user Profile page, other pages does not have this class
  cy.get(".m-subheader.profile", { timeout: 30000 }).should("be.visible");
});
/**
 * visit LocationBranches will visit the Location/Branches
 */
Cypress.Commands.add("visitLocationBranches", () => {
  cy.visit(Cypress.env("Location"));
});

/**
 * visit Regulations & Obligations to create Category for Location/Branches
 */
Cypress.Commands.add("visitRegulationsObligations", () => {
  cy.visit(Cypress.env("Category"));
});

/**
 * visit Regulations & Obligations to create Area for Location/Branches
 */
Cypress.Commands.add("visitArea", () => {
  cy.visit(Cypress.env("Area"));
});

/**
 * visit Regulations & Obligations to create Agency for Location/Branches
 */
Cypress.Commands.add("visitNewAgency", () => {
  cy.visit(Cypress.env("NewAgency"));
});

/**
 * visit Regulations & Obligations to create Area for Location/Branches
 */
Cypress.Commands.add("visitBSASubCategories", () => {
  cy.visit(Cypress.env("BSASubCategories"));
});
/**
 * visitkxiDef will visit the Define KXI page
 */
Cypress.Commands.add("visitkxiDef", () => {
  cy.visit(Cypress.env("kxi_Def_Url"));
});
/**
 * visitkxiData will visit the KXI Data page
 */
Cypress.Commands.add("visitkxiData", () => {
  cy.visit(Cypress.env("kri_Data_Grid_Url"));
});
/**
 * visitkxiInsight will visit the Insight page
 */
Cypress.Commands.add("visitkxiInsight", () => {
  cy.visit(Cypress.env("kxi_Insight_Grid_Url"));
});
/**
 * visitkxiRiskInsight will visit the Risk Insight page
 */
Cypress.Commands.add("visitkxiRiskInsight", () => {
  cy.visit(Cypress.env("KXI_INSIGHT_RISK_URL"));
});
/**
 * visitkxiRiskInsight will visit the Risk Insight page
 */
Cypress.Commands.add("visitKxiCategories", () => {
  cy.visit(Cypress.env("KXI_CATEGORIES"));
});

Cypress.Commands.add("visitRiskAppetite", () => {
  cy.visit(Cypress.env("RISK_APPETITE_URL"));
});

/**
 * visitControlDefinitionCategories will visit the Control Definition Categories page
 */
Cypress.Commands.add("visitControlDefinitionCategories", () => {
  cy.visit(Cypress.env("CONTROL_DEFINITION_CATEGORIES_NONE_SPACE"));
});

/**
 * visitControlTypes will visit the Control Types page
 */
Cypress.Commands.add("visitControlTypes", () => {
  cy.visit(Cypress.env("CONTROL_TYPES_NONE_SPACE"));
});

/**
 * visitkxiDataEntry will visit the KXI Data Entry page
 */
Cypress.Commands.add("visitkxiDataEntry", () => {
  cy.visit(Cypress.env("DATA_ENTRY_MODE"));
});

/**
 * visitRiskAppetite will visit the Risk Appetite page
 */
Cypress.Commands.add("visitRiskAppetite", () => {
  cy.visit(Cypress.env("RISK_APPETITE_URL"));
});
/**
 * visitRiskTaxonomies will visit the Risk Taxonomies page
 */
Cypress.Commands.add("visitRiskTaxonomies", () => {
  cy.visit(Cypress.env("RISK_TAXONOMIES"));
});

/**
 * visitControlOperations will visit the Control Operations page
 */
Cypress.Commands.add("visitControlOperations", () => {
  cy.visit(Cypress.env("CONTROL_OPERATIONS"));
});

/**
 * visitRiskRegister will visit the Risk Register page
 */
Cypress.Commands.add("visitRiskRegister", () => {
  cy.visit(Cypress.env("RISK_REGISTER"));
});
/**
 * visitRiskEvent will visit the Risk Event page
 */
Cypress.Commands.add("visitRiskEvent", () => {
  cy.visitWithNetwork(Cypress.env("RISK_EVENT"), 150000);
});

/**
 *
 * visitEventType will visit the Event Types page
 */
Cypress.Commands.add("visitEventType", () => {
  cy.visit(Cypress.env("EVENT_TYPE"));
});

/**
 *
 * visitOrganizationalHierarchy will visit the Organizational Hierarchy page
 */
Cypress.Commands.add("visitOrganizationalHierarchy", () => {
  cy.visit(Cypress.env("ORGANIZATIONAL_HIERARCHY"));
});
/**
 * visit LocationBranches will visit the Location/Branches
 */
Cypress.Commands.add("visitLocationBranches", () => {
  cy.visit(Cypress.env("LOCATION"));
});
/**
 * visitIssueManagementDashboard will visit the Issue Management Dashboard page
 */
Cypress.Commands.add("visitIssueManagementDashboard", () => {
  cy.visit(Cypress.env("ISSUE_MANAGEMENT_DASHBOARD"));
});
/**
 * visitIssueSources will visit the Issue Sources page
 */
Cypress.Commands.add("visitIssueSource", () => {
  cy.visit(Cypress.env("ISSUE_SOURCE"));
});
/**
 * visitIssueTypes will visit the Issue Types page
 */
Cypress.Commands.add("visitIssueTypes", () => {
  cy.visit(Cypress.env("ISSUE_TYPES"));
});
/**
 * visitRootCause will visit the RootCause page
 */
Cypress.Commands.add("visitRootCause", () => {
  cy.visit(Cypress.env("ROOT_CAUSE"));
});
/**
 * visitEntity will visit the Entities page
 */
Cypress.Commands.add("visitEntities", () => {
  cy.visit(Cypress.env("ENTITIES"));
});
/**
 * visitSeverity will visit the Severity page
 */
Cypress.Commands.add("visitSeverity", () => {
  cy.visit(Cypress.env("SEVERITY"));
});
/**
 * visitBSASubCategory will visit the BSA SubCategory page
 */
Cypress.Commands.add("visitBSASubCategory", () => {
  cy.visit(Cypress.env("BSA_SUBCATEGORY"));
});
/**
 * visitAreas will visit the Areas page
 */
Cypress.Commands.add("visitAreas", () => {
  cy.visit(Cypress.env("AREAS"));
});
/**
 * visitAgencies will visit the Agencies page
 */
Cypress.Commands.add("visitAgencies", () => {
  cy.visit(Cypress.env("AGENCIES"));
});
/**
 * visitCategories will visit the Categories page
 */
Cypress.Commands.add("visitCategories", () => {
  cy.visit(Cypress.env("CATEGORIES"));
});
/**
 * visitReseller will visit the Reseller page
 */
Cypress.Commands.add("visitReseller", () => {
  cy.visitWithNetwork(Cypress.env("RESELLER"), 150000);
});

Cypress.Commands.add("visitMyQuestionBank", () => {
  cy.visitWithNetwork(Cypress.env("MY_QUESTION_BANK"), 150000);
});

Cypress.Commands.add("visitFramework", () => {
  cy.visit(Cypress.env("FRAMEWORK"));
});

Cypress.Commands.add("visitTemplate", () => {
  cy.visitWithNetwork(Cypress.env("TEMPLATE"), 150000);
});

Cypress.Commands.add("visitContentSource", () => {
  cy.visitWithNetwork(Cypress.env("CONTENT_SOURCE"), 150000);
});
Cypress.Commands.add("visitQuestionBank", () => {
  cy.visitWithNetwork(Cypress.env("QUESTION_BANK"), 150000);
});

Cypress.Commands.add("visitContentLibrary", () => {
  cy.visitWithNetwork(Cypress.env("CONTENT_LIBRARY"), 150000);
});

Cypress.Commands.add("visitCustomer", () => {
  cy.visitWithNetwork(Cypress.env("CUSTOMER"), 150000);
});

Cypress.Commands.add("visitRiskTaxonomy", () => {
  cy.visitWithNetwork(Cypress.env("RISK_TAXONOMY"), 150000);
});

Cypress.Commands.add("visitControlTaxonomy", () => {
  cy.visitWithNetwork(Cypress.env("CONTROL_TAXONOMY"), 150000);
});

Cypress.Commands.add("visitContolDefCat", () => {
  cy.visitWithNetwork(
    Cypress.env("CONTROL_DEFINITION_CATEGORIES_CUSTOMER_SPACE"),
    150000
  );
});

Cypress.Commands.add("visitUsers", () => {
  // cy.visit(Cypress.env("USERS"), { timeout: 500000 });
  cy.visitWithNetwork(Cypress.env("USERS"), 150000);
});

/**
 * Custom Cypress command to visit a URL with a network request first.
 *
 * @param {string} envVariable - The URL to visit.
 * @param {number} timeoutValue - The timeout duration for the network request.
 */
Cypress.Commands.add("visitWithNetwork", (envVariable, timeoutValue) => {
  cy.request({
    method: "GET",
    url: envVariable,
    timeout: timeoutValue, // Extend timeout
  }).then((response) => {
    expect(response.status).to.eq(200);
    cy.window().then((win) => {
      win.location.href = envVariable; // Navigate without Cypress reloading
    });
  });
});
/**
 * visitRoles will visit the Role page
 */
Cypress.Commands.add("visitRoles", () => {
  cy.visitWithNetwork(Cypress.env("ROLES"), 150000);
});
/**
 * visit compliance dashboard
 */
Cypress.Commands.add("visitCMSDashboard", () => {
  cy.visitWithNetwork(Cypress.env("COMPLIANCE_DASHBOARD"), 120000);
});
/**
 * visit compliance dashboard
 */
Cypress.Commands.add("visitCustomFields", () => {
  cy.visitWithNetwork(Cypress.env("CUSTOMFIELD_SCREEN"), 120000);
});

/**
 * visit complaint form
 */
Cypress.Commands.add("visitComplaintForm", () => {
  cy.visit(Cypress.env("COMPLAINT_FORM"));
});

/**
 * visit complaint form
 */
Cypress.Commands.add("visitRcsaForm", () => {
  cy.visit(Cypress.env("RCSA_FORM"));
});

/**
 * visit compliance external  form
 */
Cypress.Commands.add("visitComplaintWebForm", () => {
  cy.visit(Cypress.env("COMPLAINT_WEB_FORM"));
});

/**
 * visit compliance external  form
 */
Cypress.Commands.add("visitComplaintExternalForm", () => {
  cy.visit(Cypress.env("COMPLAINT_EXTERNAL_FORM"));
});
/**
 * visitVendorRiskManagement will visit the vendor Risk management page
 */
Cypress.Commands.add("visitVendorRiskManagement", () => {
  cy.visit(Cypress.env("VENDOR_RISK_MANAGEMENT"));
});

/**
 * visitBusinessArea will visit the BusinessArea page
 */
Cypress.Commands.add("visitBusinessArea", () => {
  // cy.visit(Cypress.env("BUSINESS_AREA"));
  cy.visitWithNetwork(Cypress.env("BUSINESS_AREA"), 150000);
});
Cypress.Commands.add("visitOrganizationalHierarchy", () => {
  cy.visit(Cypress.env("ORGANIZATIONAL_HIERARCHY"));
});

/**
 * visitOrganizationalHierarchy will visit the Organizational Hierarchy page
 */
Cypress.Commands.add("visitOrganizationalHierarchy", () => {
  cy.visit(Cypress.env("ORGANIZATIONAL_HIERARCHY"));
});

Cypress.Commands.add("visitRiskTaxonomyLibraries", () => {
  cy.visit(Cypress.env("RISK_LIBRARIES_CUSTOMER_SPACE"), { timeout: 150000 });
});

/**
 * visitOrganizationalHierarchy will visit the Organizational Hierarchy page
 */
Cypress.Commands.add("visitRiskAnalysisDimensions", () => {
  cy.visit(Cypress.env("RISK_ANALYSIS_DIMENSIONS"));
});
/**
 * visitUserGroup will visit the User Group page
 */
Cypress.Commands.add("visitUserGroup", () => {
  cy.visitWithNetwork(Cypress.env("USER_GROUP"), 150000);
});

Cypress.Commands.add("visitControlOperationCustomerSpace", () => {
  cy.visitWithNetwork(Cypress.env("CONTROL_OPERATION_CUSTOMER_SPACE"), 150000);
});
/**
 * visitCustomerProfile will visit the Customer Profile page
 */
Cypress.Commands.add("visitCustomerProfile", () => {
  //cy.visit(Cypress.env("CUSTOMER_PROFILE"));
  cy.visitWithNetwork(Cypress.env("CUSTOMER_PROFILE"), 150000);
});
/**
 * visitCompanyDocument will visit the Company Document page
 */
Cypress.Commands.add("visitCompanyDocument", () => {
  cy.visitWithNetwork(Cypress.env("COMPANY_DOCUMENT"), 150000);
});
/**
 * visitMyDocument will visit the My Document page
 */
Cypress.Commands.add("visitMyDocument", () => {
  cy.visitWithNetwork(Cypress.env("MY_DOCUMENT"), 150000);
});
/**
 * visitMyCompanyDocument will visit the My Company Document page
 */
Cypress.Commands.add("visitMyCompanyDocument", () => {
  cy.visitWithNetwork(Cypress.env("MY_COMPANY_DOCUMENT"), 150000);
});
/**
 * visitAssignToMe will visit the Assign To Me Page
 */
Cypress.Commands.add("visitAssignToMe", () => {
  cy.visitWithNetwork(Cypress.env("ASSIGN_TO_ME"), 150000);
});
/**
 * visitTrash will visit Trash Page 
 */
Cypress.Commands.add("visitTrash", () => {
  cy.visitWithNetwork(Cypress.env("TRASH"), 150000);
});
/**
 * visitCompanyDocument will visit the Company Document page
 */
Cypress.Commands.add("visitCompanyDocuments", () => {
  cy.visitWithNetwork(Cypress.env("COMPANY_DOCUMENT"), 150000);
});

/**
 * visitAssignedToMe will visit the Assigned To Me page 
 */
Cypress.Commands.add("visitAssignedToMe", () => {
  cy.visitWithNetwork(Cypress.env("ASSIGNED_TO_ME"), 150000);
});

Cypress.Commands.add("visitComplianceDashboard", () => {
  cy.visitWithNetwork(Cypress.env("COMPLIANCE_DASHBOARD"), 150000);
});

/**
 * logout will logout the user and verify that login form is visible
 */
Cypress.Commands.add("logout", () => {
  cy.get("div#m_header_topbar li.m-topbar__user-profile").click();
  cy.contains("a", "Log out").click({ force: true });
  cy.get("form#login-form", { timeout: 60000 }).should("be.visible");
});

/**
 * visitControlTaxonomyCS will visit the Control Taxonomy screen from Customer space
 */
Cypress.Commands.add("visitControlTaxonomyCS", () => {
  cy.visit(Cypress.env("CONTROL_TAXONOMY_CUSTOMER_SPACE"));
});
/**
 * validateKxiDataAuditLogs will check that the audit logs provided from the json exists in the log window
 * @param {String} auditLogBtn clicks on auditlog btn
 * @param {String} auditLogContent its the window content when audit log window is opened
 * @param {String} textToVerify json file data which we want to verify
 * @param {String} dateToVerify in kxidata the updated dates which we want to verify
 */
Cypress.Commands.add(
  "validateKxiDataAuditLogs",
  (auditLogButton, auditLogContent, textToVerify, dateToVerify) => {
    cy.get(auditLogButton, { timeout: 50000 }).should("have.length", "1", {
      timeout: 9000,
    });

    //Using Promised based approach.
    const visibleLogsText = (maxClicks) => {
      return new Cypress.Promise((resolve, reject) => {
        let clickCount = 0;

        function foundLogsText() {
          // If the maximum number of clicks is reached, reject the promise.
          if (clickCount >= maxClicks) {
            reject(new Error("Max clicks reached, noResults still visible"));
            return;
          }

          // Wait for the button to be available and click it.
          cy.get(auditLogButton, { timeout: 50000 })
            .eq(0)
            .click({ timeout: 6000 })
            .then(() => {
              cy.waitForTopMsgLoaderToDisappear(12000);
              // Attempt to get the auditLogContent element without timing out.
              cy.get("body").then(($body) => {
                // Manually check if the auditLogContent exists in the DOM
                const auditLogContentExists =
                  $body.find(auditLogContent).length > 0;
                cy.log("find the element...", auditLogContentExists);
                cy.waitForTopMsgLoaderToDisappear(10000);
                if (auditLogContentExists) {
                  // If the element is found and visible, resolve the promise.
                  cy.get(auditLogContent)
                    .should("be.visible", { timeout: 200000 })
                    .then(($el) => {
                      cy.verifyText($el, textToVerify);
                      cy.verifyText($el, dateToVerify);
                    });
                  resolve(); // End recursion and resolve the promise.
                } else {
                  // If the element is not found, click "Close" and retry.
                  cy.waitForElementToVisible(".audit-trail .border-0", 25000);
                  cy.get("#auditTrail-modal .modal-content")
                    .contains("button", "Close")
                    .should("be.visible")
                    .click({ force: true })
                    .then(($el) => {
                      //wait for Audit log button visibilty(Jenkins specific)
                      cy.wait(5000);
                      cy.get($el).should("not.be.visible");
                      clickCount++; // Increment click count
                      foundLogsText(); // Recursively call the function to retry
                    });
                }
              });
            });
        }

        // Start the recursion.
        foundLogsText();
      });
    };

    // Start the recursive function with a max of 5 clicks.
    visibleLogsText(30);
  }
);
/**
 * convertXlsxToJson will convert the JSONFILE to XLSX
 * @param {String,JSON} jsonfile will be the jsonfile that we want to convert
 * @param {Boolean} csv if true it will convert to csv file else xlsx
 * @param {Boolean} qb if true it will post process the sheet to ensure the
 */
Cypress.Commands.add(
  "convertXlsxtoJson",
  (jsonfile, csv = false, qb = false) => {
    const importFileName = "importFile_XLSX";
    // Validate input
    if (!jsonfile || typeof jsonfile !== "object") {
      throw new Error("Invalid JSON file data provided");
    }
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Iterate through each key in the jsonfile (each key represents a sheet)
    Object.keys(jsonfile).forEach((sheetName) => {
      const sheetData = jsonfile[sheetName];
      const sheet = XLSX.utils.json_to_sheet(sheetData);

      if (qb) {
        // Post-process the sheet to ensure the "Id" column is blank and formatted as a number
        Object.keys(sheet).forEach((cell) => {
          if (cell.startsWith("A") && sheet[cell].v === 0) {
            sheet[cell].v = ""; // Set the value to blank
            sheet[cell].t = "n"; // Set the type to number
            sheet[cell].z = "0"; // Explicitly set the format to number
          }
        });
      }

      // Append the sheet to the workbook with the sheet name from the JSON file
      XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    });
    // Write the workbook to a CSV file
    csv
      ? XLSX.writeFile(wb, importFileName + ".csv")
      : XLSX.writeFile(wb, importFileName + ".xlsx");
  }
);

Cypress.Commands.add("verifyText", (locator, statusData) => {
  const statusValues = Object.values(statusData); // Convert statusData into an array of values
  const matchedValues = [];

  cy.get(locator, { timeout: 50000 }).each((item) => {
    // Get the text of the current DOM element
    cy.wrap(item)
      .invoke("text")
      .then((actualText) => {
        const trimmedText = actualText.trim();

        cy.log(`Actual text: ${trimmedText}`);

        if (trimmedText === "0") {
          cy.log('Skipping element with text "0"');
          return; // Skip further assertions for this element
        }
        // Assertion: Check if the text exists in the JSON values
        if (statusValues.includes(trimmedText)) {
          matchedValues.push(trimmedText); // Track matched values
          cy.log("its matched..");
          expect(trimmedText).to.be.oneOf(
            statusValues,
            `Text "${trimmedText}" should match one of the expected values.`
          );
        } else {
          // Assertion failure if the text is not found in the JSON
        }
      });
  });
});
/**
 * saveSessionState custom command will save the cookies, localStorage and sessionStorage to the files in fixtures
 */
Cypress.Commands.add("saveSessionState", () => {
  cy.getCookies().then((cookies) => {
    cy.writeFile(sessionPath.cookies, cookies);
  });
  cy.getAllLocalStorage().then((localStorageData) => {
    cy.writeFile(sessionPath.localStorage, localStorageData);
  });
  cy.getAllSessionStorage().then((sessionStorageData) => {
    cy.writeFile(sessionPath.sessionStorage, sessionStorageData);
  });
});
/**
 * restoreSessionState custom command will restore the session by using cookies, localstorage and sessionstorage files from fixtures folder
 */
Cypress.Commands.add("restoreSessionState", () => {
  cy.readFile(sessionPath.cookies).then((cookies) => {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  });
  cy.restoreLocalStorage();
  cy.restoreSessionStorage();
});
/**
 * restoreLocalStorage custom command will restore the localstorage using localStorage.json file in fixture folder
 */
Cypress.Commands.add("restoreLocalStorage", () => {
  cy.readFile(sessionPath.localStorage).then((localStorageData) => {
    cy.window().then((win) => {
      for (const key in localStorageData) {
        win.localStorage.setItem(key, localStorageData[key]);
      }
    });
  });
});
/**
 * restoreSessionStorage custom command will restore the sessionStorage using sessionStorage.json file in fixture folder
 */
Cypress.Commands.add("restoreSessionStorage", () => {
  cy.readFile(sessionPath.sessionStorage).then((sessionStorageData) => {
    cy.window().then((win) => {
      for (const key in sessionStorageData) {
        win.sessionStorage.setItem(key, sessionStorageData[key]);
      }
    });
  });
});
Cypress.Commands.add("clickSaveLink", () => {
  cy.contains("a", "Save").should("be.visible").scrollIntoView().click();
});
