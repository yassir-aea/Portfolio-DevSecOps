# DevSecOps Yassir AIT EL AIZZI Portfolio

Modern, dark, dashboard-style portfolio with neon highlights, built as a single-page site plus a projects page.

- Live widgets: skills pods, animated metrics, testimonials pipeline
- Logs: typing feed of experience and a skills journal for recruiters
- CLI contact: help, email, linkedin, github, cv, availability, rates, phone, schedule (Google Calendar)
- Projects: CRM Maroc (FR/AR content) and kubeSmartService with “Voir plus” details and install snippet
- Pipeline replays: fetch latest GitHub Actions run/last commit for public repos

## Demo (local)

```bash
# Open locally
xdg-open index.html  # or just open index.html in your browser
```

No build step required. All assets are static: `index.html`, `projects.html`, `style.css`, `script.js`, `img/`, `cvdown/`.

## Structure

```
index.html      # Main dashboard (hero, pods, testimonials, logs, metrics, contact, skills journal)
projects.html   # Projects, collapsible details, pipeline replays
style.css       # Dark neon theme, responsive grid/flex layouts
script.js       # Animations, CLI, modals, typing, replays, skills journal
img/            # Images used in the site
cvdown/         # CV PDF
```

## Key Features

- DevSecOps branding and recruiter-focused content
- Skills Journal button with Linux-style typing animation and “Tout afficher”
- Interactive CLI in Contact section
- Testimonials styled as a pipeline with arrow connectors
- Metrics animate on scroll; pods have 3D tilt and overlays

## Customization

- Text and links: edit headings and copy directly in `index.html` and `projects.html`
- CLI commands: update in `initCLI()` inside `script.js`
- Skills scores: edit in `initSkillsJournal()` inside `script.js`
- Repositories for replays: update the `repos` array in `initPipelineReplays()`

## Deploy

Any static hosting works (GitHub Pages, Netlify, Vercel, Nginx). Example (GitHub Pages):

1. Push to a public repo main branch
2. In repo Settings → Pages → Deploy from branch → `main` / root

## License

MIT
