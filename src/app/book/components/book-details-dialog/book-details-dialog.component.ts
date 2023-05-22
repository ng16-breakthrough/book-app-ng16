import {Component, DestroyRef, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Book, BookProperties} from '../../model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookFormComponent} from '../book-form/book-form.component';
import {BookService} from '../../services/book.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'ba-book-details-dialog',
  standalone: true,
  imports: [CommonModule, RouterLink, BookFormComponent],
  templateUrl: './book-details-dialog.component.html',
  styleUrls: ['./book-details-dialog.component.scss']
})
export class BookDetailsDialogComponent {
  @Input()
  book: Book | undefined;

  constructor(private readonly currentRoute: ActivatedRoute,
              private readonly books: BookService,
              private readonly router: Router,
              private readonly destroyRef: DestroyRef) {
  }

  saveOrUpdateBookAndGoBackToOverview(book: BookProperties) {
    const saveOrUpdate = this.book ?
      this.books.update({...this.book, ...book}) : this.books.save(book);

    saveOrUpdate.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this.router.navigate(['..'], {relativeTo: this.currentRoute}));
  }
}
