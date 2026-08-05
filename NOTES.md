# Working Notes

## The learner

- Owns and runs three Prusa printers: **MK3S** (Marlin), **MK4** (Buddy), **Core One** (Buddy, CoreXY,
  enclosed). Located in **Mauritius** — high ambient humidity.
- Already researched and wrote a full PrusaSlicer tuning guide (now at
  `reference/source-material/prusaslicer-profile-tuning.md`) and an importable starter `.ini` bundle
  for eSUN PETG and eSun eTPU-95A. So: **can navigate PrusaSlicer, understands profile inheritance,
  and has already met most Phase 2 vocabulary in writing.**
- What is *not* established: whether any of it has been done hands-on. The guide's numbers are
  datasheet + community starting points, not measured. No calibration runs recorded yet.
- Asked explicitly to start from **total-beginner fundamentals** — so treat prior exposure as reading
  knowledge, not skill. Fluency ≠ storage strength.
- Asked for **skip-ahead links** on the fundamentals, so a fast reader isn't held up.

## Hard constraints

- **Two firmware families, never interchangeable.** MK3S = Marlin, Linear Advance, `M900 K`.
  MK4 + Core One = Buddy, Pressure Advance, `M572 S`. Any lesson with a menu path or a G-code command
  **must** carry separate MK3S / MK4 / Core One sections. This is the single most important
  course-specific rule.
- High humidity. Drying is a prerequisite, not an optimisation.
- Evenings and weekends only — lessons finishable in one sitting.
- PrusaSlicer 2.9.x, Expert mode, 0.4 mm nozzle as the default case.

## Teaching preferences

- The user's global instruction is **extreme concision** in chat. That governs *conversation*, not
  lesson prose — lessons stay in the course voice. But chat replies about the course should be terse.
- Ground everything. The user has already fact-checked their own guide against the Prusa KB, so
  unsourced claims will be noticed. Cite with `.cite` superscripts.
- Prefer measured numbers over vibes. Where a number is community-derived rather than KB-documented,
  say so out loud in the lesson.

## Build conventions

- Palette: `--accent #c2410c` · `--accent-deep #7c2d12` · `--dark #1b1210` · `--bright #fb923c`.
  Brand glyph `⬢`. Set at scaffold time — don't relitigate.
- Shared design system in `assets/styles.css` + `assets/widgets.js`. Use only classes defined there.
- Top bar is identical on every page, delimited by `<!-- NAV:START -->` / `<!-- NAV:END -->`.
  Change it with `~/.agents/skills/course/scripts/set-nav.py`, never by hand.
- Lessons follow `AUTHORING-GUIDE.md`; copy `lessons/0001-*.html` and change only the content.
- `GLOSSARY.md` is canonical; `reference/glossary.html` mirrors it. Edit the `.md` first.
- Quiz options stay equal-length so formatting gives no clue.
- **Per-machine sections use `details.panel`**, one per printer family, in the fixed order
  MK3S → MK4 / MK4S → Core One. Always all three, even when two are identical — the user needs to be
  able to open exactly their machine and read only that.
- Original research lives in `reference/source-material/`. It is the *input*; lessons are the output.
  Don't edit source material to match a lesson — update the lesson, or note the divergence.

## Open questions / next sessions

- [ ] Which printer will actually be calibrated first? Lessons 5–8 are written machine-agnostic with
      per-machine panels, but the tasks assume one machine at a time.
- [ ] Does the Core One firmware here expose the **Belt tuning wizard** (Settings → Manual Belt Tuning,
      firmware 6.4.0+) or does it need the manual strum-and-measure method?
- [ ] Is the MK4 an MK4 or an MK4S? Flow ceiling and stock PLA temperature differ materially
      (~15–20 vs ~22–28 mm³/s). Phase 2 numbers hinge on it.
- [ ] Write Phase 2 (lessons 9–15) from `reference/source-material/prusaslicer-profile-tuning.md` §2.
- [ ] Write Phase 3 (lessons 16–18) from §1, §6 and the CONTEXT.md conventions.
- [ ] Fill `reference/calibration-card.html` once Phase 1 is signed off — it should carry the
      per-machine target numbers (belt status, belt Hz, IS frequency band) on one page.
- [ ] Find a better source for drying temperatures/times (see RESOURCES.md § Gaps).
