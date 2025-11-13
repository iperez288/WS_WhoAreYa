import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import { setupRows } from "./rows.js";
import { autocomplete } from "./autocomplete.js";

function differenceInDays(date1) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const today = new Date();
  const date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const days = Math.floor((today - date2) / MS_PER_DAY);
  return days;
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));
 
window.onload = function () {
  document.getElementById("gamenumber").innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

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

Promise.all([fetchJSON("fullplayers25"), fetchJSON("solution25")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById("mistery").src = `https://playfootball.games/media/players/${game.solution.id % 32}/${game.solution.id}.png`;
    
    const addRow = setupRows(game);

    // Input elementua lortu
    //const myInput = document.getElementById("myInput");

    //horren ordez, autocomplete funtzioari deituko diogu
    autocomplete(document.getElementById("myInput"), game)

    // Enter sakatzean addRow deitzea
    myInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {

        //ORAIN enter sakatzean inputa id bilakatzen du eta addRow(id) deitzen du.
        const selectedPlayer = game.players.find(p => {
          return p.name.toLowerCase() === myInput.value.toLowerCase()
        })

        addRow(selectedPlayer.id)

        myInput.value = ''; // input garbitu
      }
    });
  }
);