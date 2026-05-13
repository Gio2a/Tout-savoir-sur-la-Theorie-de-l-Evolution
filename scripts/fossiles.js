(function () {
  "use strict";

  const register = document.getElementById("fossil-register");

  if (!register) {
    return;
  }

  const items = Array.from(register.querySelectorAll(".fossil-row-item"));
  const periods = Array.from(register.querySelectorAll(".fossil-period"));
  const viewButtons = Array.from(register.querySelectorAll(".fossil-view-button"));
  const title = document.getElementById("fossil-info-title");
  const periodText = document.getElementById("fossil-info-period");
  const desc = document.getElementById("fossil-info-desc");
  const note = document.getElementById("fossil-info-note");
  let activeView = "groupe";

  const PERIODS = [
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

      const isInside = overlaps(period, start, end);
      periodButton.classList.toggle("inside-selected", isInside);
      periodButton.classList.toggle("outside-selected", !isInside);
    });
  }

  function buildNote(kind, status, end) {
    const subject = kind === "caractère" ? "ce caractère" : "ce groupe";
    const during =
      kind === "caractère"
        ? "présent chez les lignées qui l'ont hérité."
        : "présent dans les couches correspondant à cette période.";
    const after =
      end === 0
        ? "encore représenté aujourd'hui."
        : "disparu dans les couches plus récentes.";
    const statusText = status ? " Statut : " + status + "." : "";

    return (
      "<span><strong>Avant :</strong> absent dans les couches plus anciennes ; " +
      subject +
      " n'existait pas encore.</span>" +
      "<span><strong>Pendant :</strong> " +
      during +
      "</span>" +
      "<span><strong>Après :</strong> " +
      after +
      statusText +
      "</span>"
    );
  }

  function selectItem(item) {
    const start = Number(item.dataset.start);
    const end = Number(item.dataset.end);
    const x = ((541 - start) / 541) * 100;
    const endPercent = ((541 - end) / 541) * 100;
    const kind = item.dataset.kind || "élément";
    const status = item.dataset.status || "";

    items.forEach(function (otherItem) {
      otherItem.classList.toggle("selected", otherItem === item);
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

  function clearSelection() {
    items.forEach(function (item) {
      item.classList.remove("selected");
    });

    register.classList.remove("has-selection");
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected");
    });
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

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setView(button.dataset.fossilView);
    });
  });

  setView("groupe");
})();
