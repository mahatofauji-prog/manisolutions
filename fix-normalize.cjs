const fs = require('fs');
let code = fs.readFileSync('src/services/websiteTemplatesStorage.ts', 'utf8');

const target = `export function normalizeTemplate(raw: any): WebsiteTemplate {
  let cats: string[] = [];
  if (Array.isArray(raw.categories) && raw.categories.length > 0) {
    cats = raw.categories.filter((c: any) => typeof c === 'string' && c.trim().length > 0);
  } else if (raw.category && typeof raw.category === 'string' && raw.category.trim().length > 0) {
    cats = [raw.category.trim()];
  } else {
    cats = ['services'];
  }
    
  // Deduplicate case-insensitively
  const seen = new Set<string>();
  const uniqueCats: string[] = [];
  for (const c of cats) {
    const lower = c.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueCats.push(c);
    }
  }

  return {
    ...raw,
    categories: uniqueCats,
    category: uniqueCats[0] || raw.category || 'services'
  };
}`;

const replacement = `export function normalizeTemplate(raw: any): WebsiteTemplate {
  let cats: string[] = [];
  if (Array.isArray(raw.categories)) {
    cats = raw.categories
      .map((c: any) => typeof c === 'object' && c !== null ? (c.id || c.name || '') : c)
      .filter((c: any) => typeof c === 'string' && c.trim().length > 0);
  }
  if (cats.length === 0 && raw.category) {
    const fallback = typeof raw.category === 'object' && raw.category !== null 
      ? (raw.category.id || raw.category.name || '') 
      : raw.category;
    if (typeof fallback === 'string' && fallback.trim().length > 0) {
      cats = [fallback.trim()];
    }
  }
  if (cats.length === 0) {
    cats = ['services'];
  }
  const seen = new Set<string>();
  const uniqueCats: string[] = [];
  for (const c of cats) {
    const lower = String(c).toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueCats.push(String(c));
    }
  }
  return {
    ...raw,
    categories: uniqueCats,
    category: uniqueCats[0] || 'services'
  };
}`;

if (code.includes('cats = raw.categories.filter((c: any) => typeof c === \'string\' && c.trim().length > 0);')) {
  // It's in the file, use a regex to replace it
  const regex = /export function normalizeTemplate\(raw: any\): WebsiteTemplate \{[\s\S]*?category: uniqueCats\[0\] \|\| raw\.category \|\| 'services'\n  \};\n\}/m;
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/services/websiteTemplatesStorage.ts', code);
  console.log("Success");
} else {
  console.log("Not found");
}
