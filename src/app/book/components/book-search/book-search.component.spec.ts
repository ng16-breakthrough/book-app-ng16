import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookSearchComponent} from './book-search.component';

describe('BookSearchComponent', () => {
  const searchQuery = 'some query';

  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    return TestBed.configureTestingModule({
      imports: [BookSearchComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(BookSearchComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    })
  });

  it('shows passed search query in input field', () => {
    // given
    component.query = searchQuery;
    // when
    fixture.detectChanges();
    // then
    createBookSearchComponentObjectFrom(element)
      .expect()
      .queryInputToBe(searchQuery);
  });

  it('notifies on search click and passes changed query value', (done) => {
    // 1. given
    fixture.detectChanges();
    component.queryChange.subscribe(newQueryValue => {
      // 3. then
      expect(newQueryValue).toBe(searchQuery);
      done();
    });
    // 2. when
    createBookSearchComponentObjectFrom(element)
      .do()
      .setQueryInputTo(searchQuery)
      .clickOnSearchButton()
  });

  function createBookSearchComponentObjectFrom(element: HTMLElement) {
    return {
      do() {
        return {
          setQueryInputTo(newValue: string) {
            setInputValue(getQueryInputElement(), newValue);
            return this;
          },

          clickOnSearchButton() {
            const searchButton = getElement<HTMLButtonElement>('button');
            searchButton.click();
            return this;
          }
        }
      },

      expect() {
        return {
          queryInputToBe(expectedInput: string) {
            expect(getQueryInputElement().value).toBe(expectedInput);
            return this;
          }
        }
      }
    }

    function getQueryInputElement() {
      return getElement<HTMLInputElement>('#searchQuery');
    }

    function setInputValue(inputElement: HTMLInputElement, newValue: string) {
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input'));
    }

    function getElement<E extends Element = Element>(selector: string): E {
      if(!element) {
        throw new Error('Element not provided!');
      }
      const foundElement = element.querySelector<E>(selector);
      if (!foundElement) {
        throw new Error(`No element found using selector: ${selector}`);
      }
      return foundElement;
    }
  }
});
