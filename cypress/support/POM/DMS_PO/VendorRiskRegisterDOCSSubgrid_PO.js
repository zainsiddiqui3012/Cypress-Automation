import locators from "../../../fixtures/locators.json";
import uploadFiles from "../../../fixtures/DMS/uploadFiles.json";

export default class VendorRiskRegister {
  // Navigate to Vendor Risk Register Page
  navigateToVendorRiskRegister() {
    cy.visit(Cypress.env("VENDOR_RISK_MANAGEMENT"))
  }

  // Verify the value in the grid and expand
  //Need a static waits for this Method beacuse the default loader is not here in this scenario! 
  verifyGridValueAndExpand() {
    // Step 1: Double-click on the grid element and wait for the API call to complete
    cy.get(locators.grid.expandableRow)
      .dblclick({ force: true })
      .wait(3000);
  

    // Repeat the action to ensure expansion
    cy.get(locators.grid.expandableRow).dblclick({ force: true });
    cy.get(locators.grid.expandableRow)
      .dblclick({ force: true })
      .wait(5000);

    // Step 2: Verify the grid is expanded and data is loaded
    cy.get(locators.grid.expandedGrid).should("be.visible");

    // Step 3: Click on the upload button
    cy.get(locators.buttons.uploadButton)
      .first()
      .should("be.visible")
      .click();

    // Step 4: Wait for the upload document modal to appear
    cy.get(locators.modals.uploadDocumentModal, { timeout: 10000 }).should("be.visible");

    // Step 5: Click on the document input to trigger file upload
    cy.get(locators.inputs.documentInput).click();

    // Step 6: Upload the file
    const filePath = uploadFiles.filePaths.sampleFile;
    cy.get(locators.inputs.fileUploadInput).attachFile(filePath);

    // Step 7: Select a random option from the dropdown
    cy.get(locators.dropdown.documentType).click();
    cy.get(locators.dropdown.options).then(($options) => {
      const randomIndex = Math.floor(Math.random() * $options.length);
      cy.wrap($options[randomIndex]).click();
    });

    // Step 8: Click the upload button
    cy.get(locators.buttons.confirmUploadButton).click();
    cy.verifyToastMessageText(uploadFiles.toastVerifyMsg, 20000);
  }

  // Verify the uploaded document is visible in the grid
  verifyUploadedDocument() {
    cy.fixture('DMS/uploadFiles').then((uploadFiles) => {
      const sampleFileName = uploadFiles.filePaths.fileName.split('/').pop();
      cy.get(locators.grid.uploadedDocuments).should("contain", sampleFileName);
    });
  }
}
