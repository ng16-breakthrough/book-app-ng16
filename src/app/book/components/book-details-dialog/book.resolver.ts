import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../../model';

export function resolveBookWithIdFrom(bookIdParamName: string): ResolveFn<Book> {
  return function (currentRoute) {
    const books = inject(BookService);
    const bookIdAsString = currentRoute.params[bookIdParamName] as string;
    return books.getOne(parseInt(bookIdAsString));
  }
}
