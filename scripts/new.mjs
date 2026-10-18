#!/usr/bin/env node
// Scaffold new content.
//
//   npm run new movie "Past Lives"            looks up poster/year/director, opens a diary entry
//   npm run new movie "Dune" -- --year 2021   disambiguate by year
//   npm run new note "How I built X"
//   npm run new project "My Thing"
//   npm run new product mytool
//
// Movies use TMDB when TMDB_API_KEY is set (free key: themoviedb.org/settings/api),
// otherwise Wikipedia, which needs no key.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [kind, ...rest] = process.argv.slice(2);
const yearFlag = rest.indexOf('--year');
const year = yearFlag >= 0 ? Number(rest[yearFlag + 1]) : undefined;
const title = (yearFlag >= 0 ? rest.filter((_, i) => i !== yearFlag && i !== yearFlag + 1) : rest).join(' ').trim();

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const today = new Date().toISOString().slice(0, 10);
const q = (s) => JSON.stringify(s ?? '');

function write(dir, name, body) {
  const d = join('src', 'content', dir);
  mkdirSync(d, { recursive: true });
  let file = join(d, `${name}.md`);
  for (let i = 2; existsSync(file); i++) file = join(d, `${name}-${i}.md`);
  writeFileSync(file, body);
  console.log(`\n  ✓ created ${file}\n`);
}

if (!kind || !title) {
  console.log('Usage: npm run new <movie|note|project|product> "Title"');
  process.exit(1);
}

const UA = { 'User-Agent': 'nikhil-portfolio/1.0 (https://github.com/NikhilBhatt-15)' };

async function fromTmdb(name) {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  const api = (p, extra = '') => fetch(`https://api.themoviedb.org/3${p}?api_key=${key}${extra}`).then((r) => r.json());
  const s = await api('/search/movie', `&query=${encodeURIComponent(name)}${year ? `&year=${year}` : ''}`);
  const hit = s.results?.[0];
  if (!hit) return null;
  const d = await api(`/movie/${hit.id}`, '&append_to_response=credits');
  const img = (p, size) => (p ? `https://image.tmdb.org/t/p/${size}${p}` : undefined);
  return {
    title: d.title,
    year: Number(d.release_date?.slice(0, 4)),
    director: d.credits?.crew?.filter((c) => c.job === 'Director').map((c) => c.name).join(' & '),
    runtime: d.runtime || undefined,
    poster: img(d.poster_path, 'w500'),
    backdrop: img(d.backdrop_path, 'w1280'),
  };
}

async function wikiSummary(pageTitle) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`, {
    headers: UA,
  });
  if (!r.ok) return null;
  const s = await r.json();
  // Only accept pages Wikipedia describes as a film, e.g. "2023 film by Celine Song".
  return s.type === 'standard' && /\bfilm\b/i.test(s.description ?? '') ? s : null;
}

async function fromWikipedia(name) {
  // Exact page titles first; full-text search only as a last resort.
  const tries = [...(year ? [`${name} (${year} film)`] : []), `${name} (film)`, name];
  let sum = null;
  for (const t of tries) if ((sum = await wikiSummary(t))) break;
  if (!sum) {
    const s = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=8&format=json&srsearch=${encodeURIComponent(`${name} ${year ?? ''} film`)}`,
      { headers: UA },
    ).then((r) => r.json());
    const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
    const hits = (s.query?.search ?? []).filter((h) => norm(h.title).startsWith(norm(name)));
    for (const h of hits) if ((sum = await wikiSummary(h.title))) break;
  }
  if (!sum) return null;
  const m = (sum.description ?? '').match(/(\d{4})\b.*?film(?: by ([^,;(]+))?/i);
  const img = sum.originalimage?.source ?? sum.thumbnail?.source;
  return {
    title: sum.title.replace(/\s*\([^)]*film\)$/i, ''),
    year: m ? Number(m[1]) : year,
    director: m?.[2]?.trim(),
    poster: img?.split('?')[0],
  };
}

if (kind === 'movie') {
  let info = null;
  try {
    info = (await fromTmdb(title)) ?? (await fromWikipedia(title));
  } catch (e) {
    console.warn('  (lookup failed, filling in the basics only)', e.message);
  }
  const t = info?.title ?? title;
  console.log(info ? `  Found: ${t} (${info.year}) ${info.director ? `dir. ${info.director}` : ''}` : '  Not found online; fill in the details by hand.');
  write(
    'movies',
    slug(`${t}-${info?.year ?? ''}`),
    `---
title: ${q(t)}
year: ${info?.year ?? year ?? new Date().getFullYear()}
${info?.director ? `director: ${q(info.director)}\n` : ''}${info?.runtime ? `runtime: ${info.runtime}\n` : ''}watched: ${today}
rating: 4          # 0.5 to 5, in halves
liked: false
rewatch: false
favorite: false    # true = shows in "Favourite four"
# pick: month      # uncomment for Film of the month (or: week)
oneLiner: ""       # one sentence that sums it up
${info?.poster ? `poster: ${q(info.poster)}\n` : '# poster: https://…\n'}${info?.backdrop ? `backdrop: ${q(info.backdrop)}\n` : '# backdrop: https://…   (wide still for the film-of-the-month banner)\n'}tags: []
---

Write your review here, or delete this line and leave it empty to just log the watch.
`,
  );
} else if (kind === 'note') {
  write(
    'notes',
    slug(title),
    `---
title: ${q(title)}
date: ${today}
summary: ""
tags: []
draft: true   # set to false (or delete) to publish
---

Start writing. Use ## for section headings.
`,
  );
} else if (kind === 'project') {
  write(
    'projects',
    slug(title),
    `---
title: ${q(title)}
year: ${new Date().getFullYear()}
summary: ""
stack: []
# repo: https://github.com/NikhilBhatt-15/…
# live: https://…
# image: /projects/${slug(title)}.png   (put the file in public/projects/)
featured: false
order: 50
---
`,
  );
} else if (kind === 'product') {
  write(
    'products',
    slug(title),
    `---
name: ${q(title)}
tagline: ""
order: 50
repo: NikhilBhatt-15/${slug(title)}
asset: "*.exe"        # which release file the download button uses
platform: Windows 10/11
language: Rust
genre: Utility
poster: { bg: '#111111', ink: '#f1ebe1', accent: '#ffb547', motif: lens }   # motifs: stack lens nib runner seats jet
install:
  - Download it with the button above and run it.
usage: []
keys: []              # - ['Ctrl+K', 'What it does']
stack: []
draft: true
---

What it is and why it exists.

## Behind the scenes

How it works.
`,
  );
} else {
  console.log(`Unknown type "${kind}". Use movie, note, project or product.`);
  process.exit(1);
}
