/**
 * Pre-build script: Fetches all data from local Strapi CMS,
 * downloads images to the public/uploads folder, and writes 
 * it to a static JSON file that gets bundled into the build.
 * 
 * Usage: node scripts/fetch-cms.js
 */

const STRAPI_URL = "http://localhost:1337";
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url) {
  if (!url) return null;
  if (!url.startsWith('http')) return url; // Already relative or external

  const fileName = path.basename(url);
  const filePath = path.join(UPLOADS_DIR, fileName);
  
  // Relative path for the frontend to use
  const relativePath = `uploads/${fileName}`;

  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filePath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download image: ${url} (Status: ${response.statusCode})`);
        resolve(url); // Fallback to absolute URL if download fails
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(relativePath);
      });
    }).on('error', (err) => {
      console.error(`Error downloading image ${url}:`, err.message);
      fs.unlink(filePath, () => {}); // Delete partial file
      resolve(url); // Fallback
    });
  });
}

async function fetchCmsData() {
  console.log("🚀 Fetching data from Strapi CMS & downloading images...\n");

  // ═══════════════════════════════════════════════════════════════
  // SAFETY CHECK: Verify CMS is running before doing anything
  // ═══════════════════════════════════════════════════════════════
  try {
    const healthCheck = await fetch(`${STRAPI_URL}/api/projects`, { signal: AbortSignal.timeout(3000) });
    if (!healthCheck.ok) throw new Error(`CMS returned status ${healthCheck.status}`);
    console.log("  ✅ CMS is online — proceeding with data fetch\n");
  } catch (err) {
    console.log("  ╔════════════════════════════════════════════════════════╗");
    console.log("  ║  ⛔ CMS IS NOT RUNNING — ABORTING TO PROTECT DATA    ║");
    console.log("  ║                                                       ║");
    console.log("  ║  Your existing cms-data.json was NOT overwritten.     ║");
    console.log("  ║  Start the CMS first:  cd cms && npm run dev          ║");
    console.log("  ╚════════════════════════════════════════════════════════╝\n");
    return; // Exit without writing — existing data stays safe
  }

  const results = {
    projects: [],
    certifications: [],
    homelabs: [],
    experiences: [],
    events: [],
    memberships: [],
    currentFocus: null,
    profile: null,
    fetchedAt: new Date().toISOString(),
  };

  // Fetch Profile
  try {
    const res = await fetch(`${STRAPI_URL}/api/profile?populate=*`);
    const data = await res.json();
    if (data && data.data) {
      const attrs = data.data.attributes || data.data;
      
      const cvUrl = attrs.cv?.url ? `${STRAPI_URL}${attrs.cv.url}` : 
                   (attrs.cv?.data?.attributes?.url ? `${STRAPI_URL}${attrs.cv.data.attributes.url}` : null);
      
      results.profile = {
        name: attrs.name,
        role: attrs.role,
        description: attrs.description,
        githubUrl: attrs.githubUrl,
        linkedinUrl: attrs.linkedinUrl,
        tryHackMeId: attrs.tryHackMeId,
        email: attrs.email,
        cvUrl: await downloadImage(cvUrl),
        location: attrs.location,
        sectionOrder: attrs.sectionOrder,
      };
      console.log(`  ✅ Profile: Data fetched`);
    }
  } catch (err) {
    console.log("  ⚠️ Profile: CMS not reachable, will use fallback data");
  }

  // Fetch Current Focus
  try {
    const res = await fetch(`${STRAPI_URL}/api/current-focus?populate=*`);
    const data = await res.json();
    if (data && data.data) {
      const attrs = data.data.attributes || data.data;
      results.currentFocus = {
        title: attrs.title,
        subtitle: attrs.subtitle,
        description: attrs.description,
        tags: attrs.tags || "",
        githubUrl: attrs.githubUrl,
        status: attrs.status,
        defenseStrategy: attrs.defenseStrategy,
        aiIntegration: attrs.aiIntegration,
      };
      console.log(`  ✅ Current Focus: Data fetched`);
    }
  } catch (err) {
    console.log("  ⚠️ Current Focus: CMS not reachable");
  }

  // Fetch Experiences
  try {
    const res = await fetch(`${STRAPI_URL}/api/experiences?populate=*&sort=manualId:desc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.experiences = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        let logoUrl = null;
        if (attrs.logo?.data?.attributes?.url) {
          logoUrl = `${STRAPI_URL}${attrs.logo.data.attributes.url}`;
        } else if (attrs.logo?.url) {
          logoUrl = `${STRAPI_URL}${attrs.logo.url}`;
        }
        
        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          company: attrs.company,
          location: attrs.location,
          startDate: attrs.startDate,
          endDate: attrs.endDate,
          description: attrs.description,
          logo: await downloadImage(logoUrl), 
          dateRange: attrs.dateRange,
          tags: attrs.tags || "",
        };
      }));
      console.log(`  ✅ Experiences: ${results.experiences.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Experiences: CMS not reachable");
  }

  // Fetch Projects
  try {
    const res = await fetch(`${STRAPI_URL}/api/projects?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.projects = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let galleryUrls = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          galleryUrls = attrs.gallery.data.map((img) => `${STRAPI_URL}${img.attributes?.url || img.url}`);
        } else if (Array.isArray(attrs.gallery)) {
          galleryUrls = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        const documentationUrl = attrs.documentation?.url ? `${STRAPI_URL}${attrs.documentation.url}` : 
                               (attrs.documentation?.data?.attributes?.url ? `${STRAPI_URL}${attrs.documentation.data.attributes.url}` : null);

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: await downloadImage(imageUrl),
          gallery: await Promise.all(galleryUrls.map(url => downloadImage(url))),
          documentation: await downloadImage(documentationUrl),
          tags: attrs.tags || "",
          color: attrs.color || "from-blue-500/20 to-cyan-500/20",
        };
      }));
      console.log(`  ✅ Projects: ${results.projects.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Projects: CMS not reachable");
  }

  // Fetch Certifications
  try {
    const res = await fetch(`${STRAPI_URL}/api/certifications?populate=*`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.certifications = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }
        return {
          id: attrs.manualId || item.id || attrs.documentId,
          name: attrs.name,
          issuer: attrs.issuer,
          image: await downloadImage(imageUrl),
          date: attrs.date,
          category: attrs.category,
          description: attrs.description,
        };
      }));
      console.log(`  ✅ Certifications: ${results.certifications.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Certifications: CMS not reachable");
  }

  // Fetch Homelabs
  try {
    const res = await fetch(`${STRAPI_URL}/api/homelabs?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.homelabs = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let galleryUrls = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          galleryUrls = attrs.gallery.data.map((img) => `${STRAPI_URL}${img.attributes?.url || img.url}`);
        } else if (Array.isArray(attrs.gallery)) {
          galleryUrls = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        const documentationUrl = attrs.documentation?.url ? `${STRAPI_URL}${attrs.documentation.url}` : 
                               (attrs.documentation?.data?.attributes?.url ? `${STRAPI_URL}${attrs.documentation.data.attributes.url}` : null);

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: await downloadImage(imageUrl),
          gallery: await Promise.all(galleryUrls.map(url => downloadImage(url))),
          documentation: await downloadImage(documentationUrl),
          status: attrs.status,
          onlineText: attrs.onlineText,
          features: attrs.features || [],
          stats: attrs.stats || [],
        };
      }));
      console.log(`  ✅ Homelabs: ${results.homelabs.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Homelabs: CMS not reachable");
  }

  // Fetch Events
  try {
    const res = await fetch(`${STRAPI_URL}/api/events?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.events = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let galleryUrls = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          galleryUrls = attrs.gallery.data.map((img) => `${STRAPI_URL}${img.attributes?.url || img.url}`);
        } else if (Array.isArray(attrs.gallery)) {
          galleryUrls = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          date: attrs.date,
          location: attrs.location,
          image: await downloadImage(imageUrl),
          gallery: await Promise.all(galleryUrls.map(url => downloadImage(url))),
        };
      }));
      console.log(`  ✅ Events: ${results.events.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Events: CMS not reachable");
  }

  // Fetch Memberships
  try {
    const res = await fetch(`${STRAPI_URL}/api/memberships?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.memberships = await Promise.all(data.data.map(async (item) => {
        const attrs = item.attributes || item;
        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
        };
      }));
      console.log(`  ✅ Memberships: ${results.memberships.length} entries`);
    }
  } catch (err) {
    console.log("  ⚠️ Memberships: CMS not reachable");
  }

  // ═══════════════════════════════════════════════════════════════
  // SAFETY CHECK: Don't overwrite good data with empty data
  // ═══════════════════════════════════════════════════════════════
  const outPath = path.join(process.cwd(), "src", "data", "cms-data.json");
  const hasNewData = results.projects.length > 0 || results.certifications.length > 0 || results.profile !== null;

  if (!hasNewData && fs.existsSync(outPath)) {
    const existingData = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    const existingHasData = existingData.projects?.length > 0 || existingData.certifications?.length > 0 || existingData.profile !== null;

    if (existingHasData) {
      console.log("\n  ╔════════════════════════════════════════════════════════╗");
      console.log("  ║  ⛔ CMS RETURNED EMPTY DATA — KEEPING EXISTING FILE  ║");
      console.log("  ║                                                       ║");
      console.log("  ║  The CMS is online but returned no content.           ║");
      console.log("  ║  Check that your entries are Published in Strapi.     ║");
      console.log("  ╚════════════════════════════════════════════════════════╝\n");
      return;
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n✨ CMS data snapshot & local assets saved!`);
}

fetchCmsData().catch((err) => {
  console.error("❌ Failed to fetch CMS data:", err);
  process.exit(0);
});
