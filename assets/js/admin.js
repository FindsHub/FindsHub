let currentProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Form handlers
    const form = document.getElementById('productForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const exportBtn = document.getElementById('exportBtn');

    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    exportBtn.addEventListener('click', exportJSON);
});

async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (response.ok) {
            currentProducts = await response.json();
            renderTable();
        } else {
            document.getElementById('productTableBody').innerHTML = '<tr><td colspan="5" style="text-align:center;">Failed to load products. Check console.</td></tr>';
        }
    } catch (e) {
        console.error('Error loading products.json', e);
        document.getElementById('productTableBody').innerHTML = '<tr><td colspan="5" style="text-align:center;">Error loading products. Check console.</td></tr>';
    }
}

function renderTable() {
    const tbody = document.getElementById('productTableBody');
    if (currentProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No products found.</td></tr>';
        return;
    }

    tbody.innerHTML = currentProducts.map(p => `
        <tr>
            <td class="product-img-cell"><img src="${p.image}" alt="${p.title}"></td>
            <td><strong>${p.title}</strong><br><small style="color:#6b7280; font-size: 0.75rem;">ID: ${p.id}</small></td>
            <td><span style="background:#e5e7eb; padding:2px 6px; border-radius:4px; font-size:0.75rem; text-transform:uppercase;">${p.category}</span></td>
            <td>$${Number(p.price).toFixed(2)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-primary btn-sm" onclick="editProduct('${p.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleFormSubmit(e) {
    e.preventDefault();

    const idField = document.getElementById('productId').value;
    const isNew = !idField;

    // Generate simple ID if new
    const newId = isNew ? 'prod_' + Date.now() : idField;

    const productData = {
        id: newId,
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        affiliateLink: document.getElementById('affiliateLink').value,
        description: document.getElementById('description').value,
        features: document.getElementById('features').value.split(',').map(f => f.trim()).filter(f => f)
    };

    if (isNew) {
        currentProducts.unshift(productData); // Add to top
    } else {
        const idx = currentProducts.findIndex(p => p.id === idField);
        if (idx !== -1) {
            currentProducts[idx] = productData;
        }
    }

    renderTable();
    resetForm();
    alert(isNew ? 'Product added!' : 'Product updated!');
}

function editProduct(id) {
    const product = currentProducts.find(p => p.id === id);
    if (!product) return;

    document.getElementById('formTitle').innerText = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('title').value = product.title;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('image').value = product.image;
    document.getElementById('affiliateLink').value = product.affiliateLink;
    document.getElementById('description').value = product.description;
    document.getElementById('features').value = product.features ? product.features.join(', ') : '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        currentProducts = currentProducts.filter(p => p.id !== id);
        renderTable();
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').innerText = 'Add New Product';
    document.getElementById('productId').value = '';
}

function exportJSON() {
    const dataStr = JSON.stringify(currentProducts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
