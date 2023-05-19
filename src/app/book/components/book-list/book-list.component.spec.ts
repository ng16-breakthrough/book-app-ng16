import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookListComponent} from './book-list.component';
import {Book} from '../../model';

describe('BookListComponent', () => {
  const book: Book = {id: 1, author: 'Test Author', title: 'Test Title'};

  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [BookListComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(BookListComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  });

  it('shows passed book list', () => {
    // given
    component.books = [book];
    // when
    fixture.detectChanges();
    // then
    createBookListComponentObjectFrom(element)
      .expect()
      .hasBookListElementWithId(book.id);
  });

  it('notifies on click on a book list element', (done) => {
    // 1. given
    component.books = [book];
    fixture.detectChanges();
    component.bookClick.subscribe(clickedBook => {
      // 3. then
      expect(clickedBook).toBe(book);
      done();
    });
    // 2. when
    createBookListComponentObjectFrom(element)
      .do()
      .clickOnBookListElementWithId(book.id);
  });

  function createBookListComponentObjectFrom(element: HTMLElement) {
    return {
      do() {
        return {
          clickOnBookListElementWithId(bookId: number) {
            const listElement = getTableRowElementContainingTextInFirstColumn(`${bookId}`);
            if (!listElement) {
              throw new Error(`No list element of book with ID ${bookId}`);
            }
            listElement.click();
            return this;
          }
        }
      },

      expect() {
        return {
          hasBookListElementWithId(bookId: number) {
            expect(getTableRowElementContainingTextInFirstColumn(`${bookId}`))
              .withContext(`No list element of book with ID ${bookId}`)
              .toBeTruthy();
            return this;
          }
        }
      }
    }

    function getTableRowElementContainingTextInFirstColumn(expectedText: string) {
      if (!element) {
        throw new Error('Element not provided!');
      }

      const rowElements = element.querySelectorAll<HTMLTableRowElement>('table > tbody > tr');
      let matchingRowElement = null;
      for (let i = 0; i < rowElements.length; i++) {
        const rowElement = rowElements.item(i);
        const tableCells = rowElement.querySelectorAll<HTMLTableCellElement>('td');
        if (tableCells.length > 0) {
          const firstColumnCell = tableCells.item(0);
          if (firstColumnCell.textContent === expectedText) {
            matchingRowElement = rowElement;
            break;
          }
        }
      }

      return matchingRowElement;
    }
  }
});
