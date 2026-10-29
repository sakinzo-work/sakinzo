# Sakinzo MongoDB Backend + Admin Panel

## Service pages

`frontend/services.html` is the service directory. It links all 15 advertised
services, including the homepage's web/mobile, DevOps, architecture, PoC/MVP,
QA, UX/UI and business-analysis offerings, plus AI, agents, IoT, smart-home,
eCommerce, fintech, blockchain and full-cycle development.

Every detail page contains static, crawlable content: an overview, capabilities,
deliverables, delivery steps, FAQs, related services and a contact action. The
desktop and mobile Services menus use the same catalog on every public page.
Homepage cards and service accordion links point to their matching detail pages.
The existing language selector also works on these pages.

Edit the copy and service relationships in `frontend/services-data.js`, then run:

```bash
node scripts/build-services.js
node scripts/update-seo.js https://sakinzo-work.github.io/sakinzo/frontend/ 2026-10-29
```

Use your actual deployment URL and modification date. The second command adds
unique metadata, Service and breadcrumb structured data, and sitemap entries.
Generated service HTML should be regenerated from the catalog rather than edited
directly. Shared presentation and navigation are in `services.css`,
`service-page.js` and `service-navigation.js`.

Run `npm run test:services` from `backend/` for isolated desktop/mobile Chrome
checks, including every service page and menus on the home, company, contact and
blog pages. `npm test` also verifies static content and local service links.

## Website languages and SEO

The EN control is now a searchable, keyboard-accessible language selector on all
public pages, including mobile, blog and project pages. The bundled language list
contains 194 entries from the [official Cloud Translation language list](https://docs.cloud.google.com/translate/docs/languages).

Without translation credentials, selecting a language opens the public page in
[Google Translate's website view](https://support.google.com/translate/answer/2534559).
This is an external translation view; it requires a publicly reachable website and
depends on Google and regional availability. It cannot translate localhost or text
inside images, video, or third-party app previews. English stays available on the
original site. No discontinued Website Translator widget is used. Deploy the
updated backend too: it permits the site's exact Google translation origin to
load public projects/blogs and submit the contact form, without granting access
to admin routes.

For translations **inside this website**, enable Cloud Translation API (Basic v2)
in Google Cloud and add `GOOGLE_TRANSLATE_API_KEY` to the backend's private `.env`
or hosting environment. See `backend/.env.i18n.example` and the
[Cloud Translation documentation](https://docs.cloud.google.com/translate/docs/translate-text).
Deploy the updated backend and frontend together. Use `window.API_BASE` to point
both the website and translation client to the same API if your backend URL changes.
The selector automatically discovers every language supported by the configured
provider. Cloud API usage is billed by the provider; no key is shipped to browsers.

In API mode, language selection translates page text, form labels/placeholders,
image descriptions, accessibility labels, SEO metadata, structured data, and
public content inserted later by the backend. Submitted form values are excluded.
Selection is retained in local storage and in `?lang=hi`-style page URLs. Explicit
URL languages take priority. Internal links retain project IDs, blog slugs and
anchors. Urdu, Arabic and other RTL languages set the page direction appropriately.
Translation failures restore English and show a message. The API validates and
limits requests and caches repeated translations in server memory.

Titles, descriptions, canonical links, social metadata and JSON-LD are also
included directly in the English HTML, so crawlers and link previews can read
them without JavaScript. In API mode, translated pages update these fields and
advertise their language URLs with `hreflang`; free external translations are not
advertised as local language pages. Localized metadata is rendered with JavaScript;
social crawlers that do not execute it will see the English HTML. There are no
prebuilt localized HTML pages, and search indexing is not guaranteed.

Regenerate the static metadata and sitemap after changing the deployment URL or
SEO copy in `frontend/seo.js` (pass the date the pages actually changed):

```bash
node scripts/update-seo.js https://your-domain/path/ 2026-10-28
```

The default URL matches the existing GitHub Pages sitemap. When changing it,
update the sitemap URL in `frontend/robots.txt` too. A robots.txt file must be
served at the domain root to be honored. Legacy homepage/contact copies are
`noindex` and are excluded from the sitemap.

Run the API tests and isolated Chrome browser checks with:

```bash
cd backend
npm test
npm run test:i18n
```

Browser translation responses are fixtures, so these checks do not need a paid
API key or incur translation charges. Real Cloud Translation responses still
need to be verified after a valid key is configured.

This package converts your local static website into a real backend system using Node.js, Express and MongoDB Atlas.

## What is included

- `backend/` — Express API with MongoDB Atlas
- `frontend/index.html` — API-based home page with real projects, clients, stats, testimonials and Leaflet map data
- `frontend/contactus.html` — contact form now saves real submissions in MongoDB
- `frontend/admin.html` — login-protected admin panel

## No fake data

The seed script creates only:

- one admin user from your `.env`
- section visibility records

It does not create fake projects, clients, testimonials, map locations or stats. Add real data from the admin panel.

## Setup steps

### 1. Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

On macOS/Linux use:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/sakinzo?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here
CLIENT_ORIGIN=http://127.0.0.1:5500,http://localhost:5500,http://localhost:3000
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@sakinzo.local
ADMIN_PASSWORD=ChangeMe@123
```

### 2. Create admin account

```bash
npm run seed
```

### 3. Start backend

```bash
npm run dev
```

or

```bash
npm start
```

API runs at:

```text
http://localhost:5000/api
```

### 4. Open frontend

Use VS Code Live Server or any static server for the `frontend/` folder.

Open:

```text
frontend/admin.html
frontend/index.html
frontend/contactus.html
```

Admin login uses your `.env` admin email and password.

## Admin panel controls

Admin can control:

- Projects
- Clients and logos
- Team members
- Testimonials
- Stats
- Map locations with latitude and longitude
- Section visibility
- Contact form submissions
- Image uploads

### Project videos

In **Projects → Add / Edit → Project video**, paste a YouTube, Vimeo or direct
video URL, or select an MP4, WebM or Ogg file from your device (maximum 50 MB).
The selected file uploads when you save the project and replaces the video URL.
Videos appear on the public project detail page for every category. Videos are
optional except for IoT projects, which retain their required demo video.
Use **Remove video**, then save, to clear a video from a project.

Uploaded videos are streamed into MongoDB GridFS and served with byte-range
support for playback and seeking. They persist with the database and do not
depend on the backend server's local disk. Video uploads require an admin login;
saved videos are public so visitors can watch them. Deploy the updated backend
and frontend together to enable video uploads.

### Live app previews

In **Projects → Add / Edit → Publishing**, add a public web app or dashboard URL
and choose **Live preview device**: Auto, Phone, Tablet or Desktop. Auto uses a
phone frame for Android, iOS and mobile app projects, including existing projects,
and a desktop browser for other categories. Choose Phone to display any web app
as a mobile app. Visitors can switch device views without reloading the embedded
app. The preview scales to fit the page while retaining the selected app viewport.

App Store, Google Play and APK/IPA download links show an external **Open app**
button. Interactive previews require a web URL that permits iframe embedding;
the Open app button is also available for sites that block embedding.

Preview layout regression checks use an isolated, headless Chrome session:

```bash
cd backend
npm run test:layout
```

Install Google Chrome before running this check. It verifies all three device
views at desktop, tablet and mobile window sizes, including repeated resize
observer callbacks and switching devices without reloading the app. Screenshots
are written to the system temporary folder under `sakinzo-preview-layout`.

## Service pages and backgrounds

Edit service content and `cover` assignments in `frontend/services-data.js`.
Run `node scripts/build-services.js`, then
`node scripts/update-seo.js https://sakinzo-work.github.io/sakinzo/frontend/`
to regenerate the static pages and SEO. Each service's cover is also used for
its social-share preview. Image sources and generation prompts are documented in
[`frontend/assets/service-hero-assets.md`](frontend/assets/service-hero-assets.md).
Run `npm test` and `npm run test:services` from `backend/` to verify the pages.

## Map

The home page uses Leaflet + OpenStreetMap. No paid map API key is required. Add real map locations in admin panel with latitude and longitude.

## Important

If you deploy backend online, update this line in all frontend files if needed:

```js
const API_BASE = window.API_BASE || 'http://localhost:5000/api';
```

Change it to your live backend URL, for example:

```js
const API_BASE = 'https://your-backend.onrender.com/api';
```
