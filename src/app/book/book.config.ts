import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {BookService, INITIAL_BOOKS} from './services/book.service';
import {BookProperties} from './model';

export function provideBooks(initialBooks? : BookProperties[]): EnvironmentProviders {
  return makeEnvironmentProviders([
    {provide: INITIAL_BOOKS, useValue: initialBooks ?? []},
    BookService
  ]);
}
