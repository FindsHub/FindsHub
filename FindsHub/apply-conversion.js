const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/omkar/Desktop/Project/FindsHub';
const cssPath = path.join(dir, 'css', 'styles.css');

let cssContent = fs.readFileSync(cssPath, 'utf-8');

const newStyles = `
/* --- NEW CONVERSION HOMEPAGE STYLES --- */

/* Hero Enhancements */
.hero-conversion {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  color: white;
  padding: 4rem 1rem 3rem;
  text-align: center;
}
.hero-conversion h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: -0.025em;
}
.hero-conversion p {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 650px;
  margin: 0 auto 2rem;
  color: #e2e8f0;
}
.hero-search-container {
  max-width: 500px;
  margin: 0 auto 2rem;
}
.hero-search {
  background-color: white;
  display: flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  box-shadow: var(--shadow-md);
}
.hero-search input {
  border: none;
  background: transparent;
  padding: 0.75rem 0.5rem;
  outline: none;
  width: 100%;
  color: var(--text-primary);
  font-size: 1.125rem;
}
.hero-cta {
  font-size: 1.125rem;
  padding: 1rem 2rem;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 3rem;
  box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.39);
}

/* Trust Badges */
.trust-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}
.badge-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #cbd5e1;
  font-weight: 500;
}
.badge-item svg {
  color: #10b981; /* Green check */
}

/* Scrollable Category Chips */
.category-scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.5rem 1rem 1.5rem;
  margin: 0 -1rem; /* Negative margin to allow side bleed on mobile */
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; /* Smoother scrolling on iOS */
}
/* Hide scrollbar for clean look */
.category-scroll-container::-webkit-scrollbar {
  display: none;
}
.category-scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-chip {
  flex: 0 0 auto;
  min-width: 120px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  scroll-snap-align: start;
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.category-chip:active, .category-chip:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.chip-icon {
  font-size: 2rem;
}
.category-chip span {
  font-weight: 600;
  font-size: 0.875rem;
}

/* Trust & Authority Section */
.trust-section {
  background-color: var(--text-primary);
  color: white;
  padding: 4rem 1rem;
  margin-top: 4rem;
}
.trust-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}
.trust-card {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.trust-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.trust-card h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: white;
}
.trust-card p {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Sticky Mobile CTA */
.mobile-sticky-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--surface);
  padding: 1rem;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  justify-content: center;
}
.sticky-btn {
  width: 100%;
  max-width: 400px;
  font-size: 1.125rem;
  padding: 1rem;
  border-radius: 9999px;
  box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.39);
}
/* Hide default search in header on mobile if we have heroinput */
@media (max-width: 1023px) {
  .header-search { display: none !important; }
}

/* Desktop Overrides for New Sections */
@media (min-width: 640px) {
  .hero-conversion h1 { font-size: 3rem; }
  .trust-grid { grid-template-columns: repeat(2, 1fr); }
  .category-scroll-container { justify-content: center; flex-wrap: wrap; margin: 0; }
  .category-chip { min-width: 150px; }
}
@media (min-width: 1024px) {
  .hero-conversion { padding: 6rem 2rem 4rem; }
  .hero-conversion h1 { font-size: 3.5rem; }
  .trust-grid { grid-template-columns: repeat(4, 1fr); }
  .mobile-sticky-cta { display: none; } /* Hide sticky CTA on desktop */
  .category-scroll-container { padding: 1rem 0; }
}
`;

// Append new styles
if (!cssContent.includes('--- NEW CONVERSION HOMEPAGE STYLES ---')) {
    fs.writeFileSync(cssPath, cssContent + '\n' + newStyles, 'utf-8');
}

// Ensure products.json has a "Best Seller" or "Editor's Choice" badge field
const jsonPath = path.join(dir, 'products.json');
let products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Add badges if they don't exist
const badges = ["Best Seller", "Editor's Choice", "Budget Pick", null];
products = products.map((p, index) => {
    if (!p.badge) {
        // Randomly assign a badge for styling demonstration, or leave null
        p.badge = badges[index % badges.length];
    }
    return p;
});
fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), 'utf8');

// Update JS renderGrid to output the badge
const jsPath = path.join(dir, 'js', 'script.js');
let jsContent = fs.readFileSync(jsPath, 'utf-8');

// The replacement logic for card HTML
const oldCardHtml = `<div class="card-content">
                <span class="category-badge">\${product.category}</span>`;

const newCardHtml = `<div class="card-content" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <span class="category-badge" style="margin-bottom: 0;">\${product.category}</span>
                    \${product.badge ? '<span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; background-color: var(--accent); color: white; padding: 0.2rem 0.6rem; border-radius: 9999px;">' + product.badge + '</span>' : ''}
                </div>`;

if (jsContent.includes(oldCardHtml)) {
    jsContent = jsContent.replace(oldCardHtml, newCardHtml);
    fs.writeFileSync(jsPath, jsContent, 'utf-8');
}

console.log('Conversion layout applied!');
