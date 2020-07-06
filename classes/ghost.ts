export default class Ghost {
  ofPlayer: boolean; // true: player, false: opponent
  isWhite: boolean; // true: white, false: black
  constructor(ofPlayer: boolean, isWhite: boolean) {
    this.ofPlayer = ofPlayer;
    this.isWhite = isWhite;
  }
}
