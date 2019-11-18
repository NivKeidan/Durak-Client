import React from "react";
import './styles/Hand.css';
import Card from "./Card";

function Hand(props) {
    return (
      <div className={"hand hand-" + props.position}>
          <div className={"playerHeader"}>
              {props.playerName}
          </div>
          {props.playerLeft ? "PLAYER LEFT WOW" :
          <div className={"handCards"}>
              {props.cards.map(
                  (item, key) => <Card key={key} code={item}
                                       onCardClick={() => props.cardOnClick(item)}
                                       selected={props.cardSelected === item && item !== null}
                                       canBePlayed={props.canCardBeUsed(item)}
                                       handleDragStart={props.handleCardDragged}
                                       handleDragEnd={props.handleCardDragStopped}
                  />)}
          </div>}
          {props.isDefending && props.canPerformActions ?
          <div className={"player-buttons"}>
              <button className={"btn-take-cards"} onClick={props.takeCards}> Take Cards </button>
              <button className={"btn-bita"} onClick={props.moveCardsToBita}> Move Cards To Bita </button>
          </div> : null }
      </div>
    );
}

export default Hand;