---
name: hop
tagline: Open apps, find files and do math from one box, with one hotkey.
order: 8
repo: NikhilBhatt-15/hop
asset: hop.exe
platform: Windows 10/11
language: Rust
genre: Utility · Launcher
poster: { bg: '#1c1020', ink: '#fbeef3', accent: '#ff8a5c', motif: hop }
screenshots:
  - { src: /products/hop-dark.png, alt: hop showing an app and file results for "photoshop" }
  - { src: /products/hop-tips.png, alt: Tips in the empty box on first run }
  - { src: /products/hop-calc.png, alt: A calculation with the result ready to copy }
  - { src: /products/hop-light.png, alt: hop light theme }
install:
  - 'Download `hop.exe` with the button above (one ~380 KB file) and run it.'
  - 'Right-click the box and tick **Start with Windows** so it is always ready.'
  - 'Optional: run [Everything](https://www.voidtools.com/) to get file results too.'
usage:
  - 'Press **Win+`** (the key above Tab) and start typing.'
  - 'Type part of an app name (`code`, `vsc`) and press Enter to open it. Apps you use often move up.'
  - 'Type math like `24*18+7` or `15% of 80`. Enter copies the result.'
  - 'Start with `>` to run a command, for example `> ipconfig /all`.'
keys:
  - ['Win+`', 'Show / hide (change with --hotkey)']
  - ['↑ ↓', 'Move selection']
  - ['Enter', 'Open, copy the result, or run']
  - ['Ctrl+Enter', 'Show in folder']
  - ['Ctrl+Shift+Enter', 'Run as administrator']
  - ['Esc', 'Hide']
stack: [Rust, Win32, Shell COM, WM_COPYDATA IPC, REA]
---

A tiny keyboard launcher for Windows. One box opens apps (desktop and Store), finds files
through [Everything](https://www.voidtools.com/), does arithmetic, runs commands and searches
the web. It's one native ~380 KB executable using about 9 MB of memory, with no runtime and
no plugins.

- **Apps ranked the way you expect:** exact name, then prefix, word start, acronym (`vsc` →
  Visual Studio Code) and substring, plus a boost for apps you launch often.
- **Files that matter:** tool clutter is left out, and your own folders come first.
- **Easy to scan:** results grouped by type, real icons, and key hints for the selected row.

## Behind the scenes

hop was designed after inspecting Flow Launcher (197 MB) with REA. Flow builds its app list
from three scanners: Start-menu shortcuts, the registry and Store app manifests. hop reads the shell's Applications folder instead, the
list the Start menu itself shows, and launches every app through `shell:AppsFolder`. The hotkey
is a plain `RegisterHotKey` with no keyboard hook, and file search reuses evbar's
`WM_COPYDATA` client for Everything.
