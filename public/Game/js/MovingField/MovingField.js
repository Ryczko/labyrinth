import { entryType } from "../Board/entryType.js";

const socket = io(window.location.origin);

class MovingField {
  constructor(type) {
    this.type = type;
    this.rotate = 0;
    this.movingField = document.querySelector(".player__moving-field__field");
    this.arrow = document.querySelector(".player__moving-field__arrow");
    this.addMovingField();
  }

  addMovingField = () => {
    this.movingField.style.backgroundImage = `url(Game/img/${this.type}.png)`;

    this.arrow.addEventListener("click", () => {
      socket.emit("rotate-element", roomName);
    });

    this.movingField.dataset.entry = entryType(
      this.type,
      this.rotate.toString()
    );
  };

  rotateMovingField = () => {
    const entryData = this.movingField.dataset.entry.split(",");
    const arr1 = ["top", "bottom"];
    const arr2 = ["left", "right"];

    let checker = (arr, target) => target.every((el) => arr.includes(el));

    if (entryData.length === 3) {
      this.type = "roadSplit";
    } else {
      if (checker(entryData, arr1) || checker(entryData, arr2)) {
        this.type = "roadEast";
      } else {
        this.type = "roadCorner";
      }
    }

    this.rotate += 90;

    if (this.rotate === 270) this.rotate = -90;
    this.movingField.style.transform = `rotate(${this.rotate}deg)`;
    this.movingField.dataset.entry = entryType(
      this.type,
      this.rotate.toString()
    );
  };
}

export default MovingField;
