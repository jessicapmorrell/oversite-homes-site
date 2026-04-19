# Oversite Homes — Marketing Site

Static marketing and lead-capture site for Oversite Homes, a virtual third-party general contracting consultancy.

## Stack
- Plain HTML, CSS, JavaScript. No build step.
- Fonts: Fraunces (Fontshare), Inter (Google Fonts)
- Deployed on Vercel

## Local preview
Open `index.html` in a browser, or run a simple static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Pages
- `index.html` — Home
- `services.html` — Four service tiers + comparison table
- `process.html` — 5-step process
- `about.html` — Story and values
- `partnership.html` — For real estate agents and brokerages
- `contact.html` — Project assessment intake form

## Contact form
The form on `contact.html` currently composes a `mailto:` to oversitehomes@gmail.com.
To receive submissions as proper emails, swap the form action to a Formspree endpoint.

## Deploy
Pushes to `main` auto-deploy via Vercel.
