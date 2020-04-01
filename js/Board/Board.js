import MovingField from '../MovingField/MovingField.js';
import { RandomTreasuresData } from '../Data/RandomTreasuresData.js';
import { entryType } from './entryType.js'

class Board {
    constructor(roadFields) {
        roadFields = [...document.querySelectorAll('.board__road-field')];
        this.entryType = entryType;
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
        const { randomNumber, entryType } = this;

        const randomRoadFields = roadFields.filter(el => el.dataset.static === undefined);
        const treasuresRoadFields = roadFields.filter(el => el.dataset.item);

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

        treasuresRoadFields.forEach(el => el.style.backgroundImage = `url(../img/treasures/${el.dataset.item}.png), url(../img/roadSplit.png)`);

        randomRoadFields.forEach(el => {
            const filtredOptionArray = optionArray.filter(el => el.number !== 0);

            const randomIndex = randomNumber(filtredOptionArray);
            const randomRotation = randomNumber(rotationOptions);

            const fieldType = filtredOptionArray[randomIndex].type;
            const fieldRotation = rotationOptions[randomRotation];

            const index = optionArray.map(el => el.type).indexOf(fieldType);

            optionArray[index].number--;

            if (fieldType === 'roadCorner' || fieldType === 'roadSplit') {
                if (RandomTreasuresData.length > 0) {
                    if (filtredOptionArray[randomIndex].number > 6) {
                        if (Math.floor(Math.random() * 2) === 0) {
                            const randomTreasure = randomNumber(RandomTreasuresData);

                            el.dataset.item = RandomTreasuresData[randomTreasure].name;

                            RandomTreasuresData.splice(randomTreasure, 1);
                        }
                    } else {
                        const randomTreasure = randomNumber(RandomTreasuresData);

                        el.dataset.item = RandomTreasuresData[randomTreasure].name;

                        RandomTreasuresData.splice(randomTreasure, 1);
                    }
                }
            }

            if (el.dataset.item === undefined) el.style.background = `url(../img/${fieldType}.png)`;
            else el.style.background = `url(../img/treasures/${el.dataset.item}.png), url(../img/${fieldType}.png)`;

            el.style.transform = `rotate(${fieldRotation}deg)`;

            el.dataset.entry = entryType(fieldType, fieldRotation);
        });

        const lastElement = optionArray.filter(el => el.number === 1)[0].type;

        const movingField = new MovingField(lastElement);
    }

    randomNumber = range => Math.floor(Math.random() * range.length);


}

export default Board;