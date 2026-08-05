# eSun Starter Profiles — eTPU-95A & eSUN PETG (MK3S · MK4S · Core One)

> **Revised 2026-08-05.** The fleet is MK3S / **MK4S** / Core One. The `@MK4` presets in the bundle
> have been renamed `@MK4S`. Their `compatible_printers_condition` still matches on `/.*MK4.*/`,
> which also matches an MK4S — see Lesson 16 for how to verify the real `printer_model` and tighten
> it. Note also that the MK4S hotend is the same class as the Core One's, so their flow ceilings
> match (~22–28 mm³/s) even though their motion systems do not.

## Importing the bundle

The companion file `esun-starter-profiles-bundle.ini` contains all six profiles ready to import.

1. **File → Import → Import Config Bundle…** → select `esun-starter-profiles-bundle.ini`.
2. PrusaSlicer reports the imported presets. They appear in the **Filament** dropdown as *User presets* (above the system ones).
3. Each profile carries a `compatible_printers_condition`, so it only shows when the matching printer **and a 0.4 nozzle** are selected — if a profile seems missing, check the active printer/nozzle first.
4. The profiles are self-contained (no `inherits`), so they survive Prusa system-profile updates but also won't pick them up — that's intentional for a tuning baseline.
5. After tuning EM / PA / retraction, just **Save** over the same preset name, and re-export your own bundle (**File → Export → Export Config Bundle**) as backup.

Notes on the bundle:
- `@MK4S` profiles match any MK4-family model, because the condition is `/.*MK4.*/`; MK3S profiles match MK3-family; Core One matches COREONE.
- `filament_colour` is just a UI swatch (green = PETG, orange = TPU) — change freely.
- The PA/LA starting value lives in each profile's **Custom G-code → Start G-code**; that's the line you edit after running the tower test.
- If you print with other nozzle sizes, duplicate the preset, rename (e.g. `@MK4S 0.6`), change the condition to `nozzle_diameter[0]==0.6`, and re-tune MVS + PA.

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

## Tuning order for both

Run the §2 sequence from the main guide, but you can shortcut: temperatures above are already tower-verified ranges for these exact filaments, so start at **flow (EM)** → **PA/LA tower** → **retraction spikes**, then validate. Log measured EM and PA per spool colour in Filament Notes.
