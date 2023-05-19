import {BookDetailsDialogComponent} from './book-details-dialog.component';
import {resolveBookWithIdFrom} from './book.resolver';
import {Routes} from '@angular/router';

const bookIdParamName = 'bookId';

export const bookDetailsRoutes: Routes =[
  {
    path: 'new',
    component: BookDetailsDialogComponent
  },
  {
    path: `:${bookIdParamName}`,
    component: BookDetailsDialogComponent,
    resolve: {
      book: resolveBookWithIdFrom(bookIdParamName)
    }
  }
]
