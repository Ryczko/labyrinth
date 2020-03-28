import { createCards, changeCard } from '../Cards/Cards.js'

class Player {
    constructor(cards, show) {
        this.roadFields = [...document.querySelectorAll('.board__road-field')];
        this.cards = cards;
        this.id = 0;

        if (show) createCards(this.cards);
        this.inicialPosition();
    }

    sortNumber = (a, b) => a - b;

    inicialPosition = () => {
        let { id } = this;
        const { roadFields, move } = this;

        const playerStartPositions = roadFields.filter(el => el.dataset.player !== undefined);
        let freePlaces = [];

        playerStartPositions.forEach((el, index) => {
            if (el.dataset.player === '') freePlaces.push(index);
        })

        freePlaces = freePlaces.sort(this.sortNumber);

        id = freePlaces[0] + 1;

        playerStartPositions[id - 1].dataset.player = id;

        playerStartPositions[id - 1].style.backgroundImage = `url(../img/players/player${id}.png), url(../img/roadCorner.png)`;

        move(id);
    }

    move = id => {
        const { roadFields } = this;

        const playerPosition = roadFields.filter(el => el.dataset.player === `${id}`);

        playerPosition[0].addEventListener('click', () => {
            roadFields.forEach(el => {
                el.addEventListener('click', e => {
                    const playerPosition = roadFields.filter(el => el.dataset.player === `${id}`);

                    const x = parseInt(playerPosition[0].dataset.row),
                          y = parseInt(playerPosition[0].dataset.column);

                    const field = e.target;

                    const oldPostionBackground = playerPosition[0].style.backgroundImage.split(',');

                    playerPosition[0].removeAttribute('data-player');

                    if (oldPostionBackground.length === 3) {
                        playerPosition[0].style.backgroundImage = `${playerPosition[0].style.backgroundImage.split(',')[1]}, 
                                                                    ${playerPosition[0].style.backgroundImage.split(',')[2]}`;
                    } else {
                        playerPosition[0].style.backgroundImage = `${playerPosition[0].style.backgroundImage.split(',')[1]}`;
                    }
                    
                    const secondBackground = field.style.backgroundImage;

                    field.dataset.player = id;
                    field.style.backgroundImage = `url(../img/players/player${id}.png), ${secondBackground}`;

                    // this.goRight(x)
                })
            })
        })
    }

    // goRight = x => {
    //     const { roadFields } = this;

    //     const rightField = roadFields.filter(el => el.dataset.column === `${x + 1}`);

    //     console.log(rightField[0])
    // }
}

export default Player;