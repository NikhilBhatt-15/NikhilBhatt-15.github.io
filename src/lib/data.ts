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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
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
