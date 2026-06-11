
function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartTotal();
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>價格: $${item.price}</p>
                <p>數量: ${item.quantity}</p>
                <p>小計: $${itemTotal}</p>
                <button onclick="removeItem('${item.id}')">移除</button>
            </div>
        `;
    });

    localStorage.setItem('checkoutTotal', totalPrice);
}

function updateCartTotal() {
    const totalPrice = parseFloat(localStorage.getItem('checkoutTotal')) || 0;
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = `商品總金額: $${totalPrice}`;
    }
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartTotal();
}

window.onload = function () {
    loadCart();
    updateCartTotal();
};

// 結帳頁面邏輯
function checkoutPageInit() {
    const totalAmount = parseFloat(localStorage.getItem('checkoutTotal')) || 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const totalAmountElement = document.getElementById('totalAmount');
    if (totalAmountElement) {
        totalAmountElement.textContent = `$${totalAmount}`;
    }

    const cartDetailsContainer = document.getElementById('cartDetails');
    if (cartDetailsContainer) {
        cart.forEach(item => {
            cartDetailsContainer.innerHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>數量: ${item.quantity}</p>
                    <p>小計: $${item.price * item.quantity}</p>
                </div>
            `;
        });
    }

    localStorage.setItem('orderDetails', JSON.stringify({
        totalAmount: totalAmount,
        cartDetails: cart
    }));
}

// 確認訂單頁面邏輯
function confirmationPageInit() {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || {};

    const finalAmountElement = document.getElementById('finalAmount');
    if (finalAmountElement) {
        finalAmountElement.textContent = `$${orderDetails.totalAmount}`;
    }

    const cartDetailsContainer = document.getElementById('cartDetails');
    if (cartDetailsContainer && orderDetails.cartDetails) {
        orderDetails.cartDetails.forEach(item => {
            cartDetailsContainer.innerHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>數量: ${item.quantity}</p>
                    <p>小計: $${item.price * item.quantity}</p>
                </div>
            `;
        });
    }
}
