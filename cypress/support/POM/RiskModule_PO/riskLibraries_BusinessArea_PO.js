import locators from '../../../fixtures/locators.json';
class riskLibraries_BusinessArea_PO {


    /////*****None Space Risk taxonomy */
    riskTaxomomySearch(RiskTaxomomy) {
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-pivot-off > div.ag-header-viewport > div > div:nth-child(2) > div:nth-child(1) > div.ag-floating-filter-body').wait(1000).type(RiskTaxomomy);
        cy.wait(5000);
        /////*****None Space viewTaxonomy Click */
        cy.get('#viewTaxonomy').click();

    }
    /////***** Business Area Toggle Click */
    businessAreaToggleClick() {
        cy.get('.toggle-on').click();
        cy.wait(5000);

    }

    /////*****content lib Dropdown */
    contentlibDropdown(ContentLibrary) {
        cy.get('.select2-arrow > b').click();
        cy.get('#s2id_autogen2_search').type(ContentLibrary).type('{enter}');
        cy.wait(5000);

    }
    /////*****searc Risk Definition without BA */
    searchNameRiskLibrariesGrid(RiskDefinitionSearchUncategorized) {
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Name Filter Input"]').clear().type(RiskDefinitionSearchUncategorized);
        // cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(3) > div.ag-floating-filter-body').clear().type(RiskDefinitionSearchUncategorized);
        cy.wait(2000);

    }

    clearSearchNameRiskLibrariesGrid() {
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Name Filter Input"]').clear();
        cy.wait(2000);

    }

    /////*****searc Risk Definition with BA */
    searchRiskLibrariesGrid(RiskDefinitionSearch) {
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Name Filter Input"]').clear().type(RiskDefinitionSearch);
        // cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[1]/div[2]/div/div[2]/div[2]').type('{ctrl+a}').type(RiskDefinitionSearch);
        cy.wait(5000);

    }
    agGridIconOpen() {
        cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1) > span > span.ag-group-contracted > span').wait(2000).click({ force: true });
        cy.wait(5000);

    }

    agGridGroupIconExpend() {
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="1"]').wait(5000).type('{downArrow}{enter}{downArrow}{enter}{downArrow}{enter}{downArrow}{enter}');
        cy.wait(5000);

    }

    /////*****verify agGrid Data without BA, verify Uncategorized text */
    verifyagGridData(RiskDefinitionSearchUncategorized) {
        cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div').contains("Uncategorized");
        cy.wait(3000);
        cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div').contains(RiskDefinitionSearchUncategorized);
        cy.wait(3000);
        // cy.get('.ag-cell-focus > .ag-cell-wrapper > .ag-group-expanded').click();

    }

    /////*****verify agGrid Data With BA, verify categorized text (Grouping)*/
    verifyagGridGroupData(Type, Cat1, Cat2, RiskDefinitionSearch) {
        cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-level-0.ag-row-group.ag-row-position-absolute.ag-row-even.ag-row-first.ag-row-group-expanded.ag-row-no-focus > div:nth-child(1) > span > span.ag-group-value').contains(Type);
        cy.wait(3000);
        cy.get('#riskLibrariesBussGrid').find('[aria-colindex="1"]').wait(1000).contains(Cat1);
        cy.wait(3000);
        cy.get('#riskLibrariesBussGrid').find('[row-index="2"]').wait(1000).contains(Cat2);
        cy.wait(3000);
        cy.get('#riskLibrariesBussGrid').find('[aria-colindex="3"]').wait(1000).contains(RiskDefinitionSearch);
        // cy.get('#riskLibrariesBussGrid').find('[aria-colindex="3"]').wait(1000).contains(RiskDefinitionSearch).type('{leftArrow}{upArrow}{enter}{upArrow}{enter}{upArrow}{enter}');
        cy.wait(3000);

    }

    clickOnRestoreDefaultLayout() {
        cy.contains('Restore Default Layout').click();
        cy.wait(5000);

    }
    /////*****Business Area Grid Col Verify */
    businessAreaGridColVerify() {
        cy.get('#riskLibrariesBussGrid').find('[col-id="name"]').contains('Name');
        cy.get('#riskLibrariesBussGrid').find('[col-id="riskCategoryHierarchy"]').contains('Risk Category');
        cy.get('#riskLibrariesBussGrid').find('[col-id="mappings"]').contains('Mapped to My Taxonomy');
        cy.get('#riskLibrariesBussGrid').find('[col-id="controls"]').contains('Controls');
        cy.get('#riskLibrariesBussGrid').find('[col-id="1"]').contains('Status');

    }

    noControlsAttachedWithContentLibrary() {

        // cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[1]').wait(2000).type('{enter}');
        // cy.get('#riskLibrariesBussGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row-odd.ag-row-no-focus.ag-row.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last > div:nth-child(1) > span > span.ag-group-value').type('{enter}');
        // cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[3]/div[1]/span').wait(1000).type('{enter}');
        ////****Control Blank Col check */
        cy.get(locators.risk.administration.riskTaxonomies.controlColBusinessArea).eq(0).should('have.value', '');
        cy.wait(3000);
        ////****Arrow close*/
        cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[3]/div[1]/span/span[4]').type('{enter}');
        cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[2]/div[1]/span/span[4]').type('{enter}');
        cy.xpath('//*[@id="riskLibrariesBussGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[1]/span/span[4]').type('{enter}');

    }

    /////*****Business Area Grid Col Searchable */
    businessAreaGridColSearchable(RiskDefinitionSearchUncategorized, RiskCategorySearch, MappedtoMyTaxonomy, Controls) {
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Name Filter Input"]').clear().type(RiskDefinitionSearchUncategorized);
        /////*****Click on Grid Expended */
        cy.wait(5000);
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="1"]').type('{downArrow}{enter}')
        cy.wait(2000);
        cy.get('#riskLibrariesBussGrid').find('[aria-colindex="3"]').contains(RiskDefinitionSearchUncategorized);
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Name Filter Input"]').clear();

        cy.get('#riskLibrariesBussGrid').find('[aria-label="Risk Category Filter Input"]').clear().type(RiskCategorySearch);
        cy.wait(5000);
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="1"]').wait(5000).type('{downArrow}{enter}{downArrow}{enter}{downArrow}{enter}{downArrow}{enter}');
        cy.wait(5000);
        cy.get('#riskLibrariesBussGrid').find('[aria-colindex="4"]').contains(RiskCategorySearch);
        cy.get('#riskLibrariesBussGrid').find('[aria-label="Risk Category Filter Input"]').clear();


        // cy.get('#riskLibrariesBussGrid').find('[aria-label="Mapped to My Taxonomy Filter Input"]').clear().type(MappedtoMyTaxonomy);
        // cy.get('#riskLibrariesBussGrid').find('[aria-colindex="5"]').contains(MappedtoMyTaxonomy);
        // cy.get('#riskLibrariesBussGrid').find('[aria-label="Mapped to My Taxonomy Filter Input"]').clear();

        // cy.get('#riskLibrariesBussGrid').find('[aria-label="Controls Filter Input"]').clear().type(Controls)
        // cy.get('#riskLibrariesBussGrid').find('[aria-colindex="6"]').contains(Controls);
        // cy.get('#riskLibrariesBussGrid').find('[aria-label="Controls Filter Input"]').clear();

        /////*****Click on Grid Closed */
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="1"]').type('{downArrow}{enter}')


    }

    gridColumnsOption() {
        ////Open Column
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > :nth-child(1) > .ag-side-button-button > .ag-side-button-label').click();
        cy.wait(2000);

        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-side-bar > :nth-child(2) > .ag-column-panel > .ag-column-select > .ag-column-select-list > .ag-virtual-list-viewport > .ag-virtual-list-container > [aria-posinset="1"] > .ag-column-select-column > .ag-column-select-column-label').contains("Name");
        cy.get('[aria-posinset="2"] > .ag-column-select-column > .ag-column-select-column-label').contains("Risk Category");
        cy.wait(2000);
        cy.get('[aria-posinset="5"] > .ag-column-select-column').contains("Status");
        cy.get('[aria-posinset="6"] > .ag-column-select-column > .ag-column-select-column-label').contains("Type");
        cy.get('[aria-posinset="4"] > .ag-column-select-column > .ag-column-select-column-label').contains("Controls");
        cy.get('[aria-posinset="3"] > .ag-column-select-column > .ag-column-select-column-label').contains("Mapped to My Taxonomy");
        cy.get('[aria-posinset="7"] > .ag-column-select-column').contains("Business Area Category 1");
        cy.get('[aria-posinset="8"] > .ag-column-select-column > .ag-column-select-column-label').contains("Business Area Category 2");
        cy.wait(2000);
        cy.get('.ag-selected > .ag-side-button-button > .ag-side-button-label').click();


    }


    GridfiltersOption() {
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-side-bar > .ag-side-buttons > :nth-child(2) > .ag-side-button-button > .ag-side-button-label').click();
        cy.wait(5000);
        cy.get('.ag-selected > .ag-side-button-button > .ag-side-button-label').click();

    }

    checkBoxGridSelectionOfGroup() {
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-pinned-left-header > .ag-header-row-column > .ag-header-cell').click();
        cy.wait(2000);
        cy.get('#import-btn > span > span').click();
        cy.get('#widgetStep-1 > div > div.m-portlet__head.bg-success > div > div > h3').contains("Risk Libraries");
        cy.get('#widgetStep-1 > div > div.m-portlet__foot.m-portlet__foot--fit.text-right.border-secondary > div > a > span > span').click();
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-pinned-left-header > .ag-header-row-column > .ag-header-cell').click();
        cy.wait(5000);
    }

    checkBoxGridSelectionOfSingle() {
        ///Click on check box on definition
        cy.get(locators.risk.administration.riskTaxonomies.checkboxgridSelection).eq(2).check({ force: true });
        cy.wait(2000);
        cy.get('#import-btn > span > span').click();
        cy.get('#widgetStep-1 > div > div.m-portlet__head.bg-success > div > div > h3').contains("Risk Libraries");
        cy.get('#widgetStep-1 > div > div.m-portlet__foot.m-portlet__foot--fit.text-right.border-secondary > div > a > span > span').click();
        cy.get('.ag-pinned-left-cols-container > .ag-row-level-3 > .ag-cell').click();

    }

    checkBoxGridSelectionOfMultiple(RiskDefinitionSearch) {
        ///Click on check box on Multiple
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-pinned-left-cols-container > .ag-row-level-0 > .ag-cell').click({ multiple: true });
        cy.wait(5000);
        cy.get('#import-btn > span > span').click();
        cy.get('#widgetStep-1 > div > div.m-portlet__head.bg-success > div > div > h3').contains("Risk Libraries");
        cy.get('#widgetStep-1 > div > div.m-portlet__foot.m-portlet__foot--fit.text-right.border-secondary > div > a > span > span').click();
        cy.get('#riskLibrariesBussGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-pinned-left-cols-container > .ag-row-level-0 > .ag-cell').click();
        // cy.get('#riskLibrariesBussGrid').find('[aria-colindex="3"]').wait(1000).contains(RiskDefinitionSearch).type('{leftArrow}{upArrow}{enter}{upArrow}{enter}{upArrow}{enter}');

    }

    moveCategoryDefinition(RiskDefinitionSearch) {
        ///Click on check box on definition
        cy.get('.ag-pinned-left-cols-container > .ag-row-level-3 > .ag-cell').click();
        cy.wait(2000);
        ///Import button Click
        cy.get('#import-btn > span > span').click();
        cy.get('#widgetStep-1 > div > div.m-portlet__head.bg-success > div > div > h3').contains("Risk Libraries");
        ///check box Click
        cy.get('#riskLibrariesFlyoutGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-pinned-left-cols-container > .ag-row-even > .ag-cell').click();
        ///Next button Click
        cy.get('#step1-next-btn > :nth-child(1) > span').click();
        ///My Taxonomy Flyer Check box Click
        cy.xpath('//*[@id="myTaxonomiesFlyoutGrid"]/div/div[2]/div[2]/div[3]/div[1]/div[1]/div/div/div/div/div[2]').click({ force: true });
        ///Next button Click
        cy.get('#step2-next-btn').click();
        ///Commit button Click
        cy.get('#step3-next-btn > :nth-child(1) > span').click();
        ///Yes button Click - Popup
        cy.get('#commitWarningDialogue-yes-btn').click();
        cy.get('#view-job-queue-modal > div > div > div.modal-header > button').click();
        cy.wait(7000);
        cy.get('#riskTaxonomiesMainGrid').find('[aria-label="Name Filter Input"]').clear().type(RiskDefinitionSearch);
        cy.wait(8000);
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').type('{downArrow}{enter}');
        cy.wait(5000);
        cy.get('#riskTaxonomiesMainGrid').find('[col-id="name"]').contains(RiskDefinitionSearch);



    }

    agGridGroupClosedExpend(RiskDefinitionSearch) {
        cy.wait(5000);
        ///Click on check box on Multiple
        cy.get('#riskLibrariesBussGrid').find('[aria-colindex="3"]').wait(1000).contains(RiskDefinitionSearch).type('{leftArrow}{upArrow}{enter}{upArrow}{enter}{upArrow}{enter}');
        cy.wait(5000);

    }

    verifyRiskCategoryCommaSeparated_BA(RiskCategorySearch) {
        cy.get('#riskLibrariesBussGrid').find('[col-id="mappings"]').wait(1000).contains(RiskCategorySearch);
        cy.wait(5000);

    }



}
export default riskLibraries_BusinessArea_PO;