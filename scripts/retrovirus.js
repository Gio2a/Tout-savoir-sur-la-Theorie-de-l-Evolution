(function () {
  "use strict";

  const ervTexts = {
    infection: {
      title: "1. Infection",
      text: "Un rétrovirus infecte une cellule. Son fonctionnement particulier lui permet de transformer son information génétique et de l'intégrer dans l'ADN de la cellule."
    },

    insertion: {
      title: "2. Insertion dans l'ADN",
      text: "Le fragment viral s'insère dans le génome. Cette insertion peut se produire à énormément de positions possibles : c'est pour cela que la position exacte est importante."
    },

    heritage: {
      title: "3. Héritage",
      text: "Si l'insertion touche une cellule reproductrice, elle peut être transmise aux descendants. Elle devient alors une trace héritée, présente dans toute la lignée."
    }
  };

  const infoBox = document.getElementById("erv-info");
  const buttons = document.querySelectorAll("[data-erv-step]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const stepName = button.dataset.ervStep;
      const step = ervTexts[stepName];

      if (!step || !infoBox) {
        return;
      }

      buttons.forEach(function (otherButton) {
        otherButton.classList.remove("active");
      });

      button.classList.add("active");

      infoBox.innerHTML = "<strong>" + step.title + "</strong><br />" + step.text;
    });
  });

  console.log("Chapitre rétrovirus chargé.");
})();
