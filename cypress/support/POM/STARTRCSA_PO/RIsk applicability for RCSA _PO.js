import dayjs from 'dayjs'
import { value } from 'jsonpath';
import { WatchDirectoryFlags } from 'typescript';

const write_NegativeImpact_Search = 'cypress/fixtures/RiskModule/Control_Taxonomy/_Write_SearchNegativeImpact.json'

let getText;

class RiskRegister_PO {

    //Validate the Risk Applicability Modal Title
    ValidateBusinessUnitModal()
    {
        cy.get('#reviewModeModal .modal-title')
        // Assert the modal visiblity and text
        .should('contain.text', 'Would you like to add this risk to one or more open risk reviews?').should('be.visible');

    }

    //Validate the Modal Column Fields
    Validate_Modal_details(RiskID, CreatedDate, Status)
    {
        const modallocator = "#reviewModeModalGrid div[ref=eBodyViewport] div[ref=eCenterContainer] div[role=row]";
        cy.get(modallocator + ' [col-id=createdDate]').should('be.visible').should('have.text', CreatedDate);
        cy.get(modallocator + ' [col-id=status]').should('be.visible').should('have.text', Status);
        cy.get(modallocator +' [col-id=name]').should('be.visible').should('have.text', RiskID);
    } 


    buFilterRiskRegister(BU) {
        ////BU Filter 
        cy.get('#buSelectWrap').click();
        cy.get('[style="font-family: Poppins; font-size: 15.4px; width: 205px; top: 79.0558px; left: 1144.81px; display: block;"] > .pq-select-popup > .pq-select-search-div > .pq-select-search-div1 > .pq-select-search-input').type(BU).type("{enter}");

    }

    ////Select All
    selectAllBu() {
        ////BU Filter 
        cy.get('#buSelectWrap').click();
        cy.xpath('/html/body/div[39]/div[1]/label/input').click();

    }

    ////UnSelect All BU
    unSelectAllBu() {
        ////BU Filter 
        cy.get('#buSelectWrap').click();
        cy.xpath('/html/body/div[39]/div[1]/label/input').click();

    }



    ///Refersh button Click Risk Register
    refershButtonRiskRegister() {
        cy.get('#syncButton').click();

    }

    ///Wrap text button Click Risk Register
    WrapTextRiskRegister() {
        cy.get('#columnWordWrapBtn').click();

    }

    ///Likelihood/Impact button Click Risk Register
    likeihoodImpactRiskRegister() {
        cy.get('#expand').click();
        ////click on toggle Show
        cy.get('#suppress').click();

    }

    threeEllipsisMenu() {
        cy.get('body > div.m-grid.m-grid--hor.m-grid--root.m-page > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body > div.m-grid__item.m-grid__item--fluid.m-wrapper.pl-3 > div.m-subheader > div > ul.list-inline.m-0.ml-auto.pr-2.d-flex.align-items-center > li:nth-child(7) > div > a').should('be.visible').click();

    }

    riskTaxonomyclick() {
        cy.get('#riskTaxonomyBtn').should('be.visible').click();
        cy.wait(20000);
    }

    applicabilityFilter() {
        cy.get('a:contains(Applicability Filter)').click();
        cy.wait(10000);
        cy.get('#select2-chosen-11').click();
        cy.get('#s2id_autogen11_search').type('applicable').type('{enter}')
        cy.get('a:contains(Apply)').click();
        cy.wait(10000);

    }
    deferFilter() {
        cy.get('a:contains(Applicability Filter)').click();
        cy.wait(10000);
        cy.get('#select2-chosen-11').click();
        cy.get('#s2id_autogen11_search').type('Defer').type('{enter}')
        cy.get('a:contains(Apply)').click();
        cy.wait(10000);

    }
    EmergingFilter() {
        cy.get('a:contains(Applicability Filter)').click();
        cy.wait(10000);
        cy.get('#select2-chosen-11').click();
        cy.get('#s2id_autogen11_search').type('Emerging').type('{enter}')
        cy.get('a:contains(Apply)').click();
        cy.wait(10000);

    }
    notApplicabledeferFilter() {
        cy.get('a:contains(Applicability Filter)').click();
        cy.wait(10000);
        cy.get('#select2-chosen-11').click();
        cy.get('#s2id_autogen11_search').type('Not Applicable').type('{enter}')
        cy.get('a:contains(Apply)').click();
        cy.wait(10000);

    }

    exportOption() {


        cy.get('a:contains(Export)').click();
        cy.wait(5000);
        cy.get('button').contains('Export').click();
        cy.wait(10000);

    }

    importOption() {

        //****File Path Download Folder */
        // const filepath = 'Images/test1.xlsx'
        const filepath = 'cypress/downloads/ImportTemplate_RiskRegister.xlsx';


        cy.get('#addImportLink').click();
        cy.wait(5000);
        cy.get('#importFile').click();
        ///******This can be use for Fixture file */ // cy.get('input[type="file"]').attachFile(filepath)
        cy.get('input[type="file"]').selectFile(filepath, { action: 'drag-drop' })
        cy.get('button').contains('Import').click().wait(5000);
        cy.get('.toast').contains('Import has started. Summary of import will send as email when it is completed.')

    }

    /////*****Risk Taxonomy Flyer- Marked Applicable*/
    applicableMarked(BU, SearchRisk) {

        cy.frameLoaded('#riskTaxonomyApplicabilityFrame');
        cy.wait(30000);
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#select2-chosen-1').should('be.visible').click();
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#s2id_autogen1_search').type(BU).type('{enter}');
        cy.wait(5000);
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('[aria-label="Risk Item Filter Input"]').clear().type(SearchRisk).type('{enter}');
        cy.wait(5000);
        //***Click ratio button */
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#agGrid-taxonomy > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div:nth-child(2) > div:nth-child(1) > label > span').wait(4000).click({ force: true });
        cy.wait(5000);
                                                            
    }

    /////*****Risk Taxonomy Flyer- Marked Defer*/
    deferMarked(BU, SearchRisk) {

        cy.frameLoaded('#riskTaxonomyApplicabilityFrame');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#select2-chosen-1').click();
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#s2id_autogen1_search').type(BU).type('{enter}');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('[aria-label="Risk Item Filter Input"]').clear().type(SearchRisk).type('{enter}');
        cy.wait(5000);
        //***Click ratio button */
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('.ag-center-cols-container > div:nth-child(2) > div:nth-child(2) > label:nth-child(1) > input:nth-child(1)').wait(4000).click({ force: true });
        cy.wait(5000);


    }


    /////*****Risk Taxonomy Flyer- Marked not Applicable*/
    notApplicableMarked(BU, SearchRisk) {

        cy.frameLoaded('#riskTaxonomyApplicabilityFrame');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#select2-chosen-1').should('be.visible').click();
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#s2id_autogen1_search').type(BU).type('{enter}');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('[aria-label="Risk Item Filter Input"]').clear().type(SearchRisk).type('{enter}');
        cy.wait(5000);
        //***Click ratio button */
        cy.iframe('#riskTaxonomyApplicabilityFrame').xpath('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/div[3]/div[2]/div/div/div[2]/div[3]/label/input').wait(4000).click({ force: true });
        cy.wait(5000);
    }

    /////*****Risk Taxonomy Flyer- Marked Emerging*/
    emergingMarked(BU, SearchRisk) {

        cy.frameLoaded('#riskTaxonomyApplicabilityFrame');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#select2-chosen-1').should('be.visible').click();
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#s2id_autogen1_search').type(BU).type('{enter}');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('[aria-label="Risk Item Filter Input"]').clear().type(SearchRisk).type('{enter}');
        cy.wait(5000);
        //***Click ratio button */
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('.ag-center-cols-container > div:nth-child(2) > div:nth-child(4) > label:nth-child(1) > input:nth-child(1)').wait(4000).click({ force: true });
        cy.wait(5000);

    }

    saveRiskTaxonomy() {

        cy.iframe('#riskTaxonomyApplicabilityFrame').xpath('/html/body/div[3]/div/div/div[3]/div/div/a').click();
        cy.wait(5000);
        cy.iframe('#riskTaxonomyApplicabilityFrame').xpath('/html/body/div[3]/div/div/div[3]/div/div/div/div/div/div/ul/li[2]/a/span').click();
        cy.wait(5000);
        cy.get('.toast-message').contains('Successfully updated', { timeout: 50000 }).should('be.visible');
        cy.wait(5000);

    }

    addRiskCategory(riskName, description) {

        /////#### TimeStamp Define in Support/Index.js file #####//////
        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);
        cy.wait(5000);
        cy.get('#addRootCategoryLink > span').click();

        cy.get('#rootCategoryName').type(riskName);
        cy.get('#rootCategoryName').type(timeStamp);

        cy.get('#rootCategoryDescription').type(description);
        cy.get('#rootCategoryDescription').type(timeStamp);

        ///### Click on save button ###//
        cy.get('[aria-describedby="rootRiskCategory-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();

    }

    ///***Three Ellipsis Risk Instance*/
    riskInstanceThreeEllipsis() {
        ///scroll  topLeft, top, topRight, left, center, right, bottomLeft, bottom, and bottomRight.
        ///***Scroll Page  */
        cy.wait(5000);
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(10000);
        cy.get('.ag-row-level-0 > .actionsCell > .d-inline-block > .actionDropDWrap > .btn').click();
        cy.wait(7000);
    }

    ///***Three Ellipsis Add Risk Category Risk Instance*/
    riskInstanceThreeEllipsisAddRiskCategory(riskName, description) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#addCategoryBtn').click();
        cy.get('#categoryName').type(riskName);
        cy.get('#categoryName').type(timeStamp);

        cy.get('#categoryDescription').type(description);
        cy.get('#categoryDescription').type(timeStamp);

        cy.get('[aria-describedby="riskCategory-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();

    }
    ///***Three Ellipsis Add Risk Definition Risk Instance*/
    riskInstanceThreeEllipsisAddRiskDefinition(definitionName, description) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#addRiskDefinitionBtn').click();
        cy.get('.col-md-8 > #riskDefinitionName').type(definitionName);
        cy.get('.col-md-8 > #riskDefinitionName').type(timeStamp);

        cy.switchToIframe('#cke_3_contents > .cke_wysiwyg_frame').type(description).type(timeStamp);
        cy.get('[aria-describedby="addRiskDefinition-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();

    }

    ///***Three Ellipsis Add Risk Definition Risk Instance*/
    riskInstanceThreeEllipsisAddRiskItem(riskDefinition, riskName, riskdescription, approach, BU) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#addRiskItemBtn').click();
        cy.get('#select2-chosen-20').click();
        cy.get('#s2id_autogen20_search').type(riskDefinition).type('{enter}');
        cy.get('#riskItemName').type(riskName);
        cy.get('#riskItemName').type(timeStamp);
        cy.get(':nth-child(4) > .col-md-9 > #riskDescription').type(riskdescription);
        cy.get(':nth-child(4) > .col-md-9 > #riskDescription').type(timeStamp);
        //**Enter Approach */
        cy.get('#select2-chosen-21').click();
        cy.get('#s2id_autogen21_search').type(approach).type('{enter}');
        //**Enter BU */
        cy.get('#select2-chosen-22').click();
        cy.get('#s2id_autogen22_search').type(BU).type('{enter}')

        //**Save */
        cy.get('[aria-describedby="riskItemLevel-modal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();


    }
    ///***Three Ellipsis Add Messaging Risk Instance*/
    riskInstanceThreeEllipsisMessage(Message) {

        cy.get('.ag-row-level-0 > .actionsCell > .d-inline-block > .actionDropDWrap > .dropdown-menu > [href="javascript:void(0)"]').click();
        cy.wait(2000);
        cy.get('#sendMessageModal > .modal-dialog > .modal-content > .modal-body > .mentions-input-box > #new_msg').type(Message);
        cy.get('#sendMessageModal > .modal-dialog > .modal-content > .modal-body > .text-right > #sendMessage').click();
        cy.get('#sendMessageModal > .modal-dialog > .modal-content > .modal-header > .close').click();

    }

    searchRiskInstance(RiskDefinitionSearch) {

        cy.xpath('/html/body/div[4]/div[1]/div[7]/div[2]/div/div/div/div/div[2]/div[2]/div[1]/div[1]/div[3]/div[1]/div[1]/div/div/div[2]/input').should('be.visible').clear().wait(5000).type(RiskDefinitionSearch);
        cy.wait(5000);
    }
    inherentResidualSelectionGrid(Approach, InherentLikelihood, InherentImpact, ResidualLikelihood, ResidualImpact) {

        ////*******Select Approach Value****/////
        cy.get('.ag-row-last > [col-id="approach"]').dblclick();
        //Value select
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Approach).click();
        cy.wait(5000);
        ////*******Select Likelihood Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentL.name"]').dblclick();
        cy.wait(5000);
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(InherentLikelihood).click();
        cy.wait(2000);
        ////*******Select Impact Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentI.name"]').dblclick();
        cy.wait(2000);
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(InherentImpact).click();
        cy.wait(2000);
        cy.get('.toast').contains("Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically.")
        cy.wait(2000);

        ///***Scroll Page  */
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(1000);

        ////*******Select Likelihood Value  - Residual****/////
        cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(ResidualLikelihood).click();
        cy.wait(2000);

        ////*******Select Impact Value  - Residual****////
        cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(ResidualImpact).click();
        cy.wait(2000);
        cy.get('.toast').contains("Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically.")

    }

    manageDetailControls(Approach, Q1InherentLikelihood, Q2InherentLikelihood, Q1InherentImpact, Q2InherentImpact, ControlAdd, Effectiveness, Implemented, ControlStrength, Q1Assessed, Q2Assessed, ResidualLikelihood, ResidualImpact) {

        ////*******Select Approach Value****/////
        cy.get('.ag-row-last > [col-id="approach"]').should('be.visible').dblclick();
        //Value select
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Approach).should('be.visible').click();
        cy.wait(2000);
        // ////*******Select Likelihood Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentL.name"]').should('be.visible').dblclick();
        cy.wait(2000);
        cy.get('#surveyform').contains(Q1InherentLikelihood).should('be.visible').click();
        cy.get('button').contains('Next').should('be.visible').click();
        cy.get('#surveyform').contains(Q2InherentLikelihood).should('be.visible').click();
        cy.get('button').contains('Submit').should('be.visible').click();
        cy.wait(5000);

        // ////*******Select Impact Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentI.name"]').should('be.visible').dblclick();
        cy.wait(5000);
        cy.get('#surveyform').contains(Q1InherentImpact).should('be.visible').click();
        cy.get('button').contains('Next').should('be.visible').click();
        cy.get('#surveyform').contains(Q2InherentImpact).should('be.visible').click();
        cy.get('button').contains('Submit').should('be.visible').click();
        cy.wait(5000);


        ///***Scroll Page  */
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(1000);
        ///*****Control Text Adding */
        cy.get('.ag-row-last > [col-id="controls"]').should('be.visible').dblclick();
        cy.wait(2000);
        cy.get('[aria-label="Input Editor"]').clear().type(ControlAdd).type('{enter}');
        cy.wait(2000);

        ///*****Control Strength */
        cy.get('.ag-row-level-1 > [col-id="controlStrengthLabel"]').dblclick();
        cy.wait(10000);
        cy.get('#select2-drop').contains(ControlStrength).click();
        cy.wait(5000);
        cy.get('#surveyform').contains(Q1Assessed).click();
        cy.wait(2000);
        cy.get('button').contains('Next').click();
        cy.wait(2000);
        cy.get('#surveyform').contains(Q2Assessed).click();
        cy.wait(2000);
        cy.get('button').contains('Submit').click();
        cy.wait(3000);

        ///***Scroll Page  */
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(1000);
        // ////*******Select Likelihood Value  - Residual****/////
        cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(ResidualLikelihood).click();
        cy.wait(2000);
        ////*******Select Impact Value  - Residual****////
        cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(ResidualImpact).click();
        cy.wait(5000);
        cy.reload(true).wait(8000);

        ///*****Control Effectiveness */
        // cy.get('[col-id="efficacy"]').wait(2000).contains(Effectiveness);
        cy.get('.ag-row-odd > [aria-colindex="20"]').wait(2000).contains(Effectiveness);
        cy.wait(2000);
        ///*****Control implemented */
        // cy.get('[col-id="implemented"]').wait(2000).contains(Implemented);
        cy.get('.ag-row-odd > [aria-colindex="21"]').wait(2000).contains(Implemented);
        cy.wait(3000);

    }

    detailFlyerRiskInstance(RiskInstanceDescription, PersonsResponsible, Frequency, TimesPer, FrequencyExplanation, Outcome, OutcomeDescription, ManagementComments, Context) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#detailModalFlyerOpenr').should('be.visible').click();
        cy.wait(7000);
        cy.switchToIframe('#cke_1_contents > .cke_wysiwyg_frame').clear().type(RiskInstanceDescription).type(timeStamp);
        ///*****Risk Events */
        cy.get('#select2-chosen-25').click();
        cy.get('#s2id_autogen25_search').type('{downArrow}').type('{enter}');
        ///****Persons Responsible */
        cy.get('#detailForm > .riskResponsibleRow > .col-md-9 > .pq-select-button > .pq-select-text').click();
        cy.get('body > div:nth-child(90) > div.pq-select-popup.ui-widget-content.ui-corner-all > div.pq-select-search-div.ui-corner-all > div > input').clear().type(PersonsResponsible).type('{enter}').type('{esc}');
        ///**** Frequency ***/
        cy.get('#frequencyCountD').clear().type(Frequency);
        ///**** Time Per ***/
        cy.get('#select2-chosen-27').click();
        cy.get('#s2id_autogen27_search').type(TimesPer).type('{enter}');
        ///**** Frequency Explanation ***/
        cy.get('#frequencyExplanationD').clear().type(FrequencyExplanation).type(timeStamp);
        ///**** Outcome ***/
        cy.get('#outcomeD').clear().type(Outcome).type(timeStamp);;
        ///**** Outcome Description ***/
        cy.get('#outcomeDescriptionD').clear().type(OutcomeDescription).type(timeStamp);
        ///**** Management Comments ***/
        cy.switchToIframe('#cke_2_contents > .cke_wysiwyg_frame').clear().type(ManagementComments).type(timeStamp);
        ///**** Context ***/
        cy.get('#contextD').clear().type(Context).type(timeStamp);
        cy.wait(2000);
        ///**** Save button click ***/
        cy.get('.m-form__actions > .btn-primary').click();

    }
    ////****Manage Detailed Control - Risk Register grid data Edited  */
    riskRegisterGridEdit(Approach, ControlAdd, Effectiveness, Implemented) {

        ////*******Select Approach Value****/////
        cy.get('.ag-row-last > [col-id="approach"]').dblclick();
        //Value select
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Approach).click();
        cy.wait(4000);
        //*****Edit Control Text */
        cy.get('.ag-row-last > [col-id="controls"]').dblclick();
        cy.wait(2000);
        cy.get('[aria-label="Input Editor"]').clear().type(ControlAdd).type('{enter}');
        cy.wait(1000);
        ///*****Control Effectiveness */
        ///Scroll
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(1000);
        cy.get('[col-id="efficacy"]').dblclick();
        cy.wait(1000);
        cy.get('.ag-row-no-focus > [aria-colindex="20"]').type(Effectiveness).type('{enter}');
        cy.wait(1000);
        ///*****Control implemented */
        cy.get('[col-id="implemented"]').dblclick();
        cy.wait(1000);
        cy.get('.ag-row-no-focus > [aria-colindex="21"]').type(Implemented).type('{enter}');
        cy.wait(3000);




    }


    inherentRiskProbabilityFlyer(Q1InherentLikelihood, Q2InherentLikelihood) {

        cy.get('#riskProbabilityAnalysisModalOpenr').click();
        cy.wait(10000);
        cy.frameLoaded('#iframe-risk-register-prob-modal');
        cy.iframe('#iframe-risk-register-prob-modal').find('#section_div_101792 > div.m-portlet__body').contains(Q1InherentLikelihood).click();
        cy.iframe('#iframe-risk-register-prob-modal').find('#section_div_101792 > div.m-portlet__body').contains(Q2InherentLikelihood).click();
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-prob-modal').find('button').contains('Submit').click();
        cy.wait(7000);

    }

    inherentRiskImpactFlyer(Q1InherentImpact, Q2InherentImpact) {

        cy.get('#riskImpactAnalysisModalOpenr').click();
        cy.wait(10000);
        cy.frameLoaded('#iframe-risk-register-impact-modal');
        cy.iframe('#iframe-risk-register-impact-modal').find('#section_div_101791 > div.m-portlet__body').contains(Q1InherentImpact).click();
        cy.iframe('#iframe-risk-register-impact-modal').find('#section_div_101791 > div.m-portlet__body').contains(Q2InherentImpact).click();
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-impact-modal').find('button').contains('Submit').click();
        cy.wait(7000);

    }

    controlEnvironmenttAssessment(Q1Assessed, Q2Assessed) {

        cy.get('#controlEnvironmentAssessmentModalOpenr').click();
        cy.wait(5000);
        cy.frameLoaded('#iframe-risk-register-impact-modal');
        cy.iframe('#iframe-risk-register-impact-modal').find('#section_div_101807 > div.m-portlet__body > div > div:nth-child(1)').contains(Q1Assessed).click();
        cy.iframe('#iframe-risk-register-impact-modal').find('#section_div_101807 > div.m-portlet__body > div > div:nth-child(2)').contains(Q2Assessed).click();
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-impact-modal').find('button').contains('Submit').click();
        cy.wait(7000);


    }



    controlFlyerRiskInstance(ControlCategoryTreeMapping, ControlInstanceID, ControlName, ControlDescription, ControlTypes, ControlOwner, ControlTester, Effectiveness, Weight, Implemented, ControlStrength) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#controlModalOpenr').should('be.visible').click();
        cy.wait(6000);
        cy.frameLoaded('#iframe-risk-register-control-modal');
        cy.iframe('#iframe-risk-register-control-modal').xpath('//a[contains(text(),"Add Control Instance")]').click();
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('#riskControlItemsTreeDivForControlInstance').contains(ControlCategoryTreeMapping).type('{enter}');
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-control-modal').find('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck').click();
        cy.wait(5000);

        /////****Control Instance data fill */
        cy.iframe('#iframe-risk-register-control-modal').find('#controlInstId').clear().type(ControlInstanceID).type(timeStamp);
        cy.iframe('#iframe-risk-register-control-modal').find('#ControlInstanceName').clear().type(ControlName).type(timeStamp);
        cy.iframe('#iframe-risk-register-control-modal').switchToIframe('#cke_2_contents > .cke_wysiwyg_frame').clear().type(ControlDescription).type(timeStamp);
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-control-modal').find('#s2id_controlTypes').click();
        cy.iframe('#iframe-risk-register-control-modal').find('#select2-drop > div').type(ControlTypes).type('{enter}');
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-control-modal').find('#s2id_controlOwner').click();
        cy.iframe('#iframe-risk-register-control-modal').find('#select2-drop > div').type(ControlOwner).type('{enter}');
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-control-modal').find('#s2id_controlTester').click();
        cy.iframe('#iframe-risk-register-control-modal').find('#select2-drop > div').type(ControlTester).type('{enter}');

        cy.iframe('#iframe-risk-register-control-modal').find('#Efficacy').clear().type(Effectiveness);

        cy.iframe('#iframe-risk-register-control-modal').find('#Weight').clear().type(Weight);

        cy.iframe('#iframe-risk-register-control-modal').find('#Implemented').clear().type(Implemented);

        cy.iframe('#iframe-risk-register-control-modal').find('#s2id_controlStrength').click();
        cy.iframe('#iframe-risk-register-control-modal').find('#select2-drop > div').clear().type(ControlStrength).type('{enter}');
        ////***Save Click */
        cy.iframe('#iframe-risk-register-control-modal').find('#controlInstanceFormModal > div > div > div.modal-footer > button.btn.btn-primary').click();
        cy.wait(10000);
        // cy.iframe('#iframe-risk-register-control-modal').find('.toast-message').contains('Control Instance Sucessfully Saved!');


    }


    linkControlFlyer(ControlTypes) {

        ///**Click on Link Controls - Control Flyer */

        cy.get('#controlModalOpenr').should('be.visible').click();
        cy.wait(6000);
        cy.frameLoaded('#iframe-risk-register-control-modal');
        cy.iframe('#iframe-risk-register-control-modal').xpath('//a[contains(text(),"Link Control Instance")]').click();
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('#s2id_controlTypeID').click();
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('#select2-drop > div').type(ControlTypes).type('{enter}');
        cy.wait(15000);
        cy.iframe('#iframe-risk-register-control-modal').xpath('/html/body/div[10]/div/div/div[2]/div/form/div/div[2]/div/div/div[2]/div[1]/div[3]/div[2]/div/div/div[2]/div[2]/input').check();
        cy.wait(7000);
        cy.iframe('#iframe-risk-register-control-modal').find('#linkButton').click();

        // cy.iframe('#iframe-risk-register-control-modal').xpath('//*[@id="runTimeControlOwnerTable"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[2]').dblclick();
        // cy.iframe('#iframe-risk-register-control-modal').find('#runTimeControlOwnerTable > div > div.ag-theme-balham > div > div > div.ag-rich-select-list > div > div > div > div > span').click();
        // cy.iframe('#iframe-risk-register-control-modal').find('#addControlOwnerButton').click();

        // cy.iframe('#iframe-risk-register-control-modal').find('.toast').contains('Linked Successfully');

    }

    deleteControlFromFlyer() {

        ///**Click on Link Controls - Control Flyer */

        cy.get('#controlModalOpenr').click();
        cy.wait(6000);
        cy.frameLoaded('#iframe-risk-register-control-modal');
        cy.wait(6000);
        // cy.iframe('#iframe-risk-register-control-modal').xpath('//a[contains(text(),"Delete")]').click();
        cy.iframe('#iframe-risk-register-control-modal').xpath('/html/body/div[3]/div/div/div[2]/div/div/div[2]/div[2]/table/tbody/tr[1]/td[9]/div/a[4]').click();
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('button').contains('Delete').click();
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('.toast').contains('Control instance removed!');

    }

    auditLogFlyer() {

        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-odd.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last.ag-row-focus.ag-row-selected > div.ag-cell.ag-cell-not-inline-editing.ag-cell-auto-height.actionsCell.ag-cell-value.ag-cell-focus > div > div > div > a:nth-child(4)').click();
        cy.get('#auditTrail-modal > .modal-dialog > .modal-content > .modal-header').contains('Audit Log');
        cy.wait(7000);
        cy.get('#auditTrail-modal > .modal-dialog > .modal-content > .modal-footer > .btn').click();

    }

    ////***Risk Register ---- Updete Control Grid values ****/
    controlGrid(ControlName, Effectiveness, Implemented, Weight) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ///**Control Inline editor click */
        cy.get('.ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted > .ag-icon').should('be.visible').click();
        cy.wait(10000);
        ///**Control Inline Text box  click */
        cy.get('.ag-row-last > [aria-colindex="10"] > span').wait(5000).dblclick()
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-full-width-container > div > div > div.ag-theme-balham > div > div.ag-theme-balham.ag-popup > div > div > div').clear().type(ControlName).type(timeStamp).type('{enter}');
        cy.wait(3000);
        cy.get('.ag-row-last > [aria-colindex="12"]').dblclick().clear().wait(1000).type(Effectiveness);
        cy.wait(2000);
        cy.get('.ag-row-last > [aria-colindex="13"]').dblclick().clear().wait(1000).type(Implemented);
        cy.wait(2000);
        cy.get('.ag-row-last > [aria-colindex="14"]').dblclick().clear().wait(1000).type(Weight);
        cy.wait(2000);
        cy.get('.ag-row-last > [aria-colindex="15"]').click();
        cy.get('[aria-posinset="3"] > .ag-rich-select-row').click();
        cy.wait(10000);

    }
    editControlValueGrid(Description, ControlType) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ///**Click on edit button - Control Inline editor */
        cy.get('.ag-row-last > .actionsCell > .d-inline-block > #editControlBtn > .fa').should('be.visible').click();
        cy.wait(5000);
        cy.switchToIframe('#cke_4_contents > .cke_wysiwyg_frame').clear().type(Description).type(timeStamp);
        cy.wait(1000);
        cy.get('#s2id_controlTypes > .select2-choice > .select2-search-choice-close').click();
        cy.get('#s2id_controlTypes').click();
        cy.get('#s2id_autogen4_search').type(ControlType).type('{enter}');
        cy.wait(2000);
        cy.get('[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();
        cy.wait(10000);


    }

    linkControlGrid(ControlTypes) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ///**Click on Link Controls - Control Inline editor */
        cy.get('.ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted > .ag-icon').should('be.visible').click();
        // cy.get('.ag-center-cols-container > .ag-row-level-1 > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted').click();
        cy.wait(10000);
        cy.get('button').contains('Link Control Instance').click();
        cy.wait(5000);
        cy.get('#s2id_controlTypeID').click();
        cy.get('#s2id_autogen10_search').type(ControlTypes).type('{enter}');
        cy.get('.ag-row-first > [aria-colindex="1"] > input').check();
        cy.wait(2000);
        cy.get('#linkButton').click();
        cy.wait(6000);
        // cy.xpath('//*[@id="runTimeControlOwnerTable"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div/div[2]').dblclick();
        // cy.get('#runTimeControlOwnerTable > div > div.ag-theme-balham.ag-popup > div > div > div.ag-rich-select-list > div > div.ag-virtual-list-container.ag-rich-select-virtual-list-container > div > div').click();
        // cy.get('#addControlOwnerButton').click();

        // cy.get('button').contains('Link').click();             
    }

    addControlGrid(ControlCategoryTreeMapping) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ///**Add Control from Inline editor */
        cy.get('.ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted').should('be.visible').click();
        cy.wait(10000);
        cy.get('button').contains('Add Control Instance').click();
        cy.wait(7000);

        cy.get('#treeCover > .col-md-9').contains(ControlCategoryTreeMapping).type('{enter}');
        cy.log(ControlCategoryTreeMapping);

        // cy.get('.aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeButton > .aciTreePush').click();
        cy.wait(5000);
        cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck').click();
        cy.wait(4000);
        // cy.get('#controlInstanceId').type('ID-01');
        // cy.get('#controlInstanceName').type('CT- Control test');
        // cy.get('#select2-chosen-4').click();
        // cy.get('#s2id_autogen4_search').type('Containment').type('{enter}');

        //***Control Owner */
        cy.get('#select2-chosen-5').click();
        cy.get('#s2id_autogen5_search').type('Automation user').type('{enter}');
        //***Control Tester */
        cy.get('#select2-chosen-6').click();
        cy.get('#s2id_autogen6_search').type('Automation user').type('{enter}');

        cy.get('[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();


    }

    validationControlGrid(ControlCategoryTreeMapping) {

        ///**Add Control from Inline editor */
        cy.get('.ag-center-cols-container > .ag-row-level-1 > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted').click();
        cy.wait(10000);
        cy.get('button').contains('Add Control Instance').click();
        cy.wait(7000);
        ////******Save Button click for validation */
        cy.get('[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();
        cy.wait(4000);
        cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.');
        cy.wait(2000);
        cy.get('.toast').contains('Total weight of all instances can not be more than 100%');
        //**Click on Tree option */
        cy.get('#treeCover > .col-md-9').contains(ControlCategoryTreeMapping).type('{enter}');
        // cy.get('.aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeButton > .aciTreePush').click();
        cy.wait(3000);
        cy.get('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck').click();
        cy.wait(4000);
        cy.get('[aria-describedby="controlInstanceFormModal"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1)').click();
        cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.');

    }

    /////*****Add Negative Impact*/
    negativeImpactAdd(nameNegativeImpact, Effect, ControlCategory_NegativeImpact) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('.ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .dropdown-menu > #controlModalOpenr').should('be.visible').click();
        cy.wait(10000);
        cy.frameLoaded('#iframe-risk-register-control-modal');
        cy.iframe('#iframe-risk-register-control-modal').find('a:contains(Add Negative Impact)').click();
        cy.wait(2000);
        cy.iframe('#iframe-risk-register-control-modal').find('#negativeImpactName').type(nameNegativeImpact).type(timeStamp);
        cy.iframe('#iframe-risk-register-control-modal').find('#effect').type(Effect);
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('#riskControlItemsTreeDivForNegativeImpact').contains(ControlCategory_NegativeImpact).type('{enter}');
        cy.wait(5000);
        cy.iframe('#iframe-risk-register-control-modal').find('.aciTreeFirst > .aciTreeLine > .aciTreeBranch > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck').click();
        ///*****Save button Click */
        cy.iframe('#iframe-risk-register-control-modal').find('.negativeImpactFormModal-body > div:nth-child(3) > button:nth-child(1)').click();
        cy.wait(5000);
        cy.writeFile(write_NegativeImpact_Search, { Search_NegativeImpact: nameNegativeImpact + timeStamp }, 'utf-8');
        cy.wait(5000);

    }

    /////*****Edit Negative Impact*/
    negativeImpactEdit(nameEditNegativeImpact, EffectEdit, Search_NegativeImpact) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('.ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .dropdown-menu > #controlModalOpenr').should('be.visible').click();
        cy.wait(10000);
        // cy.frameLoaded('#iframe-risk-register-control-modal');
        // cy.iframe('#iframe-risk-register-control-modal').xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[1]/div[2]/div/div[2]/div[2]/div[1]/div/input').type(Search_NegativeImpact);
        // cy.wait(7000);
        //****Click on Edit button */
        cy.iframe('#iframe-risk-register-control-modal').xpath('//*[@id="myGrid"]/div/div[2]/div[1]/div[3]/div[2]/div/div/div[1]/div[7]/div/div/a[1]').click();
        cy.wait(7000);
        cy.iframe('#iframe-risk-register-control-modal').find('#negativeImpactName').clear().type(nameEditNegativeImpact).type(timeStamp);
        cy.iframe('#iframe-risk-register-control-modal').find('#effect').clear().type(EffectEdit);

        cy.iframe('#iframe-risk-register-control-modal').find('.negativeImpactFormModal-body > div:nth-child(3) > button:nth-child(1)').click();
        cy.wait(5000);

    }
    /////*****Share Risk Taxonomy Flyer- Marked Applicable*/
    shareApplicableMarked(BU2, RiskDefinitionSearch) {

        cy.frameLoaded('#riskTaxonomyApplicabilityFrame');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#select2-chosen-1').should('be.visible').click();
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#s2id_autogen1_search').type(BU2).type('{enter}');
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#ag-64-input').clear().type(RiskDefinitionSearch).type('{enter}');
        cy.wait(5000);
        //***Click ratio button */
        cy.iframe('#riskTaxonomyApplicabilityFrame').find('#agGrid-taxonomy > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div.ag-row.ag-row-no-focus.ag-row-odd.ag-row-level-1.ag-row-position-absolute.ag-row-last > div:nth-child(1) > label > span').wait(4000).click({ force: true });
        cy.wait(5000);

    }

    clickThreeEllpsiseRiskInstance() {
        ///**Three Ellpsise */
        cy.get('.ag-row-odd > .actionsCell > .d-inline-block > .actionDropDWrap > .btn').should('be.visible').click();
        cy.wait(3000);

    }

    shareDefintionThreeEllpsise() {
        ///**Three Ellpsise */
        cy.get('.ag-row-last > .actionsCell > .d-inline-block > .actionDropDWrap > .btn').click();
        cy.wait(2000);

    }

    shareDefinitionDetailFlyerRiskInstance(RiskInstanceDescription, Frequency, TimesPer, FrequencyExplanation, Outcome, OutcomeDescription, ManagementComments, Context) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        cy.get('#detailModalFlyerOpenr').click();
        cy.wait(7000);
        cy.switchToIframe('#cke_1_contents > .cke_wysiwyg_frame').clear().type(RiskInstanceDescription).type(timeStamp);

        ///*****Risk Events */
        cy.get('#select2-chosen-25').click();
        cy.get('#s2id_autogen25_search').type('{downArrow}').type('{enter}');

        ///****Persons Responsible */
        // cy.get('#detailForm > .riskResponsibleRow > .col-md-9 > .pq-select-button > .pq-select-text').click();
        // cy.get('body > div:nth-child(91) > div.pq-select-popup.ui-widget-content.ui-corner-all > div.pq-select-search-div.ui-corner-all > div').clear().type(PersonsResponsible).type('{enter}').type('{esc}');

        ///**** Frequency ***/
        cy.get('#frequencyCountD').clear().type(Frequency);
        ///**** Time Per ***/
        cy.get('#select2-chosen-27').click();
        cy.get('#s2id_autogen27_search').type(TimesPer).type('{enter}');
        ///**** Frequency Explanation ***/
        cy.get('#frequencyExplanationD').clear().type(FrequencyExplanation).type(timeStamp);
        ///**** Outcome ***/
        cy.get('#outcomeD').clear().type(Outcome).type(timeStamp);;
        ///**** Outcome Description ***/
        cy.get('#outcomeDescriptionD').clear().type(OutcomeDescription).type(timeStamp);
        ///**** Management Comments ***/
        cy.switchToIframe('#cke_2_contents > .cke_wysiwyg_frame').clear().type(ManagementComments).type(timeStamp);
        ///**** Context ***/
        cy.get('#contextD').clear().type(Context).type(timeStamp);
        cy.wait(2000);
        ///**** Save button click ***/
        cy.get('.m-form__actions > .btn-primary').click();

    }

    editRiskRegisterGridData(RiskName, Edit_Approach, Edit_InherentLikelihood, Edit_InherentImpact, Edit_ResidualLikelihood, Edit_ResidualImpact) {

        const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
        cy.log(timeStamp);

        ////*******Select Approach Value****/////
        cy.get('.ag-row-last > [col-id="approach"]').dblclick();
        //Value select
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Edit_Approach).click();
        cy.wait(5000);
        ////*******Select Likelihood Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentL.name"]').dblclick();
        cy.wait(5000);
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Edit_InherentLikelihood).click();
        cy.wait(2000);
        ////*******Select Impact Value - Inherent****/////
        cy.get('.ag-row-last > [col-id="inherentI.name"]').dblclick();
        cy.wait(2000);
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Edit_InherentImpact).click();
        cy.wait(2000);
        cy.get('.toast').contains("Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically.")
        cy.wait(2000);
        ///***Scroll Page  */
        cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
        cy.wait(1000);
        ////*******Select Likelihood Value  - Residual****/////
        cy.get('.ag-row-last > [col-id="residualL.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Edit_ResidualLikelihood).click();
        cy.wait(2000);
        ////*******Select Impact Value  - Residual****////
        cy.get('.ag-row-last > [col-id="residualI.name"]').click().dblclick();
        cy.get('.ag-rich-select-list > .ag-virtual-list-viewport').contains(Edit_ResidualImpact).click();
        cy.wait(2000);
        //***Risk Register Name Updated */
        cy.get('.ag-row-odd > .ag-cell-last-left-pinned').dblclick();
        cy.wait(2000);
        cy.get('[aria-label="Input Editor"]').clear().type(RiskName).type(timeStamp).tab();
        cy.wait(5000);
        cy.get('.toast').contains("Please refresh grid for updated aggregation values as after updating risk values it doesn't update automatically.")

    }



}
export default RiskRegister_PO;