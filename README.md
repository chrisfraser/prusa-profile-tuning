# Dialled In — Prusa machine & profile tuning

Take a Prusa MK3S, MK4S, or Core One from out-of-the-box to a print profile you actually trust.

**▶ Live course: https://chrisfraser.github.io/prusa-profile-tuning/**

Machine first, then filament, then profile — in that order. Every number in this course is one you
*measure*, on your machine, with your spool. Menu paths and target values are split per printer
throughout, because `M900 K` (MK3S, Marlin) and `M572 S` (MK4S / Core One, Buddy) are not the same thing.

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
| **2 · The filament** | temperature · flow · advance · retraction · cooling · MVS · speeds | ✅ written |
| **3 · Ship it** | profile structure · validation set · tuning log | ✅ written |

All 18 lessons are written. Phase 3 was written before Phase 2 and the two now join up.

## What's interactive

Every lesson has three quizzes and one hands-on widget. Four of them are **calculators you feed your own
measurements to** — the extrusion equation (L3), the twelve-caliper extrusion multiplier with its 0.9–1.1
sanity check (L10), the cooling pane's threshold-and-interpolation logic (L13), and a tuning-log row
builder that makes you mark every value measured or inherited (L18). Each reproduces its own lesson's
worked examples exactly.

The course also **remembers where you are**: mark a lesson complete at the bottom of the page and the home
page shows a resume link and per-phase progress; checklist ticks survive a reload, so a Phase 1 sign-off
can be worked through over an evening at the printer. All of it is `localStorage` in your own browser —
nothing is uploaded, and nothing needs an account.

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
