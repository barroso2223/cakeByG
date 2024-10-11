

let deckId = '';
let playerNameInput = document.querySelector('#playerName');

let playerScore = 0;
let computerScore = 0;
let playerDeck = [];
let computerDeck = [];
let cardsDealt = 0;
const totalCards = 52;

window.addEventListener('DOMContentLoaded', (event) => {
    const saveGame = JSON.parse(localStorage.getItem('gameState'));

    if (saveGame) {
        deckId = saveGame.deckId || '';
        playerNameInput.value = saveGame.playerName || '';
        document.querySelector('#player1').src = saveGame.player1CardImage || '';
        document.querySelector('#player2').src = saveGame.player2CardImage || '';
        document.querySelector('h3').innerText = saveGame.result || 'Results';
        playerScore = saveGame.playerScore || 0;
        computerScore = saveGame.computerScore || 0;
        playerDeck = saveGame.playerDeck || [];
        computerDeck = saveGame.computerDeck || [];
        cardsDealt = saveGame.cardsDealt || 0;
        updateScore();

    }else {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(res => res.json())
            .then(data => {
                deckId = data.deck_id
            })
            .catch(err => {
                console.log(`error ${err}`);
            });
    }
});

document.querySelector('button').addEventListener('click', drawTwo);

document.querySelector('#resetBtn').addEventListener('click', resetGame);

function drawTwo() {

    let playerName = playerNameInput.value || 'User';

    const url = (`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const player1CardImage = data.cards[0].image;
            const player2CardImage = data.cards[1].image;

            document.querySelector('#player1').src = player1CardImage;
            document.querySelector('#player2').src = player2CardImage;

            let player1Val = convertToNum(data.cards[0].value);
            let player2Val = convertToNum(data.cards[1].value);

            if(player1Val > player2Val) {
                document.querySelector('h3').innerText = 'Computer Wins!';
                computerDeck.push(data.cards[0], data.cards[1]);
                computerScore += 2;

            }else if (player1Val < player2Val) {
                document.querySelector('h3').innerText = `${playerName} Wins!`;
                playerDeck.push(data.cards[0], data.cards[1]);
                playerScore += 2;
            }else {
                document.querySelector('h3').innerText = "Let's go to War!";
                declareWar();
            }

            if (cardsDealt >= totalCards) {
                endGame();
            }

            cardsDealt += 2;
            updateScore();
            saveGameState();

        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function declareWar() {
    const warUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`;

    fetch (warUrl)
        .then(res => res.json())
        .then(data => {

            if (data.cards.length < 8) {
                document.querySelector('h3').innerText = "Not enough cards left for War!";
                return endGame();
            }

            document.querySelector('#player1').src = data.cards[6].image;
            document.querySelector('#player2').src = data.cards[7].image;

            let playerWarVal = convertToNum(data.cards[6].value);
            let computerWarVal = convertToNum(data.cards[7].value);

            if (playerWarVal > computerWarVal) {
                document.querySelector('h3').innerText = `${playerName} Wins War!!!`;
                playerDeck.push(...data.cards);
                playerScore += 8;
            }else if (computerWarVal > playerWarVal) {
                document.querySelector('h3').innerText = 'Computer Wins War!';
                computerDeck.push(...data.cards);
                computerScore += 8;
            }else {
                document.querySelector('h3').innerText = "War Again!";
                declareWar();
            }

            if (cardsDealt >= totalCards) {
                endGame();
            }

            cardsDealt += 8;
            updateScore();
            saveGameState();
        })
        .catch(err => {
            console.log (`error ${err}`);
        });
}

function convertToNum(val) {
    if(val === 'ACE') {
        return 14;
    }else if (val === 'KING') {
        return 13;
    }else if (val === 'QUEEN') {
        return 12;
    }else if (val === 'JACK') {
        return 11;
    }else{
        return Number(val);
    }
}
 
function updateScore() {
    document.querySelector('#playerScore').innerText = `User: ${playerScore}`;
    document.querySelector('#computerScore').innerText = `Computer: ${computerScore}`;
}

function endGame() {
    if (playerDeck.length > computerDeck.length) {
        alert(`${playerName} Wins the Game!`);
    }else if (computerDeck.length > playerDeck.length) {
        alert(Computer Wins the Game!);
    }else {
        alert("It's a Tie! Start over!");
    }
    resetGame();
}

function saveGameState() {
    const gameState = {
        deckId: deckId,
        playerName: playerNameInput.value,
        player1CardImage: document.querySelector('#player1').src,
        player2CardImage: document.querySelector('#player2').src,
        result: document.querySelector('h3').innerText,
        playerScore: playerScore,
        computerScore: computerScore
    };

    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function resetGame() {

    deckId = '';
    playerDeck = [];
    computerDeck = [];
    cardsDealt = 0;
    playerScore = 0;
    computerScore = 0;

    document.querySelector('#player1').src = '';
    document.querySelector('#player2').src = '';
    document.querySelector('h3').innerText = 'Results';
    document.querySelector('#playerScore').innerText = 'User: 0';
    document.querySelector('#computerScore').innerText = 'Computer: 0';
    updateScore();

    fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id;
        })
        .catch(err => {
           console.log (`error ${err}`);
        });
}
