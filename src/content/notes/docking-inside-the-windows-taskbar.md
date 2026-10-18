---
title: How to put a widget inside the Windows taskbar
date: 2026-10-17
summary: What I learned reverse engineering TrafficMonitor to build TaskMon, a taskbar widget in one C++ file.
tags: [Windows, C++, Reverse engineering]
---

I wanted a tiny network/CPU/RAM readout that lives *in* the taskbar, not a floating window
that sits on top of it and fights everything else for z-order. The open-source
[TrafficMonitor](https://github.com/zhongyang219/TrafficMonitor) already does this well, so
instead of guessing I opened its V1.86 binary with REA and Ghidra and read how it works.
TaskMon is the result: one C++ file, no dependencies beyond Windows.

## Becoming part of the taskbar

The taskbar is a normal window of class `Shell_TrayWnd`. TrafficMonitor finds it with
`FindWindow` and creates its own window as a **child** of it. That one decision is what makes
the widget move, hide and theme along with the taskbar for free.

On Windows 10 there's room to make: the task-button strip (`MSTaskSwWClass`, inside
`ReBarWindow32`) is shrunk to leave a gap for the widget. Windows 11 is different. The
taskbar is XAML hosted in a `DesktopWindowContentBridge`, and TrafficMonitor positions itself
relative to the tray (`TrayNotifyWnd`).

TaskMon adds one step there. It uses **UI Automation** to find where the XAML task buttons
actually are, then sits in a free gap instead of covering an app icon.

## Counting bytes correctly

Network speed is just a delta: bytes now minus bytes a moment ago, times 1000, divided by the
elapsed milliseconds. The details matter more than the formula, though:

- TrafficMonitor uses `GetIfTable`, whose counters are **32-bit** and wrap at 4 GiB. A fast
  download wraps them in seconds. TaskMon uses `GetIfTable2`, which has 64-bit counters.
- A single physical adapter shows up several times (filter drivers, virtual adapters), so
  naively summing double-counts traffic. TaskMon only counts physical adapters that are up
  and aren't filter interfaces.

## CPU, RAM and the GPU

CPU comes from the `% Processor Utility` performance counter, falling back to
`GetSystemTimes`, the same as the reference. RAM is `GlobalMemoryStatusEx`. For the GPU,
TaskMon reads `\GPU Engine(*)\Utilization Percentage` with a wildcard, sums it per engine and
shows the **busiest engine**. That's how Task Manager reports GPU usage, and it's why a
game at 100% 3D doesn't read as "25%".

## What reading a binary taught me

Reading a well-built app's binary is a shortcut past a lot of trial and error. The approach
was all there: which window to parent to, which API has the right counter width, which
adapters to skip. The engineering left for me was the part I cared about: making it feel
alive, with smooth graphs, eased numbers and a little cat that runs faster when the PC is
busy.

TaskMon is [free to download](/products/taskmon/).
