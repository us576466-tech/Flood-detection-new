/**
 * AI-Based Detection of Flood-Affected Areas in North-East India Using Satellite Images
 * Environmental Studies (EVS) College Project Website
 * Script: main.js
 * Clean, structured vanilla JavaScript designed for easy understanding by a 1st year B.Tech CSE student.
 */

document.addEventListener("DOMContentLoaded", () => {
  initReadingProgressBar();
  initThemeToggle();
  initMobileNav();
  initStickyNav();
  initBeforeAfterSlider();
  initNeIndiaMap();
  initPipeline();
  initAiDetectionDemo();
  initDashboardControls();
  initScrollAnimations();
  initStatCounters();
  initBackToTop();
});

/* ==========================================================================
   0. Top Reading Progress Bar & Web Audio Synthesizer
   ========================================================================== */
function initReadingProgressBar() {
  const bar = document.getElementById("readingProgressBar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

let audioContext = null;
let isAudioMuted = false;

function playTechChime(freq = 580, duration = 0.08, type = "sine") {
  if (isAudioMuted) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Audio synthesis silently disabled if browser permissions block it
  }
}

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem("evs-flood-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("evs-flood-theme", newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("themeIcon");
  if (!themeIcon) return;
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeIcon.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

/* ==========================================================================
   2. Sticky Navigation & Mobile Menu
   ========================================================================== */
function initStickyNav() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link highlighting on scroll
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });
}

function initMobileNav() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!hamburgerBtn || !navMenu) return;

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    hamburgerBtn.textContent = isOpen ? "✕" : "☰";
    hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      hamburgerBtn.textContent = "☰";
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   3. Section 3: Interactive North-East India Map Data & Interaction
   ========================================================================== */
const NE_STATES_DATA = {
  assam: {
    name: "Assam",
    capital: "Dispur",
    risk: "High",
    riskClass: "risk-high",
    rivers: "Brahmaputra, Barak, Subansiri, Kopili",
    terrain: "Extensive alluvial river valley flanked by hills",
    rainfall: "2,000 - 3,500 mm annually",
    description: "Assam experiences recurrent, devastating annual floods as the Brahmaputra carries snowmelt from the Himalayas and heavy monsoon rainfall through a narrow valley, causing massive erosion, submerging river islands like Majuli, and inundating Kaziranga National Park.",
    keyFactors: "Extreme sedimentation, bank erosion, high river discharge, breach of earthen embankments."
  },
  arunachal: {
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    risk: "Moderate (Flash Floods)",
    riskClass: "risk-moderate",
    rivers: "Siang, Subansiri, Kameng, Lohit, Dibang",
    terrain: "Rugged Eastern Himalayas with steep gorges",
    rainfall: "2,500 - 4,500 mm annually",
    description: "Characterized by mountainous terrain, vulnerability mainly stems from intense cloudbursts, severe flash floods, and landslide dam outburst floods (LDOFs) that rush down into Assam's plains.",
    keyFactors: "Steep topography, active seismic zone, cloudbursts, heavy debris flow."
  },
  meghalaya: {
    name: "Meghalaya",
    capital: "Shillong",
    risk: "Moderate (Foothills)",
    riskClass: "risk-moderate",
    rivers: "Simsang, Umngot, Myntdu, Umiam",
    terrain: "Rolling plateau with deep southern gorges",
    rainfall: "Highest in the world (Mawsynram: ~11,800 mm)",
    description: "While high plateaus drain rapidly, the southern and western foothill valleys (West Garo Hills) face severe waterlogging and flash floods overflowing towards Bangladesh and Assam.",
    keyFactors: "World-record monsoon rains, soil erosion on exposed steep slopes, rapid runoff."
  },
  manipur: {
    name: "Manipur",
    capital: "Imphal",
    risk: "Moderate",
    riskClass: "risk-moderate",
    rivers: "Imphal, Iril, Thoubal, Barak",
    terrain: "Central bowl-shaped Imphal valley enclosed by hills",
    rainfall: "1,400 - 1,800 mm annually",
    description: "The central valley forms a natural depression draining into Loktak Lake. When rainfall exceeds lake discharge capacity, urban flooding strikes Imphal and agricultural lowlands.",
    keyFactors: "Bowl topography, siltation of Loktak lake and drainage channels, river choking."
  },
  mizoram: {
    name: "Mizoram",
    capital: "Aizawl",
    risk: "Low-to-Moderate (Valleys)",
    riskClass: "risk-low",
    rivers: "Tlawng, Chhimtuipui (Kaladan), Tuivawl",
    terrain: "North-south parallel ridge terrain and steep valleys",
    rainfall: "2,500 - 3,000 mm annually",
    description: "Mountainous topography prevents widespread standing riverine flooding, but intense monsoon spells trigger dangerous flash floods along narrow river gorges and catastrophic landslides.",
    keyFactors: "Steep hillside slopes, flash floods along river beds, road connectivity washouts."
  },
  nagaland: {
    name: "Nagaland",
    capital: "Kohima",
    risk: "Low-to-Moderate (Foothills)",
    riskClass: "risk-low",
    rivers: "Doyang, Dhansiri, Dikhu, Tizu",
    terrain: "Rugged Naga hills and narrow foothill terraces",
    rainfall: "1,800 - 2,500 mm annually",
    description: "The upland interior faces localized flash floods and mudslides, while the foothill border areas near Dimapur (Dhansiri river) witness flood inundations during peak monsoon.",
    keyFactors: "Narrow valleys, landslide mud flows, foothill silt accumulation."
  },
  tripura: {
    name: "Tripura",
    capital: "Agartala",
    risk: "Moderate to High",
    riskClass: "risk-moderate",
    rivers: "Howrah, Gomati, Manu, Khowai",
    terrain: "Low undulating hills with broad alluvial plains",
    rainfall: "2,200 - 2,600 mm annually",
    description: "Low-lying topography surrounded on three sides by Bangladesh. Flash floods and river bank breaches along Howrah and Gomati rivers regularly inundate urban settlements and paddy lands.",
    keyFactors: "Trans-boundary river drainage, low terrain elevation, urban drainage congestion."
  },
  sikkim: {
    name: "Sikkim",
    capital: "Gangtok",
    risk: "Moderate (GLOF & Flash)",
    riskClass: "risk-moderate",
    rivers: "Teesta, Rangeet",
    terrain: "Glaciated High Himalayas and deep gorges",
    rainfall: "2,700 - 3,200 mm annually",
    description: "Vulnerable to Glacial Lake Outburst Floods (GLOFs) and torrential flash floods along the Teesta river basin, which can wash away bridges, dams, and riverside roads.",
    keyFactors: "High glacial lakes (e.g. South Lhonak), steep hydraulic gradient, cloudbursts."
  }
};

/* ==========================================================================
   3. Section 3: Real Satellite & Geospatial Map of North-East India (Leaflet)
   ========================================================================== */
const NE_STATE_BOUNDARIES = {
  assam: [
    [27.85, 95.80], [27.50, 96.00], [27.00, 95.40], [26.60, 94.60], [26.20, 93.80],
    [25.80, 93.50], [25.40, 93.00], [25.00, 93.20], [24.70, 93.10], [24.40, 92.90],
    [24.65, 92.40], [25.00, 92.40], [25.50, 92.80], [25.80, 91.80], [25.90, 90.80],
    [26.02, 89.97], [26.40, 89.90], [26.60, 90.50], [26.80, 91.20], [26.95, 92.10],
    [27.05, 93.20], [27.35, 94.20], [27.85, 95.80]
  ],
  arunachal: [
    [27.60, 91.80], [28.00, 92.20], [28.25, 93.00], [28.80, 94.00], [29.10, 95.00],
    [28.85, 96.20], [28.30, 97.20], [27.80, 97.40], [27.00, 96.60], [26.80, 95.80],
    [27.20, 95.40], [27.85, 95.80], [27.35, 94.20], [27.05, 93.20], [26.95, 92.10],
    [27.20, 91.80], [27.60, 91.80]
  ],
  meghalaya: [
    [25.80, 90.00], [26.00, 90.80], [25.80, 91.80], [25.60, 92.80], [25.10, 92.80],
    [25.12, 91.50], [25.20, 90.20], [25.50, 89.90], [25.80, 90.00]
  ],
  nagaland: [
    [27.00, 95.20], [26.80, 95.80], [26.30, 95.20], [25.80, 94.80], [25.50, 94.30],
    [25.60, 93.80], [26.20, 94.20], [26.60, 94.60], [27.00, 95.20]
  ],
  manipur: [
    [25.70, 94.20], [25.50, 94.80], [24.80, 94.60], [24.20, 94.40], [23.90, 93.40],
    [24.40, 93.00], [25.00, 93.20], [25.40, 93.50], [25.70, 94.20]
  ],
  mizoram: [
    [24.40, 92.90], [24.20, 93.30], [23.80, 93.40], [23.00, 93.30], [22.20, 93.00],
    [22.00, 92.70], [22.50, 92.50], [23.20, 92.40], [24.00, 92.40], [24.40, 92.90]
  ],
  tripura: [
    [24.50, 92.20], [24.20, 92.40], [23.50, 92.20], [23.00, 91.80], [23.30, 91.20],
    [23.80, 91.20], [24.30, 91.80], [24.50, 92.20]
  ],
  sikkim: [
    [27.20, 88.10], [27.60, 88.10], [28.00, 88.50], [28.10, 88.70], [27.80, 88.90],
    [27.30, 88.80], [27.10, 88.50], [27.20, 88.10]
  ]
};

const BRAHMAPUTRA_RIVER_PATH = [
  [28.45, 95.35], [28.05, 95.33], [27.85, 95.40], [27.48, 94.92], [27.15, 94.52],
  [26.92, 94.18], [26.75, 93.65], [26.58, 92.85], [26.25, 92.05], [26.18, 91.75],
  [26.15, 91.20], [26.17, 90.62], [26.02, 89.97], [25.75, 89.72]
];

const BARAK_RIVER_PATH = [
  [25.20, 93.60], [24.95, 93.20], [24.82, 92.80], [24.86, 92.35]
];

const DISASTER_HOTSPOTS = [
  {
    name: "Majuli River Island",
    coords: [26.95, 94.21],
    risk: "Critical (Erosion & Inundation)",
    riskClass: "risk-high",
    desc: "World's largest inhabited river island; recurrent severe bank erosion and sandbar char submergence.",
    caution: false
  },
  {
    name: "Kaziranga National Park Corridor",
    coords: [26.58, 93.17],
    risk: "Severe (Wildlife Alert)",
    riskClass: "risk-high",
    desc: "Floods submerging animal habitats, forcing One-Horned Rhinoceroses across NH-715 to Karbi Anglong highlands.",
    caution: false
  },
  {
    name: "Morigaon Floodplains",
    coords: [26.25, 92.34],
    risk: "High (Agrarian Sand-Casting)",
    riskClass: "risk-high",
    desc: "Extensive submergence of monsoon Sali rice paddies with destructive sediment and sand deposition.",
    caution: false
  },
  {
    name: "Silchar (Barak Valley)",
    coords: [24.83, 92.79],
    risk: "High (Urban Deluge)",
    riskClass: "risk-high",
    desc: "Bethukandi embankment breach zone causing acute urban flooding and water supply contamination.",
    caution: false
  },
  {
    name: "Subansiri Lower Basin",
    coords: [27.55, 94.25],
    risk: "Moderate (Himalayan Surge)",
    riskClass: "risk-moderate",
    desc: "Steep catchment flash floods and landslide dam breaches rushing down into Lakhimpur plains.",
    caution: true
  },
  {
    name: "South Lhonak Glacial Lake, Sikkim",
    coords: [27.91, 88.20],
    risk: "High (GLOF Hazard)",
    riskClass: "risk-high",
    desc: "High-altitude glacial lake vulnerable to catastrophic breach floods along the Teesta river basin.",
    caution: true
  }
];

let leafletMap = null;
let statePolygonLayers = {};
let riverLayersGroup = null;
let hotspotLayersGroup = null;
let currentBaseLayer = null;

function initNeIndiaMap() {
  const mapContainer = document.getElementById("neIndiaLeafletMap");
  const stateBtns = document.querySelectorAll(".state-btn");

  function updateInfoCard(stateKey) {
    const data = NE_STATES_DATA[stateKey];
    if (!data) return;

    // Update State Buttons
    stateBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.state === stateKey);
    });

    // Update Info Display Card
    const nameEl = document.getElementById("stateNameDisplay");
    const riskEl = document.getElementById("stateRiskDisplay");
    const capitalEl = document.getElementById("stateCapitalDisplay");
    const riversEl = document.getElementById("stateRiversDisplay");
    const terrainEl = document.getElementById("stateTerrainDisplay");
    const rainfallEl = document.getElementById("stateRainfallDisplay");
    const descEl = document.getElementById("stateDescDisplay");
    const factorsEl = document.getElementById("stateFactorsDisplay");

    if (nameEl) nameEl.textContent = data.name;
    if (riskEl) {
      riskEl.textContent = `${data.risk} Vulnerability`;
      riskEl.className = `risk-pill ${data.riskClass}`;
    }
    if (capitalEl) capitalEl.textContent = data.capital;
    if (riversEl) riversEl.textContent = data.rivers;
    if (terrainEl) terrainEl.textContent = data.terrain;
    if (rainfallEl) rainfallEl.textContent = data.rainfall;
    if (descEl) descEl.textContent = data.description;
    if (factorsEl) factorsEl.textContent = data.keyFactors;
  }

  function highlightMapState(stateKey) {
    if (!leafletMap) return;

    // Reset styles
    Object.keys(statePolygonLayers).forEach((key) => {
      const layer = statePolygonLayers[key];
      if (layer) {
        layer.setStyle({
          fillColor: key === stateKey ? "#10b981" : "#1e40af",
          fillOpacity: key === stateKey ? 0.45 : 0.2,
          color: key === stateKey ? "#10b981" : "#38bdf8",
          weight: key === stateKey ? 3.5 : 1.5
        });
      }
    });

    const targetLayer = statePolygonLayers[stateKey];
    if (targetLayer) {
      leafletMap.fitBounds(targetLayer.getBounds(), {
        padding: [30, 30],
        maxZoom: 8,
        animate: true,
        duration: 0.8
      });
    }
  }

  // Click listeners on State Pills
  stateBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stateKey = btn.dataset.state;
      updateInfoCard(stateKey);
      highlightMapState(stateKey);
    });
  });

  // Check if Leaflet library is available
  if (typeof L !== "undefined" && mapContainer) {
    initLeafletSatelliteMap(updateInfoCard, highlightMapState);
  } else if (mapContainer) {
    // Graceful fallback if offline without CDN
    initFallbackVectorMap(mapContainer, updateInfoCard);
  }

  // Default selection
  updateInfoCard("assam");
}

function initLeafletSatelliteMap(updateInfoCard, highlightMapState) {
  const mapCenter = [26.15, 93.30];
  const initialZoom = 6.8;

  // Initialize Map
  leafletMap = L.map("neIndiaLeafletMap", {
    center: mapCenter,
    zoom: initialZoom,
    minZoom: 5.5,
    maxZoom: 14,
    zoomControl: true,
    attributionControl: false
  });

  // Base Tile Layers
  const tileSatellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Esri World Imagery"
  });

  const tileTopo = L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Voyager"
  });

  const tileRadar = L.tileLayer("https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Dark"
  });

  // Default to ESRI Satellite Basemap
  currentBaseLayer = tileSatellite;
  tileSatellite.addTo(leafletMap);

  // Basemap Toolbar Buttons
  const btnSat = document.getElementById("btnSatelliteBasemap");
  const btnTopo = document.getElementById("btnTopoBasemap");
  const btnRadar = document.getElementById("btnRadarBasemap");

  function switchBasemap(newLayer, activeBtn) {
    if (currentBaseLayer) leafletMap.removeLayer(currentBaseLayer);
    currentBaseLayer = newLayer;
    newLayer.addTo(leafletMap);

    [btnSat, btnTopo, btnRadar].forEach((b) => {
      if (b) b.classList.remove("active");
    });
    if (activeBtn) activeBtn.classList.add("active");
  }

  if (btnSat) btnSat.addEventListener("click", () => switchBasemap(tileSatellite, btnSat));
  if (btnTopo) btnTopo.addEventListener("click", () => switchBasemap(tileTopo, btnTopo));
  if (btnRadar) btnRadar.addEventListener("click", () => switchBasemap(tileRadar, btnRadar));

  // Reset View Button
  const btnReset = document.getElementById("btnResetMapView");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      leafletMap.setView(mapCenter, initialZoom, { animate: true });
      updateInfoCard("assam");
      highlightMapState("assam");
    });
  }

  // Draw 8 State Boundaries with Real Polygons
  Object.keys(NE_STATE_BOUNDARIES).forEach((stateKey) => {
    const coords = NE_STATE_BOUNDARIES[stateKey];
    const data = NE_STATES_DATA[stateKey];
    const isAssam = stateKey === "assam";

    const polygon = L.polygon(coords, {
      color: isAssam ? "#10b981" : "#38bdf8",
      weight: isAssam ? 3 : 1.5,
      opacity: 0.9,
      fillColor: isAssam ? "#10b981" : "#1e40af",
      fillOpacity: isAssam ? 0.35 : 0.15,
      className: "state-boundary-polygon"
    }).addTo(leafletMap);

    polygon.bindTooltip(`<strong>${data.name}</strong><br><span style="font-size: 11px;">${data.risk} Vulnerability</span>`, {
      sticky: true,
      direction: "top",
      className: "custom-leaflet-tooltip"
    });

    polygon.on("mouseover", () => {
      polygon.setStyle({
        fillOpacity: 0.5,
        weight: 3.5,
        color: "#10b981"
      });
    });

    polygon.on("mouseout", () => {
      const activeBtn = document.querySelector(`.state-btn.active`);
      const isActive = activeBtn && activeBtn.dataset.state === stateKey;
      polygon.setStyle({
        fillOpacity: isActive ? 0.45 : 0.18,
        weight: isActive ? 3 : 1.5,
        color: isActive ? "#10b981" : "#38bdf8"
      });
    });

    polygon.on("click", () => {
      updateInfoCard(stateKey);
      highlightMapState(stateKey);
    });

    statePolygonLayers[stateKey] = polygon;
  });

  // Major River Networks
  riverLayersGroup = L.layerGroup();
  const brahmaputraLine = L.polyline(BRAHMAPUTRA_RIVER_PATH, {
    color: "#38bdf8",
    weight: 4.5,
    opacity: 0.9,
    dashArray: "10, 6"
  }).bindTooltip("🌊 Brahmaputra River Basin", { sticky: true });

  const barakLine = L.polyline(BARAK_RIVER_PATH, {
    color: "#60a5fa",
    weight: 3.5,
    opacity: 0.85
  }).bindTooltip("🌊 Barak River Channel", { sticky: true });

  riverLayersGroup.addLayer(brahmaputraLine);
  riverLayersGroup.addLayer(barakLine);
  riverLayersGroup.addTo(leafletMap);

  // Disaster Hotspots Layer with Pulsing Rings
  hotspotLayersGroup = L.layerGroup();
  DISASTER_HOTSPOTS.forEach((spot) => {
    const pulsingIcon = L.divIcon({
      className: "leaflet-pulsing-icon",
      html: `<div class="pulsing-hotspot-pin ${spot.caution ? 'caution' : ''}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const marker = L.marker(spot.coords, { icon: pulsingIcon });
    const popupContent = `
      <div class="map-popup-card">
        <span class="badge ${spot.caution ? 'badge-warning' : 'badge-green'}" style="margin-bottom: 6px; padding: 2px 8px; font-size: 0.68rem;">
          ${spot.risk}
        </span>
        <h4>${spot.name}</h4>
        <p>${spot.desc}</p>
        <div class="map-popup-meta">
          <span>COORD: ${spot.coords[0]}°N, ${spot.coords[1]}°E</span>
          <span>SAT: Sentinel-1</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { className: "custom-leaflet-popup" });
    hotspotLayersGroup.addLayer(marker);
  });
  hotspotLayersGroup.addTo(leafletMap);

  // Layer Checkboxes
  const checkHotspots = document.getElementById("checkHotspotsLayer");
  const checkRivers = document.getElementById("checkRiversLayer");

  if (checkHotspots) {
    checkHotspots.addEventListener("change", (e) => {
      if (e.target.checked) {
        leafletMap.addLayer(hotspotLayersGroup);
      } else {
        leafletMap.removeLayer(hotspotLayersGroup);
      }
    });
  }

  if (checkRivers) {
    checkRivers.addEventListener("change", (e) => {
      if (e.target.checked) {
        leafletMap.addLayer(riverLayersGroup);
      } else {
        leafletMap.removeLayer(riverLayersGroup);
      }
    });
  }

  // Live Telemetry HUD Cursor Tracker
  const coordsHud = document.getElementById("mapCursorCoords");
  const zoomHud = document.getElementById("mapZoomLevel");

  leafletMap.on("mousemove", (e) => {
    if (coordsHud) {
      coordsHud.textContent = `Lat: ${e.latlng.lat.toFixed(4)}° N, Lng: ${e.latlng.lng.toFixed(4)}° E`;
    }
  });

  leafletMap.on("zoomend", () => {
    if (zoomHud) {
      zoomHud.textContent = `ZOOM: ${leafletMap.getZoom().toFixed(1)}x`;
    }
  });
}

function initFallbackVectorMap(mapContainer, updateInfoCard) {
  // Shaded relief vector fallback
  mapContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 0.9rem; text-align: center; padding: 20px;">
      <div>
        <p style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 8px;">🛰️ Topographic Shaded Relief GIS Map Active</p>
        <p>Real satellite layer loads automatically when online.</p>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. Section 5: Before / After Satellite Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById("comparisonSlider");
  const afterLayer = document.getElementById("sliderImageAfter");
  const handle = document.getElementById("sliderHandle");

  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let xPos = clientX - rect.left;
    let percent = (xPos / rect.width) * 100;

    // Constrain within 4% and 96%
    if (percent < 4) percent = 4;
    if (percent > 96) percent = 96;

    afterLayer.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  }

  // Mouse Events
  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Events for Mobile & Tablet
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });
}

/* ==========================================================================
   5. Section 6: AI Detection Pipeline Data & Interactions
   ========================================================================== */
const PIPELINE_DETAILS = [
  {
    stepNum: "Step 01",
    title: "Satellite Image Acquisition",
    summary: "Satellite imagery is collected for the area of interest.",
    details: "High-resolution satellite sensors (such as ESA Sentinel-1 Synthetic Aperture Radar or Sentinel-2 Multispectral sensors) capture wide-swath views over the target North-East Indian river basin. SAR is particularly useful because microwave radar passes through monsoon cloud cover that blinds regular cameras.",
    vivaTip: "EVS Viva Insight: Optical satellites (like Landsat/Sentinel-2) provide natural color images but cannot see through clouds. Radar satellites (Sentinel-1 SAR) operate day and night and penetrate monsoon cloud cover."
  },
  {
    stepNum: "Step 02",
    title: "Image Preprocessing",
    summary: "The image is prepared and processed so that it can be analyzed.",
    details: "Raw satellite digital numbers are calibrated into backscatter coefficients (sigma-naught). Radiometric calibration, speckle noise reduction filtering (Lee or Refined Frost filters), and terrain orthorectification (using DEM elevation models) are applied to normalize mountainous terrain distortion.",
    vivaTip: "EVS Viva Insight: North-East India is flanked by steep hills. Terrain correction ensures radar shadows from mountains are not falsely mistaken for dark water bodies."
  },
  {
    stepNum: "Step 03",
    title: "AI & Computer Vision Analysis",
    summary: "An AI/computer-vision model examines patterns and features in the image.",
    details: "A deep Convolutional Neural Network (such as a U-Net architecture) or water index thresholding (NDWI / MNDWI) inspects texture, spatial context, and surface reflectance. Smooth calm water reflects radar beams away (specular reflection), showing up as dark regions compared to rough vegetated land.",
    vivaTip: "EVS Viva Insight: Smooth open water reflects radar beams like a mirror away from the satellite, appearing very dark (low backscatter), allowing the AI to distinguish water from rough soil and trees."
  },
  {
    stepNum: "Step 04",
    title: "Flood Segmentation",
    summary: "The model can classify or segment areas that appear to be covered by floodwater.",
    details: "The deep learning model generates a pixel-level binary classification mask dividing the image into 'Permanent Water', 'Inundated / Flooded Land', and 'Non-Water Terrain'. Permanent river courses are subtracted from current high-water extents to isolate new flood inundation.",
    vivaTip: "EVS Viva Insight: A crucial step is subtracting the pre-flood normal river baseline, so we only flag newly submerged agricultural land, village roads, and forests."
  },
  {
    stepNum: "Step 05",
    title: "Flood-Affected Geo-Map",
    summary: "The detected regions can be visualized on a map to understand the possible extent of flooding.",
    details: "The segmented raster mask is vectorised and georeferenced onto GIS map layers. Authorities, disaster managers (like ASDMA), and environmental scientists can overlay flood boundaries onto road networks, agricultural boundaries, and wildlife reserve maps.",
    vivaTip: "EVS Viva Insight: The output helps calculate inundated area in square kilometres (km²), identify marooned villages, and direct emergency evacuation boats and food drops."
  }
];

function initPipeline() {
  const stepNodes = document.querySelectorAll(".pipeline-step-node");
  const progressBar = document.getElementById("connectorProgress");
  const stepNumEl = document.getElementById("pipelineDetailStep");
  const titleEl = document.getElementById("pipelineDetailTitle");
  const bodyEl = document.getElementById("pipelineDetailBody");
  const tipEl = document.getElementById("pipelineDetailTip");

  function selectPipelineStep(index) {
    stepNodes.forEach((node, i) => {
      node.classList.toggle("active", i === index);
    });

    if (progressBar) {
      progressBar.style.width = `${((index + 1) / stepNodes.length) * 100}%`;
    }

    const item = PIPELINE_DETAILS[index];
    if (item) {
      if (stepNumEl) stepNumEl.textContent = item.stepNum;
      if (titleEl) titleEl.textContent = item.title;
      if (bodyEl) bodyEl.innerHTML = `<strong>${item.summary}</strong><br><br>${item.details}`;
      if (tipEl) tipEl.textContent = item.vivaTip;
    }
  }

  stepNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.stepIndex, 10);
      selectPipelineStep(idx);
    });
  });

  // Default to step 0
  selectPipelineStep(0);
}

/* ==========================================================================
   6. Section 7: Advanced Demonstration AI Flood Detection Simulator & Lab
   ========================================================================== */
const DEMO_SECTORS = {
  majuli: {
    name: "Majuli River Island",
    district: "Upper Assam Division",
    baseArea: 24.6,
    conf: 94.2,
    iou: 88.4,
    coord: "26.95°N, 94.21°E",
    river: "Brahmaputra Main Stem",
    crops: "18,400 Ha",
    displaced: "~18,400 residents",
    ecoThreat: "Severe riverbank slicing threatening fragile river island sandbars and monsoon Sali paddy crops.",
    riverPath: "M0,130 C120,110 210,190 310,140 T400,160",
    floodPath: "M110,120 Q190,70 280,135 T370,245 Q210,270 110,225 Z",
    floodSec: "M20,60 Q70,40 100,75 T60,110 Z",
    floodDepth: {
      shallow: "M95,105 Q190,55 300,120 T390,260 Q190,285 95,210 Z",
      moderate: "M105,115 Q190,65 290,130 T380,250 Q200,275 105,220 Z"
    }
  },
  kaziranga: {
    name: "Kaziranga National Park Corridor",
    district: "Golaghat & Nagaon Districts",
    baseArea: 42.8,
    conf: 96.5,
    iou: 91.2,
    coord: "26.58°N, 93.17°E",
    river: "Brahmaputra / Diphlu River",
    crops: "12,100 Ha",
    displaced: "~8,200 villagers & wildlife emergency",
    ecoThreat: "Extensive grassland inundation forcing endangered One-Horned Rhinos and elephants across NH-715 toward Karbi Anglong highlands.",
    riverPath: "M0,90 C130,120 220,70 340,110 T400,95",
    floodPath: "M60,80 Q160,50 260,100 T380,180 Q250,230 80,190 Z",
    floodSec: "M240,180 Q310,170 360,220 T280,260 Z",
    floodDepth: {
      shallow: "M50,70 Q160,40 270,90 T390,170 Q260,240 70,180 Z",
      moderate: "M55,75 Q160,45 265,95 T385,175 Q255,235 75,185 Z"
    }
  },
  morigaon: {
    name: "Morigaon Floodplains",
    district: "Central Assam Division",
    baseArea: 19.3,
    conf: 91.8,
    iou: 85.6,
    coord: "26.25°N, 92.34°E",
    river: "Brahmaputra / Kopili River",
    crops: "24,800 Ha",
    displaced: "~34,100 residents",
    ecoThreat: "Heavy sand-casting deposit across monsoon paddy farms, destroying soil fertility for multiple seasons.",
    riverPath: "M0,160 C100,140 200,200 300,150 T400,180",
    floodPath: "M80,130 Q180,90 290,140 T360,230 Q200,260 90,210 Z",
    floodSec: "M20,80 Q80,60 120,95 T70,140 Z",
    floodDepth: {
      shallow: "M70,120 Q180,80 300,130 T370,220 Q210,270 80,200 Z",
      moderate: "M75,125 Q180,85 295,135 T365,225 Q205,265 85,205 Z"
    }
  },
  silchar: {
    name: "Silchar (Barak River Basin)",
    district: "Cachar District, Southern Assam",
    baseArea: 15.7,
    conf: 92.4,
    iou: 86.8,
    coord: "24.83°N, 92.79°E",
    river: "Barak River / Madhura",
    crops: "9,600 Ha",
    displaced: "~52,000 residents",
    ecoThreat: "Embankment breach causing acute urban waterlogging, sewage mixing, and drinking water source contamination.",
    riverPath: "M0,110 C90,160 210,100 310,170 T400,130",
    floodPath: "M100,100 Q200,80 300,140 T370,220 Q220,250 110,190 Z",
    floodSec: "M30,120 Q80,110 110,150 T50,180 Z",
    floodDepth: {
      shallow: "M90,90 Q200,70 310,130 T380,210 Q230,260 100,180 Z",
      moderate: "M95,95 Q200,75 305,135 T375,215 Q225,255 105,185 Z"
    }
  }
};

const DEMO_MODELS = {
  unet: { name: "U-Net (ResNet-34)", confMult: 1.0, iouMult: 1.0, latency: "1.42 sec" },
  deeplab: { name: "DeepLabV3+ (ASPP)", confMult: 1.025, iouMult: 1.035, latency: "1.85 sec" },
  otsu: { name: "Otsu Threshold (Baseline)", confMult: 0.86, iouMult: 0.81, latency: "0.45 sec" }
};

let currentSectorKey = "majuli";
let currentModelKey = "unet";
let currentThreshold = 85;
let isDepthHeatmap = false;
let isSwipeMode = false;

function initAiDetectionDemo() {
  const runBtn = document.getElementById("runDemoBtn");
  const resetBtn = document.getElementById("resetDemoBtn");
  const radarScanLine = document.getElementById("radarScanLine");
  const floodMask = document.getElementById("demoFloodMask");
  const statusIndicator = document.getElementById("demoStatusIndicator");
  const statusText = document.getElementById("demoStatusText");
  const areaValue = document.getElementById("demoAreaValue");
  const confValue = document.getElementById("demoConfValue");
  const iouValue = document.getElementById("demoIouValue");
  const timeValue = document.getElementById("demoTimeValue");
  const statusVal = document.getElementById("demoStatusVal");

  // Threshold elements
  const thresholdSlider = document.getElementById("thresholdRange");
  const thresholdValDisplay = document.getElementById("thresholdValDisplay");
  const sensitivityLabel = document.getElementById("sensitivityLabel");

  // Terminal elements
  const terminalLogBody = document.getElementById("terminalLogBody");
  const terminalStatusBadge = document.getElementById("terminalStatusBadge");

  // Sector buttons
  const sectorTabs = document.querySelectorAll(".demo-sector-tab");
  const bandBtns = document.querySelectorAll(".band-btn");
  const modelBtns = document.querySelectorAll(".demo-advanced-toolbar button[data-model]");

  // Layout View Mode Buttons
  const btnDualView = document.getElementById("btnDualView");
  const btnSwipeView = document.getElementById("btnSwipeView");
  const dualContainer = document.getElementById("demoDualContainer");
  const swipeContainer = document.getElementById("demoSwipeContainer");

  // Severity Mode Buttons
  const btnBinaryMask = document.getElementById("btnBinaryMask");
  const btnDepthHeatmap = document.getElementById("btnDepthHeatmap");
  const svgDepthLayers = document.getElementById("svgDepthLayers");

  // Audio Toggle Button
  const btnAudioToggle = document.getElementById("btnAudioToggle");
  const audioIcon = document.getElementById("audioToggleIcon");

  // SVG elements
  const svgInputRiver = document.getElementById("svgInputRiver");
  const svgInputFlood = document.getElementById("svgInputFlood");
  const svgInputCoord = document.getElementById("svgInputCoord");
  const svgInputInfo = document.getElementById("svgInputInfo");
  const svgOutputRiver = document.getElementById("svgOutputRiver");
  const svgRiverLabel = document.getElementById("svgRiverLabel");
  const svgMaskMain = document.getElementById("svgMaskMain");
  const svgMaskSec = document.getElementById("svgMaskSec");
  const svgBBoxText = document.getElementById("svgBBoxText");
  const svgOutputHud = document.getElementById("svgOutputHud");
  const demoRightModelBadge = document.getElementById("demoRightModelBadge");

  function getScaledArea(base, threshold) {
    const factor = 1 + (85 - threshold) * 0.012;
    return (base * factor).toFixed(1);
  }

  function addTerminalLine(msg, type = "info") {
    if (!terminalLogBody) return;
    const div = document.createElement("div");
    div.className = `terminal-line ${type}`;
    div.textContent = msg;
    terminalLogBody.appendChild(div);
    terminalLogBody.scrollTop = terminalLogBody.scrollHeight;
  }

  function updateSector(sectorKey) {
    currentSectorKey = sectorKey;
    const data = DEMO_SECTORS[sectorKey];
    const model = DEMO_MODELS[currentModelKey];
    if (!data || !model) return;

    sectorTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.sector === sectorKey);
    });

    if (svgInputCoord) svgInputCoord.textContent = `SAR BACKSCATTER (VV/VH) | ${data.name.toUpperCase()}`;
    if (svgInputInfo) svgInputInfo.textContent = `RES: 10m/px | COORD: ${data.coord}`;
    if (svgInputRiver && data.riverPath) svgInputRiver.setAttribute("d", data.riverPath);
    if (svgInputFlood && data.floodPath) svgInputFlood.setAttribute("d", data.floodPath);

    if (svgOutputRiver && data.riverPath) svgOutputRiver.setAttribute("d", data.riverPath);
    if (svgRiverLabel) svgRiverLabel.textContent = data.river;
    if (svgMaskMain && data.floodPath) svgMaskMain.setAttribute("d", data.floodPath);
    if (svgMaskSec && data.floodSec) svgMaskSec.setAttribute("d", data.floodSec);

    // Update Depth paths if present
    const maskShallow = document.getElementById("svgMaskShallow");
    const maskModerate = document.getElementById("svgMaskModerate");
    if (maskShallow && data.floodDepth) maskShallow.setAttribute("d", data.floodDepth.shallow);
    if (maskModerate && data.floodDepth) maskModerate.setAttribute("d", data.floodDepth.moderate);

    const calculatedArea = getScaledArea(data.baseArea, currentThreshold);
    const computedConf = Math.min(99.5, (data.conf * model.confMult)).toFixed(1);
    const computedIou = Math.min(96.0, (data.iou * model.iouMult)).toFixed(1);

    if (svgBBoxText) svgBBoxText.textContent = `INUNDATION ZONE: ${calculatedArea} km²`;
    if (areaValue) areaValue.textContent = `${calculatedArea} km²`;
    if (confValue) confValue.textContent = `${computedConf}%`;
    if (iouValue) iouValue.textContent = `${computedIou}%`;
    if (timeValue) timeValue.textContent = model.latency;
    if (svgOutputHud) svgOutputHud.textContent = `AI CONFIDENCE: ${computedConf}% | IoU: ${computedIou}%`;

    playTechChime(520, 0.06);
    addTerminalLine(`[LOAD] Sector switched to: ${data.name} (${data.district}). Ready.`);
  }

  sectorTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      updateSector(tab.dataset.sector);
    });
  });

  // Model Architecture Selector
  modelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modelBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentModelKey = btn.dataset.model;
      const model = DEMO_MODELS[currentModelKey];
      if (demoRightModelBadge) demoRightModelBadge.textContent = model.name;

      playTechChime(680, 0.08);
      updateSector(currentSectorKey);
      addTerminalLine(`[ARCH] Architecture switched to: ${model.name}. Weights re-initialized.`);
    });
  });

  // View Layout Switcher (Side-by-Side vs Swipe Curtain)
  if (btnDualView && btnSwipeView && dualContainer && swipeContainer) {
    btnDualView.addEventListener("click", () => {
      btnDualView.classList.add("active");
      btnSwipeView.classList.remove("active");
      dualContainer.style.display = "grid";
      swipeContainer.style.display = "none";
      isSwipeMode = false;
      playTechChime(620, 0.06);
    });

    btnSwipeView.addEventListener("click", () => {
      btnSwipeView.classList.add("active");
      btnDualView.classList.remove("active");
      dualContainer.style.display = "none";
      swipeContainer.style.display = "block";
      isSwipeMode = true;
      playTechChime(620, 0.06);
    });
  }

  // Interactive Swipe Curtain Dragging
  initSwipeCurtainDrag();

  // Hazard Severity Mode (Binary Mask vs Depth Heatmap)
  if (btnBinaryMask && btnDepthHeatmap && svgDepthLayers) {
    btnBinaryMask.addEventListener("click", () => {
      btnBinaryMask.classList.add("active");
      btnDepthHeatmap.classList.remove("active");
      svgDepthLayers.style.display = "none";
      isDepthHeatmap = false;
      playTechChime(580, 0.06);
    });

    btnDepthHeatmap.addEventListener("click", () => {
      btnDepthHeatmap.classList.add("active");
      btnBinaryMask.classList.remove("active");
      svgDepthLayers.style.display = "inline";
      isDepthHeatmap = true;
      playTechChime(740, 0.08);
    });
  }

  // Audio Toggle Button
  if (btnAudioToggle && audioIcon) {
    btnAudioToggle.addEventListener("click", () => {
      isAudioMuted = !isAudioMuted;
      btnAudioToggle.classList.toggle("muted", isAudioMuted);
      audioIcon.textContent = isAudioMuted ? "🔇" : "🔊";
      btnAudioToggle.innerHTML = `<span id="audioToggleIcon">${audioIcon.textContent}</span> Audio: ${isAudioMuted ? 'OFF' : 'ON'}`;
      if (!isAudioMuted) playTechChime(700, 0.1);
    });
  }

  // Interactive Pixel Loupe Crosshair Inspector
  initPixelCrosshairs();

  // Multi-Band Spectral Modes
  bandBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      bandBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      const leftViewer = document.getElementById("demoLeftViewer");
      const leftTexture = document.getElementById("demoLeftTexture");
      const badge = document.getElementById("demoLeftPanelBadge");

      playTechChime(640, 0.07);

      if (leftViewer) {
        if (mode === "rgb") {
          leftViewer.style.filter = "none";
          if (leftTexture) leftTexture.style.filter = "saturate(1.8) contrast(1.1) brightness(0.95)";
          if (badge) badge.textContent = "Optical RGB Multispectral (Sentinel-2)";
        } else if (mode === "ndwi") {
          leftViewer.style.filter = "none";
          if (leftTexture) leftTexture.style.filter = "invert(0.85) hue-rotate(190deg) saturate(2.5)";
          if (badge) badge.textContent = "NDWI Water Index (Green - NIR)";
        } else if (mode === "mask") {
          leftViewer.style.filter = "contrast(1.4) brightness(1.1)";
          if (leftTexture) leftTexture.style.filter = "grayscale(1) contrast(1.8)";
          if (badge) badge.textContent = "Binary Water Classification Mask";
        } else {
          leftViewer.style.filter = "none";
          if (leftTexture) leftTexture.style.filter = "grayscale(1) contrast(1.3) brightness(0.7)";
          if (badge) badge.textContent = "Sentinel-1 SAR C-Band (Radar Backscatter)";
        }
      }
      addTerminalLine(`[DISPLAY] Spectral Band switched to: ${btn.textContent.trim()}`);
    });
  });

  // Dynamic Threshold Slider
  if (thresholdSlider) {
    thresholdSlider.addEventListener("input", (e) => {
      currentThreshold = parseInt(e.target.value, 10);
      if (thresholdValDisplay) thresholdValDisplay.textContent = `${currentThreshold}%`;

      if (sensitivityLabel) {
        if (currentThreshold < 65) {
          sensitivityLabel.textContent = "High Recall (May include damp topsoil)";
          sensitivityLabel.style.color = "#d97706";
        } else if (currentThreshold > 90) {
          sensitivityLabel.textContent = "High Precision (Deep open water only)";
          sensitivityLabel.style.color = "#0284c7";
        } else {
          sensitivityLabel.textContent = "Balanced (Recommended)";
          sensitivityLabel.style.color = "var(--env-green)";
        }
      }

      const data = DEMO_SECTORS[currentSectorKey];
      if (data) {
        const calculatedArea = getScaledArea(data.baseArea, currentThreshold);
        if (areaValue) areaValue.textContent = `${calculatedArea} km²`;
        if (svgBBoxText) svgBBoxText.textContent = `INUNDATION ZONE: ${calculatedArea} km²`;
        if (floodMask) {
          floodMask.style.opacity = (currentThreshold / 100).toString();
        }
      }
    });
  }

  // Run Demo Detection Click
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      runBtn.disabled = true;
      runBtn.textContent = "Analyzing Satellite Tile...";

      if (statusIndicator) statusIndicator.className = "status-indicator processing";
      if (statusText) statusText.textContent = "Scanning tile & running deep learning inference...";
      if (statusVal) statusVal.textContent = "Inference In Progress";
      if (terminalStatusBadge) {
        terminalStatusBadge.textContent = "RUNNING";
        terminalStatusBadge.style.color = "#f59e0b";
      }

      if (radarScanLine) radarScanLine.classList.add("scanning");
      if (floodMask) floodMask.classList.remove("active");

      if (areaValue) areaValue.textContent = "-- km²";
      if (confValue) confValue.textContent = "-- %";
      if (iouValue) iouValue.textContent = "-- %";
      if (timeValue) timeValue.textContent = "Processing...";

      playTechChime(440, 0.15, "sawtooth");

      addTerminalLine(`[0.1s] Ingesting Sentinel-1 GRD SAR tile for ${DEMO_SECTORS[currentSectorKey].name}...`);
      setTimeout(() => {
        addTerminalLine("[0.4s] Radiometric terrain correction & Lee speckle filter applied...");
        playTechChime(550, 0.08);
      }, 350);

      setTimeout(() => {
        addTerminalLine("[0.8s] Normalizing microwave backscatter (threshold: σ₀ < -16.5 dB)...");
        playTechChime(660, 0.08);
      }, 750);

      setTimeout(() => {
        addTerminalLine(`[1.2s] ${DEMO_MODELS[currentModelKey].name} Convolutional Inference over 512x512 patches...`);
        playTechChime(770, 0.08);
      }, 1150);

      // Inference completion
      setTimeout(() => {
        if (radarScanLine) radarScanLine.classList.remove("scanning");
        if (floodMask) floodMask.classList.add("active");

        if (statusIndicator) statusIndicator.className = "status-indicator completed";
        if (statusText) statusText.textContent = "Demo Analysis Complete (Segmentation Mask Ready)";
        if (statusVal) statusVal.textContent = "Demo Analysis Complete";
        if (terminalStatusBadge) {
          terminalStatusBadge.textContent = "COMPLETED";
          terminalStatusBadge.style.color = "#34d399";
        }

        const data = DEMO_SECTORS[currentSectorKey];
        const model = DEMO_MODELS[currentModelKey];
        const calculatedArea = getScaledArea(data.baseArea, currentThreshold);
        const computedConf = Math.min(99.5, (data.conf * model.confMult)).toFixed(1);
        const computedIou = Math.min(96.0, (data.iou * model.iouMult)).toFixed(1);

        if (areaValue) areaValue.textContent = `${calculatedArea} km²`;
        if (confValue) confValue.textContent = `${computedConf}%`;
        if (iouValue) iouValue.textContent = `${computedIou}%`;
        if (timeValue) timeValue.textContent = model.latency;
        if (svgBBoxText) svgBBoxText.textContent = `INUNDATION ZONE: ${calculatedArea} km²`;

        playTechChime(880, 0.2, "triangle");
        addTerminalLine(`[1.5s] Subtracted dry-season baseline river channel. Inundation mask finalized.`);
        addTerminalLine(`[1.6s] Success: ${calculatedArea} km² segmented with ${computedConf}% confidence (IoU: ${computedIou}%).`, "success");

        runBtn.disabled = false;
        runBtn.textContent = "Re-Run Detection";
      }, 1600);
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (radarScanLine) radarScanLine.classList.remove("scanning");
      if (floodMask) floodMask.classList.remove("active");
      if (statusIndicator) statusIndicator.className = "status-indicator ready";
      if (statusText) statusText.textContent = "Ready to analyze satellite scene";
      if (statusVal) statusVal.textContent = "Demo Ready";
      if (terminalStatusBadge) {
        terminalStatusBadge.textContent = "IDLE / READY";
        terminalStatusBadge.style.color = "var(--accent-cyan)";
      }
      if (areaValue) areaValue.textContent = "0.0 km²";
      if (confValue) confValue.textContent = "0.0%";
      if (iouValue) iouValue.textContent = "0.0%";
      if (timeValue) timeValue.textContent = "0.0 sec";
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.textContent = "Run Demo Detection";
      }
      playTechChime(420, 0.08);
      addTerminalLine("[RESET] Scanner reset to initial state. Ready.");
    });
  }

  // Simulated GeoJSON Export
  const downloadGeoJsonBtn = document.getElementById("downloadGeoJsonBtn");
  if (downloadGeoJsonBtn) {
    downloadGeoJsonBtn.addEventListener("click", () => {
      const data = DEMO_SECTORS[currentSectorKey];
      const geojsonObj = {
        type: "FeatureCollection",
        metadata: {
          project: "AI Flood Detection in North-East India (EVS)",
          sector: data.name,
          district: data.district,
          timestamp: new Date().toISOString(),
          estimatedAreaKm2: parseFloat(areaValue ? areaValue.textContent : "24.6"),
          confidence: confValue ? confValue.textContent : "94%",
          sensor: "Copernicus Sentinel-1 SAR C-Band"
        },
        features: [
          {
            type: "Feature",
            properties: { hazardClass: "Severe Flood Inundation", depthCategory: "Critical (>1.5m)" },
            geometry: {
              type: "Polygon",
              coordinates: [[[94.18, 26.92], [94.24, 26.96], [94.28, 26.94], [94.22, 26.90], [94.18, 26.92]]]
            }
          }
        ]
      };

      const blob = new Blob([JSON.stringify(geojsonObj, null, 2)], { type: "application/geo+json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentSectorKey}_flood_inundation_layer.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playTechChime(750, 0.12);
      addTerminalLine(`[EXPORT] GeoJSON Vector Layer downloaded: ${currentSectorKey}_flood_inundation_layer.geojson`);
    });
  }

  // Assessment Summary Report Modal
  initAssessmentModal();
}

/* --------------------------------------------------------------------------
   Swipe Curtain Dragging Logic
   -------------------------------------------------------------------------- */
function initSwipeCurtainDrag() {
  const viewport = document.getElementById("swipeCurtainViewport");
  const fgLayer = document.getElementById("swipeFgLayer");
  const handle = document.getElementById("swipeHandleBar");
  if (!viewport || !fgLayer || !handle) return;

  let isDragging = false;

  function setSwipePosition(clientX) {
    const rect = viewport.getBoundingClientRect();
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 5) percent = 5;
    if (percent > 95) percent = 95;

    fgLayer.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  }

  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setSwipePosition(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch Support
  handle.addEventListener("touchstart", (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches[0]) return;
    setSwipePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });
}

/* --------------------------------------------------------------------------
   Pixel Loupe Crosshairs & Telemetry HUD
   -------------------------------------------------------------------------- */
function initPixelCrosshairs() {
  const leftViewer = document.getElementById("demoLeftViewer");
  const rightViewer = document.getElementById("demoOutputViewer");
  const crosshairLeft = document.getElementById("crosshairLeft");
  const crosshairRight = document.getElementById("crosshairRight");

  const hudBackscatter = document.getElementById("hudBackscatter");
  const hudNdwi = document.getElementById("hudNdwi");
  const hudProb = document.getElementById("hudProb");
  const hudDepth = document.getElementById("hudDepth");
  const hudCover = document.getElementById("hudCover");

  function handleTileMove(e, container) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (crosshairLeft) {
      crosshairLeft.style.left = `${x}px`;
      crosshairLeft.style.top = `${y}px`;
    }
    if (crosshairRight) {
      crosshairRight.style.left = `${x}px`;
      crosshairRight.style.top = `${y}px`;
    }

    // Determine simulated land classification based on position
    const relX = x / rect.width;
    const relY = y / rect.height;

    const isRiver = (relY > 0.35 && relY < 0.65 && relX > 0.2 && relX < 0.85);
    const isFlood = (relY > 0.25 && relY < 0.80 && relX > 0.25 && relX < 0.90);

    if (isRiver) {
      if (hudBackscatter) hudBackscatter.textContent = "-24.2 dB (Deep Water)";
      if (hudNdwi) hudNdwi.textContent = "+0.91 (Permanent River)";
      if (hudProb) { hudProb.textContent = "99.8%"; hudProb.style.color = "var(--tech-blue)"; }
      if (hudDepth) { hudDepth.textContent = "4.20m (Main Channel)"; hudDepth.style.color = "var(--tech-blue)"; }
      if (hudCover) hudCover.textContent = "Brahmaputra Braided Channel";
    } else if (isFlood) {
      if (hudBackscatter) hudBackscatter.textContent = "-21.4 dB (Inundated)";
      if (hudNdwi) hudNdwi.textContent = "+0.76 (High Moisture)";
      if (hudProb) { hudProb.textContent = "98.4%"; hudProb.style.color = "var(--flood-alert)"; }
      if (hudDepth) { hudDepth.textContent = "1.65m (Critical)"; hudDepth.style.color = "var(--flood-alert)"; }
      if (hudCover) hudCover.textContent = "Submerged Char Paddy Farmland";
    } else {
      if (hudBackscatter) hudBackscatter.textContent = "-7.8 dB (Dry Canopy)";
      if (hudNdwi) hudNdwi.textContent = "-0.32 (Vegetation / Soil)";
      if (hudProb) { hudProb.textContent = "1.2%"; hudProb.style.color = "var(--env-green)"; }
      if (hudDepth) { hudDepth.textContent = "0.00m (Dry Safe)"; hudDepth.style.color = "var(--env-green)"; }
      if (hudCover) hudCover.textContent = "Alluvial Highland Soil Buffer";
    }
  }

  if (leftViewer) {
    leftViewer.addEventListener("mousemove", (e) => handleTileMove(e, leftViewer));
  }
  if (rightViewer) {
    rightViewer.addEventListener("mousemove", (e) => handleTileMove(e, rightViewer));
  }
}

function initAssessmentModal() {
  const modal = document.getElementById("assessmentModal");
  const openBtn = document.getElementById("openReportModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const dismissBtn = document.getElementById("dismissModalBtn");
  const printBtn = document.getElementById("printReportBtn");

  const sectorNameEl = document.getElementById("modalSectorName");
  const areaEl = document.getElementById("modalInundationArea");
  const confEl = document.getElementById("modalConfidence");
  const displacedEl = document.getElementById("modalDisplaced");
  const ecoThreatEl = document.getElementById("modalEcoThreat");

  function openModal() {
    if (!modal) return;
    const data = DEMO_SECTORS[currentSectorKey] || DEMO_SECTORS.majuli;
    const factor = 1 + (85 - currentThreshold) * 0.012;
    const currentArea = (data.baseArea * factor).toFixed(1);

    if (sectorNameEl) sectorNameEl.textContent = `${data.name} (${data.district})`;
    if (areaEl) areaEl.textContent = `${currentArea} km²`;
    if (confEl) confEl.textContent = `${data.conf}%`;
    if (displacedEl) displacedEl.textContent = data.displaced;
    if (ecoThreatEl) ecoThreatEl.textContent = data.ecoThreat;

    modal.classList.add("active");
    playTechChime(700, 0.1);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dismissBtn) dismissBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

/* ==========================================================================
   7. Section 8: Flood Mapping Dashboard (Real Leaflet WebGIS Portal)
   ========================================================================== */
const DASHBOARD_SECTOR_GEODATA = {
  majuli: {
    name: "Majuli River Island District",
    center: [26.96, 94.22],
    zoom: 11.2,
    baseArea: 24.6,
    crops: "18,400 Ha",
    pop: "~18,400 Residents",
    conf: "94.2%",
    floodCoords: [
      [27.02, 94.14], [27.04, 94.24], [26.98, 94.32],
      [26.92, 94.26], [26.91, 94.16], [26.97, 94.12]
    ],
    riverCoords: [
      [27.10, 94.05], [27.03, 94.18], [26.95, 94.30], [26.88, 94.45]
    ],
    submergedRoads: [
      [[26.98, 94.15], [26.96, 94.22], [26.94, 94.28]]
    ],
    highlands: [
      [27.06, 94.18], [27.08, 94.24], [27.05, 94.26]
    ],
    shelters: [
      { coords: [26.975, 94.215], name: "Kamalabari ASDMA Relief Camp", cap: "2,400 Sheltered • 8 Boats" },
      { coords: [27.012, 94.165], name: "Jengraimukh Safe Station", cap: "1,850 Sheltered • Medical Hub" }
    ]
  },
  kaziranga: {
    name: "Kaziranga National Park Corridor",
    center: [26.58, 93.18],
    zoom: 11.0,
    baseArea: 42.8,
    crops: "12,100 Ha",
    pop: "~8,200 Villagers & Wildlife",
    conf: "96.5%",
    floodCoords: [
      [26.65, 93.10], [26.68, 93.28], [26.62, 93.38],
      [26.54, 93.32], [26.52, 93.15], [26.57, 93.08]
    ],
    riverCoords: [
      [26.70, 93.05], [26.66, 93.20], [26.63, 93.35], [26.58, 93.50]
    ],
    submergedRoads: [
      [[26.57, 93.12], [26.56, 93.22], [26.55, 93.32]] // NH-715 submerged corridor
    ],
    highlands: [
      [26.50, 93.15], [26.48, 93.25], [26.49, 93.35] // Karbi Anglong highlands
    ],
    shelters: [
      { coords: [26.59, 93.17], name: "Kohora Wildlife Emergency Camp", cap: "Veterinary Rescue Active" },
      { coords: [26.55, 93.25], name: "Bagori Highland Animal Refuge", cap: "Rhino & Elephant Corridor" }
    ]
  },
  morigaon: {
    name: "Morigaon Floodplains",
    center: [26.25, 92.34],
    zoom: 11.0,
    baseArea: 19.3,
    crops: "24,800 Ha",
    pop: "~34,100 Residents",
    conf: "91.8%",
    floodCoords: [
      [26.31, 92.26], [26.33, 92.40], [26.28, 92.46],
      [26.20, 92.41], [26.19, 92.29], [26.24, 92.23]
    ],
    riverCoords: [
      [26.35, 92.20], [26.32, 92.35], [26.26, 92.48]
    ],
    submergedRoads: [
      [[26.26, 92.28], [26.24, 92.36]]
    ],
    highlands: [
      [26.18, 92.32], [26.16, 92.40], [26.17, 92.45]
    ],
    shelters: [
      { coords: [26.27, 92.35], name: "Morigaon District Relief Hub", cap: "4,200 Sheltered • Food Drops" }
    ]
  },
  silchar: {
    name: "Silchar (Barak River Valley)",
    center: [24.83, 92.79],
    zoom: 11.6,
    baseArea: 15.7,
    crops: "9,600 Ha",
    pop: "~52,000 Residents",
    conf: "92.4%",
    floodCoords: [
      [24.87, 92.74], [24.89, 92.83], [24.85, 92.88],
      [24.78, 92.84], [24.77, 92.76], [24.81, 92.72]
    ],
    riverCoords: [
      [24.91, 92.71], [24.86, 92.78], [24.82, 92.84], [24.76, 92.90]
    ],
    submergedRoads: [
      [[24.84, 92.77], [24.82, 92.81]]
    ],
    highlands: [
      [24.76, 92.77], [24.74, 92.82], [24.75, 92.86]
    ],
    shelters: [
      { coords: [24.835, 92.785], name: "Rangirkhari Municipal Camp", cap: "Drinking Water Tanker Hub" }
    ]
  }
};

let dashboardMap = null;
let currentDashSector = "majuli";
let currentDashStep = 3; // August Peak default

let dashFloodPolygon = null;
let dashRiverPolyline = null;
let dashRoadsGroup = null;
let dashHighlandsPolygon = null;
let dashSheltersGroup = null;
let dashCurrentBaseLayer = null;

function initDashboardControls() {
  const mapContainer = document.getElementById("dashboardLeafletMap");
  if (!mapContainer || typeof L === "undefined") return;

  // Initialize Leaflet GIS Map for Dashboard
  const initialData = DASHBOARD_SECTOR_GEODATA.majuli;
  dashboardMap = L.map("dashboardLeafletMap", {
    center: initialData.center,
    zoom: initialData.zoom,
    minZoom: 9,
    maxZoom: 16,
    zoomControl: true,
    attributionControl: false
  });

  // Base Tile Layers
  const tileSat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Esri World Imagery"
  });

  const tileTopo = L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Voyager"
  });

  const tileRadar = L.tileLayer("https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: "CartoDB Dark"
  });

  dashCurrentBaseLayer = tileSat;
  tileSat.addTo(dashboardMap);

  // Basemap Switcher Buttons
  const btnSat = document.getElementById("btnDashSatellite");
  const btnTopo = document.getElementById("btnDashTopo");
  const btnRadar = document.getElementById("btnDashRadar");
  const btnReset = document.getElementById("btnDashResetView");

  function switchDashBasemap(layer, activeBtn) {
    if (dashCurrentBaseLayer) dashboardMap.removeLayer(dashCurrentBaseLayer);
    dashCurrentBaseLayer = layer;
    layer.addTo(dashboardMap);

    [btnSat, btnTopo, btnRadar].forEach((b) => {
      if (b) b.classList.remove("active");
    });
    if (activeBtn) activeBtn.classList.add("active");
    playTechChime(600, 0.06);
  }

  if (btnSat) btnSat.addEventListener("click", () => switchDashBasemap(tileSat, btnSat));
  if (btnTopo) btnTopo.addEventListener("click", () => switchDashBasemap(tileTopo, btnTopo));
  if (btnRadar) btnRadar.addEventListener("click", () => switchDashBasemap(tileRadar, btnRadar));

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      const curData = DASHBOARD_SECTOR_GEODATA[currentDashSector];
      dashboardMap.setView(curData.center, curData.zoom, { animate: true });
      playTechChime(500, 0.08);
    });
  }

  // Draw Initial Sector GIS Layers
  renderDashboardLayers(currentDashSector, currentDashStep);

  // Sector Quick-Jump Buttons
  const sectorPills = document.querySelectorAll(".dash-pill-btn");
  const regionSelect = document.getElementById("dashboardRegionSelect");

  function changeDashSector(sectorKey) {
    currentDashSector = sectorKey;
    const data = DASHBOARD_SECTOR_GEODATA[sectorKey];
    if (!data) return;

    sectorPills.forEach((p) => p.classList.toggle("active", p.dataset.dashSector === sectorKey));
    if (regionSelect) regionSelect.value = sectorKey;

    const titleEl = document.getElementById("dashMapTitleDisplay");
    if (titleEl) titleEl.textContent = `🗺️ ${data.name}`;

    dashboardMap.flyTo(data.center, data.zoom, { duration: 1.2 });
    renderDashboardLayers(sectorKey, currentDashStep);
    updateDashboardMetrics(sectorKey, currentDashStep);
    playTechChime(640, 0.08);
  }

  sectorPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      changeDashSector(pill.dataset.dashSector);
    });
  });

  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      changeDashSector(e.target.value);
    });
  }

  // Monsoon Temporal Evolution Stepper
  const temporalSlider = document.getElementById("temporalSlider");
  const stepButtons = document.querySelectorAll(".temporal-step-btn");
  const stageBadge = document.getElementById("temporalStageBadge");

  const STAGE_LABELS = {
    1: { name: "Stage 1: Pre-Monsoon Dry Baseline (May)", color: "var(--env-green)" },
    2: { name: "Stage 2: Early Monsoon Surge (July)", color: "var(--warning-amber)" },
    3: { name: "Stage 3: Peak Inundation (August)", color: "var(--flood-alert)" },
    4: { name: "Stage 4: Post-Flood Recession (October)", color: "#0284c7" }
  };

  function setTemporalStep(step) {
    currentDashStep = parseInt(step, 10);
    if (temporalSlider) temporalSlider.value = currentDashStep;

    stepButtons.forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.dataset.step, 10) === currentDashStep);
    });

    if (stageBadge && STAGE_LABELS[currentDashStep]) {
      stageBadge.textContent = STAGE_LABELS[currentDashStep].name;
      stageBadge.style.color = STAGE_LABELS[currentDashStep].color;
    }

    renderDashboardLayers(currentDashSector, currentDashStep);
    updateDashboardMetrics(currentDashSector, currentDashStep);
    playTechChime(560 + currentDashStep * 40, 0.08);
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTemporalStep(btn.dataset.step);
    });
  });

  if (temporalSlider) {
    temporalSlider.addEventListener("input", (e) => {
      setTemporalStep(e.target.value);
    });
  }

  // Layer Filter Checkboxes
  const toggleFlood = document.getElementById("toggleDashFlood");
  const toggleWater = document.getElementById("toggleDashWater");
  const toggleRoads = document.getElementById("toggleDashRoads");
  const toggleShelters = document.getElementById("toggleDashShelters");
  const toggleHighlands = document.getElementById("toggleDashHighlands");

  if (toggleFlood) toggleFlood.addEventListener("change", (e) => toggleLayerVisibility(dashFloodPolygon, e.target.checked));
  if (toggleWater) toggleWater.addEventListener("change", (e) => toggleLayerVisibility(dashRiverPolyline, e.target.checked));
  if (toggleRoads) toggleRoads.addEventListener("change", (e) => toggleLayerVisibility(dashRoadsGroup, e.target.checked));
  if (toggleShelters) toggleShelters.addEventListener("change", (e) => toggleLayerVisibility(dashSheltersGroup, e.target.checked));
  if (toggleHighlands) toggleHighlands.addEventListener("change", (e) => toggleLayerVisibility(dashHighlandsPolygon, e.target.checked));

  function toggleLayerVisibility(layer, isVisible) {
    if (!layer || !dashboardMap) return;
    if (isVisible) {
      if (!dashboardMap.hasLayer(layer)) dashboardMap.addLayer(layer);
    } else {
      if (dashboardMap.hasLayer(layer)) dashboardMap.removeLayer(layer);
    }
    playTechChime(500, 0.05);
  }

  // Telemetry Cursor Tracking
  const coordsHud = document.getElementById("dashMapCursorCoords");
  const zoomHud = document.getElementById("dashMapZoomLevel");

  dashboardMap.on("mousemove", (e) => {
    if (coordsHud) {
      coordsHud.textContent = `Lat: ${e.latlng.lat.toFixed(4)}° N, Lng: ${e.latlng.lng.toFixed(4)}° E`;
    }
  });

  dashboardMap.on("zoomend", () => {
    if (zoomHud) {
      zoomHud.textContent = `ZOOM: ${dashboardMap.getZoom().toFixed(1)}x`;
    }
  });

  // Action Buttons
  const btnExportPdf = document.getElementById("btnExportDashPdf");
  const btnExportGeoJson = document.getElementById("btnExportDashGeoJson");

  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", () => {
      const modal = document.getElementById("assessmentModal");
      if (modal) {
        const sectorNameEl = document.getElementById("modalSectorName");
        const data = DASHBOARD_SECTOR_GEODATA[currentDashSector];
        if (sectorNameEl) sectorNameEl.textContent = `${data.name} (DDMA Incident Brief)`;
        modal.classList.add("active");
        playTechChime(700, 0.1);
      }
    });
  }

  if (btnExportGeoJson) {
    btnExportGeoJson.addEventListener("click", () => {
      const data = DASHBOARD_SECTOR_GEODATA[currentDashSector];
      const geojsonObj = {
        type: "FeatureCollection",
        metadata: {
          agency: "Assam State Disaster Management Authority (ASDMA)",
          district: data.name,
          temporalStage: currentDashStep,
          generatedDate: new Date().toISOString()
        },
        features: [
          {
            type: "Feature",
            properties: { hazardLayer: "Inundation Perimeter", temporalPhase: currentDashStep },
            geometry: { type: "Polygon", coordinates: [data.floodCoords.map((c) => [c[1], c[0]])] }
          }
        ]
      };
      const blob = new Blob([JSON.stringify(geojsonObj, null, 2)], { type: "application/geo+json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentDashSector}_ddma_zoning_stage${currentDashStep}.geojson`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playTechChime(760, 0.12);
    });
  }
}

function renderDashboardLayers(sectorKey, stageStep) {
  if (!dashboardMap) return;
  const data = DASHBOARD_SECTOR_GEODATA[sectorKey];
  if (!data) return;

  // Clean old layers
  if (dashFloodPolygon) dashboardMap.removeLayer(dashFloodPolygon);
  if (dashRiverPolyline) dashboardMap.removeLayer(dashRiverPolyline);
  if (dashRoadsGroup) dashboardMap.removeLayer(dashRoadsGroup);
  if (dashHighlandsPolygon) dashboardMap.removeLayer(dashHighlandsPolygon);
  if (dashSheltersGroup) dashboardMap.removeLayer(dashSheltersGroup);

  // Stage Scaling Multiplier
  const stageScale = [0.2, 0.65, 1.0, 0.35][stageStep - 1] || 1.0;

  // 1. Permanent River Line
  dashRiverPolyline = L.polyline(data.riverCoords, {
    color: "#38bdf8",
    weight: 5,
    opacity: 0.95
  }).bindTooltip(`🌊 Permanent River Course`, { sticky: true }).addTo(dashboardMap);

  // 2. Active Flood Inundation Polygon
  // Morph coords slightly based on stage
  const scaledFloodCoords = data.floodCoords.map((pt) => {
    const lat = data.center[0] + (pt[0] - data.center[0]) * stageScale;
    const lng = data.center[1] + (pt[1] - data.center[1]) * stageScale;
    return [lat, lng];
  });

  dashFloodPolygon = L.polygon(scaledFloodCoords, {
    color: "#ef4444",
    weight: stageStep === 3 ? 3.5 : 2,
    fillColor: "#ef4444",
    fillOpacity: 0.35 * stageScale + 0.15,
    dashArray: stageStep === 3 ? "6, 4" : null
  }).bindTooltip(`⚠️ Detected Inundation Perimeter (Stage ${stageStep})`, { sticky: true }).addTo(dashboardMap);

  // 3. Submerged Roads
  dashRoadsGroup = L.layerGroup();
  data.submergedRoads.forEach((road) => {
    const polyline = L.polyline(road, {
      color: "#f59e0b",
      weight: 3.5,
      dashArray: "8, 6"
    }).bindTooltip("⚠️ Roadway Cut Off / Submerged Embankment", { sticky: true });
    dashRoadsGroup.addLayer(polyline);
  });
  dashRoadsGroup.addTo(dashboardMap);

  // 4. Highlands
  dashHighlandsPolygon = L.polygon(data.highlands, {
    color: "#10b981",
    weight: 2,
    fillColor: "#10b981",
    fillOpacity: 0.3
  }).bindTooltip("🟢 Highland Wildlife Refuge / Evacuation Mound", { sticky: true }).addTo(dashboardMap);

  // 5. Emergency Relief Shelters & Boat Launch Points
  dashSheltersGroup = L.layerGroup();
  data.shelters.forEach((shelter) => {
    const pin = L.divIcon({
      className: "leaflet-pulsing-icon",
      html: `<div class="pulsing-hotspot-pin" style="background: #3b82f6; box-shadow: 0 0 10px #3b82f6;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
    const marker = L.marker(shelter.coords, { icon: pin }).bindPopup(`
      <div class="map-popup-card">
        <span class="badge badge-cyan" style="font-size: 0.68rem;">ASDMA Evacuation Hub</span>
        <h4>${shelter.name}</h4>
        <p>${shelter.cap}</p>
      </div>
    `);
    dashSheltersGroup.addLayer(marker);
  });
  dashSheltersGroup.addTo(dashboardMap);
}

function updateDashboardMetrics(sectorKey, stageStep) {
  const data = DASHBOARD_SECTOR_GEODATA[sectorKey];
  if (!data) return;

  const multipliers = [0.22, 0.68, 1.0, 0.38];
  const mult = multipliers[stageStep - 1] || 1.0;

  const areaEl = document.getElementById("dashCardArea");
  const cropsEl = document.getElementById("dashCardCrops");
  const popEl = document.getElementById("dashCardPop");
  const confEl = document.getElementById("dashCardConfidence");

  const computedArea = (data.baseArea * mult).toFixed(1);
  const baseCrops = parseInt(data.crops.replace(/[^0-9]/g, ""), 10) || 18400;
  const computedCrops = Math.round(baseCrops * mult).toLocaleString();

  if (areaEl) areaEl.textContent = `${computedArea} km²`;
  if (cropsEl) cropsEl.textContent = `${computedCrops} Ha`;
  if (popEl) {
    if (stageStep === 1) popEl.textContent = "~800 Residents (Normal)";
    else if (stageStep === 2) popEl.textContent = "~11,200 Residents (Alert)";
    else if (stageStep === 3) popEl.textContent = data.pop;
    else popEl.textContent = "~4,100 Residents (Receding)";
  }
  if (confEl) confEl.textContent = data.conf;
}

/* ==========================================================================
   8. Scroll-Triggered Animations
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".fade-in-up");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scrolled-in");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  animatedElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   9. Statistics Counters Animation
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        let current = 0;
        const duration = 1500;
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toFixed(decimals) + suffix;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach((el) => counterObserver.observe(el));
}

/* ==========================================================================
   10. Back-To-Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
