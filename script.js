// ===== Booking System Variables =====
let currentStep = 1;
let selectedTime = null;
let bookingData = {
    duration: 0,
    totalPrice: 0,
    startTime: 0,
    endTime: 0
};

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Add time range event listeners
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    
    if (startTime) {
        startTime.addEventListener('change', calculateDuration);
    }
    if (endTime) {
        endTime.addEventListener('change', calculateDuration);
    }
    
    // Initialize QR code display
    const gcashRadio = document.getElementById('gcashRadio');
    if (gcashRadio && gcashRadio.checked) {
        const qrContainer = document.getElementById('gcashQR');
        if (qrContainer) {
            qrContainer.style.display = 'block';
        }
    }
});

// ===== Calculate Duration and Price =====
function calculateDuration() {
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const durationDisplay = document.getElementById('bookingDuration');
    const durationText = document.getElementById('durationText');
    const priceAmount = document.getElementById('priceAmount');
    const dynamicQrPrice = document.getElementById('dynamicQrPrice');
    const notice = document.getElementById('timeNotice');
    const noticeText = document.getElementById('noticeText');
    
    if (!startTimeInput || !endTimeInput) {
        return;
    }
    
    const startHour = parseInt(startTimeInput.value);
    const endHour = parseInt(endTimeInput.value);
    
    if (!startHour || !endHour) {
        if (durationDisplay) durationDisplay.style.display = 'none';
        if (notice) notice.style.display = 'none';
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        return;
    }
    
    const hours = endHour - startHour;
    
    if (hours <= 0) {
        if (durationDisplay) durationDisplay.style.display = 'block';
        if (notice) {
            notice.className = 'time-notice error';
            noticeText.textContent = 'End time must be after start time';
            notice.style.display = 'flex';
        }
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        if (dynamicQrPrice) dynamicQrPrice.textContent = '₱0.00';
        return;
    }
    
    if (hours < 2) {
        if (durationDisplay) durationDisplay.style.display = 'block';
        if (notice) {
            notice.className = 'time-notice error';
            noticeText.textContent = 'Minimum booking is 2 hours';
            notice.style.display = 'flex';
        }
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        if (dynamicQrPrice) dynamicQrPrice.textContent = '₱0.00';
        return;
    }
    
    if (hours > 8) {
        if (durationDisplay) durationDisplay.style.display = 'block';
        if (notice) {
            notice.className = 'time-notice error';
            noticeText.textContent = 'Maximum booking is 8 hours';
            notice.style.display = 'flex';
        }
        selectedTime = null;
        bookingData.duration = 0;
        bookingData.totalPrice = 0;
        if (dynamicQrPrice) dynamicQrPrice.textContent = '₱0.00';
        return;
    }
    
    // Calculate price (₱250 per hour)
    const totalPrice = hours * 250;
    
    // Format time display
    const startTimeStr = formatTime(startHour);
    const endTimeStr = formatTime(endHour);
    
    // Update display
    if (durationText) {
        durationText.textContent = hours + ' hour' + (hours > 1 ? 's' : '') + ' (' + startTimeStr + ' - ' + endTimeStr + ')';
    }
    if (priceAmount) {
        priceAmount.textContent = '₱' + totalPrice.toLocaleString();
    }
    if (durationDisplay) {
        durationDisplay.style.display = 'flex';
    }
    
    // Success notice
    if (notice) {
        notice.className = 'time-notice success';
        noticeText.textContent = 'Time slot reserved: ' + startTimeStr + ' to ' + endTimeStr;
        notice.style.display = 'flex';
    }
    
    // Store booking data
    selectedTime = startTimeStr + ' - ' + endTimeStr;
    bookingData.startTime = startHour;
    bookingData.endTime = endHour;
    bookingData.duration = hours;
    bookingData.totalPrice = totalPrice;
    
    // Update QR price
    if (dynamicQrPrice) {
        dynamicQrPrice.textContent = '₱' + totalPrice.toLocaleString();
    }
}

function formatTime(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return displayHour + ':00 ' + period;
}

// ===== Toggle QR Code Display =====
function toggleQRCode() {
    const gcashRadio = document.getElementById('gcashRadio');
    const qrContainer = document.getElementById('gcashQR');
    const dynamicQrPrice = document.getElementById('dynamicQrPrice');
    
    if (!gcashRadio || !qrContainer) {
        return;
    }
    
    if (gcashRadio.checked) {
        qrContainer.style.display = 'block';
        if (dynamicQrPrice && bookingData.totalPrice > 0) {
            dynamicQrPrice.textContent = '₱' + bookingData.totalPrice.toLocaleString();
        }
    } else {
        qrContainer.style.display = 'none';
    }
}

// ===== Step Navigation =====
function goToStep2() {
    console.log("Button clicked! Trying to go to Step 2..."); // This helps us debug
    
    // 1. Get the input values
    var nameInput = document.getElementById('firstName');
    var emailInput = document.getElementById('email');
    
    // 2. Check if inputs exist (prevents silent crashes)
    if (!nameInput || !emailInput) {
        alert("Error: Could not find the Name or Email fields. Check your HTML IDs.");
        return;
    }

    var firstName = nameInput.value.trim();
    var email = emailInput.value.trim();

    // 3. Validate
    if (firstName === "") {
        alert("Please enter your first name.");
        return;
    }
    if (email === "") {
        alert("Please enter your email address.");
        return;
    }

    // 4. Save data
    bookingData.firstName = firstName;
    bookingData.email = email;

    // 5. Switch Steps
    var step1 = document.getElementById('step1');
    var step2 = document.getElementById('step2');
    var stepNum = document.getElementById('currentStepNum');

    if (step1) step1.classList.remove('active');
    if (step2) step2.classList.add('active');
    if (stepNum) stepNum.textContent = '2';
    
    currentStep = 2;
    console.log("Successfully moved to Step 2!");
}

function goToStep1() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const currentStepNum = document.getElementById('currentStepNum');
    
    if (step2) step2.classList.remove('active');
    if (step1) step1.classList.add('active');
    if (currentStepNum) currentStepNum.textContent = '1';
    
    currentStep = 1;
}

function goToStep3() {
    const court = document.querySelector('input[name="court"]:checked');
    const dateInput = document.getElementById('bookingDate');
    const payment = document.querySelector('input[name="payment"]:checked');
    
    if (!court) {
        alert('Please select a court');
        return false;
    }
    
    if (!dateInput || !dateInput.value) {
        alert('Please select a date');
        return false;
    }
    
    if (!selectedTime) {
        alert('Please select a time range');
        return false;
    }
    
    if (!payment) {
        alert('Please select a payment method');
        return false;
    }
    
    if (!bookingData.duration || bookingData.duration < 2) {
        alert('Please select a valid time range (minimum 2 hours)');
        return false;
    }
    
    bookingData.court = court.value;
    booking
