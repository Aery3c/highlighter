interface Selection {
  getAllRange(): Range[];
  isBackward(): boolean;
}

interface Range {
  getBookmark(containerElement: HTMLElement | Node): BookMark
}

type BookMark = { start: number, end: number, containerElement: HTMLElement | Node }

interface Highlighter {

}
