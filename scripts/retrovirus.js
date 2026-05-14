(function () {
  "use strict";

  const tabs = document.querySelectorAll("[data-erv-panel]");
  const panels = document.querySelectorAll("[data-erv-panel-id]");
  const cellPlayButton = document.querySelector("[data-cell-animation]");
  const cellStage = document.querySelector(".erv-stage-cell");
  const dnaInsertButton = document.querySelector("[data-dna-insert]");
  const dnaScrollButton = document.querySelector("[data-dna-scroll]");
  const dnaViewport = document.querySelector("[data-dna-viewport]");
  const dnaTrack = document.querySelector("[data-dna-track]");
  const dnaSitesLayer = document.querySelector("[data-dna-sites]");
  const dnaCounter = document.querySelector("[data-dna-counter]");
  const dnaRange = document.querySelector("[data-dna-range]");
  const dnaMessage = document.querySelector("[data-dna-message]");
  const ervInfo = document.getElementById("erv-info");

  const SVG_NS = "http://www.w3.org/2000/svg";
  const DNA_SITE_START = 18420;
  const DNA_SCROLL_JUMPS = [1247, 18320, 241000, 1800000, 64000];
  const DNA_SITE_POSITIONS = [
    { x: 18, y: 50 },
    { x: 34, y: 42 },
    { x: 50, y: 58 },
    { x: 66, y: 43 },
    { x: 82, y: 52 }
  ];

  let dnaStartSite = DNA_SITE_START;
  let selectedDnaSite = -1;
  let dnaScrollCount = 0;
  let insertTimer = 0;
  let scrollRenderTimer = 0;
  let scrollEndTimer = 0;
  let continuousScrollTimer = 0;
  let dnaScrollStartedAt = 0;
  let isDnaScrolling = false;

  function createSvgElement(tagName) {
    return document.createElementNS(SVG_NS, tagName);
  }

  function formatSiteNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function getSiteLabel(index) {
    return "site " + formatSiteNumber(dnaStartSite + index);
  }

  function setInfo(title, body) {
    if (!ervInfo) {
      return;
    }

    ervInfo.innerHTML = "<strong>" + title + "</strong><br />" + body;
  }

  function getHelixY(x, phase) {
    const centerY = 180;
    const amplitude = 104;
    const period = 345;

    return centerY + amplitude * Math.sin((x / period) * Math.PI * 2 + phase);
  }

  function buildPath(points) {
    if (!points.length) {
      return "";
    }

    let path = "M " + points[0].x.toFixed(1) + " " + points[0].y.toFixed(1);

    for (let index = 0; index < points.length - 1; index += 1) {
      const previous = points[index - 1] || points[index];
      const current = points[index];
      const next = points[index + 1];
      const after = points[index + 2] || next;
      const controlOneX = current.x + (next.x - previous.x) / 6;
      const controlOneY = current.y + (next.y - previous.y) / 6;
      const controlTwoX = next.x - (after.x - current.x) / 6;
      const controlTwoY = next.y - (after.y - current.y) / 6;

      path +=
        " C " +
        controlOneX.toFixed(1) +
        " " +
        controlOneY.toFixed(1) +
        " " +
        controlTwoX.toFixed(1) +
        " " +
        controlTwoY.toFixed(1) +
        " " +
        next.x.toFixed(1) +
        " " +
        next.y.toFixed(1);
    }

    return path;
  }

  function buildDnaHelix() {
    if (!dnaTrack) {
      return;
    }

    const width = 1380;
    const height = 430;
    const strandA = [];
    const strandB = [];
    const svg = createSvgElement("svg");
    const rungsGroup = createSvgElement("g");
    const strandsGroup = createSvgElement("g");
    const nodesGroup = createSvgElement("g");

    dnaTrack.textContent = "";
    svg.setAttribute("class", "dna-helix-svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    rungsGroup.setAttribute("class", "dna-rungs");
    strandsGroup.setAttribute("class", "dna-strands");
    nodesGroup.setAttribute("class", "dna-nodes");

    for (let x = 0; x <= width; x += 15) {
      strandA.push({ x: x, y: getHelixY(x, 0) });
      strandB.push({ x: x, y: getHelixY(x, Math.PI) });
    }

    for (let x = 18; x <= width - 18; x += 42) {
      const yA = getHelixY(x, 0);
      const yB = getHelixY(x, Math.PI);
      const rung = createSvgElement("line");
      const isFront = Math.sin((x / 345) * Math.PI * 2) > 0;

      rung.setAttribute("x1", String(x));
      rung.setAttribute("y1", yA.toFixed(1));
      rung.setAttribute("x2", String(x));
      rung.setAttribute("y2", yB.toFixed(1));
      rung.setAttribute("class", isFront ? "dna-rung is-front" : "dna-rung");
      rungsGroup.appendChild(rung);
    }

    [
      { points: strandA, className: "dna-strand dna-strand-a" },
      { points: strandB, className: "dna-strand dna-strand-b" }
    ].forEach(function (strand) {
      const path = createSvgElement("path");
      path.setAttribute("class", strand.className);
      path.setAttribute("d", buildPath(strand.points));
      strandsGroup.appendChild(path);
    });

    for (let x = 18; x <= width - 18; x += 84) {
      [
        { y: getHelixY(x, 0), className: "dna-node dna-node-a" },
        { y: getHelixY(x, Math.PI), className: "dna-node dna-node-b" }
      ].forEach(function (node) {
        const circle = createSvgElement("circle");
        circle.setAttribute("cx", String(x));
        circle.setAttribute("cy", node.y.toFixed(1));
        circle.setAttribute("r", "11");
        circle.setAttribute("class", node.className);
        nodesGroup.appendChild(circle);
      });
    }

    svg.appendChild(rungsGroup);
    svg.appendChild(strandsGroup);
    svg.appendChild(nodesGroup);
    for (let copy = 0; copy < 3; copy += 1) {
      const helixCopy = copy === 0 ? svg : svg.cloneNode(true);
      helixCopy.setAttribute("aria-hidden", "true");
      dnaTrack.appendChild(helixCopy);
    }
  }

  function renderDnaCounter() {
    if (!dnaCounter) {
      return;
    }

    dnaCounter.textContent = "";

    DNA_SITE_POSITIONS.forEach(function (_position, index) {
      const label = document.createElement("span");
      label.textContent = getSiteLabel(index);

      if (index === selectedDnaSite) {
        label.classList.add("is-active");
      }

      dnaCounter.appendChild(label);
    });
  }

  function renderDnaSites() {
    if (!dnaSitesLayer) {
      return;
    }

    dnaSitesLayer.textContent = "";

    DNA_SITE_POSITIONS.forEach(function (position, index) {
      const site = document.createElement("i");
      const label = document.createElement("span");

      site.className = "dna-site";
      site.style.setProperty("--site-x", position.x + "%");
      site.style.setProperty("--site-y", position.y + "%");
      label.textContent = getSiteLabel(index);

      if (selectedDnaSite !== -1 && index !== selectedDnaSite) {
        site.classList.add("is-muted");
      }

      if (index === selectedDnaSite) {
        site.classList.add("is-selected");
      }

      site.appendChild(label);
      dnaSitesLayer.appendChild(site);
    });
  }

  function updateDnaRange() {
    if (dnaRange) {
      dnaRange.textContent =
        "Sites " +
        formatSiteNumber(dnaStartSite) +
        " à " +
        formatSiteNumber(dnaStartSite + DNA_SITE_POSITIONS.length - 1);
    }
  }

  function setInsertionPosition(index) {
    const position = DNA_SITE_POSITIONS[index];

    if (!position || !dnaViewport) {
      return;
    }

    dnaViewport.style.setProperty("--insertion-x", position.x + "%");
    dnaViewport.style.setProperty("--insertion-y", position.y + "%");
  }

  function renderDnaScene() {
    renderDnaCounter();
    renderDnaSites();
    updateDnaRange();

    if (selectedDnaSite !== -1) {
      setInsertionPosition(selectedDnaSite);
    }
  }

  function pickRandomDnaSite() {
    let nextSite = Math.floor(Math.random() * DNA_SITE_POSITIONS.length);

    if (DNA_SITE_POSITIONS.length > 1 && nextSite === selectedDnaSite) {
      nextSite = (nextSite + 1) % DNA_SITE_POSITIONS.length;
    }

    return nextSite;
  }

  function advanceDnaWindow(stepCount) {
    const totalSteps = stepCount || 1;

    for (let step = 0; step < totalSteps; step += 1) {
      const jump = DNA_SCROLL_JUMPS[dnaScrollCount % DNA_SCROLL_JUMPS.length];
      dnaStartSite += jump;
      dnaScrollCount += 1;
    }

    renderDnaScene();
  }

  function stopDnaScroll(showMessage) {
    if (!dnaViewport || !dnaTrack || !isDnaScrolling) {
      return;
    }

    window.clearInterval(continuousScrollTimer);
    continuousScrollTimer = 0;
    isDnaScrolling = false;

    dnaViewport.classList.remove("is-scrolling");
    dnaTrack.classList.remove("is-continuous", "is-shifting");

    if (dnaCounter) {
      dnaCounter.classList.remove("is-continuous", "is-shifting");
    }

    if (dnaScrollButton) {
      dnaScrollButton.textContent = "Faire défiler l'ADN";
      dnaScrollButton.classList.remove("is-active");
      dnaScrollButton.setAttribute("aria-pressed", "false");
    }

    advanceDnaWindow(Math.max(1, Math.min(8, Math.round((Date.now() - dnaScrollStartedAt) / 1400))));

    if (showMessage && dnaMessage) {
      dnaMessage.textContent =
        "Défilement arrêté : cette nouvelle portion montre d'autres emplacements possibles.";
    }
  }

  function startDnaScroll() {
    if (!dnaViewport || !dnaTrack || isDnaScrolling) {
      return;
    }

    window.clearTimeout(insertTimer);
    window.clearTimeout(scrollRenderTimer);
    window.clearTimeout(scrollEndTimer);

    selectedDnaSite = -1;
    renderDnaScene();

    dnaViewport.classList.remove("has-insertion", "is-inserting");
    dnaViewport.classList.add("is-scrolling");
    dnaTrack.classList.remove("is-continuous", "is-shifting");
    void dnaTrack.offsetWidth;
    dnaTrack.classList.add("is-continuous");

    if (dnaCounter) {
      dnaCounter.classList.remove("is-shifting");
      dnaCounter.classList.add("is-continuous");
    }

    if (dnaScrollButton) {
      dnaScrollButton.textContent = "Arrêter le défilement";
      dnaScrollButton.classList.add("is-active");
      dnaScrollButton.setAttribute("aria-pressed", "true");
    }

    if (dnaMessage) {
      dnaMessage.textContent =
        "L'ADN défile en continu : rappuie sur le bouton pour arrêter la fenêtre.";
    }

    setInfo(
      "ADN en défilement",
      "La fenêtre avance sans s'arrêter pour montrer que la portion visible n'est qu'un petit extrait d'un génome beaucoup plus long."
    );

    isDnaScrolling = true;
    dnaScrollStartedAt = Date.now();
  }

  function toggleDnaScroll() {
    if (isDnaScrolling) {
      stopDnaScroll(true);
      return;
    }

    startDnaScroll();
  }

  function playDnaInsertion() {
    if (!dnaViewport) {
      return;
    }

    stopDnaScroll(false);
    window.clearTimeout(insertTimer);
    selectedDnaSite = pickRandomDnaSite();
    renderDnaScene();

    dnaViewport.classList.remove("has-insertion", "is-inserting");
    void dnaViewport.offsetWidth;
    dnaViewport.classList.add("is-inserting");

    if (dnaMessage) {
      dnaMessage.textContent = "Le virus se dirige vers un emplacement possible de cette portion.";
    }

    setInfo(
      "Insertion simulée",
      "Le fragment viral vient de viser le " +
        getSiteLabel(selectedDnaSite) +
        ". Dans un vrai génome, le choix peut concerner un très grand nombre de positions."
    );

    insertTimer = window.setTimeout(function () {
      dnaViewport.classList.remove("is-inserting");
      dnaViewport.classList.add("has-insertion");

      if (dnaMessage) {
        dnaMessage.textContent =
          "Insertion affichée au " +
          getSiteLabel(selectedDnaSite) +
          " ; le même bouton peut montrer une autre position.";
      }
    }, 1000);
  }

  function scrollDnaPortion() {
    if (!dnaViewport || !dnaTrack) {
      return;
    }

    window.clearTimeout(insertTimer);
    window.clearTimeout(scrollRenderTimer);
    window.clearTimeout(scrollEndTimer);

    selectedDnaSite = -1;
    dnaViewport.classList.remove("has-insertion", "is-inserting");
    dnaViewport.classList.add("is-scrolling");
    dnaTrack.classList.remove("is-shifting");

    if (dnaCounter) {
      dnaCounter.classList.remove("is-shifting");
    }

    void dnaTrack.offsetWidth;
    dnaTrack.classList.add("is-shifting");

    if (dnaCounter) {
      dnaCounter.classList.add("is-shifting");
    }

    if (dnaMessage) {
      dnaMessage.textContent = "La fenêtre se décale : on regarde une autre portion du même ADN.";
    }

    setInfo(
      "Autre portion d'ADN",
      "La portion affichée change, mais le principe reste le même : le génome continue très loin avant et après la fenêtre visible."
    );

    scrollRenderTimer = window.setTimeout(function () {
      const jump = DNA_SCROLL_JUMPS[dnaScrollCount % DNA_SCROLL_JUMPS.length];
      dnaStartSite += jump;
      dnaScrollCount += 1;
      renderDnaScene();
    }, 410);

    scrollEndTimer = window.setTimeout(function () {
      dnaViewport.classList.remove("is-scrolling");
      dnaTrack.classList.remove("is-shifting");

      if (dnaCounter) {
        dnaCounter.classList.remove("is-shifting");
      }

      if (dnaMessage) {
        dnaMessage.textContent =
          "Nouvelle portion affichée : les emplacements visibles ne sont qu'une petite fenêtre du génome.";
      }
    }, 920);
  }

  function showPanel(panelId) {
    tabs.forEach(function (tab) {
      const isActive = tab.dataset.ervPanel === panelId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach(function (panel) {
      const isActive = panel.dataset.ervPanelId === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });

    if (cellStage && panelId === "cellule") {
      cellStage.classList.remove("cell-animate");
    }

    if (panelId !== "adn") {
      stopDnaScroll(false);
    }
  }

  function playCellAnimation() {
    if (!cellStage) {
      return;
    }

    cellStage.classList.remove("cell-animate");
    void cellStage.offsetWidth;
    cellStage.classList.add("cell-animate");
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      showPanel(tab.dataset.ervPanel);
    });
  });

  if (cellPlayButton) {
    cellPlayButton.addEventListener("click", playCellAnimation);
  }

  if (dnaInsertButton) {
    dnaInsertButton.addEventListener("click", playDnaInsertion);
  }

  if (dnaScrollButton) {
    dnaScrollButton.addEventListener("click", toggleDnaScroll);
  }

  buildDnaHelix();
  renderDnaScene();

  console.log("Chapitre retrovirus charge.");
})();
