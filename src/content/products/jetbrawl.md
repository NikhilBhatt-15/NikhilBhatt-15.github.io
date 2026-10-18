---
name: JetBrawl
tagline: A fast 2D jetpack shooter with bots and LAN multiplayer.
order: 6
repo: NikhilBhatt-15/jetbrawl
kind: coming-soon
platform: Android · Windows
language: C++
genre: Game · Multiplayer
poster: { bg: '#170f05', ink: '#fff1d6', accent: '#ffb000', motif: jet }
screenshots:
  - { src: /products/jetbrawl-action.webp, alt: 'A match against bots: headshot, kill feed, radar and jetpack fuel' }
  - { src: /products/jetbrawl-jetpack.webp, alt: Jetpacking across the map with an assault rifle }
  - { src: /products/jetbrawl-menu.webp, alt: Main menu with bots and LAN multiplayer }
  - { src: /products/jetbrawl-soldier.webp, alt: Soldier editor with hats, hair, faces and outfits }
stack: [C++, Axmol (cocos2d-x), Chipmunk physics, Tiled, RakNet / SLikeNet]
---

A dual-stick jetpack shooter for Android and Windows. It's a study of how a classic mobile
shooter plays and is put together, written from scratch on the same open-source stack:
Axmol, Chipmunk physics, Tiled maps and RakNet networking.

- **22 weapons** and four grenade types, with headshots, explosion knockback and rocket
  jumps.
- **Bots** that pathfind with A\* over a nav grid built from each map, lead moving targets,
  manage jetpack fuel and pick up better weapons.
- **LAN multiplayer:** one phone hosts, the others find it automatically, and players can
  drop in mid-match.
- **Configurable** weapons and physics in JSON, and maps as standard Tiled `.tmx` files.

## Behind the scenes

The simulation runs Chipmunk at 60 Hz with two substeps. Networking is a host-relayed star.
Each device simulates its own soldier, so movement feels instant. Owners broadcast state at
20 Hz, and the shooter's device decides hits. The host arbitrates pickups and owns the clock.
Remote soldiers are extrapolated and smoothed.
