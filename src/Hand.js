import React from "react";
import './styles/Hand.css';
import Card from "./Card";

function Hand(props) {
    return (
      <div className={"hand hand-" + props.position}>
          <div className={"playerHeader"}>
              Player {props.playerNum}
          </div>
          <div className={"handCards"}>
              {props.cards.map(
                  (item, key) => <Card key={key} code={item}
                                       onCardClick={() => props.cardOnClick(props.playerNum, item)}
                                       selected={props.cardSelected === item}/>)}
          </div>
          {props.isMyTurn ?
          <div className={"player-buttons"}>
              <button className={"btn-take-cards"} onClick={() => props.takeCards()}> Take Cards </button>
              <button className={"btn-bita"} onClick={() => props.finalizeTurn()}> Finalize Turn </button>
          </div> : null }
      </div>
    );
}

export default Hand;