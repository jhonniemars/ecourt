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

// ===== Time Range & Price Calculation =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== Toggle GCash QR Code =====
const gcashRadio = document.getElementById('gcashRadio');
const qrContainer = document.getElementById('gcashQR');
const dynamicQrPrice = document.getElementById('dynamicQrPrice');

if (gcashRadio && qrContainer) {
    // Show QR when GCash is selected
    gcashRadio.addEventListener('change', function() {
        if (this.checked) {
            qrContainer.style.display = 'block';
            // Update QR price dynamically based on selection
            if (bookingData.totalPrice > 0) {
                dynamicQrPrice.textContent = '₱' + bookingData.totalPrice.toLocaleString();
            }
        } else {
            qrContainer.style.display = 'none';
        }
    });
    
    // Show immediately on load if already checked
    if (gcashRadio.checked) {
        qrContainer.style.display = 'block';
    }
}

// Update QR price when duration changes
const originalCalculateDuration = calculateDuration;
// We will just hook into the calculateDuration logic if it exists, 
// but to be safe, add this to your calculateDuration function:
/* 
   Inside calculateDuration(), add this line at the very end:
   if(dynamicQrPrice && bookingData.totalPrice > 0) {
       dynamicQrPrice.textContent = '₱' + bookingData.totalPrice.toLocaleString();
   }
*/
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    
    if (startTime && endTime) {
        startTime.addEventListener('change', calculateDuration);
        endTime.addEventListener('change', calculateDuration);
    }
    
    // ... rest of your existing DOMContentLoaded code
});

function calculateDuration() {
    const startHour = parseInt(document.getElementById('startTime').value);
    const endHour = parseInt(document.getElementById('endTime').value);
    const durationDisplay = document.getElementById('bookingDuration');
    const durationText = document.getElementById('durationText');
    const priceAmount = document.getElementById('priceAmount');
    const notice = document.getElementById('timeNotice');
    const noticeText = document.getElementById('noticeText');
    
    if (!startHour || !endHour) {
        durationDisplay.style.display = 'none';
        notice.style.display = 'none';
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        return;
    }
    
    const hours = endHour - startHour;
    
    if (hours <= 0) {
        durationDisplay.style.display = 'block';
        notice.className = 'time-notice error';
        noticeText.textContent = 'End time must be after start time';
        notice.style.display = 'flex';
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        return;
    }
    
    if (hours < 2) {
        durationDisplay.style.display = 'block';
        notice.className = 'time-notice error';
        noticeText.textContent = 'Minimum booking is 2 hours';
        notice.style.display = 'flex';
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        return;
    }
    
    if (hours > 8) {
        durationDisplay.style.display = 'block';
        notice.className = 'time-notice error';
        noticeText.textContent = 'Maximum booking is 8 hours';
        notice.style.display = 'flex';
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        return;
    }
    
    // Calculate price (₱250 per hour)
    const totalPrice = hours * 250;
    
    // Format time display
    const startTimeStr = formatTime(startHour);
    const endTimeStr = formatTime(endHour);
    
    // Update display
    durationText.textContent = `${hours} hour${hours > 1 ? 's' : ''} (${startTimeStr} - ${endTimeStr})`;
    priceAmount.textContent = `₱${totalPrice.toLocaleString()}`;
    durationDisplay.style.display = 'flex';
    
    // Success notice
    notice.className = 'time-notice success';
    noticeText.textContent = `Time slot reserved: ${startTimeStr} to ${endTimeStr}`;
    notice.style.display = 'flex';
    
    // Store booking data
    selectedTime = `${startTimeStr} - ${endTimeStr}`;
    bookingData.startTime = startHour;
    bookingData.endTime = endHour;
    bookingData.duration = hours;
    bookingData.totalPrice = totalPrice;
}

function formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:00 ${period}`;
}

// Update goToStep3 to include price validation
function goToStep3() {
    const court = document.querySelector('input[name="court"]:checked');
    const date = document.getElementById('bookingDate').value;
    const payment = document.querySelector('input[name="payment"]:checked');
    
    if (!court) { alert('Please select a court'); return false; }
    if (!date) { alert('Please select a date'); return false; }
    if (!selectedTime) { alert('Please select a time range'); return false; }
    if (!payment) { alert('Please select a payment method'); return false; }
    if (!bookingData.duration || bookingData.duration < 2) { 
        alert('Please select a valid time range (minimum 2 hours)'); 
        return false; 
    }
    
    // Check if any hour in the range is booked
    const bookedSlots = getBookedSlots(date);
    for (let hour = bookingData.startTime; hour < bookingData.endTime; hour++) {
        const slotTime = `${formatTime(hour)} - ${formatTime(hour + 1)}`;
        if (bookedSlots.includes(slotTime)) {
            alert(`Sorry, part of your selected time (${slotTime}) is already booked. Please choose a different time range.`);
            return false;
        }
    }
    
    bookingData.court = court.value;
    bookingData.date = date;
    bookingData.payment = payment.value;
    
    // Update summary with duration and price
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
    document.getElementById('summaryDateTime').textContent = 
        `${formattedDate} · ${selectedTime} (${bookingData.duration} hours)`;
    
    // Add price to summary (you may need to add this element to your HTML)
    const summaryPrice = document.getElementById('summaryPrice');
    if (summaryPrice) {
        summaryPrice.textContent = `₱${bookingData.totalPrice.toLocaleString()}`;
    }
    
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    document.getElementById('currentStepNum').textContent = '3';
    currentStep = 3;
    
    return true;
}

// Update confirmBooking to save all hours
function confirmBooking() {
    // Save each hour slot as booked
    for (let hour = bookingData.startTime; hour < bookingData.endTime; hour++) {
        const slotTime = `${formatTime(hour)} - ${formatTime(hour + 1)}`;
        saveBookedSlot(bookingData.date, slotTime);
    }
    
    const message = `NEW BOOKING - E.Court

Name: ${bookingData.firstName}
Email: ${bookingData.email}
Court: ${bookingData.court}
Date: ${bookingData.date}
Time: ${selectedTime}
Duration: ${bookingData.duration} hours
Total: ₱${bookingData.totalPrice.toLocaleString()}
Payment: ${bookingData.payment}`;
    
    navigator.clipboard.writeText(message).then(function() {
        alert('✅ Success! Your booking is confirmed.\n\nTotal: ₱' + bookingData.totalPrice.toLocaleString());
        
        resetBookingForm();
        window.location.href = '#home';
    });
}
