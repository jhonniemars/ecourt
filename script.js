// ===== Booking System Variables =====
let currentStep = 1;
let selectedTime = null;
let bookingData = {};

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Check booked slots initially
    updateTimeSlotStatus();
    
    // Listen for date changes to update booked status
    if (dateInput) {
        dateInput.addEventListener('change', updateTimeSlotStatus);
    }

    // Add click events to time slot buttons
    const timeButtons = document.querySelectorAll('.time-slot-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Prevent clicking if booked
            if (this.classList.contains('booked')) {
                alert('This slot is already booked.');
                return;
            }
            
            // Remove selected from all
            timeButtons.forEach(b => b.classList.remove('selected'));
            
            // Select this one
            this.classList.add('selected');
            selectedTime = this.dataset.time;
        });
    });
});

// ===== Update Time Slot Status (Booked vs Available) =====
function updateTimeSlotStatus() {
    const selectedDate = document.getElementById('bookingDate').value;
    const bookedSlots = getBookedSlots(selectedDate);
    const buttons = document.querySelectorAll('.time-slot-btn');
    
    buttons.forEach(btn => {
        const time = btn.dataset.time;
        
        // Reset state
        btn.classList.remove('booked', 'selected');
        btn.disabled = false;
        
        // If booked, style it and disable it
        if (bookedSlots.includes(time)) {
            btn.classList.add('booked');
            btn.disabled = true;
        }
    });
    
    // Reset selected time if date changes
    selectedTime = null;
}

// ===== Get Booked Slots from Storage =====
function getBookedSlots(date) {
    if (!date) return [];
    const bookings = JSON.parse(localStorage.getItem('ecourt_bookings') || '{}');
    return bookings[date] || [];
}

// ===== Save Booked Slot =====
function saveBookedSlot(date, time) {
    const bookings = JSON.parse(localStorage.getItem('ecourt_bookings') || '{}');
    if (!bookings[date]) bookings[date] = [];
    if (!bookings[date].includes(time)) {
        bookings[date].push(time);
    }
    localStorage.setItem('ecourt_bookings', JSON.stringify(bookings));
}

// ===== Step Navigation Functions =====
function goToStep2() {
    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName) { alert('Please enter your first name'); return false; }
    if (!email) { alert('Please enter your email'); return false; }
    
    bookingData.firstName = firstName;
    bookingData.email = email;
    
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('currentStepNum').textContent = '2';
    currentStep = 2;
    
    updateTimeSlotStatus(); // Refresh slots when entering step 2
    return true;
}

function goToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('currentStepNum').textContent = '1';
    currentStep = 1;
}

function goToStep3() {
    const court = document.querySelector('input[name="court"]:checked');
    const date = document.getElementById('bookingDate').value;
    const payment = document.querySelector('input[name="payment"]:checked');
    
    if (!court) { alert('Please select a court'); return false; }
    if (!date) { alert('Please select a date'); return false; }
    if (!selectedTime) { alert('Please select a time slot'); return false; }
    if (!payment) { alert('Please select a payment method'); return false; }
    
    // Double check not booked
    if (getBookedSlots(date).includes(selectedTime)) {
        alert('Sorry, this slot was just booked. Please choose another.');
        updateTimeSlotStatus();
        return false;
    }
    
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.time = selectedTime;
    bookingData.payment = payment.value;
    
    // Update Summary
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
    document.getElementById('summaryCourt').textContent = bookingData.court;
    document.getElementById('summaryPayment').textContent = bookingData.payment;
    
    const formattedDate = new Date(bookingData.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('summaryDateTime').textContent = formattedDate + ' · ' + bookingData.time;
    
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('currentStepNum').textContent = '3';
    currentStep = 3;
    return true;
}

function confirmBooking() {
    saveBookedSlot(bookingData.date, bookingData.time);
    
    const message = 'NEW BOOKING - E.Court\n\nName: ' + bookingData.firstName + 
                   '\nEmail: ' + bookingData.email + 
                   '\nCourt: ' + bookingData.court + 
                   '\nDate: ' + bookingData.date + 
                   '\nTime: ' + bookingData.time + 
                   '\nPayment: ' + bookingData.payment;
    
    navigator.clipboard.writeText(message).then(function() {
        alert('✅ Success! Your booking is confirmed.');
        resetBookingForm();
        window.location.href = '#home';
    });
}

function resetBookingForm() {
    document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    document.getElementById('currentStepNum').textContent = '1';
    
    document.getElementById('firstName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('bookingDate').value = '';
    
    document.querySelectorAll('.time-slot-btn').forEach(btn => {
        btn.classList.remove('selected', 'booked');
        btn.disabled = false;
    });
    
    selectedTime = null;
    bookingData = {};
    currentStep = 1;
}

// ===== Navbar & Mobile Menu =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
}

if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
