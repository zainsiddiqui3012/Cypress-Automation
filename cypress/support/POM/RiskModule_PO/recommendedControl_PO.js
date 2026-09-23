import dayjs from 'dayjs'
import { value } from 'jsonpath';

const Write_ControlDefinition = 'cypress/fixtures/RiskModule/Control_Taxonomy/Write_ControlDefinition.json'
const filename = 'cypress/fixtures/RiskModule/Risk_Process_Taxonomy/_Write_RecommendedControlsDefintion.json'
const controlCategory = 'cypress/fixtures/RiskModule/Control_Taxonomy/ControlCategoryMapping.json'

Cypress.Commands.add('readControlDefinition_RecommendedControlsflyer', () => {
    return cy.readFile(Write_ControlDefinition).then((data1) => {
        // Return the RecommendedControlsDefintion from the JSON file
        return data1.ControlDefinition_RecommendedControlsflyer;
    });
});

Cypress.Commands.add('readRecommendedControlDefinitions', () => {
    return cy.readFile(filename).then((data2) => {
        // Return the RecommendedControlsDefintion from the JSON file
        return data2.RecommendedControlsDefintion;
    });
});


Cypress.Commands.add('readControlCategory', () => {
    return cy.readFile(controlCategory).then((data3) => {
        // Return the RecommendedControlsDefintion from the JSON file
        return data3.ControlCategoryTreeMapping;
    });
});

class recommendedControl_PO {


    recommendedControlthreeEllipse() {
        cy.get('[data-toggle="dropdown"]').eq(0).click();


    }
    recommendedControlthreeEllipseDefinition() {
        cy.get('.ag-row-odd > .actionsCell > :nth-child(1) > .d-inline-block > .actionDropDWrap > .btn > .la').wait(1000).click({ force: true });
    }

    recommendedControlLinkBtn() {
        cy.contains('Link recommended control').click({ force: true });
        cy.wait(10000);

    }

    addRecommendedControlbtn() {
        cy.contains('Add recommended control').click({ force: true });
        cy.wait(10000);

    }

    savebtnRecommendedControl() {
        cy.get('#manageRiskRegisterControlNameForm > .m-portlet__foot > .m-form__actions > .btn-primary').click({ force: true });

    }

    validationCheckrecommendedControl() {
        cy.get('.toast-message').contains('Problem(s) in save. Please update the highlighted fields below and try again.');


    }

    addRecommendedControl(controlDefinitionID, definitionName, description, controlFrequency, controlTypes, controlExecution, ControlCategoryTreeMapping) {
        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);
        // Assuming you already have definitionName and timeStamp declared
        const fullDefinitionName = definitionName + timeStamp;

        cy.get('#controlDefinationId').type(controlDefinitionID);
        cy.get('#controlDefinationId').type(timeStamp);
        cy.get('#manageRiskRegisterControlNameForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name').type(fullDefinitionName);

        cy.wait(5000);
        //*****Data Write into file  ******/
        cy.writeFile(filename, { Important: "Save Recommended Control Definition", RecommendedControlsDefintion: fullDefinitionName }, 'utf-8')
            .then(() => {
                cy.log('Saved Recommended Control Definition:' + fullDefinitionName);
            });
        cy.wait(5000);

        cy.get('#cke_2_contents > .cke_wysiwyg_frame').type(description);
        cy.get('#cke_2_contents > .cke_wysiwyg_frame').type(timeStamp);
        cy.get('#select2-chosen-11').click();
        cy.get('#s2id_autogen11_search').type(controlFrequency).type('{enter}');
        cy.get('#select2-chosen-14').click();
        cy.get('#s2id_autogen14_search').type(controlTypes).type('{enter}');
        cy.get('#select2-chosen-15').click();
        cy.get('#s2id_autogen15_search').type(controlExecution).type('{enter}');
        cy.wait(2000);
        ////***Search Control Category from Tree then click on  Ratio */
        cy.get('#riskRegisterControlNameDiv').contains(ControlCategoryTreeMapping).click();
        cy.wait(10000);

    }

    expendedRecommendedControlCategory() {
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').type('{downArrow}{enter}');
        cy.wait(2000);

    }
    expendedControlCol() {
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').type('{downArrow}{downArrow}{downArrow}{enter}');
        cy.wait(2000);

    }

    controlGridFilterCol() {

        cy.readRecommendedControlDefinitions().then((RecommendedControlsDefintion) => {
            // Use the extracted value to filter the grid
            cy.get('[aria-colindex="1"] > .ag-floating-filter-body > .ag-floating-filter-input')
                .type(RecommendedControlsDefintion);
            cy.wait(5000);
        });

    };


    verifyrecommendedControlCategory(controlTypes, controlFrequency) {
        cy.readControlDefinition_RecommendedControlsflyer().then((ControlDefinition_RecommendedControlsflyer) => {
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(ControlDefinition_RecommendedControlsflyer);
        });
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(2)').contains(controlTypes);
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(4)').contains('No');
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(5)').contains(controlFrequency);
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(6)').contains('No');

    }

    linkRecommendedControl(ControlCategoryTreeMapping) {
        cy.get('#mCSB_10').wait(5000).contains(ControlCategoryTreeMapping).type('{enter}');
        cy.wait(7000);
        ///click on check box control definition
        cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck').click();
        cy.wait(5000);
        cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeText').invoke('text').then(text2 => {
            let textValue2 = text2;
            cy.log('value Print: ' + textValue2);
            cy.writeFile(Write_ControlDefinition, { ControlDefinition_RecommendedControlsflyer: textValue2 }, 'utf-8');

        });

        ///click on save button
        cy.wait(12000);
        cy.get('#link_control_form > .m-portlet__foot > .m-form__actions > .btn-primary').click();
        cy.wait(2000);
        cy.get('.toast-message').contains('Recommended control linked successfully.')
    }


    verifyrecommendedControlCategoryButtonValidation() {
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell.ag-cell-focus > span > div > div > div > a:nth-child(1)').contains("Add recommended control");
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell.ag-cell-focus > span > div > div > div > a:nth-child(2)').contains("Link recommended control");

    }

    flyerValidate() {
        cy.get('#addRiskControlItemName > div > div > div.m-portlet__head.bg-success > div').contains("Add Control Definition");

    }
    linkFlyerValidation() {

        cy.get('#linkRiskControlItemName > .m-quick-sidebar__content > .m-portlet > .m-portlet__head > .m-portlet__head-caption').contains("Link Control Definition");
    }

    validateRecommendedControlTab() {
        cy.get('#row-tabs').should('not.contain', 'Recommended Control');

    }

    validateRecommendedControlTab() {
        cy.get('#row-tabs').should('not.contain', 'Recommended Control');

    }

    savebtnLink_FlyerRecommendedControl() {
        cy.get('#link_control_form > .m-portlet__foot > .m-form__actions > .btn-primary').click({ force: true });
        cy.wait(10000);

    }

    verifyrecommendedControlDefinitionButtonValidation() {
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row-odd.ag-row.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last.ag-row-focus > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell.ag-cell-focus > span > div > div > div > a:nth-child(1)').contains("Add recommended control");
        cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row-odd.ag-row.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last.ag-row-focus > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell.ag-cell-focus > span > div > div > div > a:nth-child(2)').contains("Link recommended control");

    }

    verifyrecommendedControlControlGridCol() {
        cy.get('.ag-details-grid-fixed-height > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column > [col-id="name"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text').contains("Control Name");
        cy.get('[col-id="controlType"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text').contains("Control Type");
        cy.get('[col-id="controlCategory"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text').contains("Control Category");
        cy.get('[col-id="primaryControl"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text').contains("Primary Control");
        cy.get('[col-id="controlFrequency"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container').contains("Control Frequency");
        cy.get('[col-id="preventsFraudUi"] > .ag-header-cell-comp-wrapper > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text').contains("Prevents Fraud");

    }

    clickRecommendedControlTab() {
        cy.contains("Recommended Controls").click();
        cy.wait(5000);

        cy.readRecommendedControlDefinitions().then((RecommendedControlsDefintion) => {
            ///Filter and Search Gride
            cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-auto-height > div.ag-root.ag-unselectable.ag-layout-auto-height > div.ag-header.ag-pivot-off > div.ag-header-viewport > div > div:nth-child(2) > div:nth-child(1) > div.ag-floating-filter-body').type(RecommendedControlsDefintion);

            cy.get('#myGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-center-cols-clipper > .ag-center-cols-viewport')
            cy.contains(RecommendedControlsDefintion);
        });

    }

    controlCategoryTreeRecordsMatchControlDefinitionTreeRecords() {
        cy.get('#riskRegisterControlNameDiv')  // Target the tree by its ID
            .then(($nodes) => {
                // Extract the text content of all nodes, trimming whitespace, and filter out empty strings
                const records1 = [...$nodes]
                    .map(node => node.innerText.trim())
                    .filter(record => record.length > 0);  // Filter out empty records
                // Log for debugging
                cy.log(`Extracted records1: ${records1.join(', ')}`);

                ////Closed Flyer
                cy.get('#addRiskControlItemName > .m-quick-sidebar__content > .m-quick-sidebar__close > .la').click();
                cy.wait(5000);
                ////expendedRecommendedControlCategory
                cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').type('{downArrow}{enter}');
                cy.wait(2000);
                /////recommendedControlthreeEllipseDefinition
                cy.get('.ag-row-odd > .actionsCell > :nth-child(1) > .d-inline-block > .actionDropDWrap > .btn > .la').wait(1000).click({ force: true });
                ////////addRecommendedControlbtn
                cy.contains('Add recommended control').click({ force: true });
                cy.wait(10000);
                cy.get('#riskRegisterControlNameDiv')  // Target the tree by its ID
                    .then(($nodes) => {
                        // Extract the text content of all nodes, trimming whitespace, and filter out empty strings
                        const records2 = [...$nodes]
                            .map(node => node.innerText.trim())
                            .filter(record => record.length > 0);  // Filter out empty records
                        // Log for debugging
                        cy.log(`Extracted records2: ${records2.join(', ')}`);
                        //// Match Records
                        records1.forEach(record => {
                            expect(records2).to.include(record);  // Assert that each record from the first screen is included in the second screen
                        });

                    });

            });
    }

    controlMapping(ControlCategoryTreeMapping) {

        ////***Search Control Category from Tree then click on  Ratio */
        cy.get('#mCSB_11_container')
            .contains(ControlCategoryTreeMapping).wait(3000)
            .parents('li').wait(5000)         // Navigate to the closest parent 'li' element
            .find('span.aciTreeButton')  // Find the plus sign (expand/collapse button) within the parent 'li'
            .click();
        cy.wait(5000);

        cy.readRecommendedControlDefinitions().then((RecommendedControlsDefintion) => {
            cy.get('#riskControlItemsDiv').contains(RecommendedControlsDefintion);
        });

    };

    unLinkRecommendedControl(ControlCategoryTreeMapping) {

        cy.get('#link_control_form > .m-portlet__body > .form-group > .col-md-6').wait(2000).contains(ControlCategoryTreeMapping).type('{enter}');
        cy.wait(10000);

        cy.readControlDefinition_RecommendedControlsflyer().then((ControlDefinition_RecommendedControlsflyer) => {

            ///click on check box control definition
            cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeText')
                .contains(ControlDefinition_RecommendedControlsflyer)
                .parent()
                .find('span.aciTreeCheck')
                .uncheck(ControlDefinition_RecommendedControlsflyer);
        });
        ///click on save button
        cy.wait(10000);
        cy.get('#link_control_form > .m-portlet__foot > .m-form__actions > .btn-primary').click();
        cy.wait(2000);
        cy.get('.toast-message').contains('Recommended control linked successfully.')
    }

    verifyUnLinkRecommendedControl() {

        cy.readControlDefinition_RecommendedControlsflyer().then((ControlDefinition_RecommendedControlsflyer) => {
            cy.get('[aria-colindex="1"] > .ag-floating-filter-body > .ag-floating-filter-input')
                .type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(5000);
        });
        cy.get('.ag-details-grid-fixed-height > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-center-cols-clipper > .ag-center-cols-viewport', { timeout: 10000 })  // Increase the timeout if needed
            .then($div => {
                if ($div.length === 0) {
                    // No records found
                    cy.log('No records found');
                } else {
                    // Check if the container is empty by normalizing whitespace
                    cy.wrap($div)
                        .invoke('text')  // Retrieve the text content of the element
                        .then(text => {
                            // Trim whitespace and check if the text is empty
                            const trimmedText = text.trim();
                            if (trimmedText === '') {
                                cy.log('Container is empty');
                            } else {
                                cy.log('Container is not empty');
                                throw new Error('Container is not empty');
                            }
                        });
                }

            });

    }

    verifyControls() {

        cy.get('[aria-label="Name Filter Input"]').wait(2000).clear();
        cy.wait(5000);
        /////Clear Search Control in Grid
        cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
        cy.wait(9000);

        /////Search Control in Grid
        cy.readRecommendedControlDefinitions().then((RecommendedControlsDefintion) => {

            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').type(RecommendedControlsDefintion);
            cy.wait(10000);

            /////Expended taxonomy
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').wait(5000).type('{downArrow}{enter}');
            cy.wait(10000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            ///// Row 1 data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(RecommendedControlsDefintion);
            /////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            ///// Row 2 data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(RecommendedControlsDefintion);
            ////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            ///// Row  data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(RecommendedControlsDefintion);
            ////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            /////Clear Search Control in Grid
            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
            cy.wait(5000);
            /////Expended taxonomy
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').wait(5000).type('{downArrow}{enter}');
            cy.wait(10000);


        });

    }

    linkVerifyControls() {

        cy.get('[aria-label="Name Filter Input"]').wait(2000).clear();
        cy.wait(5000);
        /////Clear Search Control in Grid
        cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
        cy.wait(9000);
        /////Search Control in Grid
        cy.readControlDefinition_RecommendedControlsflyer().then((ControlDefinition_RecommendedControlsflyer) => {

            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(10000);

            /////Expended taxonomy
            // cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').wait(5000).type('{downArrow}{enter}');
            // cy.wait(10000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////filter ControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(1) > div.ag-floating-filter-body > div > div').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(2000);
            ///// Row 1 data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(ControlDefinition_RecommendedControlsflyer);
            /////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(1000).type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            /////filter ControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(1) > div.ag-floating-filter-body > div > div').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(2000);
            ///// Row 2 data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(ControlDefinition_RecommendedControlsflyer);
            ////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            /////filter ControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(1) > div.ag-floating-filter-body > div > div').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(2000);
            ///// Row 3 data validate 
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div > div:nth-child(1)').contains(ControlDefinition_RecommendedControlsflyer);
            ////Closed expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').wait(2000).type('{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);
            /////Clear Search Control in Grid
            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
            cy.wait(5000);
            /////Expended taxonomy
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').wait(5000).type('{downArrow}{enter}');
            cy.wait(10000);

        });

    }


    controlDelThreeDefinitions() {
        cy.get('[aria-label="Name Filter Input"]').wait(2000).clear();
        cy.wait(5000);
        /////Clear Search Control in Grid
        cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
        cy.wait(9000);
        /////Search Control in Grid
        cy.readControlDefinition_RecommendedControlsflyer().then((ControlDefinition_RecommendedControlsflyer) => {

            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(10000);

            /////Expended taxonomy
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(7)').wait(5000).type('{downArrow}{enter}');
            cy.wait(10000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////filter ControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(1) > div.ag-floating-filter-body > div > div').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(2000);
            ////////Deleled Recommeded Controls from all three defintions 
            cy.get('.ag-details-grid-fixed-height > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row-even > .actionsCell > :nth-child(1) > .d-inline-block > .btn').click();
            cy.wait(5000);
            cy.get('#deleteRecomendedControlConfirmModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click()
            cy.wait(5000);
            cy.get('.toast').contains('Recommended control deleted successfully.')
            cy.wait(5000);

            /////expendedControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column > div:nth-child(3) > div.ag-header-cell-comp-wrapper > div > div').type('{downArrow}{downArrow}{downArrow}{enter}');
            cy.wait(5000);

            /////filter ControlCol
            cy.get('#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-header.ag-focus-managed.ag-pivot-off > div.ag-header-viewport > div > div.ag-header-row.ag-header-row-column-filter > div:nth-child(1) > div.ag-floating-filter-body > div > div').type(ControlDefinition_RecommendedControlsflyer);
            cy.wait(10000);
       
            /////Clear Search Control in Grid
            cy.get('#riskTaxonomiesMainGrid > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-header > .ag-header-viewport > .ag-header-container > .ag-header-row-column-filter > [aria-colindex="4"] > .ag-floating-filter-body > .ag-floating-filter-input').clear()
            cy.wait(9000);




        });
    };

  
};

export default recommendedControl_PO;