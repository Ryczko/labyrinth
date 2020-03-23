import MovingField from '../MovingField/MovingField.js'

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
        const randomRoadFields = roadFields.filter(el => el.dataset.static == null);



        const rotationOptions = ['-90', '0', '90', '180'];

        let optionArray = [
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

        randomRoadFields.forEach(el => {
            const filtredOptionArray = optionArray.filter(el => el.number !== 0);

            const randomIndex = Math.floor(Math.random() * filtredOptionArray.length);

            const randomRotation = Math.floor(Math.random() * rotationOptions.length);

            const index = optionArray.map(el => el.type).indexOf(filtredOptionArray[randomIndex].type);

            optionArray[index].number--;

            el.style.backgroundImage = `url(../img/${filtredOptionArray[randomIndex].type}.png)`;
            el.style.transform = `rotate(${rotationOptions[randomRotation]}deg)`;
        });

        const lastElement = optionArray.filter(el => el.number === 1)[0].type;

        const movingField = new MovingField(lastElement);

    }
}

export default Board;