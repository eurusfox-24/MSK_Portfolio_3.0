/**
 * Pre-build script: Fetches all data from local Strapi CMS
 * and writes it to a static JSON file that gets bundled into the build.
 * 
 * Usage: node scripts/fetch-cms.js
 * This runs automatically before every `npm run build`.
 */

const STRAPI_URL = 'http://localhost:1337';

async function fetchCmsData() {
  console.log('📡 Fetching data from Strapi CMS...\n');

  const results = {
    projects: [],
    certifications: [],
    homelabs: [],
    fetchedAt: new Date().toISOString(),
  };

  // Fetch Projects
  try {
    const res = await fetch(`${STRAPI_URL}/api/projects?populate=*`);
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
        return {
          id: item.id || attrs.documentId,
          title: attrs.title,
          description: attrs.description,
          image: imageUrl,
          tags: attrs.tags || '',
          color: attrs.color || 'from-blue-500/20 to-cyan-500/20',
        };
      });
      console.log(`  ✅ Projects: ${results.projects.length} entries`);
    } else {
      console.log('  ⚠️  Projects: 0 entries (using fallback)');
    }
  } catch (err) {
    console.log('  ❌ Projects: CMS not reachable, will use fallback data');
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
          id: item.id || attrs.documentId,
          name: attrs.name,
          issuer: attrs.issuer,
          image: imageUrl,
          date: attrs.date,
          category: attrs.category,
          description: attrs.description,
        };
      });
      console.log(`  ✅ Certifications: ${results.certifications.length} entries`);
    } else {
      console.log('  ⚠️  Certifications: 0 entries (using fallback)');
    }
  } catch (err) {
    console.log('  ❌ Certifications: CMS not reachable, will use fallback data');
  }

  // Fetch Homelabs
  try {
    const res = await fetch(`${STRAPI_URL}/api/homelabs?populate=*`);
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      const item = data.data[0];
      const attrs = item.attributes || item;
      let imageUrl = null;
      if (attrs.image?.data?.attributes?.url) {
        imageUrl = `${STRAPI_URL}${attrs.image.data.attributes.url}`;
      } else if (attrs.image?.url) {
        imageUrl = `${STRAPI_URL}${attrs.image.url}`;
      }
      results.homelabs = [{
        title: attrs.title,
        description: attrs.description,
        image: imageUrl,
        status: attrs.status,
        onlineText: attrs.onlineText,
        features: attrs.features || [],
        stats: attrs.stats || [],
      }];
      console.log(`  ✅ Homelabs: ${results.homelabs.length} entries`);
    } else {
      console.log('  ⚠️  Homelabs: 0 entries (using fallback)');
    }
  } catch (err) {
    console.log('  ❌ Homelabs: CMS not reachable, will use fallback data');
  }

  // Write to file
  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(process.cwd(), 'src', 'data', 'cms-data.json');
  
  // Create directory if needed
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\n📦 CMS data snapshot saved to src/data/cms-data.json`);
  console.log(`   Fetched at: ${results.fetchedAt}\n`);
}

fetchCmsData().catch((err) => {
  console.error('Failed to fetch CMS data:', err);
  process.exit(0); // Don't fail the build — fallback data will be used
});
