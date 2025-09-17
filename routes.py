import json
import os
from datetime import datetime, timedelta, date
from flask import render_template, request, flash, redirect, url_for, jsonify, send_file, session
from werkzeug.utils import secure_filename
from app import app
from forms import RampInputForm

# Data storage file
DATA_FILE = 'form_submissions.json'

def load_submissions():
    """Load form submissions from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_submission(data):
    """Save form submission to JSON file"""
    submissions = load_submissions()
    data['timestamp'] = datetime.now().isoformat()
    submissions.append(data)
    with open(DATA_FILE, 'w') as f:
        json.dump(submissions, f, indent=2)

def generate_date_choices():
    """Generate date choices for the next 60 days"""
    choices = []
    choices.append(('', 'Select Date'))
    today = datetime.now().date()
    
    for i in range(60):  # Next 60 days
        current_date = today + timedelta(days=i)
        date_str = current_date.strftime('%Y-%m-%d')
        display_str = current_date.strftime('%m/%d/%Y')
        choices.append((date_str, display_str))
    
    return choices

# Multi-step form configuration
FORM_STEPS = {
    1: {'name': 'Ramp Details', 'template': 'step1_ramp_details.html'},
    2: {'name': 'Location Details', 'template': 'step5_location_planning.html'},
    3: {'name': 'Recruitment', 'template': 'step6_recruitment.html'},
    4: {'name': 'Program Details', 'template': 'step4_language_channel.html'},
    5: {'name': 'Training Support', 'template': 'step2_training_schedule.html'},
    6: {'name': 'Operational Assumptions', 'template': 'step3_operational_assumptions.html'},
    7: {'name': 'Submit', 'template': 'step7_submit.html'}
}

def get_form_fields_for_step(step):
    """Get the list of form fields for a specific step"""
    step_fields = {
        1: ['client_name', 'ramp_start_date', 'ramp_end_date', 'ramp_requirement', 'ramp_requirement_type'],
        2: ['requirement_type', 'requirement_value', 'geo_country', 'can_headcount', 'col_headcount',
            'hkg_headcount', 'ind_headcount', 'mex_headcount', 'pan_headcount', 'phl_headcount', 
            'pol_headcount', 'tto_headcount', 'usa_headcount'],
        3: ['recruitment_lead_time', 'hiring_capacity_weekly', 'hiring_capacity_monthly', 'recruitment_notes'],
        4: ['lob_count', 'lob_names', 'languages_supported', 'specify_languages', 'voice_inbound', 'voice_outbound', 
            'chat', 'email', 'back_office', 'social_sms', 'others', 'others_text'],
        5: ['ramp_start_availability', 'ramp_end_availability',
            'client_trainer', 'internal_trainer', 'total_trainers', 'training_duration',
            'training_duration_number', 'nesting_duration', 'nesting_duration_number', 'batch_size'],
        6: ['supervisor_ratio', 'qa_ratio', 'trainer_ratio'],
        7: []  # Submit step has no form fields, just review and submit
    }
    return step_fields.get(step, [])

def save_step_data(step, form):
    """Save current step data to session"""
    if 'form_data' not in session:
        session['form_data'] = {}
    
    step_fields = get_form_fields_for_step(step)
    for field_name in step_fields:
        if hasattr(form, field_name):
            field_data = getattr(form, field_name).data
            if field_data is not None:
                # Handle date fields
                if hasattr(getattr(form, field_name), 'data') and hasattr(field_data, 'isoformat'):
                    session['form_data'][field_name] = field_data.isoformat()
                else:
                    session['form_data'][field_name] = field_data

def load_step_data(step, form):
    """Load step data from session into form"""
    if 'form_data' not in session:
        return
    
    step_fields = get_form_fields_for_step(step)
    for field_name in step_fields:
        if field_name in session['form_data'] and hasattr(form, field_name):
            field_value = session['form_data'][field_name]
            if field_value is not None:
                # Skip loading geo_country if it contains all countries (old default behavior)
                if field_name == 'geo_country' and isinstance(field_value, list) and len(field_value) >= 10:
                    continue
                    
                field = getattr(form, field_name)
                
                # Handle date fields - parse ISO strings back to date objects
                if hasattr(field, 'data') and 'date' in field_name and isinstance(field_value, str):
                    try:
                        # Try to parse ISO date string
                        field.data = date.fromisoformat(field_value)
                    except (ValueError, TypeError):
                        # If parsing fails, assign the raw value
                        field.data = field_value
                else:
                    field.data = field_value

@app.route('/', methods=['GET'])
def index():
    """Redirect to step 1 of the form"""
    return redirect(url_for('ramp_form_step', step=1))

@app.route('/clear-session')
def clear_session():
    """Clear session data to start fresh"""
    session.pop('form_data', None)
    session.modified = True
    return redirect(url_for('ramp_form_step', step=1))

@app.route('/ramp-form/step/<int:step>', methods=['GET', 'POST'])
def ramp_form_step(step):
    """Handle individual form steps"""
    if step not in FORM_STEPS:
        flash('Invalid form step', 'error')
        return redirect(url_for('ramp_form_step', step=1))
    
    form = RampInputForm()
    
    if request.method == 'POST':
        action = request.form.get('action')
        
        if action == 'next':
            # Save current step data without validation
            save_step_data(step, form)
            session.modified = True
            
            if step < len(FORM_STEPS):
                return redirect(url_for('ramp_form_step', step=step + 1))
            else:
                return redirect(url_for('ramp_form_submit'))
        
        elif action == 'previous':
            # Save current step data (without validation)
            save_step_data(step, form)
            session.modified = True
            
            if step > 1:
                return redirect(url_for('ramp_form_step', step=step - 1))
    
    # Load existing data for this step
    load_step_data(step, form)
    
    # Prepare template context
    context = {
        'form': form,
        'current_step': step,
        'total_steps': len(FORM_STEPS),
        'step_name': FORM_STEPS[step]['name'],
        'is_first_step': step == 1,
        'is_last_step': step == len(FORM_STEPS)
    }
    
    # For step 2 (Location Planning), pass the selected countries to prevent auto-checking all
    if step == 2:
        context['preselected_countries'] = form.geo_country.data or []
    
    # For step 3 (Recruitment), pass country headcount data from step 2
    if step == 3:
        form_data = session.get('form_data', {})
        selected_countries = form_data.get('geo_country', [])
        
        # Country code to headcount field mapping
        country_field_mapping = {
            'CAN': 'can_headcount',
            'COL': 'col_headcount', 
            'HKG': 'hkg_headcount',
            'IND': 'ind_headcount',
            'MEX': 'mex_headcount',
            'PAN': 'pan_headcount',
            'PHL': 'phl_headcount',
            'POL': 'pol_headcount',
            'TTO': 'tto_headcount',
            'USA': 'usa_headcount'
        }
        
        # Build country headcount data for selected countries only
        country_headcounts = {}
        for country_code in selected_countries:
            if country_code in country_field_mapping:
                field_name = country_field_mapping[country_code]
                headcount_value = form_data.get(field_name, 0)
                # Convert to int, default to 0 if empty/None
                try:
                    country_headcounts[country_code] = int(headcount_value) if headcount_value else 0
                except (ValueError, TypeError):
                    country_headcounts[country_code] = 0
        
        context['country_headcounts'] = country_headcounts
    
    # For submit step, include form data for summary
    if step == 7:
        context['form_data'] = session.get('form_data', {})
    
    return render_template(FORM_STEPS[step]['template'], **context)

@app.route('/ramp-form/submit', methods=['GET', 'POST'])
def ramp_form_submit():
    """Handle final form submission"""
    if request.method == 'POST':
        if 'form_data' in session:
            # Add timestamp and save
            form_data = session['form_data'].copy()
            form_data['timestamp'] = datetime.now().isoformat()
            
            save_submission(form_data)
            
            # Clear session data
            session.pop('form_data', None)
            session.modified = True
            
            flash('Form submitted successfully!', 'success')
            return redirect(url_for('ramp_form_step', step=1))
        else:
            flash('No form data found', 'error')
            return redirect(url_for('ramp_form_step', step=1))
    
    # Show summary page
    form_data = session.get('form_data', {})
    return render_template('form_summary.html', form_data=form_data)

@app.route('/submissions')
def view_submissions():
    """View all form submissions (for admin purposes)"""
    submissions = load_submissions()
    return jsonify(submissions)

@app.route('/sizing-form', methods=['GET', 'POST'])
def sizing_form():
    """Sizing Form page"""
    from forms_sizing import SizingForm
    
    form = SizingForm()
    
    if form.validate_on_submit():
        # Process sizing form data
        sizing_data = {
            'timestamp': datetime.now().isoformat(),
            'inbound': {
                'annual_calls': form.inbound_annual_calls.data,
                'weekly_calls': form.inbound_weekly_calls.data,
                'aht': form.inbound_aht.data,
                'sl': form.inbound_sl.data,
                'asa': form.inbound_asa.data,
                'abandon': form.inbound_abandon.data,
                'ccr': form.inbound_ccr.data,
                'tat': form.inbound_tat.data,
                'cross_skill': form.inbound_cross_skill.data
            },
            'outbound': {
                'annual_calls': form.outbound_annual_calls.data,
                'weekly_calls': form.outbound_weekly_calls.data,
                'aht': form.outbound_aht.data,
                'sl': form.outbound_sl.data,
                'asa': form.outbound_asa.data,
                'abandon': form.outbound_abandon.data,
                'ccr': form.outbound_ccr.data,
                'tat': form.outbound_tat.data,
                'cross_skill': form.outbound_cross_skill.data
            },
            'backoffice': {
                'annual_calls': form.backoffice_annual_calls.data,
                'weekly_calls': form.backoffice_weekly_calls.data,
                'aht': form.backoffice_aht.data,
                'sl': form.backoffice_sl.data,
                'asa': form.backoffice_asa.data,
                'abandon': form.backoffice_abandon.data,
                'ccr': form.backoffice_ccr.data,
                'tat': form.backoffice_tat.data,
                'cross_skill': form.backoffice_cross_skill.data
            },
            'social': {
                'annual_calls': form.social_annual_calls.data,
                'weekly_calls': form.social_weekly_calls.data,
                'aht': form.social_aht.data,
                'sl': form.social_sl.data,
                'asa': form.social_asa.data,
                'abandon': form.social_abandon.data,
                'ccr': form.social_ccr.data,
                'tat': form.social_tat.data,
                'cross_skill': form.social_cross_skill.data
            },
            'chat': {
                'annual_calls': form.chat_annual_calls.data,
                'weekly_calls': form.chat_weekly_calls.data,
                'aht': form.chat_aht.data,
                'sl': form.chat_sl.data,
                'asa': form.chat_asa.data,
                'abandon': form.chat_abandon.data,
                'ccr': form.chat_ccr.data,
                'tat': form.chat_tat.data,
                'cross_skill': form.chat_cross_skill.data
            },
            'email': {
                'annual_calls': form.email_annual_calls.data,
                'weekly_calls': form.email_weekly_calls.data,
                'aht': form.email_aht.data,
                'sl': form.email_sl.data,
                'asa': form.email_asa.data,
                'abandon': form.email_abandon.data,
                'ccr': form.email_ccr.data,
                'tat': form.email_tat.data,
                'cross_skill': form.email_cross_skill.data
            }
        }
        
        # Handle file uploads
        attach_volume = request.files.get('attach_volume')
        attach_aht = request.files.get('attach_aht')
        
        if attach_volume and attach_volume.filename:
            # Create uploads directory if it doesn't exist
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            # Save volume file
            volume_filename = secure_filename(attach_volume.filename)
            attach_volume.save(os.path.join('uploads', volume_filename))
            sizing_data['attach_volume'] = volume_filename
            
        if attach_aht and attach_aht.filename:
            # Create uploads directory if it doesn't exist
            if not os.path.exists('uploads'):
                os.makedirs('uploads')
            # Save AHT file
            aht_filename = secure_filename(attach_aht.filename)
            attach_aht.save(os.path.join('uploads', aht_filename))
            sizing_data['attach_aht'] = aht_filename
        
        # Save sizing data
        save_submission(sizing_data)
        flash('Sizing form submitted successfully!', 'success')
        return redirect(url_for('sizing_form'))
    
    return render_template('sizing_form.html', form=form)

@app.route('/download-template/<template_type>')
def download_template(template_type):
    """Download Excel templates for Monthly, Weekly, or Intraday data"""
    import io
    import xlsxwriter
    
    # Create an in-memory Excel file
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    
    if template_type == 'monthly':
        worksheet = workbook.add_worksheet('Monthly Volume and AHT')
        
        # Add headers
        headers = ['Month', 'Inbound Calls', 'Outbound Calls', 'Back-Office Tasks', 
                  'Social Media', 'Chat', 'Email', 'Inbound AHT', 'Outbound AHT', 
                  'Back-Office AHT', 'Social Media AHT', 'Chat AHT', 'Email AHT']
        
        # Write headers
        for col, header in enumerate(headers):
            worksheet.write(0, col, header)
            
        # Add sample months
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        
        for row, month in enumerate(months, 1):
            worksheet.write(row, 0, month)
    
    elif template_type == 'weekly':
        worksheet = workbook.add_worksheet('Weekly Volume and AHT')
        
        # Add headers
        headers = ['Week', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 
                  'Saturday', 'Sunday', 'Total Volume', 'Average AHT']
        
        # Write headers
        for col, header in enumerate(headers):
            worksheet.write(0, col, header)
            
        # Add sample weeks
        for week in range(1, 53):
            worksheet.write(week, 0, f'Week {week}')
    
    elif template_type == 'intraday':
        worksheet = workbook.add_worksheet('Intraday Volume and AHT')
        
        # Add headers
        headers = ['Time Interval', 'Volume', 'AHT (minutes)', 'Service Level %', 
                  'Abandonment %', 'Calls Answered', 'Calls Offered']
        
        # Write headers
        for col, header in enumerate(headers):
            worksheet.write(0, col, header)
            
        # Add hourly intervals
        for hour in range(24):
            for interval in ['00', '30']:
                time_str = f'{hour:02d}:{interval}'
                row = hour * 2 + (1 if interval == '30' else 0) + 1
                worksheet.write(row, 0, time_str)
    
    workbook.close()
    output.seek(0)
    
    # Return the file
    filename = f'{template_type}_template.xlsx'
    return send_file(
        output,
        as_attachment=True,
        download_name=filename,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
