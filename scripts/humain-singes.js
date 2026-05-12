(function () {
  "use strict";

  /* ============================================
     1. MOTEUR DU QUIZ (TES QUESTIONS & LOGIQUE)
     ============================================ */
  const quizRoot = document.getElementById("taxonomy-quiz");

  if (!quizRoot) {
    // Si on n'est pas sur la page du quiz, on ne bloque pas le reste du script
  } else {
    const questions = [
      {
        type: "images",
        question: "Possédez-vous une colonne vertébrale ou une carapace externe ?",
        options: [
          { label: "Colonne vertébrale", image: "../images/humain-singes/colonne-vertebrale.png", correct: true },
          { label: "Carapace externe", image: "../images/humain-singes/carapace-externe.png", correct: false }
        ]
      },
      {
        type: "yesno",
        question: "Les femelles de votre espèce produisent-elles du lait ?",
        image: "../images/humain-singes/lait.png",
        options: [
          { label: "Oui", correct: true },
          { label: "Non", correct: false }
        ]
      },
      {
        type: "images",
        question: "Possédez-vous un pouce opposable ou est-il aligné comme les autres doigts ?",
        options: [
          { label: "Pouce opposable", image: "../images/humain-singes/pouce-opposable.png", correct: true },
          { label: "Pouce aligné", image: "../images/humain-singes/pouce-aligne.png", correct: false }
        ]
      },
      {
        type: "images",
        question: "Vos yeux sont-ils orientés vers l’avant ou sur les côtés ?",
        options: [
          { label: "Vers l’avant", image: "../images/humain-singes/yeux-face.png", correct: true },
          { label: "Sur les côtés", image: "../images/humain-singes/yeux-cote.png", correct: false }
        ]
      },
      {
        type: "images",
        question: "Possédez-vous des ongles plats ou des griffes ?",
        options: [
          { label: "Ongles plats", image: "../images/humain-singes/ongles-plats.png", correct: true },
          { label: "Griffes", image: "../images/humain-singes/griffes.png", correct: false }
        ]
      },
      {
        type: "images",
        question: "Votre nez est-il sec ou humide ?",
        options: [
          { label: "Nez sec", image: "../images/humain-singes/nez-sec.png", correct: true },
          { label: "Nez humide", image: "../images/humain-singes/nez-humide.png", correct: false }
        ]
      },
      {
        type: "images",
        question: "Possédez-vous des orbites ouvertes ou complètement fermées par l’os ?",
        options: [
          { label: "Orbites fermées par l’os", image: "../images/humain-singes/orbite-fermee.png", correct: true },
          { label: "Orbites ouvertes", image: "../images/humain-singes/orbite-ouverte.png", correct: false }
        ]
      },
      {
        type: "images",
        question: "Votre mâchoire inférieure est-elle fusionnée ou séparée en plusieurs parties ?",
        options: [
          { label: "Fusionnée", image: "../images/humain-singes/machoire-fusion.png", correct: true },
          { label: "Séparée en plusieurs parties", image: "../images/humain-singes/machoire-separation.png", correct: false }
        ]
      }
    ];

    const traitDescriptions = {
      "Colonne vertébrale": {
        label: "Colonne vertébrale",
        tooltip: "Vertébrés : Structure osseuse ou cartilagineuse qui soutient le corps et protège la moelle épinière."
      },
      "Oui": {
        label: "Production de lait",
        tooltip: "Mammifères : Capacité des femelles à produire du lait grâce aux glandes mammaires pour nourrir les petits."
      },
      "Pouce opposable": {
        label: "Pouce opposable",
        tooltip: "Primates : Pouce capable de se placer face aux autres doigts, permettant une meilleure préhension des objets."
      },
      "Vers l’avant": {
        label: "Vision vers l’avant",
        tooltip: "Primates : Yeux orientés vers l’avant offrant une vision binoculaire et une meilleure perception des distances."
      },
      "Ongles plats": {
        label: "Ongles plats",
        tooltip: "Singes : Ongles remplaçant les griffes, facilitant la manipulation fine et la sensibilité tactile."
      },
      "Nez sec": {
        label: "Nez sec",
        tooltip: "Haplorhiniens : Absence de truffe humide, caractéristique de ce sous-groupe des primates comprenant les singes, dont les humains."
      },
      "Orbites fermées par l’os": {
        label: "Orbites fermées par l’os",
        tooltip: "Primates : Cavités oculaires entièrement entourées d’os, protégeant mieux les yeux."
      },
      "Fusionnée": {
        label: "Mâchoire fusionnée",
        tooltip: "Singes : Les deux parties de la mâchoire inférieure sont fusionnées en un seul os solide, renforçant la mâchoire."
      }
    };

    let currentQuestion = 0;
    let score = 0;
    let locked = false;

    function renderQuestion() {
      const question = questions[currentQuestion];
      const progress = Math.round((currentQuestion / questions.length) * 100);
      locked = false;

      if (question.type === "yesno") {
        renderYesNoQuestion(question, progress);
      } else {
        renderImageQuestion(question, progress);
      }
    }

    function renderImageQuestion(question, progress) {
      quizRoot.innerHTML = `
        <div class="quiz-counter">Question ${currentQuestion + 1} / ${questions.length}</div>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width: ${progress}%"></div></div>
        <h3 class="trait-question">${question.question}</h3>
        <div class="trait-options">
          ${question.options.map((option, index) => `
            <button class="trait-option" data-option-index="${index}">
              <img src="${option.image}" alt="${option.label}">
              <span class="option-label">${option.label}</span>
            </button>
          `).join("")}
        </div>
      `;
      quizRoot.querySelectorAll(".trait-option").forEach(btn => {
        btn.addEventListener("click", () => chooseAnswer(btn, question));
      });
    }

    function renderYesNoQuestion(question, progress) {
      quizRoot.innerHTML = `
        <div class="quiz-counter">Question ${currentQuestion + 1} / ${questions.length}</div>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width: ${progress}%"></div></div>
        <h3 class="trait-question">${question.question}</h3>
        <div class="yesno-layout">
          <img class="yesno-image" src="${question.image}" alt="Question">
          <div class="yesno-buttons">
            ${question.options.map((option, index) => `
              <button class="yesno-button" data-option-index="${index}">${option.label}</button>
            `).join("")}
          </div>
        </div>
      `;
      quizRoot.querySelectorAll(".yesno-button").forEach(btn => {
        btn.addEventListener("click", () => chooseAnswer(btn, question));
      });
    }

    function chooseAnswer(button, question) {
      if (locked) return;
      locked = true;
      const optionIndex = Number(button.dataset.optionIndex);
      const selectedOption = question.options[optionIndex];

      if (selectedOption.correct) {
        score++;
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");
      }

      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion >= questions.length) renderResult();
        else renderQuestion();
      }, 350);
    }

    function renderResult() {
      const traitsHTML = questions.map(question => {
        const correctOption = question.options.find(opt => opt.correct);
        if (!correctOption) return "";
        const metadata = traitDescriptions[correctOption.label] || {
          label: correctOption.label,
          tooltip: ""
        };
        return `
          <span class="trait-info">
            ${metadata.label}
            <span class="trait-tooltip">${metadata.tooltip}</span>
          </span>
        `;
      }).join("");

      quizRoot.innerHTML = `
        <div class="quiz-result">
          <h3>Félicitations !</h3>
          <img class="quiz-result-image" src="../images/humain-singes/felicitations-singe.png" alt="Félicitations">
          <p class="quiz-result-highlight">Tu es un singe, comme les 300 autres espèces avec lesquelles tu partages ces caractères.</p>
          <div class="classification-chain">
             ${traitsHTML}
          </div>
          <button class="quiz-restart" id="quiz-restart">Recommencer le quiz</button>
        </div>
      `;
      document.getElementById("quiz-restart").addEventListener("click", () => {
        currentQuestion = 0; score = 0; renderQuestion();
      });
    }

    renderQuestion();
  }

  /* ============================================
     2. NOUVELLE ANIMATION ARBRE ÉVOLUTIF
     ============================================ */
  const treeSection = document.querySelector(".evolution-tree-slide");
  const treeButton = document.getElementById("start-tree-btn");

  if (treeSection && treeButton) {
    const branches = treeSection.querySelectorAll('.branch');
    const nodes = treeSection.querySelectorAll('.node, .node-small');

    // INITIALISATION : Mesurer les traits pour le tracé CSS
    branches.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    treeButton.addEventListener("click", () => {
      // 1. Reset complet
      treeSection.classList.remove("tree-active");
      branches.forEach(b => b.classList.remove('visible'));
      nodes.forEach(n => n.classList.remove('visible'));

      // Force le recalcul pour relancer l'anim
      void treeSection.offsetWidth;

      // 2. Déclenchement séquentiel
      treeSection.classList.add("tree-active");

      // Étape A : Le tronc (immédiat)
      const trunk = treeSection.querySelector('.trunk');
      if (trunk) trunk.classList.add('visible');

      // Étape B : Branches principales (après 1s)
      setTimeout(() => {
        const mains = ['.top-main', '.middle-main', '.bottom-main'];
        mains.forEach(cls => {
          const el = treeSection.querySelector(cls);
          if (el) el.classList.add('visible');
        });
      }, 1000);

      // Étape C : Toutes les ramifications (après 2s)
      setTimeout(() => {
        branches.forEach(b => b.classList.add('visible'));
      }, 2000);

      // Étape D : Apparition des lettres et points (après 3.5s)
      setTimeout(() => {
        nodes.forEach(n => n.classList.add('visible'));
      }, 3500);
    });
  }

})();
