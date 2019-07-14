export class API {
    createGame(optionsObject) {
        return new Promise ( (resolve, reject) => {
                fetch(process.env.REACT_APP_host + process.env.REACT_APP_createGameEndpoint, {
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
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_joinGameEndpoint, {
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

    leaveGame(connId) {
        return new Promise ( (resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_leaveGameEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                }
            }).then(
                (res) =>
                    handleResponse(resolve, reject, res)
            ).catch((err) =>
                handleError(reject, err))
        });
    }

    attack(connId, attackObject) {
        return new Promise( (resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_attackEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                },
                body: JSON.stringify(attackObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    defend(connId, defendObject) {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_defendEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                },
                body: JSON.stringify(defendObject)
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    moveCardsToBita(connId) {
        return new Promise( (resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_moveCardsToBitaEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                }
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    takeAllCards(connId) {
        return new Promise( (resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_takeCardsEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                },
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
                handleError(reject, err))
        });
    }

    restartGame(connId) {

        return new Promise( (resolve, reject) => {
            fetch(process.env.REACT_APP_host + process.env.REACT_APP_restartGameEndpoint, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'ConnectionId': connId
                }
            }).then( (res) =>
                handleResponse(resolve, reject, res)
            ).catch( (err) =>
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