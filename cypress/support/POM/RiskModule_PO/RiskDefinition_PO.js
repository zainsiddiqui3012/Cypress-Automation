import dayjs from "dayjs";
import { WatchDirectoryFlags } from "typescript";
import locators from "../../../fixtures/locators.json";
const filename = "cypress/fixtures/RiskModule/RiskDefintionName.json";
const filename_Share_Definition =
  "cypress/fixtures/RiskModule/Shared_Risk_Definition/_Writefile_ShareRiskDefinition.json";
const filenameNoneSpace =
  "cypress/fixtures/RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskDefinitionNoneSpace.json";
const filenameNoneSpaceUncategorized =
  "cypress/fixtures/RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskDefinitionNoneSpaceUncategorized.json";
const filename2 = "cypress/fixtures/RiskModule/RiskCategoryName.json";

Cypress.Commands.add("RiskCategory", () => {
  return cy.readFile(filename2).then((data) => {
    // Return the RecommendedControlsDefintion from the JSON file
    return data.riskItemSearch;
  });
});

class RiskDefinition_PO {
  addDefinitionButton() {
    cy.get('[data-target="#addRiskSlider"] > :nth-child(1) > span')
      .should("be.visible")
      .click();
    cy.wait(8000);
  }

  addDefinitionInfo(
    riskDefinitionId,
    definitionName,
    description,
    withAssessmentCustomer = false
  ) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(".col-md-7 > #riskId").type(riskDefinitionId);
    cy.get(".col-md-7 > #riskId").type(timeStamp);

    cy.get(".col-md-7 > #field-name").type(definitionName);
    cy.get(".col-md-7 > #field-name").type(timeStamp);

    cy.get("#cke_1_contents > .cke_wysiwyg_frame").type(description);
    cy.get("#cke_1_contents > .cke_wysiwyg_frame").type(timeStamp);

    cy.wait(6000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filename,
      {
        Important:
          "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer",
        RiskDefinitionSearch: definitionName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);

    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    this.writeRiskDefNameRiskRegister(
      definitionName + timeStamp,
      withAssessmentCustomer
    );
  }

  validationDefinitionInfo(riskDefinitionId, definitionName, description) {
    cy.get(".col-md-7 > #riskId").type(riskDefinitionId);
    cy.get(".col-md-7 > #field-name").type(definitionName);
    cy.get(".cke_wysiwyg_frame").type(description);
  }

  editDefintion(riskDefinitionId, definitionName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#riskId").clear().type(riskDefinitionId);
    cy.get("#riskId").type(timeStamp);
    cy.wait(2000);

    cy.get(".col-md-6 > #field-name").clear().type(definitionName);
    cy.get(".col-md-6 > #field-name").type(timeStamp);
    cy.wait(5000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filename,
      {
        Important:
          "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer",
        RiskDefinitionSearch: definitionName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);

    // cy.get('.cke_wysiwyg_frame').clear().type(description);
    // cy.get('.cke_wysiwyg_frame').type(timeStamp);
  }

  shareDefinition(riskDefinitionId, definitionName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(".col-md-7 > #riskId").type(riskDefinitionId);
    cy.get(".col-md-7 > #riskId").type(timeStamp);

    cy.get(".col-md-7 > #field-name").type(definitionName);
    cy.get(".col-md-7 > #field-name").type(timeStamp);

    cy.get("#cke_1_contents > .cke_wysiwyg_frame").type(description);
    cy.get("#cke_1_contents > .cke_wysiwyg_frame").type(timeStamp);

    cy.wait(5000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filename_Share_Definition,
      {
        Important:
          "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer",
        RiskDefinitionSearch: definitionName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(6000);
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(3000);
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > :nth-child(2) > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(3000);
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > :nth-child(3) > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(3000);
    ///***Tree selection */
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > :nth-child(4) > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.wait(3000);
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > :nth-child(5) > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
  }

  savebutton() {
    cy.get("#addRiskSlider > div > div > div.m-portlet__body > div > div")
      .contains("Save")
      .click();
    cy.wait(10000);
  }

  writeRiskDefNameRiskRegister(riskDefName, withAssessmentCustomer = false) {
    cy.readFile(
      "cypress/fixtures/RiskRegister/RiskRegister.json"
    ).then((data) => {
      if (withAssessmentCustomer) {
        data.threeElipsesOptions.riskApplicability.riskDefinitionWithAssessment =
          riskDefName;
      } else {
        data.threeElipsesOptions.riskApplicability.riskDefinition = riskDefName;
      }
      cy.writeFile(
        "cypress/fixtures/RiskRegister/RiskRegister.json",
        data
      );
    });
  }

  deleteRiskDefintion(RiskDefinitionSearch, riskItemSearch) {
    //serach definition and edit category
    cy.get('[aria-label="Name Filter Input"]')
      .clear()
      .type(RiskDefinitionSearch);
    cy.wait(5000);
    cy.get(".ag-group-value > span").dblclick().wait(3000).type("{end}");
    cy.wait(5000);
    cy.xpath(
      '//*[@id="riskTaxonomiesMainGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[2]/div[7]/span/div/span[2]/i'
    ).click();
    cy.get(
      "#deleteRiskCategoryConfirm > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
    )
      .click()
      .wait(2000);
    cy.get('[aria-label="Name Filter Input"]').clear();
    // cy.get('#riskTaxonomiesMainGrid').contains(riskItemSearch).type('{enter}');
  }

  addDefinitionButtonNoneSpace() {
    cy.get('[data-target="#addRiskSlider"] > :nth-child(1) > span').click();
    cy.wait(5000);
  }

  addDefinitionInfoNoneSpace(
    riskDefinitionId,
    definitionName,
    description,
    BusinessAreaDefinition
  ) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#riskId1").type(riskDefinitionId);
    cy.get("#riskId1").type(timeStamp);

    cy.get(".col-md-7 > #field-name").type(definitionName);
    cy.get(".col-md-7 > #field-name").type(timeStamp);

    cy.get(".cke_wysiwyg_frame").type(description);
    cy.get(".cke_wysiwyg_frame").type(timeStamp);
    cy.get(".pq-select-text").click();
    cy.get(".pq-select-search-input")
      .type(BusinessAreaDefinition, { force: true })
      .wait(2000)
      .type("{enter}", { force: true });
    // cy.get('#cke_1_contents > iframe').click();
    cy.wait(10000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filenameNoneSpace,
      {
        Important: "Risk Definition Add",
        RiskDefinitionSearch: definitionName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(10000);
    ///***Tree selection */
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click({ force: true });
    cy.wait(5000);
    cy.get("#saveBtn").click();
    cy.wait(8000);
  }

  addDefinitionInfoNoneSpaceWithBA(
    riskDefinitionId,
    definitionName,
    description
  ) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#riskId1").type(riskDefinitionId);
    cy.get("#riskId1").type(timeStamp);

    cy.get(".col-md-7 > #field-name").type(definitionName);
    cy.get(".col-md-7 > #field-name").type(timeStamp);

    cy.get(".cke_wysiwyg_frame").type(description);
    cy.get(".cke_wysiwyg_frame").type(timeStamp);

    cy.wait(5000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filenameNoneSpaceUncategorized,
      {
        Important: "Risk Definition Add without Business Area",
        RiskDefinitionSearchUncategorized: definitionName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);
    ///***Tree selection */
    cy.get(
      "#riskRegisterItemDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
    cy.get(
      locators.risk.administration.riskTaxonomies.riskDefinitionSaveBtn
    ).click();
    cy.wait(8000);
  }

  riskDefinitionEditbtn() {
    cy.get(
      "#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row-odd.ag-row-no-focus.ag-row.ag-row-level-1.ag-row-group.ag-row-group-contracted.ag-row-position-absolute.ag-row-last > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell > span > div > span:nth-child(1) > i"
    ).click();
    cy.wait(5000);
  }

  riskDefinitionEditScreen() {
    cy.get("#contentLibraryName").should("be.empty");
    cy.wait(5000);
  }

  deleteControlDefinitinAggrid() {
    cy.get(
      ".ag-details-grid-fixed-height > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-viewport > .ag-center-cols-clipper > .ag-center-cols-viewport > .ag-center-cols-container > .ag-row-odd > .actionsCell > :nth-child(1) > .d-inline-block > .btn"
    ).click();
    cy.wait(5000);
    cy.get(
      "#deleteRecomendedControlConfirmModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
    ).click();
    cy.wait(5000);
    cy.get(".toast").contains("Recommended control deleted successfully.");
  }
}
export default RiskDefinition_PO;
