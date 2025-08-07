// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('show');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
    }
});

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
        // Close mobile menu if open
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
    });
});

// Typing animation
const typingText = document.getElementById('typing-text');
const texts = [
    'CSE Student & Developer', 
    'Full Stack Developer', 
    'Problem Solver', 
    'Tech Enthusiast',
    'Code Enthusiast',
    'Future Software Engineer'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(typeWriter, isDeleting ? 50 : 100);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000);
});

// Skill bars animation with Intersection Observer
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                    bar.setAttribute('data-animated', 'true');
                }, index * 200);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Contact form handling with validation
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showFieldError(field, message) {
    field.classList.add('form-error');
    field.classList.remove('form-success');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.classList.remove('form-error');
    field.classList.add('form-success');
    
    // Remove error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showSuccessMessage(message) {
    // Remove existing success message
    const existingSuccess = contactForm.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    contactForm.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Real-time validation
nameInput.addEventListener('blur', () => {
    if (!validateName(nameInput.value)) {
        showFieldError(nameInput, 'Name must be at least 2 characters long');
    } else {
        showFieldSuccess(nameInput);
    }
});

emailInput.addEventListener('blur', () => {
    if (!validateEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
    } else {
        showFieldSuccess(emailInput);
    }
});

messageInput.addEventListener('blur', () => {
    if (!validateMessage(messageInput.value)) {
        showFieldError(messageInput, 'Message must be at least 10 characters long');
    } else {
        showFieldSuccess(messageInput);
    }
});

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;
    
    let isValid = true;
    
    // Validate all fields
    if (!validateName(name)) {
        showFieldError(nameInput, 'Name must be at least 2 characters long');
        isValid = false;
    } else {
        showFieldSuccess(nameInput);
    }
    
    if (!validateEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        showFieldSuccess(emailInput);
    }
    
    if (!validateMessage(message)) {
        showFieldError(messageInput, 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        showFieldSuccess(messageInput);
    }
    
    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        
        // Simulate form submission delay
        setTimeout(() => {
            showSuccessMessage(`Thank you ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            
            // Remove validation classes
            [nameInput, emailInput, messageInput].forEach(field => {
                field.classList.remove('form-error', 'form-success');
            });
        }, 2000);
    }
});

// Add scroll effect to navigation
let lastScrollTop = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow when scrolled
    if (scrollTop > 100) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
    
    // Hide/show nav on scroll (optional)
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Project buttons functionality
document.querySelectorAll('.project-card button').forEach(button => {
    button.addEventListener('click', function() {
        const isDemo = this.textContent.includes('Demo');
        const projectName = this.closest('.project-card').querySelector('h3').textContent;
        
        // Add loading state
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            if (isDemo) {
                alert(`Opening demo for ${projectName}. In a real portfolio, this would link to your live project!`);
            } else {
                alert(`Opening GitHub repository for ${projectName}. In a real portfolio, this would link to your GitHub repo!`);
            }
            
            // Reset button
            this.textContent = originalText;
            this.disabled = false;
        }, 1000);
    });
});

// Add animation to elements when they come into view
const animateOnScrollObserver = new IntersectionObserver((entries) => {
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

// Apply animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScrollObserver.observe(section);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
    }
});

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

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
    // Additional scroll-based animations can be added here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Console message for developers
console.log(`
🚀 Portfolio Website Loaded Successfully!
📧 Contact: your.email@example.com
💼 GitHub: github.com/yourusername
🎯 Built with HTML, CSS, JavaScript & Tailwind CSS
`);