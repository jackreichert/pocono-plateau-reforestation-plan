// ═══════════════════════════════════════════════════════════════════════
//  Forest Restoration Planner — Interactive Tool
//  Weighted redistribution: reducing one species proportionally
//  increases the others within the same ecological group.
//
//  Data (GROUPS, SHRUBS, PLAN_DEFAULTS, cost tiers) is now loaded from
//  docs/data/regions/pocono-plateau/planner.json via region-loader.js.
//  These variables are populated in initPlanner() once regionReady
//  resolves. To support a different region, change REGION_ID in
//  region-loader.js and provide a matching planner.json.
// ═══════════════════════════════════════════════════════════════════════

// Populated from REGION_CONFIG after region data loads
let GROUPS, SHRUBS, PLAN_DEFAULTS;

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

  // Cost tiers from region config
  const ct = window.REGION_CONFIG.costTiers;
  const seedlingTier = ct.seedlings.find(t => t.maxTrees === undefined || totalTrees <= t.maxTrees);
  const seedlingLow  = seedlingTier.low;
  const seedlingHigh = seedlingTier.high;

  const treesCostLow  = totalTrees  * seedlingLow;
  const treesCostHigh = totalTrees  * seedlingHigh;

  const protLow  = tubeCount * ct.tube.low  + cageCount * ct.cage.low;
  const protHigh = tubeCount * ct.tube.high + cageCount * ct.cage.high;

  const shrubLow  = totalShrubs * ct.shrub.low;
  const shrubHigh = totalShrubs * ct.shrub.high;

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

// Wait for region JSON to load before initialising — handles both
// fetch-resolves-before-DOM and DOM-ready-before-fetch scenarios.
window.regionReady.then(config => {
  GROUPS        = config.groups;
  SHRUBS        = config.shrubs;
  PLAN_DEFAULTS = config.planDefaults;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlanner);
  } else {
    initPlanner();
  }
}).catch(err => {
  console.error('Forest Planner: failed to load region data', err);
  const el = document.getElementById('planner-groups');
  if (el) el.innerHTML = '<p style="color:#DC2626;padding:2rem">Failed to load planner data. Please refresh the page.</p>';
});
