# Appalachian Forest Restoration — Pocono Plateau

A research-backed guide to restoring northern hardwood forest on the Pocono Plateau (~2,000ft elevation, Zone 6a).

**[https://poconoforest.org](https://poconoforest.org)**

The live guide includes:
- **Interactive Planner** — Calculate species mix by tree count or acreage
- **Species Guide** — Detailed profiles for 65+ native trees and shrubs
- **Planting Instructions** — Step-by-step technique and timing
- **Management First** — Why management matters
- **Research & References** — Full citations to peer-reviewed science

## About This Project

The beech trees are dying. Gaps in the canopy are an opportunity. This guide walks you through planting the right species in the right places, whether you have an afternoon or a decade.

Every recommendation is grounded in:
- USFS Silvics and current silviculture research
- Penn State Extension management studies
- Climate-adaptation literature
- Disease and pest threat assessments

## How Species Were Selected

Every tree and shrub in this guide is native to Pennsylvania at this elevation, disease-free or manageable, and validated against 40+ years of peer-reviewed silviculture research. The core principle: **restore oak-hickory co-dominance** (pre-settlement composition) rather than the modern maple-poplar drift caused by fire suppression. Seed sourced from southern PA ecotypes ensures climate resilience under warming scenarios. All species prioritize wildlife ecological value — especially insects (Lepidoptera), which are the foundation of nearly all forest food webs.

## Local Resources

- **PA Woodland Resilience Enhancement Network (PWREN)** — Up to $25,000 reimbursement (80–100%) for forest restoration practices on 10–2,500 acre properties. Launched September 2025; funding is limited.
  - Apply via your county service forester
  - [pa.gov/services/dcnr/apply-for-the-pa-woodland-resilience-enhancement-network](https://www.pa.gov/services/dcnr/apply-for-the-pa-woodland-resilience-enhancement-network)

- **Wayne Conservation District** — Seedling sales and technical assistance
  - 648 Park Street, Suite 1, Honesdale, PA 18431
  - 570-253-0930 · [wayneconservation.com](https://wayneconservation.com)
  - ⚠️ Seedling orders typically due April 1

- **PA-NJ American Chestnut Foundation** — TACF backcross hybrid seedlings
  - [patacf.org](https://patacf.org)

- **CASRI (Red Spruce Restoration)** — Red spruce seedlings for appropriate sites
  - [restoreredspruce.org](https://restoreredspruce.org)

- **DCNR Service Forester (Wayne County)** — Free site visits for woodland owners; also the gateway for PWREN applications
  - Michael Antonishak · mantonisha@pa.gov · 570-945-7133

## Development

Site is built with plain HTML/CSS/JavaScript in the `docs/` directory (GitHub Pages serves from here). To run locally:

```bash
cd docs/
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Tests

Two test suites — no npm, no build step, no installs.

### Browser tests — planner math logic

Tests the weighted-distribution math in `docs/js/planner.js` (group totals, species overrides, flex-species behavior, auto-zero, multi-flex regression). Run by opening `tests.html` in a browser:

```bash
cd docs/
python3 -m http.server 8000
# Visit http://localhost:8000/tests.html
```

You'll see green/red pass/fail with stack traces on failure. Click **Re-run tests** to reload.

### Data validation — species & planner integrity

Static Python checks against species JSONs, planner configuration, and the photo gallery. Runs in <1 second.

```bash
python3 scripts/validate.py            # full output
python3 scripts/validate.py --quiet    # only failures + summary
```

**Checks include:**
- Every key in `species/index.json` has a matching JSON file (and vice versa)
- Every species JSON has required fields, valid `layer`/`protection`/`tier` values, key-matches-filename
- Every species referenced in `planner.json` exists in the species index
- Per-group species weights sum to 100; main-group `stdPct` sums to 100
- No group has multiple `flex` species (warning, not failing)
- Every gallery entry points to an existing file on disk
- Per-species `photo.url` points to an existing file
- Planner `protection` values match the species JSON files

Exit code is 0 on success, 1 on any failure. Warnings (e.g., multi-flex groups) print but don't fail.

### Continuous integration

`.github/workflows/validate.yml` runs `validate.py` on every push to `main` and on every pull request. Catches data drift before deploy.

## License

This guide is open. Use it for your own restoration or adapt it for your region.

---

*Last updated March 2026 — research verified against peer-reviewed sources current as of publication date.*