// ==========================================
// 1. CƠ SỞ DỮ LIỆU SẢN PHẨM (MẢNG TẬP TRUNG)
// ==========================================
const products = [
    {
        id: 1,
        name: "Nike Mercurial Vapor 14",
        price: "650.000",
        sizes: "39 - 45",
        info: "Size: 39 - 45. Độ bền cao, bám sân cực tốt.",
        image: "2_2images.jpeg",
        desc: "Giày đá bóng dòng Mercurial – thiên về tốc độ. Thiết kế cổ thấp, ôm chân, nhẹ và linh hoạt. Trang bị Zoom Air hỗ trợ bật và giảm chấn. Upper mỏng cho cảm giác bóng tốt. Đế TF phù hợp sân cỏ nhân tạo. Phù hợp: tiền đạo, chạy cánh."
    },
    {
        id: 2,
        name: "ADIDAS F50 SPARKFUSION",
        price: "710.000",
        sizes: "39 - 45",
        info: "Size: 39 - 45. Kiểm soát bóng tối ưu.",
        image: "IMG_4113.jpeg",
        desc: "Adidas F50 TF là dòng giày dành cho những cầu thủ yêu thích tốc độ và sự linh hoạt trên sân cỏ nhân tạo. Thiết kế siêu nhẹ giúp bứt tốc nhanh, di chuyển linh hoạt và xử lý bóng gọn hơn. Upper mỏng ôm chân tạo cảm giác bóng chân thật, kết hợp đế TF bám sân tốt giúp đổi hướng ổn định và tự tin hơn khi thi đấu. Phù hợp: đá cánh, tiền đạo, người chơi tốc độ. Ưu điểm: nhẹ, ôm chân, tăng tốc tốt."
    },
    {
        id: 3,
        name: "Mizuno Alpha 3 Elite",
        price: "760.000",
        sizes: "38 - 43",
        info: "Size: 38 - 43. Đệm khí êm ái cho chạy.",
        image: "4images.png",
        desc: "Dòng giày tốc độ nhẹ nhất của Mizuno (~195g). Upper knit siêu mỏng cho cảm giác bóng chân thật. Đệm Mizuno Enerzy êm ái, hoàn trả lực tốt. Phù hợp cho tiền đạo và cầu thủ chạy cánh."
    },
    {
        id: 4,
        name: "Nike Mercurial M3P TF",
        price: "650.000",
        sizes: "39 - 45",
        info: "Size: 39 - 45. Thiết kế tập trung hiệu năng.",
        image: "IMG_4099.png",
        desc: "Phiên bản Nike Mercurial M3P TF màu đen mang phong cách tối giản mạnh mẽ. Thiết kế nhẹ, linh hoạt, hỗ trợ di chuyển tốc độ cao.\n\nĐế cao su TF êm, phù hợp sân cỏ nhân tạo tại Việt Nam.\n\n👉 Ưu điểm: dễ mang, êm chân, bền."
    },
    {
        id: 5,
        name: "Nike Mercurial 17 TF",
        price: "740.000",
        sizes: "39 - 45",
        info: "Size: 39 - 45. Màu xanh ngọc nổi bật.",
        image: "IMG_4104.jpeg",
        desc: "Thiết kế xanh ngọc nổi bật. Form giày ôm chân, hỗ trợ bứt tốc và xử lý bóng nhanh.\n\nPhù hợp đá cánh, tiền đạo thiên về rê bóng – dứt điểm.\n\n👉 Lưu ý: form hơi bó, chân bè nên tăng 0.5 size."
    }
];

// ==========================================
// 2. BẢO MẬT & KHỞI TẠO LOCALSTORAGE
// ==========================================
function safeGetStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn('localStorage không khả dụng:', e);
        return [];
    }
}

function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Không thể lưu vào localStorage:', e);
    }
}

let cart = safeGetStorage('cbl_cart');
let billTimeout = null; // Quản lý đóng mở hóa đơn không bị xung đột đơn liên tiếp

// ==========================================
// 3. TỰ ĐỘNG ĐỔ DỮ LIỆU SẢN PHẨM (RENDER UI)
// ==========================================
function renderProducts(productsList = products) {
    const container = document.getElementById('product-grid-container');
    if (!container) return;
    
    if (productsList.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%; padding:20px; color:#888;">Không tìm thấy sản phẩm phù hợp.</p>';
        return;
    }

    container.innerHTML = productsList.map(prod => `
        <div class="product-card">
            <img src="${prod.image}" alt="${prod.name}" onclick="viewDetail(${prod.id})" style="cursor: pointer;">
            <h3>${prod.name}</h3>
            <p class="price">${prod.price}đ</p>
            <p class="info">${prod.info}</p>
            <button onclick="addToCart('${prod.name}', '${prod.price}')">Thêm vào giỏ</button>
        </div>
    `).join('');
}

// ==========================================
// 4. LOGIC ĐIỀU HƯỚNG TRANG (SPA)
// ==========================================
function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// ==========================================
// 5. QUẢN LÝ GIỎ HÀNG (CÓ THÊM LOGIC SỐ LƯỢNG)
// ==========================================
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    alert(`Đã thêm ${name} vào giỏ!`);
}

function saveCart() {
    safeSetStorage('cbl_cart', cart);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.innerText = totalItems;
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        renderCartItems();
    }
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('total-price');
    
    if (!list || !totalEl) return;
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px; color:#888;">Chưa có sản phẩm nào.</p>';
        totalEl.innerText = '0đ';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cleanPrice = parseInt(item.price.replace(/[.,]/g, '')) || 0;
        const itemTotal = cleanPrice * item.quantity;
        total += itemTotal;

        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <div style="text-align:left;">
                    <span style="display:block; font-weight:bold;">${item.name} (x${item.quantity})</span>
                    <span style="color:#ff4757;">${itemTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <button onclick="removeFromCart(${index})" 
                        style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                    Xóa
                </button>
            </div>
        `;
    });

    list.innerHTML = html;
    totalEl.innerText = total.toLocaleString('vi-VN') + "đ";
}

function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartUI(); 
    renderCartItems(); 
}

// ==========================================
// 6. ĐẶT HÀNG & THỦ TỤC THANH TOÁN (CHECKOUT)
// ==========================================
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function confirmOrder() {
    const name = document.getElementById('cus-name').value.trim();
    const phone = document.getElementById('cus-phone').value.trim();
    const address = document.getElementById('cus-address').value.trim();
    const note = document.getElementById('cus-note').value.trim();
    const size = document.getElementById('cus-size').value;

    if (!size || !name || !phone || !address) {
        alert("Vui lòng chọn Size và điền đủ thông tin nhận hàng!");
        return;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (đúng 10 chữ số)!");
        return;
    }

    let productNames = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");
    let totalPrice = document.getElementById('total-price').innerText;

    // Gửi thông báo đến Bot Telegram
    const messageContent = `👟 ĐƠN HÀNG MỚI - CBL SOCCER 👟\n----------------------------\n📦 Sản phẩm: ${productNames}\n📏 Size: ${size}\n💰 Tổng cộng: ${totalPrice}\n👤 Khách: ${name}\n📞 SĐT: ${phone}\n📍 Địa chỉ: ${address}\n📝 Ghi chú: ${note || 'Không có'}\n----------------------------\n🚀 Check đơn ngay chủ shop ơi!`;
    
    sendTelegramMessage(messageContent).catch((err) => {
        console.error('Không thể gửi thông báo Telegram:', err);
    });

    // In hoá đơn hiển thị lên UI cho khách
    const billDetail = document.getElementById('bill-detail');
    if (billDetail) {
        billDetail.innerHTML = `
            <p><b>Sản phẩm:</b> ${productNames}</p>
            <p><b>Size:</b> <span style="color:blue; font-weight:bold;">${size}</span></p>
            <p><b>Tổng tiền:</b> <span style="color:red; font-weight:bold;">${totalPrice}</span></p>
            <hr style="border: 0.5px dashed #ddd; margin: 10px 0;">
            <p><b>Người nhận:</b> ${name}</p>
            <p><b>SĐT:</b> ${phone}</p>
            <p><b>Địa chỉ:</b> ${address}</p>
            <p><b>Ghi chú:</b> ${note || 'Không có'}</p>
        `;
    }

    document.getElementById('checkout-modal').style.display = 'none';
    const billModal = document.getElementById('bill-modal');
    if (billModal) billModal.style.display = 'flex';

    // Làm sạch giỏ hàng hoàn tất đơn
    cart = [];
    saveCart();
    updateCartUI();

    // Reset bộ đếm thời gian tránh xung đột hoá đơn
    if (billTimeout) clearTimeout(billTimeout);

    // Tự động đóng Bill sau 6 giây và làm sạch form nhập liệu
    billTimeout = setTimeout(() => {
        if (billModal) billModal.style.display = 'none';
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 6000);
}

// ==========================================
// 7. POPUP CHI TIẾT SẢN PHẨM (AN TOÀN BẢO MẬT)
// ==========================================
function viewDetail(id) {
    const prod = products.find(p => p.id === id);
    if (prod) {
        showProductDetail(prod.name, prod.price, prod.sizes, prod.desc, prod.image);
    }
}

function showProductDetail(name, price, size, desc, img) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    if (!content || !modal) return;

    content.innerHTML = `
        <img src="${img}" style="width:100%; border-radius:10px; margin-bottom:15px;" alt="${name}">
        <h2>${name}</h2>
        <p style="color:#ff4757; font-weight:bold; font-size:20px;">${price}đ</p>
        <p><b>Size:</b> ${size}</p>
        <p style="color:#666; margin:15px 0; white-space: pre-line;">${desc}</p>
        <button id="modal-add-btn" style="width:100%; padding:12px; background:#27ae60; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">THÊM VÀO GIỎ NGAY</button>
    `;
    
    // Gán sự kiện Click trực tiếp thông qua JS để loại bỏ rủi ro vỡ ký tự đặc biệt ở HTML
    document.getElementById('modal-add-btn').onclick = function() {
        addToCart(name, price);
        closeProductDetail();
    };

    modal.style.display = 'flex';
}

function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
}

// ==========================================
// 8. TÌM KIẾM SẢN PHẨM CHUẨN REAL-TIME
// ==========================================
function searchProduct() {
    let input = document.getElementById('product-search').value.toLowerCase().trim();

    if (input.length > 0) {
        showSection(1); // Tự chuyển tab Sản Phẩm khi bắt đầu gõ
    }

    // Lọc mảng sản phẩm gốc thay vì ẩn/hiện DOM thô sơ
    const filteredProducts = products.filter(prod => 
        prod.name.toLowerCase().includes(input)
    );

    renderProducts(filteredProducts);
}

// ==========================================
// 9. API GỬI TELEGRAM (PHƯƠNG THỨC POST AN TOÀN)
// ==========================================
async function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0";
    const chatId = "7901882812";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    });
    
    if (!response.ok) {
        throw new Error(`Telegram API lỗi: ${response.status}`);
    }
    return response;
}

// Khởi chạy khi trang tải xong tải toàn bộ tài nguyên
window.onload = () => {
    renderProducts(); // Tự động hiển thị sản phẩm khi load trang
    updateCartUI();
    showSection(0); 
};