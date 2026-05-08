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

  console.log("Site Evolution chargé.");
})();
