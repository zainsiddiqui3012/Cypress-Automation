import dayjs from "dayjs";
import { WatchDirectoryFlags } from "typescript";

class Start_RCSA_PO {
  startrcsaflyer() {
    cy.get("a:contains(Start RCSA Review)").click();
    cy.wait(10000);
  }

  assertmodalTitle() {
    cy.get(
      "div.modal-dialog.modal-xl h5.modal-title:contains('Start RCSA Review')"
    );
  }

  assertmodalclosebtnfunctionality() {
    cy.get("div.modal-dialog.modal-xl button#noBtn").click();
    // Assert that the modal is not visible
    cy.get(
      "div.modal-dialog.modal-xl h5.modal-title:contains('Start RCSA Review')"
    ).should("not.be.visible");
  }
  assertmodalclearbtnfunctionality() {
    cy.get("#riskReviewForm input[name='dueDate']").type("2023-01-01");
    // Click the Clear button
    cy.get("a[onclick='javascript:clearRcsaForm();']").click();
    // Assert that the form inputs are cleared
    cy.get("#riskReviewForm input[name='dueDate']").should("have.value", "");
  }
  selectdatefrombothinputfield() {
    const timeStamp = dayjs().format("MMM D, YYYY");
    cy.log(timeStamp);
    cy.get("#riskReviewForm input[name='dueDate']").type(timeStamp);
  }

  assertduedatebyselectingolddate() {
    cy.get("a[onclick='javascript:clearRcsaForm();']").click();
    // Assert that the form inputs are cleared
    cy.get("#riskReviewForm input[name='dueDate']").should("have.value", "");
    cy.get("#dueDate")
      .click()
      .then(() => {
        // Choose a date from the date picker
        cy.get(".datepicker .day:not(.old)").first().click();
        // Assert that the form inputs are cleared
        cy.get("#riskReviewForm input[name='dueDate']").should(
          "have.value",
          ""
        );
      });
  }

  BusinessUnit_MultiSelect(BusinessUnit01, BusinessUnit02) {
    cy.get("#buIds")
    .select([BusinessUnit01, BusinessUnit02], { force: true });
  }

  BusinessArea_MultiSelect(BusinessArea01, BusinessArea02) {
    cy.wait(5000);
    cy.get("div[name='baSelectElem_risk-rcsa']").scrollIntoView().click();
    cy.get('*[class^="pq-select-option-label ui-state-enable pq-state-hover"]')
      .contains(BusinessArea01)
      .click();
    cy.get(5000);
    cy.contains(".pq-select-option-label", BusinessArea02)
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .click();
    cy.get("div[name='baSelectElem_risk-rcsa']").click();
  }

  BusinessAreaDef_MultiSelect(BusinessAreadef01, BusinessAreadef02) {
    cy.wait(5000);
    cy.get("div[name='baDefSelectElem_risk-rcsa']").scrollIntoView().click();
    cy.get('*[class^="pq-select-option-label ui-state-enable pq-state-hover"]')
      .contains(BusinessAreadef01)
      .scrollIntoView()
      .click();
    cy.wait(5000);
    cy.get("#pq-option-34-1")
      .contains(BusinessAreadef02)
      .should("be.visible")
      .click();
    cy.wait(5000);
    cy.get("div[name='baDefSelectElem_risk-rcsa']").click();
  }

  BusinessAreaDef_MultiSelectRD(
    BusinessAreaDefinationRD01,
    BusinessAreaDefinationRD02
  ) {
    cy.get("#yesBtn").scrollIntoView();
    cy.wait(5000);
    cy.get("div[name='baDefSelectElem_risk-rcsa-risk-defs']").click();
    cy.get('*[class^="pq-select-option-label ui-state-enable pq-state-hover"]')
      .contains(BusinessAreaDefinationRD01)
      .should("be.visible")
      .click();
    cy.wait(5000);
    cy.get("#pq-option-35-1")
      .contains(BusinessAreaDefinationRD02)
      .should("be.visible")
      .click();
    cy.wait(5000);
    cy.get("div[name='baDefSelectElem_risk-rcsa-risk-defs']").click();
  }

  RCSA_Popup_Save_btn() {
    let newTabUrl;

    cy.window().then((win) => {
      // Store the initial window object
      const initialWindow = win;

      // Click the "Save" button
      cy.get("#yesBtn").click();

      cy.wait(50000);

      cy.go("back");
    });
  }

  AssertSucessToastMessage() {
    cy.get(3000);
    cy.get(".toast-message")
      .contains("Risk Review successfully created")
      .should("be.visible");
    cy.wait(10000);
    cy.go("back");
  }

  ClickOnAdvanceSearch() {
    cy.wait(30000);
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe").find("#search_links_filter_link").click();
    cy.wait(20000);
  }

  //Parent Ticket Cases

  selectParentTicket() {
    cy.wait(15000);
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find(".issue-list li:nth-child(3)")
      .should("exist")
      .click();
  }

  ParentAndChildTicketValidation(
    Summary,
    AssertBusinessUnit01,
    AssertBusinessUnit02,
    RCSAReviewAuditLogLinkVerification,
    ReviewBusinessUnitRisksLinkVerification,
    SubTasks01,
    SubTasks02,
    Assignee,
    Reporter,
    InitialProgress
  ) {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find("#summary-val")
      .contains(Summary)
      .should("be.visible");
    cy.get("@iframe")
      .find(".confluenceTable > tbody >  tr > td.confluenceTd")
      .first()
      .contains(AssertBusinessUnit01)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find(".confluenceTable > tbody >  tr > td.confluenceTd")
      .last()
      .contains(AssertBusinessUnit02)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("#description-val > div.user-content-block > p > a")
      .first()
      .contains(RCSAReviewAuditLogLinkVerification)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find("#description-val > div.user-content-block > p > a")
      .last()
      .contains(ReviewBusinessUnitRisksLinkVerification)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("table#issuetable > tbody.ui-sortable > tr > td:nth-child(2) > a")
      .first()
      .contains(SubTasks01)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find("table#issuetable > tbody.ui-sortable > tr > td:nth-child(2) > a")
      .last()
      .contains(SubTasks02)
      .should("be.visible");

    cy.get("@iframe")
      .find("#assignee-val")
      .contains(Assignee)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find("#reporter-val")
      .contains(Reporter)
      .should("be.visible");
    cy.wait(5000);

    cy.get("@iframe")
      .find("#customfield_22011-val")
      .contains(InitialProgress)
      .should("be.visible");
  }

  //First Child Task Cases

  SelectFirstChildTicket() {
    cy.wait(20000);
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find(".issue-list li:nth-child(2)")
      .should("exist")
      .click();
  }

  FirstChildTicketValidation(
    FirstChildSummary,
    AssertBusinessUnit01,
    ReviewBusinessUnitRisksLinkVerification,
    Assignee,
    Reporter,
    initialProgress
  ) {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find("#summary-val")
      .contains(FirstChildSummary)
      .should("be.visible");
    cy.get("@iframe")
      .find("#customfield_18103-val")
      .first()
      .contains(AssertBusinessUnit01)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("#description-val > div.user-content-block > p > a")
      .contains(ReviewBusinessUnitRisksLinkVerification)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("#assignee-val")
      .contains(Assignee)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find("#reporter-val")
      .contains(Reporter)
      .should("be.visible");
    cy.wait(5000);
  }

  //Second Child Task Cases

  SelectSecondChildTicket() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find(".issue-list li:nth-child(1)")
      .should("exist")
      .click();
  }

  SecondChildTicketValidation(
    SecondChildSummary,
    AssertBusinessUnit02,
    ReviewBusinessUnitRisksLinkVerification,
    Assignee,
    Reporter,
    initialProgress
  ) {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find("#summary-val")
      .contains(SecondChildSummary)
      .should("be.visible");
    cy.get("@iframe")
      .find("#customfield_18103-val")
      .first()
      .contains(AssertBusinessUnit02)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("#description-val > div.user-content-block > p > a")
      .contains(ReviewBusinessUnitRisksLinkVerification)
      .should("be.visible");

    cy.wait(5000);
    cy.get("@iframe")
      .find("#assignee-val")
      .contains(Assignee)
      .should("be.visible");
    cy.wait(5000);
    cy.get("@iframe")
      .find("#reporter-val")
      .contains(Reporter)
      .should("be.visible");
    cy.wait(5000);

    cy.get("@iframe")
      .find("#customfield_21800-val")
      .contains(initialProgress)
      .should("be.visible");
  }

  ValidateRiskSelectionCriteria(ValidateRiskSelectionCriteria) {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });
    cy.wait(5000);
    cy.get("@iframe")
      .find("#customfield_24100-val")
      .contains(ValidateRiskSelectionCriteria)
      .should("be.visible");
  }

  GetNthChildTicket(index) {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");
      cy.wrap(body).as("iframe");
    });

    cy.log("index");

    cy.get("@iframe")
      .find(".issue-list li:nth-child(${index})")
      .should("exist")
      .click();
  }

  MarkReviewOnParentANDChildTicket() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");

      // Use cy.wrap inside cy.then to ensure proper synchronization
      cy.wrap(body)
        .as("iframe")
        .then(() => {
          // Wait for the iframe content to load
          cy.wait(5000);

          cy.get("@iframe")
            .find("#description-val > div.user-content-block > p > a")
            .last()
            .invoke("attr", "href")
            .then((href) => {
              // Now you can use the href value as needed in your test
              cy.log("The href value is:", href);
              // Visit the URL if needed
              cy.visit(href);
              cy.wait(10000);
            });
        });
    });

    cy.wait(10000);
    cy.get(
      "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
    ).scrollTo("bottomRight");
    cy.wait(5000);
    cy.get(".ag-header-cell-text")
      .contains("Review") // Assuming the text "Review" is in the header cell
      .parent(".ag-header-cell-label")
      .dblclick()
      .get(
        'div.ag-cell-label-container.ag-header-cell-sorted-desc span.ag-header-icon.ag-header-cell-menu-button span[role="presentation"]'
      )
      .click();
    cy.wait(5000);
    cy.get(".ag-menu-option").eq(-2).contains("Expand All").click();
    cy.wait(5000);

    cy.get('a#reviewBtn[title="Review"]').then(($elements) => {
      const iterations = $elements.length;

      for (let i = 0; i < iterations; i++) {
        //text += cars[i] + "<br>";

        cy.get(
          "#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport"
        ).scrollTo("bottomRight");
        cy.wait(10000);
        cy.get('a#reviewBtn[title="Review"]').eq(i).click();
        cy.get("#save-change-btn").first().click();
        cy.wait(1000);
        cy.get(".toast-message")
          .contains("Risk Review Comments saved successfully")
          .should("be.visible");
      }
    });
  }

  checkPopupVisibility() {
    cy.get("#s2id_closingBuIds").then(($element) => {
      // Check the visibility using jQuery (Cypress internally uses jQuery)
      if ($element.is(":visible")) {
        // If the popup is visible, click on the Cancel button
        cy.contains(
          "body > div:nth-child(49) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > button:nth-child(2)"
        ).click();
      } else {
        // Popup is not visible, continue with the loop
        // ...
      }
    });
  }

  CloseRCSAProcessFromThressElipses() {
    this.GetRCSAReviewURLFromTicket();
    cy.wait(5000);
    //click on three elipses
    cy.get(
      "body > div.m-grid.m-grid--hor.m-grid--root.m-page > div.m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body > div.m-grid__item.m-grid__item--fluid.m-wrapper.pl-3 > div.m-subheader > div > ul.list-inline.m-0.ml-auto.pr-2.d-flex.align-items-center > li:nth-child(7) > div > a"
    )
      .should("be.visible")
      .click();
    cy.wait(5000);
    //then select close Review Tab
    cy.get("a:contains(Close RCSA Review)").click();
    cy.wait(10000);
    cy.get("#s2id_closingBuIds").should("be.visible").click();
    cy.wait(2000);
    cy.get(".select2-results > li > div")
      .contains("BU-4 (automation.user (User))")
      .click();
    //click on close btn
    cy.wait(5000);
    cy.get('button[onclick="closeRiskReview()"]').click();
    cy.wait(2000);
  }

  GetRCSAReviewURLFromTicket() {
    cy.get("#mytarget").then(($iframe) => {
      const body = $iframe.contents().find("body");

      // Use cy.wrap inside cy.then to ensure proper synchronization
      cy.wrap(body)
        .as("iframe")
        .then(() => {
          // Wait for the iframe content to load
          cy.wait(5000);

          cy.get("@iframe")
            .find("#description-val > div.user-content-block > p > a")
            .last()
            .invoke("attr", "href")
            .then((href) => {
              // Now you can use the href value as needed in your test
              cy.log("The href value is:", href);
              // Visit the URL if needed
              cy.visit(href);
              cy.wait(10000);
            });
        });
    });
  }

  closeRCSAPercentagevaldation(Finalprogress) {
    cy.wait(10000);
    cy.get("@iframe")
      .find("#customfield_21800-val")
      .contains(Finalprogress)
      .should("be.visible");
    cy.wait(5000);
  }
}

export default Start_RCSA_PO;
