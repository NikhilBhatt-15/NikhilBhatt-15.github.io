---
name: clipstash
tagline: A clipboard that remembers everything, one shortcut away.
order: 1
repo: NikhilBhatt-15/clipstash
asset: clipstash.exe
platform: Windows 10/11
language: Rust
genre: Utility · Productivity
poster: { bg: '#14110f', ink: '#f3ead8', accent: '#ff7a3d', motif: stack }
install:
  - 'Download `clipstash.exe` with the button above. It''s a single ~2 MB file with no installer.'
  - 'Run it. clipstash sits in the notification area and starts recording what you copy.'
  - 'Open **Settings** from the tray icon and turn on **Start with Windows** if you want it at sign-in.'
usage:
  - 'Copy things as usual: text, code, links, colours, screenshots.'
  - 'Press **Win+Alt+V** anywhere. A search popup opens at your text cursor.'
  - 'Type to filter, then press **Enter**. The clip is pasted straight into the app you were in.'
  - 'Settings live in `%LOCALAPPDATA%\clipstash\settings.json` and are hand-editable.'
keys:
  - ['Win+Alt+V', 'Open / close the popup']
  - ['Enter', 'Paste the selected clip']
  - ['Shift+Enter', 'Paste trimmed (removes shared indentation)']
  - ['Ctrl+Enter', 'Copy only, no paste']
  - ['Ctrl+1 … 9', 'Paste that row']
  - ['Ctrl+P', 'Pin / unpin']
  - ['Shift+Del', 'Delete clip']
  - ['Ctrl+,', 'Settings']
stack: [Rust, Win32, SQLite, GDI+]
---

A lightweight clipboard manager that records the text and images you copy, screenshots
included, into a local SQLite database. One shortcut opens a search popup right at your
text cursor. Pick an entry and it pastes into the app you were typing in, with focus
returned to the exact control you left.

- **Code-aware.** Each clip is classified as code, link, path, colour or text. Code gets a
  monospace font and line numbers, colours get a swatch, and *Paste trimmed* strips shared
  indentation when you lift a snippet out of a nested block.
- **Images and screenshots.** Win+Shift+S, Print Screen and "Copy image" are all kept, with
  thumbnails and duplicates removed.
- **Search** across everything with highlighted hits. **Pin** what you reuse.
- **Respects password managers.** Clips that apps mark as private are never stored.
- **Matches your theme.** Follows Windows light/dark and your accent colour live, or pick
  Nord, Dracula, Catppuccin or Solarized.

## Behind the scenes

A hidden window listens with `AddClipboardFormatListener` and debounces updates with a 75 ms
timer. Everything is custom-drawn and double-buffered (GDI+ for shapes, GDI for ClearType
text), so the only stock control is the search box. Returning focus is the tricky part:
clipstash calls `SetForegroundWindow` while it's still in the foreground, re-attaches thread
input to restore the focused child control, waits for modifier keys to be released, then
sends Ctrl+V with `SendInput`.
