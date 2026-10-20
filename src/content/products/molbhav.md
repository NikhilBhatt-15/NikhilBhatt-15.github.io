---
name: Mol-Bhav
tagline: Can you out-bargain an AI shopkeeper? Haggle in Hinglish and find the jugaad.
order: 0
repo: NikhilBhatt-15/molbhav
kind: web
live: https://molbhav-nikhil.azurewebsites.net/
badge: New
platform: Web · any browser
language: TypeScript
genre: AI game · Agent security
poster: { bg: '#1d1006', ink: '#fff3dc', accent: '#ff3d8b', motif: tag }
screenshots:
  - { src: /products/molbhav-play.webp, alt: 'Bargaining with Pinky Aunty in Sarojini Nagar: her mood, current price, discount bar and chai-cup patience meter' }
  - { src: /products/molbhav-jugaad.webp, alt: 'A JUGAAD result: the AI was talked below its own hard limit, with a signed pakka bill' }
  - { src: /products/molbhav-raju.webp, alt: 'Level 1: Raju the chaiwala opens at ₹500 for chai and bun-maska for ten' }
  - { src: /products/molbhav-home.webp, alt: 'The Mol-Bhav home page with an example chat with Bunty Bhaiya' }
usage:
  - 'Open the site and hit **Mol-bhav shuru karo**. Level 1 is Raju the chaiwala.'
  - 'Bargain in Hinglish or English. Bulk orders, real flaws, cash now, a competitor''s price and walking away all move the price, but each kind of argument counts only once.'
  - 'Watch his mood. Shopkeepers get happy, annoyed or suspicious, and the portrait reacts.'
  - 'Every shopkeeper has a **weak spot**. Find it and the AI goes below its own secret minimum. That''s a **jugaad**, worth up to 50 bonus points.'
  - 'From level 4, **Munim ji** (a second AI) audits every cheap bill, so you have to fool both agents.'
  - 'Every deal ends with an Ed25519-signed pakka bill you can verify in the browser. Put your name on the leaderboard.'
install:
  - "Clone it and add free LLM keys (Groq, Gemini or OpenRouter):\n```bash\ngit clone https://github.com/NikhilBhatt-15/molbhav.git\ncd molbhav\nnpm install\ncp .env.example .env\nnpm run dev\n```"
  - 'Open **http://localhost:5173**. No keys? `npm run mock-llm` runs a fake LLM, and a scripted offline shopkeeper keeps the game playable.'
  - 'To host it free on Azure App Service F1, run `./deploy/azure-deploy.sh` from Azure Cloud Shell. The README has the details.'
stack: [TypeScript, React 19, Vite, Hono, Node.js, LLM agents (Groq, Gemini, OpenRouter), Zod structured output, Ed25519, Azure App Service]
---

A chat bargaining game set in Indian bazaars. You haggle in Hinglish with ten AI shopkeepers:
Raju the chaiwala, Pinky Aunty from Sarojini Nagar, Bunty Bhaiya from Karol Bagh, Dhillon
Paaji the car dealer and Seth Ji the property broker, plus five bonus shops and a 🎲 random
dukaan.

Each shopkeeper has a secret lowest price and a rule never to go below it. Good bargaining gets
you close. Finding the **jugaad** that pushes the AI below its own rule is exactly how real AI
agents get manipulated. So under the chai and the Hinglish, it's an **AI-agent security test**
that anyone in India already knows how to play.

| Level | Shopkeeper | What protects them |
|---|---|---|
| 1 | ☕ Raju, chaiwala | A soft rule and a weak spot (starstruck by VIPs) |
| 2 | 👗 Pinky Aunty | Ignores sob stories. Weak spot: sweet talk |
| 3 | 📱 Bunty Bhaiya | Also ignores fake owners, officials and "SYSTEM" messages. Weak spot: greed |
| 4 | 🚗 Dhillon Paaji | Also refuses rule-change instructions, and **Munim ji** checks every bill |
| 5 | 🏢 Seth Ji | Treats everything you type as plain talk, Munim ji, and **no weak spot** |

## Behind the scenes

- **Code controls the pace; the AI plays the character.** The shopkeeper never sees its real
  minimum. Each turn, code tells it only "the lowest you may go *right now*", and that limit
  drops when your arguments are good. The model rates how convincing each message was (0–3)
  and replies in character with a mood.
- **Hard to game.** Each kind of argument counts once, copy-pasted lines earn nothing, and
  walking away works once. Code plans where the price should land each turn, with steps that
  shrink and vary, so prices never move in mechanical 10-10-10 steps.
- **The score is deterministic.** The deal price comes from the AI's structured JSON reply,
  and code compares it with the secret minimum. A cheap judge call only names your tactics.
- **Munim ji** is a second, independent agent that reviews any bill below the minimum. A
  legendary jugaad has to fool both.
- **Built to run free.** A provider chain falls back across Groq, Gemini and OpenRouter when one
  is rate-limited. Patience (chai cups) caps each game at about ten AI calls, and a scripted
  offline shopkeeper takes over if every model is busy. It's one Node process on Azure's free
  tier.
