import React from "react";
import Hand from "./Hand";
import "./styles/Game.css";
import Table from "./Table";
import {gameStream, host} from "./API/API";

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

        this.state = {
            cardSelected: null,
            playerPositions: {1: "top", 2: "left", 3: "bottom", 4: "right"},
            playerStarting: null,
            playerDefending: null,
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
        this.gameStream = new EventSource(host + gameStream +
            '?id=' + this.props.connectionId + '&name=' + this.props.playerName);
        this.gameStream.addEventListener('gameupdated', this.handleEventGameUpdated);
        this.gameStream.addEventListener('gamestarted', this.handleEventGameStarted);
        this.gameStream.addEventListener('gamerestarted', this.handleEventGameUpdated);
    }

    handleEventGameUpdated(e) {
        if (e.origin !== host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        this.setState(JSON.parse(e.data));
    }

    handleEventGameStarted(e) {
        if (e.origin !== host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        let stateObj = JSON.parse(e.data);
        stateObj["playerPositions"] = this.getPlayerPositions(stateObj);
        this.setState(stateObj);
    }

    // API Actions

    takeCards(playerName) {

        // Validations

        // Validate this is player's turn
        if (this.state.playerDefending !== playerName) {
            console.log("Not your turn");
            return;
        }

        // Validate cards on table
        if (this.state.cardsOnTable.length === 0) {
            console.log("No cards on table");
            return;
        }

        // TODO Add "grace" time for receiving more cards... - make it compatible? like a competetion.... be quick kind of thing

        this.props.API.takeAllCards(playerName).then(
            () => {},
            function failed(err) {
                console.log(err.message);
            });
    }

    attack(cardCode) {

        // Validations

        if (cardCode) {

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

        }

        this.props.API.attack({
            attackingPlayerName: this.props.playerName,
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

        this.props.API.defend({
            defendingPlayerName: this.props.playerName,
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

        // Validations

        if (this.isBoardEmpty()) {
            console.log("board is empty");
            return;
        }

        if (!this.areAllCardsDefended()) {
            console.log("some cards are un defended");
            return;
        }

        this.props.API.moveCardsToBita().then(
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

        this.setState((prevState) => {
            // Cancel selection if selected card is clicked again
            if (cardCode === prevState.cardSelected) {
                cardCode = null;
            }
            return {
                cardSelected: cardCode
            };
        });
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
                                     playerName={item}
                                     position={this.state.playerPositions[item]}
                                     cards={this.state.playerCards[item]}
                                     cardSelected={this.state.cardSelected}
                                     cardOnClick={this.handleCardClicked}
                                     takeCards={() => this.takeCards(item)}
                                     isDefending={item === this.state.playerDefending}
                                     canPerformActions={this.props.playerName === item}
                                     moveCardsToBita={this.handleMoveCardsToBita}/>))
    };

    renderTable() {
        return (
            <Table cardsOnTable={this.state.cardsOnTable} kozerCard={this.state.kozerCard}
                   handleTableClick={this.handleTableClick}
                   handleTableCardClick={(e, tableCardCode) => this.handleTableCardClick(e, tableCardCode)}
                   cardsLeftInDeck={this.state.numOfCardsLeftInDeck}/>);
    }

    renderRestartGameButton() {
        // TODO Add game restart handler
        return (
            <button className={"btn-restart-game"} onClick={() => this.props.API.restartGame()}> Restart </button>
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

    // Game Validators

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
        if (this.isBoardEmpty())
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

        const valueCode = cardCode.substring(0, cardCode.length-1);
        let value = 0;

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