/**
 * Smart Step-Specific JavaScript Loader
 * Only loads functionality needed for the current step
 */

// Get current step from body class or URL
const currentStep = document.body.className.match(/step-(\d+)/)?.[1] || '1';

console.log(`Loading JS for step ${currentStep}`);

// Step-specific functionality loaders
const stepLoaders = {
    '1': () => {
        // Ramp Details - minimal functionality
        const form = document.querySelector('form');
        if (!form) return;
        
        // Only setup date availability for this step
        const startAvailability = document.getElementById('ramp_start_availability');
        const startDateContainer = document.getElementById('ramp-start-date-container');
        
        if (startAvailability && startDateContainer) {
            startAvailability.addEventListener('change', (e) => {
                startDateContainer.style.display = e.target.value === 'available' ? 'block' : 'none';
            });
        }
    },
    
    '2': () => {
        // Training Details - only training specific code
        console.log('Training step loaded');
    },
    
    '3': () => {
        // Operational Assumptions - only operational code
        console.log('Operational step loaded');
    },
    
    '4': () => {
        // Language & Channel Support - only language code
        console.log('Language step loaded');
    },
    
    '5': () => {
        // Location Planning - only location code
        console.log('Location step loaded');
    },
    
    '6': () => {
        // Recruitment - Sites configuration
        const sitesCount = document.getElementById('sites_count');
        const sitesContainer = document.getElementById('sites-container');
        
        if (sitesCount && sitesContainer) {
            const updateSites = () => {
                const count = parseInt(sitesCount.value) || 0;
                sitesContainer.innerHTML = '';
                
                for (let i = 1; i <= count; i++) {
                    const siteDiv = document.createElement('div');
                    siteDiv.innerHTML = `<label>Site ${i} Location</label><select name="site_location_site${i}" class="form-select"><option value="">Select location...</option></select>`;
                    sitesContainer.appendChild(siteDiv);
                }
            };
            
            sitesCount.addEventListener('change', updateSites);
            updateSites(); // Initial load
        }
    },
    
    '7': () => {
        // Sizing Requisition - only sizing code
        console.log('Sizing step loaded');
    }
};

// Load only the current step's functionality
if (stepLoaders[currentStep]) {
    stepLoaders[currentStep]();
}

// Minimal universal functionality for all steps
document.addEventListener('DOMContentLoaded', () => {
    console.log(`Step ${currentStep} JS loaded - FAST MODE`);
});