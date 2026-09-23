import dataFile from "../../../fixtures/RiskModule/RiskItem/DataFile.json";
import FileUpload from "../../../support/POM/Administration/CustomFields_PO/FileUpload_PO.js";

/**
 * Test suite for File Upload Custom Field operations on the Add/Edit Risk Definition page.
 */
describe(
  "File Upload Custom Field Test",
  {
    tags: [
      "@release5.20.3",
      "@pd32613",
      "@regression",
      "@erm",
      "@custom-field",
      "@risk-taxonomy"
    ],
  },
  () => {
    const customField = new FileUpload();

    /**
     * Logs in before each test case using session-based authentication.
     * Ensures user is authenticated before proceeding with tests.
     */
    beforeEach(() => {
      cy.loginWithSession(
        "login - with Risk Management",
        Cypress.env("username"),
        Cypress.env("password"),
        Cypress.env("key")
      );
    });

    /**
     * Test case to save a Custom Field (File Field) successfully on the Add Risk Definition page.
     * Navigates to the Risk Taxonomies page, fills the form, uploads a file, and validates success message.
     * @pd28304 this Ticket Id is Bug ticket Id
     */
    it(
      "Verify that a file field can be added successfully to the Risk Definition screen",
      {
    
        tags: ["@smoke", "@pd28304", "@pd33268"],
      },
      () => {
        cy.visitRiskTaxonomies();
        customField.openAddRiskDefinitionPage();
        customField.fillRiskDefinitionForm();
      }
    );

    /**
     * Test case to verify the uploaded file appears on the Edit screen of a Risk Definition.
     * Searches for the created Risk Definition and verifies the file is displayed correctly.
     * @pd28304 this Ticket Id is Bug ticket Id
     */
    it(
      "Should verify the uploaded file appears on the Edit screen",
      {
        tags: ["@smoke", "@pd28304", "@pd33661"],
      },
      () => {
        cy.visitRiskTaxonomies();
        customField.searchAndEditRiskDefinition();
      }
    );
  }
);
