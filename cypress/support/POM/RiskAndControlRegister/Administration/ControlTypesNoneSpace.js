import locators from "../../../../fixtures/locators.json";

class ControlTypesNoneSpace{

    /**
     * @param {Array} controlTypes - array of objects with name, customer and reseller properties 
     * @param {number} totalFound - callback function to return the total found count 
     */
    validateControlTypesRecords(controlTypes, totalFound){
        cy.get(locators.risk.administration.controlTypes.allRows).then($rows => {
            let found = 0;
            controlTypes.forEach(({ name, customer, reseller }) => {
            const match = Array.from($rows).some(row => {
                const text = row.innerText.trim();
                return text.includes(name) && text.includes(customer) && text.includes(reseller);
            });

            if (match) {
                found++;
            }

            });

            totalFound(found);
        });
    }

    /**
     * Click Add button on Control Types page
     */
    clickAddBtn(){
        cy.get(locators.risk.administration.controlTypes.addBtn).click();
    }

    /**
     * @param {string} controlTypeDescription - description to be typed in the description field 
     */
    typeDescription(controlTypeDescription){
        cy.get(locators.risk.administration.controlTypes.controlTypeDescription).type(controlTypeDescription); 
    }

    /**
     * Click Save button on Control Types form
     */
    clickSaveBtn(){
        cy.get(locators.general.saveButton).click();
    }

    /**
     * @param {string} message - toast message to be validated 
     */
    validateToastMessage(message){
        cy.get(locators.risk.administration.riskTaxonomies.SaveControlsuccessToast).should("contain", message);
    }

    /**
     * 
     * @param {string} error - error message to be validated on the field 
     */
    validateFieldError(error){
        cy.get(locators.risk.administration.controlTypes.fieldError).should("contain", error);
    }

    /**
     * @param {string} controlTypeName - name of the control type to be searched and clicked 
     */
    searchAndClick(controlTypeName){
        cy.contains(controlTypeName).click();
    }

    /**
     * Validate that Name and Description fields exist on the form
     */
    validateFieldsExist(){
        cy.get(locators.risk.administration.controlTypes.controlTypeName).should("exist");
        cy.get(locators.risk.administration.controlTypes.controlTypeDescription).should("exist");
    }

    /**
     * Clear Name field
     */
    clearName(){
        cy.get(locators.risk.administration.controlTypes.controlTypeName).clear();
    }

    /**
     * Clear Description field
     */
    clearDescription(){
        cy.get(locators.risk.administration.controlTypes.controlTypeDescription).clear();
    }

    /**
     * Validate that Name field is empty
     */
    validateEmptyDescription(){
        cy.get(locators.risk.administration.controlTypes.controlTypeDescription).should("have.value", "");
    }

    /**
     * Click Cancel button on Control Types Add form
     */
    clickCancelBtn(){
        cy.get(locators.risk.administration.controlTypes.form)
        .contains(locators.risk.administration.controlTypes.cancel).click();
    }   

    /**
     * Click Cancel button on Filter form
     */
    clickFilterCancelBtn(){
        cy.get(locators.risk.administration.controlTypes.filterForm).should("be.visible");
        cy.get(locators.risk.administration.controlTypes.filterCancel)
        .click();
        // clicking the filter cancel button if still exists, as sometimes single cancel filter click doesnt work  
        cy.get('body').then($body => {
            if ($body.find(locators.risk.administration.controlTypes.filterCancel).is(':visible')) {
                cy.get(locators.risk.administration.controlTypes.filterCancel).click();
            }
        });
    }
    
    /**
     * @param {string} controlTypeName - name of the control type to be validated if exists in the table 
     */
    validateRecordExist(controlTypeName){
        cy.contains(controlTypeName).should("exist");
    }

    /**
     * @param {string} controlTypeName - name of the control type to validate
     * @param {string} controlTypeDescription - description of the control type to validate
     */
    validateDetails(controlTypeName, controlTypeDescription){
        cy.get(locators.risk.administration.controlTypes.controlTypeName).should("have.value", controlTypeName);
        cy.get(locators.risk.administration.controlTypes.controlTypeDescription).should("have.value", controlTypeDescription);
    }

    /**
     * Click Filter button on Control Types page
     */
    clickFilterModal(){
        cy.get(locators.risk.administration.controlTypes.filterModal).click();               
    }

    /**
     * @param {string} text - text to be validated in the pagination area when no records found 
     */
    validateNoRecordsFound(text){
        cy.get(locators.risk.administration.controlTypes.pagination).should("contain", text);
    }

    /**
     * @param {string} controlTypeName - name of the control type to be validated after filter is applied
     */
    validateFilteredRecord(controlTypeName){
        cy.get(locators.risk.administration.controlTypes.allRows).should("have.length", 1);
        cy.contains(controlTypeName).should("exist");
    }

    /**
     * Validate that filter is removed and multiple records are shown in the table
     */
    validateFilterRemoved(){
        cy.get(locators.risk.administration.controlTypes.allRows).should("have.length.greaterThan", 1);
    }

    /**
     * @param {object} exist - boolean to check if filter popup should exist or not 
     */
    validateFilterPopup({exist}){
        if(exist) {
            cy.get(locators.risk.administration.controlTypes.filterForm).last().should("be.visible");
        }else{
            cy.get(locators.risk.administration.controlTypes.filterForm).last().should("not.be.visible");
        }
    }

    /**
     * Validate that Add form is visible
     */
    validateaddForm(){    
        cy.get(locators.risk.administration.controlTypes.addForm).last().should("be.visible");
    }

    /**
     * Validate that filter input fields are visible in the filter popup
     */
    validateFilterInputFields(){
        cy.get(locators.risk.administration.controlTypes.nameFilter).should("be.visible");
        cy.get(locators.risk.administration.controlTypes.customerFilter).should("be.visible");
        cy.get(locators.risk.administration.controlTypes.resellerFilter).should("be.visible");
    }

    /**
     * @param {function(string): void} callback - callback function to return the count of records in the table
     */
    getRecordsCount(callback){
        cy.get(locators.risk.administration.controlTypes.allRows).then(($controlTypes) => {
            callback($controlTypes.length);
        })
    }

    /**
     * @param {string} controlName - name to be typed in the Name field of Add/Edit form
     */
    typeName(controlName){
        cy.get(locators.risk.administration.controlTypes.controlTypeName).type(controlName);
    }

    /**
     * @param {string} controlTypeName - name to be typed in the Name filter field 
     */
    typeNameInFilter(controlTypeName){
        cy.get(locators.risk.administration.controlTypes.nameFilter).type(controlTypeName);
    }

    /**
     * @param {string} customerName - name to be typed in the Customer filter field 
     */
    typeCustomerInFilter(customerName){
        cy.get(locators.risk.administration.controlTypes.customerFilter)
        .type(customerName);
    }
    
    /**
     * @param {string} resellerName - name to be typed in the Reseller filter field 
     */
    typeResellerInFilter(resellerName){
        cy.get(locators.risk.administration.controlTypes.resellerFilter).type(resellerName);
    }

    /**
     * Click Apply button on Filter form
     */
    clickApply(){
         cy.contains(locators.risk.administration.controlTypes.apply).click();
    }

    /**
     * Clear all filter fields
     */
    clearFilter(){
        cy.contains(locators.risk.administration.controlTypes.clear).click();
        cy.get(locators.risk.administration.controlTypes.nameFilter).should("have.value", "");
        cy.get(locators.risk.administration.controlTypes.customerFilter).should("have.value", "");
        cy.get(locators.risk.administration.controlTypes.resellerFilter).should("have.value", "");
    }

    /**
     * @param {string} value - value to be selected in the Records dropdown 
     */
    selectRecordsDropdown(value){
        cy.get(locators.risk.administration.controlTypes.recordsDropdown).select(value);
    }

    /**
     * @param {function(string):void} callback - callback function to return the pagination text 
     */
    getPaginationText(callback){
        cy.get(locators.risk.administration.controlTypes.pagination)
        .invoke("text")
        .then((text) => {
            text = text.trim();
            callback(text);
        }); 
    }

    /**
     * Click Next or Previous button in the pagination area
     */
    goToNextPage(){
        cy.get(locators.risk.administration.controlTypes.paginationNext).click();
        cy.contains(locators.risk.administration.controlTypes.loading).should("not.be.visible");               
    }

    /**
     * Click Previous button in the pagination area
     */
    goToPreviousPage(){
        cy.get(locators.risk.administration.controlTypes.paginationPrevious).click();
        cy.contains(locators.risk.administration.controlTypes.loading).should("not.be.visible");         
    }

    waitTillAllRowsLoad(totalRecords){
        cy.get(locators.risk.administration.controlTypes.allRows).should('have.length', totalRecords);
    }
    
    /**
     * this function will create/generate new data depending upon what object it receives and write the data back into file.
     * if it receives addData object, it will create new data for addData object.
     * if it receives updateData object, it will create new data for updateData object.
     * @param {object} fileDataDetails - object with filePath, addData and updateData properties 
     */
    updateDataInFile(fileDataDetails){
        const {filePath, addData, updateData} = fileDataDetails;
        cy.readFile(filePath).then((data) => {
            cy.createRandomString(6).then((randomString) => {
                if(addData){
                    data.addData.name = `${addData.nameText} ${randomString}`;
                    data.addData.description = `${addData.descriptionText} ${randomString}`;
                    data.addData.specialCharacters = `${addData.specialCharactersText} ${randomString}`;
                }
                if(updateData){
                    data.updateData.name = `${updateData.nameText} ${randomString}`;
                    data.updateData.description = `${updateData.descriptionText} ${randomString}`;
                    data.updateData.specialCharacters = `${updateData.specialCharactersText} ${randomString}`;
                }
                cy.writeFile(filePath, data);
            });
        });
    }
}

export default ControlTypesNoneSpace;


