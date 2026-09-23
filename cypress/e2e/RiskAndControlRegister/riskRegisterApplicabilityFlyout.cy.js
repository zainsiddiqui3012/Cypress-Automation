/// <reference types="../../support" />

import dataRiskApplicability from "../../fixtures/RiskAndControlRegister/riskRegisterApplicabilityFlyout.json";
import locators from "../../fixtures/locators.json";
const riskAppetiteFixtureFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";
import riskAppetite from "../../fixtures/RiskAndControlRegister/RiskAppetite/riskAppetite.json";

import RiskAndControlRegister from "../../support/POM/RiskAndControlRegister/riskAndControlRegister";
import OrganizationalHierarchy from "../../support/POM/Administration/OrganizationHierarchy";
import { RR_ApplicabilityFlyout } from "../../support/POM/RiskAndControlRegister/RiskRegisterApplicabilityFlyout_PO";

const username = Cypress.env("username");

const dataFilePath =
  "cypress/fixtures/RiskAndControlRegister/riskRegisterApplicabilityFlyout.json";

describe("Inactive Risk appearing on Risk Applicability flyout as Applicable", () => {
  const riskAndControlRegister = new RiskAndControlRegister();
  const organizationalHierarchy = new OrganizationalHierarchy();
  const rr_ApplicabilityFlyout = new RR_ApplicabilityFlyout();

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.session("login session of user: " + username, () => {
      cy.visit(Cypress.config("baseUrl"));
      cy.login(username, Cypress.env("password"), Cypress.env("key"));
    });
    // cy.saveSessionState();
  });

  it("Create Pre-Requisites - Add Risk Category, Risk Definition and Business Unit", () => {
    riskAndControlRegister.navigateToTaxnomyAndAddRiskCategory(
      riskAppetite.riskAppetite
    );

    riskAndControlRegister.navigateToTaxonomyAndAddRiskDefinition(
      riskAppetite.riskAppetite
    );

    cy.visitOrganizationalHierarchy();

    organizationalHierarchy.clickAddBtn();

    organizationalHierarchy.fillAndSubmitAddBUForm();

    organizationalHierarchy.setBU();
  });

  it("Validate that if user mark a risk definition as applicable then its applicability should be appear at risk applicability flyout.", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();
  });

  // Skipping it because active/inactive functionality is removed and now applicability field handles active/inactive functionality
  it.skip("Validate that if an applicable risk register is marked as inactive then those records applicability should not appear at risk applicability flyout at risk register page.", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.waitForMyGridLoaderToDisappear(60000);

    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      rr_ApplicabilityFlyout.searchRiskDefinition_AF(
        file.riskCategory.categoryName
      );
    });

    rr_ApplicabilityFlyout.scrollHorizontallyToBottomRight();

    riskAndControlRegister.clickDetailsRiskInstance();

    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      riskAndControlRegister.typeRiskName_EditRiskInstance(
        file.riskCategory.categoryName
      );
    });

    riskAndControlRegister.selectStatus_EditRiskInstance("Inactive");

    riskAndControlRegister.clickSaveBtn_EditInstance();

    cy.waitForMyGridLoaderToDisappear(60000);

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_NotExist();
  });

  // Skipping it because active/inactive functionality is removed and now applicability field handles active/inactive functionality
  it.skip("Validate that user can again mark those risk definitions as applicable with same BU which was previously marked as inactive.", () => {
    cy.query(dataRiskApplicability.query.selectDefinitionRiskRegister).then(
      (res) => {
        const name = res[0].name;

        cy.readFile(dataFilePath).then((file) => {
          file.riskRegisterID_previous = res[0].id;

          cy.writeFile(dataFilePath, file);
        });

        cy.visit(Cypress.config("baseUrl"));
        cy.login(
          Cypress.env("username"),
          Cypress.env("password"),
          Cypress.env("key")
        );

        cy.clickSubMenuItem("Risk and Control Register", "Risk Register");

        cy.waitForMyGridLoaderToDisappear(60000);

        cy.get(locators.risk.riskRegister.ellipsesBtn).click();

        rr_ApplicabilityFlyout.clickRiskApplicabilityItem();

        cy.waitForApplicabilityLoaderToDisappear(40000);

        rr_ApplicabilityFlyout.selectBU_AF(dataRiskApplicability.buFor20020);

        rr_ApplicabilityFlyout.searchRiskDefinition_AF(name);

        cy.wait(1500);

        rr_ApplicabilityFlyout.clickApplicableCheckbox_AF();

        rr_ApplicabilityFlyout.clickSaveBtn_AF();

        rr_ApplicabilityFlyout.clickSaveAndCloseBtn_AF();
        cy.wait(2000);
      }
    );
  });

  it("Validate that the risk register db id for above mentioned(AP-506) records must be different if user mark it as applicable again.", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();

    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      cy.query(
        dataRiskApplicability.query.predictuser.pre +
        username +
        dataRiskApplicability.query.predictuser.post
      ).then((result) => {
        cy.query(
          dataRiskApplicability.query.createdBy.pre +
          file.riskCategory.categoryName +
          dataRiskApplicability.query.createdBy.mid +
          result[0].id +
          dataRiskApplicability.query.createdBy.post
        ).then((secondResult) => {
          cy.log(secondResult);
          expect(secondResult[0].createdBy).to.eq(Cypress.env("USER_ID"));
          cy.visitRiskRegister();
          rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

          cy.query(
            dataRiskApplicability.query.createdBy.pre +
            file.riskCategory.categoryName +
            dataRiskApplicability.query.createdBy.mid +
            result[0].id +
            dataRiskApplicability.query.createdBy.post
          ).then((thridResult) => {
            cy.log(thridResult);
            expect(thridResult[0].createdBy).to.eq(Cypress.env("USER_ID"));
          });
        });
      });
    });
  });

  it("Validate that user can again mark those risk definitions as applicable with different BUs which was previously marked as inactive.", () => {
    cy.visitOrganizationalHierarchy();

    organizationalHierarchy.clickAddBtn();

    organizationalHierarchy.fillAndSubmitAddBUForm(true);

    organizationalHierarchy.setBU(true);

    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable(true);

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef(true);

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();
  });

  it("Validate that the risk register db id for above mentioned records must be different if user mark it as applicable again for different BUs.", () => {
    // Mark the definition with first BU
    rr_ApplicabilityFlyout.markDefApplicableWithBU();

    // Mark the definition with second BU
    rr_ApplicabilityFlyout.markDefApplicableWithBU(true);

    // This will verify the id from database
    rr_ApplicabilityFlyout.verifyRegisterIdWithDiffBU(
      dataRiskApplicability,
      username
    );
  });

  it("Validate that if user mark the record as applicable for those records which was previously as applicable and inactive then user can update it as 'Not applicable'", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefNotApplicable();
  });

  it("Validate that user can again mark the above record as applicable - Not applicable", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();
  });

  it("Validate that if user mark the record as applicable for those records which was previously as applicable and inactive then user can update it as 'Defer'", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefDefer();
  });

  it("Validate that user can again mark the above record as applicable - Defer", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();
  });

  it("Validate that if user mark the record as applicable for those records which was previously as applicable and inactive then user can update it as 'Emerging'", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefEmerging();
  });

  it("Validate that user can again mark the above record as applicable - Emerging", () => {
    cy.visitRiskRegister();

    rr_ApplicabilityFlyout.selectBUAndMarkDefApplicable();

    cy.reload();

    rr_ApplicabilityFlyout.selectBUAndSearchDef();

    rr_ApplicabilityFlyout.verifyDefinitionApplicableCheckBox_Visible();
  });

  // Skipping it because active/inactive functionality is removed and now applicability field handles active/inactive functionality
  it.skip("Validate that if user mark a risk definition as inactive then in db modified by should be updated.", () => {
    cy.query(
      dataRiskApplicability.query.selectRiskRegisterItemApplicable_BU
    ).then((res) => {
      const modifiedBy = res[0].modifiedBy;
      const modifiedOn = res[0].modifiedOn;

      cy.readFile(dataFilePath).then((file) => {
        const automationUser = file.modifiedBy;

        expect(modifiedBy).eq(automationUser);
      });
    });
  });
});
