// Pulls the latest GitHub release for each product at build time, so the site always
// shows the current version, file size, download link and SHA-256 without manual edits.
// The deploy workflow rebuilds daily (and on demand) to pick up new releases.

export interface Release {
  tag: string;
  date: Date;
  url: string; // release page
  asset?: { name: string; size: number; download: string; sha256?: string };
  notes: string;
}

const cache = new Map<string, Promise<Release | null>>();

const globToRe = (g: string) => new RegExp(`^${g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`, 'i');

export function latestRelease(repo: string, assetPattern?: string): Promise<Release | null> {
  const key = `${repo}|${assetPattern ?? ''}`;
  if (!cache.has(key)) cache.set(key, load(repo, assetPattern));
  return cache.get(key)!;
}

async function load(repo: string, assetPattern?: string): Promise<Release | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers });
    if (!res.ok) return null;
    const r = await res.json();
    const re = assetPattern ? globToRe(assetPattern) : null;
    const a = (r.assets ?? []).find((x: any) => (re ? re.test(x.name) : true));
    // Prefer GitHub's own digest; fall back to a hash written in the release notes.
    const fromNotes = a && (r.body ?? '').match(new RegExp(`${a.name.replace(/[.]/g, '\\.')}[^0-9a-f]*([0-9a-f]{64})`, 'i'));
    return {
      tag: r.tag_name,
      date: new Date(r.published_at),
      url: r.html_url,
      notes: r.body ?? '',
      asset: a && {
        name: a.name,
        size: a.size,
        download: a.browser_download_url,
        sha256: a.digest?.replace(/^sha256:/, '') ?? fromNotes?.[1],
      },
    };
  } catch {
    return null; // offline builds still work; the page links to GitHub instead
  }
}

export const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);
