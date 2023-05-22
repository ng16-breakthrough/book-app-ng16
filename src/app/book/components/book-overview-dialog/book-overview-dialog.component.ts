import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from '../../services/book.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {catchError, delay, distinctUntilChanged, map, Observable, switchMap, tap, throwError} from 'rxjs';
import {BookSearchComponent} from '../book-search/book-search.component';
import {Book} from '../../model';
import {BookListComponent} from '../book-list/book-list.component';

export const queryUrlParameterName = 'query';

@Component({
  selector: 'ba-book-overview-dialog',
  standalone: true,
  imports: [CommonModule, BookSearchComponent, BookListComponent],
  templateUrl: './book-overview-dialog.component.html',
  styleUrls: ['./book-overview-dialog.component.scss']
})
export class BookOverviewDialogComponent {
  readonly searchQuery$: Observable<string>;
  readonly searchResults$: Observable<Book[]>;
  isLoading = false;

  constructor(
    private readonly currentRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly books: BookService) {

    this.searchQuery$ = this.currentRoute.params.pipe(
      map(getSearchQueryFromUrlParameters),
      distinctUntilChanged()
    );

    this.searchResults$ = this.searchQuery$.pipe(
      delay(0), // to fix ExpressionChangedAfterItHasBeenCheckedError
      tap(() => this.isLoading = true),
      switchMap(searchQuery => this.books.search(searchQuery)),
      catchError(error => {
        this.isLoading = false;
        return throwError(error);
      }),
      tap(() => this.isLoading = false),
    );
  }

  updateQueryUrlParamWith(newSearchQuery: string) {
    const newParams: Params = {};
    newParams[queryUrlParameterName] = newSearchQuery;
    this.router.navigate([newParams], {relativeTo: this.currentRoute});
  }

  navigateToDetailsOf(book: Book) {
    this.router.navigate([book.id],  {relativeTo: this.currentRoute});
  }
}

function getSearchQueryFromUrlParameters(params: Params): string {
  return params[queryUrlParameterName] ?? ''
}
