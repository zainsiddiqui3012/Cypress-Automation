import locators from "../../../fixtures/locators.json";
import "cypress-file-upload";
export default class IssueSummaryView
{
    locators = locators.issueManagement.summaryView;
    waitForEditBtn(){
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(()=>{
            cy.waitForElementToVisible(this.locators.editBtn, 120000);
        });
    }

    clickEditBtn(){
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(()=>{
            cy.contains('button','Edit').click({force:true});
        });
    }

    getText(labelName){
        return cy.contains('label', labelName ).closest('section').next('section').find('label').invoke('text');
        
    }

    verifyAgencyText(text){
        this.getText('Regulator or Agency').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);

        });
    }
    verifyIssueTypeText(text){
        this.getText('Type Of Issue').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);

        });
    }
    verifyBusinessAreaText(text){
        this.getText('Business Area').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyVendor(text){
        this.getText('Vendor').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);

        });
    }
    verifyNotifier(text){
        this.getText('Notifiers').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);

        });
    }
    getTextRichTextArea(labelName){
        return cy.contains('label', labelName).closest('section').next().find('p').invoke('text');

    }
    verifyDescriptionText(text){

        this.getTextRichTextArea('Description').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);        
        });  
    }
    verifyOriginalReportText(text){
        this.getTextRichTextArea('Original Report').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);        
        });
    }

    verifyRecommendation(text){
        this.getTextRichTextArea('Recommendations').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);       
        });

    }
    verifyManagementResponseText(text){
        this.getTextRichTextArea('Management Response').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);        
        });
    }
    verifyRootCauseDescText(text){
        this.getTextRichTextArea('Root Cause Description').then((TicketText)=>{
           
            expect(TicketText.trim()).to.equal(text);     
        });
    }
    verifyDepartment(text){

        this.getText('Responsible Department').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }

    verifyOwnerText(text){
        this.getText('Owner').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });       
    }
    verifyPotentialLossText(text){

        this.getText('Potential Loss').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyActualLossText(text){
        this.getText('Actual Loss').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyImpactedControlText(text){

        this.getText('Impacted Control').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyRiskAreaText(text){
        this.getText('Risk Area').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyCustomerImpactedNo(text){
        this.getText('Number of Customers Impacted').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyHowCustomersImpacted(text){
        this.getText('How Customers are Impacted').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyReporter(text){

        this.getText('Reporter').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);

        });
    }
    verifyAssignee(expectedAssignee){
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(() => {
            this.getText(/^Assignee$/).then((TicketText)=>{
                expect(TicketText.trim()).to.equal(expectedAssignee);

            });
        });
    }
    verifyGroupAssignee(expectedGroupAssignee){
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(()=>{
            this.getText('Group Assignee').then((TicketText)=>{
                expect(TicketText.trim()).to.equal(expectedGroupAssignee);
    
            });
        });       
    }

    verifyEventOccurenceDate(Date){
        this.getText('Event Occurrence').then((TicketDate)=>{
            expect(TicketDate.trim()).to.equal(Date);
        });
    }
    verifyIdentificationDate(Date){
        this.getText('Identification Date').then((TicketDate)=>{
            expect(TicketDate.trim()).to.equal(Date);
        });
    }
    verifyReportDate(Date){
        this.getText('Report Date').then((TicketDate)=>{
            expect(TicketDate.trim()).to.equal(Date);
        });
    }
    verifyDueDate(Date){
        this.getText('Due Date').then((TicketDate)=>{
            expect(TicketDate.trim()).to.equal(Date);
        });
    }
    verifyRemediationTargetDate(Date){
        this.getText('Remediation Target Date').then((TicketDate)=>{
            expect(TicketDate.trim()).to.equal(Date);
        });
    }
    verifySubmitter(text){
        this.getText('Submitter Name').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifySubjectArea(text){
        this.getText('Subject Area').then((TicketText)=>{
            expect(TicketText.trim()).to.equal(text);
        });
    }
    verifyDataOnSummaryView(issueData){      
        cy.switchIframe(locators.issueManagement.issueDashboard.issueFrame).within(()=>{
            this.verifyDescriptionText(issueData.mandatory.description);
            this.verifyAgencyText(issueData.allFields.entity);
            this.verifyIssueTypeText(issueData.allFields.issueType);
            this.verifyDepartment(issueData.mandatory.department);
            this.verifySubmitter(issueData.mandatory.submitter);
            this.verifySubjectArea(issueData.allFields.subjectArea);
            this.verifyBusinessAreaText(issueData.allFields.businessArea);
            this.verifyNotifier(issueData.emails.singleCorrect);
            this.verifyVendor(issueData.allFields.vendor);
        
            this.verifyOriginalReportText(issueData.allFields.originalReport);
            this.verifyRootCauseDescText(issueData.allFields.rootCauseDesc);
            this.verifyRecommendation(issueData.allFields.recommendation);
            this.verifyManagementResponseText(issueData.allFields.managementResponse);
        
            this.verifyOwnerText(issueData.mandatory.owner);
            this.verifyActualLossText(issueData.numericValues.valid);
            this.verifyPotentialLossText(issueData.numericValues.valid);
            this.verifyCustomerImpactedNo(issueData.numericValues.valid);
            this.verifyHowCustomersImpacted(issueData.allFields.customersImpactedDesc);
            this.verifyRiskAreaText(issueData.allFields.riskArea);
        
            this.verifyReporter(issueData.mandatory.reporter);
            this.verifyAssignee(issueData.mandatory.assignee);
        
            this.verifyIdentificationDate(issueData.date.ValidateDate);
            this.verifyReportDate(issueData.date.ValidateDate);
            this.verifyDueDate(issueData.date.ValidateDate);
            this.verifyRemediationTargetDate(issueData.date.ValidateDate);
            this.verifyEventOccurenceDate(issueData.date.ValidateDate);        
        });
    }
}