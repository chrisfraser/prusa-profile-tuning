# eSun Starter Profiles — eTPU-95A & eSUN PETG (MK3S · MK4S · Core One)

> **Revised 2026-08-06.** The bundle now carries **24 presets**: the six 0.4 mm filament presets
> tabled below, six 0.6 mm filament variants, and twelve print presets — one paired with each
> filament preset, speeds pre-clamped to that filament's max volumetric speed. Preset names use the
> printer *family* — `@MK3S`, `@MK4`, `@COREONE` — matching their deliberately loose
> `compatible_printers_condition` (`/.*MK4.*/` also matches an MK4S); the fleet is MK3S / **MK4S** /
> Core One, and Lesson 17 covers reading the real `printer_model` and tightening name and condition
> (e.g. to `@MK4S`). Note also that the MK4S hotend is the same class as the Core One's, so their
> flow ceilings match (~22–28 mm³/s) even though their motion systems do not.

## Importing the bundle

The companion file `esun-starter-profiles-bundle.ini` contains all 24 presets ready to import.

1. **File → Import → Import Config Bundle…** → select `esun-starter-profiles-bundle.ini`.
2. PrusaSlicer reports the imported presets. Filament presets appear in the **Filament** dropdown, print presets in the **Print Settings** dropdown, both as *User presets* (above the system ones).
3. Each preset carries a `compatible_printers_condition`, so it only shows when the matching printer **and matching nozzle (0.4 or 0.6)** are selected — if a preset seems missing, check the active printer/nozzle first. Switching the nozzle swaps which set is visible.
4. The profiles are self-contained (no `inherits`), so they survive Prusa system-profile updates but also won't pick them up — that's intentional for a tuning baseline.
5. After tuning EM / PA / retraction, just **Save** over the same preset name, and re-export your own bundle (**File → Export → Export Config Bundle**) as backup.

Notes on the bundle:
- `@MK4` profiles match any MK4-family model, because the condition is `/.*MK4.*/`; MK3S profiles match MK3-family; Core One matches COREONE.
- `filament_colour` is just a UI swatch (green = PETG, orange = TPU) — change freely.
- The PA/LA starting value lives in each profile's **Custom G-code → Start G-code**; that's the line you edit after running the tower test.
- 0.4 and 0.6 nozzles are both covered. For any other size, duplicate the nearest preset, rename (e.g. `@MK4 0.8`), change the condition to `nozzle_diameter[0]==0.8`, and re-tune MVS + PA at that nozzle.

Manufacturer datasheet values cross-checked against community results on Prusa hardware. The tables below document what's inside the bundle.

---

## eSun eTPU-95A

**Manufacturer envelope (TDS v4.0):** nozzle 210–250 °C, bed 45–60 °C, speed 20–50 mm/s, fan 100 %, dry 55 °C for >4 h (longer is better — community MK3S consensus is 8–12 h).

**Base system profile:** `Generic FLEX` (MK3S) / `Prusament TPU 95A` (MK4S, Core One) — the Prusament profile is the better starting skeleton on Nextruder machines since it carries the correct PA block and Nextruder-tuned overrides.

| Filament Settings | MK3S | MK4S | Core One |
|---|---|---|---|
| Nozzle first / other | 235 / 230 | 230 / 228 | 230 / 228 |
| Bed first / other | 50 / 50 | 50 / 50 | 50 / 50 |
| Chamber | — | — | door closed |
| Extrusion multiplier | 1.05 | 1.02 | 1.02 |
| Density / diameter | 1.21 g/cm³ / 1.75 | 1.21 / 1.75 | 1.21 / 1.75 |
| Fan min / max | 70 / 100 % | 70 / 100 % | 60 / 90 % |
| Bridges fan | 100 % | 100 % | 100 % |
| Disable fan first layers | 1 | 1 | 1 |
| Max volumetric speed | **1.8** | **3.5** | **3.5** |
| Advance (Start G-code) | `M900 K0` to start; try 0.02–0.06 after | `M572 S0.03` | `M572 S0.03` |

**Filament Overrides (tick and set):**

| | MK3S | MK4S / Core One |
|---|---|---|
| Retraction length | 0.8 mm | 0.6 mm |
| Retraction speed | 20 mm/s | 25 mm/s |
| Deretraction speed | 15 mm/s | 20 mm/s |
| Z-lift | 0 | 0.2 mm |
| Minimum travel after retraction | 2 mm | 2 mm |
| Wipe while retracting | on | on |

**Print speeds** (set in the print profile you pair with it):
- External perimeter 15 / perimeters 20 / infill 25 / travel 120 (MK3S)
- External perimeter 25 / perimeters 35 / infill 45 / travel 250 (MK4S, Core One)
- First layer: 15 mm/s everywhere, first layer extrusion width 120 %

**Known behaviour of this specific filament on Prusa machines:**
- It strings more than Prusament TPU regardless of tuning; dry filament is the single biggest lever. Below ~30 % RH it becomes manageable, wet it's hopeless.
- MK3S: loosen the idler screws noticeably from PLA tension, and print cooler rather than hotter if you get blobs — the community-settled MK3S recipe is cooler + slower + slightly more retraction than the generic FLEX profile.
- Bed 50 °C; on smooth PEI use glue stick as separator (it bonds hard), textured sheet preferred.
- eSun's own sheet says fan 100 %; if inter-layer bonding suffers on functional parts, drop max fan to 60–70 % and slow down instead.
- Nextruder (MK4S/Core One) handles it far better than the MK3S drive; don't transfer MK3S caution to those machines — just respect the MVS cap.

---

## eSUN PETG

**Manufacturer envelope:** nozzle 230–250 °C (240 recommended), bed 75–90 °C, fan up to 100 %, speed 40–100 mm/s. Community consensus on well-tuned machines: this filament prefers the **cool end** — 235–240 °C — and flows unusually well for PETG.

**Base system profile:** `Generic PETG` (all three), or `Prusament PETG` if you want its conditional G-code as skeleton.

| Filament Settings | MK3S | MK4S | Core One |
|---|---|---|---|
| Nozzle first / other | 240 / 238 | 240 / 235 | 240 / 235 |
| Bed first / other | 85 / 90 | 80 / 85 | 80 / 85 |
| Chamber | — | — | closed, ≤ 40 °C |
| Extrusion multiplier | 0.95 | 0.95 | 0.95 |
| Density / diameter | 1.27 g/cm³ / 1.75 | 1.27 / 1.75 | 1.27 / 1.75 |
| Fan min / max | 30 / 50 % | 40 / 60 % | 30 / 50 % |
| Bridges fan | 100 % | 100 % | 100 % |
| Disable fan first layers | 3 | 3 | 3 |
| Slow down if layer < | 15 s | 10 s | 10 s |
| Max volumetric speed | **8** | **13** | **14** |
| Advance (Start G-code) | `M900 K0.07` | `M572 S0.05` | `M572 S0.05` |

**Filament Overrides:**

| | MK3S | MK4S / Core One |
|---|---|---|
| Retraction length | 1.2 mm | 0.8 mm |
| Retraction speed | 35 mm/s | 35 mm/s |
| Z-lift | 0.4 mm | 1.5 mm (stock) |
| Wipe while retracting | on | on |

**Print speeds:**
- External perimeter 25 / perimeters 40 / infill 55 (MK3S)
- External perimeter 40 / perimeters 100 / infill 160 (MK4S) — MVS will clamp these correctly
- External perimeter 40 / perimeters 110 / infill 170 (Core One)

**Known behaviour:**
- Reported to bond aggressively even to **textured** PEI — do a corner-lift check on your first print; if it fights you, drop bed to 75 °C and remove prints only after full cooldown. Never print it on bare smooth PEI without glue stick.
- If overhangs droop at 245+, don't add fan — drop temperature to 235 first. This filament's flow ceiling is high enough that it doesn't need the hot end of eSun's range at quality speeds.
- Dry 65 °C / 6–8 h if it's been out of the bag more than a couple of weeks (Mauritius humidity will get it faster than that — consider a dry box in rotation).
- First layer: one or two Live-Z clicks less squish than your PLA setting.

---

## 0.6 mm nozzle variants — what changes and why

The 0.6 presets are not renames of the 0.4 ones. A wider orifice melts a larger cross-section per
millimetre of travel (more heat needed), restricts flow less (higher ceiling), and builds less
back-pressure per unit of flow (lower advance). All 0.6 values are starting points in the same sense
as the 0.4 ones — re-measure EM, advance and MVS at the new nozzle.

| Setting (first / other where relevant) | PETG 0.4 | PETG 0.6 | eTPU-95A 0.4 | eTPU-95A 0.6 |
|---|---|---|---|---|
| Nozzle °C — MK3S | 240 / 238 | 245 / 242 | 235 / 230 | 232 / 230 |
| Nozzle °C — MK4 / Core One | 240 / 235 | 245 / 240 | 230 / 228 | 232 / 230 |
| MVS mm³/s — MK3S / MK4 / Core One | 8 / 13 / 14 | 10 / 15 / 16 | 1.8 / 3.5 / 3.5 | 2.5 / 5 / 5 |
| Advance — MK3S | `M900 K0.07` | `M900 K0.05` | `M900 K0` | `M900 K0` |
| Advance — MK4 / Core One | `M572 S0.05` | `M572 S0.035` | `M572 S0.03` | `M572 S0.022` |

The MK4 0.6 PETG note in the bundle: MVS 15 assumes a stock MK4 hotend — on an MK4S it can be pushed
toward 18–20 once measured.

## Print presets — paired, and pre-clamped to MVS

One print preset per filament preset, named `<layer height> <material> @<PRINTER> <nozzle>`. The
layer height follows the nozzle: 0.20 mm at 0.4 (0.45 width), 0.32 mm at 0.6 (0.68 width) for PETG;
0.25 / 0.30 mm for TPU. Every speed obeys `speed ≤ MVS / (layer height × extrusion width)`, so until
L15–L16 replace the inherited ceilings with measured ones, the slicer can never demand more flow than
the filament preset allows. The fastest line in each preset, checked:

| Print preset | Fastest demand (infill) | Filament MVS |
|---|---|---|
| 0.20 PETG @MK3S 0.4 | 55 × 0.45 × 0.20 = 4.95 mm³/s | 8 |
| 0.20 PETG @MK4 0.4 | 140 × 0.45 × 0.20 = 12.6 mm³/s | 13 |
| 0.20 PETG @COREONE 0.4 | 155 × 0.45 × 0.20 = 13.95 mm³/s | 14 |
| 0.32 PETG @MK3S 0.6 | 42 × 0.68 × 0.32 = 9.14 mm³/s | 10 |
| 0.32 PETG @MK4 0.6 | 65 × 0.68 × 0.32 = 14.1 mm³/s | 15 |
| 0.32 PETG @COREONE 0.6 | 70 × 0.68 × 0.32 = 15.2 mm³/s | 16 |
| 0.25 TPU @MK3S 0.4 | 15 × 0.48 × 0.25 = 1.8 mm³/s | 1.8 |
| 0.25 TPU @MK4 / @COREONE 0.4 | 28 × 0.48 × 0.25 = 3.36 mm³/s | 3.5 |
| 0.30 TPU @MK3S 0.6 | 11 × 0.68 × 0.30 = 2.24 mm³/s | 2.5 |
| 0.30 TPU @MK4 / @COREONE 0.6 | 22 × 0.68 × 0.30 = 4.49 mm³/s | 5 |

Beyond speeds: gyroid infill 15 % (18 % TPU), 3 perimeters at 0.4 (2 at 0.6, where the wall is
wider), dynamic overhang speeds on, TPU presets add `avoid_crossing_perimeters` to cut retraction
count. Accelerations are per-machine (MK3S 1000, MK4 4000, Core One 4500 default) — L16's subject.

---

## Tuning order for both

Run the §2 sequence from the main guide, but you can shortcut: temperatures above are already tower-verified ranges for these exact filaments, so start at **flow (EM)** → **PA/LA tower** → **retraction spikes**, then validate. Log measured EM and PA per spool colour in Filament Notes.
