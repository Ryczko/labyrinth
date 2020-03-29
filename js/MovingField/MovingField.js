import { entryType } from '../Board/entryType.js'

class MovingField {

    constructor(type) {
        this.type = type;
        this.rotate = 0;
        this.movingField = document.querySelector('.player__moving-field__field');
        this.arrow = document.querySelector('.player__moving-field__arrow');
        this.addMovingField();
    }

    addMovingField = () => {
        this.movingField.style.backgroundImage = `url(../img/${this.type}.png)`;
        this.arrow.addEventListener('click', this.rotateMovingField);
        this.movingField.dataset.entry = entryType(this.type, this.rotate.toString())
    }

    rotateMovingField = () => {

        this.rotate += 90;
        if (this.rotate === 270) this.rotate = -90;
        this.movingField.style.transform = `rotate(${this.rotate}deg)`;
        this.movingField.dataset.entry = entryType(this.type, this.rotate.toString())

    }
}

export default MovingField;


