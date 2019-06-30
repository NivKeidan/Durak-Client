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

        this.state = {
            cardSelected: {playerName: null, cardCode: null},
            playerPositions: {1: "top", 2: "left", 3: "bottom", 4: "right"},
            numOfPlayers: props.numOfPlayers,
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
            numOfCardsLeftInDeck: null
        };
        
    };

    // Lifecycle

    componentDidMount() {
        this.props.eventSource.addEventListener('gameupdated', this.handleEventGameUpdated);
        this.props.eventSource.addEventListener('gamestarted', this.handleEventGameStarted);
    }

    // SSE

    handleEventGameUpdated(e) {
        this.setState(JSON.parse(e.data));
    }

    handleEventGameStarted(e) {
        let stateObj = JSON.parse(e.data);
        stateObj["playerPositions"] = this.getPlayerPositions(stateObj);
        this.setState(stateObj);
    }

    // API Actions

    takeCards(playerName) {

        // Validate this is player's turn
        if (this.state.playerDefending !== playerName)
            return;

        // Validate cards on table
        if (this.state.cardsOnTable.length === 0)
            return;

        this.props.API.takeAllCards(playerName).then(
            () => {},
            function failed(err) {
                console.log(err.message);
            });
    }

    attack(playerName, cardCode) {
        this.props.API.attack({
            attackingPlayerName: playerName,
            attackingCardCode: cardCode
        }).then(()=>{},
            function failed(err) {
                console.log(err.message);
            })
    }

    defend(defendingPlayerName, defendingCardCode, attackingCardCode) {
        this.props.API.defend({
            defendingPlayerName,
            defendingCardCode,
            attackingCardCode}
        ).then(()=>{},
            function failed(err) {
                console.log(err.message);
            })
    }

    handleMoveCardsToBita() {
        this.props.API.moveCardsToBita().then(
            () => {},
            function failed(err) {
                console.log(err.message);
            });
    }

    // Event handlers

    handleTableClick() {

        const selectedCardPlayerName = this.state.cardSelected.playerName;
        const selectedCardCode = this.state.cardSelected.cardCode;

        if (selectedCardCode) {
            // VALIDATION: Check that the player can add
            // VALIDATION: Check that the player has this card
            // VALIDATION: Check that this card can be added now

            this.attack(selectedCardPlayerName, selectedCardCode)

        }
    }

    handleCardClicked(playerName, cardCode) {
        this.setState((prevState) => {

            // Cancel if selected card is clicked again
            if (playerName === prevState.cardSelected.playerName &&
                cardCode === prevState.cardSelected.cardCode) {
                playerName = null;
                cardCode = null;
            }

            // Update state
            return {cardSelected: {playerName, cardCode}};
        });
    }

    handleTableCardClick(e, tableCardCode) {
        e.stopPropagation();  // Stops table click from happening

        const selectedCardPlayerName = this.state.cardSelected.playerName;
        const selectedCardCode = this.state.cardSelected.cardCode;

        if (selectedCardCode) {

            // Validate a card is selected
            // Validate its player's turn
            // Validate this card can defend

            this.defend(selectedCardPlayerName, selectedCardCode, tableCardCode);
        }
    }

    // Renderings

    renderHands() {
        return (
            Object.keys(this.state.playerPositions).map(
                (item, key) => <Hand key={key}
                                     playerName={item}
                                     position={this.state.playerPositions[item]}
                                     cards={this.state.playerCards[item]}
                                     cardSelected={this.state.cardSelected.playerName === item ?
                                         this.state.cardSelected.cardCode
                                         :
                                         null}
                                     cardOnClick={this.handleCardClicked}
                                     takeCards={() => this.takeCards(item)}
                                     isMyTurn={item === this.state.playerDefending}
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
        return (
            <button className={"btn-restart-game"} onClick={() => this.startGameAPI()}> Restart </button>
        )
    }

    render() {
        return (
            <div className="game">
                {this.renderRestartGameButton()}
                {this.renderHands()}
                {this.renderTable()}
            </div>
        );
    };

    // Internal methods

    getPlayerPositions(o) {
        let playerNames = Object.keys(o.playerCards);
        console.log(playerNames);
        const positions = ["top", "left", "bottom", "right"];
        let playerPositions = {};
        for (let i = 0; i < playerNames.length; i++)
            playerPositions[playerNames[i]] = positions[i];
        return playerPositions;
    }
}

export default Game;