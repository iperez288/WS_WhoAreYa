export {initState}

let initState = function(what, solutionId) { 
    const berreskid = localStorage.getItem(what)
    let state;
    if (berreskid) {
        state = JSON.parse(berreskid);
    }
    else {
        state = {
            solutionId: solutionId,
            guesses: []
        };
        localStorage.setItem(what, JSON.stringify(state));
    }

    const addGuess = (guess) => {
            state.guesses.push(guess);
            localStorage.setItem(what, JSON.stringify(state))
    }
    return [state, addGuess]
    
}
