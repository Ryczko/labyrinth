class Put {

    constructor() {
        this.arrows = document.querySelectorAll('.board-arrows');
        this.movingField = document.querySelector('.moving-field__field');
        this.size = this.movingField.offsetWidth;
        this.arrows.forEach(el => el.addEventListener('click', this.slide));
    }

    slide = (e) => {

        this.arrows.forEach(el => this.toggleArrowClasses(el))

        let info = {
            row: e.target.dataset.row,
            column: e.target.dataset.column,
            mainDirection: 'row',
            secondDirection: 'column',
            topOrLeft: 'left',
            transformValue: 1
        }
        let { row, column, mainDirection, secondDirection, topOrLeft, transformValue } = info;


        if (row == 0 || row == 6) {
            mainDirection = "column";
            secondDirection = "row";
            topOrLeft = "top"
        }

        if (column == 6 || row == 6) transformValue = -1;

        let allLine = document.querySelectorAll(`.board div[data-${mainDirection}="${info[mainDirection]}"]`);
        allLine.forEach(el => el.style[topOrLeft] = `${transformValue * this.size}px`);

        this.putMovingElement(e.target, allLine, secondDirection, transformValue)
    }

    putMovingElement = (element, line, direction, transformValue) => {

        const last = (transformValue == 1) ? 6 : 0;
        const lastElement = [...line].filter(el => el.dataset[direction] == last);
        element.style.display = "block";

        setTimeout(() => this.replace(element, this.movingField), 500)
        setTimeout(() => this.replace(this.movingField, lastElement[0]), 750)
        setTimeout(() => this.comeBack(element, line, lastElement[0], transformValue), 1000)
    }

    comeBack = (element, line, last, transformValue) => {

        if (transformValue == 1) {
            line = [...line].splice(0, line.length - 1)
            line = [element, ...line, last]
        }
        else if (transformValue == -1) line = [...line, element].reverse();

        line.forEach(el => {
            el.style.transition = '0s';
            el.style.top = `0px`;
            el.style.left = `0px`;
        })

        for (let i = line.length - 1; i > 0; i--) this.replace(line[i - 1], line[i]);

        line.forEach(el => el.style.transition = 'left .5s,top .5s');

        this.arrows.forEach(el => this.toggleArrowClasses(el));
        element.style.display = '';
    }

    refreshLine = (line, direction, row, col) => {

        let value = (col == 6 || row == 6) ? 1 : -1;
        line.forEach((el, index) => el.dataset[direction] = index + value);

    }

    toggleArrowClasses = (el) => {
        el.classList.toggle('unactive');
        el.parentNode.classList.toggle('unactive');
        el.style.transform = 'none'
    }

    replace = (el1, el2) => {
        const elementBackground1 = getComputedStyle(el1).getPropertyValue('background');
        const elementBackground2 = getComputedStyle(el2).getPropertyValue('background');
        const elementRotation1 = getComputedStyle(el1).getPropertyValue('transform');
        const elementRotation2 = getComputedStyle(el2).getPropertyValue('transform');

        el2.style.background = elementBackground1;
        el1.style.background = elementBackground2;
        el1.style.transform = elementRotation2;
        el2.style.transform = elementRotation1;
    }
}
export default Put;