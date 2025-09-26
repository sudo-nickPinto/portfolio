# Content Guide

This guide explains how to add or update content for the portfolio.

Folders
- `assets/images/` — place all images here. Use lowercase hyphenated filenames, prefer `webp` for modern browsers.
- `content/` — structured JSON or markdown for site content. Currently we use `content/projects.json`.

Projects
- Edit `content/projects.json` to add, remove, or update projects.
- Each project object has:
  - `id` (string): unique id, used as `data-project-id` for modal and links
  - `title` (string)
  - `role` (string)
  - `description` (string)
  - `images` (array of strings): paths to image files under `assets/images/`
  - `tech` (array of strings)
  - `year` (string)
  - `repo` (string): URL to repository (optional)
  - `live` (string): URL to live site (optional)

Image recommendations
- Hero: 1200–2400 px wide, `hero-1200.webp`
- Project screenshots: 1200 px wide (also provide smaller versions if possible)
- Headshot: square, ~400 px

How the site loads projects
- On page load `js/index.js` fetches `/content/projects.json` and renders the grid inside `#projects-grid`.
- Project cards include `data-images`, `data-repo`, and `data-live` attributes that the modal reads when opened.

Adding a new project example
1. Add images to `assets/images/`.
2. Edit `content/projects.json` and add a new object with the required fields.
3. Reload the page; the project should appear automatically.

If you prefer authoring in markdown per project, we can add a script to convert `content/*.md` to JSON or fetch individual markdown files dynamically.
