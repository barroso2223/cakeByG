

let deckId = ''
let playerNameInput = document.querySelector("#name")

let playerScore = 0;
let computerScore = 0;
let playerDeck = [];
let computerDeck = [];

window.addEventListener('DOMContentLoaded', (event) => {
    const savedGame = JSON.parse(localStorage.getItem('gameState'));

    if (savedGame) {
        savedGame.deckId || "";
        playerNameInput.value = savedGame.playerName || "";
        document.querySelector('#player1').src = savedGame.player1CardImage || "";
        document.querySelector('#player2').src = savedGame.player2CardImage || "";
        document.querySelector('h3').innerText = savedGame.result || "";
        playerScore = savedGame.playerScore || 0;
        computerScore = savedGame.computerScore || 0;
        updateScore();

    }else {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                deckId = data.deck_id
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }
})

document.querySelector('button').addEventListener('click', drawTwo);
document.querySelector('#resetGame').addEventListener('click', resetGame);

function drawTwo(){

    let playerName = playerNameInput.value || 'User';

    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

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
                computerDeck.push(...data.cards);
                computerScore += 2;

            }else if (player1Val < player2Val) {
                document.querySelector('h3').innerText = `${playerName} Wins!`;
                playerDeck.push(...data.cards);
                playerScore += 2;
            }else {
                document.querySelector('h3').innerText = "Let's go to War!";
                declareWare();
            }

            updateScore();
            savedGameState();

        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function declareWare() {
    const warUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`;

    fetch (warUrl)
        .then(res => res.json())
        .then(data => {
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
                declareWare()
            }

            updateScore();
            savegameState();
        })
        .catch(err => {
            console.log (`error ${err}`);
        })
}

function convertToNum(val) {
    if(val === 'ACE') {
        return 14
    }else if (val === 'KING') {
        return 13
    }else if (val === 'QUEEN') {
        return 12
    }else if (val === 'JACK') {
        return 11
    }else{
        return Number(val)
    }
}
 
function updateScore() {
    document.querySelector(#playerScore).innerText = `User: ${playerScore}`;
    document.querySelector(#computerScore).innerText = `Computer: ${computerScore}`;

    if (playerScore >= 52) {
        document.querySelector('h3').innerText = `${playerName} Wins the game!, you have all the cards!`;
    }else if (computerScore >= 52) {
        document.querySelector('h3').innerText = "Computer Wins the game! It has all the cards!";
    }
}

function savedGameState() {
    const gameState = {
        deckId: deckId,
        playerName: playerNameInput.value,
        player1CardImage: document.querySelector('#player1').src,
        player2CardImage: document.querySelector('#player2'),src,
        result: document.querySelector('h3').innerText,
        playerScore: playerScore,
        computerScore: computerScore
    };

    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function resetGame() {
    localStorage.removeItem('gameState');

    playerScore = 0;
    computerScore = 0;
    playerDeck = [];
    computerDeck - [];

    document.querySelector('#player1').src = '';
    document.querySelector('#player2').src = '';
    document.querySelector('h3').innerText = 'Results';
    document.querySelector('#playerScore').innerText = 'User: 0';
    document.querySelector('#computerScore').innerText = 'Computer: 0';

    fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id;
        })
        .catch(err => {
           console.log (`error ${err}`);
        });
}
