import React from "react";
import Hand from "./Hand";
import "./styles/Game.css";
import Table from "./Table";
import API from "./API/API";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardClicked = this.handleCardClicked.bind(this);
        this.handleTableClick = this.handleTableClick.bind(this);
        this.handleTableCardClick = this.handleTableCardClick.bind(this);
        this.handleMoveCardsToBita = this.handleMoveCardsToBita.bind(this);

        this.state = {
            cardSelected: {playerName: null, cardCode: null},
            playerPositions: {1: "top", 2: "left", 3: "bottom", 4: "right"},
            numOfPlayers: 4,
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
        this.API = new API();
    };

    componentDidMount() {
        this.startGameAPI();
    }

    // API Calls

    startGameAPI() {
        this.API.startGame().then(
            (result) => {
                let playerPositions = this.getPlayerPositions(result);
                this.setState({...result, playerPositions});
            },
            function failed() {
            });
    }

    takeCards(playerName) {

        // Validate this is player's turn
        if (this.state.playerDefending !== playerName)
            return;

        // Validate cards on table
        if (this.state.cardsOnTable.length === 0)
            return;

        this.API.takeAllCards(playerName).then(
            (partialState) => {
                this.setState({...partialState})
            },
            function failed(errorMsg) {
                console.log(errorMsg);
            });
    }

    attack(playerName, cardCode) {
        this.API.attack({
            attackingPlayerName: playerName,
            attackingCardCode: cardCode
        }).then(
            ({playerCards, cardsOnTable}) => {

                this.setState((prevState) => {

                    // Un-select card if needed
                    let cardSelected = Object.assign({}, prevState.cardSelected);
                    if (prevState.cardSelected.cardCode === cardCode) {
                        Object.keys(cardSelected).map(
                            (item, key) => cardSelected[item] = null);
                    }

                    return ({
                        cardSelected,
                        cardsOnTable,
                        playerCards,
                    });
                });
            },

            function failed(errorMsg) {
                console.log(errorMsg);
            })
    }

    handleMoveCardsToBita() {
        this.API.moveCardsToBita().then(
            (partialState) => {
                this.setState({...partialState});
            },
            function failed(errorMsg) {
                console.log(errorMsg);
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

            this.API.defend({
                defendingPlayerName: selectedCardPlayerName,
                defendingCardCode: selectedCardCode, attackingCardCode: tableCardCode
            }).then(
                ({playerCards, cardsOnTable}) => {

                    this.setState((prevState) => {

                        // Un-select card if needed
                        let cardSelected = Object.assign({}, prevState.cardSelected);
                        if (prevState.cardSelected.cardCode === selectedCardCode) {
                            Object.keys(cardSelected).map(
                                (item, key) => cardSelected[item] = null);
                        }

                        return ({
                            cardSelected,
                            cardsOnTable,
                            playerCards,
                        });
                    });
                },
                function failed(errorMsg) {
                    console.log(errorMsg);
                });
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

    render() {
        return (
            <div className="game">
                {this.renderHands()}
                {this.renderTable()}
            </div>
        );
    };

    getPlayerPositions(result) {
        console.log(result);
        let playerNames = Object.keys(result.playerCards);
        const positions = ["top", "left", "bottom", "right"];
        let playerPositions = {};
        for (let i = 0; i < this.state.numOfPlayers; i++)
            playerPositions[playerNames[i]] = positions[i];
        return playerPositions;
    }
}

export default Game;