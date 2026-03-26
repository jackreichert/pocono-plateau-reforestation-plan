// ═══════════════════════════════════════════════════════════════════════
//  region-loader.js
//  Fetches the active region's species + planner config from JSON, then
//  sets globals other scripts depend on.
//
//  window.regionReady — Promise that resolves with REGION_CONFIG once
//  both JSON files have loaded. All region-dependent init must wait on
//  this promise before rendering.
//
//  To support multiple regions later: change REGION_ID (or derive it
//  from a URL param / localStorage) and add a region-selector <select>
//  in the nav that calls loadRegion(id) and re-renders.
// ═══════════════════════════════════════════════════════════════════════

(function () {
  const REGION_ID = 'pocono-plateau';
  const base = `data/regions/${REGION_ID}`;

  // Load the species index first, then fetch all species files in parallel.
  // Each species file is self-contained with its photo embedded inline.
  // To add or edit a species, just edit (or add) its file in species/.
  const speciesReady = fetch(`${base}/species/index.json`)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load species index: ${r.status}`);
      return r.json();
    })
    .then(keys => Promise.all(
      keys.map(key =>
        fetch(`${base}/species/${key.replace(/_/g, '-')}.json`)
          .then(r => {
            if (!r.ok) throw new Error(`Failed to load species ${key}: ${r.status}`);
            return r.json();
          })
      )
    ));

  const plannerReady = fetch(`${base}/planner.json`).then(r => {
    if (!r.ok) throw new Error(`Failed to load planner config: ${r.status}`);
    return r.json();
  });

  window.regionReady = Promise.all([speciesReady, plannerReady])
    .then(([speciesArr, plannerData]) => {
      // Reconstruct the two globals species.html expects
      window.SPECIES_DATA   = speciesArr;
      window.SPECIES_PHOTOS = Object.fromEntries(
        speciesArr.filter(s => s.photo).map(s => [s.key, s.photo])
      );
      window.REGION_CONFIG  = {
        id:           REGION_ID,
        groups:       plannerData.groups,
        shrubs:       plannerData.shrubs,
        planDefaults: plannerData.planDefaults,
        costTiers:    plannerData.costTiers,
      };
      return window.REGION_CONFIG;
    });
}());
