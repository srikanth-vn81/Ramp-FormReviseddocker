# Replit.md

## Overview

This is a Flask-based WFM (Workforce Management) Analytics web application that provides a comprehensive ramp input form for managing training and staffing details. The application focuses on collecting and storing workforce planning data including training schedules, trainer assignments, batch sizes, and operational metrics. It features a professional corporate interface with dynamic form interactions, date management capabilities, and local JSON-based data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### August 19, 2025
- Updated Geo(Country) from single dropdown to multiselect checkboxes for individual country selection
- Enhanced Sites Configuration with comprehensive fields for each site:
  - Site selector dropdown (Select Site, Site A, Site B, etc.)
  - Agent Profile number input (removed dropdown)
  - Lead Time to Hire (Days) number input
  - Weekly Hiring Capacity number input  
  - Monthly Hiring Capacity number input
- All countries selected by default for immediate table generation
- Removed placeholder text in favor of proper number input fields with "0" placeholder
- **MAJOR LAYOUT CHANGE**: Moved Sites Configuration to separate full-width section below main form for better space utilization and readability
- Adjusted main layout: Left section (col-lg-8) for training details, center section (col-lg-4) for location details
- Applied professional corporate styling with gradient headers, hover effects, and improved typography

## System Architecture

### Frontend Architecture
- **Framework**: Bootstrap 5 with custom CSS for professional corporate styling
- **JavaScript**: Vanilla ES6 with class-based architecture for form management
- **UI Components**: Dynamic form fields with conditional visibility, custom date picker functionality, and progress tracking
- **Styling**: CSS custom properties for consistent theming, responsive design with mobile-first approach
- **Form Validation**: Client-side validation with Flask-WTF integration for server-side validation

### Backend Architecture
- **Framework**: Flask (Python) with modular route organization
- **Form Handling**: Flask-WTF with WTForms for robust form validation and CSRF protection
- **Session Management**: Flask sessions with configurable secret keys
- **Logging**: Built-in Python logging configured for debugging
- **Application Structure**: Modular design with separate files for routes, forms, and application initialization

### Data Storage
- **Primary Storage**: Local JSON file-based persistence for form submissions
- **Data Format**: Structured JSON with timestamps for audit trails
- **File Management**: Direct file I/O operations with error handling for data persistence
- **Data Structure**: Hierarchical storage supporting complex form data including dates, selections, and nested objects

### Form Architecture
- **Dynamic Fields**: Conditional field visibility based on user selections
- **Custom Components**: Multi-checkbox fields and specialized date handling
- **Validation Strategy**: Multi-layer validation with both client and server-side checks
- **Field Types**: Support for dates, selections, integers, text areas, and boolean values
- **User Experience**: Progressive disclosure of form sections based on user input

## External Dependencies

### Frontend Dependencies
- **Bootstrap 5.3.0**: Primary UI framework for responsive design and components
- **Font Awesome 6.4.0**: Icon library for enhanced user interface elements
- **CDN Delivery**: External CDN hosting for frontend libraries to improve load times

### Backend Dependencies
- **Flask**: Core web framework for Python
- **Flask-WTF**: Form handling and CSRF protection
- **WTForms**: Form validation and rendering library
- **Python Standard Library**: JSON, OS, datetime, and logging modules

### Development Environment
- **Python Runtime**: Flask development server with debug mode
- **Static Assets**: Local CSS and JavaScript files for custom functionality
- **Template Engine**: Jinja2 (Flask default) for HTML template rendering
- **File Structure**: Organized static assets with CSS and JS separation