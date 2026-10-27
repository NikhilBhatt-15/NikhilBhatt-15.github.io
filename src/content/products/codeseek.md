---
name: codeseek
tagline: Find code by what it does, not its name.
order: 7
repo: NikhilBhatt-15/codeseek
asset: '*.whl'
platform: Python 3.10+
language: Python
requires: Python + Ollama
demo: codeseek
badge: New
genre: Developer tool · AI
poster: { bg: '#0d1117', ink: '#e6edf3', accent: '#7ee787', motif: seek }
install:
  - 'Install [Ollama](https://ollama.com), then run `ollama pull embeddinggemma-2`. This is the model that does the searching. It runs entirely on your machine.'
  - 'Install codeseek from the wheel (the download button above), or straight from the release: `pip install https://github.com/NikhilBhatt-15/codeseek/releases/download/v0.1.0/codeseek-0.1.0-py3-none-any.whl`'
  - 'Prefer no Ollama? `pip install "codeseek[torch]"` runs the model in-process with PyTorch instead. It''s a bigger install, and slower to start each time.'
usage:
  - 'In any repository: `codeseek index`. The first run embeds every file. After that it only redoes files whose content changed.'
  - 'Ask in plain English: `codeseek search "where do we retry failed uploads"`'
  - 'Narrow it down with `--glob "src/**/*.ts"`, or get `--json` for scripts.'
  - '`codeseek shell` keeps the model loaded, so each query comes back in about 0.1 s.'
keys:
  - ['codeseek index', 'Build or update the index']
  - ['codeseek search "…"', 'Search by meaning']
  - ['codeseek shell', 'Interactive, instant queries']
  - ['codeseek status', 'What is indexed, with which model']
  - ['--update', 'Refresh the index before searching']
stack: [Python, EmbeddingGemma 2, Ollama, PyTorch, SQLite, NumPy]
---

grep finds what you can name. codeseek finds what you can only describe. Ask *"keep users signed
in when credentials expire"* and it lands on `refresh_access_token`, even though the two share
no words. It runs on Google DeepMind's brand-new **EmbeddingGemma 2** embedding model, entirely on
your own machine. No API keys, no cloud, and your code never leaves the laptop.

- **Understands meaning.** Results come from a model trained for code retrieval, not keyword matching.
- **Private and offline.** After the one-time model download, nothing touches the network.
- **Incremental.** Re-indexing an unchanged repo takes under a second. Files saved without
  changes are detected by hash and skipped.
- **Leaves your repo alone.** Indexes live in your user cache folder, and `.gitignore` is respected.
- **Two engines.** Ollama gives searches in 0.6 s. PyTorch needs nothing else installed. codeseek
  picks one for you and never mixes them in an index.
- **Agent-ready, opt-in.** An optional MCP server lets coding agents search too, but only in
  projects where you switch it on.

## Behind the scenes

Files are split into chunks that follow code structure: cuts land at top-level declarations,
decorators and doc comments stay attached, and long functions use overlapping windows. Each
chunk is embedded with the model's retrieval prompt (`title: <path> | text: <code>`), then cut
from 768 to 256 dimensions. This works because EmbeddingGemma is trained Matryoshka-style, so
the first dimensions carry most of the meaning. Vectors sit in a per-repo SQLite file. A search
is a single exact NumPy matrix product, with no approximate index to tune. Getting the CPU path
fast meant measuring: bf16 was 5× slower, int8 quantization did nothing, and capping chunks at
about 512 tokens gave a free 30%.
