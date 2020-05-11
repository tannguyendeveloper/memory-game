
import MemoryGameUI from './MemoryGameUI.js';

export default class MemoryGameBoard {
    constructor(cards) {
        this.setCards();
    }

    static shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
    }  
    
    setCards() {
        let cards = MemoryGameBoard.shuffle(MemoryGameUI.colors.concat(MemoryGameUI.colors)).map((card, index) => {
            return {index, ...card, selector: `.card[data-index="${index}"]`}
        });
        this.cards = cards;
    }
    
    selectCard(card) {
        let cardEl = document.querySelector(card.selector);
        cardEl.style.backgroundColor = card.hex;
        cardEl.classList.add('selected');
    }
    
    deselectCards(cards) {
        setTimeout(function() {
            for(let card of cards) {
                const cardEl = document.querySelector(card.selector);
                cardEl.style.backgroundColor = '#ffffff';
                cardEl.classList.remove('selected');
            }
        },500)
    }
    
    markCardsAsMatched(cards) {
        for(let card of cards) {
            const cardEl = document.querySelector(card.selector);
            cardEl.classList.add('matched');
            cardEl.classList.remove('active','selected');
        }
    }
    
    renderCards() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        let index = 0;
        for(let card of this.cards) {
            let cardEl = this.renderCard(index);
            gameBoard.append(cardEl);
            index++;
        }
    }
    
    renderCard(index) {
        let card = document.createElement('div');
        card.classList.add('card', 'card-container', 'active');
        card.dataset.index = index;
        // the inner element that will change color
        let cardColor = document.createElement('div');
        cardColor.classList.add('card-color');
        cardColor.dataset.index = index;
        card.append(cardColor);
        return card;
    }
    
    render() {
        const gameBoard = document.createElement('div');
        gameBoard.id = 'game-board';
        this.board = gameBoard;

        let index = 0;
        for(let card of this.cards) {
            let cardEl = this.renderCard(index);
            gameBoard.append(cardEl);
            index++;
        }
        return gameBoard;
    }
}
