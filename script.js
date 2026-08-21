// ===== Booking System Variables =====
let currentStep = 1;
let selectedTime = null;
let bookingData = {};

// ===== Time Slots Configuration =====
const TIME_SLOTS = [
    '6:00 AM - 8:00 AM',
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM'
];

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Render time slots
    renderTimeSlots();
    
    // Listen for date changes
    if (dateInput) {
        dateInput.addEventListener('change', renderTimeSlots);
    }
});

// ===== Render Time Slots with BOOKED Status =====
function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!container) return;
    
    container.innerHTML = '';
    
    const selectedDate = document.getElementById('bookingDate').value;
    const bookedSlots = getBookedSlots(selectedDate);
    
    TIME_SLOTS.forEach(time => {
        const btn = document.createElement('button');
        btn.className = 'time-slot-btn';
        btn.textContent = time;
        btn.dataset.time = time;
        
        // Check if this slot is booked
        if (bookedSlots.includes(time)) {
            btn.classList.add('booked');
            btn.disabled = true;
            btn.title = 'This slot is already booked';
        } else {
            btn.addEventListener('click', function() {
                // Remove selected from all slots
                document.querySelectorAll('.time-slot-btn').forEach(s => {
                    s.classList.remove('selected');
                });
                // Mark this as selected
                this.classList.add('selected');
                selectedTime = this.dataset.time;
            });
        }
        
        container.appendChild(btn);
    });
    
    // Reset selected time if it's now booked
    if (selectedTime && bookedSlots.includes(selectedTime)) {
        selectedTime = null;
    }
}

// ===== Get Booked Slots for a Date =====
function getBookedSlots(date) {
    if (!date) return [];
    
    const bookings = JSON.parse(localStorage.getItem('ecourt_bookings') || '{}');
    return bookings[date] || [];
}

// ===== Save Booked Slot =====
function saveBookedSlot(date, time) {
    const bookings = JSON.parse(localStorage.getItem('ecourt_bookings') || '{}');
    
    if (!bookings[date]) {
        bookings[date] = [];
    }
    
    if (!bookings[date].includes(time)) {
        bookings[date].push(time);
    }
    
    localStorage.setItem('ecourt_bookings', JSON.stringify(bookings));
}

// ===== Step 1 to Step 2 =====
function goToStep2() {
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName) {
        alert('Please enter your first name');
        return false;
    }
    
    if (!email) {
        alert('Please enter your email');
        return false;
    }
    
    bookingData.firstName = firstName;
    bookingData.email = email;
    
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('currentStepNum').textContent = '2';
    currentStep = 2;
    
    // Re-render time slots when entering step 2
    renderTimeSlots();
    
    return true;
}

// ===== Step 2 to Step 1 =====
function goToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('currentStepNum').textContent = '1';
    currentStep = 1;
}

// ===== Step 2 to Step 3 =====
function goToStep3() {
    const court = document.querySelector('input[name="court"]:checked');
    const date = document.getElementById('bookingDate').value;
    const payment = document.querySelector('input[name="payment"]:checked');
    
    if (!court) { alert('Please select a court'); return false; }
    if (!date) { alert('Please select a date'); return false; }
    if (!selectedTime) { alert('Please select a time slot'); return false; }
    if (!payment) { alert('Please select a payment method'); return false; }
    
    // Double-check slot isn't booked (race condition protection)
    const bookedSlots = getBookedSlots(date);
    if (bookedSlots.includes(selectedTime)) {
        alert('Sorry, this time slot was just booked by someone else. Please choose another.');
        renderTimeSlots();
        return false;
    }
    
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.time = selectedTime;
    bookingData.payment = payment.value;
    
    // Show summary
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
    document.getElementById('summaryCourt').textContent = bookingData.court;
    document.getElementById('summaryPayment').textContent = bookingData.payment;
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summaryDateTime').textContent = formattedDate + ' · ' + bookingData.time;
    
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('currentStepNum').textContent = '3';
    currentStep = 3;
    
    return true;
}

// ===== Confirm Booking =====
function confirmBooking() {
    // Save the booked slot to localStorage
    saveBookedSlot(bookingData.date, bookingData.time);
    
    // Create booking message
    const message = 'NEW BOOKING - E.Court\n\nName: ' + bookingData.firstName + 
                   '\nEmail: ' + bookingData.email + 
                   '\nCourt: ' + bookingData.court + 
                   '\nDate: ' + bookingData.date + 
                   '\nTime: ' + bookingData.time + 
                   '\nPayment: ' + bookingData.payment;
    
    navigator.clipboard.writeText(message).then(function() {
        alert('✅ Success! Your booking is confirmed.');
        
        // Reset form and go home
        resetBookingForm();
        window.location.href = '#home';
    });
}

// ===== Reset Booking Form =====
function resetBookingForm() {
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    document.getElementById('currentStepNum').textContent = '1';
    
    document.getElementById('firstName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('bookingDate').value = '';
    
    selectedTime = null;
    bookingData = {};
    currentStep = 1;
    
    renderTimeSlots();
}

// ===== Email Validation =====
function isValidEmail(email) {
    return email.indexOf('@') > 0 && email.indexOf('.') > 0;
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

console.log('%c🎾 Welcome to E.Court!', 'color: #2d5a27; font-size: 20px; font-weight: bold;');
console.log('%cPlay • Snack • Connect', 'color: #c4956a; font-size: 14px;');
