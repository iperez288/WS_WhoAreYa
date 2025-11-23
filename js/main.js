import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows, initState } from "./rows.js";
import { autocomplete } from "./autocomplete.js";

// Kalkulatu bi data tartean dauden egun kopurua
function differenceInDays(date1) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const today = new Date();
  const date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  return Math.floor((today - date2) / MS_PER_DAY);
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));

// Jokoaren datu egitura
let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

// Jokoaren soluzioa lortu
function getSolution(players, solutionArray, difference_In_Days) {
  let solutionId;
  let solutionPlayer;

  if(difference_In_Days > 0) {
    let index = (difference_In_Days - 1) % solutionArray.length;
    solutionId = solutionArray[index];
    solutionPlayer = players.find(player => Number(player.id) === Number(solutionId));
  } else {
    solutionId = solutionArray[0];
    solutionPlayer = players.find(player => player.id === solutionId);
  }
  return solutionPlayer;
}


document.getElementById("gamenumber").innerText = difference_In_Days.toString();
document.getElementById("back-icon").innerHTML = folder + leftArrow;

//Egun berri bat bada, localStorage garbitu, saiakera berria egiten uzteko.
function resetIfNewDay() {
    const today = new Date().toDateString();
    const savedDay = localStorage.getItem("WAY_lastDay");

    if (savedDay !== today) {
        localStorage.clear();
        localStorage.setItem("WAY_lastDay", today);
    }
}
resetIfNewDay();


// Jokoaren datuak kargatu eta hasieratu
Promise.all([fetchJSON("fullplayers25"), fetchJSON("solution25")]).then((values) => {

  let solution;
  [game.players, solution] = values;

  game.solution = getSolution(game.players, solution, difference_In_Days);

  document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;

  const addRow = setupRows(game);

  //Aurreko saioetako datuak berreskuratu eta erakutsi
  let [state, _] = initState('WAYgameState', game.solution.id);
  state.guesses.forEach(playerId => addRow(playerId, true));

  autocomplete(document.getElementById("myInput"), game);
});
