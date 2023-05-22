import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {BookOverviewDialogComponent, queryUrlParameterName} from './book-overview-dialog.component';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideBooks} from '../../book.config';
import {provideRouter, Router} from '@angular/router';
import {bookOverviewDialogRoute} from './book-overview-dialog.routes';
import {BookService} from '../../services/book.service';
import {createBookSearchComponentObjectFrom} from '../book-search/book-search.component.spec';
import {createBookListComponentObjectFrom} from '../book-list/book-list.component.spec';

describe('BookOverviewComponent', () => {
  const path = 'books';

  let routerTestingHarness: RouterTestingHarness;
  let component: BookOverviewDialogComponent;
  let element: HTMLElement;
  let bookService: BookService;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      providers: [
        provideBooks(),
        provideRouter([{...bookOverviewDialogRoute, path: `${path}`}]) // overwritten empty path
      ],
      imports: [BookOverviewDialogComponent]
    }).compileComponents()
      .then(createAndSetRouterTestingHarness)
      .then(() => bookService = TestBed.inject(BookService));
  });

  it('shows empty search query and empty book list if no search query in URL params and no books provided', fakeAsync(() => {
    // when
    return navigateByUrlAndSetComponentInstanceAndElement(`/${path}`).then(() => {
      tickBookSearching();
      // then
      bookSearchComponent()
        .expect()
        .queryInputToBe('');

      bookListComponent()
        .expect()
        .toHaveBookListElementCount(0);
    });
  }));

  it('shows search query if one is passed in URL parameters', fakeAsync(() => {
    // given
    const searchQuery = 'query'
    // when
    return navigateByUrlAndSetComponentInstanceAndElement(`/${path};${queryUrlParameterName}=${searchQuery}`).then(() => {
      tickBookSearching();
      bookSearchComponent()
        .expect()
        .queryInputToBe(searchQuery);
    });
  }));

  it('updates search query in URL parameters after click on search button', fakeAsync(() => {
    // given
    const searchQuery = 'query'
    return navigateByUrlAndSetComponentInstanceAndElement(`/${path}`).then(() => {
      tickBookSearching()
      // when
      bookSearchComponent()
        .do()
        .setQueryInputTo(searchQuery)
        .clickOnSearchButton();
      flush(); // router navigation
      // then
      expect(TestBed.inject(Router).url).toBe(`/${path};${queryUrlParameterName}=${searchQuery}`);
      tickBookSearching(); // searching triggered by parameters change
    });
  }));

  function tickBookSearching() {
    tick(2000);
  }

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
