let cart = JSON.parse(localStorage.getItem('cbl_cart')) || [];

function showSection(index) {
    document.querySelectorAll('.page').forEach((p, i) => {
        p.classList.toggle('active', i === index);
    });
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cbl_cart', JSON.stringify(cart));
    alert(`${name} đã được thêm vào giỏ!`);
}