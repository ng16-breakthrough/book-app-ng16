import {TestBed} from '@angular/core/testing';
import {provideBooks} from '../../book.config';
import {BookDetailsDialogComponent} from './book-details-dialog.component';
import {provideRouter, Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {createBookFormComponentObjectFrom} from '../book-form/book-form.component.spec';
import {BookService} from '../../services/book.service';
import {Book, BookProperties} from '../../model';
import {firstValueFrom} from 'rxjs';
import {bookDetailsDialogRoutes} from './book-details-dialog.routes';

describe('BookDetailsDialogComponent', () => {
  const author = 'Test Author';
  const title = 'Test Title';

  let routerTestingHarness: RouterTestingHarness;
  let component: BookDetailsDialogComponent;
  let element: HTMLElement;
  let bookService: BookService;

  beforeEach(function () {
    return TestBed.configureTestingModule({
      providers: [
        provideBooks(),
        provideRouter(bookDetailsDialogRoutes)
      ],
      imports: [BookDetailsDialogComponent]
    }).compileComponents()
      .then(createAndSetRouterTestingHarness)
      .then(() => bookService = TestBed.inject(BookService));
  });

  it('shows empty form when navigating to new book', function () {
    // when
    return navigateToCreateNewBook().then(() => {
      // then
      expectHeadingElementHasText('New Book');
      bookFormComponent()
        .expect()
        .authorInputToBe('')
        .titleInputToBe('');
    });
  });

  it('shows form with book details when navigating to existing book', function () {
    // given
    return givenNewBookCreated({author, title})
      // when
      .then(navigateToDetailsOfBook)
      .then(() => {
        // then
        expectHeadingElementHasText('Details of Book #');
        bookFormComponent()
          .expect()
          .authorInputToBe(author)
          .titleInputToBe(title);
      });
  });

  it('saves a book and navigates to overview dialog after clicking on form\'s save button', function () {
    // given
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    spyOn(bookService, 'save').and.callThrough();
    // when
    return navigateToCreateNewBook().then(() => {
      // then
      bookFormComponent().do()
        .setTitleInputTo(title)
        .setAuthorInputTo(author)
        .clickOnSaveButton();
      expect(router.navigate).toHaveBeenCalled();
      expect(bookService.save).toHaveBeenCalled();
    });
  });

  function createAndSetRouterTestingHarness() {
    return RouterTestingHarness.create().then(
      harness => routerTestingHarness = harness);
  }

  function navigateToCreateNewBook() {
    return navigateByUrlAndSetComponentInstanceAndElement(`/new`);
  }

  function navigateToDetailsOfBook(book: Book) {
    return navigateByUrlAndSetComponentInstanceAndElement(`/${book.id}`);
  }

  function navigateByUrlAndSetComponentInstanceAndElement(url: string) {
    return routerTestingHarness.navigateByUrl(url, BookDetailsDialogComponent)
      .then(routedComponent => {
        component = routedComponent;
        element = routerTestingHarness.routeNativeElement!;
      });
  }

  function expectHeadingElementHasText(expectedText: string) {
    const headingTitleElement = element.querySelector<HTMLSpanElement>('h4 span');
    if (!headingTitleElement) {
      throw new Error('No heading title element found!');
    }
    expect(headingTitleElement.textContent).toContain(expectedText);
  }

  function bookFormComponent() {
    return createBookFormComponentObjectFrom(element.querySelector('ba-book-form'));
  }

  function givenNewBookCreated(bookProperties: BookProperties): Promise<Book> {
    return firstValueFrom(bookService.save(bookProperties));
  }
});

