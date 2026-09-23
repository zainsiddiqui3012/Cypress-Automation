import locators from "../../../../fixtures/locators.json";
import dataFile from "../../../../fixtures/RiskModule/RiskItem/DataFile.json";
import uploadFiles from "../../../../fixtures/DMS/uploadFiles.json";

/**
 * Class representing file upload operations on the Add/Edit Risk Definition page.
 */
class FileUpload {
    /**
     * Navigates to the Add Risk Definition Page.
     * Opens the Add Risk Definition page by clicking the relevant button and validates the page header visibility.
     */
    openAddRiskDefinitionPage() {
        cy.get(locators.risk.administration.riskTaxonomies.addRiskDefinitionBtn)
          .contains(dataFile.btnName)
          .click();
    }

    /**
     * Fills the Risk Definition Form with necessary data and submits it.
     * Handles entering risk item name, selecting a checkbox, uploading a file, and clicking the save button.
     */
    fillRiskDefinitionForm() {
        cy.get(locators.risk.administration.riskTaxonomies.fieldNameInput).first()
          .type(dataFile.riskItemName, { force: true });

        cy.get(locators.risk.administration.riskTaxonomies.checkBox).click();

        const filePath = uploadFiles.filePaths.sampleFile;
        cy.get(locators.risk.administration.riskTaxonomies.fileField)
        .attachFile(filePath);

        cy.get(locators.risk.administration.riskTaxonomies.saveBtn).click({ multiple: true });

        cy.verifyToastMessageText(dataFile.customFiledSaving, 20000);
    }

    /**
     * Searches for an existing Risk Definition and navigates to its Edit page.
     * Waits for grid loader to disappear, searches for a risk item, clicks the edit button, and verifies the edit page visibility.
     */
    searchAndEditRiskDefinition() {
        cy.waitForMyGridLoaderToDisappear(3000000);

        cy.get(locators.risk.administration.riskTaxonomies.searchInput).clear().type(dataFile.riskItemName);

        cy.get(locators.risk.administration.riskTaxonomies.editBtn).first()
        .scrollIntoView()
        .should('be.visible').click({ multiple: true });

        cy.get(locators.risk.administration.riskTaxonomies.editPageHeader)
          .contains(dataFile.pageHeader)
          .should('be.visible');

        cy.get(locators.risk.administration.riskTaxonomies.customFieldGrid)
          .contains(uploadFiles.filePaths.fileName)
          .should('be.visible');
    }
}

export default FileUpload;