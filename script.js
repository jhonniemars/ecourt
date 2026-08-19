// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('visible');
    }
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Scroll Indicator =====
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ===== Fade In Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .contact-card, .about-grid, .gallery-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Set Minimum Date for Booking =====
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ===== Booking Form Submission =====
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Build message for Instagram/Messenger
    const message = `
🎾 NEW BOOKING REQUEST - E.Court

 Name: ${data.name}
📞 Contact: ${data.phone}
 Date: ${data.date}
⏰ Time: ${data.time}
👥 Players: ${data.players}
🏓 Courts: ${data.courts}
📝 Notes: ${data.notes || 'None'}
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(message).then(() => {
        alert('✅ Booking details copied to clipboard!\n\nPlease paste this message in our Instagram DM or Facebook Messenger to confirm your booking.\n\n📱 Instagram: @ecourt.gingoog\n💬 Facebook Messenger: E.Court');
    }).catch(() => {
        alert('✅ Booking request received!\n\nPlease send us a message on Instagram or Facebook Messenger with your booking details to confirm.\n\n📱 Instagram: @ecourt.gingoog\n💬 Facebook Messenger: E.Court');
    });

    // Show success message
    const formSection = document.querySelector('.booking-form-section');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Booking Request Submitted!</h3>
        <p>Your details have been copied to clipboard. Please send this message via Instagram DM or Facebook Messenger to confirm your booking.</p>
    `;

    // Remove existing success message if any
    const existing = formSection.querySelector('.success-message');
    if (existing) existing.remove();

    formSection.appendChild(successDiv);

    // Reset form
    bookingForm.reset();

    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-hide after 8 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 500);
    }, 8000);
});

// ===== Smooth Scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.style.background = 'transparent';
        link.style.color = 'var(--dark)';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = 'var(--primary)';
            link.style.color = 'var(--white)';
        }
    });
});

// ===== Console Welcome Message =====
console.log('%c🎾 Welcome to E.Court!', 'color: #2d5a27; font-size: 20px; font-weight: bold;');
console.log('%cPlay • Snack • Connect', 'color: #c4956a; font-size: 14px;');
console.log('%cGuanzon-Gundaya St. Brgy. 6, Gingoog City', 'color: #6b7280; font-size: 12px;');

// ===== Logo Click to Zoom Modal =====
const heroLogo = document.getElementById('heroLogo');
const logoModal = document.getElementById('logoModal');
const logoModalClose = document.getElementById('logoModalClose');
const modalLogoImg = document.getElementById('modalLogoImg');

// Open modal when logo is clicked
if (heroLogo) {
    heroLogo.addEventListener('click', () => {
        // Copy the src from the hero logo to the modal
        modalLogoImg.src = heroLogo.src;
        modalLogoImg.alt = 'E.Court Logo';
        
        logoModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

// Close modal when X is clicked
if (logoModalClose) {
    logoModalClose.addEventListener('click', () => {
        logoModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside the logo
if (logoModal) {
    logoModal.addEventListener('click', (e) => {
        if (e.target === logoModal) {
            logoModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && logoModal.classList.contains('show')) {
        logoModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
