import delay from './delay';
import cloneDeep from 'loadsh/cloneDeep';

class MockAPI {

    constructor() {

        // Constants and option related
        this.startingCardsNum = 6;
        this.numOfPlayers = 4;
        this.attackingCardsLimit = 6;

        // Game end variables
        this.gameOver = false;
        this.isDraw = false;
        this.losingPlayerNum = null;

        // Cards
        this.cardsOnTable = [];
        this.deck = this.shuffleDeck();
        this.playerCards = {
                1: this.dealStartingCards(),
                2: this.dealStartingCards(),
                3: this.dealStartingCards(),
                4: this.dealStartingCards()
            };
        this.kozerCard = this.getKozerCardFromDeck();
        this.numOfCardsLeftInDeck = this.deck.length;

        // First turn
        this.playerStarting = this.getPlayerStarting();
        this.playerDefending = this.getNextPlayer(this.playerStarting);
    }


    // Calls to server

    startGame() {
        return new Promise ((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    playerCards: cloneDeep(this.playerCards),
                    kozerCard: this.kozerCard,
                    numOfCardsLeftInDeck: this.numOfCardsLeftInDeck,
                    playerStarting: this.playerStarting,
                    playerDefending: this.playerDefending});
            })
        })
    }

    attack(attackObject) {
        attackObject = Object.assign({}, attackObject);  // Avoid manipulating object
        const attackingPlayerNum = attackObject.attackingPlayerNum;
        const attackingCardCode = attackObject.attackingCardCode;

        return new Promise((resolve, reject) => {
            setTimeout(() => {

                // Validations

                if (!this.canPlayerAttack(attackingPlayerNum)) {
                    reject("You can not attack now");
                    return;
                }

                if (!this.doesPlayerHaveCard(attackingPlayerNum, attackingCardCode)) {
                    reject("You do not have this card");
                    return;
                }

                if (this.isAttackingCardLimitReached()) {
                    reject("Maximum cards on the table");
                    return;
                }

                if (!this.canThisCardBeAdded(attackingCardCode)) {
                    reject("You can not attack with this card now");
                    return;
                }

                this.cardsOnTable.push([attackingCardCode, null]);
                this.removeCardFromPlayer(attackingPlayerNum, attackingCardCode);

                resolve({
                    playerCards: cloneDeep(this.playerCards),
                    cardsOnTable: Object.assign([], this.cardsOnTable)
                });
            }, delay);
        });
    }

    defend(defendObject) {
        defendObject = Object.assign({}, defendObject); // Avoid manipulating object
        const defendingPlayerNum = defendObject.defendingPlayerNum;
        const defendingCardCode = defendObject.defendingCardCode;
        const attackingCardCode = defendObject.attackingCardCode;

        return new Promise((resolve, reject) => {
            setTimeout(() => {

                // Validations

                if (!this.canPlayerDefend(defendingPlayerNum)) {
                    reject("You can not defend now");
                    return;
                }

                if (!this.doesPlayerHaveCard(defendingPlayerNum, defendingCardCode)) {
                    reject("You do not have this card");
                    return;
                }

                if (!this.canDefendWithCard(defendingCardCode, attackingCardCode)) {
                    reject("This cant defend that");
                    return;
                }

                // Perform Changes

                this.removeCardFromPlayer(defendingPlayerNum, defendingCardCode);
                this.defendCard(attackingCardCode, defendingCardCode);

                resolve({
                    playerCards: cloneDeep(this.playerCards),
                    cardsOnTable: Object.assign([], this.cardsOnTable)
                });

            }, delay);
        });
    }

    takeAllCards(playerNum) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validations

                if (this.playerDefending !== parseInt(playerNum)) {
                    reject("This is not your turn");
                    return;
                }

                if (this.cardsOnTable.length === 0) {
                    reject("No cards on table");
                    return;
                }

                // Perform Changes

                let cardsToTake = [];
                for (let cardArr of this.cardsOnTable) {
                    for (let cardOnTable of cardArr) {
                        if (cardOnTable)
                            cardsToTake.push(cardOnTable);
                    }
                }

                this.cardsOnTable = [];
                this.playerCards[playerNum] = this.playerCards[playerNum].concat(cardsToTake);
                this.fillUpCards();
                this.updateCardsLeftInDeck();
                if (this.isGameOver()) {
                    this.handleGameOver();
                }
                else
                    this.setUpNextTurn(false);


                resolve({
                    playerCards: cloneDeep(this.playerCards),
                    cardsOnTable: [],
                    numOfCardsLeftInDeck: this.numOfCardsLeftInDeck,
                    playerStarting: this.playerStarting,
                    playerDefending: this.playerDefending,
                    gameOver: this.gameOver,
                    isDraw: this.isDraw,
                    losingPlayerNum: this.losingPlayerNum
                });
            }, delay);
        });
    }

    finalizeTurn() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validations

                // Table is not empty!

                if (this.isTableEmpty()) {
                    reject("Table is empty!");
                    return;
                }

                if (!this.areAllTableCardsDefended()) {
                    reject("Not all cards are defended");
                    return;
                }

                // Perform Changes

                this.cardsOnTable = [];
                this.fillUpCards();
                this.updateCardsLeftInDeck();
                if (this.isGameOver()) {
                    this.handleGameOver();
                }
                else
                    this.setUpNextTurn(true);

                resolve({
                    playerCards: cloneDeep(this.playerCards),
                    cardsOnTable: [],
                    numOfCardsLeftInDeck: this.numOfCardsLeftInDeck,
                    playerStarting: this.playerStarting,
                    playerDefending: this.playerDefending,
                    gameOver: this.gameOver,
                    isDraw: this.isDraw,
                    losingPlayerNum: this.losingPlayerNum})
            }, delay);
        })
    }

    // Imitates server helper methods

    shuffleDeck() {
        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        const codes = ['6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'];
        return shuffle(codes);

    }

    getCardFromDeck() {
        return this.deck.pop();
    }

    dealStartingCards() {
        let cardArray = [];
        for (let i = 0; i < this.startingCardsNum; i++) {
            cardArray.push(this.getCardFromDeck());
        }
        return cardArray;
    }

    canPlayerAttack(attackingPlayerNum) {
        return (
            (this.cardsOnTable.length === 0 && parseInt(attackingPlayerNum) === this.playerStarting) ||
            (this.cardsOnTable.length !== 0 && parseInt(attackingPlayerNum) !== this.playerDefending) );
    }

    doesPlayerHaveCard(attackingPlayerNum, attackingCardCode) {
        return this.playerCards[attackingPlayerNum].indexOf(attackingCardCode) !== -1;
    }

    canThisCardBeAdded(attackingCardCode) {
        if (this.cardsOnTable.length === 0)
            return true;

        else {
            for (const cardArr of this.cardsOnTable) {
                for (const cardOnTableCode of cardArr) {
                    if (cardOnTableCode) {
                        const cardOnTableNum = this.getCardNumberFromCode(cardOnTableCode);
                        const attackingCardNum = this.getCardNumberFromCode(attackingCardCode);
                        if (cardOnTableNum === attackingCardNum)
                            return true;
                    }
                }
            }
        }
        return false;
    }

    canPlayerDefend(defendingPlayerNum) {
        return (this.playerDefending === parseInt(defendingPlayerNum));
    }

    canDefendWithCard(defendingCardCode, attackingCardCode) {
        if (this.areCardsSameSuit(defendingCardCode, attackingCardCode)) {
            const defendingCardNumber = this.getCardNumberFromCode(defendingCardCode);
            const attackingCardNumber = this.getCardNumberFromCode(attackingCardCode);
            return (this.compareCardNumbers(defendingCardNumber, attackingCardNumber) > 0)
        }
        else if (this.isCardKozer(defendingCardCode))
            return true;
        return false;
    }

    areCardsSameSuit(cardCodeA, cardCodeB) {
        return cardCodeA.slice(-1) === cardCodeB.slice(-1);
    }

    getCardNumberFromCode(cardCode) {
        if (cardCode.length > 2)
            return "10";
        else
            return cardCode[0];
    }

    compareCards(aCardCode, bCardCode) {
        const aCardNumber = this.getCardNumberFromCode(aCardCode);
        const bCardNumber = this.getCardNumberFromCode(bCardCode);
        return this.compareCardNumbers(aCardNumber, bCardNumber);
    }

    compareCardNumbers(aCardNum, bCardNum) {
        // Returns 0 if equal
        // Returns 1 if a is stronger
        // Returns -1 if b is stronger

        const numberArray = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        return (numberArray.indexOf(aCardNum) - numberArray.indexOf(bCardNum));


    }

    removeCardFromPlayer(playerNum, cardCode) {
        const cardIndex = this.playerCards[playerNum].indexOf(cardCode);
        this.playerCards[playerNum].splice(cardIndex, 1);
    }

    defendCard(attackingCardCode, defendingCardCode) {
        const newCardObject = JSON.stringify([attackingCardCode, null]);
        const tableCardIndex = this.cardsOnTable.findIndex((element) => {
            return (JSON.stringify(element) === newCardObject)
        });
        this.cardsOnTable[tableCardIndex] = [attackingCardCode, defendingCardCode];

    }

    isCardKozer(defendingCardCode) {
        const defendingCardSuit = defendingCardCode.slice(-1);
        const kozerSuit = this.kozerCard.slice(-1);
        return (defendingCardSuit === kozerSuit);
    }

    isAttackingCardLimitReached() {
        if (this.cardsOnTable.length >= this.attackingCardsLimit)
            return true;
        const numOfUndefendedCards = this.getNumOfUndefendedCards() + 1;
        if (this.playerCards[this.playerDefending].length < numOfUndefendedCards)
            return true;
    }

    fillUpCards() {
        if (this.deck.length === 0)
            return;
        const playerNumFillingUpLast = this.getPlayerNumFillingUpLast();
        let playerNumFillingUp = this.getPlayerNumFillingUpFirst();
        let playerFilledUpCounter = 0;

        while (playerFilledUpCounter < this.numOfPlayers) {
            if (playerFilledUpCounter !== this.numOfPlayers - 1) {
                if (playerNumFillingUp === playerNumFillingUpLast)
                    playerNumFillingUp = this.getNextPlayer(playerNumFillingUp);
                else {
                    this.fillUpCardsForPlayer(playerNumFillingUp);
                    playerNumFillingUp = this.getNextPlayer(playerNumFillingUp);
                    playerFilledUpCounter = playerFilledUpCounter + 1;
                }
            }

            else {
                this.fillUpCardsForPlayer(playerNumFillingUpLast);
                break;
            }
        }
    }

    getPlayerNumFillingUpFirst() {
        return this.playerStarting;
    }

    getPlayerNumFillingUpLast() {
        return this.playerDefending;
    }

    fillUpCardsForPlayer(playerNum) {
        while (this.playerCards[playerNum].length < this.startingCardsNum) {
            if (this.deck.length === 0)
                return;
            const newCard = this.getCardFromDeck();
            this.playerCards[playerNum].push(newCard);
        }
    }

    getNextPlayer(currentPlayerNum) {
        let nextPlayerNum = (currentPlayerNum + 1) % this.numOfPlayers;
        if (nextPlayerNum === 0)
            nextPlayerNum = this.numOfPlayers;
        if (this.playerCards[nextPlayerNum].length === 0)
            return this.getNextPlayer(nextPlayerNum);
        return nextPlayerNum;
    }

    updateCardsLeftInDeck() {
        this.numOfCardsLeftInDeck = this.deck.length;
    }

    doesPlayerHaveCards(playerNum) {
        return (this.playerCards[playerNum].length > 0);
    }

    setUpNextTurn(lastTurnDefended=true) {
        if (lastTurnDefended) {
            if (this.doesPlayerHaveCards(this.playerDefending))
                this.playerStarting = this.playerDefending;
            else
                this.playerStarting = this.getNextPlayer(this.playerDefending);
        }
        else
            this.playerStarting = this.getNextPlayer(this.playerDefending);
        this.playerDefending = this.getNextPlayer(this.playerStarting);
    }

    areAllTableCardsDefended() {
        for (let cardArr of this.cardsOnTable) {
            if (!cardArr[1])
                return false;
        }
        return true;
    }

    getKozerCardFromDeck() {
        let kozerCard = this.getCardFromDeck();
        this.addKozerBackToEndOfDeck(kozerCard);
        return kozerCard;
    }

    addKozerBackToEndOfDeck(kozerCard) {
        this.deck = [kozerCard, ...this.deck];
    }

    isTableEmpty() {
        return (this.cardsOnTable.length === 0);
    }

    getNumOfUndefendedCards() {
        let counter = 0;
        for (let cardArr of this.cardsOnTable) {
            if (!cardArr[1])
                counter++;
        }
        return counter;
    }

    isGameOver() {
        return (this.getNumOfPlayersLeft() < 2);
    }

    handleGameOver() {
        const numOfPlayersLeft = this.getNumOfPlayersLeft();
        let numOfLosingPlayer = null;

        if (numOfPlayersLeft === 0) {  // Draw
            this.gameOver = true;
            this.isDraw = true
        }
        else {
            for (let [playerNum, cardsArr] of Object.entries(this.playerCards)) {
                if (cardsArr.length > 0) {
                    numOfLosingPlayer = playerNum;
                    break;
                }
            }
            this.gameOver = true;
            this.isDraw = false;
            this.losingPlayerNum = numOfLosingPlayer;
        }
    }

    getNumOfPlayersLeft() {
        let numOfPlayersLeft = this.numOfPlayers;

        for (let cardsArr of Object.values(this.playerCards)) {
            if (cardsArr.length === 0)
                numOfPlayersLeft--;
        }

        return numOfPlayersLeft;
    }

    getPlayerStarting() {
        let currentLowestCard = null;
        let currentStartingPlayer = 1;  // Must have default for case no kozers in starting hands

        for (let [playerNum, cardsInHand] of Object.entries(this.playerCards)) {
            for (let cardInHand of cardsInHand) {
                if (this.isCardKozer(cardInHand)) {
                    if (!currentLowestCard  || this.compareCards(currentLowestCard, cardInHand) > 0) {
                        currentLowestCard = cardInHand;
                        currentStartingPlayer = playerNum;
                    }
                }
            }
        }

        return parseInt(currentStartingPlayer);
    }
}

export default MockAPI;