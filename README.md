# Kyki — a personal universe

A complete static identity website for Kyki / KykiShield. English content, responsive layout, original orbital artwork, ambient particles, reduced-motion support, accessible keyboard navigation, and direct links to the supplied ecosystem.

## Preview

Run `node preview.mjs` from this directory, then open `http://127.0.0.1:4173`.

## GitHub Pages

The `dist` directory is the complete, build-free website. Upload its **contents** to the root of a GitHub Pages repository or to its configured publishing directory. In the repository’s Pages settings, select that branch and directory. All local asset paths are relative, so both `username.github.io` and `username.github.io/repository/` work. There is no backend, package installation, or API key requirement.

Google Fonts is the only external page dependency; system font fallbacks are included. External destinations open in new tabs. No analytics or third-party tracking scripts are included.

## Editing

- `dist/index.html`: identity, project descriptions, and links.
- `dist/styles.css`: design and responsive styling.
- `dist/app.js`: ambient motion, copy-username action, navigation state, and hidden interaction.
- `dist/assets/orbit.png`: original generated orbital artwork.

The supplied Discord URL contains a username rather than a numeric Discord user ID. It is preserved, and the page also offers a functional Copy username action. Replace that URL with `https://discord.com/users/YOUR_NUMERIC_USER_ID` when available.

The digital passport and V.A.U.L.T. are explicitly presented as fictional experiments.

Hidden detail: type `kyki` to find an unlisted transmission; Escape closes it. Motion preference is stored locally on the visitor’s device and follows the operating system’s reduced-motion preference by default.
