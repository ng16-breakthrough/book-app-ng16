import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideBooks} from './book/book.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBooks([
      {author: 'Douglas Crockford', title: 'JavaScript. The Good Parts'},
      {author: 'Tom Hombergs', title: 'Get Your Hands Dirty On Clean Architecture'},
      {author: 'Joshua Bloch', title: 'Effective Java'},
      {author: 'Eric Evans', title: 'Domain-Driven Design'},
    ])
  ]
};
