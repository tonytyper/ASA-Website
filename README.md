# Armenian Student Association of UNLV

The official website for the Armenian Student Association (ASA) at the University of Nevada, Las Vegas (UNLV). ASA is a cultural organization founded in 1996 that celebrates Armenian heritage, builds community on campus, and educates the broader UNLV family about Armenian history and culture.

**Live at [asaofunlv.com](https://asaofunlv.com)**

---

## About the Project

I designed and built this site as a thank you to ASA for connecting me more with my roots and I wanted to help do the same for others. This project was made to give the organization a permanent home online to help replace a scattered presence across social media with a single place where students can learn who we are, see what's coming up, and get in touch.

The design draws directly from Armenian visual tradition: the color palette was pulled from the Armenian flag as well as other cultural artifacts like our carpets and fruits (terracotta, navy, parchment, cream). You'll also see repeating knotwork ornamentation rendered as inline SVG, and bilingual typography that uses Armenian script alongside English.

## Features

- **Single-page architecture** with smooth-scroll navigation across Hero, About, Events, Officers, and Contact sections
- **Events showcase** covering recurring programming: General Events, Hikes, and other upcoming events localized in an accessible environment
- **Officer directory** presenting the executive board and officer roles
- **Contact section** for prospective members, linked to the organization's Instagram account
- **Responsive layout** built mobile-first, with a collapsing navigation menu
- **Custom design system** defined through CSS variables for consistent theming across the site

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19.2.4 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 |
| Hosting | Vercel |
| DNS | GoDaddy, with a custom apex domain and `www` redirect |

## Design System

```
Terracotta   #C24535    Accent, borders, emphasis
Navy         #0F5066    Navigation, body text
Parchment    #D49C67    Gold detail, dividers
Cream        #F1E5CF    Primary background
Rust         #996A39    Muted text
```

Typography pairs **Playfair Display** and **Cormorant Garamond** for display and serif text with **Lato** for body copy.

## Running Locally

```bash
git clone https://github.com/YOUR_USERNAME/asa-website.git
cd asa-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed on Vercel with continuous deployment from `main`. Every push triggers a build and preview deployments are generated automatically for other branches. The production domain resolves through an A record on the apex and a CNAME on `www`, with TLS provisioned automatically.

## Contact

Instagram — [@asaofunlv](https://instagram.com/asaofunlv)
University of Nevada, Las Vegas