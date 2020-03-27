import { AllTreasuresData } from "../Data/AllTreasuresData.js";
import Player from "../Player/Player.js"

class Start {
    constructor(playerNumber) {
        this.playerNumber = playerNumber;
        this.treasures = this.shuffle(AllTreasuresData);
        this.dealCards(this.playerNumber, this.treasures);
        this.playersArray;
    }

    dealCards = (playerNumber, treasures) => {
        const cardAmount = treasures.length / playerNumber;
        let playersArray = [];


        let show = true;

        for (let i = 0; i < playerNumber; i++) {
            if (i !== 0) show = false;//chwilowo, by renederować karty tylko dla pierwszego gracza
            const playerCards = treasures.slice(i * cardAmount, cardAmount * (i + 1));
            playersArray[i] = new Player(playerCards, show);
            this.playersArray = playersArray;
        }
    }


    shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
export default Start;