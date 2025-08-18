// Dropdown positioning fix for sideways opening
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS override for dropdown positioning
    const style = document.createElement('style');
    style.textContent = `
        .dropdown-menu {
            position: absolute !important;
            top: 0 !important;
            left: 100% !important;
            right: auto !important;
            margin-left: 0.5rem !important;
            margin-top: 0 !important;
            transform: none !important;
            min-width: 200px;
        }
        
        .dropdown-menu.show {
            top: 0 !important;
            left: 100% !important;
            right: auto !important;
            margin-left: 0.5rem !important;
        }
    `;
    document.head.appendChild(style);
    
    // Force dropdown positioning on show
    document.addEventListener('show.bs.dropdown', function (e) {
        const dropdownMenu = e.target.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            setTimeout(() => {
                dropdownMenu.style.position = 'absolute';
                dropdownMenu.style.top = '0px';
                dropdownMenu.style.left = '100%';
                dropdownMenu.style.right = 'auto';
                dropdownMenu.style.marginLeft = '0.5rem';
                dropdownMenu.style.marginTop = '0px';
                dropdownMenu.style.transform = 'none';
            }, 1);
        }
    });
});