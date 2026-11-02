# Sakinzo React application

This folder contains the full website as a React single-page application. All page UI is rendered from JSX components. Home-page data, forms, menus, translations, uploads and the complete admin console use React state, hooks and context. React Router handles navigation without reloading the document.

The only application HTML file is `index.html`, the standard empty mount shell required by Vite/React. There are no HTML page templates, injected page markup, legacy DOM controllers or runtime HTML-to-React conversion. The Google ownership verification file is a small static verification asset, not a website page.

## Run

```powershell
git clone https://github.com/sakinzo-work/Sakin.zo.git
cd Sakin.zo
npm install
npm run dev
```

Open http://127.0.0.1:3000/. The admin console is http://127.0.0.1:3000/admin.

For an existing local copy, run the npm commands from the folder containing this README and `package.json`.

## Backend

The original Express/MongoDB API is included in `backend/`. React handles the frontend; database access, authentication, permissions, approvals, translation credentials and upload storage remain on the server.

The React app uses **https://sakinzo.onrender.com/api**, the same Render backend as the original website, by default. No environment file or local backend is required to see the existing projects, clients, team, blogs, map locations and site settings. Both Vite dev and preview forward local `/api` and `/uploads` requests to Render, so `127.0.0.1` and different local ports work with its existing CORS configuration. A deployed frontend uses the Render API directly.

Render can take a little time to wake up after being idle. The data is fetched from the server; it is not a copied database or seeded demo data.

To use the optional local backend instead, copy `.env.example` to `.env.local`, set `BACKEND_ORIGIN=http://localhost:5000`, then run the included backend in a second terminal:

```powershell
npm run backend:install
Copy-Item backend/.env.example backend/.env
# Fill backend/.env with your existing MongoDB URI, JWT secret and admin settings.
npm run backend:dev
```

No private runtime `.env` was copied or created. Configuration examples contain placeholders. The migration does not create or modify records in a live database.

For another hosted API, set `BACKEND_ORIGIN` for the local proxy and `VITE_API_BASE=https://your-api.example/api` for the deployed frontend, then restart/build. Set `VITE_API_BASE=/api` if your production host supplies its own same-origin reverse proxy. Google Translation credentials belong only in `backend/.env`.

## Routes

- `/` - home, projects, filters, clients, statistics, services, testimonials, map and contact form.
- `/services` and the 15 service routes, such as `/web-mobile-development` and `/ai-development`.
- `/who-we-are`, `/careers`, `/leadership`, `/news`, `/opensource` and the five case studies.
- `/contact` - controlled contact form, attachments, consent, success/reset, team and office details.
- `/blog` and `/blog?slug=article-slug` - blog directory and markdown articles.
- `/projects/project-name` - readable project URLs, gallery, video and responsive live preview.
- `/admin` and `/admin/projects`, `/admin/blogs`, `/admin/profile`, etc. - authenticated admin sections.

Old `.html` URLs are handled by React redirects for existing bookmarks. Older duplicate home/contact/admin copies redirect to the corresponding current React view.

The admin console includes login/logout, access-aware navigation, search, dashboard, all content editors, project ordering, image/gallery/video uploads, contact settings and leads, employees, permissions, approval requests/reviews, profile editing, section visibility, themes, synchronization and the installable offline shell.

## Source

- `src/App.jsx` - router and application composition.
- `src/pages/` - public JSX page components.
- `src/components/` - shared navigation, language picker, page heroes, blog reader, markdown, galleries and project previews.
- `src/features/home/` - React home-page data and map components.
- `src/features/contact/` - React forms, team cards and offices.
- `src/features/admin/` - React admin state, screens, forms, permissions and API client.
- `src/context/` - public data, language dictionaries and React metadata.
- `src/data/contact.js` - the public email, phone number and Instagram account used by contact cards and footers across the website.
- `src/hooks/` and `src/lib/` - reusable data, form, route and media helpers.
- `public/` - original artwork, media, styles, manifests and verification assets.
- `content/blogs/` - original article sources.
- `backend/` - independent Express/MongoDB backend copy.

## Build and checks

```powershell
npm run build
npm test
npm --prefix backend test
npm run preview
```

The production app is in `dist/`. The build also generates the admin PWA cache and a sitemap with clean React routes. Browser tests need installed Google Chrome and use an isolated headless session with fixture API responses. They never write to your live backend. Screenshots and logs are saved in `test-results/`.

## Hosting

### Vercel frontend with the existing Render backend

Import `sakinzo-work/Sakin.zo` into Vercel with Root Directory `./` and production branch `main`. `vercel.json` sets the Vite preset, `npm ci`, `npm run build`, the `dist` output and the React route fallback. Select Node.js 22.x in the project settings.

In **Vercel > Project > Settings > Environment Variables**, these optional explicit frontend values can be added for Production and Preview:

| Name | Value |
| --- | --- |
| `VITE_BASE_PATH` | `/` |
| `VITE_API_BASE` | `https://sakinzo.onrender.com/api` |
| `VITE_SITE_URL` | Your final public website URL, for example `https://your-project.vercel.app/` |

The first two already have these defaults. If `VITE_SITE_URL` is blank, the build uses Vercel's production domain automatically (enable access to System Environment Variables). A manually configured `VITE_SITE_URL` takes priority, which is useful with a custom domain. Redeploy after changing Vercel environment variables.

In **Render > sakinzo backend > Environment**, edit `CLIENT_ORIGIN`: keep existing origins and append the final frontend origin separated by a comma, for example `https://sakinzo-work.github.io,https://your-project.vercel.app`. Origins must contain `https://` and have no trailing slash or path. Save/redeploy the Render service. If preview URLs also need API access, add each required preview origin explicitly. Do not allow every `vercel.app` site.

The database, uploads and authentication stay on Render. MongoDB, JWT, mail and translation secrets belong in Render's backend environment, never in frontend `VITE_*` variables. `.vercelignore` keeps the optional backend and private local environment files out of frontend CLI uploads.

### GitHub Pages

The repository root is the React project. `.github/workflows/pages.yml` builds and deploys `dist/` to https://sakinzo-work.github.io/Sakin.zo/ on pushes to `main`. It sets the `/Sakin.zo/` asset/router base, connects to the existing Render API and provides the React shell for direct route visits.

Serve `dist/` using a host that falls back to `index.html` for application routes. Vite preview already does this; `public/_redirects` supplies the equivalent rule for hosts that support that format. The default Render API must allow your deployed website's origin in its CORS settings, just as it does for the original GitHub Pages site.

For a domain subdirectory, set `VITE_BASE_PATH=/your-directory/`. Set `VITE_SITE_URL` to the full deployed website URL to generate the sitemap and robots file. Page metadata and structured data are rendered by React; this SPA does not generate separate static HTML pages for crawlers that do not execute JavaScript.

The sibling original frontend, backend, content and scripts were left untouched. `migration/original-files.json` records their hashes and the migration tests verify them when the original project is available.
