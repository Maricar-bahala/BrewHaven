document.addEventListener('DOMContentLoaded', function() {
    // BUY IT NOW button functionality
    const buyItNowButton = document.querySelector('.btn-primary');
    if (buyItNowButton) {
        buyItNowButton.addEventListener('click', function() {
            // Define the specific product to add
            const product = {
                name: 'Cold Brew Coffee',
                price: '₱ 90',
                image: 'images/cold_brew.jpg',
                quantity: 1,
                id: Date.now()
            };

            // Add to cart
            let cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];
            const existingItem = cart.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('brew-haven-cart', JSON.stringify(cart));
            // Update cart count in header
            const cartCountElements = document.querySelectorAll('#cart-count');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElements.forEach(element => {
                element.textContent = totalItems;
            });

            // Navigate to cart page (checkout)
            window.location.href = 'cart.html';
        });
    }

    // VIEW RANGE button functionality
    const viewRangeButton = document.querySelector('.btn-secondary');
    if (viewRangeButton) {
        viewRangeButton.addEventListener('click', function() {
            // Navigate to menu page
            window.location.href = 'menu.html';
        });
    }

    // Get Started button functionality to open Sign Up Modal
    const getStartedBtn = document.getElementById('get-started-btn');
    const registerModal = document.getElementById('register-modal');
    const closeRegisterModalBtn = document.getElementById('close-register-modal');

    if (getStartedBtn && registerModal) {
        getStartedBtn.addEventListener('click', function() {
            registerModal.style.display = 'block';
        });
    }

    if (closeRegisterModalBtn && registerModal) {
        closeRegisterModalBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }

    // Optional: Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Login button functionality to open Login Modal
    const loginBtn = document.getElementById('hero-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModalBtn = document.getElementById('close-login-modal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }

    if (closeLoginModalBtn && loginModal) {
        closeLoginModalBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    // Register nav button functionality to open Sign Up Modal
    const registerNavBtn = document.getElementById('open-register-modal');

    if (registerNavBtn && registerModal) {
        registerNavBtn.addEventListener('click', function(event) {
            event.preventDefault();
            registerModal.style.display = 'block';
        });
    }
});
