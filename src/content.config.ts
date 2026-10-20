import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// Everything on the site comes from these files. Edit them (or use Pages CMS) and push.

/** Products: things people can download and use. One Markdown file each in src/content/products. */
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    order: z.number().default(99),
    repo: z.string(), // "owner/name" on GitHub
    // Which release file the big download button points at, e.g. "*.exe" or "*.zip".
    asset: z.string().optional(),
    platform: z.string(), // shown as the "rating" on the poster, e.g. "Windows 10/11"
    language: z.string(),
    kind: z.enum(['download', 'web', 'self-host', 'coming-soon']).default('download'),
    live: z.url().optional(), // for kind: web, the URL people play/use it at
    badge: z.string().optional(), // small label on the card, e.g. New
    genre: z.string(), // e.g. "Utility · Productivity"
    // Poster colours: background, ink, accent.
    poster: z.object({ bg: z.string(), ink: z.string(), accent: z.string(), motif: z.string() }),
    // Interactive in-browser demo shown on the product page and in the home page's screening room.
    demo: z.enum(['evbar', 'clipstash', 'taskmon', 'showbuzz', 'nib']).optional(),
    screenshots: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    install: z.array(z.string()).default([]), // numbered install steps (Markdown allowed)
    usage: z.array(z.string()).default([]),
    keys: z.array(z.tuple([z.string(), z.string()])).default([]), // [shortcut, action]
    stack: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Early works: projects built while learning. src/content/projects. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    repo: z.string().optional(),
    live: z.string().optional(),
    image: z.string().optional(), // path under /public, e.g. /projects/stayfinder.png
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

/** Notes: the blog. src/content/notes. */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Movies: diary, reviews, favourites. src/content/movies. Body is the review (optional). */
const movies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/movies' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    director: z.string().optional(),
    runtime: z.number().optional(), // minutes
    watched: z.coerce.date(),
    rating: z.number().min(0.5).max(5).multipleOf(0.5).optional(),
    poster: z.string().optional(),
    backdrop: z.string().optional(),
    liked: z.boolean().default(false),
    rewatch: z.boolean().default(false),
    favorite: z.boolean().default(false), // shows in "Favourite Four"
    pick: z.enum(['month', 'week']).optional(), // "Film of the month/week"
    oneLiner: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Work history, from src/data/experience.yaml. */
const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    url: z.string().optional(),
    location: z.string(),
    start: z.string(),
    end: z.string(),
    points: z.array(z.string()),
    stack: z.array(z.string()).default([]),
  }),
});

export const collections = { products, projects, notes, movies, experience };
