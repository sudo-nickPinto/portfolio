/*
  index.js
  JavaScript for the static portfolio site. This file contains well-commented
  functions to make the site interactive: smooth scrolling, mobile menu toggle,
  active nav highlighting, and a simple project modal.

  This is intentionally plain JS (no frameworks) to keep things simple and
  educational.
*/

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
  // Create custom cursor
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  // Update cursor position
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });
  
  // Cursor hover effects
  const hoverElements = 'a, button, .project-card, .btn, .about-image-wrap, .name-split, .hero-name, .begin-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(hoverElements) || e.target.closest(hoverElements)) {
      cursor.classList.add('hover');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(hoverElements) || e.target.closest(hoverElements)) {
      cursor.classList.remove('hover');
    }
  });
  
  // Cursor click effect
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
  });
  
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
  });

  // Smooth scroll for internal anchor links
  // Finds all links that start with '#' and smoothly scrolls to the target element
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      // Prevent default jump behavior
      e.preventDefault();
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        // Use native smooth scrolling
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero name click handler - scroll to contact section
  const heroName = document.getElementById('hero-name');
  if (heroName) {
    heroName.addEventListener('click', function (e) {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', function () {
      const expanded = mainMenu.getAttribute('aria-expanded') === 'true';
      mainMenu.setAttribute('aria-expanded', String(!expanded));
      mainMenu.classList.toggle('open');
    });
  }

  // Accessibility note: toggling aria-expanded helps screen readers understand
  // whether the menu is open. The CSS for .menu.open should display the menu
  // on small screens.

  // Active nav link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav .menu a');

  function onScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;
    sections.forEach(function (section) {
      const top = section.offsetTop - 100; // offset for header
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll(); // initial call

  // Simple project modal: opens when clicking a project card (data-project-id)
  // Query for project cards that match the ones in index.html. We use data attributes
  // so the modal code can generically pull content from the card when opening.
  document.querySelectorAll('[data-project-id]').forEach(function (card) {
    card.addEventListener('click', function () {
      const id = card.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  // Modal close button
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.querySelector('.close').addEventListener('click', function () {
      modal.classList.remove('open');
    });
    // Close on background click
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
  // Close modal on Escape key for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('open')) modal.classList.remove('open');
    }
  });
  // Load projects from content file and render
  loadProjects();

  // Initialize hero sequence, time/weather/status, and visitor counter
  initHeroAndInfo();
  
  // Load Grateful Dead history for today
  loadGratefulDeadHistory();
});

/* ----- Hero, time, weather, status, visitor counter ----- */
function initHeroAndInfo(){
  const intro = document.getElementById('intro-overlay');
  const heroBg = document.getElementById('hero-bg');
  const statusText = document.getElementById('status-text');
  const timeEl = document.getElementById('gettysburg-time');
  const weatherEl = document.getElementById('weather');
  const visitorEl = document.getElementById('visitor-count');

  // Set background image (Great Wave) - file provided per workflow
  heroBg.style.backgroundImage = "url('/assets/images/Great Wave of Kanagawa.jpg')";

  // Visitor counter: try a lightweight global counter service (CountAPI) first.
  // CountAPI: a public simple key-value counter service (no auth required for basic usage).
  // We'll use a namespace/key for this site and increment the counter server-side so
  // all visitors see a global count. If the request fails (network blocked or rate-limited),
  // we fall back to a localStorage per-browser counter.
  (function incrementGlobalCounter(){
    const countApiNamespace = 'nicholaspinto_portfolio';
    const countApiKey = 'visitors';
    const url = `https://api.countapi.xyz/hit/${encodeURIComponent(countApiNamespace)}/${encodeURIComponent(countApiKey)}`;
    fetch(url, {cache: 'no-store'})
      .then(r=>{ if(!r.ok) throw new Error('countapi failed'); return r.json() })
      .then(data=>{
        if(visitorEl) visitorEl.innerText = String(data.value || '—');
      })
      .catch(err=>{
        console.warn('Global counter failed, falling back to localStorage', err);
        try{
          const key = 'visitor-count';
          let count = parseInt(localStorage.getItem(key) || '0', 10);
          count = isNaN(count) ? 1 : count + 1;
          localStorage.setItem(key, String(count));
          if(visitorEl) visitorEl.innerText = String(count);
        } catch (e){ if(visitorEl) visitorEl.innerText = '—'; }
      });
  })();

  // Status rotation pool
  const daytimePool = ['Developing','Coding','Learning','Having Fun'];
  function getStatusForHour(h){
    if(h>=23 || h<7) return 'Sleeping';
    if(h>=7 && h<17){
      // pick a random item from pool
      return daytimePool[Math.floor(Math.random()*daytimePool.length)];
    }
    return 'Relaxing';
  }

  // Time display for Gettysburg (America/New_York)
  function updateTimeAndStatus(){
    try{
      const now = new Date();
      // Use toLocaleString with timeZone for Gettysburg
      const opts = {hour:'2-digit',minute:'2-digit',hour12:false, timeZone:'America/New_York'};
      const timeStr = now.toLocaleTimeString([], opts);
      if(timeEl) timeEl.innerText = timeStr;
      // compute hour in timezone
      const hour = new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getHours();
      if(statusText) statusText.innerText = getStatusForHour(hour);
    }catch(e){ console.warn('time update failed', e) }
  }
  updateTimeAndStatus();
  setInterval(updateTimeAndStatus, 60*1000); // update each minute

  // Fetch weather from Open-Meteo (no API key) for Gettysburg coords
  function fetchWeather(){
    const lat = 39.8309, lon = -77.2311;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America%2FNew_York`;
    fetch(url).then(r=>{ if(!r.ok) throw new Error('weather fetch failed'); return r.json() })
      .then(data=>{
          if(data && data.current_weather){
            const w = data.current_weather;
            const tempC = w.temperature;
            const tempF = Math.round((tempC * 9/5) + 32);
            const code = w.weathercode; // map codes to simple icons
            const icon = mapWeatherCodeToEmoji(code);
            
            // Apply day/night styling based on current hour in Gettysburg
            const now = new Date();
            const hour = new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            if(weatherEl) {
              weatherEl.innerText = `${icon} ${tempF}°F (${tempC}°C)`;
              // Apply dynamic styling
              weatherEl.className = isDaytime ? 'weather-day' : 'weather-night';
            }
          } else {
            if(weatherEl) weatherEl.innerText = 'Weather unavailable';
          }
        }).catch(err=>{ console.warn('weather error', err); if(weatherEl) weatherEl.innerText='Weather unavailable' })
  }

  // helper mapping (simplified)
  function mapWeatherCodeToEmoji(code){
    // simplified mapping: clear(0) -> ☀️, cloud -> ☁️, rain -> 🌧️, snow -> ❄️, unknown -> 🌤️
    if(code === 0) return '☀️';
    if([1,2,3].includes(code)) return '⛅';
    if((code>=51 && code<=67) || (code>=80 && code<=82)) return '🌧️';
    if((code>=71 && code<=77) || (code>=85 && code<=86)) return '❄️';
    return '🌤️';
  }

  // Play intro animation sequence unless user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let backgroundRevealed = false;
  
  function startSequentialTypingAnimation() {
    const subtitle = document.querySelector('.subtitle');
    const elevator = document.querySelector('.elevator');
    const timeEl = document.getElementById('gettysburg-time');
    const weatherEl = document.getElementById('weather');
    const statusText = document.getElementById('status-text');
    const visitorEl = document.getElementById('visitor-count');
    
    let animationDelay = 0;
    
    // 1. Type subtitle (2 seconds)
    if (subtitle) {
      const subtitleText = subtitle.textContent;
      subtitle.textContent = '';
      typeTextSequential(subtitle, subtitleText, 60, animationDelay);
      animationDelay += 2000;
    }
    
    // 2. Type elevator pitch (2.5 seconds)
    if (elevator) {
      const elevatorText = elevator.textContent;
      elevator.textContent = '';
      typeTextSequential(elevator, elevatorText, 50, animationDelay);
      animationDelay += 2500;
    }
    
    // 3. Type time (0.5 seconds)
    setTimeout(() => {
      updateTimeSequential();
    }, animationDelay);
    animationDelay += 500;
    
    // 4. Type weather (1 second)
    setTimeout(() => {
      fetchWeatherSequential();
    }, animationDelay);
    animationDelay += 1000;
    
    // 5. Type status (1 second)
    setTimeout(() => {
      fetchStatusSequential();
    }, animationDelay);
    animationDelay += 1000;
    
    // 6. Type visitor count (0.5 seconds)
    setTimeout(() => {
      fetchVisitorCountSequential();
    }, animationDelay);
    
    // Start inactivity detection after all animations are complete
    setTimeout(() => {
      initInactivityDetection();
    }, animationDelay + 1000);
  }
  
  function typeTextSequential(element, text, speed = 50, delay = 0) {
    setTimeout(() => {
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }, delay);
  }
  
  function typeText(element, text, speed = 50, delay = 0) {
    setTimeout(() => {
      let i = 0;
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }, delay);
  }
  
  function blowUpAndReveal() {
    if (backgroundRevealed) return;
    backgroundRevealed = true;
    
    // Show background immediately
    if(heroBg) heroBg.classList.add('show');
    
    // Trigger blow-up animation
    if(intro) {
      intro.classList.add('blow-up');
      
      // After blow-up completes, start letter reconstruction
      setTimeout(() => {
        intro.style.display = 'none';
        startLetterReconstruction();
      }, 500);
    }
  }
  
  function startLetterReconstruction() {
    // Show the header and main content containers (hidden initially)
    const header = document.querySelector('header');
    if(header) header.classList.add('show');
    
    // Show hero content container but letters will fly in individually
    const heroContent = document.querySelector('.hero-content');
    if(heroContent) heroContent.classList.add('show');
    
    // Hide the hero name initially while we reconstruct it
    const heroName = document.getElementById('hero-name');
    if(heroName) {
      heroName.style.opacity = '0';
      
      // Start the letter flying animation
      flyLettersToPosition('Nicholas Pinto', heroName, () => {
        // After letters are in place, start typing animation
        setTimeout(() => {
          startSequentialTypingAnimation();
        }, 500);
      });
    }
  }
  
  function flyLettersToPosition(text, targetElement, callback) {
    const letters = text.split('');
    const targetRect = targetElement.getBoundingClientRect();
    const letterElements = [];
    let completedAnimations = 0;
    
    // Create a temporary element to measure text metrics
    const tempElement = document.createElement('span');
    tempElement.style.fontFamily = 'JetBrains Mono, monospace';
    tempElement.style.fontSize = getComputedStyle(targetElement).fontSize;
    tempElement.style.fontWeight = '800';
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.textContent = 'M'; // Use 'M' for width measurement
    document.body.appendChild(tempElement);
    const letterWidth = tempElement.getBoundingClientRect().width;
    document.body.removeChild(tempElement);
    
    letters.forEach((letter, index) => {
      if(letter === ' ') {
        completedAnimations++;
        if(completedAnimations === letters.length && callback) callback();
        return;
      }
      
      // Create flying letter element
      const letterEl = document.createElement('span');
      letterEl.textContent = letter;
      letterEl.className = 'letter-flying';
      
      // Random starting position (off screen from various directions)
      const fromTop = Math.random() > 0.5;
      const fromLeft = Math.random() > 0.5;
      
      const startX = fromLeft ? -100 : window.innerWidth + 100;
      const startY = fromTop ? -100 : window.innerHeight + 100;
      
      letterEl.style.left = startX + 'px';
      letterEl.style.top = startY + 'px';
      
      document.body.appendChild(letterEl);
      letterElements.push(letterEl);
      
      // Calculate target position within the hero name
      const targetX = targetRect.left + (index * letterWidth * 0.8); // Slightly tighter spacing
      const targetY = targetRect.top + 10; // Slight vertical adjustment
      
      // Animate to target position
      setTimeout(() => {
        letterEl.classList.add('animate');
        letterEl.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        letterEl.style.left = targetX + 'px';
        letterEl.style.top = targetY + 'px';
        
        // Screen shake when letter hits
        setTimeout(() => {
          document.body.classList.add('screen-shake');
          setTimeout(() => {
            document.body.classList.remove('screen-shake');
          }, 500);
        }, 1200);
        
        // Remove flying letter and show final letter
        setTimeout(() => {
          letterEl.remove();
          completedAnimations++;
          
          // When all letters are done, show the final name and call callback
          if(completedAnimations === letters.filter(l => l !== ' ').length) {
            targetElement.style.opacity = '1';
            if(callback) callback();
          }
        }, 1500);
        
      }, index * 150); // Slightly faster stagger
    });
  }
  
  // Sequential versions for smoother typing experience
  function updateTimeSequential() {
    try{
      const now = new Date();
      const opts = {hour:'2-digit',minute:'2-digit',hour12:false, timeZone:'America/New_York'};
      const timeStr = now.toLocaleTimeString([], opts);
      const timeEl = document.getElementById('gettysburg-time');
      if(timeEl) {
        timeEl.textContent = '';
        typeTextSequential(timeEl, timeStr, 120, 0);
      }
    }catch(e){ console.warn('time update failed', e) }
  }
  
  function fetchWeatherSequential() {
    const lat = 39.8309, lon = -77.2311;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America%2FNew_York`;
    fetch(url).then(r=>{ if(!r.ok) throw new Error('weather fetch failed'); return r.json() })
      .then(data=>{
          if(data && data.current_weather){
            const w = data.current_weather;
            const tempC = w.temperature;
            const tempF = Math.round((tempC * 9/5) + 32);
            const code = w.weathercode;
            const icon = mapWeatherCodeToEmoji(code);
            
            const now = new Date();
            const hour = new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            const weatherEl = document.getElementById('weather');
            if(weatherEl) {
              weatherEl.textContent = '';
              const weatherText = `${icon} ${tempF}°F (${tempC}°C)`;
              typeTextSequential(weatherEl, weatherText, 80, 0);
              weatherEl.className = isDaytime ? 'weather-day' : 'weather-night';
            }
          } else {
            const weatherEl = document.getElementById('weather');
            if(weatherEl) {
              weatherEl.textContent = '';
              typeTextSequential(weatherEl, 'Weather unavailable', 80, 0);
            }
          }
        }).catch(err=>{ 
          console.warn('weather error', err); 
          const weatherEl = document.getElementById('weather');
          if(weatherEl) {
            weatherEl.textContent = '';
            typeTextSequential(weatherEl, 'Weather unavailable', 80, 0);
          }
        })
  }
  
  function fetchStatusSequential() {
    try{
      const now = new Date();
      const hour = new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getHours();
      const status = getStatusForHour(hour);
      const statusText = document.getElementById('status-text');
      if(statusText) {
        statusText.textContent = '';
        typeTextSequential(statusText, status, 100, 0);
      }
    }catch(e){ 
      console.warn('status update failed', e);
      const statusText = document.getElementById('status-text');
      if(statusText) {
        statusText.textContent = '';
        typeTextSequential(statusText, 'Coding', 100, 0);
      }
    }
  }
  
  function fetchVisitorCountSequential() {
    const countApiNamespace = 'nicholaspinto_portfolio';
    const countApiKey = 'visitors';
    const url = `https://api.countapi.xyz/hit/${encodeURIComponent(countApiNamespace)}/${encodeURIComponent(countApiKey)}`;
    fetch(url, {cache: 'no-store'})
      .then(r=>{ if(!r.ok) throw new Error('countapi failed'); return r.json() })
      .then(data=>{
        const visitorEl = document.getElementById('visitor-count');
        if(visitorEl) {
          visitorEl.textContent = '';
          typeTextSequential(visitorEl, String(data.value || '—'), 150, 0);
        }
      })
      .catch(err=>{
        console.warn('Global counter failed, falling back to localStorage', err);
        try{
          const key = 'visitor-count';
          let count = parseInt(localStorage.getItem(key) || '0', 10);
          count = isNaN(count) ? 1 : count + 1;
          localStorage.setItem(key, String(count));
          const visitorEl = document.getElementById('visitor-count');
          if(visitorEl) {
            visitorEl.textContent = '';
            typeTextSequential(visitorEl, String(count), 150, 0);
          }
        } catch (e){ 
          const visitorEl = document.getElementById('visitor-count');
          if(visitorEl) {
            visitorEl.textContent = '';
            typeTextSequential(visitorEl, '—', 150, 0);
          }
        }
      });
  }
  
  // Individual helper functions for typing animation
  function updateTime() {
    try{
      const now = new Date();
      const opts = {hour:'2-digit',minute:'2-digit',hour12:false, timeZone:'America/New_York'};
      const timeStr = now.toLocaleTimeString([], opts);
      if(timeEl) {
        typeText(timeEl, timeStr, 100, 0);
      }
    }catch(e){ console.warn('time update failed', e) }
  }
  
  function fetchVisitorCount() {
    const countApiNamespace = 'nicholaspinto_portfolio';
    const countApiKey = 'visitors';
    const url = `https://api.countapi.xyz/hit/${encodeURIComponent(countApiNamespace)}/${encodeURIComponent(countApiKey)}`;
    fetch(url, {cache: 'no-store'})
      .then(r=>{ if(!r.ok) throw new Error('countapi failed'); return r.json() })
      .then(data=>{
        if(visitorEl) typeText(visitorEl, String(data.value || '—'), 150, 0);
      })
      .catch(err=>{
        console.warn('Global counter failed, falling back to localStorage', err);
        try{
          const key = 'visitor-count';
          let count = parseInt(localStorage.getItem(key) || '0', 10);
          count = isNaN(count) ? 1 : count + 1;
          localStorage.setItem(key, String(count));
          if(visitorEl) typeText(visitorEl, String(count), 150, 0);
        } catch (e){ if(visitorEl) typeText(visitorEl, '—', 150, 0); }
      });
  }
  
  function fetchStatus() {
    try{
      const now = new Date();
      const hour = new Date(now.toLocaleString('en-US',{timeZone:'America/New_York'})).getHours();
      const status = getStatusForHour(hour);
      if(statusText) typeText(statusText, status, 80, 200);
    }catch(e){ 
      console.warn('status update failed', e);
      if(statusText) typeText(statusText, 'Coding', 80, 200);
    }
  }
  
  if(!prefersReduced){
    // Start name-in animation
    if(intro){
      setTimeout(()=>{ intro.classList.add('play') }, 80);
      
      // Add click listener to Begin button
      const beginBtn = document.getElementById('begin-btn');
      if(beginBtn){
        beginBtn.addEventListener('click', blowUpAndReveal);
      }
    } else {
      // No intro overlay, start immediately
      if(heroBg) heroBg.classList.add('show');
      startTypingAnimation();
    }
  } else {
    // Reduced motion: immediately show everything
    if(intro) intro.style.display='none';
    if(heroBg) heroBg.classList.add('show');
    startTypingAnimation();
  }

  // Hash handling: if URL contains #about, scroll and trigger about image swap
  function handleHash(){
    const h = location.hash.replace('#','');
    if(h === 'about'){
      // smooth scroll to about (scrollIntoView already implemented for anchors), but also trigger image swap
      const about = document.getElementById('about');
      if(about){ about.scrollIntoView({behavior:'smooth', block:'start'}); }
      // trigger bg swap to Saint Nicholas after a short delay
      setTimeout(()=>{
        if(heroBg) heroBg.style.backgroundImage = "url('/assets/images/Saint Nicholas.jpg')";
        if(heroBg) heroBg.classList.add('show');
      }, 600);
    }
  }
  window.addEventListener('hashchange', handleHash);
  // run once on load
  handleHash();
}

/* ----- End hero/info features ----- */

// Opens the project modal and fills basic content from DOM (simple implementation)
function openProjectModal(id) {
  const modal = document.getElementById('project-modal');
  // Find the project card using the same data attribute. This keeps the modal
  // content in sync with the project cards; you can expand the card HTML to
  // include additional data attributes (data-image, data-link) and read them here.
  // We will look for a project entry in the DOM (rendered by loadProjects) or in the global projects cache
  const project = document.querySelector('[data-project-id="' + id + '"]');
  if (!modal || !project) return;
  const title = project.querySelector('h3') ? project.querySelector('h3').innerText : 'Project';
  const desc = project.querySelector('p') ? project.querySelector('p').innerText : '';
  // Populate title and description
  modal.querySelector('.modal-title').innerText = title;
  modal.querySelector('.modal-body').innerText = desc;
  // Populate images if present (project may include data-images attribute with JSON array)
  const imagesContainer = modal.querySelector('.modal-images');
  imagesContainer.innerHTML = '';
  const imagesJson = project.getAttribute('data-images');
  if (imagesJson) {
    try {
      const imgs = JSON.parse(imagesJson);
      imgs.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title + ' screenshot';
        img.className = 'modal-image';
        imagesContainer.appendChild(img);
      });
    } catch (err) {
      console.warn('Invalid data-images JSON for project', id);
    }
  }
  // Populate links area
  const linksContainer = modal.querySelector('.modal-links');
  linksContainer.innerHTML = '';
  const repo = project.getAttribute('data-repo');
  const live = project.getAttribute('data-live');
  if (repo) {
    const a = document.createElement('a');
    a.href = repo; a.target = '_blank'; a.rel = 'noopener';
    a.innerText = 'Repository';
    a.className = 'modal-link';
    linksContainer.appendChild(a);
  }
  if (live) {
    const a = document.createElement('a');
    a.href = live; a.target = '_blank'; a.rel = 'noopener';
    a.innerText = 'Live site';
    a.className = 'modal-link';
    linksContainer.appendChild(a);
  }
  modal.classList.add('open');
}

// --- Dynamic content loader ---
// Fetch projects from content/projects.json and render them into #projects-grid
function loadProjects() {
  // Path is relative to site root; ensure file exists at content/projects.json
  fetch('/content/projects.json')
    .then(r => {
      if (!r.ok) throw new Error('Failed loading projects.json');
      return r.json();
    })
    .then(projects => {
      const grid = document.getElementById('projects-grid');
      if (!grid) return;
      grid.innerHTML = ''; // clear any fallback
      projects.forEach(p => {
        const card = renderProjectCard(p);
        grid.appendChild(card);
      });
      // Re-attach click handlers (in case they weren't present earlier)
      document.querySelectorAll('[data-project-id]').forEach(function (card) {
        card.addEventListener('click', function () {
          const id = card.getAttribute('data-project-id');
          openProjectModal(id);
        });
      });
    })
    .catch(err => {
      console.error('Error loading projects:', err);
    });
}

function renderProjectCard(p) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.setAttribute('data-project-id', p.id);
  // store images/links on the element for the modal to read
  if (p.images) article.setAttribute('data-images', JSON.stringify(p.images));
  if (p.repo) article.setAttribute('data-repo', p.repo);
  if (p.live) article.setAttribute('data-live', p.live);

  const h3 = document.createElement('h3');
  h3.innerText = p.title;
  const pdesc = document.createElement('p');
  pdesc.innerText = p.role ? p.role + ' — ' + p.description : p.description;
  article.appendChild(h3);
  article.appendChild(pdesc);
  // optional thumbnail
  if (p.images && p.images.length) {
    const img = document.createElement('img');
    img.className = 'project-thumb';
    img.src = p.images[0];
    img.alt = p.title + ' thumbnail';
    article.appendChild(img);
  }
  return article;
}

/*
  Notes for extending the modal:
  - To add images, include an <img> in the project card with class 'project-thumb' and copy its src into the modal when opening.
  - To include links, add data attributes like data-repo or data-live and create <a> tags inside the modal dynamically.
  - Keep DOM updates minimal for performance; consider preloading large images.
*/

/* ----- Tic-tac-toe game functionality ----- */
let inactivityTimer;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gamesPlayed = 0; // Track how many games have been played

// Fun facts about Nicholas
const funFacts = [
  "Nicholas' favorite coding language is Java",
  "Nicholas is an avid fan of the Grateful Dead and Goose (the band)",
  "Nicholas volunteers his time being an EMT",
  "Nicholas loves to read. His favorite book is \"The Stranger\" by Albert Camus",
  "Nicholas is really really trying to land a job at Google"
];

function initInactivityDetection() {
  const INACTIVITY_DELAY = 10000; // 10 seconds
  let lastActivity = Date.now();
  
  // Check if device is mobile/tablet
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  function resetTimer() {
    lastActivity = Date.now();
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(checkInactivity, INACTIVITY_DELAY);
  }
  
  function checkInactivity() {
    const now = Date.now();
    if (now - lastActivity >= INACTIVITY_DELAY) {
      showTicTacToe();
    }
  }
  
  // Track mouse and keyboard activity
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keypress', resetTimer);
  document.addEventListener('click', resetTimer);
  document.addEventListener('scroll', resetTimer);
  
  // Add touch events for mobile devices
  if (isMobile) {
    document.addEventListener('touchstart', resetTimer);
    document.addEventListener('touchmove', resetTimer);
    document.addEventListener('touchend', resetTimer);
  }
  
  // Start the timer
  resetTimer();
}

function showTicTacToe() {
  const overlay = document.getElementById('tictactoe-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    newTicTacToeGame();
    
    // Blur the background
    document.querySelector('main').style.filter = 'blur(5px)';
    document.querySelector('header').style.filter = 'blur(5px)';
    
    // Add click listeners to cells
    document.querySelectorAll('.cell').forEach((cell, index) => {
      cell.onclick = () => makeMove(index);
    });
  }
}

function closeTicTacToe() {
  const overlay = document.getElementById('tictactoe-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.querySelector('main').style.filter = 'none';
    document.querySelector('header').style.filter = 'none';
    
    // Reset inactivity timer
    initInactivityDetection();
  }
}

function newTicTacToeGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled');
  });
  
  updateStatus('Your turn! Click a cell');
}

function makeMove(index) {
  if (gameBoard[index] !== '' || !gameActive) return;
  
  gameBoard[index] = currentPlayer;
  document.querySelector(`[data-index="${index}"]`).textContent = currentPlayer;
  
  if (checkWinner()) {
    if (currentPlayer === 'X') {
      updateStatus('🎉 You won!');
      showFunFact();
    } else {
      updateStatus(gamesPlayed === 0 ? '🤖 Computer wins!' : '🏠 The house (Nicholas) always wins!');
    }
    gameActive = false;
    disableBoard();
    gamesPlayed++;
    return;
  }
  
  if (gameBoard.every(cell => cell !== '')) {
    updateStatus('🤝 It\'s a tie!');
    gameActive = false;
    gamesPlayed++;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  
  if (currentPlayer === 'O') {
    updateStatus('🤖 Computer thinking...');
    setTimeout(makeComputerMove, 800);
  } else {
    updateStatus('Your turn! Click a cell');
  }
}

function makeComputerMove() {
  if (!gameActive) return;
  
  let moveIndex;
  
  // First game: let user win (make suboptimal moves)
  if (gamesPlayed === 0) {
    moveIndex = makeSuboptimalMove();
  } else {
    // Subsequent games: play to win
    moveIndex = findBestMove('O') || findBestMove('X') || findStrategicMove();
  }
  
  if (moveIndex !== null) {
    gameBoard[moveIndex] = 'O';
    document.querySelector(`[data-index="${moveIndex}"]`).textContent = 'O';
    
    if (checkWinner()) {
      updateStatus(gamesPlayed === 0 ? '🤖 Computer wins!' : '🏠 The house (Nicholas) always wins!');
      gameActive = false;
      disableBoard();
      gamesPlayed++;
      return;
    }
    
    if (gameBoard.every(cell => cell !== '')) {
      updateStatus('🤝 It\'s a tie!');
      gameActive = false;
      gamesPlayed++;
      return;
    }
    
    currentPlayer = 'X';
    updateStatus('Your turn! Click a cell');
  }
}

function makeSuboptimalMove() {
  // Intentionally make moves that give the user a better chance to win
  const availableMoves = gameBoard.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  
  // Don't block user wins, don't take winning moves
  const userWinMove = findBestMove('X');
  const computerWinMove = findBestMove('O');
  
  // Filter out winning moves and blocking moves (sometimes)
  let suboptimalMoves = availableMoves.filter(move => 
    move !== computerWinMove && (Math.random() > 0.7 || move !== userWinMove)
  );
  
  // If no suboptimal moves available, just pick any available move
  if (suboptimalMoves.length === 0) {
    suboptimalMoves = availableMoves;
  }
  
  return suboptimalMoves[Math.floor(Math.random() * suboptimalMoves.length)];
}

function showFunFact() {
  setTimeout(() => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    updateStatus(`🎁 Fun Fact: ${randomFact}`);
  }, 1500);
}

function findBestMove(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6] // diagonals
  ];
  
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === '') return c;
    if (gameBoard[a] === player && gameBoard[c] === player && gameBoard[b] === '') return b;
    if (gameBoard[b] === player && gameBoard[c] === player && gameBoard[a] === '') return a;
  }
  return null;
}

function findStrategicMove() {
  // Prefer center, then corners, then edges
  const center = 4;
  const corners = [0, 2, 6, 8];
  const edges = [1, 3, 5, 7];
  
  if (gameBoard[center] === '') return center;
  
  for (let corner of corners) {
    if (gameBoard[corner] === '') return corner;
  }
  
  for (let edge of edges) {
    if (gameBoard[edge] === '') return edge;
  }
  
  return null;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
  });
}

function disableBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.add('disabled');
  });
}

function updateStatus(message) {
  const status = document.getElementById('tictactoe-status');
  if (status) status.textContent = message;
}

/* ----- Grateful Dead History functionality ----- */
function loadGratefulDeadHistory() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${month}-${day}`;
  
  // Since we can't directly access Internet Archive API due to CORS,
  // we'll create a simulated database of notable Grateful Dead shows
  // that occurred on various dates throughout the year
  const gratefulDeadShows = getGratefulDeadShowsForDate(todayString);
  
  const deadContent = document.getElementById('dead-content');
  if (!deadContent) return;
  
  if (gratefulDeadShows.length === 0) {
    deadContent.innerHTML = `
      <div class="no-shows-today">
        <p>🌹 No documented Grateful Dead shows found for ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.</p>
        <p>But every day is a good day to listen to the Dead! 🎵</p>
        <a href="https://archive.org/details/GratefulDead" target="_blank" rel="noopener" class="dead-archive-link">
          🎧 Explore the Archive
        </a>
      </div>
    `;
    return;
  }
  
  const showsHTML = gratefulDeadShows.map(show => `
    <div class="dead-show">
      <div class="dead-show-header">
        <span class="dead-show-date">${show.date}</span>
        <span class="dead-show-venue">${show.venue}</span>
      </div>
      ${show.setlist ? `
        <div class="dead-setlist">
          <h4>Setlist Highlights</h4>
          <div class="dead-setlist-content">${show.setlist}</div>
        </div>
      ` : ''}
      <a href="${show.archiveUrl}" target="_blank" rel="noopener" class="dead-archive-link">
        🎧 Listen on Archive.org
      </a>
    </div>
  `).join('');
  
  deadContent.innerHTML = showsHTML;
}

function getGratefulDeadShowsForDate(dateString) {
  // Simulated database of notable Grateful Dead shows by date (MM-DD format)
  // In a real implementation, this would query the Internet Archive API
  const showDatabase = {
    '05-08': [
      {
        date: 'May 8, 1977',
        venue: 'Barton Hall, Cornell University, Ithaca, NY',
        setlist: `Set I: Minglewood Blues, Loser, El Paso, They Love Each Other, Jack Straw, Deal, Lazy Lightning > Supplication, Brown Eyed Women, Mama Tried, Row Jimmy, Dancing in the Street
        
Set II: Scarlet Begonias > Fire on the Mountain, Estimated Prophet, St. Stephen > Not Fade Away > St. Stephen > Samba in the Rain > Help on the Way > Slipknot! > Franklin's Tower, One More Saturday Night`,
        archiveUrl: 'https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf'
      }
    ],
    '08-27': [
      {
        date: 'August 27, 1972',
        venue: 'Old Renaissance Faire Grounds, Veneta, OR',
        setlist: `Set I: Promised Land, Sugaree, Mr Charlie, Black Throated Wind, Looks Like Rain, Deal, Mexicali Blues, Tennessee Jed, El Paso, Brokedown Palace, Playing in the Band
        
Set II: Dark Star > El Paso > Dark Star > Wharf Rat > Dark Star > Morning Dew, Not Fade Away`,
        archiveUrl: 'https://archive.org/details/gd1972-08-27.mtx.seamons.89456.flac16'
      }
    ],
    '09-03': [
      {
        date: 'September 3, 1977',
        venue: 'Raceway Park, Englishtown, NJ',
        setlist: `Set I: The Music Never Stopped, Sugaree, El Paso, Estimated Prophet, Friend of the Devil, Looks Like Rain, Deal, Mexicali Blues > Row Jimmy, Playing in the Band
        
Set II: Samson and Delilah, Help on the Way > Slipknot! > Franklin's Tower, Estimated Prophet > Eyes of the World > Drums > The Other One > Wharf Rat > Around and Around`,
        archiveUrl: 'https://archive.org/details/gd77-09-03.sbd.hicks.4345.sbeok.shnf'
      }
    ]
  };
  
  return showDatabase[dateString] || [];
}