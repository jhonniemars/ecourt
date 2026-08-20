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
    
    // Show summary
    document.getElementById('summaryName').textContent = bookingData.firstName;
    document.getElementById('summaryEmail').textContent = bookingData.email;
    document.getElementById('summaryCourt').textContent = bookingData.court;
    
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
    const message = 'NEW BOOKING - E.Court\n\nName: ' + bookingData.firstName + 
                   '\nEmail: ' + bookingData.email + 
                   '\nCourt: ' + bookingData.court + 
                   '\nDate: ' + bookingData.date + 
                   '\nTime: ' + bookingData.time + 
                   '\nPrice: 300/hour';
    
    navigator.clipboard.writeText(message).then(function() {
        alert('Booking details copied! Please send to Instagram @ecourt.gingoog');
    });
    
    document.getElementById('step3').classList.remove('active');
    document.getElementById('successStep').classList.add('active');
    document.querySelector('.step-indicator').style.display = 'none';
}

// ===== Email Validation =====
function isValidEmail(email) {
    return email.indexOf('@') > 0 && email.indexOf('.') > 0;
}

// ===== Toggle QR Code Display =====
function toggleQRCode() {
    const gcashRadio = document.querySelector('input[name="payment"][value="GCash"]');
    const qrContainer = document.getElementById('gcashQR');
    
    if (gcashRadio && gcashRadio.checked) {
        qrContainer.classList.add('show');
    } else {
        qrContainer.classList.remove('show');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show QR if GCash is already checked
    toggleQRCode();
    
    // Add event listener to payment radio buttons
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', toggleQRCode);
    });
});
