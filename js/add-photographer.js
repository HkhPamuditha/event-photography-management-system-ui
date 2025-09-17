// Add New Photographer JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupFormValidation();
});

// Initialize form elements and set default values
function initializeForm() {
    // Set default hired date to today
    const hiredDateField = document.getElementById('hiredDate');
    if (hiredDateField) {
        const today = new Date().toISOString().split('T')[0];
        hiredDateField.value = today;
    }
    
    // Initialize sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-mobile-open');
        });
    }
}

// Setup all event listeners
function setupEventListeners() {
    const form = document.getElementById('newPhotographerForm');
    const addButtons = document.querySelectorAll('.add-photographer-btn, .form-actions .btn-primary');
    
    // Form submission handlers
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Additional submit button handlers
    addButtons.forEach(button => {
        if (button.type !== 'submit') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleFormSubmission(e);
            });
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.photographer-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Email format validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', validateEmail);
    }
    
    // Mobile number formatting
    const mobileField = document.getElementById('mobile');
    if (mobileField) {
        mobileField.addEventListener('input', formatMobileNumber);
    }
    
    // Portfolio URL validation
    const portfolioField = document.getElementById('portfolio');
    if (portfolioField) {
        portfolioField.addEventListener('input', validatePortfolioURL);
    }
}

// Setup form validation rules
function setupFormValidation() {
    const form = document.getElementById('newPhotographerForm');
    
    // Custom validation messages
    const validationRules = {
        firstName: {
            required: 'First name is required',
            pattern: '^[a-zA-Z\\s]{2,50}$',
            message: 'First name must be 2-50 characters and contain only letters'
        },
        lastName: {
            required: 'Last name is required',
            pattern: '^[a-zA-Z\\s]{2,50}$',
            message: 'Last name must be 2-50 characters and contain only letters'
        },
        email: {
            required: 'Email address is required',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            message: 'Please enter a valid email address'
        },
        mobile: {
            required: 'Mobile number is required',
            pattern: '^[\\+]?[0-9\\s\\-\\(\\)]{10,15}$',
            message: 'Please enter a valid mobile number'
        },
        hiredDate: {
            required: 'Hired date is required'
        },
        experience: {
            required: 'Years of experience is required',
            min: 0,
            max: 50,
            message: 'Experience must be between 0 and 50 years'
        },
        specialization: {
            required: 'Specialization is required'
        }
    };
    
    // Apply validation rules
    Object.keys(validationRules).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const rule = validationRules[fieldId];
            
            if (rule.pattern) {
                field.setAttribute('pattern', rule.pattern);
            }
            if (rule.min !== undefined) {
                field.setAttribute('min', rule.min);
            }
            if (rule.max !== undefined) {
                field.setAttribute('max', rule.max);
            }
            
            // Set custom validation message
            field.addEventListener('invalid', function() {
                field.setCustomValidity(rule.message || rule.required);
            });
            
            field.addEventListener('input', function() {
                field.setCustomValidity('');
            });
        }
    });
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = document.getElementById('newPhotographerForm');
    const submitButton = event.target.closest('button') || document.querySelector('.add-photographer-btn');
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showFormErrors();
        return;
    }
    
    // Show loading state
    showLoadingState(submitButton);
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate API call
    setTimeout(() => {
        submitPhotographer(formData, submitButton);
    }, 1500);
}

// Collect all form data
function collectFormData() {
    const form = document.getElementById('newPhotographerForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get all form values
    data.firstName = document.getElementById('firstName').value.trim();
    data.lastName = document.getElementById('lastName').value.trim();
    data.email = document.getElementById('email').value.trim();
    data.mobile = document.getElementById('mobile').value.trim();
    data.hiredDate = document.getElementById('hiredDate').value;
    data.experience = document.getElementById('experience').value;
    data.specialization = document.getElementById('specialization').value;
    data.location = document.getElementById('location').value;
    data.portfolio = document.getElementById('portfolio').value.trim();
    data.bio = document.getElementById('bio').value.trim();
    data.equipment = document.getElementById('equipment').value.trim();
    data.hourlyRate = document.getElementById('hourlyRate').value;
    data.status = document.getElementById('status').value;
    
    // Generate additional data
    data.fullName = `${data.firstName} ${data.lastName}`;
    data.id = generatePhotographerId();
    data.createdAt = new Date().toISOString();
    
    return data;
}

// Submit photographer data
function submitPhotographer(data, submitButton) {
    try {
        // Here you would typically make an API call
        // For now, we'll simulate success
        
        console.log('Submitting photographer data:', data);
        
        // Store in localStorage for demonstration
        const photographers = JSON.parse(localStorage.getItem('photographers') || '[]');
        photographers.push(data);
        localStorage.setItem('photographers', JSON.stringify(photographers));
        
        // Hide loading state
        hideLoadingState(submitButton);
        
        // Show success modal
        showSuccessModal(data);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Error submitting photographer:', error);
        hideLoadingState(submitButton);
        showErrorMessage('Failed to add photographer. Please try again.');
    }
}

// Show loading state
function showLoadingState(button) {
    const form = document.getElementById('newPhotographerForm');
    form.classList.add('form-loading');
    
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding Photographer...';
    }
}

// Hide loading state
function hideLoadingState(button) {
    const form = document.getElementById('newPhotographerForm');
    form.classList.remove('form-loading');
    
    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-user-plus me-2"></i>Add Photographer';
    }
}

// Show success modal
function showSuccessModal(data) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    const messageElement = document.getElementById('successMessage');
    
    if (messageElement) {
        messageElement.textContent = `${data.fullName} has been successfully added as a photographer.`;
    }
    
    modal.show();
}

// Reset form to initial state
function resetForm() {
    const form = document.getElementById('newPhotographerForm');
    form.reset();
    form.classList.remove('was-validated');
    
    // Reset to default values
    const hiredDateField = document.getElementById('hiredDate');
    if (hiredDateField) {
        const today = new Date().toISOString().split('T')[0];
        hiredDateField.value = today;
    }
    
    const statusField = document.getElementById('status');
    if (statusField) {
        statusField.value = 'pending';
    }
    
    // Clear any validation states
    const inputs = form.querySelectorAll('.photographer-input');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}

// Field validation functions
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'url' && value && !isValidURL(value)) {
        showFieldError(field, 'Please enter a valid URL');
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('is-invalid');
    field.setCustomValidity('');
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    field.setCustomValidity(message);
    
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
    field.setCustomValidity('');
}

// Email validation
function validateEmail(event) {
    const field = event.target;
    const email = field.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(field, 'Please enter a valid email address');
    } else if (email) {
        showFieldSuccess(field);
    }
}

// Mobile number formatting
function formatMobileNumber(event) {
    const field = event.target;
    let value = field.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as needed (e.g., add spaces or dashes)
    if (value.length > 3 && value.length <= 6) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }
    
    field.value = value;
}

// Portfolio URL validation
function validatePortfolioURL(event) {
    const field = event.target;
    const url = field.value.trim();
    
    if (url && !isValidURL(url)) {
        showFieldError(field, 'Please enter a valid URL (e.g., https://example.com)');
    } else if (url) {
        showFieldSuccess(field);
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace(' *', '') : field.name;
}

function generatePhotographerId() {
    return 'PHOTO_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function showFormErrors() {
    const firstInvalidField = document.querySelector('.photographer-input:invalid');
    if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showErrorMessage(message) {
    // Create or show error toast/alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Discard form function
function discardForm() {
    if (confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
        resetForm();
        // Optionally redirect to photographers list
        // window.location.href = 'photographers-management.html';
    }
}

// Navigate to photographers list
function goToPhotographersList() {
    window.location.href = 'photographers-management.html';
}

// Export functions for global access
window.discardForm = discardForm;
window.goToPhotographersList = goToPhotographersList;