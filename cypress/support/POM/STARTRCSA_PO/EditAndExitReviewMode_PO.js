import dayjs from 'dayjs'
import { WatchDirectoryFlags } from 'typescript';

class EditAndExitReview_PO{

    threeEllipsisMenu() {
        cy.get('.list-inline-item:last-child').click();
    }

    validateEditReviewTab()
   {
      cy.get('a:contains(Edit Review Mode)').should('be.visible').click();
   }

  
 



}

export default EditAndExitReview_PO;