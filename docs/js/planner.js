// ═══════════════════════════════════════════════════════════════════════
//  Forest Restoration Planner — Interactive Tool
//  Weighted redistribution: reducing one species proportionally
//  increases the others within the same ecological group.
// ═══════════════════════════════════════════════════════════════════════

const GROUPS = [
  {
    id: 'oaks',
    name: 'Gap-Filling Canopy Oaks',
    why: 'Fast, broadly adaptable canopy for all gap types. Pre-settlement forests were oak-dominated; modern restoration under-represents them. Oaks support more wildlife species than any other genus.',
    stdPct: 22, mfPct: 0,
    mfNote: 'For Management-First: direct seed acorns from nearby legacy trees instead — free and locally adapted. Skip purchasing oaks.',
    species: [
      { name: 'Northern Red Oak', key: 'northern_red_oak', weight: 55, protection: 'tube',
        note: 'Fastest-growing oak (24"/yr). 500+ Lepidoptera species.' },
      { name: 'White Oak', key: 'white_oak', weight: 30, protection: 'tube',
        note: 'Generational anchor. Best acorn quality. Deep burgundy fall color.' },
      { name: 'Black Oak', key: 'black_oak', weight: 15, protection: 'tube', flex: true,
        note: 'Ridge and slope companion. Absorbs proportionally when others are reduced.' },
    ]
  },
  {
    id: 'moist',
    name: 'Moist-Slope Canopy',
    why: 'For north-facing slopes where beech is dying. These species fill the beech niche. If maples are already regenerating naturally on your site, reduce Sugar Maple and Basswood absorbs.',
    stdPct: 15, mfPct: 25,
    species: [
      { name: 'Sugar Maple', key: 'sugar_maple', weight: 55, protection: 'cage',
        note: 'Primary beech replacement. Wire cage required — tubes overheat this species.' },
      { name: 'Yellow Birch', key: 'yellow_birch', weight: 30, protection: 'cage',
        note: 'Native at 1,800–2,500ft. Needs mineral soil to germinate. Wire cage.' },
      { name: 'Basswood', key: 'basswood', weight: 15, protection: 'tube', flex: true,
        note: '#1 bee tree in eastern N. America. Absorbs overflow.' },
    ]
  },
  {
    id: 'ridge',
    name: 'Ridge & Dry-Slope Canopy',
    why: 'Dry rocky ridges and upper slopes. Pre-settlement forests were oak-HICKORY co-dominant — modern restoration forgets the hickory half. These three belong together on the ridge.',
    stdPct: 15, mfPct: 35,
    species: [
      { name: 'Chestnut Oak', key: 'chestnut_oak', weight: 40, protection: 'tube', mfAutoZero: true,
        note: 'Ridge oak at your elevation. Management-First: auto-zeroed — hickories absorb this allocation.' },
      { name: 'Shagbark Hickory', key: 'shagbark_hickory', weight: 35, protection: 'tube',
        note: 'Loose bark = critical bat roosting habitat. Pre-settlement dominant. Takes 50–70 yrs to bat-roosting size.' },
      { name: 'Pignut Hickory', key: 'pignut_hickory', weight: 25, protection: 'tube', flex: true,
        note: 'Most appropriate hickory for upper ridges to 4,900ft. Absorbs proportionally.' },
    ]
  },
  {
    id: 'pioneers',
    name: 'Pioneers / Fast-Fill',
    why: 'Short-to-medium-lived trees that fill open gaps immediately, creating conditions for slower long-lived species beneath.',
    stdPct: 8, mfPct: 0,
    mfNote: 'For Management-First: pioneers arrive naturally — aspen via clonal root sprouting, gray birch via seed, cherry after management. Skip purchasing.',
    species: [
      { name: 'Bigtooth Aspen', key: 'bigtooth_aspen', weight: 55, protection: 'tube',
        note: '318 Lepidoptera species. Clonal spread. Best for large open gaps.' },
      { name: 'Black Cherry', key: 'black_cherry', weight: 30, protection: 'tube', caution: true,
        note: '⚠️ Black knot fungus present on many properties. Survey existing trees before ordering.' },
      { name: 'Gray Birch', key: 'gray_birch', weight: 15, protection: 'tube', flex: true,
        note: 'Short-lived pioneer (~40 yrs) for disturbed ground.' },
    ]
  },
  {
    id: 'conifers',
    name: 'Conifers',
    why: 'Year-round structure and winter wildlife cover. Each species has a specific microsite. No natural seed source for spruce or fir at 2,000ft — these must be planted.',
    stdPct: 12, mfPct: 28,
    species: [
      { name: 'Balsam Fir', key: 'balsam_fir', weight: 45, protection: 'cage',
        note: 'Best climate-risk profile. Dense winter cover. Cool ravines + north slopes.' },
      { name: 'Red Spruce', key: 'red_spruce', weight: 35, protection: 'cage',
        note: 'North-facing slopes ONLY — lower edge of climate range at 2,000ft. Wire cage.' },
      { name: 'Eastern Hemlock', key: 'eastern_hemlock', weight: 20, protection: 'cage', flex: true, caution: true,
        note: '⚠️ Requires HWA treatment plan (soil drench every 4–6 yrs). Ravines only.' },
    ]
  },
  {
    id: 'understory',
    name: 'Understory / Mid-Story',
    why: 'The mid-layer that provides spring flowers, summer berries, nesting cover, and four-season structure. A 2025 study found diverse understory increases total forest biomass by 50%+.',
    stdPct: 15, mfPct: 7,
    species: [
      { name: 'Allegheny Serviceberry', key: 'serviceberry', weight: 45, protection: 'cage', mfAutoZero: true,
        note: 'Management-First: arrives within 3–7 yrs of deer management. Save budget for hickory and conifers.' },
      { name: 'Pagoda Dogwood', key: 'pagoda_dogwood', weight: 35, protection: 'cage',
        note: 'Disease-free forest-interior dogwood. 40+ bird species. Spring Azure butterfly host.' },
      { name: 'Hop-Hornbeam', key: 'hop_hornbeam', weight: 20, protection: 'cage', flex: true, mfAutoZero: true,
        note: 'Management-First: arrives with deer management. Stump-sprouts. Skip purchasing.' },
    ]
  },
  {
    id: 'fruiting',
    name: 'Fruiting / Flowering',
    why: 'Trees selected for wildlife food and visual interest. Keep at ~8–10% so fruiting does not dominate the ecological restoration.',
    stdPct: 8, mfPct: 0,
    mfNote: 'For Management-First: skip fruiting trees — budget goes to hickory and conifers first. Add in later years.',
    species: [
      { name: 'Native Sweet Crabapple', key: 'native_crabapple', weight: 35, protection: 'tube',
        note: 'Rose-scented May bloom. 287 Lepidoptera species. Winter bird food.' },
      { name: 'American Chestnut (TACF)', key: 'american_chestnut', weight: 25, protection: 'tube',
        note: 'Backcross hybrid. Contact PA-NJ TACF chapter (patacf.org) for seedlings.' },
      { name: 'American Plum', key: 'american_plum', weight: 20, protection: 'tube', caution: true,
        note: '⚠️ Same genus as black cherry — monitor for black knot. Bears, foxes, turkeys, birds. Forest edges only.' },
      { name: 'Black Walnut', key: 'black_walnut', weight: 12, protection: 'tube', caution: true,
        note: '⚠️ Moist fertile coves only — allelopathic; suppresses nearby plants. 1–3 per cluster max. Most valuable native nut tree.' },
      { name: 'Fire-Resistant Pear', key: 'fire_resistant_pear', weight: 8, protection: 'tube', flex: true,
        note: 'Moonglow, Harrow Sweet, or Luscious. DJ-confirmed at this elevation. Absorbs if Chestnut stock limited.' },
    ]
  },
  {
    id: 'specialty',
    name: 'Notable Specialty',
    why: 'Ecologically native species rarely planted in restoration — each fills a specific microhabitat with high individual value.',
    stdPct: 5, mfPct: 5,
    species: [
      { name: 'Cucumber Magnolia', key: 'cucumber_magnolia', weight: 45, protection: 'tube',
        note: 'Native to Allegheny Plateau. Associates with yellow birch, hemlock, sugar maple. Almost never planted.' },
      { name: 'American Mountain Ash', key: 'mountain_ash', weight: 30, protection: 'cage',
        note: 'Native to your exact elevation. Outstanding migrant bird food. Wire cage.' },
      { name: 'Black Gum', key: 'black_gum', weight: 25, protection: 'tube', flex: true,
        note: 'USFS climate winner. Best fall color of any eastern native. Absorbs overflow.' },
    ]
  }
];

const SHRUBS = [
  { name: 'American Hazelnut',    key: 'american_hazelnut',    weight: 25, note: 'Hard mast for turkey + grouse. Polyphemus moth host.' },
  { name: 'Nannyberry',           key: 'nannyberry',           weight: 20, note: 'Winter berries for waxwings + robins. Cold-hardy.' },
  { name: 'Pennsylvania Hawthorn',key: 'pennsylvania_hawthorn',weight: 18, note: '159 Lepidoptera species. Best nesting cover available.' },
  { name: 'Spicebush',            key: 'spicebush',            weight: 17, note: 'Spicebush Swallowtail butterfly host.' },
  { name: 'Red Elderberry',       key: 'red_elderberry',       weight: 15, note: 'Native at your elevation. June berries for migrating thrushes.' },
  { name: 'Arrowwood Viburnum',   key: 'arrowwood_viburnum',   weight:  5, flex: true, note: 'Most adaptable native viburnum. Absorbs overflow.' },
];

const PLAN_DEFAULTS = { FM: 60, MF: 150 };

// ── State ─────────────────────────────────────────────────────────────────
let state = {
  totalTrees: 60,
  shrubTotal: 39,
  plan: 'FM',
  acres: null,
  groupOverrides: {},  // groupId → custom pct (null = use default)
  speciesOverrides: {}, // "groupId:speciesIdx" → value (null = auto)
};

// ── Main render ───────────────────────────────────────────────────────────
function getPct(group) {
  if (state.groupOverrides[group.id] != null) return state.groupOverrides[group.id];
  return state.plan === 'MF' ? group.mfPct : group.stdPct;
}

// Largest-remainder method: distributes totalTrees across groups so the
// integer totals always sum exactly to the target — no rounding drift.
let _groupTotalsCache = null;
let _groupTotalsCacheKey = '';

function getGroupTotals() {
  const key = `${state.totalTrees}|${state.plan}|${JSON.stringify(state.groupOverrides)}`;
  if (key === _groupTotalsCacheKey) return _groupTotalsCache;

  const exact  = GROUPS.map(g => state.totalTrees * getPct(g) / 100);
  const floors = exact.map(Math.floor);
  let remainder = state.totalTrees - floors.reduce((a, b) => a + b, 0);

  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  const totals = [...floors];
  for (let k = 0; k < remainder; k++) totals[order[k].i]++;

  _groupTotalsCache = {};
  GROUPS.forEach((g, i) => { _groupTotalsCache[g.id] = totals[i]; });
  _groupTotalsCacheKey = key;
  return _groupTotalsCache;
}

function getGroupTotal(group) {
  return getGroupTotals()[group.id];
}

function isAutoZero(group, speciesIdx) {
  // Plan D auto-zeros certain species
  if (state.plan !== 'MF') return false;
  const sp = group.species[speciesIdx];
  return !!sp.mfAutoZero;
}

function getSpeciesActual(group, speciesIdx) {
  const sp = group.species[speciesIdx];
  const key = `${group.id}:${speciesIdx}`;
  const groupTotal = getGroupTotal(group);

  // Auto-zero for Plan D
  if (isAutoZero(group, speciesIdx)) return 0;

  // User override
  const ov = state.speciesOverrides[key];
  if (ov !== undefined && ov !== null && ov !== '') return Math.max(0, parseInt(ov) || 0);

  // Flex species absorbs remainder to eliminate rounding error
  if (sp.flex) {
    const otherSum = group.species.reduce((sum, _, i) => {
      if (i === speciesIdx) return sum;
      return sum + getSpeciesActual(group, i);
    }, 0);
    return Math.max(0, groupTotal - otherSum);
  }

  // Weighted calculation
  const others = group.species
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i !== speciesIdx);

  let remaining = groupTotal;
  let denominator = sp.weight;

  for (const { s, i } of others) {
    if (isAutoZero(group, i)) continue;
    const ok = `${group.id}:${i}`;
    const ov2 = state.speciesOverrides[ok];
    if (ov2 !== undefined && ov2 !== null && ov2 !== '') {
      remaining -= Math.max(0, parseInt(ov2) || 0);
    } else {
      denominator += s.weight;
    }
  }

  if (denominator === 0) return 0;
  return Math.max(0, Math.round(remaining * sp.weight / denominator));
}

function getShrubActual(idx) {
  const sh = SHRUBS[idx];
  const key = `shrub:${idx}`;
  const ov = state.speciesOverrides[key];
  if (ov !== undefined && ov !== null && ov !== '') return Math.max(0, parseInt(ov) || 0);

  // Flex shrub absorbs remainder to eliminate rounding error
  if (sh.flex) {
    const otherSum = SHRUBS.reduce((sum, _, i) => {
      if (i === idx) return sum;
      return sum + getShrubActual(i);
    }, 0);
    return Math.max(0, state.shrubTotal - otherSum);
  }

  const others = SHRUBS.map((s, i) => ({ s, i })).filter(({ i }) => i !== idx);
  let remaining = state.shrubTotal;
  let denominator = sh.weight;

  for (const { s, i } of others) {
    const ok = `shrub:${i}`;
    const ov2 = state.speciesOverrides[ok];
    if (ov2 !== undefined && ov2 !== null && ov2 !== '') {
      remaining -= Math.max(0, parseInt(ov2) || 0);
    } else {
      denominator += s.weight;
    }
  }

  if (denominator === 0) return 0;
  return Math.max(0, Math.round(remaining * sh.weight / denominator));
}

function getTotalActual() {
  return GROUPS.reduce((sum, g) =>
    sum + g.species.reduce((s2, _, i) => s2 + getSpeciesActual(g, i), 0), 0);
}

function getTotalShrubsActual() {
  return SHRUBS.reduce((sum, _, i) => sum + getShrubActual(i), 0);
}

// ── Render ────────────────────────────────────────────────────────────────
function renderPlanner() {
  const container = document.getElementById('planner-groups');
  if (!container) return;

  const total   = getTotalActual();
  const target  = state.totalTrees;
  const diff    = total - target;

  // Status bar
  const statusEl = document.getElementById('planner-status-text');
  if (statusEl) {
    if (diff === 0) {
      statusEl.innerHTML = `<span style="color:var(--green-700)">✓ On target — ${total} trees</span>`;
    } else if (diff > 0) {
      statusEl.innerHTML = `<span style="color:#D97706">▲ ${total} trees planned — ${diff} over target</span>`;
    } else {
      statusEl.innerHTML = `<span style="color:#9CA3AF">▼ ${total} trees planned — ${Math.abs(diff)} under target</span>`;
    }
  }

  // Plan C / D notices
  const noticeFMEl = document.getElementById('plan-fm-notice');
  if (noticeFMEl) noticeFMEl.classList.toggle('show', state.plan === 'FM');
  const noticeMFEl = document.getElementById('plan-mf-notice');
  if (noticeMFEl) noticeMFEl.classList.toggle('show', state.plan === 'MF');

  container.innerHTML = '';

  GROUPS.forEach(group => {
    const pct = getPct(group);
    const grpTotal = getGroupTotal(group);
    const isZero = pct === 0;

    const div = document.createElement('div');
    div.className = 'planner-group';

    // Header
    const hdr = document.createElement('div');
    hdr.className = 'planner-group-header' + (isZero ? ' plan-d-zero' : '');
    hdr.innerHTML = `
      <div>
        <div class="planner-group-name">${group.name}</div>
        <div style="font-size:.75rem;color:rgba(255,255,255,.6);margin-top:.1rem;">${group.why.substring(0,80)}…</div>
      </div>
      <div style="text-align:right">
        <div class="planner-group-pct">${pct}%</div>
        <div class="planner-group-total">${grpTotal}</div>
      </div>`;
    div.appendChild(hdr);

    // Plan D note for zero groups
    if (isZero && group.mfNote) {
      const noteDiv = document.createElement('div');
      noteDiv.style.cssText = 'padding:.6rem 1.25rem;background:#F8FAFC;font-size:.8rem;color:#64748B;border-bottom:1px solid var(--border)';
      noteDiv.textContent = group.mfNote;
      div.appendChild(noteDiv);
    }

    // Species rows (col headers once)
    const colHdr = document.createElement('div');
    colHdr.className = 'planner-species-row';
    colHdr.style.cssText = 'background:var(--green-50);font-size:.75rem;font-weight:600;color:var(--text-light);text-transform:uppercase;letter-spacing:.05em';
    colHdr.innerHTML = `<div>Species</div><div style="text-align:center">Default</div><div style="text-align:center">Override</div><div style="text-align:center">Count</div>`;
    div.appendChild(colHdr);

    group.species.forEach((sp, idx) => {
      const actual   = getSpeciesActual(group, idx);
      const autoZero = isAutoZero(group, idx);
      const key      = `${group.id}:${idx}`;
      const ovVal    = state.speciesOverrides[key];
      const dfltVal  = (() => {
        // Default with no overrides
        const d = Math.round(grpTotal * sp.weight / 100);
        return d;
      })();

      const row = document.createElement('div');
      row.className = 'planner-species-row' + (autoZero ? ' auto-zero' : '');

      row.innerHTML = `
        <div>
          <div class="planner-species-name">${sp.key ? `<a href="species.html#${sp.key}" target="species-guide" class="planner-sp-link">${sp.name}</a>` : sp.name}${sp.flex ? ' <span class="tag" style="font-size:.65rem">flex</span>' : ''}${sp.caution ? ' <span class="tag" style="background:#FEE2E2;color:#991B1B;font-size:.65rem">⚠</span>' : ''}</div>
          <div class="planner-species-note">${sp.note}</div>
          ${autoZero ? '<div class="planner-species-note" style="color:#10B981">✓ Arrives naturally with deer management</div>' : ''}
        </div>
        <div class="planner-default">${dfltVal}</div>
        <div>
          <input class="planner-override${autoZero ? ' auto-zeroed' : ''}"
            type="number" min="0" max="${state.totalTrees}"
            placeholder="${autoZero ? '0 (auto)' : 'auto'}"
            value="${ovVal !== undefined && ovVal !== null ? ovVal : ''}"
            ${autoZero ? 'readonly' : ''}
            data-key="${key}" />
        </div>
        <div class="planner-actual">${actual}</div>`;
      div.appendChild(row);
    });

    container.appendChild(div);
  });

  // Shrubs
  renderShrubs();

  // Site layout guide
  renderLayoutGuide();

  // Cost estimate
  renderCostEstimate();
}

function renderShrubs() {
  const el = document.getElementById('shrub-rows');
  if (!el) return;
  const shrubTotal = state.shrubTotal;

  SHRUBS.forEach((sh, idx) => {
    const actual = getShrubActual(idx);
    const key    = `shrub:${idx}`;
    const ov     = state.speciesOverrides[key];
    let row = document.getElementById(`shrub-row-${idx}`);
    if (!row) return;
    const dflt = Math.round(shrubTotal * sh.weight / 100);
    row.querySelector('.planner-default').textContent = dflt;
    row.querySelector('.planner-actual').textContent  = actual;
    const input = row.querySelector('.planner-override');
    if (input && !input.matches(':focus')) input.value = ov != null ? ov : '';
  });

  const totalEl = document.getElementById('shrub-total-actual');
  if (totalEl) totalEl.textContent = getTotalShrubsActual();
}

// ── Site layout guide ──────────────────────────────────────────────────────
function renderLayoutGuide() {
  const el = document.getElementById('layout-guide');
  if (!el) return;

  const trees = state.totalTrees;
  const acres = state.acres && state.acres > 0 ? state.acres : null;
  const clustersRec = Math.max(1, Math.round(trees / 17));
  const treesPerCluster = Math.round(trees / clustersRec);

  let headline, body;
  if (trees <= 15) {
    headline = '1 cluster &mdash; site test scale';
    body = 'Plant as a single tight cluster in your best gap — the largest opening without a nearby seed tree. One afternoon. This is a site test: learn deer pressure and drainage before scaling up. Keep every species from the full mix represented at this scale, not a selection of easy ones.';
  } else if (trees <= 30) {
    headline = `${clustersRec} cluster${clustersRec > 1 ? 's' : ''} &mdash; 15&ndash;20 trees each`;
    body = 'Research shows clusters below a ~65&times;65ft footprint (roughly 15&ndash;20 trees) produce significantly weaker wildlife outcomes. Keep these trees concentrated &mdash; resist distributing them evenly across your property.';
  } else if (trees <= 100) {
    headline = `${clustersRec} clusters &mdash; ~${treesPerCluster} trees each`;
    body = 'Space clusters 100&ndash;200ft apart to create connected habitat islands that seed-dispersing birds move between. Plant all ecological layers in every cluster &mdash; don&rsquo;t defer conifers or understory to a later cluster.';
  } else {
    const perYear = Math.round(trees / 3);
    headline = `${clustersRec} clusters &mdash; ~${treesPerCluster} trees each`;
    body = `At this scale, consider phasing over 2&ndash;3 years (~${perYear} trees/year). Each year&rsquo;s order should cover all ecological layers &mdash; weight canopy heavier in Year 1, but don&rsquo;t defer conifers or understory to later years.`;
  }

  const statsHtml = [
    `<div><span style="color:var(--text-light);font-size:.75rem;text-transform:uppercase;letter-spacing:.06em">Clusters</span><div style="font-weight:700;font-size:1.1rem;color:var(--green-800)">${clustersRec}</div></div>`,
    `<div><span style="color:var(--text-light);font-size:.75rem;text-transform:uppercase;letter-spacing:.06em">Per cluster</span><div style="font-weight:700;font-size:1.1rem;color:var(--green-800)">~${treesPerCluster} trees</div></div>`,
  ];

  let acreageHtml = '';
  let placementHtml = '';

  if (acres) {
    const clusterSqFt = clustersRec * 65 * 65;
    const totalSqFt   = acres * 43560;
    const coveragePct = Math.max(1, Math.round(clusterSqFt / totalSqFt * 100));
    const perAcre     = Math.round(trees / acres);

    statsHtml.push(
      `<div><span style="color:var(--text-light);font-size:.75rem;text-transform:uppercase;letter-spacing:.06em">Trees / acre</span><div style="font-weight:700;font-size:1.1rem;color:var(--green-800)">${perAcre}</div></div>`,
      `<div><span style="color:var(--text-light);font-size:.75rem;text-transform:uppercase;letter-spacing:.06em">Cluster coverage</span><div style="font-weight:700;font-size:1.1rem;color:var(--green-800)">~${coveragePct}%</div></div>`
    );

    const treesPerAcreNum = trees / acres;
    if (treesPerAcreNum < 20 && acres > 1 && clustersRec < acres) {
      acreageHtml = `<div style="margin-top:.75rem;padding:.75rem 1rem;background:#FEF3C7;border-radius:8px;font-size:.875rem;border-left:3px solid #D97706">
        <strong>Concentrate first.</strong> At ${perAcre} trees/acre across ${acres} acres, spreading evenly would leave thin scatter with no nucleation effect. Focus into ${clustersRec} tight cluster${clustersRec > 1 ? 's' : ''} in your best gaps &mdash; establish those fully, then expand. Corbin 2016 achieved 59% forest cover on a 14.8-acre site by planting clusters on less than 3% of the land; the birds did the rest.
      </div>`;
    } else if (coveragePct <= 5) {
      acreageHtml = `<div style="margin-top:.75rem;padding:.75rem 1rem;background:var(--green-50);border-radius:8px;font-size:.875rem;border-left:3px solid var(--green-600)">
        <strong>Nucleation in range.</strong> Your clusters cover ~${coveragePct}% of your ${acres} acres &mdash; within the proven nucleation threshold. Corbin et al. (2016) achieved 59% total forest cover across a 14.8-acre site using clusters on less than 3% of the land. Concentrate, and the forest builds outward.
      </div>`;
    } else {
      acreageHtml = `<div style="margin-top:.75rem;padding:.75rem 1rem;background:var(--green-50);border-radius:8px;font-size:.875rem;border-left:3px solid var(--green-600)">
        <strong>Good density.</strong> Your clusters would cover ~${coveragePct}% of your ${acres} acres &mdash; substantial enough to drive fast establishment and connected wildlife corridors across the property.
      </div>`;
    }

    placementHtml = `<div style="margin-top:.75rem">
      <div style="font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-light);margin-bottom:.4rem">Cluster placement priorities</div>
      <ol style="margin-left:1.25rem;font-size:.875rem;line-height:2;color:var(--text-mid)">
        <li><strong>Largest open gaps</strong> without a nearby seed tree &mdash; without a cluster here, these stay open for decades</li>
        <li><strong>Around your released legacy oaks and hickories</strong> &mdash; amplifies crop tree release work immediately</li>
        <li><strong>North-slope transitions</strong> where beech was dominant &mdash; sugar maple, yellow birch, hemlock</li>
        <li><strong>Ridge tops</strong> &mdash; hickory-dominant clusters; hardest species to establish naturally</li>
        <li><strong>Ravine edges</strong> &mdash; hemlock, balsam fir; lose decades of establishment without planting here</li>
      </ol>
    </div>`;
  }

  el.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;margin-bottom:.75rem">
      <div>
        <div style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-light)">Site Layout</div>
        <div style="font-size:1.05rem;font-weight:700;color:var(--green-800);margin-top:.2rem">${headline}</div>
      </div>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap">${statsHtml.join('')}</div>
    </div>
    <p style="font-size:.9rem;color:var(--text-mid)">${body}</p>
    ${acreageHtml}
    ${placementHtml}
    <div style="margin-top:.75rem;font-size:.8rem">
      <a href="plans.html#full-mix" style="color:var(--green-700)">How to plan clusters &rarr;</a>
      <span style="color:var(--border);margin:0 .5rem">|</span>
      <a href="research.html" style="color:var(--green-700)">Nucleation research &rarr;</a>
    </div>`;
}

// ── Cost estimate ────────────────────────────────────────────────────────
function renderCostEstimate() {
  const el = document.getElementById('cost-estimate');
  if (!el) return;

  const totalTrees  = getTotalActual();
  const totalShrubs = getTotalShrubsActual();

  // Count tube vs cage trees from actual species allocation
  let tubeCount = 0, cageCount = 0;
  GROUPS.forEach(g => {
    g.species.forEach((sp, i) => {
      const count = getSpeciesActual(g, i);
      if (count === 0) return;
      if (sp.protection === 'cage') cageCount += count;
      else tubeCount += count;
    });
  });

  // Seedling price range — bare root (Wayne CD / conservation district low)
  // to container stock (Go Native, Chief River mid-qty high)
  const seedlingLow  = totalTrees <= 25 ? 3.00 : totalTrees <= 100 ? 1.80 : totalTrees <= 300 ? 1.45 : 1.20;
  const seedlingHigh = totalTrees <= 25 ? 8.00 : totalTrees <= 100 ? 5.00 : totalTrees <= 300 ? 3.50 : 2.50;

  const treesCostLow  = totalTrees  * seedlingLow;
  const treesCostHigh = totalTrees  * seedlingHigh;

  // Protection: tube $2–$4.50 each (bulk to retail with stake)
  // cage $3.50–$7 each (DIY hardware cloth to pre-made)
  const protLow  = tubeCount * 2.00 + cageCount * 3.50;
  const protHigh = tubeCount * 4.50 + cageCount * 7.00;

  // Shrubs $1.50–$3.50 bare root
  const shrubLow  = totalShrubs * 1.50;
  const shrubHigh = totalShrubs * 3.50;

  const totalLow  = treesCostLow  + protLow  + shrubLow;
  const totalHigh = treesCostHigh + protHigh + shrubHigh;

  const fmt   = n => '$' + Math.round(n).toLocaleString();
  const range = (lo, hi) => `<strong>${fmt(lo)}</strong> <span style="color:var(--text-light)">– ${fmt(hi)}</span>`;

  const row = (label, sub, lo, hi) => `
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:.45rem 0;border-bottom:1px solid var(--border);font-size:.875rem">
      <div><span style="color:var(--text-mid)">${label}</span> <span style="font-size:.75rem;color:var(--text-light)">${sub}</span></div>
      <div style="text-align:right;white-space:nowrap">${range(lo, hi)}</div>
    </div>`;

  el.innerHTML = `
    <div style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-light);margin-bottom:.6rem">Rough Cost Estimate</div>
    ${row(`${totalTrees} tree seedlings`, 'bare root (conservation district) → container stock', treesCostLow, treesCostHigh)}
    ${tubeCount ? row(`${tubeCount} plastic tubes`, 'bulk → retail + stake', tubeCount * 2.00, tubeCount * 4.50) : ''}
    ${cageCount ? row(`${cageCount} wire cages`, 'DIY hardware cloth → pre-made + stake', cageCount * 3.50, cageCount * 7.00) : ''}
    ${totalShrubs ? row(`${totalShrubs} shrubs`, 'bare root (conservation district) → nursery', shrubLow, shrubHigh) : ''}
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:.6rem 0 .1rem;font-size:.95rem;font-weight:700;color:var(--green-800)">
      <div>Total range</div>
      <div>${range(totalLow, totalHigh)}</div>
    </div>
    <div style="font-size:.75rem;color:var(--text-light);margin-top:.5rem;line-height:1.6">
      Wayne Conservation District seedlings are the low end — roughly $1–3/tree for most species. Tubes: bulk orders (100+) run ~$2 each; retail ~$4. Wire cages: DIY from hardware cloth + rebar stake ~$3.50; pre-made ~$7. EQIP cost-share can reimburse 50–75% of eligible planting and protection costs.
    </div>`;
}

// ── Build shrub section (static HTML + dynamic values) ───────────────────
function buildShrubSection() {
  const wrap = document.getElementById('shrub-section-body');
  if (!wrap) return;

  wrap.innerHTML = SHRUBS.map((sh, idx) => `
    <div class="planner-species-row" id="shrub-row-${idx}">
      <div>
        <div class="planner-species-name">${sh.key ? `<a href="species.html#${sh.key}" target="_blank" rel="noopener" class="planner-sp-link">${sh.name}</a>` : sh.name}${sh.flex ? ' <span class="tag" style="font-size:.65rem">flex</span>' : ''}</div>
        <div class="planner-species-note">${sh.note}</div>
      </div>
      <div class="planner-default">${Math.round(state.shrubTotal * sh.weight / 100)}</div>
      <div>
        <input class="planner-override" type="number" min="0" max="${state.shrubTotal}"
          placeholder="auto" data-key="shrub:${idx}" />
      </div>
      <div class="planner-actual">${getShrubActual(idx)}</div>
    </div>`).join('');
}

// ── Event wiring ──────────────────────────────────────────────────────────
function initPlanner() {
  // Read ?plan=FM|MF from URL and pre-select it
  const urlPlan = new URLSearchParams(window.location.search).get('plan');
  if (urlPlan && PLAN_DEFAULTS[urlPlan]) {
    state.plan = urlPlan;
    state.totalTrees = PLAN_DEFAULTS[urlPlan];
    state.shrubTotal = Math.round(PLAN_DEFAULTS[urlPlan] * 0.65);
  }

  buildShrubSection();
  renderPlanner();

  // Total trees input
  const totalInput = document.getElementById('total-trees-input');
  if (totalInput) {
    totalInput.value = state.totalTrees;
    totalInput.addEventListener('input', () => {
      const v = parseInt(totalInput.value) || 10;
      state.totalTrees = Math.max(1, Math.min(2000, v));
      // Update shrub total proportionally
      state.shrubTotal = Math.max(1, Math.round(state.totalTrees * 0.65));
      const si = document.getElementById('shrub-total-input');
      if (si) si.value = state.shrubTotal;
      renderPlanner();
    });
  }

  // Plan selector
  const planSelect = document.getElementById('plan-select');
  if (planSelect) {
    planSelect.value = state.plan;
    planSelect.addEventListener('change', () => {
      state.plan = planSelect.value;
      // Suggest total
      const suggested = PLAN_DEFAULTS[state.plan];
      if (totalInput && suggested) {
        totalInput.value = suggested;
        state.totalTrees = suggested;
        state.shrubTotal = Math.round(suggested * 0.65);
        const si = document.getElementById('shrub-total-input');
        if (si) si.value = state.shrubTotal;
      }
      // Clear overrides when switching plans
      state.speciesOverrides = {};
      state.groupOverrides   = {};
      renderPlanner();
    });
  }

  // Shrub total input
  const shrubInput = document.getElementById('shrub-total-input');
  if (shrubInput) {
    shrubInput.value = state.shrubTotal;
    shrubInput.addEventListener('input', () => {
      state.shrubTotal = Math.max(0, parseInt(shrubInput.value) || 0);
      renderShrubs();
    });
  }

  // Acres input
  const acresInput = document.getElementById('acres-input');
  if (acresInput) {
    acresInput.addEventListener('input', () => {
      const v = parseFloat(acresInput.value);
      state.acres = isNaN(v) || v <= 0 ? null : v;
      renderLayoutGuide();
    });
  }

  // Delegated override inputs
  document.addEventListener('input', e => {
    if (!e.target.matches('.planner-override')) return;
    const key = e.target.dataset.key;
    const val = e.target.value.trim();
    state.speciesOverrides[key] = val === '' ? null : parseInt(val);
    renderPlanner();
  });

  // Reset button
  const resetBtn = document.getElementById('planner-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.speciesOverrides = {};
      state.groupOverrides   = {};
      renderPlanner();
    });
  }

  // CSV export
  const csvBtn = document.getElementById('planner-export');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      let csv = 'Group,Species,Plan %,Count,Protection\n';
      GROUPS.forEach(g => {
        const pct = getPct(g);
        g.species.forEach((sp, i) => {
          const count = getSpeciesActual(g, i);
          csv += `"${g.name}","${sp.name}",${pct}%,${count},"${sp.protection}"\n`;
        });
      });
      csv += '\nShrubs\n';
      SHRUBS.forEach((sh, i) => {
        csv += `"Shrubs","${sh.name}",,${getShrubActual(i)},\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a'); a.href = url;
      a.download = `forest-restoration-plan-${state.plan}.csv`; a.click();
      URL.revokeObjectURL(url);
    });
  }
}

document.addEventListener('DOMContentLoaded', initPlanner);
