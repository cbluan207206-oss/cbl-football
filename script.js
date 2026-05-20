document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    loadProducts();
});

let cart = [];

function navigate(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function loadProducts() {
    const products = [
        { name: 'Nike Mercurial', price: 650000, image: 'images/nike.png' },
        { name: 'Adidas Predator', price: 750000, image: 'images/adidas.png' },
        { name: 'Mizuno Neo 3', price: 800000, image: 'images/mizuno.png' }
    ];
    const productGrid = document.getElementById('productGrid');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price.toLocaleString()}đ</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Thêm vào giỏ</button>
        `;
        productGrid.appendChild(productCard);
    });
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCounter();
    alert(`${name} đã thêm vào giỏ hàng!`);
}

function updateCartCounter() {
    document.getElementById('cartCount').innerText = cart.length;
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = cartModal.style.display === 'none' ? 'flex' : 'none';
}

function checkout() {
    alert('Cảm ơn bạn! Đơn hàng đã được đặt.');
    cart = [];
    updateCartCounter();
    toggleCart();
}