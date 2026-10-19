import { readFile, readdir, stat } from "node:fs/promises";
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
const titles = new Map();
const descriptions = new Map();
const pages = new Map();

const decodeAttribute = value => value.replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
function uniqueMetadata(value, seen, name, kind) {
  if (!value) return;
  const normalized = decodeAttribute(value).replace(/\s+/g, " ").toLowerCase();
  if (seen.has(normalized)) errors.push(`${name}: duplicate ${kind} also used by ${seen.get(normalized)}`);
  else seen.set(normalized, name);
}

for (const file of htmlFiles) {
  const name = relative(root, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const title = match(html, /<title>([^<]+)<\/title>/i);
  const description = match(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const robots = match(html, /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) ?? "index,follow";
  const route = canonicalRoute(file);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  pages.set(file, { name, html, route, ids: new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1])) });

  if (!title) errors.push(`${name}: missing title`);
  if (!description) errors.push(`${name}: missing meta description`);
  if (h1Count !== 1) errors.push(`${name}: expected one H1, found ${h1Count}`);

  if (route && !robots.includes("noindex")) {
    indexableRoutes.add(route);
    uniqueMetadata(title, titles, name, "title");
    uniqueMetadata(description, descriptions, name, "meta description");
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
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (new Set(sitemapLocations).size !== sitemapLocations.length) errors.push("sitemap.xml: duplicate URLs");
for (const location of sitemapLocations) {
  if (!location.startsWith(canonicalOrigin + "/")) errors.push(`sitemap.xml: non-canonical origin ${location}`);
}
for (const [, date] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) errors.push(`sitemap.xml: invalid lastmod ${date}`);
}
for (const route of indexableRoutes) if (!sitemapRoutes.has(route)) errors.push(`sitemap.xml: missing ${route}`);
for (const route of sitemapRoutes) if (!indexableRoutes.has(route)) errors.push(`sitemap.xml: ${route} has no indexable HTML page`);

// Check the actual internal journey, including fragments, without a browser or network.
const graph = new Map();
let checkedLinks = 0;
for (const { name, html, route } of pages.values()) {
  const outgoing = new Set();
  for (const [, rawHref] of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    let url;
    try { url = new URL(decodeAttribute(rawHref), canonicalOrigin + (route || "/404.html")); }
    catch { errors.push(`${name}: invalid link ${rawHref}`); continue; }
    if (url.origin !== canonicalOrigin || url.pathname.startsWith("/api/")) continue;
    checkedLinks++;
    const targetPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    let target = resolve(root, targetPath || ".");
    if (target !== root && !target.startsWith(root + "/")) { errors.push(`${name}: link escapes site ${rawHref}`); continue; }
    try {
      if ((await stat(target)).isDirectory()) target = join(target, "index.html");
      await stat(target);
    } catch { errors.push(`${name}: missing internal target ${rawHref}`); continue; }
    const targetPage = pages.get(target);
    if (url.hash && targetPage && !targetPage.ids.has(decodeURIComponent(url.hash.slice(1)))) errors.push(`${name}: missing fragment target ${rawHref}`);
    if (targetPage?.route) outgoing.add(targetPage.route);
  }
  if (route) graph.set(route, outgoing);
}
const reachable = new Set(["/"]);
const queue = ["/"];
for (let i = 0; i < queue.length; i++) {
  for (const route of graph.get(queue[i]) || []) {
    if (!reachable.has(route)) { reachable.add(route); queue.push(route); }
  }
}
for (const route of indexableRoutes) if (!reachable.has(route)) errors.push(`${route}: no crawlable link path from the homepage`);

const config = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
if (!config.redirects?.some((item) => item.has?.some((rule) => rule.type === "host" && rule.value === "www.hutchgroupllc.com") && item.destination.startsWith(canonicalOrigin))) errors.push("vercel.json: www-to-apex redirect missing");

if (errors.length) {
  console.error(`SEO validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} HTML files, ${indexableRoutes.size} indexable routes, and ${checkedLinks} internal links; all indexable pages are reachable from the homepage.`);

