// ===== Global Variables =====
var currentStep = 1;
var selectedTime = null;
var bookingData = {
    duration: 0,
    totalPrice: 0,
    startTime: 0,
    endTime: 0,
    firstName: '',
    email: '',
    court: '',
    date: '',
    payment: ''
};

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    // Set min date to today
    var dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        var today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Add event listeners for time inputs
    var startTimeInput = document.getElementById('startTime');
    var endTimeInput = document.getElementById('endTime');
    
    if (startTimeInput) {
        startTimeInput.addEventListener('change', calculateDuration);
    }
    if (endTimeInput) {
        endTimeInput.addEventListener('change', calculateDuration);
    }
    
    // Initialize GCash QR
    var gcashRadio = document.getElementById('gcashRadio');
    if (gcashRadio && gcashRadio.checked) {
        var qrContainer = document.getElementById('gcashQR');
        if (qrContainer) {
            qrContainer.style.display = 'block';
        }
    }
    
    console.log('E.Court Booking System Loaded');
});

// ===== Calculate Duration & Price =====
function calculateDuration() {
    var startSelect = document.getElementById('startTime');
    var endSelect = document.getElementById('endTime');
    var durationDiv = document.getElementById('bookingDuration');
    var durationText = document.getElementById('durationText');
    var priceAmount = document.getElementById('priceAmount');
    var qrPrice = document.getElementById('dynamicQrPrice');
    var notice = document.getElementById('timeNotice');
    var noticeText = document.getElementById('noticeText');
    
    if (!startSelect || !endSelect) {
        return;
    }
    
    var startHour = parseInt(startSelect.value);
    var endHour = parseInt(endSelect.value);
    
    if (!startHour || !endHour) {
        if (durationDiv) durationDiv.style.display = 'none';
        if (notice) notice.style.display = 'none';
        return;
    }
    
    var hours = endHour - startHour;
    
    // Validation
    if (hours <= 0) {
        if (notice) {
            notice.className = 'time-notice error';
            notice.style.display = 'flex';
            if (noticeText) noticeText.textContent = 'End time must be after start time';
        }
        return;
    }
    
    if (hours < 2) {
        if (notice) {
            notice.className = 'time-notice error';
            notice.style.display = 'flex';
            if (noticeText) noticeText.textContent = 'Minimum booking is 2 hours';
        }
        return;
    }
    
    if (hours > 8) {
        if (notice) {
            notice.className = 'time-notice error';
            notice.style.display = 'flex';
            if (noticeText) noticeText.textContent = 'Maximum booking is 8 hours';
        }
        return;
    }
    
    // Success - Calculate price
    var totalPrice = hours * 250;
    var startTimeStr = formatTime(startHour);
    var endTimeStr = formatTime(endHour);
    
    if (durationText) {
        durationText.textContent = hours + ' hour' + (hours > 1 ? 's' : '') + ' (' + startTimeStr + ' - ' + endTimeStr + ')';
    }
    if (priceAmount) {
        priceAmount.textContent = 'P' + totalPrice.toLocaleString();
    }
    if (durationDiv) {
        durationDiv.style.display = 'flex';
    }
    if (notice) {
        notice.className = 'time-notice success';
        notice.style.display = 'flex';
        if (noticeText) noticeText.textContent = 'Time slot reserved: ' + startTimeStr + ' to ' + endTimeStr;
    }
    if (qrPrice) {
        qrPrice.textContent = 'P' + totalPrice.toLocaleString();
    }
    
    // Store data
    selectedTime = startTimeStr + ' - ' + endTimeStr;
    bookingData.startTime = startHour;
    bookingData.endTime = endHour;
    bookingData.duration = hours;
    bookingData.totalPrice = totalPrice;
}

function formatTime(hour) {
    var period = hour >= 12 ? 'PM' : 'AM';
    var displayHour = hour > 12 ? hour - 12 : hour;
    if (displayHour === 0) displayHour = 12;
    return displayHour + ':00 ' + period;
}

// ===== Toggle GCash QR =====
function toggleQRCode() {
    var gcashRadio = document.getElementById('gcashRadio');
    var qrContainer = document.getElementById('gcashQR');
    var qrPrice = document.getElementById('dynamicQrPrice');
    
    if (!gcashRadio || !qrContainer) {
        return;
    }
    
    if (gcashRadio.checked) {
        qrContainer.style.display = 'block';
        if (qrPrice && bookingData.totalPrice > 0) {
            qrPrice.textContent = 'P' + bookingData.totalPrice.toLocaleString();
        }
    } else {
        qrContainer.style.display = 'none';
    }
}

// ===== Go to Step 2 =====
function goToStep2() {
    var nameInput = document.getElementById('firstName');
    var emailInput = document.getElementById('email');
    
    if (!nameInput || !emailInput) {
        alert('System error: Missing form fields');
        return;
    }
    
    var firstName = nameInput.value.trim();
    var email = emailInput.value.trim();
    
    if (firstName === '') {
        alert('Please enter your first name');
        return;
    }
    
    if (email === '') {
        alert('Please enter your email');
        return;
    }
    
    // Save data
    bookingData.firstName = firstName;
    bookingData.email = email;
    
    // Switch steps
    var step1 = document.getElementById('step1');
    var step2 = document.getElementById('step2');
    var stepNum = document.getElementById('currentStepNum');
    
    if (step1) step1.classList.remove('active');
    if (step2) step2.classList.add('active');
    if (stepNum) stepNum.textContent = '2';
    
    currentStep = 2;
}

// ===== Go to Step 1 =====
function goToStep1() {
    var step1 = document.getElementById('step1');
    var step2 = document.getElementById('step2');
    var stepNum = document.getElementById('currentStepNum');
    
    if (step2) step2.classList.remove('active');
    if (step1) step1.classList.add('active');
    if (stepNum) stepNum.textContent = '1';
    
    currentStep = 1;
}

// ===== Go to Step 3 =====
function goToStep3() {
    var court = document.querySelector('input[name="court"]:checked');
    var dateInput = document.getElementById('bookingDate');
    
    if (!court) {
        alert('Please select a court');
        return;
    }
    
    if (!dateInput || !dateInput.value) {
        alert('Please select a date');
        return;
    }
    
    if (!selectedTime) {
        alert('Please select a time range');
        return;
    }
    
    if (bookingData.duration < 2) {
        alert('Please select a valid time range (minimum 2 hours)');
        return;
    }
    
    // Save data
    bookingData.court = court.value;
    bookingData.date = dateInput.value;
    bookingData.payment = payment.value;
    
    // Update summary
    var sumName = document.getElementById('summaryName');
    var sumEmail = document.getElementById('summaryEmail');
    var sumCourt = document.getElementById('summaryCourt');
    var sumPayment = document.getElementById('summaryPayment');
    var sumDateTime = document.getElementById('summaryDateTime');
    var sumPrice = document.getElementById('summaryPrice');
    
    if (sumName) sumName.textContent = bookingData.firstName;
    if (sumEmail) sumEmail.textContent = bookingData.email;
    if (sumCourt) sumCourt.textContent = bookingData.court;
    if (sumPayment) sumPayment.textContent = bookingData.payment;
    
    if (sumDateTime) {
        var dateObj = new Date(bookingData.date);
        var formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        sumDateTime.textContent = formattedDate + ' · ' + selectedTime + ' (' + bookingData.duration + ' hours)';
    }
    
    if (sumPrice) {
        sumPrice.textContent = 'P' + bookingData.totalPrice.toLocaleString();
    }
    
    // Switch steps
    var step2 = document.getElementById('step2');
    var step3 = document.getElementById('step3');
    var stepNum = document.getElementById('currentStepNum');
    
    if (step2) step2.classList.remove('active');
    if (step3) step3.classList.add('active');
    if (stepNum) stepNum.textContent = '3';
    
    currentStep = 3;
}

// ===== Confirm Booking =====
function confirmBooking() {
    var message = 'NEW BOOKING - E.Court\n\n';
    message += 'Name: ' + bookingData.firstName + '\n';
    message += 'Email: ' + bookingData.email + '\n';
    message += 'Court: ' + bookingData.court + '\n';
    message += 'Date: ' + bookingData.date + '\n';
    message += 'Time: ' + selectedTime + '\n';
    message += 'Duration: ' + bookingData.duration + ' hours\n';
    message += 'Total: P' + bookingData.totalPrice.toLocaleString() + '\n';
    message += 'Payment: ' + bookingData.payment;
    
    navigator.clipboard.writeText(message).then(function() {
        alert('Success! Your booking is confirmed.\n\nTotal: P' + bookingData.totalPrice.toLocaleString());
        resetBookingForm();
        window.location.href = '#home';
    }).catch(function(err) {
        console.error('Copy error:', err);
        alert('Booking confirmed! Total: P' + bookingData.totalPrice.toLocaleString());
        resetBookingForm();
        window.location.href = '#home';
    });
}

// ===== Reset Form =====
function resetBookingForm() {
    var steps = document.querySelectorAll('.booking-step');
    steps.forEach(function(step) {
        step.classList.remove('active');
    });
    
    var step1 = document.getElementById('step1');
    var stepNum = document.getElementById('currentStepNum');
    var nameInput = document.getElementById('firstName');
    var emailInput = document.getElementById('email');
    var dateInput = document.getElementById('bookingDate');
    var startSelect = document.getElementById('startTime');
    var endSelect = document.getElementById('endTime');
    var durationDiv = document.getElementById('bookingDuration');
    var notice = document.getElementById('timeNotice');
    
    if (step1) step1.classList.add('active');
    if (stepNum) stepNum.textContent = '1';
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (dateInput) dateInput.value = '';
    if (startSelect) startSelect.value = '';
    if (endSelect) endSelect.value = '';
    if (durationDiv) durationDiv.style.display = 'none';
    if (notice) notice.style.display = 'none';
    
    selectedTime = null;
    bookingData = {
        duration: 0,
        totalPrice: 0,
        startTime: 0,
        endTime: 0,
        firstName: '',
        email: '',
        court: '',
        date: '',
        payment: ''
    };
    currentStep = 1;
}

// ===== Navbar Scroll =====
var navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Back to Top =====
var backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Mobile Menu =====
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Smooth Scroll =====
var anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('E.Court System Ready');

// ===== File Upload Handling =====
let proofFileData = null;

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG)');
        input.value = '';
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        input.value = '';
        return;
    }
    
    proofFileData = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewImg').src = e.target.result;
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('uploadPreview').style.display = 'flex';
        document.getElementById('uploadPlaceholder').style.display = 'none';
        document.getElementById('uploadArea').classList.add('has-file');
        
        // Enable Review button
        document.getElementById('reviewBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

function removeFile() {
    document.getElementById('proofFile').value = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadPlaceholder').style.display = 'block';
    document.getElementById('uploadArea').classList.remove('has-file');
    proofFileData = null;
    document.getElementById('reviewBtn').disabled = true;
}
