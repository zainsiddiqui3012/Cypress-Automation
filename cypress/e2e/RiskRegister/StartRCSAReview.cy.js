import StartRCSAReview from "../../support/POM/RiskRegister/StartRCSAReview";

describe(
  "Risk Management - RCSA Review - Customer Space",
  {
    tags: [
      "@pd36751",
      "@risk-management",
      "@customer",
      "@regression",
      "@rcsa-review",
    ],
  },

  () => {
    const rcsaReview = new StartRCSAReview();
    const dataFilePath = "cypress/fixtures/RiskRegister/RCSA.json";
    let data;

    before(() => {
      cy.readFile(dataFilePath).then((testData) => {
        data = testData;
      });
    });

    context("RCSA Review - Positive Cases", () => {
      beforeEach(() => {
        const user = Cypress.env("riskManagement").withRMB;
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitRiskRegister();
        rcsaReview.openRCSA();
      });

      it("Verify RCSA window loads with all fields",
        {
          tags: [
            "@pd42728",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.validateAllFields();
      });

      it("Select valid Business Unit and proceed",
        {
          tags: [
            "@pd42720",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.validateBUSelected(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.scrollBottom();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
      });

    it("Select multiple Business Areas and Definitions",
        {
          tags: [
            "@pd42712",
          ],
        }, 

        () => {
          rcsaReview.selectDate();
          rcsaReview.selectMultipleBAs(data.businessArea1, data.businessArea2);
          rcsaReview.validateMultiBASelected(data.businessArea1, data.businessArea2);
          rcsaReview.closeList();
          rcsaReview.selectMultipleFirstBADs(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
          rcsaReview.validateFirstMultiBADSelected(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
          rcsaReview.closeList();
          rcsaReview.selectMultipleSecondBADs(data.secondBusinessAreaDefinition1, data.secondBusinessAreaDefinition2);
          rcsaReview.validateSecondMultiBADSelected(data.secondBusinessAreaDefinition1, data.secondBusinessAreaDefinition2);
          rcsaReview.stubWindowOpen();
          rcsaReview.clickYesBtn();
          rcsaReview.validateRCSAStarted();            
    });     

    it("Select Yes and proceed",
        {
          tags: [
            "@pd42703",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
    });

    it("Open Business Unit dropdown",
        {
          tags: [
            "@pd42730",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.clickBUDropdown();
            rcsaReview.validateBUsDisplayed(data.expectedLength1);
    });


    it("Search a Business Unit by keyword",
        {
          tags: [
            "@pd42701",
            "@filter"
          ],
        }, 

        () => {
            rcsaReview.clickBUDropdown();
            rcsaReview.typeBU(data.businessUnit1);
            rcsaReview.validateSearchedBUDisplayed(data.businessUnit1);
    });

    it("Select one valid Business Unit",
        {
          tags: [
            "@pd42721",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.validateBUSelected(data.businessUnit1);
            rcsaReview.closeList();
    });

    it("Select multiple Business Units",
        {
          tags: [
            "@pd42710",
          ],
        }, 

        () => {
            rcsaReview.selectMultipleBUs(data.businessUnit1, data.businessUnit2);
            rcsaReview.validateMultiBUSelected(data.businessUnit1, data.businessUnit2);
    });

    it("Deselect a previously selected Business Unit",
        {
          tags: [
            "@pd42718",
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.validateBUSelected(data.businessUnit1);
            rcsaReview.clearBUSearch();
            rcsaReview.typeBU(data.businessUnit1);
            rcsaReview.unSelectBU(data.businessUnit1);
            rcsaReview.validateBUUnSelected(data.unselectedBUText);
            rcsaReview.closeList();  
    });

    it("Select Business Unit and check dependent filters",
        {
          tags: [
            "@pd42735",
            "@filter"
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.clearBUSearch();
            rcsaReview.closeList();

            rcsaReview.clickBADropdown();
            rcsaReview.validateRelevantBAsDisplayed(data.businessArea1, data.businessArea2);
            rcsaReview.closeList();

            rcsaReview.clickFirstBADefDropdown();
            rcsaReview.validateRelevantBADsDisplayed(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
            rcsaReview.closeList();

            rcsaReview.clickBUDropdown();
            rcsaReview.unSelectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.selectBU(data.businessUnit2);
            rcsaReview.closeList();
            cy.wait(1000);  //wait to allow UI to get stable as BA list can take a minimum time to refresh
            rcsaReview.clickBADropdown(); 
            rcsaReview.validateUpdatedBAsDisplayed(data.businessArea1, data.businessArea2);
            rcsaReview.closeList();
    });

    it("Select Business Area(s) for selected Business Unit",
        {
          tags: [
            "@pd42714",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.selectBA(data.businessArea1);      
            rcsaReview.validateBASelected(data.businessArea1);
    });

    it("Select multiple Business Areas",
        {
          tags: [
            "@pd42731"
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.selectBA(data.businessArea1);
            rcsaReview.clearBASearch();
            rcsaReview.selectBA(data.businessArea2);
            rcsaReview.validateMultiBASelected(data.businessArea1, data.businessArea2);

    });
    
    it("Select Business Area Definition(s) for chosen Business Area(s)",
        {
          tags: [
            "@pd42734",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectBA(data.businessArea1);
            rcsaReview.closeList();
            rcsaReview.selectFirstBADef(data.firstBusinessAreaDefinition1);
            rcsaReview.closeList();
            rcsaReview.selectSecondBADef(data.secondBusinessAreaDefinition1);
            rcsaReview.closeList();            
    });
    
    it("Select multiple Business Area Definitions",
        {
          tags: [
            "@pd42717"
          ],
        }, 

        () => {
            rcsaReview.scrollBottom();
            rcsaReview.selectMultipleFirstBADs(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
            rcsaReview.validateFirstMultiBADSelected(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
            rcsaReview.closeList();
            rcsaReview.selectMultipleSecondBADs(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
            rcsaReview.validateSecondMultiBADSelected(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
    });

    it("Filter Business Area Definition by Type",
        {
          tags: [
            "@pd42726",
            "@filter"
          ],
        }, 

        () => {
            rcsaReview.clickFirstBADFilter();
            // cy.wait(3000);

            rcsaReview.selectType(data.filterType);
            rcsaReview.clickFirstBADefDropdown();
            rcsaReview.validateBADsType(data.filterType);
    });

    it("Verify after filling valid data and clicking yes creates RCSA task on CMS ",
        {
          tags: [
            "@pd42700",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.selectBA(data.businessArea1);
            rcsaReview.closeList();
            rcsaReview.selectFirstBADef(data.firstBusinessAreaDefinition1);
            rcsaReview.closeList();
            rcsaReview.selectSecondBADef(data.secondBusinessAreaDefinition1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
    });

    it("Verify selected BU should have subtask linked with parent task ",
        {
          tags: [
            "@pd42719",
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateSubTasksForBU(data.businessUnit1, data.businessUnitText, data.riskReviewText);
    });

    it("Verify on clicking subtask, specific BU task should open",
        {
          tags: [
            "@pd42707",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickOnBUSubTask(data.businessUnit1, data.businessUnitText, data.riskReviewText);
            rcsaReview.validateBUSubTaskOpened(data.businessUnit1, data.businessUnitText, data.riskReviewText);
    });

    it("Verify on clicking review business unit risk link, should open risk register review mode.",
        {
          tags: [
            "@pd42711"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
            rcsaReview.validateRiskRegisterInReviewMode();
    });

    it("Verify on risk review mode, review column checks should enable",
        {
          tags: [
            "@pd42713",
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickReviewBusinessUnitLink(data.reviewText);   
            rcsaReview.validateReviewCheckBoxEnabled();
    });

    it("Verify on clicking checks a pop up should open containing text box ",
        {
          tags: [
            "@pd42724",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
            rcsaReview.validateReviewCheckBoxEnabled();     
            rcsaReview.clickReviewCheckBox();
            rcsaReview.validateCommentBox(data.commentText);
            rcsaReview.clickSaveBtn();
            rcsaReview.scrollRight();
            rcsaReview.validateEnteredComment(data.commentText);
    });

    it("Verify on reviewing risk instance the review status column should show Reviewed and checkbox should removed",
        {
          tags: [
            "@pd42723"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList(); 
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickReviewBusinessUnitLink(data.reviewText);     
            rcsaReview.validateReviewCheckBoxEnabled();
            rcsaReview.clickReviewCheckBox();
            rcsaReview.clickSaveBtn();
            rcsaReview.validateReviewedStatusInReviewColumn(data.reviewedText, data.expectedLength2);
    });

    it("Verify on reviewing risk instances RCSA task progress should increase",
        {
          tags: [
            "@pd42732"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
            cy.url().then((originalUrl) => {
              rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
              rcsaReview.validateReviewCheckBoxEnabled();
              rcsaReview.clickReviewCheckBox();
              rcsaReview.clickSaveBtn();
              cy.visit(originalUrl); 
            });
            
            rcsaReview.clickOnBUSubTask(data.businessUnit1, data.businessUnitText, data.riskReviewText);
            cy.wait(3000);  //this wait is necessary before clicking the business unit otherwise it navigates to same page and validation fails
            rcsaReview.validateRCSATaskProgress(data.partialProgress);
    });

    it("Verify on clicking risk review audit log, RCSA audit log should open in new tab",
        {
          tags: [
            "@pd42737"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.clickAuditLog(data.auditLogText);
            rcsaReview.validateAuditLogOpened();   
    });

    it("Verify on completing sub tasks parent task progress should complete",
        {
          tags: [
            "@pd42715",
            "@smoke"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
            cy.url().then((originalUrl) => {
              rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
              rcsaReview.validateReviewCheckBoxEnabled();
              rcsaReview.clickAllReviewCheckBoxes();
              rcsaReview.closeModal();
              cy.visit(originalUrl); // Now this works, because it's inside the `.then()` block
            });

            // validate the progress is now complete
            rcsaReview.validateRCSATaskProgress(data.completeProgress);
    });

    it("Verify on clicking review business unit risk from individual sub task, that individual BU should open or RCSA review mode",
        {
          tags: [
            "@pd42708"
          ],
        }, 

        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.clearBUSearch();
            rcsaReview.selectBU(data.businessUnit2);
            rcsaReview.closeList();
            rcsaReview.stubWindowOpen();
            rcsaReview.clickYesBtn();
            rcsaReview.validateRCSAStarted();
            cy.url().then((riskReviewUrl) => {
              rcsaReview.clickOnBUSubTask(data.businessUnit1, data.businessUnitText, data.riskReviewText);
              rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
              rcsaReview.validateRiskRegisterInReviewMode();
              cy.visit(riskReviewUrl);
            });
            rcsaReview.clickOnBUSubTask(data.businessUnit2, data.businessUnitText, data.riskReviewText);
            rcsaReview.clickReviewBusinessUnitLink(data.reviewText);
            rcsaReview.validateRiskRegisterInReviewMode();
    });

  });


  context("RCSA Review - Negative Cases", () => {
      beforeEach(() => {
        const user = Cypress.env("riskManagement").withRMB;
        cy.loginWithSession(
          `login with ${user.username}`,
          user.username,
          user.password,
          user.key
        );
        cy.visitRiskRegister();
        rcsaReview.openRCSA();
      });

    it("Select invalid Business Unit filter type",
        {
          tags: [
            "@pd42727",
            "@filter"
          ],
        }, 

        () => {
            rcsaReview.clickBUDropdown();
            rcsaReview.typeBU(data.invalidBusinessUnit);
            rcsaReview.validateNoBUDisplayed(data.expectedLength1);
    });

    it("Attempt to submit without Due Date",
        {
          tags: [
            "@pd42704"
          ],
        }, 

        () => {
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.selectBA(data.businessArea1);
            rcsaReview.closeList();
            rcsaReview.selectFirstBADef(data.firstBusinessAreaDefinition1);
            rcsaReview.closeList();
            rcsaReview.selectSecondBADef(data.secondBusinessAreaDefinition1);
            rcsaReview.closeList();
            rcsaReview.clickYesBtn();
            rcsaReview.validateErrorMsg(data.error);
    });

    it("Select No and attempt to save",
        {
          tags: [
            "@pd42706"
          ],
        }, 
        () => {
            rcsaReview.selectDate();
            rcsaReview.selectBU(data.businessUnit1);
            rcsaReview.closeList();
            rcsaReview.clickNoBtn();
            rcsaReview.validateModelClosed();
    });

    it("Deselect all selected Definitions and try to save",
        {
          tags: [
            "@pd42722"
          ],
        }, 
        () => {
            rcsaReview.scrollBottom();
            rcsaReview.selectMultipleFirstBADs(data.firstBusinessAreaDefinition1, data.firstBusinessAreaDefinition2);
            rcsaReview.clearFirstBADefSearch();
            rcsaReview.unSelectAllFirstBADef();
            rcsaReview.validateNoFirstBADSelected(data.expectedLength1);
            rcsaReview.closeList();
    });

  });
  
});

  