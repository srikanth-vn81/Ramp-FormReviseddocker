// Dropdown positioning fix for sideways opening
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS override for dropdown positioning
    const style = document.createElement('style');
    style.textContent = `
        .form-select {
            position: relative;
        }
        
        .form-select option {
            background: white;
            color: black;
        }
        
        select.form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
        }
        
        /* Force select dropdown options to appear sideways */
        select.form-select {
            position: relative;
        }
        
        select.form-select:focus {
            position: relative;
            z-index: 1000;
        }
        
        /* Custom dropdown styling for sideways appearance */
        .dropdown-menu {
            position: absolute !important;
            top: 0 !important;
            left: 100% !important;
            right: auto !important;
            margin-left: 0.5rem !important;
            margin-top: 0 !important;
            transform: none !important;
            min-width: 200px;
            z-index: 1050 !important;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .dropdown-menu.show {
            top: 0 !important;
            left: 100% !important;
            right: auto !important;
            margin-left: 0.5rem !important;
            display: block !important;
        }
        
        /* Override native select dropdown positioning */
        select.form-select option {
            position: relative;
        }
        
        .dropdown-item {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }
        
        .dropdown-item:hover {
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced dropdown positioning
    function positionDropdown(dropdownElement) {
        const dropdownMenu = dropdownElement.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            const rect = dropdownElement.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            
            // Reset any previous positioning
            dropdownMenu.style.position = 'absolute';
            dropdownMenu.style.transform = 'none';
            dropdownMenu.style.marginTop = '0px';
            
            // Position to the right (sideways) if space allows
            if (rect.right + 220 < viewportWidth) {
                dropdownMenu.style.top = '0px';
                dropdownMenu.style.left = '100%';
                dropdownMenu.style.right = 'auto';
                dropdownMenu.style.marginLeft = '0.5rem';
            } else {
                // Position to the left if no space on right
                dropdownMenu.style.top = '0px';
                dropdownMenu.style.left = 'auto';
                dropdownMenu.style.right = '100%';
                dropdownMenu.style.marginRight = '0.5rem';
            }
        }
    }
    
    // Handle Bootstrap dropdown events
    document.addEventListener('show.bs.dropdown', function (e) {
        setTimeout(() => positionDropdown(e.target), 1);
    });
    
    document.addEventListener('shown.bs.dropdown', function (e) {
        positionDropdown(e.target);
    });
    
    // Enhanced select handling for sideways dropdowns
    document.querySelectorAll('select.form-select').forEach(select => {
        // Create custom dropdown wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);
        
        select.addEventListener('focus', function() {
            this.style.zIndex = '1000';
            this.style.position = 'relative';
            
            // Try to force sideways positioning
            const selectRect = this.getBoundingClientRect();
            const options = this.options;
            
            // Add styling to make dropdown appear to the side
            if (options.length > 0) {
                this.style.transform = 'none';
            }
        });
        
        select.addEventListener('blur', function() {
            this.style.zIndex = '1';
        });
        
        // Handle click to ensure sideways behavior
        select.addEventListener('click', function(e) {
            setTimeout(() => {
                this.style.position = 'relative';
                this.style.zIndex = '1000';
            }, 1);
        });
    });
});