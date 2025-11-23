let gamestats = getStats('gameStats');

// Saiakeraren estatistikak lortzeko eta hasieratzeko funtzioa
export function getStats(what) {
    const existitu = localStorage.getItem(what);
    if(existitu){
        return JSON.parse(existitu);
    }
    else{
        const hasStats = {
            winDistributions: [0,0,0,0,0,0,0,0,0],
            gamesFailed: 0,
            currentStreak: 0,
            bestStreak: 0,
            totalGames: 0,
            successRate: 0,
        };
        localStorage.setItem(what, JSON.stringify(hasStats));
        return hasStats;
    }
}

// Arrakasta tasa kalkulatzeko funtzioa
function successRate (e){
    const totalWins = gamestats.winDistributions.reduce((acc, win) => acc + win, 0);
    e.successRate = Math.round((totalWins / gamestats.totalGames) * 100);
    return e.successRate;
}

// Jokoaren estatistikak eguneratzeko funtzioa
export function updateStats(t){
    gamestats.totalGames++;
    if (t <= 8) {
        gamestats.winDistributions[t]++;
        gamestats.currentStreak++;
        if (gamestats.currentStreak > gamestats.bestStreak) {
            gamestats.bestStreak = gamestats.currentStreak;
        }
    }
    else{
        gamestats.currentStreak = 0;
        gamestats.gamesFailed++;
    }
    successRate(gamestats);
    localStorage.setItem('gameStats', JSON.stringify(gamestats));
    return gamestats;
}
