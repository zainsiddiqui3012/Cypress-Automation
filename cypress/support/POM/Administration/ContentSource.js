const assessmentDataString = "cypress/fixtures/Administration/assessments.json";
const contentSourceString="cypress/fixtures/Administration/ContentSource.json"
import contentSourceTestData from "../../../fixtures/Administration/ContentSource.json";
import Assessment from "../../../support/POM/Administration/Assessment";
import locators from "../../../fixtures/locators.json";

const assessment = new Assessment();
class ContentSource {
  //created enum for different waits
  waits = {
    longWait: 120000,
    mediumWait: 60000,
    shortWait: 12000
  };

/**
 * Checks for duplicate content source name and verifies the error message.
 */
checkForDuplicateName() {
    cy.readFile(contentSourceString).then((testData) => {
        cy.visitContentSource();
        cy.waitForLoaderToDisappear("myGrid", this.waits.longWait);
        assessment.sourceAndLibrary(
            testData.contentSourceName,
            testData.updatedDescription
        );
        //verify the error msg when duplicate content source added again
        cy.verifyToastMessageText(
            testData.duplicateNameError,
            this.waits.mediumWait
        );
    });
}

/**
 * Updates the content source with the provided data file.
 * @param {string} dataFile - The name of the data file to read from.
 */
updateContentSource(dataFile) {
    cy.readFile(`cypress/fixtures/Administration/${dataFile}.json`).then(
        ($file) => {
            //search the content source in search text box
            cy.get(locators.general.searchTextField)
                .eq(0)
                .dblclick({ force: true })
                .wait(1000)
                .clear()
                .type($file.contentSourceName)
                .type("{enter}", { delay: 500 });

            cy.get(locators.administration.contentSource.contentSourceGrid)
                .should("have.length", 1)
                .contains($file.contentSourceName);
            cy.waitForTopMsgLoaderToDisappear(50000)
            //updating the name, description of the content Source
            //type source/library name in grid.
            cy.get(locators.administration.contentSource.contentSourceName)
                .eq(1)
                .wait(900)
                .as("contentSourceName")
            cy.get("@contentSourceName").dblclick();
            cy.createRandomString(6).then(($el) => {
                cy.get(
                    locators.administration.contentSource.contentSourceDescriptionTextArea
                )
                    .clear()
                    .type($file.updateBaseContentSourceName + " " + $el)
                    .tab()
                    .tab();
                if ($file.updatedDescription != "") {
                    cy.get(locators.administration.contentSource.contentSourceDescription)
                        .should("have.length", 2)
                        .eq(1)
                        .as("descriptionTextArea")
                    cy.get("@descriptionTextArea").dblclick({ force: true });

                    cy.get(
                        locators.administration.contentSource
                            .contentSourceDescriptionTextArea
                    )
                        .clear()
                        .type($file.updatedDescription, { delay: 300 })
                        .tab();
                }
                $file.contentSourceName = "";
                $file.contentSourceName = $file.updateBaseContentSourceName + " " + $el;
                cy.writeFile(`cypress/fixtures/Administration/${dataFile}.json`, $file);
                cy.readAndWriteData("Content Source Update", $file.updateBaseContentSourceName+ " "+$el)
            });
        }
    );
}

/**
 * Toggles the status buttons based on the active status in the test data.
 */
toggleBtns() {
    contentSourceTestData.active
        ? cy.get(locators.administration.contentSource.contentSourceStatus).contains("Active").click()
        : cy
                .get(locators.administration.contentSource.contentSourceStatus)
                .contains("InActive")
                .click();
}

/**
 * Searches for a content source using a filter name.
 * @param {number} tabIndex - The index of the tab to select.
 * @param {string} fileName - The name of the file to read data from.
 * @param {string} valueName - The name of the value to search for.
 */
searchWithFilterName(tabIndex, fileName, valueName) {
    cy.readFile(`cypress/fixtures/Administration/${fileName}.json`).then(
        (dataFile) => {
            cy.get(locators.administration.contentSource.filterIcon).eq(tabIndex).click({force:true});
            cy.get(locators.administration.contentSource.filterSearch).clear().type(dataFile[valueName], { delay: 250 });
            cy.get(locators.administration.contentSource.contentSourceGrid)
                .should("have.length", 1)
                .contains(dataFile[valueName]);
        }
    );
}


/**
 * Searches for a content source using a filter status.
 * @param {number} tabIndex - The index of the tab to select.
 * @param {string} fileName - The name of the file to read data from.
 * @param {string} valueName - The name of the value to search for.
 */
searchWithFilterStatus(tabIndex, fileName, valueName) {
    cy.visitContentSource();
    cy.readFile(`cypress/fixtures/Administration/${fileName}.json`).then(
        (dataFile) => {
            cy.get(locators.administration.contentSource.statusFilter).eq(tabIndex).click();
            cy.get(locators.administration.contentSource.statusFilterSearch).clear().type(valueName, { delay: 250 });

            cy.get(locators.administration.contentSource.statusFilterSearchResult).contains(valueName).click();

            cy.get(locators.administration.contentSource.statusFilterSearchResult).contains(valueName).should("not.be.checked");

            //closing the status filter
            cy.get(locators.administration.contentSource.statusFilter).eq(tabIndex).click();
            this.searchWithFilterName(-3, "ContentSource", "contentSourceName");
        }
    );
}
}

export default ContentSource;
