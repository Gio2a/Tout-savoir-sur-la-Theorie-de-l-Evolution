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
  const navProgressFill = document.getElementById("nav-progress-fill");
  const navProgressLabel = document.getElementById("nav-progress-label");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const roundedPercent = Math.round(percent);

    if (progressBar) {
      progressBar.style.width = percent + "%";
    }

    if (navProgressFill) {
      navProgressFill.style.width = roundedPercent + "%";
    }

    if (navProgressLabel) {
      navProgressLabel.textContent = roundedPercent + "%";
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

  const dnaCanvas = document.getElementById("dna-canvas");

  if (dnaCanvas) {
    const dnaContext = dnaCanvas.getContext("2d");
    const dnaOrbit = dnaCanvas.closest(".dna-orbit");
    const dnaReadout = document.querySelector(".dna-readout span");
    const dnaBases = ["A-T", "C-G", "G-C", "T-A"];
    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };
    let dnaWidth = 0;
    let dnaHeight = 0;
    let dnaRatio = 1;
    let readoutTick = -1;

    function resizeDnaCanvas() {
      const rect = dnaCanvas.getBoundingClientRect();
      dnaRatio = Math.min(window.devicePixelRatio || 1, 2);
      dnaWidth = rect.width;
      dnaHeight = rect.height;
      dnaCanvas.width = Math.round(dnaWidth * dnaRatio);
      dnaCanvas.height = Math.round(dnaHeight * dnaRatio);

      if (dnaContext) {
        dnaContext.setTransform(dnaRatio, 0, 0, dnaRatio, 0, 0);
      }
    }

    function drawDnaParticle(x, y, radius, color, alpha) {
      dnaContext.save();
      dnaContext.globalAlpha = alpha;
      dnaContext.shadowColor = color;
      dnaContext.shadowBlur = 16;
      dnaContext.fillStyle = color;
      dnaContext.beginPath();
      dnaContext.arc(x, y, radius, 0, Math.PI * 2);
      dnaContext.fill();
      dnaContext.restore();
    }

    function drawDnaLine(x1, y1, x2, y2, color, width, alpha) {
      dnaContext.save();
      dnaContext.globalAlpha = alpha;
      dnaContext.strokeStyle = color;
      dnaContext.lineWidth = width;
      dnaContext.lineCap = "round";
      dnaContext.shadowColor = typeof color === "string" ? color : "rgba(255, 255, 255, 0.45)";
      dnaContext.shadowBlur = 12;
      dnaContext.beginPath();
      dnaContext.moveTo(x1, y1);
      dnaContext.lineTo(x2, y2);
      dnaContext.stroke();
      dnaContext.restore();
    }

    function drawDnaFrame(time) {
      if (!dnaContext || dnaWidth === 0 || dnaHeight === 0) {
        return;
      }

      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;

      dnaContext.clearRect(0, 0, dnaWidth, dnaHeight);

      const centerX = dnaWidth / 2 + pointer.x * 18;
      const centerY = dnaHeight / 2 - 4 + pointer.y * 12;
      const helixHeight = dnaHeight * 0.58;
      const amplitude = dnaWidth * 0.18;
      const steps = 34;
      const phase = time * 0.0022;
      const points = [];

      for (let i = 0; i < steps; i++) {
        const progress = i / (steps - 1);
        const angle = progress * Math.PI * 5.2 + phase;
        const y = centerY - helixHeight / 2 + progress * helixHeight;
        const wave = Math.sin(angle);
        const depth = Math.cos(angle);
        const twist = Math.sin(progress * Math.PI) * 10;

        points.push({
          x1: centerX + wave * amplitude + pointer.y * twist,
          x2: centerX - wave * amplitude - pointer.y * twist,
          y: y,
          z1: (depth + 1) / 2,
          z2: 1 - ((depth + 1) / 2),
          depth: depth
        });
      }

      const aura = dnaContext.createRadialGradient(centerX, centerY, 10, centerX, centerY, dnaWidth * 0.42);
      aura.addColorStop(0, "rgba(13, 229, 255, 0.16)");
      aura.addColorStop(0.46, "rgba(255, 41, 213, 0.08)");
      aura.addColorStop(1, "rgba(0, 0, 0, 0)");
      dnaContext.fillStyle = aura;
      dnaContext.fillRect(0, 0, dnaWidth, dnaHeight);

      for (let i = 0; i < 12; i++) {
        const angle = phase * 0.6 + i * Math.PI * 2 / 12;
        const radius = dnaWidth * 0.34 + Math.sin(phase + i) * 8;
        const particleX = centerX + Math.cos(angle) * radius;
        const particleY = centerY + Math.sin(angle) * radius;
        drawDnaParticle(particleX, particleY, 1.5 + (i % 3), i % 2 ? "#ff29d5" : "#0de5ff", 0.24);
      }

      points.forEach(function (point, index) {
        const baseColor = dnaBases[index % dnaBases.length].includes("A") ? "#e2ad55" : "#7cc18d";
        const baseAlpha = 0.2 + Math.abs(point.depth) * 0.24;
        drawDnaLine(point.x1, point.y, point.x2, point.y, baseColor, 1.15 + Math.abs(point.depth), baseAlpha);
      });

      for (let i = 1; i < points.length; i++) {
        const previous = points[i - 1];
        const current = points[i];
        const cyanDepth = (previous.z1 + current.z1) / 2;
        const magentaDepth = (previous.z2 + current.z2) / 2;

        drawDnaLine(previous.x1, previous.y, current.x1, current.y, "#0de5ff", 2.2 + cyanDepth * 4.2, 0.34 + cyanDepth * 0.62);
        drawDnaLine(previous.x2, previous.y, current.x2, current.y, "#ff29d5", 2.2 + magentaDepth * 4.2, 0.34 + magentaDepth * 0.62);
      }

      points.forEach(function (point, index) {
        drawDnaParticle(point.x1, point.y, 2.2 + point.z1 * 3.8, "#0de5ff", 0.55 + point.z1 * 0.42);
        drawDnaParticle(point.x2, point.y, 2.2 + point.z2 * 3.8, "#ff29d5", 0.55 + point.z2 * 0.42);

        if (index % 7 === 0) {
          const marker = dnaBases[(Math.floor(time / 320) + index) % dnaBases.length];
          dnaContext.save();
          dnaContext.globalAlpha = 0.42;
          dnaContext.fillStyle = "#dffbff";
          dnaContext.font = "700 9px Space Grotesk, monospace";
          dnaContext.fillText(marker, point.x1 + 8, point.y + 3);
          dnaContext.restore();
        }
      });

      const scanY = centerY - helixHeight / 2 + ((time * 0.00022) % 1) * helixHeight;
      const scanGradient = dnaContext.createLinearGradient(centerX - amplitude * 1.55, scanY, centerX + amplitude * 1.55, scanY);
      scanGradient.addColorStop(0, "rgba(13, 229, 255, 0)");
      scanGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.48)");
      scanGradient.addColorStop(1, "rgba(255, 41, 213, 0)");
      drawDnaLine(centerX - amplitude * 1.6, scanY, centerX + amplitude * 1.6, scanY, scanGradient, 1.8, 0.8);

      const currentTick = Math.floor(time / 480);

      if (dnaReadout && currentTick !== readoutTick) {
        readoutTick = currentTick;
        dnaReadout.textContent = "séquence " + dnaBases[currentTick % dnaBases.length] + " · scan " + String(currentTick % 100).padStart(2, "0");
      }
    }

    function animateDna(time) {
      drawDnaFrame(time);
      window.requestAnimationFrame(animateDna);
    }

    if (dnaContext && dnaOrbit) {
      resizeDnaCanvas();

      if ("ResizeObserver" in window) {
        new ResizeObserver(resizeDnaCanvas).observe(dnaOrbit);
      } else {
        window.addEventListener("resize", resizeDnaCanvas);
      }

      dnaOrbit.addEventListener("pointermove", function (event) {
        const rect = dnaOrbit.getBoundingClientRect();
        pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      });

      dnaOrbit.addEventListener("pointerleave", function () {
        pointer.targetX = 0;
        pointer.targetY = 0;
      });

      window.requestAnimationFrame(animateDna);
    }
  }

  /* =========================
     EXPÉRIENCE MISSION
     ========================= */

  const missionCards = Array.from(document.querySelectorAll(".mission-card"));
  const missionTerminal = document.getElementById("mission-terminal");
  const missionFill = document.getElementById("mission-fill");
  const missionScore = document.getElementById("mission-score");
  const randomMissionBtn = document.getElementById("random-mission");

  function setMissionProgress(index) {
    if (!missionCards.length) {
      return;
    }

    const percent = Math.round(((index + 1) / missionCards.length) * 100);

    if (missionFill) {
      missionFill.style.width = percent + "%";
    }

    if (missionScore) {
      missionScore.textContent = percent + "%";
    }
  }

  function writeTerminal(lines) {
    if (!missionTerminal) {
      return;
    }

    missionTerminal.innerHTML = lines.map(function (line) {
      return "<p>" + line + "</p>";
    }).join("");
  }

  missionCards.forEach(function (card, index) {
    card.addEventListener("pointermove", function (event) {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
    });

    card.addEventListener("mouseenter", function () {
      setMissionProgress(index);
      writeTerminal([
        "> Mission détectée : " + (card.dataset.mission || "Chapitre"),
        "> " + card.querySelector("h3").textContent,
        "> Statut : prêt au lancement."
      ]);
    });
  });

  if (randomMissionBtn && missionCards.length) {
    randomMissionBtn.addEventListener("click", function () {
      const randomIndex = Math.floor(Math.random() * missionCards.length);
      const selectedCard = missionCards[randomIndex];

      setMissionProgress(randomIndex);
      selectedCard.scrollIntoView({ behavior: "smooth", block: "center" });
      selectedCard.classList.add("pulse-mission");

      writeTerminal([
        "> Tirage aléatoire terminé.",
        "> Mission recommandée : " + (selectedCard.dataset.mission || "Chapitre"),
        "> Clique sur la carte lumineuse pour entrer dans la zone."
      ]);

      setTimeout(function () {
        selectedCard.classList.remove("pulse-mission");
      }, 1400);
    });
  }

  const chapterLevels = {
    "avant-tout.html": ["01", "Briefing initial", "Clarifier le cadre avant le décollage"],
    "theorie.html": ["02", "Décryptage scientifique", "Distinguer hypothèse et théorie scientifique"],
    "evolution-observee.html": ["03", "Terrain vivant", "Observer l'évolution en direct"],
    "selection-naturelle.html": ["04", "Moteur du vivant", "Comprendre la mécanique de sélection"],
    "micro-macro.html": ["05", "Changement d'échelle", "Relier petits et grands changements"],
    "humain-singes.html": ["06", "Mission anatomique", "Explorer la parenté par les caractères"],
    "retrovirus.html": ["07", "Boss génétique", "Suivre les traces virales dans l'ADN"],
    "fossiles.html": ["08", "Archives profondes", "Lire les traces du temps long"],
    "convergence.html": ["09", "Convergence finale", "Assembler les indices indépendants"],
    "lexique.html": ["10", "Codex scientifique", "Déverrouiller les mots-clés"]
  };

  const pageName = window.location.pathname.split("/").pop();
  const chapterData = chapterLevels[pageName];
  const chapterMain = document.querySelector("main.slides");

  if (chapterData && chapterMain) {
    chapterMain.classList.add("game-shell", "chapter-game");
    chapterMain.dataset.mission = chapterData[1];

    if (!document.querySelector(".game-bg")) {
      const gameBg = document.createElement("div");
      gameBg.className = "game-bg";
      gameBg.setAttribute("aria-hidden", "true");
      gameBg.innerHTML =
        "<span class=\"orb orb-one\"></span>" +
        "<span class=\"orb orb-two\"></span>" +
        "<span class=\"orb orb-three\"></span>";
      document.body.insertBefore(gameBg, chapterMain);
    }

    const coverInner = chapterMain.querySelector(".cover .slide-inner");

    if (coverInner && !coverInner.querySelector(".chapter-hud")) {
      const hud = document.createElement("div");
      hud.className = "chapter-hud";
      hud.innerHTML =
        "<span class=\"mission-badge\">Niveau " + chapterData[0] + "</span>" +
        "<div><strong>" + chapterData[1] + "</strong><p>" + chapterData[2] + "</p></div>" +
        "<div class=\"xp-meter\" aria-label=\"Progression de mission\"><span><i></i></span><em>0 XP</em></div>";
      coverInner.insertBefore(hud, coverInner.firstElementChild);
    }
  }

  const chapterGame = document.querySelector(".chapter-game");

  if (chapterGame) {
    const unlockables = Array.from(document.querySelectorAll(".chapter-game .card, .chapter-game .row, .chapter-game .stat, .chapter-game .quiz, .chapter-game .taxonomy-quiz, .chapter-game .erv-step, .chapter-game .genome-card"));
    const xpFill = document.querySelector(".xp-meter i");
    const xpLabel = document.querySelector(".xp-meter em");
    const missionName = chapterGame.dataset.mission || "Mission";
    const commander = document.createElement("aside");

    commander.className = "chapter-commander";
    commander.innerHTML =
      "<strong>Console de mission</strong>" +
      "<p data-commander-line>> " + missionName + " initialisée.</p>" +
      "<p data-commander-xp>> XP collectée : 0%</p>" +
      "<button type=\"button\" data-focus-next>Scanner le prochain objectif</button>";

    document.body.appendChild(commander);

    const commanderLine = commander.querySelector("[data-commander-line]");
    const commanderXp = commander.querySelector("[data-commander-xp]");
    const focusNext = commander.querySelector("[data-focus-next]");

    function updateChapterXp() {
      if (!unlockables.length) {
        return;
      }

      const unlocked = unlockables.filter(function (item) {
        return item.classList.contains("unlocked");
      }).length;
      const percent = Math.round((unlocked / unlockables.length) * 100);

      if (xpFill) {
        xpFill.style.width = percent + "%";
      }

      if (xpLabel) {
        xpLabel.textContent = percent + " XP";
      }

      if (commanderXp) {
        commanderXp.textContent = "> XP collectée : " + percent + "%";
      }

      if (percent === 100 && commanderLine) {
        commanderLine.textContent = "> Mission complétée. Passage suivant débloqué.";
        commander.classList.add("open");
      }
    }

    function unlock(item) {
      item.classList.add("unlocked");

      const title = item.querySelector("h3, h4, strong");

      if (commanderLine) {
        commanderLine.textContent = "> Donnée validée : " + (title ? title.textContent : "objectif");
      }

      updateChapterXp();
    }

    unlockables.forEach(function (item) {
      item.classList.add("unlock-card");

      if (!item.hasAttribute("tabindex")) {
        item.setAttribute("tabindex", "0");
      }

      item.addEventListener("click", function () {
        unlock(item);
      });

      item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          unlock(item);
        }
      });
    });

    if (focusNext) {
      focusNext.addEventListener("click", function () {
        const next = unlockables.find(function (item) {
          return !item.classList.contains("unlocked");
        });

        if (next) {
          next.scrollIntoView({ behavior: "smooth", block: "center" });
          next.classList.add("pulse-mission");
          commander.classList.add("open");

          setTimeout(function () {
            next.classList.remove("pulse-mission");
          }, 1400);
        }
      });
    }

    updateChapterXp();
  }

  const simWorld = document.getElementById("sim-world");

  if (simWorld) {
    const generationCount = document.getElementById("generation-count");
    const lightCount = document.getElementById("light-count");
    const darkCount = document.getElementById("dark-count");
    const selectionMessage = document.getElementById("selection-message");
    const nextGeneration = document.getElementById("next-generation");
    const resetSelection = document.getElementById("reset-selection");
    const envButtons = document.querySelectorAll("[data-env]");
    let environment = "light";
    let generation = 0;
    let population = [];

    function createPopulation() {
      population = Array.from({ length: 32 }, function (_, index) {
        return {
          id: index,
          trait: index % 2 === 0 ? "light" : "dark",
          x: 8 + Math.random() * 84,
          y: 12 + Math.random() * 76
        };
      });
    }

    function renderPopulation(removedIds) {
      simWorld.innerHTML = "";

      population.forEach(function (creature) {
        const dot = document.createElement("span");
        dot.className = "creature " + creature.trait + " newborn";
        dot.style.left = creature.x + "%";
        dot.style.top = creature.y + "%";

        if (removedIds && removedIds.includes(creature.id)) {
          dot.classList.add("removed");
        }

        simWorld.appendChild(dot);
      });
    }

    function updateSelectionStats() {
      const light = population.filter(function (creature) {
        return creature.trait === "light";
      }).length;
      const dark = population.length - light;

      if (generationCount) {
        generationCount.textContent = generation;
      }

      if (lightCount) {
        lightCount.textContent = light;
      }

      if (darkCount) {
        darkCount.textContent = dark;
      }

      if (selectionMessage) {
        const favored = environment === "light" ? "clairs" : "foncés";
        selectionMessage.textContent = "Milieu " + (environment === "light" ? "clair" : "sombre") + " : les individus " + favored + " survivent mieux.";
      }
    }

    function setEnvironment(value) {
      environment = value;
      simWorld.dataset.environment = value;
      updateSelectionStats();
    }

    function evolveGeneration() {
      generation += 1;

      const favoredTrait = environment === "light" ? "light" : "dark";
      const survivors = population.filter(function (creature) {
        const chance = creature.trait === favoredTrait ? 0.82 : 0.38;
        return Math.random() < chance;
      });

      const removedIds = population.filter(function (creature) {
        return !survivors.includes(creature);
      }).map(function (creature) {
        return creature.id;
      });

      renderPopulation(removedIds);

      setTimeout(function () {
        const nextPopulation = survivors.slice();

        while (nextPopulation.length < 32) {
          const parent = survivors[Math.floor(Math.random() * survivors.length)] || population[Math.floor(Math.random() * population.length)];
          const mutation = Math.random() < 0.08;

          nextPopulation.push({
            id: Date.now() + Math.random(),
            trait: mutation ? (parent.trait === "light" ? "dark" : "light") : parent.trait,
            x: 8 + Math.random() * 84,
            y: 12 + Math.random() * 76
          });
        }

        population = nextPopulation;
        renderPopulation();
        updateSelectionStats();
      }, 520);
    }

    envButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setEnvironment(button.dataset.env);
      });
    });

    if (nextGeneration) {
      nextGeneration.addEventListener("click", evolveGeneration);
    }

    if (resetSelection) {
      resetSelection.addEventListener("click", function () {
        generation = 0;
        createPopulation();
        renderPopulation();
        updateSelectionStats();
      });
    }

    createPopulation();
    renderPopulation();
    updateSelectionStats();
  }

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

  console.log("Site Evolution chargé.");
})();
