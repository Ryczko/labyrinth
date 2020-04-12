
// const MovingField = require('../MovingField/MovingField.js');
// const RandomTreasuresData = require('../Data/RandomTreasuresData')
// const entryType = require('../Board/entryType.js')

import MovingField from '../MovingField/MovingField.js';
import { RandomTreasuresData } from '../Data/RandomTreasuresData.js';
import { entryType } from './entryType.js'

class Board {
    constructor() {
        this.roadFields = [...document.querySelectorAll('.board__road-field')];
        this.entryType = entryType;

    }

    addDataRowsAndColumns = () => {
        const { roadFields } = this
        let index = 0;

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                roadFields[index].dataset.column = j;
                roadFields[index].dataset.row = i;
                index++;
            }
        }
    }

    buildNewBoard = () => {
        const { randomNumber, entryType, roadFields } = this;

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

        treasuresRoadFields.forEach(el => el.style.backgroundImage = `url(../Client/img/treasures/${el.dataset.item}.png), url(../Client/img/roadSplit.png)`);

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

            if (el.dataset.item === undefined) el.style.background = `url(../Client/img/${fieldType}.png)`;
            else el.style.background = `url(../Client/img/treasures/${el.dataset.item}.png), url(../Client/img/${fieldType}.png)`;

            el.style.transform = `rotate(${fieldRotation}deg)`;

            el.dataset.entry = entryType(fieldType, fieldRotation);
        });

        const lastElement = optionArray.filter(el => el.number === 1)[0].type;

        const movingField = new MovingField(lastElement);
    }

    createNewBoard = () => {
        this.addDataRowsAndColumns();
        this.buildNewBoard();
        return this.getBoardInfo();
    }

    getBoardInfo = () => {
        this.roadFields = [...document.querySelectorAll('.board__road-field')];
        let datas = [];
        let styles = [];


        this.roadFields.forEach(el => {
            datas.push(Object.assign({}, el.dataset));

            const styleObject = {
                background: getComputedStyle(el).getPropertyValue('background'),
                transform: getComputedStyle(el).getPropertyValue('transform')
            }

            styles.push(styleObject)
        })

        return [datas, styles]
    }



    copyBoard = (info) => {

        //tutaj
    }

    randomNumber = range => Math.floor(Math.random() * range.length);


}
export default Board
