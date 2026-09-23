import CustomField from "../../support/POM/Administration/CustomFields";
import data from "../../fixtures/Administration/CustomFields.json";
import locators from "../../fixtures/locators.json";
const customField = new CustomField();

describe(
  "E2E testing of Custom Fields ",
  {
    tags: [
      "@regression",
      "@administration",
      "@custome-fields",
      "@pd32062",
      "@predict",
      "@customer",
    ],
  },

  () => {
    const userLogin = Cypress.env("kxi").customer;
    context("e2e testing Custom Fields", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Verify that the all the Fields accepts valid inputs and saves successfully. ",
        { tags: ["@pd37966", "@pd37967", "@pd37968 ", "@smoke"] },
        () => {
          customField.addField(
            true,
            data.descriptionText,
            true,
            "",
            true,
            data.typeText
          );

          customField.verifyAddedCustomField();
        }
      );
      it("Verify default sorting", { tags: "@pd38018" }, () => {
        customField.getCustomFieldName().then((fieldName) => {
          cy.contains(fieldName, { timeout: 20000 }).should("be.visible");
          customField.clickSortingWithCreatedDate();
          cy.waitForTopMsgLoaderToDisappear(50000);
          cy.get(locators.administration.customFields.customFieldsList).should(
            "contain.text",
            fieldName
          );
        });
      });

      it(
        "Add a Unique Value Field With Duplicate Values",
        { tags: ["@pd37984"] },
        () => {
          customField.addDuplicateName();
        }
      );

      it(
        "Edit the Name to an Empty Value.",
        { tags: ["@pd37989", " @pd38022"] },
        () => {
          customField.editEmptyField();
        }
      );

      it("Edit the Name to an Existing Name", { tags: ["@pd37991"] }, () => {
        customField.updateFieldsWithDuplicateName();
      });
      it("Save Without Making Any Changes.", { tags: ["@pd37993"] }, () => {
        customField.saveWithoutChanges();
      });
      it(
        "Verify data persistence after logout and login",
        { tags: "@pd38304" },
        () => {
          cy.visitProfile();
          cy.logout();
          cy.clearAllSessionStorage();
          customField.sessionLoginAgain();
          cy.visitCustomFields();
          customField.getCustomFieldName().then((fieldName) => {
            customField.verifyDataPersistenceAfterLogin(fieldName);
          });
          Cypress.session.clearAllSavedSessions();
        }
      );
    });

    context("update the custom fields", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Verify Updated date filter functionality",
        { tags: ["@pd38031 "] },
        () => {
          customField.updatedDate();
        }
      );
      it("Verify Updated column values", { tags: "@pd38021" }, () => {
        customField.verifyUpdatedColumnDates();
      });

      it(
        "update the name, checkbox and description  fields successfully",
        { tags: ["@pd37988", "@pd37990", "@pd37973", "@pd37992"] },
        () => {
          customField.updateFields();
        }
      );
      it(
        "Verify that the Name field is mandatory and shows validation errors when left empty.",
        { tags: ["@pd37971"] },
        () => {
          customField.mandatoryFieldEmpty();
        }
      );

      it(
        "Add a Text Field Without Selecting a Field Type",
        { tags: ["@pd37974"] },
        () => {
          customField.addField();
          cy.verifyToastMessageText(data.errorText, 20000).should("be.visible");
        }
      );

      it("Cancel After Making Changes", { tags: ["@pd37994"] }, () => {
        customField.verifyCancelDiscardsChanges();
      });
    });

    context("filter functionality", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Verify Applied On filter functionality and check the apply btn working",
        { tags: ["@pd37995", "@pd38016", "@pd38020"] },
        () => {
          customField.applyFilterButton(true, false);
        }
      );
      it(
        "Verify Applied On , Required and  Type filter with invalid input",
        { tags: ["@pd37996", "@pd37999", "@pd38002"] },
        () => {
          customField.invalidAppliedOnFilter();
        }
      );

      it("Verify Type filter functionality", { tags: ["@pd37998"] }, () => {
        customField.applyFilterButton(false, true);
      });

      it(
        "Verify Required filter functionality",
        { tags: ["@pd38001", "@pd38017 "] },
        () => {
          customField.applyFilterButton(false, false, false, false, false);
          customField.applyFilterButton(false, false, false, true, false);
          customField.applyFilterButton(false, false, false, false, true);
        }
      );

      it(
        "Verify 'Created' date filter functionality",
        { tags: ["@pd38003"] },
        () => {
          customField.applyDateFilter();
        }
      );
      it(
        "Verify combined filter functionality (multiple fields)",
        { tags: ["@pd38004 "] },
        () => {
          customField.applyFilterButton(true, true, false, false, false);
        }
      );

      it("Verify Clear button functionality", { tags: ["@pd38005 "] }, () => {
        customField.applyFiltersThenClear();
      });

      it("Verify Cancel button functionality", { tags: ["@pd38006 "] }, () => {
        customField.cancelButtonDiscardsChanges();
      });
      it(
        "Verify dropdown options for Applied On and Type",
        { tags: ["@pd38009"] },
        () => {
          customField.applyFilterButton(true, true);
        }
      );
    });

    context("sorting and pagination functionality", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Verify filtering and pagination interaction",
        { tags: ["@pd38023", "@pd38013"] },
        () => {
          customField.clickPagination();
        }
      );

      it(
        "Verify the refresh of the list after deletion",
        { tags: ["@pd38019", "@pd38014"] },
        () => {
          customField.deleteFieldAndVerify(true);
        }
      );
      it("Verify Cancel confirmation dialog", { tags: "@pd38015" }, () => {
        customField.deleteFieldAndVerify(false);
      });

      it(
        "Verify sorting functionality on each column",
        { tags: "@pd38305" },
        () => {
          customField.getCustomFieldName().then((fieldName) => {
            customField.verifyFieldAtTopAfterDescendingSort(fieldName);
          });
        }
      );
      it(
        "Verify the display of all columns in the list view",
        { tags: "@pd38012" },
        () => {
          customField.verifyAllColumnsDisplayed();
        }
      );
      it("Verify Cancel button functionality", { tags: "@pd38007" }, () => {
        customField.verifyCancelButtonFunctionality();
      });
      it("Verify empty filter dialog", { tags: "@pd38008" }, () => {
        customField.verifyEmptyFilterDialog();
      });
    });

    context("View Fields in the User Screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it("Add a Text Field to a User screen", { tags: ["@pd38184"] }, () => {
        customField.addCustomField({
          fieldType: data.typeText,
          forOption: data.userText,
          options: [],
        });
        customField.verifyAddedCustomField();
        cy.visitUsers();
        customField.assertionUserScreen();
      });

      it(
        "Add a Multi-Select List to a User screen",
        { tags: ["@pd38189"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.userText,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitUsers();
          customField.assertionUserScreen();
        }
      );

      it(
        "Add a Checkbox Field to a User screen",
        { tags: ["@pd38191"] },
        () => {
          customField.addCustomField({
            fieldType: data.checkBoxType,
            forOption: data.userText,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitUsers();
          customField.assertionUserScreen();
        }
      );
    });
    context("View Fields in the Assement Question Screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Multi-Select List to an Assessment Question screen",
        { tags: ["@pd38279"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.assessmnetQuestionText,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitQuestionBank();
          customField.assertionAssessmentQuestionScreen();
        }
      );
    });
    context("view field in the role screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Date Picker field to the Role screen",
        { tags: ["@pd38193"] },
        () => {
          customField.addCustomField({
            fieldType: data.datePickerText,
            forOption: data.rolesText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRoles();
          customField.assertionRoleScreen();
        }
      );

      it("Add a File field to the Role screen", { tags: ["@pd38194"] }, () => {
        customField.addCustomField({
          fieldType: data.fileFieldText,
          forOption: data.rolesText,
          options: [],
        });
        customField.verifyAddedCustomField();
        cy.visitRoles();
        customField.assertionRoleScreen();
      });

      it(
        "Add a Unique Value field to the Role screen",
        { tags: ["@pd38195"] },
        () => {
          customField.addCustomField({
            fieldType: data.fieldTypeText,
            forOption: data.rolesText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRoles();
          customField.assertionRoleScreen();
        }
      );
    });
    context("view fields in the User Group screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it("Add a Radio Button to a User Group", { tags: ["@pd38261"] }, () => {
        customField.addCustomField({
          fieldType: data.radioText,
          forOption: data.userGroupText,
          options: [data.optionType],
        });
        customField.verifyAddedCustomField();
        cy.visitUserGroup();
        customField.assertionUserGroupScreen();
      });
    });
    context("view field in the OH", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Checkbox to an Organizational Group",
        { tags: ["@pd38263"] },
        () => {
          customField.addCustomField({
            fieldType: data.checkBoxType,
            forOption: data.ohText,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitOrganizationalHierarchy();
          customField.assertionOHScreen();
        }
      );
      it(
        "Add a Radio Button to an Organizational Hierarchy Requirement",
        { tags: ["@pd38264"] },
        () => {
          customField.addCustomField({
            fieldType: data.radioText,
            forOption: data.ohText,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitOrganizationalHierarchy();
          customField.assertionOHScreen();
        }
      );
    });
    context("view field in the Site screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it("Add a Date Picker to a Site screen ", { tags: ["@pd38265"] }, () => {
        customField.addCustomField({
          fieldType: data.typeDatePicker,
          forOption: data.SiteText,
          options: [],
        });
        customField.verifyAddedCustomField();
        cy.visitLocationBranches();
        customField.assertionSiteScreen();
      });
    });
    context("view field in the  Assessment screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Text Field to an Assessment screen",
        { tags: ["@pd38267"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeDatePicker,
            forOption: data.assessmentText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitTemplate();
          customField.assertionAssessmentScreen();
        }
      );
    });
    context("view fields in the Question Bank screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Text Area to a Question Bank screen",
        { tags: ["@pd38269"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeText,
            forOption: data.questionText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitQuestionBank();
          customField.assertionQuestionBankScreen();
        }
      );
    });
    context("view fieds in the risk defination screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a File Field to a Risk Definition screen",
        { tags: ["@pd38282"] },
        () => {
          customField.addCustomField({
            fieldType: data.fileFieldText,
            forOption: data.riskText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskTaxonomies();
          customField.assertionQuestionSurveyScreen();
        }
      );
    });
    context("view field in the control screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it(
        "Add a Text Field to a Control Definition screen",
        { tags: ["@pd38287"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeText,
            forOption: data.controlText,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitControlTaxonomyCS();
          customField.assertionControlDefScreen();
        }
      );

      it(
        "Add a Multi-Select List to a Category/Framework screen",
        { tags: ["@pd38291"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.frameworkDropdown,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitFramework();
          customField.assertionFrameworkScreen();
        }
      );

      it(
        "Add a Multi-Select List to a Control Item screen",
        { tags: ["@pd38295"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.controlItem,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();

          customField.assertionControlItemsScreen();
        }
      );
    });
    context("view field in the kxi screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });
      it("Add a Date Picker to Kxi Data screen", { tags: ["@pd38299"] }, () => {
        customField.addCustomField({
          fieldType: data.datePickerText,
          forOption: data.kxiData,
          options: [],
        });
        customField.verifyAddedCustomField();
        cy.visitkxiData();
        customField.assertionKxiDataScreen();
      });

      it("Add a Radio Button to Kxi Definition", { tags: ["@pd38301"] }, () => {
        customField.addCustomField({
          fieldType: data.radioText,
          forOption: data.kxiDefText,
          options: [data.optionType],
        });
        customField.verifyAddedCustomField();
        cy.visitkxiDef();
        customField.assertionKxiDefScreen();
      });
    });
    context("View Fields in the Risk Screen", () => {
      beforeEach(() => {
        cy.loginWithSession(
          "login with KXI Customer User",
          userLogin.withRM.username,
          userLogin.withRM.password,
          userLogin.withRM.key
        );
        cy.visitCustomFields();
        cy.waitForTopMsgLoaderToDisappear(200000);
      });

      it(
        "Add a Text Field to a Risk Item screen.",
        { tags: ["@pd37969", "@pd37975"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeText,
            forOption: data.riskScreen,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Multi-Select List to a Risk Item screen",
        { tags: ["@pd37976"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.riskScreen,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Multi-Select List Without Selecting Options",
        { tags: ["@pd37977"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeMultiSelect,
            forOption: data.riskScreen,
            options: [],
          });
          cy.verifyToastMessageText(data.errorText, 20000).should("be.visible");
        }
      );

      it(
        "Add a Radio Button to a Risk Item screen",
        { tags: ["@pd37978"] },
        () => {
          customField.addCustomField({
            fieldType: data.radioText,
            forOption: data.riskScreen,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Date Picker to a Risk Item screen",
        { tags: ["@pd37979"] },
        () => {
          customField.addCustomField({
            fieldType: data.datePickerText,
            forOption: data.riskScreen,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a File Field to a Risk Item screen",
        { tags: ["@pd37980"] },
        () => {
          customField.addCustomField({
            fieldType: data.fileFieldText,
            forOption: data.riskScreen,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Unique Value Field to a Risk Item screen",
        { tags: ["@pd37982"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeUniqueValue,
            forOption: data.riskScreen,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Checkbox to a Risk Item screen. ",
        { tags: ["@pd38167"] },
        () => {
          customField.addCustomField({
            fieldType: data.checkBoxType,
            forOption: data.riskScreen,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Single Select List to a Risk Item screen",
        { tags: ["@pd38169"] },
        () => {
          customField.addCustomField({
            fieldType: data.singleText,
            forOption: data.riskScreen,
            options: [data.optionType],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );

      it(
        "Add a Number Field to a Risk Item screen",
        { tags: ["@pd38171"] },
        () => {
          customField.addCustomField({
            fieldType: data.typeNumber,
            forOption: data.riskScreen,
            options: [],
          });
          customField.verifyAddedCustomField();
          cy.visitRiskRegister();
          customField.assertionRiskScreen();
        }
      );
    });
  }
);
