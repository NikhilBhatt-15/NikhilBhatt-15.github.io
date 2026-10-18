---
name: TaskMon
tagline: Live network, CPU and RAM in your taskbar, with a cat that runs faster when your PC works harder.
order: 4
repo: NikhilBhatt-15/taskmon
asset: '*.zip'
platform: Windows 10/11
language: C++
genre: Widget · System
poster: { bg: '#101a14', ink: '#e6f5ea', accent: '#3ddc84', motif: runner }
install:
  - 'Download the `TaskMon` zip with the button above and extract it anywhere.'
  - 'Run `TaskMon.exe`. It docks inside the taskbar itself.'
  - 'Right-click the widget and tick **Start with Windows** to launch it at sign-in.'
  - 'Keep the `characters` folder next to the exe to get the bundled GIFs.'
usage:
  - "Right-click → **Style** to choose Subtle, Cards, Rings or Classic."
  - "Right-click → **Character** to pick a cat, parrot, horse, fox, dog or wolf, and what makes it run faster (CPU, RAM or network)."
  - 'Drop any `.gif` into the `characters` folder to add your own runner.'
  - 'Hover for details, including adapter name, link speed and today''s upload/download totals.'
stack: [C++17, Win32, PDH, IP Helper, UI Automation, GDI+]
---

A lightweight taskbar widget that shows live **network speed, CPU and RAM**, with an
optional running character inspired by RunCat. It docks *inside* the taskbar rather than
floating over it, and the whole program is one C++ file with no dependencies beyond Windows.

- **Four styles:** Subtle, Cards, Rings and Classic, all with smooth scrolling graphs and
  values that ease to new numbers.
- **Running character** that speeds up with CPU, RAM or network load. Add your own GIFs.
- **Optional GPU and disk**, with GPU measured as the busiest engine, the way Task Manager
  does.
- Follows the taskbar theme, works at any scaling, and re-attaches itself if Explorer
  restarts.

## Behind the scenes

The docking and stats techniques came from reverse engineering the open-source
TrafficMonitor binary with REA and Ghidra. TaskMon uses the same `Shell_TrayWnd` child-window
approach, and on Windows 11 it adds UI Automation to find the XAML task buttons and sit in a
free gap. Network counters use 64-bit `GetIfTable2` (TrafficMonitor's 32-bit counters wrap at
4 GiB), counting only physical adapters so filter drivers aren't counted twice.
