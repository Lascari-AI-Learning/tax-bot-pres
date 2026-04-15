# Package

Spawns parallel tax-package subagents — one per
finalized section. Outputs section JSONs, then runs
deterministic pipeline:
  merge_sections.py → build_xlsx.py → validate_xlsx.py
