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
        
        /* Enhanced dropdown menu styling */
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
    
    // Handle select elements to create custom dropdown behavior
    document.querySelectorAll('select.form-select').forEach(select => {
        select.addEventListener('focus', function() {
            this.style.zIndex = '10';
        });
        
        select.addEventListener('blur', function() {
            this.style.zIndex = '1';
        });
    });
});