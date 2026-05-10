(function () {
  "use strict";

  const quizRoot = document.getElementById("taxonomy-quiz");

  if (!quizRoot) {
    return;
  }

  const questions = [
    {
      type: "images",
      question: "Possédez-vous une colonne vertébrale ou une carapace externe ?",
      options: [
        {
          label: "Colonne vertébrale",
          image: "../images/humain-singes/colonne-vertebrale.png",
          correct: true
        },
        {
          label: "Carapace externe",
          image: "../images/humain-singes/carapace-externe.png",
          correct: false
        }
      ]
    },
    {
      type: "yesno",
      question: "Les femelles de votre espèce produisent-elles du lait ?",
      image: "../images/humain-singes/lait.png",
      options: [
        {
          label: "Oui",
          correct: true
        },
        {
          label: "Non",
          correct: false
        }
      ]
    },
    {
      type: "images",
      question: "Possédez-vous un pouce opposable ou est-il aligné comme les autres doigts ?",
      options: [
        {
          label: "Pouce opposable",
          image: "../images/humain-singes/pouce-opposable.png",
          correct: true
        },
        {
          label: "Pouce aligné",
          image: "../images/humain-singes/pouce-aligne.png",
          correct: false
        }
      ]
    },
    {
      type: "images",
      question: "Votre nez est-il sec ou humide ?",
      options: [
        {
          label: "Nez sec",
          image: "../images/humain-singes/nez-sec.png",
          correct: true
        },
        {
          label: "Nez humide",
          image: "../images/humain-singes/nez-humide.png",
          correct: false
        }
      ]
    },
    {
      type: "images",
      question: "Possédez-vous des ongles plats ou des griffes ?",
      options: [
        {
          label: "Ongles plats",
          image: "../images/humain-singes/ongles-plats.png",
          correct: true
        },
        {
          label: "Griffes",
          image: "../images/humain-singes/griffes.png",
          correct: false
        }
      ]
    },
    {
      type: "images",
      question: "Vos orbites sont-elles ouvertes ou complètement fermées par l’os ?",
      options: [
        {
          label: "Orbites fermées par l’os",
          image: "../images/humain-singes/orbite-fermee.png",
          correct: true
        },
        {
          label: "Orbites ouvertes",
          image: "../images/humain-singes/orbite-ouverte.png",
          correct: false
        }
      ]
    },
    {
  question: "Votre mâchoire inférieure est-elle fusionnée ou séparée en plusieurs parties ?",
  answers: [
    {
      text: "Fusionnée",
      image: "machoire-fusion.png",
      correct: true
    },
    {
      text: "Séparée en plusieurs parties",
      image: "machoire-separation.png",
      correct: false
    }
  ]
},
    {
      type: "images",
      question: "Votre mâchoire inférieure est-elle fusionnée ou séparée en plusieurs parties ?",
      options: [
        {
          label: "Fusionnée",
          image: "../images/humain-singes/machoire-fusion.png",
          correct: true
        },
        {
          label: "Séparée en plusieurs parties",
          image: "../images/humain-singes/machoire-separation.png",
          correct: false
        }
      ]
    },
    {
      type: "images",
      question: "Vos yeux sont-ils orientés vers l’avant ou sur les côtés ?",
      options: [
        {
          label: "Vers l’avant",
          image: "../images/humain-singes/yeux-face.png",
          correct: true
        },
        {
          label: "Sur les côtés",
          image: "../images/humain-singes/yeux-cote.png",
          correct: false
        }
      ]
    }
  ];

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

      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
      </div>

      <h3 class="trait-question">${question.question}</h3>

      <div class="trait-options">
        ${question.options.map(function (option, index) {
          return `
            <button class="trait-option" data-option-index="${index}">
              <img src="${option.image}" alt="${option.label}">
              <span class="option-label">${option.label}</span>
            </button>
          `;
        }).join("")}
      </div>
    `;

    quizRoot.querySelectorAll(".trait-option").forEach(function (button) {
      button.addEventListener("click", function () {
        chooseAnswer(button, question);
      });
    });
  }

  function renderYesNoQuestion(question, progress) {
    quizRoot.innerHTML = `
      <div class="quiz-counter">Question ${currentQuestion + 1} / ${questions.length}</div>

      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
      </div>

      <h3 class="trait-question">${question.question}</h3>

      <div class="yesno-layout">
        <img class="yesno-image" src="${question.image}" alt="Production de lait">

        <div class="yesno-buttons">
          ${question.options.map(function (option, index) {
            return `
              <button class="yesno-button" data-option-index="${index}">
                ${option.label}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;

    quizRoot.querySelectorAll(".yesno-button").forEach(function (button) {
      button.addEventListener("click", function () {
        chooseAnswer(button, question);
      });
    });
  }

  function chooseAnswer(button, question) {
    if (locked) {
      return;
    }

    locked = true;

    const optionIndex = Number(button.dataset.optionIndex);
    const selectedOption = question.options[optionIndex];

    if (selectedOption.correct) {
      score++;
      button.classList.add("correct");
    } else {
      button.classList.add("wrong");
    }

    setTimeout(function () {
      currentQuestion++;

      if (currentQuestion >= questions.length) {
        renderResult();
      } else {
        renderQuestion();
      }
    }, 350);
  }

  function renderResult() {
    quizRoot.innerHTML = `
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width: 100%"></div>
      </div>

      <div class="quiz-result">
        <h3>Félicitations !</h3>

        <img
          class="quiz-result-image"
          src="../images/humain-singes/felicitations-singe.png"
          alt="Félicitations"
        >

        <p class="quiz-result-highlight">
          Tu fais partie du grand groupe des singes, et tu partages ces caractères anatomiques avec les 300 autres espèces de singes !
        </p>

        <div class="classification-chain">
          <span>Colonne vertébrale</span>
          <span>Production de lait</span>
          <span>Pouce opposable</span>
          <span>Nez sec</span>
          <span>Ongles plats</span>
          <span>Orbites fermées</span>
          <span>Mâchoire fusionnée</span>
          <span>Yeux vers l’avant</span>
        </div>

        <button class="quiz-restart" id="quiz-restart">
          Recommencer le quiz
        </button>
      </div>
    `;

    document.getElementById("quiz-restart").addEventListener("click", function () {
      currentQuestion = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
})();
