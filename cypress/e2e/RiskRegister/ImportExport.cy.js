import ImportExport from "../../support/POM/RiskRegister/ImportExport.js";
const importRisk = new ImportExport();
const writeDataFilePath = "cypress/fixtures/RiskModule/RiskDefintionName.json";
describe(
  "Risk Register - Import and Export Functionality",
  {
    tags: [
      "@regression",
      "@risk-management",
      "@risk-register",
      "@pd36747",
      "@predict",
      "@customer",
    ],
  },
  () => {
    context("Import and Export Functionality", { tags: ["@withRM"] }, () => {
      const withRM = Cypress.env("kxi").customer.withRM;

      beforeEach(() => {
        cy.loginWithSession(
          "login -risk register",
          withRM.username,
          withRM.password,
          withRM.key
        );

        cy.visitRiskRegister();
        importRisk.restoreDefaultLayout();
        importRisk.waitForDefaultLayout();
      });

      it(
        "Verify that Risk Name can be edited through Import Functionality",
        { tags: ["@pd42753", "@pd42754", "@pd42759"] },
        () => {
          importRisk.addriskImportJSON();
          importRisk.uploadImportFile();

          cy.readFile(writeDataFilePath).then((file) => {
            cy.reload();
            cy.waitForLoaderToDisappear("myGrid", 30000); // Wait for grid loader to disappear
            importRisk.searchRiskDefinition(file.RiskDefinitionSearch);
            importRisk.validateRiskOnGrid(file.RiskDefinitionSearch);
          });
        }
      );

      it(
        "Verify 'Download Sample File' link functionality",
        { tags: ["@pd42760","@smoke"] },
        () => {
          importRisk.openImportModal();
          importRisk.downloadSampleFile();
        }
      );

      it(
        "Upload Excel with invalid file format (e.g., .pdf or .docx)",
        { tags: ["@pd42755", "@pd42757", "@smoke"] },
        () => {
          importRisk.openImportModal();
          importRisk.importInvalidFileFormat();
        }
      );
    });
  }
);
