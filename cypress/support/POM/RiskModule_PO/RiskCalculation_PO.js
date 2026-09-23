import dayjs from 'dayjs'

const writefile_inherentR_name = 'cypress/fixtures/RiskModule/RiskCalculation/write_inherentR_name.txt'
const writefile_residualR_name = 'cypress/fixtures/RiskModule/RiskCalculation/write_residualR_name.txt'
const writefile_inherentLikeihood_name = 'cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentLikeihood_SurveyLable.txt'
const writefile_inherentImpact_name = 'cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentImpact_SurveyLable.txt'



class RiskCalculation_PO {


    elements = {

        dimensionsFormTab1_Label: () => cy.get('#riskanalysisDimensionsForm'),
        dimensionsFormTab1_Value: () => cy.get('#riskanalysisDimensionsForm'),
        clickOnTab2: () => cy.get('a:contains(Impact Dimensions)'),
        dimensionsFormTab2_Label: () => cy.get('#riskanalysisDimensionsForm'),
        dimensionsFormTab2_Value: () => cy.get('#riskanalysisDimensionsForm'),
        clickOnTab3: () => cy.get(':nth-child(3) > .nav-link'),
        dimensionsFormTab3_Label: () => cy.get('#riskanalysisDimensionsForm'),
        clickOnprofile: () => cy.get('.m-topbar__userpic > .m--img-rounded'),
        clickOnprofileName: () => cy.get('#m_header_topbar > div > ul > li.m-nav__item.m-topbar__user-profile.m-topbar__user-profile--img.m-dropdown.m-dropdown--medium.m-dropdown--arrow.m-dropdown--header-bg-fill.m-dropdown--align-right.m-dropdown--mobile-full-width.m-dropdown--skin-light > div > div > div.m-dropdown__body > div > ul > li:nth-child(2) > a > span > span > span'),

        //***Risk Register */
        irLableRiskRegister: () => cy.get('.ag-row-last > [col-id="inherentR.name"] span'),
        iLikeihood_SurveyLable_RiskRegister: () => cy.get('.ag-row-last > [col-id="inherentL.name"] span'),
        iImpactLable_SurveyLable_RiskRegister: () => cy.get('.ag-row-last > [col-id="inherentI.name"] span'),

        rrLableRiskRegister: () => cy.get('.ag-row-last > [col-id="residualR.name"] span'),


    }

    riskDimensionsTab1(Likelihood_Tab1_Label, Likelihood_Tab1_Value, Likelihood_Tab1_LabelResidual, Likelihood_Tab1_ValueResidual) {

        this.elements.dimensionsFormTab1_Label().invoke('text').as(Likelihood_Tab1_Label);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_Label);

        this.elements.dimensionsFormTab1_Value().contains(Likelihood_Tab1_Value);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_Value);

        this.elements.dimensionsFormTab1_Label().invoke('text').as(Likelihood_Tab1_LabelResidual);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_LabelResidual);

        this.elements.dimensionsFormTab1_Value().contains(Likelihood_Tab1_ValueResidual);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_ValueResidual);

    }



    riskDimensionsTab2(Impact_Tab2_Label, Impact_Tab2_Value, Impact_Tab2_LabelResidual, Impact_Tab2_ValueResidual) {

        this.elements.clickOnTab2().click();
        this.elements.dimensionsFormTab2_Label().invoke('text').as(Impact_Tab2_Label);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_Label);

        this.elements.dimensionsFormTab2_Value().contains(Impact_Tab2_Value);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_Value);

        this.elements.dimensionsFormTab2_Label().invoke('text').as(Impact_Tab2_LabelResidual);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_LabelResidual);

        this.elements.dimensionsFormTab2_Value().contains(Impact_Tab2_ValueResidual);
        cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_ValueResidual);

        // // //**IR _________C A L C U L A T E */
        // // const IR_Calculation = Likelihood_Tab1_Value * Impact_Tab2_Value

        // cy.log("===== C A L C U L A T E ==== ", IR_Calculation)
    }



    riskDimensionsTab3() {

        this.elements.clickOnTab3().click();
        cy.wait(10000);
        cy.readFile(writefile_inherentR_name).then(text => {
            this.elements.dimensionsFormTab3_Label().invoke('text').as(text)
        });

        cy.readFile(writefile_residualR_name).then(text => {
            this.elements.dimensionsFormTab3_Label().invoke('text').as(text)
        });

    }

    ////****Inherent Risk value Verify */
    tab1Dimensions_SurveyDataCheck() {


        cy.wait(10000)
        cy.readFile(writefile_inherentLikeihood_name).then(text => {
            this.elements.dimensionsFormTab1_Label().invoke('text').as(text)

        });

    }
    ////****Inherent Likeihood Survey value Verify */
    tab2Dimensions_SurveyDataCheck() {

        this.elements.clickOnTab2().click();
        cy.wait(10000);
        cy.readFile(writefile_inherentImpact_name).then(text => {
            this.elements.dimensionsFormTab2_Label().invoke('text').as(text)
        });

    }
    ////****Inherent Impact Survey value Verify */
    tab3Dimensions_SurveyDataCheck() {

        this.elements.clickOnTab3().click();
        cy.wait(10000);
        cy.readFile(writefile_inherentR_name).then(text => {
            this.elements.dimensionsFormTab3_Label().invoke('text').as(text)
        });
    }

    // riskDimensionsTab1For_Residual(Likelihood_Tab1_LabelResidual, Likelihood_Tab1_ValueResidual) {


    //     this.elements.dimensionsFormTab1_Label().invoke('text').as(Likelihood_Tab1_LabelResidual);
    //     cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_LabelResidual);

    //     this.elements.dimensionsFormTab1_Value().contains(Likelihood_Tab1_ValueResidual);
    //     cy.log("===== Print Value Using Invoke Command ==== ", this.Likelihood_Tab1_ValueResidual);



    // }

    // riskDimensionsTab2For_Residual(Impact_Tab2_LabelResidual, Impact_Tab2_ValueResidual) {

    //     this.elements.dimensionsFormTab2_Label().invoke('text').as(Impact_Tab2_LabelResidual);
    //     cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_LabelResidual);

    //     this.elements.dimensionsFormTab2_Value().contains(Impact_Tab2_ValueResidual);
    //     cy.log("===== Print Value Using Invoke Command ==== ", this.Impact_Tab2_ValueResidual);

    //     // // //**IR _________C A L C U L A T E */
    //     // // const IR_Calculation = Likelihood_Tab1_Value * Impact_Tab2_Value

    //     // cy.log("===== C A L C U L A T E ==== ", IR_Calculation)
    // }

    clickOnprofileButton() {

        this.elements.clickOnprofile().click();
        this.elements.clickOnprofileName().click();
        cy.wait(10000);


    }


    ////****Inherent Likeihood Survey value Verify */
    iLikeihoodValueCheck() {

        cy.readFile(writefile_inherentLikeihood_name).then(text => {
            this.elements.iLikeihood_SurveyLable_RiskRegister().contains(text)
        });

    }
    ////****Inherent Impact Survey value Verify */
    iImpactValueCheck() {

        cy.readFile(writefile_inherentImpact_name).then(text => {
            this.elements.iImpactLable_SurveyLable_RiskRegister().contains(text)
        });

    }

    ////****Inherent Risk value Verify */
    iRiskValueCheck() {

        cy.readFile(writefile_inherentR_name).then(text => {
            this.elements.irLableRiskRegister().contains(text)
        });

    }


    ////****Residual Risk value Verify */
    rrRiskValueCheck() {

        cy.readFile(writefile_residualR_name).then(text => {
            this.elements.rrLableRiskRegister().contains(text)
        });

    }



}
export default RiskCalculation_PO;