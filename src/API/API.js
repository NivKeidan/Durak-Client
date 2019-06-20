const host = "http://localhost:8080";
const createGame = "/createGame";
const joinGame = "/joinGame";
const getGameStatus = "/gameStatus";
const attack = "/attack";
const defend = "/defend";
const moveCardsToBita = "/moveCardsToBita";
const takeCards = "/takeCards";
const leaveGame = "/leaveGame";

class API {
    createGame(optionsObject) {
        return new Promise ( (resolve, reject) => {
                fetch(host + createGame, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(optionsObject)
                }).then(
                    (res) =>
                        handleResponse(resolve, reject, res)
                ).catch((err) =>
                    handleError(reject, err))
            });
    }

    joinGame(optionsObject) {
        return new Promise ( (resolve, reject) => {
            fetch(host + joinGame, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(optionsObject)
            }).then(
                (res) =>
                    handleResponse(resolve, reject, res)
            ).catch((err) =>
                handleError(reject, err))
        });
    }

    leaveGame(optionsObject) {
        return new Promise ( (resolve, reject) => {
            fetch(host + leaveGame, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(optionsObject)
            }).then(
                (res) =>
                    handleResponse(resolve, reject, res)
            ).catch((err) =>
                handleError(reject, err))
        });
    }

    attack(attackObject) {
        return new Promise( (resolve, reject) => {
            fetch(host + attack, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(attackObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    defend(defendObject) {
        return new Promise((resolve, reject) => {
            fetch(host + defend, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(defendObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    moveCardsToBita(moveCardsToBitaObject) {
        return new Promise( (resolve, reject) => {
            fetch(host + moveCardsToBita, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(moveCardsToBitaObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    takeAllCards(takeCardsObject) {
        return new Promise( (resolve, reject) => {
            fetch(host + takeCards, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(takeCardsObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    getCurrentGameStatus() {
        return new Promise ( (resolve, reject) => {
            fetch(host + getGameStatus).then(
                (res) =>
                    handleResponse(resolve, reject, res)
            ).catch((err) =>
                handleError(reject, err))
        });
    }
}

function handleError(reject, err) {
    return reject({message: err.message});
}

function handleResponse(resolve, reject, res) {
    if (res.ok)
        res.json().then((json) => {return resolve(json)});
    else
        res.json().then((json) => {return reject(json)});
}

export default API;