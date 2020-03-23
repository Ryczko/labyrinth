class MovingField {

    constructor(type) {
        this.type = type;
        this.rotate = 0;
        this.movingField = document.querySelector('.moving-field__field');
        this.arrow = document.querySelector('.moving-field__arrow');
        this.addMovingField();
    }

    addMovingField = () => {
        this.movingField.style.backgroundImage = `url(../img/${this.type}.png)`;
        this.arrow.addEventListener('click', this.rotateMovingField);

    }

    rotateMovingField = (e) => {


        this.rotate += 90;
        this.movingField.style.transform = `rotate(${this.rotate}deg)`;
        if (this.rotate === 360) this.rotate = 0;

    }
}

export default MovingField;


