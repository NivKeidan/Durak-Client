const host = "http://localhost:8080";
const startGame = "/startGame";
const attack = "/attack";
const defend = "/defend";
const moveCardsToBita = "/moveCardsToBita";
const takeCards = "/takeCards";

class API {
    startGame() {
        return fetch(host + startGame).then((res) => {return res.json();});
    }

    attack(attackObject) {
        return fetch(host + attack, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attackObject)
        }).then((res) => {return res.json()});
    }

    defend(defendObject) {
        return fetch(host + defend, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(defendObject)
        }).then( (res) => {return res.json()});
    }

    moveCardsToBita(moveCardsToBitaObject) {
        return fetch(host + moveCardsToBita, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moveCardsToBitaObject)
        }).then( (res) => {return res.json()});
    };

    takeAllCards(takeCardsObject) {
        return fetch(host + takeCards, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(takeCardsObject)
        }).then( (res) => {return res.json()});
    };
}

export default API;