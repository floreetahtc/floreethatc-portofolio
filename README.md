# Floreetha Tiara Cantika — Portfolio

A responsive technical portfolio for a Computer Systems Engineering student exploring networking, Linux systems, containerization, telecommunications infrastructure, and continuous learning.

## Stack

- React 19
- TypeScript
- Vite
- Lucide React
- Custom CSS design system (no component framework required)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The production build can be checked with:

```bash
npm run typecheck
npm run build
```

## Deployment

This is a static Vite site. Build it with `npm run build`, then deploy the generated `dist/` directory to a static host such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or an equivalent provider. Configure the host to serve `index.html` as the fallback for the single-page route.

The repository includes `.github/workflows/deploy-pages.yml` for GitHub Pages. It builds with the repository base path `/floreethatc-portofolio/` and deploys the `dist/` artifact after pushes to `main`. In the repository settings, set Pages to use **GitHub Actions** as the source.

## Content management

Most portfolio content is stored in `src/data/portfolio.ts`:

- Update name, education, CV path, email, LinkedIn, and GitHub in `portfolioConfig`.
- Add or edit project entries in `projects`.
- Add screenshots, documentation, GitHub links, live demos, or project posts only after the real assets or URLs exist. The project model includes `screenshot`, `documentation`, `github`, `liveDemo`, and `socialPost` fields.
- Update skills in `skillGroups`; use the existing labels instead of percentage bars.
- Add or edit certificates in `certifications`.
- Add certificate files to `public/certificates/`, then set the matching `file` path. View buttons stay hidden when `file` is empty.
- Add new learning paths, organization entries, or experience items in their respective arrays.

Optional assets are intentionally not fabricated. Missing social URLs, CVs, repository links, and certificate files are represented by quiet configuration notes or hidden actions rather than broken buttons.

### Local content manager

Open `/?manage=1` on the running site to use the browser-only content manager. It can:

- Update the email and LinkedIn profile URL.
- Upload a CV or add certificate files as locally stored data URLs.
- Add experience and organization entries.
- Save changes to browser `localStorage`.
- Export the current content as JSON and import it again later.
- Reset local overrides back to the source data in `src/data/portfolio.ts`.

This manager does not upload files to GitHub or a server. To publish permanent changes, copy the exported content into the source data and place assets under `public/`.

## Current source gaps to confirm

- GitHub URL, if it should be shown on the portfolio.
- Original certificate files for RH124, CNSP, KarirNex, and Adobe Illustrator training.
- Official COSA title, issuer, date, credential ID, and any verification URL.
- Exact dates and short descriptions for organizational activities.
- Repository, documentation, screenshots, and live links for projects when available.
