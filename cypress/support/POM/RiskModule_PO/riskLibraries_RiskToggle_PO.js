class riskLibraries_RiskToggle_PO {


    riskToggleOption() {
        cy.get('[name="risk_taxonomy"]').contains('Business Areas');
        cy.wait(5000);

    }
    noRiskLibraries() {
        cy.get('.toast').contains('Contact your account....')
        cy.wait(1000);
    }

    contentlibDropdown(ContentLibrary1, ContentLibrary2, ContentLibrary3,) {
        cy.get('.select2-arrow > b').click();
        cy.get('#select2-drop').contains(ContentLibrary1);
        cy.contains(ContentLibrary2);
        cy.contains(ContentLibrary3);

    }

    contentLibrayStateMaintained(ContentLibrary) {
        cy.get('.select2-arrow > b').click();
        cy.get('#select2-drop').contains(ContentLibrary).click();
        cy.wait(2000);
        cy.get('#select2-chosen-2').contains(ContentLibrary);

    }

    contentStateMaintained(ContentLibrary) {
        cy.get('#select2-chosen-2').contains(ContentLibrary);

    }


    RiskLibrariesTabGridVerify() {
        cy.get('#riskLibrariesMainGrid').find('[col-id="name"]').contains('Name');
        cy.get('#riskLibrariesMainGrid').find('[col-id="description"]').contains('Description');
        cy.get('#riskLibrariesMainGrid').find('[col-id="riskDefinitionId"]').contains('Risk Definition Id');
        cy.get('#riskLibrariesMainGrid').find('[col-id="businessAreaDefinitions"]').contains('Business Area Definition');
        cy.get('#riskLibrariesMainGrid').find('[col-id="controls"]').contains('Controls');
        cy.get('#riskLibrariesMainGrid').find('[col-id="mappings"]').contains('Mapped to my Taxonomy');
        cy.get('#riskLibrariesMainGrid').find('[col-id="status"]').contains('Status');

    }

    RiskLibrariesGridSearchable(Name, Description, RiskDefinitionId, BusinessAreaDefinition, Controls, MappedtomyTaxonomy, Status) {
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Name Filter Input"]').type(Name).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Description Filter Input"]').type(Description).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Risk Definition Id Filter Input"]').type(RiskDefinitionId).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Business Area Definition Filter Input"]').type(BusinessAreaDefinition).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Controls Filter Input"]').type(Controls).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Mapped to my Taxonomy Filter Input"]').type(MappedtomyTaxonomy).wait(5000).clear();
        cy.get('#riskLibrariesMainGrid').find('[aria-label="Status Filter Input"]').type(Status).wait(5000).clear();

    }

    columnsClickRiskLibrariesTab() {
        cy.get('#riskLibrariesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div.ag-side-buttons > div:nth-child(1) > button > span').click();
        cy.wait(2000);
        cy.get('#riskLibrariesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div:nth-child(2) > div.ag-column-panel > div.ag-column-select.ag-focus-managed.ag-column-panel-column-select > div.ag-column-select-header > div.ag-column-select-header-filter-wrapper.ag-labeled.ag-label-align-left.ag-text-field.ag-input-field > div.ag-wrapper.ag-input-wrapper.ag-text-field-input-wrapper').clear().type('Name').wait(1000);
        cy.get('#ag-82-input').clear();
        cy.wait(5000);


    }

    filtersClickRiskLibrariesTab() {
        cy.get('#riskLibrariesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div.ag-side-buttons > div:nth-child(2) > button > span').click();
        cy.wait(2000);
        cy.get('#riskLibrariesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-side-bar.ag-unselectable.ag-side-bar-right.ag-focus-managed > div:nth-child(3) > div.ag-filter-toolpanel > div.ag-filter-toolpanel-search > div.ag-filter-toolpanel-search-input.ag-labeled.ag-label-align-left.ag-text-field.ag-input-field > div.ag-wrapper.ag-input-wrapper.ag-text-field-input-wrapper').clear().type('Name').wait(1000);
        cy.get('#ag-90-input').clear();
        cy.wait(5000);
    }

    alphabeticalOrdercontentLibray() {
        //dropdown has the element'
        cy.get('.select2-arrow > b').click();
        // Get the dropdown options within the Select dropdown
        cy.get('#select2-drop').then(($options) => {
            // Extract the text content of each option and store them in an array
            const optionTexts = Array.from($options).map(option => option.textContent.trim());
            // Sort the option texts alphabetically
            const sortedOptions = optionTexts.sort();
            // Iterate through the sorted options
            sortedOptions.forEach((optionText) => {
                // Click on the option in the Select dropdown
                cy.get('#select2-results-2 > li:nth-child(1)').click();
                // Log the selected option for visibility in the Cypress test runner
                cy.log(`Selected option: ${optionText}`);
            });
        });

    }

}
export default riskLibraries_RiskToggle_PO;