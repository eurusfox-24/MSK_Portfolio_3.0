/**
 * Pre-build script: Fetches all data from local Strapi CMS
 * and writes it to a static JSON file that gets bundled into the build.
 * 
 * Usage: node scripts/fetch-cms.js
 * This runs automatically before every `npm run build`.
 */

const STRAPI_URL = "http://localhost:1337";

async function fetchCmsData() {
  console.log("?? Fetching data from Strapi CMS...\n");

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
      results.profile = {
        name: attrs.name,
        role: attrs.role,
        description: attrs.description,
        githubUrl: attrs.githubUrl,
        linkedinUrl: attrs.linkedinUrl,
        tryHackMeId: attrs.tryHackMeId,
        email: attrs.email,
        cvUrl: attrs.cv?.url
          ? `${STRAPI_URL}${attrs.cv.url}`
          : attrs.cv?.data?.attributes?.url
          ? `${STRAPI_URL}${attrs.cv.data.attributes.url}`
          : null,
        location: attrs.location,
        sectionOrder: attrs.sectionOrder,
      };
      console.log(`  ? Profile: Data fetched`);
    } else {
      console.log("  ??  Profile: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Profile: CMS not reachable, will use fallback data");
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
        tags: attrs.tags || "", githubUrl: attrs.githubUrl,
        status: attrs.status,
        defenseStrategy: attrs.defenseStrategy,
        aiIntegration: attrs.aiIntegration,
      };
      console.log(`  ? Current Focus: Data fetched`);
    } else {
      console.log("  ??  Current Focus: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Current Focus: CMS not reachable, will use fallback data");
  }

  // Fetch Experiences
  try {
    const res = await fetch(`${STRAPI_URL}/api/experiences?populate=*&sort=manualId:desc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.experiences = data.data.map((item) => {
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
          logo: logoUrl, 
          dateRange: attrs.dateRange,
          tags: attrs.tags || "",
        };
      });



      console.log(`  ? Experiences: ${results.experiences.length} entries`);
    } else {
      console.log("  ??  Experiences: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Experiences: CMS not reachable, will use fallback data");
  }

  // Fetch Projects
  try {
    const res = await fetch(`${STRAPI_URL}/api/projects?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.projects = data.data.map((item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let gallery = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          gallery = attrs.gallery.data.map(
            (img) => `${STRAPI_URL}${img.attributes?.url || img.url}`
          );
        } else if (Array.isArray(attrs.gallery)) {
          gallery = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        let documentationUrl = null;
        if (attrs.documentation?.data?.attributes?.url) {
          documentationUrl = `${STRAPI_URL}${attrs.documentation.data.attributes.url}`;
        } else if (attrs.documentation?.url) {
          documentationUrl = `${STRAPI_URL}${attrs.documentation.url}`;
        }

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: imageUrl,
          gallery: gallery,
          documentation: documentationUrl,
          tags: attrs.tags || "",
          color: attrs.color || "from-blue-500/20 to-cyan-500/20",
          order: attrs.order || 0,
        };
      });
      console.log(`  ? Projects: ${results.projects.length} entries`);
    } else {
      console.log("  ??  Projects: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Projects: CMS not reachable, will use fallback data");
  }

  // Fetch Certifications
  try {
    const res = await fetch(`${STRAPI_URL}/api/certifications?populate=*`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.certifications = data.data.map((item) => {
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
          image: imageUrl,
          date: attrs.date,
          category: attrs.category,
          description: attrs.description,
        };
      });
      console.log(`  ? Certifications: ${results.certifications.length} entries`);
    } else {
      console.log("  ??  Certifications: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Certifications: CMS not reachable, will use fallback data");
  }

  // Fetch Homelabs
  try {
    const res = await fetch(`${STRAPI_URL}/api/homelabs?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.homelabs = data.data.map((item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let gallery = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          gallery = attrs.gallery.data.map(
            (img) => `${STRAPI_URL}${img.attributes?.url || img.url}`
          );
        } else if (Array.isArray(attrs.gallery)) {
          gallery = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        let documentationUrl = null;
        if (attrs.documentation?.data?.attributes?.url) {
          documentationUrl = `${STRAPI_URL}${attrs.documentation.data.attributes.url}`;
        } else if (attrs.documentation?.url) {
          documentationUrl = `${STRAPI_URL}${attrs.documentation.url}`;
        }

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: imageUrl,
          gallery: gallery,
          documentation: documentationUrl,
          status: attrs.status,
          onlineText: attrs.onlineText,
          features: attrs.features || [],
          stats: attrs.stats || [],
          order: attrs.order || 0,
        };
      });
      console.log(`  ? Homelabs: ${results.homelabs.length} entries`);
    } else {
      console.log("  ??  Homelabs: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Homelabs: CMS not reachable, will use fallback data");
  }

  // Fetch Events
  try {
    const res = await fetch(`${STRAPI_URL}/api/events?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.events = data.data.map((item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let gallery = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          gallery = attrs.gallery.data.map(
            (img) => `${STRAPI_URL}${img.attributes?.url || img.url}`
          );
        } else if (Array.isArray(attrs.gallery)) {
          gallery = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          date: attrs.date,
          location: attrs.location,
          image: imageUrl,
          gallery: gallery,
          order: attrs.order || 0,
        };
      });
      console.log(`  ? Events: ${results.events.length} entries`);
    } else {
      console.log("  ??  Events: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Events: CMS not reachable, will use fallback data");
  }

  // Fetch Memberships
  try {
    const res = await fetch(`${STRAPI_URL}/api/memberships?populate=*&sort=order:asc`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      results.memberships = data.data.map((item) => {
        const attrs = item.attributes || item;
        let imageUrl = null;
        if (attrs.image?.data?.attributes?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
        } else if (attrs.image?.url) {
          imageUrl = `${STRAPI_URL}${attrs.image.url}`;
        }

        let gallery = [];
        if (attrs.gallery?.data && Array.isArray(attrs.gallery.data)) {
          gallery = attrs.gallery.data.map(
            (img) => `${STRAPI_URL}${img.attributes?.url || img.url}`
          );
        } else if (Array.isArray(attrs.gallery)) {
          gallery = attrs.gallery.map((img) => `${STRAPI_URL}${img.url}`);
        }

        return {
          id: attrs.manualId || item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: imageUrl,
          gallery: gallery,
          order: attrs.order || 0,
        };
      });
      console.log(`  ? Memberships: ${results.memberships.length} entries`);
    } else {
      console.log("  ??  Memberships: 0 entries (using fallback)");
    }
  } catch (err) {
    console.log("  ? Memberships: CMS not reachable, will use fallback data");
  }

  // Write to file
  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(process.cwd(), "src", "data", "cms-data.json");

  // Create directory if needed
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n?? CMS data snapshot saved to src/data/cms-data.json`);
  console.log(`   Fetched at: ${results.fetchedAt}\n`);
}

fetchCmsData().catch((err) => {
  console.error("Failed to fetch CMS data:", err);
  process.exit(0); // Don't fail the build � fallback data will be used
});
