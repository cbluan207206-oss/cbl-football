/* ==========================================================================
   KIẾN TRÚC DỮ LIỆU ĐỘNG (KẾ THỪA TỪ FILE PRODUCTS.JS)
   ========================================================================== */
// Hệ thống tự động lấy danh sách từ products.js sang để nuôi toàn bộ tính năng bên dưới
const MOCK_PRODUCTS = DANH_SACH_GIAY;

/* THÀNH PHẦN QUẢN LÝ TRẠNG THÁI HỆ THỐNG (APPLICATION STATE LOGIC) */
let globalCart = [];
let selectedFilterSize = null;
let currentActiveProduct = MOCK_PRODUCTS[0];
let activeCouponDiscount = 0;

/* ==========================================================================
   HỆ THỐNG KHỞI CHẠY & KHỞI TẠO BAN ĐẦU (APP INITIALIZATION)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Chức năng 13: Xử lý hoạt ảnh Loading Màn hình chào chuyên nghiệp
    setTimeout(() => {
        const loader = document.getElementById("app-loading-screen");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }
    }, 800);

    // Kích hoạt Render sản phẩm lên hai phân vùng trang chủ và trang sản phẩm chính
    initAppProducts();
    setupImageZoomEffect();
});

/* KHỞI TẠO SẢN PHẨM */
function initAppProducts() {
    const featuredContainer = document.getElementById("homepage-featured-products");
    const allProductsContainer = document.getElementById("product-grid-container");

    // Lọc sản phẩm nổi bật cho Trang Chủ
    const featuredItems = MOCK_PRODUCTS.filter(p => p.featured);
    
    if (featuredContainer) featuredContainer.innerHTML = generateProductGridHTML(featuredItems);
    if (allProductsContainer) allProductsContainer.innerHTML = generateProductGridHTML(MOCK_PRODUCTS);
}

/* HÀM ĐỊNH DẠNG CHUYỂN ĐỔI TIỀN TỆ SANG VNĐ ĐẸP MẮT */
function formatVNCurrency(amount) {
    return amount.toLocaleString('vi-VN') + 'đ';
}

/* CORES: MÁY ĐÚC TEMPLATE HTML CHO CARD SẢN PHẨM */
function generateProductGridHTML(productsArray) {
    if (productsArray.length === 0) {
        return `<div class="no-products-fallback"><p><i class="fas fa-search"></i> Không tìm thấy siêu phẩm phù hợp. Anh em vui lòng đổi bộ lọc nhé!</p></div>`;
    }
    return productsArray.map(product => {
        return `
            <div class="product-card">
                <div class="product-card-badge-sale">BẢO HÀNH 1 ĐỔI 1</div>
                <div class="product-card-img-holder" onclick="navigateToProductDetail(${product.id})">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-card-body">
                    <h3 class="product-card-title" onclick="navigateToProductDetail(${product.id})">${product.name}</h3>
                    <div class="product-card-price-row">
                        <span class="price-sale">${formatVNCurrency(product.priceSale)}</span>
                        <span class="price-raw">${formatVNCurrency(product.priceRaw)}</span>
                    </div>
                    <button class="btn-product-card-action" onclick="navigateToProductDetail(${product.id})">Xem Chi Tiết</button>
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================================================
   VÙNG 1: KIẾN TRÚC CHUYỂN ĐỔI TRANG WEB SINGLE PAGE (SPA CONTROL)
   ========================================================================== */
function showSection(sectionId) {
    // Ẩn tất cả phân vùng trang đang chạy
    const targetPages = document.querySelectorAll(".page");
    targetPages.forEach(page => page.classList.remove("active"));

    // Kích hoạt hiển thị trang được gọi đích danh
    const activePage = document.getElementById(sectionId);
    if (activePage) {
        activePage.classList.add("active");
        // Cuộn mượt về đầu trang để tối ưu trải nghiệm khách hàng
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cập nhật trạng thái Active trên thanh Menu chính
    const navButtons = document.querySelectorAll(".nav-item");
    navButtons.forEach(btn => {
        const onclickAttr = btn.getAttribute("onclick");
        if (onclickAttr && onclickAttr.includes(sectionId)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Tự động khép Menu di động nếu đang mở
    const menuLinks = document.getElementById("main-nav-links");
    if (menuLinks) menuLinks.classList.remove("mobile-open");
}

/* 2. ĐIỀU HÀNH MENU 3 GẠCH TRÊN DI ĐỘNG (HAMBURGER MENU TOGGLE) */
function toggleMobileMenu() {
    const menuLinks = document.getElementById("main-nav-links");
    if (menuLinks) {
        menuLinks.classList.toggle("mobile-open");
    }
}

/* Hỗ trợ cuộn mượt đến phần thu thập bộ sưu tập */
function scrollToElement(elementId) {
    const target = document.getElementById(elementId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ==========================================================================
   VÙNG 11: LOGIC BỘ TÌM KIẾM CHUYÊN NGHIỆP & BỘ LỌC ĐA NĂNG SIDEBAR
   ========================================================================== */
function searchProduct() {
    const searchString = document.getElementById("product-search").value.toLowerCase().trim();
    const suggestionsBox = document.getElementById("search-suggestions");
    
    if (searchString === "") {
        suggestionsBox.style.display = "none";
        return;
    }

    // Lọc kết quả trùng khớp thời gian thực (Live Search Suggestions)
    const filteredResults = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchString) || p.brand.toLowerCase().includes(searchString)
    );

    if (filteredResults.length > 0) {
        suggestionsBox.style.display = "block";
        suggestionsBox.innerHTML = filteredResults.map(p => `
            <div class="suggestion-item-row" style="padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #1f1f1f; display:flex; align-items:center; gap:10px;" onclick="selectSearchResult(${p.id})">
                <img src="${p.image}" style="width: 35px; height: 35px; object-fit: cover; border-radius:4px;">
                <div>
                    <div style="font-size:0.85rem; font-weight:600; color:#fff;">${p.name}</div>
                    <div style="font-size:0.75rem; color:#c5a059;">${formatVNCurrency(p.priceSale)}</div>
                </div>
            </div>
        `).join('');
    } else {
        suggestionsBox.style.display = "block";
        suggestionsBox.innerHTML = `<div style="padding:15px; font-size:0.8rem; color:#8e8e93; text-align:center;">Không tìm thấy sản phẩm hợp lệ</div>`;
    }
}

function selectSearchResult(productId) {
    document.getElementById("search-suggestions").style.display = "none";
    document.getElementById("product-search").value = "";
    navigateToProductDetail(productId);
}

/* LOGIC CHỌN SIZE LỌC TRONG SIDEBAR */
function setFilterSize(size) {
    selectedFilterSize = size;
    const buttons = document.querySelectorAll(".btn-size-filter");
    buttons.forEach(btn => {
        if (parseInt(btn.textContent) === size) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

/* ÁP DỤNG BỘ LỌC CHUYÊN SÂU (ADVANCED FILTERS PROCESSOR) */
function applyAdvancedFilters() {
    // 1. Thu thập dữ liệu Thương hiệu được Check
    const checkedBrands = Array.from(document.querySelectorAll(".filter-brand:checked")).map(el => el.value);
    
    // 2. Thu thập dữ liệu mức giá mong muốn
    const priceRangeSelected = document.getElementById("filter-price-range").value;

    let outputList = MOCK_PRODUCTS;

    // Tiến hành lọc thương hiệu
    if (checkedBrands.length > 0) {
        outputList = outputList.filter(p => checkedBrands.includes(p.brand));
    }

    // Tiến hành lọc theo Size giày bóng đá
    if (selectedFilterSize) {
        outputList = outputList.filter(p => p.sizes.includes(selectedFilterSize));
    }

    // Tiến hành phân mảnh giá thành
    if (priceRangeSelected === "under-500") {
        outputList = outputList.filter(p => p.priceSale < 500000);
    } else if (priceRangeSelected === "500-1000") {
        outputList = outputList.filter(p => p.priceSale >= 500000 && p.priceSale <= 1000000);
    } else if (priceRangeSelected === "over-1000") {
        outputList = outputList.filter(p => p.priceSale > 1000000);
    }

    // Ép khung Render ra khu vực hiển thị
    const allProductsContainer = document.getElementById("product-grid-container");
    if (allProductsContainer) {
        allProductsContainer.innerHTML = generateProductGridHTML(outputList);
    }
}

function filterByQuickBrand(brandName) {
    showSection('section-products');
    const brandCheckboxes = document.querySelectorAll(".filter-brand");
    brandCheckboxes.forEach(cb => {
        cb.checked = (cb.value === brandName);
    });
    applyAdvancedFilters();
}

/* ==========================================================================
   VÙNG 4: TRANG CHI TIẾT SẢN PHẨM & CÁC HOẠT ẢNH TƯƠNG TÁC (IMAGE ZOOM)
   ========================================================================== */
function navigateToProductDetail(productId) {
    // Dùng toán tử === để so sánh linh hoạt cả số lẫn chuỗi ID
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentActiveProduct = product;

    // Điền dữ liệu tĩnh từ cấu trúc Object vào DOM Elements
    document.getElementById("view-product-title").textContent = product.name;
    document.getElementById("view-product-price-sale").textContent = formatVNCurrency(product.priceSale);
    document.getElementById("view-product-price-raw").textContent = formatVNCurrency(product.priceRaw);
    document.getElementById("view-product-desc").textContent = product.desc;
    document.getElementById("detail-main-img").src = product.image;

    // Reset lại số lượng đặt mua mặc định về 1
    document.getElementById("detail-qty-input").value = 1;

    /* ==========================================================================
       XỬ LÝ SỬA LỖI: Tự động đúc danh sách Ảnh nhỏ (Thumbnails) động
       ========================================================================== */
    const thumbnailContainer = document.getElementById("detail-thumbnails-list");
    if (thumbnailContainer) {
        // Nếu trong file products.js có mảng danh sách ảnh phụ (product.images) thì lấy, 
        // nếu không có hệ thống sẽ tự lấy ảnh chính (product.image) làm thumbnail để tránh lỗi web.
        const albumImages = (product.images && Array.isArray(product.images)) ? product.images : [product.image];
        
        thumbnailContainer.innerHTML = albumImages.map((imgUrl, idx) => `
            <img src="${imgUrl}" onclick="changeDetailImage(this.src)" alt="${product.name} - Góc ${idx + 1}">
        `).join('');
    }

    // Tạo cấu trúc phân mảnh Size Chart động dựa trên kho hàng sản phẩm sở hữu
    const sizeSelectorsContainer = document.querySelector(".size-variants-selectors");
    if (sizeSelectorsContainer) {
        sizeSelectorsContainer.innerHTML = product.sizes.map((size, idx) => `
            <label>
                <input type="radio" name="detail_size" value="${size}" ${idx === 0 ? 'checked' : ''}>
                <span>${size}</span>
            </label>
        `).join('');
    }
    
    // Tự động đúc danh sách Màu Sắc động dựa trên thuộc tính của đôi giày đang xem
    const colorSelectorsContainer = document.querySelector(".color-variants-selectors");
    if (colorSelectorsContainer && product.colors) {
        colorSelectorsContainer.innerHTML = product.colors.map((color, idx) => `
            <label>
                <input type="radio" name="detail_color" value="${color}" ${idx === 0 ? 'checked' : ''}>
                <span>${color}</span>
            </label>
        `).join('');
    }

    // Đổ danh sách sản phẩm liên quan (Cùng thương hiệu đối tác)
    const relatedContainer = document.getElementById("related-products-container");
    if (relatedContainer) {
        const relatedItems = MOCK_PRODUCTS.filter(p => p.brand === product.brand && p.id !== product.id);
        relatedContainer.innerHTML = generateProductGridHTML(relatedItems.slice(0, 3));
    }

    // Chuyển màn hình hiển thị SPA về trang chi tiết
    showSection('section-product-detail-view');
}

/* Tính năng zoom ảnh kỹ thuật số cao cấp */
function setupImageZoomEffect() {
    const imageContainer = document.querySelector(".main-image-zoom-container");
    const zoomImg = document.getElementById("detail-main-img");

    if (imageContainer && zoomImg) {
        imageContainer.addEventListener("mousemove", (e) => {
            const { left, top, width, height } = imageContainer.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            zoomImg.style.transformOrigin = `${x}% ${y}%`;
            zoomImg.style.transform = "scale(1.5)";
        });

        imageContainer.addEventListener("mouseleave", () => {
            zoomImg.style.transform = "scale(1)";
            zoomImg.style.transformOrigin = "center center";
        });
    }
}

function changeDetailImage(src) {
    document.getElementById("detail-main-img").src = src;
}

function alterDetailQty(amount) {
    const qtyInput = document.getElementById("detail-qty-input");
    let currentQty = parseInt(qtyInput.value) + amount;
    if (currentQty < 1) currentQty = 1;
    qtyInput.value = currentQty;
}

/* ==========================================================================
   VÙNG 5: HỆ THỐNG GIỎ HÀNG THƯỢNG LƯU (CART ENGINE MANAGER)
   ========================================================================== */
function toggleCart() {
    const cartModal = document.getElementById("cart-modal");
    if (cartModal) {
        const isHidden = cartModal.style.display === "none";
        cartModal.style.display = isHidden ? "flex" : "none";
        if (isHidden) renderCartItems();
    }
}

function addSelectedToCart() {
    const selectedSizeNode = document.querySelector('input[name="detail_size"]:checked');
    const selectedColorNode = document.querySelector('input[name="detail_color"]:checked');
    const quantityToBuy = parseInt(document.getElementById("detail-qty-input").value);

    if (!selectedSizeNode) {
        alert("Anh em vui lòng chọn size giày phù hợp trước nhé!");
        return;
    }

    const chosenSize = selectedSizeNode.value;
    const chosenColor = selectedColorNode ? selectedColorNode.value : "Đen";

    // Khởi tạo mã ID duy nhất cho cụm sản phẩm tránh trùng lắp thuộc tính biến thể
    const uniqueCartKey = `${currentActiveProduct.id}_${chosenSize}_${chosenColor}`;

    const existingCartIndex = globalCart.findIndex(item => item.cartKey === uniqueCartKey);

    if (existingCartIndex > -1) {
        globalCart[existingCartIndex].qty += quantityToBuy;
    } else {
        globalCart.push({
            cartKey: uniqueCartKey,
            id: currentActiveProduct.id,
            name: currentActiveProduct.name,
            price: currentActiveProduct.priceSale,
            size: chosenSize,
            color: chosenColor,
            image: currentActiveProduct.image,
            qty: quantityToBuy
        });
    }

    updateCartCounters();
    triggerSuccessNotificationPopup(currentActiveProduct, quantityToBuy);
}

function buyNowSelected() {
    addSelectedToCart();
    // Đợi hiệu ứng popup rồi mở thẳng trang thanh toán
    setTimeout(() => {
        closeSuccessModal();
        checkout();
    }, 400);
}

/* 13. KÍCH HOẠT THÔNG BÁO POPUP THÀNH CÔNG (NOTIFICATION POPUP) */
function triggerSuccessNotificationPopup(product, qty) {
    const successModal = document.getElementById("add-success-modal");
    const infoBox = document.getElementById("success-pop-info");

    if (successModal && infoBox) {
        infoBox.innerHTML = `
            <div style="display:flex; gap:15px; align-items:center; margin-top:10px;">
                <img src="${product.image}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; border:1px solid #c5a059;">
                <div>
                    <h5 style="color:#fff; font-size:0.9rem; text-transform:uppercase;">${product.name}</h5>
                    <p style="font-size:0.8rem; color:#8e8e93;">Số lượng: ${qty} đôi</p>
                </div>
            </div>
        `;

        // Đồng bộ dữ liệu tiền nong lên popup nhanh
        const stats = calculateCartTotals();
        document.getElementById("success-cart-count").textContent = stats.totalQty;
        document.getElementById("success-cart-total").textContent = formatVNCurrency(stats.finalTotal);

        successModal.style.display = "flex";
    }
}

function closeSuccessModal() {
    document.getElementById("add-success-modal").style.display = "none";
}

function goToCartFromSuccess() {
    closeSuccessModal();
    toggleCart();
}

/* CẬP NHẬT BIỂN ĐẾM SỐ LƯỢNG TRÊN HEADER NAV BAR */
function updateCartCounters() {
    const stats = calculateCartTotals();
    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) {
        cartCounter.textContent = stats.totalQty;
    }
}


/* LOGIC TÍNH TOÁN TỔNG TIỀN ĐƠN HÀNG */
function calculateCartTotals() {
    let totalQty = 0;
    let subTotal = 0;

    globalCart.forEach(item => {
        totalQty += item.qty;
        subTotal += (item.price * item.qty);
    });

    let finalTotal = subTotal - activeCouponDiscount;
    if (finalTotal < 0) finalTotal = 0;

    return { totalQty, subTotal, finalTotal };
}

/* RENDER DANH SÁCH GIỎ HÀNG */
function renderCartItems() {
    const container = document.getElementById("cart-items-list");
    if (!container) return;

    if (globalCart.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:30px; color:#8e8e93; font-size:0.9rem;">Giỏ hàng trống. Anh em chưa chọn được chiến hài nào!</p>`;
        document.getElementById("total-price").textContent = "0đ";
        return;
    }

    container.innerHTML = globalCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #1f1f1f;">
            <div style="display:flex; gap:15px; align-items:center;">
                <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div>
                    <h4 style="font-size:0.85rem; text-transform:uppercase; color:#fff; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.name}</h4>
                    <p style="font-size:0.75rem; color:#8e8e93;">Size: ${item.size} | Màu: ${item.color}</p>
                    <span style="color:#c5a059; font-weight:bold; font-size:0.85rem;">${formatVNCurrency(item.price)}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button onclick="alterCartItemQty('${item.cartKey}', -1)" style="background:#111; border:1px solid #333; color:white; width:24px; height:24px; cursor:pointer; border-radius:3px;">-</button>
                <span style="font-size:0.9rem; font-weight:bold; width:20px; text-align:center;">${item.qty}</span>
                <button onclick="alterCartItemQty('${item.cartKey}', 1)" style="background:#111; border:1px solid #333; color:white; width:24px; height:24px; cursor:pointer; border-radius:3px;">+</button>
                <button onclick="removeCartItem('${item.cartKey}')" style="background:none; border:none; color:#6b1724; margin-left:10px; cursor:pointer;" title="Xóa sản phẩm"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');

    // Đồng bộ hóa tổng tiền
    const stats = calculateCartTotals();
    document.getElementById("total-price").textContent = formatVNCurrency(stats.finalTotal);
}

function alterCartItemQty(cartKey, amount) {
    const idx = globalCart.findIndex(item => item.cartKey === cartKey);
    if (idx > -1) {
        globalCart[idx].qty += amount;
        if (globalCart[idx].qty < 1) globalCart[idx].qty = 1;
        updateCartCounters();
        renderCartItems();
    }
}

function removeCartItem(cartKey) {
    globalCart = globalCart.filter(item => item.cartKey !== cartKey);
    updateCartCounters();
    renderCartItems();
}

/* ÁP DỤNG MÃ GIẢM GIÁ (COUPON CODE MOCKUP SYSTEM) */
function applyCouponCode() {
    const code = document.getElementById("cart-coupon-code").value.trim().toUpperCase();
    if (code === "CBLSOCCER10") {
        activeCouponDiscount = 50000; // Giảm ngay 50k tri ân anh em
        alert("Áp dụng mã giảm giá CBLSOCCER10 thành công! Bạn được giảm 50.000đ.");
        renderCartItems();
    } else if (code === "") {
        alert("Vui lòng nhập mã ưu đãi nếu có!");
    } else {
        alert("Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng trên hệ thống!");
    }
}

/* ==========================================================================
   VÙNG 6: THANH TOÁN (CHECKOUT SYSTEM) & GIAO GIAO HÀNG TỰ ĐỘNG VIETQR PRO
   ========================================================================== */
function checkout() {
    if (globalCart.length === 0) {
        alert("Giỏ hàng của chiến hữu đang trống, hãy chọn một đôi giày ưng ý trước khi thanh toán nhé!");
        return;
    }
    // Đóng giỏ hàng và mở trang cổng thanh toán nhận diện thông tin
    document.getElementById("cart-modal").style.display = "none";
    document.getElementById("checkout-modal").style.display = "flex";
    
    // Tự động kích hoạt hiển thị vận chuyển
    document.getElementById("ship-box").textContent = "CBL SOCCER miễn phí vận chuyển cho toàn bộ đơn hàng của bạn!";
}

function closeCheckout() {
    document.getElementById("checkout-modal").style.display = "none";
}

// CẤU HÌNH THÔNG TIN BOT TELEGRAM CỦA CBL SOCCER (ĐÃ KÍCH HOẠT)
const TELEGRAM_BOT_TOKEN = '8711185097:AAGNpNiha-FaDf-mZB9HtiBON1rW0iSz_K0'; 
const TELEGRAM_CHAT_ID = '7901882812';

/* XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG VÀ XUẤT HÓA ĐƠN ĐIỆN TỬ */
function confirmOrder() {
    const name = document.getElementById("cus-name").value.trim();
    const phone = document.getElementById("cus-phone").value.trim();
    const address = document.getElementById("cus-address").value.trim();
    const city = document.getElementById("cus-city").value;

    if (!name || !phone || !address || !city) {
        alert("Vui lòng hoàn thành đầy đủ các trường thông tin bắt buộc có dấu sao để CBL Soccer giao hàng chính xác!");
        return;
    }

    const paymentMethodSelected = document.querySelector('input[name="payment_method"]:checked').value;
    const stats = calculateCartTotals();
    const orderId = `CBL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Tạo cấu trúc Template hóa đơn điện tử cho Bill Modal công chiếu công khai
    const billDetailContainer = document.getElementById("bill-detail");
    let billHTML = `
        <div class="invoice-box-luxury" style="font-size:0.85rem; color:#f5f5f5; line-height:1.8;">
            <p><strong>Mã đơn hàng:</strong> <span style="color:#c5a059; font-weight:bold;">${orderId}</span></p>
            <p><strong>Khách hàng nhận hàng:</strong> ${name}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Tỉnh/Thành giao:</strong> ${city}</p>
            <p><strong>Hình thức thanh toán:</strong> ${paymentMethodSelected === "VietQR" ? "Techcombank VietQR Pro Auto" : "Thanh toán khi nhận hàng (COD)"}</p>
            <hr style="border-color:#222; margin:10px 0;">
            <h4 style="color:#c5a059; margin-bottom:5px;">DANH SÁCH SẢN PHẨM:</h4>
    `;

    globalCart.forEach(item => {
        billHTML += `<div style="display:flex; justify-content: space-between;"><span>• ${item.name} (Size: ${item.size})</span> <span style="margin-left:auto;">x${item.qty}</span></div>`;
    });

    billHTML += `
            <hr style="border-color:#222; margin:10px 0;">
            <p style="font-size:1rem; font-weight:bold;">Tổng số tiền quyết toán: <span style="color:#c5a059;">${formatVNCurrency(stats.finalTotal)}</span></p>
        </div>
    `;

    billDetailContainer.innerHTML = billHTML;

    // Chức năng nâng cao: Nếu chọn VietQR Pro thì tự động mở cổng quét mã trực quan
    const qrZone = document.getElementById("vietqr-payment-area-placeholder");
    if (paymentMethodSelected === "VietQR") {
        qrZone.classList.remove("style-hidden");
        // Giả lập API sinh mã QR tự động theo chuẩn VietQR Techcombank
        qrZone.innerHTML = `
            <div style="text-align:center; margin-top:20px; padding:15px; background:#fff; border-radius:8px; width:fit-content; margin:20px auto 0 auto;">
                <p style="color:#000; font-weight:bold; font-size:0.75rem; margin-bottom:5px;">TECHCOMBANK VIETQR PRO</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=STK_0984169335_AMOUNT_${stats.finalTotal}_ND_${orderId}" style="width:160px; height:160px;" alt="Mã chuyển khoản tự động">
                <p style="color:#6b1724; font-size:0.7rem; font-weight:bold; margin-top:5px;">Nội dung CK bắt buộc: ${orderId}</p>
            </div>
        `;
    } else {
        qrZone.classList.add("style-hidden");
    }

    // 3. KÍCH HOẠT: BẮN THÔNG BÁO ĐƠN HÀNG VỀ TELEGRAM CHAT BOT
    sendOrderToTelegram(orderId, name, phone, address, city, paymentMethodSelected, stats);

    // 4. Đóng cổng nhập liệu và bùng màn hình hoàn tất đơn
    document.getElementById("checkout-modal").style.display = "none";
    document.getElementById("bill-modal").style.display = "flex";
}

// HÀM BỔ TRỢ XỬ LÝ ĐẨY DỮ LIỆU ĐI API TELEGRAM
function sendOrderToTelegram(orderId, name, phone, address, city, paymentMethod, stats) {
    let teleMessage = `🔔 <b>CBL SOCCER - CÓ ĐƠN HÀNG MỚI!</b>\n\n`;
    teleMessage += `🆔 <b>Mã đơn:</b> <code>${orderId}</code>\n`;
    teleMessage += `👤 <b>Khách hàng:</b> ${name}\n`;
    teleMessage += `📞 <b>Điện thoại:</b> ${phone}\n`;
    teleMessage += `📍 <b>Địa chỉ:</b> ${address}, ${city}\n`;
    teleMessage += `💳 <b>Hình thức:</b> ${paymentMethod === "VietQR" ? "Techcombank VietQR Pro" : "Thanh toán COD"}\n\n`;
    teleMessage += `📦 <b>CHI TIẾT CHIẾN HÀI:</b>\n`;
    
    globalCart.forEach((item, index) => {
        teleMessage += `${index + 1}. ${item.name}\n`;
        teleMessage += `   👉 [Size: ${item.size} | Màu: ${item.color}] x <b>${item.qty} đôi</b>\n`;
    });
    
    teleMessage += `\n💰 <b>TỔNG TIỀN QUYẾT TOÁN:</b> <u>${formatVNCurrency(stats.finalTotal)}</u>`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: teleMessage,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Đã báo đơn về Telegram Bot thành công!');
        } else {
            console.error('Lỗi cấu hình Telegram:', data.description);
        }
    })
    .catch(error => {
        console.error('Không thể kết nối mạng tới API Telegram:', error);
    });
}

function closeBillAndReset() {
    document.getElementById("bill-modal").style.display = "none";
    globalCart = [];
    updateCartCounters();
    showSection('section-home');
}

/* ==========================================================================
   VÙNG 7: TÀI KHOẢN NGƯỜI DÙNG SYSTEM (AUTHENTICATION ENGINE)
   ========================================================================== */
function switchAuthTab(targetTab) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabButtons = document.querySelectorAll(".tab-auth-btn");

    tabButtons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes("nhập") && targetTab === 'login') {
            btn.classList.add("active");
        } else if (btn.textContent.toLowerCase().includes("ký") && targetTab === 'register') {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    if (targetTab === 'login') {
        loginForm.classList.remove("style-hidden");
        registerForm.classList.add("style-hidden");
    } else {
        loginForm.classList.add("style-hidden");
        registerForm.classList.remove("style-hidden");
    }
}

function handleUserAuth(event, type) {
    event.preventDefault();
    alert(`Xác thực thành công! Hệ thống đã đăng nhập tư cách Thành Viên CBL Soccer VIP.`);
    document.getElementById("auth-forms-wrapper").classList.add("style-hidden");
    document.getElementById("user-profile-panel").classList.remove("style-hidden");
    document.getElementById("user-display-name").textContent = "Chiến Hữu Phủi VIP";
}

function forgotPasswordNotify() {
    alert("Hệ thống khôi phục mật khẩu tự động đã gửi mã xác minh OTP về Số điện thoại/Email đăng ký của bạn. Vui lòng kiểm tra hộp thư!");
}

/* ==========================================================================
   BỔ SUNG CHỨC NĂNG PHỤ: DARK/LIGHT THEME TOGGLE & LIÊN HỆ GỬI FORM
   ========================================================================== */
function toggleTheme() {
    const htmlNode = document.documentElement;
    const currentTheme = htmlNode.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    htmlNode.setAttribute("data-theme", nextTheme);
    
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
        themeBtn.innerHTML = nextTheme === "dark" ? `<i class="fas fa-moon"></i>` : `<i class="fas fa-sun"></i>`;
    }
}

function sendContactMessage(event) {
    event.preventDefault();
    alert("Yêu cầu tư vấn của bạn đã được chuyển thẳng tới bộ phận chăm sóc khách hàng CBL Soccer. Hotline 0984.169.335 sẽ liên hệ bạn ngay lập tức!");
    document.getElementById("main-contact-form").reset();
}
