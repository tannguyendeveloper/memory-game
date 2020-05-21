export default class MemoryGameHighScoreBoard {
    static getPreviousBestScore() {
        return JSON.parse(localStorage.getItem('bestScore')) ? JSON.parse(localStorage.getItem('bestScore')) : false
    }
    setBestScore(score) {
        localStorage.setItem('bestScore', JSON.stringify(score))
        this.updateGuesses(score.guesses);
        this.updateBestTime(score.time);
    }
    updateGuesses(guesses) {
        const bestGuessesContainer = document.querySelector('.best-guesses span');
        bestGuessesContainer.innerHTML = guesses;
    }
    updateBestTime(time) {
        const bestTimeContainer = document.querySelector('.best-time span');
        bestTimeContainer.innerHTML = time;
    }
    render() {
        const highScoreContainer = document.createElement('div');
        highScoreContainer.id = 'high-score-board';

        const prevScore = MemoryGameHighScoreBoard.getPreviousBestScore();

        const bestTime = document.createElement('div');
        bestTime.classList.add('best-time');
        bestTime.innerHTML = `Best Time: <span>${prevScore ? moment.duration(prevScore.time, "seconds").format() : '---'}</span>`;
    
        const bestGuesses = document.createElement('div');
        bestGuesses.classList.add('best-guesses');
        bestGuesses.innerHTML = `Number of Guesses: <span>${prevScore ? prevScore.guesses : '---'}</span>`;
  
        highScoreContainer.append(bestTime, bestGuesses);
        return highScoreContainer;
      }
}
