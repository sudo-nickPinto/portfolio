# Learning HTML for Your Portfolio Website

## What is HTML?
HTML (HyperText Markup Language) is the foundation of web pages. It provides the structure and content of your website using "tags" that tell the browser what each piece of content is (headings, paragraphs, images, etc.).

## Basic HTML Concepts You Need to Know

### 1. HTML Document Structure
Every HTML page needs this basic structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

**What each part does:**
- `<!DOCTYPE html>` - Tells the browser this is HTML5
- `<html>` - Root element that contains everything
- `<head>` - Contains information about the page (not visible to users)
- `<body>` - Contains the visible content of your page

### 2. Essential HTML Tags for Your Portfolio

#### Text Content
- `<h1>` to `<h6>` - Headings (h1 is largest, h6 is smallest)
- `<p>` - Paragraphs of text
- `<span>` - Small inline text sections
- `<strong>` - Bold text (important)
- `<em>` - Italic text (emphasis)

#### Structure and Layout
- `<header>` - Top section of your page (navigation, logo)
- `<nav>` - Navigation menu
- `<main>` - Main content area
- `<section>` - Distinct sections of content
- `<article>` - Self-contained content (like a blog post or project)
- `<aside>` - Side content (sidebar)
- `<footer>` - Bottom section (contact info, links)
- `<div>` - Generic container (use when no semantic tag fits)

#### Links and Navigation
- `<a href="URL">Link text</a>` - Links to other pages or sections
- `<a href="#section-id">` - Links to sections on the same page
- `<a href="mailto:email@example.com">` - Email links

#### Images and Media
- `<img src="image.jpg" alt="Description">` - Images
- `<video>` - Video content
- `<audio>` - Audio content

#### Lists
- `<ul>` - Unordered list (bullet points)
- `<ol>` - Ordered list (numbered)
- `<li>` - List items (goes inside ul or ol)

#### Forms (for contact sections)
- `<form>` - Container for form elements
- `<input>` - Input fields (text, email, etc.)
- `<textarea>` - Multi-line text input
- `<button>` - Clickable buttons
- `<label>` - Labels for form elements

## Portfolio-Specific Sections You'll Need

### 1. Header Section
```html
<header>
    <nav>
        <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
</header>
```

### 2. Hero/Introduction Section
```html
<section id="hero">
    <h1>Your Name</h1>
    <p>Brief description of who you are</p>
</section>
```

### 3. About Section
```html
<section id="about">
    <h2>About Me</h2>
    <p>Your background, skills, interests</p>
    <img src="your-photo.jpg" alt="Your Name">
</section>
```

### 4. Projects Section
```html
<section id="projects">
    <h2>My Projects</h2>
    <article>
        <h3>Project Title</h3>
        <p>Project description</p>
        <a href="project-link">View Project</a>
    </article>
</section>
```

### 5. Contact Section
```html
<section id="contact">
    <h2>Contact Me</h2>
    <p>Email: <a href="mailto:your-email@example.com">your-email@example.com</a></p>
</section>
```

## Important HTML Attributes

### Common Attributes
- `id="unique-name"` - Unique identifier for an element
- `class="class-name"` - Groups elements for styling
- `src="file-path"` - Source file for images, videos, etc.
- `href="URL"` - Destination for links
- `alt="description"` - Alternative text for images (important for accessibility)

### Form Attributes
- `type="text"` - Type of input field
- `name="field-name"` - Name for form processing
- `placeholder="hint text"` - Hint text in input fields
- `required` - Makes a field mandatory

## Best Practices for Your Portfolio

### 1. Semantic HTML
Use HTML tags that describe the meaning of content, not just appearance:
- Use `<h1>` for your main heading, not just for big text
- Use `<nav>` for navigation, not just `<div>`
- Use `<section>` for distinct content areas

### 2. Accessibility
- Always include `alt` attributes for images
- Use proper heading hierarchy (h1 → h2 → h3)
- Ensure links have descriptive text

### 3. Organization
- Keep your HTML clean and indented
- Add comments for complex sections: `<!-- This is a comment -->`
- Group related content in sections

## Practice Exercises

1. **Start Simple**: Create a basic page with your name as an h1 and a paragraph about yourself
2. **Add Structure**: Break your content into header, main, and footer sections
3. **Create Navigation**: Add a navigation menu that links to different sections
4. **Add Content**: Include an about section, projects section, and contact information
5. **Include Media**: Add a profile photo and any project images

## What's Next After HTML?

Once you're comfortable with HTML structure:
1. **CSS** - Learn to style your HTML and make it look good
2. **JavaScript** - Add interactivity and dynamic behavior
3. **Responsive Design** - Make your site work on all devices
4. **Version Control** - Use Git to track your changes

## Common Beginner Mistakes to Avoid

1. **Forgetting closing tags** - Every opening tag needs a closing tag (except self-closing tags like `<img>`)
2. **Nesting tags incorrectly** - Tags must be properly nested: `<p><strong>text</strong></p>` ✓, not `<p><strong>text</p></strong>` ✗
3. **Using divs for everything** - Use semantic tags when available
4. **Skipping alt attributes** - Always describe your images
5. **Not validating HTML** - Use online HTML validators to check for errors

Remember: Start simple and build incrementally. Don't worry about making it perfect at first - focus on understanding how HTML works and getting comfortable with the basic structure!