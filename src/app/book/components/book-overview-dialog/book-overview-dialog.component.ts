import {Component, effect, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookService} from '../../services/book.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {distinctUntilChanged, map, Observer} from 'rxjs';
import {BookSearchComponent} from '../book-search/book-search.component';
import {Book} from '../../model';
import {BookListComponent} from '../book-list/book-list.component';
import {toSignal} from '@angular/core/rxjs-interop';

export const queryUrlParameterName = 'query';

@Component({
  selector: 'ba-book-overview-dialog',
  standalone: true,
  imports: [CommonModule, BookSearchComponent, BookListComponent],
  templateUrl: './book-overview-dialog.component.html',
  styleUrls: ['./book-overview-dialog.component.scss']
})
export class BookOverviewDialogComponent {
  readonly searchQuery: Signal<string>;
  readonly searchResults = signal<Book[]>([]);
  readonly isLoading = signal(false);

  constructor(
    private readonly currentRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly books: BookService) {

    this.searchQuery = toSignal(
      this.currentRoute.params.pipe(
        map(getSearchQueryFromUrlParameters),
        distinctUntilChanged()
      ), {initialValue: ''});

    effect(onCleanup => {
      this.isLoading.set(true);
      const query = this.searchQuery();
      const subscription = this.books.search(query)
        .subscribe(createSearchResultsObserver(this.searchResults, this.isLoading));
      onCleanup(() => subscription.unsubscribe());
    }, {allowSignalWrites: true});
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

function createSearchResultsObserver(searchResults: WritableSignal<Book[]>, isLoading: WritableSignal<boolean>): Partial<Observer<Book[]>> {
  return {
    next(currentSearchResults: Book[]) {
      searchResults.set(currentSearchResults);
      isLoading.set(false);
    },
    error() {
      isLoading.set(false);
    }
  }
}
