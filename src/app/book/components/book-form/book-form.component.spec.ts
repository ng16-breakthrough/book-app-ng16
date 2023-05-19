import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookFormComponent} from './book-form.component';

describe('BookFormComponent', () => {
  const author = 'Test Author';
  const title = 'Test Author';

  let fixture: ComponentFixture<BookFormComponent>;
  let component: BookFormComponent;
  let element: HTMLElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [BookFormComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(BookFormComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  });

  it('shows book data in form fields', () => {
    // given
    component.book = {author, title};
    // when
    fixture.detectChanges();
    // then
    createBookFormComponentObjectFrom(element).expect()
      .authorInputToBe(author)
      .titleInputToBe(title);
  });

  it('notifies on save click and passes updated book data', (done) => {
    // 1. given
    fixture.detectChanges();
    const updatedAuthor = 'Updated Author';
    const updatedTitle = 'Updated Title';
    const bookForm = createBookFormComponentObjectFrom(element);
    component.saveClick.subscribe(updatedBook => {
      // 3. then
      expect(updatedBook).toBeTruthy();
      expect(updatedBook.author).toBe(updatedAuthor);
      expect(updatedBook.title).toBe(updatedTitle);
      done();
    });
    // 2. when
    bookForm.do()
      .setAuthorInputTo(updatedAuthor)
      .setTitleInputTo(updatedTitle)
      .clickOnSaveButton();
  });
});

export function createBookFormComponentObjectFrom(element: HTMLElement | null) {
  return {
    do() {
      return {
        setAuthorInputTo(newValue: string) {
          setInputValue(getAuthorInput(), newValue);
          return this;
        },
        setTitleInputTo(newValue: string) {
          setInputValue(getTitleInput(), newValue);
          return this;
        },
        clickOnSaveButton() {
          const saveButton = getElement<HTMLButtonElement>('button');
          saveButton.click();
          return this;
        }
      }
    },
    expect() {
      return {
        authorInputToBe(expectedValue: string) {
          const authorInput = getAuthorInput();
          expect(authorInput.value).withContext('Author input').toBe(expectedValue);
          return this;
        },
        titleInputToBe(expectedValue: string) {
          const titleInput = getTitleInput();
          expect(titleInput.value).withContext('Title input').toBe(expectedValue);
          return this;
        }
      }
    }
  }

  function setInputValue(inputElement: HTMLInputElement, newValue: string) {
    inputElement.value = newValue;
    inputElement.dispatchEvent(new Event('input'));
  }

  function getAuthorInput(): HTMLInputElement {
    return getElement<HTMLInputElement>('#author');
  }

  function getTitleInput(): HTMLInputElement {
    return getElement<HTMLInputElement>('#title');
  }

  function getElement<E extends Element = Element>(selector: string): E {
    if (!element) {
      throw new Error('Element not provided!');
    }
    const foundElement = element.querySelector<E>(selector);
    if (!foundElement) {
      throw new Error(`No element found using selector: ${selector}`);
    }
    return foundElement;
  }
}
