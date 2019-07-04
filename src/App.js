import React from 'react';
import './styles/App.css';
import Game from "./Game";
import Menu from "./Menu";
import API from "./API/API";
import { host, appStream } from "./API/API";

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
        this.appStream = new EventSource(host + appStream);
        this.appStream.addEventListener('gamestatus', this.handleEventGameStatus);
    }

    // SSE

    handleEventGameStatus(e) {
        if (e.origin !== host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        this.setState(JSON.parse(e.data), () => this.updateReady());
    }

    handleEventGameStarted(e) {
        // TODO This should be removed, this is only here as a reminder to implement watcher/admin here
        if (e.origin !== host) {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        if (this.state.isWatcher)
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

        // TODO Add character check for player name validation
        // TODO Validate num of players is reasonable
        // TODO This will in the future will hold all the options for the game

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

        // TODO Add player name valiation
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

        // TODO Add handling of game leaving in the middle?

        this.API.leaveGame({playerName: this.state.playerName}).then(
            () => {
                this.setState({isUserJoined: false})
            },
            function failed(err) {
                console.log(err.message);
            });
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
