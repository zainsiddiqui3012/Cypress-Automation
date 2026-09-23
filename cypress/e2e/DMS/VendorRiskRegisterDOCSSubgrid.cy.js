import VendorRiskRegisterDOCSSubgrid_PO from "../../support/POM/DMS_PO/VendorRiskRegisterDOCSSubgrid_PO";

/**
 * Test Case: Verify upload of the document in Vendor Risk Register
 * Description: This test case verifies that a document can be successfully uploaded and appears in the Vendor Risk Register Docs grid.
 */

describe("Vendor Risk Register Test", () => {
  const vendorRisk = new VendorRiskRegisterDOCSSubgrid_PO(); 
  beforeEach(() => {
    cy.loginWithSession("login - with Risk Management",Cypress.env("username"),Cypress.env("password"),Cypress.env("key"));
  });

it("Should validate vendor risk grid functionality", { tags: ["@release5.21", "regression"] }, () => {
    // Step 1: Log in

    // Step 2: Navigate to the Vendor Risk Register page
    vendorRisk.navigateToVendorRiskRegister();

    // Step 3: Scroll the grid to the right (if needed)

    // Step 4: Verify grid value and expand data
    vendorRisk.verifyGridValueAndExpand();

    // Step 5: Assert the test case result
   
    vendorRisk.verifyUploadedDocument();
  });
});