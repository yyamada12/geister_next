export default class Cood {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  equals(c: Cood) {
    return c && this.x === c.x && this.y === c.y;
  }
}
