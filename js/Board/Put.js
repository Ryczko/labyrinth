class Put {

    constructor() {
        this.arrows = document.querySelectorAll('.board-arrows');
        this.movingField = document.querySelector('.player__moving-field__field');
        this.size = this.movingField.offsetWidth;
        this.arrows.forEach(el => el.addEventListener('click', this.slide));
    }

    slide = (e) => {

        this.arrows.forEach(el => {
            this.toggleArrowClasses(el);
            el.removeEventListener('click', this.slide)
        })


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

        setTimeout(() => this.replace(element, this.movingField), 300)
        setTimeout(() => this.replace(this.movingField, lastElement[0]), 600)

        setTimeout(() => this.comeBack(element, line, lastElement[0], transformValue), 700)
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


        this.replaceAllLine(line)

        line.forEach(el => el.style.transition = 'left .5s,top .5s');

        this.arrows.forEach(el => {
            this.toggleArrowClasses(el);
            el.addEventListener('click', this.slide)
        });

        element.style.display = '';
    }


    replaceAllLine(line) {
        let info = [];

        for (let i = 0; i < line.length; i++)info.push(this.getElementProperties(line[i]));

        line.forEach(el => el.removeAttribute('data-item'));

        for (let i = line.length - 1; i > 0; i--) {

            line[i].style.background = info[i - 1][0];
            line[i].style.transform = info[i - 1][1];
            if (info[i - 1][2] != '') {
                line[i].dataset.item = info[i - 1][2];
            }
        }

        line[0].style.background = 'none'
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

        const element1 = this.getElementProperties(el1);
        const element2 = this.getElementProperties(el2);

        el1.removeAttribute('data-item');
        el2.removeAttribute('data-item');

        el2.style.background = element1[0];
        el1.style.background = element2[0];
        el2.style.transform = element1[1];
        el1.style.transform = element2[1];

        if (element1[2] !== '') el2.dataset.item = element1[2];
        if (element2[2] !== '') el1.dataset.item = element2[2];
    }

    getElementProperties = (el) => {
        const background = getComputedStyle(el).getPropertyValue('background');
        const rotation = getComputedStyle(el).getPropertyValue('transform');
        const item = (el.hasAttribute('data-item')) ? el.dataset.item : '';
        return [background, rotation, item]
    }
}
export default Put;