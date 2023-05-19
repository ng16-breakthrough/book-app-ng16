import {BehaviorSubject, Observable} from 'rxjs';
import {Book, BookProperties} from '../model';
import {Inject, Injectable, InjectionToken} from '@angular/core';

export const INITIAL_BOOKS = new InjectionToken<Book[]>("INITIAL_BOOKS");

@Injectable()
export class BookService {
  private bookIdSeq = 1001;
  private readonly books$: BehaviorSubject<Book[]>;
  readonly values$: Observable<Book[]>;

  constructor(@Inject(INITIAL_BOOKS) initialBooks: BookProperties[]) {
    this.books$ = new BehaviorSubject<Book[]>(initialBooks.map(book => this.createNewBook(book)));
    this.values$ = this.books$.asObservable();
  }

  search(query: string): Observable<Book[]> {
    return new Observable<Book[]>(subscriber => {
      setTimeout(() => {
        const currentBooks = this.books$.value;
        const searchResults = query ? currentBooks.filter(bookMatchesQueryOf(query)) : [...currentBooks];
        subscriber.next(searchResults);
        subscriber.complete();
      }, 2000);
    });

    function bookMatchesQueryOf(query: string) {
      return function (book: Book): boolean {
        const queryLowerCase = query.toLowerCase();
        const queryInAuthor = book.author.toLowerCase().includes(queryLowerCase);
        const queryInTitle = book.title.toLowerCase().includes(queryLowerCase);
        return queryInAuthor || queryInTitle;
      }
    }
  }

  getOne(id: number): Observable<Book> {
    return new Observable<Book>(subscriber => {
      const currentBooks = this.books$.value;
      const foundBook = currentBooks.find(book => book.id === id);
      if (foundBook) {
        subscriber.next(foundBook);
        subscriber.complete();
      } else {
        subscriber.error(`Book with id ${id} not found!`);
      }
    });
  }

  update(bookToUpdate: Book): Observable<Book> {
    return new Observable<Book>(subscriber => {
      const currentBooks = this.books$.value;
      const updatedBook = {...bookToUpdate};
      const updatedBooks = currentBooks.map(book => book.id === bookToUpdate.id ? updatedBook : book);
      this.books$.next(updatedBooks);
      subscriber.next(updatedBook);
      subscriber.complete();
    });
  }

  save(book: BookProperties): Observable<Book> {
    return new Observable<Book>(subscriber => {
      const currentBooks = this.books$.value;
      const newBook = this.createNewBook(book);
      this.books$.next([...currentBooks, newBook])
      subscriber.next(newBook);
      subscriber.complete();
    });
  }

  private createNewBook(bookProperties: BookProperties): Book {
    return {id: this.nextBookId(), ...bookProperties};
  }

  private nextBookId(): number {
    return this.bookIdSeq++;
  }
}
