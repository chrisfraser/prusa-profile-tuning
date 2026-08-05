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
- [x] **Phase 2 (lessons 9–15) written 2026-08-05.** All 18 lessons now exist; the course has no gaps.
      L16's prev nav repointed to `0015-*.html`. Written from `prusaslicer-profile-tuning.md` §2 and §4,
      but every claim re-grounded against a live KB fetch — which turned up several places where the
      guide and the KB diverge (recorded in `RESOURCES.md § Gaps` and stated in-lesson).
- [x] Phase 3 (lessons 16–18) written 2026-08-05, ahead of Phase 2 at the learner's request. It stands
      alone and gives Phase 2 somewhere to put its results.
- [x] `reference/calibration-card.html` is complete: calibration order, Phase 1 targets, the arithmetic,
      the three Phase 2 material tables, the three test G-code blocks, a Phase 2 diagnostic shorthand
      table, method rules, and the shipping section.
- [ ] **Glossary correction made 2026-08-05, worth remembering.** The old Pressure Advance entry said
      "the scale is not the same as LA's". The KB says Buddy converts `M900` to PA **1:1**, so that was
      wrong as stated. Rewritten: the *command* converts, the *correct value* doesn't transfer, because it
      characterises the machine's extruder and melt zone. Evidence: Prusa's own MK3S defaults (PLA 0.05,
      PETG 0.08) against the MK4S family's ~0.03–0.04 for PLA. This makes the danger sharper — a copied
      value is accepted silently rather than rejected.
- [ ] Find a better source for drying temperatures/times (see RESOURCES.md § Gaps).
- [ ] **Open question raised by L11:** the Pressure Advance KB article does not list the Core One among
      supported printers. Almost certainly stale documentation, but the lesson has the learner verify by
      finding `M572` in sliced Core One G-code. Follow up on their answer.
- [ ] **Open question raised by L14:** what is the Core One's *measured* flow ceiling with the door closed
      versus vented? Warmer intake air helps melting; a warmer heatsink hurts. No public source. L14's task
      asks for both runs — this is genuinely new data for the log.
- [ ] Next natural additions, if the course ever grows: a Phase 4 on multi-material / MMU, and a lesson on
      dimensional accuracy and shrinkage compensation (currently only touched at L17's elephant-foot step).

- [ ] Profile naming was corrected 2026-08-05: bundle presets renamed `@MK4` → `@MK4S`. The
      `compatible_printers_condition` was deliberately **left** as `/.*MK4.*/` — L16's task has the
      learner read the real `printer_model` off each machine before tightening it. Follow up on their
      answer; tighten the bundle only once the strings are confirmed.
