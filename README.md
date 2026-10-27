# Sakinzo MongoDB Backend + Admin Panel

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
