import MovingField from "../MovingField/MovingField.js";
import { RandomTreasuresData } from "../Data/RandomTreasuresData.js";
import { entryType } from "./entryType.js";

class Board {
  constructor() {
    this.roadFields = [...document.querySelectorAll(".board__road-field")];
    this.entryType = entryType;
    this.movingField = null;
  }

  addDataRowsAndColumns = () => {
    const { roadFields } = this;
    let index = 0;

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        roadFields[index].dataset.column = j;
        roadFields[index].dataset.row = i;
        index++;
      }
    }
  };

  buildNewBoard = () => {
    const { randomNumber, entryType, roadFields } = this;

    const randomRoadFields = roadFields.filter(
      (el) => el.dataset.static === undefined
    );
    const treasuresRoadFields = roadFields.filter((el) => el.dataset.item);

    const rotationOptions = ["-90", "0", "90", "180"];

    const optionArray = [
      {
        type: "roadCorner",
        number: 16,
      },
      {
        type: "roadEast",
        number: 12,
      },
      {
        type: "roadSplit",
        number: 6,
      },
    ];

    treasuresRoadFields.forEach(
      (el) =>
        (el.style.backgroundImage = `url(Game/img/treasures/${el.dataset.item}.png), url(Game/img/roadSplit.png)`)
    );

    randomRoadFields.forEach((el) => {
      const filtredOptionArray = optionArray.filter((el) => el.number !== 0);

      const randomIndex = randomNumber(filtredOptionArray);
      const randomRotation = randomNumber(rotationOptions);

      const fieldType = filtredOptionArray[randomIndex].type;
      const fieldRotation = rotationOptions[randomRotation];

      const index = optionArray.map((el) => el.type).indexOf(fieldType);

      optionArray[index].number--;

      if (fieldType === "roadCorner" || fieldType === "roadSplit") {
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

      if (el.dataset.item === undefined)
        el.style.background = `url(Game/img/${fieldType}.png)`;
      else
        el.style.background = `url(Game/img/treasures/${el.dataset.item}.png), url(Game/img/${fieldType}.png)`;

      el.style.transform = `rotate(${fieldRotation}deg)`;

      el.dataset.entry = entryType(fieldType, fieldRotation);
    });

    this.lastElement = optionArray.filter((el) => el.number === 1)[0].type;
    this.movingField = new MovingField(this.lastElement);
  };

  createNewBoard = () => {
    this.addDataRowsAndColumns();
    this.buildNewBoard();

    return this.getBoardInfo();
  };

  getBoardInfo = () => {
    this.roadFields = [...document.querySelectorAll(".board__road-field")];
    let datas = [];
    let styles = [];

    this.roadFields.forEach((el) => {
      datas.push(Object.assign({}, el.dataset));

      const styleObject = {
        background: getComputedStyle(el).getPropertyValue("background-image"),
        transform: getComputedStyle(el).getPropertyValue("transform"),
      };

      styles.push(styleObject);
    });

    return [datas, styles, this.lastElement];
  };

  copyBoard = (info) => {
    info[0].forEach((data, index) => {
      const field = this.roadFields[index];

      const dataKeys = Object.keys(data);
      const dataValues = Object.values(data);

      dataKeys.forEach((el, index) => {
        const name = el;
        const value = dataValues[index];

        field.setAttribute(`data-${name}`, value);
      });
    });
    info[1].forEach((styles, index) => {
      const field = this.roadFields[index];

      const styleKeys = Object.keys(styles);
      const styleValues = Object.values(styles);

      styleKeys.forEach((el, index) => {
        const name = el;
        const value = styleValues[index];

        if (name === "background") {
          field.style.background = value;
        } else if (name === "transform") {
          field.style.transform = value;
        }
      });
    });

    this.movingField = new MovingField(info[2]);
  };

  randomNumber = (range) => Math.floor(Math.random() * range.length);
}
export default Board;
