interface Selection {
  getAllRange(): Range[];
  isBackward(): boolean;
}

interface Range {
  getBookMark(containerElement: HTMLElement): BookMark
}

type BookMark = { start: number, end: number, containerElement: HTMLElement }
