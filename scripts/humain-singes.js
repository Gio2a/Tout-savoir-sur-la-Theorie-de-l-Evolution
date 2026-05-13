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
        tooltip: "Singes : Cavités oculaires entièrement entourées d’os, protégeant mieux les yeux."
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

    const branchSection = document.querySelector('.evolution-branching-slide');
    const branchButton = document.getElementById('start-branch-animation');

    if (branchSection && branchButton) {
      const paths = branchSection.querySelectorAll('.branching-path');
      const revealedElements = branchSection.querySelectorAll('.branching-node, .branching-label, .ancestor-node, .extinct-marker');
      const explanationCards = branchSection.querySelectorAll('.branching-explanation');
      const conclusion = branchSection.querySelector('.branching-conclusion');
      const animationSteps = [1, 2, 3, 4, 5];
      let branchAnimationTimers = [];

      paths.forEach(path => {
        const length = path.getTotalLength();
        const hiddenLength = length + 24;
        path.style.strokeDasharray = hiddenLength;
        path.style.strokeDashoffset = hiddenLength;
      });

      function scheduleBranchAnimation(callback, delay) {
        const timer = setTimeout(callback, delay);
        branchAnimationTimers.push(timer);
      }

      function highlightExplanation(name) {
        const card = branchSection.querySelector(`[data-explanation="${name}"]`);
        if (!card) return;

        explanationCards.forEach(el => el.classList.remove('is-active'));
        card.classList.add('is-visible', 'is-active');

        scheduleBranchAnimation(() => {
          card.classList.remove('is-active');
        }, 1900);
      }

      branchButton.addEventListener('click', () => {
        branchAnimationTimers.forEach(timer => clearTimeout(timer));
        branchAnimationTimers = [];
        paths.forEach(path => path.classList.remove('visible'));
        revealedElements.forEach(el => el.classList.remove('visible'));
        explanationCards.forEach(el => el.classList.remove('is-visible', 'is-active'));
        if (conclusion) conclusion.classList.remove('is-visible');
        branchButton.textContent = "Rejouer";

        void branchSection.offsetWidth;

        animationSteps.forEach((step, index) => {
          scheduleBranchAnimation(() => {
            branchSection.querySelectorAll(`[data-step="${step}"]`).forEach(el => {
              el.classList.add('visible');
            });
          }, 100 + index * 1450);
        });

        scheduleBranchAnimation(() => highlightExplanation('ancestor'), 1650);
        scheduleBranchAnimation(() => highlightExplanation('diversification'), 3100);
        scheduleBranchAnimation(() => highlightExplanation('extinction'), 4550);
        scheduleBranchAnimation(() => {
          if (conclusion) conclusion.classList.add('is-visible');
        }, 8200);
      });
    }

    const missingLinkSection = document.querySelector('.missing-link-slide');
    const missingLinkButton = document.getElementById('start-missing-link-animation');

    if (missingLinkSection && missingLinkButton) {
      const stage = missingLinkSection.querySelector('.missing-link-stage');
      const question = missingLinkSection.querySelector('.missing-link-question');
      const caption = missingLinkSection.querySelector('.missing-link-caption');
      const missingConclusion = missingLinkSection.querySelector('.missing-link-conclusion');
      const foundNodes = missingLinkSection.querySelectorAll('.missing-link-node.found');
      let currentMissingLinkStep = 0;

      const missingLinkSteps = [
        {
          reveal: '2',
          text: 'On trouve C : l’intervalle A-B est mieux documenté.',
          button: 'Chercher le nouveau chaînon manquant'
        },
        {
          questionX: '32%',
          focusLeft: '8%',
          focusWidth: '48%',
          moves: [{ step: '2', x: '56%' }],
          text: 'Nouvelle objection : il manque maintenant un intermédiaire entre A et C.',
          button: 'Trouver D'
        },
        {
          reveal: '4',
          text: 'On trouve D : l’intervalle A-C est à son tour réduit.',
          button: 'Chercher encore'
        },
        {
          questionX: '21%',
          focusLeft: '8%',
          focusWidth: '26%',
          moves: [{ step: '4', x: '34%' }],
          text: 'Même logique : il manquerait désormais un intermédiaire entre A et D.',
          button: 'Trouver E'
        },
        {
          reveal: '6',
          text: 'On trouve E... et on pourrait recommencer encore.',
          button: 'Voir la conclusion'
        },
        {
          questionX: '15%',
          focusLeft: '8%',
          focusWidth: '14%',
          moves: [{ step: '6', x: '22%' }],
          text: 'Le “chaînon manquant” se déplace toujours vers un intervalle plus petit : ce n’est pas une vraie objection.',
          conclusion: true,
          button: 'Recommencer'
        }
      ];

      function setMissingFocus(left, width) {
        if (!stage) return;
        stage.style.setProperty('--focus-left', left);
        stage.style.setProperty('--focus-width', width);
      }

      function resetMissingLinkAnimation() {
        currentMissingLinkStep = 0;
        foundNodes.forEach(node => node.classList.remove('visible'));
        const resetPositions = { 2: '50%', 4: '32%', 6: '21%' };
        Object.entries(resetPositions).forEach(([step, x]) => {
          const node = missingLinkSection.querySelector(`[data-link-step="${step}"]`);
          if (node) node.style.setProperty('--x', x);
        });
        if (missingConclusion) missingConclusion.classList.remove('visible');
        if (question) {
          question.classList.add('visible');
          question.style.setProperty('--x', '50%');
        }
        if (caption) caption.textContent = 'On cherche un “chaînon manquant” entre A et B.';
        setMissingFocus('8%', '84%');
        missingLinkButton.textContent = 'Trouver le chaînon manquant';
      }

      function renderMissingLinkStep(step) {
        if (step.moves) {
          step.moves.forEach(move => {
            const node = missingLinkSection.querySelector(`[data-link-step="${move.step}"]`);
            if (node) node.style.setProperty('--x', move.x);
          });
        }
        if (step.questionX && question) {
          question.classList.add('visible');
          question.style.setProperty('--x', step.questionX);
        }
        if (step.focusLeft && step.focusWidth) setMissingFocus(step.focusLeft, step.focusWidth);
        if (step.reveal) {
          const node = missingLinkSection.querySelector(`[data-link-step="${step.reveal}"]`);
          if (node) node.classList.add('visible');
          if (question) question.classList.remove('visible');
        }
        if (caption) caption.textContent = step.text;
        if (step.conclusion && missingConclusion) missingConclusion.classList.add('visible');
        missingLinkButton.textContent = step.button;
      }

      missingLinkButton.addEventListener('click', () => {
        if (currentMissingLinkStep >= missingLinkSteps.length) {
          resetMissingLinkAnimation();
          return;
        }

        renderMissingLinkStep(missingLinkSteps[currentMissingLinkStep]);
        currentMissingLinkStep++;
      });
    }
  }


})();
