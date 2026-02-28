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
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </a>
            <div class="product-info">
                <a href="categories.html?category=${product.category}" class="product-category">${product.category}</a>
                <a href="product.html?id=${product.id}"><h3 class="product-title">${product.title}</h3></a>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">$${Number(product.price).toFixed(2)} | ₹${(Number(product.price) * 83).toFixed(2)}</div>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-outline">Details</a>
                    <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Buy on Amazon</a>
                </div>
            </div>
        </article>
    `).join('');
}

function initHomePage() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        fetchProducts().then(products => {
            renderProductCards(products.slice(0, 6), featuredGrid);
        });
    }
}

function initCategoriesPage() {
    const categoryGrid = document.getElementById('categoryGrid');
    const categoryFilter = document.getElementById('categoryFilter');

    if (categoryGrid) {
        fetchProducts().then(products => {
            // Get URL param for category
            const urlParams = new URLSearchParams(window.location.search);
            const initialCategory = urlParams.get('category') || 'all';

            if (categoryFilter) {
                categoryFilter.value = initialCategory;

                categoryFilter.addEventListener('change', (e) => {
                    const selected = e.target.value;
                    const filtered = selected === 'all' ? products : products.filter(p => p.category === selected);
                    renderProductCards(filtered, categoryGrid);

                    // Update URL without reload
                    const newUrl = new URL(window.location);
                    if (selected === 'all') {
                        newUrl.searchParams.delete('category');
                    } else {
                        newUrl.searchParams.set('category', selected);
                    }
                    window.history.pushState({}, '', newUrl);
                });
            }

            const initialFiltered = initialCategory === 'all' ? products : products.filter(p => p.category === initialCategory);
            renderProductCards(initialFiltered, categoryGrid);
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

            // Build UI
            productDetailContainer.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-detail-info">
                        <a href="categories.html?category=${product.category}" class="product-category">${product.category}</a>
                        <h1 class="product-detail-title">${product.title}</h1>
                        <div class="product-price mb-lg">$${Number(product.price).toFixed(2)} | ₹${(Number(product.price) * 83).toFixed(2)}</div>
                        
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
        });
    }
}
