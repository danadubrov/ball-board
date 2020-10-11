'use strict';

var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER = '🌝';
var BALL = '🌸';
var GLUE = '🦠';

var gBallsCollected;
var gBallsOnBoard;

var gGamerPos;
var gBoard;
var gNewBallInterval;
var gGlueInterval;

var gIsGlued;


function init() {
	restartGame();
	gBoard = buildBoard();
	renderBoard(gBoard);
	gNewBallInterval = setInterval(addNewBall, 2000);
	gGlueInterval = setInterval(addNewGlue, 3000);
}

function restartGame() {
	gIsGlued = false;
	gBallsCollected = 0;
	gBallsOnBoard = 2;
	gGamerPos = { i: 2, j: 9 };
	if(gNewBallInterval) clearInterval(gNewBallInterval);
	if(gGlueInterval) clearInterval (gGlueInterval);
	var elCounter = document.querySelector('.count');
	elCounter.innerText = gBallsCollected;
	var elTitle = document.querySelector('.title');
	elTitle.innerText = 'Collect the Flowers!';

}


function buildBoard() {
	var board = [];
	// TODO: Create the Matrix 10 * 12 
	// TODO: Put FLOOR everywhere and WALL at edges
	var height = 10;
	var width = 12;
	for (var i = 0; i < height; i++) {
		board[i] = [];
		for (var j = 0; j < width; j++) {
			var cell = {
				type: FLOOR,
				gameElement: ''
			}
			if (i === 0 || j === 0 || i === height - 1 || j === width - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}

	//add passages
	board[3][0].type = FLOOR;
	board[3][width - 1].type = FLOOR;

	// TODO: Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	board[3][3].gameElement = BALL;
	board[4][5].gameElement = BALL;

	// console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL;
			} else if (currCell.gameElement === GLUE) {
				strHTML += GLUE;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (!gIsGlued) {
		var targetCell = gBoard[i][j];

		if (j >= 0 && j < gBoard[i].length) {
			if (targetCell.type === WALL) return;
			if (targetCell.gameElement === GLUE) {
				gIsGlued = true;
				setTimeout(function () { gIsGlued = false }, 3000);
			}
		}

		// Calculate distance to ake sure we are moving to a neighbor cell
		var iAbsDiff = Math.abs(i - gGamerPos.i);
		var jAbsDiff = Math.abs(j - gGamerPos.j);

		var absDistance = jAbsDiff + iAbsDiff;

		console.log('abs distance vetween cells:', absDistance);

		// If the clicked Cell is one of the four allowed
		if (absDistance === 1) {

			if (j < 0) j = gBoard[i].length - 1;
			else if (j === gBoard[i].length) j = 0;
			targetCell = gBoard[i][j];

			if (targetCell.gameElement === BALL) {
				console.log('Collecting!');
				gBallsCollected++;
				var elCounter = document.querySelector('.count');
				elCounter.innerText = gBallsCollected;
			}

			// Todo: Move the gamer
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = '';
			renderCell(gGamerPos, '');

			gGamerPos.i = i;
			gGamerPos.j = j;

			gBoard[i][j].gameElement = GAMER;
			renderCell(gGamerPos, GAMER);

			if (gBallsOnBoard === gBallsCollected) {
				var elTitle = document.querySelector('.title');
				elTitle.innerText = 'GREAT!';
				clearInterval(gNewBallInterval);
				clearInterval(gGlueInterval);
			}

		} else console.log('TOO FAR', iAbsDiff, jAbsDiff);
	}

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	// console.log(event);

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function addNewBall() {
	var i = getRndInteger(1, gBoard.length - 2);
	var j = getRndInteger(1, gBoard[0].length - 2);

	while (!isEmptyCell(i, j)) {
		i = getRndInteger(1, gBoard.length - 2);
		j = getRndInteger(1, gBoard[0].length - 2);
	}

	gBoard[i][j].gameElement = BALL;
	renderCell({ i: i, j: j }, BALL);
	gBallsOnBoard++;
}
function addNewGlue() {
	var i = getRndInteger(1, gBoard.length - 2);
	var j = getRndInteger(1, gBoard[0].length - 2);

	while (!isEmptyCell(i, j)) {
		i = getRndInteger(1, gBoard.length - 2);
		j = getRndInteger(1, gBoard[0].length - 2);
	}

	gBoard[i][j].gameElement = GLUE;
	renderCell({ i: i, j: j }, GLUE);
	setTimeout(function(){removeGlue(i,j)}, 3000);

}

function removeGlue(i, j) {
	if (!gIsGlued) {
		gBoard[i][j].gameElement = '';
		renderCell({ i: i, j: j }, '');
	}
}

function isEmptyCell(i, j) {
	return gBoard[i][j].gameElement === '';

}


function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}