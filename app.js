// What elements do i need?
//  correct button labeling depending on game state
//  Player cannot press until the sequence stops playing

const sequence = [];
const playerSequence = [];
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const squares = document.querySelectorAll('.square');
const sequenceLengthInput = document.querySelector('#sequenceLength');

let display = document.getElementById('display');
let buttonText = document.getElementById('startBtn');

var isGameOver = false;

startBtn.addEventListener('click', function(e) {
    e.preventDefault();
    reset();
    if (!isGameOver) {
        if (sequenceLengthInput.value !== "") {
            display.textContent = "Try to follow the pattern!";
            // Create Random Sequence
            const sequenceLength = sequenceLengthInput.value;

            for (let i = 0; i < sequenceLength; i++) {
                let temp = Math.floor(Math.random() * 4) + 1;
                sequence.push(temp);
            }
            // Show Sequence
            showSequence();
        } else { display.textContent = "Please Enter a Number!"; }
    }
})

resetBtn.addEventListener('click', function() {
    reset();
})

for (let square of squares) {
    square.addEventListener('click', function(e) {
        playerSequence.push(parseInt(this.getAttribute('value')))
        checkAnswer();

        //test sequence
        console.log(sequence);
        console.log(playerSequence);

    })
}

function checkAnswer() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (!isGameOver) {
            if (playerSequence[i] !== sequence[i]) {
                console.log("WRONG!");
                isGameOver = true;
                display.textContent = "That's not quite right..";

            } else if (playerSequence.length === sequence.length && playerSequence[playerSequence.length - 1] === sequence[sequence.length - 1]) {
                console.log("correct!");
                isGameOver = true;
                display.textContent = "Correct!";
            }
        }
    }

}


function showSequence() {
    for (let i = 0; i < sequence.length; i++) {
        setInterval(showSquare(i), 100);
    }
}

function showSquare(i) {
    var currSquare = sequence[i];

    setTimeout(() => {
        document.querySelector(`#sq${currSquare}`).classList.toggle('active');
    }, 1000 * i);

    setTimeout(() => {
        document.querySelector(`#sq${currSquare}`).classList.toggle('active');
    }, 1000 * (i + 0.5));

    setTimeout(() => {
        for (let j = 0; j < squares.length; j++) {
            squares[j].classList.add('standby');
        }
    }, 1000 * sequence.length + 1);
}

function reset() {
    //reset
    sequence.splice(0, sequence.length);
    playerSequence.splice(0, playerSequence.length);
    isGameOver = false;

    for (let j = 0; j < squares.length; j++) {
        squares[j].classList.remove('standby', 'active');
    }
}