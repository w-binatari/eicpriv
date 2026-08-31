# EIC Website

A single-page marketing site for the Entrepreneurship & Innovation Centre – Rivers State University, built with plain HTML/CSS/JS and bundled by [Vite](https://vitejs.dev/). Entry files are `index.html`, `main.js`, and `style.css`; static assets live in `assets/`.

## Cursor Cloud specific instructions

- Dependencies are installed via `npm install` (npm is the package manager; `package-lock.json` is committed).
- Run the dev server with `npm run dev` (Vite serves on `http://localhost:5173/`). Production build is `npm run build` (outputs to `dist/`), and `npm run preview` serves the built output.
- There are no lint or automated test scripts defined in `package.json`; verification is done by building and manually exercising the site in a browser.
