---
name: showbuzz
tagline: A full movie-ticketing platform, from seat maps to e-tickets, running on your machine.
order: 5
repo: NikhilBhatt-15/showbuzz
kind: self-host
platform: Docker
language: Go · React
genre: Full stack · Distributed systems
poster: { bg: '#1a0b10', ink: '#ffe9ee', accent: '#ff3d5a', motif: seats }
demo: showbuzz
install:
  - 'Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine with Compose v2).'
  - "Clone and start it:\n```bash\ngit clone https://github.com/NikhilBhatt-15/showbuzz.git\ncd showbuzz\ndocker compose up -d --build\n```"
  - 'Open **http://localhost:8080** for the app and **http://localhost:8025** for the Mailpit inbox. The first start seeds about 7,300 shows across 80 cinemas, which takes about a minute.'
usage:
  - 'Sign in with any e-mail or 10-digit mobile number. The OTP is shown in the dialog.'
  - "Test cards: `4111 1111 1111 1111` succeeds and `4000 0000 0000 0002` is declined. UPI `fail@upi` is declined."
  - 'Open the same show in two browsers and try to grab the same seat. Only one of you gets it.'
  - 'Run `SEAT_HOLD_SECONDS=60 docker compose up -d trans` to watch seat holds expire quickly.'
stack: [Go, React 18 SSR, Redux Toolkit, Postgres, Redis, Kafka (Redpanda), Nginx, Docker]
---

A full-stack, Docker-based replica of a large movie-ticketing platform: city selection,
discovery, movie pages, showtimes, live seat maps with seat locking, food add-ons, OTP
sign-in, checkout, e-tickets and cancellations. The architecture follows what the real
platform's web app does, captured first-hand with REA browser instrumentation.

> Educational project with its own brand and generated artwork. Every movie, cinema and
> venue is fictional, and no real payments happen.

- **Server-rendered React** with RTK Query, prefetched per route and hydrated from
  `window.__INITIAL_STATE__`.
- **Server-driven discovery UI:** the API returns widgets and the client renders them
  generically.
- **Seat locking** with atomic multi-seat Redis Lua scripts and a 10-minute hold. Concurrent
  buyers can't get the same seat, and a Postgres primary key is the final guard.
- **Event-driven notifications** over Kafka for OTPs, tickets and refunds.
- **Edge gateway** with caching, rate limiting and prefix routing.

## Behind the scenes

`POST /transactions` runs one Lua script that sweeps expired locks, fails if any requested
seat is held by someone else, and otherwise `ZADD`s every seat with its expiry. Payment
re-verifies each lock, then inserts the booking and its seats in a single Postgres
transaction. A unique-key violation aborts it. The confirmation is published to Kafka, and a
consumer group sends the e-ticket.
