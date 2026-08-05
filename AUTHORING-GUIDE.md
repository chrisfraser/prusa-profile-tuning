# Lesson Authoring Guide — prusa-profile-tuning

Every lesson is a self-contained HTML file in `lessons/`, named `NNNN-slug.html`. All lessons share the same
skeleton so the course reads as one studio. **When writing a new lesson, copy the structure of
`lessons/0001-the-machine-in-four-parts.html` exactly** and change only the content.

The general contract lives in `~/.agents/skills/course/AUTHORING-GUIDE.md`. This file records what is
specific to **this** course.

## Hard rules

- Use **only** CSS classes that exist in `assets/styles.css`. No invented classes, no `<style>` blocks.
- Link `../assets/styles.css` and `<script defer src="../assets/widgets.js"></script>` in `<head>`.
- The topbar between `<!-- NAV:START -->` and `<!-- NAV:END -->` is identical on every page. Change it with
  `~/.agents/skills/course/scripts/set-nav.py`, never by hand.
- **Ground the content** — every claim traces to `RESOURCES.md`. Don't invent facts.

### The per-machine rule (the one that matters most here)

This fleet is **two firmware families**: MK3S is Marlin (Linear Advance, `M900 K`); MK4S and Core One
are Buddy (Pressure Advance, `M572 S`). Menu paths, target numbers and G-code all differ.

Whenever a lesson contains a **menu path, a target number, or a G-code command**, it must be split into
three `details.panel` blocks, always in this order and always all three present — even when two are
identical, because the reader opens exactly one:

```html
<details class="panel">
  <summary>MK3S · …</summary>
  <div class="panel-body">…</div>
</details>
<details class="panel">
  <summary>MK4S · …</summary>
  <div class="panel-body">…</div>
</details>
<details class="panel">
  <summary>Core One · …</summary>
  <div class="panel-body">…</div>
</details>
```

Precede the set with a one-line instruction: *"Open your machine."* Never merge two machines into one
panel to save space.

### Units, notation, code

- Temperatures in °C. Flow in mm³/s. Speed in mm/s. Frequency in Hz. Lengths in mm.
- G-code goes in `<pre><code>` with `.k` on the command (`M572`), `.n` on numbers, `.c` on comments.
- LCD menu paths are written inline as `<code>LCD → Calibration → Belt test</code>` with `→` separators.
- PrusaSlicer paths use the real pane names: `<code>Filament Settings → Advanced → Max volumetric speed</code>`.
- When a number is **community-derived rather than KB-documented**, say so in the lesson — use a
  `.callout.warning` or an explicit "not documented by Prusa" clause. `RESOURCES.md § Gaps` lists these.

### Skip-ahead links

Phase 0 is explicitly skippable. Every Phase 0 lesson carries, immediately after `div.lesson-meta`, a
`.callout.note` labelled **"Already know this?"** with a one-line summary of what the lesson covers and a
link straight to `0005-selftest-and-health-check.html`. Phase 1 onward does not get one.

## Required skeleton (in order)

topbar → `p.kicker` / `h1.lesson-title` / `p.lesson-sub` / `div.lesson-meta` → (Phase 0 only:
`div.callout.note` skip-ahead) → `div.callout.mission` ("Why this lesson") → numbered `h2` sections →
one interactive widget → `.quiz` ×3 → `.task` → `.recap` → `.sourcebox` → `.ask-teacher` → `.crosslinks` →
`h2#refs` References → `nav.lesson-nav` → `p.pagefoot`.

**Every page links `assets/widgets.js` as well as `assets/styles.css`** — including `index.html` and the
reference pages. The progress tracking below is injected by that script, so a page that omits it silently
drops out of the course's progress model.

## Interactive widgets

`assets/widgets.js` auto-wires four authored widgets — `.quiz`, `.checklist-widget`, `.faultfinder`, and
`.calc` — plus a copy button (`[data-copy]`). Use only these; each is documented with a markup example in
the source. Two behaviours are **injected**, so no lesson carries their markup:

- **Progress.** Every lesson page grows a "mark complete" control above `nav.lesson-nav`; `index.html`
  grows a resume bar, a per-phase progress bar and a tick on each finished card. State is per browser, in
  `localStorage`, and every access is wrapped — a browser that refuses storage still works, and says so.
- **Checklist persistence.** Ticks in a `.checklist-widget` survive a reload, keyed by page and widget
  index, so a Phase 1 sign-off can be worked through over an evening at the printer.

### `.calc` — the live calculator

The rule that "never present a number without the measurement that produces it" has a corollary: where a
lesson's number comes out of *arithmetic*, the reader should be able to run that arithmetic on their own
measurements, in the lesson. `.calc` is declarative — inputs carry `data-var`, outputs carry a `data-out`
expression over those names, `data-when` shows a block conditionally, `data-tpl` fills a copyable template.
Repeat a `data-var` name across several inputs and it arrives as an array (`avg()`, `spread()`, `count()`).

Four lessons carry one, and each reproduces that lesson's own worked examples exactly — **that is the
acceptance test.** L3's flow calculator returns 4.05 and 18.00 mm³/s for its drills and 213 mm/s for
drill 3; L10's returns 0.953 for the worked example; L13's returns 60 % / 51 % / 40 % for its three drills.
If you change a formula, re-check it against the prose before committing.

Two constraints learned the hard way:

- **Don't reuse a class name the stylesheet already owns.** `.calc-out.hero` inherited the index page's
  `.hero` padding and blew the card out to 188 px tall. The card class is `.calc-out.primary`.
- **Don't invent a numeric threshold to drive a flag.** An early L18 flag tried to detect a Buddy `S` value
  pasted into an MK3S row by testing `< 0.02`; the K and S ranges genuinely overlap (L11: MK3S PETG K 0.08,
  MK4S PLA PA 0.03–0.04), so the test was ungrounded. It was replaced by labelling the row's command letter
  from the selected printer — structural, and true.

## Pedagogy for this course

The learner **has already written a tuning guide on this topic**. That is reading knowledge, not skill —
high fluency strength, unproven storage strength. So:

- **Never present a number without the measurement that produces it.** The failure mode this course exists
  to fix is a profile full of plausible values nobody measured.
- **Every lesson's `.task` produces a written number or observation**, logged against a specific printer
  and spool. Coverage is not learning; the log is the evidence.
- **Teach the dependency, not just the step.** Each Phase 2 lesson must say what it invalidates if re-run.
- Phase 0 is genuinely from-scratch, but written for an adult who owns three printers — explain the
  physics, don't patronise about what a nozzle is.

## Valid glossary anchors

Keep in sync with `reference/glossary.html`. Lessons link only to anchors listed here.

`#bedslinger` `#corexy` `#toolhead` `#hotend` `#heatbreak` `#extruder` `#build-plate`
`#extrusion-width` `#layer-height` `#extrusion-equation` `#volumetric-flow-rate` `#max-volumetric-speed`
`#extrusion-multiplier` `#retraction`
`#linear-advance` `#pressure-advance` `#input-shaper` `#ghosting`
`#selftest` `#belt-tension` `#pinda` `#loadcell` `#live-adjust-z` `#mesh-bed-levelling` `#pid-tuning` `#skew`
`#dynamic-overhang-speed` `#autospeed`
`#glass-transition` `#hygroscopic` `#drying`
`#system-profile` `#compatible-printers-condition` `#after-layer-change` `#filament-overrides`
`#config-bundle` `#elephant-foot` `#validation-set`
`#calibration-order` `#one-variable-rule` `#temperature-tower` `#snap-test` `#tuning-log`

## Phase / lesson map (for nav + kicker)

**Phase 0 · Fundamentals** — `#phase-0`
- L1 `0001-the-machine-in-four-parts.html`
- L2 `0002-filament-is-a-material.html`
- L3 `0003-what-the-slicer-decides.html`
- L4 `0004-the-calibration-mindset.html`

**Phase 1 · The machine** — `#phase-1`
- L5 `0005-selftest-and-health-check.html`
- L6 `0006-belt-tension-and-squareness.html`
- L7 `0007-first-layer-and-z-offset.html`
- L8 `0008-thermal-and-motion-trust.html`

**Phase 2 · The filament** — `#phase-2`
- L9 `0009-the-temperature-tower.html`
- L10 `0010-extrusion-multiplier.html`
- L11 `0011-pressure-and-linear-advance.html`
- L12 `0012-retraction.html`
- L13 `0013-cooling.html`
- L14 `0014-max-volumetric-speed.html`
- L15 `0015-speeds-and-accelerations.html`

**Phase 3 · Ship it** — `#phase-3`
- L16 `0016-profile-structure-and-naming.html`
- L17 `0017-the-validation-set.html`
- L18 `0018-the-tuning-log.html`

Phase 3 was written **before** Phase 2, at the learner's request. Phase 2 landed 2026-08-05 and L16's
`nav.lesson-nav` prev has been repointed from `../index.html#phase-2` to `0015-*.html`. The course is now
a continuous 18-lesson chain with no gaps.

Source material for Phases 2–3: `reference/source-material/prusaslicer-profile-tuning.md`. **It is the
input, not the authority.** Where Phase 2 lessons diverge from it, the divergence is stated in the lesson
and the guide is left as originally written — see L12 §4 (flexibles retraction, where Prusa and the guide
genuinely disagree) and L14 §4 (the KB's hotend table predating the MK4S and Core One).
