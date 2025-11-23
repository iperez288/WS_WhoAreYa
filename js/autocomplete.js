import { setupRows } from "./rows.js";
import { match } from "./match.js";
import { parse } from "./parse.js";

export { autocomplete };

function autocomplete(inp, game) {
  let addRow = setupRows(game);
  let players = game.players;
  let currentFocus;

  inp.addEventListener("input", function () {
    let a, b, i, val = this.value.trim();
    closeAllLists();
    if (!val) return false;

    currentFocus = -2;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);

    for (i = 0; i < players.length; i++) {
      const matchResult = match(val, players[i].name);
      if (matchResult) {
        b = document.createElement("DIV");
        b.classList.add("flex", "items-start", "gap-x-3", "leading-tight", "uppercase", "text-sm");

        b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${players[i].teamId % 32}/${players[i].teamId}.png" width="28" height="28">`;

        const parts = parse(players[i].name, matchResult);
        b.innerHTML += `<div class='self-center'>` +
          parts.map(p => p.highlight ? `<span class='font-bold'>${p.text}</span>` : `<span>${p.text}</span>`).join('') +
          `<input type='hidden' name='name' value='${players[i].name}'>
           <input type='hidden' name='id' value='${players[i].id}'>
        </div>`;

        b.addEventListener("click", function () {
          inp.value = this.querySelector("input[name='name']").value;
          closeAllLists();
          const selectedPlayer = players.find(p => p.name === inp.value);
          addRow(selectedPlayer.id);
          inp.value = '';
        });

        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus += 2;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus -= 2;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1 && x) x[currentFocus].click();
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
    }
  }

  function closeAllLists(elmnt) {
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}