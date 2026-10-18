import rss from '@astrojs/rss';
import { getNotes } from '../lib/content';
import { profile } from '../lib/data';

export async function GET(context) {
  const notes = await getNotes();
  return rss({
    title: `${profile.name}: notes`,
    description: profile.tagline,
    site: context.site,
    items: notes.map((n) => ({
      title: n.data.title,
      pubDate: n.data.date,
      description: n.data.summary,
      link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/notes/${n.id}/`,
    })),
  });
}
