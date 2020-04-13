import { createCards, changeCard } from '../Cards/Cards.js';
import { newMessage } from '../Chat/newMessage.js'
class Player {
	constructor(cards, show, id, roundMenager, put) {
		this.roadFields = [...document.querySelectorAll('.board__road-field')];
		this.cards = cards;
		this.id = id;
		this.startPosition = {};
		this.leaveBtn = document.getElementById('button-leave');
		this.pawn = null;

		this.put = put;

		this.changePlayer = roundMenager;
		if (show) createCards(this.cards);
		this.inicialPlayersPosition();
		if (show) this.move(id);

		this.timer = document.querySelector('.player__timer');
		this.time = 30;

		this.playerSkin;
		this.win = false;
	}

	inicialPlayersPosition = () => {
		const { id, roadFields } = this;

		const playerStartPositions = roadFields.filter((el) => el.dataset.player !== undefined);

		playerStartPositions[id - 1].dataset.player = id;

		this.startPosition = {
			column: playerStartPositions[id - 1].dataset.column,
			row: playerStartPositions[id - 1].dataset.row
		}

		const player = document.createElement('div');
		player.id = `player${id}`;
		player.classList.add('pawn');

		//random color
		this.playerSkin = `rgb(${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)}, ${Math.floor((Math.random() * 255) + 1)})`;
		player.style.background = this.playerSkin

		playerStartPositions[id - 1].append(player);

		this.pawn = player;
	};

	startCounting = () => {
		let { put, timer } = this;
		if (this.time === 0) {
			put.isMoved = true;
			this.handleLeaveMove();
			this.time = 30;

		}
		this.time--;
		timer.textContent = this.time;
	}

	move = (id) => {
		const { roadFields, leaveBtn } = this;

		newMessage('Bot', `Player's turn number ${id}`, this.playerSkin);

		this.countingInterval = setInterval(this.startCounting, 1000);

		leaveBtn.addEventListener('click', this.handleLeaveMove);

		roadFields.forEach((el) => {
			el.addEventListener('click', this.onClick);
		});
	};

	onClick = (e) => {
		this.handleRoadField(this.id, e);
	};

	handleLeaveMove = () => {
		const { put, leaveBtn, roadFields } = this;

		if (put.isMoved) {

			leaveBtn.removeEventListener('click', this.handleLeaveMove);
			roadFields.forEach((el) => {
				el.removeEventListener('click', this.onClick);
			});

			clearInterval(this.countingInterval);
			this.time = 30;

			if (!this.win) this.changePlayer();
			else newMessage('Bot', 'End of the game!');
		} else {
			newMessage('Bot', 'In first put the block!')
		}

	}

	handleRoadField = (id, event) => {
		const { createPath, isEntry, moveAnimation, roadFields, createMatrixBoard, leaveBtn } = this;

		if (!this.put.isMoved) return newMessage('Bot', 'In first put the block!');

		const matrixBoard = createMatrixBoard();

		const field = event.target;

		const path = createPath(field, this.id, matrixBoard);

		if (path !== undefined) {
			if (isEntry(path)) {
				roadFields.forEach((el) => {
					el.removeEventListener('click', this.onClick);
				});

				clearInterval(this.countingInterval);
				moveAnimation(path, id);
	
				leaveBtn.removeEventListener('click', this.handleLeaveMove);

				this.time = 30;

				// if (!this.win) this.changePlayer();
				// else newMessage('Bot', 'End of the game!');
			} else {
				newMessage('Bot', 'No transition!');
			}
		}
	};

	isWin = (arrPath) => {
		const { cards, startPosition } = this;

		console.log(arrPath)

		const xPlayer = parseInt(arrPath[0]),
			  yPlayer = parseInt(arrPath[1]);
		
		if (cards.length === 0 && xPlayer === parseInt(startPosition.row) && yPlayer === parseInt(startPosition.column)) {
			this.win = true;
			return true;
		} else return false;
	};

	showFinish = () => {
		const { cards, roadFields, startPosition } = this;

		if (cards.length === 0) {
			const finishPosition = roadFields.filter(el => el.dataset.row === startPosition.row && el.dataset.column === startPosition.column);

			finishPosition[0].style.filter = 'contrast(1.5)';
		}
	};

	canPass = (field, nextField, fieldDirection, nextFieldDirection) => {
		if (
			nextField[0].dataset.entry.indexOf(`${nextFieldDirection}`) !== -1 &&
			field[0].dataset.entry.indexOf(`${fieldDirection}`) !== -1
		)
			return '1';
		else return '0';
	};

	createMatrixBoard = () => {
		const { roadFields, canPass } = this;
		const matrixBoard = [];

		for (let i = 0; i < 7; i++) {
			const arrRow = [];

			for (let j = 0; j < 7; j++) {
				let directions = '';
				const field = roadFields.filter((el) => el.dataset.row === `${i}` && el.dataset.column === `${j}`);

				//top
				if (i === 0) directions += '0';
				else {
					const fieldTop = roadFields.filter(
						(el) => el.dataset.row === `${i - 1}` && el.dataset.column === `${j}`
					);
					directions += canPass(field, fieldTop, 'top', 'bottom');
				}

				//right
				if (j === 6) directions += '0';
				else {
					const fieldRight = roadFields.filter(
						(el) => el.dataset.row === `${i}` && el.dataset.column === `${j + 1}`
					);
					directions += canPass(field, fieldRight, 'right', 'left');
				}

				//bottom
				if (i === 6) directions += '0';
				else {
					const fieldBottom = roadFields.filter(
						(el) => el.dataset.row === `${i + 1}` && el.dataset.column === `${j}`
					);
					directions += canPass(field, fieldBottom, 'bottom', 'top');
				}

				//left
				if (j === 0) directions += '0';
				else {
					const fieldLeft = roadFields.filter(
						(el) => el.dataset.row === `${i}` && el.dataset.column === `${j - 1}`
					);
					directions += canPass(field, fieldLeft, 'left', 'right');
				}

				arrRow.push(directions);
			}

			matrixBoard.push(arrRow);
		}

		return matrixBoard;
	};

	createPath = (field, id, matrixBoard) => {
		const { roadFields } = this;

		const playerPosition = roadFields.filter((el) => {
			if (el.dataset.player !== undefined) {
				if (el.dataset.player.length > 1) return el.dataset.player.indexOf(id) != -1;
				else return el.dataset.player === `${id}`;
			}
		});

		const xStart = parseInt(playerPosition[0].dataset.row),
			yStart = parseInt(playerPosition[0].dataset.column);

		let xEnd = parseInt(field.dataset.row),
			yEnd = parseInt(field.dataset.column);

		if (isNaN(xEnd) || isNaN(yEnd)) {
			field = field.parentElement;

			xEnd = parseInt(field.dataset.row);
			yEnd = parseInt(field.dataset.column);
		}

		if (xStart === xEnd && yStart === yEnd) {
			return newMessage('Bot', 'You are standing here, select another place');
		}

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
					cloneMatrixBoard[iStart][jStart] = '0' + cloneMatrixBoard[iStart][jStart].substr(1, 3);
					iStart -= 1;
					cloneMatrixBoard[iStart][jStart] =
						cloneMatrixBoard[iStart][jStart].substr(0, 2) +
						'0' +
						cloneMatrixBoard[iStart][jStart].substr(3, 1);
				} else if (cloneMatrixBoard[iStart][jStart].substr(1, 1) === '1') {
					//checking right
					cloneMatrixBoard[iStart][jStart] =
						cloneMatrixBoard[iStart][jStart].substr(0, 1) +
						'0' +
						cloneMatrixBoard[iStart][jStart].substr(2, 2);
					jStart += 1;
					cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 3) + '0';
				} else if (cloneMatrixBoard[iStart][jStart].substr(2, 1) === '1') {
					//checking bottom
					cloneMatrixBoard[iStart][jStart] =
						cloneMatrixBoard[iStart][jStart].substr(0, 2) +
						'0' +
						cloneMatrixBoard[iStart][jStart].substr(3, 1);
					iStart += 1;
					cloneMatrixBoard[iStart][jStart] = '0' + cloneMatrixBoard[iStart][jStart].substr(1, 3);
				} else if (cloneMatrixBoard[iStart][jStart].substr(3, 1) === '1') {
					//checking left
					cloneMatrixBoard[iStart][jStart] = cloneMatrixBoard[iStart][jStart].substr(0, 3) + '0';
					jStart -= 1;
					cloneMatrixBoard[iStart][jStart] =
						cloneMatrixBoard[iStart][jStart].substr(0, 1) +
						'0' +
						cloneMatrixBoard[iStart][jStart].substr(2, 2);
				}

				if (`${iStart}${jStart}` !== path.substr(path.length - 2, 2)) {
					path += `${iStart}${jStart}`;
				}
			}
		} while (path.substr(path.length - 2, 2) !== `${xEnd}${yEnd}` && path !== '');

		return path;
	};

	isEntry = (path) => {
		if (path === '') return false;
		else return true;
	};

	moveAnimation = (path, id) => {
		const { roadFields } = this;

		const arrPath = [];
		let point = '';

		for (let i = 0; i < path.length; i++) {
			point += path[i];

			if (point.length === 2) arrPath.push(point);

			if (i % 2 !== 0) point = '';
		}

		const moveSpeed = 200;

		arrPath.forEach((point, index) => {
			setTimeout(() => {
				if (index < arrPath.length - 1) {
					const oldPostion = roadFields.filter(
						(el) => el.dataset.row === point[0] && el.dataset.column === point[1]
					);

					if (oldPostion[0].dataset.player !== undefined) {
						if (oldPostion[0].dataset.player.length > 1) {
							if (oldPostion[0].dataset.player.length === 2) oldPostion[0].classList.remove('morePlayers');
							oldPostion[0].dataset.player = oldPostion[0].dataset.player.replace(id, '');
						} else {
							oldPostion[0].removeAttribute('data-player');
						}
					}

					oldPostion[0].removeChild(this.pawn);

					const newPosition = roadFields.filter(
						(el) => el.dataset.row === arrPath[index + 1][0] && el.dataset.column === arrPath[index + 1][1]
					);

					if (newPosition[0].dataset.player === undefined) {
						newPosition[0].dataset.player = `${id}`;
					} else {
						newPosition[0].classList.add('morePlayers');
						newPosition[0].dataset.player += `${id}`;
					}

					newPosition[0].append(this.pawn);
				}
			}, moveSpeed * (index + 1)); //animation speed
		});

		const treasureAnimationTime = (arrPath.length - 2) * moveSpeed;

		setTimeout(() => this.collectTreasure(arrPath), treasureAnimationTime);

		if (this.isWin(arrPath[arrPath.length - 1])) return newMessage('Bot', `Congratulations, player ${id} wins!`);

		setTimeout(() => {
			if (!this.win) this.changePlayer();
			else newMessage('Bot', 'End of the game!');
		}, treasureAnimationTime);
	};

	collectTreasure = (arrPath) => {
		const { roadFields } = this;

		if (this.cards.length > 0) {
			const currentPosition = arrPath[arrPath.length - 1];
			const currentField = roadFields.filter(
				(el) => el.dataset.row === currentPosition[0] && el.dataset.column === currentPosition[1]
			);
	
			if (currentField[0].dataset.item !== undefined) {
				const findingTreasure = this.cards[this.cards.length - 1].name;
				const onFieldTreasure = currentField[0].dataset.item;
	
				if (findingTreasure === onFieldTreasure) {
					changeCard(this.cards);
	
					currentField[0].removeAttribute('data-item');
	
					const currentFieldBackgrounds = currentField[0].style.backgroundImage.split(',');
					const newBackground = currentFieldBackgrounds.filter((el) => !el.includes('treasures'));
					let backgroundString = '';
	
					newBackground.forEach((el) => {
						backgroundString += el + ', ';
					});
	
					currentField[0].style.backgroundImage = `${newBackground}`;
	
					newMessage('Bot', `Player ${this.id} collected the ${onFieldTreasure}!`);
					this.showFinish();
				}
			}
		} 
	};
}

export default Player;
