/**
 * ELYSIUM LUXURY STORE - CORE JAVASCRIPT SYSTEM
 * Phong cách: Tối giản - Sang trọng - Bảo mật cao
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================================================
    // 1. KHỞI TẠO HỆ THỐNG & ĐIỀU HƯỚNG SPA (SINGLE PAGE APPLICATION)
    // ==========================================================================
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.desktop-nav a, .sidebar-links a, .logo a, .prod-name a, .admin-quick-link');

    function handleRouting() {
        let hash = window.location.hash || '#home';
        
        // Kiểm tra xem phân đoạn ID có tồn tại trong HTML không
        const targetSection = document.querySelector(hash);
        if (!targetSection) hash = '#home';

        sections.forEach(sec => {
            if('#' + sec.id === hash) {
                sec.classList.add('active-section');
            } else {
                sec.classList.remove('active-section');
            }
        });

        // Cập nhật trạng thái Active trên thanh Menu chính
        navLinks.forEach(link => {
            if(link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Tự động cuộn mượt lên đỉnh đầu trang khi chuyển trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('hashchange', handleRouting);
    if(window.location.hash) handleRouting();

    // ==========================================================================
    // 2. GIẢ LẬP KHO DỮ LIỆU SẢN PHẨM & LIÊN KẾT GIAO DIỆN MẪU
    // ==========================================================================
    // Tự động gán sự kiện Xem Chi Tiết cho các nút "Xem nhanh" hoặc Click tên sản phẩm
    document.querySelectorAll('.view-detail-trigger, .prod-name a').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#product-detail';
        });
    });


    // ==========================================================================
    // 3. LOGIC TRANG CHI TIẾT SẢN PHẨM (PRODUCT DETAIL GALLERY & PICKERS)
    // ==========================================================================
    // Đổi ảnh lớn khi click vào ảnh Thumb tương ứng (Góc nhìn khác)
    const thumbnails = document.querySelectorAll('.thumbnail-list .thumb');
    const mainDetailImg = document.getElementById('mainDetailImg');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainDetailImg.src = this.src.replace('150', '800'); // Phóng to độ phân giải ảnh
        });
    });

    // Chọn Size & Màu sắc thượng lưu (Bật tắt class Selected)
    const sizeButtons = document.querySelectorAll('.size-options .size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    const colorButtons = document.querySelectorAll('.color-options .color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Bộ tăng/giảm số lượng (Quantity Picker) chuyên nghiệp
    const qtyInput = document.querySelector('.qty-input');
    const qtyMinus = document.querySelector('.qty-btn.minus');
    const qtyPlus = document.querySelector('.qty-btn.plus');

    if(qtyInput && qtyMinus && qtyPlus) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if(val > 1) qtyInput.value = val - 1;
        });
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            qtyInput.value = val + 1;
        });
    }


    // ==========================================================================
    // 4. HỆ THỐNG QUẢN LÝ GIỎ HÀNG (MINI CART SYSTEM INTERACTIVE)
    // ==========================================================================
    const btnAddCart = document.querySelector('.btn-add-cart');
    const cartBadge = document.querySelector('.cart-trigger .badge');

    if(btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            // Tăng số lượng Badge giỏ hàng tượng trưng tạo hiệu ứng phản hồi nhanh
            let currentCount = parseInt(cartBadge.textContent) || 0;
            cartBadge.textContent = currentCount + 1;
            
            // Đưa ra thông báo Toast xác nhận
            showToastNotification("Hệ Thống Thượng Lưu", "Đã thêm sản phẩm vào giỏ hàng đặc quyền thành công.");
        });
    }

    // Nút mua ngay (Chuyển thẳng đến trang checkout)
    const btnBuyNow = document.querySelector('.btn-buy-now');
    if(btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
            window.location.hash = '#checkout';
        });
    }


    // ==========================================================================
    // 5. XỬ LÝ THANH TOÁN (CHECKOUT FORM VALIDATION)
    // ==========================================================================
    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Giả lập hiệu ứng xử lý bảo mật ngân hàng
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "ĐANG MÃ HÓA GIAO DỊCH BẢO MẬT...";
            submitBtn.disabled = true;

            setTimeout(() => {
                alert("Kính thưa Quý khách, Đơn hàng hoàng gia đã được tiếp nhận thành công! Chuyên viên Stylist riêng của Elysium sẽ gọi điện xác nhận lịch trình giao hàng VIP của Quý khách trong ít phút.");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                checkoutForm.reset();
                window.location.hash = '#home';
            }, 2000);
        });
    }


    // ==========================================================================
    // 6. PHÂN HỆ KHÁCH HÀNG (USER PORTAL ACCOUNTS TABS)
    // ==========================================================================
    const accountTabs = document.querySelectorAll('.account-nav-tabs li');
    const accountContents = document.querySelectorAll('.acc-tab-content');

    accountTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            accountTabs.forEach(t => t.classList.remove('active'));
            accountContents.forEach(c => c.classList.remove('active-tab'));

            this.classList.add('active');
            const targetContentId = this.getAttribute('data-account-tab');
            const targetContent = document.getElementById(targetContentId);
            if(targetContent) targetContent.classList.add('active-tab');
        });
    });


    // ==========================================================================
    // 7. BẢNG ĐIỀU KHIỂN HỆ THỐNG QUẢN TRỊ (ADMIN DASHBOARD CONTROLLER)
    // ==========================================================================
    const adminTabs = document.querySelectorAll('.admin-nav-links li');
    const adminContents = document.querySelectorAll('.admin-panel-tab-content');

    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            adminTabs.forEach(t => t.classList.remove('active-admin-tab'));
            adminContents.forEach(c => c.classList.remove('active-panel'));

            this.classList.add('active-admin-tab');
            const targetPanelId = this.getAttribute('data-admin-panel');
            const targetPanel = document.getElementById(targetPanelId);
            if(targetPanel) targetPanel.classList.add('active-panel');
        });
    });


    // ==========================================================================
    // 8. TÍNH NĂNG CHUYÊN NGHIỆP: NOTIFICATION TOAST POPUP (ĐƠN HÀNG GIẢ LẬP)
    // ==========================================================================
    const orderToast = document.getElementById('order-toast');
    const closeNotiBtn = document.querySelector('.close-noti');

    function showToastNotification(title, message) {
        if(!orderToast) return;
        
        const titleEl = orderToast.querySelector('.noti-title');
        const itemEl = orderToast.querySelector('.noti-item');
        const timeEl = orderToast.querySelector('.noti-time');
        
        if(title) titleEl.textContent = title;
        if(message) itemEl.textContent = message;
        timeEl.textContent = "Vừa xong";

        orderToast.style.display = 'table';
        orderToast.style.opacity = '1';
        orderToast.style.transform = 'translateY(0)';
        orderToast.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

        // Tự động ẩn thông báo sau 6 giây để không gây phiền khách hàng
        setTimeout(() => {
            closeToast();
        }, 6000);
    }

    function closeToast() {
        if(orderToast) {
            orderToast.style.opacity = '0';
            orderToast.style.transform = 'translateY(20px)';
            setTimeout(() => { orderToast.style.display = 'none'; }, 500);
        }
    }

    if(closeNotiBtn) {
        closeNotiBtn.addEventListener('click', closeToast);
    }

    // Kích hoạt chu kỳ chạy thông báo mua hàng ảo ngẫu nhiên sau mỗi 25 giây để kích cầu (Social Proof)
    const buyersPool = ["Nguyễn Hoàng K.", "Phạm Minh T.", "Trần Lady D.", "Đặng Vương L."];
    const itemsPool = ["Áo khoác Blazer Noir Gold", "Đồng hồ nạm vàng Heritage", "Đầm dạ hội Velvet Burgundy"];
    
    setInterval(() => {
        const randomBuyer = buyersPool[Math.floor(Math.random() * buyersPool.length)];
        const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
        
        // Chỉ đẩy thông báo nếu người dùng đang ở Trang Chủ để giữ tính tinh tế tối giản
        if(window.location.hash === '#home' || window.location.hash === '') {
            showToastNotification(`Khách hàng ${randomBuyer} vừa mua`, randomItem);
        }
    }, 25000);


    // ==========================================================================
    // 9. CHAT TRỰC TIẾP FLOATING WIDGET & LIÊN HỆ FORM
    // ==========================================================================
    const chatWidgetBtn = document.getElementById('chatWidgetBtn');
    if(chatWidgetBtn) {
        chatWidgetBtn.addEventListener('click', () => {
            alert("Trợ lý phong cách riêng (Personal Stylist) của Elysium đang chuẩn bị kết nối mã hóa an toàn với bạn qua cổng thông tin nội bộ.");
        });
    }

    const contactFormElement = document.getElementById('contactFormElement');
    if(contactFormElement) {
        contactFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Tin nhắn của Quý khách đã được bảo mật gửi đến Thư ký hội đồng quản trị. Chúng tôi phản hồi lại qua Email trong vòng 15 phút.");
            this.reset();
        });
    }


    // ==========================================================================
    // 10. BỘ LỌC CHUYÊN NGHIỆP TRANG SẢN PHẨM (SHOP FILTERS DEMO)
    // ==========================================================================
    const priceSlider = document.querySelector('.price-slider');
    const priceRangeText = document.querySelector('.price-range-text');

    if(priceSlider && priceRangeText) {
        priceSlider.addEventListener('input', function() {
            // Định dạng tiền tệ VNĐ chuẩn xác trực quan
            let formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.value);
            priceRangeText.textContent = `Giá tối đa dưới: ${formattedValue}`;
        });
    }

    // Tìm kiếm chuyên nghiệp thanh Search Bar đầu trang (Kích hoạt nhanh khi bấm Kính lúp)
    const searchTrigger = document.querySelector('.search-trigger');
    if(searchTrigger) {
        searchTrigger.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.querySelector('.sidebar-overlay');
            const searchInput = document.querySelector('.sidebar-search input');
            
            // Mở menu thanh bên và focus trực tiếp vào ô tìm kiếm
            if(mobileMenu && overlay && searchInput) {
                mobileMenu.classList.add('open');
                overlay.classList.add('active');
                setTimeout(() => searchInput.focus(), 400);
            }
        });
    }
});