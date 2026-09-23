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
        
        context("Add Cases - Control Types", () => {            
            beforeEach(() => {
                loginAndVisitControlTypes();
            });

            it("Add Control Type with Valid Name and Description",
                {tags:["@pd42370", "@smoke"]},
                () => {
                controlTypes.updateDataInFile({filePath:dataFilePath, addData:data.addData});
                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.clickAddBtn();
                    controlTypes.typeName(data.addData.name);
                    controlTypes.typeDescription(data.addData.description);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success);
                    controlTypes.validateRecordExist(data.addData.name);
                });
            });

            it("Open Add Control Type Dialog",
                {tags:["@pd42384", "@smoke"]},
                () => {
                controlTypes.clickAddBtn();
                controlTypes.validateaddForm();
                controlTypes.validateFieldsExist();
            });

            it("Add Control Type with Special Characters in Name",
                {tags:["@pd42376"]},
                () => {
                controlTypes.updateDataInFile({filePath:dataFilePath, addData:data.addData});
                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.clickAddBtn();
                    controlTypes.typeName(data.addData.specialCharacters);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success); 
                    controlTypes.validateRecordExist(data.addData.specialCharacters);
                });
            });

            it("Add Control Type With Empty Name",
                {tags:["@pd42363", "@smoke"]},
                () => {
                controlTypes.clickAddBtn();
                controlTypes.typeDescription(data.addData.description);
                controlTypes.clickSaveBtn();
                controlTypes.validateToastMessage(data.toastMessage.error);            
            });

            it("Add Control Type With Empty Description",
                {tags:["@pd42374"]},
                () => {
                
                controlTypes.updateDataInFile({filePath:dataFilePath, addData:data.addData});
                cy.readFile(dataFilePath).then((data) => {  
                    controlTypes.clickAddBtn();
                    controlTypes.typeName(data.addData.name);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success);   
                    controlTypes.validateRecordExist(data.addData.name);         
                });

            });

            it("Add Control Type with Invalid Characters in Description",
                {tags:["@pd42372"]},
                () => {
                
                controlTypes.updateDataInFile({filePath:dataFilePath, addData:data.addData});
                cy.readFile(dataFilePath).then((data) => {  
                    controlTypes.clickAddBtn();
                    controlTypes.typeName(data.addData.name);
                    controlTypes.typeDescription(data.addData.specialCharacters);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success);
                    controlTypes.searchAndClick(data.addData.name);   
                    controlTypes.validateDetails(data.addData.name, data.addData.specialCharacters);
       
                });
            });

             it("Add Control Type with Name Exceeding Character Limit",
                {tags:["@pd42375"]},
                () => {
                controlTypes.clickAddBtn();
                controlTypes.typeName(data.addData.exceedingCharacters);
                controlTypes.clickSaveBtn();
                controlTypes.validateToastMessage(data.toastMessage.error);
                controlTypes.validateFieldError(data.fieldErrors.name);
            });

            it("Cancel Add Control Type",
                {tags:["@pd42378"]},
                () => {
                
                let recordsBefore;
                let recordsAfter;

                controlTypes.getRecordsCount((count) => {
                    recordsBefore = count; 
                });

                controlTypes.clickAddBtn();
                controlTypes.clickCancelBtn();

                controlTypes.getRecordsCount((count) => {
                    recordsAfter = count;
                    expect(recordsAfter).to.be.equal(recordsBefore); 
                });
            });

        });
        
        context("Edit Cases - Control Types", () => {            
            beforeEach(() => {
                loginAndVisitControlTypes();
            });

            it("Open Edit Control Type Dialog",
                {tags:["@pd42382", "@smoke"]},
                () => {
                cy.readFile(dataFilePath).then((data) => {

                    controlTypes.searchAndClick(data.addData.name);
                    controlTypes.validateDetails(data.addData.name, data.addData.specialCharacters);
                });
            });

            it("Edit Control Type and Cancel",
                {tags:["@pd42364"]},
                () => {
                    cy.readFile(dataFilePath).then((data) => {  
                        controlTypes.searchAndClick(data.addData.name);
                        controlTypes.clickCancelBtn();
                        controlTypes.validateRecordExist(data.addData.name);
                    });
            });

            it("Edit Control Type with Empty Description",
                {tags:["@pd42366"]},
                () => {
                    
                    cy.readFile(dataFilePath).then((data) => {  
                        controlTypes.searchAndClick(data.addData.name);
                        controlTypes.clearDescription();
                        controlTypes.clickSaveBtn();
                        controlTypes.validateToastMessage(data.toastMessage.success);
                        controlTypes.searchAndClick(data.addData.name);
                        controlTypes.validateEmptyDescription();
                    });
            });

            it("Edit Control Type with Valid Name and Description",
                {tags:["@pd42368", "@smoke"]},
                () => {

                controlTypes.updateDataInFile({filePath:dataFilePath, updateData:data.updateData});
                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.searchAndClick(data.addData.name);
                    controlTypes.clearName();
                    controlTypes.typeName(data.updateData.name);
                    controlTypes.clearDescription();
                    controlTypes.typeDescription(data.updateData.description);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success);
                    controlTypes.searchAndClick(data.updateData.name);
                    controlTypes.validateDetails(data.updateData.name, data.updateData.description);
                });
            });

            it("Edit Control Type with Invalid Characters in Name",
                {tags:["@pd42386"]},
                () => {
                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.searchAndClick(data.updateData.name);
                    controlTypes.clearName();
                });
                
                controlTypes.updateDataInFile({filePath:dataFilePath, updateData:data.updateData});
                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.typeName(data.updateData.specialCharacters);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.success);
                });
            });

            it("Edit Control Type with Name Exceeding Character Limit",
                {tags:["@pd42380"]},
                () => {

                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.searchAndClick(data.updateData.specialCharacters);
                    controlTypes.clearName();
                    controlTypes.typeName(data.updateData.exceedingCharacters);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.error);
                    controlTypes.validateFieldError(data.fieldErrors.name)
                });
            });

            it("Edit Control Type with Empty Name",
                {tags:["@pd42387"]},
                () => {

                cy.readFile(dataFilePath).then((data) => {
                    controlTypes.searchAndClick(data.updateData.specialCharacters);
                    controlTypes.clearName();
                    controlTypes.clearDescription();
                    controlTypes.typeDescription(data.updateData.description);
                    controlTypes.clickSaveBtn();
                    controlTypes.validateToastMessage(data.toastMessage.error);
                });
            });
            
        });

    });