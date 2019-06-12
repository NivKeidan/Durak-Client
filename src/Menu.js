import React from "react";
import "./styles/Menu.css";


class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePlayerNumChange = this.handlePlayerNumChange.bind(this);

        this.state = {
            numOfPlayers: 4
        };

    }

    handleSubmit(e) {
        this.props.startNewGame(this.state.numOfPlayers)
        e.preventDefault();
    }

    handlePlayerNumChange(e) {
        this.setState({numOfPlayers: parseInt(e.target.value)});
    }

    render() {
        return (
            <div className={"menu"}>
                <h2><u>Menu</u></h2>
                {this.props.isGameRunning ?
                    null :
                    <div className={"menu-options"}>
                        <form onSubmit={this.handleSubmit}>
                        <label> Number of players:
                            <select value={this.state.numOfPlayers} onChange={this.handlePlayerNumChange}>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </label>
                        <input className={"btn-start-game"} type="submit" value="Start Game" />
                        </form>
                    </div>
                }
            </div>
        )}
}

export default Menu;