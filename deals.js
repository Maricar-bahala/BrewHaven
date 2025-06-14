document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-deal');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dealItem = this.closest('.deal-card');
            if (!dealItem) return;

            const itemName = dealItem.querySelector('h3').textContent;
            const itemPrice = dealItem.querySelector('.deal-price .discounted, .deal-price .original').textContent;
            const itemImage = dealItem.querySelector('img') ? dealItem.querySelector('img').src : '';

            const item = {
                name: itemName,
                price: itemPrice,
                image: itemImage
            };

            // Add to cart
            let cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];
            const existingItem = cart.find(cartItem => cartItem.name === item.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...item,
                    quantity: 1,
                    id: Date.now()
                });
            }
            
            localStorage.setItem('brew-haven-cart', JSON.stringify(cart));
            updateCartCount();

            // Visual feedback
            this.textContent = 'Added!';
            this.style.background = '#28a745';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Get Deal';
                this.style.background = '';
            }, 2000);
            
            // Show success message
            showNotification(`${itemName} added to cart!`);
        });
    });

    // Add to cart functionality for special packages
    const packageButtons = document.querySelectorAll('.btn-package');

    packageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageCard = this.closest('.package-card');
            if (!packageCard) return;

            const packageName = packageCard.querySelector('.package-header h3').textContent;
            const packageItems = Array.from(packageCard.querySelectorAll('.package-items p')).map(p => p.textContent).join(', ');
            let packagePriceElement = packageCard.querySelector('.package-price .discounted');
            if (!packagePriceElement) {
                packagePriceElement = packageCard.querySelector('.package-price .original');
            }
            const packagePrice = packagePriceElement ? packagePriceElement.textContent.trim() : '';
            // Use a placeholder image for packages or customize as needed
            const packageImage = 'images/placeholder-product.svg';

            const packageItem = {
                name: packageName,
                description: packageItems,
                price: packagePrice,
                image: packageImage
            };

            // Add to cart
            let cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];
            const existingItem = cart.find(cartItem => cartItem.name === packageItem.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...packageItem,
                    quantity: 1,
                    id: Date.now()
                });
            }
            
            localStorage.setItem('brew-haven-cart', JSON.stringify(cart));
            updateCartCount();

            // Visual feedback
            this.textContent = 'Added!';
            this.style.background = '#28a745';

            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Order Package';
                this.style.background = '';
            }, 2000);

            // Show success message
            showNotification(`${packageName} added to cart!`);
        });
    });
});

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
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
