import { createCards, changeCard } from '../Cards/Cards.js'

class Player {
    constructor(cards, show) {
        this.cards = cards;
        if (show) createCards(this.cards);
    }



}

export default Player;