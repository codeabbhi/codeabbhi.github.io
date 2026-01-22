// ===================================
// NAVIGATION
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// SMOOTH SCROLLING
// ===================================
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

// ===================================
// ANIMATED COUNTERS
// ===================================
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
};

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
    counterObserver.observe(stat);
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add animation to sections
const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .achievement-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollAnimationObserver.observe(el);
});

// ===================================
// FORM HANDLING
// ===================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        alert('Please fill in all fields.');
        submitBtn.disabled = false;
        return;
    }

    // Try to send via server-side endpoint (Twilio)
    try {
        const res = await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            alert('Thanks — your message was sent via SMS.');
        } else {
            // fallback to open SMS or copy to clipboard
            const smsNumber = '+919652568189';
            const smsBody = `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = `sms:${smsNumber}?body=${encodeURIComponent(smsBody)}`;
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(smsBody);
                alert(`Could not send automatically. SMS content copied to clipboard. Please send it to ${smsNumber}.`);
            } else {
                alert(`Could not send automatically. Please send the following message to ${smsNumber}:\n\n${smsBody}`);
            }
        }
    } catch (err) {
        console.error('Error sending via server:', err);
        const smsNumber = '+919652568189';
        const smsBody = `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            window.location.href = `sms:${smsNumber}?body=${encodeURIComponent(smsBody)}`;
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            try { await navigator.clipboard.writeText(smsBody); alert(`Could not reach server. SMS content copied to clipboard. Please send it to ${smsNumber}.`); } catch { alert(`Could not reach server. Please send the following message to ${smsNumber}:\n\n${smsBody}`); }
        } else {
            alert(`Could not reach server. Please send the following message to ${smsNumber}:\n\n${smsBody}`);
        }
    }

    contactForm.reset();
    submitBtn.disabled = false;
});

// ===================================
// TYPING EFFECT FOR HERO TITLE
// ===================================
const heroTitle = document.querySelector('.hero-title');
const titles = ['Full Stack Developer', 'React.js Enthusiast', 'Problem Solver', 'Tech Innovator'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeTitle() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        heroTitle.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        heroTitle.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
        // Pause at end
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeTitle, typingSpeed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeTitle, 1000);
});

// ===================================
// PARALLAX EFFECT FOR GRADIENT ORBS
// ===================================
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===================================
// ACTIVE NAVIGATION LINK
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// SKILL ITEMS ANIMATION
// ===================================
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
});

// ===================================
// PROJECT CARD TILT EFFECT
// ===================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// CURSOR TRAIL EFFECT
// ===================================
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(260, 85%, 65%), hsl(320, 85%, 65%));
        pointer-events: none;
        opacity: 0.6;
        z-index: 9999;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 300);
    }, 500);
    
    return trail;
};

let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 50) {
        const trail = createCursorTrail();
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        lastTrailTime = now;
    }
});

// ===================================
// LAZY LOADING IMAGES
// ===================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(260, 85%, 65%), hsl(320, 85%, 65%));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(138, 43, 226, 0.4);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
};

createScrollTopButton();

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Debounce function for scroll events
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

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(highlightNavigation, 100));

// ===================================
// CONSOLE EASTER EGG
// ===================================
console.log('%c👋 Hello, Developer!', 'color: #8a2be2; font-size: 24px; font-weight: bold;');
console.log('%cLooking for something? Feel free to explore the code!', 'color: #00d4ff; font-size: 14px;');
console.log('%cBuilt with ❤️ by Abhi Ram', 'color: #ff4081; font-size: 12px;');

// ===================================
// INITIALIZE
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully! 🚀');
});
