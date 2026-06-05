// SỬA LỖI 2: Bọc localStorage bằng try-catch phòng trường hợp bị chặn (Safari private, WebView, iframe)
function safeGetStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        console.warn('localStorage không khả dụng:', e);
        return null;
    }
}

function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Không thể lưu vào localStorage:', e);
    }
}

// Khởi tạo giỏ hàng từ localStorage (có xử lý lỗi)
let cart = safeGetStorage('cbl_cart') || [];

function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, i) => {
        if (i === index) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    // Đóng các modal nếu đang mở khi chuyển trang
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartUI();
    alert("Đã thêm " + name + " vào giỏ!");
}

function saveCart() {
    // SỬA LỖI 2: Dùng hàm bảo mật thay vì gọi localStorage trực tiếp
    safeSetStorage('cbl_cart', cart);
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.length;
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
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
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px;">Chưa có sản phẩm nào.</p>';
        totalEl.innerText = '0đ';
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach((item, index) => {
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <div style="text-align:left;">
                    <span style="display:block; font-weight:bold;">${item.name}</span>
                    <span style="color:#ff4757;">${item.price}đ</span>
                </div>
                <button onclick="removeFromCart(${index})" 
                        style="background:#ff4757; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                    Hủy
                </button>
            </div>
        `;
        // SỬA LỖI 4: Chuẩn hóa parse giá — xóa cả dấu chấm lẫn dấu phẩy trước khi parseInt
        const cleanPrice = item.price.replace(/[.,]/g, '');
        const parsedPrice = parseInt(cleanPrice);
        if (!isNaN(parsedPrice)) {
            total += parsedPrice;
        }
    });

    list.innerHTML = html;
    totalEl.innerText = total.toLocaleString('vi-VN') + "đ";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI(); 
    renderCartItems(); 
}

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

    // 1. Kiểm tra trống thông tin cơ bản
    if (!size || !name || !phone || !address) {
        alert("Vui lòng chọn Size và điền đủ thông tin nhận hàng!");
        return;
    }
    
    // 2. Kiểm tra định dạng số điện thoại (10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (đúng 10 chữ số)!");
        return;
    }

    let productNames = cart.map(item => item.name).join(", ");
    let totalPrice = document.getElementById('total-price').innerText;

    // 3. Nội dung tin nhắn gửi về Telegram
    const messageContent = `👟 ĐƠN HÀNG MỚI - CBL SOCCER 👟\n----------------------------\n📦 Sản phẩm: ${productNames}\n📏 Size: ${size}\n💰 Tổng cộng: ${totalPrice}\n👤 Khách: ${name}\n📞 SĐT: ${phone}\n📍 Địa chỉ: ${address}\n📝 Ghi chú: ${note || 'Không có'}\n----------------------------\n🚀 Check đơn ngay chủ shop ơi!`;
    
    // SỬA LỖI 7: Gửi Telegram có xử lý lỗi — thông báo nếu gửi thất bại
    sendTelegramMessage(messageContent).catch(() => {
        // Ghi log lỗi nhưng không làm gián đoạn trải nghiệm khách hàng
        console.error('Không thể gửi thông báo Telegram. Vui lòng kiểm tra đơn hàng thủ công!');
        // Có thể thêm alert cho chủ shop nếu muốn:
        // alert('⚠️ Lỗi gửi thông báo Telegram! Kiểm tra đơn thủ công.');
    });

    // 4. Hiển thị hóa đơn (Bill) cho khách xem
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

    // 5. Làm sạch giỏ hàng sau khi đặt thành công
    cart = [];
    saveCart();
    updateCartUI();

    // Tự động đóng Bill sau 6 giây và xóa trắng các ô nhập liệu
    setTimeout(() => {
        if (billModal) billModal.style.display = 'none';
        document.getElementById('cus-name').value = "";
        document.getElementById('cus-phone').value = "";
        document.getElementById('cus-address').value = "";
        document.getElementById('cus-note').value = "";
        document.getElementById('cus-size').value = "";
    }, 6000);
}

function showProductDetail(name, price, size, desc, img) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <img src="${img}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h2>${name}</h2>
        <p style="color:#ff4757; font-weight:bold; font-size:20px;">${price}đ</p>
        <p><b>Size:</b> ${size}</p>
        <p style="color:#666; margin:15px 0; white-space: pre-line;">${desc}</p>
        <button onclick="addToCart('${name}', '${price}'); closeProductDetail()" style="width:100%; padding:12px; background:#27ae60; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">THÊM VÀO GIỎ NGAY</button>
    `;
    modal.style.display = 'flex';
}

function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
}

// --- HÀM TÌM KIẾM ---
function searchProduct() {
    let input = document.getElementById('product-search').value.toLowerCase().trim();
    let cards = document.querySelectorAll('.product-card');

    // Nếu đang gõ, tự động chuyển sang trang Sản Phẩm
    if (input.length > 0) {
        showSection(1);
    }

    cards.forEach(card => {
        let titleTag = card.querySelector('h3');
        if (titleTag) {
            let productName = titleTag.innerText.toLowerCase();
            if (productName.includes(input)) {
                card.style.display = "flex"; 
            } else {
                card.style.display = "none"; 
            }
        }
    });
}

// SỬA LỖI 7: Đổi thành async function trả về Promise để có thể .catch() ở ngoài
async function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0";
    const chatId = "7901882812";
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Telegram API lỗi: ${response.status}`);
    }
    return response;
}

// Khi trang load xong
window.onload = () => {
    updateCartUI();
    showSection(0); // Luôn bắt đầu ở trang chủ
};