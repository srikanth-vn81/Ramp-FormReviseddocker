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
        
        // Operational assumptions handlers
        this.setupOperationalAssumptionsHandlers();
        
        // Language support handlers
        this.setupLanguageHandlers();
        
        // Channel support handlers (for Others checkbox)
        this.setupChannelSupportHandlers();
        
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
                    trainingDurationNumberContainer.style.display = 'flex';
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
                    nestingDurationNumberContainer.style.display = 'flex';
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

            // Auto-calculate total trainers whenever either field changes
            if (totalTrainers) {
                const clientCount = (hasClientTrainer) ? parseInt(clientTrainer.value) || 0 : 0;
                const internalCount = (hasInternalTrainer) ? parseInt(internalTrainer.value) || 0 : 0;
                const calculatedTotal = clientCount + internalCount;
                
                // Show value if at least one trainer is selected and total > 0
                if ((hasClientTrainer || hasInternalTrainer) && calculatedTotal > 0) {
                    totalTrainers.value = calculatedTotal;
                } else {
                    totalTrainers.value = '';
                }
            }

            // Show additional fields if any trainer field is filled (more flexible)
            const updatedHasTotalTrainers = totalTrainers && parseInt(totalTrainers.value) > 0;
            if ((hasClientTrainer || hasInternalTrainer || updatedHasTotalTrainers) && additionalFields) {
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
     * Setup operational assumptions ratio handlers
     */
    setupOperationalAssumptionsHandlers() {
        const ratioFields = [
            'supervisor_ratio',
            'qa_ratio', 
            'trainer_ratio'
        ];

        ratioFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                // Handle input to format with 1: prefix
                field.addEventListener('input', (e) => {
                    let value = e.target.value;
                    
                    // Remove any existing "1:" to avoid duplication
                    if (value.startsWith('1:')) {
                        value = value.substring(2);
                    }
                    
                    // Remove non-numeric characters except for existing colons
                    value = value.replace(/[^0-9]/g, '');
                    
                    // Add the "1:" prefix if there's a number
                    if (value && value.trim() !== '') {
                        e.target.value = '1:' + value;
                    } else {
                        e.target.value = '1:1'; // Default to 1:1 if empty
                    }
                });

                // Handle focus to position cursor after "1:"
                field.addEventListener('focus', (e) => {
                    if (e.target.value === '1:1' || e.target.value === '1:') {
                        // Position cursor after "1:"
                        setTimeout(() => {
                            e.target.setSelectionRange(2, e.target.value.length);
                        }, 0);
                    }
                });

                // Initialize with 1:1 if empty
                if (!field.value || field.value.trim() === '') {
                    field.value = '1:1';
                }
            }
        });
    }

    /**
     * Setup language support handlers
     */
    setupLanguageHandlers() {
        const languagesSupported = document.getElementById('languages_supported');
        const specifyLanguagesContainer = document.getElementById('specify-languages-container');
        const specifyLanguagesInput = document.getElementById('specify_languages');

        if (languagesSupported && specifyLanguagesContainer && specifyLanguagesInput) {
            languagesSupported.addEventListener('change', (e) => {
                if (e.target.value === 'multilingual') {
                    specifyLanguagesContainer.style.display = 'block';
                    specifyLanguagesInput.required = true;
                } else {
                    specifyLanguagesContainer.style.display = 'none';
                    specifyLanguagesInput.required = false;
                    specifyLanguagesInput.value = '';
                }
                this.updateFormProgress();
            });
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
     * Setup channel support handlers
     */
    setupChannelSupportHandlers() {
        // Handle Others checkbox and text input
        const othersCheckbox = document.getElementById('others-checkbox');
        const othersTextContainer = document.getElementById('others-text-container');
        
        if (othersCheckbox && othersTextContainer) {
            othersCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    othersTextContainer.style.display = 'block';
                } else {
                    othersTextContainer.style.display = 'none';
                    // Clear the text input when hiding
                    const textInput = othersTextContainer.querySelector('input');
                    if (textInput) {
                        textInput.value = '';
                    }
                }
            });
        }
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
 * Initialize progress tracking for form completion
 */
function initializeProgressTracking() {
    const formFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    const progressBar = document.getElementById('form-progress');
    const progressText = document.getElementById('progress-text');
    const submitBtn = document.getElementById('submit-btn');
    
    function updateProgress() {
        let filledFields = 0;
        let totalRequired = 0;
        
        // Only count visible and required fields
        formFields.forEach(field => {
            // Skip hidden fields or fields in hidden containers
            const isVisible = field.offsetParent !== null;
            if (!isVisible) return;
            
            totalRequired++;
            if (field.type === 'checkbox' || field.type === 'radio') {
                if (field.checked) filledFields++;
            } else if (field.value && field.value.trim() !== '') {
                filledFields++;
            }
        });
        
        const percentage = totalRequired > 0 ? Math.round((filledFields / totalRequired) * 100) : 0;
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
            
            // Update progress bar color based on completion
            progressBar.className = 'progress-bar';
            if (percentage >= 80) {
                progressBar.classList.add('bg-success');
            } else if (percentage >= 50) {
                progressBar.classList.add('bg-warning');
            } else {
                progressBar.classList.add('bg-primary');
            }
        }
        
        if (progressText) {
            progressText.textContent = percentage + '%';
        }
        
        if (submitBtn) {
            submitBtn.disabled = false; // Always enable submit button
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-success');
        }
    }
    
    // Add event listeners to all form fields
    formFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });
    
    // Initialize with 0% progress and keep it at 0%
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.className = 'progress-bar bg-primary';
        progressBar.setAttribute('aria-valuenow', '0');
    }
    if (progressText) {
        progressText.textContent = '0%';
    }
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-secondary');
        submitBtn.classList.remove('btn-success');
    }
    
    // Don't auto-calculate progress on load to keep it at 0%
    // Progress will only update when user interacts with fields
}

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form controller
    const formController = new RampFormController();
    
    // Initialize navbar effects
    initializeNavbarEffects();
    
    // Initialize progress tracking
    initializeProgressTracking();
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize location details functionality
    initializeLocationDetails();
    
    console.log('WFM Analytics - Ramp Input Form initialized successfully');
});

/**
 * Initialize location details functionality
 */
function initializeLocationDetails() {
    // Initialize geo country functionality - handle checkbox changes
    const geoSelect = document.getElementById('geo-country-select');
    if (geoSelect) {
        const checkboxes = geoSelect.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                updateCountryConfiguration();
                updateSummaryValues();
                updateSitesTable();
            });
        });
        
        // Set default selection (all countries) always on page load
        if (checkboxes.length > 0) {
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                }
            });
        }
        
        // Trigger initial display
        updateCountryConfiguration();
    }

    // Initialize requirement value input
    const requirementInput = document.getElementById('requirement-value-input');
    if (requirementInput) {
        requirementInput.addEventListener('input', updateSummaryValues);
        requirementInput.addEventListener('change', updateSummaryValues);
    }

    // Initialize country headcount inputs
    const headcountInputs = document.querySelectorAll('.country-headcount');
    headcountInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateSummaryValues();
            validateHeadcountDistribution();
        });
        input.addEventListener('change', function() {
            updateSummaryValues();
            validateHeadcountDistribution();
        });
    });

    // Initialize sites table
    updateSitesTable();
    
    // Initialize summary values
    updateSummaryValues();
}

/**
 * Update country configuration based on geo selection
 */
function updateCountryConfiguration() {
    const geoSelect = document.getElementById('geo-country-select');
    const countryGrid = document.getElementById('country-grid');
    const countryCountDisplay = document.querySelector('.country-count-display');

    if (!geoSelect || !countryGrid) return;

    // Get selected countries from checkboxes
    const selectedCheckboxes = geoSelect.querySelectorAll('input[type="checkbox"]:checked');
    const countries = Array.from(selectedCheckboxes).map(cb => cb.value);

    // Update country count display
    if (countryCountDisplay) {
        countryCountDisplay.textContent = `${countries.length} Countries Selected`;
    }

    // Show/hide country items based on selection
    const allCountryItems = countryGrid.querySelectorAll('.country-item');
    allCountryItems.forEach(item => {
        const countryCode = item.querySelector('input').getAttribute('data-country');
        if (countries.includes(countryCode)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
            // Clear value for hidden countries
            const input = item.querySelector('.country-headcount');
            if (input) input.value = 0;
        }
    });

    // Update grid layout
    countryGrid.style.gridTemplateColumns = `repeat(${Math.min(countries.length, 2)}, 1fr)`;
}

/**
 * Update summary values (total allocated, required, remaining)
 */
function updateSummaryValues() {
    const requirementValueInput = document.getElementById('requirement-value-input');
    const totalAllocated = document.getElementById('total-allocated');
    const requiredTotal = document.getElementById('required-total');
    const remainingTotal = document.getElementById('remaining-total');

    if (!requirementValueInput || !totalAllocated || !requiredTotal || !remainingTotal) {
        return;
    }

    const requiredValue = parseInt(requirementValueInput.value) || 0;

    // Update required total
    requiredTotal.textContent = requiredValue;

    // Calculate allocated total from visible country inputs
    const headcountInputs = document.querySelectorAll('.country-headcount');
    let allocatedValue = 0;
    headcountInputs.forEach(input => {
        // Only count visible inputs
        if (input.closest('.country-item').style.display !== 'none') {
            const value = parseInt(input.value) || 0;
            allocatedValue += value;
        }
    });

    // Update total allocated
    totalAllocated.textContent = allocatedValue;

    // Calculate remaining
    const remaining = requiredValue - allocatedValue;
    remainingTotal.textContent = remaining;

    // Apply color styling based on remaining value
    remainingTotal.classList.remove('text-success', 'text-danger', 'text-warning');
    if (remaining === 0 && requiredValue > 0) {
        remainingTotal.classList.add('text-success');
    } else if (remaining < 0) {
        remainingTotal.classList.add('text-danger');
    } else if (remaining > 0) {
        remainingTotal.classList.add('text-warning');
    }
}

/**
 * Validate headcount distribution
 */
function validateHeadcountDistribution() {
    const requirementValueInput = document.getElementById('requirement-value-input');
    if (!requirementValueInput) return; // Exit if element doesn't exist
    const totalRequirement = parseInt(requirementValueInput.value) || 0;
    const headcountInputs = document.querySelectorAll('.country-headcount');
    let currentTotalHeadcount = 0;

    headcountInputs.forEach(input => {
        // Only count visible inputs
        if (input.closest('.country-item').style.display !== 'none') {
            const value = parseInt(input.value) || 0;
            currentTotalHeadcount += value;
        }
    });

    // Show validation message
    const validationMessage = document.getElementById('validation-message');
    if (validationMessage) {
        if (currentTotalHeadcount === totalRequirement && totalRequirement > 0) {
            validationMessage.textContent = '✓ Perfect! All headcount has been allocated.';
            validationMessage.className = 'alert alert-success mt-2';
            validationMessage.style.display = 'block';
        } else if (currentTotalHeadcount > totalRequirement) {
            const excess = currentTotalHeadcount - totalRequirement;
            validationMessage.textContent = `⚠ Over-allocated by ${excess}. Please reduce the numbers.`;
            validationMessage.className = 'alert alert-danger mt-2';
            validationMessage.style.display = 'block';
        } else if (currentTotalHeadcount < totalRequirement && currentTotalHeadcount > 0) {
            const remaining = totalRequirement - currentTotalHeadcount;
            validationMessage.textContent = `⚠ ${remaining} more needed to meet requirement.`;
            validationMessage.className = 'alert alert-warning mt-2';
            validationMessage.style.display = 'block';
        } else {
            validationMessage.style.display = 'none';
        }
    }
}

/**
 * Update sites table based on selected countries
 */
function updateSitesTable() {
    const geoSelect = document.getElementById('geo-country-select');
    const sitesTable = document.getElementById('sites-table');
    const sitesTableBody = document.getElementById('sites-table-body');

    if (!geoSelect || !sitesTable || !sitesTableBody) return;

    // Get selected countries from checkboxes
    const selectedCheckboxes = geoSelect.querySelectorAll('input[type="checkbox"]:checked');
    const selectedCountries = Array.from(selectedCheckboxes).map(cb => cb.value);

    // Update column visibility
    const headers = sitesTable.querySelectorAll('th.country-header');
    headers.forEach(header => {
        const country = header.getAttribute('data-country');
        if (selectedCountries.includes(country)) {
            header.style.display = 'table-cell';
        } else {
            header.style.display = 'none';
        }
    });

    // Generate sites rows
    generateSitesRows(selectedCountries);

    // Add event listeners to country site selectors
    const countrySiteSelects = document.querySelectorAll('.country-sites-select');
    countrySiteSelects.forEach(select => {
        const country = select.getAttribute('data-country');
        if (selectedCountries.includes(country)) {
            select.addEventListener('change', function() {
                generateSitesRows(selectedCountries);
            });
        }
    });
}

/**
 * Generate sites table rows
 */
function generateSitesRows(selectedCountries) {
    const sitesTableBody = document.getElementById('sites-table-body');
    if (!sitesTableBody) return;

    sitesTableBody.innerHTML = '';

    // Get the maximum number of sites across all countries
    let maxSites = 0;
    const countrySiteCounts = {};
    
    selectedCountries.forEach(country => {
        const select = document.querySelector(`.country-sites-select[data-country="${country}"]`);
        const siteCount = select ? parseInt(select.value) : 3;
        countrySiteCounts[country] = siteCount;
        maxSites = Math.max(maxSites, siteCount);
    });

    // Generate rows for each site
    for (let siteIndex = 1; siteIndex <= maxSites; siteIndex++) {
        const row = document.createElement('tr');
        
        // Metrics column
        const metricsCell = document.createElement('td');
        metricsCell.className = 'site-metrics-cell';
        metricsCell.innerHTML = `
            <div class="d-flex align-items-center justify-content-center">
                <i class="fas fa-building me-1" style="color: #3b82f6; font-size: 0.7rem;"></i>
                <span>Site ${siteIndex}</span>
            </div>
        `;
        row.appendChild(metricsCell);
        
        // Country columns
        ['CAN', 'COL', 'HKG', 'IND', 'MEX', 'PAN', 'PHL', 'POL', 'TTO', 'USA'].forEach(country => {
            const cell = document.createElement('td');
            cell.className = 'text-center';
            
            if (selectedCountries.includes(country)) {
                cell.style.display = 'table-cell';
                if (siteIndex <= countrySiteCounts[country]) {
                    // Get country-specific sites
                    const countrySites = {
                        'CAN': [
                            { value: '', text: 'Select Site' },
                            { value: 'montreal', text: 'Montreal' },
                            { value: 'toronto-02', text: 'Toronto 02' }
                        ],
                        'COL': [
                            { value: '', text: 'Select Site' },
                            { value: 'medellin', text: 'Medellin' }
                        ],
                        'HKG': [
                            { value: '', text: 'Select Site' },
                            { value: 'hong-kong', text: 'Hong Kong' }
                        ],
                        'IND': [
                            { value: '', text: 'Select Site' },
                            { value: 'noida', text: 'Noida' },
                            { value: 'noida-02', text: 'Noida 02' }
                        ],
                        'MEX': [
                            { value: '', text: 'Select Site' },
                            { value: 'mexico-city-02', text: 'Mexico City 02' },
                            { value: 'mexico-city-03', text: 'Mexico City 03' }
                        ],
                        'PAN': [
                            { value: '', text: 'Select Site' },
                            { value: 'panama-city', text: 'Panama City' }
                        ],
                        'PHL': [
                            { value: '', text: 'Select Site' },
                            { value: 'bacolod-city', text: 'Bacolod City' },
                            { value: 'clark-01', text: 'Clark 01' },
                            { value: 'clark-02', text: 'Clark 02' },
                            { value: 'clark-03', text: 'Clark 03' },
                            { value: 'clark-05', text: 'Clark 05' },
                            { value: 'dasmarinas-01', text: 'Dasmarinas 01' },
                            { value: 'dasmarinas-02', text: 'Dasmarinas 02' },
                            { value: 'davao', text: 'Davao' },
                            { value: 'davao-02', text: 'Davao 02' },
                            { value: 'fairview', text: 'Fairview' },
                            { value: 'fairview-02', text: 'Fairview 02' },
                            { value: 'iloilo', text: 'Iloilo' },
                            { value: 'iloilo-02', text: 'Iloilo 02' },
                            { value: 'iloilo-03', text: 'Iloilo 03' },
                            { value: 'iloilo-03b', text: 'Iloilo 03B' },
                            { value: 'iloilo-04', text: 'Iloilo 04' },
                            { value: 'santa-rosa', text: 'Santa Rosa' },
                            { value: 'santa-rosa-02', text: 'Santa Rosa 02' },
                            { value: 'talisay-city', text: 'Talisay City' }
                        ],
                        'POL': [
                            { value: '', text: 'Select Site' },
                            { value: 'warsaw', text: 'Warsaw' }
                        ],
                        'TTO': [
                            { value: '', text: 'Select Site' },
                            { value: 'barataria', text: 'Barataria' },
                            { value: 'chaguanas', text: 'Chaguanas' },
                            { value: 'waterfield', text: 'Waterfield' }
                        ],
                        'USA': [
                            { value: '', text: 'Select Site' },
                            { value: 'allentown', text: 'Allentown' },
                            { value: 'atlanta', text: 'Atlanta' },
                            { value: 'buffalo', text: 'Buffalo' },
                            { value: 'charlotte', text: 'Charlotte' },
                            { value: 'east-hartford', text: 'East Hartford' },
                            { value: 'fort-lauderdale-02', text: 'Fort Lauderdale 02' },
                            { value: 'houston-01', text: 'Houston 01' },
                            { value: 'meridian', text: 'Meridian' },
                            { value: 'naperville', text: 'Naperville' },
                            { value: 'phoenix', text: 'Phoenix' },
                            { value: 'richfield', text: 'Richfield' },
                            { value: 'tempe', text: 'Tempe' },
                            { value: 'west-des-moines', text: 'West Des Moines' }
                        ]
                    };
                    
                    const siteOptions = countrySites[country] || [{ value: '', text: 'Select Site' }];
                    
                    let selectOptions = '';
                    siteOptions.forEach(option => {
                        selectOptions += `<option value="${option.value}">${option.text}</option>`;
                    });
                    
                    cell.innerHTML = `
                        <div class="d-flex flex-column gap-2" style="align-items: center; padding: 0.8rem;">
                            <!-- Selection Parameters Section -->
                            <div class="parameter-section selection-section">
                                <div class="section-header">
                                    <i class="fas fa-list-ul me-1"></i>
                                    <span class="section-title">Selections</span>
                                </div>
                                <div class="input-group-sm mb-2" style="width: 140px;">
                                    <small class="site-field-label">Site Location</small>
                                    <select class="form-select form-select-sm site-selector" data-country="${country}" data-site="${siteIndex}" style="width: 100%;">${selectOptions}</select>
                                </div>
                                <div class="input-group-sm" style="width: 140px;">
                                    <small class="site-field-label">Agent Profile</small>
                                    <select class="form-select form-select-sm agent-profile-input" style="width: 100%;" data-field="agent-profile">
                                        <option value="">Select Tier</option>
                                        <option value="tier1">Tier 1</option>
                                        <option value="tier2">Tier 2</option>
                                        <option value="tier3">Tier 3</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Capacity Planning Section -->
                            <div class="parameter-section capacity-section">
                                <div class="section-header">
                                    <i class="fas fa-calculator me-1"></i>
                                    <span class="section-title">Capacity Planning</span>
                                </div>
                                <div class="input-group-sm mb-1" style="width: 140px;">
                                    <small class="site-field-label">Lead Time (Days)</small>
                                    <input type="number" class="form-control form-control-sm lead-time-input" min="0" placeholder="0" style="width: 100%;" data-field="lead-time">
                                </div>
                                <div class="input-group-sm mb-1" style="width: 140px;">
                                    <small class="site-field-label">Weekly Capacity</small>
                                    <input type="number" class="form-control form-control-sm weekly-capacity-input" min="0" placeholder="0" style="width: 100%;" data-field="weekly-capacity">
                                </div>
                                <div class="input-group-sm" style="width: 140px;">
                                    <small class="site-field-label">Monthly Capacity</small>
                                    <input type="number" class="form-control form-control-sm monthly-capacity-input" min="0" placeholder="0" style="width: 100%;" data-field="monthly-capacity">
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    cell.textContent = '-';
                    cell.classList.add('text-muted');
                }
            } else {
                cell.style.display = 'none';
            }
            
            row.appendChild(cell);
        });
        
        sitesTableBody.appendChild(row);
    }
}

/**
 * Reset location form
 */
function resetLocationForm() {
    if (confirm('Are you sure you want to reset the location details? This will clear all location data.')) {
        // Reset geo country select
        const geoSelect = document.getElementById('geo-country-select');
        if (geoSelect) geoSelect.value = '4';
        
        // Reset requirement input
        const requirementInput = document.getElementById('requirement-value-input');
        if (requirementInput) requirementInput.value = 100;
        
        // Reset country headcount inputs
        const headcountInputs = document.querySelectorAll('.country-headcount');
        headcountInputs.forEach(input => input.value = 0);
        
        // Update displays
        updateCountryConfiguration();
        updateSummaryValues();
        updateSitesTable();
        
        // Show success message
        const formController = new RampFormController();
        formController.showNotification('Location details reset successfully!', 'success');
    }
}

/**
 * Calendar functionality
 */
class DateCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.currentField = null;
        this.modal = null;
        this.init();
    }

    init() {
        // Initialize Bootstrap modal
        const modalElement = document.getElementById('calendar-modal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
            this.bindEvents();
        }
    }

    bindEvents() {
        // Modal events
        const confirmBtn = document.getElementById('calendar-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmDate());
        }

        // Navigation events
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousMonth());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());
    }

    openModal(field, title) {
        this.currentField = field;
        const titleElement = document.getElementById('calendar-title');
        if (titleElement) titleElement.textContent = title;
        
        this.currentDate = new Date();
        this.selectedDate = null;
        this.renderCalendar();
        
        if (this.modal) this.modal.show();
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthYearElement = document.getElementById('current-month-year');
        if (monthYearElement) {
            monthYearElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        calendarDays.className = 'calendar-days';

        // Create grid layout
        for (let week = 0; week < 6; week++) {
            const weekRow = document.createElement('div');
            weekRow.className = 'row mb-1';
            
            for (let day = 0; day < 7; day++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(startDate.getDate() + (week * 7) + day);

                const dayCol = document.createElement('div');
                dayCol.className = 'col p-1';
                
                const dayElement = document.createElement('button');
                dayElement.type = 'button';
                dayElement.className = 'btn btn-sm w-100 calendar-day';
                dayElement.textContent = cellDate.getDate();

                if (cellDate.getMonth() !== this.currentDate.getMonth()) {
                    dayElement.classList.add('btn-outline-light', 'text-muted');
                } else {
                    dayElement.classList.add('btn-outline-primary');
                }

                dayElement.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day.btn-primary').forEach(el => {
                        el.classList.remove('btn-primary');
                        el.classList.add('btn-outline-primary');
                    });
                    dayElement.classList.remove('btn-outline-primary');
                    dayElement.classList.add('btn-primary');
                    this.selectedDate = new Date(cellDate);
                });

                dayCol.appendChild(dayElement);
                weekRow.appendChild(dayCol);
            }
            
            calendarDays.appendChild(weekRow);
            
            // Stop if we've shown all days of the current month
            const lastWeekDate = new Date(startDate);
            lastWeekDate.setDate(startDate.getDate() + (week * 7) + 6);
            if (lastWeekDate.getMonth() !== this.currentDate.getMonth() && week > 3) {
                break;
            }
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    confirmDate() {
        if (this.selectedDate && this.currentField) {
            const formattedDate = this.selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
            this.currentField.value = formattedDate;
            this.currentField.dispatchEvent(new Event('change'));
        }
        
        if (this.modal) this.modal.hide();
    }
}

// Initialize calendar
let calendar = null;
document.addEventListener('DOMContentLoaded', function() {
    calendar = new DateCalendar();
});