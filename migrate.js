const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/omkar/Desktop/Project/FindsHub';

// 1. Update HTML files to include menu toggle button
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find the header section to patch the navbar
    // We want to insert the hamburger button right after the logo
    const logoRegex = /(<a href="index\.html" class="logo">[\s\S]*?<\/a>)/;

    if (content.match(logoRegex) && !content.includes('menu-toggle')) {
        content = content.replace(logoRegex, `$1\n            <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">\n                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\n            </button>`);
    }

    // Give nav-links an ID so we can toggle it easily
    if (!content.includes('id="nav-links"')) {
        content = content.replace('<nav class="nav-links">', '<nav class="nav-links" id="nav-links">');
    }

    // Update <meta name="viewport"> just to be sure it's perfect
    if (!content.includes('width=device-width, initial-scale=1.0, maximum-scale=5.0')) {
        content = content.replace(/<meta name="viewport" content="[^"]*">/, '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
});

// 2. Overwrite CSS to be mobile first
const cssPath = path.join(dir, 'css', 'styles.css');
const newCSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --accent: #f59e0b;
  --accent-hover: #d97706;
  --bg: #f8fafc;
  --surface: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

ul { list-style: none; }

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Layout - Mobile First */
.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  margin: 0 auto;
}

/* Header & Navigation */
header {
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo span { color: var(--text-primary); }

.menu-toggle {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  min-width: 48px;
  margin-right: -0.5rem;
}

.search-bar {
  width: 100%;
  order: 3;
  margin-top: 1rem;
  display: flex;
  background-color: var(--bg);
  border-radius: 9999px;
  padding: 0.25rem 1rem;
  border: 1px solid var(--border);
}

.search-bar input {
  border: none;
  background: transparent;
  padding: 0.75rem 0.5rem;
  outline: none;
  width: 100%;
  color: var(--text-primary);
  font-size: 1rem;
}

.nav-links {
  width: 100%;
  order: 4;
  display: none;
  flex-direction: column;
  padding-top: 0.5rem;
}
.nav-links.active {
  display: flex;
}

.nav-links a {
  padding: 1rem 0;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition);
  border-bottom: 1px solid var(--border);
  display: block;
}
.nav-links a:last-child {
  border-bottom: none;
}
.nav-links a:hover,
.nav-links a.active {
  color: var(--primary);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: var(--transition);
  cursor: pointer;
  border: none;
  width: 100%;
  min-height: 48px;
  font-size: 1rem;
}

.btn-primary { background-color: var(--primary); color: white; }
.btn-primary:active, .btn-primary:hover { background-color: var(--primary-dark); }

.btn-accent { background-color: var(--accent); color: white; }
.btn-accent:active, .btn-accent:hover { background-color: var(--accent-hover); }

.btn-outline { background-color: transparent; border: 1px solid var(--border); color: var(--text-primary); }
.btn-outline:active, .btn-outline:hover { background-color: var(--bg); }

/* Hero Section */
.hero {
  background: linear-gradient(to right, #1e3a8a, #3b82f6);
  color: white;
  padding: 3rem 1rem;
  text-align: center;
}
.hero h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}
.hero p {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 1.5rem;
}

/* Dynamic Grid - Mobile First (1 column) */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 2rem 0 1.5rem;
  color: var(--text-primary);
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border);
}

.card-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  background-color: #f1f5f9;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary);
  background-color: #dbeafe;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  align-self: flex-start;
  margin-bottom: 0.75rem;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.rating {
  color: #fbbf24;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Category Controls */
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: var(--surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.filters, .sort { width: 100%; }
.filters select, .sort select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  min-height: 48px; /* touch target */
}

/* Product Detail Page */
.product-detail-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 3rem;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
}

.detail-image {
  width: 100%;
  border-radius: var(--radius-lg);
  object-fit: cover;
  background-color: var(--bg);
}

.detail-info h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.detail-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1rem;
}

.detail-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.pros h3 { color: #10b981; margin-bottom: 0.5rem; }
.cons h3 { color: #ef4444; margin-bottom: 0.5rem; }
.pros-cons ul { padding-left: 1.25rem; list-style: disc; color: var(--text-secondary); }

/* Static Pages Content */
.static-page {
  background-color: var(--surface);
  padding: 1.5rem 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin: 1.5rem auto;
  max-width: 800px;
}
.static-page h1 { margin-bottom: 1rem; font-size: 1.75rem; }
.static-page h2 { margin: 1.5rem 0 1rem; font-size: 1.25rem; }
.static-page p { margin-bottom: 1rem; color: var(--text-secondary); }

/* Footer */
footer {
  background-color: #0f172a;
  color: #94a3b8;
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-col h4 {
  color: white;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.footer-links li { margin-bottom: 0.75rem; }
.footer-links a { display: block; padding: 0.25rem 0; transition: var(--transition); }
.footer-links a:active, .footer-links a:hover { color: white; }

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.875rem;
}

/* Utilities */
.text-center { text-align: center; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.hidden { display: none !important; }

/* Desktop & Tablet Overrides (min-width logic) */
@media (min-width: 640px) {
  /* Tablet */
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .pros-cons { grid-template-columns: 1fr 1fr; }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
  .hero { padding: 4rem 2rem; }
  .hero h1 { font-size: 2.5rem; }
}

@media (min-width: 1024px) {
  /* Desktop */
  .navbar { padding: 0; }
  .menu-toggle { display: none; }
  
  .search-bar {
    width: 300px;
    order: 2;
    margin-top: 0;
  }
  
  .nav-links {
    width: auto;
    order: 3;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding-top: 0;
  }
  
  .nav-links a { border-bottom: none; padding: 0; }
  .nav-links a:hover { color: var(--primary); }

  .hero { padding: 5rem 2rem; }
  .hero h1 { font-size: 3rem; }
  
  .controls-bar { flex-direction: row; align-items: center; justify-content: space-between; gap: 1rem; }
  .filters, .sort { width: auto; }
  .filters select, .sort select { width: auto; }

  .product-grid { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  
  .product-detail-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 2rem;
    background-color: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
  
  .footer-grid { grid-template-columns: repeat(3, 1fr); gap: 3rem; }
  
  .static-page { padding: 3rem; }
}

@media (min-width: 1280px) {
  /* Larger Desktops */
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}
`;

fs.writeFileSync(cssPath, newCSS, 'utf-8');

// 3. Patch JS file for menu toggle + loading="lazy" in rendering
const jsPath = path.join(dir, 'js', 'script.js');
let jsContent = fs.readFileSync(jsPath, 'utf-8');

// Add menu toggle logic in setupEventListeners if not present
if (!jsContent.includes("document.getElementById('menu-toggle')")) {
    const jsToggleCode = `
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon path
            const icon = menuToggle.querySelector('svg');
            if(navLinks.classList.contains('active')) {
                icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });
    }
`;
    // Insert into setupEventListeners
    jsContent = jsContent.replace(/function setupEventListeners\(\) \{/, 'function setupEventListeners() {' + jsToggleCode);
}

// Add loading="lazy" to grid images
jsContent = jsContent.replace(/<img src="\$\{product\.image\}" alt="\$\{product\.title\}" class="card-image"/g, '<img src="${product.image}" alt="${product.title}" class="card-image" loading="lazy"');
// Add loading="lazy" to related images
jsContent = jsContent.replace(/<img src="\$\{p\.image\}" alt="\$\{p\.title\}" class="card-image"/g, '<img src="${p.image}" alt="${p.title}" class="card-image" loading="lazy"');

fs.writeFileSync(jsPath, jsContent, 'utf-8');

console.log("Migration complete!");
