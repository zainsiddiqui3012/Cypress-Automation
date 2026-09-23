class ScrollPage {

        ///Risk Register
        scrollPageBottomRight() {
                ///scroll  topLeft, top, topRight, left, center, right, bottomLeft, bottom, and bottomRight.
                ///***Scroll Page  */
                cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
                cy.wait(1000);

        }

        scrollPageCenterRight() {
                ///scroll  topLeft, top, topRight, left, center, right, bottomLeft, bottom, and bottomRight.
                ///***Scroll Page  */
                cy.get('#myGrid > div > div.ag-root-wrapper-body.ag-layout-normal.ag-focus-managed > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-horizontal-scroll > div.ag-body-horizontal-scroll-viewport').scrollTo('center') // Scroll 'sidebar' to its bottom;
                cy.wait(1000);

        }

        controlInlineEditorscrollPage() {
                ///scroll  topLeft, top, topRight, left, center, right, bottomLeft, bottom, and bottomRight.
                ///***Scroll Page  */
                cy.get('.controls > .ag-theme-balham > .ag-root-wrapper > .ag-root-wrapper-body > .ag-root > .ag-body-horizontal-scroll > .ag-body-horizontal-scroll-viewport').scrollTo('bottomRight') // Scroll 'sidebar' to its bottom;
                cy.wait(1000);

        }
}
export default ScrollPage;