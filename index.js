const express = require("express");
const app = express();
const cors = require("cors");

app.set('views', './views');
app.set('view engine', 'pug');
app.use(cors());


//this represents the dynamic content that is used in index.pug
var dynamicContent = {
    matchCompleted: false,
    player1Score: 0,
    player2Score: 0,
    player1MatchScore: 0,
    player2MatchScore: 0,
    player1SetScore: 0,
    player2SetScore: 0,
    winner: 'None',
    completedMsg: ''
}


//this is used to increase the number of matches won by each player 
//and check if complete game is won by any player
const matchWin = (playerNum) => {
    if (playerNum===1) {
        dynamicContent.player1MatchScore += 1;
        if (dynamicContent.player1MatchScore === 2) {
            dynamicContent.winner = 'Player 1';
            dynamicContent.matchCompleted = true;
            dynamicContent.completedMsg = 'Please press reset button to reset the game';
        }
    } else {
        dynamicContent.player2MatchScore += 1;
        if (dynamicContent.player2MatchScore === 2) {
            dynamicContent.winner = 'Player 2';
            dynamicContent.matchCompleted = true;
            dynamicContent.completedMsg = 'Please press reset button to reset the game';
        }
    }
    dynamicContent.player1SetScore = 0;
    dynamicContent.player2SetScore = 0;
}


//this is used to increase the number of sets won by each player
//and check if any player has enough sets to win a match
const gameWin = (playerNum) => {
    if (playerNum===1) {
        dynamicContent.player1SetScore += 1;
        if (dynamicContent.player1SetScore >= 6 && (dynamicContent.player1SetScore-dynamicContent.player2SetScore)>=2) {
            matchWin(1);
        }
    } else {
        dynamicContent.player2SetScore += 1;
        if (dynamicContent.player2SetScore >= 6 && (dynamicContent.player2SetScore-dynamicContent.player1SetScore)>=2) {
            matchWin(2);
        }
    }
    dynamicContent.player1Score = 0;
    dynamicContent.player2Score = 0;
}

const checkDeuce = () => {
    if (dynamicContent.player1Score===40 && dynamicContent.player2Score===40) {
        dynamicContent.player1Score = 'deuce';
        dynamicContent.player2Score = 'deuce';
    }
}

app.get('/', (req, res) => {
    res.status(200).render('index', dynamicContent);
})

app.post('/reset', (req, res) => {
    dynamicContent = {
        matchCompleted: false,
        player1Score: 0,
        player2Score: 0,
        player1MatchScore: 0,
        player2MatchScore: 0,
        player1SetScore: 0,
        player2SetScore: 0,
        winner: 'None', 
        completedMsg: ''
    }
    res.status(200).render('index', dynamicContent);
})

app.post('/increaseScore/player1', (req, res) => {
    if (dynamicContent.matchCompleted===false) {
        if (dynamicContent.player1Score<30) {
            dynamicContent.player1Score += 15;
        } else {
            if (dynamicContent.player1Score==='deuce') {
                dynamicContent.player1Score = 'advantage';
                dynamicContent.player2Score = '-';
            }
            else if (dynamicContent.player1Score==='-') {
                dynamicContent.player1Score = 'deuce';
                dynamicContent.player2Score = 'deuce';
            }
            else if (dynamicContent.player1Score==='advantage' || (dynamicContent.player1Score === 40 && dynamicContent.player2Score <= 30)) {
                gameWin(1);
            } 
            else {
                dynamicContent.player1Score += 10;
            }
        } 
        if (dynamicContent.player1Score===40) {
            checkDeuce();
        }
    }
    res.status(200).render('index', dynamicContent);
})

app.post('/increaseScore/player2', (req, res) => {
    if (dynamicContent.matchCompleted===false) {
        if (dynamicContent.player2Score<30) {
            dynamicContent.player2Score += 15;
        } else {
            if (dynamicContent.player2Score==='deuce') {
                dynamicContent.player2Score = 'advantage';
                dynamicContent.player1Score = '-';
            }
            else if (dynamicContent.player2Score==='-') {
                dynamicContent.player1Score = 'deuce';
                dynamicContent.player2Score = 'deuce';
            }
            else if (dynamicContent.player2Score==='advantage' || (dynamicContent.player2Score === 40 && dynamicContent.player1Score <= 30)) {
                gameWin(2);
            } 
            else {
                dynamicContent.player2Score += 10;
            }
        }
        if (dynamicContent.player2Score===40) {
            checkDeuce();
        }
    }
    res.status(200).render('index', dynamicContent);
})

var port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})