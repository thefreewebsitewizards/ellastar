// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Carousel functionality
let currentSlideIndex = 0;
const totalSlides = 7;

function moveCarousel(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    updateCarousel();
}

function currentSlide(slideIndex) {
    currentSlideIndex = slideIndex - 1;
    updateCarousel();
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.dot');
    
    if (track) {
        const translateX = -(currentSlideIndex * (100 / totalSlides));
        track.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

// Auto-play carousel (optional)
setInterval(() => {
    moveCarousel(1);
}, 5000); // Change slide every 5 seconds

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(254, 254, 254, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(254, 254, 254, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const firstName = this.querySelector('#firstName').value.trim();
        const lastName = this.querySelector('#lastName').value.trim();
        const email = this.querySelector('#email').value.trim();
        const phone = this.querySelector('#phone').value.trim();
        const message = this.querySelector('#message').value.trim();
        
        // Enhanced validation with specific error messages
        if (!firstName || !lastName || !email || !phone || !message) {
            const missingFields = [];
            if (!firstName) missingFields.push('First Name');
            if (!lastName) missingFields.push('Last Name');
            if (!email) missingFields.push('Email');
            if (!phone) missingFields.push('Phone');
            if (!message) missingFields.push('Message');
            
            showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Create mailto URL with pre-filled content for universal compatibility
        const fullName = `${firstName} ${lastName}`;
        const subject = encodeURIComponent(`Contact Form - ${fullName}`);
        const body = encodeURIComponent(
            `Hello Ella,\n\n` +
            `I would like to work with you!\n\n` +
            `Name: ${fullName}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n\n` +
            `Message:\n${message}\n\n` +
            `Looking forward to hearing from you!\n\n` +
            `Best regards,\n${fullName}`
        );
        
        // Create mailto URL that works on all devices
        const mailtoUrl = `mailto:Ella.starr@hotmail.com?subject=${subject}&body=${body}`;
        
        // Show immediate feedback
        showNotification(isMobile ? 'Opening email app on your device...' : 'Opening email app...', 'success');
        
        // Enhanced mobile detection and handling
        let mailtoTriggered = false;
        
        // Try to open mailto link
        try {
            // Create and trigger mailto link
            const link = document.createElement('a');
            link.href = mailtoUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // Add event listeners to detect if mailto worked
            const handleBlur = () => {
                mailtoTriggered = true;
                window.removeEventListener('blur', handleBlur);
            };
            
            const handlePageHide = () => {
                mailtoTriggered = true;
                window.removeEventListener('pagehide', handlePageHide);
            };
            
            window.addEventListener('blur', handleBlur);
            window.addEventListener('pagehide', handlePageHide);
            
            link.click();
            document.body.removeChild(link);
            
            // Reset form
            this.reset();
            
            // Enhanced fallback for mobile devices
            setTimeout(() => {
                if (!mailtoTriggered) {
                    // Mailto likely didn't work, provide comprehensive fallback
                    showNotification('Email ready to copy: Ella.starr@hotmail.com', 'info');
                    
                    // Copy email to clipboard
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText('Ella.starr@hotmail.com')
                            .then(() => {
                                showNotification('Email copied to clipboard!', 'success');
                            })
                            .catch(() => {
                                // Fallback for older devices
                                const emailText = document.createElement('input');
                                emailText.value = 'Ella.starr@hotmail.com';
                                emailText.style.position = 'absolute';
                                emailText.style.left = '-9999px';
                                document.body.appendChild(emailText);
                                emailText.select();
                                document.execCommand('copy');
                                document.body.removeChild(emailText);
                                showNotification('Email copied to clipboard!', 'success');
                            });
                    }
                    
                    // Show contact info modal on mobile
                    if (isMobile) {
                        showContactModal(fullName, email, phone, message);
                    }
                }
            }, isMobile ? 2000 : 1000);
            
        } catch (error) {
            // Handle any errors
            showNotification('Unable to open email app. Email: Ella.starr@hotmail.com', 'error');
            this.reset();
        }
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation function for mobile compatibility
function isValidPhone(phone) {
    // Remove all non-numeric characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Allow various phone formats: 10+ digits
    return cleanPhone.length >= 10;
}

// Mobile-friendly contact modal for when mailto fails
function showContactModal(name, email, phone, message) {
    // Remove existing modal
    const existingModal = document.querySelector('.contact-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="contact-modal-content">
            <div class="contact-modal-header">
                <h3>Contact Ella Starr</h3>
                <button class="contact-modal-close">&times;</button>
            </div>
            <div class="contact-modal-body">
                <p><strong>Your message is ready to send!</strong></p>
                <div class="contact-details">
                    <p><strong>To:</strong> Ella.starr@hotmail.com</p>
                    <p><strong>Subject:</strong> Contact Form - ${name}</p>
                    <div class="message-preview">
                        <p><strong>Your message:</strong></p>
                        <p>Name: ${name}</p>
                        <p>Email: ${email}</p>
                        <p>Phone: ${phone}</p>
                        <p>Message: ${message}</p>
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="btn-copy-email">Copy Email</button>
                    <button class="btn-open-email">Open Email App</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .contact-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 400px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .contact-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .contact-modal-header h3 {
            margin: 0;
            color: #333;
            font-size: 1.2rem;
        }
        
        .contact-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .contact-modal-body {
            padding: 20px;
        }
        
        .contact-details {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .message-preview {
            margin-top: 10px;
            padding: 10px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        
        .contact-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn-copy-email, .btn-open-email {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background-color 0.3s;
        }
        
        .btn-copy-email {
            background: #4a90a4;
            color: white;
        }
        
        .btn-open-email {
            background: #28a745;
            color: white;
        }
        
        .btn-copy-email:hover, .btn-open-email:hover {
            opacity: 0.9;
        }
        
        @media (max-width: 480px) {
            .contact-modal-content {
                margin: 10px;
                max-width: calc(100% - 20px);
            }
            
            .contact-actions {
                flex-direction: column;
            }
        }
    `;
    
    // Inject modal styles
    if (!document.querySelector('#contact-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'contact-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.contact-modal-close').addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('.btn-copy-email').addEventListener('click', () => {
        const email = 'Ella.starr@hotmail.com';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email)
                .then(() => {
                    showNotification('Email copied to clipboard!', 'success');
                })
                .catch(() => {
                    fallbackCopy(email);
                });
        } else {
            fallbackCopy(email);
        }
    });
    
    modal.querySelector('.btn-open-email').addEventListener('click', () => {
        const mailtoUrl = `mailto:Ella.starr@hotmail.com?subject=${encodeURIComponent(`Contact Form - ${name}`)}&body=${encodeURIComponent(
            `Hello Ella,\n\nI would like to work with you!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}\n\nLooking forward to hearing from you!\n\nBest regards,\n${name}`
        )}`;
        
        window.location.href = mailtoUrl;
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Fallback copy function for older browsers
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification('Email copied to clipboard!', 'success');
}

// Notification system with mobile positioning
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Check if mobile device for positioning
    const isMobile = window.innerWidth <= 768;
    
    // Add styles with mobile positioning
    notification.style.cssText = `
        position: fixed;
        ${isMobile ? 'top: 20px; left: 20px; right: 20px;' : 'top: 100px; right: 20px;'}
        background: ${type === 'success' ? '#4a90a4' : type === 'error' ? '#ff7f7f' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
        transition: transform 0.3s ease;
        ${isMobile ? 'max-width: none; width: auto;' : 'max-width: 350px;'}
        font-size: ${isMobile ? '0.9rem' : '1rem'};
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        min-width: 24px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = `${isMobile ? 'translateY(-100px)' : 'translateX(400px)'}`;
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = `${isMobile ? 'translateY(-100px)' : 'translateX(400px)'}`;
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.blog-card, .product-card, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});



// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
});

// Social media link tracking (for analytics)
function trackSocialClick(platform) {
    // This would integrate with your analytics platform
    console.log(`Social media click: ${platform}`);
    
    // Example: Google Analytics event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
            'social_platform': platform,
            'event_category': 'engagement'
        });
    }
}

// Add click tracking to social links
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-links a, .footer-social a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            let platform = 'unknown';
            
            if (href.includes('instagram')) platform = 'instagram';
            else if (href.includes('tiktok')) platform = 'tiktok';
            else if (href.includes('mailto')) platform = 'email';
            
            trackSocialClick(platform);
        });
    });
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Smooth reveal animation for sections
function revealSections() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15
    });
    
    sections.forEach(section => {
        section.classList.add('reveal');
        sectionObserver.observe(section);
    });
}

// Add CSS for reveal animation
const revealStyles = `
    .reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject reveal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = revealStyles;
document.head.appendChild(styleSheet);

// Initialize reveal animations
document.addEventListener('DOMContentLoaded', revealSections);

// Back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--ocean-blue);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(74, 144, 164, 0.3);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(backToTop);
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    
    // Update navbar
    const navbar = document.querySelector('.navbar');
    if (scrolled > 100) {
        navbar.style.background = 'rgba(254, 254, 254, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(254, 254, 254, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    

}, 10);

window.addEventListener('scroll', debouncedScrollHandler);