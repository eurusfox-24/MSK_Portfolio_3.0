# MSK Portfolio 3.0 — Quick Start

## 🚀 Start Locally

```
Terminal 1:  cd cms && npm run dev          → Strapi CMS at localhost:1337/admin
Terminal 2:  npm run dev                    → Portfolio at localhost:5173
```

## ✏️ Edit Content

```
1. Go to localhost:1337/admin
2. Content Manager → Project / Certification / Homelab
3. Create new entry → Fill fields → Save → Publish
4. Refresh localhost:5173 to see changes
```

## 🌐 Push to GitHub Pages

```
npm run publish
```

That's it. One command:
- Pulls latest CMS data
- Builds the site into the `docs/` folder
- Commits and pushes your changes to the `main` branch

> ⚠️ **One-time GitHub Setup**: Go to your repository **Settings → Pages**. Under **Build and deployment**, set **Source** to "Deploy from a branch". Set the **Branch** to `main` and the folder to `/docs`. Click **Save**.

> CMS must be running when you publish.

---

## 📋 Field Reference

### Project
```
title         →  My New Project
description   →  What it does
image         →  Main card preview image
gallery       →  Upload multiple detailed images
documentation →  Upload PDF or documentation file
tags          →  React, Python, AWS  (comma-separated)
color         →  from-purple-500/20 to-pink-500/20
```

### Certification
```
name         →  CompTIA Security+
issuer       →  CompTIA
image        →  Upload via Media Library
date         →  2026
category     →  Cybersecurity
description  →  Brief description
```

### Homelab
```
title         →  Live Attack Surface Monitoring
description   →  What your homelab does
image         →  Main background image
gallery       →  Upload multiple infrastructure screenshots
documentation →  Upload Network Map or Docs
status        →  Active
onlineText    →  Online
features      →  JSON (see below)
stats         →  JSON (see below)
```

Features JSON:
```json
[
  { "title": "Real-time Monitoring", "description": "Live attack visualization" },
  { "title": "Docker", "description": "20+ containerized services" }
]
```

Stats JSON:
```json
[
  { "label": "Containers", "value": "20+" },
  { "label": "Uptime", "value": "99.9%" }
]
```

---

## 🎨 Color Reference (for Project cards)

```
Green/Teal     →  from-emerald-500/20 to-teal-500/20
Blue/Cyan      →  from-blue-500/20 to-cyan-500/20
Red/Orange     →  from-red-500/20 to-orange-500/20
Purple/Pink    →  from-purple-500/20 to-pink-500/20
Yellow/Amber   →  from-yellow-500/20 to-amber-500/20
Indigo/Violet  →  from-indigo-500/20 to-violet-500/20
```

---

## 🔑 CMS Login

```
Credentials = whatever you set on first run of cms
Reset password:  cd cms && npx strapi admin:reset-user-password --email=YOUR_EMAIL
```

## 🛑 Stop Servers

```
Ctrl + C in each terminal
Port 1337 auto-clears on next start
```

## 🗂 Project Structure

```
MSK_Portfolio_3.0/
├── src/                    ← React frontend
│   ├── sections/           ← Hero, Projects, Certifications, Homelab, Footer, Nav
│   ├── data/cms-data.json  ← Auto-generated CMS snapshot (baked into builds)
│   └── lib/                ← Utilities
├── cms/                    ← Strapi CMS (local only, not deployed)
│   └── src/api/            ← Content type schemas
├── scripts/fetch-cms.js    ← Pulls CMS data at build time
├── public/                 ← Static assets (images, certs, cv)
├── package.json            ← All scripts
└── HOWTO.md                ← This file
```
