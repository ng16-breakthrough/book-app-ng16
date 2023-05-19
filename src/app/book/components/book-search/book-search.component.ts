import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'ba-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookSearchComponent {
  @Input()
  query: string | undefined | null;

  @Output()
  readonly queryChange = new EventEmitter<string>();

  notifyOnNewSearchQuery(event: Event) {
    const searchForm = event.target as HTMLFormElement;
    const searchQueryInput = searchForm.querySelector<HTMLInputElement>('#searchQuery');
    if (searchQueryInput) {
      this.queryChange.emit(searchQueryInput.value);
    }
  }
}
