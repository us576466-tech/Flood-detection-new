# AI-Based Detection of Flood-Affected Areas in North-East India Using Satellite Images
**An Environmental Studies (EVS) College Project Website**  
**Created By:** **Vivaan Saxena**, **Gagan Deep Kaur**, and **Abdul Muhmin**  
*1st Year B.Tech Computer Science & Engineering • Built with HTML5, CSS3, and Modern Vanilla JavaScript*

---

## 📌 Project Overview
This project presents an educational and scientific demonstration of how spaceborne remote sensing satellites and Artificial Intelligence (AI) can assist in detecting, assessing, and mitigating seasonal flood disasters across the eight states of North-East India (**Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim**).

### 🎯 Primary Project Focus: Environmental Studies (EVS)
While the website demonstrates computer vision and remote sensing workflows, the **central focus remains ecological and humanitarian conservation**:
- Protecting fragile riverine wetlands (*beels*) and biodiversity corridors (e.g., the One-Horned Rhinoceros migration from Kaziranga National Park to Karbi Anglong highlands).
- Mitigating severe topsoil erosion and agricultural sand-casting on monsoon paddy farmlands.
- Preventing potable water contamination and disease outbreaks in marooned riverine villages (*chars*).

---

## 📂 Project Structure

```
flood-detection-evs-project/
│
├── index.html          # Main semantic HTML5 document containing all 13 project sections
├── css/
│   └── style.css       # Complete modern styling (variables, glassmorphism, responsive grid, animations)
├── js/
│   └── main.js         # Modular Vanilla JavaScript (map interaction, slider, AI demo, layer toggles)
└── README.md           # Documentation, section guide, and viva preparation tips
```

---

## 🚀 How to Run the Website

### Option 1: Direct Browser Launch (Zero Setup Required)
Simply double-click the `index.html` file or drag and drop it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).

### Option 2: Local Web Server (Optional)
If using Python 3:
```powershell
# Open terminal inside the project directory
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 🧭 Page & Section Outline (13 Comprehensive Sections)

1. **Section 1: Hero / Home**
   - Full-screen aerial & satellite perspective with animated orbital telemetry.
   - Title, subtitle, environmental badge, quick stat counters, and primary action buttons.

2. **Section 2: Understanding the Problem (Introduction)**
   - Plain-language explanation of flood vulnerability in North-East India.
   - 3 Glassmorphism cards: *Natural Factors*, *Environmental Factors*, and *Human Impact*.

3. **Section 3: Why North-East India? (Realistic Geospatial Satellite Map)**
   - Powered by Leaflet.js with live ESRI World Satellite Imagery, CartoDB Topographic & SAR Radar basemap switchers.
   - Accurately mapped regional boundaries for all 8 North-East Indian states with Brahmaputra & Barak river polylines.
   - Pulsing radar disaster hotspot pins (Kaziranga Wildlife Corridor, Majuli Island, Morigaon, Silchar, Subansiri, Sikkim GLOF).
   - Live telemetry cursor tracking (Latitude, Longitude, and elevation) with dynamic state inspection panel.

4. **Section 4: Environmental Impact of Floods (Core EVS)**
   - 6 animated cards with detailed ecological context:
     1. 🌱 *Agriculture* (paddy submergence, sand-casting, food security)
     2. 🌳 *Forests* (riparian canopy loss, riverbank slicing)
     3. 🐘 *Wildlife* (Kaziranga wildlife migration corridors across NH-715)
     4. 💧 *Water Quality* (silt plumes, tube-well contamination, waterborne pathogens)
     5. 🏠 *Human Settlements* (char displacements, infrastructure severance)
     6. 🌍 *Ecosystems* (beels replenishment vs destructive silt deposition)

5. **Section 5: Seeing Floods From Space (Satellite Imagery)**
   - Explains optical vs. Synthetic Aperture Radar (SAR) remote sensing.
   - **Interactive Before/After Satellite Slider**: Drag to compare pre-flood river courses with peak flood inundation.

6. **Section 6: How Artificial Intelligence Detects Floods**
   - 5-step animated pipeline:
     `Satellite Ingestion → Image Preprocessing → AI Analysis → Flood Segmentation → Flood Map`
   - Detailed viva explanations for each stage.

7. **Section 7: AI Flood Detection — Advanced Demonstration Lab**
   - **Multi-Layout Inspection**: Toggle between *Side-by-Side Dual Tiles* and *Interactive Swipe Curtain Wipe*.
   - **AI Architecture Comparator**: Benchmark U-Net (ResNet-34) vs. DeepLabV3+ (ASPP) vs. Traditional Otsu Thresholding with live IoU and confidence metrics.
   - **Interactive Pixel Crosshair Telemetry HUD**: Hovering over tiles shows real-time radar backscatter (dB), NDWI water index, water probability, depth (m), and land cover classification.
   - **Hazard Severity Mode**: Switch between *Binary Flood Mask* and *3-Tier Depth Hazard Heatmap* (<0.5m, 0.5-1.5m, >1.5m).
   - **Audio Telemetry Feedback**: Zero-dependency Web Audio API sound synthesis with mute toggle.
   - **Simulated GeoJSON Export**: One-click download of the segmented flood vector boundary.
   - Clear academic disclaimer: *Demo values are simulated and do not represent live satellite measurements.*

8. **Section 8: Flood Mapping & Disaster Zoning (Interactive WebGIS Portal)**
   - **Dedicated Leaflet GIS Portal**: High-resolution ESRI World Satellite Imagery with CartoDB Topo and SAR Radar basemaps.
   - **Monsoon Temporal Evolution Stepper (Time-Series)**: 4-stage interactive slider (May Dry Bed → July Wave 1 → August Peak Inundation → October Recession) dynamically scaling flood boundaries and damage matrices live!
   - **Sector Quick-Jump Buttons**: Instant smooth fly-to navigation across *Majuli River Island*, *Kaziranga Wildlife Corridor*, *Morigaon Floodplains*, and *Silchar Barak Valley*.
   - **Interactive WebGIS Vector Layers**: Toggle active inundation masks, permanent river channels, severed roadways, highland wildlife refuges, and ASDMA relief camps with rich popups.
   - **Decision Support Tools**: Export DDMA situation briefs and download GeoJSON hazard zoning vector layers.

9. **Section 9: Why This Approach Matters (Benefits)**
   - 6 core benefits: Faster Assessment, Large-Area Monitoring, Visual Mapping, Environmental Monitoring, Disaster Management, and Data-Based Decisions.

10. **Section 10: Challenges & Limitations**
    - Academic transparency: Cloud cover limitations on optical sensors, SAR mountain shadow distortions, 10m-30m spatial resolution constraints, revisit latency, and the need for ground-truth validation.

11. **Section 11: Future Possibilities (Roadmap)**
    - 4-phase evolution: Prototype → Improved AI → Real-Time Sensor Ingestion → Smart Flood Portal.
    - IoT river gauge and Doppler radar integration highlights.

12. **Section 12: Technology for a Safer Environment (Conclusion & Viva Guide)**
    - Concluding thesis and final takeaway: *“AI + Satellite Imagery + Environmental Awareness”*.
    - **Quick Viva Cheat-Sheet**: 4 prepared high-scoring answers for evaluation interviews.

13. **Section 13: References & Academic Resources**
    - Citations across 5 categories: ISRO Bhuvan, NRSC, MoEFCC, ASDMA, NDMA, and Computer Vision literature.

---

## 🎓 Viva Presentation Tips for First-Year B.Tech CSE Students

When presenting this project to your college EVS professor:

1. **Lead with the Environmental Problem:**
   - Mention that North-East India receives over 2,500 mm of annual rainfall, and the Brahmaputra carries snowmelt plus monsoon discharge through a narrow valley, resulting in repeated annual devastation.
2. **Explain Why Radar (SAR) is Essential:**
   - Optical satellites (like standard cameras) cannot see through monsoon clouds. Synthetic Aperture Radar (SAR) penetrates rain and clouds 24/7.
3. **Clarify How AI Identifies Water:**
   - Smooth water acts like a mirror, bouncing radar energy away from the satellite (specular reflection), showing up dark. AI models segment these low-backscatter clusters and subtract baseline rivers to identify newly flooded land.
4. **Emphasize the Human & Ecological Impact:**
   - Focus on Kaziranga wildlife crossings and rural farm protection.
