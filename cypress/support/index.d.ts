declare namespace Cypress {
  interface Chainable<Subject> {
    switchToIframe(iframe: any): Chainable<any>;
    switchIframe(iFrame: any): Chainable<any>;

    /**
     * Returns iframe body reference.
     * Prefer findInIframe when Predict360 replaces the iframe DOM.
     */
    switchIframeFresh(iframeSelector: string, timeout?: number): Chainable<JQuery<HTMLBodyElement>>;

    /**
     * findInIframe — Core fix for "subject is no longer attached to the DOM".
     *
     * Runs the full chain (iframe → body → selector) inside one atomic retry loop.
     * Never stores body reference — re-queries fresh DOM on every retry.
     *
     * allowHidden: skip :visible filter for elements hidden by design
     * (e.g. input[type="file"]). Safe because these only exist in Predict360,
     * not in the stale JIRA frame.
     *
     * @example
     * cy.findInIframe('#mytarget', "[name='summary']").type(summary);
     * cy.findInIframe('#mytarget', 'a#key-val').invoke('text').as('ticketId');
     * cy.findInIframe('#mytarget', 'input[type="file"]', 30000, true).attachFile(file);
     */
    findInIframe(
      iframeSelector: string,
      contentSelector: string,
      timeout?: number,
      allowHidden?: boolean
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * iframeReady — Waits until the iframe body is visible, or until a
     * specific element appears inside it.
     *
     * Use after navigation or form submit to confirm iframe has loaded.
     * For value-based checks use iframeContentEquals instead.
     *
     * contentSelector is optional:
     *   - provided → waits for that element to exist
     *   - omitted  → waits for body to be visible only
     *
     * @example
     * cy.iframeReady('#mytarget');                        // body only
     * cy.iframeReady('#mytarget', 'a#key-val');           // specific element
     * cy.iframeReady('#mytarget', null, 60000);           // body with custom timeout
     */
    iframeReady(
      iframeSelector: string,
      contentSelector?: string | null,
      timeout?: number
    ): Chainable<void>;

    /**
     * switchIframeWhenReady — Waits until a heading text appears inside
     * the iframe then returns the body for chaining.
     *
     * Use when Predict360 overrides a JIRA form — heading is the most
     * reliable signal that the override is complete.
     *
     * @example
     * cy.switchIframeWhenReady('#mytarget', 'Create Task').within(() => {
     *   cy.get('#summary').type('My Task');
     * });
     */
    switchIframeWhenReady(
      iframeSelector: string,
      expectedHeading: string,
      timeout?: number
    ): Chainable<JQuery<HTMLBodyElement>>;

    /**
     * iframeContentEquals — Waits until a visible element contains expected text.
     *
     * Solves the stale JIRA frame problem for value checks:
     *   Stale JIRA:   span#status-val = "Open"        (hidden)
     *   Predict360:   span#status-val = "In Progress" (visible)
     *
     * :visible filter ensures stale hidden elements are always skipped.
     * Use after every workflow transition to confirm status changed.
     *
     * @example
     * cy.iframeContentEquals('#mytarget', 'span#status-val', 'In Progress');
     * cy.iframeContentEquals('#mytarget', 'a#key-val', 'BCUS-');
     * cy.iframeContentEquals('#mytarget', 'span#assignee-val', 'John Smith');
     */
    iframeContentEquals(
      iframeSelector: string,
      elementSelector: string,
      expectedText: string,
      timeout?: number
    ): Chainable<void>;

    /**
     * iframeContentExact — Same as iframeContentEquals but requires exact
     * trimmed text match. Use when partial match could cause false positives.
     *
     * @example
     * cy.iframeContentExact('#mytarget', '#status-val', 'In Progress');
     * // "In Progress (2 of 3)" would NOT pass — only exact "In Progress" passes
     */
    iframeContentExact(
      iframeSelector: string,
      elementSelector: string,
      expectedText: string,
      timeout?: number
    ): Chainable<void>;

    /**
     * iframeContentGone — Waits until an element no longer contains stale text.
     *
     * Use when you want to confirm an old value has been replaced before
     * interacting with the element again.
     *
     * @example
     * cy.iframeContentGone('#mytarget', '#status-val', 'Open');
     * // Passes once "Open" is gone — safe to assert new status now
     */
    iframeContentGone(
      iframeSelector: string,
      elementSelector: string,
      staleText: string,
      timeout?: number
    ): Chainable<void>;

    waitForElementToVisible(locator: any, timeInMilSec: any): Chainable<any>;
    waitForElementToVisible_XPath(locator: any, timeInMilSec: any): Chainable<any>;
    login(userName: any, password: any, key: any): Chainable<any>;
    logout(): Chainable<any>;
    clickMainMenuItem(menuItemText: any): Chainable<any>;
    clickSubMenuItem(menuItemText: any, subMenuItemText: any): Chainable<any>;
    waitForMyGridLoaderToDisappear(timeInMilSec: any): Chainable<any>;
    waitForApplicabilityLoaderToDisappear(timeInMilSec: any): Chainable<any>;
    waitForOverlayLoaderToDisappear(timeInMilSec: any): Chainable<any>;
    waitForTopMsgLoaderToDisappear(timeInMilSec: any): Chainable<any>;
    waitUntilLoaderNotVisible(timeInMilSec: any): Chainable<any>;
    verifyToastMessageText(msg: any, maxTimeout: any): Chainable<any>;
    createRandomString(length: any): Chainable<any>;
    createRandomAlphaNumeric(length: any): Chainable<any>;
    waitForToastMessageToDisappear(maxTimeout: any): Chainable<any>;
    addRiskCategory(riskCategoryID: any, categoryName: any, categoryDescription: any): Chainable<any>;
    addRiskDefinition(riskDefinitionID: any, definitionName: any, definitionDescription: any, categoryName: any): Chainable<any>;
    visitProfile(): Chainable<any>;
    visitkxiDef(): Chainable<any>;
    visitkxiData(): Chainable<any>;
    visitRiskTaxonomyLibraries(): Chainable<any>;
    visitkxiInsight(): Chainable<any>;
    visitkxiRiskInsight(): Chainable<any>;
    visitkxiDataEntry(): Chainable<any>;
    visitRiskAppetite(): Chainable<any>;
    visitRiskTaxonomies(): Chainable<any>;
    clearAllFileUploadCache(): Chainable<any>;
    visitRiskRegister(): Chainable<any>;
    visitOrganizationalHierarchy(): Chainable<any>;
    verifyText(locator: string, statusData: any): Chainable<any>;
    saveSessionState(): Chainable<any>;
    restoreSessionState(): Chainable<any>;
    restoreLocalStorage(): Chainable<any>;
    restoreSessionStorage(): Chainable<any>;
    ignoreNetworkLogs(): Chainable<any>;

    /**
     * cmsWaitForIframe — Waits until an element is visible inside the CMS iframe.
     * Semantic alias for findInIframe — use before clicking any workflow button.
     *
     * Do NOT pass jQuery pseudo-selectors like :contains().
     * For text-value checks use iframeContentEquals instead.
     *
     * @example
     * cy.cmsWaitForIframe('#action_id_11', 150000); // wait for Accept button
     * cy.cmsWaitForIframe('#action_id_71', 25000);  // wait for Close button
     */
    cmsWaitForIframe(
      contentSelector: string,
      timeout?: number,
      iframeSelector?: string
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * cmsTransition — Handles all CMS JIRA workflow transitions.
     *
     * Three modes:
     *   1. Direct    — click button → wait for status (no dialog)
     *   2. Comment   — click → type comment in textarea → submit → wait
     *   3. Assert    — pass null as actionSelector → only check status
     *
     * @param actionSelector  Button ID e.g. '#action_id_4'. null = assert only.
     * @param expectedStatus  Text expected in #status-val after transition.
     * @param comment         Provide for Mode 2. Omit for direct transitions.
     * @param iframeSelector  Default: '#mytarget'
     * @param timeout         Max ms for status assertion. Default: 75000
     *
     * @example
     * cy.cmsTransition('#action_id_4', 'In Progress');
     * cy.cmsTransition('#action_id_2', 'Closed', 'Closing via automation');
     * cy.cmsTransition(null, 'Open');
     */
    cmsTransition(
      actionSelector: string | null,
      expectedStatus: string,
      comment?: string,
      iframeSelector?: string,
      timeout?: number,
      onlySubmit?: boolean
    ): Chainable<void>;

    /**
     * cmsTinyMceDialog — Handles workflow transitions that open a TinyMCE
     * rich text comment dialog.
     *
     * Use instead of cmsTransition when the dialog uses TinyMCE (not textarea#comment).
     * Waits for #mce_0_ifr as the "dialog ready" signal, drills into the nested
     * TinyMCE iframe, types the comment, submits, then confirms status.
     *
     * Transitions that use TinyMCE: Accept, Resolve, Accept & Close, Return to Owner.
     *
     * @example
     * cy.cmsTinyMceDialog('Acceptance comment', 'In Process', 120000);
     * cy.cmsTinyMceDialog('Resolve comment', 'Resolved', 30000);
     * cy.cmsTinyMceDialog('Closing subtask', 'Closed', 30000);
     */
    cmsTinyMceDialog(
      comment: string,
      expectedStatus: string,
      timeout?: number,
      iframeSelector?: string
    ): Chainable<void>;

    /**
     * cmsClickInIframe — Clicks a button inside the CMS iframe by visible text.
     *
     * Use when a button has no unique ID and can only be identified by text,
     * e.g. opsbar buttons like "Start Progress", "Return to Owner", "Resolve".
     *
     * Fixes the detached-element crash from chaining .contains() after findInIframe.
     * Re-queries the live DOM atomically on every retry — no snapshot stored.
     * :visible filter ensures stale JIRA buttons are always skipped.
     *
     * @param containerSelector  Parent container e.g. '#opsbar-opsbar-transitions > a'
     * @param buttonText         Exact visible text of the button to click
     * @param timeout            Default: 60000
     * @param iframeSelector     Default: '#mytarget'
     *
     * @example
     * cy.cmsClickInIframe('#opsbar-opsbar-transitions > a', 'Start Progress');
     * cy.cmsClickInIframe('#opsbar-opsbar-transitions > a', 'Return to Owner', 30000);
     */
    cmsClickInIframe(
      containerSelector: string,
      buttonText: string,
      timeout?: number,
      iframeSelector?: string
    ): Chainable<void>;

    /**
     * cmsCreateSubtask — Fills and submits the Create Action Plan subtask form,
     * then saves the new ticket ID to a file for use by subsequent tests.
     *
     * Handles two non-trivial problems automatically:
     *   1. Dialog scroll: Issue Type field goes off-screen after TinyMCE interaction.
     *      Native scrollIntoView() is called to bring it back before interaction.
     *   2. Subtask link unreachable: link sits at 1164px inside a 659px iframe.
     *      Reads href from DOM directly and sets contentWindow.location.href
     *      for instant navigation — no scroll needed.
     *
     * @param summary
     * @param description      Typed into TinyMCE editor
     * @param priority         e.g. 'Low', 'High'
     * @param site             Site name for Select2 field
     * @param subtaskFile      File path to write the new ticket ID
     * @param iframeSelector   Default: '#mytarget'
     * @param timeout          Wait for Create Action Plan button. Default: 150000
     *
     * @example
     * cy.cmsCreateSubtask(
     *   'Action Plan for automation',
     *   'Description text',
     *   'Low',
     *   'BCUS Site A',
     *   'cypress/fixtures/CMSIssue/TicketIdSubtaskSingle.txt'
     * );
     */
    cmsCreateSubtask(
      summary: string,
      description: string,
      priority: string,
      site: string,
      subtaskFile: string,
      iframeSelector?: string,
      timeout?: number
    ): Chainable<void>;
  }
}
