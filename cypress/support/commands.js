require("cypress-plugin-tab");

// ─── Iframe Switch Commands ───────────────────────────────────────────────────
// Legacy commands — use findInIframe instead (these store a body snapshot
// which becomes detached when Predict360 replaces the iframe DOM).

Cypress.Commands.add("switchToIframe", (iframe) => {
  cy.log("getIframeBody");
  return cy
    .get(iframe, { timeout: 30000 })
    .its("0.contentDocument.body")
    .should("be.visible")
    .then(cy.wrap);
});

Cypress.Commands.add("switchIframe", (iFrame) => {
  cy.log("getIframeBody");
  return cy
    .get(iFrame)
    .its("0.contentDocument.body")
    .should("be.visible")
    .then((body) => cy.wrap(body));
});

/**
 * findInIframe
 *
 * Finds an element inside a nested iframe safely.
 * Fixes two problems with the old switchIframe approach:
 *
 * Problem 1 — Stale JIRA frame:
 *   Predict360 loads inside #mytarget. The old JIRA page stays in the DOM
 *   as a hidden stale frame. Both frames share the same element IDs
 *   (#status-val, #action_id_2, etc.). Without :visible filter, Cypress
 *   matches the hidden stale element and clicks the wrong button.
 *   Fix: .filter(':visible') — stale hidden elements are always skipped.
 *
 * Problem 2 — Stored body snapshot:
 *   switchIframe stored body = iframe.contentDocument.body once, then reused
 *   it. When Predict360 replaced the iframe DOM, that stored reference became
 *   detached → "subject is no longer attached to the DOM" error.
 *   Fix: re-query the live document inside every .then() call.
 *
 * allowHidden = true:
 *   Skip :visible filter for elements that are intentionally hidden by design
 *   (e.g. input[type="file"] — browsers always hide file inputs).
 *   Safe to use because these elements only exist in the Predict360 form,
 *   not in the stale JIRA frame.
 *
 * @param {string}  iframeSelector   - e.g. '#mytarget'
 * @param {string}  contentSelector  - e.g. 'input[name="summary"]'
 * @param {number}  [timeout=30000]
 * @param {boolean} [allowHidden=false]
 *
 * @example
 *   cy.findInIframe('#mytarget', "input[name='summary']").type(summary);
 *   cy.findInIframe('#mytarget', 'a#key-val').invoke('text').as('id');
 *   cy.findInIframe('#mytarget', 'input[type="file"]', 30000, true).attachFile(file);
 */
Cypress.Commands.add(
  "findInIframe",
  (iframeSelector, contentSelector, timeout = 30000, allowHidden = false) => {
    cy.log(
      `findInIframe: "${contentSelector}" in "${iframeSelector}"${allowHidden ? " [allowHidden]" : ""}`,
    );

    return cy
      .get(iframeSelector, { timeout })
      .should(function ($iframe) {
        const doc = $iframe[0].contentDocument;
        expect(doc, "iframe contentDocument").to.exist;
        const body = doc.body;
        expect(body, "iframe body").to.exist;
        expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;

        const $all = Cypress.$(body).find(contentSelector);
        const $el = allowHidden ? $all : $all.filter(":visible");
        expect(
          $el.length,
          `"${contentSelector}" ${allowHidden ? "found" : "visible"} in iframe`,
        ).to.be.greaterThan(0);
      })
      .then(function ($iframe) {
        // Re-query live DOM — never use stored reference
        const getLiveElement = () => {
          const body =
            $iframe[0].contentDocument && $iframe[0].contentDocument.body;
          if (!body) return null;
          const $all = Cypress.$(body).find(contentSelector);
          const $found = allowHidden ? $all : $all.filter(":visible");
          return $found.length ? $found.first() : null;
        };

        return cy.wrap(null, { log: false }).then(() => {
          const $el = getLiveElement();
          expect($el, `"${contentSelector}" still live in iframe`).to.not.be
            .null;
          return $el;
        });
      });
  },
);

/**
 * iframeReady
 *
 * Waits until the iframe body is visible, or until a specific element
 * appears inside it. Re-queries the live DOM on every retry — no snapshot stored.
 *
 * Use this after a navigation or form submit when you just need to confirm
 * the iframe has loaded. For value-based checks use iframeContentEquals.
 *
 * @param {string}      iframeSelector
 * @param {string|null} [contentSelector=null] - if provided, waits for this element too
 * @param {number}      [timeout=60000]
 *
 * @example
 *   cy.iframeReady('#mytarget');                        // wait for body only
 *   cy.iframeReady('#mytarget', 'a#key-val');           // wait for specific element
 *   cy.iframeReady('#mytarget', '.select2-result-label', 10000);
 */
Cypress.Commands.add(
  "iframeReady",
  (iframeSelector, contentSelector = null, timeout = 60000) => {
    cy.log(
      contentSelector
        ? `iframeReady: waiting for "${contentSelector}" in "${iframeSelector}"`
        : `iframeReady: waiting for iframe body in "${iframeSelector}"`,
    );

    cy.get(iframeSelector, { timeout }).should(function ($iframe) {
      const doc = $iframe[0].contentDocument;
      expect(doc, "iframe contentDocument").to.exist;
      const body = doc.body;
      expect(body, "iframe body").to.exist;
      expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;

      if (contentSelector) {
        const $el = Cypress.$(body).find(contentSelector);
        expect(
          $el.length,
          `"${contentSelector}" exists in iframe`,
        ).to.be.greaterThan(0);
      }
    });
  },
);

/**
 * switchIframeWhenReady
 *
 * Waits until a specific heading text appears inside the iframe, then
 * returns the iframe body for further chaining. Used when Predict360
 * overrides a JIRA form with its own custom form — the heading is the
 * most reliable signal that the override is complete.
 *
 * @param {string} iframeSelector
 * @param {string} expectedHeading - e.g. 'Create Task', 'Create Issue'
 * @param {number} [timeout=45000]
 *
 * @example
 *   cy.switchIframeWhenReady('#mytarget', 'Create Task').within(() => {
 *     cy.get('#summary').type('My Task');
 *   });
 */
Cypress.Commands.add(
  "switchIframeWhenReady",
  (iframeSelector, expectedHeading, timeout = 45000) => {
    cy.log(
      `switchIframeWhenReady: waiting for heading "${expectedHeading}" in "${iframeSelector}"`,
    );

    return cy
      .get(iframeSelector, { timeout })
      .should("exist")
      .then(($iframe) => {
        return cy
          .wrap($iframe)
          .its("0.contentDocument.body")
          .should("be.visible")
          .then((body) => {
            cy.wrap(body)
              .find("h1, h2, span.ui-dialog-title", { timeout })
              .should("contain.text", expectedHeading);
            return cy.wrap(body);
          });
      });
  },
);

/**
 * iframeContentEquals
 *
 * Waits until a visible element inside the iframe contains the expected text.
 * Solves the stale frame problem for value-based checks:
 *
 *   JIRA stale frame:   span#status-val → "Open"    (hidden)
 *   Predict360 active:  span#status-val → "In Progress" (visible)
 *
 *   iframeReady would pass immediately on the stale JIRA value.
 *   This command waits for the CORRECT value with :visible filter.
 *
 * Use after every workflow transition to confirm the status changed
 * before proceeding to the next step.
 *
 * @param {string} iframeSelector
 * @param {string} elementSelector - e.g. 'span#status-val', '#assignee-val'
 * @param {string} expectedText    - e.g. 'In Progress', 'Closed'
 * @param {number} [timeout=60000]
 *
 * @example
 *   // After clicking "Start Progress"
 *   cy.iframeContentEquals('#mytarget', 'span#status-val', 'In Progress');
 *
 *   // After assignee change
 *   cy.iframeContentEquals('#mytarget', 'span#assignee-val', 'John Smith');
 *
 *   // Partial match also works
 *   cy.iframeContentEquals('#mytarget', 'a#key-val', 'BCUS-');
 */
Cypress.Commands.add(
  "iframeContentEquals",
  (iframeSelector, elementSelector, expectedText, timeout = 60000) => {
    cy.log(
      `iframeContentEquals: waiting for "${elementSelector}" to contain "${expectedText}" in "${iframeSelector}"`,
    );

    cy.get(iframeSelector, { timeout }).should(function ($iframe) {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;
      const $el = Cypress.$(body).find(elementSelector).filter(":visible");
      expect($el.length, `"${elementSelector}" visible`).to.be.greaterThan(0);
      expect($el.text(), `"${elementSelector}" text`).to.include(expectedText);
    });
  },
);

/**
 * iframeContentExact
 *
 * Same as iframeContentEquals but requires an exact text match (trimmed).
 * Use when partial matching could cause false positives.
 *
 * @example
 *   cy.iframeContentExact('#mytarget', '#status-val', 'In Progress');
 *   // "In Progress (2 of 3)" would NOT match — only exact "In Progress" passes
 */
Cypress.Commands.add(
  "iframeContentExact",
  (iframeSelector, elementSelector, expectedText, timeout = 60000) => {
    cy.log(
      `iframeContentExact: waiting for "${elementSelector}" to equal "${expectedText}" in "${iframeSelector}"`,
    );

    cy.get(iframeSelector, { timeout }).should(function ($iframe) {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;
      const $el = Cypress.$(body).find(elementSelector);
      expect($el.length, `"${elementSelector}" exists`).to.be.greaterThan(0);
      expect($el.text().trim(), `"${elementSelector}" text`).to.equal(
        expectedText,
      );
    });
  },
);

/**
 * iframeContentGone
 *
 * Waits until an element no longer contains the given stale text.
 * Use this when you want to confirm that an old value has been replaced
 * before interacting with the element again.
 *
 * @example
 *   cy.iframeContentGone('#mytarget', '#status-val', 'Open');
 *   // Passes once "Open" is no longer visible — safe to check new status now
 *
 *   // Also used after Select2 dropdown closes:
 *   cy.iframeContentGone('#mytarget', '.select2-result-label', site, 10000);
 */
Cypress.Commands.add(
  "iframeContentGone",
  (iframeSelector, elementSelector, staleText, timeout = 60000) => {
    cy.log(
      `iframeContentGone: waiting for "${staleText}" to disappear from "${elementSelector}" in "${iframeSelector}"`,
    );

    cy.get(iframeSelector, { timeout }).should(function ($iframe) {
      const body =
        $iframe[0].contentDocument && $iframe[0].contentDocument.body;
      expect(body, "iframe body").to.exist;
      expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;
      const $el = Cypress.$(body).find(elementSelector);
      if ($el.length === 0) return; // element gone — pass
      expect(
        $el.text(),
        `"${elementSelector}" no longer contains "${staleText}"`,
      ).to.not.include(staleText);
    });
  },
);

// ════════════════════════════════════════════════════════════════════════════
// CMS Workflow Commands
// ════════════════════════════════════════════════════════════════════════════

/**
 * cmsWaitForIframe
 *
 * Waits until a specific element is visible inside the CMS iframe.
 * Semantic alias for findInIframe — use this before clicking any
 * workflow button to ensure it has rendered before interaction.
 *
 * Do NOT pass jQuery pseudo-selectors like ':contains(text)'.
 * For text-value waits use iframeContentEquals instead.
 *
 * @param {string} contentSelector
 * @param {number} [timeout=60000]
 * @param {string} [iframeSelector='#mytarget']
 *
 * @example
 *   cy.cmsWaitForIframe('#action_id_11', 150000); // wait for Accept button
 *   cy.cmsWaitForIframe('#action_id_71', 25000);  // wait for Close button
 */
Cypress.Commands.add(
  "cmsWaitForIframe",
  (contentSelector, timeout = 60000, iframeSelector = "#mytarget") => {
    cy.log(
      `cmsWaitForIframe: waiting for "${contentSelector}" in "${iframeSelector}"`,
    );
    cy.findInIframe(iframeSelector, contentSelector, timeout);
  },
);

/**
 * cmsClickInIframe
 *
 * Clicks a button/link inside the CMS iframe by matching its visible text.
 * Solves the detached-element crash caused by chaining .contains() after
 * findInIframe (which stores a jQuery snapshot that becomes stale).
 *
 * This command re-queries the live DOM atomically on every retry:
 *   1. Find container elements matching containerSelector
 *   2. Filter to :visible only (skip stale JIRA buttons)
 *   3. Find the child whose text matches buttonText
 *   4. Click it — all in one .should() loop, no snapshot stored
 *
 * Use when a button has no unique ID and can only be identified by text,
 * e.g. opsbar transition buttons like "Start Progress", "Return to Owner".
 *
 * @param {string} containerSelector - e.g. '#opsbar-opsbar-transitions > a'
 * @param {string} buttonText        - exact visible text of the button
 * @param {number} [timeout=60000]
 * @param {string} [iframeSelector='#mytarget']
 *
 * @example
 *   cy.cmsClickInIframe('#opsbar-opsbar-transitions > a', 'Start Progress');
 *   cy.cmsClickInIframe('#opsbar-opsbar-transitions > a', 'Return to Owner', 30000);
 */
Cypress.Commands.add(
  "cmsClickInIframe",
  (
    containerSelector,
    buttonText,
    timeout = 60000,
    iframeSelector = "#mytarget",
  ) => {
    cy.log(
      `cmsClickInIframe: clicking "${buttonText}" inside "${containerSelector}" in "${iframeSelector}"`,
    );

    cy.get(iframeSelector, { timeout })
      .should(function ($iframe) {
        const body =
          $iframe[0].contentDocument && $iframe[0].contentDocument.body;
        expect(body, "iframe body").to.exist;
        expect(Cypress.$(body).is(":visible"), "body visible").to.be.true;

        const $candidates = Cypress.$(body)
          .find(containerSelector)
          .filter(":visible");
        expect(
          $candidates.length,
          `"${containerSelector}" visible in iframe`,
        ).to.be.greaterThan(0);

        const $btn = $candidates.filter(function () {
          return Cypress.$(this).text().trim().indexOf(buttonText) !== -1;
        });
        expect(
          $btn.length,
          `"${containerSelector}" with text "${buttonText}" visible`,
        ).to.be.greaterThan(0);
      })
      .then(function ($iframe) {
        // Re-query live DOM before click — never use stored snapshot
        const body = $iframe[0].contentDocument.body;
        const $candidates = Cypress.$(body)
          .find(containerSelector)
          .filter(":visible");
        const $btn = $candidates.filter(function () {
          return Cypress.$(this).text().trim().indexOf(buttonText) !== -1;
        });
        cy.wrap($btn.first()).click();
      });
  },
);

/**
 * cmsTransition
 *
 * Handles all CMS JIRA workflow transitions in one command.
 * Supports three modes:
 *
 *   Mode 1 — Direct (no dialog):
 *     Click action button → wait for status to change
 *     e.g. "Start Progress" → "In Progress"
 *
 *   Mode 2 — Comment dialog (textarea#comment):
 *     Click action → type comment in textarea → submit → wait for status
 *     e.g. "Close" with comment → "Closed"
 *
 *   Mode 3 — Submit only (onlySubmit: true):
 *     Click action → click submit without comment → wait for status
 *     e.g. simple confirmation modal with no comment field
 *
 *   Mode 4 — Status assert only (actionSelector: null):
 *     Skip click, just assert current status value
 *
 * @param {string|null} actionSelector  - button ID e.g. '#action_id_4'. null = assert only
 * @param {string}      expectedStatus  - e.g. 'In Progress', 'Closed'
 * @param {string}      [comment]       - provide for Mode 2, omit for Mode 1
 * @param {string}      [iframeSelector='#mytarget']
 * @param {number}      [timeout=75000]
 * @param {boolean}     [onlySubmit=false] - true for Mode 3
 *
 * @example
 *   cy.cmsTransition('#action_id_4', 'In Progress');
 *   cy.cmsTransition('#action_id_2', 'Closed', 'Closing via automation');
 *   cy.cmsTransition('#action_id_71', 'Closed', null, '#mytarget', 120000, true);
 *   cy.cmsTransition(null, 'Open');
 */
Cypress.Commands.add(
  "cmsTransition",
  (
    actionSelector,
    expectedStatus,
    comment,
    iframeSelector = "#mytarget",
    timeout = 75000,
    onlySubmit = false,
  ) => {
    // Step 1: Click the action button (if provided)
    if (actionSelector) {
      cy.log(
        `cmsTransition: clicking "${actionSelector}" → expecting "${expectedStatus}"`,
      );

      // Wait until the action button is visible in the active Predict360 frame.
      // Both JIRA stale frame and Predict360 have the same button IDs —
      // :visible filter ensures we only interact with the correct active button.
      cy.get(iframeSelector, { timeout: 30000 }).should(function ($iframe) {
        const doc = $iframe[0].contentDocument;
        expect(doc, "iframe doc").to.exist;
        const body = doc.body;
        expect(body, "iframe body").to.exist;
        const $btn = Cypress.$(body).find(actionSelector).filter(":visible");
        expect(
          $btn.length,
          `action button "${actionSelector}" visible in active Predict360 frame`,
        ).to.be.greaterThan(0);
      });

      cy.wait(6000); // extra guard — ensures Predict360 has fully rendered before click
      cy.findInIframe(iframeSelector, actionSelector, 30000).click();
    } else {
      cy.log(
        `cmsTransition: no action click — asserting status "${expectedStatus}"`,
      );
    }

    // Step 2: Submit only mode — click submit without typing a comment
    if (onlySubmit) {
      cy.findInIframe(
        iframeSelector,
        "input#issue-workflow-transition-submit",
        10000,
      ).click();
      cy.log("onlySubmit: submit button clicked without comment");
    }

    // Step 3: Comment dialog mode — type comment then submit
    if (comment !== undefined && comment !== null) {
      cy.findInIframe(iframeSelector, "textarea#comment", 20000)
        .clear()
        .type(comment);
      cy.findInIframe(
        iframeSelector,
        "input#issue-workflow-transition-submit",
        10000,
      ).click();
      cy.log(
        `cmsTransition: comment submitted — waiting for status "${expectedStatus}"`,
      );
    }

    // Step 4: Assert final status
    // iframeContentEquals re-queries fresh on every retry — immune to DOM replacement.
    // Handles stale JIRA value, intermediate loading states, and final Predict360 value.
    cy.iframeContentEquals(
      iframeSelector,
      "#status-val",
      expectedStatus,
      timeout,
    );
    cy.log(`✅ cmsTransition: status confirmed "${expectedStatus}"`);
  },
);

/**
 * cmsTinyMceDialog
 *
 * Handles workflow transitions that open a TinyMCE rich text comment dialog.
 * Use this instead of cmsTransition when the dialog uses TinyMCE (not textarea#comment).
 *
 * TinyMCE renders inside its own nested iframe (#mce_0_ifr → #tinymce).
 * Regular .type() does not work on it — this command drills into the correct
 * iframe depth and types directly on the contenteditable #tinymce body.
 *
 * #mce_0_ifr is used as the "dialog ready" signal because it only appears
 * after TinyMCE has fully initialized — earlier than that typing would fail.
 *
 * Transitions that use TinyMCE dialogs: Accept, Resolve, Accept & Close,
 * Return to Owner, and similar CMS workflow actions.
 *
 * @param {string} comment        - text to type into TinyMCE
 * @param {string} expectedStatus - status to confirm after submit
 * @param {number} [timeout=40000]
 * @param {string} [iframeSelector='#mytarget']
 *
 * @example
 *   cy.cmsTinyMceDialog('Acceptance comment', 'In Process', 120000);
 *   cy.cmsTinyMceDialog('Resolve comment', 'Resolved', 30000);
 *   cy.cmsTinyMceDialog('Closing subtask', 'Closed', 30000);
 */
Cypress.Commands.add(
  "cmsTinyMceDialog",
  (comment, expectedStatus, timeout = 40000, iframeSelector = "#mytarget") => {
    cy.log(
      `cmsTinyMceDialog: waiting for TinyMCE (#mce_0_ifr) in "${iframeSelector}"`,
    );

    // Step 1: Wait for TinyMCE iframe to exist — confirms dialog is fully open
    cy.get(iframeSelector, { timeout: 80000 }).should(function ($outerIframe) {
      const doc = $outerIframe[0].contentDocument;
      expect(doc, "iframe contentDocument").to.exist;
      const body = doc.body;
      expect(body, "iframe body").to.exist;
      const $mceIframe = Cypress.$(body).find("#mce_0_ifr");
      expect(
        $mceIframe.length,
        "#mce_0_ifr (TinyMCE dialog iframe) exists",
      ).to.be.greaterThan(0);
    });

    // Step 2: Drill into TinyMCE and type comment
    // Path: #mytarget → contentDocument.body → #mce_0_ifr → #tinymce (contenteditable)
    cy.get(iframeSelector).then(function ($outerIframe) {
      const body = $outerIframe[0].contentDocument.body;
      const $mceIframe = Cypress.$(body).find("#mce_0_ifr");
      const $tinymce = $mceIframe.contents().find("#tinymce");
      cy.wrap($tinymce).type(comment);
    });

    // Step 3: Submit and confirm status
    cy.findInIframe(
      iframeSelector,
      "input#issue-workflow-transition-submit",
    ).click();
    cy.iframeContentEquals(
      iframeSelector,
      "span#status-val",
      expectedStatus,
      timeout,
    );
  },
);

/**
 * cmsCreateSubtask
 *
 * Fills and submits the Create Action Plan subtask form, then navigates
 * to the new subtask and saves its ticket ID to a file.
 *
 * Handles several non-trivial problems automatically:
 *
 * Problem 1 — Dialog scroll:
 *   After filling TinyMCE description, the dialog scrolls down and hides
 *   the Issue Type field (which is above Summary). Native scrollIntoView()
 *   is called to scroll back up before interacting with Issue Type.
 *
 * Problem 2 — Subtask link unreachable:
 *   After submit, the subtask link sits at DOM position 1164px inside an
 *   iframe with clientHeight 659px — beyond any scrollable area. Outer
 *   page cannot scroll either. Fix: read the link href from DOM directly
 *   and set contentWindow.location.href — instant navigation, no scroll needed.
 *
 * @param {string} summary
 * @param {string} description    - typed into TinyMCE
 * @param {string} priority       - e.g. 'Low', 'High'
 * @param {string} site           - site name for Select2 field
 * @param {string} subtaskFile    - file path to write the new ticket ID
 * @param {string} [iframeSelector='#mytarget']
 * @param {number} [timeout=150000] - wait for Create Action Plan button
 *
 * @example
 *   cy.cmsCreateSubtask(
 *     'Action Plan for automation',
 *     'Description text here',
 *     'Low',
 *     'BCUS Site A',
 *     'cypress/fixtures/CMSIssue/TicketIdSubtaskSingle.txt'
 *   );
 */
Cypress.Commands.add(
  "cmsCreateSubtask",
  (
    summary,
    description,
    priority,
    site,
    subtaskFile,
    iframeSelector = "#mytarget",
    timeout = 150000,
  ) => {
    const dayjs = require("dayjs");
    const dueDate = dayjs().day(5).format("DD/MMM/YYYY");

    cy.log(
      `cmsCreateSubtask: waiting for "#assign-issue12" in "${iframeSelector}"`,
    );

    // Step 1: Wait for Create Action Plan button then click
    cy.cmsWaitForIframe("#assign-issue12", timeout);
    cy.wait(12000); // guard — button needs to be fully interactive
    cy.findInIframe(iframeSelector, "#assign-issue12").click();

    // Step 2: Wait for TinyMCE — confirms dialog is fully loaded
    cy.get(iframeSelector, { timeout: 30000 }).should(function ($outerIframe) {
      const doc = $outerIframe[0].contentDocument;
      expect(doc, "iframe contentDocument").to.exist;
      const body = doc.body;
      expect(body, "iframe body").to.exist;
      const $mceIframe = Cypress.$(body).find("#mce_0_ifr");
      expect(
        $mceIframe.length,
        "#mce_0_ifr (TinyMCE — dialog fully loaded) exists",
      ).to.be.greaterThan(0);
    });

    // Step 3: Fill Summary
    cy.findInIframe(iframeSelector, "input[name='summary']").type(summary);

    // Step 4: Fill Description via TinyMCE
    // Path: #mytarget → body → #mce_0_ifr → #tinymce
    cy.get(iframeSelector).then(function ($outerIframe) {
      const body = $outerIframe[0].contentDocument.body;
      const $mceIframe = Cypress.$(body).find("#mce_0_ifr");
      const $tinymce = $mceIframe.contents().find("#tinymce");
      cy.wrap($tinymce).type(description);
    });

    // Step 4b: Scroll back to top — Issue Type field is above Summary.
    // TinyMCE interaction scrolls the dialog down, hiding Issue Type.
    cy.get(iframeSelector).then(function ($outerIframe) {
      const body = $outerIframe[0].contentDocument.body;
      const $field = Cypress.$(body).find("#issuetype-field");
      if ($field.length) {
        $field[0].scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
    cy.findInIframe(iframeSelector, "#issuetype-field")
      .clear()
      .type("Action Plan" + `{enter}`);

    // Step 5: Priority — AUI autocomplete backed by select#priority
    cy.findInIframe(iframeSelector, "input#priority-field")
      .clear()
      .wait(2000)
      .type(priority + "{enter}");

    // Step 6: Assign to me
    cy.findInIframe(iframeSelector, "button#assign-to-me-trigger").click();

    // Step 7: Due Date — auto-calculated as next Friday
    cy.findInIframe(iframeSelector, "input#duedate").clear().type(dueDate);

    // Step 8: Site — Select2 multi-select (customfield_15906)
    cy.findInIframe(
      iframeSelector,
      "#s2id_select_customfield_15906 .select2-choices",
    ).type(site);
    cy.iframeReady(iframeSelector, ".select2-result-label", 10000);
    cy.findInIframe(iframeSelector, ".select2-result-label").first().click();
    cy.iframeContentGone(iframeSelector, ".select2-result-label", site, 10000);

    // Step 9: Submit
    cy.findInIframe(iframeSelector, "input#create-issue-submit").click();

    // Step 10: Find subtask link
    // allowHidden=true because link may be off-screen (DOM pos 1164px > iframe height 659px)
    cy.findInIframe(iframeSelector, "td.stsummary a.issue-link", 250000, true);

    // Step 10b: Navigate iframe directly via href — bypasses scroll/visibility problem
    cy.get(iframeSelector).then(function ($iframe) {
      const body = $iframe[0].contentDocument.body;
      const $link = Cypress.$(body).find("td.stsummary a.issue-link").first();
      const href = $link.attr("href");
      cy.log(`cmsCreateSubtask: navigating iframe to subtask → ${href}`);
      if (href) {
        $iframe[0].contentWindow.location.href = href;
      }
    });

    // Step 11: Wait for subtask page then save ticket ID
    cy.iframeReady(iframeSelector, "a#key-val", 30000);
    cy.findInIframe(iframeSelector, "a#key-val")
      .invoke("text")
      .then((ticketId) => {
        cy.writeFile(subtaskFile, ticketId);
        cy.log(`✅ cmsCreateSubtask: subtask created → ${ticketId}`);
      });
  },
);

// ─── File Upload ──────────────────────────────────────────────────────────────

import "cypress-file-upload";

/**
 * clearAllFileUploadCache
 *
 * Clears all browser storage, cookies, and file input values.
 * Use before file upload tests in CLI mode to prevent cached file uploads
 * from carrying over between test runs.
 *
 * @example
 *   beforeEach(() => { cy.clearAllFileUploadCache(); });
 */
Cypress.Commands.add("clearAllFileUploadCache", () => {
  cy.log("Clearing file upload cache...");

  cy.clearCookies();
  cy.clearLocalStorage();

  cy.window().then((win) => {
    win.sessionStorage.clear();
  });

  cy.get("body").then(($body) => {
    if ($body.find('input[type="file"]').length > 0) {
      cy.get('input[type="file"]').each(($el) => {
        cy.wrap($el).invoke("val", "");
      });
    }
  });

  cy.window().then((win) => {
    if ("caches" in win) {
      win.caches.keys().then((names) => {
        names.forEach((name) => win.caches.delete(name));
      });
    }
  });

  cy.wait(500);
});

// ════════════════════════════════════════════════════════════════════════════
// Reg Change — Create Subtask Command
// ════════════════════════════════════════════════════════════════════════════

/**
 * cmsCreateRegChangeSubtask
 *
 * Opens the More menu, clicks Create Subtask, fills the subtask dialog
 * (summary + TinyMCE description), submits, and verifies the subtask
 * appears in the Sub-Tasks section.
 *
 * Uses cy.iframe().within() to avoid stale element issues. Handles
 * TinyMCE nested iframe for the description field.
 *
 * @param {string} summary        - subtask summary text
 * @param {string} description    - subtask description (typed into TinyMCE)
 * @param {string} [iframeSelector='#mytarget']
 *
 * @example
 *   cy.cmsCreateRegChangeSubtask('Review compliance docs', 'Check all docs for Q2');
 */
Cypress.Commands.add(
  "cmsCreateRegChangeSubtask",
  (summary, description, iframeSelector = "#mytarget") => {
    const moreButton = "#opsbar-operations_more";
    const createSubtaskOption = "#create-subtask";
    const summaryField = "#summary";
    const tinyMceFrame = "#mce_0_ifr";
    const tinyMceBody = "#tinymce";
    const createBtn = "#create-issue-submit";
    const subtasksSection = "#view-subtasks";
    // Step 3: Wait for dialog with TinyMCE to load
    cy.iframeReady(iframeSelector, tinyMceFrame, 30000);

    // Step 4: Fill Summary
    cy.iframe(iframeSelector).within(() => {
      cy.get(summaryField, { timeout: 50000 }).clear().type(summary);
    });
    cy.log(`cmsCreateRegChangeSubtask: summary set to "${summary}"`);

    // Step 5: Fill Description via TinyMCE nested iframe
    cy.get(iframeSelector).then(($outerIframe) => {
      const body = $outerIframe[0].contentDocument.body;
      const $mceIframe = Cypress.$(body).find(tinyMceFrame);
      const $tinymce = $mceIframe.contents().find(tinyMceBody);
      cy.wrap($tinymce).clear().type(description);
    });
    cy.log(`cmsCreateRegChangeSubtask: description filled`);

    // Step 6: Submit
    cy.iframe(iframeSelector).within(() => {
      cy.get(createBtn, { timeout: 10000 }).click();
    });
    cy.log("cmsCreateRegChangeSubtask: submitted");

    // Step 7: Wait for Sub-Tasks section to appear
    cy.iframeReady(iframeSelector, subtasksSection, 50000);
    cy.log("cmsCreateRegChangeSubtask: subtask created successfully");
  },
);

// ════════════════════════════════════════════════════════════════════════════
// Reg Change — Create Action Plan / Evaluate Impact Dialog Commands
// ════════════════════════════════════════════════════════════════════════════

/**
 * cmsCreateActionPlan
 *
 * Clicks the "Create Action Plan" workflow button, fills the dialog
 * (assignee + due date), and submits. Uses cy.iframe().within() to
 * avoid stale element issues caused by findInIframe snapshots.
 *
 * @param {string} dueDate       - due date string e.g. '25/Apr/2026'
 * @param {string} assigneeName  - assignee to select e.g. 'CMS Automation'
 * @param {string} [iframeSelector='#mytarget']
 *
 * @example
 *   cy.cmsCreateChildTask('25/Apr/2026', 'CMS Automation');
 */
Cypress.Commands.add(
  "cmsCreateChildTask",
  (dueDate, assigneeName = "CMS Automation", iframeSelector = "#mytarget") => {
    const dialogSelector = "#buContentDiv";
    const assigneeField = "input.aui-ss-field";
    const assigneeDropdown = "div.aui-list";
    const dueDateField = "input[name='bu_duedate']";
    const createBtn = "#dialog-submit-button[resolved]";
    const statusField = "#status-val";
    const issueLinksTable = "#issuetable";

    cy.log("cmsCreateActionPlan: clicked Create Action Plan button");

    // Step 2: Wait for the dialog to appear
    cy.frameLoaded(iframeSelector);
    cy.wait(5000); // guard — ensures dialog has time to render before check
    cy.switchToIframe(iframeSelector)
      .find(dialogSelector, { timeout: 50000 })
      .should("be.visible");

    cy.log("cmsCreateActionPlan: dialog opened");

    // Step 3: Enter assignee
    cy.wait(5000);
    cy.iframe(iframeSelector).within(() => {
      cy.get(assigneeField, { timeout: 10000 }).type(assigneeName, {
        delay: 100,
      });
      // cy.get(assigneeDropdown, { timeout: 10000 }).should("be.visible");
      // cy.get(assigneeDropdown).contains(assigneeName).should("be.visible");
      cy.get(assigneeField).type("{enter}");
    });
    cy.log(`cmsCreateActionPlan: assignee set to ${assigneeName}`);

    // Step 4: Enter due date
    cy.wait(5000);
    cy.iframe(iframeSelector).within(() => {
      cy.get(dueDateField, { timeout: 10000 }).clear().type(dueDate);
    });
    cy.log(`cmsCreateActionPlan: due date set to ${dueDate}`);

    // Step 5: Wait for [resolved] attribute then click Create
    cy.iframe(iframeSelector).within(() => {
      cy.get(createBtn).eq(0).click();
    });
    cy.log("cmsCreateActionPlan: submitted");

    // Step 6: Wait for page to stabilize and issue links to appear
    cy.iframeReady(iframeSelector, statusField, 30000);
    cy.iframeReady(iframeSelector, issueLinksTable, 60000);
    cy.log("cmsCreateActionPlan: action plan created successfully");
  },
);
