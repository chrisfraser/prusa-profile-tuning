# Mission: Dialled In — Prusa machine & profile tuning

## Why

I run a three-printer Prusa fleet — an MK3S, an MK4, and a Core One — in Mauritius, where ambient
humidity is high enough to sabotage a print on its own. I want to stop guessing. I want PrusaSlicer
profiles for PLA, PETG and TPU on each machine that I *trust*: hit print, walk away, get a part that's
dimensionally right and doesn't delaminate. Not maximum speed — repeatable quality at a sane speed.

I already have a written tuning guide and a starter `.ini` bundle, but its numbers are
datasheet-and-community starting points, not measured ones. And it starts at the *profile*, which
assumes the *machine* is already trustworthy. That hasn't been earned yet. This course goes back and
earns it.

## Success looks like

- I can name what each calibration step measures, and why it has to happen in that order.
- Each of the three printers passes a mechanical health check I ran myself, with numbers I wrote
  down — belt tension, first layer, thermal stability, Input Shaper.
- For a new spool of any material, I can go from "just opened it" to a signed-off profile in one
  evening, following my own process without re-reading the guide.
- I keep a tuning log per printer per spool: brand, colour, date, measured EM, PA/LA, MVS.
- The all-in-one validation print passes on all three machines for PLA and PETG.
- When a print fails, I can look at it and name the *one* setting that caused it.

## Constraints

- **Three machines, two firmware families.** MK3S is Marlin (`M900 K`, Linear Advance); MK4 and Core
  One are Buddy (`M572 S`, Pressure Advance). Values are not interchangeable — every lesson that
  touches a machine-specific path or number must split by machine.
- **High-humidity environment (Mauritius).** Drying assumptions are aggressive throughout; a wet spool
  invalidates every measurement downstream.
- **Evenings and weekends.** Lessons must be finishable in one sitting; calibration prints short
  enough to run inside one.
- **PrusaSlicer 2.9.x, Expert mode.** All menu paths assume it.
- Materials in scope: PLA (generic), eSUN PETG, eSun eTPU-95A. 0.4 mm nozzle first.

## Out of scope

- Non-Prusa printers, Klipper, custom firmware.
- Maximum-flow / speed-benchy territory.
- Multi-material, MMU, soluble supports.
- Exotic materials (ASA, PC, nylon, CF-filled) until PLA/PETG/TPU are signed off.
- Hardware modification or upgrades — the goal is to trust the machines as built.

## Course arc

**Phase 0 · Fundamentals** — how a printer actually turns plastic into parts, and what a calibration
*is*. Skippable if already known; every lesson carries a skip-ahead link.

1. The machine in four parts — motion, hotend, extruder, bed; bedslinger vs CoreXY
2. Filament is a material, not a supply — melt, glass transition, moisture
3. What the slicer actually decides — the extrusion equation and G-code
4. The calibration mindset — one variable, in dependency order, written down

**Phase 1 · The machine** — earn a trustworthy printer before you tune a profile.

5. Selftest and the health check — per-printer paths
6. Belt tension and squareness — the numbers, per printer
7. First layer and Z-offset — PINDA vs loadcell
8. Thermal and motion trust — PID, thermal model, Input Shaper, linearity correction

**Phase 2 · The filament** — the seven-step profile calibration, in dependency order.

9. Temperature tower
10. Extrusion multiplier (flow)
11. Pressure / Linear Advance
12. Retraction
13. Cooling
14. Max volumetric speed
15. Speeds and accelerations

**Phase 3 · Ship it** — turn measurements into profiles you keep.

16. Profile structure, naming and compatible-printer conditions
17. The validation set and sign-off criteria
18. The tuning log and keeping a three-printer fleet honest
