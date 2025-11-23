import { stringToHTML, higher, lower, headless, stats, toggle } from "./fragments.js";
import { updateStats } from "./stats.js";

const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate'];
const delay = 350;


export function initState(what, solutionId) { 
    const saved = localStorage.getItem(what);
    let state;

    if (saved) {
        state = JSON.parse(saved);

        if (state.solutionId !== solutionId) {
            state = { solutionId: solutionId, guesses: [] };
            localStorage.setItem(what, JSON.stringify(state));
        }
    } else {
        state = { solutionId: solutionId, guesses: [] };
        localStorage.setItem(what, JSON.stringify(state));
    }

    const addGuess = (guess) => {
        state.guesses.push(guess);
        localStorage.setItem(what, JSON.stringify(state));
    }

    return [state, addGuess];
}


let setupRows = function (game) {
  let [state, updateState] = initState('WAYgameState', game.solution.id);

  function leagueToFlag(leagueId) {
    const leagueMap = {
      564: "es1",
      8: "en1",
      82: "de1",
      384: "it1",
      301: "fr1",
    };
    return leagueMap[leagueId] || "";
  }

  function getAge(dateString) {
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  }

  let check = function (key, value) {
    const mystery = game.solution;
    if (key === "birthdate") {
      const guessAge = getAge(value);
      const mysteryAge = getAge(mystery.birthdate);
      if (guessAge === mysteryAge) return "correct";
      if (guessAge < mysteryAge) return "lower";
      return "higher";
    }
    return mystery[key] === value ? "correct" : "incorrect";
  };

  function unblur(outcome) {
    return new Promise(resolve => {
      setTimeout(() => {
        document.getElementById("mistery").classList.remove("hue-rotate-180", "blur");
        const combo = document.getElementById("combobox");
        if (combo) combo.remove();
        let color, text;
        if (outcome === 'success') {
          color = "bg-blue-500";
          text = "Awesome";
        } else {
          color = "bg-rose-500";
          text = "The player was " + game.solution.name;
        }
        document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`;
        resolve();
      }, 2000);
    });
  }

  function showContent(content, guess) {
    let fragments = '', s = '';
    for (let j = 0; j < content.length; j++) {
      s = "".concat(((j + 1) * delay).toString(), "ms");
      fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                      <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                        ${content[j]}
                      </div>
                    </div>`;
    }

    let child = `<div class="flex w-full flex-wrap text-l py-2">
                    <div class=" w-full grow text-center pb-2">
                      <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                        ${guess.name}
                      </div>
                    </div>
                    ${fragments}</div>`;

    document.getElementById('players').prepend(stringToHTML(child));
  }

  function setContent(guess) {
    const ageCheck = check("birthdate", guess.birthdate);
    let ageDisplay = `${getAge(guess.birthdate)}`;
    if (ageCheck === "lower") ageDisplay += ` ${higher}`;
    else if (ageCheck === "higher") ageDisplay += ` ${lower}`;

    return [
      `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
      `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
      `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
      `${guess.position}`,
      `${ageDisplay}`
    ];
  }

  function resetInput() {
    const input = document.getElementById("myInput");
    input.value = "";
    const attempt = game.guesses.length + 1;
    if (attempt < 9) input.placeholder = `Guess ${attempt} of 8`;
  }

  function getPlayer(playerId) {
    return game.players.find(p => p.id === playerId) || null;
  }

  let gameFinished = false;

  function success() {
    if (gameFinished) return;
    gameFinished = true;
    unblur('success');
    showStats();
  }

  function gameOver() {
    if (gameFinished) return;
    gameFinished = true;
    unblur('gameover');
    showStats();
  }

  function showStats(timeout = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        document.body.appendChild(stringToHTML(headless(stats())));
        document.getElementById("showHide").onclick = toggle;
        document.getElementById("closedialog").onclick = function () {
          document.body.removeChild(document.body.lastChild);
          document.getElementById("mistery").classList.remove("hue-rotate-180", "blur");
        };
        resolve();
      }, timeout);
    });
  }

  resetInput();

  return function addRow(playerId, restore = false) {
    const guess = getPlayer(playerId);
    if (!guess) return;

    const content = setContent(guess);

    if (!restore) {
        game.guesses.push(playerId);
        updateState(playerId);
    } else {
        game.guesses.push(playerId);
    }

    resetInput();
    showContent(content, guess);

    if(playerId == game.solution.id) {
        if(!restore) {
            updateStats(game.guesses.length);
        }
        success();
    }
    else if(game.guesses.length === 8) {
        if(!restore) {
            updateStats(9);
        }
        gameOver();
    }
}

};

export { setupRows };
