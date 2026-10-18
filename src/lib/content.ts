import { getCollection } from 'astro:content';

const live = (e: { data: { draft?: boolean } }) => import.meta.env.DEV || !e.data.draft;

export const getProducts = async () =>
  (await getCollection('products', live)).sort((a, b) => a.data.order - b.data.order);

export const getProjects = async () =>
  (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);

export const getNotes = async () =>
  (await getCollection('notes', live)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

export const getMovies = async () =>
  (await getCollection('movies', live)).sort((a, b) => b.data.watched.valueOf() - a.data.watched.valueOf());

// "Jul 2025" → sortable number; "Present" sorts first.
const when = (s: string) => (/present/i.test(s) ? Infinity : Date.parse(`1 ${s}`) || 0);
export const getExperience = async () =>
  (await getCollection('experience')).sort((a, b) => when(b.data.end) - when(a.data.end) || when(b.data.start) - when(a.data.start));

/** The current "film of the month" (or week): the newest movie marked with `pick`. */
export const getPick = async () => (await getMovies()).find((m) => m.data.pick);
