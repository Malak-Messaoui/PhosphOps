# Fonts

Polices chargees via Google Fonts CDN par defaut (Poppins + Inter),
voir shared/styles/_variables.scss.

Si l'intranet OCP bloque le CDN, deposer ici les fichiers .woff2
correspondants (Poppins: 600/700/800/900, Inter: 400/500/600) et
remplacer l'@import CDN dans _variables.scss par des @font-face
locales pointant vers ./assets/shared/fonts/.
