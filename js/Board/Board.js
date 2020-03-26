import MovingField from '../MovingField/MovingField.js';
import { RandomTreasuresData } from '../Data/RandomTreasuresData.js';

class Board {
    constructor(roadFields) {
        roadFields = [...document.querySelectorAll('.board__road-field')];

        this.addDataRowsAndColumns(roadFields);
        this.buildNewBoard(roadFields);
    }

    addDataRowsAndColumns = roadFields => {
        let index = 0;

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                roadFields[index].dataset.column = j;
                roadFields[index].dataset.row = i;
                index++;
            }
        }
    }

    buildNewBoard = roadFields => {
        const { randomNumber } = this;

        const randomRoadFields = roadFields.filter(el => el.dataset.static == null);
        const treasuresRoadFields = roadFields.filter(el => el.dataset.item);
        const playerStartPosition = roadFields.filter(el => el.dataset.player !== undefined);

        const rotationOptions = ['-90', '0', '90', '180'];

        const optionArray = [
            {
                type: 'roadCorner',
                number: 16,
            },
            {
                type: 'roadEast',
                number: 12,
            },
            {
                type: 'roadSplit',
                number: 6,
            }
        ];

        playerStartPosition.forEach(el => el.style.backgroundImage = `url(../img/players/${el.dataset.player}.png), url(../img/roadSplit.png)`);

        treasuresRoadFields.forEach(el => el.style.backgroundImage = `url(${el.dataset.item}), url(../img/roadSplit.png)`);

        randomRoadFields.forEach(el => {
            const filtredOptionArray = optionArray.filter(el => el.number !== 0);

            const randomIndex = randomNumber(filtredOptionArray);

            const randomRotation = randomNumber(rotationOptions);

            const index = optionArray.map(el => el.type).indexOf(filtredOptionArray[randomIndex].type);

            optionArray[index].number--;

            if (filtredOptionArray[randomIndex].type === 'roadCorner' || filtredOptionArray[randomIndex].type === 'roadSplit') {
                if (RandomTreasuresData.length > 0) {
                    if (filtredOptionArray[randomIndex].number > 6) {
                        if (Math.floor(Math.random() * 2) === 0) {
                            const randomTreasure = randomNumber(RandomTreasuresData);

                            el.dataset.item = `../img/treasures/${RandomTreasuresData[randomTreasure].name}.png`;
        
                            RandomTreasuresData.splice(randomTreasure, 1);
                        }
                    } else {
                        const randomTreasure = randomNumber(RandomTreasuresData);

                        el.dataset.item = `../img/treasures/${RandomTreasuresData[randomTreasure].name}.png`;
        
                        RandomTreasuresData.splice(randomTreasure, 1);
                    }
                }
            }

            if (el.dataset.item === undefined) el.style.background = `url(../img/${filtredOptionArray[randomIndex].type}.png)`;
            else el.style.background = `url(${el.dataset.item}), url(../img/${filtredOptionArray[randomIndex].type}.png)`;

            el.style.transform = `rotate(${rotationOptions[randomRotation]}deg)`;
        });

        const lastElement = optionArray.filter(el => el.number === 1)[0].type;

        const movingField = new MovingField(lastElement);
    }

    randomNumber = range => Math.floor(Math.random() * range.length);
}

export default Board;