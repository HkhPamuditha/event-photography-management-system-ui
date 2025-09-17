// Add New Admin JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupFormValidation();
    setupPermissionsLogic();
});

// Initialize form elements and set default values
function initializeForm() {
    // Set default start date to today
    const startDateField = document.getElementById('startDate');
    if (startDateField) {
        const today = new Date().toISOString().split('T')[0];
        startDateField.value = today;
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
    const form = document.getElementById('newAdminForm');
    const addButtons = document.querySelectorAll('.add-admin-btn, .form-actions .btn-primary');
    
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
    const inputs = form.querySelectorAll('.admin-input');
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
    
    // Role change handler
    const roleField = document.getElementById('role');
    if (roleField) {
        roleField.addEventListener('change', handleRoleChange);
    }
}

// Setup form validation rules
function setupFormValidation() {
    const form = document.getElementById('newAdminForm');
    
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
        role: {
            required: 'Admin role is required'
        },
        startDate: {
            required: 'Start date is required'
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

// Setup permissions logic based on role
function setupPermissionsLogic() {
    const roleField = document.getElementById('role');
    
    // Define role-based permissions
    const rolePermissions = {
        super_admin: [
            'manage_admins', 'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports',
            'manage_payments', 'view_financial_reports',
            'system_settings', 'backup_restore'
        ],
        admin: [
            'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports',
            'manage_payments'
        ],
        manager: [
            'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports'
        ],
        moderator: [
            'manage_customers', 'manage_bookings', 'view_reports'
        ]
    };
    
    if (roleField) {
        roleField.addEventListener('change', function() {
            const selectedRole = this.value;
            setPermissionsByRole(selectedRole, rolePermissions);
        });
    }
}

// Set permissions based on selected role
function setPermissionsByRole(role, rolePermissions) {
    const allCheckboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
    const rolePerms = rolePermissions[role] || [];
    
    // First, uncheck all permissions
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });
    
    // Then check the permissions for the selected role
    rolePerms.forEach(permissionId => {
        const checkbox = document.getElementById(permissionId);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // For super admin, disable all checkboxes as they have all permissions
    if (role === 'super_admin') {
        allCheckboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });
    }
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = document.getElementById('newAdminForm');
    const submitButton = event.target.closest('button') || document.querySelector('.add-admin-btn');
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showFormErrors();
        return;
    }
    
    // Additional validation for email uniqueness
    if (!validateEmailUniqueness()) {
        return;
    }
    
    // Show loading state
    showLoadingState(submitButton);
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate API call
    setTimeout(() => {
        submitAdmin(formData, submitButton);
    }, 1500);
}

// Collect all form data
function collectFormData() {
    const form = document.getElementById('newAdminForm');
    const data = {};
    
    // Get all form values
    data.firstName = document.getElementById('firstName').value.trim();
    data.lastName = document.getElementById('lastName').value.trim();
    data.email = document.getElementById('email').value.trim();
    data.mobile = document.getElementById('mobile').value.trim();
    data.role = document.getElementById('role').value;
    data.department = document.getElementById('department').value;
    data.startDate = document.getElementById('startDate').value;
    data.status = document.getElementById('status').value;
    data.notes = document.getElementById('notes').value.trim();
    
    // Collect permissions
    data.permissions = [];
    const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        data.permissions.push(checkbox.id);
    });
    
    // Generate additional data
    data.fullName = `${data.firstName} ${data.lastName}`;
    data.id = generateAdminId();
    data.createdAt = new Date().toISOString();
    data.lastLogin = null;
    data.isActive = data.status === 'active';
    
    return data;
}

// Submit admin data
function submitAdmin(data, submitButton) {
    try {
        // Here you would typically make an API call
        // For now, we'll simulate success
        
        console.log('Submitting admin data:', data);
        
        // Store in localStorage for demonstration
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        
        // Check for duplicate email
        const existingAdmin = admins.find(admin => admin.email === data.email);
        if (existingAdmin) {
            hideLoadingState(submitButton);
            showErrorMessage('An administrator with this email already exists.');
            return;
        }
        
        admins.push(data);
        localStorage.setItem('admins', JSON.stringify(admins));
        
        // Hide loading state
        hideLoadingState(submitButton);
        
        // Show success modal
        showSuccessModal(data);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Error submitting admin:', error);
        hideLoadingState(submitButton);
        showErrorMessage('Failed to add administrator. Please try again.');
    }
}

// Validate email uniqueness
function validateEmailUniqueness() {
    const email = document.getElementById('email').value.trim();
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    const existingAdmin = admins.find(admin => admin.email === email);
    if (existingAdmin) {
        const emailField = document.getElementById('email');
        showFieldError(emailField, 'An administrator with this email already exists');
        return false;
    }
    
    return true;
}

// Show loading state
function showLoadingState(button) {
    const form = document.getElementById('newAdminForm');
    form.classList.add('form-loading');
    
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Adding Administrator...';
    }
}

// Hide loading state
function hideLoadingState(button) {
    const form = document.getElementById('newAdminForm');
    form.classList.remove('form-loading');
    
    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-user-plus me-2"></i>Add Admin';
    }
}

// Show success modal
function showSuccessModal(data) {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    const messageElement = document.getElementById('successMessage');
    
    if (messageElement) {
        messageElement.textContent = `${data.fullName} has been successfully added as an administrator with ${data.role} privileges.`;
    }
    
    modal.show();
}

// Reset form to initial state
function resetForm() {
    const form = document.getElementById('newAdminForm');
    form.reset();
    form.classList.remove('was-validated');
    
    // Reset to default values
    const startDateField = document.getElementById('startDate');
    if (startDateField) {
        const today = new Date().toISOString().split('T')[0];
        startDateField.value = today;
    }
    
    const statusField = document.getElementById('status');
    if (statusField) {
        statusField.value = 'pending';
    }
    
    // Clear all permissions
    const checkboxes = document.querySelectorAll('.form-check-input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });
    
    // Clear any validation states
    const inputs = form.querySelectorAll('.admin-input');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}

// Handle role change
function handleRoleChange(event) {
    const role = event.target.value;
    const roleDescriptions = {
        super_admin: 'Full system access with all permissions',
        admin: 'High-level access to most system functions',
        manager: 'Management access to core operations',
        moderator: 'Limited access to customer and booking management'
    };
    
    // Show role description
    showRoleInfo(roleDescriptions[role] || '');
    
    // Update permissions automatically
    const rolePermissions = {
        super_admin: [
            'manage_admins', 'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports',
            'manage_payments', 'view_financial_reports',
            'system_settings', 'backup_restore'
        ],
        admin: [
            'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports',
            'manage_payments'
        ],
        manager: [
            'manage_photographers', 'manage_customers',
            'manage_bookings', 'assign_photographers', 'view_reports'
        ],
        moderator: [
            'manage_customers', 'manage_bookings', 'view_reports'
        ]
    };
    
    setPermissionsByRole(role, { [role]: rolePermissions[role] });
}

// Show role information
function showRoleInfo(description) {
    // Create or update role info element
    let roleInfo = document.getElementById('roleInfo');
    if (!roleInfo) {
        roleInfo = document.createElement('div');
        roleInfo.id = 'roleInfo';
        roleInfo.className = 'form-text mt-2 p-2 bg-light rounded';
        
        const roleField = document.getElementById('role');
        roleField.parentNode.appendChild(roleInfo);
    }
    
    roleInfo.innerHTML = `<i class="fas fa-info-circle me-1"></i>${description}`;
    roleInfo.style.display = description ? 'block' : 'none';
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

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace(' *', '') : field.name;
}

function generateAdminId() {
    return 'ADMIN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function showFormErrors() {
    const firstInvalidField = document.querySelector('.admin-input:invalid');
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
        // Optionally redirect to admin list
        // window.location.href = 'admin-dashboard.html';
    }
}

// Navigate to admins list
function goToAdminsList() {
    window.location.href = 'admin-dashboard.html';
}

// Export functions for global access
window.discardForm = discardForm;
window.goToAdminsList = goToAdminsList;