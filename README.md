# Bloc-notes PWA — projet de référence (solutionnaire)

Petite PWA complète et fonctionnelle qui couvre tous les exercices du module :
manifest, service worker, bouton d'installation, consigne iOS, et fonctionnement
hors-ligne.

## Structure

```
index.html              Page principale (lie le manifest, enregistre le SW)
offline.html            Page de repli affichée si la navigation échoue hors-ligne
manifest.json           Web App Manifest complet (icônes, maskable, screenshots)
service-worker.js       Précache + nettoyage + stratégies de cache
css/style.css           Styles
js/install.js           Bouton d'installation (beforeinstallprompt)
js/ios-hint.js          Consigne « Sur l'écran d'accueil » pour iOS
icons/                  icon-192, icon-512, icon-512-maskable
screenshots/            Captures pour la fiche d'installation enrichie
```

## Tester localement

Une PWA exige HTTPS **ou** localhost. Le plus simple, depuis ce dossier :

```bash
# Python (déjà installé sur la plupart des postes)
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

Ou avec Node : `npx serve` (ou l'extension « Live Server » de VS Code).

> Ne pas ouvrir le fichier avec `file://` : le service worker ne s'enregistrera pas.

## Vérifier

1. Ouvrir **DevTools (F12) › Application › Manifest** : nom, couleurs, icônes,
   aucune erreur d'installabilité.
2. **Application › Service Workers** : le SW est `activated`.
3. **Application › Cache Storage › blocnotes-v1** : les fichiers sont en cache.
4. Cocher **Offline** dans l'onglet Network, recharger : la page fonctionne.
5. Cliquer l'icône d'installation dans la barre d'adresse (Chrome/Edge).

## Mettre en ligne

Déposer le dossier sur GitHub Pages, Netlify, Vercel ou Cloudflare Pages
(HTTPS automatique). Tester ensuite l'installation sur un vrai téléphone.

## Mise à jour

Après toute modification d'un fichier mis en cache, **incrémenter la version**
dans `service-worker.js` (`blocnotes-v1` → `blocnotes-v2`), sinon l'ancienne
version reste servie.
