import React from "react";
import Hand from "./Hand";
import "./styles/Game.css";
import Table from "./Table";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardClicked = this.handleCardClicked.bind(this);
        this.handleTableClick = this.handleTableClick.bind(this);
        this.handleTableCardClick = this.handleTableCardClick.bind(this);
        this.handleMoveCardsToBita = this.handleMoveCardsToBita.bind(this);
        this.handleEventGameUpdated = this.handleEventGameUpdated.bind(this);
        this.getPlayerPositions = this.getPlayerPositions.bind(this);
        this.handleEventGameStarted = this.handleEventGameStarted.bind(this);
        this.connectToGameStream = this.connectToGameStream.bind(this);
        this.getCardValueByCode = this.getCardValueByCode.bind(this);
        this.canCardBeUsed = this.canCardBeUsed.bind(this);
        this.handleCardDragged = this.handleCardDragged.bind(this);
        this.handleCardDragStopped = this.handleCardDragStopped.bind(this);

        this.state = {
            cardSelected: null,
            playerPositions: {1: "top", 2: "left", 3: "bottom", 4: "right"},
            playerStarting: null,
            playerDefending: null,
            isCardDragged: false,
            playerCards: {
                1: [],
                2: [],
                3: [],
                4: []
            },
            cardsOnTable: [],
            kozerCard: null,
            numOfCardsLeftInDeck: null,
            gameOver: false,
            isDraw: false
        };
        
    };

    // Lifecycle

    componentDidMount() {
        this.connectToGameStream();

    }

    // SSE

    connectToGameStream() {
        this.gameStream = new EventSource(process.env.REACT_APP_host + process.env.REACT_APP_gameStreamEndpoint +
            '?id=' + this.props.connectionId);
        this.gameStream.addEventListener('gameupdated', this.handleEventGameUpdated);
        this.gameStream.addEventListener('gamestarted', this.handleEventGameStarted);
        this.gameStream.addEventListener('gamerestarted', this.handleEventGameUpdated);
    }

    handleEventGameUpdated(e) {
        if (e.origin !== process.env.REACT_APP_host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        this.setState(JSON.parse(e.data));
    }

    handleEventGameStarted(e) {
        if (e.origin !== process.env.REACT_APP_host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        let stateObj = JSON.parse(e.data);
        stateObj["playerPositions"] = this.getPlayerPositions(stateObj);
        this.setState(stateObj);
    }

    handleCardDragged() {
        if (!this.state.isCardDragged)
            this.setState({isCardDragged: true})
    }

    handleCardDragStopped() {
        this.setState({isCardDragged: false})
    }

    // API Actions

    takeCards() {

        this.setState({cardSelected: null});

        // Validate this is player's turn
        if (this.state.playerDefending !== this.props.playerName) {
            console.log("Not your turn");
            return;
        }

        // Validate cards on table
        if (this.state.cardsOnTable.length === 0) {
            console.log("No cards on table");
            return;
        }

        // TODO Add "grace" time for receiving more cards... - make it compatible? like a competetion.... be quick kind of thing

        this.props.API.takeAllCards(this.props.connectionId).then(
            () => {},
            function failed(err) {
                console.log(err.message);
            });
    }

    attack(cardCode) {

        // Validations

        if (cardCode === "") {
            console.log("No card selected");
            return;
        }

        if (!this.canAttackNow()) {
            console.log("Can not attack now");
            return;
        }

        // TODO Add check card limit set in game options

        if (this.numOfUndefendedCards() >= this.getNumOfCardsInHand()) {
            // TODO Future option: can put card on table and defender can decide which to reply
            console.log("Defender does not have enough cards");
            return;
        }

        if (!this.isCardInHand(cardCode)) {
            console.log("You do not have that card");
            return;
        }

        if (!this.canAddCard(cardCode)) {
            console.log("Cannot attack with this card");
            return
        }

        this.props.API.attack(this.props.connectionId, {
            attackingCardCode: cardCode
        }).then(()=>{
                this.clearCardSelected()
            },
            function failed(err) {
                console.log(err.message);
            })
    }

    defend(defendingCardCode, attackingCardCode) {

        // Validations

        if (defendingCardCode) {

            if (this.state.playerDefending !== this.props.playerName) {
                console.log("You are not the defending player");
                return
            }

            if(!this.isCardInHand(defendingCardCode)) {
                console.log("Card not in hand");
                return
            }
        }

        if (!this.canDefend(defendingCardCode, attackingCardCode)) {
            console.log("Can not defend");
            return
        }

        this.props.API.defend(this.props.connectionId, {
            defendingCardCode,
            attackingCardCode}
        ).then(()=>{
                this.clearCardSelected()
            },
            function failed(err) {
                console.log(err.message);
            })
    }

    handleMoveCardsToBita() {

        this.setState({cardSelected: null});

        // Validations

        if (this.isBoardEmpty()) {
            console.log("board is empty");
            return;
        }

        if (!this.areAllCardsDefended()) {
            console.log("some cards are un defended");
            return;
        }

        this.props.API.moveCardsToBita(this.props.connectionId).then(
            () => {},
            function failed(err) {
                console.log(err.message);
            });
    }

    // Event handlers

    handleTableClick() {
        this.attack(this.state.cardSelected)
    }

    handleCardClicked(cardCode) {
        this.setState({cardSelected: cardCode});
    }

    handleTableCardClick(e, tableCardCode) {
        e.stopPropagation();  // Stops table click from happening

        const selectedCardCode = this.state.cardSelected;
        this.defend(selectedCardCode, tableCardCode);
    }

    // Renderings

    renderHands() {
        return (
            Object.keys(this.state.playerPositions).map(
                (item, key) => <Hand key={key}
                                     canCardBeUsed={this.canCardBeUsed}
                                     playerName={item}
                                     position={this.state.playerPositions[item]}
                                     cards={this.state.playerCards[item]}
                                     cardSelected={this.state.cardSelected}
                                     cardOnClick={this.handleCardClicked}
                                     takeCards={() => this.takeCards(item)}
                                     isDefending={item === this.state.playerDefending}
                                     canPerformActions={this.props.playerName === item}
                                     moveCardsToBita={() => this.handleMoveCardsToBita(item)}
                                     handleCardDragged={this.handleCardDragged}
                                     handleCardDragStopped={this.handleCardDragStopped}/>))
    };

    renderTable() {
        return (
            <Table cardsOnTable={this.state.cardsOnTable} kozerCard={this.state.kozerCard}
                   handleTableClick={this.handleTableClick}
                   handleTableCardClick={(e, tableCardCode) => this.handleTableCardClick(e, tableCardCode)}
                   cardsLeftInDeck={this.state.numOfCardsLeftInDeck}
                   isCardDragged={this.state.isCardDragged}/>);
    }

    renderRestartGameButton() {
        //  TODO Add game restart handler
        return (
            <button className={"btn-restart-game"} onClick={() => this.props.API.restartGame(this.props.connectionId)}>
                Restart
            </button>
        )
    }

    renderGameOver() {
        return (
            <div className="gameOver">
                Game is over. Click here to restart
                {this.renderRestartGameButton()}
            </div>
    )}

    renderGame() {
        return (
            <div className="gameRunning">
                {/*{this.renderRestartGameButton()}*/}
                {this.renderHands()}
                {this.renderTable()}
            </div>
    )}

    render() {
        return (
            <div className="game">
                {this.state.gameOver ? this.renderGameOver() : this.renderGame() }
            </div>
        );
    };

    // Internal methods

    getPlayerPositions(o) {
        const positions = ["top", "left", "bottom", "right"];
        let playerPositions = {};
        for (let i = 0; i < o.players.length; i++)
            playerPositions[o.players[i]] = positions[i];
        return playerPositions;
    }

    clearCardSelected() {
        this.setState({cardSelected: null})
    }

    canCardBeUsed(cardCode) {
        if (cardCode === null)
            return false;
        if (this.state.playerDefending === this.props.playerName) {
            for (const cardOnTable of this.state.cardsOnTable) {
                if (cardOnTable[1] === "" && this.canDefend(cardCode, cardOnTable[0]) ) {
                    return true;
                }
            }
        }
        else
            return this.canAddCard(cardCode);
        return false;
    }

    // Game Validators

    canDefend(defendingCardCode, attackingCardCode) {
        if (defendingCardCode === null || attackingCardCode === null)
            return false;

        const defendingKind = defendingCardCode[defendingCardCode.length - 1];
        const attackingKind = attackingCardCode[attackingCardCode.length - 1];

        if (defendingKind === attackingKind)
            return this.getCardValueByCode(defendingCardCode) > this.getCardValueByCode(attackingCardCode);
        else
            return defendingKind === this.state.kozerCard[this.state.kozerCard.length - 1];
    }

    numOfUndefendedCards() {
        let counter = 0;
        for (let i in this.state.cardsOnTable) {
            if (i[1] != null)
                counter++
        }
        return counter;
    }

    getNumOfCardsInHand() {
        return this.state.playerCards[this.state.playerDefending].length;
    }

    canAttackNow() {
        if (this.isTableEmpty()) {
            return this.state.playerStarting === this.props.playerName
        } else {
            return this.state.playerDefending !== this.props.playerName
        }
    }

    isCardInHand(cardCode) {
        for (let card in this.state.playerCards[this.props.playerName])
            if (cardCode ===  card)
                return false;
        return true;
    }

    isBoardEmpty() {
        return this.state.cardsOnTable.length === 0;
    }

    areAllCardsDefended() {
        for (let cardOnTable in this.state.cardsOnTable) {
            if (cardOnTable[1] === null)
                return false
        }
        return true;
    }

    isTableEmpty() {
        return this.state.cardsOnTable.length === 0;
    }

    canAddCard(cardCode) {
        if (this.isBoardEmpty() && this.props.playerName === this.state.playerStarting)
            return true;

        const cardValue = this.getCardValueByCode(cardCode);
        if (cardValue === 0)
            return false;

        for (const cardOnTableArray of this.state.cardsOnTable) {
            for (const card of cardOnTableArray) {
                if (this.getCardValueByCode(card) === cardValue)
                    return true;
            }
        }
        return false;
    }

    getCardValueByCode(cardCode) {
        // Returns 0 if error occurred

        let value = 0;
        if (cardCode === "")
            return value;

        const valueCode = cardCode.substring(0, cardCode.length-1);

        switch(valueCode) {
            case "A":
                value = 14;
                break;
            case "K":
                value = 13;
                break;
            case "Q":
                value = 12;
                break;
            case "J":
                value = 11;
                break;
            default:
                value = parseInt(valueCode);
        }
    if (value <= 0 || value > 14)
        return 0;
    return value
    }
}

export default Game;