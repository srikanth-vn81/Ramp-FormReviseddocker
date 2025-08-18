/**
 * WFM Analytics - Ramp Input Form JavaScript
 * Professional corporate form with dynamic interactions
 */

class RampFormController {
    constructor() {
        this.form = document.querySelector('form');
        this.initializeEventListeners();
        this.initializeFormValidation();
        this.setupDynamicFields();
        this.setupProgressTracking();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Date availability handlers
        this.setupDateAvailabilityHandlers();
        
        // Duration handlers
        this.setupDurationHandlers();
        
        // Trainer field handlers
        this.setupTrainerHandlers();
        
        // Form submission handler
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmission.bind(this));
        }
        
        // Reset button handler
        const resetBtn = document.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.handleFormReset.bind(this));
        }
    }

    /**
     * Setup date availability change handlers
     */
    setupDateAvailabilityHandlers() {
        // Ramp start date
        const startAvailability = document.getElementById('ramp_start_availability');
        const startDateContainer = document.getElementById('ramp-start-date-container');
        const startDateInput = document.getElementById('ramp_start_date');

        if (startAvailability && startDateContainer && startDateInput) {
            startAvailability.addEventListener('change', (e) => {
                if (e.target.value === 'available') {
                    startDateContainer.style.display = 'block';
                    startDateContainer.classList.add('show');
                    startDateInput.required = true;
                } else {
                    startDateContainer.style.display = 'none';
                    startDateContainer.classList.remove('show');
                    startDateInput.required = false;
                    startDateInput.value = '';
                }
                this.updateFormProgress();
            });
        }

        // Ramp end date
        const endAvailability = document.getElementById('ramp_end_availability');
        const endDateContainer = document.getElementById('ramp-end-date-container');
        const endDateInput = document.getElementById('ramp_end_date');

        if (endAvailability && endDateContainer && endDateInput) {
            endAvailability.addEventListener('change', (e) => {
                if (e.target.value === 'available') {
                    endDateContainer.style.display = 'block';
                    endDateContainer.classList.add('show');
                    endDateInput.required = true;
                } else {
                    endDateContainer.style.display = 'none';
                    endDateContainer.classList.remove('show');
                    endDateInput.required = false;
                    endDateInput.value = '';
                }
                this.updateFormProgress();
            });
        }
    }

    /**
     * Setup duration field handlers
     */
    setupDurationHandlers() {
        // Training duration
        const trainingDuration = document.getElementById('training_duration');
        const trainingDurationNumberContainer = document.getElementById('training-duration-number-container');
        const trainingDurationNumber = document.getElementById('training_duration_number');

        if (trainingDuration && trainingDurationNumberContainer && trainingDurationNumber) {
            trainingDuration.addEventListener('change', (e) => {
                if (e.target.value && e.target.value !== '') {
                    trainingDurationNumberContainer.style.display = 'block';
                    trainingDurationNumber.required = true;
                } else {
                    trainingDurationNumberContainer.style.display = 'none';
                    trainingDurationNumber.required = false;
                    trainingDurationNumber.value = '';
                }
                this.updateFormProgress();
            });
        }

        // Nesting duration
        const nestingDuration = document.getElementById('nesting_duration');
        const nestingDurationNumberContainer = document.getElementById('nesting-duration-number-container');
        const nestingDurationNumber = document.getElementById('nesting_duration_number');

        if (nestingDuration && nestingDurationNumberContainer && nestingDurationNumber) {
            nestingDuration.addEventListener('change', (e) => {
                if (e.target.value && e.target.value !== '') {
                    nestingDurationNumberContainer.style.display = 'block';
                    nestingDurationNumber.required = true;
                } else {
                    nestingDurationNumberContainer.style.display = 'none';
                    nestingDurationNumber.required = false;
                    nestingDurationNumber.value = '';
                }
                this.updateFormProgress();
            });
        }
    }

    /**
     * Setup trainer field handlers to show additional fields
     */
    setupTrainerHandlers() {
        const clientTrainer = document.getElementById('client_trainer');
        const internalTrainer = document.getElementById('internal_trainer');
        const totalTrainers = document.getElementById('total_trainers');
        const additionalFields = document.getElementById('additional-fields');

        const checkTrainerFields = () => {
            const hasClientTrainer = clientTrainer && clientTrainer.value !== '';
            const hasInternalTrainer = internalTrainer && internalTrainer.value !== '';
            const hasTotalTrainers = totalTrainers && parseInt(totalTrainers.value) > 0;

            if (hasClientTrainer && hasInternalTrainer && hasTotalTrainers && additionalFields) {
                additionalFields.style.display = 'block';
                additionalFields.classList.add('show');
                
                // Make conditional fields required
                this.setAdditionalFieldsRequired(true);
            } else if (additionalFields) {
                additionalFields.style.display = 'none';
                additionalFields.classList.remove('show');
                
                // Remove required attribute from conditional fields
                this.setAdditionalFieldsRequired(false);
            }
            
            this.updateFormProgress();
        };

        if (clientTrainer) {
            clientTrainer.addEventListener('change', checkTrainerFields);
        }
        if (internalTrainer) {
            internalTrainer.addEventListener('change', checkTrainerFields);
        }
        if (totalTrainers) {
            totalTrainers.addEventListener('input', checkTrainerFields);
        }
    }

    /**
     * Set required attribute for additional fields
     */
    setAdditionalFieldsRequired(required) {
        const fields = [
            'training_duration',
            'nesting_duration',
            'batch_size'
        ];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.required = required;
            }
        });
    }

    /**
     * Setup dynamic form fields
     */
    setupDynamicFields() {
        // Add change listeners to all form inputs for progress tracking
        const formInputs = this.form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', () => this.updateFormProgress());
            input.addEventListener('input', () => this.updateFormProgress());
        });
    }

    /**
     * Setup progress tracking
     */
    setupProgressTracking() {
        this.updateFormProgress();
    }

    /**
     * Update form progress indicator
     */
    updateFormProgress() {
        const progressBar = document.getElementById('form-progress');
        const progressText = progressBar?.querySelector('.progress-text');
        
        if (!progressBar) return;

        const requiredFields = this.form.querySelectorAll('[required]');
        let completedFields = 0;

        requiredFields.forEach(field => {
            if (field.type === 'checkbox') {
                // For checkboxes, consider them complete if at least one in the group is checked
                const checkboxGroup = this.form.querySelectorAll(`input[name="${field.name}"]`);
                const isGroupComplete = Array.from(checkboxGroup).some(cb => cb.checked);
                if (isGroupComplete) completedFields++;
            } else if (field.value && field.value.trim() !== '') {
                completedFields++;
            }
        });

        const progress = requiredFields.length > 0 ? Math.round((completedFields / requiredFields.length) * 100) : 0;
        
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        
        if (progressText) {
            progressText.textContent = `${progress}%`;
        }

        // Change color based on progress
        progressBar.className = 'progress-bar';
        if (progress < 30) {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)';
        } else if (progress < 70) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)';
        }
    }

    /**
     * Initialize form validation
     */
    initializeFormValidation() {
        // Add Bootstrap validation classes
        this.form.addEventListener('submit', (event) => {
            if (!this.form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                this.showValidationErrors();
            }
            this.form.classList.add('was-validated');
        });
    }

    /**
     * Show validation errors
     */
    showValidationErrors() {
        const invalidFields = this.form.querySelectorAll(':invalid');
        let firstInvalidField = null;

        invalidFields.forEach((field, index) => {
            if (index === 0) {
                firstInvalidField = field;
            }
            
            // Add error styling
            field.classList.add('is-invalid');
            
            // Remove error styling on next valid input
            field.addEventListener('input', function removeError() {
                if (field.checkValidity()) {
                    field.classList.remove('is-invalid');
                    field.removeEventListener('input', removeError);
                }
            });
        });

        // Focus first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Handle form submission
     */
    handleFormSubmission(event) {
        // Add loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Remove loading state after form processing
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    /**
     * Handle form reset
     */
    handleFormReset(event) {
        event.preventDefault();
        
        // Confirm reset
        if (confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
            this.form.reset();
            this.form.classList.remove('was-validated');
            
            // Hide conditional fields
            const additionalFields = document.getElementById('additional-fields');
            const dateContainers = document.querySelectorAll('.date-input-container');
            const durationContainers = document.querySelectorAll('[id$="-duration-number-container"]');
            
            if (additionalFields) {
                additionalFields.style.display = 'none';
                additionalFields.classList.remove('show');
            }
            
            dateContainers.forEach(container => {
                container.style.display = 'none';
                container.classList.remove('show');
            });
            
            durationContainers.forEach(container => {
                container.style.display = 'none';
            });
            
            // Reset form progress
            this.updateFormProgress();
            
            // Show success message
            this.showNotification('Form reset successfully!', 'success');
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content .container-fluid');
        if (mainContent) {
            mainContent.insertBefore(notification, mainContent.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 5000);
        }
    }
}

/**
 * Validate form function (called by validate button)
 */
function validateForm() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    const invalidFields = [];
    
    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            invalidFields.push(field);
        }
    });
    
    if (invalidFields.length === 0) {
        // Show success message
        const controller = new RampFormController();
        controller.showNotification('✅ Form validation successful! All required fields are completed.', 'success');
    } else {
        // Show error message
        const controller = new RampFormController();
        controller.showNotification(`❌ Form validation failed! ${invalidFields.length} required field(s) need to be completed.`, 'danger');
        
        // Focus first invalid field
        if (invalidFields[0]) {
            invalidFields[0].focus();
            invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * Navbar scroll effect
 */
function initializeNavbarEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });
}

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form controller
    const formController = new RampFormController();
    
    // Initialize navbar effects
    initializeNavbarEffects();
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    console.log('WFM Analytics - Ramp Input Form initialized successfully');
});