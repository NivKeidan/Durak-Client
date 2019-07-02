import React from "react";
import "./styles/Card.css";

function Card(props) {
        return (
        <div className={"card " + (props.selected ? "card-selected" : "")}
        onClick={(e) => props.onCardClick(e)}>
            <img src={"./pics/cards/" + props.code + ".png"}
                 onError={(e)=>{e.target.onerror = null; e.target.src="./pics/cards/back.png"}}
                 height={80}
            />
        </div>
        );
}

export default Card;