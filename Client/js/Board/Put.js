import { newMessage } from '../Chat/newMessage.js'


const socket = io('http://localhost:3000');


class Put {

    constructor() {
        this.arrows = document.querySelectorAll('.board-arrows');
        this.movingField = document.querySelector('.player__moving-field__field');
        this.size = this.movingField.offsetWidth + 1;

        this.isMoved = false;
    }

    addListeneres = () => {
        this.arrows.forEach(el => el.addEventListener('click', this.handleClick))
    }

    handleClick = (e) => {
        const putData = {
            row: e.target.dataset.row,
            column: e.target.dataset.column,
        }
        this.slide(putData);
        socket.emit('put-element', putData);
    }


    slide = (putData) => {

        if (this.isMoved) return newMessage('Bot', 'Field has already been moved!')

        let info = {
            row: putData.row,
            column: putData.column,
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
        this.arrows.forEach(el => {
            this.toggleArrowClasses(el);
            el.removeEventListener('click', this.handleClick);
            el.style.display = ""
        })

        const toBlock = (info[secondDirection] == 6) ? 0 : 6;
        const blockArrow = document.querySelector(`.arrows [data-${secondDirection}="${toBlock}"][data-${mainDirection}="${info[mainDirection]}"]`)
        blockArrow.style.display = 'none'


        if (column == 6 || row == 6) transformValue = -1;


        this.size = this.movingField.offsetWidth + 1;
        let allLine = document.querySelectorAll(`.board div[data-${mainDirection}="${info[mainDirection]}"]`);
        allLine.forEach(el => el.style[topOrLeft] = `${transformValue * (this.size)}px`);

        this.putMovingElement(putData, allLine, secondDirection, transformValue)
    }

    putMovingElement = (putData, line, direction, transformValue) => {

        console.log(document.querySelectorAll(`.board-arrows`));

        const elementArr = [...document.querySelectorAll(`.board-arrows`)].filter(el => {
            return el.dataset.row == putData.row && el.dataset.column == putData.column;
        });

        const element = elementArr[0];

        const last = (transformValue == 1) ? 6 : 0;
        const lastElement = [...line].filter(el => el.dataset[direction] == last);
        element.style.display = "block";
        element.style.borderRadius = '5px';

        setTimeout(() => {
            this.replace(element, this.movingField)

            const playersDivs = [...lastElement[0].children];
            const newEl = (transformValue === -1) ? line[line.length - 1] : line[0];
            const oldEl = lastElement[0];
            const oldPlayerData = oldEl.dataset.player


            this.replace(this.movingField, lastElement[0])
            this.comeBack(element, line, lastElement[0], transformValue);

            if (playersDivs.length !== 0) {

                playersDivs.forEach(el => {

                    newEl.appendChild(el)
                })

                newEl.dataset.player = oldPlayerData;
            }

        }, 800)

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

        line.forEach(el => el.style.transition = 'left .4s linear,top .4s linear');

        this.arrows.forEach(el => {
            this.toggleArrowClasses(el);
            // el.addEventListener('click', this.slide)
        });

        element.removeAttribute('data-entry')
        element.style.display = '';
        this.isMoved = true;
    }

    replaceAllLine(line) {
        let info = [];

        for (let i = 0; i < line.length; i++)info.push(this.getElementProperties(line[i]));

        line.forEach(el => el.removeAttribute('data-item'));

        for (let i = line.length - 1; i > 0; i--) {


            line[i].style.background = info[i - 1][0];
            line[i].style.transform = info[i - 1][1];
            if (info[i - 1][2] != '') line[i].dataset.item = info[i - 1][2];
            if (info[i - 1][3] != '') line[i].dataset.entry = info[i - 1][3];
            if (info[i - 1][4] != '') line[i].dataset.player = info[i - 1][4];

            if (info[i - 1][5].length !== 0) {

                info[i - 1][5].forEach(el => {
                    line[i].appendChild(el)
                })
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

        el2.style.background = element1[0];
        el1.style.background = element2[0];
        el2.style.transform = element1[1];
        el1.style.transform = element2[1];

        if (element1[2] !== '') el2.dataset.item = element1[2];
        if (element2[2] !== '') el1.dataset.item = element2[2];

        if (element1[3] !== '') el2.dataset.entry = element1[3];
        if (element2[3] !== '') el1.dataset.entry = element2[3];
    }

    getElementProperties = (el) => {
        const background = getComputedStyle(el).getPropertyValue('background');
        const rotation = getComputedStyle(el).getPropertyValue('transform');
        const item = (el.hasAttribute('data-item')) ? el.dataset.item : '';
        const entry = (el.hasAttribute('data-entry')) ? el.dataset.entry : '';
        const player = (el.hasAttribute('data-player')) ? el.dataset.player : '';

        let playerDiv = [];
        if (player !== '') {

            [...el.children].forEach(e => {
                playerDiv.push(e)
            })

            el.innerHTML = '';
        }

        el.removeAttribute('data-item');
        el.removeAttribute('data-player');
        return [background, rotation, item, entry, player, playerDiv]
    }
}
export default Put;