# Appalachian Forest Restoration — Website

Static website for GitHub Pages. All research, species data, and the interactive planner.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source**
3. Select **"Deploy from a branch"**
4. Set branch to `main` and folder to `/docs`
5. Save — site will be live at `https://yourusername.github.io/reponame/`

## Structure

```
docs/
  index.html          — Home page
  plans.html          — The four plans (A, B, C, D)
  species.html        — Species guide with photos
  planner.html        — Interactive planner tool
  management.html     — Before you plant (C-D-L, invasives, tree protection, crop tree release)
  research.html       — Research references and local contacts
  css/main.css        — Design system
  js/main.js          — Navigation, tabs, modal
  js/planner.js       — Interactive planner logic
  js/species-data.js  — Species data + Wikimedia Commons photos
  .nojekyll           — Prevents Jekyll processing
```

## Photos

All species photos sourced from Wikimedia Commons with Creative Commons or Public Domain licenses.
Full attribution is included in `js/species-data.js` and displayed in the species modal.

## Research Base

Research compiled March 2026. Key sources:
- Penn State Extension (extension.psu.edu)
- USFS Northern Research Station (research.fs.usda.gov)
- PA DCNR Bureau of Forestry
- PA Flora Database (paenflowered.org)
- Full bibliography: see `research.html`
