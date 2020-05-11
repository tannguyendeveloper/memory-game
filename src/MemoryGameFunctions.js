export default class MemoryGameFunctions {
    static handleCardClick(e) {
        const currentGame = this;
        const cardEl = e.target.closest(".card-container");

        if (!MemoryGameFunctions.hasIndex(cardEl) ||
            !class MemoryGameFunctions {
                static handleCardClick(e) {
                    const currentGame = this;
                    const cardEl = e.target.closest(".card-container");

                    if (!MemoryGameFunctions.hasIndex(cardEl) ||
                        !MemoryGameFunctions.isCardActive(cardEl) ||
                        MemoryGameFunctions.isCardSelected(cardEl) ||
                        this.selectedCards.length >= 2
                    ) return false;

                    const index = cardEl.dataset.index;
                    const clickedCard = this.gameBoard.cards[index];

                    this.selectedCards.push(clickedCard);
                    this.gameBoard.selectCard(clickedCard);

                    if (this.selectedCards.length == 2) {
                        if (MemoryGameFunctions.compareSelectedCards(this.selectedCards)) {
                            this.gameBoard.markCardsAsMatched(this.selectedCards);
                            this.selectedCards = [];
                            this.matchesRemaining--;
                            this.scoreBoard.updateMatchesRemaining(this.matchesRemaining);
                            if (this.matchesRemaining === 0) {
                                this.handleWinner();
                            }
                        } else {
                            this.gameBoard.deselectCards(this.selectedCards);
                            this.selectedCards = [];
                        }
                        this.guesses++
                        this.scoreBoard.updateGuesses(this.guesses);
                    }
                }
                static compareSelectedCards(selectedCards) {
                    return selectedCards[0].hex === selectedCards[1].hex;
                }
                static isCardActive(cardEl) {
                    return !!cardEl.classList.contains('active');
                }
                static isCardSelected(cardEl) {
                    return Boolean(cardEl.classList.contains('selected'));
                }
                static hasIndex(cardEl) {
                    return !!cardEl.dataset.index;
                }
            }
            .isCardActive(cardEl) ||
            MemoryGameFunctions.isCardSelected(cardEl) ||
            this.selectedCards.length >= 2
        ) return false;

        const index = cardEl.dataset.index;
        const clickedCard = this.gameBoard.cards[index];

        this.selectedCards.push(clickedCard);
        this.gameBoard.selectCard(clickedCard);

        if (this.selectedCards.length == 2) {
            if (MemoryGameFunctions.compareSelectedCards(this.selectedCards)) {
                this.gameBoard.markCardsAsMatched(this.selectedCards);
                this.selectedCards = [];
                this.matchesRemaining--;
                this.scoreBoard.updateMatchesRemaining(this.matchesRemaining);
                if (this.matchesRemaining === 0) {
                    this.handleWinner();
                }
            } else {
                this.gameBoard.deselectCards(this.selectedCards);
                this.selectedCards = [];
            }
            this.guesses++
            this.scoreBoard.updateGuesses(this.guesses);
        }
    }
    static compareSelectedCards(selectedCards) {
        return selectedCards[0].hex === selectedCards[1].hex;
    }
    static isCardActive(cardEl) {
        return !!cardEl.classList.contains('active');
    }
    static isCardSelected(cardEl) {
        return Boolean(cardEl.classList.contains('selected'));
    }
    static hasIndex(cardEl) {
        return !!cardEl && !!cardEl.dataset && !!cardEl.dataset.index;
    }
}
