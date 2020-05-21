import MemoryGameFunctions from './MemoryGameFunctions.js';
import MemoryGameBoard from './MemoryGameBoard.js';
import MemoryGameScoreBoard from './MemoryGameScoreBoard.js';
import MemoryGameHighScoreBoard from './MemoryGameHighScoreBoard.js';
import MemoryGameUI from './MemoryGameUI.js';

class MemoryGame {
    constructor(id) {
        this.id = id;
        this.appContainer = document.getElementById(this.id);
    }

    init() {
        this.initUiElements();
        this.setElements();
        this.renderStartScreen();
    }

    initUiElements() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('game-wrapper');
    
        const container = document.createElement('div');
        container.id = 'game-container';
        container.classList.add('game-container');

        const gitHubLink = MemoryGameUI.renderGitHubLink();

        wrapper.append(container, gitHubLink);
        this.appContainer.append(wrapper);
    }

    setElements() {
        this.gameContainer = document.getElementById('game-container');
    }

    renderStartScreen() {
        const logo = MemoryGameUI.renderLogo();
        this.startGameBtn = MemoryGameUI.renderButton('Start!', this.startGame.bind(this));
        this.startGameBtn.id = 'start-game-button';
        this.gameContainer.append(logo, this.startGameBtn);
        MemoryGameUI.animateTextColor(logo)
    }
    
    renderGameUI() {
        this.scoreBoard = new MemoryGameScoreBoard();
        this.gameBoard = new MemoryGameBoard();
        this.highScoreBoard = new MemoryGameHighScoreBoard();
        this.resetGameBtn =  MemoryGameUI.renderButton('Reset', this.resetGame.bind(this));
        
        this.resetGameBtn.id = 'reset-game-btn';

        this.gameContainer.append(
            this.scoreBoard.render(),
            this.gameBoard.render(),
            this.highScoreBoard.render(),
            this.resetGameBtn
        );
    }

    setNewGameDefaults() {
        this.time = 0;
        
        this.scoreBoard.updateTimer(moment.duration(this.time, "seconds").format());
        this.startTimer();
    
        this.matchesRemaining = MemoryGameUI.colors.length;
        this.scoreBoard.updateMatchesRemaining(this.matchesRemaining);

        this.guesses = 0;
        this.scoreBoard.updateGuesses(this.guesses);

        this.selectedCards = [];
    }

    startGame(e) {
        e.target.style.display = 'none';

        this.renderGameUI();
        this.setNewGameDefaults();
        this.initGameFunctions();
    }

    resetGame(e) {
        clearInterval(this.timer);
        this.setNewGameDefaults();
        this.gameBoard.setCards();
        this.gameBoard.renderCards();
    }

    setCards(colors) {
        this.cards = shuffle(colors.concat(colors));
    }

    startTimer() {
        this.timer = setInterval(
            () => {
                this.scoreBoard.updateTimer(moment.duration(this.time, "seconds").format());
                this.time++;
            }
        , 1000)
    }

    initGameFunctions() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.addEventListener('click', MemoryGameFunctions.handleCardClick.bind(this))
    }

    handleCloseWinnerScreen() {
        const modal = document.querySelector('.modal');
        modal.remove();
        this.resetGame();
    }

    handleWinner() {
        clearInterval(this.timer);
        const prevBestScore = MemoryGameHighScoreBoard.getPreviousBestScore();

        const score = {
            time: this.time,
            guesses: this.guesses
        }

        const winnerTitle = document.createElement('h1');
        winnerTitle.innerText = "New High Score!"
        
        const winnerText = document.createElement('p');
        winnerText.innerText = `You won with a time of ${moment.duration(this.time, "seconds").format()} and ${this.guesses} guesses!`;

        if(!prevBestScore) {
            this.highScoreBoard.setBestScore(score);
        } else if(this.time < parseInt(prevBestScore.time) && this.guesses < parseInt(prevBestScore.guesses)) {
            this.highScoreBoard.setBestScore(score);
        } else {
            winnerTitle.innerHTML = "You've won!";
        }

        const retryBtn = MemoryGameUI.renderButton('Try Again', this.handleCloseWinnerScreen.bind(this));
        retryBtn.id = 'retry-game-button'

        const winnerScreen = MemoryGameUI.renderModal(winnerTitle, winnerText, retryBtn);
        MemoryGameUI.animateTextColor(winnerTitle);

        const body = document.querySelector('body');
        body.append(winnerScreen);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const Game = new MemoryGame('app-container');
    Game.init();
});