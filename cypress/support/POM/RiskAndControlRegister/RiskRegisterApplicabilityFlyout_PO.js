import locators from "../../../fixtures/locators.json";
const orgDataFilePath =
  "cypress/fixtures/Administration/organizationalHierarchy.json";
const riskAppetiteFixtureFilePath =
  "cypress/fixtures/RiskAndControlRegister/RiskAppetite/writeRiskAppetite.json";

export class RR_ApplicabilityFlyout {
  buDropDownSelector = "#s2id_buIdsGrmTaxonomy";

  elements = {
    ellipsesBtn: () => cy.get(".list-inline-item:last-child"),
    riskApplicabilityItem: () => cy.get("#riskTaxonomyBtn"),
    riskSearchInput: () =>
      cy.get(
        "#myGrid [ref='ePinnedLeftHeader'] [aria-label='Risk Filter Input']"
      ),
    scrollHorizontal: () =>
      cy.get("#myGrid .ag-body-horizontal-scroll-viewport"),
    selectBUWrap: () => cy.get("#buSelectWrap"),
    selectAllBU: () =>
      cy.get(".pq-select-popup-cont[style*='display: block'] .pq-select-all"),
    buInput: () =>
      cy.get(
        ".pq-select-popup-cont[style*='display: block'] .pq-select-search-input"
      ),
    applicabilityFlyout: {
      buDropDown: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(this.buDropDownSelector, { timeout: 15000 }),
      riskSearchInput: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find("#agGrid-taxonomy [aria-label='Risk Item Filter Input']", {
            timeout: 20000,
          }),
      applicableCheckBoxFirst: () =>
        cy
          .iframe("#riskTaxonomyApplicabilityFrame")
          .find(
            "div#agGrid-taxonomy [ref='eBodyViewport'] [ref='eCenterColsClipper'] [row-index='1'] [col-id='applicability'] span"
          ),
      applicableCheckBoxValue: () =>
        cy
          .iframe("#riskTaxonomyApplicabilityFrame")
          .find(
            "div#agGrid-taxonomy [ref='eBodyViewport'] [ref='eCenterColsClipper'] [row-index='1'] [col-id='applicability'] span::after"
          ),
      deferRadioBtn: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(
            "#agGrid-taxonomy [ref='eBodyViewport'] [col-id='applicability_1'] input"
          )
          .eq(1),
      notApplicableRadioBtn: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(
            "#agGrid-taxonomy [ref='eBodyViewport'] [col-id='applicability_2'] input"
          )
          .eq(1),
      emergingRadioBtn: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(
            "#agGrid-taxonomy [ref='eBodyViewport'] [col-id='applicability_3'] input"
          )
          .eq(1),
      selectBU: (nameOfBU) =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find("#s2id_autogen1_search"),
      // .contains("ul div", nameOfBU),
      saveBtn: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(".riskTaxonomySaveBtn"),
      saveAndCloseBtn: () =>
        cy
          .switchToIframe("#riskTaxonomyApplicabilityFrame")
          .find(".m-portlet__foot li .btn-success"),
    },
  };

  /**
   * clickEllipsesBtn will click on the ellipses button on the top right of Risk Register
   */
  clickEllipsesBtn() {
    this.elements.ellipsesBtn().click();
  }

  /**
   * clickRiskApplicabilityItem will click on the Risk Applicability Menu item
   */
  clickRiskApplicabilityItem() {
    this.elements.riskApplicabilityItem().should("be.visible").click();
  }

  /**
   * typeRiskDefinition will type the definition text provided as parameter
   * in the search field of Risk on Risk register page
   * @param {string} definition definition text to be typed in the field
   */
  typeRiskDefinition(definition) {
    cy.wait(1000);
    this.elements.riskSearchInput().clear().type(definition);
  }

  clickBUDropDown() {
    this.elements.applicabilityFlyout.buDropDown().click();
  }

  searchRiskDefinition_AF(definition) {
    this.elements.applicabilityFlyout
      .riskSearchInput()
      .clear({ force: true })
      .wait(3000)
      .type("{selectall}{backspace}", { force: true, delay: 250 })
      .clear()
      .should("have.value", "")
      .type(definition, { force: true, delay: 50 })
      .wait(1000);
  }

  selectBU_AF(nameOfBU) {
    cy.wait(1500);
    this.clickBUDropDown();
    cy.log(nameOfBU);
    this.elements.applicabilityFlyout
      .selectBU(nameOfBU)
      .type(nameOfBU)
      .type("{enter}");
  }

  clickApplicableCheckbox_AF() {
    this.elements.applicabilityFlyout
      .applicableCheckBoxFirst()
      .wait(1000)
      .click({ force: true });
  }

  clickDeferCheckbox_AF() {
    this.elements.applicabilityFlyout
      .deferRadioBtn()
      .wait(1000)
      .click({ force: true });
  }

  clickNotApplicableCheckbox_AF() {
    this.elements.applicabilityFlyout
      .notApplicableRadioBtn()
      .wait(1000)
      .click({ force: true });
  }

  clickEmergingCheckbox_AF() {
    this.elements.applicabilityFlyout
      .emergingRadioBtn()
      .wait(1000)
      .click({ force: true });
  }

  scrollHorizontallyToBottomRight() {
    this.elements.scrollHorizontal().wait(2000).scrollTo("bottomRight");
  }

  clickSelectBUWrap() {
    this.elements.selectBUWrap().click();
  }

  clickSelectAllBU(buName) {
    this.elements.buInput().type(buName).wait(500);
    this.elements.selectAllBU().click();
  }

  clickSaveBtn_AF() {
    this.elements.applicabilityFlyout.saveBtn().click({ force: true });
  }

  clickSaveAndCloseBtn_AF() {
    this.elements.applicabilityFlyout.saveAndCloseBtn().click({ force: true });
  }

  selectBUAndMarkDefApplicable(isNewBU = false) {
    this.selectBUAndSearchDef(isNewBU);
    cy.wait(1500);

    this.clickApplicableCheckbox_AF();

    this.clickSaveBtn_AF();

    this.clickSaveAndCloseBtn_AF();
    cy.wait(2000);
  }

  selectBUAndMarkDefNotApplicable(isNewBU = false) {
    this.selectBUAndSearchDef(isNewBU);
    cy.wait(1500);

    this.clickNotApplicableCheckbox_AF();

    this.clickSaveBtn_AF();

    this.clickSaveAndCloseBtn_AF();
    cy.wait(2000);
  }

  selectBUAndMarkDefDefer(isNewBU = false) {
    this.selectBUAndSearchDef(isNewBU);
    cy.wait(1500);

    this.clickDeferCheckbox_AF();

    this.clickSaveBtn_AF();

    this.clickSaveAndCloseBtn_AF();
    cy.wait(2000);
  }

  selectBUAndMarkDefEmerging(isNewBU = false) {
    this.selectBUAndSearchDef(isNewBU);
    cy.wait(1500);

    this.clickEmergingCheckbox_AF();

    this.clickSaveBtn_AF();

    this.clickSaveAndCloseBtn_AF();
    cy.wait(2000);
  }

  selectBUAndSearchDef(isNewBU = false) {
    cy.waitForMyGridLoaderToDisappear(60000);

    cy.get(locators.risk.riskRegister.ellipsesBtn).click();

    this.clickRiskApplicabilityItem();

    cy.waitForOverlayLoaderToDisappear(60000);
    cy.waitForApplicabilityLoaderToDisappear(40000);

    cy.readFile(orgDataFilePath).then((orgData) => {
      const bu = isNewBU ? orgData.newName : orgData.name;
      this.selectBU_AF(bu);
    });

    cy.waitForApplicabilityLoaderToDisappear(40000);
    cy.waitForOverlayLoaderToDisappear(40000);

    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      this.searchRiskDefinition_AF(file.riskCategory.categoryName);
    });
  }

  verifyDefinitionApplicableCheckBox_NotExist() {
    this.elements.applicabilityFlyout.applicableCheckBoxFirst().then(($el) => {
      const win = $el[0].ownerDocument.defaultView;
      const after = win.getComputedStyle($el[0], "::after");
      expect(after).to.exist;
    });
  }

  verifyDefinitionApplicableCheckBox_Visible() {
    this.elements.applicabilityFlyout.applicableCheckBoxFirst().then(($el) => {
      const win = $el[0].ownerDocument.defaultView;
      const after = win.getComputedStyle($el[0], "::after");
      expect(after).to.exist;
    });
  }

  markDefApplicableWithBU(isNewBU = false) {
    cy.visitRiskRegister();

    this.selectBUAndMarkDefApplicable(isNewBU);

    cy.reload();

    this.selectBUAndSearchDef(isNewBU);

    this.verifyDefinitionApplicableCheckBox_Visible();
  }

  verifyRegisterIdWithDiffBU(dataRiskApplicability, username) {
    cy.readFile(riskAppetiteFixtureFilePath).then((file) => {
      cy.query(
        dataRiskApplicability.query.predictuser.pre +
        username +
        dataRiskApplicability.query.predictuser.post
      ).then((result) => {
        cy.readFile(orgDataFilePath).then((orgData) => {
          const rria = dataRiskApplicability.query.riskregisteritemapplicablity;
          const firstQuery =
            rria.first.pre +
            result[0].customerId +
            rria.first.mid +
            orgData.name +
            rria.first.post;
          // This query will query facility table using customerId and BU name
          // and get facilityid
          cy.query(firstQuery).then((first) => {
            const secondQuery =
              rria.second.pre +
              file.riskDefinition.definitionName +
              rria.second.mid +
              result[0].customerId +
              rria.second.post;
            // This query will query riskregisteritem table using definition name and customerId
            // and get riskregisteritem id
            cy.query(secondQuery).then((second) => {
              const thirdQuery =
                rria.third.pre +
                first[0].id +
                rria.third.mid +
                second[0].id +
                rria.third.post;
              // This query will query riskregisteritemapplicablity table using bufacilityId from first query and riskregisteritem.id from second query
              cy.query(thirdQuery).then((third) => {
                const facilityQuery =
                  rria.first.pre +
                  result[0].customerId +
                  rria.first.mid +
                  orgData.newName +
                  rria.first.post;
                // This query will query facility table using customerId and new BU name
                // and get new facilityid
                cy.query(facilityQuery).then((facility) => {
                  const rriaQuery =
                    rria.third.pre +
                    facility[0].id +
                    rria.third.mid +
                    second[0].id +
                    rria.third.post;
                  cy.query(rriaQuery).then((finalResult) => {
                    expect(finalResult[0].id).to.not.eq(third[0].id);
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}
