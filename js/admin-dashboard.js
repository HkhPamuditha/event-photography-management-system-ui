// Admin Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard components
    initSidebar();
    initSearch();
    initFilters();
    initTable();
    initModal();
});

// Sidebar functionality
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 991.98) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            tableRows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                const email = row.cells[1].textContent.toLowerCase();
                const phone = row.cells[2].textContent.toLowerCase();
                
                if (name.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateNoResultsMessage();
        });
    }
}

// Filter functionality
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    
    tableRows.forEach(row => {
        let showRow = true;
        
        // Status filter
        if (statusFilter) {
            const statusBadge = row.querySelector('.status-badge');
            const rowStatus = statusBadge ? statusBadge.textContent.toLowerCase().trim() : '';
            if (!rowStatus.includes(statusFilter)) {
                showRow = false;
            }
        }
        
        // Date filter (placeholder - would need actual date data)
        if (dateFilter && showRow) {
            // Implement date filtering logic here
            // This would require actual date data in the table
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateNoResultsMessage();
}

// Table functionality
function initTable() {
    // Action buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const adminName = row.cells[0].textContent.trim();
            viewAdmin(adminName);
        });
    });
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const adminData = extractAdminData(row);
            editAdmin(adminData);
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const adminName = row.cells[0].textContent.trim();
            deleteAdmin(adminName, row);
        });
    });
}

// Extract admin data from table row
function extractAdminData(row) {
    return {
        name: row.cells[0].textContent.trim(),
        email: row.cells[1].textContent.trim(),
        phone: row.cells[2].textContent.trim(),
        role: row.querySelector('.role-badge').textContent.trim(),
        status: row.querySelector('.status-badge').textContent.trim()
    };
}

// Admin actions
function viewAdmin(adminName) {
    // Implement view admin functionality
    alert(`Viewing admin: ${adminName}`);
    // In a real application, this would open a detailed view modal or navigate to a detail page
}

function editAdmin(adminData) {
    // Implement edit admin functionality
    alert(`Editing admin: ${adminData.name}`);
    // In a real application, this would populate an edit form modal
}

function deleteAdmin(adminName, row) {
    if (confirm(`Are you sure you want to delete admin: ${adminName}?`)) {
        // Implement delete functionality
        row.remove();
        updateNoResultsMessage();
        showNotification('Admin deleted successfully', 'success');
    }
}

// Modal functionality
function initModal() {
    const addAdminForm = document.getElementById('addAdminForm');
    
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddAdmin();
        });
    }
    
    // Password confirmation validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            if (this.value !== password.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

function handleAddAdmin() {
    const formData = new FormData(document.getElementById('addAdminForm'));
    const adminData = {
        firstName: formData.get('firstName') || document.getElementById('firstName').value,
        lastName: formData.get('lastName') || document.getElementById('lastName').value,
        email: formData.get('email') || document.getElementById('email').value,
        phone: formData.get('phone') || document.getElementById('phone').value,
        role: formData.get('role') || document.getElementById('role').value,
        password: formData.get('password') || document.getElementById('password').value
    };
    
    // Validate form data
    if (!validateAdminData(adminData)) {
        return;
    }
    
    // Add new admin to table
    addAdminToTable(adminData);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAdminModal'));
    modal.hide();
    document.getElementById('addAdminForm').reset();
    
    showNotification('Admin added successfully', 'success');
}

function validateAdminData(data) {
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.role || !data.password) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

function addAdminToTable(data) {
    const tableBody = document.querySelector('.admin-table tbody');
    const newRow = document.createElement('tr');
    
    const roleClass = data.role.toLowerCase().replace('-', '-');
    const statusClass = 'active'; // New admins are active by default
    
    newRow.innerHTML = `
        <td>
            <div class="admin-info">
                <img src="https://via.placeholder.com/32x32" alt="Admin" class="admin-avatar">
                <span>${data.firstName} ${data.lastName}</span>
            </div>
        </td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td><span class="role-badge ${roleClass}">${data.role.replace('-', ' ')}</span></td>
        <td><span class="status-badge ${statusClass}">Active</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary view-btn" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Re-initialize table functionality for new row
    initTableRowEvents(newRow);
}

function initTableRowEvents(row) {
    const viewBtn = row.querySelector('.view-btn');
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const adminName = row.cells[0].textContent.trim();
            viewAdmin(adminName);
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const adminData = extractAdminData(row);
            editAdmin(adminData);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const adminName = row.cells[0].textContent.trim();
            deleteAdmin(adminName, row);
        });
    }
}

// Utility functions
function updateNoResultsMessage() {
    const tableBody = document.querySelector('.admin-table tbody');
    const visibleRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => 
        row.style.display !== 'none'
    );
    
    // Remove existing no results message
    const existingMessage = tableBody.querySelector('.no-results-row');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleRows.length === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-results-row';
        noResultsRow.innerHTML = `
            <td colspan="6" class="text-center py-4">
                <i class="fas fa-search mb-2" style="font-size: 2rem; color: var(--text-muted);"></i>
                <p class="mb-0" style="color: var(--text-muted);">No admins found matching your criteria</p>
            </td>
        `;
        tableBody.appendChild(noResultsRow);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    notification.innerHTML = `
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

// Export functions for global access if needed
window.adminDashboard = {
    viewAdmin,
    editAdmin,
    deleteAdmin,
    showNotification
};