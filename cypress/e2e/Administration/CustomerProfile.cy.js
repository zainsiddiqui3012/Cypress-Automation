import locators from "../../fixtures/locators.json";
import testData from "../../fixtures/Administration/CustomerProfile.json";
import CustomerProfile from "../../support/POM/Administration/CustomerProfile";

const customerProfile = new CustomerProfile();
describe(
  "E2E Automation of Customer Profile from (Customer Space)",
  {
    tags: [
      "@customer-space",
      "@customer-profile",
      "@administration",
      "@pd32063",
      "@regression"
    ],
  },
  () => {
    context("complaint", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it("Verify Cancel functionality", { tags: ["@pd32964"] }, () => {
        customerProfile.clickCancelButton();
      });

      it("Verify saving without making changes", { tags: ["@pd32960"] }, () => {
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
      });

      it(
        "Verify the presence of Process Owner Type options",
        { tags: ["@pd32940", "@smoke"] },
        () => {
          customerProfile.verifyProcessOwnerTypeOptionsPresent();
        }
      );

      it(
        "Verify default selection for Process Owner Type",
        { tags: ["@pd32941", "@pd32963"] },
        () => {
          customerProfile.verifyDefaultProcessOwnerTypeSelection();
        }
      );

      it(
        "Verify switching between Single and Group Process Owner Type",
        { tags: ["@pd32942", "@pd32965", "@pd32962", "@pd32961"] },
        () => {
          customerProfile.selectProcessOwnerType(
            testData.complaint.processOwnerTypeGroup
          );
          customerProfile.verifyProcessOwnerGroupFieldVisible(true);

          customerProfile.selectProcessOwnerType(
            testData.complaint.processOwnerTypeSingle
          );
          customerProfile.verifyProcessOwnerGroupFieldVisible(false);
        }
      );

      it(
        "Verify Complaint Process Owner field",
        { tags: ["@pd32943", "@pd32949", "@pd32955", "@pd32966"] },
        () => {
          customerProfile.clickDropDown(
            locators.administration.customerProfile
              .complaintProcessOwnerDropDown
          );
          cy.dropDownSearchAndSelect(
            locators.general.dropDownSearch,
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clickSaveButton();
          customerProfile.clickSaveButton();
          cy.reload();
          customerProfile.verifySelectDropDownValue(
            locators.administration.customerProfile
              .complaintProcessOwnerDropDown,
            testData.userFirstName
          );
        }
      );

      it(
        "Verify Complaint Reviewer Group field",
        { tags: ["@pd32945", "@pd32950", "@pd32955"] },
        () => {
          customerProfile.clickDropDown(
            locators.administration.customerProfile
              .complaintReviewerGroupDropDown
          );
          cy.dropDownSearchAndSelect(
            locators.general.dropDownSearch,
            testData.userGroup
          );
          customerProfile.clickSaveButton();
          customerProfile.clickSaveButton();
          cy.reload();
          customerProfile.verifySelectDropDownValue(
            locators.administration.customerProfile
              .complaintReviewerGroupDropDown,
            testData.userGroup
          );
        }
      );

      it(
        "Verify Legal Reviewer field",
        { tags: ["@pd32947", "@pd32951", "@pd32955"] },
        () => {
          customerProfile.clickDropDown(
            locators.administration.customerProfile.complaintLegalReviewDropDown
          );
          cy.dropDownSearchAndSelect(
            locators.general.dropDownSearch,
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clickSaveButton();
          customerProfile.clickSaveButton();
          cy.reload();
          customerProfile.verifySelectDropDownValue(
            locators.administration.customerProfile
              .complaintLegalReviewDropDown,
            testData.userFirstName
          );
        }
      );

      /** there is bug in front end when user click on the cross/clear icon in the drop
        and visit customer profile again ther values in the dropdown still showing its values
    **/
      it(
        "Verify removing a selected value from Complaint Process Owner, Legal Reviewer, Complaint Reviewer Group",
        { tags: ["@pd32952", "@pd32953", "@pd32954"] },
        () => {
          customerProfile.clearAndVerifyDropdownSelection(
            locators.administration.customerProfile
              .complaintProcessOwnerDropDown,
            locators.administration.customerProfile.clearDropDownText,
            testData.userFirstName
          );
          cy.visitCustomerProfile();
          customerProfile.verifyDropdownValueCleared(
            locators.administration.customerProfile
              .complaintProcessOwnerDropDown,
            testData.userFirstName
          );

          customerProfile.clearAndVerifyDropdownSelection(
            locators.administration.customerProfile
              .complaintLegalReviewDropDown,
            locators.administration.customerProfile.clearDropDownText,
            testData.userFirstName
          );
          cy.visitCustomerProfile();
          customerProfile.verifyDropdownValueCleared(
            locators.administration.customerProfile
              .complaintLegalReviewDropDown,
            testData.userFirstName
          );
          customerProfile.clearAndVerifyDropdownSelection(
            locators.administration.customerProfile
              .complaintReviewerGroupDropDown,
            locators.administration.customerProfile.clearDropDownText,
            testData.userGroup
          );
          cy.visitCustomerProfile();
          customerProfile.verifyDropdownValueCleared(
            locators.administration.customerProfile
              .complaintReviewerGroupDropDown,
            testData.userGroup
          );
        }
      );
    });

    context("Document Management", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Select Microsoft Document Viewer field",
        { tags: ["@pd37694", "@smoke"] },
        () => {
          customerProfile.verifyMicrosoftViewerCheckboxPresent();
        }
      );

      it(
        "Verify the default state of the checkbox (Should be unChecked)",
        { tags: ["@pd33078"] },
        () => {
          customerProfile.verifyMicrosoftViewerCheckboxChecked(false);
        }
      );

      it("Verify unchecking the checkbox", { tags: ["@pd33080"] }, () => {
        customerProfile.setMicrosoftViewerCheckbox(false);
        customerProfile.verifyMicrosoftViewerCheckboxChecked(false);
      });

      it("Verify checking the checkbox", { tags: ["@pd33079"] }, () => {
        customerProfile.setMicrosoftViewerCheckbox(false);
        customerProfile.setMicrosoftViewerCheckbox(true);
        customerProfile.verifyMicrosoftViewerCheckboxChecked(true);
      });

      it(
        "Verify saving with the checkbox checked",
        { tags: ["@pd33081"] },
        () => {
          customerProfile.setMicrosoftViewerCheckbox(true);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify saving with the checkbox unchecked",
        { tags: ["@pd33082"] },
        () => {
          customerProfile.setMicrosoftViewerCheckbox(false);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );
    });

    context("Risk Review", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Required Approval field",
        { tags: ["@pd33077", "@smoke"] },
        () => {
          customerProfile.verifyRiskReviewApprovalCheckboxPresent();
        }
      );

      it(
        "Verify the default state of the checkbox",
        { tags: ["@pd33078"] },
        () => {
          customerProfile.verifyRiskReviewApprovalCheckboxChecked(false);
        }
      );

      it("Verify checking the checkbox", { tags: ["@pd33079"] }, () => {
        customerProfile.setRiskReviewApprovalCheckbox(true);
        customerProfile.verifyRiskReviewApprovalCheckboxChecked(true);
      });

      it("Verify unchecking the checkbox", { tags: ["@pd33080"] }, () => {
        customerProfile.setRiskReviewApprovalCheckbox(true);
        customerProfile.setRiskReviewApprovalCheckbox(false);
        customerProfile.verifyRiskReviewApprovalCheckboxChecked(false);
      });

      it(
        "Verify saving with the checkbox checked",
        { tags: ["@pd33081"] },
        () => {
          customerProfile.setRiskReviewApprovalCheckbox(true);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify saving with the checkbox unchecked",
        { tags: ["@pd33082"] },
        () => {
          customerProfile.setRiskReviewApprovalCheckbox(false);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );
    });

    context("Action Plan", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Require Action Plans Closure to Close Parent Ticket field",
        { tags: ["@pd37694"] },
        () => {
          customerProfile.verifyActionPlanClosureRequiredCheckboxPresent();
        }
      );

      it(
        "Verify the default state of the checkbox",
        { tags: ["@pd33078"] },
        () => {
          customerProfile.verifyActionPlanClosureRequiredCheckboxChecked(false);
        }
      );

      it("Verify unchecking the checkbox", { tags: ["@pd33080"] }, () => {
        customerProfile.setActionPlanClosureRequiredCheckbox(false);
        customerProfile.verifyActionPlanClosureRequiredCheckboxChecked(false);
      });

      it("Verify checking the checkbox", { tags: ["@pd33079"] }, () => {
        customerProfile.setActionPlanClosureRequiredCheckbox(false);
        customerProfile.setActionPlanClosureRequiredCheckbox(true);
        customerProfile.verifyActionPlanClosureRequiredCheckboxChecked(true);
      });

      it(
        "Verify saving with the checkbox checked",
        { tags: ["@pd33081"] },
        () => {
          customerProfile.setActionPlanClosureRequiredCheckbox(true);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify saving with the checkbox unchecked",
        { tags: ["@pd33082"] },
        () => {
          customerProfile.setActionPlanClosureRequiredCheckbox(false);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );
    });

    context("Regulatory Change", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        'Select "Single" for Reg Change Owner Type',
        { tags: ["@pd33091"] },
        () => {
          customerProfile.selectRegChangeOwnerType(testData.single);
          customerProfile.verifyRegChangeProcessOwnerFieldVisible(true);
        }
      );

      it(
        'Select "Group" for Reg Change Owner Type',
        { tags: ["@pd33092"] },
        () => {
          customerProfile.selectRegChangeOwnerType(testData.group);
          customerProfile.verifyRegChangeProcessOwnerGroupFieldVisible(true);
        }
      );

      it("Enter valid Reg Change Process Owner", { tags: ["@pd33093"] }, () => {
        customerProfile.selectRegChangeOwnerType(testData.single);
        customerProfile.enterRegChangeProcessOwner(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.verifyRegChangeProcessOwnerSelected(
          Cypress.env("kxi").customer.withRM.username
        );
      });

      it(
        "Enter invalid Reg Change Process Owner",
        { tags: ["@pd33094"] },
        () => {
          customerProfile.selectRegChangeOwnerType(testData.single);
          customerProfile.enterRegChangeProcessOwner(testData.invalidUser, {
            expectNoMatch: true,
          });
        }
      );

      it(
        'Select "Single" for Reg Change Watcher Type',
        { tags: ["@pd33096"] },
        () => {
          customerProfile.selectRegChangeWatcherType(testData.single);
          customerProfile.verifyRegChangeWatcherFieldVisible(true);
        }
      );

      it(
        'Select "Group" for Reg Change Watcher Type',
        { tags: ["@pd33097"] },
        () => {
          customerProfile.selectRegChangeWatcherType(testData.group);
          customerProfile.verifyRegChangeWatcherGroupFieldVisible(true);
        }
      );

      it("Enter valid Reg Change Watchers", { tags: ["@pd33098"] }, () => {
        customerProfile.selectRegChangeWatcherType(testData.single);
        customerProfile.enterRegChangeWatcher(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.verifyRegChangeWatcherSelected(
          Cypress.env("kxi").customer.withRM.username
        );
      });

      it("Enter invalid Reg Change Watchers", { tags: ["@pd33099"] }, () => {
        customerProfile.selectRegChangeWatcherType(testData.single);
        customerProfile.enterRegChangeWatcher(testData.invalidUser, {
          expectNoMatch: true,
        });
      });

      it(
        'Enable "Require Approval for Evaluate Impact and Reg Change Action Plans"',
        { tags: ["@pd33101"] },
        () => {
          customerProfile.setRegChangeApprovalCheckbox(true);
          customerProfile.verifyRegChangeApprovalCheckboxChecked(true);
        }
      );

      it(
        'Disable "Require Approval for Evaluate Impact and Reg Change Action Plans"',
        { tags: ["@pd33102"] },
        () => {
          customerProfile.setRegChangeApprovalCheckbox(false);
          customerProfile.verifyRegChangeApprovalCheckboxChecked(false);
        }
      );

      it('Select "Single" for Approver', { tags: ["@pd33103"] }, () => {
        customerProfile.selectRegChangeApproverType(testData.single);
        customerProfile.verifyRegChangeApproverFieldVisible(true);
      });

      it('Select "Creator" for Approver', { tags: ["@pd33104"] }, () => {
        customerProfile.selectRegChangeApproverType(testData.regulatoryChange.creator);
        customerProfile.verifyRegChangeApproverFieldVisible(false);
        customerProfile.verifyRegChangeApproverIsCreator();
      });

      it('Enter valid Approver for "Single"', { tags: ["@pd33105"] }, () => {
        customerProfile.selectRegChangeApproverType(testData.single);
        customerProfile.enterRegChangeApprover(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.verifyRegChangeApproverSelected(
          Cypress.env("kxi").customer.withRM.username
        );
      });

      it('Enter invalid Approver for "Single"', { tags: ["@pd33106"] }, () => {
        customerProfile.selectRegChangeApproverType(testData.single);
        customerProfile.enterRegChangeApprover(testData.invalidUser, {
          expectNoMatch: true,
        });
      });

      it(
        'Toggle between "Single" and "Group" for Owner/Watcher Types',
        { tags: ["@pd33108"] },
        () => {
          customerProfile.selectRegChangeOwnerType(testData.single);
          customerProfile.verifyRegChangeProcessOwnerFieldVisible(true);
          customerProfile.selectRegChangeOwnerType(testData.group);
          customerProfile.verifyRegChangeProcessOwnerGroupFieldVisible(true);

          customerProfile.selectRegChangeWatcherType(testData.single);
          customerProfile.verifyRegChangeWatcherFieldVisible(true);
          customerProfile.selectRegChangeWatcherType(testData.group);
          customerProfile.verifyRegChangeWatcherGroupFieldVisible(true);
        }
      );

      it("Save changes with valid inputs", { tags: ["@pd33109"] }, () => {
        customerProfile.selectRegChangeOwnerType(testData.single);
        customerProfile.enterRegChangeProcessOwner(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.selectRegChangeWatcherType(testData.single);
        customerProfile.enterRegChangeWatcher(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.setRegChangeApprovalCheckbox(true);
        customerProfile.selectRegChangeApproverType(testData.single);
        customerProfile.enterRegChangeApprover(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
        customerProfile.verifyRegChangeDataSaved();
      });

      it("Attempt to save with invalid inputs", { tags: ["@pd33111"] }, () => {
        customerProfile.selectRegChangeOwnerType(testData.single);
        customerProfile.enterRegChangeProcessOwner(testData.invalidUser, {
          expectNoMatch: true,
        });
        customerProfile.clickSaveButton();
      });

      it("Cancel changes", { tags: ["@pd33112"] }, () => {
        customerProfile.enterRegChangeProcessOwner(
          Cypress.env("kxi").customer.withRM.username
        );
        customerProfile.clickCancelButton();
        customerProfile.verifyRegChangeDataNotSaved();
      });

      it(
        "Test field interactions with prefilled data",
        { tags: ["@pd33115"] },
        () => {
          customerProfile.editRegChangeProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.deleteRegChangeWatcher();
          customerProfile.clickSaveButton();
          customerProfile.verifyRegChangeDataSaved();
        }
      );
    });

    context("Sox Review", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the SOX Process Owner Type field",
        { tags: "@pd33059" },
        () => {
          customerProfile.verifySoxProcessOwnerTypeFieldPresent();
        }
      );

      it(
        "Verify selecting Single as SOX Process Owner Type",
        { tags: "@pd33060" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.single);
          customerProfile.verifySoxProcessOwnerDropdownVisible(true);
          customerProfile.verifySoxProcessOwnerGroupDropdownVisible(false);
        }
      );

      it(
        "Verify selecting Group as SOX Process Owner Type",
        { tags: "@pd33061" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.group);
          customerProfile.verifySoxProcessOwnerDropdownVisible(false);
          customerProfile.verifySoxProcessOwnerGroupDropdownVisible(true);
        }
      );

      it(
        "Verify the presence of the SOX Process Owner dropdown",
        { tags: "@pd33062" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.single);
          customerProfile.verifySoxProcessOwnerDropdownVisible(true);
        }
      );

      it(
        "Verify selecting a single owner from the dropdown",
        { tags: "@pd33026" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.single);
          customerProfile.enterSoxProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.verifySoxProcessOwnerSelected(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it(
        "Verify selecting a group from the dropdown",
        { tags: "@pd33027" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.group);
          customerProfile.enterSoxProcessOwnerGroup(testData.userGroup);
          customerProfile.verifySoxProcessOwnerGroupSelected(
            testData.userGroup
          );
        }
      );

      it(
        "Verify clearing the SOX Process Owner field",
        { tags: "@pd33065" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.single);
          customerProfile.enterSoxProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clearSoxProcessOwner();
          customerProfile.verifySoxProcessOwnerCleared();
        }
      );

      it(
        "Verify saving with a valid single owner",
        { tags: "@pd33066" },
        () => {
          customerProfile.selectSoxProcessOwnerType(testData.single);
          customerProfile.enterSoxProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
          customerProfile.verifySoxProcessOwnerSaved(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it("Verify saving with a valid group owner", { tags: "@pd33067" }, () => {
        customerProfile.selectSoxProcessOwnerType(testData.group);
        customerProfile.enterSoxProcessOwnerGroup(testData.userGroup);
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
        customerProfile.verifySoxProcessOwnerGroupSaved(testData.userGroup);
      });
    });

    context("Exam Management", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Exam Owner Type field",
        { tags: "@pd33041" },
        () => {
          customerProfile.verifyExamOwnerTypeFieldPresent();
        }
      );

      it(
        "Verify selecting Single as Exam Owner Type",
        { tags: "@pd33042" },
        () => {
          customerProfile.selectExamOwnerType(testData.single);
          customerProfile.verifyExamProcessOwnerDropdownVisible(true);
          customerProfile.verifyExamProcessOwnerGroupDropdownVisible(false);
        }
      );

      it(
        "Verify selecting Group as Exam Owner Type",
        { tags: "@pd33043" },
        () => {
          customerProfile.selectExamOwnerType(testData.group);
          customerProfile.verifyExamProcessOwnerDropdownVisible(false);
          customerProfile.verifyExamProcessOwnerGroupDropdownVisible(true);
        }
      );

      it(
        "Verify the presence of the Exam Process Owner dropdown",
        { tags: "@pd33044" },
        () => {
          customerProfile.selectExamOwnerType(testData.single);
          customerProfile.verifyExamProcessOwnerDropdownVisible(true);
        }
      );

      it(
        "Verify selecting a single owner from the dropdown",
        { tags: "@pd33045" },
        () => {
          customerProfile.selectExamOwnerType(testData.single);
          customerProfile.enterExamProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.verifyExamProcessOwnerSelected(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it(
        "Verify selecting a group from the dropdown",
        { tags: "@pd33046" },
        () => {
          customerProfile.selectExamOwnerType(testData.group);
          customerProfile.enterExamProcessOwnerGroup(testData.userGroup);
          customerProfile.verifyExamProcessOwnerGroupSelected(
            testData.userGroup
          );
        }
      );

      it(
        "Verify clearing the Exam Process Owner field",
        { tags: "@pd33047" },
        () => {
          customerProfile.selectExamOwnerType(testData.single);
          customerProfile.enterExamProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clearExamProcessOwner();
          customerProfile.clickSaveButton();
          customerProfile.verifyExamProcessOwnerCleared();
        }
      );

      it(
        "Verify saving with a valid single owner",
        { tags: "@pd33048" },
        () => {
          customerProfile.selectExamOwnerType(testData.single);
          customerProfile.enterExamProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
          customerProfile.verifyExamProcessOwnerSaved(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it("Verify saving with a valid group owner", { tags: "@pd33049" }, () => {
        customerProfile.selectExamOwnerType("Group");
        customerProfile.enterExamProcessOwnerGroup(testData.userGroup);
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
        customerProfile.verifyExamProcessOwnerGroupSaved(testData.userGroup);
      });

      it(
        "Verify updating the owner type and value",
        { tags: "@pd33052" },
        () => {
          customerProfile.updateExamOwnerTypeAndValue(
            Cypress.env("kxi").customer.withRM.username,
            testData.userGroup
          );
        }
      );

      it("Verify dropdown validation", { tags: "@pd33055" }, () => {
        customerProfile.verifyExamOwnerDropdownValidation(testData.invalidUser);
      });

      it(
        "Verify default selection of Exam Owner Type",
        { tags: "@pd33051" },
        () => {
          customerProfile.verifyDefaultExamOwnerTypeSelection(testData.single);
        }
      );
    });

    context("KXI Management", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Default Negative Context Icon Set field",
        { tags: "@pd33008" },
        () => {
          customerProfile.verifyDefaultNegativeContextIconSetFieldPresent();
        }
      );

      it(
        "Verify the dropdown options for the Default Negative Context Icon Set",
        { tags: "@pd33009" },
        () => {
          customerProfile.verifyDefaultNegativeContextIconSetDropdownOptions();
        }
      );

      it(
        "Verify selecting an option from the dropdown",
        { tags: "@pd33010" },
        () => {
          customerProfile.selectDefaultNegativeContextIconSet(testData.kxiManagement.negativeMixedValue);
        }
      );

      it("Verify clearing the field", { tags: "@pd33011" }, () => {
        customerProfile.clearDefaultNegativeContextIconSet();
      });

      it("Verify saving with a valid selection", { tags: "@pd33012" }, () => {
        customerProfile.selectDefaultNegativeContextIconSet(testData.kxiManagement.negativeValue);
        customerProfile.clickSaveButton();
      });

      it("Verify the default value of the field", { tags: "@pd33015" }, () => {
        customerProfile.verifyDefaultNegativeContextIconSetValue();
      });

      it("Verify updating the field value", { tags: "@pd33016" }, () => {
        customerProfile.updateAndSaveDefaultNegativeContextIconSet(
          "Negative Mixed"
        );
      });

      it("Verify dropdown validation", { tags: "@pd33019" }, () => {
        customerProfile.verifyNegativeContextIconSetDropdownValidation(
          "InvalidValue"
        );
      });
    });

    context("Issue Management", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of the Issue Process Owner Type field",
        { tags: "@pd33022" },
        () => {
          customerProfile.verifyIssueProcessOwnerTypeFieldPresent();
        }
      );

      it(
        "Verify default selection of Issue Process Owner Type",
        { tags: "@pd33032" },
        () => {
          customerProfile.verifyDefaultIssueProcessOwnerTypeSelection(testData.group);
        }
      );

      it(
        "Verify selecting Single as Issue Process Owner Type",
        { tags: "@pd33023" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.single);
          customerProfile.verifyIssueProcessOwnerDropdownVisible(true);
          customerProfile.verifyIssueProcessOwnerGroupDropdownVisible(false);
        }
      );

      it(
        "Verify selecting Group as Issue Process Owner Type",
        { tags: "@pd33024" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.group);
          customerProfile.verifyIssueProcessOwnerDropdownVisible(false);
          customerProfile.verifyIssueProcessOwnerGroupDropdownVisible(true);
        }
      );

      it(
        "Verify the presence of the Issue Process Owner dropdown",
        { tags: "@pd33025" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.single);
          customerProfile.verifyIssueProcessOwnerDropdownVisible(true);
        }
      );

      it(
        "Verify selecting a single owner from the dropdown",
        { tags: "@pd33063" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.single);
          customerProfile.enterIssueProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.verifyIssueProcessOwnerSelected(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it(
        "Verify clearing the Issue Process Owner field",
        { tags: "@pd33028" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.single);
          customerProfile.enterIssueProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clearIssueProcessOwner();
          customerProfile.verifyIssueProcessOwnerCleared();
        }
      );
      // temporary skip this test because owner name was not exist in the dropdown result
      it.skip(
        "Verify saving with a valid single owner",
        { tags: "@pd33029" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.single);
          customerProfile.enterIssueProcessOwner(
            Cypress.env("kxi").customer.withRM.username
          );
          customerProfile.clickSaveButton();
          customerProfile.verifyIssueProcessOwnerSaved(
            Cypress.env("kxi").customer.withRM.username
          );
        }
      );

      it(
        "Verify selecting a group from the dropdown",
        { tags: "@pd33064" },
        () => {
          customerProfile.selectIssueProcessOwnerType(testData.group);
          customerProfile.enterIssueProcessOwnerGroup(testData.userGroup);
          customerProfile.verifyIssueProcessOwnerGroupSelected(
            testData.userGroup
          );
        }
      );

      it("Verify saving with a valid group owner", { tags: "@pd33030" }, () => {
        customerProfile.selectIssueProcessOwnerType(testData.group);
        customerProfile.enterIssueProcessOwnerGroup(testData.userGroup);
        customerProfile.clickSaveButton();
        customerProfile.verifyIssueProcessOwnerGroupSaved(testData.userGroup);
      });

      it(
        "Verify updating the owner type and value",
        { tags: "@pd33033" },
        () => {
          customerProfile.updateIssueOwnerTypeAndValue(
            Cypress.env("kxi").customer.withRM.username,
            testData.userGroup
          );
        }
      );

      it("Verify dropdown validation", { tags: "@pd33037" }, () => {
        customerProfile.verifyDropdownValidation(testData.noMatchesFound);
      });
    });

    context("Risk Management", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of Weight Risk By options",
        { tags: "@pd32986" },
        () => {
          customerProfile.verifyWeightRiskByOptionsPresent();
        }
      );

      it(
        "Verify default selection for Weight Risk By",
        { tags: "@pd32987" },
        () => {
          customerProfile.verifyDefaultWeightRiskBySelection(testData.none);
        }
      );

      it(
        "Verify toggling between Weight Risk By options",
        { tags: "@pd32988" },
        () => {
          customerProfile.toggleWeightRiskByOptions();
        }
      );

      it(
        "Verify the presence of Default Risk Currency field",
        { tags: "@pd32989" },
        () => {
          customerProfile.verifyDefaultRiskCurrencyFieldPresent();
        }
      );

      it("Verify updating Default Risk Currency", { tags: "@pd32990" }, () => {
        customerProfile.updateDefaultRiskCurrency(
          testData.riskManagement.updateDefaultRiskCurrency
        );
      });

      it(
        "Verify the presence of Current Risk >= Residual Risk options",
        { tags: "@pd32991" },
        () => {
          customerProfile.verifyCurrentRiskGreaterThanResidualOptionsPresent();
        }
      );

      it(
        "Verify default selection for Current Risk >= Residual Risk",
        { tags: "@pd32992" },
        () => {
          customerProfile.verifyDefaultCurrentRiskGreaterThanResidualSelection(
            "false"
          );
        }
      );

      it(
        "Verify toggling Current Risk >= Residual Risk options",
        { tags: "@pd32993" },
        () => {
          customerProfile.toggleCurrentRiskGreaterThanResidualOptions();
        }
      );

      it(
        "Verify Lock Risk Definitions to Risk Items checkbox",
        { tags: "@pd32994" },
        () => {
          customerProfile.verifyLockRiskDefinitionCheckbox();
        }
      );

      it(
        "Verify Use Efficacy to Control Current Risk checkbox",
        { tags: "@pd32995" },
        () => {
          customerProfile.verifyEfficacyToControlRiskCheckbox();
        }
      );

      it(
        "Verify Require Control Owners to Approve Control Tests checkbox",
        { tags: "@pd32996" },
        () => {
          customerProfile.verifyControlTestApprovalRequiredCheckbox();
        }
      );

      it(
        "Verify updating Default Control Testing Role",
        { tags: "@pd32997" },
        () => {
          customerProfile.updateDefaultControlTestingRole(
            testData.riskManagement.defaultControlTestingRole
          );
        }
      );

      it(
        "Verify Enable ROC to create new Risks checkbox",
        { tags: "@pd32998" },
        () => {
          customerProfile.verifyEnableRocToCreateNewRiskCheckbox();
        }
      );

      it(
        "Verify saving valid Risk Management section inputs",
        { tags: "@pd32999" },
        () => {
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify saving without optional checkboxes",
        { tags: "@pd33000" },
        () => {
          customerProfile.saveWithoutOptionalCheckboxes();
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it("Verify pre-filled data display", { tags: "@pd32981" }, () => {
        customerProfile.verifyPrefilledDataCurrency(
          testData.riskManagement.updateDefaultRiskCurrency,
          testData.riskManagement.defaultControlTestingRole
        );
      });

      it("Verify cancel functionality", { tags: "@pd32982" }, () => {
        customerProfile.clickCancelButton();
      });

      it(
        "Verify invalid inputs in Default Risk Currency",
        { tags: "@pd33006" },
        () => {
          customerProfile.verifyInvalidInputsInDefaultRiskCurrency(
            "InvalidCurrency"
          );
        }
      );

      it("Verify saving with all fields filled", { tags: "@pd33007" }, () => {
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
      });
    });

    context("QA Testing", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Verify the presence of Scheduler Pre-notification field",
        { tags: "@pd32967" },
        () => {
          customerProfile.verifySchedulerPreNotificationFieldPresent();
        }
      );

      it(
        "Verify validation for Scheduler Pre-notification field",
        { tags: "@pd32968" },
        () => {
          customerProfile.verifySchedulerPreNotificationValidation();
        }
      );

      it(
        "Verify saving valid Scheduler Pre-notification value",
        { tags: "@pd32969" },
        () => {
          customerProfile.saveValidSchedulerPreNotificationValue();
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify the presence of Action Plan Status Auto Update Reminder options",
        { tags: "@pd32971" },
        () => {
          customerProfile.verifyActionPlanStatusAutoUpdateReminderOptions();
        }
      );

      it(
        "Verify default selection for Action Plan Status Auto Update Reminder",
        { tags: "@pd32972" },
        () => {
          customerProfile.verifyDefaultActionPlanStatusSelection("true");
        }
      );

      it(
        "Verify toggling between Action Plan Status options",
        { tags: "@pd32973" },
        () => {
          customerProfile.toggleActionPlanStatusOptions();
          customerProfile.clickSaveButton();
        }
      );

      it("Verify Single User QA checkbox", { tags: "@pd32974" }, () => {
        customerProfile.verifySingleUserQACheckbox();
      });

      it(
        "Verify default state of Single User QA checkbox",
        { tags: "@pd32975" },
        () => {
          customerProfile.verifyDefaultSingleUserQAState(false);
        }
      );

      it(
        "Verify saving with valid QA Testing section inputs",
        { tags: "@pd32976" },
        () => {
          customerProfile.saveValidQATestingSectionInputs();
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it("Verify saving without optional fields", { tags: "@pd32977" }, () => {
        customerProfile.saveWithoutOptionalFields();
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
      });

      it(
        "Verify field limits for Scheduler Pre-notification",
        { tags: "@pd32977" },
        () => {
          customerProfile.verifySchedulerPreNotificationFieldLimit();
        }
      );

      it("Verify pre-filled data display", { tags: "@pd32963" }, () => {
        customerProfile.verifyPrefilledData(
          testData.qaTesting.schedularPreNotification,
          testData.qaTesting.actionPlanStatusAutoUpdateReminder,
          false
        );
      });

      it("Verify cancel functionality", { tags: "@pd32982" }, () => {
        customerProfile.clickCancelButton();
      });

      it(
        "Verify saving invalid Scheduler Pre-notification value",
        { tags: "@pd32983" },
        () => {
          customerProfile.saveInvalidSchedulerPreNotificationValue();
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Verify saving when Single User QA checkbox is toggled",
        { tags: "@pd32984" },
        () => {
          customerProfile.saveWithSingleUserQAToggled();
        }
      );
    });

    context("Basic Section", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          Cypress.env("kxi").customer.withRM.username,
          Cypress.env("kxi").customer.withRM.password,
          Cypress.env("kxi").customer.withRM.key
        );
        cy.visitCustomerProfile();
        cy.waitForTopMsgLoaderToDisappear(100000);
      });

      it(
        "Add Customer Profile with all required fields",
        { tags: "@pd33116" },
        () => {
          customerProfile.fillMandatoryFields({
            idrssd: testData.idrssd,
          });
          customerProfile.fillOptionalFields({
            fdic: testData.fdic,
            occ: testData.occ,
            companyName: testData.companyName,
            street: testData.street,
            city: testData.city,
            state: testData.state,
            zip: testData.zip,
          });
          customerProfile.enableCustomerSupport();
          customerProfile.selectConsultants([testData.consultant]);
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );

      it(
        "Add Customer Profile without mandatory fields",
        { tags: "@pd33117" },
        () => {
          customerProfile.fillMandatoryFields({
            idrssd: testData.invalidCharIdrssd,
          });
          customerProfile.clickSaveButton();
          customerProfile.verifyErrorMessage(
            testData.errors.mandatoryFieldsError
          );
        }
      );

      it("Enable Customer Support toggle", { tags: "@pd33118" }, () => {
        customerProfile.enableCustomerSupport();
        cy.get(locators.administration.customerProfile.consultant).should(
          "be.visible"
        );
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
      });

      it("Disable Customer Support toggle", { tags: "@pd33119" }, () => {
        customerProfile.disableCustomerSupport();
        cy.get(locators.administration.customerProfile.consultant).should(
          "not.be.visible"
        );
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
      });

      //temporary skipping this test because we have only one Consultant reseller for this user
      it.skip("Add multiple Consultants", { tags: "@pd33120" }, () => {
        customerProfile.enableCustomerSupport();
        customerProfile.selectConsultants([
          testData.consultant,
          testData.consultant2_Optional,
        ]);
        customerProfile.saveProfile();
      });

      it("Enter invalid IDRSSD", { tags: "@pd33122" }, () => {
        const invalidIdrssd = testData.invalidIdrssd;
        customerProfile.enterInvalidIdrssd(invalidIdrssd);
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
        // Assert that the IDRSSD field value length is 15 using a custom method
        customerProfile.assertIdrssdFieldLength();
      });

      it("Leave optional fields empty", { tags: "@pd33124" }, () => {
        customerProfile.fillMandatoryFields({
          idrssd: testData.idrssd,
        });
        customerProfile.leaveOptionalFieldsEmpty();
        customerProfile.clickSaveButton();
        cy.waitForElementToVisible(
          locators.administration.toastMsg,
          Cypress.env("waits").mediumWait
        );
        customerProfile.verifyOptionalFieldsAreEmpty();
      });
      it(
        "Attempt to save without enabling Customer Support",
        { tags: "@pd37987" },
        () => {
          // Fill all mandatory fields
          customerProfile.fillMandatoryFields({
            idrssd: testData.idrssd,
          });
          // Ensure Customer Support is disabled
          customerProfile.disableCustomerSupport();
          // Save profile
          customerProfile.clickSaveButton();
          cy.waitForElementToVisible(
            locators.administration.toastMsg,
            Cypress.env("waits").mediumWait
          );
        }
      );
    });
  }
);
