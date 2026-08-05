# Dialled In Glossary

Canonical text. Mirror into `reference/glossary.html` after every edit, with matching anchor ids.
A term appears here only once it has been taught and used correctly.

## A · The machine

**Bedslinger**:
A printer whose bed moves on the Y axis while the toolhead moves on X and Z. The MK3S and MK4S are
bedslingers. The moving mass grows with the part, which is why acceleration and external-perimeter
speed are the first things to give.
_Avoid_: "i3-style" (describes the frame, not the constraint that matters)

**CoreXY**:
A motion system where two fixed motors drive both X and Y through a crossed belt path, so only the
lightweight toolhead accelerates. The Core One is CoreXY. Higher usable acceleration, but gantry
squareness now depends on the two belts being tensioned equally.

**Toolhead**:
The moving assembly that carries the [hotend](#hotend) and, on direct-drive printers, the
[extruder](#extruder). Everything about print quality is decided by where the toolhead is and how
much plastic is coming out of it at that instant.

**Hotend**:
The heated end of the machine: heater block, thermistor, nozzle, and above them a heatbreak and
heatsink. Its job is to hold a controlled melt zone. Its capacity — how fast it can melt plastic —
sets the machine's real speed ceiling, expressed as [max volumetric speed](#max-volumetric-speed).

**Heatbreak**:
The thin-walled section between heatsink and heater block that keeps the melt zone short and
well-defined. When it fails to do that, softened filament creeps upward and jams — *heat creep*.

**Extruder**:
The geared motor assembly that pushes filament into the hotend. On all three printers in this fleet it
is *direct drive* — mounted on the toolhead, a few centimetres of filament path to the melt zone.
Prusa's MK4-family extruder is the **Nextruder**; the MK3S uses a Bondtech-style dual-drive extruder.
_Avoid_: using "extruder" to mean the whole toolhead

**Build plate**:
The heated bed plus its removable spring-steel sheet. The sheet's texture (smooth PEI, satin,
textured) changes both adhesion and the first-layer offset you need.

## B · What comes out of the nozzle

**Extrusion width**:
How wide a single deposited line is, set by the slicer — not simply the nozzle diameter. Typically
~0.45 mm for a 0.4 mm nozzle. It is one of the three terms in the [extrusion equation](#extrusion-equation).

**Layer height**:
The vertical distance the Z axis rises between layers, and therefore the height of every extruded
line. The second term in the [extrusion equation](#extrusion-equation).

**Extrusion equation**:
`volumetric flow (mm³/s) = layer height × extrusion width × print speed`. The one piece of arithmetic
the whole course rests on: it converts a speed you set into a demand on the [hotend](#hotend), and it
is why raising speed without checking [max volumetric speed](#max-volumetric-speed) silently
under-extrudes.

**Volumetric flow rate**:
Plastic delivered per second, in mm³/s. The honest unit for "how fast is this printing", because it is
independent of layer height and width — unlike mm/s.

**Max volumetric speed (MVS)**:
A per-filament ceiling in mm³/s that clamps every speed in the profile. It represents what the
hotend can actually melt. Set correctly it is a safety net; left at a default it is the reason fast
prints come out matte and weak.
_Avoid_: "flow rate" (ambiguous — that also names [extrusion multiplier](#extrusion-multiplier))

**Extrusion multiplier (EM)**:
A per-filament scalar on how much filament is pushed for a given commanded volume, where 1.0 = 100 %.
Corrects for real filament diameter and material behaviour. Total flow is firmware `M221` × slicer EM,
and the two are independent — changing one does not update the other.
_Avoid_: "flow", "flow rate" (used for both this and MVS in the wild)

**Retraction**:
Pulling filament back a short distance before a travel move, so the nozzle stops oozing. A printer
setting whose correct value is material-dependent, so it is overridden per filament.

## C · Compensating for physics

**Linear Advance (LA)**:
The Marlin feature that varies extruder speed ahead of acceleration changes, so pressure in the melt
zone stays matched to the commanded flow. On the MK3S it is set with `M900 K<value>`; typical values
for a 0.4 mm nozzle are small, around 0.02–0.08.

**Pressure Advance (PA)**:
The Buddy-firmware equivalent of [Linear Advance](#linear-advance-la), used on the MK4 family and Core
One from firmware 5.0.0. Set with `M572 S<value>`. **The scale is not the same as LA's** — an MK3S
`M900 K` value and an MK4S or Core One `M572 S` value are not interchangeable, and copying one to the
other is the most expensive mistake available in this course.

**Input Shaper (IS)**:
A Buddy-firmware feature that cancels the frame resonances which cause [ghosting](#ghosting), letting
the printer run much higher acceleration for the same surface quality. Present on Core One, MK4/S and
MK3.9/3.5. It compensates for resonance; it does not fix a loose belt, so belts come first.

**Ghosting**:
Faint repeated echoes of a feature on the surface downstream of it, caused by the frame or gantry
ringing after a direction change. Symptom of resonance, loose belts, or too much acceleration.
_Avoid_: "ringing" (same thing; this course says ghosting)

## D · Getting the machine honest

**Selftest**:
The printer's own guided hardware check — motors, endstops, fans, heaters, and on the MK4 family the
[loadcell](#loadcell). It is the floor: nothing measured afterwards means anything if the selftest
fails.

**Belt tension**:
How tightly the X and Y belts are strung. Too loose gives [ghosting](#ghosting), layer shifts and
out-of-round circles; too tight loads the bearings and skews axis-length measurements. Measured as a
*belt-status number* on the MK3S (X ≈ 250, Y ≈ 275) and as a *frequency in Hz* on the Core One
(90–98 Hz, the two belts within 8 Hz of each other).

**PINDA**:
The inductive probe on the MK3S that finds the steel sheet. It senses metal, not the nozzle, so its
reading drifts with temperature and the nozzle-to-sheet distance must be set separately by
[Live Adjust Z](#live-adjust-z).

**Loadcell**:
The force sensor in the MK4-family heatsink that detects the nozzle physically touching the sheet.
Because it senses the nozzle itself, first-layer height is measured automatically before every print
and no manual Live Adjust Z is needed.

**Live Adjust Z**:
The stored nozzle-to-sheet offset for the first layer, adjusted while the first layer prints. Typical
values run from −1.500 to −0.200; turning the knob counter-clockwise moves the nozzle *closer*. On
[loadcell](#loadcell) machines it exists only as a temporary nudge — the persistent value is the
printer's Z offset.

**Mesh bed levelling**:
Probing a grid of points across the sheet before a print and warping the first layer to match, so a
bed that isn't perfectly flat still gets an even first layer. It compensates for shape, not for
height — height is [Live Adjust Z](#live-adjust-z).

**PID tuning**:
Calibrating the control loop that holds a heater at target. Worth running when the nozzle temperature
wanders by roughly ±5 °C; a bigger swing than that is a hardware fault, not a tuning problem. The
Buddy-firmware equivalent on the MK4 family is **thermal model calibration**.

**Skew**:
The deviation of the machine's X and Y axes from a true right angle, measured by the MK3S's XYZ
calibration and corrected in firmware. Uncorrected skew turns squares into parallelograms no profile
setting can fix.

## E · Materials

**Glass transition temperature (Tg)**:
The temperature at which a solid polymer stops being rigid and starts to soften — well below its
melting point. Tg is why a PLA part left in a hot car deforms, and why the Core One's enclosure has to
be *vented* for PLA.

**Hygroscopic**:
Readily absorbing moisture from the air. PETG is hygroscopic and TPU badly so. Absorbed water flashes
to steam in the melt zone, producing popping, stringing and weak layers — and it invalidates every
temperature, flow and retraction measurement taken with that spool.

**Drying**:
Baking moisture out of filament before use. Not an optimisation in a humid climate — a prerequisite,
because a wet spool makes the whole calibration chain measure the water rather than the plastic.

## F · Profiles

**System profile**:
A filament, print or printer preset shipped by Prusa and bound to a printer family. It carries the
printer-specific conditional G-code and receives vendor updates. You start from one and **Save as** —
overwriting it loses both.

**Compatible printers condition**:
An expression on a preset (`Filament Settings → Dependencies`) that decides which printers the preset
appears for. If it evaluates false the preset is hidden entirely, with no message — which is what makes
it a guard rather than a warning. Written against `printer_model` and `nozzle_diameter`.
_Avoid_: "printer filter"

**Config bundle**:
A single `.ini` holding every custom print, filament and printer preset in the current PrusaSlicer
version. Exported via `File → Export → Export Config Bundle`. It is the only backup of your measured
values, and being a text file it is diffable in version control.

**Elephant foot compensation**:
A print setting that shrinks the first layer's perimeters to counter the bulge caused by squishing it
against the bed. Around 0.2 mm suits a 0.4 mm nozzle. A *top-level* setting — influenced by every other
calibration, so it is tuned last, at validation.

**Validation set**:
The three prints and five acceptance criteria that decide whether a profile is finished: a dimensional
test, a combined overhang/bridge/stringing test, and a real part of your own. Each failing criterion
names the [calibration order](#calibration-order) step to return to.

## G · Method

**Calibration order**:
The fixed dependency chain this course follows: **machine → temperature → extrusion multiplier →
pressure/linear advance → retraction → cooling → max volumetric speed → speeds and accelerations**.
Each step assumes everything before it is fixed, so changing an earlier one invalidates every later
measurement.

**One-variable rule**:
Change exactly one thing between two test prints. Two changes give you a result you cannot attribute,
which is worse than no result because it feels like data.

**Tuning log**:
The written record of what was measured, on which machine, with which spool, on what date. Without it
the fleet drifts and nobody can say which number came from a measurement and which from a guess.
