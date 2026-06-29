// ============================================================
//  install.js — gère le bouton d'installation (navigateurs Chromium)
//  Rappel : Safari (iOS/macOS) et Firefox ne déclenchent PAS
//  l'événement beforeinstallprompt. Voir ios-hint.js pour iOS.
// ============================================================
let deferredPrompt = null;
const installButton = document.getElementById('butInstall');

// Le navigateur signale que l'app est installable
window.addEventListener('beforeinstallprompt', (evt) => {
  // On empêche la mini-infobar par défaut de Chrome
  evt.preventDefault();
  // On garde l'événement pour le déclencher au clic
  deferredPrompt = evt;
  // On révèle notre bouton
  installButton.hidden = false;
});

// Au clic, on déclenche le vrai dialogue d'installation
installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[Install] Réponse de l\'usager :', outcome); // 'accepted' ou 'dismissed'

  // Le prompt ne peut être réutilisé : on nettoie et on cache le bouton
  deferredPrompt = null;
  installButton.hidden = true;
});

// L'app a été installée (par notre bouton OU par le menu du navigateur)
window.addEventListener('appinstalled', () => {
  console.log('[Install] Application installée !');
  installButton.hidden = true;
});
