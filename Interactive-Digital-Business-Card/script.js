// DOM Elements
const card = document.querySelector('.card');
const flipBtn = document.querySelector('.flip-btn');
const contactBtn = document.querySelector('.contact-btn');
const modal = document.getElementById('contactModal');
const closeBtn = document.querySelector('.close-btn');
const contactForm = document.getElementById('contactForm');
const themeToggle = document.querySelector('.theme-toggle');

// Theme Toggle Functionality
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';
updateTheme();

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('darkTheme', isDarkTheme);
    updateTheme();
});

function updateTheme() {
    document.body.classList.toggle('dark-theme', isDarkTheme);
    themeToggle.querySelector('i').className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
}

// 3D Card Tilt Effect
const container = document.querySelector('.container');
container.addEventListener('mousemove', (e) => {
    const card = container.querySelector('.card');
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = -(x - centerX) / 20;
    
    if (!card.classList.contains('flipped')) {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

container.addEventListener('mouseleave', () => {
    const card = container.querySelector('.card');
    if (!card.classList.contains('flipped')) {
        card.style.transform = 'rotateX(0) rotateY(0)';
    }
});

// Card Flip Functionality with enhanced animation
flipBtn.addEventListener('click', () => {
    card.style.transform = card.classList.contains('flipped') 
        ? 'rotateY(0)'
        : 'rotateY(180deg)';
    card.classList.toggle('flipped');
});

// Modal Functionality with smooth transitions
contactBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', closeModal);

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Form Validation and Submission with enhanced feedback
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    if (name === '' || email === '' || message === '') {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
        // Simulate sending data (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store form data in localStorage (bonus feature)
        const formData = {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };
        
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form and close modal
        contactForm.reset();
        closeModal();
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Typing Animation for Tagline
function typeWriter(element, text, speed = 100) {
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

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const tagline = document.querySelector('.tagline');
    const text = tagline.textContent;
    typeWriter(tagline, text);
    
    // Add animation classes to skills
    const skills = document.querySelectorAll('.skill-tag');
    skills.forEach((skill, index) => {
        setTimeout(() => {
            skill.classList.add('show');
        }, index * 200);
    });
}); 