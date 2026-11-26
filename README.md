# Automotive Brake System Maintenance: A Complete Beginner's Study Guide

An independent, offline-ready Progressive Web App for self-paced learning about automotive brake systems. It is not an official certification or institutional training module.

Live site (GitHub Pages): https://githubbest729.github.io/PERFORMING-PERIODIC-MAINTENANCE-OF-BRAKE-SYSTEM-/

## Deploy on GitHub Pages
1. Upload **everything in this folder** to the repository root, including the hidden `.nojekyll` file and the `.well-known/` folder.
2. In the repository go to **Settings, Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Open the live URL, wait for the first load to finish, then test: reload, switch the browser to offline mode, and reload again.

## Updating content
- Edit the JSON files in `data/` (chapters are `ch01.json` to `ch10.json`, plus `quiz.json` and `glossary.json`).
- Change `VERSION` in `sw.js` (for example `v1.0.1`) so returning users receive the update.

## Local preview
Run `npx serve .` (or `python3 -m http.server 8080`) and open http://localhost:8080. Service workers need `localhost` or HTTPS.

## Structure
- `index.html`, `style.css`, `app.js` : app shell, styling, logic
- `sw.js`, `manifest.webmanifest`, `offline.html` : PWA and offline support
- `data/` : all study content
- `icons/`, `apple-touch-icon.png`, `og-image.png`, screenshots : branding assets
