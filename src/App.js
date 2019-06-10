import React from 'react';
import './styles/App.css';
import Game from "./Game";
import Menu from "./Menu";
import API from "./API/API";

class App extends React.Component {
    constructor(props) {
        super(props);

        // Function binding
        this.startNewGame = this.startNewGame.bind(this);

        this.state = {
            // Add options here, or go down to menu
            isGameRunning: false
        };
        this.API = new API();
    }

    startNewGame() {
        this.setState({isGameRunning: true});
    }

    render() {
      return (
        <div className="App">
            <Menu isGameRunning={this.state.isGameRunning}
                  startNewGame={this.startNewGame}/>
            {this.state.isGameRunning ? <Game API={this.API}/> : null }
        </div>
    )};
}

export default App;
