# Nicholas Pinto Portfolio - AI Coding Instructions

## Project Overview
This is a static portfolio website for Nicholas Pinto, built with vanilla HTML, CSS, and JavaScript. The site features a dramatic intro animation with a diamond reveal pattern inspired by Patrick David's website, dynamic weather/time display, and project showcases.

## Key Architecture Patterns

### Hero Animation System (`js/index.js` lines 240-310)
The site's signature feature is a multi-stage hero intro sequence:
1. **Name Split Animation**: "Nicholas Pinto" appears with split animation
2. **Diamond Reveal**: Triggered by hover on name or scroll (50px threshold)
3. **Background Reveal**: Great Wave of Kanagawa image fades in
4. **Typed Content**: Weather, status, and visitor info animate in over 5 seconds

**Critical Implementation Detail**: The `revealBackground()` function controls this flow and should only fire once (`backgroundRevealed` flag).

### CSS Architecture (`css/main.css`)
- **Custom Properties**: Centralized color/spacing system in `:root`
- **Interactive Elements**: All hover states use `transform: translateY(-2px)` pattern
- **Custom Cursor**: Mix-blend-mode difference cursor with hover/click states
- **Responsive**: Mobile-first with container max-width of 1200px

### Content Management
- **Projects**: Dynamically loaded from `content/projects.json` with schema: `{id, title, role, description, images[], tech[], year, repo, live}`
- **Static Content**: All other content embedded in `index.html` with semantic sections

## Development Workflows

### Local Development
```bash
python3 -m http.server 8000
# Access at http://localhost:8000
```

### File Structure Conventions
- `assets/images/` - All images (webp preferred for performance)
- `css/main.css` - Single stylesheet with extensive comments
- `js/index.js` - Single JavaScript file, vanilla JS only
- `content/*.json` - Structured data files
- `docs/` - Per-file documentation explaining implementation

### Animation Requirements (Per Instructions)
Current behavior being implemented:
1. "Nicholas Pinto" appears dynamically on load
2. Diamond reveal pattern triggers on:
   - Mouse hover over name text
   - User scroll initiation
3. Reversible animation: hover off closes diamond, hover on reopens
4. Typing animation for bio/weather/status content (5 second duration)

## Code Quality Standards

### JavaScript Patterns
- Vanilla JS only (no frameworks)
- Extensive comments explaining accessibility considerations
- Event delegation for dynamic content
- Progressive enhancement (works without JS)
- `prefers-reduced-motion` respect

### CSS Patterns
- BEM-style naming where logical
- Transition properties on interactive elements
- Accessibility: focus states, proper contrast ratios
- Performance: Hardware acceleration for animations

### Accessibility Focus
- Semantic HTML5 elements (`<section>`, `<nav>`, `<main>`)
- ARIA attributes (`aria-expanded`, `aria-live`, `aria-label`)
- Keyboard navigation support
- Screen reader considerations

## External Integrations
- **Weather API**: Fetches Gettysburg, PA weather data
- **CountAPI**: Simple visitor counter service
- **Google Fonts**: Inter (body) + Playfair Display (headings)
- **Time Display**: Local Gettysburg time zone conversion

## Project-Specific Considerations
- Performance critical: Minimize external dependencies
- Educational focus: Code should be learnable and well-documented
- Responsive: Works across all device sizes
- Fast loading: Optimized images, minimal CSS/JS payload

When modifying this codebase, maintain the extensive commenting style, respect the single-file architecture, and ensure animations remain smooth and accessible.