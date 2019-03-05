/** generate Class for each carousel to set specific style */
export function generateID(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return `ngucarousel${text}`;
}

export function rangeFor(
  start: number,
  end: number,
  predicate: (i?: number, index?: number) => any
) {
  const length = Math.abs(start - end);
  const isInc = start < end;
  Array.from({ length }, (_, i) => (isInc ? start + i : start - i)).forEach((i, index) =>
    predicate(i, index)
  );
}

export function createRange(length: number, step = 0) {
  return Array.from({ length }, (_, i) => i + step);
}

export function isOnScreen(top: number, height: number) {
  // const top = this.carousel.offsetTop;
  const scrollY = window.scrollY;
  const heightt = window.innerHeight;
  // const height = this.carousel.offsetHeight;
  const isElemOnScreen = top <= scrollY + heightt - height / 4 && top + height / 2 >= scrollY;

  return isElemOnScreen;
}
