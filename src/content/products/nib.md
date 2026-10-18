---
name: Nib
tagline: A fast, private, keyboard-first text editor that never loses a word.
order: 3
repo: NikhilBhatt-15/nib
asset: '*.zip'
platform: Windows 10/11
language: Rust
genre: Editor · Writing
poster: { bg: '#f1ebe0', ink: '#1a1612', accent: '#c2410c', motif: nib }
install:
  - 'Download the `Nib` zip with the button above and extract it anywhere. No installer and no admin rights.'
  - 'Run `nib.exe`.'
  - "Optional: to find Nib in Windows search, move it somewhere permanent (e.g. `%LOCALAPPDATA%\\Programs\\Nib`), then choose **Tools › Preferences › Add Nib to the Start menu**."
  - "Optional: enable **'Edit with Nib'** in File Explorer from the same Preferences page."
  - 'For a portable setup, put an empty file named `portable` next to `nib.exe`. All data then stays in a `data` folder beside it.'
usage:
  - 'Just type. Unsaved tabs survive closing, crashing or being killed from Task Manager.'
  - "**Ctrl+P**: quick open. Type `>` for commands, `:` for a line, `#` to search notes."
  - "**Ctrl+Shift+M**: live Markdown preview beside the editor."
  - "**Win+Alt+N** from any app: a floating scratchpad that saves as you type."
  - "**Ctrl+Alt+H**: version history. Every save keeps a copy you can compare and restore."
keys:
  - ['Ctrl+P', 'Quick open']
  - ['Ctrl+Shift+P', 'Command palette']
  - ['Ctrl+Shift+F', 'Search all notes']
  - ['Ctrl+\', 'Split view']
  - ['Ctrl+D', 'Add next match as a cursor']
  - ['Ctrl+Shift+V', 'Paste cleaned text']
  - ['Ctrl+Shift+T', 'Reopen closed tab']
  - ['Win+Alt+N', 'Global scratchpad']
stack: [Rust, Win32, Scintilla, Lexilla]
---

A native Windows text editor built on [Scintilla](https://www.scintilla.org/): one small
executable, no runtime, no account, no cloud, no telemetry. Nib keeps everything you type.
Close it with unsaved tabs and they come back next time. Kill it from Task Manager and the
last second of typing is still there.

- **Editing:** tabs, split view, multiple cursors, regex find/replace with capture groups,
  syntax highlighting for 29 languages, and line tools for sorting, de-duplicating and
  joining.
- **Big files:** a 1-million-line, 86 MB log opens in about a third of a second.
- **Reliability:** session persistence, crash recovery, atomic saves and per-save version
  history.
- **Compare** with the clipboard, the file on disk, another tab or an earlier version.
- **Snippets, templates, Markdown preview**, and optional AI (off until you turn it on).

## Behind the scenes

Untitled notes and unsaved edits go to a session store within about a second of the last
keystroke. Saves write to a temp file and swap it in, so a crash or full disk can't leave a
half-written file. Scintilla and Lexilla are compiled from vendored sources, with the Win32
shell (tabs, palette, dark-mode menus and scrollbars) written in Rust on top.
