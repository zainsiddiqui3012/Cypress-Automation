import dayjs from 'dayjs'
// import { value } from 'jsonpath';
// import { WatchDirectoryFlags, textSpanContainsTextSpan } from 'typescript';

const write_NegativeImpact_Search = 'cypress/fixtures/RiskModule/Control_Taxonomy/_Write_SearchNegativeImpact.json'
const writefile_inherentR_name = 'cypress/fixtures/RiskModule/RiskCalculation/write_inherentR_name.txt'
const writefile_residualR_name = 'cypress/fixtures/RiskModule/RiskCalculation/write_residualR_name.txt'
const writefile_inherentLikeihood_name = 'cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentLikeihood_SurveyLable.txt'
const writefile_inherentImpact_name = 'cypress/fixtures/RiskModule/RiskCalculation/writefile_inherentImpact_SurveyLable.txt'


//let getText;

class DAP_Assessment_PO {


    GotoCreateControlTestForm(formType, DAPAssessmentURL, OEPAssessmentURL)
    {
            const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
            cy.log(timeStamp);
    
            ///**Add Control from Inline editor */
            cy.get('.ag-center-cols-container > .ag-row-last > .txtWrapTarget > .ag-cell-wrapper > .ag-group-contracted', { timeout: 10000 }).click();
            cy.get("div[class='ag-theme-balham'] div[class='ag-body-horizontal-scroll-viewport']", { timeout: 10000 }).scrollTo('bottomRight');
            cy.get("div[class='d-inline-block float-left'] div[class='actionDropDWrap']", { timeout: 10000 }).click();

            if(formType == "DAP Assessment")
            {
            cy.get('#designAssBtn').click(); 
            cy.visit(DAPAssessmentURL);
            cy.switchIframe('#mytarget')
            .find("[name='summary']", { timeout: 30000 })
            .should('be.visible', { timeout: 30000 });

            }

            else{
            cy.get('#oeaAssBtn').click(); 
            cy.visit(OEPAssessmentURL); 
            cy.switchIframe('#mytarget')
            .find("[name='summary']", { timeout: 30000 })
            .should('be.visible', { timeout: 30000 });  
            }     
    }

        ValidateSummaryField(ValidateSummaryField)
        {
            cy.switchIframe('#mytarget').find("[name='summary']").should('have.value', 'DAP Assessment');
            
        }

        AddDescription(description)
        {
            cy.switchIframe('#mytarget').find('textarea#description').type(description);
            //cy.switchIframe('#mytarget').find("#tinymce").type(description);

        }

        SetPriorityField(Priority)
        {
            if(Priority == "High")  //select high priority
            cy.switchIframe('#mytarget').find("input#priority-field").wait(3000).clear().type(Priority, '{enter}');
        }

        ValidateControlReviewerField(ControlReviewer)
        {
            // Construct the selector with the input text
            var selector = "#customfield_16702-single-select:contains('" + ControlReviewer + "')";
            cy.switchIframe('#mytarget').find(selector);

        }

        SetReccuranceANDReoccurEvery(Reoccurance, RecurEvery)
        {
                  // Select Daily Reoccurance
                  cy.switchIframe('#mytarget')
                  .find("#customfield_10701", { timeout: 10000 }) // Wait up to 10 seconds for the element to appear
                  .should('be.visible', { timeout: 10000 })     // Ensure the element is visible within 10 seconds
                  .select(Reoccurance, { force: true });     // Perform the select action
 
                if(RecurEvery == "1")  //select Reoccur Every Field
                    cy.switchIframe('#mytarget').find("#customfield_10800").select(RecurEvery, { force: true });
                else   //select Reoccur Every Field
                    cy.switchIframe('#mytarget').find("#customfield_10800").select(30, { force: true });
        }

        selectCurrentDate(Date) {
            if(Date=="2/DEC/2024")

               cy.switchIframe('#mytarget').find("input#customfield_10700").type(Date);
            else
            {
                cy.switchIframe('#mytarget').find("#customfield_10803-2").click();
                cy.switchIframe('#mytarget').find("input#customfield_10709").type(Date);  
            }
        }

        SelectTemplate(Template)
        {
            cy.switchIframe('#mytarget').find("#customfield_21304-input").type(Template,  '{enter}');
        }

        clickoncreatebtn()
        {
            cy.switchIframe('#mytarget').find("#issue-create-submit").click();
        }

        ValidateDetailsSection(issueFormType, issueStatus, Priority, Recurrence, RecurEvery, EndOnDate, Events)
        {
            cy.switchIframe('#mytarget').find('span#type-val').contains(issueFormType,{ timeout: 10000 });
            cy.switchIframe('#mytarget').find('span#status-val').contains(issueStatus, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('span#priority-val').contains(Priority, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('#customfield_10701-val').contains(Recurrence, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('#customfield_10800-val').contains(RecurEvery, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('#customfield_10803-val').contains(EndOnDate, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('#customfield_10801-val').contains(Events, { timeout: 10000 });

        }

        ValidatePeopleSection(assigneeval, Reporterval, ControlReviewer, ControlTester)
        {
            cy.switchIframe('#mytarget').find('span#assignee-val').contains(assigneeval,{ timeout: 10000 });
            cy.switchIframe('#mytarget').find('span#reporter-val').contains(Reporterval, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('span#customfield_16702-val').contains(ControlReviewer, { timeout: 10000 });
            cy.switchIframe('#mytarget').find('span#customfield_17100-val').contains(ControlTester, { timeout: 10000 });
        }

        ValidateDatesSection(Duedate)
        {
            cy.switchIframe('#mytarget').find('span#due-date').contains(Duedate,{ timeout: 10000 });

        }

        ValidateDescription(Description)
        {
            cy.switchIframe('#mytarget').find('#description-val').contains(Description,{ timeout: 10000 });
        }

        ValidateControlEditorSection(RiskContext)
        {
            cy.switchIframe('#mytarget').find('#riskContext').contains(RiskContext,{ timeout: 10000 });    
        }

    }
        
    




export default DAP_Assessment_PO;