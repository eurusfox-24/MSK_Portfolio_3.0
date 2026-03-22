# 🚀 My Learning Journey: Building a Headless CMS Portfolio

This document serves as a study guide to review everything we accomplished today while building your `MSK_Portfolio_3.0`.

---

## 1. 🧠 Headless CMS (Strapi)
**What we learned:**
Unlike a traditional CMS like WordPress that controls both the backend and frontend (the UI), a **Headless CMS** only provides a backend and an API.
*   **The "Head" is the frontend:** Our React/Vite website.
*   **The "Body" is the backend:** Strapi, where the content lives.
*   *Why this is great:* You have total freedom over how your website looks using React and Tailwind CSS, but you still get a friendly dashboard to manage your text, images, and content securely.

**How we set it up:**
We created "Content Types" in Strapi:
*   `Project`: To hold project details.
*   `Certification`: To hold all your certs.
*   `Homelab`: For infrastructure and server monitoring info.

Each of these acts like a database table with an easy-to-use visual editor.

---

## 2. ⚡ The Build System (The "Static Generation" Approach)
**The Problem we solved:**
Strapi runs locally on your laptop (`localhost:1337`). GitHub Pages is a free host, but it can only host *static files* (HTML, CSS, JS). It cannot run a Node.js server like Strapi in the background.

**The Solution:**
Instead of the live website connecting to Strapi, we built a **Pre-Build Script** (`scripts/fetch-cms.js`).

**How it works:**
1. You edit content in Strapi.
2. You run `npm run publish`.
3. Our script wakes up, connects to your local Strapi (`fetch('http://localhost:1337...')`), and downloads all your projects, certifications, and homelab data.
4. It saves this data strictly as a text file (`src/data/cms-data.json`).
5. Vite bundles your website, baking that JSON file directly into the code.
6. The resulting output (in the `docs/` folder) is 100% static, requires no backend to run, and is completely free to host on GitHub!

---

## 3. 🧩 React Hooks (useEffect, useState)
We wrote "hybrid" logic inside components like `Projects.tsx` and `Certifications.tsx`.

*   **In Development (`npm run dev`):** The React component does a live `fetch()` to `http://localhost:1337`. If you change something in Strapi, refreshing the browser immediately shows the update without a rebuild.
*   **In Production (GitHub Pages):** The app ignores the `fetch()` and instantly loads the baked-in `cmsSnapshot` data from our JSON file.

We checked this using Vite's special environment variable: `import.meta.env.DEV`.

---

## 4. 📈 Dynamic JavaScript Array Methods
Instead of manually typing out how many certificates you have or what years they span, we used JavaScript to calculate it automatically in the UI footer!

```typescript
// Finding total count:
certifications.length

// Finding unique categories using a 'Set':
new Set(certifications.map((c) => c.category)).size

// Finding the earliest and latest year dynamically:
const years = certifications.map((c) => parseInt(c.date));
const min = Math.min(...years);
const max = Math.max(...years);
```
This means your website acts like a real application, analyzing its own data and keeping statistics perfectly accurate.

---

## 5. 🐙 Git, GitHub, and Deployment Workflows
We dealt with a notoriously heavy folder: `node_modules/`.

*   **The Issue:** `node_modules/` contains thousands of files necessary to build your app, but they aren't needed to *run* the built app, and they bloat your GitHub repo massively.
*   **The Fix:** We added it to a `.gitignore` file and used `git rm -r --cached node_modules` to untrack it.

We completely changed how GitHub hosts your site:
*   We updated our build script to output files into a `docs/` folder (`vite build --outDir docs`).
*   We committed those files straight to the `main` branch.
*   We configured GitHub Pages to look inside the `docs/` folder for your website.

This is a professional, extremely common workflow for free documentation and portfolio hosting.

---

### 🎉 Achievement Unlocked
You successfully merged a robust static site builder workflow with a modern headless CMS, solving complex CI/CD (Continuous Integration/Continuous Deployment) challenges, and managing git repository health by keeping it under 2MB. Great job!
