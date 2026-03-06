---
name: UI/UX Pro Max
description: Intelligent Design System Generation and UI/UX best practices
---
# UI/UX Pro Max Skill (Antigravity Adaptation)

> [!IMPORTANT]
> **Python/CLI Limitation**: The automated scripts (`search.py`) cannot be executed in this environment due to missing Python runtime.
> **Workaround**: YOU (the Agent) must manually read the data files in `src/ui-ux-pro-max/data/` to perform the reasoning and generation.

## How to use this skill manually

When the user requests a Design System or UI/UX work:

1.  **Analyze the Request**: Identify the domain (e.g., "Healthcare", "Fintech"), product type, and key requirements.
2.  **Consult Data Files**:
    *   Read `src/ui-ux-pro-max/data/ui-reasoning.csv` to find rules matching the category.
    *   Read `src/ui-ux-pro-max/data/styles.csv` to understand available styles.
    *   Read `src/ui-ux-pro-max/data/colors.csv` via `grep` or `read_file` to find suitable palettes.
    *   Read `src/ui-ux-pro-max/data/typography.csv` for font pairings.
3.  **Generate Output**: Assemble the findings into a "Design System" artifact for the user, following the format shown in the README below.
4.  **Implement**: Use the generated design system to write the code.

---

# Original README

# UI UX Pro Max

<p align="center">
  <img src="https://img.shields.io/badge/reasoning_rules-100-green?style=for-the-badge" alt="100 Reasoning Rules">
  <img src="https://img.shields.io/badge/UI_styles-67-purple?style=for-the-badge" alt="67 UI Styles">
</p>

An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.

## Intelligent Design System Generation

The flagship feature is the **Design System Generator** - an AI-powered reasoning engine that analyzes your project requirements and generates a complete, tailored design system.

### How it normally works (Simulate this!)

1.  **USER REQUEST**: "Build a landing page for my beauty spa"
2.  **MULTI-DOMAIN SEARCH**: Look up product type, style, colors, patterns, typography in the CSV data.
3.  **REASONING ENGINE**: Match product -> UI category rules.
4.  **COMPLETE DESIGN SYSTEM OUTPUT**: Generate the text block.

## Data Sources (You must read these)

*   `src/ui-ux-pro-max/data/ui-reasoning.csv`: Industry specific rules.
*   `src/ui-ux-pro-max/data/styles.csv`: Visual styles (Glassmorphism, etc).
*   `src/ui-ux-pro-max/data/colors.csv`: Color palettes.
*   `src/ui-ux-pro-max/data/typography.csv`: Font pairings.
*   `src/ui-ux-pro-max/data/landing.csv`: Landing page patterns.
