# js/index.js — Detailed Explanation

This document explains every part of `js/index.js`. The aim is to teach how plain JavaScript can add interactivity without frameworks.

## High-level purpose
`js/index.js` adds the following behaviors:
- Smooth scrolling for internal anchor links
- Mobile menu toggle (ARIA-friendly)
- Active navigation highlighting based on scroll position
- Simple project modal to view project details in-page

## Detailed walkthrough

1. `DOMContentLoaded` listener
   - Ensures the DOM is parsed before querying elements.

2. Smooth scroll handler
   - Selects `a[href^="#"]` and intercepts click events.
   - Uses `scrollIntoView({ behavior: 'smooth' })` for native smooth scrolling.

3. Mobile menu toggle
   - Adds click handler to `#menu-toggle` which toggles `aria-expanded` on `#main-menu` and adds/removes `.open`.
   - This is the foundation for accessible mobile navigation.

4. Active nav highlight on scroll
   - Calculates which section is currently in view and toggles `.active` on the corresponding nav link.
   - This improves orientation while the user scrolls.

5. Project modal
   - Elements with `data-project-id` open the modal when clicked.
   - `openProjectModal(id)` pulls the project's title and description and fills the modal.
   - Modal closes on clicking `.close` or clicking the overlay background.

## Teaching tips
- Use `console.log` inside handlers to demonstrate event firing order.
- Show how `aria-expanded` helps screen readers by toggling it in DevTools.
- Expand `openProjectModal` to fetch richer content (images, links) when you're ready to add more project details.
