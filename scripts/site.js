(function () {
  "use strict";

  /* =========================
     THEME CLAIR / SOMBRE
     ========================= */

  const THEME_KEY = "evolution-theme";
  const themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    if (themeBtn) {
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"
      );
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  /* =========================
     MENU DES CHAPITRES
     ========================= */

  const navBtn = document.getElementById("nav-toggle");
  const navPanel = document.getElementById("chapter-nav");
  const navOverlay = document.getElementById("nav-overlay");

  function openNav() {
    if (navPanel) navPanel.classList.add("open");
    if (navOverlay) navOverlay.classList.add("open");
  }

  function closeNav() {
    if (navPanel) navPanel.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
  }

  if (navBtn && navPanel) {
    navBtn.addEventListener("click", function () {
      if (navPanel.classList.contains("open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeNav);
  }

  document.querySelectorAll(".chapter-nav li").forEach(function (item) {
    item.addEventListener("click", function () {
      const target = item.dataset.target;
      const page = item.dataset.page;

      if (page) {
        window.location.href = page;
        return;
      }

      if (target) {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      closeNav();
    });
  });

  /* =========================
     APPARITION AU SCROLL
     ========================= */

  const slides = document.querySelectorAll(".slide");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  slides.forEach(function (slide) {
    observer.observe(slide);
  });

  /* =========================
     BARRE DE PROGRESSION
     ========================= */

  const progressBar = document.getElementById("progress-bar");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = percent + "%";
    }
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* =========================
     NAVIGATION CLAVIER
     ========================= */

  function navigateSlide(direction) {
    const allSlides = Array.from(document.querySelectorAll(".slide"));
    const scrollY = window.scrollY + 100;
    let currentIndex = 0;

    for (let i = 0; i < allSlides.length; i++) {
      if (allSlides[i].offsetTop <= scrollY) {
        currentIndex = i;
      }
    }

    const nextIndex = Math.max(
      0,
      Math.min(allSlides.length - 1, currentIndex + direction)
    );

    allSlides[nextIndex].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  document.addEventListener("keydown", function (event) {
    const tag = event.target.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      navigateSlide(1);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      navigateSlide(-1);
    }

    if (event.key === "Escape") {
      closeNav();
    }

    if (event.key === "m" || event.key === "M") {
      if (navPanel && navPanel.classList.contains("open")) {
        closeNav();
      } else {
        openNav();
      }
    }

    if (event.key === "t" || event.key === "T") {
      if (themeBtn) {
        themeBtn.click();
      }
    }
  });

  document.querySelectorAll("[data-scroll-to]").forEach(function (button) {
    button.addEventListener("click", function () {
      const target = button.dataset.scrollTo;
      const element = document.getElementById(target);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* =========================
     QUIZ
     ========================= */

  document.querySelectorAll(".quiz").forEach(function (quiz) {
    const options = quiz.querySelectorAll(".quiz-option");
    const feedback = quiz.querySelector(".quiz-feedback");
    const correctAnswer = quiz.dataset.correct;
    const explanation = quiz.dataset.explanation || "";

    options.forEach(function (option) {
      option.addEventListener("click", function () {
        const isCorrect = option.dataset.value === correctAnswer;

        options.forEach(function (otherOption) {
          otherOption.disabled = true;

          if (otherOption.dataset.value === correctAnswer) {
            otherOption.classList.add("correct");
          } else if (otherOption === option && !isCorrect) {
            otherOption.classList.add("wrong");
          }
        });

        if (feedback) {
          feedback.innerHTML =
            (isCorrect
              ? "<strong>✓ Bonne réponse.</strong> "
              : "<strong>✗ Pas tout à fait.</strong> ") + explanation;

          feedback.classList.add("show");
        }
      });
    });
  });

  /* =========================
     PAGE "CONVERGENCE DES PREUVES"
     ========================= */

  const convergenceDisciplines = {
    genetique: {
      kicker: "ADN et génomes",
      title: "Génétique",
      text:
        "Les génomes gardent des traces héritées : mutations partagées, ressemblances de séquences, pseudogènes et rétrovirus endogènes aux mêmes emplacements.",
      proof:
        "Des parentés mesurables entre espèces. Les arbres construits avec l'ADN rejoignent largement ceux obtenus avec l'anatomie et les fossiles."
    },
    paleontologie: {
      kicker: "Archives du vivant",
      title: "Paléontologie",
      text:
        "Les fossiles montrent des espèces disparues, des formes transitionnelles et un ordre d'apparition cohérent dans les couches géologiques.",
      proof:
        "Ils donnent une chronologie indépendante : certaines formes apparaissent avant d'autres, et les transitions attendues se retrouvent dans les bonnes périodes."
    },
    anatomie: {
      kicker: "Corps comparés",
      title: "Anatomie comparée",
      text:
        "Des structures homologues, comme les membres des vertébrés, partagent le même plan général malgré des fonctions différentes.",
      proof:
        "Ces ressemblances deviennent compréhensibles si les espèces héritent d'une architecture commune transformée au fil des lignées."
    },
    embryologie: {
      kicker: "Développement",
      title: "Embryologie",
      text:
        "Le développement des embryons révèle des étapes, des structures temporaires et des programmes génétiques partagés entre groupes apparentés.",
      proof:
        "Elle montre que des organismes très différents peuvent utiliser des plans de construction hérités d'ancêtres communs."
    },
    biogeographie: {
      kicker: "Répartition du vivant",
      title: "Biogéographie",
      text:
        "La distribution des espèces suit l'histoire des continents, des îles, des barrières géographiques et des migrations.",
      proof:
        "Les espèces insulaires ou continentales ne sont pas réparties au hasard : leur présence correspond souvent aux parentés et à l'histoire géologique."
    },
    phylogenie: {
      kicker: "Classification",
      title: "Systématique et phylogénie",
      text:
        "La classification moderne regroupe les espèces selon des caractères hérités et construit des arbres de parenté testables.",
      proof:
        "Quand les arbres issus de l'ADN, des fossiles et de l'anatomie se recoupent, l'hypothèse d'ancêtres communs devient beaucoup plus robuste."
    },
    populations: {
      kicker: "Fréquences d'allèles",
      title: "Génétique des populations",
      text:
        "Elle mesure comment les variants génétiques changent de fréquence dans les populations sous l'effet de la sélection, de la dérive, des migrations et des mutations.",
      proof:
        "C'est le pont entre hérédité et évolution : elle montre comment des mécanismes mesurables produisent des changements génération après génération."
    },
    geologie: {
      kicker: "Temps profond",
      title: "Géologie et datation",
      text:
        "La stratigraphie et la datation radiométrique replacent fossiles, extinctions et diversifications dans une chronologie indépendante.",
      proof:
        "Elles donnent le cadre temporel nécessaire : l'évolution du vivant s'inscrit dans une histoire longue, datable et cohérente avec les fossiles."
    }
  };

  document.querySelectorAll("[data-convergence-map]").forEach(function (map) {
    const nodes = Array.from(map.querySelectorAll("[data-convergence-discipline]"));
    const kicker = map.querySelector("[data-convergence-kicker]");
    const title = map.querySelector("[data-convergence-title]");
    const text = map.querySelector("[data-convergence-text]");
    const proof = map.querySelector("[data-convergence-proof]");

    function setConvergenceDiscipline(name) {
      const detail = convergenceDisciplines[name];

      if (!detail) return;

      map.dataset.activeDiscipline = name;

      nodes.forEach(function (node) {
        const isActive = node.dataset.convergenceDiscipline === name;
        node.classList.toggle("active", isActive);
        node.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (kicker) kicker.textContent = detail.kicker;
      if (title) title.textContent = detail.title;
      if (text) text.textContent = detail.text;
      if (proof) proof.textContent = detail.proof;
    }

    nodes.forEach(function (node) {
      const discipline = node.dataset.convergenceDiscipline;

      node.addEventListener("mouseenter", function () {
        setConvergenceDiscipline(discipline);
      });

      node.addEventListener("focus", function () {
        setConvergenceDiscipline(discipline);
      });

      node.addEventListener("click", function () {
        setConvergenceDiscipline(discipline);
      });
    });

    setConvergenceDiscipline("genetique");
  });

  /* =========================
     PAGE "MICRO / MACROÉVOLUTION"
     ========================= */

  function getMicroBoundaryFeedback(value) {
    const next = value + 1;

    if (value < 6) {
      return {
        title: "Donc presque tout deviendrait déjà “macro” ?",
        text:
          "Si la limite est placée si tôt, alors quelques petits changements suffiraient. Mais pourquoi ce seuil minuscule serait-il biologique ?",
        verdictTitle: "Frontière arbitraire",
        verdictText:
          "On ne voit toujours pas de mécanisme nouveau : seulement un petit changement de plus."
      };
    }

    if (value < 18) {
      return {
        title: "Pourquoi ici plutôt qu'un cran avant ?",
        text:
          "Si " +
          value +
          " changements restent de la microévolution, pourquoi le " +
          next +
          "e deviendrait-il soudain autre chose ?",
        verdictTitle: "Le seuil doit être justifié",
        verdictText:
          "Sans nombre précis, sans mécanisme nouveau et sans critère mesurable, la frontière reste une coupure verbale."
      };
    }

    if (value < 28) {
      return {
        title: "Tu acceptes déjà une longue accumulation",
        text:
          "Si une longue série de petits changements est acceptée, l'objection ne refuse plus le processus : elle refuse seulement le mot “macro”.",
        verdictTitle: "Même processus, autre échelle",
        verdictText:
          "La différence vient du recul avec lequel on regarde, pas d'une barrière naturelle."
      };
    }

    return {
      title: "La frontière disparaît presque",
      text:
        "Placée tout au bout, la limite revient à admettre l'accumulation entière avant de changer d'étiquette.",
      verdictTitle: "Conclusion",
      verdictText:
        "Micro et macro nomment des échelles d'observation. La nature, elle, ne trace pas cette ligne."
    };
  }

  function renderBoundarySteps(container, boundaryValue) {
    if (!container) return;

    container.innerHTML = "";

    for (let index = 1; index <= 30; index++) {
      const step = document.createElement("span");

      step.className = "micro-boundary-step" + (index <= boundaryValue ? " before" : " after");
      if (index === 1 || index === 10 || index === 20 || index === 30) {
        step.dataset.label = String(index);
      }

      container.appendChild(step);
    }
  }

  document.querySelectorAll("[data-micro-macro-lab]").forEach(function (lab) {
    const slider = lab.querySelector("[data-micro-boundary-slider]");
    const scale = lab.querySelector("[data-micro-boundary-scale]");
    const cursor = lab.querySelector("[data-micro-boundary-cursor]");
    const steps = lab.querySelector("[data-micro-boundary-steps]");
    const kicker = lab.querySelector("[data-micro-kicker]");
    const title = lab.querySelector("[data-micro-title]");
    const text = lab.querySelector("[data-micro-text]");
    const verdictTitle = lab.querySelector("[data-micro-verdict-title]");
    const verdictText = lab.querySelector("[data-micro-verdict-text]");

    if (!slider) return;

    function normalizeBoundary(value) {
      const min = Number(slider.min) || 1;
      const max = Number(slider.max) || 29;
      const numericValue = Math.round(Number(value));

      return Math.min(max, Math.max(min, numericValue));
    }

    function setBoundary(value) {
      const boundaryValue = normalizeBoundary(value);
      const min = Number(slider.min) || 1;
      const max = Number(slider.max) || 29;
      const position = ((boundaryValue - min) / (max - min)) * 100;
      const feedback = getMicroBoundaryFeedback(boundaryValue);
      const plural = boundaryValue > 1 ? "s" : "";

      slider.value = String(boundaryValue);
      lab.dataset.boundary = String(boundaryValue);

      if (cursor) cursor.style.setProperty("--boundary", position + "%");
      renderBoundarySteps(steps, boundaryValue);

      if (kicker) {
        kicker.textContent =
          "Frontière placée après " + boundaryValue + " changement" + plural;
      }
      if (title) title.textContent = feedback.title;
      if (text) text.textContent = feedback.text;
      if (verdictTitle) verdictTitle.textContent = feedback.verdictTitle;
      if (verdictText) verdictText.textContent = feedback.verdictText;
    }

    slider.addEventListener("input", function () {
      setBoundary(slider.value);
    });

    if (scale) {
      let isDraggingBoundary = false;

      function setBoundaryFromPointer(event) {
        const rect = scale.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
        const min = Number(slider.min) || 1;
        const max = Number(slider.max) || 29;
        const nextValue = Math.round(min + Math.min(1, Math.max(0, ratio)) * (max - min));

        setBoundary(nextValue);
      }

      scale.addEventListener("pointerdown", function (event) {
        isDraggingBoundary = true;
        scale.setPointerCapture(event.pointerId);
        setBoundaryFromPointer(event);
      });

      scale.addEventListener("pointermove", function (event) {
        if (isDraggingBoundary) setBoundaryFromPointer(event);
      });

      scale.addEventListener("pointerup", function () {
        isDraggingBoundary = false;
      });

      scale.addEventListener("pointercancel", function () {
        isDraggingBoundary = false;
      });
    }

    setBoundary(slider.value);
  });

  /* =========================
     PAGE "THÉORIE"
     ========================= */

  const theoryDetails = {
    observation: {
      label: "Niveau 1",
      title: "Observation",
      text:
        "On constate un fait mesurable. Une observation seule ne dit pas encore pourquoi ce fait existe.",
      example:
        "Exemple : on observe que certaines bactéries survivent à un antibiotique."
    },
    hypothese: {
      label: "Niveau 2",
      title: "Hypothèse",
      text:
        "On propose une explication possible. Elle doit pouvoir être testée par des observations ou des expériences.",
      example:
        "Exemple : ces bactéries possèdent peut-être une mutation qui les rend résistantes."
    },
    prediction: {
      label: "Niveau 3",
      title: "Prédictions",
      text:
        "Si l'explication est correcte, elle doit permettre d'anticiper ce qu'on devrait retrouver.",
      example:
        "Exemple : les descendantes de ces bactéries devraient aussi être plus souvent résistantes."
    },
    theorie: {
      label: "Niveau 4",
      title: "Théorie scientifique",
      text:
        "Quand un cadre explique beaucoup de faits, produit des prédictions et résiste aux tests, il devient une théorie scientifique.",
      example:
        "Exemple : la théorie de l'évolution explique mutations, sélection, parentés, fossiles et ADN dans un même cadre."
    }
  };

  document.querySelectorAll("[data-theory-ladder]").forEach(function (ladder) {
    const buttons = Array.from(ladder.querySelectorAll("[data-theory-step]"));
    const label = ladder.querySelector("[data-theory-label]");
    const title = ladder.querySelector("[data-theory-title]");
    const text = ladder.querySelector("[data-theory-text]");
    const example = ladder.querySelector("[data-theory-example]");

    function setTheoryStep(stepName) {
      const detail = theoryDetails[stepName];

      if (!detail) {
        return;
      }

      buttons.forEach(function (button) {
        const isActive = button.dataset.theoryStep === stepName;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (label) label.textContent = detail.label;
      if (title) title.textContent = detail.title;
      if (text) text.textContent = detail.text;
      if (example) example.textContent = detail.example;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setTheoryStep(button.dataset.theoryStep);
      });
    });
  });

  const mutationData = {
    substitution: {
      kind: "une base remplacée",
      before: "ATGGCATTCCGAAAT",
      after: "ATGGCATACCGAAAT",
      changed: [7],
      codons: [
        { before: "ATG", after: "ATG", aminoBefore: "Méthionine", aminoAfter: "Méthionine", shortBefore: "Met", shortAfter: "Met" },
        { before: "GCA", after: "GCA", aminoBefore: "Alanine", aminoAfter: "Alanine", shortBefore: "Ala", shortAfter: "Ala" },
        { before: "TTC", after: "TAC", aminoBefore: "Phénylalanine", aminoAfter: "Tyrosine", shortBefore: "Phe", shortAfter: "Tyr", changed: true },
        { before: "CGA", after: "CGA", aminoBefore: "Arginine", aminoAfter: "Arginine", shortBefore: "Arg", shortAfter: "Arg" },
        { before: "AAT", after: "AAT", aminoBefore: "Asparagine", aminoAfter: "Asparagine", shortBefore: "Asn", shortAfter: "Asn" }
      ],
      stages: {
        dna: {
          label: "Étape 1 / 4",
          title: "Une lettre d'ADN change",
          text:
            "Pendant la copie de l'ADN, une base peut être remplacée par une autre. Ici, un T devient A dans la séquence.",
          effectTitle: "Modification ponctuelle",
          effectText:
            "Une seule lettre suffit parfois à changer le mot génétique lu par la cellule."
        },
        codon: {
          label: "Étape 2 / 4",
          title: "Le codon est modifié",
          text:
            "L'ADN est lu par groupes de trois bases. Le codon TTC devient TAC : le message n'est plus exactement le même.",
          effectTitle: "Changement local",
          effectText:
            "La mutation touche un codon précis sans décaler toute la suite de la lecture."
        },
        protein: {
          label: "Étape 3 / 4",
          title: "Un acide aminé peut changer",
          text:
            "Le codon modifié peut demander un autre acide aminé. Ici, la phénylalanine est remplacée par une tyrosine.",
          effectTitle: "Protéine légèrement différente",
          effectText:
            "La protéine peut garder la même fonction, fonctionner moins bien, ou parfois fonctionner différemment."
        },
        effect: {
          label: "Étape 4 / 4",
          title: "L'effet dépend du contexte",
          text:
            "Une mutation n'est pas automatiquement bonne ou mauvaise. Son effet dépend de l'endroit touché et du milieu.",
          effectTitle: "Neutre, défavorable ou avantageuse",
          effectText:
            "Si elle aide à survivre ou à se reproduire dans un milieu donné, elle peut devenir plus fréquente par sélection naturelle."
        }
      }
    },
    insertion: {
      kind: "une base ajoutée",
      before: "ATGGCATTCCGAAAT",
      after: "ATGGCAAATTCCGAAAT",
      inserted: [6],
      changed: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      codons: [
        { before: "ATG", after: "ATG", aminoBefore: "Méthionine", aminoAfter: "Méthionine", shortBefore: "Met", shortAfter: "Met" },
        { before: "GCA", after: "GCA", aminoBefore: "Alanine", aminoAfter: "Alanine", shortBefore: "Ala", shortAfter: "Ala" },
        { before: "TTC", after: "AAT", aminoBefore: "Phénylalanine", aminoAfter: "Asparagine", shortBefore: "Phe", shortAfter: "Asn", changed: true },
        { before: "CGA", after: "TCC", aminoBefore: "Arginine", aminoAfter: "Sérine", shortBefore: "Arg", shortAfter: "Ser", changed: true },
        { before: "AAT", after: "GAA", aminoBefore: "Asparagine", aminoAfter: "Glutamate", shortBefore: "Asn", shortAfter: "Glu", changed: true }
      ],
      stages: {
        dna: {
          label: "Étape 1 / 4",
          title: "Une base s'ajoute",
          text:
            "Une insertion ajoute une base dans la séquence. Ici, un A supplémentaire apparaît au milieu du message.",
          effectTitle: "Ajout dans l'ADN",
          effectText:
            "La cellule lit toujours la séquence dans l'ordre, mais le point d'insertion change la suite."
        },
        codon: {
          label: "Étape 2 / 4",
          title: "Le cadre de lecture peut se décaler",
          text:
            "Comme les codons sont lus trois par trois, ajouter une seule base peut regrouper toutes les lettres suivantes autrement.",
          effectTitle: "Décalage possible",
          effectText:
            "Ce type de mutation peut modifier plusieurs codons après le point d'insertion."
        },
        protein: {
          label: "Étape 3 / 4",
          title: "La protéine peut beaucoup changer",
          text:
            "Quand plusieurs codons changent, plusieurs acides aminés peuvent être remplacés dans la chaîne produite.",
          effectTitle: "Effet souvent plus fort",
          effectText:
            "Une insertion peut perturber fortement une protéine si elle touche une zone importante du gène."
        },
        effect: {
          label: "Étape 4 / 4",
          title: "L'effet reste à tester",
          text:
            "Même une mutation impressionnante à l'écran n'a pas toujours un effet visible. Il faut regarder la protéine, la cellule et l'organisme.",
          effectTitle: "Conséquence variable",
          effectText:
            "Si elle se transmet, cette variation peut ensuite disparaître, rester rare, ou se répandre selon le hasard et la sélection."
        }
      }
    },
    deletion: {
      kind: "une base retirée",
      before: "ATGGCATTCCGAAAT",
      after: "ATGGCA-TCCGAAAT",
      deleted: [6],
      changed: [6, 7, 8, 9, 10, 11, 12, 13, 14],
      codons: [
        { before: "ATG", after: "ATG", aminoBefore: "Méthionine", aminoAfter: "Méthionine", shortBefore: "Met", shortAfter: "Met" },
        { before: "GCA", after: "GCA", aminoBefore: "Alanine", aminoAfter: "Alanine", shortBefore: "Ala", shortAfter: "Ala" },
        { before: "TTC", after: "TCC", aminoBefore: "Phénylalanine", aminoAfter: "Sérine", shortBefore: "Phe", shortAfter: "Ser", changed: true },
        { before: "CGA", after: "GAA", aminoBefore: "Arginine", aminoAfter: "Glutamate", shortBefore: "Arg", shortAfter: "Glu", changed: true },
        { before: "AAT", after: "AT", aminoBefore: "Asparagine", aminoAfter: "fragment incomplet", shortBefore: "Asn", shortAfter: "...", changed: true }
      ],
      stages: {
        dna: {
          label: "Étape 1 / 4",
          title: "Une base disparaît",
          text:
            "Une délétion retire une base de la séquence. Ici, une lettre manque dans le message génétique.",
          effectTitle: "Perte d'information",
          effectText:
            "La perte peut être minuscule, mais son emplacement compte énormément."
        },
        codon: {
          label: "Étape 2 / 4",
          title: "La suite peut être relue autrement",
          text:
            "Si une seule base est retirée, la lecture par paquets de trois peut être décalée après la délétion.",
          effectTitle: "Cadre de lecture modifié",
          effectText:
            "Plusieurs codons après la mutation peuvent alors prendre un autre sens."
        },
        protein: {
          label: "Étape 3 / 4",
          title: "La chaîne peut être raccourcie ou transformée",
          text:
            "La protéine obtenue peut contenir d'autres acides aminés, ou devenir incomplète si le message est interrompu.",
          effectTitle: "Protéine potentiellement altérée",
          effectText:
            "Certaines délétions n'ont presque pas d'effet ; d'autres empêchent une protéine de fonctionner."
        },
        effect: {
          label: "Étape 4 / 4",
          title: "L'évolution ne juge pas l'intention",
          text:
            "La mutation n'apparaît pas parce que l'organisme en a besoin. Elle apparaît, puis ses conséquences sont triées par transmission, hasard et sélection.",
          effectTitle: "Variation transmissible",
          effectText:
            "Pour compter dans l'évolution, elle doit être héritée et changer de fréquence dans une population."
        }
      }
    },
    silent: {
      kind: "une base changée sans changer l'acide aminé",
      before: "ATGGCATTCCGAAAT",
      after: "ATGGCATTTCGAAAT",
      changed: [8],
      codons: [
        { before: "ATG", after: "ATG", aminoBefore: "Méthionine", aminoAfter: "Méthionine", shortBefore: "Met", shortAfter: "Met" },
        { before: "GCA", after: "GCA", aminoBefore: "Alanine", aminoAfter: "Alanine", shortBefore: "Ala", shortAfter: "Ala" },
        { before: "TTC", after: "TTT", aminoBefore: "Phénylalanine", aminoAfter: "Phénylalanine", shortBefore: "Phe", shortAfter: "Phe", changed: true },
        { before: "CGA", after: "CGA", aminoBefore: "Arginine", aminoAfter: "Arginine", shortBefore: "Arg", shortAfter: "Arg" },
        { before: "AAT", after: "AAT", aminoBefore: "Asparagine", aminoAfter: "Asparagine", shortBefore: "Asn", shortAfter: "Asn" }
      ],
      stages: {
        dna: {
          label: "Étape 1 / 4",
          title: "La séquence change quand même",
          text:
            "Même si l'effet final est discret, l'ADN a bien changé : ici, le codon TTC devient TTT.",
          effectTitle: "Mutation réelle",
          effectText:
            "Silencieuse ne veut pas dire imaginaire : cela veut dire que la protéine codée ne change pas ici."
        },
        codon: {
          label: "Étape 2 / 4",
          title: "Deux codons peuvent avoir le même sens",
          text:
            "Le code génétique est redondant : plusieurs codons peuvent correspondre au même acide aminé.",
          effectTitle: "Même traduction",
          effectText:
            "TTC et TTT codent tous les deux la phénylalanine dans cet exemple."
        },
        protein: {
          label: "Étape 3 / 4",
          title: "La protéine reste identique",
          text:
            "La lettre d'ADN a changé, mais la chaîne d'acides aminés affichée reste la même.",
          effectTitle: "Effet souvent neutre",
          effectText:
            "Beaucoup de mutations sont neutres ou presque neutres pour l'organisme."
        },
        effect: {
          label: "Étape 4 / 4",
          title: "Neutre ne veut pas dire inutile pour les scientifiques",
          text:
            "Les mutations silencieuses peuvent servir de traces pour comparer des lignées et reconstruire des parentés.",
          effectTitle: "Trace génétique",
          effectText:
            "Une mutation neutre peut se transmettre sans être favorisée par la sélection naturelle."
        }
      }
    }
  };

  function createMutationBase(base, index, mutation) {
    const element = document.createElement("span");
    element.className = "mutation-base";
    element.textContent = base;

    if (mutation.changed && mutation.changed.indexOf(index) !== -1) {
      element.classList.add("changed");
    }

    if (mutation.inserted && mutation.inserted.indexOf(index) !== -1) {
      element.classList.add("inserted", "focus");
    }

    if (mutation.deleted && mutation.deleted.indexOf(index) !== -1) {
      element.classList.add("deleted", "focus");
    }

    if (!mutation.inserted && !mutation.deleted && mutation.changed && mutation.changed.indexOf(index) !== -1) {
      element.classList.add("focus");
    }

    return element;
  }

  function renderMutationSequence(container, sequence, mutation, mode) {
    if (!container) return;

    container.innerHTML = "";

    sequence.split("").forEach(function (base, index) {
      if (mode === "before") {
        const beforeBase = document.createElement("span");
        beforeBase.className = "mutation-base";
        beforeBase.textContent = base;

        if (mutation.changed && mutation.changed.indexOf(index) !== -1 && !mutation.inserted) {
          beforeBase.classList.add("changed", "focus");
        }

        container.appendChild(beforeBase);
        return;
      }

      container.appendChild(createMutationBase(base, index, mutation));
    });
  }

  function renderMutationCodons(container, mutation) {
    if (!container) return;

    container.innerHTML = "";

    mutation.codons.forEach(function (codon) {
      const isSameCodon = codon.before === codon.after;
      const element = document.createElement("div");
      element.className = "mutation-codon" + (codon.changed ? " changed" : "");
      element.innerHTML =
        "<div class=\"mutation-codon-change\"><b>" +
        codon.before +
        "</b><i>→</i><b>" +
        codon.after +
        "</b></div><span>" +
        (isSameCodon ? "même mot" : "mot changé") +
        "</span>";
      container.appendChild(element);
    });
  }

  function renderMutationProtein(container, mutation) {
    if (!container) return;

    container.innerHTML = "";

    mutation.codons.forEach(function (codon) {
      const isSameAcid = codon.shortBefore === codon.shortAfter;
      const plainLabel =
        codon.shortAfter === "..."
          ? "brique incomplète"
          : isSameAcid
            ? "même brique"
            : "brique modifiée";
      const element = document.createElement("div");
      element.className = "mutation-acid" + (codon.changed ? " changed" : "");
      element.innerHTML =
        "<b>" +
        codon.shortAfter +
        "</b><strong>" +
        plainLabel +
        "</strong><span>" +
        codon.shortBefore +
        " → " +
        codon.shortAfter +
        "</span>";
      container.appendChild(element);
    });
  }

  document.querySelectorAll("[data-genetic-mutation]").forEach(function (lab) {
    const typeButtons = Array.from(lab.querySelectorAll("[data-mutation-type]"));
    const stageButtons = Array.from(lab.querySelectorAll("[data-mutation-stage]"));
    const beforeSequence = lab.querySelector("[data-mutation-before]");
    const afterSequence = lab.querySelector("[data-mutation-after]");
    const mutationKind = lab.querySelector("[data-mutation-kind]");
    const codons = lab.querySelector("[data-mutation-codons]");
    const protein = lab.querySelector("[data-mutation-protein]");
    const stageLabel = lab.querySelector("[data-mutation-stage-label]");
    const title = lab.querySelector("[data-mutation-title]");
    const text = lab.querySelector("[data-mutation-text]");
    const effectTitle = lab.querySelector("[data-mutation-effect-title]");
    const effectText = lab.querySelector("[data-mutation-effect-text]");

    let currentType = "substitution";
    let currentStage = "dna";

    function updateMutationLab() {
      const mutation = mutationData[currentType];
      const stage = mutation && mutation.stages[currentStage];

      if (!mutation || !stage) return;

      lab.dataset.stage = currentStage;

      typeButtons.forEach(function (button) {
        const isActive = button.dataset.mutationType === currentType;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      stageButtons.forEach(function (button) {
        const isActive = button.dataset.mutationStage === currentStage;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      renderMutationSequence(beforeSequence, mutation.before, mutation, "before");
      renderMutationSequence(afterSequence, mutation.after, mutation, "after");
      renderMutationCodons(codons, mutation);
      renderMutationProtein(protein, mutation);

      if (mutationKind) mutationKind.textContent = mutation.kind;
      if (stageLabel) stageLabel.textContent = stage.label;
      if (title) title.textContent = stage.title;
      if (text) text.textContent = stage.text;
      if (effectTitle) effectTitle.textContent = stage.effectTitle;
      if (effectText) effectText.textContent = stage.effectText;
    }

    typeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentType = button.dataset.mutationType;
        updateMutationLab();
      });
    });

    stageButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentStage = button.dataset.mutationStage;
        updateMutationLab();
      });
    });

    updateMutationLab();
  });

  /* =========================
     PAGE "SÉLECTION NATURELLE"
     ========================= */

  const naturalSelectionData = {
    light: {
      sceneClass: "light",
      kicker: "Milieu clair",
      panelTitle: "Les formes claires sont mieux camouflées",
      panelText:
        "Sur des troncs clairs, les phalènes claires sont moins visibles. Les phalènes sombres sont davantage repérées par les prédateurs.",
      steps: {
        variation: {
          label: "Étape 1 / 5",
          title: "Variation initiale",
          text:
            "La population contient déjà des formes claires et des formes sombres. La sélection naturelle ne crée pas le caractère au moment du besoin.",
          key:
            "La variation précède la sélection : elle existe avant que le milieu ne trie les individus.",
          counts: { light: 12, dark: 12 },
          lightValue: 50,
          darkValue: 50
        },
        pressure: {
          label: "Étape 2 / 5",
          title: "Pression du milieu",
          text:
            "Dans un décor clair, les formes sombres ressortent davantage. Elles sont donc plus souvent repérées.",
          key:
            "Le même caractère peut être avantageux ou désavantageux selon le milieu.",
          counts: { light: 12, dark: 4, darkRisk: 8 },
          lightValue: 50,
          darkValue: 50,
          predator: true
        },
        survival: {
          label: "Étape 3 / 5",
          title: "Survie différentielle",
          text:
            "Toutes les phalènes ne meurent pas, mais les formes sombres disparaissent plus souvent dans cet environnement.",
          key:
            "La sélection naturelle agit sur des probabilités : survivre davantage en moyenne suffit à changer la population.",
          counts: { light: 12, dark: 4, deadDark: 8 },
          lightValue: 75,
          darkValue: 25,
          predator: true
        },
        reproduction: {
          label: "Étape 4 / 5",
          title: "Reproduction différentielle",
          text:
            "Comme les formes claires survivent mieux, elles contribuent davantage à la génération suivante.",
          key:
            "Ce qui compte pour l'évolution, ce n'est pas seulement survivre : c'est transmettre ses caractères.",
          counts: { light: 16, dark: 8 },
          lightValue: 67,
          darkValue: 33
        },
        next: {
          label: "Étape 5 / 5",
          title: "Changement de fréquence",
          text:
            "Après plusieurs générations, les formes claires deviennent plus fréquentes dans cette population.",
          key:
            "La population a évolué : la fréquence des caractères héréditaires a changé.",
          counts: { light: 18, dark: 6 },
          lightValue: 75,
          darkValue: 25
        }
      }
    },
    dark: {
      sceneClass: "dark",
      kicker: "Milieu sombre",
      panelTitle: "Les formes sombres sont mieux camouflées",
      panelText:
        "Sur des troncs sombres, l'avantage s'inverse : les phalènes sombres sont moins visibles que les phalènes claires.",
      steps: {
        variation: {
          label: "Étape 1 / 5",
          title: "Variation initiale",
          text:
            "La population contient les mêmes variations de départ. Le milieu ne fait que modifier leur avantage relatif.",
          key:
            "Même population de départ, autre milieu : le résultat peut changer.",
          counts: { light: 12, dark: 12 },
          lightValue: 50,
          darkValue: 50
        },
        pressure: {
          label: "Étape 2 / 5",
          title: "Pression du milieu",
          text:
            "Dans un décor sombre, les formes claires ressortent davantage. Elles sont donc plus souvent repérées.",
          key:
            "La sélection dépend du contexte : il n'existe pas de caractère avantageux partout.",
          counts: { light: 4, lightRisk: 8, dark: 12 },
          lightValue: 50,
          darkValue: 50,
          predator: true
        },
        survival: {
          label: "Étape 3 / 5",
          title: "Survie différentielle",
          text:
            "Les formes claires sont éliminées plus souvent. Les formes sombres restent mieux représentées parmi les survivantes.",
          key:
            "La sélection n'est pas un choix conscient : c'est une différence de survie moyenne.",
          counts: { light: 4, dark: 12, deadLight: 8 },
          lightValue: 25,
          darkValue: 75,
          predator: true
        },
        reproduction: {
          label: "Étape 4 / 5",
          title: "Reproduction différentielle",
          text:
            "Les formes sombres, plus nombreuses parmi les survivantes, transmettent plus souvent leur coloration.",
          key:
            "Un avantage de survie devient une différence de transmission des caractères.",
          counts: { light: 8, dark: 16 },
          lightValue: 33,
          darkValue: 67
        },
        next: {
          label: "Étape 5 / 5",
          title: "Changement de fréquence",
          text:
            "Après plusieurs générations, les formes sombres deviennent plus fréquentes dans cette population.",
          key:
            "La direction de l'évolution dépend du milieu : si le décor change, la pression change.",
          counts: { light: 6, dark: 18 },
          lightValue: 25,
          darkValue: 75
        }
      }
    }
  };

  function createMoth(type, state) {
    const moth = document.createElement("span");
    moth.className = "natural-moth " + type + (state ? " " + state : "");

    if (state === "dead") {
      const mark = document.createElement("b");
      mark.className = "natural-dead-mark";
      mark.textContent = "×";
      moth.appendChild(mark);
    }

    return moth;
  }

  function buildMothPopulation(counts) {
    const moths = [];
    const add = function (type, state, amount) {
      for (let i = 0; i < (amount || 0); i++) {
        moths.push({ type: type, state: state });
      }
    };

    add("light", "", counts.light);
    add("dark", "", counts.dark);
    add("light", "at-risk", counts.lightRisk);
    add("dark", "at-risk", counts.darkRisk);
    add("light", "dead", counts.deadLight);
    add("dark", "dead", counts.deadDark);

    const order = [0, 7, 14, 21, 4, 11, 18, 1, 8, 15, 22, 5, 12, 19, 2, 9, 16, 23, 6, 13, 20, 3, 10, 17];

    return order
      .map(function (index) {
        return moths[index];
      })
      .filter(Boolean);
  }

  document.querySelectorAll("[data-natural-selection]").forEach(function (lab) {
    const environmentButtons = Array.from(lab.querySelectorAll("[data-natural-environment]"));
    const stepButtons = Array.from(lab.querySelectorAll("[data-natural-step]"));
    const scene = lab.querySelector("[data-natural-scene]");
    const mothField = lab.querySelector("[data-natural-moths]");
    const predator = lab.querySelector("[data-natural-predator]");
    const stageLabel = lab.querySelector("[data-natural-stage-label]");
    const stageTitle = lab.querySelector("[data-natural-stage-title]");
    const stageText = lab.querySelector("[data-natural-stage-text]");
    const panelKicker = lab.querySelector("[data-natural-panel-kicker]");
    const panelTitle = lab.querySelector("[data-natural-panel-title]");
    const panelText = lab.querySelector("[data-natural-panel-text]");
    const lightBar = lab.querySelector("[data-natural-light-bar]");
    const darkBar = lab.querySelector("[data-natural-dark-bar]");
    const lightValue = lab.querySelector("[data-natural-light-value]");
    const darkValue = lab.querySelector("[data-natural-dark-value]");
    const keyText = lab.querySelector("[data-natural-key-text]");

    let currentEnvironment = "light";
    let currentStep = "variation";

    function updateNaturalSelection() {
      const environment = naturalSelectionData[currentEnvironment];
      const step = environment.steps[currentStep];

      if (!environment || !step) {
        return;
      }

      environmentButtons.forEach(function (button) {
        const isActive = button.dataset.naturalEnvironment === currentEnvironment;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      stepButtons.forEach(function (button) {
        const isActive = button.dataset.naturalStep === currentStep;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      if (scene) {
        scene.classList.toggle("light", environment.sceneClass === "light");
        scene.classList.toggle("dark", environment.sceneClass === "dark");
        scene.dataset.step = currentStep;
      }

      if (predator) {
        predator.classList.toggle("show", Boolean(step.predator));
      }

      if (mothField) {
        mothField.innerHTML = "";
        buildMothPopulation(step.counts).forEach(function (mothData) {
          mothField.appendChild(createMoth(mothData.type, mothData.state));
        });
      }

      if (stageLabel) stageLabel.textContent = step.label;
      if (stageTitle) stageTitle.textContent = step.title;
      if (stageText) stageText.textContent = step.text;
      if (panelKicker) panelKicker.textContent = environment.kicker;
      if (panelTitle) panelTitle.textContent = environment.panelTitle;
      if (panelText) panelText.textContent = environment.panelText;
      if (keyText) keyText.textContent = step.key;

      if (lightBar) lightBar.style.setProperty("--value", step.lightValue + "%");
      if (darkBar) darkBar.style.setProperty("--value", step.darkValue + "%");
      if (lightValue) lightValue.textContent = step.lightValue + " %";
      if (darkValue) darkValue.textContent = step.darkValue + " %";
    }

    environmentButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentEnvironment = button.dataset.naturalEnvironment;
        updateNaturalSelection();
      });
    });

    stepButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentStep = button.dataset.naturalStep;
        updateNaturalSelection();
      });
    });

    updateNaturalSelection();
  });

  console.log("Site Evolution chargé.");
})();
