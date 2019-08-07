import React from "react";
import "./styles/Card.css";

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMouseOver: false,
            isDraggedOn: false,
        };
        this.handleDragOnTableEnter = this.handleDragOnTableEnter.bind(this);
        this.handleDragOnTableLeave = this.handleDragOnTableLeave.bind(this);
        this.handleDragOnTableDrop = this.handleDragOnTableDrop.bind(this);
    }

    handleDragOnTableEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.isDraggedOn)
            this.setState({isDraggedOn: true})
    }

    handleDragOnTableLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.state.isDraggedOn)
            this.setState({isDraggedOn: false})
    }

    handleDragOnTableDrop(e) {
        e.preventDefault();
        this.setState({isDraggedOn: false});
        this.props.onCardClick(e)
    }

    render() {
        let usableCardEvents = this.props.canBePlayed ? {
            onMouseEnter: () => this.setState({isMouseOver: true}),
            onDrag: () => this.props.handleDragStart()
        } : null;

        let cardOnTableEvents = this.props.isOnTable && this.props.isCardDragged ? {
            onDragEnter: (e) => this.handleDragOnTableEnter(e),
            onDragLeave: (e) => this.handleDragOnTableLeave(e),
            onDragOver: (e) => e.preventDefault(),
            onDrop: (e) => this.handleDragOnTableDrop(e)
        } : null;

        return (
            <div
                className={
                    "card " + (this.props.selected ? "card-selected " : "") +
                    (this.props.canBePlayed ? "card-can-be-played " : "") +
                    (this.state.isMouseOver ? "mouse-over-card " : "") +
                    (this.state.isDraggedOn ? "card-dragged-over ": "")
                }
                {...usableCardEvents}
                {...cardOnTableEvents}
                draggable={this.props.canBePlayed}
                onMouseLeave={() => this.setState({isMouseOver: false})}
                onDragEnd={() => this.props.handleDragEnd()}
                onMouseDown={(e) => this.props.onCardClick(e)}
                >
                <img src={"./pics/cards/" + this.props.code + ".png"}
                     alt="card should be shown here..."
                     onError={(e) => {
                         e.target.onerror = null;
                         e.target.src = "./pics/cards/back.png"
                     }}
                     height={80}
                />
            </div>
        );
    }
}

export default Card;