---
name: Telly
tagline: A phone remote for your Android TV box, with channel tiles and one-tap apps.
order: 10
repo: NikhilBhatt-15/telly
asset: "telly-v*.apk"
platform: Android 8+
language: Kotlin
genre: Utility · Remote
poster: { bg: '#10141f', ink: '#eef2ff', accent: '#ff6b4a', motif: telly }
screenshots:
  - { src: /products/telly-channels.webp, alt: Channel tiles with real logos and their numbers }
  - { src: /products/telly-remote.webp, alt: 'The remote: power, app shortcuts, D-pad, volume and channel rockers' }
  - { src: /products/telly-apps.webp, alt: One-tap apps with their real icons }
install:
  - 'Open this page on your phone and download `telly-v….apk` with the button above. Open it, and allow installing from your browser if Android asks.'
  - 'Make sure the phone and the TV or box are on the same Wi-Fi.'
  - 'In Telly, open **Devices** and tap **Add a device**. Pick your TV from the list (or type its IP address), then enter the 6-character code it shows.'
usage:
  - 'Use the **Remote** tab like a normal remote. Hold the arrows to keep moving, hold OK for a long press, and use the phone''s own volume buttons for the TV volume.'
  - 'In **Channels**, tap **Popular channels**, pick one and type its number from your channel list. The logo is filled in for you. Tapping the tile switches the box to that channel.'
  - 'In **Apps**, tap Netflix, YouTube, Prime Video and the others to open them. Open any app on the TV and tap **Save as app** to add it.'
  - 'Long-press any tile to edit it. Under **Apps → + → Shortcut**, chain steps such as "open YouTube, then search for lo-fi".'
stack: [Kotlin, Jetpack Compose, Android TV Remote v2 protocol, TLS client certificates, mDNS, REA]
---

A remote for Android TV and Google TV devices, like the Airtel Xstream box and BPL's Android
TVs, made for how people in India actually watch TV: by channel number, plus a handful of
streaming apps. It talks to the TV over Wi-Fi the way Google's own remote app does, so the TV
doesn't need developer mode, and nothing goes through the internet.

- **Channel tiles with real logos.** Tap Colors or Aaj Tak and Telly opens live TV, then
  types the number for you.
- **One-tap apps with their real icons,** fetched from Google Play, and any app on the TV
  can be saved with one tap.
- **Shortcuts** that open something specific inside an app: a YouTube search, a Netflix
  show, or a string of key presses you'd otherwise do by hand.
- **Typing from your phone,** volume buttons that drive the TV, Wake-on-LAN, and several
  devices in one app.

## Behind the scenes

Android TV runs a remote service on two TLS ports. On **6467** the phone presents a
self-signed certificate, and the TV shows a code. Telly proves it saw the code with a
SHA-256 over both RSA keys. On **6466** it then sends length-prefixed protobuf messages:
key presses with short or long direction, app links (`market://launch?id=` opens any app),
and text. The TV reports back its power state, volume and the app on screen.

There's no protobuf or crypto library. A small codec and DER encoder keep the APK under
2 MB. The codec is checked byte for byte against the reference implementation's own schemas,
and a fake Android TV written in Python ran the whole app end to end, from pairing to tuning,
before it ever met a real box.
