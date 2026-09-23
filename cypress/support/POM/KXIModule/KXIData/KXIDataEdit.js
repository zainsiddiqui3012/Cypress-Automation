import locators from "../../../../fixtures/locators.json";
const kxiData = locators.kxi.kxiData;
const kxiDataGrid = kxiData.grid;
import KXIGlobalManager from "../../../../support/POM/KXIModule/KXIGlobalManager.js";
const kxiglobalManager = new KXIGlobalManager();

import KXI_POM from "../KxI_POM.js";
const kxiPOM = new KXI_POM();

import data from "../../../../fixtures/KXIModule/KXIData/KXIDataEdit.json";
const writeDataFilePath = "cypress/fixtures/KXIModule/KXITaskWrite.json";

class KXIDataEdit {
  addKXIDefinition_KXIDataEdit(userName, decision = false) {
    const def = data.kxiDefinition;

    cy.visitkxiDef();

    kxiPOM.addKxiDefinition(
      def.kxiValue,
      def.Left1,
      def.Left2,
      def.Left3,
      def.Right1,
      def.Right2,
      def.Right3,
      userName,
      null,
      false,
      false,
      false,
      null,
      null,
      decision
    );
  }

  addKXIData_KXIDataEdit() {
    cy.readFile(writeDataFilePath).then((file) => {
      const kxiName = file.kxiName;
      kxiPOM.addKxiData(kxiName, data.kxiDefinition.kxiValue);
    });
  }

  clearNameInput() {
    cy.get(kxiDataGrid.nameInput,{timeout:100000}).wait(500).clear({ force: true }).wait(500);
  }

  verifyEditBtnAgainstDef() {
    cy.wait(500)
      .get(kxiDataGrid.actionsRows, { timeout: 50000 })
      .should("be.visible")
      .each((row, index, rowList) => {
        cy.wrap(row)
          .scrollIntoView()
          .find(kxiDataGrid.editBtn, { timeout: 50000 })
          .should("be.visible");
      });
  }

  clickEditBtn(defName) {}
}
export default KXIDataEdit;
