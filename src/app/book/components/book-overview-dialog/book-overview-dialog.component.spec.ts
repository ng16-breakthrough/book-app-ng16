import {TestBed} from '@angular/core/testing';

import {BookOverviewDialogComponent} from './book-overview-dialog.component';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideBooks} from '../../book.config';
import {provideRouter} from '@angular/router';
import {bookOverviewDialogRoute} from './book-overview-dialog.routes';
import {BookService} from '../../services/book.service';
import {createBookSearchComponentObjectFrom} from '../book-search/book-search.component.spec';
import {createBookListComponentObjectFrom} from '../book-list/book-list.component.spec';

describe('BookOverviewComponent', () => {
  let routerTestingHarness: RouterTestingHarness;
  let component: BookOverviewDialogComponent;
  let element: HTMLElement;
  let bookService: BookService;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      providers: [
        provideBooks(),
        provideRouter([bookOverviewDialogRoute])
      ],
      imports: [BookOverviewDialogComponent]
    }).compileComponents()
      .then(createAndSetRouterTestingHarness)
      .then(() => bookService = TestBed.inject(BookService));
  });

  it('shows empty search query and empty book list if no search query in URL params and no books provided', () => {
    // when
    return navigateByUrlAndSetComponentInstanceAndElement('/').then(() => {
      // then
      bookSearchComponent()
        .expect()
        .queryInputToBe('');

      bookListComponent()
        .expect()
        .toHaveBookListElementCount(0);
    });
  });

  function createAndSetRouterTestingHarness() {
    return RouterTestingHarness.create().then(
      harness => routerTestingHarness = harness);
  }

  function navigateByUrlAndSetComponentInstanceAndElement(url: string) {
    return routerTestingHarness.navigateByUrl(url, BookOverviewDialogComponent)
      .then(routedComponent => {
        component = routedComponent;
        element = routerTestingHarness.routeNativeElement!;
      });
  }

  function bookSearchComponent() {
    return createBookSearchComponentObjectFrom(element.querySelector('ba-book-search'));
  }

  function bookListComponent() {
    return createBookListComponentObjectFrom(element.querySelector('ba-book-list'));
  }
});
