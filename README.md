# nikhilbhatt-15.github.io

My portfolio, with a movie theme. It covers the products I've built (with downloads and
install guides), my work history, early projects, notes, and a movie diary.

**Live:** https://nikhilbhatt-15.github.io

## Features

- **Opening titles.** A film-leader countdown (once per session, skippable, off with
  reduced motion), letterbox bars that open on load, and a name sized to fill the width.
- **Now showing.** Every product gets a generated movie poster (SVG, no image files) and a
  page with a "ticket" download, SHA-256 with a copy button, install steps, usage and a
  keyboard-shortcut table.
- **Always current.** Version, file size, release date, download link and SHA-256 are
  read from each product's latest GitHub release at build time. The site rebuilds daily,
  so shipping a release updates the site automatically.
- **Filmography and Early works.** Experience timeline, skills, education, and an archive
  of learning-era projects.
- **The watchlist.** A Letterboxd-style movie diary with half-star ratings, likes,
  rewatches, film of the month/week, Favourite Four, stats and a ratings histogram.
- **Director's notes.** A Markdown blog with RSS.
- Film grain, a projector-light cursor glow, a scroll timecode and end credits. Responsive
  and accessible, and fast because it's static HTML with almost no JavaScript.

## Updating the site

There are three ways, from easiest to most hands-on.

### 1. In the browser (no code): Pages CMS

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open `NikhilBhatt-15/NikhilBhatt-15.github.io`.
3. Use the sidebar: 🎬 Movie diary, ✍️ Notes, 📦 Products, 🎞️ Early works,
   👤 Profile, 💼 Experience. Edit, then **Save**.

Saving commits to GitHub, and the site redeploys in about a minute. Works from your phone too.

### 2. From the terminal: one command

```bash
npm run new movie "Past Lives"          # finds poster, year, director automatically
npm run new movie "Dune" -- --year 2021 # pick the right one when titles repeat
npm run new note "How I built X"        # new blog post (starts as a draft)
npm run new project "My Thing"          # new Early works entry
npm run new product mytool              # new product page (starts as a draft)
```

Then edit the file it prints (rating, one-liner, review) and push.

Movie lookups use Wikipedia and need no key. For better posters, wide backdrops and
runtimes, get a free [TMDB API key](https://www.themoviedb.org/settings/api) and run
`set TMDB_API_KEY=...` (PowerShell: `$env:TMDB_API_KEY="..."`) before `npm run new movie`.

### 3. Edit the files directly

| To change… | Edit |
|---|---|
| Name, tagline, about, "currently", stats, skills, links, education | `src/data/profile.yaml` |
| Jobs | `src/data/experience.yaml` |
| Résumé PDF | replace `public/resume.pdf` |
| A product's text, install steps, shortcuts, poster colours | `src/content/products/<name>.md` |
| Movies | `src/content/movies/*.md` |
| Blog posts | `src/content/notes/*.md` |
| Early works | `src/content/projects/*.md` (screenshots go in `public/projects/`) |

Common moves:

- **Film of the month:** add `pick: month` to a movie (or `pick: week`). The newest
  movie with a pick wins, so you never need to un-pick the old one.
- **Favourite Four:** set `favorite: true` on four movies.
- **Hide something:** `draft: true`. Drafts show on `npm run dev` but not on the live site.
- **Write a review:** put it under the `---` in the movie's file. Leave it empty to just
  log the watch.
- **New product release:** just publish the GitHub release. The site picks it up on the next
  daily build, or run the **Deploy** workflow from the Actions tab to update right away.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321 (drafts visible)
npm run build    # static site in dist/
```

Requires Node 22+. Set `GITHUB_TOKEN` to avoid GitHub API rate limits when building often.

## How it works

- **[Astro](https://astro.build) 7**, fully static. Content lives in typed
  [content collections](src/content.config.ts), so a typo in a date or rating fails the
  build with a clear message instead of breaking the page.
- **Release data:** [`src/lib/releases.ts`](src/lib/releases.ts) calls the GitHub API
  (`/releases/latest`) for each product and uses the asset's `digest` as the SHA-256.
  If GitHub is unreachable, the build still succeeds and links to the releases page.
- **Posters:** [`src/components/Poster.astro`](src/components/Poster.astro) draws each
  product's one-sheet in SVG from the `poster` colours and `motif` in its frontmatter
  (`stack`, `lens`, `nib`, `runner`, `seats`, `jet`).
- **Hosting:** GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
  which runs on every push, daily at 02:30 UTC, and on demand.
- **Custom domain:** add the domain in repo Settings › Pages, then set the repository
  variable `SITE_URL` (e.g. `https://nikhilbhatt.tech`) so canonical URLs and the sitemap
  match.

The design came from studying a few sites with REA browser captures. The dated
experience timeline with stack chips and the cursor spotlight are from brittanychiang.com. The full-bleed type sized to
fill the frame is from a24films.com, which does it with CSS variables set by a JS
measuring pass. The minimal writing list is from leerob.com, and the diary, ratings and
Favourite Four are from Letterboxd.

## Credits

Fonts: Inter Tight, Instrument Serif and JetBrains Mono (SIL OFL), self-hosted via
Fontsource. Movie posters are loaded from Wikipedia/TMDB for commentary and review.
