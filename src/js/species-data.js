// ═══════════════════════════════════════════════════════════════════════
//  Species data — photos sourced from Wikimedia Commons (CC-licensed)
//  All photos verified CC BY, CC BY-SA, or Public Domain
//  URLs refreshed March 2026 via Wikimedia Commons API at 960px thumbnail
// ═══════════════════════════════════════════════════════════════════════

const PHOTOS = {
  // Canopy trees
  shagbark_hickory:  {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Shagbark_hickory_spring_leaf_cluster.jpg/960px-Shagbark_hickory_spring_leaf_cluster.jpg",credit:"Dcrjsr",license:"CC BY 3.0"},
  sugar_maple:       {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Acer_saccharum_UL_01.jpg/960px-Acer_saccharum_UL_01.jpg",credit:"Cephas",license:"CC BY-SA 4.0"},
  northern_red_oak:  {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/D%C3%BClmen%2C_Wildpark%2C_Br%C3%BCcke_am_Herzteich_--_2022_--_4642.jpg/960px-D%C3%BClmen%2C_Wildpark%2C_Br%C3%BCcke_am_Herzteich_--_2022_--_4642.jpg",credit:"Dietmar Rabich",license:"CC BY-SA 4.0"},
  white_oak:         {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Quercus_alba_leaf_spring.jpg/960px-Quercus_alba_leaf_spring.jpg",credit:"Harborsparrow",license:"Public domain"},
  chestnut_oak:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Chestnut_Oak_-_Quercus_montana%2C_Meadowood_Farm_SRMA%2C_Mason_Neck%2C_Virginia.jpg/960px-Chestnut_Oak_-_Quercus_montana%2C_Meadowood_Farm_SRMA%2C_Mason_Neck%2C_Virginia.jpg",credit:"Judy Gallagher",license:"CC BY 2.0"},
  pignut_hickory:    {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Carya_glabra_49.jpg/960px-Carya_glabra_49.jpg",credit:"Cedar Wood",license:"CC BY 4.0"},
  mockernut_hickory: {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Carya_tomentosa_%288745432970%29_4x3.jpg/960px-Carya_tomentosa_%288745432970%29_4x3.jpg",credit:"John B., Dendroica cerulea",license:"CC BY 2.0"},
  black_gum:         {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Nyssa_sylvatica_JPG1b.jpg/960px-Nyssa_sylvatica_JPG1b.jpg",credit:"Jean-Pol Grandmont",license:"CC BY-SA 3.0"},
  basswood:          {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Tilia_americana_-_American_Basswood.jpg/960px-Tilia_americana_-_American_Basswood.jpg",credit:"Fritzflohrreynolds",license:"CC BY-SA 3.0"},
  cucumber_magnolia: {url:"https://upload.wikimedia.org/wikipedia/commons/0/0d/Magnolia_acuminata_-_flower_%28MBG%2C_Moscow%29.jpg",credit:"Игорь Курицын",license:"CC BY-SA 4.0"},
  bigtooth_aspen:    {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Populus_grandidentata.JPG/960px-Populus_grandidentata.JPG",credit:"Schzmo",license:"Public domain"},
  black_cherry:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Prunus_serotina_kz07.jpg/960px-Prunus_serotina_kz07.jpg",credit:"Krzysztof Ziarnek",license:"CC BY-SA 4.0"},
  sassafras:         {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Sassafras_albidum_8311.jpg/960px-Sassafras_albidum_8311.jpg",credit:"Chris Light",license:"CC BY-SA 4.0"},
  black_walnut:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Juglans_nigra_BW_2024-04-09_17-44-42_Stack.jpg/960px-Juglans_nigra_BW_2024-04-09_17-44-42_Stack.jpg",credit:"Berthold Werner",license:"CC BY-SA 4.0"},
  // Birches & maples
  yellow_birch:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Betula_alleghaniensis_%28Yellow_Birch%29_%2826505120302%29.jpg/960px-Betula_alleghaniensis_%28Yellow_Birch%29_%2826505120302%29.jpg",credit:"Plant Image Library",license:"CC BY-SA 2.0"},
  white_birch:       {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Betula_lenta_%C3%96BG_09-07-16_01.jpg/960px-Betula_lenta_%C3%96BG_09-07-16_01.jpg",credit:"El Grafo",license:"CC BY-SA 3.0"},
  striped_maple:     {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Acer_pensylvanicum_%28Moosewood%2C_Striped_Maple%2C_Snake-bark_Maple%29_%2838246389231%29.jpg/960px-Acer_pensylvanicum_%28Moosewood%2C_Striped_Maple%2C_Snake-bark_Maple%29_%2838246389231%29.jpg",credit:"Plant Image Library",license:"CC BY-SA 2.0"},
  // Conifers
  balsam_fir:        {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Abies_balsamea.jpg/960px-Abies_balsamea.jpg",credit:"U.S. Fish and Wildlife Service",license:"Public domain"},
  red_spruce:        {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Picea_rubens_Bear_Rock_WV.jpg/960px-Picea_rubens_Bear_Rock_WV.jpg",credit:"Forest Wander",license:"CC BY-SA 2.0"},
  eastern_hemlock:   {url:"https://upload.wikimedia.org/wikipedia/commons/2/24/Tsuga_canadensis_morton.jpg",credit:"Bruce Marlin",license:"CC BY-SA 3.0"},
  pitch_pine:        {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pitch_pine_in_Quogue_%2892734p%29.jpg/960px-Pitch_pine_in_Quogue_%2892734p%29.jpg",credit:"Rhododendrites",license:"CC BY-SA 4.0"},
  // Understory
  serviceberry:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Alleghany_Serviceberry_%28Amelanchier_laevis%29_-_Guelph%2C_Ontario_01.jpg/960px-Alleghany_Serviceberry_%28Amelanchier_laevis%29_-_Guelph%2C_Ontario_01.jpg",credit:"Ryan Hodnett",license:"CC BY-SA 4.0"},
  pagoda_dogwood:    {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pagoda_Tree_Cornus_alternifolia_Flower_Head_2580px.jpg/960px-Pagoda_Tree_Cornus_alternifolia_Flower_Head_2580px.jpg",credit:"Derek Ramsey",license:"CC BY-SA 2.5"},
  mountain_ash:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/American_Ash_%28Sorbus_americana%29_Fruit_%2812786%29-Relic38.JPG/960px-American_Ash_%28Sorbus_americana%29_Fruit_%2812786%29-Relic38.JPG",credit:"Darren Swim",license:"CC BY-SA 3.0"},
  hop_hornbeam:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ostrya_virginiana_-_Mount_Airy_Arboretum_-_DSC03828.JPG/960px-Ostrya_virginiana_-_Mount_Airy_Arboretum_-_DSC03828.JPG",credit:"Daderot",license:"CC0"},
  witch_hazel:       {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Hamamelis_virginiana_03.JPG/960px-Hamamelis_virginiana_03.JPG",credit:"H. Zell",license:"CC BY-SA 3.0"},
  tulip_poplar:      {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Liriodendron_tulipifera_PAN_leaf.JPG/960px-Liriodendron_tulipifera_PAN_leaf.JPG",credit:"Crusier",license:"CC BY-SA 3.0"},
  american_hornbeam: {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Carpinus_caroliniana_kz1.jpg/960px-Carpinus_caroliniana_kz1.jpg",credit:"Krzysztof Ziarnek",license:"CC BY-SA 4.0"},
  // Fruiting / specialty
  native_crabapple:  {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Crab_apple_flower_4004.jpg/960px-Crab_apple_flower_4004.jpg",credit:"Chris Light",license:"CC BY-SA 4.0"},
  american_chestnut: {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Castanea_dentata.jpg/960px-Castanea_dentata.jpg",credit:"Jean-Pol Grandmont",license:"CC BY 3.0"},
  // New species
  black_oak:              {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Forest_Road_-_Black_Oak_%28Quercus_velutina%29_leaves_-_Flickr_-_Jay_Sturner_%281%29.jpg/960px-Forest_Road_-_Black_Oak_%28Quercus_velutina%29_leaves_-_Flickr_-_Jay_Sturner_%281%29.jpg",credit:"Jay Sturner",license:"CC BY 2.0"},
  gray_birch:             {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Betula_populifolia_leaves.jpg/960px-Betula_populifolia_leaves.jpg",credit:"Richtid",license:"CC BY-SA 3.0"},
  fire_resistant_pear:    {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Starr-130304-1935-Pyrus_communis-fruit_and_leaves-Montrose_Crater_Rd_Kula-Maui_%2825206313775%29.jpg/960px-Starr-130304-1935-Pyrus_communis-fruit_and_leaves-Montrose_Crater_Rd_Kula-Maui_%2825206313775%29.jpg",credit:"Forest and Kim Starr",license:"CC BY 3.0"},
  pennsylvania_hawthorn:  {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Crataegus_monogyna_003.JPG/960px-Crataegus_monogyna_003.JPG",credit:"H. Zell",license:"CC BY-SA 3.0"},
  arrowwood_viburnum:     {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Viburnum_dentatum_-_Arrowwood_Viburnum.jpg/960px-Viburnum_dentatum_-_Arrowwood_Viburnum.jpg",credit:"Fritzflohrreynolds",license:"CC BY-SA 3.0"},
  // Shrubs
  spicebush:         {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Lindera_benzoin_kz01.jpg/960px-Lindera_benzoin_kz01.jpg",credit:"Krzysztof Ziarnek",license:"CC BY-SA 4.0"},
  american_hazelnut: {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/American_Hazelnut_%28Corylus_americana%29_-_London%2C_Ontario_2015-04-12.jpg/960px-American_Hazelnut_%28Corylus_americana%29_-_London%2C_Ontario_2015-04-12.jpg",credit:"Ryan Hodnett",license:"CC BY-SA 4.0"},
  nannyberry:        {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/39._Viburnum_lentago%2C_sweet_viburnum%2C_sheep-berry_-_DPLA_-_c89626decde326641a454f253a5fb17a.jpg/960px-39._Viburnum_lentago%2C_sweet_viburnum%2C_sheep-berry_-_DPLA_-_c89626decde326641a454f253a5fb17a.jpg",credit:"Edwin Hale Lincoln",license:"Public domain"},
  red_elderberry:    {url:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/20220621_Sambucus_racemosa_01.jpg/960px-20220621_Sambucus_racemosa_01.jpg",credit:"Flocci Nivis",license:"CC BY 4.0"},
};

// ── Full species dataset ──────────────────────────────────────────────────
const SPECIES = [
  // CANOPY
  {
    key:"northern_red_oak", name:"Northern Red Oak", latin:"Quercus rubra",
    layer:"canopy", protection:"tube", plans:["A","B","C"],
    summary:"The backbone of this restoration. Grows 2 ft/year once established and begins supporting wildlife within the first season. More than 500 moth and butterfly species depend on oaks — more than any other eastern tree genus.",
    notes:"Plant in open gaps and along forest edges. Do not prune April–July (oak wilt risk). Climate-resilient — a USFS-confirmed winner as conditions warm.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/quercus/rubra.htm"}]
  },
  {
    key:"white_oak", name:"White Oak", latin:"Quercus alba",
    layer:"canopy", protection:"tube", plans:["B","C"],
    summary:"The generational anchor. Grows slowly but lives for centuries. White oak acorns are the least bitter and most nutritious of any eastern oak — preferred wildlife food. Deep burgundy fall color.",
    notes:"Plant for your grandchildren's grandchildren. Matures into a broad, majestic crown. Best on well-drained upland sites.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/quercus/alba.htm"}]
  },
  {
    key:"sugar_maple", name:"Sugar Maple", latin:"Acer saccharum",
    layer:"canopy", protection:"cage", plans:["A","B","C","D"],
    summary:"The primary ecological replacement for dying beech on north-facing slopes. The gold standard of fall color — orange, red, and yellow simultaneously on the same branch. Highly shade-tolerant as a seedling.",
    notes:"⚠️ Use wire cage, NOT plastic tube — PSU 2024 research found tube interiors reach 30°F above ambient, measurably damaging this species. Plant on moist, north-facing slopes.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/acer/saccharum.htm"}]
  },
  {
    key:"yellow_birch", name:"Yellow Birch", latin:"Betula alleghaniensis",
    layer:"canopy", protection:"cage", plans:["B","C","D"],
    summary:"Native specifically to cool forests at 1,800–2,500ft — your exact habitat. Bark peels in thin golden-yellow strips with a faint wintergreen scent. Rich golden fall color.",
    notes:"⚠️ Requires mineral soil or nurse log to germinate naturally. Wire cage — heat-sensitive. Plant in moist gaps on north-facing slopes.",
    refs:[{label:"USFS Silvics",url:"https://research.fs.usda.gov/silvics/yellow-birch"}]
  },
  {
    key:"shagbark_hickory", name:"Shagbark Hickory", latin:"Carya ovata",
    layer:"canopy", protection:"tube", plans:["A","B","C","D"],
    summary:"Pre-settlement dominant species that modern restoration almost entirely forgets. The shaggy peeling bark plates are the primary roosting habitat for Indiana bats and several other threatened bat species. Takes 50–70 years from seedling to bat-roosting size — plant now.",
    notes:"USFWS requires 16 trees >11\" DBH per acre for bat colony habitat. Plant on south-facing upland slopes. Hard mast for bears, squirrels, turkeys.",
    refs:[{label:"USFWS Bat Guidelines",url:"https://www.fws.gov/sites/default/files/documents/INFO%20Forest%20Management%20Guidelines%2023%20May%202019.pdf"},{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/carya/ovata.htm"}]
  },
  {
    key:"pignut_hickory", name:"Pignut Hickory", latin:"Carya glabra",
    layer:"canopy", protection:"tube", plans:["B","C","D"],
    summary:"The most ecologically appropriate hickory for upper ridges and slopes at 2,000ft — documented as a dominant species on ridge crests up to 4,900ft in the Appalachians. Supports 200+ moth species.",
    notes:"Plant on upper slopes and ridge tops. More shade-tolerant than shagbark — can establish in partially closed gaps.",
    refs:[{label:"USFS FEIS",url:"https://research.fs.usda.gov/feis/species-reviews/cargla"}]
  },
  {
    key:"black_gum", name:"Black Gum / Black Tupelo", latin:"Nyssa sylvatica",
    layer:"canopy", protection:"tube", plans:["B","C","D"],
    summary:"Produces the earliest and most brilliant fall color of any eastern native — deep scarlet as early as late August. Highly disease-resistant. More than 35 bird species consume the small blue-black berries.",
    notes:"USFS climate modeling projects black gum gaining habitat in this region under warming scenarios. Adaptable to a wide range of moisture conditions.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/nyssa/silvatica.htm"}]
  },
  {
    key:"black_oak", name:"Black Oak", latin:"Quercus velutina",
    layer:"canopy", protection:"tube", plans:["B","C"],
    summary:"Ridge and dry-slope companion to red and chestnut oak. Highly adaptable to thin, acidic upland soils. Supports 500+ Lepidoptera species alongside its oak relatives.",
    notes:"Plant on dry ridges and upper slopes. Similar habitat to chestnut oak — the two belong together as the ridge-top canopy duo. Fall color is deep red to russet.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/quercus/velutina.htm"}]
  },
  {
    key:"bigtooth_aspen", name:"Bigtooth Aspen", latin:"Populus grandidentata",
    layer:"canopy", protection:"tube", plans:["B","C"],
    summary:"The most important pioneer for filling large open gaps immediately. Grows very fast, spreads by root sprouting into dense thickets that are prime habitat for ruffed grouse and woodcock. Supports 318 Lepidoptera species.",
    notes:"Plant as a nurse crop in the most open disturbed areas. Short-lived (~40–60 years); creates conditions for slower oaks and hickories beneath it.",
    refs:[{label:"USFS FEIS",url:"https://research.fs.usda.gov/feis/species-reviews/popgra"}]
  },
  {
    key:"basswood", name:"Basswood / American Linden", latin:"Tilia americana",
    layer:"canopy", protection:"tube", plans:["C","D"],
    summary:"The single most important tree for native bees and pollinators in eastern North America. The June bloom is intensely fragrant and can be heard from a distance as thousands of bees work the flowers.",
    notes:"Best on moist, productive north-facing coves. Regenerates poorly in disturbed upland without active planting — worth buying for this reason.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/tilia/americana.htm"}]
  },
  {
    key:"cucumber_magnolia", name:"Cucumber Magnolia", latin:"Magnolia acuminata",
    layer:"canopy", protection:"tube", plans:["C","D"],
    summary:"The most overlooked native canopy tree for this region. People don't think of magnolias as Appalachian upland trees — but this one is native and common on the Allegheny Plateau, associating naturally with yellow birch, hemlock, and basswood.",
    notes:"Almost never planted in restoration. Grows to 60–80ft. Large red seed cones in fall. Plant in rich, moist coves.",
    refs:[{label:"PA Flora",url:"https://www.paenflowered.org/apgii/magnoliales/magnoliaceae/magnolia/magnolia-acuminata"}]
  },
  {
    key:"sassafras", name:"Sassafras", latin:"Sassafras albidum",
    layer:"canopy", protection:"tube", plans:["C"],
    summary:"An aromatic pioneer with three distinct leaf shapes on the same tree. Host plant for the eastern tiger swallowtail and spicebush swallowtail. Historically significant to the Lenape people of this region. Clonal — spreads by root sprouting.",
    notes:"37 Lepidoptera species depend on it. Excellent for old fields, edges, and disturbed gaps. Dioecious — needs both sexes for fruit.",
    refs:[{label:"USFS Silvics",url:"https://research.fs.usda.gov/silvics/sassafras"}]
  },
  {
    key:"gray_birch", name:"Gray Birch", latin:"Betula populifolia",
    layer:"canopy", protection:"tube", plans:["C"],
    summary:"Short-lived pioneer (40–50 years) for disturbed gaps and old-field edges. Establishes fast on poor, compacted soils and creates the dappled canopy that longer-lived oaks and maples need to establish beneath.",
    notes:"A scaffold species — does a job for a few decades, then steps aside. Does not require mineral soil like yellow birch. Plant in the most disturbed, open areas.",
    refs:[]
  },
  {
    key:"black_cherry", name:"Black Cherry", latin:"Prunus serotina",
    layer:"canopy", protection:"tube", plans:["C"],
    summary:"One of the most ecologically valuable trees in eastern North America — 450+ Lepidoptera species depend on it. Critical wildlife food. Recovers naturally after management if black knot is addressed.",
    notes:"⚠️ If black knot fungus is present on your property, survey and manage existing trees before replanting. See our disease guide.",
    refs:[{label:"Black Knot Guide",url:"management.html#black-knot"}]
  },
  // UNDERSTORY
  {
    key:"serviceberry", name:"Allegheny Serviceberry", latin:"Amelanchier laevis",
    layer:"understory", protection:"cage", plans:["A","B","C"],
    summary:"The first tree in your forest to bloom — white flowers in late March or early April, before the leaves emerge. The berries ripen in June and are consumed by virtually every forest bird species within days.",
    notes:"For Plan D: arrives naturally within 3–7 years of deer management. Save your budget. For Plans A–C: excellent investment, shade-tolerant, no serious disease issues.",
    refs:[{label:"Wildflower.org",url:"https://www.wildflower.org/plants/result.php?id_plant=amla"}]
  },
  {
    key:"pagoda_dogwood", name:"Pagoda Dogwood", latin:"Cornus alternifolia",
    layer:"understory", protection:"cage", plans:["B","C","D"],
    summary:"The better native dogwood for forest interior planting. Unlike flowering dogwood, pagoda dogwood is disease-free, genuinely shade-tolerant, and thrives in forest interior conditions. 40+ bird species consume the dark blue-black berries.",
    notes:"Host for Spring Azure butterfly. Horizontal branching in tiers gives striking four-season structure. No anthracnose risk — the primary problem with flowering dogwood at this elevation.",
    refs:[{label:"Morton Arboretum",url:"https://mortonarb.org/plant-and-protect/trees-and-plants/pagoda-dogwood/"}]
  },
  {
    key:"mountain_ash", name:"American Mountain Ash", latin:"Sorbus americana",
    layer:"understory", protection:"cage", plans:["C","D"],
    summary:"Native to rocky north-facing slopes at your exact elevation — 1,800–2,500ft in the Pocono Plateau. Clusters of white flowers turn into bright orange-red berries by fall. Critical food for migrating robins, thrushes, waxwings, and grouse.",
    notes:"Almost never planted in restoration work despite being ecologically native here. Source from Go Native Tree Farm (Lancaster, PA) or Cold Stream Farm.",
    refs:[{label:"USFS FEIS",url:"https://www.fs.usda.gov/database/feis/plants/tree/sorame/all.html"}]
  },
  {
    key:"hop_hornbeam", name:"Hop-Hornbeam / Ironwood", latin:"Ostrya virginiana",
    layer:"understory", protection:"cage", plans:["A","B","C"],
    summary:"The most reliable native understory tree — shade tolerant, disease-free, drought tolerant on rocky slopes. The seed clusters resemble hops. Important seed source for woodland birds. Essentially fails to receive attention despite being excellent.",
    notes:"For Plan D: arrives naturally with deer management — let it come. For Plans A–C: an excellent foundational understory species for any challenging spot.",
    refs:[{label:"NC State Extension",url:"https://plants.ces.ncsu.edu/plants/ostrya-virginiana/"}]
  },
  {
    key:"american_hornbeam", name:"American Hornbeam / Musclewood", latin:"Carpinus caroliniana",
    layer:"understory", protection:"cage", plans:["C"],
    summary:"Named for its sinewy, muscle-like bark — one of the most distinctive of any native tree. One of the few understory trees that establishes in deep shade near streams and moist hollows. Disease-free, long-lived, and virtually ignored in restoration plantings.",
    notes:"Best near drainages and moist hollows. Seeds eaten by birds and small mammals; buds by turkeys and grouse. Wire cage — slow-growing and preferred by deer.",
    refs:[]
  },
  {
    key:"witch_hazel", name:"Witch Hazel", latin:"Hamamelis virginiana",
    layer:"understory", protection:"cage", plans:["B","C"],
    summary:"The last thing blooming in the forest — yellow spider-like flowers in October and November, after all the leaves have fallen. Unique in the native flora. Seed pods explode audibly, shooting seeds up to 30 feet.",
    notes:"Native forest understory throughout this region. No significant disease problems. Outstanding four-season interest.",
    refs:[{label:"NC State Extension",url:"https://plants.ces.ncsu.edu/plants/hamamelis-virginiana/"}]
  },
  // CONIFERS
  {
    key:"balsam_fir", name:"Balsam Fir", latin:"Abies balsamea",
    layer:"conifer", protection:"cage", plans:["A","B","C","D"],
    summary:"The signature fragrant fir of northern forests and the recommended primary conifer for this elevation. Dense winter cover, classic conical form. Lower climate risk profile than red spruce for the 2,000ft zone.",
    notes:"No natural seed source at this elevation — must be planted. Cool ravines and north-facing slopes. Wire cage — heat-sensitive.",
    refs:[]
  },
  {
    key:"red_spruce", name:"Red Spruce", latin:"Picea rubens",
    layer:"conifer", protection:"cage", plans:["B","C","D"],
    summary:"Native to this elevation in the Pocono Plateau. Long-lived, ecologically irreplaceable for the boreal species guild. No natural seed source nearby — must be planted. Part of a major multi-state restoration initiative (CASRI).",
    notes:"⚠️ Plant on NORTH-FACING slopes and cool ravines only — at 2,000ft you are at the lower fringe of its climate range. Wire cage. Local forester advises planting conservatively.",
    refs:[{label:"CASRI",url:"https://restoreredspruce.org/"}]
  },
  {
    key:"eastern_hemlock", name:"Eastern Hemlock", latin:"Tsuga canadensis",
    layer:"conifer", protection:"cage", plans:["C","D"],
    summary:"Pennsylvania's state tree and one of the most ecologically critical conifers in the northeast. Its dense shade creates the unique cool, dark microhabitat that brook trout, salamanders, and many woodland birds depend on.",
    notes:"⚠️ Hemlock Woolly Adelgid (HWA) confirmed in all 67 PA counties. Plant only where you will commit to treatment (soil drench every 4–6 years). Wire cage. Ravines and stream edges only.",
    refs:[{label:"PSU Extension — HWA",url:"https://extension.psu.edu/hemlock-woolly-adelgid"}]
  },
  {
    key:"pitch_pine", name:"Pitch Pine", latin:"Pinus rigida",
    layer:"conifer", protection:"tube", plans:["C"],
    summary:"The most fire- and drought-resistant pine in the northeast. Can re-sprout from its base after fire. Important for dry rocky ridge tops where other conifers struggle. Supports a unique moth community.",
    notes:"Plant specifically on the most exposed, rocky, dry ridge tops. No current significant disease threats.",
    refs:[]
  },
  // SHRUBS
  {
    key:"spicebush", name:"Spicebush", latin:"Lindera benzoin",
    layer:"shrub", protection:"none", plans:["B","C"],
    summary:"A native forest understory shrub with aromatic leaves, bark, and berries. Host plant for the spicebush swallowtail butterfly. Yellow flowers very early in spring. Brilliant red berries in fall eaten by thrushes and migrating songbirds.",
    notes:"Shade tolerant — true forest interior native. Plant in sheltered spots and lower elevations. The aromatic foliage is immediately recognizable.",
    refs:[]
  },
  // NEW SPECIES
  {
    key:"chestnut_oak", name:"Chestnut Oak", latin:"Quercus montana",
    layer:"canopy", protection:"tube", plans:["B","C"],
    summary:"The signature oak of dry, rocky ridges at this elevation — more drought-tolerant than red oak on thin, acidic, exposed soils. Produces the largest acorn of any eastern oak, critical mast for wildlife on the ridge.",
    notes:"Plant on rocky ridges and dry south/west-facing slopes. Deeply ridged bark. Slower-growing but very long-lived.",
    refs:[{label:"USFS FEIS",url:"https://www.fs.usda.gov/database/feis/plants/tree/quemon/all.html"}]
  },
  {
    key:"white_birch", name:"Sweet/Black Birch", latin:"Betula lenta",
    layer:"canopy", protection:"cage", plans:["C"],
    summary:"Common native of rocky Appalachian slopes at this elevation. Peel a twig and smell wintergreen — it's the original source of oil of wintergreen. Dark bronze-brown bark and golden fall color.",
    notes:"Wire cage. No significant disease threats. Well-adapted to rocky outcrops and steep slopes throughout NEPA.",
    refs:[]
  },
  {
    key:"tulip_poplar", name:"Tulip Poplar", latin:"Liriodendron tulipifera",
    layer:"canopy", protection:"tube", plans:["C"],
    summary:"The tallest native tree in eastern North America — grows 3 feet per year and reaches 100+ feet with a straight, clean trunk. Spectacular orange-green tulip-shaped flowers in May. At the northern fringe of its range at 2,000ft — south-facing, sheltered, lower slopes only.",
    notes:"Skip for exposed or north-facing sites. Best in moist, fertile coves on southern aspects. Provides exceptional wildlife value — hummingbirds and bees work the flowers heavily.",
    refs:[]
  },
  {
    key:"black_walnut", name:"Black Walnut", latin:"Juglans nigra",
    layer:"canopy", protection:"tube", plans:["C"],
    summary:"The most valuable native nut tree in eastern North America. Large, rich nuts consumed by squirrels, bears, deer, and turkeys. Impressive yellow fall color. Deep-rooted and long-lived.",
    notes:"Plant only in moist, fertile coves — struggles on rocky, acidic upland soils. 1–3 per acre maximum in the best spots.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/juglans/nigra.htm"}]
  },
  {
    key:"mockernut_hickory", name:"Mockernut Hickory", latin:"Carya tomentosa",
    layer:"canopy", protection:"tube", plans:["C","D"],
    summary:"Third hickory species for dry upper ridges, growing alongside pignut hickory. Large, hard nuts that wildlife consume. Dense rounded crown. No significant disease threats.",
    notes:"Plant on dry upper ridges as a companion to pignut and shagbark hickory. Restoring all three hickory species corrects the pre-settlement oak-hickory co-dominance.",
    refs:[{label:"USFS Silvics",url:"https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_2/carya/tomentosa.htm"}]
  },
  {
    key:"striped_maple", name:"Striped Maple / Moosewood", latin:"Acer pensylvanicum",
    layer:"understory", protection:"cage", plans:["C"],
    summary:"A true northern hardwood forest companion — native to NEPA at this exact elevation. The distinctive white-striped green bark is recognizable year-round. Clear yellow fall color.",
    notes:"Small understory tree to 15–20ft. Highly shade tolerant. Often browsed by deer — wire cage essential.",
    refs:[]
  },
  {
    key:"native_crabapple", name:"Native Sweet Crabapple", latin:"Malus coronaria",
    layer:"fruiting", protection:"tube", plans:["B","C"],
    summary:"The native crabapple. Pink-white flowers in May are intensely rose-scented and visible from a distance. Hosts 287 species of moths and butterflies. Small tart apples persist on the tree through winter, providing critical cold-weather bird food.",
    notes:"Plant at forest edges and in large open gaps. Not the same as ornamental Sargent crabapple — Malus coronaria is the ecologically correct species for this region.",
    refs:[{label:"Wildflower.org",url:"https://www.wildflower.org/plants/result.php?id_plant=maco5"}]
  },
  {
    key:"fire_resistant_pear", name:"Fire-Resistant Pear", latin:"Pyrus communis",
    layer:"fruiting", protection:"tube", plans:["C"],
    summary:"Use fire-blight-resistant cultivars: Moonglow, Harrow Sweet, or Luscious. Locally confirmed to do well at this elevation. Late-summer fruit consumed by deer, bear, raccoon, and birds.",
    notes:"Specify a resistant cultivar when ordering — not all pears are equal for fire blight tolerance. Plant at forest edges and in open gaps with good air circulation.",
    refs:[]
  },
  {
    key:"american_chestnut", name:"American Chestnut (TACF)", latin:"Castanea dentata",
    layer:"fruiting", protection:"tube", plans:["C"],
    summary:"Restored from near-extinction. The American chestnut once fed an entire eastern forest ecosystem. TACF backcross hybrids have intermediate blight resistance and can survive to reproductive age. Planting them is both ecological restoration and an act of historical reconnection.",
    notes:"TACF backcross hybrids only — not straight-species stock. Contact PA-NJ TACF Chapter (patacf.org) for seedling availability.",
    refs:[{label:"TACF",url:"https://www.tacf.org/"},{label:"PA-NJ Chapter",url:"https://patacf.org/"}]
  },
  {
    key:"pennsylvania_hawthorn", name:"Pennsylvania Hawthorn", latin:"Crataegus pennsylvanica",
    layer:"shrub", protection:"none", plans:["B","C"],
    summary:"One of the best native shrubs for wildlife in the entire eastern forest. Hosts 159 Lepidoptera species. Dense thorny branching provides the best nesting cover available — robins, catbirds, and thrushes specifically seek it out. White flowers in May, red berries persisting into January.",
    notes:"Native to this state. The thorns that make it impenetrable for predators are the feature, not a bug. Plant at forest edges and gap margins.",
    refs:[]
  },
  {
    key:"arrowwood_viburnum", name:"Arrowwood Viburnum", latin:"Viburnum dentatum",
    layer:"shrub", protection:"none", plans:["B","C","D"],
    summary:"The most adaptable native viburnum for this region — tolerates sun or shade, wet or dry, and a wide range of soil types. Flat-topped white flower clusters in June followed by dark blue-black berries consumed by more than 35 bird species.",
    notes:"An excellent all-purpose shrub for any challenging spot in the planting. Spreads slowly by suckers to form a colony. Outstanding fall color (red to orange-red).",
    refs:[]
  },
  {
    key:"american_hazelnut", name:"American Hazelnut", latin:"Corylus americana",
    layer:"shrub", protection:"none", plans:["B","C","D"],
    summary:"Produces hard nuts in papery husks — a critical food source for turkeys, grouse, blue jays, and squirrels. Shade tolerant, spreads by rhizome, provides dense cover. Host for Polyphemus moth, one of the largest and most spectacular native moths.",
    notes:"Plant throughout understory and gap edges. Easy to establish; tolerates a wide range of soils.",
    refs:[]
  },
  {
    key:"nannyberry", name:"Nannyberry", latin:"Viburnum lentago",
    layer:"shrub", protection:"none", plans:["B","C","D"],
    summary:"Clusters of dark blue-black berries that persist well into winter, providing critical food for songbirds during the coldest months. Cedar waxwings, robins, and thrushes depend on it. Cold-hardy and native throughout NEPA.",
    notes:"Grows in sun or shade. One of the best native viburnums for this elevation.",
    refs:[]
  },
  {
    key:"red_elderberry", name:"Red Elderberry", latin:"Sambucus racemosa",
    layer:"shrub", protection:"none", plans:["B","C","D"],
    summary:"Native to cool, rocky mountain slopes — specifically your elevation and aspect. Produces large clusters of bright red berries in June, important food for thrushes and migrating songbirds. White flower clusters in May.",
    notes:"Plant on north-facing slopes and in cool forest gaps. Distinct from the more common American elderberry — racemosa is the species native at this elevation.",
    refs:[{label:"PA Flora",url:"https://www.paenflowered.org/apgii/dipsacales/adoxaceae/sambucus/sambucus-racemosa"}]
  },
];

window.SPECIES_DATA = SPECIES;
window.SPECIES_PHOTOS = PHOTOS;
