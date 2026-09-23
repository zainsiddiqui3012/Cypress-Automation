import locators from "../../../fixtures/locators.json";
import data from "../../../fixtures/kxiManagement/AdddefinitionKxiKpitype.json";
class kxiManagements {
  //Search for KRI definition
  clickonNameColoumnKri1() {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForLoaderToDisappear("myGrid", 60000);
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.nameSearch)
        .clear()
        .type(data.kriDefinition1, { delay: 200 });
    });
  }
  //Edit KRI definition
  editDef() {
    cy.get(locators.kxi.kxiDefinition.editBtn).should("have.length", 1).click(); // Clicks the first button
  }
  //add KRI child
  addKrichild() {
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.krichild).click();
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.krichild,
        data.kriChild1
      );
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.krichild,
        data.kriChild2
      );
      cy.get("body").type("{esc}");
      cy.scrollTo("bottom");
    });
  }
  //add KRI sibling
  addKriSibling() {
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.kriSibling).click();
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.kriSibling,
        data.kriSibling1
      );
      cy.get("body").type("{esc}");
      cy.scrollTo("bottom");
    });
  }
  //Save KRI definition
  SaveKriDef() {
    cy.get(locators.kxi.kxiDefinition.saveKri, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //reload page
  reloadPage() {
    cy.reload();
  }
  //Search for KRI definition
  clickonNameColoumnKri2() {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForLoaderToDisappear("myGrid", 60000);
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.nameSearch)
        .clear()
        .type(data.kriDefinition2, { delay: 200 });
    });
  }
  //Edit KRI definition
  editDef() {
    cy.get(locators.kxi.kxiDefinition.editBtn).should("have.length", 1).click(); // Clicks the first button
  }
  //add KRI child
  addKrichild1() {
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.krichild).click();
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.krichild,
        data.kriSibling1
      );
      cy.get("body").type("{esc}");
    });
  }
  //add KRI sibling
  addKriSibling1() {
    cy.fixture("kxiManagement/AdddefinitionKxiKpitype").then((data) => {
      cy.get(locators.kxi.kxiDefinition.kriSibling).click();
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.kriSibling,
        data.kriChild1
      );
      cy.dropDownSearchAndSelect(
        locators.kxi.kxiDefinition.kriSibling,
        data.kriChild2
      );
      cy.get("body").type("{esc}");
      cy.scrollTo("bottom");
    });
  }
  //Save KRI definition
  SaveKriDef() {
    cy.get(locators.kxi.kxiDefinition.saveKri, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //cancel message
  cancelMessage() {
    cy.get(locators.kxi.kxiDefinition.cancelmessage, {
      timeout: 10000,
    }).click();
  }
  //cancel button
  cancelButton() {
    cy.get(locators.kxi.kxiDefinition.cancelButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //reload page
  reloadPage() {
    cy.reload();
  }
  //Search for KPI definition
  clickonNameColoumnKpi1() {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForLoaderToDisappear("myGrid", 60000);
    cy.get(locators.kxi.kxiDefinition.nameSearch).clear().type("KPI Def H"),
      { delay: 200 };
  }
  //Edit KPI definition
  editDef() {
    cy.get(locators.kxi.kxiDefinition.editBtn).should("have.length", 1).click(); // Clicks the first button
  }
  //add KPI child
  addKpichild1() {
    cy.get(locators.kxi.kxiDefinition.krichild).click();
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.krichild,
      data.kPiDefinition2
    );
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.krichild,
      data.kriChild1
    );
    cy.get("body").type("{esc}");
  }
  //add KPI sibling
  addKpiSibling1() {
    cy.get(locators.kxi.kxiDefinition.kriSibling).click();
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.kriSibling,
      data.kriDefinition2
    );
    cy.get("body").type("{esc}");
    cy.scrollTo("bottom");
  }
  //save KPI definition
  SaveKriDef() {
    cy.get(locators.kxi.kxiDefinition.saveKri, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //reload page
  reloadPage() {
    cy.reload();
  }
  //Search for KPI definition
  clickonNameColoumnKpi2() {
    cy.waitForTopMsgLoaderToDisappear(20000);
    cy.waitForLoaderToDisappear("myGrid", 60000);
    cy.get(locators.kxi.kxiDefinition.nameSearch).clear().type("Kpi def I"),
      { delay: 200 };
  }
  //Edit KPI definition
  editDef() {
    cy.get(locators.kxi.kxiDefinition.editBtn).should("have.length", 1).click(); // Clicks the first button
  }
  //add KPI child
  addKpichild2() {
    cy.get(locators.kxi.kxiDefinition.krichild).click();
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.krichild,
      data.kPiDefinition3
    );
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.krichild,
      data.kriDefinition2
    );
    cy.get("body").type("{esc}");
  }
  //add KPI sibling
  addKpiSibling2() {
    cy.get(locators.kxi.kxiDefinition.kriSibling).click();
    cy.dropDownSearchAndSelect(
      locators.kxi.kxiDefinition.kriSibling,
      data.kriChild1
    );
    cy.get("body").type("{esc}");
    cy.scrollTo("bottom");
  }
  //save KPI definition
  SaveKriDef() {
    cy.get(locators.kxi.kxiDefinition.saveKri, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //cancel message
  cancelMessage() {
    cy.get(locators.kxi.kxiDefinition.cancelmessage, {
      timeout: 10000,
    }).click();
  }
  //cancel button
  cancelButton() {
    cy.get(locators.kxi.kxiDefinition.cancelButton, { timeout: 10000 })
      .should("be.visible")
      .click();
  }
  //reload page
  reloadPage() {
    cy.reload();
  }
  //Add KPI and KRI definition
  KriKpi() {
    cy.visitkxiDef();
    this.clickonNameColoumnKri1();
    this.editDef();
    this.addKrichild();
    this.addKriSibling();
    this.SaveKriDef();
    cy.visitkxiDef();
    this.reloadPage();
    this.clickonNameColoumnKri2();
    this.editDef();
    this.addKrichild1();
    this.addKriSibling1();
    this.SaveKriDef();
    this.cancelMessage();
    this.cancelButton();
    this.reloadPage();
    this.clickonNameColoumnKpi1();
    this.editDef();
    this.addKpichild1();
    this.addKpiSibling1();
    this.SaveKriDef();
    this.reloadPage();
    this.clickonNameColoumnKpi2();
    this.editDef();
    this.addKpichild2();
    this.addKpiSibling2();
    this.SaveKriDef();
    this.cancelMessage();
    this.cancelButton();
    this.reloadPage();
  }
} // End of class
export default kxiManagements;