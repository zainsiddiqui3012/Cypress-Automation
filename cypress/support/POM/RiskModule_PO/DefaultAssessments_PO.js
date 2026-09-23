import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class DefaultAssessments_PO {

    selectInherentRiskProbabilityAssessment(InherentRiskProbabilityAssessment, InherentRiskImpactAssessment, ControlEnvironmentAssessment) {

        cy.get('#select2-chosen-1').click();
        cy.wait(2000);
        cy.get('#s2id_autogen1_search').type(InherentRiskProbabilityAssessment).type('{enter}');
        cy.wait(2000);
        cy.get('#select2-chosen-2').click();
        cy.wait(2000);
        cy.get('#s2id_autogen2_search').type(InherentRiskImpactAssessment).type('{enter}');
        cy.wait(2000);
        cy.get('#s2id_controlId').click();
        cy.wait(2000);
        cy.get('#s2id_autogen3_search').type(ControlEnvironmentAssessment).type('{enter}');
        cy.wait(2000);


    }


    validationcheck() {

        cy.get('#s2id_rpaId > .select2-choice > .select2-search-choice-close').click();
        cy.get('#s2id_riaId > .select2-choice > .select2-search-choice-close').click();
        cy.get('#s2id_controlId > .select2-choice > .select2-search-choice-close').click();

        
    }



    savebutton() {
        //***Click on Save button */
        cy.get('#submitForm-btn').click();
    }



}
export default DefaultAssessments_PO;