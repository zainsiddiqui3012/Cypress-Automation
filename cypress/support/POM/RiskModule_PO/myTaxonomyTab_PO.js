import dayjs from 'dayjs'

class myTaxonomyTab_PO {

    myTaxonomyTabGridVerify() {
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="1"]').contains('Group');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="2"]').contains('Name');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="3"]').contains('Business Area Definition');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="4"]').contains('Controls');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="5"]').contains('Mapped to Risk Libraries');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="6"]').contains('Status');
        cy.get('#riskTaxonomiesMainGrid').find('[aria-colindex="7"]').contains('Action');

    }

    verifyImport() {

        cy.get('[href="#importRiskDialog"] > :nth-child(1) > span').click();
        cy.wait(5000);
        cy.get('#importRiskDialog > .modal-dialog > .m-form > .modal-content > .modal-header > .modal-title').contains('Import Risk Taxonomies from Excel file');
        cy.get('.m-form > .modal-content > .modal-footer > .btn-outline-primary').click();


    }

    verifyExport() {

        cy.get('[href="#exportRiskDialog"] > :nth-child(1) > span').click();
        cy.wait(5000);
        cy.get('#exportRiskDialog > .modal-dialog > .modal-content > .modal-header > .modal-title').contains('Export Risk Taxonomies from an Excel file');
        cy.wait(1000);
        cy.get('#exportRiskDialog > .modal-dialog > .modal-content > .modal-footer > .btn-outline-primary').click();

    }

    verifyRestore() {

        cy.get('body > div.m-grid.m-grid--hor.m-grid--root.m-page > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body > div.m-grid__item.m-grid__item--fluid.m-wrapper.pl-3 > div.m-subheader > div > ul.list-inline.m-0.ml-auto.pr-2 > li:nth-child(4) > div > div > div > div > div > a:nth-child(3) > span').click();
        cy.wait(5000);
        cy.get('#toast-container > div > div').contains('Restored default layout')


    }

    searchDefintiontaxonomyGrid(RiskDefinitionSearch){
        cy.get('[aria-label="Name Filter Input"]').wait(2000).clear().wait(5000).type(RiskDefinitionSearch);
        cy.wait(2000);

    }

    verifyRecordOrphan(RiskDefinitionSearch) {
   
        cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-center-cols-clipper > .ag-center-cols-viewport').contains('Orphan');
        // cy.get('.ag-group-value > span').dblclick();
        cy.wait(2000);
        cy.get('[aria-colindex="2"]').contains(RiskDefinitionSearch);
        cy.wait(2000);
        cy.get('.ag-group-value > span').type('{enter}');

    }
  
}




export default myTaxonomyTab_PO;