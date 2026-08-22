# PhosphOps — Assets (Front Office + Back Office)

Structure prête à déposer dans `src/assets/` (ou `src/`, voir plus bas)
d'un projet Angular. Générée à partir du template HTML/CSS converti
depuis Figma, en gardant **une seule source de vérité** pour ce qui est
commun aux deux interfaces, et un dossier séparé pour ce qui est
spécifique.

```
assets/
├── styles.scss                    ← à copier vers src/styles.scss (point d'entrée global)
├── shared/
│   ├── styles/_variables.scss     ← 24 variables CSS communes (couleurs, radius, shadows, fonts) + reset
│   ├── fonts/                     ← vide, prêt pour héberger Poppins/Inter en local (voir README dedans)
│   └── images/
│       ├── logo.svg               ← logo CPG (extrait du template)
│       └── icons/                 ← vide, prêt pour icônes SVG locales (le template utilise Lucide CDN)
├── frontoffice/
│   ├── styles/_frontoffice.scss   ← tout main.css (composants technicien) + 2 variables propres (--nav-h, --bottomnav-h)
│   └── images/                    ← vide, prêt (photos équipements, empty states...)
└── backoffice/
    ├── styles/_backoffice.scss    ← tout admin.css (composants admin) + 2 variables propres (--sidebar-w, --topbar-h)
    └── images/                    ← vide, prêt (avatars, exports...)
```

## Pourquoi cette organisation

Les deux feuilles de style du template (`main.css` et `admin.css`)
partagent **24 variables identiques** (couleurs, rayons, ombres,
polices) — extraites une seule fois dans `shared/`. Il ne reste que
4 variables réellement spécifiques à chaque interface :

| Front Office | Back Office |
|---|---|
| `--nav-h: 56px` | `--sidebar-w: 240px` |
| `--bottomnav-h: 64px` | `--topbar-h: 56px` |

Le reste de chaque fichier (`.card`, `.btn`, `.badge`, sidebar,
bottomnav...) reste séparé exprès : certaines classes portent le même
nom des deux côtés mais avec un style différent (ex. `.card` en
back office est pensé desktop/dashboard, en front office mobile-first).
Les fusionner créerait des collisions.

## Intégration dans Angular

1. Copier ce dossier `assets/` dans `src/assets/phosphops/` (ou
   directement fusionner son contenu dans `src/assets/` existant).
2. Copier `styles.scss` → `src/styles.scss` (ou fusionner avec
   l'existant), en gardant l'ordre d'import :
   `shared/styles/variables` puis **uniquement** le fichier du module
   courant (`frontoffice` OU `backoffice`, jamais les deux en global).
3. Si vous avez deux modules Angular séparés (ex. `FrontofficeModule`
   / `BackofficeModule` avec lazy loading), chacun peut avoir son
   propre `styleUrls` pointant vers `_frontoffice.scss` ou
   `_backoffice.scss` — `_variables.scss` reste importé une seule
   fois au niveau global.
4. Le logo (`shared/images/logo.svg`) remplace le `<div class="logo">CPG</div>`
   texte du template — à utiliser dans un composant `LogoComponent`
   partagé.
5. Les polices restent en CDN par défaut (import dans
   `_variables.scss`) — voir `shared/fonts/README.md` pour les
   héberger en local si besoin (intranet fermé).

## Prochaine étape suggérée

Une fois ce dossier en place, on peut attaquer la conversion page par
page : chaque `.html` de `frontoffice/pages/` et `backoffice/pages/`
devient un composant Angular, avec le header/sidebar transformé en
`FrontofficeLayoutComponent` / `BackofficeLayoutComponent` partagé
(comme prévu dans le README du template original).
