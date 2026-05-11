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
  const V = '?v=20260511';

  // Load the species index first, then fetch all species files in parallel.
  // Each species file is self-contained with its photo embedded inline.
  // To add or edit a species, just edit (or add) its file in species/.
  const speciesReady = fetch(`${base}/species/index.json${V}`)
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load species index: ${r.status}`);
      return r.json();
    })
    .then(keys => Promise.all(
      keys.map(key =>
        fetch(`${base}/species/${key.replace(/_/g, '-')}.json${V}`)
          .then(r => {
            if (!r.ok) throw new Error(`Failed to load species ${key}: ${r.status}`);
            return r.json();
          })
      )
    ));

  const plannerReady = fetch(`${base}/planner.json${V}`).then(r => {
    if (!r.ok) throw new Error(`Failed to load planner config: ${r.status}`);
    return r.json();
  });

  // Multi-image gallery — graceful fallback if file isn't present yet
  const galleryReady = fetch(`${base}/photos-gallery.json${V}`)
    .then(r => r.ok ? r.json() : {})
    .catch(() => ({}));

  // Intrinsic dimensions, written by scripts/optimize-images.py.
  // Used to set width/height on <img> tags so the browser can reserve layout
  // space before pixels arrive (eliminates CLS on photo grids).
  const dimensionsReady = fetch(`${base}/photos/dimensions.json${V}`)
    .then(r => r.ok ? r.json() : {})
    .catch(() => ({}));

  window.regionReady = Promise.all([speciesReady, plannerReady, galleryReady, dimensionsReady])
    .then(([speciesArr, plannerData, galleryData, dimensionsData]) => {
      window.SPECIES_DATA     = speciesArr;
      window.SPECIES_PHOTOS   = Object.fromEntries(
        speciesArr.filter(s => s.photo).map(s => [s.key, s.photo])
      );
      window.SPECIES_GALLERY  = galleryData || {};
      window.PHOTO_DIMENSIONS = dimensionsData || {};
      window.REGION_CONFIG   = {
        id:           REGION_ID,
        groups:       plannerData.groups,
        shrubs:       plannerData.shrubs,
        planDefaults: plannerData.planDefaults,
        costTiers:    plannerData.costTiers,
      };
      return window.REGION_CONFIG;
    });
}());
