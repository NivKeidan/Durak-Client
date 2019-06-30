import React from 'react';
import './styles/App.css';
import Game from "./Game";
import Menu from "./Menu";
import API from "./API/API";
import { host, sseEndpoint } from "./API/API";

class App extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.createNewGame = this.createNewGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.handleIncomingSSE = this.handleIncomingSSE.bind(this);

        this.state = {
            // Add options here, or go down to menu
            isGameRunning: false,
            isGameCreated: false,
            isUserJoined: false,
        };

    }

    // Lifecycle

    componentDidMount() {
        this.API = new API();
        this.eventSource = new EventSource(host + sseEndpoint);
        this.eventSource.addEventListener('gamecreated', this.handleIncomingSSE);
    }

    // SSE
    handleIncomingSSE(e) {
        // TODO Get origin from config
        if (e.origin !== "http://localhost:8080") {
            console.log('SECURITY ORIGIN UNCLEAR');
            return;
        }
        this.setState(JSON.parse(e.data));
    }

    // API Actions

    createNewGame(numOfPlayers, playerName) {
        this.API.createGame({numOfPlayers: numOfPlayers, playerName}).then(
            () => {
                this.setState({isUserJoined: true})
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    joinGame(playerName) {
        this.API.joinGame({playerName}).then(
            () => {
                this.setState({isUserJoined: true})
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    leaveGame(playerName) {
        this.API.leaveGame({playerName}).then(
            () => {
                this.setState({isUserJoined: false})
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    // Renderings

    render() {
      return (
        <div className="App">
            <Menu isGameRunning={this.state.isGameRunning}
                  isGameCreated={this.state.isGameCreated}
                  isUserJoined={this.state.isUserJoined}
                  createNewGame={this.createNewGame}
                  joinGame={this.joinGame}
                  leaveGame={this.leaveGame}/>
            {this.state.isGameRunning ? <Game API={this.API} eventSource={this.eventSource}/> : null }
        </div>
    )};
}

export default App;
