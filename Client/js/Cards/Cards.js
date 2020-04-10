export const createCards = (cards) => {
    const playerCards = document.querySelector('.player__cards')
    playerCards.innerHTML = '';
    const cardClass = 'player__cards__card';
    const cardFrontClass = "player__cards__card__front";
    const cardBackClass = "player__cards__card__back";
    let transformX = -5;

    for (let i = 0; i < cards.length; i++) {
        const card = document.createElement('div');
        card.classList.add(cardClass);
        card.style.transform += `translate(${transformX * i}px,-10px)`
        const cardFront = document.createElement('div');
        cardFront.classList.add(cardFrontClass)
        const cardBack = document.createElement('div');
        cardBack.classList.add(cardBackClass);
        card.appendChild(cardFront);
        card.appendChild(cardBack);

        playerCards.appendChild(card)

        if (i == cards.length - 1) {
            setTimeout(function () {
                card.dataset.item = cards[i].name;
                cardBack.style.backgroundImage = `url(../img/treasures/${cards[i].name}.png)`;
                card.style.transform = `rotateY(180deg) translateX(${-1 * transformX * i}px)`
            }, 200)
        }
    }

}

export const changeCard = (cards) => {
    const deletedData = cards.pop();
    const deletedElement = document.querySelector(`.player__cards [data-item="${deletedData.name}"]`);
    deletedElement.remove();
    createCards(cards);
    return [cards]
}

