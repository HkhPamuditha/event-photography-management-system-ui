// Admin Management JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin management components
    initAdminDashboard();
    initExportFunctionality();
    updateAdminStats();
});

function initAdminDashboard() {
    // Reuse existing admin dashboard functionality
    if (window.adminDashboard) {
        // Dashboard is already initialized
        console.log('Admin Dashboard initialized');
    }
}

// Export functionality specific to admin management
function initExportFunctionality() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportAdminData();
        });
    }
}

function exportAdminData() {
    const visibleRows = Array.from(document.querySelectorAll('.admin-table tbody tr')).filter(row => 
        row.style.display !== 'none' && !row.classList.contains('no-results-row')
    );
    
    if (visibleRows.length === 0) {
        showNotification('No admin data to export', 'warning');
        return;
    }
    
    let csvContent = 'Name,Email,Phone,Role,Status\n';
    
    visibleRows.forEach(row => {
        const name = row.cells[0].textContent.trim();
        const email = row.cells[1].textContent.trim();
        const phone = row.cells[2].textContent.trim();
        const role = row.querySelector('.role-badge').textContent.trim();
        const status = row.querySelector('.status-badge').textContent.trim();
        
        csvContent += `"${name}","${email}","${phone}","${role}","${status}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admins_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Admin data exported successfully', 'success');
}

// Update admin statistics
function updateAdminStats() {
    const allRows = document.querySelectorAll('.admin-table tbody tr');
    const stats = {
        total: 0,
        active: 0,
        pending: 0,
        superAdmin: 0
    };
    
    allRows.forEach(row => {
        if (row.style.display !== 'none' && !row.classList.contains('no-results-row')) {
            stats.total++;
            
            const statusBadge = row.querySelector('.status-badge');
            const roleBadge = row.querySelector('.role-badge');
            
            if (statusBadge) {
                const status = statusBadge.textContent.toLowerCase().trim();
                if (status === 'active') stats.active++;
                else if (status === 'pending') stats.pending++;
            }
            
            if (roleBadge) {
                const role = roleBadge.textContent.toLowerCase().trim();
                if (role === 'super admin') stats.superAdmin++;
            }
        }
    });
    
    // Update DOM
    const statsCards = document.querySelectorAll('.stats-card');
    if (statsCards[0]) statsCards[0].querySelector('h3').textContent = stats.total;
    if (statsCards[1]) statsCards[1].querySelector('h3').textContent = stats.active;
    if (statsCards[2]) statsCards[2].querySelector('h3').textContent = stats.pending;
    if (statsCards[3]) statsCards[3].querySelector('h3').textContent = stats.superAdmin;
}

// Enhanced admin actions
function viewAdminDetails(adminName) {
    const modalContent = `
        <div class="admin-profile-modal">
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="https://via.placeholder.com/120x120" alt="${adminName}" class="admin-profile-image mb-3">
                    <h5>${adminName}</h5>
                    <p class="text-muted">System Administrator</p>
                </div>
                <div class="col-md-8">
                    <h6>Access Permissions</h6>
                    <div class="permissions-list">
                        <div class="permission-item">
                            <i class="fas fa-check text-success me-2"></i>
                            <span>User Management</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Photographer Management</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Booking Management</span>
                        </div>
                        <div class="permission-item">
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Payment Processing</span>
                        </div>
                    </div>
                    
                    <h6 class="mt-4">Recent Activity</h6>
                    <div class="activity-list">
                        <div class="activity-item">
                            <i class="fas fa-user-plus text-primary me-2"></i>
                            <span>Added new photographer: John Doe</span>
                            <small class="text-muted d-block">2 hours ago</small>
                        </div>
                        <div class="activity-item">
                            <i class="fas fa-edit text-info me-2"></i>
                            <span>Updated booking #1234</span>
                            <small class="text-muted d-block">5 hours ago</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('Admin Profile', modalContent);
}

// Enhanced role management
function updateAdminRole(adminName, newRole) {
    // Find the row and update the role badge
    const rows = document.querySelectorAll('.admin-table tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('.admin-info span').textContent.trim();
        if (name === adminName) {
            const roleBadge = row.querySelector('.role-badge');
            roleBadge.textContent = newRole;
            roleBadge.className = `role-badge ${newRole.toLowerCase().replace(' ', '-')}`;
        }
    });
    
    updateAdminStats();
    showNotification(`${adminName}'s role updated to ${newRole}`, 'success');
}

// Admin status management
function toggleAdminStatus(adminName, currentStatus) {
    const newStatus = currentStatus.toLowerCase() === 'active' ? 'Inactive' : 'Active';
    
    // Find the row and update the status badge
    const rows = document.querySelectorAll('.admin-table tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('.admin-info span').textContent.trim();
        if (name === adminName) {
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = newStatus;
            statusBadge.className = `status-badge ${newStatus.toLowerCase()}`;
        }
    });
    
    updateAdminStats();
    showNotification(`${adminName} status changed to ${newStatus}`, 'info');
}

// Enhanced search functionality
function enhanceAdminSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // Add search suggestions
        const suggestions = ['Sophia Carter', 'Ethan Bennett', 'Olivia Hayes', 'Liam Foster', 'Ava Morgan'];
        
        searchInput.addEventListener('focus', function() {
            // Could implement autocomplete here
        });
        
        // Enhanced search that includes role and status
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const tableRows = document.querySelectorAll('.admin-table tbody tr');
            
            tableRows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                const email = row.cells[1].textContent.toLowerCase();
                const phone = row.cells[2].textContent.toLowerCase();
                const role = row.cells[3].textContent.toLowerCase();
                const status = row.cells[4].textContent.toLowerCase();
                
                if (name.includes(searchTerm) || 
                    email.includes(searchTerm) || 
                    phone.includes(searchTerm) ||
                    role.includes(searchTerm) ||
                    status.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateNoResultsMessage();
            updateAdminStats();
        });
    }
}

// Permission management
function manageAdminPermissions(adminName) {
    const permissionsModal = `
        <div class="permissions-management">
            <h6>Manage Permissions for ${adminName}</h6>
            <form id="permissionsForm">
                <div class="permission-group">
                    <h6>User Management</h6>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="userView" checked>
                        <label class="form-check-label" for="userView">View Users</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="userEdit" checked>
                        <label class="form-check-label" for="userEdit">Edit Users</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="userDelete">
                        <label class="form-check-label" for="userDelete">Delete Users</label>
                    </div>
                </div>
                
                <div class="permission-group mt-3">
                    <h6>System Settings</h6>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="systemView" checked>
                        <label class="form-check-label" for="systemView">View Settings</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="systemEdit">
                        <label class="form-check-label" for="systemEdit">Modify Settings</label>
                    </div>
                </div>
            </form>
            <div class="mt-3">
                <button class="btn btn-primary" onclick="savePermissions('${adminName}')">Save Permissions</button>
            </div>
        </div>
    `;
    
    showModal('Manage Permissions', permissionsModal);
}

function savePermissions(adminName) {
    // In a real application, this would save to the backend
    showNotification(`Permissions updated for ${adminName}`, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('tempModal'));
    if (modal) modal.hide();
}

// Utility functions
function showModal(title, content) {
    // Create a temporary modal
    const modalHTML = `
        <div class="modal fade" id="tempModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing temp modal
    const existingModal = document.getElementById('tempModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('tempModal'));
    modal.show();
    
    // Remove modal when hidden
    document.getElementById('tempModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 0.75rem;
    `;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${iconMap[type] || 'info-circle'} me-2"></i>
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

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhanceAdminSearch();
});

// Export functions for global access
window.adminManagement = {
    exportAdminData,
    viewAdminDetails,
    updateAdminRole,
    toggleAdminStatus,
    manageAdminPermissions,
    savePermissions,
    showNotification
};