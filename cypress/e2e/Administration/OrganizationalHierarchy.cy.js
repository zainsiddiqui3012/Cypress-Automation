import OrganizationalHierarchy from "../../support/POM/Administration/OrganizationHierarchy";
import SoxPre from "../../fixtures/SoxReview/PreRequisites.json";

import PreRequisites_PO from "../../support/POM/SOXReview_PO/PreRequisites_PO";
import OH from "../../fixtures/Administration/organizationalHierarchy.json";

const BU = new OrganizationalHierarchy();
const pre = new PreRequisites_PO();
describe(
  "Organizational Hierarchy Cases",
  {
    tags: [
      "@regression",
      "@organizational-hierarachy",
      "@pd32058",
      "@predict",
      "@customer-space",
      "@administration",
    ],
  },
  () => {
    context("Add Parent and Child BU", () => {
      beforeEach(() => {
        const ohUser = Cypress.env("USER").ONE_FINANCE;
        cy.loginWithSession(
          "login for Organizational",
          ohUser.username,
          ohUser.password,
          ohUser.key
        );
      });
      it(
        "Verify Cancel discards entered data.",
        { tags: ["@pd30286", "@pd30311"] },
        () => {
          BU.expandOHTree();
          BU.openBU();
          BU.selectMultipleCategories(OH.categories);
          BU.clickCancel();
          BU.openBU();
          BU.clickApplicability();
          BU.verifyDiscardCategory();
        }
      );
      it(
        "Verify that toggling  Show All displays both active and inactive organizational groups.",
        { tags: ["@pd30271", "@smoke"] },
        () => {
          BU.addBU(false);
          BU.clickToggleButton();
          BU.addBU(OH.status.active, false, true, false, false, false);
        }
      );
      it(
        "Verify color selection while adding BU",
        { tags: ["@pd30282", "@smoke"] },
        () => {
          BU.addBU(OH.status.active, false, true);
          cy.reload();
          BU.clickExpandAllBtn();
          BU.clickDialogueExpandBtn();
          BU.openBU(true);
          BU.verifySelectedColor(OH.selectedColor);
        }
      );
      it(
        "Assign Process Owner During editing mode",
        { tags: ["@pd30322"] },
        () => {
          cy.visitOrganizationalHierarchy();
          BU.expandOHTree();
          BU.openBU(true);
          pre.addProcessOwnerEditing();
          BU.clickSaveBtn();
          cy.verifyToastMessageText(OH.updateSuccessMsg, 20000);
        }
      );
      it(
        "Select Single Category from Applicabilty",
        { tags: ["@pd30636"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.selectSingleCategory(OH.singleCategory);
          BU.clickApplicabitySaveBtn();
          BU.openBU(true);
          BU.clickApplicability();
          BU.verifySelectedCategory(OH.singleCategory);
        }
      );
      it(
        "remove Applicability Categories on editing mode ",
        { tags: ["@pd37305"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.unSelectCategory();
        }
      );
      it(
        "update Applicability Categorieson editing mode  ",
        { tags: ["@pd37306"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.selectMultipleCategories(OH.categories);
          BU.clickApplicabitySaveBtn();
        }
      );
      it(
        "Verify that the organizational hierarchy tree can be expanded and collapsed.",
        { tags: ["@pd30272"] },
        () => {
          BU.expandOHTree();
          BU.clickCollapseAllBtn();
        }
      );

      it(
        "Ensure mandatory fields are validated when empty.",
        { tags: ["@pd30273"] },
        () => {
          BU.emptyFieldValidated();
        }
      );
      it("Add new BU group", { tags: ["@pd30274"] }, () => {
        cy.visitOrganizationalHierarchy();
        pre.addBUParent(SoxPre.parentBU, null, null, true);
      });
      it("Assign Process Owner During Add", { tags: ["@pd30284"] }, () => {
        cy.visitOrganizationalHierarchy();
        pre.addProcessOwner();
        BU.clickSaveBtn();
        cy.verifyToastMessageText(OH.saveSuccessMsg, 20000);
      });
      it("Add child BU group", { tags: ["@pd30275"] }, () => {
        cy.visitOrganizationalHierarchy();
        pre.addChildBU(SoxPre.childBUSingle);
      });
      it(
        "Add child BU group on the editing mode",
        { tags: ["@pd37551"] },
        () => {
          cy.visitOrganizationalHierarchy();
          BU.expandOHTree();
          BU.openBU(true);
          pre.editChildBU();
        }
      );
      it(
        "Verify duplicate names are not allowed.",
        { tags: ["@pd30276"] },
        () => {
          cy.visitOrganizationalHierarchy();
          BU.clickAddBtn();
          BU.typeName(OH.duplicateBU);
          BU.clickSaveBtn();
          cy.verifyToastMessageText(OH.duplicateMsg, 50000);
        }
      );

      it(
        "Verify that active groups can be set as inactive.",
        { tags: ["@pd30277"] },
        () => {
          BU.expandOHTree();
          BU.clickToggleButton();
          BU.changeBUStatus(false, true);
        }
      );
      it(
        "Verify that Inactive groups can be set as active.",
        { tags: ["@pd30278"] },
        () => {
          BU.expandOHTree();
          BU.clickToggleButton();
          BU.changeBUStatus(true, false);
        }
      );

      it("Verify edits are saved correctly.", { tags: ["@pd30285"] }, () => {
        cy.visitOrganizationalHierarchy();
        BU.clickExpandAllBtn();
        BU.clickDialogueExpandBtn();
        BU.openBU();
        BU.fillAndSubmitAddBUForm(true, true, true);
        cy.reload();
      });
      it(
        "Verify all functional components in the edit screen.",
        { tags: ["@pd30280"] },
        () => {
          BU.expandOHTree();
          pre.updateChildBU();
          BU.verifyFieldsinEditMode();
        }
      );
      //Temporary Skipping this test case because it was not included on the detailed sheet.
      it.skip(
        "Select Multiple Category from Applicabilty",
        { tags: ["@pd30291"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.selectMultipleCategories(OH.categories);
          BU.clickApplicabitySaveBtn();
          BU.openBU(true);
          BU.clickApplicability();
          OH.categories.forEach((category) => {
            BU.verifySelectedCategory(category);
          });
        }
      );
      it("Verify Add BU with Location/Branches", { tags: ["@pd30283"] }, () => {
        BU.addBU(true, true);
        cy.reload();
        BU.clickExpandAllBtn();
        BU.clickDialogueExpandBtn();
        BU.openBU(true);
        BU.verifySelectedLocation(OH.location);
      });

      /**
       * BU functionality has been chnaged.*/
      it.skip(
        "Verify a group can be set as a business unit.",
        { tags: ["@pd30279"] },
        () => {
          cy.visitOrganizationalHierarchy();
          BU.setBU(true);
          cy.verifyToastMessageText(OH.convertedSuccessMsg, 20000);
        }
      );

      /**
       * issue : Requirements dropdown is not working properly.  ticket number :PD-37548 */
      it.skip(
        "Verify on selecting multiple Category,multiple Requirements are displaying",
        { tags: ["@pd30303"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.selectMultipleRequirements(OH.requirements);
        }
      );

      /**
       * issue : Requirements dropdown is not working properly.  ticket number :PD-37548 */
      it.skip(
        "Verify on selecting single Category,Single Requirement is displaying",
        { tags: ["@pd30302"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.selectRequirement(OH.singleRequirement);
        }
      );
      /**
       * issue : Requirements dropdown is not working properly.  ticket number :PD-37548 */
      it.skip(
        "Verify on deselecting  Category, Requirement should be deselect",
        { tags: ["@pd30304"] },
        () => {
          BU.expandOHTree();
          BU.openBU(true);
          BU.unSelectCategory();
          cy.reload();
          BU.clickExpandAllBtn();
          BU.clickDialogueExpandBtn();
          BU.openBU(true);
          BU.verifyDeSelectRequirements(OH.requirements);
        }
      );
      /**
       * now this is not the part of the requirement. */
      it.skip(
        "Verify that BU is added with QA Test Series OIC,OICG and COC Single officer",
        { tags: ["@pd30637"] },
        () => {
          BU.addBU(
            OH.status.active,
            false,
            false,
            true,
            OH.processOwner,
            OH.single
          );
          BU.verifyAddedQAData();
        }
      );
    });
  }
);
