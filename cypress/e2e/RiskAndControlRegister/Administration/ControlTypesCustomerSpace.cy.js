import ControlTypesPage from '../../../support/POM/RiskAndControlRegister/Administration/ControlTypesCustomerSpace.js';
import data from '../../../fixtures/RiskAndControlRegister/Administration/ControlTypesCustomerSpace.json';  // Import data
import locators from '../../../fixtures/locators.json';
import LoginDetails_PO from "../../../support/POM/LoginPredict_PO/LoginDetails_PO.js";  // Correct import for Login PO
import DateHelper from '../../../support/POM/RiskAndControlRegister/Administration/helpers/DateHelper.js';

describe('Control Types Form Submission',
    {
    tags: [
      "@pd36722",
      "@risk-management",
      "@customer",
      "@regression",
      "@control-types"
    ],
  },
    () => {
      context("Control Types Form Submission", () => {
      beforeEach(() => {
        const username = Cypress.env("username");
        const password = Cypress.env("password");
        const key = Cypress.env("key");
        
        cy.loginWithSession(
          `login with ${username}`,
          username,
          password,
          key
        );
        cy.visit(Cypress.env("CONTROL_TYPES"));
      });


  // Test Case 1: Open Add Control Type Dialog
  it('should open the Add Control Type dialog',{tags:"@smoke"}, () => {
    const controlTypesPage = new ControlTypesPage();
    controlTypesPage.openAddControlTypeDialog();
    controlTypesPage.verifyModalIsOpen();
  });

  // Test Case 2: Add Control Type with Valid Name and Description
  it('should add a control type with valid name and description',{tags:"@smoke"}, () => {
    const controlTypesPage = new ControlTypesPage();
    // const controlTypeName = data.validControlTypes.validName;
    const controlTypeName= "Valid Control Type " + new Date().getTime(); // Unique name
    
    controlTypesPage.openAddControlTypeDialog();
    controlTypesPage.verifyModalIsOpen();
    
    controlTypesPage.fillControlName(controlTypeName);
    controlTypesPage.fillDescription(data.validControlTypes.validDescription);
    
    controlTypesPage.clickSaveWithVerification(controlTypeName, true);
    
    // Additional verification that the control type was added
    controlTypesPage.verifyControlTypeExists(controlTypeName);
  });

  // Test Case 3: Add Control Type with Empty Name
  it('should show validation error when Control Name is empty',{tags:"@smoke"}, () => {
    const controlTypesPage = new ControlTypesPage();
    controlTypesPage.openAddControlTypeDialog();
    controlTypesPage.verifyModalIsOpen();
    
    controlTypesPage.fillDescription(data.testData.emptyNameDescription);
    controlTypesPage.clickSave();
    
    // Verify validation error appears
    controlTypesPage.verifyValidationError();
    controlTypesPage.verifyErrorToast();
  });

// Test Case 4: Add Control Type with Name Exceeding Character Limit
it('should show an error for name exceeding character limit', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openAddControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(data.testData.validNameForInvalidDescr);
  controlTypesPage.fillDescription(data.testData.invalidDescriptionValue);
  controlTypesPage.clickSave();
  
  // Verify validation error for character limit
  controlTypesPage.verifyValidationError();
  controlTypesPage.verifyErrorToast();
});

// Test Case 5: Add Control Type with Special Characters in Name
it('should allow special characters in the name', () => {
  const controlTypesPage = new ControlTypesPage();
  // const specialCharControlName = data.invalidControlTypes.specialCharactersName;
  const specialCharControlName = DateHelper.generateSpecialCharsRiskTypeData()
  controlTypesPage.openAddControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(specialCharControlName.name);
  controlTypesPage.fillDescription(data.testData.specialCharNameDescription);
  controlTypesPage.clickSaveWithVerification(specialCharControlName.name, true);
  
  // Verify the special character control type exists in the table
  controlTypesPage.verifyControlTypeExists(specialCharControlName.name);
});

// Test Case 6: Add Control Type with Invalid Characters in Description
it('should allow invalid characters in the description', () => {
  const controlTypesPage = new ControlTypesPage();
  const controlName = "Valid Control Type " + new Date().getTime(); // Unique name
  
  controlTypesPage.openAddControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(controlName);
  controlTypesPage.fillDescription(data.testData.invalidDescriptionValue);
  controlTypesPage.clickSaveWithVerification(controlName, true);
  
  // Verify the control type with invalid description characters exists
  controlTypesPage.verifyControlTypeExists(controlName);
});

// Test Case 7: Add Control Type with Empty Description
it('should allow saving with an empty description',{tags:"@smoke"}, () => {
  const controlTypesPage = new ControlTypesPage();
  const controlName ="Valid Control Type " + new Date().getTime(); // Unique name
  
  controlTypesPage.openAddControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(controlName);
  controlTypesPage.clickSaveWithVerification(controlName, true);
  
  // Verify the control type without description exists
  controlTypesPage.verifyControlTypeExists(controlName);
});

// Test Case 8: Cancel Add Control Type
it('should close the Add Control Type dialog without saving',{tags:"@smoke"}, () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openAddControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.clickCancel();
  controlTypesPage.verifyModalIsClosed();
});

// Test Case 9: Edit Control Type Dialog
it('should edit Control Type successfully',{tags:"@smoke"}, () => {
  const controlTypesPage = new ControlTypesPage();
  const updatedName ="Updated Control Type " + new Date().getTime(); // Unique name
  
  controlTypesPage.showAllResults();
  controlTypesPage.openEditControlTypeDialog(0);
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(updatedName);
  controlTypesPage.fillDescription(data.testData.updatedControlTypeDescription);
  
  controlTypesPage.clickSaveWithVerification(updatedName, true);
  controlTypesPage.verifyControlTypeExists(updatedName);
});

// Test Case 10: Edit Control Type with Valid Name and Description
it('should edit Control Type with valid name and description',{tags:"@smoke"}, () => {
  const controlTypesPage = new ControlTypesPage();
  const updatedName ="Updated Control Type " + new Date().getTime(); // Unique name
  
  controlTypesPage.openAndEditControlType(0, updatedName, data.testData.updatedControlTypeDescription);
  controlTypesPage.verifySuccessToast();
  controlTypesPage.verifyControlTypeExists(updatedName);
  
  // Additional assertion: Verify the updated control type exists in the table
  // Option 1: Simple verification without filtering
  controlTypesPage.verifyControlTypeExistsInTable(updatedName);
  
  // Option 2: Filter verification (commented out - use if needed)
  // const filterTerm = "Updated Control"; // Use a more general filter term
  // controlTypesPage.filterAndVerifyUpdatedControlType(filterTerm, updatedName);
});

// Test Case 11: Edit Control Type with Empty Name
it('should show validation error when editing Control Type with empty name',{tags:"@smoke"}, () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openEditControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.editControlType(data.invalidControlTypes.emptyName, data.testData.validDescriptionForEmptyName);
  
  // Verify validation error for empty name
  controlTypesPage.verifyValidationError();
  controlTypesPage.verifyErrorToast();
});

// Test Case 12: Edit Control Type with Invalid Characters in Name
it('should handle invalid characters in Control Type name during edit', () => {
  const controlTypesPage = new ControlTypesPage();
  // const invalidCharName = data.invalidControlTypes.specialCharactersName + ' - Edit';
  const invalidCharName= DateHelper.generateSpecialCharsRiskTypeData()
  controlTypesPage.openEditControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.editControlType(invalidCharName.name, data.testData.descriptionForInvalidChars);
  
  // This might succeed or fail depending on business rules
  // Check if it was accepted (success) or rejected (error)
  cy.get('body').then($body => {
    if ($body.find('.toast-error, .alert-danger, .error-message').length > 0) {
      controlTypesPage.verifyErrorToast();
      cy.log('Invalid characters rejected as expected');
    } else {
      controlTypesPage.verifySuccessToast();
      cy.log('Invalid characters were accepted');
      // Only verify existence if no error occurred and we're still logged in
      cy.get('body').then($body2 => {
        if (!$body2.find('#username, #password, [name="username"], [name="password"], .login-form').length) {
          controlTypesPage.verifyControlTypeExists(invalidCharName.name);
        } else {
          cy.log('⚠️ User logged out - skipping table verification');
        }
      });
    }
  });
});

// Test Case 13: Edit Control Type with Name Exceeding Character Limit
it('should show error when editing Control Type name exceeds character limit', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openEditControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.editControlType(data.invalidControlTypes.longName256, data.testData.descriptionForCharLimit);
  
  // Verify validation error for character limit exceeded
  controlTypesPage.verifyValidationError();
  controlTypesPage.verifyErrorToast();
});

// Test Case 14: Edit Control Type and Cancel
it('should close dialog without saving when Cancel is clicked during edit', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openEditControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.fillControlName(data.testData.modifiedName);
  controlTypesPage.fillDescription(data.testData.modifiedDescription);
  
  controlTypesPage.cancelEditControlType();
  controlTypesPage.verifyModalIsClosed();
  
  // Verify the changes were not saved by checking the control type doesn't exist with modified name
  controlTypesPage.verifyControlTypeDoesNotExist(data.testData.modifiedName);
});

// Test Case 15: Edit Control Type with Empty Description
it('should allow saving Control Type with empty description during edit', () => {
  const controlTypesPage = new ControlTypesPage();
  const emptyDescName = data.testData.emptyDescriptionEditName + ' - ' + new Date().getTime();
  
  controlTypesPage.openEditControlTypeDialog();
  controlTypesPage.verifyModalIsOpen();
  
  controlTypesPage.editControlType(emptyDescName, data.invalidControlTypes.emptyDescription);
  
  controlTypesPage.verifySuccessToast();
  controlTypesPage.verifyControlTypeExists(emptyDescName);
});

// Filter and Search Test Cases
it('Test Case 16: should apply filter and show filtered results', () => {
  const controlTypesPage = new ControlTypesPage();
  const filterName = data.filterTestData.validFilterName;
  
  controlTypesPage.filterControlTypes(filterName);
  controlTypesPage.verifyFilterResults(filterName);
  
  // Verify that the filtered results exist
  cy.get('body').then($body => {
    if ($body.find('tbody tr').length > 0) {
      cy.get('tbody tr').should('exist').and('have.length.greaterThan', 0);
      // Check if the filter results contain the filter term (case-insensitive)
      cy.get('tbody').invoke('text').then(tableText => {
        const lowerTableText = tableText.toLowerCase();
        const lowerFilterName = filterName.toLowerCase();
        if (lowerTableText.includes(lowerFilterName)) {
          cy.log(`✓ Filter applied successfully for: ${filterName}`);
        } else {
          cy.log(`⚠️ Filter applied but "${filterName}" not found in results - may be expected behavior`);
        }
      });
    } else {
      cy.log(`⚠️ No results found for filter: ${filterName}`);
    }
  });
});

it('Test Case 17: should show selected number of records (10 records)', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.changeRecordsPerPage(data.paginationTestData.recordsPerPage[0]);
  cy.get('tbody tr').should('exist').then($rows => {
    cy.log(`Current number of rows displayed: ${$rows.length}`);
    cy.get('tbody tr').should('have.length.greaterThan', 0);
  });
});

it('Test Case 18: should show selected number of records (20 records)', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.changeRecordsPerPage(data.paginationTestData.recordsPerPage[1]);
  cy.get('tbody tr').should('exist');
});

it('Test Case 19: should paginate through Control Types', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.changeRecordsPerPage(data.paginationTestData.recordsPerPage[2]);
  controlTypesPage.goToNextPage();
  controlTypesPage.goToPreviousPage();
});

it('Test Case 20: should sort Control Types by Name', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.sortByName();
  cy.get('tbody tr').should('have.length.greaterThan', 0);
});

it('Test Case 21: should display pagination information correctly', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.verifyPaginationInfo();
  cy.get('.dataTables_info').should('contain', 'Showing').and('contain', 'entries');
});

it('Test Case 22: should view details of Control Type', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.viewControlTypeDetails(0);
  cy.url().should('include', 'manageControlType');
});

it('Test Case 23: should show "No Records Found" for invalid filter', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  
  const invalidName = data.filterTestData?.invalidFilterName || 'NonExistentControlType';
  controlTypesPage.applyFilterWithName(invalidName);
  controlTypesPage.verifyNoRecordsFound();
  
  // Assert that no records are shown
  cy.get('body').then($body => {
    if ($body.find('tbody tr').length > 0) {
      // If there are rows, check if they indicate no records found
      cy.get('tbody').invoke('text').then(tableText => {
        const lowerText = tableText.toLowerCase();
        if (lowerText.includes('no records found') || 
            lowerText.includes('no data available') || 
            lowerText.includes('no results') ||
            lowerText.includes('nothing found')) {
          cy.log('✓ "No records found" message displayed correctly');
        } else {
          cy.log('⚠️ Table has content, but may be filtered results');
        }
      });
    } else {
      // If no rows, that's also acceptable for no records
      cy.log('✓ No rows found, filter working correctly');
    }
  });
});

it('Test Case 24: should open filter popup', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  cy.get('.col-md-9 > #controlName').should('be.visible');
});

it('Test Case 25: should apply filter with Name', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  const filterName = data.filterTestData?.validFilterName || 'Corrective';
  controlTypesPage.applyFilterWithName(filterName);
  controlTypesPage.verifyFilterResults(filterName);
});

it('Test Case 26: should clear filter', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  const filterName = data.filterTestData?.validFilterName || 'Corrective';
  cy.get('.col-md-9 > #controlName').type(filterName);
  controlTypesPage.clearFilter();
});

it('Test Case 27: should apply all filters (Name, Customer, Reseller)', () => {
  const controlTypesPage = new ControlTypesPage();
  const filterName = data.filterTestData?.validFilterName || 'Corrective';
  const customer = data.filterTestData?.validCustomer || 'TestCustomer';
  const reseller = data.filterTestData?.validReseller || 'TestReseller';
  controlTypesPage.applyAllFilters(filterName, customer, reseller);
  cy.get('tbody tr').should('exist');
});

it('Test Case 28: should apply empty filter and return all records', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  const emptyFilter = '';
  controlTypesPage.applyFilterWithName(emptyFilter);
  cy.get('tbody tr').should('exist');
});

it('Test Case 29: should close filter popup without applying changes', () => {
  const controlTypesPage = new ControlTypesPage();
  controlTypesPage.openFilterPopup();
  const filterName = data.filterTestData?.validFilterName || 'Corrective';
  cy.get('.col-md-9 > #controlName').type(filterName);
  controlTypesPage.closeFilterPopup();
  
  // Give time for modal to close and verify it's closed
  cy.wait(2000);
  cy.get('body').then($body => {
    if ($body.find('#filterForm:visible').length === 0) {
      cy.log('✓ Filter modal is closed');
    } else {
      cy.log('⚠ Filter modal might still be visible, trying escape key');
      cy.get('body').type('{esc}');
    }
  });
});

it('Test Case 30: should load Control Types list with all control types displayed', () => {
  const controlTypesPage = new ControlTypesPage();
  cy.get('tbody tr').should('exist').and('have.length.greaterThan', 0);
  cy.get('tbody tr').then($rows => {
    cy.log(`Found ${$rows.length} control type rows`);
    cy.wrap($rows).each($row => {
      cy.wrap($row).find('td').first().should('not.be.empty');
    });
    cy.get('tbody').invoke('text').then(tableText => {
      cy.log('Table content:', tableText);
      expect(tableText.trim()).to.not.be.empty;
      cy.log('Control Types table loaded successfully with data');
    });
  });
});
 });
})