// Frontend API client and compatibility layer for the PTCG shop.
const productSeed = [
    { id: '1', name: '皮卡丘 (Pikachu) VMAX', price: 1500, stock: 10, image: 'image/c_img8.jpg', category: 'card', page: 'card1.html' },
    { id: '2', name: '噴火龍 (Charizard) ex', price: 1200, stock: 8, image: 'image/c_img7.jpg', category: 'card', page: 'card2.html' },
    { id: '3', name: '超夢 (Mewtwo) V', price: 1300, stock: 15, image: 'image/c_img6.png', category: 'card', page: 'card3.html' },
    { id: '4', name: '夢幻 (Mew) ex', price: 1400, stock: 12, image: 'image/c_img5.jpg', category: 'card', page: 'card4.html' },
    { id: '5', name: '烈空坐 (Rayquaza) VMAX', price: 1800, stock: 6, image: 'image/c_img4.webp', category: 'card', page: 'card5.html' },
    { id: '6', name: '耿鬼 (Gengar) V', price: 1100, stock: 20, image: 'image/c_img1.png', category: 'card', page: 'card6.html' },
    { id: '7', name: '路卡利歐 (Lucario) ex', price: 1600, stock: 9, image: 'image/c_img3.png', category: 'card', page: 'card7.html' },
    { id: '8', name: '伊布 (Eevee) 英雄', price: 2000, stock: 5, image: 'image/c_img2.jpg', category: 'card', page: 'card8.html' },
    { id: 'cb1', name: '劍盾 蒼響卡盒', price: 3500, stock: 15, image: 'image/cb_img1.jpg', category: 'cardbox', page: 'cb1.html' },
    { id: 'cb2', name: '朱紫 擴充包盒', price: 4200, stock: 12, image: 'image/cb_img2.png', category: 'cardbox', page: 'cb2.html' },
    { id: 'cb3', name: '天地萬物 頂級卡盒', price: 3800, stock: 8, image: 'image/cb_img3.png', category: 'cardbox', page: 'cb3.html' },
    { id: 'cb4', name: 'WPTCG卡盒', price: 2800, stock: 20, image: 'image/cb_img4.webp', category: 'cardbox', page: 'cb4.html' },
    { id: 'cb5', name: '伊布英雄 強化擴充包', price: 5500, stock: 6, image: 'image/cb_img5.jpg', category: 'cardbox', page: 'cb5.html' },
    { id: 'cb6', name: '雙璧戰士 卡盒', price: 3200, stock: 10, image: 'image/cb_img6.webp', category: 'cardbox', page: 'cb6.html' },
    { id: 'cb7', name: 'VMAX 絕頂卡盒', price: 4800, stock: 7, image: 'image/cb_img7.webp', category: 'cardbox', page: 'cb7.html' },
    { id: 'cb8', name: 'PTCG 25週年黃金盒', price: 6000, stock: 5, image: 'image/cb_img8.jpg', category: 'cardbox', page: 'cb8.html' },
    { id: 'cp1', name: '卡片保護套', price: 150, stock: 50, image: 'image/cp_img1.jpg', category: 'periphery', page: 'cp1.html' },
    { id: 'cp2', name: '卡片收納盒', price: 450, stock: 25, image: 'image/cp_img2.jpg', category: 'periphery', page: 'cp2.html' },
    { id: 'cp3', name: '卡片展示架', price: 450, stock: 15, image: 'image/cp_img3.jpg', category: 'periphery', page: 'cp3.html' },
    { id: 'cp4', name: '卡片收納本', price: 600, stock: 30, image: 'image/cp_img4.jpg', category: 'periphery', page: 'cp4.html' },
    { id: 'cp5', name: '清潔套件', price: 350, stock: 40, image: 'image/cp_img5_real.jpg', category: 'periphery', page: 'cp5.html' },
    { id: 'cs1', name: 'PSA10分銀包帽子莉莉艾', price: 33000, stock: 3, image: 'image/s1.jpg', category: 'special', page: 'cs1.html' },
    { id: 'cs2', name: 'BGS 10 Black Label Shiny Charizard Gx', price: 14999, stock: 2, image: 'image/s2.jpg', category: 'special', page: 'cs2.html' },
    { id: 'cs3', name: '日版BGS 黑10 寶可夢鑑定卡大黑噴噴火龍Vmax ssr', price: 21370, stock: 1, image: 'image/s3.jpg', category: 'special', page: 'cs3.html' },
    { id: 'cs4', name: '寶可夢PTCG日文版PSA10分 CGC黑10橫濱皮卡丘 鑑定卡', price: 27000, stock: 1, image: 'image/s4.jpg', category: 'special', page: 'cs4.html' },
    { id: 'cs5', name: 'BGS 稀有鑑定卡 萊希拉姆 & 噴火龍GX Tag Team HR 彩虹卡 中文版 雙倍爆擊 10分', price: 30000, stock: 1, image: 'image/s5.jpg', category: 'special', page: 'cs5.html' }
];

class PtcgApiClient {
    constructor() {
        this.products = [...productSeed];
        this.messages = [];
        this.stats = {
            visitCount: Number(localStorage.getItem('visitCount') || 0),
            lastVisit: localStorage.getItem('lastVisit') || ''
        };
    }

    async request(path, options = {}) {
        const response = await fetch(path, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || '伺服器發生錯誤');
        }
        return data;
    }

    async hydrate() {
        await Promise.allSettled([
            this.refreshProducts(),
            this.refreshMessages(),
            this.refreshCurrentUser()
        ]);
    }

    async refreshProducts() {
        const data = await this.request('/api/products');
        this.products = data.products || this.products;
        return this.products;
    }

    async refreshMessages() {
        const data = await this.request('/api/messages');
        this.messages = data.messages || [];
        return this.messages;
    }

    async refreshStats() {
        const stats = await this.request('/api/stats');
        this.stats = stats;
        localStorage.setItem('visitCount', String(stats.visitCount || 0));
        localStorage.setItem('lastVisit', stats.lastVisit || '');
        return stats;
    }

    async refreshCurrentUser() {
        const data = await this.request('/api/auth/me');
        if (data.user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        } else {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('loginTime');
        }
        return data.user;
    }

    async login(email, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('loginTime', new Date().toISOString());
        return data.user;
    }

    async register(userData) {
        const data = await this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return data.user;
    }

    async logout() {
        await this.request('/api/auth/logout', { method: 'POST', body: '{}' }).catch(() => null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
    }

    async createMessage(userName, content) {
        const data = await this.request('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ userName, content })
        });
        await this.refreshMessages();
        return data.message;
    }

    async createOrder(orderData) {
        const data = await this.request('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        await this.refreshProducts();
        return data.order;
    }

    async myOrders() {
        const data = await this.request('/api/orders/me');
        return data.orders || [];
    }

    async adminUsers() {
        const data = await this.request('/api/admin/users');
        return data.users || [];
    }

    async adminOrders() {
        const data = await this.request('/api/admin/orders');
        return data.orders || [];
    }

    async adminSummary() {
        return this.request('/api/admin/summary');
    }

    getProducts(category = null) {
        if (category) {
            return this.products.filter(product => product.category === category);
        }
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    searchProducts(query) {
        const cleanQuery = String(query || '').toLowerCase();
        return this.products.filter(product => product.name.toLowerCase().includes(cleanQuery));
    }

    getMessages() {
        return [...this.messages].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    addMessage(user, content) {
        const message = {
            id: Date.now(),
            user,
            content,
            date: new Date().toISOString()
        };
        this.messages.unshift(message);
        this.createMessage(user, content).catch(error => {
            console.error('Failed to save message:', error);
            alert(error.message || '留言儲存失敗');
        });
        return message;
    }

    getVisitCount() {
        return this.stats.visitCount || Number(localStorage.getItem('visitCount') || 0);
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    logoutUser() {
        return this.logout();
    }

    getProductReviews(productId) {
        const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        return reviews.filter(review => review.productId === productId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    addProductReview(review) {
        try {
            const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
            reviews.push({
                id: Date.now().toString(),
                ...review,
                date: new Date().toISOString()
            });
            localStorage.setItem('productReviews', JSON.stringify(reviews));
            return true;
        } catch (error) {
            console.error('Error adding product review:', error);
            return false;
        }
    }

    getAllProductReviews() {
        return JSON.parse(localStorage.getItem('productReviews')) || [];
    }

    deleteProductReview(reviewId) {
        const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        localStorage.setItem('productReviews', JSON.stringify(reviews.filter(review => review.id !== reviewId)));
        return true;
    }

    escapeHtml(unsafe) {
        return escapeHtml(unsafe);
    }

    sanitizeInput(input) {
        return sanitizeInput(input);
    }
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\bon\w+\s*=/gi, '')
        .trim();
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function updateGlobalMemberHeader(user) {
    const memberSection = document.getElementById('memberSection');
    if (!memberSection) return;

    if (!user) {
        memberSection.innerHTML = `
            <a href="member.html" id="memberLink">
                <img src="image/images__1_-removebg-preview.png" alt="會員圖示">
                <span id="memberStatus">登入</span>
            </a>
        `;
        return;
    }

    memberSection.innerHTML = `
        <div class="member-dropdown">
            <a href="member_area.html" class="member-info">
                <img src="image/images__1_-removebg-preview.png" alt="會員圖示">
                <span>${escapeHtml(user.name || '會員')}</span>
            </a>
            <div class="dropdown-menu">
                <a href="member_area.html">會員專區</a>
                ${user.role === 'admin' ? '<a href="admin_panel.html">管理面板</a>' : ''}
                <a href="#" onclick="api.logout().then(() => location.href='index.html'); return false;">登出</a>
            </div>
        </div>
    `;
}

function initCookieNotice() {
    const cookieBar = document.getElementById('cookieBar') || document.getElementById('cookieBanner');
    const acceptButton = document.getElementById('acceptCookies');
    const rejectButton = document.getElementById('rejectCookies');
    if (!cookieBar || !acceptButton || !rejectButton) return;

    if (!localStorage.getItem('cookieConsent')) {
        cookieBar.style.display = cookieBar.classList.contains('cookie-bar') ? 'flex' : 'block';
    }

    acceptButton.onclick = function () {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBar.style.display = 'none';
    };

    rejectButton.onclick = function () {
        localStorage.setItem('cookieConsent', 'rejected');
        cookieBar.style.display = 'none';
    };
}

window.api = new PtcgApiClient();
window.database = window.api;
window.mockDB = window.api;

document.addEventListener('DOMContentLoaded', async function () {
    initCookieNotice();
    await window.api.hydrate();
    updateGlobalMemberHeader(window.api.getCurrentUser());
    window.dispatchEvent(new CustomEvent('ptcg:api-ready'));
});
