export interface Book {
  id: number;
  author: string;
  title: string;
}

export type BookProperties = Omit<Book, 'id'>;
