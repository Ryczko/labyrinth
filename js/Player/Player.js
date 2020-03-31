import { createCards, changeCard } from '../Cards/Cards.js'

class Player {
    constructor(cards, show) {
        this.roadFields = [...document.querySelectorAll('.board__road-field')];
        this.cards = cards;
        this.id = 0;

        if (show) createCards(this.cards);
        this.inicialPosition();
    }

    sortNumber = (a, b) => a - b;

    inicialPosition = () => {
        let { id } = this;
        const { roadFields } = this;

        const playerStartPositions = roadFields.filter(el => el.dataset.player !== undefined);
        let freePlaces = [];

        playerStartPositions.forEach((el, index) => {
            if (el.dataset.player === '') freePlaces.push(index);
        })

        freePlaces = freePlaces.sort(this.sortNumber);

        id = freePlaces[0] + 1;

        playerStartPositions[id - 1].dataset.player = id;

        playerStartPositions[id - 1].style.backgroundImage = `url(../img/players/player${id}.png), url(../img/roadCorner.png)`;

        this.id = id;

        this.move(id);
    }

    move = id => {
        const { roadFields, canPass } = this;

        const playerPosition = roadFields.filter(el => el.dataset.player === `${id}`);

        playerPosition[0].addEventListener('click', () => {
            const matrixBoard = [];

            for (let i = 0; i < 7; i++) {
                const arrRow = [];

                for (let j = 0; j < 7; j++) {
                    let directions = '';
                    const field = roadFields.filter(el => el.dataset.row === `${i}` && el.dataset.column === `${j}`);

                    //top
                    if (i === 0) directions += '0';
                    else  {
                        const fieldTop = roadFields.filter(el => el.dataset.row === `${i - 1}` && el.dataset.column === `${j}`);
                        directions += canPass(field, fieldTop, 'top', 'bottom');
                    }

                    //right
                    if (j === 6) directions += '0';
                    else {
                        const fieldRight = roadFields.filter(el => el.dataset.row === `${i}` && el.dataset.column === `${j + 1}`);
                        directions += canPass(field, fieldRight, 'right', 'left');
                    }

                    //bottom
                    if (i === 6) directions += '0';
                    else {
                        const fieldBottom = roadFields.filter(el => el.dataset.row === `${i + 1}` && el.dataset.column === `${j}`);
                        directions += canPass(field, fieldBottom, 'bottom', 'top');
                    }

                    //left
                    if (j === 0) directions += '0';
                    else {
                        const fieldLeft = roadFields.filter(el => el.dataset.row === `${i}` && el.dataset.column === `${j - 1}`);
                        directions += canPass(field, fieldLeft, 'left', 'right');
                    }

                    arrRow.push(directions);               
                }

                matrixBoard.push(arrRow);
            }

            roadFields.forEach(el => {
                el.addEventListener('click', e => {
                    const playerPosition = roadFields.filter(el => el.dataset.player === `${id}`);
                    const field = e.target;

                    const xStart = parseInt(playerPosition[0].dataset.row),
                          yStart = parseInt(playerPosition[0].dataset.column);

                    const xEnd = parseInt(field.dataset.row),
                          yEnd = parseInt(field.dataset.column);

                    let iStart = xStart,
                        jStart = yStart;
                        
                    let path = `${iStart}${jStart}`;

                    const cloneMatrixBoard = matrixBoard;

                    do {
                        if (cloneMatrixBoard[iStart][jStart] === '0000') {
                            path = path.substr(0, path.length - 2);
                        }
                        
                        if (path !== '') {
                            iStart = parseInt(path.substr(path.length - 2, 1));
                            jStart = parseInt(path.substr(path.length - 1, 1));

                            //checking top
                            if (cloneMatrixBoard[iStart][jStart].substr(0, 1) === '1') {
                                cloneMatrixBoard[iStart][jStart] = '0' +
                                                                   cloneMatrixBoard[iStart][jStart].substr(1, 3);
                                iStart -= 1;
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 2) + 
                                                                   '0' + 
                                                                   cloneMatrixBoard[iStart][jStart].substr(3, 1);
                            }
                            //checking right
                            else if (cloneMatrixBoard[iStart][jStart].substr(1, 1) === '1') {
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 1) +
                                                                   '0' +
                                                                   cloneMatrixBoard[iStart][jStart].substr(2, 2);
                                jStart += 1;
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 3) +
                                                                   '0';
                            }
                            //checking bottom
                            else if (cloneMatrixBoard[iStart][jStart].substr(2, 1) === '1') {
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 2) +
                                                                   '0' +
                                                                   cloneMatrixBoard[iStart][jStart].substr(3, 1);
                                iStart += 1;
                                cloneMatrixBoard[iStart][jStart] = '0' +
                                                                   cloneMatrixBoard[iStart][jStart].substr(1, 3);
                            }
                            //checking left
                            else if (cloneMatrixBoard[iStart][jStart].substr(3, 1) === '1') {
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 3) +
                                                                   '0';
                                jStart -= 1;
                                cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 1) +
                                                                   '0' +
                                                                   cloneMatrixBoard[iStart][jStart].substr(2, 2);
                            }

                            if (`${iStart}${jStart}` !== path.substr(path.length - 2, 2)) {
                                path += `${iStart}${jStart}`;
                            }
                        }

                    } while (path.substr(path.length - 2, 2) !== `${xEnd}${yEnd}` && `${iStart}${jStart}` !== '00');

                    if (path === '' || path === '00') {
                        console.log('brak przejścia')
                    } else {
                        const arrPath = [];
                        let point = '';
    
                        for (let i = 0; i < path.length; i++) {
                            point += path[i];
    
                            if (point.length === 2) arrPath.push(point);
    
                            if (i % 2 !== 0) point = '';
                        }
    
                        arrPath.forEach((point, index) => {
                            setTimeout(() => {
                                if (index < arrPath.length - 1) {
                                    const oldPostion = roadFields.filter(el => el.dataset.row === point[0] && el.dataset.column === point[1]);
                                    const oldPostionBackground = oldPostion[0].style.backgroundImage.split(',');
                                    
                                    if (oldPostion[0].dataset.player.length > 1) oldPostion[0].dataset.player.substr(oldPostion[0].dataset.player.indexOf(id), 1);
                                    else oldPostion[0].removeAttribute('data-player');
        
                                    if (oldPostionBackground.length === 3) {
                                        oldPostion[0].style.backgroundImage = `${oldPostion[0].style.backgroundImage.split(',')[1]}, 
                                                                                    ${oldPostion[0].style.backgroundImage.split(',')[2]}`;
                                    } else {
                                        oldPostion[0].style.backgroundImage = `${oldPostion[0].style.backgroundImage.split(',')[1]}`;
                                    }
                                    
                                    const newPosition = roadFields.filter(el => el.dataset.row === arrPath[index + 1][0] && el.dataset.column === arrPath[index + 1][1]);   
                                    const newPostionBackground = newPosition[0].style.backgroundImage;
            
                                    if (newPosition[0].dataset.player !== undefined) newPosition[0].dataset.player += id;
                                    else newPosition[0].dataset.player = id;
            
                                    newPosition[0].style.backgroundImage = `url(../img/players/player${id}.png), ${newPostionBackground}`;
                                }
                            }, 500 * (index + 1)) //animation speed
                            
                        })  
                    }                                                    
                })
            })
        })
    }

    canPass = (field, nextField, fieldDirection, nextFieldDirection) => {
        if (nextField[0].dataset.entry.indexOf(`${nextFieldDirection}`) !== -1 && field[0].dataset.entry.indexOf(`${fieldDirection}`) !== -1) return '1';
        else return '0';
    }
}

export default Player;