import { AllTreasuresData } from '../Data/AllTreasuresData.js';
import Player from '../Player/Player.js';


class Start {
	constructor(playerNumber, put, colors = null) {
		this.put = put;
		this.colors = colors
		this.playersArray = [];
		this.playerNumber = playerNumber

		this.allCards = [];

		this.activePlayer = 0;
	}

	dealCards = (playerNumber) => {
		const treasures = this.shuffle(AllTreasuresData)
		const cardAmount = treasures.length / playerNumber;

		for (let i = 0; i < playerNumber; i++) {

			const playerCards = treasures.slice(i * cardAmount, cardAmount * (i + 1));
			this.allCards.push(playerCards);

		}
	};

	createPlayers = (playerNumber, colors = null) => {

		let active = true;
		let show = true;


		for (let i = 0; i < playerNumber; i++) {
			if (i !== 0) {
				show = false;
				active = false;
			} //chwilowo, by renederować karty tylko dla pierwszego gracza


			this.playersArray[i] = new Player(this.allCards[i], show, i + 1, this.roundManager, this.put,
				(colors == null) ? null : colors[i]);

		}
	}



	startOthers = (colors) => {

	}

	shuffle = (a) => {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	};

	roundManager = () => {
		const { playersArray } = this;

		this.activePlayer++;
		this.put.isMoved = false;
		if (this.activePlayer === playersArray.length) this.activePlayer = 0;

		playersArray[this.activePlayer].move(this.activePlayer + 1);
	};
}
export default Start;
