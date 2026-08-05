#!/usr/bin/env python3
"""Generate the course's calibration STLs into downloads/.

Every model is purpose-built to the spec its lesson teaches, so there is no
licence baggage and no mismatch between the lesson text and the geometry:

  temp-tower.stl          L10 · 7 bands x 10 mm, each with a smooth wall, an
                          18 mm bridge and a 45deg overhang; detached stringing
                          pillar 40 mm away.
  em-single-wall-box.stl  L11 · 30 x 30 x 12 mm box. Slice with perimeters 1,
                          infill 0, top 0, bottom 1, vase off.
  pa-corner-tower.stl     L12 · thin-walled square tube, sharp 90deg corners,
                          32 mm tall (8 bands x 20 layers at 0.2 mm); companion
                          pillar forces a travel every layer.
  retraction-spikes.stl   L13 · five tapered spikes on a shared rail, 40 mm
                          apart.
  overhang-bridge-test.stl L14/L18 · fins at 30/40/50/60deg from vertical plus
                          a 25 mm bridge.
  mvs-vase-cylinder.stl   L15 · 40 mm dia x 40 mm cylinder for Spiral vase mode.
  calibration-cube-20.stl L18 · plain 20 mm cube (no face lettering, so the
                          caliper faces stay clean — mark X on the plate).

Run:  python3 tools/generate-stls.py
"""
import math
import struct
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "downloads"


# ---------------------------------------------------------------- mesh basics
def _normal(a, b, c):
    ux, uy, uz = (b[i] - a[i] for i in range(3))
    vx, vy, vz = (c[i] - a[i] for i in range(3))
    n = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
    ln = math.sqrt(sum(x * x for x in n)) or 1.0
    return tuple(x / ln for x in n)


def quad(tris, p0, p1, p2, p3):
    tris.append((p0, p1, p2))
    tris.append((p0, p2, p3))


def box(tris, mn, mx):
    x0, y0, z0 = mn
    x1, y1, z1 = mx
    b = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)]
    t = [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    hexahedron(tris, b, t)


def hexahedron(tris, b, t):
    """b and t are 4-point bottom/top loops, both CCW seen from above."""
    quad(tris, b[3], b[2], b[1], b[0])          # bottom, facing down
    quad(tris, t[0], t[1], t[2], t[3])          # top, facing up
    for i in range(4):
        j = (i + 1) % 4
        quad(tris, b[i], b[j], t[j], t[i])      # sides, facing out


def prism_x(tris, x0, x1, sect):
    """Triangular prism along X. sect = three (y, z) points, CCW seen from -X."""
    a = [(x0, y, z) for y, z in sect]
    b = [(x1, y, z) for y, z in sect]
    tris.append((a[0], a[1], a[2]))             # cap at x0, faces -X
    tris.append((b[2], b[1], b[0]))             # cap at x1, faces +X
    for i in range(3):
        j = (i + 1) % 3
        quad(tris, a[j], a[i], b[i], b[j])


def cylinder(tris, cx, cy, r, z0, z1, seg=96):
    ring0, ring1 = [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        ring0.append((cx + r * math.cos(a), cy + r * math.sin(a), z0))
        ring1.append((cx + r * math.cos(a), cy + r * math.sin(a), z1))
    c0, c1 = (cx, cy, z0), (cx, cy, z1)
    for i in range(seg):
        j = (i + 1) % seg
        tris.append((c0, ring0[j], ring0[i]))
        tris.append((c1, ring1[i], ring1[j]))
        quad(tris, ring0[i], ring0[j], ring1[j], ring1[i])


def write_stl(name, tris):
    OUT.mkdir(exist_ok=True)
    path = OUT / name
    with open(path, "wb") as f:
        f.write(name.encode().ljust(80, b"\0")[:80])
        f.write(struct.pack("<I", len(tris)))
        for a, b, c in tris:
            f.write(struct.pack("<3f", *_normal(a, b, c)))
            for p in (a, b, c):
                f.write(struct.pack("<3f", *p))
            f.write(struct.pack("<H", 0))
    print(f"  {name:26s} {len(tris):5d} tris  {path.stat().st_size:7d} B")


# ------------------------------------------------------------------- models
def temp_tower():
    """Seven 10 mm bands. Per band: 2 mm floor slab, two 6 mm columns leaving an
    18 mm window, a 2 mm roof that bridges it, and a 45deg overhang wedge on the
    front face. Detached 8 x 8 pillar 40 mm to the right for stringing."""
    t = []
    for band in range(7):
        z = band * 10.0
        box(t, (0, 0, z), (30, 8, z + 2))                    # floor
        box(t, (0, 0, z + 2), (6, 8, z + 8))                 # left column
        box(t, (24, 0, z + 2), (30, 8, z + 8))               # right column
        box(t, (0, 0, z + 8), (30, 8, z + 10))               # roof -> 18 mm bridge
        # 45deg overhang: wall flush at z+4, 4 mm proud at z+8
        prism_x(t, 0, 30, [(0, z + 4), (0, z + 8), (-4, z + 8)])
    box(t, (70, 0, 0), (78, 8, 70))                          # stringing pillar
    write_stl("temp-tower.stl", t)


def em_single_wall_box():
    t = []
    box(t, (0, 0, 0), (30, 30, 12))
    write_stl("em-single-wall-box.stl", t)


def pa_corner_tower():
    """30 x 30 square tube, 2 mm walls, 32 mm tall; 10 x 10 pillar 40 mm away so
    every layer has a travel move to judge extrusion restart on."""
    t = []
    box(t, (0, 0, 0), (30, 2, 32))                           # front wall
    box(t, (0, 28, 0), (30, 30, 32))                         # back wall
    box(t, (0, 2, 0), (2, 28, 32))                           # left wall
    box(t, (28, 2, 0), (30, 28, 32))                         # right wall
    box(t, (70, 10, 0), (80, 20, 32))                        # travel pillar
    write_stl("pa-corner-tower.stl", t)


def retraction_spikes():
    """Five square frustum spikes, 8 x 8 base to 2 x 2 tip, 40 mm tall, centres
    40 mm apart on a shared 1.5 mm rail for bed adhesion."""
    t = []
    box(t, (0, 0, 0), (180, 12, 1.5))
    for cx in (10, 50, 90, 130, 170):
        b = [(cx - 4, 2, 1.5), (cx + 4, 2, 1.5), (cx + 4, 10, 1.5), (cx - 4, 10, 1.5)]
        tp = [(cx - 1, 5, 41.5), (cx + 1, 5, 41.5), (cx + 1, 7, 41.5), (cx - 1, 7, 41.5)]
        hexahedron(t, b, tp)
    write_stl("retraction-spikes.stl", t)


def overhang_bridge_test():
    """Four 15 mm-tall fins leaning 30/40/50/60deg from vertical, plus a 25 mm
    bridge between two towers."""
    t = []
    box(t, (0, 0, 0), (55, 15, 3))                           # fin base slab
    for i, ang in enumerate((30, 40, 50, 60)):
        o = 15.0 * math.tan(math.radians(ang))
        x = i * 15.0
        b = [(x, 5, 3), (x + 10, 5, 3), (x + 10, 15, 3), (x, 15, 3)]
        tp = [(x, 5 - o, 18), (x + 10, 5 - o, 18), (x + 10, 15 - o, 18), (x, 15 - o, 18)]
        hexahedron(t, b, tp)
    box(t, (0, 25, 0), (8, 40, 15))                          # bridge tower 1
    box(t, (33, 25, 0), (41, 40, 15))                        # bridge tower 2
    box(t, (0, 25, 15), (41, 40, 18))                        # 25 mm bridge roof
    write_stl("overhang-bridge-test.stl", t)


def mvs_vase_cylinder():
    t = []
    cylinder(t, 0, 0, 20, 0, 40)
    write_stl("mvs-vase-cylinder.stl", t)


def calibration_cube():
    t = []
    box(t, (0, 0, 0), (20, 20, 20))
    write_stl("calibration-cube-20.stl", t)


if __name__ == "__main__":
    print(f"Writing to {OUT}")
    temp_tower()
    em_single_wall_box()
    pa_corner_tower()
    retraction_spikes()
    overhang_bridge_test()
    mvs_vase_cylinder()
    calibration_cube()
