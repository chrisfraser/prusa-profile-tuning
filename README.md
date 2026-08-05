# Dialled In — Prusa machine & profile tuning

Take a Prusa MK3S, MK4, or Core One from out-of-the-box to a print profile you actually trust.

**▶ Live course: https://chrisfraser.github.io/prusa-profile-tuning/**

Machine first, then filament, then profile — in that order. Every number in this course is one you
*measure*, on your machine, with your spool. Menu paths and target values are split per printer
throughout, because `M900 K` (MK3S, Marlin) and `M572 S` (MK4 / Core One, Buddy) are not the same thing.

## Start here

1. Open **`index.html`** in a browser — or the live URL above.
2. Work through the lessons top to bottom. Phase 0 is skippable if the fundamentals are already yours;
   every Phase 0 lesson carries a link straight to Phase 1.
3. Each lesson ends with a **task**. Do it, then **paste your answer back to your tutor** for line-by-line
   feedback: run Claude Code in this folder and say *"I'm on Lesson 3, here's my task."*
4. Stuck or curious? Ask. The tutor is the point — confused beats stuck.

## Course arc

| Phase | Lessons | Status |
|---|---|---|
| **0 · Fundamentals** | the machine · filament as a material · what the slicer decides · the calibration mindset | ✅ written |
| **1 · The machine** | selftest · belt tension · first layer · thermal and motion trust | ✅ written |
| **2 · The filament** | temperature · flow · advance · retraction · cooling · MVS · speeds | planned |
| **3 · Ship it** | profile structure · validation set · tuning log | planned |

## What's here

- `index.html` — the course home (phases + lessons).
- `lessons/` — the lessons, in order.
- `reference/calibration-card.html` — **The Calibration Card**: every target number on one printable page.
- `reference/glossary.html` — the course vocabulary (mirrors `GLOSSARY.md`).
- `reference/source-material/` — the original research this course was built from: the master tuning
  guide, the eSun starter-profile notes, and the importable PrusaSlicer `.ini` bundle.
- `MISSION.md` — why this course exists and where it's going.
- `RESOURCES.md` — the trusted sources and communities behind it, with an explicit `Gaps` section.
- `NOTES.md` — learner profile, constraints, build conventions, next sessions.
- `AUTHORING-GUIDE.md` — the contract every lesson follows, including the per-machine panel rule.
- `learning-records/` — what has actually been learned, as evidence rather than coverage.
- `CONTEXT.md` — the original project brief.

## How it's built

Plain HTML/CSS/JS, no build step, works offline. Shared design system in `assets/` (`styles.css` +
`widgets.js`); every page links both and inherits the same top-level navigation.

*Built with [Claude Code](https://claude.com/claude-code).*
