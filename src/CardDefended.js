import React from "react";
import "./styles/CardDefended.css";

function CardDefended(props) {
        return (
        <div className={"card-defended"}>
                <img className={"card-defended-below"}
                     src={"./pics/cards/" + props.attackingCardCode + ".png"}
                     alt="card should be shown here..."
                     onError={(e)=>{e.target.onerror = null; e.target.src="./pics/cards/back.png"}}
                     height={100}
                />
                <img className={"card-defended-top"}
                     src={"./pics/cards/" + props.defendingCardCode + ".png"}
                     alt="card should be shown here..."
                     onError={(e)=>{e.target.onerror = null; e.target.src="./pics/cards/back.png"}}
                     height={100}
                     />
        </div>
        );
}

export default CardDefended;