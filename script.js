/* ==========================================================================
   1. CƠ SỞ DỮ LIỆU & QUẢN LÝ TRẠNG THÁI (STATE & DATABASE)
   ========================================================================== */
const products = [
    {
        id: 1,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Đỏ Thẫm TF",
        price: "699.000",
        sizes: [38, 39, 40, 41, 42, 43, 45],
        image: "2_2images.jpeg",
        desc: "Dòng sản phẩm cao cấp chính hãng Zocker Gen 2. Da upper mềm mại, ôm chân, hệ thống đinh dăm TF bám sân phân bổ khoa học giúp xoay sở tăng tốc linh hoạt tối đa."
    },
    {
        id: 2,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    },
    {
        id: 3,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    },
    {
        id: 4,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    },
    {
        id: 5,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Đỏ Thẫm TF",
        price: "699.000",
        sizes: [38, 39, 40, 41, 42, 43, 45],
        image: "2_2images.jpeg",
        desc: "Dòng sản phẩm cao cấp chính hãng Zocker Gen 2. Da upper mềm mại, ôm chân, hệ thống đinh dăm TF bám sân phân bổ khoa học giúp xoay sở tăng tốc linh hoạt tối đa."
    },
    {
        id: 6,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    },
    {
        id: 7,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    },
    {
        id: 8,
        name: "Giày Bóng Đá Zocker Winner Energy Gen 2 - Xanh Nhật TF",
        price: "699.000",
        sizes: [39, 40, 41, 42, 43, 44, 45],
        image: "IMG_4113.jpeg",
        desc: "Màu sắc xanh dương nhật bản năng động cực cuốn hút. Phù hợp anh em kiểm soát bóng, bứt tốc chạy cánh thần sầu trên các mặt sân cỏ nhân tạo."
    }
];

let cart = safeGetStorage('cbl_cart');
let selectedSizeTemp = null; 
let billTimeout = null;

/* ==========================================================================
   2. TIỆN ÍCH LOCALSTORAGE TOÀN CỤC
   ========================================================================== */
function safeGetStorage(key) {
    try { 
        const data = localStorage.getItem(key); 
        return data ? JSON.parse(data) : []; 
    } catch (e) { 
        console.error("Lỗi đọc mã bộ nhớ LocalStorage:", e);
        return []; 
    }
}

function safeSetStorage(key, value) {
    try { 
        localStorage.setItem(key, JSON.stringify(value)); 
    } catch (e) {
        console.error("Lỗi ghi mã bộ nhớ LocalStorage:", e);
    }
}

/* ==========================================================================
   3. RENDER DANH SÁCH SẢN PHẨM MÀN HÌNH CHÍNH (PRODUCT GRID)
   ========================================================================== */
function renderProducts(productsList = products) {
    const container = document.getElementById('product-grid-container');
    if (!container) return;

    if (productsList.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Không tìm thấy sản phẩm phù hợp.</div>`;
        return;
    }

    container.innerHTML = productsList.map(prod => `
        <div class="product-card">
            <div style="overflow: hidden; border-radius: 4px;">
                <img src="${prod.image}" alt="${prod.name}" onclick="viewDetail(${prod.id})" style="cursor:pointer; width:100%; display:block;">
            </div>
            <div class="product-info">
                <h3 onclick="viewDetail(${prod.id})" style="cursor:pointer; font-size:1rem; font-weight:600; margin:10px 0 5px 0;">${prod.name}</h3>
                <div class="price-row">
                    <span class="price-sale" style="color:var(--color-gold); font-weight:700;">${prod.price}đ</span>
                </div>
                <p class="info" style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">Size sẵn có: ${prod.sizes.join(', ')}</p>
                <button class="btn-gold" onclick="viewDetail(${prod.id})" style="width:100%; padding:10px 0; font-size:0.85rem; text-align:center;">Chọn Size / Mua</button>
            </div>
        </div>
    `).join('');
}

/* ==========================================================================
   4. CHI TIẾT SẢN PHẨM & TƯƠNG TÁC CHỌN SIZE
   ========================================================================== */
function viewDetail(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    
    selectedSizeTemp = null; 
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('detail-content');
    if (!modal || !content) return;
    
    const allSizes = [38, 39, 40, 41, 42, 43, 44, 45];
    let sizeButtonsHTML = allSizes.map(sz => {
        const isAvailable = prod.sizes.includes(sz);
        if (isAvailable) {
            return `<button class="size-btn" onclick="selectSizeBtn(this, ${sz})">${sz}</button>`;
        } else {
            return `<button class="size-btn disabled" disabled>${sz}</button>`;
        }
    }).join('');

    content.innerHTML = `
        <img src="${prod.image}" style="width:100%; border-radius:4px; margin-bottom:15px; background:var(--bg-tertiary);">
        <h2 style="font-size:1.3rem; font-weight:700; margin-bottom:8px; text-align: left;">${prod.name}</h2>
        <p style="color:var(--color-gold); font-weight:800; font-size:1.6rem; margin-bottom:15px; text-align: left;">${prod.price}đ</p>
        
        <div class="size-selector-container" style="margin-bottom:20px;">
            <p style="font-size:0.9rem; margin-bottom:8px; color:var(--text-muted);">Chọn kích thước chân của bạn:</p>
            <div class="size-buttons-grid" style="display:flex; gap:8px; flex-wrap:wrap;">${sizeButtonsHTML}</div>
        </div>

        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin:15px 0; white-space: pre-line; text-align: left; border-top:1px solid var(--border-color); padding-top:15px;">${prod.desc}</p>
        <button id="add-to-cart-final-btn" class="btn-buy-now" style="width:100%; border-radius:4px; padding:12px 0;">THÊM VÀO GIỎ HÀNG</button>
    `;

    document.getElementById('add-to-cart-final-btn').onclick = function() {
        if (!selectedSizeTemp) {
            alert("Vui lòng chọn size giày trước khi thêm vào giỏ!");
            return;
        }
        addToCart(prod.name, prod.price, selectedSizeTemp, prod.image);
        closeProductDetail();
    };

    modal.style.display = 'flex';
}

function selectSizeBtn(btnElement, size) {
    const siblings = btnElement.parentElement.querySelectorAll('.size-btn');
    siblings.forEach(s => s.classList.remove('selected'));
    btnElement.classList.add('selected');
    selectedSizeTemp = size;
}

function closeProductDetail() { 
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.style.display = 'none'; 
}

/* ==========================================================================
   5. XỬ LÝ LƯU TRỮ GIỎ HÀNG & POPUP THÀNH CÔNG
   ========================================================================== */
function addToCart(name, price, size, image) {
    const itemKey = `${name} - Size ${size}`;
    const existingItem = cart.find(item => item.cartId === itemKey);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ cartId: itemKey, name: name, price: price, size: size, image: image, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showSuccessModal(name, price, size, image);
}

function showSuccessModal(name, price, size, image) {
    const infoBox = document.getElementById('success-pop-info');
    if (infoBox) {
        infoBox.innerHTML = `
            <img src="${image}" alt="giày" style="width:70px; height:70px; object-fit:cover; border-radius:4px;">
            <div class="success-info-text" style="text-align:left;">
                <h4 style="font-size:0.95rem; font-weight:600; margin-bottom:4px;">${name}</h4>
                <p style="font-size:0.85rem; color:var(--text-muted);">Phân loại: Size ${size}</p>
                <p style="font-weight:700; color:var(--color-gold); margin-top:3px;">${price}đ</p>
            </div>
        `;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalMoney = 0;
    cart.forEach(item => {
        const cleanPrice = parseInt(item.price.replace(/[.,]/g, '')) || 0;
        totalMoney += cleanPrice * item.quantity;
    });

    const countEl = document.getElementById('success-cart-count');
    const totalEl = document.getElementById('success-cart-total');
    if (countEl) countEl.innerText = totalItems;
    if (totalEl) totalEl.innerText = totalMoney.toLocaleString('vi-VN') + "đ";
    
    const successModal = document.getElementById('add-success-modal');
    if (successModal) successModal.style.display = 'flex';
}

function closeSuccessModal() {
    const successModal = document.getElementById('add-success-modal');
    if (successModal) successModal.style.display = 'none';
}

function goToCartFromSuccess() {
    closeSuccessModal();
    checkout(); 
}

function saveCart() { safeSetStorage('cbl_cart', cart); }

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

/* ==========================================================================
   6. BẢNG HIỂN THỊ CHI TIẾT GIỎ HÀNG (MINI CART MODAL)
   ========================================================================== */
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
        list.innerHTML = '<p style="text-align:center; padding:30px; color:var(--text-muted);">Giỏ hàng đang trống.</p>';
        totalEl.innerText = '0đ';
        return;
    }
    
    let html = ''; 
    let total = 0;
    cart.forEach((item, index) => {
        const cleanPrice = parseInt(item.price.replace(/[.,]/g, '')) || 0;
        total += (cleanPrice * item.quantity);
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-color);">
                <div style="font-size:0.9rem; text-align:left;">
                    <b style="color:var(--text-main);">${item.name}</b> <span style="color:var(--color-gold);">[Size ${item.size}]</span><br>
                    <span style="color:var(--text-muted); font-size:0.85rem;">${item.price}đ x ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="background:var(--color-wine); color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.8rem; cursor:pointer;">Xóa</button>
            </div>`;
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

/* ==========================================================================
   7. TRANG TIẾN HÀNH THANH TOÁN (CHECKOUT SYSTEM)
   ========================================================================== */
function checkout() {
    if (cart.length === 0) { alert("Giỏ hàng của bạn đang trống!"); return; }
    
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    if (cartModal) cartModal.style.display = 'none';
    if (checkoutModal) checkoutModal.style.display = 'flex';
    
    let totalMoney = 0;
    cart.forEach(item => { totalMoney += (parseInt(item.price.replace(/[.,]/g, '')) || 0) * item.quantity; });
    
    const shipBox = document.getElementById('ship-box');
    if (shipBox) {
        if (totalMoney >= 200000) {
            shipBox.innerHTML = `<i class="fas fa-check-circle"></i> Đơn hàng đủ điều kiện miễn phí vận chuyển (Freeship Toàn Quốc)`;
            shipBox.style.background = "rgba(40, 167, 69, 0.1)"; 
            shipBox.style.color = "#28a745";
            shipBox.style.border = "1px solid #28a745";
        } else {
            shipBox.innerHTML = `<i class="fas fa-exclamation-circle"></i> Phí giao hàng đồng giá toàn quốc: 30.000đ`;
            shipBox.style.background = "rgba(255, 193, 7, 0.1)"; 
            shipBox.style.color = "#ffc107";
            shipBox.style.border = "1px solid #ffc107";
        }
        shipBox.style.padding = "10px";
        shipBox.style.borderRadius = "4px";
        shipBox.style.fontSize = "0.85rem";
        shipBox.style.marginBottom = "15px";
    }
}

function closeCheckout() { 
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'none'; 
}

/* ==========================================================================
   8. XÁC NHẬN ĐƠN HÀNG & TÍNH NĂNG GỬI TELEGRAM BOT
   ========================================================================== */
function confirmOrder() {
    const name = document.getElementById('cus-name')?.value.trim();
    const phone = document.getElementById('cus-phone')?.value.trim();
    const address = document.getElementById('cus-address')?.value.trim();
    const city = document.getElementById('cus-city')?.value;
    const district = document.getElementById('cus-district')?.value.trim();
    const ward = document.getElementById('cus-ward')?.value.trim();
    const note = document.getElementById('cus-note')?.value.trim();
    const email = document.getElementById('cus-email')?.value.trim();
    const checkedPayment = document.querySelector('input[name="payment_method"]:checked');
    const paymentMethod = checkedPayment ? checkedPayment.value : "Chưa chọn";

    if (!name || !phone || !address || !city || !district || !ward) {
        alert("Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng chính xác!");
        return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Số điện thoại không hợp lệ! Yêu cầu nhập đúng 10 chữ số.");
        return;
    }

    let productDetails = cart.map(item => `+ ${item.name} (Size: ${item.size}) x${item.quantity}`).join("\n");
    
    let subTotal = 0;
    cart.forEach(item => { subTotal += (parseInt(item.price.replace(/[.,]/g, '')) || 0) * item.quantity; });
    let finalTotalText = subTotal >= 200000 ? subTotal.toLocaleString('vi-VN') + "đ (Freeship)" : (subTotal + 30000).toLocaleString('vi-VN') + "đ (+30k Ship)";

    const msg = `👟 ĐƠN HÀNG MỚI - CBL SOCCER 👟\n----------------------------\n📦 Sản phẩm:\n${productDetails}\n💰 Tổng cộng: ${finalTotalText}\n👤 Khách hàng: ${name}\n📞 SĐT: ${phone}\n📍 Địa chỉ: ${address}, ${ward}, ${district}, ${city}\n📧 Email: ${email || 'Không cung cấp'}\n📝 Ghi chú: ${note || 'Không có'}\n----------------------------\n🚀 Check đơn chuẩn bị hàng nhé shop!`;

    sendTelegramMessage(msg).catch(err => console.error("Lỗi API Telegram: ", err));

    const billDetail = document.getElementById('bill-detail');
    if (billDetail) {
        billDetail.innerHTML = `
            <p style="margin-bottom:6px;"><b>Khách hàng:</b> ${name}</p>
            <p style="margin-bottom:6px;"><b>SĐT:</b> ${phone}</p>
            <p style="margin-bottom:6px;"><b>Địa chỉ nhận:</b> ${address}, ${ward}, ${district}, ${city}</p>
            <p style="margin-bottom:6px;"><b>Đơn hàng chi tiết:</b><br>${cart.map(item => `- ${item.name} (Size: ${item.size}) x${item.quantity}`).join('<br>')}</p>
            <p style="margin-bottom:6px;"><b>Thanh toán:</b> <span style="color:var(--color-gold); font-weight:bold;">${paymentMethod}</span></p>
            <p style="font-size:1.2rem; color:#dc3545; margin-top:12px; border-top:1px dashed var(--border-color); padding-top:8px;"><b>Thành tiền:</b> ${finalTotalText}</p>
        `;
    }

    const checkoutModal = document.getElementById('checkout-modal');
    const billModal = document.getElementById('bill-modal');
    if (checkoutModal) checkoutModal.style.display = 'none';
    if (billModal) billModal.style.display = 'flex';

    cart = []; 
    saveCart(); 
    updateCartUI();

    if (billTimeout) clearTimeout(billTimeout);

    billTimeout = setTimeout(() => {
        if (billModal) billModal.style.display = 'none';
        const fields = ['cus-name', 'cus-phone', 'cus-address', 'cus-district', 'cus-ward', 'cus-note', 'cus-email'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
    }, 8000);
}

async function sendTelegramMessage(message) {
    const token = "8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0";
    const chatId = "7901882812";
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    });
}

/* ==========================================================================
   9. BỘ LỌC TÌM KIẾM SẢN PHẨM & ĐIỀU HƯỚNG TẦNG GIAO DIỆN (SPA SLIDE)
   ========================================================================== */
function searchProduct() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    let input = searchInput.value.toLowerCase().trim();
    if (input.length > 0) showSection(1); 
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(input));
    renderProducts(filtered);
}

function showSection(index) {
    const pages = document.querySelectorAll('.page');
    pages.forEach((page, i) => page.classList.toggle('active', i === index));
    
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

/* ==========================================================================
   10. KÍCH HOẠT CÁC NÚT TƯƠNG TÁC TRÊN HEADER & HERO BANNER
   ========================================================================== */
function initHeaderInteractions() {
    // 1. Nút Menu Mobile (Sửa lỗi hiển thị mượt mà)
    const menuBtn = document.querySelector('.header-left i, .fa-bars, #menu-toggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.mobile-drawer, .sidebar, #mobile-menu');
            if (sidebar) {
                sidebar.classList.toggle('active');
                sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
            } else {
                alert("Menu đang được tối ưu hóa cho phiên bản tiếp theo!");
            }
        });
    }

    // 2. Chế độ Sáng / Tối (Dark / Light Mode)
    const themeBtn = document.querySelector('.fa-moon, .theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const htmlTag = document.documentElement;
            if (htmlTag.getAttribute('data-theme') === 'light') {
                htmlTag.removeAttribute('data-theme');
                themeBtn.className = 'fas fa-moon';
            } else {
                htmlTag.setAttribute('data-theme', 'light');
                themeBtn.className = 'fas fa-sun';
            }
        });
    }

    // 3. Nút Tài khoản / Admin
    const userBtn = document.querySelector('.fa-user, .account-toggle');
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            alert("Tính năng đăng nhập tài khoản thành viên đang được bảo mật!");
        });
    }

    // 4. Kết nối Giỏ hàng
    const cartBtn = document.querySelector('.fa-shopping-cart, .fa-shopping-bag, .cart-icon-wrapper');
    if (cartBtn) {
        cartBtn.setAttribute('onclick', 'toggleCart()');
    }

    // 5. Nút "MUA NGAY" ở Hero Banner (Đã sửa lỗi loại bỏ selector :contains)
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        if (btn.textContent.trim() === 'MUA NGAY') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productGrid = document.getElementById('product-grid-container');
                if (productGrid) {
                    productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    });
}

window.onload = () => {
    renderProducts();
    updateCartUI();
    showSection(0);
    initHeaderInteractions();
};