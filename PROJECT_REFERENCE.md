# 🧠 MSK Portfolio 3.0: Technical Reference

A professional, multi-page security portfolio powered by a **Headless CMS + Static Snapshot** architecture.

---

## 🛠 1. Tech Stack
*   **Frontend:** React 19, TypeScript, Vite.
*   **Styling:** Tailwind CSS (Custom glow utilities, glassmorphism).
*   **CMS:** Strapi 5 (Local Headless Instance).
*   **Routing:** React Router (HashRouter for GitHub Pages compatibility).
*   **UI Components:** Lucide-React (Icons), Embla Carousel (Instagram-style swiper), Radix UI.
*   **Deployment:** GitHub Pages (via `/docs` folder).

---

## ⚡ 2. The "Static Snapshot" Workflow
Since GitHub Pages cannot run a live database (Strapi), we use an **SSG (Static Site Generation)** approach:

1.  **Manage:** You edit content (Projects, Experience, Homelab) in Strapi at `localhost:1337`.
2.  **Fetch:** `npm run publish` triggers `scripts/fetch-cms.js`.
3.  **Snapshot:** The script downloads all CMS data/images and saves them into `src/data/cms-data.json`.
4.  **Bake:** Vite compiles the app, "baking" that JSON directly into the JavaScript.
5.  **Serve:** The static `/docs` folder is pushed to GitHub. The site runs instantly with zero backend latency.

---

## 🎓 3. Key Concepts Learnt

### 🌐 Routing in Static Environments
*   **Problem:** Normal paths like `/projects` cause 404s on refresh in GitHub Pages.
*   **Solution:** `HashRouter` (`/#/projects`) keeps navigation client-side, making the site robust on free hosts.

### 🔌 Headless CMS Architecture
*   Decoupled the content (Strapi) from the presentation (React). 
*   Learned to extend schemas (adding `gallery` and `documentation` fields) and consume them via custom Fetch APIs.

### 🎨 UI/UX Component Fusion
*   Built a reusable `ProjectModal` that handles both Projects and Homelabs.
*   Implemented **Instagram-style swiping** using Embla Carousel for a mobile-first, high-end feel.
*   Integrated **persistent CSS glows** and scanline animations for a "Cyber-Security" aesthetic.

### 📁 Asset Management
*   Handled multiple media types (Images for galleries, PDFs for documentation).
*   Managed `.gitignore` to keep `node_modules` out of the repository while keeping the build output (`/docs`) tracked.

---

## 🚀 Commands to Remember
*   `npm run dev` — Start the frontend.
*   `cd cms && npm run dev` — Start the content dashboard.
*   `npm run publish` — The "Magic Command": Fetch -> Build -> Commit -> Deploy.
