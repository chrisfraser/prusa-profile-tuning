# Dialled In Resources

Every claim in a lesson traces back to something here. Prusa's own Knowledge Base is the
first-among-equals source for anything machine-specific — it is the only place that documents the
actual menu paths and target numbers per model, and those differ between MK3S, MK4/S and Core One.

## Knowledge

### Prusa Knowledge Base — machine calibration

- [Calibration (index)](https://help.prusa3d.com/category/calibration_199)
  The per-model calibration hub. Use for: finding the article that matches *your* printer — the KB
  splits articles by model family and the wrong one will give the wrong menu path.
- [Advanced calibration (index)](https://help.prusa3d.com/category/advanced-calibration_229)
  PID tuning, extrusion multiplier, linearity correction, Linear Advance. Use for: Phase 1 and 2.
- [Selftest (MK3/MK3S/MK3S+)](https://help.prusa3d.com/article/selbsttest-mk3-und-mk3s_6366)
  What the MK3S selftest actually checks and in what order. Use for: Lesson 5.
- [Selftest failed (MK3/MK3S/MK3S+)](https://help.prusa3d.com/article/selftest-failed-mk3-mk3s-mk3s_2045)
  Failure-by-failure diagnosis. Use for: when the health check stops you dead.
- [Adjusting belt tension (MK4/S, MK3.9/S, MK3.5/S, MK3/S/+)](https://help.prusa3d.com/article/adjusting-belt-tension-mk4-s-mk3-9-s-mk3-5-s-mk3-s_112380)
  Belt-status target numbers for MK3S (X ≈ 250, Y ≈ 275) and the physical adjustment procedure for
  MK4S. Use for: Lesson 6.
- [Adjusting belt tension (CORE One)](https://help.prusa3d.com/article/adjusting-belt-tension-core-one_845048)
  CoreXY belt frequencies (90–98 Hz, ≤ 8 Hz apart) and the alternating-tensioner rule that keeps the
  gantry square. Use for: Lesson 6, Core One section.
- [Belt tuning wizard](https://help.prusa3d.com/article/belt-tuning-wizard_973716)
  The guided stroboscopic belt-tuning flow on newer Buddy firmware. Use for: Lesson 6 if your
  firmware exposes it.
- [XYZ calibration details (MK3S)](https://help.prusa3d.com/article/xyz-calibration-details_2272)
  How to read the skew/axis-length numbers the MK3S records. Use for: Lesson 5, MK3S section.
- [Check Axis Length X/Y/Z (MK3S)](https://help.prusa3d.com/article/check-axis-length-x-y-z-mk3s_134223)
  What an axis-length error means mechanically. Use for: Lesson 6, MK3S section.
- [Live adjust Z](https://help.prusa3d.com/article/live-adjust-z_112427)
  First-layer offset on PINDA machines vs loadcell machines; typical range −1.500 to −0.200; which
  direction moves the nozzle closer. Use for: Lesson 7.
- [Loadcell (MK4/S, MK3.9/S, XL)](https://help.prusa3d.com/article/loadcell-mk4-s-mk3-9-s-xl_401253)
  Why MK4-family printers don't need a manual first-layer calibration, and what the selftest step
  actually sets. Use for: Lesson 7, MK4S / Core One sections.
- [Loadcell troubleshooting](https://help.prusa3d.com/article/loadcell-troubleshooting_815397)
  When automatic first layer goes wrong. Use for: Lesson 7 diagnosis.
- [PID tuning](https://help.prusa3d.com/article/pid-tuning_2265)
  When temperature wobble is worth fixing (±5 °C is the threshold) and the LCD path. Use for: Lesson 8,
  MK3S section.
- [Thermal model calibration](https://help.prusa3d.com/article/thermal-model-calibration_382488)
  The Buddy-firmware equivalent of PID for the MK4 family. Use for: Lesson 8, MK4S / Core One sections.
- [Input Shaper (CORE One, MK4/S, MK3.9/S, MK3.5/S, XL, MINI/+)](https://help.prusa3d.com/article/input-shaper-core-one-mk4-s-mk3-9-s-mk3-5-s-xl-mini_451816)
  What Input Shaper does, which printers have it, and why belts must be right *first*. Use for:
  Lessons 6 and 8.

### Prusa Knowledge Base — filament and profile tuning

- [Extrusion multiplier calibration](https://help.prusa3d.com/article/extrusion-multiplier-calibration_2257)
  Prusa's own EM procedure, and the crucial fact that total flow = firmware `M221` × slicer EM. Use
  for: Lesson 10.
- [Pressure Advance (`M572`)](https://help.prusa3d.com/article/pressure-advance_814986)
  PA on MK4-family and Core One; replaces Linear Advance from firmware 5.0.0. Use for: Lesson 11,
  MK4S / Core One sections.
- [Linear Advance (`M900 K`)](https://help.prusa3d.com/article/linear-advance_2252)
  LA 1.5 on the MK3S — a different scale to PA, not interchangeable. Use for: Lesson 11, MK3S section.
- [Extruder linearity correction calibration](https://help.prusa3d.com/article/extruder-linearity-correction-calibration_2254)
  MK3/MK3S-only Trinamic driver correction. Use for: Lesson 8, MK3S section.
- [Buddy firmware-specific G-code commands](https://help.prusa3d.com/article/buddy-firmware-specific-g-code-commands_633112)
  The authoritative list of what `M572` and friends accept on MK4S / Core One. Use for: writing custom
  G-code blocks without guessing.

### Slicer

- [PrusaSlicer releases / changelogs](https://github.com/prusa3d/PrusaSlicer/releases)
  Which version introduced which setting. Use for: checking a setting exists before teaching it.
- [PrusaSlicer 2.9 — what's new](https://blog.prusa3d.com/prusaslicer-2-9-whats-new_107659/)
  Scarf seams and the other 2.9 features this course assumes. Use for: Phase 3.

### Independent

- [Ellis' Print Tuning Guide — Andrew Ellis](https://ellis3dp.com/Print-Tuning-Guide/)
  The best independent, method-first calibration guide. Written for Voron/Klipper but explicitly
  aimed at being universal; the *reasoning* transfers even where the firmware doesn't. Use for: a
  second opinion on method, especially pressure advance and flow. Cross-check every number against
  the Prusa KB before applying it to a Prusa.
- [Extrusion multiplier / flow-rate test blocks for PrusaSlicer (Printables)](https://www.printables.com/model/1190404-extrusion-multiplierflow-rate-calibration-for-prus)
  Stepped flow blocks built for PrusaSlicer's own extrusion-width maths. Use for: Lesson 10, if you
  prefer a print to calipers.
- [All-in-one printer test (Printables)](https://www.printables.com/model/112181)
  The validation model. Use for: Lesson 17 sign-off.

### In this repo

- [`reference/source-material/prusaslicer-profile-tuning.md`](reference/source-material/prusaslicer-profile-tuning.md)
  The original master guide this course is built from — calibration order, per-machine notes, starting
  tables, validation set. Use for: the Phase 2 numbers.
- [`reference/source-material/esun-starter-profiles.md`](reference/source-material/esun-starter-profiles.md)
  eSUN PETG + eSun eTPU-95A starting values and import instructions.
- [`reference/source-material/esun-starter-profiles-bundle.ini`](reference/source-material/esun-starter-profiles-bundle.ini)
  Importable PrusaSlicer config bundle, six filament profiles.

## Wisdom (Communities)

- [Prusa Community Forum](https://forum.prusa3d.com/)
  Officially hosted, heavily populated by long-time MK3 owners. Use for: "is this normal for an
  MK3S?", machine-specific quirks, and anything where a photo of the failure is worth a thousand
  words.
- [r/prusa3d](https://www.reddit.com/r/prusa3d/)
  Fast-moving and model-specific; the first place Core One quirks surface. Use for: recent-firmware
  behaviour and whether a symptom is widespread.
- [r/3Dprinting](https://www.reddit.com/r/3Dprinting/)
  Broader and less Prusa-specific. Use for: material behaviour and general failure diagnosis; be
  more sceptical, cross-check against the KB.
- [Printables](https://www.printables.com/)
  Prusa's model host. Use for: sourcing the calibration models each lesson asks for — prefer models
  that state which slicer and printer they were designed for.

## Gaps

- **No high-trust source for Core One chamber-temperature targets per material.** The guidance in the
  master guide ("vent open, ≤30 °C for PLA; closed, 35–40 °C for PETG") is community-derived, not KB
  documented. Flag it as such in lessons until a KB article covers it.
- **No independent source verified for eSUN PETG / eSun eTPU-95A behaviour** beyond the manufacturer
  TDS. Treat those starting numbers as vendor claims, not measurements.
- **Humidity/drying**: no Prusa KB article gives per-material drying temperatures and times. The
  numbers in the master guide are community consensus. Worth finding a materials-science-grade source
  given the Mauritius climate.
- **Belt-tension frequency method for MK3S** — the KB gives a belt-status *number*, not a frequency.
  No verified frequency target exists for the MK3S the way it does for the Core One.
