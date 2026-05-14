(function () {
  "use strict";

  const register = document.getElementById("fossil-register");

  if (!register) {
    return;
  }

  const items = Array.from(register.querySelectorAll(".fossil-row-item"));
  const periods = Array.from(register.querySelectorAll(".fossil-period"));
  const viewButtons = Array.from(register.querySelectorAll(".fossil-view-button"));
  const rangeButton = register.querySelector("[data-fossil-range]");
  const deepMarkers = Array.from(register.querySelectorAll(".deep-marker"));
  const timeTicks = Array.from(register.querySelectorAll(".fossil-time-ticks span"));
  const title = document.getElementById("fossil-info-title");
  const periodText = document.getElementById("fossil-info-period");
  const desc = document.getElementById("fossil-info-desc");
  const note = document.getElementById("fossil-info-note");
  let activeView = "groupe";
  let timelineStart = 635;
  const NORMAL_TIMELINE_START = 635;
  const EARTH_TIMELINE_START = 4540;
  const EMPTY_PANEL = {
    title: "Sélectionne un élément",
    period: "Groupes ou caractères",
    desc:
      "Clique sur une barre de la frise pour voir sa période, son statut et la manière dont elle se lit dans le registre fossile.",
    note:
      "<strong>Lecture :</strong> les barres montrent des apparitions, des persistances et parfois des disparitions. Les zones grisées apparaissent seulement après une sélection."
  };

  const PERIODS = [
    { id: "hadean", start: 4540, end: 4000, deep: true },
    { id: "archean", start: 4000, end: 2500, deep: true },
    { id: "proterozoic", start: 2500, end: 635, deep: true },
    { id: "ediacaran", start: 635, end: 541 },
    { id: "cambrian", start: 541, end: 485 },
    { id: "ordovician", start: 485, end: 444 },
    { id: "silurian", start: 444, end: 419 },
    { id: "devonian", start: 419, end: 359 },
    { id: "carboniferous", start: 359, end: 299 },
    { id: "permian", start: 299, end: 252 },
    { id: "triassic", start: 252, end: 201 },
    { id: "jurassic", start: 201, end: 145 },
    { id: "cretaceous", start: 145, end: 66 },
    { id: "cenozoic", start: 66, end: 0 }
  ];

  function overlaps(period, start, end) {
    return start > period.end && end < period.start;
  }

  function getPosition(start, end) {
    const x = ((timelineStart - start) / timelineStart) * 100;
    const width = ((start - end) / timelineStart) * 100;

    return {
      x: Math.max(0, Math.min(100, x)),
      width: Math.max(0.16, Math.min(100, width))
    };
  }

  function applyTimelineScale(start) {
    timelineStart = start;
    register.dataset.timeline = start === EARTH_TIMELINE_START ? "earth" : "normal";

    periods.forEach(function (periodButton) {
      const period = PERIODS.find(function (entry) {
        return entry.id === periodButton.dataset.period;
      });

      if (!period) {
        return;
      }

      const hiddenInNormal = period.deep && start === NORMAL_TIMELINE_START;
      periodButton.hidden = hiddenInNormal;

      if (!hiddenInNormal) {
        const position = getPosition(period.start, period.end);
        periodButton.style.setProperty("--x", position.x.toFixed(2) + "%");
        periodButton.style.setProperty("--w", position.width.toFixed(2) + "%");
      }
    });

    items.forEach(function (item) {
      const startValue = Number(item.dataset.start);
      const endValue = Number(item.dataset.end);
      const position = getPosition(startValue, endValue);

      item.style.setProperty("--x", position.x.toFixed(2) + "%");
      item.style.setProperty("--w", position.width.toFixed(2) + "%");
    });

    deepMarkers.forEach(function (marker) {
      const age = Number(marker.dataset.age);
      const position = getPosition(age, age);
      marker.style.setProperty("--x", position.x.toFixed(2) + "%");
    });

    timeTicks.forEach(function (tick) {
      const age = Number(tick.dataset.age);
      const isDeepTick = tick.hasAttribute("data-deep-tick");
      const hiddenInNormal = isDeepTick && start === NORMAL_TIMELINE_START;
      const hiddenOutsideRange = age > start;
      const position = getPosition(age, age);

      tick.hidden = hiddenInNormal || hiddenOutsideRange;
      tick.style.setProperty("--x", position.x.toFixed(2) + "%");
    });

    const selected = items.find(function (item) {
      return item.classList.contains("selected");
    });

    if (selected) {
      selectItem(selected);
    } else {
      clearSelection();
    }
  }

  function setPeriodState(item) {
    const start = Number(item.dataset.start);
    const end = Number(item.dataset.end);

    periods.forEach(function (periodButton) {
      const period = PERIODS.find(function (entry) {
        return entry.id === periodButton.dataset.period;
      });

      if (!period) {
        return;
      }

      const isInside = !periodButton.hidden && overlaps(period, start, end);
      periodButton.classList.toggle("inside-selected", isInside);
      periodButton.classList.toggle("outside-selected", !periodButton.hidden && !isInside);
    });
  }

  function buildNote(kind, status, end) {
    const subject = kind === "caractère" ? "ce caractère" : "ce groupe";
    const after =
      end === 0
        ? "la barre continue jusqu'au présent : " + subject + " existe encore aujourd'hui."
        : "la barre s'arrête avant le présent : " + subject + " a disparu.";
    const statusText = status ? " Statut : " + status + "." : "";

    return (
      "<strong>Lecture de la frise :</strong> avant son apparition, " +
      subject +
      " est absent des couches plus anciennes ; " +
      after +
      statusText
    );
  }

  function selectItem(item) {
    const start = Number(item.dataset.start);
    const end = Number(item.dataset.end);
    const x = getPosition(start, start).x;
    const endPercent = getPosition(end, end).x;
    const kind = item.dataset.kind || "élément";
    const status = item.dataset.status || "";

    items.forEach(function (otherItem) {
      otherItem.classList.toggle("selected", otherItem === item);
    });
    deepMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });

    register.classList.add("has-selection");
    register.style.setProperty("--selected-x", x.toFixed(2) + "%");
    register.style.setProperty("--selected-end", endPercent.toFixed(2) + "%");

    if (title) {
      title.textContent = item.dataset.name || "";
    }

    if (periodText) {
      periodText.textContent = item.dataset.period || "";
    }

    if (desc) {
      desc.textContent = item.dataset.desc || "";
    }

    if (note) {
      note.innerHTML = buildNote(kind, status, end);
    }

    setPeriodState(item);
  }

  function selectMarker(marker) {
    items.forEach(function (item) {
      item.classList.remove("selected");
    });
    deepMarkers.forEach(function (otherMarker) {
      otherMarker.classList.toggle("selected", otherMarker === marker);
    });
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected");
    });

    register.classList.remove("has-selection");

    if (title) {
      title.textContent = marker.dataset.name || "";
    }

    if (periodText) {
      periodText.textContent = marker.dataset.period || "";
    }

    if (desc) {
      desc.textContent = marker.dataset.desc || "";
    }

    if (note) {
      note.innerHTML = marker.dataset.note || "";
    }
  }

  function clearSelection() {
    items.forEach(function (item) {
      item.classList.remove("selected");
    });
    deepMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });

    register.classList.remove("has-selection");
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected");
    });

    if (title) {
      title.textContent = EMPTY_PANEL.title;
    }

    if (periodText) {
      periodText.textContent = EMPTY_PANEL.period;
    }

    if (desc) {
      desc.textContent = EMPTY_PANEL.desc;
    }

    if (note) {
      note.innerHTML = EMPTY_PANEL.note;
    }
  }

  function setView(view, options) {
    const shouldSelect = options && options.selectFirst;

    activeView = view;
    register.dataset.view = view;

    viewButtons.forEach(function (button) {
      button.classList.toggle("active", button.dataset.fossilView === view);
    });

    const visibleItems = items.filter(function (item) {
      return item.dataset.kind === view;
    });
    const selectedVisible = visibleItems.find(function (item) {
      return item.classList.contains("selected");
    });

    items.forEach(function (item) {
      if (item.dataset.kind !== view) {
        item.classList.remove("selected");
      }
    });

    if (selectedVisible) {
      selectItem(selectedVisible);
    } else if (shouldSelect && visibleItems[0]) {
      selectItem(visibleItems[0]);
    } else {
      clearSelection();
    }
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      if (item.classList.contains("selected")) {
        clearSelection();
        return;
      }

      if (item.dataset.kind !== activeView) {
        setView(item.dataset.kind);
      }

      selectItem(item);
    });
  });

  deepMarkers.forEach(function (marker) {
    marker.addEventListener("click", function () {
      if (marker.classList.contains("selected")) {
        clearSelection();
        return;
      }

      selectMarker(marker);
    });
  });

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setView(button.dataset.fossilView);
    });
  });

  if (rangeButton) {
    rangeButton.addEventListener("click", function () {
      const nextStart =
        timelineStart === EARTH_TIMELINE_START
          ? NORMAL_TIMELINE_START
          : EARTH_TIMELINE_START;

      rangeButton.classList.toggle("active", nextStart === EARTH_TIMELINE_START);
      rangeButton.textContent =
        nextStart === EARTH_TIMELINE_START ? "Depuis l'Édiacarien" : "Depuis la Terre";
      applyTimelineScale(nextStart);
    });
  }

  applyTimelineScale(NORMAL_TIMELINE_START);
  setView("groupe");
})();
