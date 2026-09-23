import dayjs from "dayjs";
import { WatchDirectoryFlags } from "typescript";
import locators from "../../../fixtures/locators.json";

const filename = "cypress/fixtures/RiskModule/RiskCategoryName.json";
const filename_Share_Definition =
  "cypress/fixtures/RiskModule/Shared_Risk_Definition/_Writefile_ShareRiskCategory.json";
const filenameNoneSpace =
  "cypress/fixtures/RiskModule/NoneSpaceRiskTaxomony/_Writefile_RiskCategoryNoneSpace.json";

class RiskCategory_PO {
  clickOnMyTaxonomiesTab() {
    cy.get("#row-tabs > .nav > :nth-child(2) > .nav-link")
      .should("be.visible")
      .click();
    cy.wait(8000);
  }

  addCategoryButton() {
    cy.get(".list-inline > :nth-child(1) > .btn > :nth-child(1) > span")
      .should("be.visible")
      .click();
    cy.wait(5000);
  }

  editCategoryButton() {
    cy.xpath(
      '//*[@id="riskTaxonomiesMainGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[7]/span/div/span[1]'
    ).click();
    cy.wait(5000);
  }

  addCategoryInfo(
    riskCategoryID,
    riskName,
    description,
    withAssessmentCustomer = false
  ) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(riskCategoryID);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(timeStamp);
    cy.wait(2000);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(riskName);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(timeStamp);
    cy.wait(2000);

    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(description);
    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(timeStamp);

    cy.wait(2000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filename,
      {
        Important:
          "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer",
        riskItemSearch: riskName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);
    cy.get(locators.risk.riskRegister.addRiskCat).click();
    cy.wait(1000);
    this.writeRiskCatNameRiskRegister(
      riskName + timeStamp,
      withAssessmentCustomer
    );
  }

  childCategoryInfo(riskCategoryID, riskName, description, riskItemSearch) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(riskCategoryID);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(riskName);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(description);
    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(timeStamp);

    ///***Tree selection */

    //    cy.get(':nth-child(6) > .col-md-6').wait(5000).contains(riskItemSearch);
    cy.get(
      "#riskItemDiv > .aciTreeUl > .aciTreeLast > .aciTreeLine > .aciTreeEntry > .aciTreeItem > label > .aciTreeCheck"
    ).click();
  }

  validationCategoryInfo(riskCategoryID, riskName, description) {
    cy.get("#riskId").type(riskCategoryID);
    cy.get("#field-name").type(riskName);
    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(description);
  }

  editCategory(RiskDefinitionSearch, riskCategoryID, riskName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    //search definition and edit category
    cy.get('[aria-label="Name Filter Input"]')
      .clear()
      .type(RiskDefinitionSearch);
    cy.wait(5000);
    cy.xpath(
      '//*[@id="riskTaxonomiesMainGrid"]/div/div[2]/div[2]/div[3]/div[2]/div/div/div[1]/div[7]/span/div/span[1]'
    ).click();
    cy.wait(6000);
    cy.xpath('//*[@id="riskId"]').clear().type(riskCategoryID);
    cy.xpath('//*[@id="riskId"]').type(timeStamp);
    cy.get("#field-name").clear().type(riskName);
    cy.get("#field-name").type(timeStamp);
    cy.get(".col-md-6 > #description").clear().type(description);
    cy.get(".col-md-6 > #description").type(timeStamp);

    cy.wait(2000);
    //*****Data Write into file  ******/
    cy.writeFile(
      filename,
      {
        Important:
          "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer",
        riskItemSearch: riskName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);
  }

  savebutton() {
    cy.get("#saveBtn").click();
    cy.wait(10000);
  }

  writeRiskCatNameRiskRegister(riskCatName, withAssessmentCustomer = false) {
    cy.readFile("cypress/fixtures/RiskRegister/RiskRegister.json").then(
      (data) => {
        if (withAssessmentCustomer) {
          data.threeElipsesOptions.riskApplicability.riskCategoryWithAssessment =
            riskCatName;
        } else {
          data.threeElipsesOptions.riskApplicability.riskCategory = riskCatName;
        }
        cy.writeFile("cypress/fixtures/RiskRegister/RiskRegister.json", data);
      }
    );
  }
  
  deleteRiskCategory() {
    //search definition and edit category
    cy.wait(5000);
    cy.get(
      "#riskTaxonomiesMainGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-animation > div.ag-center-cols-clipper > div > div > div.ag-row-even.ag-row-no-focus.ag-row.ag-row-level-0.ag-row-group.ag-row-group-expanded.ag-row-position-absolute.ag-row-first > div.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.actionsCell > span > div > span:nth-child(2) > i"
    ).click();
    cy.wait(5000);
    cy.get(
      "#deleteRiskCategoryConfirm > div > div > div.modal-footer > button.btn.btn-primary"
    ).click({ force: true });
    cy.wait(10000);
  }

  threeEllipsis() {
    cy.get(":nth-child(4) > .m-dropdown > .m-dropdown__toggle > .la").click();
  }

  export() {
    cy.get('[href="#exportRiskDialog"] > :nth-child(1) > span').click();
    cy.wait(5000);
    cy.get("#exportRiskSubmit").click();
    cy.wait(10000);
  }

  import() {
    cy.get('[href="#importRiskDialog"] > :nth-child(1) > span').click();
    cy.wait(5000);
  }

  importOption() {
    //****File Path Download Folder */
    // const filepath = 'Images/test1.xlsx'
    const filepath =
      "cypress/downloads/ImportTemplate_RiskandProcessTaxonomy_Customer.xlsx";

    cy.wait(5000);
    cy.get("#importFile").click();
    cy.wait(5000);
    ///******This can be use for Fixture file */ // cy.get('input[type="file"]').attachFile(filepath)
    cy.get('input[type="file"]')
      .wait(5000)
      .selectFile(filepath, { action: "drag-drop" });
    cy.get("button").contains("Import").click();
  }

  downloadSampleFile() {
    cy.get(
      "#importRiskDialog > div > form > div > div.modal-body > div:nth-child(1) > div > div > a"
    ).click();
    cy.wait(5000);
  }

  shareRisCategoryInfo(riskCategoryID, riskName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(riskCategoryID);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(1) > .col-md-6 > #riskId"
    ).type(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(riskName);
    cy.get(
      "#manageRiskRegisterItemForm > .m-portlet__body > :nth-child(2) > .col-md-6 > #field-name"
    ).type(timeStamp);

    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(description);
    cy.get(
      "#manageRiskRegisterItemForm > div.m-portlet__body > div:nth-child(4) > div"
    ).type(timeStamp);

    cy.wait(5000);
    // //*****Data Write into file  ******/
    // cy.writeFile(filename_Share_Definition, { Important: "This Risk Item name use for Search Risk Register, Search Risk from Applicable flyer", riskItemSearch: riskName + timeStamp }, 'utf-8');
    // cy.wait(10000);
  }

  addCategoryButtonNoneSpace() {
    cy.get('[data-target="#addRiskCat-or-type-Slider"]').click();
    cy.wait(5000);
  }

  addCategoryInfoNoneSpace(riskCategoryID, riskName, description) {
    /////#### TimeStamp Define in Support/Index.js file #####//////
    const timeStamp = dayjs().format("MMM D, YYYY h:mm:ss A");
    cy.log(timeStamp);

    cy.get("#riskId").type(riskCategoryID);
    cy.get("#riskId").type(timeStamp);
    cy.wait(1000);
    cy.get(".col-md-6 > #field-name").type(riskName);
    cy.get(".col-md-6 > #field-name").type(timeStamp);
    cy.wait(1000);
    cy.get(".col-md-6 > #description").type(description);
    cy.get(".col-md-6 > #description").type(timeStamp);
    cy.wait(1000);

    //*****Data Write into file  ******/
    cy.writeFile(
      filenameNoneSpace,
      {
        Important: "Risk Category, Search Risk for Risk definition",
        RiskCategorySearch: riskName + timeStamp,
      },
      "utf-8"
    );
    cy.wait(5000);

    //*****Click on save button  ******/
    cy.get(
      locators.risk.administration.riskTaxonomies.riskCategorySaveBtn
    ).click();
    cy.wait(20000);
  }
}
export default RiskCategory_PO;
