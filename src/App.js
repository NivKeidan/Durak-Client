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
        this.getGameStatus = this.getGameStatus.bind(this);

        this.state = {
            // Add options here, or go down to menu
            isGameRunning: false,
            isGameCreated: false
        };
        this.API = new API();
    }

    componentDidMount() {
        this.getGameStatus();
    }


    getGameStatus() {
        this.API.getCurrentGameStatus().then(
            (result) => {
                this.setState({...result})
            },
            function failed(err) {
                console.log(err.message)
            }
        );
    }

    createNewGame(numOfPlayers) {
        this.API.createGame({numOfPlayers: numOfPlayers}).then(
            () => {
                this.setState({
                    isGameCreated: true});
            },
            function failed(err) {
                console.log(err.message);
            });
    }

    joinGame() {
        // TODO Handle join game
    }

    render() {
      return (
        <div className="App">
            <Menu isGameRunning={this.state.isGameRunning}
                  isGameCreated={this.state.isGameCreated}
                  createNewGame={this.createNewGame}
                  joinGame={this.joinGame}/>
            {this.state.isGameRunning ? <Game API={this.API} numOfPlayers={this.state.numOfPlayers}/> : null }
        </div>
    )};
}

export default App;
