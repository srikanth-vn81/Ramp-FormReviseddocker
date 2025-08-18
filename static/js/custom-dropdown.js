// Custom dropdown implementation for sideways opening
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for custom dropdowns
    const style = document.createElement('style');
    style.textContent = `
        .custom-dropdown {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        
        .custom-dropdown-trigger {
            width: 100%;
            padding: 0.4rem 0.6rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
        }
        
        .custom-dropdown-trigger:hover {
            border-color: #2563eb;
        }
        
        .custom-dropdown-arrow {
            transition: transform 0.2s;
            font-size: 0.7rem;
        }
        
        .custom-dropdown.open .custom-dropdown-arrow {
            transform: rotate(180deg);
        }
        
        .custom-dropdown-menu {
            position: absolute;
            top: 0;
            left: 100%;
            margin-left: 0.5rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            min-width: 220px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 9999;
            display: none;
            animation: slideInRight 0.2s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .custom-dropdown.open .custom-dropdown-menu {
            display: block;
        }
        
        .custom-dropdown-item {
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.85rem;
        }
        
        .custom-dropdown-item:last-child {
            border-bottom: none;
        }
        
        .custom-dropdown-item:hover {
            background-color: #f8f9fa;
        }
        
        .custom-dropdown-item.selected {
            background-color: #2563eb;
            color: white;
        }
        
        /* Hide original select */
        select.form-select.custom-hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Convert specific select elements to custom dropdowns
    const selectsToConvert = [
        'ramp_start_availability',
        'ramp_end_availability', 
        'client_trainer',
        'internal_trainer',
        'training_duration',
        'nesting_duration',
        'requirement_type',
        'geo_country'
    ];
    
    selectsToConvert.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select && select.tagName === 'SELECT') {
            convertToCustomDropdown(select);
        }
    });
    
    function convertToCustomDropdown(select) {
        // Create custom dropdown structure
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-dropdown';
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-dropdown-trigger';
        
        const triggerText = document.createElement('span');
        triggerText.textContent = select.options[select.selectedIndex]?.text || 'Select';
        
        const arrow = document.createElement('span');
        arrow.className = 'custom-dropdown-arrow';
        arrow.innerHTML = '▼';
        
        trigger.appendChild(triggerText);
        trigger.appendChild(arrow);
        
        const menu = document.createElement('div');
        menu.className = 'custom-dropdown-menu';
        
        // Create menu items
        Array.from(select.options).forEach(option => {
            const item = document.createElement('div');
            item.className = 'custom-dropdown-item';
            item.textContent = option.text;
            item.dataset.value = option.value;
            
            if (option.selected) {
                item.classList.add('selected');
            }
            
            item.addEventListener('click', function() {
                // Update selection
                select.value = this.dataset.value;
                triggerText.textContent = this.textContent;
                
                // Update selected state
                menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('selected'));
                this.classList.add('selected');
                
                // Close dropdown
                wrapper.classList.remove('open');
                
                // Trigger change event on original select
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
            
            menu.appendChild(item);
        });
        
        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        
        // Replace original select
        select.parentNode.insertBefore(wrapper, select);
        select.classList.add('custom-hidden');
        
        // Handle trigger click
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
                if (dropdown !== wrapper) {
                    dropdown.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            wrapper.classList.toggle('open');
            
            // Ensure proper positioning after opening
            if (wrapper.classList.contains('open')) {
                setTimeout(() => {
                    const rect = wrapper.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    
                    // Check if there's space on the right
                    if (rect.right + 220 > viewportWidth) {
                        // Position to the left instead
                        menu.style.left = 'auto';
                        menu.style.right = '100%';
                        menu.style.marginLeft = '0';
                        menu.style.marginRight = '0.5rem';
                    } else {
                        // Default right positioning
                        menu.style.left = '100%';
                        menu.style.right = 'auto';
                        menu.style.marginLeft = '0.5rem';
                        menu.style.marginRight = '0';
                    }
                }, 1);
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            wrapper.classList.remove('open');
        });
    }
});