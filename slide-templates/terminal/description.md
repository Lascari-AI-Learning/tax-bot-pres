# Terminal Template

## Purpose
Display terminal/CLI commands with syntax-highlighted output in a macOS-style terminal window. Useful for showing installation instructions, command-line examples, API responses, or any terminal-based workflows during presentations.

## When to Use
- Showing installation or setup commands
- Demonstrating CLI tool usage
- Displaying command output or API responses
- Any slide featuring terminal/shell interactions

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | The slide's main heading | "Getting Started" |
| `{{lines}}` | Array of command/output objects | See lines structure below |
| `{{terminal_title}}` | Optional: terminal window title | "my-project — bash" |
| `{{shell}}` | Optional: shell type (default: bash) | "bash", "zsh", "powershell" |
| `{{prompt}}` | Optional: prompt symbol (default: $) | "$", "❯", "PS>" |
| `{{height}}` | Optional: terminal height in pixels | 300 |
| `{{animated}}` | Optional: enable typing animation (default: false) | true |
| `{{speaker_notes}}` | Speaker notes for the slide | "Walk through the setup..." |

### Lines Structure
Each object in the `{{lines}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `command` | The command to display | "npm install slidev" |
| `output` | Optional: command output text | "added 152 packages in 2m" |
| `prompt` | Optional: override prompt for this line | "❯" |

## Usage Example

```bash
npm run generate:slide -- --template=terminal --name=05-setup \
  --title="Quick Setup" \
  --terminal_title="Terminal" \
  --shell="bash" \
  --lines='[
    { "command": "npm init slidev@latest my-deck", "output": "✔ Project created successfully" },
    { "command": "cd my-deck && npm run dev", "output": "Server running on http://localhost:3030" }
  ]'
```

### Animated Usage Example

```bash
npm run generate:slide -- --template=terminal --name=06-live-demo \
  --title="Live Demo" \
  --terminal_title="Terminal" \
  --animated="true" \
  --lines='[
    { "command": "claude", "output": "Welcome to Claude Code!" },
    { "command": "help me build an API", "output": "I will help you create a REST API..." }
  ]'
```

When `animated` is enabled, the first command begins typing automatically on slide load. Use the exposed `activateNextLine()` method via a template ref to trigger subsequent commands (e.g., with v-click or button interactions).

## Visual Features
- macOS-style window chrome with traffic-light dots (red, yellow, green)
- Centered terminal title in header bar
- Shiki-powered syntax highlighting for commands
- Automatic JSON detection and highlighting for output
- Copy-to-clipboard button on hover for each command
- Dark terminal background optimized for code readability
- **Animated mode**: character-by-character typing at ~50ms/char with blinking cursor, followed by a brief pause (~300ms) before output appears instantly

## Notes
- The `lines` variable uses triple-brace `{{{lines}}}` in the template for raw HTML/JS output
- Commands are syntax-highlighted based on the `shell` prop (bash, powershell, etc.)
- JSON output is automatically detected and highlighted
- The copy button appears on hover over each command line
- Terminal height is auto-sized unless `height` is specified
