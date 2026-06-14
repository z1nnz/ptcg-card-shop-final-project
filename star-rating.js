// 星星評分功能模塊
class StarRating {
    constructor(containerSelector = '#star-rating') {
        this.container = document.querySelector(containerSelector);
        this.ratingInput = document.getElementById('rating');
        this.ratingText = document.getElementById('rating-text');
        this.selectedRating = 0;
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.createStars();
        this.bindEvents();
    }
    
    createStars() {
        // 如果已經有星星，直接使用
        let stars = this.container.querySelectorAll('.star');
        if (stars.length === 0) {
            // 創建星星
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.setAttribute('data-rating', i);
                star.textContent = '☆';
                this.container.appendChild(star);
            }
            stars = this.container.querySelectorAll('.star');
        }
        
        this.stars = stars;
    }
    
    bindEvents() {
        // 為每個星星添加點擊事件
        this.stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.selectedRating = parseInt(star.getAttribute('data-rating'));
                this.ratingInput.value = this.selectedRating;
                this.updateStars(this.selectedRating);
                this.updateRatingText(this.selectedRating);
            });

            // 添加懸停效果
            star.addEventListener('mouseenter', () => {
                const hoverRating = parseInt(star.getAttribute('data-rating'));
                this.updateStars(hoverRating);
            });
        });

        // 鼠標離開星星區域時恢復到選中狀態
        this.container.addEventListener('mouseleave', () => {
            this.updateStars(this.selectedRating);
        });
    }
    
    updateStars(rating) {
        this.stars.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.style.color = '#ffd700';
            } else {
                star.textContent = '☆';
                star.style.color = '#ddd';
            }
        });
    }
    
    updateRatingText(rating) {
        const texts = ['', '很差', '不好', '普通', '好', '很好'];
        if (this.ratingText) {
            this.ratingText.textContent = `${rating} 星 - ${texts[rating]}`;
            this.ratingText.style.color = '#c41f33';
        }
    }
    
    reset() {
        this.selectedRating = 0;
        this.ratingInput.value = '';
        this.updateStars(0);
        if (this.ratingText) {
            this.ratingText.textContent = '請選擇評分';
            this.ratingText.style.color = '#666';
        }
    }
    
    getRating() {
        return this.selectedRating;
    }
}

// 全局函數供舊代碼使用
function initStarRating() {
    window.starRatingInstance = new StarRating();
}

// 檢查評分是否有效
function validateRating() {
    const rating = parseInt(document.getElementById('rating').value);
    return rating && rating >= 1 && rating <= 5;
}

// 重置星星評分
function resetStarRating() {
    if (window.starRatingInstance) {
        window.starRatingInstance.reset();
    }
}
