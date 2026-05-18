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

  console.log("Site Evolution chargé.");
})();
