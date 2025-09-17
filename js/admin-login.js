// Admin Login JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login functionality
    initLoginForm();
    initPasswordToggle();
    initForgotPassword();
    initFormValidation();
});

// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                performLogin();
            }
        });
    }
}

// Password visibility toggle
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type');
            const icon = this.querySelector('i');
            
            if (type === 'password') {
                passwordInput.setAttribute('type', 'text');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('title', 'Hide password');
            } else {
                passwordInput.setAttribute('type', 'password');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('title', 'Show password');
            }
        });
    }
}

// Form validation
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearEmailError);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', clearPasswordError);
    }
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailInput, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(emailInput);
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordInput, 'Password is required');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(passwordInput, 'Password must be at least 6 characters long');
        return false;
    }
    
    clearFieldError(passwordInput);
    return true;
}

function validateLoginForm() {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    return isEmailValid && isPasswordValid;
}

function showFieldError(input, message) {
    input.classList.add('is-invalid');
    const feedback = input.parentNode.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function clearFieldError(input) {
    input.classList.remove('is-invalid');
}

function clearEmailError() {
    const emailInput = document.getElementById('email');
    clearFieldError(emailInput);
}

function clearPasswordError() {
    const passwordInput = document.getElementById('password');
    clearFieldError(passwordInput);
}

// Perform login
function performLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnSpinner = loginBtn.querySelector('.btn-spinner');
    const errorAlert = document.getElementById('errorAlert');
    
    // Show loading state
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');
    loginBtn.disabled = true;
    hideError();
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate API call
    setTimeout(() => {
        // Demo credentials - In production, this would be an actual API call
        const validCredentials = [
            { email: 'admin@capturely.com', password: 'admin123', role: 'Super Admin' },
            { email: 'sophia.carter@example.com', password: 'password123', role: 'Super Admin' },
            { email: 'ethan.bennett@example.com', password: 'password123', role: 'Admin' },
            { email: 'olivia.hayes@example.com', password: 'password123', role: 'Moderator' },
            { email: 'demo@admin.com', password: 'demo123', role: 'Admin' }
        ];
        
        const user = validCredentials.find(cred => 
            cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
        );
        
        if (user) {
            // Success - store login data
            const loginData = {
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };
            
            if (rememberMe) {
                localStorage.setItem('adminLoginData', JSON.stringify(loginData));
            } else {
                sessionStorage.setItem('adminLoginData', JSON.stringify(loginData));
            }
            
            // Show success and redirect
            showLoginSuccess();
        } else {
            // Error - invalid credentials
            showError('Invalid email or password. Please try again.');
            resetLoginButton();
        }
    }, 2000); // Simulate network delay
}

function showLoginSuccess() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
    }, 2000);
}

function resetLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnSpinner = loginBtn.querySelector('.btn-spinner');
    
    btnText.classList.remove('d-none');
    btnSpinner.classList.add('d-none');
    loginBtn.disabled = false;
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    
    // Scroll to error
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.classList.add('d-none');
}

// Forgot password functionality
function initForgotPassword() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}

function handleForgotPassword() {
    const resetEmail = document.getElementById('resetEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!resetEmail) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!emailRegex.test(resetEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending reset email
    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    modal.hide();
    
    setTimeout(() => {
        showNotification('Password reset link sent to your email', 'success');
        document.getElementById('forgotPasswordForm').reset();
    }, 500);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 0.75rem;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Check if user is already logged in
function checkExistingLogin() {
    const sessionData = sessionStorage.getItem('adminLoginData');
    const localData = localStorage.getItem('adminLoginData');
    
    if (sessionData || localData) {
        const loginData = JSON.parse(sessionData || localData);
        
        // Check if login is still valid (for demo purposes, always valid)
        // In production, you'd verify with the server
        
        if (confirm('You are already logged in. Do you want to go to the dashboard?')) {
            window.location.href = 'admin-dashboard.html';
        } else {
            // Clear stored login data
            sessionStorage.removeItem('adminLoginData');
            localStorage.removeItem('adminLoginData');
        }
    }
}

// Auto-fill demo credentials
function fillDemoCredentials() {
    document.getElementById('email').value = 'admin@capturely.com';
    document.getElementById('password').value = 'admin123';
    showNotification('Demo credentials filled', 'info');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const loginForm = document.getElementById('adminLoginForm');
        if (loginForm && validateLoginForm()) {
            performLogin();
        }
    }
    
    // Alt + D for demo credentials (development only)
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        fillDemoCredentials();
    }
});

// Check for existing login on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkExistingLogin, 1000);
});

// Prevent form submission on Enter in password field
document.getElementById('password')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (validateLoginForm()) {
            performLogin();
        }
    }
});

// Export functions for global access
window.adminLogin = {
    fillDemoCredentials,
    showNotification,
    performLogin
};