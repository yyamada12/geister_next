import { BOARD_SIZE } from "../consts";

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
  isAdjacent(c: Cood) {
    for (let [dx, dy] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      if (this.x + dx === c.x && this.y + dy === c.y) return true;
    }
    return false;
  }
  reversed() {
    return new Cood(BOARD_SIZE - 1 - this.x, BOARD_SIZE - 1 - this.y);
  }
}
