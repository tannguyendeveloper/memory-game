export default class MemoryGameScoreBoard {
    constructor() {

    }
    updateGuesses(guess) {
        const container = document.querySelector('#score-board .guesses span');
        container.innerHTML = guess;
    }
    updateTimer(time) {
        const container = document.querySelector('#score-board .timer span');
        container.innerHTML = moment.duration(time, "seconds").format();
    }
    updateMatchesRemaining(matches) {
        const container = document.querySelector('#score-board .matches span');
        container.innerHTML = matches;
    }
    render() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
    
        const guesses = document.createElement('div');
        guesses.classList.add('guesses');
        guesses.innerHTML = 'Guesses <span></span>';
    
        const timer = document.createElement('div');
        timer.classList.add('timer');
        timer.innerHTML = 'Time: <span></span>';
    
        const matches = document.createElement('div');
        matches.classList.add('matches');
        matches.innerHTML = 'Matches Remaining <span></span>';
    
        scoreBoard.append(timer, guesses, matches);
        return scoreBoard;
    }
}
