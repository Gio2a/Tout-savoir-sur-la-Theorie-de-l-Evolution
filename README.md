# L'Évolution — site interactif

Une présentation web interactive sur la théorie de l'évolution : preuves génétiques, paléontologiques et anatomiques, expliquées clairement.

## ✨ Fonctionnalités

- **Format slides interactif** — chaque section est une diapo plein écran
- **Animations au scroll** — apparition progressive des éléments
- **Navigation par chapitres** — sommaire latéral (touche `M`)
- **Mode clair / sombre** — bouton en haut à droite (touche `T`)
- **Quiz interactifs** — 3 quiz pour tester la compréhension
- **Schémas cliquables** — sélection naturelle, arbre des grands singes, évolution de l'œil
- **Navigation clavier** — `↓ ↑ Espace` pour avancer / reculer
- **Responsive** — fonctionne sur mobile, tablette et desktop
- **Zéro dépendance externe** — HTML, CSS, JS pur (juste des fonts Google)

## 🚀 Déploiement sur GitHub Pages

### 1. Crée le dépôt sur GitHub

Tu as déjà commencé ce processus ! Termine la création de ton dépôt `Tout-savoir-sur-la-Theorie-de-l-Evolution` (visibilité **Public**, sans README ni .gitignore — tu vas pousser ce projet directement).

### 2. Pousse les fichiers

Dans le dossier du projet, en local :

```bash
git init
git add .
git commit -m "Initial commit — site évolution"
git branch -M main
git remote add origin https://github.com/Gio2a/Tout-savoir-sur-la-Theorie-de-l-Evolution.git
git push -u origin main
```

### 3. Active GitHub Pages

1. Va dans **Settings** → **Pages** de ton dépôt
2. Sous *Build and deployment*, choisis **Source : GitHub Actions**
3. C'est tout. Le workflow `.github/workflows/deploy.yml` se charge du reste.

À chaque `git push` sur `main`, le site se redéploie automatiquement.

L'URL publique sera : `https://gio2a.github.io/Tout-savoir-sur-la-Theorie-de-l-Evolution/`

## 🛠 Développement local

Aucune build étape nécessaire. Lance simplement un serveur statique :

```bash
# Avec Python
python3 -m http.server 8000

# Ou avec Node
npx serve
```

Puis ouvre `http://localhost:8000`.

## 📁 Structure

```
.
├── index.html              # Page principale (toutes les slides)
├── css/style.css           # Styles complets (palette, animations)
├── js/main.js              # Navigation, quiz, schémas, thème
├── .github/workflows/
│   └── deploy.yml          # Workflow auto-déploiement
└── README.md
```

## 🎨 Personnalisation

- **Couleurs** : édite les variables CSS en haut de `css/style.css` (`--bg`, `--ink`, `--gold`…)
- **Typographie** : les fonts (Cormorant Garamond + Inter) sont importées via Google Fonts dans `index.html`
- **Contenu** : tout est dans `index.html`, organisé en sections `<section class="slide">`

## 📜 Licence

Contenu pédagogique — libre d'utilisation, modification et redistribution.
