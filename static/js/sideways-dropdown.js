// Sideways dropdown implementation for select elements
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for sideways dropdowns
    const style = document.createElement('style');
    style.textContent = `
        .sideways-dropdown {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        
        .sideways-dropdown-trigger {
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
            position: relative;
        }
        
        .sideways-dropdown-trigger:hover {
            border-color: #2563eb;
        }
        
        .sideways-dropdown-trigger:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.1);
        }
        
        .sideways-dropdown-arrow {
            transition: transform 0.2s;
            font-size: 0.7rem;
            color: #6b7280;
        }
        
        .sideways-dropdown.open .sideways-dropdown-arrow {
            transform: rotate(180deg);
        }
        
        .sideways-dropdown-menu {
            position: absolute;
            top: 0;
            left: 100%;
            margin-left: 0.5rem;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            max-height: 250px;
            overflow-y: auto;
            z-index: 9999;
            display: none;
            animation: slideIn 0.15s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .sideways-dropdown.open .sideways-dropdown-menu {
            display: block;
        }
        
        .sideways-dropdown-item {
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            font-size: 0.85rem;
            transition: background-color 0.1s;
        }
        
        .sideways-dropdown-item:last-child {
            border-bottom: none;
        }
        
        .sideways-dropdown-item:hover {
            background-color: #f8f9fa;
        }
        
        .sideways-dropdown-item.selected {
            background-color: #2563eb;
            color: white;
        }
        
        /* Hide original select */
        select.sideways-hidden {
            display: none;
        }
        
        /* Responsive positioning */
        @media (max-width: 768px) {
            .sideways-dropdown-menu {
                left: auto;
                right: 0;
                margin-left: 0;
                margin-right: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Convert all form-select elements to sideways dropdowns
    const selects = document.querySelectorAll('select.form-select');
    
    selects.forEach(select => {
        // Wait a bit for dynamic content to load
        setTimeout(() => {
            convertToSidewaysDropdown(select);
        }, 100);
    });
    
    // Also watch for dynamically added selects (like date fields that appear)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check for added nodes
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const newSelects = node.querySelectorAll ? node.querySelectorAll('select.form-select') : [];
                    newSelects.forEach(select => {
                        if (!select.classList.contains('sideways-hidden')) {
                            setTimeout(() => convertToSidewaysDropdown(select), 50);
                        }
                    });
                }
            });
            
            // Check for attribute changes (like style changes that make elements visible)
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.style.display !== 'none' && target.classList.contains('date-input-container')) {
                    // Check for selects in the newly visible container
                    const selects = target.querySelectorAll('select.form-select');
                    selects.forEach(select => {
                        if (!select.classList.contains('sideways-hidden')) {
                            setTimeout(() => convertToSidewaysDropdown(select), 100);
                        }
                    });
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });
    
    function convertToSidewaysDropdown(select) {
        // Skip if already converted
        if (select.classList.contains('sideways-hidden')) return;
        
        // Create sideways dropdown structure
        const wrapper = document.createElement('div');
        wrapper.className = 'sideways-dropdown';
        
        const trigger = document.createElement('div');
        trigger.className = 'sideways-dropdown-trigger';
        trigger.setAttribute('tabindex', '0');
        
        const triggerText = document.createElement('span');
        triggerText.textContent = select.options[select.selectedIndex]?.text || 'Select';
        
        const arrow = document.createElement('span');
        arrow.className = 'sideways-dropdown-arrow';
        arrow.innerHTML = '▼';
        
        trigger.appendChild(triggerText);
        trigger.appendChild(arrow);
        
        const menu = document.createElement('div');
        menu.className = 'sideways-dropdown-menu';
        
        // Create menu items from select options
        Array.from(select.options).forEach(option => {
            const item = document.createElement('div');
            item.className = 'sideways-dropdown-item';
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
                menu.querySelectorAll('.sideways-dropdown-item').forEach(i => i.classList.remove('selected'));
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
        select.classList.add('sideways-hidden');
        
        // Handle trigger click and keyboard events
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown();
        });
        
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            }
        });
        
        function toggleDropdown() {
            // Close other dropdowns
            document.querySelectorAll('.sideways-dropdown.open').forEach(dropdown => {
                if (dropdown !== wrapper) {
                    dropdown.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            wrapper.classList.toggle('open');
            
            // Smart positioning - always try to position to the right first
            if (wrapper.classList.contains('open')) {
                setTimeout(() => {
                    const rect = wrapper.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    
                    // Always try right side first (sideways positioning)
                    menu.style.left = '100%';
                    menu.style.right = 'auto';
                    menu.style.marginLeft = '0.5rem';
                    menu.style.marginRight = '0';
                    menu.style.top = '0';
                    
                    // Only if absolutely no space, fall back to left
                    if (rect.right + 220 > viewportWidth) {
                        menu.style.left = 'auto';
                        menu.style.right = '100%';
                        menu.style.marginLeft = '0';
                        menu.style.marginRight = '0.5rem';
                    }
                }, 1);
            }
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            wrapper.classList.remove('open');
        });
    }
});