(function () {
  "use strict";

  function initTetrapodTransition() {
    const transition = document.getElementById("tetrapod-transition");

    if (!transition) {
      return;
    }

    const prevButton = transition.querySelector("[data-transition-prev]");
    const nextButton = transition.querySelector("[data-transition-next]");
    const stageMain = document.getElementById("transition-stage-main");
    const media = document.getElementById("transition-detail-media");
    const title = document.getElementById("transition-title");
    const meta = document.getElementById("transition-meta");
    const desc = document.getElementById("transition-desc");
    const proof = document.getElementById("transition-proof");
    const finger = document.getElementById("transition-finger");
    const traits = document.getElementById("transition-traits");
    const keynote = document.getElementById("transition-keynote");
    const stepCurrent = document.getElementById("transition-step-current");
    const timeLabel = document.getElementById("transition-time-label");
    const timeFill = document.getElementById("transition-time-fill");
    const dots = document.getElementById("transition-dots");
    const compare = document.getElementById("transition-compare");
    const compareGrid = document.getElementById("transition-compare-grid");
    let currentIndex = 0;
    const fossils = [
      {
        name: "Eusthenopteron",
        age: "~385 Ma",
        environment: "aquatique",
        key: "nageoires charnues",
        newTraits: ["Nageoires charnues"],
        image: "../images/fossiles/fossile-Eusthenopteron.png",
        desc:
          "Un poisson à nageoires charnues. Ses os de nageoires annoncent certains éléments des membres, mais il reste pleinement adapté à la nage.",
        finger:
          "Pas encore de doigts : on observe des nageoires charnues, pas des membres terminés par des doigts.",
        traits: {
          "Nageoires charnues": "présent",
          "Crâne aplati": "faible",
          "Côtes renforcées": "absent",
          "Cou mobile": "absent",
          "Appui du corps": "absent",
          "Doigts": "absent",
          "Vie terrestre": "absent"
        }
      },
      {
        name: "Tiktaalik",
        age: "~375 Ma",
        environment: "eaux peu profondes",
        key: "appui du corps",
        newTraits: ["Crâne aplati", "Côtes renforcées", "Cou mobile", "Appui du corps"],
        image: "../images/fossiles/fossile-Tiktaalik.png",
        desc:
          "Tiktaalik combine des caractères de poisson avec un cou mobile, un crâne aplati, des côtes plus robustes et des nageoires capables d'appuyer le corps.",
        finger:
          "Étape importante, mais pas encore de vrais doigts : Tiktaalik possède plutôt une nageoire renforcée, proche d'un poignet.",
        traits: {
          "Nageoires charnues": "présent",
          "Crâne aplati": "présent",
          "Côtes renforcées": "partiel",
          "Cou mobile": "présent",
          "Appui du corps": "partiel",
          "Doigts": "absent",
          "Vie terrestre": "faible"
        }
      },
      {
        name: "Acanthostega",
        age: "~365 Ma",
        environment: "surtout aquatique",
        key: "apparition des doigts",
        newTraits: ["Doigts"],
        image: "../images/fossiles/fossile-Acanthostega.png",
        desc:
          "Acanthostega possède des membres avec doigts, mais son corps reste très lié au milieu aquatique. Les doigts n'apparaissent donc pas forcément pour marcher sur terre.",
        finger:
          "Apparition majeure : des doigts bien documentés. Pourtant, l'animal reste surtout aquatique.",
        traits: {
          "Nageoires charnues": "transformé",
          "Crâne aplati": "présent",
          "Côtes renforcées": "partiel",
          "Cou mobile": "présent",
          "Appui du corps": "partiel",
          "Doigts": "présent",
          "Vie terrestre": "faible"
        }
      },
      {
        name: "Ichthyostega",
        age: "~360 Ma",
        environment: "amphibie",
        key: "marche partielle",
        newTraits: ["Soutien du tronc", "Vie terrestre"],
        image: "../images/fossiles/fossile-Ichthyostega.png",
        desc:
          "Ichthyostega montre des membres plus robustes, des côtes renforcées et une capacité accrue à se déplacer hors de l'eau, même s'il reste encore très lié aux milieux humides.",
        finger:
          "Les doigts sont présents et associés à des membres plus porteurs : la sortie de l'eau devient plus efficace.",
        traits: {
          "Nageoires charnues": "transformé",
          "Crâne aplati": "présent",
          "Côtes renforcées": "présent",
          "Cou mobile": "présent",
          "Appui du corps": "présent",
          "Doigts": "présent",
          "Vie terrestre": "partiel"
        }
      }
    ];
    const proofText =
      "On ne dit pas que ces fossiles se suivent forcément comme ancêtre direct et descendant. Le lien vient de leur âge, de leur position dans les roches et surtout d'une mosaïque de caractères : nageoires charnues, crâne aplati, côtes renforcées, cou mobile, membres porteurs puis doigts apparaissent dans un ordre cohérent.";
    const summaryIndex = fossils.length;

    function renderTrait(name, value, isNew) {
      const state = value === "présent" || value === "transformé" ? "yes" : value === "absent" ? "no" : "mid";
      const newClass = isNew ? " trait-new" : "";
      return (
        '<span class="transition-trait trait-' +
        state +
        newClass +
        '"><i></i><strong>' +
        name +
        "</strong><em>" +
        value +
        "</em></span>"
      );
    }

    function renderCompareCard(fossil, index) {
      return (
        '<article class="transition-compare-card"><span>' +
        (index + 1) +
        '</span><div class="transition-compare-image"><img src="' +
        fossil.image +
        '" alt=""></div><strong>' +
        fossil.name +
        "</strong><em>" +
        fossil.key +
        "</em><small>" +
        fossil.age +
        "</small></article>"
      );
    }

    function renderSummaryTrait(fossil, index) {
      return (
        '<span class="transition-summary-trait"><small>' +
        (index + 1) +
        "</small><strong>" +
        fossil.name +
        "</strong><em>" +
        (fossil.newTraits || []).join(" · ") +
        "</em></span>"
      );
    }

    function renderDots(index) {
      if (!dots) {
        return;
      }

      dots.innerHTML = fossils
        .concat([{ name: "la synthèse" }])
        .map(function (fossil, dotIndex) {
          const activeClass = dotIndex === index ? " active" : "";
          return (
            '<button class="transition-dot' +
            activeClass +
            '" type="button" data-transition-dot="' +
            dotIndex +
            '" aria-label="Voir ' +
            fossil.name +
            '"></button>'
          );
        })
        .join("");

      Array.from(dots.querySelectorAll(".transition-dot")).forEach(function (dot) {
        dot.addEventListener("click", function () {
          selectFossil(Number(dot.dataset.transitionDot));
        });
      });
    }

    function selectFossil(index) {
      const fossil = fossils[index];
      const isSummary = index === summaryIndex;

      if (!fossil && !isSummary) {
        return;
      }

      currentIndex = index;
      transition.classList.toggle("is-summary-step", isSummary);
      transition.classList.toggle("is-final-fossil", index === fossils.length - 1);

      if (media) {
        media.innerHTML = fossil ? '<img src="' + fossil.image + '" alt="">' : "";
      }

      if (stageMain) {
        stageMain.hidden = isSummary;
      }

      if (compare) {
        compare.hidden = !isSummary;
      }

      if (compareGrid && isSummary) {
        compareGrid.innerHTML = fossils.map(renderCompareCard).join("");
      }

      if (title) {
        title.textContent = isSummary ? "Synthèse" : fossil.name;
      }

      if (meta) {
        meta.textContent = isSummary
          ? "4 fossiles · ~25 millions d'années"
          : fossil.age + " · " + fossil.environment;
      }

      if (keynote) {
        keynote.textContent = isSummary ? "vue d'ensemble" : fossil.key;
      }

      if (stepCurrent) {
        stepCurrent.textContent = String(index + 1);
      }

      if (timeLabel) {
        timeLabel.textContent = isSummary ? "~385 à ~360 Ma" : fossil.age;
      }

      if (timeFill) {
        timeFill.style.setProperty("--progress", ((index + 1) / (fossils.length + 1)) * 100 + "%");
      }

      if (desc) {
        desc.textContent = isSummary
          ? "La vue finale compare les fossiles côte à côte pour montrer la progression des caractères."
          : fossil.desc;
      }

      if (proof) {
        proof.innerHTML = "<strong>Comment fait-on le lien ?</strong> " + proofText;
      }

      if (finger) {
        finger.textContent = isSummary
          ? "Point clé : les doigts apparaissent avant une vie terrestre complète."
          : fossil.finger;
        finger.classList.toggle("is-finger-event", isSummary || fossil.traits.Doigts === "présent");
      }

      if (traits) {
        traits.classList.toggle("is-summary", isSummary);

        if (isSummary) {
          traits.innerHTML = fossils.map(renderSummaryTrait).join("");
        } else {
          const traitsSource = fossil.traits;
          const newTraits = fossil.newTraits || [];
          traits.innerHTML = Object.keys(traitsSource)
            .map(function (traitName) {
              return renderTrait(traitName, traitsSource[traitName], newTraits.indexOf(traitName) !== -1);
            })
            .join("");
        }
      }

      if (prevButton) {
        prevButton.disabled = index === 0;
      }

      if (nextButton) {
        nextButton.textContent = isSummary ? "Recommencer" : "Suivant";
      }

      renderDots(index);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        selectFossil(Math.max(0, currentIndex - 1));
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        if (currentIndex === summaryIndex) {
          selectFossil(0);
          return;
        }

        selectFossil(Math.min(summaryIndex, currentIndex + 1));
      });
    }

    selectFossil(0);
  }

  initTetrapodTransition();

  function initEyeEvolution() {
    const module = document.getElementById("eye-evolution");

    if (!module) {
      return;
    }

    const visual = document.getElementById("eye-visual");
    const kicker = module.querySelector(".eye-info .transition-kicker");
    const title = document.getElementById("eye-title");
    const example = document.getElementById("eye-example");
    const desc = document.getElementById("eye-desc");
    const novelty = document.getElementById("eye-new");
    const current = document.getElementById("eye-step-current");
    const total = document.getElementById("eye-step-total");
    const functionLine = document.getElementById("eye-function-line");
    const dots = document.getElementById("eye-dots");
    const prevButton = module.querySelector("[data-eye-prev]");
    const nextButton = module.querySelector("[data-eye-next]");
    let index = 0;

    const eyeSteps = [
      {
        title: "Tache photosensible",
        example: "Exemple actuel : patelle (Patella)",
        functionText: "Lumière / ombre",
        changeText: "Cellules photoréceptrices",
        gainText: "Distinguer lumière et obscurité",
        desc:
          "Une surface sensible ne forme pas d'image, mais elle indique déjà si le milieu devient plus clair ou plus sombre.",
        image: "../images/fossiles/oeil-01-tache-pigmentaire.png"
      },
      {
        title: "Cupule oculaire",
        example: "Exemple actuel : Pleurotomaria, mollusque à coquille fendue",
        functionText: "Direction de la lumière",
        changeText: "Creusement de la surface sensible",
        gainText: "Repérer d'où vient la lumière",
        desc:
          "La cupule crée des zones d'ombre : l'animal détecte mieux la direction de la source lumineuse.",
        image: "../images/fossiles/oeil-02-cupule-pigmentaire.png"
      },
      {
        title: "Oeil à sténopé",
        example: "Exemple actuel : nautile (Nautilus)",
        functionText: "Image grossière",
        changeText: "Ouverture étroite",
        gainText: "Former une image sombre et floue",
        desc:
          "Une petite ouverture limite les rayons qui entrent : une image commence à se former, même sans cristallin.",
        image: "../images/fossiles/oeil-03-stenope-nautile.png"
      },
      {
        title: "Cristallin primitif",
        example: "Exemple actuel : Murex, un escargot marin",
        functionText: "Image plus lumineuse",
        changeText: "Lentille réfractive",
        gainText: "Concentrer la lumière",
        desc:
          "Une lentille laisse entrer davantage de lumière et améliore l'image par rapport au simple sténopé.",
        image: "../images/fossiles/oeil-04-lentille-primitive.png"
      },
      {
        title: "Oeil à lentille complète",
        example: "Exemple actuel : pieuvre",
        functionText: "Image nette",
        changeText: "Iris, cornée et rétine organisée",
        gainText: "Produire une image nette",
        desc:
          "Plusieurs éléments spécialisés coopèrent : l'image devient nette, réglable et beaucoup plus informative.",
        image: "../images/fossiles/oeil-05-oeil-complexe.png"
      },
      {
        title: "Vue d'ensemble",
        example: "Succession de formes observables chez des animaux actuels",
        functionText: "Synthèse",
        changeLabel: "Idée clé",
        changeText: "Accumulation de petites améliorations",
        gainText: "Chaque étape fonctionne déjà",
        desc:
          "On ne part pas d'un oeil moderne auquel on enlève des pièces. On compare des formes simples, puis progressivement plus performantes.",
        synthesis: true
      }
    ];

    if (total) {
      total.textContent = String(eyeSteps.length);
    }

    function renderEyeImage(step) {
      if (step.synthesis) {
        return renderEyeOverview();
      }

      return (
        '<figure class="eye-schema-figure">' +
        '<img class="eye-schema-image" src="' +
        step.image +
        '" alt="Schéma : ' +
        step.title +
        '" loading="lazy">' +
        '<figcaption>' +
        step.title +
        " - " +
        step.example.replace("Exemple actuel : ", "") +
        "</figcaption></figure>"
      );
    }

    function renderEyeOverview() {
      const realSteps = eyeSteps.filter(function (step) {
        return !step.synthesis;
      });

      return (
        '<div class="eye-overview">' +
        '<p class="eye-panel-label">Les formes côte à côte</p>' +
        '<div class="eye-overview-grid">' +
        realSteps
          .map(function (step, stepIndex) {
            return (
              '<article class="eye-overview-card">' +
              '<span>' +
              (stepIndex + 1) +
              "</span>" +
              '<img src="' +
              step.image +
              '" alt="Schéma : ' +
              step.title +
              '">' +
              '<strong>' +
              step.title +
              "</strong>" +
              '<div class="eye-overview-facts"><p><b>Structure</b><span>' +
              step.changeText +
              "</span></p><p><b>Gain</b><span>" +
              step.gainText +
              "</span></p></div></article>"
            );
          })
          .join("") +
        "</div></div>"
      );
    }

    function renderFunctionLine(activeIndex) {
      if (!functionLine) {
        return;
      }

      functionLine.innerHTML = eyeSteps
        .map(function (step, stepIndex) {
          const state = stepIndex < activeIndex ? "done" : stepIndex === activeIndex ? "active" : "future";
          return (
            '<button class="eye-function ' +
            state +
            '" type="button" data-eye-step="' +
            stepIndex +
            '"><i>' +
            (stepIndex + 1) +
            "</i><span><strong>" +
            step.functionText +
            "</strong><em>" +
            step.title +
            "</em></span></button>"
          );
        })
        .join("");

      Array.from(functionLine.querySelectorAll("[data-eye-step]")).forEach(function (stepButton) {
        stepButton.addEventListener("click", function () {
          selectEye(Number(stepButton.dataset.eyeStep));
        });
      });
    }

    function renderDots(activeIndex) {
      if (!dots) {
        return;
      }

      dots.innerHTML = eyeSteps
        .map(function (step, stepIndex) {
          return (
            '<button class="transition-dot' +
            (stepIndex === activeIndex ? " active" : "") +
            '" type="button" data-eye-dot="' +
            stepIndex +
            '" aria-label="Voir ' +
            step.title +
            '"></button>'
          );
        })
        .join("");

      Array.from(dots.querySelectorAll("[data-eye-dot]")).forEach(function (dot) {
        dot.addEventListener("click", function () {
          selectEye(Number(dot.dataset.eyeDot));
        });
      });
    }

    function selectEye(nextIndex) {
      const step = eyeSteps[nextIndex];

      if (!step) {
        return;
      }

      index = nextIndex;

      if (visual) {
        visual.innerHTML = renderEyeImage(step);
      }

      if (title) {
        title.textContent = step.title;
      }

      if (kicker) {
        kicker.textContent = step.synthesis ? "Synthèse" : "Forme d'oeil";
      }

      if (example) {
        example.textContent = step.example;
      }

      if (desc) {
        desc.textContent = step.desc;
      }

      if (novelty) {
        novelty.innerHTML =
          "<span>" +
          (step.changeLabel || "Ce qui change ici") +
          "</span><strong>" +
          step.changeText +
          "</strong>";
      }

      if (current) {
        current.textContent = String(nextIndex + 1);
      }

      module.style.setProperty("--eye-progress", ((nextIndex + 1) / eyeSteps.length) * 100 + "%");

      if (prevButton) {
        prevButton.disabled = nextIndex === 0;
      }

      if (nextButton) {
        nextButton.textContent = nextIndex === eyeSteps.length - 1 ? "Recommencer" : "Suivant";
      }

      renderFunctionLine(nextIndex);
      renderDots(nextIndex);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        selectEye(Math.max(0, index - 1));
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        if (index === eyeSteps.length - 1) {
          selectEye(0);
          return;
        }

        selectEye(index + 1);
      });
    }

    selectEye(0);
  }

  initEyeEvolution();

  const register = document.getElementById("fossil-register");

  if (!register) {
    return;
  }

  const items = Array.from(register.querySelectorAll(".fossil-row-item"));
  const periods = Array.from(register.querySelectorAll(".fossil-period"));
  const viewButtons = Array.from(register.querySelectorAll(".fossil-view-button"));
  const rangeButton = register.querySelector("[data-fossil-range]");
  const crisisButton = register.querySelector("[data-fossil-crises]");
  const deepMarkers = Array.from(register.querySelectorAll(".deep-marker"));
  const extinctionMarkers = Array.from(register.querySelectorAll(".extinction-marker"));
  const timeTicks = Array.from(register.querySelectorAll(".fossil-time-ticks span"));
  const title = document.getElementById("fossil-info-title");
  const periodText = document.getElementById("fossil-info-period");
  const desc = document.getElementById("fossil-info-desc");
  const note = document.getElementById("fossil-info-note");
  let activeView = "groupe";
  let timelineStart = 635;
  let showCrises = false;
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
    {
      id: "hadean",
      name: "Hadéen",
      start: 4540,
      end: 4000,
      deep: true,
      desc: "Cette période commence avec la formation de la Terre. Sa limite finale marque une Terre plus refroidie, avec une croûte stable et les premiers indices très anciens de roches.",
      note: "Les limites anciennes sont moins nettes que les limites récentes : elles reposent surtout sur la datation des roches et des météorites."
    },
    {
      id: "archean",
      name: "Archéen",
      start: 4000,
      end: 2500,
      deep: true,
      desc: "L'Archéen correspond à une Terre très ancienne, où les premières traces de vie apparaissent probablement. Sa fin marque un changement durable de la croûte, des océans et de l'atmosphère.",
      note: "La limite avec le Protérozoïque est liée à de grands changements géologiques et chimiques, pas à une seule extinction visible."
    },
    {
      id: "proterozoic",
      name: "Protérozoïque",
      start: 2500,
      end: 635,
      deep: true,
      desc: "Le Protérozoïque voit l'oxygène devenir plus important dans l'atmosphère et les cellules complexes se diversifier. Il se termine avant l'Édiacarien, quand les grands organismes mous deviennent plus fréquents.",
      note: "Ses limites sont surtout définies par des changements globaux de la Terre et du vivant."
    },
    {
      id: "ediacaran",
      name: "Édiacarien",
      start: 635,
      end: 541,
      desc: "L'Édiacarien commence après de grandes glaciations. Il se termine juste avant l'explosion cambrienne, quand les fossiles d'animaux à parties dures deviennent beaucoup plus nombreux.",
      note: "Cette période aide à montrer que la vie complexe existe avant le Cambrien."
    },
    {
      id: "cambrian",
      name: "Cambrien",
      start: 541,
      end: 485,
      desc: "Le Cambrien commence avec une forte diversification des animaux dans le registre fossile. Sa fin correspond à un changement des faunes marines et ouvre l'Ordovicien.",
      note: "Les limites des périodes sont fixées à partir de repères mondiaux observables dans les couches géologiques."
    },
    {
      id: "ordovician",
      name: "Ordovicien",
      start: 485,
      end: 444,
      desc: "L'Ordovicien est marqué par une grande diversification marine. Il se termine par une importante crise biologique liée notamment à des changements climatiques.",
      note: "Les extinctions massives servent souvent de repères pour séparer deux périodes."
    },
    {
      id: "silurian",
      name: "Silurien",
      start: 444,
      end: 419,
      desc: "Le Silurien suit la crise de fin d'Ordovicien. On y observe la reprise des écosystèmes marins et les premières traces plus nettes de vie terrestre.",
      note: "La limite suivante annonce les transformations du Dévonien, notamment chez les vertébrés."
    },
    {
      id: "devonian",
      name: "Dévonien",
      start: 419,
      end: 359,
      desc: "Le Dévonien est souvent associé à la diversification des poissons et aux premiers tétrapodes. Il se termine par une crise biologique progressive.",
      note: "Les limites ne sont pas choisies au hasard : elles correspondent à des changements repérables dans les fossiles."
    },
    {
      id: "carboniferous",
      name: "Carbonifère",
      start: 359,
      end: 299,
      desc: "Le Carbonifère est marqué par de vastes forêts et la formation de nombreux dépôts de charbon. Il voit aussi apparaître les amniotes.",
      note: "Son nom vient des terrains riches en charbon formés à cette époque."
    },
    {
      id: "permian",
      name: "Permien",
      start: 299,
      end: 252,
      desc: "Le Permien termine le Paléozoïque. Sa limite finale correspond à la plus grande extinction de masse connue, qui fait disparaître notamment les trilobites.",
      note: "Cette crise majeure sert de frontière nette avec le Trias."
    },
    {
      id: "triassic",
      name: "Trias",
      start: 252,
      end: 201,
      desc: "Le Trias commence après la grande crise permienne. Les écosystèmes se reconstruisent et plusieurs lignées importantes apparaissent, dont les premiers dinosaures et mammifères.",
      note: "Sa fin correspond aussi à une crise biologique qui ouvre le Jurassique."
    },
    {
      id: "jurassic",
      name: "Jurassique",
      start: 201,
      end: 145,
      desc: "Le Jurassique est marqué par la diversification des dinosaures, des ammonites et des premiers oiseaux. Il se termine par un renouvellement progressif des faunes.",
      note: "Les limites sont définies à partir de successions de fossiles et de couches repérables à grande échelle."
    },
    {
      id: "cretaceous",
      name: "Crétacé",
      start: 145,
      end: 66,
      desc: "Le Crétacé voit notamment l'essor des plantes à fleurs et la diversité des dinosaures. Il se termine par la crise qui fait disparaître les dinosaures non aviens et les ammonites.",
      note: "La limite Crétacé-Cénozoïque est liée à une extinction massive, avec des indices comme l'impact d'un astéroïde."
    },
    {
      id: "cenozoic",
      name: "Cénozoïque",
      start: 66,
      end: 0,
      desc: "Le Cénozoïque commence après la crise de fin du Crétacé. Les mammifères, les oiseaux et les plantes à fleurs se diversifient fortement jusqu'au monde actuel.",
      note: "Cette période continue aujourd'hui : elle relie directement le registre fossile au vivant actuel."
    }
  ];

  const EXTINCTIONS = [
    {
      id: "ordovician-silurian",
      name: "Extinction Ordovicien-Silurien",
      age: 444,
      period: "Vers 444 Ma",
      impacts: [
        { type: "aquatic", label: "Aquatique", value: "≈ 85 %", detail: "espèces marines" }
      ],
      desc: "Une grande crise touche surtout les organismes marins : environ 85 % des espèces marines disparaissent selon les estimations classiques. Les brachiopodes, trilobites, graptolites et conodontes sont fortement touchés.",
      note: "Elle est souvent reliée à un refroidissement global, à des glaciations et à des variations du niveau marin. Elle sert de repère majeur entre l'Ordovicien et le Silurien."
    },
    {
      id: "late-devonian",
      name: "Extinctions du Dévonien tardif",
      age: 372,
      period: "Environ 372-359 Ma",
      impacts: [
        { type: "aquatic", label: "Aquatique", value: "≈ 70 %", detail: "espèces marines" }
      ],
      desc: "Il ne s'agit pas d'un seul événement bref, mais de plusieurs crises successives. Environ 70 % des espèces marines disparaissent dans les estimations courantes, avec un fort impact sur les récifs.",
      note: "Les causes restent discutées : changements du climat, baisse de l'oxygène dans les océans, variations du niveau marin. Le marqueur indique le début approximatif de cette phase de crises."
    },
    {
      id: "permian-triassic",
      name: "Extinction Permien-Trias",
      age: 252,
      period: "Vers 252 Ma",
      impacts: [
        { type: "aquatic", label: "Aquatique", value: "> 95 %", detail: "espèces marines" },
        { type: "terrestrial", label: "Terrestre", value: "≈ 70 %", detail: "vertébrés terrestres" }
      ],
      desc: "C'est la plus grande extinction de masse connue : environ 90 % des espèces disparaissent, dont plus de 95 % des espèces marines selon certaines estimations. Les trilobites disparaissent définitivement.",
      note: "Elle est souvent associée à un volcanisme massif, un réchauffement intense, l'acidification et l'appauvrissement en oxygène des océans. Cette crise marque la limite entre Paléozoïque et Mésozoïque."
    },
    {
      id: "triassic-jurassic",
      name: "Extinction Trias-Jurassique",
      age: 201,
      period: "Vers 201 Ma",
      impacts: [
        { type: "aquatic", label: "Aquatique", value: "≈ 75 %", detail: "espèces marines" },
        { type: "terrestrial", label: "Terrestre", value: "≈ 40 %", detail: "genres terrestres" }
      ],
      desc: "Cette crise fait disparaître environ 75 % des espèces marines et terrestres dans les estimations classiques. Plusieurs groupes de reptiles et de nombreux organismes marins sont touchés.",
      note: "Elle est souvent reliée à un volcanisme massif lors de l'ouverture de l'Atlantique. Après cette crise, les dinosaures se diversifient fortement au Jurassique."
    },
    {
      id: "cretaceous-paleogene",
      name: "Extinction Crétacé-Paléogène",
      age: 66,
      period: "Vers 66 Ma",
      impacts: [
        { type: "aquatic", label: "Aquatique", value: "≥ 75 %", detail: "espèces marines" },
        { type: "terrestrial", label: "Terrestre", value: "≈ 40 %", detail: "genres terrestres" }
      ],
      desc: "Cette crise fait disparaître environ 75 à 80 % des espèces. Les dinosaures non aviens, les ammonites et de nombreux reptiles marins disparaissent, tandis que les oiseaux survivent.",
      note: "Elle est associée à l'impact d'un astéroïde, avec aussi un contexte de volcanisme et de changements environnementaux. Elle marque le passage du Crétacé au Cénozoïque."
    }
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

    extinctionMarkers.forEach(function (marker) {
      const extinction = EXTINCTIONS.find(function (entry) {
        return entry.id === marker.dataset.extinction;
      });

      if (!extinction) {
        return;
      }

      const position = getPosition(extinction.age, extinction.age);
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

  function buildImpactRows(extinction) {
    return extinction.impacts
      .map(function (impact) {
        return (
          '<span class="extinction-impact-card impact-' +
          impact.type +
          '"><span>' +
          impact.label +
          "</span><strong>" +
          impact.value +
          "</strong><em>" +
          impact.detail +
          "</em></span>"
        );
      })
      .join("");
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
    extinctionMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("selected-period");
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
    extinctionMarkers.forEach(function (extinctionMarker) {
      extinctionMarker.classList.remove("selected");
    });
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected", "selected-period");
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

  function selectExtinction(marker) {
    if (!showCrises) {
      return;
    }

    const extinction = EXTINCTIONS.find(function (entry) {
      return entry.id === marker.dataset.extinction;
    });

    if (!extinction) {
      return;
    }

    items.forEach(function (item) {
      item.classList.remove("selected");
    });
    deepMarkers.forEach(function (deepMarker) {
      deepMarker.classList.remove("selected");
    });
    extinctionMarkers.forEach(function (otherMarker) {
      otherMarker.classList.toggle("selected", otherMarker === marker);
    });
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected", "selected-period");
    });

    register.classList.remove("has-selection");

    if (title) {
      title.textContent = extinction.name;
    }

    if (periodText) {
      periodText.textContent = extinction.period;
    }

    if (desc) {
      desc.innerHTML =
        '<span class="extinction-impact"><span class="extinction-impact-title">Impact estimé</span>' +
        buildImpactRows(extinction) +
        "</span>" +
        extinction.desc;
    }

    if (note) {
      note.innerHTML = "<strong>Pourquoi c'est important ?</strong> " + extinction.note;
    }
  }

  function selectPeriod(periodButton) {
    const period = PERIODS.find(function (entry) {
      return entry.id === periodButton.dataset.period;
    });

    if (!period) {
      return;
    }

    items.forEach(function (item) {
      item.classList.remove("selected");
    });
    deepMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });
    extinctionMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });
    periods.forEach(function (otherPeriod) {
      otherPeriod.classList.remove("inside-selected", "outside-selected");
      otherPeriod.classList.toggle("selected-period", otherPeriod === periodButton);
    });

    register.classList.remove("has-selection");

    if (title) {
      title.textContent = period.name;
    }

    if (periodText) {
      periodText.textContent =
        period.end === 0
          ? "Depuis " + period.start + " Ma"
          : period.start + "-" + period.end + " Ma";
    }

    if (desc) {
      desc.textContent = period.desc;
    }

    if (note) {
      note.innerHTML =
        "<strong>Pourquoi ces limites ?</strong> " + period.note;
    }
  }

  function clearSelection() {
    items.forEach(function (item) {
      item.classList.remove("selected");
    });
    deepMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });
    extinctionMarkers.forEach(function (marker) {
      marker.classList.remove("selected");
    });

    register.classList.remove("has-selection");
    periods.forEach(function (periodButton) {
      periodButton.classList.remove("inside-selected", "outside-selected", "selected-period");
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

  extinctionMarkers.forEach(function (marker) {
    marker.addEventListener("click", function () {
      if (marker.classList.contains("selected")) {
        clearSelection();
        return;
      }

      selectExtinction(marker);
    });
  });

  periods.forEach(function (periodButton) {
    periodButton.addEventListener("click", function () {
      if (periodButton.hidden) {
        return;
      }

      if (periodButton.classList.contains("selected-period")) {
        clearSelection();
        return;
      }

      selectPeriod(periodButton);
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

  if (crisisButton) {
    crisisButton.addEventListener("click", function () {
      showCrises = !showCrises;
      register.classList.toggle("show-crises", showCrises);
      crisisButton.classList.toggle("active", showCrises);
      crisisButton.setAttribute("aria-pressed", showCrises ? "true" : "false");

      if (!showCrises) {
        const selectedCrisis = extinctionMarkers.some(function (marker) {
          return marker.classList.contains("selected");
        });

        extinctionMarkers.forEach(function (marker) {
          marker.classList.remove("selected");
        });

        if (selectedCrisis) {
          clearSelection();
        }
      }
    });
  }

  applyTimelineScale(NORMAL_TIMELINE_START);
  setView("groupe");
})();
