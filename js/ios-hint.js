// ============================================================
//  ios-hint.js — affiche une consigne d'installation pour iOS
//  iOS n'a pas de beforeinstallprompt : l'usager doit passer par
//  Partager -> « Sur l'écran d'accueil ». On le lui explique.
// ============================================================
(function () {
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  // L'app est-elle déjà lancée en mode installé ?
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // propriété spécifique à iOS

  if (isiOS && !isStandalone) {
    const hint = document.getElementById('iosHint');
    if (hint) hint.hidden = false;
  }
})();
