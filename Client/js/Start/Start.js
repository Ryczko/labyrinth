import { AllTreasuresData } from "../Data/AllTreasuresData.js";
import Player from "../Player/Player.js"
import { newMessage } from '../Chat/newMessage.js';

class Start {
    constructor(playerNumber, put) {
        this.put = put;
        this.chat =
            this.playerNumber = playerNumber;
        this.treasures = this.shuffle(AllTreasuresData);
        this.dealCards(this.playerNumber, this.treasures);
        this.playersArray;
        this.activePlayer = 0;

    }

    dealCards = (playerNumber, treasures) => {
        const cardAmount = treasures.length / playerNumber;
        let playersArray = [];
        let id = 0;
        let active = true;

        let show = true;

        for (let i = 0; i < playerNumber; i++) {
            if (i !== 0) {
                show = false;
                active = false;
            }//chwilowo, by renederować karty tylko dla pierwszego gracza
            const playerCards = treasures.slice(i * cardAmount, cardAmount * (i + 1));

            playersArray[i] = new Player(playerCards, show, id = i + 1, this.roundManager, this.put);
            newMessage(`Bot`, `Welcome to game player ${id}`)
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

    roundManager = () => {
        const { playersArray } = this;

        this.activePlayer++;
        this.put.isMoved = false;
        if (this.activePlayer === playersArray.length) this.activePlayer = 0;

        playersArray[this.activePlayer].move(this.activePlayer + 1)


    }
}
export default Start;