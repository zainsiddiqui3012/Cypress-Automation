import { KxiGridPage } from '../../../support/POM/KXIModule/Insight/KxISubgrid_PO';

/**
 * KXI Insight SubGrid Test Suite
 *
 * Covers:
 * - Viewing and expanding KXI Sub-Grids
 * - Creating KXIs for Risk Category, Definition, and Instance
 * - Verifying grid states (empty or populated)
 *
 * Tags:
 * - @regression, @kxi-management, @kxi-insights, @predict, @customer
 * - PD-37777 to PD-37856
 * - Release: 5.22
 */
describe('KXI Insight SubGrid Tests', {
  tags: [
    '@regression',
    '@kxi-management',
    '@kxi-insights',
    '@pd37777',
    '@predict',
    '@customer',
  ],
}, () => {
  const kxiGridPage = new KxiGridPage();

  context('EDIT Cases with RM User', { tags: '@withRM' }, () => {
    const withRM = Cypress.env('kxi').customer.withRM;

    /**
     * Logs in as Risk Management user and navigates to Risk Insight before each test.
     */
    beforeEach(() => {
      cy.loginWithSession(
        'login - with Risk Management',
        withRM.username,
        withRM.password,
        withRM.key
      );
      cy.visitkxiRiskInsight();
    });

    /**
     * @testcase PD-37852
     * @description Verifies KXI Sub-Grid displays empty message when no data exists.
     */
    it('View KXI sub-grid with empty data', {
      tags: '@pd37852',
    }, () => {
      kxiGridPage.expandKxiSubGrid();
      kxiGridPage.verifyEmptySubGrid();
    });

    /**
     * @testcase PD-37853
     * @description Ensures users can create a KXI for Risk Category from Sub-Grid.
     */
    it('Verify on KXI Column Sub-Grid users able to create KXI for Risk Category', {
      tags: '@pd37853',
    }, () => {
      kxiGridPage.expandKxiSubGrid();
      kxiGridPage.openCreateKXIForm();
      kxiGridPage.fillKxiForm();
      kxiGridPage.submitKxiForm();
    });

    /**
     * @testcase PD-37854
     * @description Verifies KXI appears in Sub-Grid after creation (Category level).
     */
    it('View the KXI Column Sub-Grid with data', {
      tags: '@pd37854',
    }, () => {
      kxiGridPage.expandKxiSubGrid();
      kxiGridPage.verifyKxiInGrid();
    });

    /**
     * @testcase PD-37855
     * @description Enables KXI creation under specific Risk Definition.
     */
    it('Verify on KXI Column Sub-Grid users able to create KXI for Risk Definition', {
      tags: '@pd37855',
    }, () => {
      kxiGridPage.expandInstanceKxiGrid();
      kxiGridPage.openCreateKXIForm();
      kxiGridPage.fillKxiForm();
      kxiGridPage.submitKxiForm();
    });

    /**
     * @testcase PD-37856
     * @description Checks that KXIs are visible under Definition-level Sub-Grid.
     */
    it('View the (Definition) KXI Column Sub-Grid with data', {
      tags: '@pd37856',
    }, () => {
      kxiGridPage.verifyDefKxiInGrid();
    });

    /**
     * @testcase PD-37856
     * @description Validates that users can create KXI for Risk Instance.
     */
    it('Verify on KXI Column Sub-Grid users able to create KXI for Risk Instance', {
      tags: '@pd38296',
    }, () => {
      kxiGridPage.kxiForRiskInstance();
      kxiGridPage.openCreateKXIForm();
      kxiGridPage.fillKxiForm();
      kxiGridPage.submitKxiForm();
    });

    /**
     * @testcase PD-37856
     * @description Verifies KXIs appear in the Risk Instance Sub-Grid after creation.
     */
    it('View the (Risk Instance) KXI Column Sub-Grid with data', {
      tags: '@pd38297',
    }, () => {
      kxiGridPage.verifyDefKxiInGrid();
    });
  });
});
