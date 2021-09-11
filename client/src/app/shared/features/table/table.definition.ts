export class Column {
  key: string;
  title: string;

  constructor(key: string, title: string) {
    this.key = key;
    this.title = title;
  }
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20];
