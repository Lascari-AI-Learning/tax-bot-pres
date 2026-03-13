---
allowed-tools: Read, Bash(mkdir:*), mcp__playwright__*
description: Capture screenshots for a specific slide template
arguments: --template=<template-name>
---

template_name = $ARGUMENTS

<purpose>
    - Capture progressive screenshots for a single slide template
    - Document all click states showing content reveal progression
    - Enable visual understanding of template layout and storytelling flow
</purpose>

<key_knowledge>
    - templates.json structure for looking up template metadata
    - Slidev URL structure with click state query parameters
    - Playwright MCP screenshot capture tools
    - Template folder structure: slide-templates/{name}/screenshots/
</key_knowledge>

<goal>
    - Capture screenshots for all click states of the specified template
    - Save screenshots to the template's screenshots/ folder
    - Report completion with list of captured files
</goal>

<background>
    - Screenshots help agents understand template visual layouts
    - Progressive captures show how content reveals through v-click animations
    - Used after creating new templates or updating existing ones
    - Screenshots are captured from localhost dev server
</background>

<workflow>
    <overview>
        1. Find template in templates.json and extract metadata
        2. Calculate slide URL from order field
        3. Capture screenshot for each click state (0 to clicks)
        4. Save files and report completion
    </overview>

    <inputs>
        <input name="template_name" type="string" required="true">
            The kebab-case template identifier (e.g., "title", "column-cards")
            Provided via --template argument or ask user if not provided
        </input>
    </inputs>

    <steps>
        <step name="find_template">
            <description>
                - Read templates.json
                - Locate entry where template field matches the argument
                - Extract order, clicks, and template fields
            </description>
            <data_structure>
                {
                  "slides": [
                    { "order": "00", "template": "title", "source": "slide.md", "clicks": 0 },
                    { "order": "01", "template": "column-cards", "source": "example.md", "clicks": 3 },
                    ...
                  ]
                }
            </data_structure>
            <fields_to_extract>
                - order: Slide position (e.g., "00", "01", "04")
                - clicks: Number of click states to capture (0 = initial state only)
                - template: Template name for folder path
            </fields_to_extract>
            <error_handling>
                If no matching template found:
                - Report error to user
                - List all available template names from templates.json
            </error_handling>
        </step>

        <step name="calculate_url">
            <description>
                - Calculate slide URL from the order field
                - Determine all click state URLs to capture
            </description>
            <base_url>
                http://localhost:3030/ (dev server - must be running via npm run dev)
            </base_url>
            <formula>
                slide_number = parseInt(order) + 1
            </formula>
            <examples>
                - order "00" → slide_number 1 → URL: /1
                - order "04" → slide_number 5 → URL: /5
                - order "99" → slide_number 100 → URL: /100
            </examples>
            <click_state_urls>
                - Initial state (n=0): /{slide_number} (no query param)
                - Click state n > 0: /{slide_number}?clicks={n}
            </click_state_urls>
            <url_examples>
                title (order="00", clicks=0):
                  - Only URL: http://localhost:3030/1

                column-cards (order="01", clicks=3):
                  - click-0: http://localhost:3030/2
                  - click-1: http://localhost:3030/2?clicks=1
                  - click-2: http://localhost:3030/2?clicks=2
                  - click-3: http://localhost:3030/2?clicks=3
            </url_examples>
        </step>

        <step name="ensure_directory">
            <description>
                - Create screenshots/ subdirectory if it doesn't exist
            </description>
            <command>
                mkdir -p slide-templates/{template}/screenshots/
            </command>
            <directory_structure>
                slide-templates/{template}/
                ├── description.md
                ├── example.md
                ├── slide.md
                └── screenshots/
                    ├── click-0.png   # Initial state
                    ├── click-1.png   # After first click (if clicks > 0)
                    └── ...           # Up to click-{clicks}.png
            </directory_structure>
        </step>

        <step name="capture_screenshots">
            <description>
                - Loop through each click state from 0 to clicks (inclusive)
                - Navigate, wait, capture, and move for each state
            </description>
            <loop>
                For n from 0 to clicks (inclusive):

                1. Build URL:
                   if n == 0: url = BASE_URL + slide_number
                   else: url = BASE_URL + slide_number + "?clicks=" + n

                2. Navigate:
                   mcp__playwright__browser_navigate(url: full_url)

                3. Wait for render:
                   mcp__playwright__browser_wait_for(time: 1)

                4. Capture screenshot:
                   mcp__playwright__browser_take_screenshot(
                       filename: "slide-templates/{template}/screenshots/click-{n}.png"
                   )

                5. Move file from Playwright prefix:
                   mv .playwright-mcp/slide-templates/{template}/screenshots/click-{n}.png \
                      slide-templates/{template}/screenshots/click-{n}.png
            </loop>
            <constraints>
                - Playwright MCP saves to .playwright-mcp/ prefix - must move after capture
                - Wait 1 second between navigate and capture for render completion
            </constraints>
        </step>

        <step name="report_completion">
            <description>
                - Summarize results after all screenshots captured
                - List all files created
                - Report any errors encountered
            </description>
        </step>
    </steps>

    <global_constraints>
        - Dev server must be running (npm run dev) before capture
        - Use localhost for new/updated templates (live URL only current after deploy)
        - Move files from .playwright-mcp/ immediately after each capture
    </global_constraints>

    <output_format>
        ## Sync Complete

        Template: {template}
        Screenshots captured: {clicks + 1} files
        Location: slide-templates/{template}/screenshots/

        Files created:
        - click-0.png
        - click-1.png (if applicable)
        - click-2.png (if applicable)
        - ...

        ### Errors (if any):
        - Failed at click-{n}: {error message}
    </output_format>
</workflow>

<important_rules>
    1. Always verify template exists in templates.json before attempting capture
    2. Ensure dev server is running - screenshots require live rendering
    3. Move files from .playwright-mcp/ to final location after each capture
    4. Report errors with specific click state that failed
</important_rules>
