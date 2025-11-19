// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
// .... initState ....

import { initState } from "./stats.js";

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
import { stringToHTML } from "./fragments.js";
import { higher, lower } from "./fragments.js"


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
      const gaur = new Date();
      const jaiotzeData = new Date(dateString);
      let age = gaur.getFullYear() - jaiotzeData.getFullYear();

      const urteakBeteAurten =
        gaur.getMonth() > jaiotzeData.getMonth() ||
        (gaur.getMonth() === jaiotzeData.getMonth() &&
          gaur.getDate() >= jaiotzeData.getDate());

      if (!urteakBeteAurten) {
        age--;
      }

      return age;
    }

    
    let check = function (theKey, theValue) {
      const mystery = game.solution;

      if (theKey === "birthdate") {
        const guessAge = getAge(theValue);
        const mysteryAge = getAge(mystery.birthdate);

        if (guessAge === mysteryAge) return "correct";
        if (guessAge < mysteryAge) return "lower";
        return "higher";
      }

      if (mystery.hasOwnProperty(theKey)) {
        return mystery[theKey] === theValue ? "correct" : "incorrect";
      }

      return "incorrect";
    };

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }


    function setContent(guess) {

      const ageCheck = check("birthdate", guess.birthdate);

      // Por defecto mostramos solo el número
      let ageDisplay = `${getAge(guess.birthdate)}`;
      
      if (ageCheck === "lower") {
        ageDisplay += ` ${higher}`
      } else if (ageCheck === "higher") {
        ageDisplay += ` ${lower}`
      }

      return [
          `<img src="https://playfootball.games/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
          `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
          `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
          `${guess.position}`,
          `${ageDisplay}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }
    function resetInput(){
        const input = document.getElementById("myInput");
        input.value = "";
        const unekoSaiakera = game.guesses.length + 1;
        if (unekoSaiakera < 9){
            input.placeholder = `Guess ${unekoSaiakera} of 8`;
        }

    }
    
    let getPlayer = function (playerId) {
    
    const player = game.players.find(p => p.id === playerId);

    if (!player) {
        console.error(`Ez da jokalaria aurkitu ID honekin: ${playerId}`);
        return null;
    }

    return player;
};

    function gameEnded(lastGuess){
        if (lastGuess == game.solution.id){
            return true;
        }
        if (game.guesses.length >= 8){
            return true;
        }
        return false;
    }
        function success(){
        unblur('success');
    }

    function gameOver(){
        unblur('gameover');
    }

    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            if (playerId == game.solution.id) {
                success();
            }
            if (game.guesses.length == 8) {
                gameOver();
            }
         }


        showContent(content, guess)
    }
}

export {setupRows}
