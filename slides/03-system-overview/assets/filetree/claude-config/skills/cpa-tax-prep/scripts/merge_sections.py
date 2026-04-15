"""Merge individual section JSONs into one tax_data.json."""

import json
from pathlib import Path


def merge(sections_dir: Path, output: Path, year: int):
    sections = {}
    for f in sorted(sections_dir.glob("*.json")):
        sections[f.stem] = json.loads(f.read_text())

    result = {"meta": {"year": year}, "sections": sections}
    output.write_text(json.dumps(result, indent=2))
