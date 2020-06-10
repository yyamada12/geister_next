export default class Ghost {
  id: number;
  ofPlayer: boolean; // true: player, false: opponent
  isWhite: boolean; // true: white, false: black
  constructor(id: number, ofPlayer: boolean, isWhite: boolean) {
    this.id = id;
    this.ofPlayer = ofPlayer;
    this.isWhite = isWhite;
  }
}
