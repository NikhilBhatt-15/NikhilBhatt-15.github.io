import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export interface Profile {
  name: string;
  short: string;
  roles: string[];
  location: string;
  availability: string;
  email: string;
  tagline: string;
  about: string;
  now: string[];
  stats: { value: string; label: string }[];
  resume: string;
  links: Record<string, string>;
  skills: { group: string; items: string[] }[];
  education: { school: string; degree: string; years: string }[];
  credits?: { role: string; name: string }[];
  intro?: Partial<{ enabled: boolean; everyVisit: boolean; respectReducedMotion: boolean; count: number; beatMs: number; hint: string }>;
}

export const profile: Profile = parse(readFileSync('src/data/profile.yaml', 'utf8'));

/** Base-aware URL for internal links and /public files. */
export const url = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return /^(https?:|mailto:|#)/.test(path) ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });

/** Renders inline Markdown (bold, code, links) used in YAML/frontmatter strings. */
export function inlineMd(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) =>
      /^https?:/.test(href) ? `<a href="${href}" target="_blank" rel="noopener">${text}</a>` : `<a href="${url(href)}">${text}</a>`,
    );
}

/** Block Markdown for short strings: paragraphs, fenced code, plus inline formatting. */
export function blockMd(s: string): string {
  return s
    .split(/(```[a-z]*\n[\s\S]*?```)/g)
    .map((part) => {
      const fence = part.match(/^```[a-z]*\n([\s\S]*?)```$/);
      if (fence) return `<pre class="code"><code>${fence[1].replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code></pre>`;
      return part
        .split(/\n{2,}/)
        .filter((p) => p.trim())
        .map((p) => `<p>${inlineMd(p.trim())}</p>`)
        .join('');
    })
    .join('');
}

export interface Freelance {
  open: boolean;
  headline: string;
  intro: string;
  services: { title: string; blurb: string; items: string[] }[];
  process: { title: string; text: string }[];
  meetings: {
    days: string[];
    from: string;
    to: string;
    slotMinutes: number;
    timezone: string;
    weeksAhead: number;
    calLink?: string;
  };
  faq: { q: string; a: string }[];
}

export const freelance: Freelance = parse(readFileSync('src/data/freelance.yaml', 'utf8'));

export interface Spotlight {
  enabled: boolean;
  id: string;
  label: string;
  title: string;
  text: string;
  image?: string;
  cta: string;
  href: string;
  more?: string;
  delaySeconds?: number;
  hideOn?: string[];
}

export const spotlight: Spotlight = parse(readFileSync('src/data/spotlight.yaml', 'utf8'));
