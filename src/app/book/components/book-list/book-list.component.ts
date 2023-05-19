import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Book} from '../../model';

@Component({
  selector: 'ba-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent {
  @Input()
  books: Book[] | null = [];

  @Output()
  bookClick = new EventEmitter<Book>();

  notifyOnBookClick(book: Book) {
    this.bookClick.emit(book);
  }
}
