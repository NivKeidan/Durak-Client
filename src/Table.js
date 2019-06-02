import React from "react";
import Card from "./Card";
import CardDefended from "./CardDefended";
import "./styles/Table.css";

function Table(props) {

    return (
        <div className={"table"} onClick={() => props.handleTableClick()}>
            <div className={"deck-and-kozer"}>
                { props.cardsLeftInDeck !== 0 ?
                    <img className={"kozerCard"} src={"./pics/cards/" + props.kozerCard + ".png"}
                          alt={"./pics/cards/back.png"} onClick={(e) => e.stopPropagation()}/>
                    :
                    <img className={"kozerSuit"} src={"./pics/" + props.kozerCard.slice(-1) + ".svg"}
                         alt={"./pics/cards/back.png"} onClick={(e) => e.stopPropagation()}/> }
                    { props.cardsLeftInDeck > 1 ? <div className={"deck"}>
                            <img className={"deck-img"} src={"./pics/cards/back.png"}
                                 alt={"./pics/cards/back.png"}
                                 onClick={(e) => e.stopPropagation()}/>
                        <div className={"deck-number"}> {props.cardsLeftInDeck} </div> </div>: null}
            </div>
            <div className={"table-cards"}>
                {props.cardsOnTable.map(
                    (item, key) => item[1] === null ?
                        <Card code={item[0]} key={key}
                              selected={false}
                              onCardClick={(e) => props.handleTableCardClick(e, item[0])}/> :
                        <CardDefended key={key} attackingCardCode={item[0]}
                                      defendingCardCode={item[1]}/>
                )}
            </div>
        </div>
    );
}

export default Table;