(function () {
  "use strict";

  const chart = document.querySelector(".human-bush-chart");
  const info = document.getElementById("human-bush-info");
  const filters = document.querySelectorAll(".human-filter");
  const speciesButtons = document.querySelectorAll(".human-species");

  if (!chart || !info || !speciesButtons.length) return;

  function updateInfo(button) {
    const name = button.dataset.name || "";
    const period = button.dataset.period || "";
    const desc = button.dataset.desc || "";
    const skull = button.dataset.skull || "";
    const fossils = button.dataset.fossils || "";
    const skullMarkup = skull
      ? `<figure class="info-skull"><img src="${skull}" alt="Crâne fossile : ${name}" /></figure>`
      : "";
    const fossilsMarkup = fossils
      ? `<p class="info-fossils"><strong>Spécimens fossiles catalogués :</strong> ${fossils}</p>`
      : "";

    info.innerHTML = `
      <div class="info-kicker">Espèce sélectionnée</div>
      <h3>${name}</h3>
      ${skullMarkup}
      <p class="info-period">${period}</p>
      ${fossilsMarkup}
      <p>${desc}</p>
      <div class="human-bush-note">
        Les barres indiquent des périodes d'existence approximatives : plusieurs lignées peuvent se chevaucher.
      </div>
    `;

    speciesButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  }

  function applyFilter(filter) {
    speciesButtons.forEach(button => {
      const group = button.dataset.group;
      const coexist = button.dataset.coexist === "true";
      const visible =
        filter === "all" ||
        filter === group ||
        (filter === "coexist" && coexist);

      button.classList.toggle("dimmed", !visible);
    });

    filters.forEach(button => {
      button.classList.toggle("active", button.dataset.humanFilter === filter);
    });
  }

  speciesButtons.forEach(button => {
    button.addEventListener("click", () => updateInfo(button));
  });

  filters.forEach(button => {
    button.addEventListener("click", () => applyFilter(button.dataset.humanFilter));
  });
})();
