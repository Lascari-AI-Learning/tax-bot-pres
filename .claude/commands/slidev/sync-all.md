---
allowed-tools: Read, Bash(mkdir:*), mcp__playwright__*
description: Capture screenshots for all slide templates
---

<purpose>
    - Capture progressive screenshots for every slide template in the library
    - Ensure consistent visual documentation across the entire template collection
    - Enable agents to visually understand all available template layouts
</purpose>

<key_knowledge>
    - templates.json structure and slide ordering conventions
    - Slidev URL structure with click state query parameters
    - Playwright MCP screenshot capture workflow
    - Template screenshot folder organization
</key_knowledge>

<goal>
    - Capture all click states for every template in templates.json
    - Save screenshots to each template's screenshots/ folder
    - Provide summary report of captured screenshots
</goal>

<background>
    - Visual documentation helps agents understand template layouts and styling
    - Progressive screenshots show the storytelling flow of each slide
    - Consistent documentation across the library improves template discoverability
    - Screenshots must be refreshed when template content changes
</background>

<workflow>
    <overview>
        1. Load all templates from templates.json
        2. Iterate through each template capturing all click states
        3. Report summary with per-template breakdown
    </overview>

    <inputs>
        <input name="templates_json" type="file" required="true">
            The templates.json file containing the slides array
            Each entry has: order, template, source, clicks
        </input>
    </inputs>

    <steps>
        <step name="load_templates">
            <description>
                - Read templates.json to get the list of all slides
                - Extract the slides array containing template entries
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
            <fields_needed>
                - order: Slide position (used to calculate URL)
                - template: Template name (used for folder path)
                - clicks: Number of click states to capture
            </fields_needed>
        </step>

        <step name="iterate_and_capture">
            <description>
                - For EACH slide entry in templates.json
                - Create screenshots directory if needed
                - Calculate URL and capture all click states
            </description>

            <substep name="create_screenshots_directory">
                mkdir -p slide-templates/{template}/screenshots/
            </substep>

            <substep name="calculate_url">
                Base URL: http://localhost:3030/ (dev server must be running)

                Formula: slide_number = parseInt(order) + 1

                Click state URLs:
                - Initial (n=0): /{slide_number}
                - Click n > 0: /{slide_number}?clicks={n}
            </substep>

            <substep name="capture_loop">
                For each template, loop from n = 0 to clicks (inclusive):

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

                5. Move file (Playwright saves to .playwright-mcp/ prefix):
                   mv .playwright-mcp/slide-templates/{template}/screenshots/click-{n}.png \
                      slide-templates/{template}/screenshots/click-{n}.png
            </substep>

            <substep name="repeat">
                Continue through entire slides array until all templates captured
            </substep>
        </step>

        <step name="report_summary">
            <description>
                - Provide completion summary after all screenshots captured
                - Include per-template breakdown table
                - Report any errors with specific templates/click states
            </description>
        </step>
    </steps>

    <global_constraints>
        - Dev server must be running (npm run dev) before starting capture
        - Process all templates in order from templates.json
        - Move files from .playwright-mcp/ to final location after each capture
    </global_constraints>

    <output_format>
        ## Sync All Complete ✅

        Templates synced: {count} templates
        Total screenshots: {total} files

        ### Per-Template Breakdown:
        | Template | Clicks | Screenshots |
        |----------|--------|-------------|
        | title | 0 | 1 |
        | column-cards | 3 | 4 |
        | about-me | 0 | 1 |
        | ... | ... | ... |

        All screenshots saved to slide-templates/{template}/screenshots/

        ### Errors (if any):
        - {template}: Failed at click-{n} - {error message}
    </output_format>
</workflow>

<important_rules>
    1. Ensure dev server is running before attempting screenshot capture
    2. Always create screenshots/ directory before capturing
    3. Move files from .playwright-mcp/ to final location immediately after capture
    4. Report all errors with specific template and click state that failed
</important_rules>

<expected_results>
    Based on current templates.json (9 templates, 27 total screenshots):

    | Template | Clicks | Screenshots |
    |----------|--------|-------------|
    | title | 0 | 1 |
    | column-cards | 3 | 4 |
    | about-me | 0 | 1 |
    | icon-list-content | 2 | 3 |
    | continuum-diagram | 4 | 5 |
    | extremes-to-middle | 2 | 3 |
    | continuum-middle-ground | 3 | 4 |
    | three-to-one-takeaway | 4 | 5 |
    | conclusion-lets-connect | 0 | 1 |
</expected_results>
