import { AllTreasuresData } from "../Data/AllTreasuresData.js";
import Player from "../Player/Player.js";

class Start {
  constructor(playerNumber, put, names = []) {
    this.put = put;
    this.playersArray = [];
    this.playerNumber = playerNumber;
    this.allCards = [];
    this.activePlayer = 0;
    this.names = names;
  }

  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  dealCards = (playerNumber) => {
    const treasures = this.shuffle(AllTreasuresData);
    const cardAmount = treasures.length / playerNumber;

    for (let i = 0; i < playerNumber; i++) {
      const playerCards = treasures.slice(i * cardAmount, cardAmount * (i + 1));
      this.allCards.push(playerCards);
    }
  };

  createPlayers = (playerNumber, colors = null) => {
    for (let i = 0; i < playerNumber; i++) {
      this.playersArray[i] = new Player(
        this.allCards[i],
        i + 1,
        this.put,
        colors == null ? null : colors[i],
        this.names[i]
      );
    }
  };
}

export default Start;
