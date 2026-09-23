import ControlTypesNoneSpace from "../../../support/POM/RiskAndControlRegister/Administration/ControlTypesNoneSpace";
import locators from "../../../fixtures/locators.json";

describe("Control Types - None space",
    { tags: ["@pd36717, @regression, @risk-management, @control-types, @none"] },
    () => {
        
        const controlTypes = new ControlTypesNoneSpace();
        const dataFilePath = "cypress/fixtures/RiskAndControlRegister/Administration/ControlTypesNoneSpace.json";
        let data;

        before(() => {
            cy.readFile(dataFilePath).then((testData) => {
                data = testData;
            });
        });

        const loginAndVisitControlTypes = () => {
            const rmUser = Cypress.env("kxi").none;
            cy.loginWithSession(
                `login with ${rmUser.username}`,
                rmUser.username,
                rmUser.password,
                rmUser.key
            );
            cy.visitControlTypes();
        };

        context("General Validation Cases - Control Types", () => {            
            beforeEach(() => {
                loginAndVisitControlTypes();
            });

            it("Load Control Types List",
                {tags:["@pd42361", "@smoke"]},
                () => {
            
                cy.get(locators.risk.administration.controlTypes.recordsDropdown).select(data.recordsSelect.All);
                let totalRecords;

                controlTypes.getPaginationText((text) =>{
                    totalRecords = Number(text.split(" ")[5]); // get total records from pagination text
                    controlTypes.waitTillAllRowsLoad(totalRecords); // wait till all records get loaded
                });

                controlTypes.validateControlTypesRecords(data.controlTypes, (found) => {
                    expect(found).to.equal(data.controlTypes.length);
                });
            });

            it("Show selected number of records",
                {tags:["@pd42381"]},
                () => {
                    cy.readFile(dataFilePath).then((data) => {
                        controlTypes.selectRecordsDropdown(data.recordsSelect.ten);
                        controlTypes.waitTillAllRowsLoad(data.recordsSelect.ten);                   
                        controlTypes.getRecordsCount((count) => {
                            expect(count).to.equal(Number(data.recordsSelect.ten));
                        });
                    });
            });
        });
        
        context("Pagination Cases - Control Types", () => {            
            beforeEach(() => {
                loginAndVisitControlTypes();
            });

            it("Paginate through Control Types",
                {tags:["@pd42367"]},
                () => {
              
                    let page1TextBefore;
                    let page2Text;
                    let page1TextAfter;
                    
                    controlTypes.getPaginationText((text) =>{
                        page1TextBefore = text;
                    });

                    controlTypes.goToNextPage();
                    controlTypes.getPaginationText((text) =>{
                        page2Text = text;
                        expect(page2Text).to.not.equal(page1TextBefore);
                    });

                    controlTypes.goToPreviousPage();
                    controlTypes.getPaginationText((text) =>{
                        page1TextAfter = text;
                        expect(page1TextBefore).to.equal(page1TextAfter);
                    });
       
            });

            it("Display Pagination Information",
                {tags:["@pd42377"]},
                () => {

                    cy.get(locators.risk.administration.controlTypes.recordsDropdown).select(data.recordsSelect.All);
                    
                    let totalRecords;
                    let paginationText;
                    let expectedText;

                    controlTypes.getPaginationText((text) =>{
                        totalRecords = Number(text.split(" ")[5]); // get total records from pagination text
                        controlTypes.waitTillAllRowsLoad(totalRecords); // wait till all records get loaded
                    });

                    controlTypes.getRecordsCount((totalRecords) => {
                        expectedText = "Showing 1 to " + totalRecords + " of " + totalRecords + " entries";
                    });

                    controlTypes.getPaginationText((text) =>{
                        paginationText = text;
                        expect(paginationText).to.equal(expectedText);
                    });
            });

        });

        context("Filter Cases - Control Types", () => {            
            beforeEach(() => {
                loginAndVisitControlTypes();
            });

            it("No Records Found",
                {tags:["@pd42379"]},
                () => {
                    cy.readFile(dataFilePath).then((data) => {
                        controlTypes.clickFilterModal();
                        controlTypes.typeNameInFilter(data.negativeData.name);
                        controlTypes.clickApply();
                        controlTypes.validateNoRecordsFound(data.pagination.noRecord);        
                    });
            });

            it("Open Filter Popup",
                {tags:["@pd42371", "@filter"]},
                () => {

                    controlTypes.clickFilterModal();
                    controlTypes.validateFilterPopup({exist:true});
                    controlTypes.validateFilterInputFields();
            });

            it("Close Filter Popup",
                {tags:["@pd42373"]},
                () => {

                    controlTypes.clickFilterModal();
                    controlTypes.clickFilterCancelBtn();
                    controlTypes.validateFilterPopup({exist:false});
            });

            it("Apply Filter with Name",
                {tags:["@pd42389", "@filter"]},
                () => {

                    controlTypes.clickFilterModal();
                    controlTypes.typeNameInFilter(data.updateData.specialCharacters);
                    cy.get(locators.risk.administration.controlTypes.autoSuggestion)
                    .should("be.visible").click(); // select the auto-suggested option
                    controlTypes.clickApply();
                    controlTypes.validateFilteredRecord(data.updateData.specialCharacters);
            });

            it("Apply Filter with Customer",
                {tags:["@pd42385", "@filter"]},
                () => {

                    let recordsBeforeFilter;
                    let recordsAfterFilter;

                    controlTypes.getRecordsCount((count) => {
                        recordsBeforeFilter = count; 
                    });

                    controlTypes.clickFilterModal();
                    controlTypes.typeResellerInFilter(data.filterData.customer);
                    controlTypes.clickApply();
                    
                    controlTypes.getRecordsCount((count) => {
                        recordsAfterFilter = count;
                        expect(recordsAfterFilter).to.be.equal(recordsBeforeFilter); 
                    });

            });

            it("Apply Filter with Reseller",
                {tags:["@pd42360", "@filter"]},
                () => {

                    let recordsBeforeFilter;
                    let recordsAfterFilter;

                    controlTypes.getRecordsCount((count) => {
                        recordsBeforeFilter = count; 
                    });

                    controlTypes.clickFilterModal();
                    controlTypes.typeResellerInFilter(data.filterData.reseller);
                    controlTypes.clickApply();
                    
                    controlTypes.getRecordsCount((count) => {
                        recordsAfterFilter = count;
                        expect(recordsAfterFilter).to.be.equal(recordsBeforeFilter); 
                    });

            });

            it("Apply Empty Filter",
                {tags:["@pd42388", "@filter"]},
                () => {

                    let recordsBeforeFilter;
                    let recordsAfterFilter;

                    controlTypes.getRecordsCount((count) => {
                        recordsBeforeFilter = count; 
                    });

                    controlTypes.clickFilterModal();
                    controlTypes.clickApply();
                    
                    controlTypes.getRecordsCount((count) => {
                        recordsAfterFilter = count;
                        expect(recordsAfterFilter).to.be.equal(recordsBeforeFilter); 
                    });
            });

            it("Apply All Filters",
                {tags:["@pd42369", "@filter"]},
                () => {

                    controlTypes.clickFilterModal();
                    controlTypes.typeNameInFilter(data.updateData.specialCharacters);
                    cy.get(locators.risk.administration.controlTypes.autoSuggestion)
                    .should("be.visible").click(); // select the auto-suggested option
                    controlTypes.typeCustomerInFilter(data.filterData.customer);
                    controlTypes.typeResellerInFilter(data.filterData.reseller);
                    controlTypes.clickApply();
                    controlTypes.validateFilteredRecord(data.updateData.specialCharacters);
            });
            
             it("Clear Filter",
                {tags:["@pd42365", "@filter"]},
                () => {

                    cy.readFile(dataFilePath).then((data) => {
                        controlTypes.clickFilterModal();
                        controlTypes.typeNameInFilter(data.updateData.specialCharacters);           
                        cy.get(locators.risk.administration.controlTypes.autoSuggestion)
                        .should("be.visible").click(); // select the auto-suggested option
                        controlTypes.clickApply();
                        controlTypes.validateFilteredRecord(data.updateData.specialCharacters);
                        controlTypes.clickFilterModal();
                        controlTypes.clearFilter();
                        controlTypes.clickApply();
                        controlTypes.validateFilterRemoved();
                    });     
            });
        });
    });