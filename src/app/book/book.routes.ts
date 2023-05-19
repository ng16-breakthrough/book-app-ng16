import {Routes} from '@angular/router';
import {BookOverviewDialogComponent} from './components/book-overview-dialog/book-overview-dialog.component';
import {bookDetailsRoutes} from './components/book-details-dialog/book-details.routes';

const bookIdParamName = 'bookId';

export default [
  {
    path: '',
    component: BookOverviewDialogComponent
  },
  ...bookDetailsRoutes,
] as Routes;
