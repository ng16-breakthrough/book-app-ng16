import {TestBed} from '@angular/core/testing';
import {resolveBookWithIdFrom} from './book.resolver';
import {isObservable} from 'rxjs';
import {provideBooks} from '../../book.config';
import {BookService} from '../../services/book.service';
import {Params} from '@angular/router';

describe('BookResolver', function () {
  const bookIdParamName = 'bookId';
  const resolveBook = resolveBookWithIdFrom(bookIdParamName);
  let bookService: BookService;
  let routerStateSnapshotStub: any;

  beforeEach(function () {
    TestBed.configureTestingModule({
      providers: [provideBooks()]
    });
    bookService = TestBed.inject(BookService);
    routerStateSnapshotStub = {};
  });

  it('resolves a book if one exists', function (done)   {
    // given
    bookService.save({author: 'Tes', title: 'Tes'}).subscribe(book => {
      const routeSnapshotStub = createRouteSnapshotStubWithParam(bookIdParamName, `${book.id}`);
      TestBed.runInInjectionContext(() => {
        // when
        const book$ = resolveBook(routeSnapshotStub, routerStateSnapshotStub);
        if (!isObservable(book$)) {
          throw new Error();
        }
        book$.subscribe(book => {
          // then
          expect(book).toBe(book);
          done();
        });
      })
    })
  });
});

function createRouteSnapshotStubWithParam(paramName: string, paramValue: unknown): any {
  const params: Params = {};
  params[paramName] = paramValue;
  return {params};
}
