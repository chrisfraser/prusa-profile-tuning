# Working Notes

## The learner

- Owns and runs three Prusa printers: **MK3S** (Marlin), **MK4S** (Buddy), **Core One** (Buddy, CoreXY,
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
  MK4S + Core One = Buddy, Pressure Advance, `M572 S`. Any lesson with a menu path or a G-code command
  **must** carry separate MK3S / MK4S / Core One sections. This is the single most important
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
  MK3S → MK4S → Core One. Always all three, even when two are identical — the user needs to be
  able to open exactly their machine and read only that.
- Original research lives in `reference/source-material/`. It is the *input*; lessons are the output.
  Don't edit source material to match a lesson — update the lesson, or note the divergence.

## Open questions / next sessions

- [ ] Which printer will actually be calibrated first? Lessons 5–8 are written machine-agnostic with
      per-machine panels, but the tasks assume one machine at a time.
- [ ] Does the Core One firmware here expose the **Belt tuning wizard** (Settings → Manual Belt Tuning,
      firmware 6.4.0+) or does it need the manual strum-and-measure method?
- [x] **Resolved 2026-08-05: the fleet is MK3S, MK4**S**, Core One.** Not a plain MK4. Consequences for
      Phase 2: flow ceiling ~22–28 mm³/s not ~15–20; MK4S-class hotend, the same class as the Core One;
      stock PLA profiles run hotter (~230 °C) to support that ceiling. So the MK4S and Core One will end
      up with *similar filament profiles* but *different speed/accel profiles* — the MK4S is still a
      bedslinger. `CONTEXT.md` and `reference/source-material/` still carry the old MK4 row; they are
      preserved as the original brief, with a correction note in `CONTEXT.md`.
- [ ] **Write Phase 2 (lessons 9–15)** from `reference/source-material/prusaslicer-profile-tuning.md` §2.
      This is now the only gap in the course. When L15 lands, repoint L16's prev nav link from
      `../index.html#phase-2` to `0015-*.html`.
- [x] Phase 3 (lessons 16–18) written 2026-08-05, ahead of Phase 2 at the learner's request. It stands
      alone and gives Phase 2 somewhere to put its results.
- [x] `reference/calibration-card.html` carries Phase 1 targets, the calibration order, the arithmetic
      and the method rules. **Still to add when Phase 2 lands:** the per-material starting tables and the
      custom G-code tower blocks.
- [ ] Find a better source for drying temperatures/times (see RESOURCES.md § Gaps).

- [ ] Profile naming was corrected 2026-08-05: bundle presets renamed `@MK4` → `@MK4S`. The
      `compatible_printers_condition` was deliberately **left** as `/.*MK4.*/` — L16's task has the
      learner read the real `printer_model` off each machine before tightening it. Follow up on their
      answer; tighten the bundle only once the strings are confirmed.
