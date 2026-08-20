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
    // Validate Step 1
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName) {
        alert('Please enter your first name');
        return;
    }
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Store data
    bookingData.firstName = firstName;
    bookingData.email = email;
    
    // Switch to Step 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
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
    
    // Store data
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.time = selectedTime;
    
    // Populate summary
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
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

function confirmBooking() {
    // Create booking message
    const bookingMessage = `
🎾 NEW BOOKING - E.Court

Name: ${bookingData.firstName}
Email: ${bookingData.email}
Court: ${bookingData.court}
Date: ${bookingData.date}
Time: ${bookingData.time}
Price: 300/hour
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

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
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
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Console Welcome Message =====
console.log('%c🎾 Welcome to E.Court!', 'color: #2d5a27; font-size: 20px; font-weight: bold;');
console.log('%cPlay • Snack • Connect', 'color: #c4956a; font-size: 14px;');
