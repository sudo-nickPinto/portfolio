# css/main.css — Detailed Explanation

This document explains `css/main.css` line-by-line and by section so you can teach others what each rule does.

## Purpose
`css/main.css` defines the visual identity, layout, responsive behavior, and small utility classes used by the portfolio. It is intentionally commented and organized so learners can modify and understand each part.

## Sections

1. `:root` — CSS Custom Properties
   - Defines colors, spacing, font sizes, and a `--max-width` utility.
   - Use these variables to keep colors and spacing consistent across the site.

2. Reset and base styles
   - `*{box-sizing:border-box}` ensures padding is included in width calculations.
   - `body` rule sets fonts, background color, and text color.
   - `a`, `img` base rules set default link color and make images responsive.

3. `.container`
   - Centers content and constrains width using `--max-width`.

4. Header & Navigation
   - `header` is fixed with a translucent background for a modern look.
   - `.nav` arranges brand and menu horizontally on larger screens.
   - `.menu-toggle` is hidden on desktop but displayed on small screens.

5. Hero
   - `.hero` uses a horizontal layout with an intro and visual area.
   - Typography sizes use variables for consistency.

6. Projects
   - `.projects-grid` uses CSS Grid to create a three-column layout on large screens.
   - `.project-card` provides a subtle background and spacing for each project.

7. Footer
   - Simple footer styling with a top border.

8. Responsive media queries
   - Adjusts the layout and font sizes for narrower screens.

## How this file interacts with others
- The selectors target classes and IDs present in `index.html` (e.g., `.hero`, `.projects-grid`).
- Changing variables in `:root` will update colors and spacing globally, making theming simple.

## Teaching tips
- Ask learners to change a variable in `:root` (e.g., `--accent`) and observe the site update in Live Preview.
- Demonstrate how media queries change layout by resizing the browser or using device toolbar in DevTools.
