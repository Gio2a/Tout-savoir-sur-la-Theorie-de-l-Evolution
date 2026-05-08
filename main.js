/* =============================================================
   ÉVOLUTION — Site interactif
   Navigation, animations au scroll, quiz, schémas, thème
   ============================================================= */

(function () {
  "use strict";

  /* ============= THEME ============= */
  const THEME_KEY = "evolution-theme";
  const themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    }
  }

  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ============= CHAPTER NAV ============= */
  const navBtn = document.getElementById("nav-toggle");
  const navPanel = document.getElementById("chapter-nav");
  const navOverlay = document.getElementById("nav-overlay");

  function closeNav() {
    navPanel.classList.remove("open");
    navOverlay.classList.remove("open");
  }

  function openNav() {
    navPanel.classList.add("open");
    navOverlay.classList.add("open");
  }

  if (navBtn) {
    navBtn.addEventListener("click", () => {
      navPanel.classList.contains("open") ? closeNav() : openNav();
    });
  }
  if (navOverlay) navOverlay.addEventListener("click", closeNav);

  // Click on chapter link → scroll & close
  document.querySelectorAll(".chapter-nav li").forEach(li => {
    li.addEventListener("click", () => {
      const target = li.dataset.target;
      if (target) {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      closeNav();
    });
  });

  /* ============= SCROLL ANIMATIONS ============= */
  const slides = document.querySelectorAll(".slide");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  slides.forEach(s => observer.observe(s));

  /* ============= PROGRESS BAR ============= */
  const progressBar = document.getElementById("progress-bar");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ============= KEYBOARD NAV ============= */
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      navigateSlide(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      navigateSlide(-1);
    } else if (e.key === "Escape") {
      closeNav();
    } else if (e.key === "m" || e.key === "M") {
      // toggle menu
      navPanel.classList.contains("open") ? closeNav() : openNav();
    } else if (e.key === "t" || e.key === "T") {
      themeBtn && themeBtn.click();
    }
  });

  function navigateSlide(direction) {
    const allSlides = Array.from(document.querySelectorAll(".slide"));
    const scrollY = window.scrollY + 100;
    let currentIdx = 0;
    for (let i = 0; i < allSlides.length; i++) {
      if (allSlides[i].offsetTop <= scrollY) currentIdx = i;
    }
    const next = Math.max(0, Math.min(allSlides.length - 1, currentIdx + direction));
    allSlides[next].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============= ARROW NAV BUTTONS ============= */
  document.querySelectorAll("[data-nav-prev]").forEach(btn => {
    btn.addEventListener("click", () => navigateSlide(-1));
  });
  document.querySelectorAll("[data-nav-next]").forEach(btn => {
    btn.addEventListener("click", () => navigateSlide(1));
  });
  document.querySelectorAll("[data-scroll-to]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.scrollTo;
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ============= QUIZ ============= */
  document.querySelectorAll(".quiz").forEach(quiz => {
    const options = quiz.querySelectorAll(".quiz-option");
    const feedback = quiz.querySelector(".quiz-feedback");
    const correctAnswer = quiz.dataset.correct;
    const explanation = quiz.dataset.explanation || "";

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        const isCorrect = opt.dataset.value === correctAnswer;
        options.forEach(o => {
          o.disabled = true;
          if (o.dataset.value === correctAnswer) o.classList.add("correct");
          else if (o === opt && !isCorrect) o.classList.add("wrong");
        });
        if (feedback) {
          feedback.innerHTML = (isCorrect ? "<strong>✓ Bonne réponse.</strong> " : "<strong>✗ Pas tout à fait.</strong> ") + explanation;
          feedback.classList.add("show");
        }
      });
    });
  });

  /* ============= INTERACTIVE SCHEMA: Sélection naturelle ============= */
  const selectionStages = {
    "stage-1": {
      title: "1. Variation naturelle",
      text: "Avant la sécheresse, les pinsons ont des becs de tailles variables. Cette diversité existe naturellement, entretenue par les mutations et la recombinaison génétique."
    },
    "stage-2": {
      title: "2. Pression de sélection",
      text: "La sécheresse arrive : seules les graines dures restent. Les petits becs n'arrivent plus à les casser. Ces individus se reproduisent moins."
    },
    "stage-3": {
      title: "3. Génération suivante",
      text: "Les survivants — surtout des gros becs — transmettent leurs gènes. La population a changé. Documenté en direct par Peter et Rosemary Grant pendant 40 ans aux Galápagos."
    }
  };

  document.querySelectorAll("[data-selection-stage]").forEach(el => {
    el.addEventListener("click", () => {
      const stage = el.dataset.selectionStage;
      const info = selectionStages[stage];
      const target = document.getElementById("selection-info");
      if (info && target) {
        target.innerHTML = `<strong>${info.title}</strong><br>${info.text}`;
      }
      // Visual highlight
      document.querySelectorAll("[data-selection-stage]").forEach(s => s.style.opacity = "0.4");
      el.style.opacity = "1";
    });
  });

  /* ============= INTERACTIVE SCHEMA: Arbre des grands singes ============= */
  const apeInfo = {
    "gibbon": {
      title: "Gibbon",
      text: "Branche divergée il y a ~20 millions d'années. Petit singe asiatique, expert en brachiation."
    },
    "orangutan": {
      title: "Orang-outan",
      text: "Ancêtre commun avec nous : ~16 millions d'années. Asie du Sud-Est. ~97% d'ADN partagé."
    },
    "gorilla": {
      title: "Gorille",
      text: "Ancêtre commun avec nous : ~10 millions d'années. ~98,3% d'ADN partagé."
    },
    "chimp": {
      title: "Chimpanzé",
      text: "Notre plus proche cousin. Ancêtre commun : ~7 millions d'années. ~98,7% d'ADN partagé."
    },
    "human": {
      title: "Humain",
      text: "Une branche parmi d'autres. Pas le sommet de l'évolution — juste la seule survivante du buisson humain."
    }
  };

  document.querySelectorAll("[data-ape]").forEach(el => {
    el.addEventListener("click", () => {
      const ape = el.dataset.ape;
      const info = apeInfo[ape];
      const target = document.getElementById("ape-info");
      if (info && target) {
        target.innerHTML = `<strong>${info.title}</strong><br>${info.text}`;
      }
      document.querySelectorAll("[data-ape]").forEach(s => s.style.opacity = "0.5");
      el.style.opacity = "1";
    });
  });

  /* ============= INTERACTIVE SCHEMA: Œil ============= */
  const eyeStages = {
    "eye-1": {
      title: "1. Tache photosensible",
      text: "Présente chez la méduse. Ne donne qu'une perception « sombre / clair ». Déjà avantageux : permet de fuir un prédateur dont l'ombre approche."
    },
    "eye-2": {
      title: "2. Cupule oculaire",
      text: "Présente chez la planaire (ver plat). La cavité permet de détecter la direction de la lumière. Encore mieux que rien."
    },
    "eye-3": {
      title: "3. Œil à sténopé",
      text: "Comme le nautile. Petit trou : l'image se forme par projection (principe du sténopé photographique). Vraie image, mais floue."
    },
    "eye-4": {
      title: "4. Cristallin primitif",
      text: "Chez certains escargots marins. Une lentille primitive concentre la lumière. Image plus nette."
    },
    "eye-5": {
      title: "5. Œil à lentille complète",
      text: "Vertébrés (dont nous). Cornée + cristallin avec accommodation. Vision nette à toute distance. Mais avec un point aveugle (le poulpe a évolué un meilleur œil sans ce défaut)."
    }
  };

  document.querySelectorAll("[data-eye-stage]").forEach(el => {
    el.addEventListener("click", () => {
      const stage = el.dataset.eyeStage;
      const info = eyeStages[stage];
      const target = document.getElementById("eye-info");
      if (info && target) {
        target.innerHTML = `<strong>${info.title}</strong><br>${info.text}`;
      }
      document.querySelectorAll("[data-eye-stage]").forEach(s => s.style.opacity = "0.5");
      el.style.opacity = "1";
    });
  });

  /* ============= TOUCH SWIPE ============= */
  let touchStartY = 0;
  document.addEventListener("touchstart", e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > 80) {
      // Native scroll handles this fine — only intercept if needed
    }
  }, { passive: true });

  /* ============= LOG ============= */
  console.log("%cÉvolution — site interactif chargé ✓", "color:#b8893a;font-family:serif;font-size:14px;font-style:italic");
  console.log("Raccourcis: ↓/↑ ou Espace pour naviguer, M pour menu, T pour thème");
})();
