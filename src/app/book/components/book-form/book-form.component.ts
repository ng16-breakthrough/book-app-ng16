import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookProperties} from '../../model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

interface BookFormModel {
  author: FormControl<string>;
  title: FormControl<string>;
}

@Component({
  selector: 'ba-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookFormComponent {
  @Input()
  set book(book: BookProperties | undefined) {
    if (book) {
      this.bookForm.patchValue(book);
    } else {
      this.bookForm.reset();
    }
  }

  @Output()
  readonly saveClick = new EventEmitter<BookProperties>();

  readonly bookForm: FormGroup<BookFormModel>;

  constructor() {
    this.bookForm = new FormGroup({
      author: new FormControl('', {nonNullable: true, validators: Validators.required}),
      title: new FormControl('', {nonNullable: true, validators: Validators.required})
    })
  }

  notifyOnSaveClickIfFormValid() {
    if (this.bookForm.valid) {
      const bookFormValue = this.bookForm.value;
      this.saveClick.emit({
        author: bookFormValue.author!, // assured by validators
        title: bookFormValue.title! // assured by validators
      });
    }
  }
}
