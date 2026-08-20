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

// ===== Multi-Step Booking System =====
let currentStep = 1;
let selectedTime = null;
let bookingData = {};

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot-btn');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
        });
    });
});

function goToStep2() {
    // Validate Step 1 (UPDATED - removed phone validation)
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    // Phone field removed - no longer validating
    
    if (!firstName) {
        alert('Please enter your first name');
        return;
    }
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Store data (removed phone)
    bookingData.firstName = firstName;
    bookingData.email = email;
    
    // Switch to Step 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add
    document.getElementById('currentStepNum').textContent = '2';
    currentStep = 2;
}

function goToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('currentStepNum').textContent = '1';
    currentStep = 1;
}

function goToStep3() {
    // Validate Step 2
    const court = document.querySelector('input[name="court"]:checked');
    const date = document.getElementById('bookingDate').value;
    
    if (!court) {
        alert('Please select a court');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    if (!selectedTime) {
        alert('Please select a time slot');
        return;
    }
    
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.time = selectedTime;
    
    // Populate summary
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
    document.getElementById('summaryPhone').textContent = bookingData.phone;
    document.getElementById('summaryCourt').textContent = bookingData.court;
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summaryDateTime').textContent = `${formattedDate} · ${bookingData.time}`;
    
    // Switch to Step 3
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('currentStepNum').textContent = '3';
    currentStep = 3;
}

function goToStep2FromEdit() {
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('currentStepNum').textContent = '2';
    currentStep = 2;
}

function confirmBooking() {
    // Create booking message
    const bookingMessage = `
🎾 NEW BOOKING - E.Court

Name: ${bookingData.firstName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Court: ${bookingData.court}
Date: ${bookingData.date}
Time: ${bookingData.time}
Price: ₱300/hour
    `.trim();
    
    // Copy to clipboard
    navigator.clipboard.writeText(bookingMessage).then(() => {
        alert('✅ Booking details copied!\n\nPlease send this to our Instagram (@ecourt.gingoog) or Facebook Messenger to confirm.');
    }).catch(() => {
        console.log(bookingMessage);
    });
    
    // Show success
    document.getElementById('step3').classList.remove('active');
    document.getElementById('successStep').classList.add('active');
    document.querySelector('.step-indicator').style.display = 'none';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// ===== Multi-Step Booking System =====
let currentStep = 1;
let selectedTime = null;
let bookingData = {};

// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

function nextStep(step) {
    // Validate current step
    if (step === 2 && !validateStep1()) {
        return;
    }
    
    if (step === 3 && !validateStep2()) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    // Show next step
    document.getElementById(`step${step}`).style.display = 'block';
    
    // Update progress indicator
    updateProgress(step);
    
    currentStep = step;
    
    // If moving to step 3, populate summary
    if (step === 3) {
        populateSummary();
    }
    
    // Smooth scroll to booking section
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function previousStep(step) {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    document.getElementById(`step${step}`).style.display = 'block';
    updateProgress(step);
    currentStep = step;
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((s, index) => {
        if (index < step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

function validateStep1() {
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!firstName) {
        alert('Please enter your first name');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!phone) {
        alert('Please enter your phone number');
        return false;
    }
    
    bookingData.firstName = firstName;
    bookingData.email = email;
    bookingData.phone = phone;
    
    return true;
}

function validateStep2() {
    const court = document.querySelector('input[name="court"]:checked');
    const date = document.getElementById('bookingDate').value;
    
    if (!court) {
        alert('Please select a court');
        return false;
    }
    
    if (!date) {
        alert('Please select a date');
        return false;
    }
    
    if (!selectedTime) {
        alert('Please select a time slot');
        return false;
    }
    
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.time = selectedTime;
    
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Time slot selection
document.addEventListener('DOMContentLoaded', function() {
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.dataset.time;
        });
    });
});

function populateSummary() {
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
    // Phone removed from summary
    document.getElementById('summaryCourt').textContent = bookingData.court;
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summaryDateTime').textContent = `${formattedDate} · ${bookingData.time}`;
}

function submitBooking() {
    // Here you would normally send data to a server
    // For now, we'll just show the success message
    
    // Create booking message for Instagram/Messenger
    const bookingMessage = `
🎾 NEW BOOKING - E.Court

Name: ${bookingData.firstName}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Court: ${bookingData.court}
Date: ${bookingData.date}
Time: ${bookingData.time}
Price: ₱300/hour
    `.trim();
    
    // Copy to clipboard
    navigator.clipboard.writeText(bookingMessage).then(() => {
        alert('✅ Booking details copied!\n\nPlease send this to our Instagram (@ecourt.gingoog) or Facebook Messenger to confirm your reservation.');
    }).catch(() => {
        // Fallback
        console.log(bookingMessage);
    });
    
    // Show success screen
    document.getElementById('step3').style.display = 'none';
    document.getElementById('bookingProgress').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
    
    // Scroll to top
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}
