import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class RiskAnalysisDimensions_PO {

    addDimensionsButton() {
        cy.get('#btnAddDimension > :nth-child(1) > .la').click();


    }

    ///Likelihood Dimensions Tab - 1
    ColorSetupTab1() {
        ////Label 1
        cy.get(':nth-child(2) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[1]/div[3]/div/div/div/div/span[1]').click();
        ////Label 2
        cy.get(':nth-child(4) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[2]/div[3]/div/div/div/div/span[2]').click();
        cy.wait(2000);
        ////Label 3
        cy.get(':nth-child(6) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[3]/div[3]/div/div/div/div/span[3]').click();
        cy.wait(2000);
        ////Label 4
        cy.get(':nth-child(8) > :nth-child(3) > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[4]/div[3]/div/div/div/div/span[4]').click();
        cy.wait(2000);
        ////Label 5
        cy.get(':nth-child(10) > :nth-child(3) > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[5]/div[3]/div/div/div/div/span[5]').click();
        cy.wait(2000);

    }


    ColorSetupTab2() {
        ////Tab Click
        cy.get('a:contains(Impact Dimensions)').click();
        cy.wait(5000);

        ////Label 1
        cy.get(':nth-child(3) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[1]/div[3]/div/div/div/div/span[6]').click();
        ////Label 2
        cy.get(':nth-child(6) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[2]/div[3]/div/div/div/div/span[7]').click();
        cy.wait(2000);
        ////Label 3
        cy.get(':nth-child(9) > .col-md-1 > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[3]/div[3]/div/div/div/div/span[8]').click();
        cy.wait(2000);
        ////Label 4
        cy.get(':nth-child(12) > :nth-child(3) > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[4]/div[3]/div/div/div/div/span[9]').click();
        cy.wait(2000);
        ////Label 5
        cy.get(':nth-child(15) > :nth-child(3) > .form-group > :nth-child(2) > .palette-color-picker-button').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[5]/div[3]/div/div/div/div/span[10]').click();
        cy.wait(2000);

    }

    riskAnalysisDimensionsTab3Click() {

        ////Tab Click
        // cy.get('a:contains(Risk Analysis Dimensions)').click();
        cy.get(':nth-child(3) > .nav-link').click();
        cy.wait(5000);

    }

    riskAnalysisDimensionsTab3label1(lable1, lable1_Value) {

        ////Label 1
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[1]/div[1]/div/input').type(lable1);
        cy.get('#s2id_inherentValue_1 > .select2-choice > .select2-arrow > b').click()
        cy.get('#s2id_autogen1_search').type(lable1_Value).type('{enter}');
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div/div[4]/div/div/div').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div/div[4]/div/div/div/div/span[1]').click();
        cy.wait(1000);
    }

    riskAnalysisDimensionsTab3label2(lable2, lable2_Value) {
        ////Label 2
        cy.get('.empty-palette > .col-md-5 > .form-group > .form-control').type(lable2);
        cy.get('#s2id_inherentValue_2 > .select2-choice > .select2-arrow > b').click()
        cy.get('#s2id_autogen20_search').type(lable2_Value).type('{enter}');
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[2]/div[4]/div/div/div').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[2]/div[4]/div/div/div/div/span[6]').click();

    }

    riskAnalysisDimensionsTab3label3(lable3, lable3_Value) {

        ////Label 3
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[3]/div[1]/div/input').type(lable3);
        cy.get('#s2id_inherentValue_3 > .select2-choice > .select2-arrow > b').click()
        cy.get('#s2id_autogen36_search').type(lable3_Value).type('{enter}');
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[3]/div[4]/div/div/div').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[3]/div[4]/div/div/div/div/span[7]').click();

    }

    riskAnalysisDimensionsTab3label4(lable4, lable4_Value) {
        ////Label 4
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[4]/div[1]/div/input').type(lable4);
        cy.get('#s2id_inherentValue_4 > .select2-choice > .select2-arrow > b').click()
        cy.get('#s2id_autogen54_search').type(lable4_Value).type('{enter}');
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[4]/div[4]/div/div/div').click();
        cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[4]/div[4]/div/div/div/div/span[5]').click();

    }

    // riskAnalysisDimensionsTab3label5(lable5, lable5_Value) {
    //     ////Label 5
    //     cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[5]/div[1]/div/input').type(lable5);
    //     cy.get('#s2id_inherentValue_4 > .select2-choice > .select2-arrow > b').click()
    //     cy.wait(1000);
    //     cy.get('#s2id_inherentValue_4 > .select2-choice > .select2-arrow > b').type('{downArrow}');
    // cy.xpath('//*[@id="s2id_autogen71_search"]').type(lable5_Value).type('{enter}');
    // cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[5]/div[4]/div/div/div').click();
    // cy.xpath('//*[@id="riskanalysisDimensionsForm"]/div/div[5]/div[4]/div/div/div/div/span[10]').click();

    // }

    editriskAnalysisDimensionsTab3label(lable1, lable1_Value, lable2, lable2_Value, lable3, lable3_Value, lable4, lable4_Value) {

        ////Label 1
        cy.get(':nth-child(1) > .col-md-5 > .form-group > .form-control').clear().type(lable1);
        cy.get('#inherentValue_1').clear().type(lable1_Value);
        cy.wait(1000);
        ////Label 2
        cy.get(':nth-child(2) > .col-md-5 > .form-group > .form-control').clear().type(lable2);
        cy.get('#inherentValue_2').clear().type(lable2_Value);
        cy.wait(1000);
        ////Label 3
        cy.get(':nth-child(3) > .col-md-5 > .form-group > .form-control').clear().type(lable3);
        cy.get('#inherentValue_3').clear().type(lable3_Value);
        cy.wait(1000);
        ////Label 4
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').clear().type(lable4);
        cy.get('#inherentValue_4').clear().type(lable4_Value);
        cy.wait(1000);
    }


    validationriskAnalysisDimensions(lable4_Value) {

        ///Value is already selected
        cy.get('#inherentValue_4').clear().type(lable4_Value);
        cy.wait(1000);
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').click();
        cy.wait(3000);
        cy.get('.toast').contains('Value is already added');
        cy.get('#toast-container > div > button').click();
        cy.wait(8000);

        
    }
    emptyFieldValidation() {     
        cy.get('.toast').contains('Problem(s) in save. Please update the highlighted fields below and try again.')
            
    }

    

    validationRelativeMagnitudes(label6, lable6_Value) {

        ///Value is already selected
        cy.get('.empty-palette > .col-md-5 > .form-group > .form-control').type(label6);
        cy.get('#relativeMagnitudeValues_6').type(lable6_Value);
    }


    relativeMagnitudesTab4Click() {

        ////Tab Click
        // cy.get('a:contains(Risk Analysis Dimensions)').click();
        cy.get(':nth-child(4) > .nav-link').click();
        cy.wait(5000);

    }

    ///Relative Magnitudes - Tab 4
    relativeMagnitudesSetupTab4(Lable1, Lable1_Value, Lable2, Lable2_Value, Lable3, Lable3_Value, Lable4, Lable4_Value, Lable5, Lable5_Value) {

        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000);
        ////Label 1
        cy.get('.col-md-5 > .form-group > .form-control').type(Lable1);
        cy.get('#relativeMagnitudeValues_1').type(Lable1_Value);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000);
        ////Label 2
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').type(Lable2);
        cy.get('#relativeMagnitudeValues_2').type(Lable2_Value);
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 3
        cy.get(':nth-child(6) > .col-md-5 > .form-group > .form-control').type(Lable3);
        cy.get('#relativeMagnitudeValues_3').type(Lable3_Value);
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 4
        cy.get(':nth-child(8) > .col-md-5 > .form-group > .form-control').type(Lable4);
        cy.get('#relativeMagnitudeValues_4').type(Lable4_Value);
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 5
        cy.get(':nth-child(10) > .col-md-5 > .form-group > .form-control').type(Lable5);
        cy.get('#relativeMagnitudeValues_5').type(Lable5_Value);
        cy.wait(1000);

    }


    ///Edit Relative Magnitudes - Tab 4
    editRelativeMagnitudesSetupTab4(Lable1, Lable1_Value, Lable2, Lable2_Value, Lable3, Lable3_Value, Lable4, Lable4_Value, Lable5, Lable5_Value) {

        ////Label 1
        cy.get(':nth-child(2) > .col-md-5 > .form-group > .form-control').clear().type(Lable1);
        cy.get('#relativeMagnitudeValues_1').clear().type(Lable1_Value);

        ////Label 2
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').clear().type(Lable2);
        cy.get('#relativeMagnitudeValues_2').clear().type(Lable2_Value);
        cy.wait(1000);

        ////Label 3
        cy.get(':nth-child(6) > .col-md-5 > .form-group > .form-control').clear().type(Lable3);
        cy.get('#relativeMagnitudeValues_3').clear().type(Lable3_Value);
        cy.wait(1000);

        ////Label 4
        cy.get(':nth-child(8) > .col-md-5 > .form-group > .form-control').clear().type(Lable4);
        cy.get('#relativeMagnitudeValues_4').clear().type(Lable4_Value);
        cy.wait(1000);

        ////Label 5
        cy.get(':nth-child(10) > .col-md-5 > .form-group > .form-control').clear().type(Lable5);
        cy.get('#relativeMagnitudeValues_5').clear().type(Lable5_Value);
        cy.wait(1000);

    }

    contrlStrengthDimensionsTab5Click() {

        cy.get(':nth-child(5) > .nav-link').click();
        cy.wait(4000);

    }

    ///Contrl Strength Dimensions- Tab 5
    contrlStrengthDimensionsTab5(Lable1, Lable1_Value, Guidance1, Lable2, Lable2_Value, Guidance2, Lable3, Lable3_Value, Guidance3, Lable4, Lable4_Value, Guidance4, Lable5, Lable5_Value, Guidance5) {

        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000);
        ////Label 1
        cy.get(':nth-child(2) > .col-md-5 > .form-group > .form-control').type(Lable1);
        cy.get('#controlStrengthValues_1').type(Lable1_Value);
        cy.get(':nth-child(2) > .col-md-3 > .form-group > #guidance').type(Guidance1)
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000);
        ////Label 2
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').type(Lable2);
        cy.get('#controlStrengthValues_2').type(Lable2_Value);
        cy.get(':nth-child(4) > .col-md-3 > .form-group > #guidance').type(Guidance2)
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 3
        cy.get(':nth-child(6) > .col-md-5 > .form-group > .form-control').type(Lable3);
        cy.get('#controlStrengthValues_3').type(Lable3_Value);
        cy.get(':nth-child(6) > .col-md-3 > .form-group > #guidance').type(Guidance3)
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 4
        cy.get(':nth-child(8) > .col-md-5 > .form-group > .form-control').type(Lable4);
        cy.get('#controlStrengthValues_4').type(Lable4_Value);
        cy.get(':nth-child(8) > .col-md-3 > .form-group > #guidance').type(Guidance4)
        cy.wait(1000);
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000)
        ////Label 5
        cy.get(':nth-child(10) > .col-md-5 > .form-group > .form-control').type(Lable5);
        cy.get('#controlStrengthValues_5').type(Lable5_Value);
        cy.get(':nth-child(10) > .col-md-3 > .form-group > #guidance').type(Guidance5)
        cy.wait(1000);

    }

    ///Edit Contrl Strength Dimensions- Tab 5
    editContrlStrengthDimensionsTab5(Lable1, Lable1_Value, Guidance1, Lable2, Lable2_Value, Guidance2, Lable3, Lable3_Value, Guidance3, Lable4, Lable4_Value, Guidance4, Lable5, Lable5_Value, Guidance5) {

        ////Label 1
        cy.get(':nth-child(2) > .col-md-5 > .form-group > .form-control').clear().type(Lable1);
        cy.get('#controlStrengthValues_1').clear().type(Lable1_Value);
        cy.get(':nth-child(2) > .col-md-3 > .form-group > #guidance').clear().type(Guidance1)

        ////Label 2
        cy.get(':nth-child(4) > .col-md-5 > .form-group > .form-control').clear().type(Lable2);
        cy.get('#controlStrengthValues_2').clear().type(Lable2_Value);
        cy.get(':nth-child(4) > .col-md-3 > .form-group > #guidance').clear().type(Guidance2)
        cy.wait(1000);

        ////Label 3
        cy.get(':nth-child(6) > .col-md-5 > .form-group > .form-control').clear().type(Lable3);
        cy.get('#controlStrengthValues_3').clear().type(Lable3_Value);
        cy.get(':nth-child(6) > .col-md-3 > .form-group > #guidance').clear().type(Guidance3)
        cy.wait(1000);

        ////Label 4
        cy.get('#riskanalysisDimensionsForm > div.form-body.dimensions-container > div:nth-child(4) > div.col-md-5 > div > input').clear().type(Lable4);
        cy.get('#controlStrengthValues_4').clear().type(Lable4_Value);
        cy.get(':nth-child(4) > .col-md-3 > .form-group > #guidance').clear().type(Guidance4)
        cy.wait(1000);

        ////Label 5
        cy.get('#riskanalysisDimensionsForm > div.form-body.dimensions-container > div:nth-child(5) > div.col-md-5 > div > input').clear().type(Lable5);
        cy.get('#controlStrengthValues_5').clear().type(Lable5_Value);
        cy.get(':nth-child(5) > .col-md-3 > .form-group > #guidance').clear().type(Guidance5)
        cy.wait(1000);

    }

    validationContrlStrengthDimensions(Lable6, Lable6_Value, Guidance6) {

        ///Value is already selected
        cy.get('.empty-palette > .col-md-5 > .form-group > .form-control').type(Lable6);
        cy.get('#controlStrengthValues_6').type(Lable6_Value);
        cy.get('.empty-palette > .col-md-3 > .form-group > #guidance').type(Guidance6)
    }

    addbutton() {
        ///Add Button Click
        cy.get('#btnAddDimension > :nth-child(1) > span').click();
        cy.wait(1000);

    }



    savebutton() {
        cy.get('#saveBtn').click({force: true});
        

    }


}
export default RiskAnalysisDimensions_PO;