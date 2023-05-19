import {Routes} from '@angular/router';
import {bookDetailsDialogRoutes} from './components/book-details-dialog/book-details-dialog.routes';
import {bookOverviewDialogRoute} from './components/book-overview-dialog/book-overview-dialog.routes';

export default [
  bookOverviewDialogRoute,
  ...bookDetailsDialogRoutes,
] as Routes;
