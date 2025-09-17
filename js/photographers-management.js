// Photographers Management JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize photographer management components
    initSidebar();
    initSearch();
    initFilters();
    initTable();
    initModal();
    initExport();
    updateStats();
});

// Sidebar functionality (reuse from admin dashboard)
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
    const tableRows = document.querySelectorAll('.photographer-table tbody tr');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            tableRows.forEach(row => {
                const name = row.cells[0].textContent.toLowerCase();
                const email = row.cells[1].textContent.toLowerCase();
                const phone = row.cells[2].textContent.toLowerCase();
                const specialty = row.cells[3].textContent.toLowerCase();
                
                if (name.includes(searchTerm) || 
                    email.includes(searchTerm) || 
                    phone.includes(searchTerm) || 
                    specialty.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateNoResultsMessage();
            updateVisibleStats();
        });
    }
}

// Filter functionality
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const locationFilter = document.getElementById('locationFilter');
    
    [statusFilter, specialtyFilter, ratingFilter, locationFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const specialtyFilter = document.getElementById('specialtyFilter').value.toLowerCase();
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    const locationFilter = document.getElementById('locationFilter').value.toLowerCase();
    const tableRows = document.querySelectorAll('.photographer-table tbody tr');
    
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
        
        // Specialty filter
        if (specialtyFilter && showRow) {
            const specialtyBadge = row.querySelector('.specialty-badge');
            const rowSpecialty = specialtyBadge ? specialtyBadge.textContent.toLowerCase().trim() : '';
            if (!rowSpecialty.includes(specialtyFilter)) {
                showRow = false;
            }
        }
        
        // Rating filter
        if (ratingFilter && showRow) {
            const ratingText = row.querySelector('.rating-text');
            const rowRating = ratingText ? parseFloat(ratingText.textContent.split(' ')[0]) : 0;
            if (rowRating < ratingFilter) {
                showRow = false;
            }
        }
        
        // Location filter
        if (locationFilter && showRow) {
            const locationText = row.querySelector('.photographer-location');
            const rowLocation = locationText ? locationText.textContent.toLowerCase() : '';
            if (!rowLocation.includes(locationFilter)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    updateNoResultsMessage();
    updateVisibleStats();
}

// Table functionality
function initTable() {
    // Action buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const suspendButtons = document.querySelectorAll('.suspend-btn');
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    const reactivateButtons = document.querySelectorAll('.reactivate-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            viewPhotographer(photographerData);
        });
    });
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            editPhotographer(photographerData);
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            deletePhotographer(photographerData, row);
        });
    });
    
    suspendButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            suspendPhotographer(photographerData, row);
        });
    });
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            approvePhotographer(photographerData, row);
        });
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            rejectPhotographer(photographerData, row);
        });
    });
    
    reactivateButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const photographerData = extractPhotographerData(row);
            reactivatePhotographer(photographerData, row);
        });
    });
}

// Extract photographer data from table row
function extractPhotographerData(row) {
    const nameElement = row.querySelector('.photographer-name');
    const locationElement = row.querySelector('.photographer-location');
    const ratingElement = row.querySelector('.rating-text');
    
    return {
        name: nameElement ? nameElement.textContent.trim() : '',
        location: locationElement ? locationElement.textContent.trim() : '',
        email: row.cells[1].textContent.trim(),
        phone: row.cells[2].textContent.trim(),
        specialty: row.querySelector('.specialty-badge').textContent.trim(),
        rating: ratingElement ? ratingElement.textContent.trim() : '',
        status: row.querySelector('.status-badge').textContent.trim()
    };
}

// Photographer actions
function viewPhotographer(photographerData) {
    const modalContent = `
        <div class="photographer-profile-modal">
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="https://via.placeholder.com/150x150" alt="${photographerData.name}" class="photographer-profile-image mb-3">
                    <h5>${photographerData.name}</h5>
                    <p class="text-muted">${photographerData.location}</p>
                    <div class="rating-display justify-content-center mb-3">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="rating-text ms-2">${photographerData.rating}</span>
                    </div>
                </div>
                <div class="col-md-8">
                    <h6>Contact Information</h6>
                    <p><strong>Email:</strong> ${photographerData.email}</p>
                    <p><strong>Phone:</strong> ${photographerData.phone}</p>
                    <p><strong>Specialty:</strong> ${photographerData.specialty}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${photographerData.status.toLowerCase()}">${photographerData.status}</span></p>
                    
                    <h6 class="mt-4">Portfolio</h6>
                    <div class="portfolio-grid">
                        <img src="https://via.placeholder.com/100x100" alt="Portfolio 1" class="portfolio-thumb">
                        <img src="https://via.placeholder.com/100x100" alt="Portfolio 2" class="portfolio-thumb">
                        <img src="https://via.placeholder.com/100x100" alt="Portfolio 3" class="portfolio-thumb">
                        <img src="https://via.placeholder.com/100x100" alt="Portfolio 4" class="portfolio-thumb">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('Photographer Profile', modalContent);
}

function editPhotographer(photographerData) {
    showNotification(`Edit photographer: ${photographerData.name}`, 'info');
    // In a real application, this would populate an edit form modal
}

function deletePhotographer(photographerData, row) {
    if (confirm(`Are you sure you want to delete photographer: ${photographerData.name}?`)) {
        row.remove();
        updateNoResultsMessage();
        updateStats();
        showNotification('Photographer deleted successfully', 'success');
    }
}

function suspendPhotographer(photographerData, row) {
    if (confirm(`Are you sure you want to suspend photographer: ${photographerData.name}?`)) {
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.textContent = 'Suspended';
        statusBadge.className = 'status-badge suspended';
        
        // Update action buttons
        updateActionButtons(row, 'suspended');
        updateStats();
        showNotification(`${photographerData.name} has been suspended`, 'warning');
    }
}

function approvePhotographer(photographerData, row) {
    const statusBadge = row.querySelector('.status-badge');
    statusBadge.textContent = 'Active';
    statusBadge.className = 'status-badge active';
    
    // Update action buttons
    updateActionButtons(row, 'active');
    updateStats();
    showNotification(`${photographerData.name} has been approved`, 'success');
}

function rejectPhotographer(photographerData, row) {
    if (confirm(`Are you sure you want to reject photographer: ${photographerData.name}?`)) {
        row.remove();
        updateNoResultsMessage();
        updateStats();
        showNotification(`${photographerData.name} has been rejected`, 'error');
    }
}

function reactivatePhotographer(photographerData, row) {
    const statusBadge = row.querySelector('.status-badge');
    statusBadge.textContent = 'Active';
    statusBadge.className = 'status-badge active';
    
    // Update action buttons
    updateActionButtons(row, 'active');
    updateStats();
    showNotification(`${photographerData.name} has been reactivated`, 'success');
}

function updateActionButtons(row, status) {
    const actionButtons = row.querySelector('.action-buttons');
    
    let buttonsHTML = `
        <button class="btn btn-sm btn-outline-primary view-btn" title="View Profile">
            <i class="fas fa-eye"></i>
        </button>
    `;
    
    if (status === 'active') {
        buttonsHTML += `
            <button class="btn btn-sm btn-outline-secondary edit-btn" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-warning suspend-btn" title="Suspend">
                <i class="fas fa-pause"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
    } else if (status === 'suspended') {
        buttonsHTML += `
            <button class="btn btn-sm btn-outline-success reactivate-btn" title="Reactivate">
                <i class="fas fa-play"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
    } else if (status === 'pending') {
        buttonsHTML += `
            <button class="btn btn-sm btn-outline-success approve-btn" title="Approve">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger reject-btn" title="Reject">
                <i class="fas fa-times"></i>
            </button>
        `;
    }
    
    actionButtons.innerHTML = buttonsHTML;
    
    // Re-initialize event listeners for new buttons
    initTableRowEvents(row);
}

function initTableRowEvents(row) {
    const viewBtn = row.querySelector('.view-btn');
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    const suspendBtn = row.querySelector('.suspend-btn');
    const approveBtn = row.querySelector('.approve-btn');
    const rejectBtn = row.querySelector('.reject-btn');
    const reactivateBtn = row.querySelector('.reactivate-btn');
    
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            viewPhotographer(photographerData);
        });
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            editPhotographer(photographerData);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            deletePhotographer(photographerData, row);
        });
    }
    
    if (suspendBtn) {
        suspendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            suspendPhotographer(photographerData, row);
        });
    }
    
    if (approveBtn) {
        approveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            approvePhotographer(photographerData, row);
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            rejectPhotographer(photographerData, row);
        });
    }
    
    if (reactivateBtn) {
        reactivateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const photographerData = extractPhotographerData(row);
            reactivatePhotographer(photographerData, row);
        });
    }
}

// Modal functionality
function initModal() {
    const addPhotographerForm = document.getElementById('addPhotographerForm');
    
    if (addPhotographerForm) {
        addPhotographerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddPhotographer();
        });
    }
}

function handleAddPhotographer() {
    const formData = new FormData(document.getElementById('addPhotographerForm'));
    const photographerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        specialty: document.getElementById('specialty').value,
        location: document.getElementById('location').value,
        experience: document.getElementById('experience').value,
        bio: document.getElementById('bio').value
    };
    
    // Validate form data
    if (!validatePhotographerData(photographerData)) {
        return;
    }
    
    // Add new photographer to table
    addPhotographerToTable(photographerData);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPhotographerModal'));
    modal.hide();
    document.getElementById('addPhotographerForm').reset();
    
    updateStats();
    showNotification('Photographer added successfully', 'success');
}

function validatePhotographerData(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'specialty', 'location', 'experience'];
    
    for (let field of required) {
        if (!data[field]) {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

function addPhotographerToTable(data) {
    const tableBody = document.querySelector('.photographer-table tbody');
    const newRow = document.createElement('tr');
    
    const specialtyClass = data.specialty.toLowerCase();
    
    newRow.innerHTML = `
        <td>
            <div class="photographer-info">
                <img src="https://via.placeholder.com/40x40" alt="Photographer" class="photographer-avatar">
                <div class="photographer-details">
                    <span class="photographer-name">${data.firstName} ${data.lastName}</span>
                    <small class="photographer-location">${data.location}, Sri Lanka</small>
                </div>
            </div>
        </td>
        <td>${data.email}</td>
        <td>${data.phone}</td>
        <td><span class="specialty-badge ${specialtyClass}">${data.specialty}</span></td>
        <td>
            <div class="rating-display">
                <div class="stars">
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                    <i class="far fa-star"></i>
                </div>
                <span class="rating-text">New</span>
            </div>
        </td>
        <td><span class="status-badge pending">Pending</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary view-btn" title="View Profile">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success approve-btn" title="Approve">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger reject-btn" title="Reject">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Re-initialize table functionality for new row
    initTableRowEvents(newRow);
}

// Export functionality
function initExport() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportPhotographersData();
        });
    }
}

function exportPhotographersData() {
    const visibleRows = Array.from(document.querySelectorAll('.photographer-table tbody tr')).filter(row => 
        row.style.display !== 'none' && !row.classList.contains('no-results-row')
    );
    
    if (visibleRows.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    let csvContent = 'Name,Email,Phone,Specialty,Rating,Status,Location\n';
    
    visibleRows.forEach(row => {
        const photographerData = extractPhotographerData(row);
        csvContent += `"${photographerData.name}","${photographerData.email}","${photographerData.phone}","${photographerData.specialty}","${photographerData.rating}","${photographerData.status}","${photographerData.location}"\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photographers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully', 'success');
}

// Stats functionality
function updateStats() {
    const allRows = document.querySelectorAll('.photographer-table tbody tr');
    const stats = {
        active: 0,
        pending: 0,
        verified: 0,
        totalBookings: 156 // This would come from backend
    };
    
    allRows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            const status = statusBadge.textContent.toLowerCase().trim();
            if (status === 'active') stats.active++;
            else if (status === 'pending') stats.pending++;
            
            // Count verified (active photographers with ratings)
            const ratingText = row.querySelector('.rating-text');
            if (status === 'active' && ratingText && !ratingText.textContent.includes('New')) {
                stats.verified++;
            }
        }
    });
    
    // Update DOM
    const statsCards = document.querySelectorAll('.stats-card');
    if (statsCards[0]) statsCards[0].querySelector('h3').textContent = stats.active;
    if (statsCards[1]) statsCards[1].querySelector('h3').textContent = stats.pending;
    if (statsCards[2]) statsCards[2].querySelector('h3').textContent = stats.verified;
    if (statsCards[3]) statsCards[3].querySelector('h3').textContent = stats.totalBookings;
}

function updateVisibleStats() {
    // This would update stats based on visible/filtered data
    // For demo purposes, we'll just update the main stats
    updateStats();
}

// Utility functions
function updateNoResultsMessage() {
    const tableBody = document.querySelector('.photographer-table tbody');
    const visibleRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => 
        row.style.display !== 'none' && !row.classList.contains('no-results-row')
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
            <td colspan="7" class="text-center py-4">
                <i class="fas fa-search mb-2" style="font-size: 2rem; color: var(--text-muted);"></i>
                <p class="mb-0" style="color: var(--text-muted);">No photographers found matching your criteria</p>
            </td>
        `;
        tableBody.appendChild(noResultsRow);
    }
}

function showModal(title, content) {
    // Create a temporary modal for viewing profiles
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

// Export functions for global access
window.photographersManagement = {
    viewPhotographer,
    editPhotographer,
    deletePhotographer,
    suspendPhotographer,
    approvePhotographer,
    rejectPhotographer,
    reactivatePhotographer,
    showNotification,
    exportPhotographersData
};