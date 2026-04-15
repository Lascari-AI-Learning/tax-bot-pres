"""Build 8-tab xlsx from tax_data.json."""

import json

from openpyxl import Workbook

TABS = [
    "Summary",
    "Income",
    "Business Expenses",
    "Personal Deductions",
    "Home Office",
    "Estimated Taxes",
    "Health Insurance",
    "Retirement",
]


def build(tax_data_path, output_path):
    data = json.loads(tax_data_path.read_text())
    wb = Workbook()
    for tab in TABS:
        ws = wb.create_sheet(tab)
        # ... populate from data["sections"]
    wb.save(output_path)
