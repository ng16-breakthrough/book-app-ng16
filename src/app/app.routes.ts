import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: '/books', pathMatch: 'full'},
  {
    path: 'books',
    loadChildren: () => import('./book/book.routes')
  },
];
