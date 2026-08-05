# The existing tuning guide is reading knowledge, not measured skill

**Status:** active

The learner arrived with a complete, self-fact-checked PrusaSlicer tuning guide covering calibration order,
per-machine notes, starting tables for PLA/PETG/TPU across MK3S/MK4/Core One, and an importable `.ini`
bundle for eSUN PETG and eSun eTPU-95A. They can navigate PrusaSlicer, understand profile inheritance and
`compatible_printers_condition`, and already use the Phase 2 vocabulary correctly in writing.

**But no calibration run has been performed.** Every number in that guide is a datasheet figure or a
community starting point, and the learner said so themselves when asking for the course. They also asked
explicitly to start from total-beginner fundamentals rather than from the profile.

**Why this changes what to teach:** high fluency strength, unproven storage strength. Coverage of the
material is already complete — repeating it teaches nothing. What is missing is *measurement*, so the
course's value is entirely in the tasks, not the exposition. Two consequences:

1. Phase 0 explains the **physics behind** the vocabulary they already have, rather than introducing the
   vocabulary. Skip-ahead links are provided on every Phase 0 lesson so they aren't held up.
2. Phase 1 (physical machine calibration) is **entirely new material** — the existing guide's §0 lists
   prerequisites in seven lines and assumes they're done. That is the genuine gap, and it is where the
   course's four newest lessons went.

Every lesson task must therefore produce a **written number logged against a specific printer and spool**.
An answer that restates the guide is not evidence of learning; a measurement is.

Related: [[0002-calibration-order-understood]] — write once they can reproduce the dependency chain with
correct reasons, not just correct sequence.
