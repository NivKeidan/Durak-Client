import React from "react";
import Hand from "./Hand";
import "./styles/Game.css";
import Table from "./Table";
import MockAPI from "./API/mockAPI";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardClicked = this.handleCardClicked.bind(this);
        this.handleTableClick = this.handleTableClick.bind(this);
        this.handleTableCardClick = this.handleTableCardClick.bind(this);
        this.handleFinalizeTurn = this.handleFinalizeTurn.bind(this);

        this.state = {
            playerPositions: {1: "top", 2: "left", 3: "bottom", 4: "right"},
            cardSelected: {playerNum: null, cardCode: null},
            numOfPlayers: 4,
            playerStarting: 1,
            playerDefending: 2,
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
        this.API = new MockAPI();
    };

    componentDidMount() {
        this.startGameAPI();
    }

    // API Calls

    startGameAPI() {
        this.API.startGame().then(
            (partialState) => {
                this.setState({...partialState});
            },
            function failed() {
            });
    }

    takeCards(playerNum) {

        // Validate this is player's turn
        if (this.state.playerDefending !== parseInt(playerNum))
            return;

        // Validate cards on table
        if (this.state.cardsOnTable.length === 0)
            return;

        this.API.takeAllCards(playerNum).then(
            (partialState) => {
                this.setState({...partialState})
            },
            function failed(errorMsg) {
                console.log(errorMsg);
            });
    }

    handleFinalizeTurn() {
        this.API.finalizeTurn().then(
            (partialState) => {
                this.setState({...partialState});
            },
            function failed(errorMsg) {
                console.log(errorMsg);
            });
    }

    // Event handlers

    handleTableClick() {

        const selectedCardPlayerNum = this.state.cardSelected.playerNum;
        const selectedCardCode = this.state.cardSelected.cardCode;

        if (selectedCardCode) {
            // VALIDATION: Check that the player can add
            // VALIDATION: Check that the player has this card
            // VALIDATION: Check that this card can be added now

            this.API.attack({
                attackingPlayerNum: selectedCardPlayerNum,
                attackingCardCode: selectedCardCode
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
                })
        }
    }

    handleCardClicked(playerNum, cardCode) {
        this.setState((prevState) => {

            // Cancel if selected card is clicked again
            if (playerNum === prevState.cardSelected.playerNum &&
                cardCode === prevState.cardSelected.cardCode) {
                playerNum = null;
                cardCode = null;
            }

            // Update state
            return {cardSelected: {playerNum, cardCode}};
        });
    }

    handleTableCardClick(e, tableCardCode) {
        e.stopPropagation();  // Stops table click from happening

        const selectedCardPlayerNum = this.state.cardSelected.playerNum;
        const selectedCardCode = this.state.cardSelected.cardCode;

        if (selectedCardCode) {

            // Validate a card is selected
            // Validate its player's turn
            // Validate this card can defend

            this.API.defend({
                defendingPlayerNum: selectedCardPlayerNum,
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
                                     playerNum={item}
                                     position={this.state.playerPositions[item]}
                                     cards={this.state.playerCards[item]}
                                     cardSelected={this.state.cardSelected.playerNum === item ?
                                         this.state.cardSelected.cardCode
                                         :
                                         null}
                                     cardOnClick={this.handleCardClicked}
                                     takeCards={() => this.takeCards(item)}
                                     isMyTurn={parseInt(item) === this.state.playerDefending}
                                     finalizeTurn={this.handleFinalizeTurn}/>))
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

}

export default Game;