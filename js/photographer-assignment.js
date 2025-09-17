// Photographer Assignment JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assignment functionality
    initSidebar();
    initPhotographerSelect();
    initAssignmentForm();
    initActionButtons();
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

// Photographer selection functionality
function initPhotographerSelect() {
    const photographerSelect = document.getElementById('photographerSelect');
    const photographerPreview = document.getElementById('photographerPreview');
    
    if (photographerSelect) {
        photographerSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (selectedOption && selectedOption.value) {
                showPhotographerPreview(selectedOption);
            } else {
                hidePhotographerPreview();
            }
        });
    }
}

function showPhotographerPreview(option) {
    const photographerPreview = document.getElementById('photographerPreview');
    const previewName = document.getElementById('previewName');
    const previewRating = document.getElementById('previewRating');
    const previewSpecialty = document.getElementById('previewSpecialty');
    const previewExperience = document.getElementById('previewExperience');
    const previewAvatar = document.getElementById('previewAvatar');
    
    // Extract data from option attributes
    const name = option.textContent.split(' - ')[0];
    const rating = option.getAttribute('data-rating');
    const specialty = option.getAttribute('data-specialty');
    const experience = option.getAttribute('data-experience');
    
    // Update preview content
    previewName.textContent = name;
    previewRating.innerHTML = `<i class="fas fa-star"></i> ${rating}`;
    previewSpecialty.textContent = specialty;
    previewExperience.textContent = `${experience} years experience`;
    previewAvatar.src = `https://via.placeholder.com/50x50?text=${name.charAt(0)}`;
    previewAvatar.alt = name;
    
    // Show preview
    photographerPreview.classList.remove('d-none');
}

function hidePhotographerPreview() {
    const photographerPreview = document.getElementById('photographerPreview');
    photographerPreview.classList.add('d-none');
}

// Assignment form functionality
function initAssignmentForm() {
    const assignmentForm = document.getElementById('photographerAssignmentForm');
    
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePhotographerAssignment();
        });
    }
}

function handlePhotographerAssignment() {
    const photographerSelect = document.getElementById('photographerSelect');
    const assignmentNote = document.getElementById('assignmentNote');
    
    const selectedPhotographer = photographerSelect.value;
    const selectedOption = photographerSelect.options[photographerSelect.selectedIndex];
    const note = assignmentNote.value.trim();
    
    if (!selectedPhotographer) {
        showNotification('Please select a photographer', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = assignmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Assigning...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Extract photographer data
        const photographerData = {
            id: selectedPhotographer,
            name: selectedOption.textContent.split(' - ')[0],
            email: getPhotographerEmail(selectedPhotographer),
            rating: selectedOption.getAttribute('data-rating'),
            specialty: selectedOption.getAttribute('data-specialty'),
            experience: selectedOption.getAttribute('data-experience'),
            note: note
        };
        
        // Update assignment status
        updateAssignmentStatus(photographerData);
        updateBookingStatus('assigned');
        
        // Reset form
        assignmentForm.reset();
        hidePhotographerPreview();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal(photographerData);
        
        // Add to timeline
        addTimelineEvent('Photographer Assigned', `${photographerData.name} has been assigned to this booking`, new Date());
        
    }, 2000); // Simulate network delay
}

function getPhotographerEmail(photographerId) {
    // Map photographer IDs to emails (in real app, this would come from API)
    const emailMap = {
        'ethan-bennett': 'ethan.bennett@example.com',
        'olivia-hayes': 'olivia.hayes@example.com',
        'ava-morgan': 'ava.morgan@example.com',
        'noah-parker': 'noah.parker@example.com',
        'sophia-carter': 'sophia.carter@example.com',
        'liam-foster': 'liam.foster@example.com'
    };
    
    return emailMap[photographerId] || 'photographer@example.com';
}

function updateAssignmentStatus(photographerData) {
    const currentAssignment = document.getElementById('currentAssignment');
    const assignedPhotographer = document.getElementById('assignedPhotographer');
    const assignedName = document.getElementById('assignedName');
    const assignedContact = document.getElementById('assignedContact');
    const assignedAvatar = document.getElementById('assignedAvatar');
    const assignmentDate = document.getElementById('assignmentDate');
    
    // Hide no assignment state
    currentAssignment.classList.add('d-none');
    
    // Update assigned photographer info
    assignedName.textContent = photographerData.name;
    assignedContact.textContent = photographerData.email;
    assignedAvatar.src = `https://via.placeholder.com/40x40?text=${photographerData.name.charAt(0)}`;
    assignedAvatar.alt = photographerData.name;
    assignmentDate.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show assigned photographer state
    assignedPhotographer.classList.remove('d-none');
}

function updateBookingStatus(status) {
    const statusBadge = document.querySelector('.status-badge');
    
    if (status === 'assigned') {
        statusBadge.textContent = 'Photographer Assigned';
        statusBadge.className = 'status-badge assigned';
    }
}

function showSuccessModal(photographerData) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successMessage = document.getElementById('successMessage');
    
    successMessage.textContent = `${photographerData.name} has been successfully assigned to this booking.`;
    successModal.show();
}

function addTimelineEvent(title, description, date) {
    const timeline = document.querySelector('.timeline');
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) + ' - ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    timelineItem.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h6>${title}</h6>
            <p>${description}</p>
            <small class="text-muted">${formattedDate}</small>
        </div>
    `;
    
    // Remove pending class from last item
    const pendingItem = timeline.querySelector('.timeline-item.pending');
    if (pendingItem) {
        pendingItem.classList.remove('pending');
    }
    
    // Add new item
    timeline.appendChild(timelineItem);
}

// Action buttons functionality
function initActionButtons() {
    // Reassign button
    document.addEventListener('click', function(e) {
        if (e.target.closest('#reassignBtn')) {
            handleReassignment();
        }
        
        if (e.target.closest('#contactBtn')) {
            handleContactPhotographer();
        }
    });
}

function handleReassignment() {
    if (confirm('Are you sure you want to reassign this booking to a different photographer?')) {
        // Reset assignment status
        const currentAssignment = document.getElementById('currentAssignment');
        const assignedPhotographer = document.getElementById('assignedPhotographer');
        
        currentAssignment.classList.remove('d-none');
        assignedPhotographer.classList.add('d-none');
        
        // Reset booking status
        updateBookingStatus('pending');
        
        // Add timeline event
        addTimelineEvent('Photographer Reassignment', 'Booking has been made available for reassignment', new Date());
        
        showNotification('Booking is now available for reassignment', 'info');
        
        // Scroll to assignment form
        document.querySelector('.assignment-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function handleContactPhotographer() {
    const assignedName = document.getElementById('assignedName').textContent;
    const assignedContact = document.getElementById('assignedContact').textContent;
    
    // Create contact modal or actions
    const contactOptions = `
        <div class="contact-options">
            <h6>Contact ${assignedName}</h6>
            <div class="contact-methods">
                <a href="mailto:${assignedContact}" class="btn btn-outline-primary me-2">
                    <i class="fas fa-envelope"></i> Send Email
                </a>
                <a href="tel:+1234567890" class="btn btn-outline-success">
                    <i class="fas fa-phone"></i> Call
                </a>
            </div>
        </div>
    `;
    
    showModal('Contact Photographer', contactOptions);
}

// Utility functions
function showModal(title, content) {
    // Create a temporary modal
    const modalHTML = `
        <div class="modal fade" id="tempModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
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

// Form validation
function validateAssignmentForm() {
    const photographerSelect = document.getElementById('photographerSelect');
    
    if (!photographerSelect.value) {
        showNotification('Please select a photographer', 'error');
        return false;
    }
    
    return true;
}

// Auto-save functionality for notes
function initAutoSave() {
    const assignmentNote = document.getElementById('assignmentNote');
    let saveTimeout;
    
    if (assignmentNote) {
        assignmentNote.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                // Auto-save note to localStorage
                const bookingId = 'booking-001'; // In real app, this would be dynamic
                localStorage.setItem(`assignment-note-${bookingId}`, this.value);
            }, 1000);
        });
        
        // Load saved note on page load
        const bookingId = 'booking-001';
        const savedNote = localStorage.getItem(`assignment-note-${bookingId}`);
        if (savedNote) {
            assignmentNote.value = savedNote;
        }
    }
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    initAutoSave();
});

// Photographer availability check
function checkPhotographerAvailability(photographerId, eventDate) {
    // In a real application, this would check against the photographer's calendar
    // For demo purposes, we'll simulate some busy photographers
    const busyPhotographers = ['sophia-carter', 'liam-foster'];
    
    return !busyPhotographers.includes(photographerId);
}

// Enhanced photographer selection with availability
function enhancePhotographerOptions() {
    const photographerSelect = document.getElementById('photographerSelect');
    const eventDate = 'July 25, 2024'; // This would be dynamic in real app
    
    Array.from(photographerSelect.options).forEach(option => {
        if (option.value) {
            const isAvailable = checkPhotographerAvailability(option.value, eventDate);
            if (!isAvailable) {
                option.disabled = true;
                option.textContent += ' (Unavailable)';
            }
        }
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhancePhotographerOptions();
});

// Export functions for global access
window.photographerAssignment = {
    handlePhotographerAssignment,
    handleReassignment,
    handleContactPhotographer,
    showNotification,
    updateAssignmentStatus
};