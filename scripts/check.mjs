// Static quality checks for the HTML pages (no dependencies).
// Usage: node scripts/check.mjs
// Checks: internal links and #anchors resolve, ids are unique, every <img> has alt,
// width and height, required meta tags exist, no leftover template tokens,
// and the design-skill files exist (and the two SKILL.md copies match).
import { readFile, readdir, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[1], "..", "..");
const pages = (await readdir(root)).filter((f) => f.endsWith(".html"));
const problems = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

const exists = async (p) => access(p).then(() => true, () => false);
const docs = {};
for (const page of pages) docs[page] = await readFile(join(root, page), "utf8");
const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

for (const [page, html] of Object.entries(docs)) {
  // unique ids
  const ids = idsOf(html);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(page, `duplicate ids: ${[...new Set(dupes)].join(", ")}`);

  // meta
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(page, "missing or short <title>");
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail(page, "missing meta description");
  if (!/<html lang="/.test(html)) fail(page, "missing lang attribute");
  if (!/name="viewport"/.test(html)) fail(page, "missing viewport meta");
  if (/\{\{|\}\}|lorem ipsum|TODO/i.test(html)) fail(page, "template token, lorem ipsum or TODO left in page");

  // images
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) fail(page, `img without alt: ${tag.slice(0, 80)}`);
    if (/data-lightbox-img/.test(tag)) continue; // filled at runtime
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) fail(page, `img without width/height: ${tag.slice(0, 80)}`);
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (src && !/^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/.test(src) && !(await exists(join(root, src)))) fail(page, `missing image ${src}`);
  }

  // links
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href === "#") { fail(page, 'empty link href="#"'); continue; }
    const [file, hash] = href.split("#");
    const target = file || page;
    if (file && !(await exists(join(root, file)))) { fail(page, `broken link ${href}`); continue; }
    if (hash) {
      const targetHtml = docs[target] ?? (await readFile(join(root, target), "utf8"));
      if (!idsOf(targetHtml).includes(hash)) fail(page, `missing anchor ${href}`);
    }
  }

  // buttons need a type and a label
  for (const [tag, inner] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    if (!/\stype="/.test(tag)) fail(page, `button without type: ${tag.slice(0, 60)}`);
    if (!inner.replace(/<[^>]+>/g, "").trim() && !/aria-label=/.test(tag)) fail(page, "button without accessible text");
  }

  // form controls need labels
  for (const [, id] of html.matchAll(/<(?:input|select|textarea)\b[^>]*\sid="([^"]+)"/g)) {
    if (!html.includes(`for="${id}"`)) fail(page, `form control #${id} has no <label for>`);
  }
}

// Required project files
const required = [
  "design-research.md",
  "DESIGN_SYSTEM.md",
  "COMPONENT_GUIDELINES.md",
  "skills/aesthetics-web-design/SKILL.md",
  ".claude/skills/aesthetics-web-design/SKILL.md",
];
for (const f of required) if (!(await exists(join(root, f)))) fail("project", `missing ${f}`);
if (await exists(join(root, required[3])) && await exists(join(root, required[4]))) {
  const [a, b] = await Promise.all([readFile(join(root, required[3]), "utf8"), readFile(join(root, required[4]), "utf8")]);
  if (a !== b) fail("project", "skills/aesthetics-web-design/SKILL.md and .claude/skills/aesthetics-web-design/SKILL.md differ — run `npm run sync-skill`");
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages checked: links, anchors, ids, images, labels, metadata and skill files OK`);
