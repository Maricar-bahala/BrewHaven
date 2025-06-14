
// Cart state management
let cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateCartCount();
});

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            id: Date.now() // Simple ID generation
        });
    }
    
    saveCart();
    updateCartCount();
    return true;
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartCount();
        showNotification('Cart cleared!', 'success');
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('brew-haven-cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Update cart display on cart page
function updateCartDisplay() {
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    
    if (!cartEmpty || !cartContent || !cartItems) return; // Not on cart page
    
    if (cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartContent.classList.add('hidden');
        return;
    }
    
    cartEmpty.classList.add('hidden');
    cartContent.classList.remove('hidden');
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add each cart item
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItems.appendChild(cartItemElement);
    });
    
    // Update totals
    updateCartTotals();
}

// Create cart item HTML element
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image || 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=COFFEE'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            ${item.description ? `<p class="cart-item-description">${item.description}</p>` : ''}
            <p class="cart-item-price">${item.price}</p>
        </div>
        <div class="cart-item-quantity">
            <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
            ₱ ${(parsePrice(item.price) * item.quantity).toFixed(0)}
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    `;
    return div;
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => {
        const price = parsePrice(item.price);
        return sum + (price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = `₱ ${subtotal.toFixed(0)}`;
    document.getElementById('cart-tax').textContent = `₱ ${tax.toFixed(0)}`;
    document.getElementById('cart-total').textContent = `₱ ${total.toFixed(0)}`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => {
        const price = parsePrice(item.price);
        return sum + (price * item.quantity);
    }, 0);
    
    const tax = total * 0.12;
    const finalTotal = total + tax;
    
    alert(`Thank you for your order!\n\nOrder Summary:\nSubtotal: ₱ ${total.toFixed(0)}\nTax: ₱ ${tax.toFixed(0)}\nTotal: ₱ ${finalTotal.toFixed(0)}\n\nYour order will be ready in 10-15 minutes.`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
    
    showNotification('Order placed successfully!', 'success');
}

// Helper function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Helper function to parse price string to float
function parsePrice(priceString) {
    if (!priceString) return 0;
    priceString = priceString.trim();
    // Remove all characters except digits and decimal point
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}
