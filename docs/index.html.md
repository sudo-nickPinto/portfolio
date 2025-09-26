# index.html — Detailed Explanation

This document explains every part of `index.html` so you can understand, teach, and onboard others.

## High-level purpose
`index.html` is the single-page entry point of your portfolio. It contains semantic sections for:
- Header/navigation
- Hero (first impression)
- About
- Projects
- Awards
- Contact
- Footer

All content is static and organized to be easily styled with CSS and enhanced with JavaScript.

## File breakdown (top → bottom)

1. `<!doctype html>` and `<html lang="en">`
   - Declares the document type (HTML5) and primary language.

2. `<head>` section
   - `<meta charset>` ensures proper character encoding.
   - `<meta name="viewport">` enables responsive scaling on mobile devices.
   - `<title>` shows up in browser tabs and search results.
   - `<link rel="stylesheet" href="/css/main.css">` links the main stylesheet.

3. `<body>` section
   - `<header>` contains a `.container` and `.nav` structure with site brand and navigation.
   - The navigation links use fragment anchors (e.g., `#about`) so the JS can smoothly scroll to sections.
   - The `#menu-toggle` button is used on small screens to toggle the menu.

4. `<main>` contains the main page sections. Each section has an `id` for navigation and JS targeting:
   - `#hero` — large introduction area with a short statement and CTA
   - `#about` — short bio and skill list
   - `#projects` — grid of project cards. Each card has `data-project-id` used by the JS modal
   - `#awards` — list of awards
   - `#contact` — contact info and links

5. Project Modal (`#project-modal`)
   - A hidden dialog used to show project details without navigating away
   - `.close` button to dismiss the modal; `openProjectModal(id)` populates and opens it

6. `<footer>`
   - Small copyright statement

7. `<script src="/js/index.js" defer></script>`
   - Loads the client-side JavaScript that powers smooth scrolling, modal behavior, and other interactions.

## How files interact
- `index.html` provides structure and content.
- `css/main.css` styles the elements referenced in `index.html`.
- `js/index.js` adds behavior to DOM elements present in `index.html` such as navigation links, project cards, and modal.

## Teaching tips
- Walk learners through `index.html` while toggling `css/main.css` to show how styles affect layout.
- Use browser DevTools to inspect elements, view computed styles, and test breakpoints.
- Step through `js/index.js` using the DevTools debugger to understand event flow.
