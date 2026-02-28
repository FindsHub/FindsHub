// State
let products = [];
let filteredProducts = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

// Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const loadMoreBtn = document.getElementById('load-more-btn');

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        
        // Routing logic based on page and URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        if (window.location.pathname.includes('product.html')) {
            const productId = urlParams.get('id');
            renderProductDetails(productId);
            renderRelatedProducts(productId);
        } else if (window.location.pathname.includes('category.html')) {
            const category = urlParams.get('cat');
            if (category && categoryFilter) {
                categoryFilter.value = category;
            }
            applyFilters();
        } else if (productGrid) {
            // Home page
            filteredProducts = [...products];
            renderGrid();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        if (productGrid) {
            productGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">Sorry, failed to load products.</p>';
        }
    }
}

function setupEventListeners() {
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

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (window.location.pathname.includes('product.html')) {
                 window.location.href = `category.html?search=${encodeURIComponent(e.target.value)}`;
                 return;
            }
            applyFilters();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderGrid(true); // true means append
        });
    }
    
    // Check if there's a search param on category page init
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && searchInput && window.location.pathname.includes('category.html')) {
         searchInput.value = searchQuery;
         applyFilters();
    }
}

function applyFilters() {
    let result = [...products];

    // Search filter
    if (searchInput && searchInput.value) {
        const query = searchInput.value.toLowerCase();
        result = result.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.shortDescription.toLowerCase().includes(query)
        );
    }

    // Category filter
    if (categoryFilter && categoryFilter.value) {
        result = result.filter(p => p.category === categoryFilter.value);
    }

    // Sort
    if (sortFilter && sortFilter.value) {
        const sortVal = sortFilter.value;
        if (sortVal === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortVal === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (sortVal === 'newest') {
            result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        }
    }

    filteredProducts = result;
    currentPage = 1; // Reset to first page
    renderGrid(false); // Replace content
}

function renderGrid(append = false) {
    if (!productGrid) return;

    if (!append) {
        productGrid.innerHTML = '';
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const itemsToShow = filteredProducts.slice(startIndex, endIndex);

    if (filteredProducts.length === 0 && !append) {
        productGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No products found taking current filters.</p>';
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
        return;
    }

    itemsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/300x250?text=Product+Image'">
            </a>
            <div class="card-content">
                <span class="category-badge">${product.category}</span>
                <a href="product.html?id=${product.id}">
                    <h3 class="product-title">${product.title}</h3>
                </a>
                <p class="product-desc">${product.shortDescription}</p>
                <div class="card-footer">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <span class="rating">⭐ ${product.rating}</span>
                </div>
                <a href="${product.affiliateLink}" target="_blank" rel="noopener nofollow" class="btn btn-accent">Check Price on Amazon</a>
            </div>
        `;
        productGrid.appendChild(card);
    });

    // Handle Load More button visibility
    if (loadMoreBtn) {
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.classList.remove('hidden');
        }
    }
}

function renderProductDetails(id) {
    const product = products.find(p => p.id === id);
    const detailContainer = document.getElementById('product-detail-container');
    
    if (!product || !detailContainer) {
        if (detailContainer) detailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }

    // Update page title
    document.title = `${product.title} | FindsHub`;

    const prosHtml = product.pros ? product.pros.map(p => `<li>${p}</li>`).join('') : '';
    const consHtml = product.cons ? product.cons.map(c => `<li>${c}</li>`).join('') : '';

    detailContainer.innerHTML = `
        <div class="product-detail-wrapper">
            <div class="detail-gallery">
                <img src="${product.image}" alt="${product.title}" class="detail-image" onerror="this.src='https://via.placeholder.com/600x500?text=Product+Image'">
            </div>
            <div class="detail-info">
                <span class="category-badge">${product.category}</span>
                <h1>${product.title}</h1>
                <div class="rating mb-4" style="font-size: 1.1rem;">⭐⭐⭐⭐⭐ ${product.rating} / 5.0</div>
                <div class="detail-price">$${product.price.toFixed(2)}</div>
                <p class="detail-desc">${product.fullDescription}</p>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h3>Pros</h3>
                        <ul>${prosHtml}</ul>
                    </div>
                    <div class="cons">
                        <h3>Cons</h3>
                        <ul>${consHtml}</ul>
                    </div>
                </div>

                <a href="${product.affiliateLink}" target="_blank" rel="noopener nofollow" class="btn btn-accent" style="font-size: 1.25rem; padding: 1rem 2rem;">Check Current Price on Amazon</a>
                <p class="mt-4 text-center" style="font-size: 0.8rem; color: var(--text-secondary);">
                    FindsHub earns a commission from qualifying purchases. 
                </p>
            </div>
        </div>
    `;
}

function renderRelatedProducts(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Find products in same category, exclude current
    let related = products.filter(p => p.category === product.category && p.id !== id);
    
    // If not enough, pad with trending
    if (related.length < 4) {
        const trending = products.filter(p => p.trending && p.id !== id && p.category !== product.category);
        related = [...related, ...trending];
    }
    
    filteredProducts = related.slice(0, 4);
    currentPage = 1;
    // Assume there is a related-grid element on the product.html page
    // We can reuse renderGrid by temporarily reassigning productGrid if we want, or do it manually.
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
        // Simple manual render for related
        relatedGrid.innerHTML = '';
        filteredProducts.forEach(p => {
             const card = document.createElement('div');
             card.className = 'product-card';
             card.innerHTML = `
                 <a href="product.html?id=${p.id}">
                     <img src="${p.image}" alt="${p.title}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/300x250?text=Product+Image'">
                 </a>
                 <div class="card-content" style="padding: 1rem;">
                     <a href="product.html?id=${p.id}">
                         <h3 class="product-title" style="font-size: 1rem;">${p.title}</h3>
                     </a>
                     <div class="card-footer" style="margin-bottom: 0;">
                         <span class="price" style="font-size: 1.1rem;">$${p.price.toFixed(2)}</span>
                     </div>
                 </div>
             `;
             relatedGrid.appendChild(card);
        });
    }
}
