document.addEventListener('DOMContentLoaded', () => {
    // Nav Toggle for Mobile
    const navToggle = document.getElementById('navToggle');
    const header = document.querySelector('.header');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('nav-active');
        });
    }

    // Initialize Pages
    initHomePage();
    initCategoriesPage();
    initProductPage();
});

// Fetch products from JSON
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.error('Failed to load products.json:', e);
        return [];
    }
}

// Render product card HTML into a container
function renderProductCards(products, container) {
    if (products.length === 0) {
        container.innerHTML = '<p class="loading-state">No products found for this category.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <article class="product-card">
            <a href="product.html?id=${product.id}" class="product-image-wrapper">
                ${product.topDeal ? '<span class="top-deal-badge">Top Deal</span>' : ''}
                <img src="${product.images[0]}" alt="${product.title}" loading="lazy">
            </a>
            <div class="product-info">
                <a href="categories.html?category=${product.category}" class="product-category">${product.category}</a>
                <a href="product.html?id=${product.id}"><h3 class="product-title">${product.title}</h3></a>
                <p class="product-desc">${product.description}</p>
                <div class="product-price" style="display: flex; align-items: baseline; gap: 8px;">
                    $${product.priceUSD} 
                    <span style="color: var(--color-text-muted);">| ₹${product.priceINR}</span>
                </div>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-outline">Details</a>
                    <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Buy on Amazon</a>
                </div>
            </div>
        </article>
    `).join('');
}

function initHomePage() {
    const topDeals = document.getElementById('topDealsCarosuel');
    const under499 = document.getElementById('under499Carousel');
    const under999 = document.getElementById('under999Carousel');
    const premium = document.getElementById('premiumCarousel');

    if (topDeals || under499 || under999 || premium) {
        fetchProducts().then(products => {
            if (topDeals) {
                renderProductCards(products.filter(p => p.topDeal), topDeals);
            }
            if (under499) {
                renderProductCards(products.filter(p => p.priceINR < 500), under499);
            }
            if (under999) {
                renderProductCards(products.filter(p => p.priceINR >= 500 && p.priceINR < 1000), under999);
            }
            if (premium) {
                renderProductCards(products.filter(p => p.priceINR >= 1000), premium);
            }
        });
    }
}

function initCategoriesPage() {
    const categoryGrid = document.getElementById('categoryGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (categoryGrid) {
        fetchProducts().then(products => {
            const urlParams = new URLSearchParams(window.location.search);
            const initialCategory = urlParams.get('category') || 'all';
            const initialMaxPrice = parseInt(urlParams.get('maxPrice'));
            const initialMinPrice = parseInt(urlParams.get('minPrice'));

            let currentCategory = initialCategory;
            let currentPriceRange = 'all';

            if (initialMaxPrice === 499) currentPriceRange = 'under499';
            if (initialMaxPrice === 999) currentPriceRange = '500-999';
            if (initialMinPrice === 1000) currentPriceRange = '1000-1999';

            if (categoryFilter) categoryFilter.value = currentCategory;
            if (priceFilter) priceFilter.value = currentPriceRange;

            function applyFilters() {
                let filtered = products;

                if (currentCategory !== 'all') {
                    filtered = filtered.filter(p => p.category === currentCategory);
                }

                if (currentPriceRange !== 'all') {
                    if (currentPriceRange === 'under499') filtered = filtered.filter(p => p.priceINR < 500);
                    else if (currentPriceRange === '500-999') filtered = filtered.filter(p => p.priceINR >= 500 && p.priceINR < 1000);
                    else if (currentPriceRange === '1000-1999') filtered = filtered.filter(p => p.priceINR >= 1000 && p.priceINR < 2000);
                    else if (currentPriceRange === '2000plus') filtered = filtered.filter(p => p.priceINR >= 2000);
                }

                renderProductCards(filtered, categoryGrid);

                // Update URL selectively
                const newUrl = new URL(window.location);
                if (currentCategory === 'all') newUrl.searchParams.delete('category');
                else newUrl.searchParams.set('category', currentCategory);
                window.history.replaceState({}, '', newUrl);
            }

            if (categoryFilter) {
                categoryFilter.addEventListener('change', (e) => {
                    currentCategory = e.target.value;
                    applyFilters();
                });
            }

            if (priceFilter) {
                priceFilter.addEventListener('change', (e) => {
                    currentPriceRange = e.target.value;
                    applyFilters();
                });
            }

            applyFilters();
        });
    }
}

function initProductPage() {
    const productDetailContainer = document.getElementById('productDetailContainer');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            productDetailContainer.innerHTML = '<p class="loading-state">Product not found. <a href="categories.html">Return to shop</a></p>';
            return;
        }

        fetchProducts().then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                productDetailContainer.innerHTML = '<p class="loading-state">Product not found. <a href="categories.html">Return to shop</a></p>';
                return;
            }

            document.title = `${product.title} - FindsHub`;

            const galleryHtml = `
                <div class="product-gallery">
                    <div class="product-detail-image-wrapper">
                        <img src="${product.images[0]}" alt="${product.title}" id="mainImage">
                        ${product.images.length > 1 ? `
                            <button class="gallery-nav prev" aria-label="Previous image" id="prevImage">&lt;</button>
                            <button class="gallery-nav next" aria-label="Next image" id="nextImage">&gt;</button>
                        ` : ''}
                    </div>
                    ${product.images.length > 1 ? `
                    <div class="product-thumbnails">
                        ${product.images.map((img, idx) => `
                            <button class="thumbnail-btn ${idx === 0 ? 'active' : ''}" data-image="${img}" aria-label="View image ${idx + 1}">
                                <img src="${img}" alt="Thumbnail ${idx + 1}">
                            </button>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            `;

            // Build UI
            productDetailContainer.innerHTML = `
                <a href="javascript:history.back()" class="back-btn mb-md" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 500;">
                    <span style="font-size: 1.2rem;">&larr;</span> Back
                </a>
                <div class="product-detail-layout">
                    ${galleryHtml}
                    <div class="product-detail-info">
                        <a href="categories.html?category=${product.category}" class="product-category">${product.category}</a>
                        <h1 class="product-detail-title">${product.title}</h1>
                        <div class="product-price">$${product.priceUSD}</div>
                        <div class="product-price-inr">Approx ₹${product.priceINR}</div>
                        
                        <p class="product-detail-desc mb-lg">${product.description}</p>
                        
                        ${product.features && product.features.length > 0 ? `
                        <div class="product-features mb-lg">
                            <h3>Features & Details</h3>
                            <ul>
                                ${product.features.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                        
                        <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block mb-lg" style="height: 56px; font-size: 1.1rem; margin-top: auto;">Buy on Amazon</a>
                        <p class="affiliate-notice">FindsHub is an Amazon Associate. We earn a commission from qualifying purchases at no extra cost to you.</p>
                    </div>
                </div>
            `;

            // Gallery logic
            const mainImg = document.getElementById('mainImage');
            const thumbnails = document.querySelectorAll('.thumbnail-btn');
            const prevBtn = document.getElementById('prevImage');
            const nextBtn = document.getElementById('nextImage');
            let currentIndex = 0;

            function updateImage(index) {
                if (index < 0) index = product.images.length - 1;
                if (index >= product.images.length) index = 0;
                currentIndex = index;

                const newSrc = product.images[currentIndex];

                // Fade effect
                mainImg.style.opacity = '0.5';
                setTimeout(() => {
                    mainImg.src = newSrc;
                    mainImg.style.opacity = '1';
                }, 150);

                // Update active state
                thumbnails.forEach((t, i) => {
                    if (i === currentIndex) {
                        t.classList.add('active');
                    } else {
                        t.classList.remove('active');
                    }
                });
            }

            if (thumbnails.length > 0) {
                thumbnails.forEach((btn, index) => {
                    btn.addEventListener('click', () => updateImage(index));
                });
            }

            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => updateImage(currentIndex - 1));
                nextBtn.addEventListener('click', () => updateImage(currentIndex + 1));
            }
        });
    }
}
