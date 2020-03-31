window.addEventListener('load', async function () {
  const Game = new MemoryGame('game-container');
  Game.init();
})

class MemoryGame {
  constructor(id) {
    this.id = id;
    this.colors = [{
        color: 'purple',
        hex: '#68217a'
      },
      {
        color: 'magenta',
        hex: '#ec008c'
      },
      {
        color: 'red',
        hex: '#e81123'
      },
      {
        color: 'orange',
        hex: '#ff8c00'
      },
      {
        color: 'yellow',
        hex: '#fff100'
      },
      {
        color: 'lime',
        hex: '#bad80a'
      },
      {
        color: 'green',
        hex: '#009e49'
      },
      {
        color: 'teal',
        hex: '#00b294'
      },
      {
        color: 'cyan',
        hex: '#00bcf2'
      },
      {
        color: 'blue',
        hex: '#00188f'
      },
    ]

  }

  init() {
    this.generateCSS();
    this.renderStartScreen();
  }

  renderStartScreen() {
    const id = this.id;

    const gameContainer = document.getElementById(id);
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    const container = document.createElement('div');
    container.classList.add('container');

    const logo = document.createElement('h1');
    logo.id = "game-title";
    logo.innerText = 'Memory Game';

    container.append(logo);

    wrapper.append(container);
    gameContainer.append(wrapper);

    container.append();
    this.animateText(`#${logo.id}`);
    this.renderStartButton();
  }

  // generate the css classes from the colors array
  generateCSS() {
    let CSS = document.createElement('style');
    let cssString = '';
    for (let color of this.colors) {
      cssString += `.${color.color} { color: ${color.hex} } \n`;
      cssString += `.bkg-${color.color} { background-color: ${color.hex} } \n`;
    }
    CSS.append(cssString);
    document.querySelector('body').append(CSS);
    return true;
  }

  // animate the headline
  animateText(el) {
    const colors = this.colors;
    const chars = document.querySelector(el);
    const splitChars = chars.innerText.split('');
    chars.innerText = '';

    // wrap each character with span except empty spaces
    for (let char of splitChars) {
      if (char != ' ') {
        let span = document.createElement('span');
        span.innerText = char;
        chars.append(span);
      } else {
        chars.append(char);
      }
    }

    const titleChars = chars.querySelectorAll(`span`);
    let i = 0;
    let animateColor = setInterval(
      function () {
        titleChars[i].classList.toggle(colors[i].color);
        i++
        if (i === titleChars.length) {
          clearInterval(animateColor);
        }
      }, 50)
  }

  renderStartButton() {
    const game = this;
    let startButton = document.createElement('button');
    startButton.id = "start-button";
    startButton.innerText = 'Start';
    const container = document.querySelector(`div#${this.id} .container`);
    startButton.addEventListener('click', function () {
      game.startNewGame()
    });
    container.append(startButton);
  }

  removeStartButton() {
    const startButton = document.getElementById('start-button');
    if(startButton) startButton.remove();
    return;
  }

  // start new game
  async startNewGame() {

    // show the game title it may have been hidden
    document.querySelector(`#${this.id} #game-title`).style.display = 'block';

    // render the scoreboard
    this.renderScoreboard();

    // remove the start button
    this.removeStartButton();

    // reset the guesses
    this.guesses = 0;
    
    document.querySelector('.guesses span').innerText = this.guesses;

    // set the number of matches remaining to the numebr of colors
    this.remainingMatches = this.colors.length;
    document.querySelector('.matches-remaining span').innerText = this.remainingMatches;

    // the cards for this game are the set of colors repeated twice, we use the shuffle function to change the order
    this.cards = shuffle(this.colors.concat(this.colors));

    let isGameboardRendered = await this.renderGameBoard();
    if (isGameboardRendered) {
      // Bind the game board with the click event
      const gb = document.querySelector(`#${this.id} #game-board`);

      // Because we are passing a reference, we need to bind the function to the current game instance with this;
      const handleCardClick = this.handleCardClick.bind(this);
      gb.addEventListener('click', handleCardClick)
    }

    // render previous best score
    this.renderBestScore();
    
    // render retry button
    this.renderResetButton();
    
    this.startTimer();

  }

  startTimer() {
    this.time = 0;
    const game = this;
    this.timer = setInterval( function() {
      game.updateTimer(game.time++);
    },    
    1000)
  }

  updateTimer(seconds) {
    let timer = document.querySelector(`.timer span`);
    if(timer) timer.innerText = seconds;
  }

  renderScoreboard() {
    const container = document.querySelector(`#${this.id} .container`);

    const scoreBoard = document.createElement('div');
    scoreBoard.id = 'score-board';

    const guesses = document.createElement('div');
    guesses.classList.add('guesses');
    guesses.innerHTML = 'Guesses <span></span>';

    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.innerHTML = 'Time: <span></span>';

    const matches = document.createElement('div');
    matches.classList.add('matches-remaining');
    matches.innerHTML = 'Matches Remaining <span></span>';

    scoreBoard.append(timer, guesses, matches);

    container.append(scoreBoard);

  }

  renderBestScore() {
    let bestScore = JSON.parse(localStorage.getItem('bestScore'));
    if(!!bestScore) {
      const bestScoreContainer = document.createElement('div');
      bestScoreContainer.id = 'best-score';

      const bestTime = document.createElement('div');
      bestTime.classList.add('best-time');
      bestTime.innerHTML = `Best Time: <span>${parseInt(bestScore.time)}</span>`;
  
      const bestGuesses = document.createElement('div');
      bestGuesses.classList.add('best-time-guesses');
      bestGuesses.innerHTML = `Number of Guesses: <span>${parseInt(bestScore.guesses)}</span>`;

      bestScoreContainer.append(bestTime, bestGuesses);
      document.querySelector(`#${this.id} .container`).append(bestScoreContainer);
    }
    return;
  }

  renderWinnerScreen() {
    // hide the logo;
    document.querySelector(`#${this.id} #game-title`).style.display = 'none';

    const winningScore = {
      time: this.time,
      guesses: this.guesses
    }

    // get the best score from local storage
    const prevBestScore = JSON.parse(localStorage.getItem('bestScore'));

    const messageContainer = document.createElement('div');
    messageContainer.id = "winner-screen";
    if(!prevBestScore) { 
      messageContainer.innerHTML = `<h1 id="winner-headline">High Score!</h1>`;
      localStorage.setItem('bestScore', JSON.stringify(winningScore))
    } else if(this.time < parseInt(prevBestScore.time) && this.guesses < parseInt(prevBestScore.guesses)) {
      messageContainer.innerHTML = `<h1 id="winner-headline">High Score!</h1>`;
      localStorage.setItem('bestScore', JSON.stringify(winningScore))
    } else {
      messageContainer.innerHTML = `<h1 id="winner-headline">You've Won!</h1>`;
    }
    const message = document.createElement('p');
    message.id = 'winner-message';
    message.innerText = `You won with a time of ${this.time} seconds and ${this.guesses} guesses!`;
    messageContainer.append(message);
    messageContainer.append(this.retryButton());

    // append to the container
    document.querySelector(`#${this.id} .container`).append(messageContainer);
    this.animateText('#winner-headline');

    this.clearCurrentGame();
  }

  clearCurrentGame() {
    // remove the scoreboard
    document.querySelector(`#${this.id} #score-board`).remove();
    // remove the gameboard
    document.querySelector(`#${this.id} #game-board`).remove();
    // remove the best score 
    if(!!document.querySelector(`#${this.id} #best-score`)) document.querySelector(`#${this.id} #best-score`).remove();
    // remove the restart button 
    document.querySelector(`#${this.id} #reset-button`).remove();
  }

  retryButton() {
    const game = this;
    const retryButton = document.createElement('button');
    retryButton.id = 'retry-button';
    retryButton.innerText = 'Try Again';
    retryButton.addEventListener('click', function() {
      // remove the winner screen
      document.querySelector(`#${game.id} #winner-screen`).remove();
      // start a new game
      game.startNewGame();
    });
    return retryButton;
  }

  resetButton() {
    const game = this;
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.innerText = 'Reset Game';
    resetButton.addEventListener('click', function() {
      clearInterval(game.timer);
      // remove the winner screen
      game.clearCurrentGame();
      // start a new game
      game.startNewGame();
    });
    return resetButton;
  }

  renderResetButton() {
    document.querySelector(`#${this.id} .container`).append(this.resetButton());
  }

  // render the game board - this is an async function because I wanted to be fancy and add animate the cards being active
  async renderGameBoard() {
    const container = document.querySelector(`#${this.id} .container`)
    const gameBoard = document.createElement('div');
    gameBoard.id = 'game-board';
    container.append(gameBoard);
    this.renderCards();
    return await this.animateCards();
  }

  renderCards() {
    const gameBoard = document.querySelector(`#${this.id} #game-board`);
    for (let card of this.cards) {
      // the card
      let card = document.createElement('div');
      card.classList.add('card', 'card-container');

      // the inner element that will change color
      let cardColor = document.createElement('div');
      cardColor.classList.add('card-color');
      card.append(cardColor);
      gameBoard.append(card);
    }
  }

  // async function adds an a data-index attribute and active class to the cards
  async animateCards() {

    return await new Promise(resolve => {
      const renderedCards = document.querySelectorAll(`#${this.id} .card`);
      let cardIndex = 0;
      let interval = setInterval(function () {
        let card = renderedCards[cardIndex];
        card.classList.add('active');
        card.setAttribute('data-index', cardIndex);
        // add the data-index attribute to the child too because it is most likely the target of a click event
        let cardInner = card.querySelector('.card-color')
        cardInner.setAttribute('data-index', cardIndex);
        cardIndex++;

        // End the interval once we reach the number of cards
        if (cardIndex === renderedCards.length) {
          clearInterval(interval);
          resolve(true);
        }
      }, 25);
    });
  }

  handleCardClick(e) {
    const index = e.target.dataset.index;
    const card = document.querySelector(`.card[data-index='${index}']`);
    let selectedCards = document.querySelectorAll('.card.selected');
    if (selectedCards.length < 2 && !this.isCardAlreadyMatched(card)) {
      this.selectCard(card);
      let cards = document.querySelectorAll('.card.selected');
      if(this.compareCards(cards)) {
        this.markCardsAsMatched(cards);
        this.updateMatches();
      }
    } else {
      return;
    }
  }

  selectCard(card) {
    const index = card && card.dataset && card.dataset.index ? card.dataset.index : false;
    if(index) {
      card.classList.toggle('selected');
      card.setAttribute('data-hex', this.cards[index].hex);
      const className = `bkg-${this.cards[index].color}`;
      const cardColor = document.querySelector(`.card-color[data-index='${index}']`);
      cardColor.classList.add(className);
    }
  }

  deselectCard(card) {
    card.classList.remove('selected');
    card.removeAttribute('data-hex');
    card.children[0].className = 'card-color';
  }

  deselectCards(cards) {
    let game = this;
    const deselect = setInterval(function () {
      for (let card of cards) {
        game.deselectCard(card);
      }
      clearInterval(deselect);
    }, 500)
  }

  markCardsAsMatched(cards) {
    for (let card of cards) {
      card.classList.remove('active');
      card.classList.remove('selected');
      card.classList.add('matched');
    }
  }

  compareCards(cards) {
    if (cards.length == 2) {
      const hex1 = cards[0].dataset.hex;
      const hex2 = cards[1].dataset.hex;
      // compare to see if they match using the class names
      this.incrementGuesses();
      if (hex1 === hex2) {
        return true;
      } else {
        this.deselectCards(cards);
      }
    } else {
      return false;
    }
  }

  isCardAlreadyMatched(card) {
    return card && card.classList.contains('matched') ? true : false;
  }

  incrementGuesses() {
    const guesses = document.querySelector('.guesses span');
    this.guesses++;
    guesses.innerText = this.guesses;
  }

  updateMatches() {
    const matches = document.querySelector('.matches-remaining span');
    this.remainingMatches--;
    matches.innerText = this.remainingMatches;
    if(this.remainingMatches === 0) {
      let game = this;
      clearInterval(this.timer);
      let delayWinnerScreen = setInterval(
      function() {
        game.renderWinnerScreen();
        clearInterval(delayWinnerScreen);
      }, 750)
    }
  }

}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
