// ULTRA-MINIMAL JavaScript for instant navigation
console.log('WFM Analytics - Minimal JS loaded');

// Only add absolutely essential functionality
if (document.getElementById('site_config_yes')) {
    // Only Sites Configuration logic when needed
    document.getElementById('site_config_yes').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('sites-configuration-section').style.display = 'block';
        }
    });
    
    document.getElementById('site_config_no').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('sites-configuration-section').style.display = 'none';
        }
    });
}