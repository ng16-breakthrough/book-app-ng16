import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Book, BookProperties} from '../../model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookFormComponent} from '../book-form/book-form.component';
import {BookService} from '../../services/book.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'ba-book-details-dialog',
  standalone: true,
  imports: [CommonModule, RouterLink, BookFormComponent],
  templateUrl: './book-details-dialog.component.html',
  styleUrls: ['./book-details-dialog.component.scss']
})
export class BookDetailsDialogComponent implements OnDestroy {
  book: Book | undefined;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly currentRoute: ActivatedRoute,
              private readonly books: BookService,
              private readonly router: Router) {
    this.book = currentRoute.snapshot.data['book'] as (Book | undefined);
  }

  saveOrUpdateBookAndGoBackToOverview(book: BookProperties) {
    const saveOrUpdate = this.book ?
      this.books.update({...this.book, ...book}) : this.books.save(book);

    saveOrUpdate.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.router.navigate(['..'], {relativeTo: this.currentRoute}));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
