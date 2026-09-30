# Vendored: Academic Research Skills (ARS)

Source: https://github.com/Imbad0202/academic-research-skills
Commit: bff05339b0635897cbc14f63ab6afb9e42413a01 (v3.22.1, 2026-09-24)
License: CC BY-NC 4.0 (see LICENSE). Based on Academic Research Skills by Cheng-I Wu.

The four skills are exposed to Claude Code via symlinks in `.claude/skills/`:
`deep-research`, `academic-paper`, `academic-paper-reviewer`, `academic-pipeline`.

Paths such as `shared/...` inside the skills resolve relative to this directory.

Not vendored (to keep the repo small): `scripts/` (lint/validation helpers),
`commands/` (`/ars-*` slash commands), `hooks/`, `docs/`, `evals/`, `examples/`.
For the full plugin, install locally:
`/plugin marketplace add Imbad0202/academic-research-skills` then
`/plugin install academic-research-skills`.
