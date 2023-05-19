import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOverviewDialogComponent } from './book-overview-dialog.component';
import {RouterTestingModule} from '@angular/router/testing';
import {provideBooks} from '../../book.config';
import {importProvidersFrom} from '@angular/core';

describe('BookOverviewComponent', () => {
  let component: BookOverviewDialogComponent;
  let fixture: ComponentFixture<BookOverviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideBooks(), importProvidersFrom(RouterTestingModule)],
      imports: [BookOverviewDialogComponent]
    });
    fixture = TestBed.createComponent(BookOverviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
