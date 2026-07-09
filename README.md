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
