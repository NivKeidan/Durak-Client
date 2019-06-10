import React from "react";
import "./styles/Menu.css";


function Menu(props) {
    return (
        <div className={"menu"}>
            <h2><u>This is the menu</u></h2><br/><br/><br/>
            This is an option<br/><br/><br/>
            This is an option<br/><br/><br/>
            This is an option<br/><br/><br/>
            This is an option<br/><br/><br/>
            This is an option
            {props.isGameRunning ?
                null :
                <button className={"btn-start-game"} onClick={() => props.startNewGame()}>Start Game</button>
            }
        </div>
    )
}

export default Menu;