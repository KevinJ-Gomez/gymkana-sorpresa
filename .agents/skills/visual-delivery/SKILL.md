---
name: visual-delivery
description: Builds or audits Gymkana visual and interactive experiences, including mobile behavior, Three.js/R3F scenes, animations, timers, galleries and Blender-derived assets. Use for visual redesigns, interaction bugs, 3D assets, performance or visual QA.
---

# Visual delivery

1. Reproduce the target state first. Identify the exact day/section, interaction state, viewport and timing needed to see it.
2. Preserve existing approved behavior unless the task explicitly changes it.
3. Implement the smallest coherent change, then inspect a real rendered result rather than judging from code alone.
4. Validate relevant mobile and desktop viewports plus pause/progression/timer states affected by the change.
5. For 3D, measure performance when practical and prefer controllable, optimized assets over decorative complexity.
6. For Blender experiments, start with versioned `bpy` scripts and reproducible exports/renders. Do not add Blender MCP until the scripted workflow proves insufficient and permissions have been reviewed.
7. When useful, expose development-only debug state or deterministic test routes so Astra/Antigravity/Playwright can jump directly to important scenes and verify state, screenshots and performance.
8. Finish with focused checks and the repository build. Use the independent reviewer before PR completion.
