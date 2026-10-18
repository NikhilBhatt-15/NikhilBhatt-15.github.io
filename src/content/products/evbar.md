---
name: evbar
tagline: Search every file on your PC from a box above the taskbar.
order: 2
repo: NikhilBhatt-15/evbar
asset: evbar.exe
platform: Windows 10/11
language: Rust
genre: Utility · Search
poster: { bg: '#0c1220', ink: '#e8f0ff', accent: '#5ab0ff', motif: lens }
screenshots:
  - { src: /products/evbar-dark.png, alt: evbar dark theme showing search results above the tray }
  - { src: /products/evbar-tips.png, alt: Search tips listed in the empty box }
  - { src: /products/evbar-scope.png, alt: Search limited to one folder }
  - { src: /products/evbar-light.png, alt: evbar light theme }
install:
  - 'Install and run [Everything](https://www.voidtools.com/) by Voidtools. evbar queries it, so it needs to be running.'
  - 'Download `evbar.exe` with the button above (one 190 KB file) and run it.'
  - 'To start it at sign-in, put a shortcut to `evbar.exe --hidden` in `shell:startup`.'
usage:
  - 'Press **Win+Alt+Space** and start typing. Results update on every keystroke.'
  - 'Press the hotkey while File Explorer is in front to search only the folder it shows.'
  - 'Or right-click any folder and choose **Search here with evbar** (run `evbar.exe --install-menu` once).'
  - 'Open the empty box to see Everything''s search tricks, such as `ext:pdf`, `dm:today` or `size:>500mb`.'
  - 'Run `evbar.exe --pinned` to keep it on screen permanently, like a taskbar search box.'
keys:
  - ['Win+Alt+Space', 'Show / hide (change with --hotkey)']
  - ['↑ ↓  PgUp PgDn', 'Move selection']
  - ['Enter', 'Open the selected item']
  - ['Ctrl+Enter', 'Show it in Explorer']
  - ['Backspace (at start)', 'Remove the folder scope']
  - ['Esc', 'Hide']
stack: [Rust, Win32, WM_COPYDATA IPC, DWM]
---

A compact, rounded search box that floats just above the Windows tray and searches
[Everything](https://www.voidtools.com/) as you type. It talks to the running Everything
process directly over its `WM_COPYDATA` IPC. There's no SDK DLL, no disk scanning and no
runtime: one 190 KB executable.

- **Instant results.** A worker thread always sends the newest query and drops older ones.
  Replies to superseded queries are ignored by reply id, so typing never queues work.
- **Sits above the tray.** It follows the taskbar to any edge and repositions on DPI,
  display and Explorer restarts.
- **Teaches the syntax.** The empty box lists search tricks, and when a search matches too
  much, the footer suggests how to narrow it.
- **100 at a time, more on request**, with a *Show 100 more* button.

## Behind the scenes

Everything owns a hidden window of class `EVERYTHING_TASKBAR_NOTIFICATION`. evbar finds it
with `FindWindowW` and sends a `QUERY2` struct (reply window, reply id, flags, offset, max
results, wanted fields, sort) as `WM_COPYDATA`. The reply comes back the same way and is
parsed into rows. The test suite includes a mock Everything server that indexes a real
directory, so the protocol is tested end to end without the real app.
