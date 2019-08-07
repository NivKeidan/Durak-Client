import React from "react";
import Card from "./Card";
import CardDefended from "./CardDefended";
import "./styles/Table.css";

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggedOn: false,
        };

        this.handleDragTableEnter = this.handleDragTableEnter.bind(this);
        this.handleDragTableLeave = this.handleDragTableLeave.bind(this);
        this.handleDragTableDrop = this.handleDragTableDrop.bind(this);
        this.handleDragCardDrop = this.handleDragCardDrop.bind(this);
    }

    handleDragTableEnter(e) {
        e.preventDefault();
        if (!this.state.isDraggedOn)
            this.setState({isDraggedOn: true})
    }

    handleDragTableLeave(e) {
        e.preventDefault();
        if (this.state.isDraggedOn)
            this.setState({isDraggedOn: false})
    }

    handleDragTableDrop(e) {
        e.preventDefault();
        this.setState({isDraggedOn: false});
        this.props.handleTableClick()
    }

    handleDragCardDrop(e, cardCode) {
        e.preventDefault();
        this.setState({isDraggedOn: false});
        this.props.handleTableCardClick(e, cardCode)
    }

    render() {
        let tableDragEvents = this.props.isCardDragged ? {
            onDragEnter: (e) => this.handleDragTableEnter(e),
            onDragLeave: (e) => this.handleDragTableLeave(e),
            onDragOver: (e) => e.preventDefault(),
            onDrop: (e) => this.handleDragTableDrop(e)
        } : {};

        return (
            <div className={"table" + (this.state.isDraggedOn ? " dragged-on" : "")}
                 onClick={() => this.props.handleTableClick()}
                 {...tableDragEvents}
            >
                <div className={"deck-and-kozer"}>
                    {this.props.cardsLeftInDeck !== 0 ?
                        <img className={"kozerCard"} src={"./pics/cards/" + this.props.kozerCard + ".png"}
                             alt="card should be shown here..."
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "./pics/cards/back.png"
                             }}
                             onClick={(e) => e.stopPropagation()}/>
                        :
                        <img className={"kozerSuit"} src={"./pics/" + this.props.kozerCard.slice(-1) + ".svg"}
                             alt="card should be shown here..."
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "./pics/cards/back.png"
                             }}
                             onClick={(e) => e.stopPropagation()}/>}
                    {this.props.cardsLeftInDeck > 1 ? <div className={"deck"}>
                        <img className={"deck-img"} src={"./pics/cards/back.png"}
                             alt="card should be shown here..."
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = "./pics/cards/back.png"
                             }}
                             onClick={(e) => e.stopPropagation()}/>
                        <div className={"deck-number"}> {this.props.cardsLeftInDeck} </div>
                    </div> : null}
                </div>
                <div className={"table-cards"}>
                    {this.props.cardsOnTable.map(
                        (item, key) => item[1] === null || item[1] === "" ?
                            <Card code={item[0]} key={key}
                                  isOnTable={true}
                                  isCardDragged={this.props.isCardDragged}
                                  selected={false}
                                  onCardClick={(e) => this.props.handleTableCardClick(e, item[0])}
                                  canBePlayed={false}/> :
                            <CardDefended key={key} attackingCardCode={item[0]}
                                          defendingCardCode={item[1]}/>
                    )}
                </div>
            </div>
        );
    }
}

export default Table;