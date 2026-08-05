# CONTEXT.md — Prusa Print Profile Tuning Project

## What this project is

Building properly dialled PrusaSlicer filament/print profiles across a three-printer Prusa fleet, targeting **great quality at reasonable speed** (not max speed). All documentation was researched against Prusa Knowledge Base, PrusaSlicer 2.9.x behaviour, and manufacturer TDS data as of Aug 2026.

## Hardware

> **Correction, 2026-08-05.** The fleet is **MK3S, MK4S, Core One** — the middle machine is an MK4**S**,
> not a plain MK4. The table below has been updated. Note that `docs/`-derived material now under
> `reference/source-material/` still describes the MK4 case in places; it is preserved as originally
> written, and the course lessons are the corrected source of truth.

| Printer | Firmware family | Advance G-code | Kinematics | Practical flow ceiling (0.4 mm) |
|---|---|---|---|---|
| Prusa MK3S | Marlin | `M900 K` (Linear Advance 1.5) | Bedslinger | ~11–13 mm³/s |
| Prusa MK4S | Buddy (Input Shaper) | `M572 S` (Pressure Advance) | Bedslinger | ~22–28 mm³/s |
| Prusa Core One | Buddy (Input Shaper) | `M572 S` (Pressure Advance) | CoreXY, enclosed | ~22–28 mm³/s |

The MK4S and Core One share an MK4S-class hotend, so their **flow** ceilings match; they differ in
**motion** (bedslinger vs CoreXY, enclosed). Expect similar filament profiles, different speed/accel.

**Critical invariant:** MK3S values and MK4/Core One values are NOT interchangeable. LA (K) and PA (S) are on different scales. Every filament gets one profile per printer family.

## Materials in scope

- PLA (generic, tables in main guide)
- PETG — specifically **eSUN PETG** (TDS: 230–250 °C / 240 rec, bed 75–90 °C; community: prefers cool end 235–240, sticks aggressively even to textured PEI)
- TPU — specifically **eSun eTPU-95A** (TDS: 210–250 °C, bed 45–60 °C, 20–50 mm/s, dry 55 °C >4 h; community MK3S recipe: cooler + slower + more retraction, loosen idler, dry to <30 % RH)

Environment note: printers are in Mauritius — high ambient humidity, so filament drying assumptions are aggressive throughout.

## Files in this repo

```
CONTEXT.md                              <- this file
docs/prusaslicer-profile-tuning.md      <- master tuning guide (calibration order, per-machine notes, starting tables, validation set)
docs/esun-starter-profiles.md           <- eSun PETG + eTPU-95A starter values with import instructions
profiles/esun-starter-profiles-bundle.ini <- importable PrusaSlicer config bundle (6 filament profiles)
```

## Key conventions (do not break)

1. **Profile naming:** `<Vendor> <Material> @<PRINTER> <nozzle>` e.g. `eSun PETG @MK4 0.4`. Ini section headers: `[filament:<name>]`.
2. **Self-contained profiles** — no `inherits` in the bundle. Deliberate: survives system-profile updates, imports on any vendor bundle version. Keep it that way for new profiles.
3. **`compatible_printers_condition`** on every filament profile: `printer_model=~/.*MK3.*/`, `.*MK4.*`, `.*COREONE.*` plus `nozzle_diameter[0]==0.4`.
4. **PA/LA lives in `start_filament_gcode`**, never in printer start G-code. MK3S profiles use `M900 K…`; MK4/Core One use `M572 S…`.
5. Calibration order is fixed: **temperature → extrusion multiplier (flow) → PA/LA → retraction → cooling → max volumetric speed → speeds/accels**. Each step invalidates later ones.
6. MVS (`filament_max_volumetric_speed`) is the real speed cap; speed fields are clamped by it.

## Current state

- [x] Master tuning guide written and fact-checked against Prusa KB (temp tower G-code band fix applied; MK4S hot-PLA note added)
- [x] Starter profiles for eSun eTPU-95A and eSUN PETG, all three printers, as importable bundle
- [ ] Actual calibration runs not yet done — bundle values are datasheet + community starting points; EM, PA/LA, retraction all need per-spool tuning per the guide §2
- [ ] PLA starter bundle not yet built (tables exist in guide §4; no .ini yet)
- [ ] No per-nozzle variants beyond 0.4

## Likely tasks for Claude Code

- Generate a **PLA starter bundle** matching the existing ini conventions from guide §4 tables.
- Generate **calibration G-code helpers**: parametric temp-tower / PA-tower "after layer change" blocks for given layer height, band count, value ranges (see guide §2.1, §2.3 for the block format — Marlin `M104`/`M900` for MK3S, `M572` for Buddy).
- Add **per-nozzle variants** (0.6, 0.25): duplicate section, rename, adjust condition, scale MVS and PA (larger nozzle → lower PA value, higher MVS).
- Build a **tuning log** structure (per spool: brand, colour, date, measured EM, PA/LA, MVS) — guide recommends logging in filament_notes; a CSV/markdown log per printer may be better.
- Validate/lint the ini: every `[filament:*]` section should have the full key set; keys are PrusaSlicer 2.9.x names (`filament_retract_length`, not `retract_length`, for filament-level overrides).
- After real calibration runs: update bundle values from measured results, bump a version comment in the ini header.

## Gotchas encountered so far

- PrusaSlicer skips unknown ini keys on import rather than failing — silent, so lint before shipping.
- MK3S system printer profile emits `M221 S95` for layer heights ≥0.075 mm (legacy flow kludge) — don't double-correct EM for it.
- PA must be tuned at production accel/speed; slow test prints give over-high values that starve corners at real speed.
- Core One enclosure fights PLA (vent open, chamber ≤30 °C) but helps PETG/TPU (closed).
- PETG on smooth PEI needs a glue-stick separator or it tears the coating; eSUN PETG reportedly grips hard even on textured.
- eSun's TDS says 100 % fan for eTPU-95A; profiles use 60–100 % band — drop max fan before raising temp if layer bonding suffers.

## Reference links

- Extrusion multiplier calibration: https://help.prusa3d.com/article/extrusion-multiplier-calibration_2257
- Pressure Advance (M572): https://help.prusa3d.com/article/pressure-advance_814986
- Linear Advance (M900): https://help.prusa3d.com/article/linear-advance_2252
- PrusaSlicer releases: https://github.com/prusa3d/PrusaSlicer/releases
- Flow test blocks (PrusaSlicer-specific): https://www.printables.com/model/1190404
- All-in-one validation print: https://www.printables.com/model/112181
