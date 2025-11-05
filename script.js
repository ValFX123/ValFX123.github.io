/* Main Script - ValFX Portfolio */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.mobile-menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('mobile-menu-overlay');
        document.body.appendChild(overlay);
    }
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// Contact Form Validation & Submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            const formGroups = form.querySelectorAll('.form-group');
            
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                const errorSpan = group.querySelector('.form-error');
                
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    group.classList.add('error');
                    errorSpan.textContent = 'This field is required';
                } else if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        group.classList.add('error');
                        errorSpan.textContent = 'Please enter a valid email';
                    } else {
                        group.classList.remove('error');
                    }
                } else {
                    group.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('.form-submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    form.style.display = 'none';
                    const successMsg = form.nextElementSibling;
                    successMsg.style.display = 'flex';
                    
                    // Reset form after showing success
                    setTimeout(() => {
                        form.reset();
                        form.style.display = 'flex';
                        successMsg.style.display = 'none';
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 5000);
                }, 1500);
            }
        });
        
        // Clear errors on input
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                group.classList.remove('error');
            });
        });
    }
});

// Typing Animation for Hero
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text') || typingElement.textContent;
        typingElement.textContent = '';
        setTimeout(() => {
            typeWriter(typingElement, text, 50);
        }, 1000);
    }
});

// Button Ripple Effect
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .service-btn, .project-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Console Message
console.log('%c Welcome to ValFX Portfolio! ', 'background: #dc143c; color: #fff; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Designed & Built with ❤️ by ValFX ', 'background: #000; color: #dc143c; font-size: 14px; padding: 5px;');
