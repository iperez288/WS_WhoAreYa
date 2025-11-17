export {initState}
export { updateStats }

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
function successRate (e){
    return e.successRate;
}

let getStats = function(what) {
    const existitu = localStorage.getItem(what);
    if(existitu){
        return JSON.parse(existitu);
    }
    else{
        const hasStats =
        {
        winDistributions: [0,0,0,0,0,0,0,0],
        gamesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalGames: 0,
        successRate: 0,
        };
        
        localStorage.setItem(what, JSON.stringify(hasStats))
        return hasStats;
    }

    
};


function updateStats(t){
    gamestats.totalGames++;
    if (t < 8){
        gamestats.winDistributions[t - 1]++;
        gamestats.currentStreak++;
        if (gamestats.currentStreak > gamestats.bestStreak) {
            gamestats.bestStreak = gamestats.currentStreak;
        }
    }
    else{
        gamestats.currentStreak = 0;
        gamestats.gamesFailed++;
    }
    const totalWins = gamestats.winDistributions.reduce((acc, win) => acc + win, 0);
    gamestats.successRate = Math.round((totalWins / gamestats.totalGames) * 100);

    localStorage.setItem(gamestats, JSON.stringify(gamestats));

    return gamestats;
};


let gamestats = getStats('gameStats');
