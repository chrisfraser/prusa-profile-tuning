# Dialling in PrusaSlicer Profiles — MK3S · MK4 · Core One × PLA · PETG · TPU

Target: repeatable high quality at sane speed. Written for PrusaSlicer 2.9.x (2.9.6 is current stable), Expert mode.

---

## 0. Prerequisites (do these once per printer)

Skip these and every calibration below measures machine error instead of filament behaviour.

1. **Firmware current** on all three. MK3S = Marlin (Linear Advance, `M900 K`). MK4 and Core One = Buddy firmware (Pressure Advance, `M572 S`). The two families need *separate* filament profiles — the tuning G-code is not interchangeable.
2. **Configuration Wizard** → install the system profiles for MK3S, MK4/MK4S and Core One, with the nozzle diameters you actually own. Let PrusaSlicer pull profile updates.
3. **Expert mode** (top right). Half the settings below are hidden in Simple/Advanced.
4. **First layer / Z-offset calibrated** per printer per sheet, and **Input Shaper calibration** run on MK4 and Core One after any hardware change.
5. **PID / heater tuning** if the printer has ever been apart.
6. **Dry filament.** PETG and TPU are hygroscopic; TPU badly so. A wet spool invalidates temperature, flow and retraction results. 55 °C for 6–8 h (PLA), 65 °C for 8 h (PETG), 50–55 °C for 8–12 h (TPU).
7. **Nozzle known-good and known-size.** Worn or clone nozzles will not reproduce these numbers.

---

## 1. Profile structure and naming

PrusaSlicer filament profiles inherit from a system profile that is bound to a printer family, so plan for one filament profile per *printer family*, not per spool:

```
eSun PLA+ @MK3S 0.4
eSun PLA+ @MK4 0.4
eSun PLA+ @COREONE 0.4
```

Workflow, always:

1. Select the target printer + a **system** filament profile of the same material (e.g. `Prusament PETG`).
2. Change values.
3. **Save as** with the name above. Never overwrite a system profile — you lose the update path and the printer-specific conditional G-code.
4. Filament Settings → **Dependencies** → set *Compatible printers* so the profile only appears on the machine it was tuned for. This is what keeps a three-printer fleet from becoming a mess.
5. Back up with **File → Export → Export Config Bundle** after each tuning session.

Keep a note field honest: Filament Settings → Notes → record spool brand/colour, date, measured EM, PA/LA value, MVS. Colour matters — pigment changes flow behaviour within the same brand.

---

## 2. Calibration order

Order matters. Each step depends on the previous one being fixed.

> **Temperature → Flow (EM) → Pressure/Linear Advance → Retraction → Cooling → Max volumetric speed → Speeds/accels**

### 2.1 Temperature tower

**Test:** any smooth-walled tower with overhangs and a bridge; print one per material per brand.

**Method in PrusaSlicer:** Printer Settings → Custom G-code → **After layer change G-code**. With 0.2 mm layers, 50 layers = 10 mm bands:

```gcode
;AFTER_LAYER_CHANGE
;[layer_z]
{if layer_num == 50}M104 S235{endif}
{if layer_num == 100}M104 S230{endif}
{if layer_num == 150}M104 S225{endif}
{if layer_num == 200}M104 S220{endif}
{if layer_num == 250}M104 S215{endif}
```

Start the filament profile at the *highest* temperature in the sequence and step down. **Delete this block when done** — it lives in the printer profile and will silently corrupt later prints.

**Judge on, in priority order:** layer adhesion (snap the tower afterwards), bridge sag, overhang curl, stringing between towers, surface sheen. Pick the lowest temperature that still gives clean layer bonding, then add 5 °C back for the first layer.

### 2.2 Extrusion multiplier (flow)

Prusa's own procedure: print a single-perimeter object, measure the wall, correct the multiplier. <cite index="10-1">The Extrusion Multiplier lives in Filament Settings → Extrusion Multiplier, where 1 = 100 %, and useful values normally fall between 0.9 and 1.1.</cite>

**Setup:** 30 × 30 × 12 mm hollow box, **Perimeters = 1**, top layers = 0, bottom = 1, infill = 0, no ironing, spiral vase off.

**Measure:** digital calipers, three points per wall on four walls, ignore the seam. <cite index="16-1">Prusa recommends measuring in three spots and averaging out local variation.</cite>

```
new EM = current EM × (nominal wall width / measured wall width)
```

Nominal for a 0.4 nozzle at 0.2 layer is typically 0.45 mm — read the actual value from Print Settings → Advanced → Extrusion width → Perimeters. Aim within ±0.01 mm; re-run once.

Two traps:
- <cite index="10-1">Firmware flow (M221) and the slicer extrusion multiplier are two independent ways of scaling the same thing — total flow = M221 × EM — so changing one does not update the other.</cite> Set M221 back to 100 on the printer before measuring.
- The MK3S system printer profile emits an `M221 S{if layer_height<0.075}100{else}95{endif}` line in start G-code — a legacy correction. Leave it alone, just don't double-correct for it.

Alternative if you dislike calipers: a stepped flow-block test print (Printables has PrusaSlicer-specific ones with ±% blocks and a per-pass formula), which is faster but less precise.

### 2.3 Pressure / Linear Advance — the single biggest quality win

<cite index="20-1">Pressure Advance compensates for pressure changes in the nozzle during printing and replaces Linear Advance on the MK4-family, XL and MINI/+ from firmware 5.0.0.</cite> Under-tuned PA/LA is what gives you bulging corners, dark blobs at seams, and thin patches after every travel.

**Where it lives:** not a slider — it is in **Filament Settings → Custom G-code → Start G-code** as a conditional block. <cite index="18-1">PrusaSlicer is the only slicer with per-filament custom G-code, so the K value changes automatically per filament preset; in other slicers you'd hand-edit `M900 Kxx` in start G-code per material.</cite>

- **MK3S:** `M900 K<value>` (Linear Advance 1.5 scale — values are small, typically 0.02–0.08 for a 0.4 nozzle).
- **MK4 / Core One:** `M572 S<value>`. <cite index="20-1">The value is set by whichever command came last — M900 is converted 1:1 to a Pressure Advance value, and the default start G-code already contains an M572 whose S parameter varies by nozzle diameter.</cite> Reference points: MK3.5 profiles ship ~0.035 for a 0.4 nozzle; MK4S PLA ships ~0.036 for 0.4, and users on high-flow nozzles have landed nearer 0.05.

**Test:** print a tall single-wall or thin-wall object with sharp 90° corners, stepping the value per band via **After layer change G-code**:

```gcode
{if layer_num == 20}M572 S0.02{endif}
{if layer_num == 40}M572 S0.03{endif}
{if layer_num == 60}M572 S0.04{endif}
{if layer_num == 80}M572 S0.05{endif}
{if layer_num == 100}M572 S0.06{endif}
```

(MK3S: same structure with `M900 K0.02` … `M900 K0.08`.)

**Critical caveat:** tune at the accelerations and speeds you will actually print at. A value calibrated on a slow test print will over-compensate and starve your corners at production speed. Print the tower with your real quality profile loaded, not a slow one.

**Judge:** corners neither bulging (too low) nor pinched/gappy after the corner (too high); consistent extrusion width immediately after each travel.

Write the winner into the *filament* profile's start G-code, replacing the stock conditional — or wrap it so it stays nozzle-aware:

```gcode
M572 S{if nozzle_diameter[0]==0.4}0.045{elsif nozzle_diameter[0]==0.6}0.03{else}0.02{endif}
```

### 2.4 Retraction

Retraction is a *printer* setting, but the right value is material-dependent, so override it per filament: **Filament Settings → Filament Overrides** (tick the box next to each value you want to override).

Method: print 4–6 tall thin spikes spaced ~40 mm apart, adjust **Length** in 0.1 mm steps until strings disappear; only then touch speed. Too much retraction on a direct drive = grinding, heat creep, and gaps at travel re-start — go up slowly.

Reference behaviour: <cite index="19-1">MK4S profiles ship with Z-lift enabled (1.5 mm) and wipe-on-retract disabled.</cite> Keep Z-lift for PETG (blob avoidance); consider dropping it to 0.2–0.4 mm for PLA if you see travel-related surface scarring.

### 2.5 Cooling

Filament Settings → Cooling. Set **min/max fan speed**, **bridges fan speed**, **disable fan for first N layers**, **slow down if layer print time is below**, **min print speed**.

- PLA: as much fan as you can give it.
- PETG: too much fan = delamination and poor overhangs; too little = drooping and stringing. Middle range.
- TPU: moderate — it needs the layer to stay warm for bonding, but bridges want fan.
- **Core One is enclosed**: chamber heat soaks upward through the print. Expect to need *more* fan and lower chamber temp for PLA than on the open-frame machines, and *less* than open-frame for PETG.

### 2.6 Max volumetric speed (MVS) — this is your real speed limit

Filament Settings → Advanced → **Max volumetric speed** (mm³/s). Every speed you set elsewhere gets capped by this. Tuning speeds without setting MVS correctly is how you get under-extruded, matte, weak prints at high speed.

**Test:** print a spiral-vase cylinder, 0.2 mm layer, single wall, and ramp speed per band:

```gcode
{if layer_num == 30}M220 S150{endif}
{if layer_num == 60}M220 S200{endif}
{if layer_num == 90}M220 S250{endif}
{if layer_num == 120}M220 S300{endif}
```

Set MVS artificially high (e.g. 40) for the test, then find the band where the wall goes matte/thin/glassy — that is the hotend's limit. Set MVS to **~85 %** of that flow. Flow at any band = `layer height × extrusion width × speed`.

MK4 vs MK4S matters here: the MK4S hotend and high-flow nozzles move substantially more material than the original MK4 hardware. Core One uses the MK4S-class hotend.

### 2.7 Speeds and accelerations

Only now set speeds. Rules that survive contact with reality:

- **External perimeter speed** is the dominant surface-quality lever — keep it low even when everything else is fast.
- Keep **acceleration** for external perimeters well below infill accel. On MK4/Core One, Input Shaper lets you run high accel, but corners and seams still degrade first.
- Enable **dynamic overhang speed** (Print Settings → Speed) so overhang perimeters slow automatically rather than making you slow the whole print.
- Set **travel speed** high — it costs nothing in quality once retraction/PA are right.

---

## 3. Per-machine notes

| | MK3S | MK4 (/S) | Core One |
|---|---|---|---|
| Kinematics | Bedslinger, Marlin | Bedslinger, Buddy FW, Input Shaper | CoreXY, enclosed, Buddy FW, Input Shaper |
| Extruder | Bondtech direct drive | Nextruder | Nextruder |
| Advance G-code | `M900 K` (LA 1.5) | `M572 S` (PA) | `M572 S` (PA) |
| Practical flow ceiling, 0.4 | ~11–13 mm³/s | MK4 ~15–20; MK4S/HF ~22–28 | ~22–28 mm³/s |
| Main constraint | Y-axis mass — accel and external perimeter speed | Flow and part cooling | Chamber heat with PLA |
| Sensible layer heights | 0.15 / 0.20 | 0.15 / 0.20 / 0.25 | 0.15 / 0.20 / 0.25 |

**Core One specifics:** with PLA, run the chamber vent open (and/or door ajar) — chamber above ~35 °C softens PLA prints, causes heat creep in the extruder and rounds off fine detail. PETG and TPU benefit from the enclosure; run it closed. If you're on a Core One+ with active chamber control, target ~30 °C for PLA, 35–40 °C for PETG.

**MK3S specifics:** it is the slow machine of the three — accept ~45–60 mm/s perimeters and get quality from that, rather than pushing it to MK4 numbers and fighting ringing. Its LA values are on a completely different scale to the MK4's PA values; do not copy numbers across.

---

## 4. Starting values

Use these as the *entry point* to §2, not as final numbers. Note: stock MK4S/Core One PLA profiles run hotter (~230 °C) to support their high-flow ceilings; the tables below sit cooler because the target is quality at moderate speed — if you later push MVS above ~18 mm³/s, add 10 °C back. Always compare against the stock Prusa system profile for that printer before deviating — if a value below differs a lot from stock, trust stock and tune from there.

### PLA (0.4 nozzle, 0.2 mm layer)

| Setting | MK3S | MK4 | Core One |
|---|---|---|---|
| Nozzle (first / other) | 215 / 210 | 220 / 215 | 220 / 215 |
| Bed (first / other) | 60 / 60 | 60 / 60 | 60 / 55–60 |
| Chamber | — | — | vent open, ≤ 30 °C |
| Extrusion multiplier | 0.95–1.00 | 0.95–1.00 | 0.95–1.00 |
| Advance | K 0.03–0.05 | S 0.03–0.05 | S 0.03–0.05 |
| Retract length / speed | 0.8 mm / 35 mm/s | 0.6–0.8 mm / 35 mm/s | 0.6–0.8 mm / 35 mm/s |
| Fan min/max | 100 / 100 % | 100 / 100 % | 100 / 100 % |
| Fan bridges | 100 % | 100 % | 100 % |
| Disable fan first N layers | 1 | 1 | 1 |
| Max volumetric speed | 13 | 15–20 (MK4S: 24) | 24 |
| External perimeter | 30 mm/s | 45 mm/s | 45 mm/s |
| Perimeters | 45 mm/s | 120 mm/s | 130 mm/s |
| Solid / infill | 50 / 70 mm/s | 150 / 200 mm/s | 150 / 220 mm/s |
| Travel | 180 mm/s | 400 mm/s | 450 mm/s |

### PETG (0.4 nozzle, 0.2 mm layer)

| Setting | MK3S | MK4 | Core One |
|---|---|---|---|
| Nozzle (first / other) | 240 / 240 | 245 / 240 | 245 / 240 |
| Bed (first / other) | 85 / 90 | 85 / 85 | 85 / 85 |
| Chamber | — | — | closed, 35–40 °C |
| Extrusion multiplier | 0.93–0.98 | 0.93–0.98 | 0.93–0.98 |
| Advance | K 0.05–0.09 | S 0.04–0.06 | S 0.04–0.06 |
| Retract length / speed | 1.0–1.2 mm / 35 mm/s | 0.8–1.0 mm / 35 mm/s | 0.8–1.0 mm / 35 mm/s |
| Z-lift (retract lift) | 0.4–0.6 mm | 1.5 mm (stock) | 1.5 mm (stock) |
| Fan min/max | 30 / 50 % | 40 / 60 % | 30 / 50 % |
| Fan bridges | 100 % | 100 % | 100 % |
| Disable fan first N layers | 2–3 | 2–3 | 2–3 |
| Max volumetric speed | 8 | 10–13 | 13 |
| External perimeter | 25 mm/s | 40 mm/s | 40 mm/s |
| Perimeters | 40 mm/s | 100 mm/s | 110 mm/s |
| Solid / infill | 40 / 55 mm/s | 120 / 160 mm/s | 120 / 170 mm/s |
| Travel | 180 mm/s | 400 mm/s | 450 mm/s |

**PETG on smooth PEI: use a separator (glue stick) or switch to satin/textured.** PETG bonds to bare smooth PEI hard enough to tear the coating off. Also reduce first-layer squish slightly versus PLA — Live Z one or two notches further away.

### TPU (0.4 nozzle, 0.2 mm layer, 95A)

| Setting | MK3S | MK4 | Core One |
|---|---|---|---|
| Nozzle (first / other) | 235 / 230 | 235 / 230 | 235 / 230 |
| Bed (first / other) | 55 / 50 | 55 / 50 | 55 / 50 |
| Chamber | — | — | closed |
| Extrusion multiplier | 1.00–1.05 | 1.00–1.05 | 1.00–1.05 |
| Advance | K 0.00–0.03 | S 0.02–0.04 | S 0.02–0.04 |
| Retract length / speed | 0.4–0.8 mm / 20 mm/s | 0.4–0.8 mm / 25 mm/s | 0.4–0.8 mm / 25 mm/s |
| Fan min/max | 50 / 80 % | 50 / 80 % | 40 / 70 % |
| Disable fan first N layers | 1 | 1 | 1 |
| Max volumetric speed | 1.8–2.5 | 3–4 | 3–5 |
| External perimeter | 15 mm/s | 25 mm/s | 25 mm/s |
| Perimeters | 20 mm/s | 35 mm/s | 40 mm/s |
| Solid / infill | 20 / 25 mm/s | 35 / 45 mm/s | 40 / 50 mm/s |
| Travel | 120 mm/s | 250 mm/s | 300 mm/s |

TPU rules:
- **Speed is limited by the extruder, not the hotend.** MVS is the safety net; if you get grinding or clicking, drop MVS first.
- Retraction as low as you can tolerate. Long retracts on flexibles buckle the filament in the drive path.
- Spool must unwind with almost no resistance — mount it so there's no side pull, and check the PTFE path is smooth and gap-free.
- Softer than 95A (85A, Filaflex-class) on the MK3S: expect 10–15 mm/s and a lot of patience. The Nextruder machines are noticeably better here.
- Turn **off** ironing, avoid Arachne thin-wall gap fill if it produces micro-moves, and increase extrusion width slightly (0.48–0.50) for more reliable feeding.

---

## 5. Print-settings recipe (the "quality at reasonable speed" profile)

Applies across all three printers; start from the stock `0.20 SPEED` (MK3S) or `0.20 STRUCTURAL` (MK4/Core One) profile and change:

**Layers and perimeters**
- Perimeters: 3 (2 for pure cosmetic parts, 4+ for load-bearing)
- Top solid: 5, Bottom: 4 (at 0.2 mm)
- Seam position: **Aligned**, plus **paint-on seam** on visible parts
- Enable **scarf seams** (2.9 feature) on smooth curved surfaces where the seam line shows — it overlaps extrusion at the start/end of the perimeter loop to hide it
- Detect thin walls: **off** (Arachne handles this better)
- Ensure vertical shell thickness: **on**

**Infill**
- 15 % **Grid** or **Gyroid** for general parts; 25–30 % Gyroid for functional
- Combine infill every 2 layers for speed on tall parts
- Solid infill threshold area: 0 (avoids random solid patches)

**Speed**
- Set the table values from §4, then let MVS clamp them
- Enable **dynamic overhang speed**
- Bridges: 25–30 mm/s (MK3S) / 50–80 mm/s (MK4, Core One), bridge flow ratio ~0.95 for PLA, ~0.9 for PETG

**Advanced**
- Extrusion width: leave stock unless you have a reason. First layer 0.42–0.45 for adhesion.
- Elephant foot compensation: 0.2 mm typical; tune with a calibration cube if dimensional accuracy matters.

**Output options**
- Label objects on (helps diagnose G-code)
- Keep binary G-code on for MK4/Core One

---

## 6. Validation set

After each material is dialled, print these three and only sign off when all pass:

1. **Calibration cube / dimensional test** — check X/Y/Z within ±0.15 mm, adjust elephant foot compensation and (if your version exposes it) filament shrinkage compensation.
2. **Overhang + bridge + stringing combo test** — validates temperature, cooling and retraction together.
3. **A real part you actually print** — the profile is only good if it's good on your geometry.

Acceptance criteria:
- Top surface uniform, no pinholes (flow), no ridges (over-extrusion)
- Corners square, no bulges, no post-travel gaps (PA/LA)
- Seam a fine line, not a blob (PA/LA + retraction + scarf seam)
- Layer lines even top to bottom (cooling, MVS)
- Snap test: fracture should be granular, not clean layer separation (temperature)

Then re-export the config bundle and note the date.

---

## 7. Sources

- Extrusion multiplier calibration — https://help.prusa3d.com/article/extrusion-multiplier-calibration_2257
- Pressure Advance (MK4 / Core One, `M572`) — https://help.prusa3d.com/article/pressure-advance_814986
- Linear Advance (MK3S, `M900 K`) — https://help.prusa3d.com/article/linear-advance_2252
- Advanced calibration index — https://help.prusa3d.com/category/advanced-calibration_229
- PrusaSlicer releases / changelogs — https://github.com/prusa3d/PrusaSlicer/releases
- PrusaSlicer 2.9 feature overview (scarf seams etc.) — https://blog.prusa3d.com/prusaslicer-2-9-whats-new_107659/
- Flow-rate test blocks designed for PrusaSlicer — https://www.printables.com/model/1190404-extrusion-multiplierflow-rate-calibration-for-prus
