import React from 'react';
import './styles/App.css';
import Game from "./Game";
import Menu from "./Menu";
import API from "./API/API";

class App extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.createNewGame = this.createNewGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.handleEventGameStatus = this.handleEventGameStatus.bind(this);
        this.renderGame = this.renderGame.bind(this);
        this.handleEventGameStarted = this.handleEventGameStarted.bind(this);
        this.closeAppStream = this.closeAppStream.bind(this);
        this.handleAppStream = this.handleAppStream.bind(this);
        this.updateReady = this.updateReady.bind(this);

        this.state = {
            // Add options here, or go down to menu
            isGameRunning: false,
            isGameCreated: false,
            isUserJoined: false,
            connectionId: null,
            playerName: null,
            isWatcher: false
        };
    }

    // Lifecycle

    componentDidMount() {
        this.API = new API();
        this.appStream = new EventSource(process.env.REACT_APP_host + process.env.REACT_APP_appStreamEndpoint);
        this.appStream.addEventListener('gamestatus', this.handleEventGameStatus);
    }

    // SSE

    handleEventGameStatus(e) {
        if (e.origin !== process.env.REACT_APP_host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        this.setState(JSON.parse(e.data), () => this.updateReady());
    }

    handleEventGameStarted(e) {
        // TODO Integrate admin/watcher here

        if (e.origin !== process.env.REACT_APP_host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        if (this.state.isWatcher)
            // TODO App Stream does not send game data anymore. Most likely, a new stream will be created for watchers
            //  and here is where the registration should be
            this.setState(JSON.parse(e.data))

    }

    closeAppStream() {
        this.appStream.close()
    }

    handleAppStream() {
        // TODO Add logic here for admin? or for game watchers?
        if (this.state.isWatcher)
            this.appStream.addEventListener('gamestarted', this.handleEventGameStarted);
        else
            this.closeAppStream();
    }

    updateReady() {
        if (this.state.connectionId && this.state.isGameRunning && this.state.playerName) {
            this.setState({isReady: true})
        }
    }

    // API Actions

    createNewGame(numOfPlayers, playerName) {

        if (!this.isNameValid(playerName)) {
            console.log("Invalid name");
            return;
        }

        if (numOfPlayers < 2 || numOfPlayers > 4) {
            console.log("Invalid num of players");
            return;
        }

        // TODO CreateGame API call should accept an options object in the future

        this.API.createGame({numOfPlayers: numOfPlayers, playerName}).then(
            (res) => {
                this.setState({
                    isUserJoined: true,
                    connectionId: res.idCode,
                    playerName: res.playerName}, () => this.updateReady());
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    joinGame(playerName) {

        if (!this.isNameValid(playerName)) {
            console.log("Invalid name");
            return;
        }

        this.API.joinGame({playerName}).then(
            (res) => {
                this.setState({
                    isUserJoined: true,
                    connectionId: res.idCode,
                    playerName: res.playerName}, () => this.updateReady());
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    leaveGame() {

        if (this.state.isGameRunning) {
            console.log("Can not leave game now, game is running");
            return;
        }

        this.API.leaveGame(this.state.connectionId).then(
            () => {
                this.setState({isUserJoined: false})
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    // Validations

    isNameValid(playerName) {
        return /^[a-zA-Z0-9]+$/.test(playerName);
    }

    // Renderings

    renderGame() {
        this.handleAppStream();
        return (
            <Game API={this.API} connectionId={this.state.connectionId} playerName={this.state.playerName}/>
        )
    }

    render() {
      return (
        <div className="App">
            <Menu isGameRunning={this.state.isGameRunning}
                  isGameCreated={this.state.isGameCreated}
                  isUserJoined={this.state.isUserJoined}
                  createNewGame={this.createNewGame}
                  joinGame={this.joinGame}
                  leaveGame={this.leaveGame}
                  playerName={this.state.playerName}
            />
            {this.state.isReady ? this.renderGame() : null }
        </div>
    )};

}

export default App;
