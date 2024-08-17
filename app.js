// What elements do i need?
//  correct button labeling depending on game state
//  Player cannot press until the sequence stops playing

const sequence = [];

const playerSequence = [];

const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const squares = document.querySelectorAll('.square');
const answerList = document.querySelector('#answer-list')
const actualAnswerList = document.querySelector('#actual-answer-list')
const actualAnswerContainer = document.querySelector('.actual-answer-container');
const sequenceLengthInput = document.querySelector('#sequenceLength');
const squareContainer = document.querySelector('#square-container');

let display = document.getElementById('display');
let buttonText = document.getElementById('startBtn');

let playerWin = false;
let isGameOver = true;
let isMidSequence = false;



startBtn.addEventListener('click', function(e) {
    e.preventDefault();

    if (isGameOver) {
        if (!sequenceLengthInput.value) {
            display.textContent = "Please Enter a Number!";
        } else {
            resetGame();
            resetBtn.removeAttribute('disabled')
            startBtn.setAttribute('disabled', '')
            isMidSequence = true;
            isGameOver = false;
            display.textContent = "Try to follow the pattern!";
            // Create Random Sequence
            const sequenceLength = sequenceLengthInput.value;

            for (let i = 0; i < sequenceLength; i++) {
                let temp = Math.floor(Math.random() * 4) + 1;
                sequence.push(temp);

                let answer = document.createElement("DIV");
                answer.classList.add('answer');
                answerList.append(answer);

                let answer2 = document.createElement("DIV");
                answer2.classList.add('answer');
                actualAnswerList.append(answer2);
            }
            // Show Sequence
            updateActualAnswer();
            gameStart();

        }
    } else {

    }
})

resetBtn.addEventListener('click', function() {
    resetGame();
})


for (let square of squares) {
    square.addEventListener('mousedown', function(e) {
        if (!isMidSequence && !isGameOver) {
            square.classList.add('active')
            square.classList.remove('standby')

            setTimeout(() => {
                square.classList.remove('active');
                square.classList.add('standby')
            }, 150)

            let clickedValue = parseInt(this.getAttribute('value'));
            playerSequence.push(clickedValue);
            updateAnswerList(clickedValue);
            checkAnswer();

            //test sequence
            console.log(sequence);
            console.log(playerSequence);
        }
    })
}


function checkAnswer() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (!isGameOver) {
            if (playerSequence[i] !== sequence[i]) {
                console.log("WRONG!");
                isGameOver = true;
                display.textContent = "That's not quite right..";
                endingAnimation();
                actualAnswerContainer.classList.remove('display-none');
                startBtn.removeAttribute('disabled');
                resetBtn.setAttribute('disabled', '');
            } else if (playerSequence.length === sequence.length && playerSequence[playerSequence.length - 1] === sequence[sequence.length - 1]) {
                console.log("correct!");
                isGameOver = true;
                playerWin = true;
                display.textContent = "Correct!";
                endingAnimation();
                actualAnswerContainer.classList.remove('display-none');
                startBtn.removeAttribute('disabled');
                resetBtn.setAttribute('disabled', '');
            }

        }
    }
}

function showSequence() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < sequence.length; i++) {
            let currSquare = sequence[i];

            setTimeout(() => {
                document.querySelector(`#sq${currSquare}`).classList.toggle('active');
            }, 800 * i);

            setTimeout(() => {
                document.querySelector(`#sq${currSquare}`).classList.toggle('active');

                setTimeout(() => {
                    if (i + 1 === sequence.length) {
                        resolve();
                    }
                }, 400)

            }, 800 * (i + 0.5));
        }
    })
}

function updateAnswerList(input) {
    let temp = document.querySelector(`#answer-list div:nth-child(${playerSequence.length})`)
    temp.classList.add(`sq-${input}`);
}

function updateActualAnswer() {
    for (let i = 0; i < sequence.length; i++) {
        let colorValue = sequence[i];
        let actualAnswer = document.querySelector(`#actual-answer-list div:nth-child(${i+1})`)

        actualAnswer.classList.add(`sq-${colorValue}`);
    }
}

function setStanby() {
    for (let i = 0; i < squares.length; i++) {
        squares[i].classList.add('standby');
        squares[i].classList.remove('active');
        isMidSequence = false;
    }
}

async function gameStart() {
    await showSequence();
    setStanby();
}

function redSquares(currSquare) {
    squares[currSquare].classList.remove('sq-2', 'sq-3', 'sq-4', 'standby');
    squares[currSquare].classList.add('sq-1', 'flashing');
}

function greenSquares(currSquare) {
    squares[currSquare].classList.remove('sq-1', 'sq-2', 'sq-4');
    squares[currSquare].classList.add('sq-3', 'flashing');
}

function flashSquares() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            squareContainer.classList.toggle('standby');
            resolve();
        }, 200)
    })
}

async function endingAnimation() {

    for (let i = 0; i < squares.length; i++) {
        if (!playerWin) {
            redSquares(i);
        } else {
            greenSquares(i);
        }
    }

    await flashSquares();
    await flashSquares();
    await flashSquares();
    await flashSquares();
    resetSquares();
}



function resetSquares() {
    for (let j = 0; j < squares.length; j++) {
        squares[j].classList.remove('standby', 'active', 'flashing', 'sq-1', 'sq-3');
        squares[j].classList.add(`sq-${j+1}`);
    }

}

function resetGame() {
    //reset
    sequence.splice(0, sequence.length);
    playerSequence.splice(0, playerSequence.length);
    actualAnswerContainer.classList.add('display-none');
    answerList.replaceChildren();
    actualAnswerList.replaceChildren();
    resetSquares();
    isGameOver = false;
    isMidSequence = false;
    playerWin = false;

}