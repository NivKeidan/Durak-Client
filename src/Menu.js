import React from "react";
import "./styles/Menu.css";


class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.handleCreateGameSubmit = this.handleCreateGameSubmit.bind(this);
        this.handlePlayerNumChange = this.handlePlayerNumChange.bind(this);
        this.renderCreateGameMenu = this.renderCreateGameMenu.bind(this);
        this.renderJoinGameMenu = this.renderJoinGameMenu.bind(this);
        this.renderGameInProgressMenu = this.renderGameInProgressMenu.bind(this);
        this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
        this.getRandomPlayerName = this.getRandomPlayerName.bind(this);
        this.handleJoinGameSubmit = this.handleJoinGameSubmit.bind(this);
        this.renderWaitingForPlayersMenu = this.renderWaitingForPlayersMenu.bind(this);
        this.handleLeaveGameSubmit = this.handleLeaveGameSubmit.bind(this);

        this.state = {
            numOfPlayers: 4,
            playerName: this.getRandomPlayerName()
        };

    }

    handleCreateGameSubmit(e) {
        this.props.createNewGame(this.state.numOfPlayers, this.state.playerName);
        e.preventDefault();
    }

    handleJoinGameSubmit(e) {
        this.props.joinGame(this.state.playerName);
        e.preventDefault();
    }

    handlePlayerNumChange(e) {
        this.setState({numOfPlayers: parseInt(e.target.value)});
    }

    handlePlayerNameChange(e) {
        this.setState({playerName: e.target.value});
    }

    handleLeaveGameSubmit(e) {
        this.props.leaveGame(this.state.playerName);
        e.preventDefault();
    }

    renderCreateGameMenu() {
        return (
            <div className={"menu-create"}>
                <form onSubmit={this.handleCreateGameSubmit}>
                    <label>Player Name:
                        <input type="text" value={this.state.playerName}
                               onChange={this.handlePlayerNameChange} />
                    </label>
                    <label> Number of players:
                        <select value={this.state.numOfPlayers} onChange={this.handlePlayerNumChange}>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </label>
                    <input className={"menu-btn btn-create-game"} type="submit" value="Create Game"/>
                </form>
            </div>
        )
    }

    renderJoinGameMenu() {
        return (
            <div className={"menu-join-game"}>
                <form onSubmit={this.handleJoinGameSubmit} >
                    <label>Player Name:
                        <input type="text" value={this.state.playerName}
                               onChange={this.handlePlayerNameChange} />
                    </label>
                    <input className={"menu-btn btn-join-game"} type="submit" value="Join Game"/>
                </form>
            </div>
        )
    }

    renderWaitingForPlayersMenu() {
        return (
            <div className={"menu-wait-for-players"}>
                <form onSubmit={this.handleLeaveGameSubmit}>
                    <input className={"menu-btn btn-leave-game"} type="submit" value="Leave Game"/>
                </form>
            </div>
        )
    }

    renderGameInProgressMenu() {
        return (
            <div> Game running menu </div>
        )
    }

    render() {
        return (
            <div className={"menu"}>
                <h2><u>Menu</u></h2>
                {this.props.isGameCreated ?
                    this.props.isGameRunning ?
                        this.renderGameInProgressMenu() : this.props.isUserJoined ?
                            this.renderWaitingForPlayersMenu() : this.renderJoinGameMenu()
                    : this.renderCreateGameMenu()
                }
            </div>
        )}

    getRandomPlayerName() {
        // TODO Upgrade random naming
        return "Guest1237";
    }
}

export default Menu;