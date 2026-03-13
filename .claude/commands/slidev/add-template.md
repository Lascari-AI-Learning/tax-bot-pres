---
allowed-tools: AskUserQuestion, Write, Edit, Read, Bash(mkdir:*), mcp__playwright__*
description: Interactive workflow for adding new slide templates
---

<purpose>
    - Guide the creation of new Slidev templates with proper structure and documentation
    - Ensure consistent template quality through interactive requirements gathering
    - Automate the boilerplate creation for slide templates, descriptions, and examples
</purpose>

<key_knowledge>
    - Slidev presentation framework conventions and v-click animations
    - Handlebars template syntax ({{variable}}, {{{html}}}, {{#each}}, {{#if}})
    - Tailwind CSS styling patterns for slide layouts
    - Template folder structure: slide.md, description.md, example.md, screenshots/
    - templates.json registry format and ordering conventions
</key_knowledge>

<goal>
    - Create a fully functional slide template with all required files
    - Generate documentation that enables both humans and agents to use the template
    - Register the template in templates.json with correct click count
    - Capture screenshots showing all click states for visual reference
</goal>

<background>
    - The Slidev template system provides reusable slide patterns for presentations
    - Each template needs structured documentation for discoverability
    - Screenshots enable agents to visually understand template layouts
    - Consistent structure reduces friction when creating new presentations
</background>

<workflow>
    <overview>
        1. Gather template requirements through interactive questions
        2. Create folder structure and generate template files
        3. Register template in templates.json
        4. Deploy and capture screenshots
    </overview>

    <inputs>
        <input name="template_name" type="string" required="true">
            Kebab-case identifier for the template (e.g., "two-column-compare")
            Gathered via AskUserQuestion in Step 1
        </input>
        <input name="template_purpose" type="string" required="true">
            Description of what kind of content the template presents
            Gathered via AskUserQuestion in Step 2
        </input>
        <input name="layout_structure" type="string" required="true">
            Visual layout details: columns, sections, visual elements, positioning
            Gathered via AskUserQuestion in Step 3
        </input>
        <input name="animation_pattern" type="string" required="true">
            How elements should progressively reveal (v-click strategy)
            Gathered via AskUserQuestion in Step 4
        </input>
    </inputs>

    <steps>
        <step name="gather_template_name">
            <description>
                - Use AskUserQuestion to prompt for the template name
                - Validate name uses kebab-case convention
                - Check name doesn't already exist in slide-templates/
            </description>
            <constraints>
                - Name must be kebab-case (e.g., "timeline-horizontal")
                - Must be unique within slide-templates/ directory
            </constraints>
            <example_prompt>
                What is the template name? (use kebab-case, e.g., "two-column-compare")
            </example_prompt>
        </step>

        <step name="gather_template_purpose">
            <description>
                - Use AskUserQuestion to prompt for the template's purpose
                - Should describe what kind of content/story the template presents
            </description>
            <example_prompt>
                What is the purpose of this template? Describe what kind of content it presents.
                (e.g., "Show a timeline of events", "Compare pros and cons of two options")
            </example_prompt>
        </step>

        <step name="gather_layout_structure">
            <description>
                - Use AskUserQuestion to gather visual layout details
                - Ask about columns, sections, visual elements, positioning
            </description>
            <example_prompt>
                Describe the layout structure:
                - How many columns or sections?
                - What visual elements? (icons, images, diagrams, cards)
                - Any special positioning? (centered, grid, flex)
            </example_prompt>
        </step>

        <step name="gather_animation_pattern">
            <description>
                - Use AskUserQuestion to determine v-click reveal strategy
                - Common patterns: all-at-once, sequential items, section-by-section
            </description>
            <example_prompt>
                How should elements animate/reveal?
                - All visible at once (clicks: 0)
                - Sequential reveal of each item
                - Section-by-section reveal
                - Custom pattern (describe)
            </example_prompt>
        </step>

        <step name="create_folder_structure">
            <description>
                - Create slide-templates/{template_name}/ directory
                - Create screenshots/ subdirectory
            </description>
            <command>
                mkdir -p slide-templates/{template_name}/screenshots
            </command>
            <expected_structure>
                slide-templates/{template_name}/
                ├── screenshots/     # Click-state images (Step 12)
                ├── description.md   # Created in Step 6
                ├── slide.md         # Created in Step 7
                └── example.md       # Created in Step 8
            </expected_structure>
        </step>

        <step name="generate_description_md">
            <description>
                - Use Write tool to create slide-templates/{template_name}/description.md
                - Generate content based on user inputs from Steps 1-4
            </description>
            <template_structure>
                # {Template Name (Title Case)}

                ## Purpose
                {template_purpose}

                ## When to Use
                - {3-4 bullet points based on purpose}

                ## Template Variables
                | Variable | Description | Example |
                |----------|-------------|---------|
                | `{{variable_name}}` | Description | Example value |

                ## Animation Behavior
                {animation_pattern}
                - clicks: {number based on animation}

                ## Visual Features
                {Key visual elements from layout_structure}
            </template_structure>
        </step>

        <step name="generate_slide_md">
            <description>
                - Use Write tool to create slide-templates/{template_name}/slide.md
                - Start with frontmatter: theme: ../ and layout: default
                - Build HTML structure based on layout_structure
                - Use Handlebars syntax for placeholders
            </description>
            <constraints>
                - Use {{variable}} for simple placeholders
                - Use {{{variable}}} for HTML content (triple braces)
                - Use {{#each items}}...{{/each}} for arrays
                - Use {{#if condition}}...{{/if}} for conditionals
                - Use Tailwind CSS classes for styling
                - Include speaker_notes variable at bottom in HTML comments
            </constraints>
            <template_structure>
                ---
                theme: ../
                layout: default
                ---

                &lt;div class="..."&gt;
                  {{title}}

                  {{#each items}}
                  &lt;div v-click&gt;
                    {{this.content}}
                  &lt;/div&gt;
                  {{/each}}
                &lt;/div&gt;

                &lt;!--
                {{speaker_notes}}
                --&gt;
            </template_structure>
        </step>

        <step name="generate_example_md">
            <description>
                - Use Write tool to create slide-templates/{template_name}/example.md
                - Copy structure from slide.md with concrete sample values
                - Add v-click directives based on animation_pattern
            </description>
            <constraints>
                - Use &lt;v-click&gt; wrapper for block elements
                - Use v-click attribute for inline elements
                - Use &lt;v-click at="N"&gt; to control timing order
                - Use realistic sample content demonstrating template purpose
            </constraints>
        </step>

        <step name="analyze_click_count">
            <description>
                - Read the generated example.md file
                - Count all &lt;v-click&gt; and v-click occurrences
                - Find highest at="N" value if explicit timing used
            </description>
            <counting_rules>
                - Each &lt;v-click&gt; wrapper = 1 click
                - Each v-click attribute = 1 click
                - &lt;v-click at="5"&gt; means at least 5 clicks needed
                - If no v-clicks, clicks = 0
            </counting_rules>
            <examples>
                - 3 &lt;v-click&gt; wrappers → clicks: 3
                - 2 &lt;v-click&gt; + 1 &lt;v-click at="4"&gt; → clicks: 4
                - No v-clicks → clicks: 0
            </examples>
        </step>

        <step name="update_templates_json">
            <description>
                - Read templates.json to get current entries
                - Determine next available order value (find highest order < 99, add 1)
                - Add new entry to slides array before conclusion slide (order: 99)
            </description>
            <entry_structure>
                {
                  "order": "08",
                  "template": "{template_name}",
                  "source": "example.md",
                  "clicks": {click_count}
                }
            </entry_structure>
            <constraints>
                - order: 2-digit string, next available number
                - template: kebab-case name from Step 1
                - source: usually "example.md"
                - clicks: count from Step 9
                - Keep entries sorted by order
                - Conclusion slide (order: "99") must remain last
            </constraints>
        </step>

        <step name="deploy_presentation">
            <description>
                - Inform user that deployment is required before screenshot capture
                - Provide deployment commands
            </description>
            <commands>
                # Build the slides (regenerate index.md)
                npm run build:slides

                # Build for production
                npm run build

                # Commit and push to trigger GitHub Pages
                git add .
                git commit -m "Add {template_name} template"
                git push
            </commands>
            <constraints>
                - Wait for GitHub Pages deployment (1-2 minutes)
                - Verify slide is accessible at live URL before proceeding
            </constraints>
        </step>

        <step name="capture_screenshots">
            <description>
                - After deployment, capture screenshots for all click states
                - Option A: Use /slidev:sync-template command
                - Option B: Manual capture using Playwright MCP
            </description>
            <option_a>
                /slidev:sync-template --template={template_name}
            </option_a>
            <option_b_loop>
                For each click state (n = 0 to click_count):
                1. Navigate: mcp__playwright__browser_navigate(url: "http://localhost:3030/{slide_number}?clicks={n}")
                2. Wait: mcp__playwright__browser_wait_for(time: 1)
                3. Capture: mcp__playwright__browser_take_screenshot(filename: "slide-templates/{template_name}/screenshots/click-{n}.png")
                4. Move: mv .playwright-mcp/... slide-templates/{template_name}/screenshots/click-{n}.png
            </option_b_loop>
        </step>
    </steps>

    <global_constraints>
        - Always use kebab-case for template names
        - Include speaker_notes variable in all templates
        - Use Tailwind CSS for styling consistency
        - Screenshots must be captured from live deployed version
    </global_constraints>

    <output_format>
        - Completion summary showing all created files
        - Path to new template: slide-templates/{template_name}/
        - Screenshot count and locations
        - Next steps for using the template
    </output_format>
</workflow>

<important_rules>
    1. Always validate template name doesn't already exist before creating files
    2. Never skip the screenshot capture step - visual documentation is critical
    3. Ensure templates.json order field is correctly calculated to avoid conflicts
    4. Wait for deployment to complete before capturing screenshots from live URL
</important_rules>
