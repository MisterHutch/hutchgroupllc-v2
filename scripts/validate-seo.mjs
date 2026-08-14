import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const canonicalOrigin = "https://hutchgroupllc.com";
const errors = [];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "scripts"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim();
}

function canonicalRoute(file) {
  const name = relative(root, file).replaceAll("\\", "/");
  if (name === "hutchgroup_production_website.html") return "/";
  if (name === "404.html") return null;
  return `/${name.replace(/index\.html$/, "")}`;
}

const htmlFiles = await walk(root);
const indexableRoutes = new Set();

for (const file of htmlFiles) {
  const name = relative(root, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const robots = match(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) ?? "index,follow";
  const route = canonicalRoute(file);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;

  if (!title) errors.push(`${name}: missing title`);
  if (!description) errors.push(`${name}: missing meta description`);
  if (h1Count !== 1) errors.push(`${name}: expected one H1, found ${h1Count}`);

  if (route && !robots.includes("noindex")) {
    indexableRoutes.add(route);
    const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const expected = `${canonicalOrigin}${route}`;
    if (canonical !== expected) errors.push(`${name}: canonical should be ${expected}, found ${canonical ?? "none"}`);
    if (!/<script\s+type=["']application\/ld\+json["']/.test(html)) errors.push(`${name}: missing JSON-LD`);
    for (const block of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(block[1]); } catch { errors.push(`${name}: invalid JSON-LD`); }
    }
  }
}

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) errors.push("robots.txt: canonical sitemap URL missing");

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapRoutes = new Set([...sitemap.matchAll(/<loc>https:\/\/hutchgroupllc\.com([^<]*)<\/loc>/g)].map((m) => m[1]));
for (const route of indexableRoutes) if (!sitemapRoutes.has(route)) errors.push(`sitemap.xml: missing ${route}`);
for (const route of sitemapRoutes) if (!indexableRoutes.has(route)) errors.push(`sitemap.xml: ${route} has no indexable HTML page`);

const config = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
if (!config.redirects?.some((item) => item.has?.some((rule) => rule.type === "host" && rule.value === "www.hutchgroupllc.com") && item.destination.startsWith(canonicalOrigin))) errors.push("vercel.json: www-to-apex redirect missing");

if (errors.length) {
  console.error(`SEO validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${indexableRoutes.size} indexable routes.`);
