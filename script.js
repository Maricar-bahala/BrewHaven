// Modal and form validation script

document.addEventListener('DOMContentLoaded', () => {
  // Modal elements
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');

  // Open modal buttons
  const openLoginBtn = document.getElementById('open-login-modal');
  const openRegisterBtn = document.getElementById('open-register-modal');

  // Close buttons
  const closeLoginBtn = document.getElementById('close-login-modal');
  const closeRegisterBtn = document.getElementById('close-register-modal');

  // Open login modal
  openLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
  });

  // Open register modal
  openRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'block';
  });

  // Close login modal
  closeLoginBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  // Close register modal
  closeRegisterBtn.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });

  // Close modals when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
      registerModal.style.display = 'none';
    }
  });

  // Login form validation
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!password) {
        alert('Please enter your password.');
        return;
      }
      alert('Login successful (demo).');
      loginForm.reset();
      loginModal.style.display = 'none';
    });
  }

  // Register form validation
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();
      const passwordConfirm = registerForm.password_confirm.value.trim();
      if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!password) {
        alert('Please enter a password.');
        return;
      }
      if (password !== passwordConfirm) {
        alert('Passwords do not match.');
        return;
      }
      alert('Registration successful (demo).');
      registerForm.reset();
      registerModal.style.display = 'none';
    });
  }
});

function validateEmail(email) {
  // Simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Category tabs functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you could add functionality to filter products
            console.log('Selected category:', this.textContent);
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const name = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.price').textContent;
            const image = productCard.querySelector('img').src;
            
            const item = {
                name: name,
                price: price,
                image: image
            };
            
            // Add to cart
            if (typeof addToCart === 'function') {
                addToCart(item);
            } else {
                // Fallback for pages without cart.js
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
            }
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.background = '#28a745';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '#8B4513';
            }, 2000);
            
            // Show success message
            showNotification(`${name} added to cart!`);
        });
    });

    // Update cart count on page load
    updateCartCount();

    // Newsletter subscription
    const subscribeButton = document.querySelector('.btn-subscribe');
    const emailInput = document.querySelector('.newsletter input');
    
    if (subscribeButton && emailInput) {
        subscribeButton.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                showNotification('Successfully subscribed to newsletter!');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .about-text');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('brew-haven-cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Loading animation for product images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.product-card img, .hero-image img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});
