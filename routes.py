import json
import os
from datetime import datetime, timedelta
from flask import render_template, request, flash, redirect, url_for, jsonify, send_file
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
    choices = [('', 'Select Date')]
    today = datetime.now().date()
    
    for i in range(60):  # Next 60 days
        date = today + timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')
        display_str = date.strftime('%m/%d/%Y')
        choices.append((date_str, display_str))
    
    return choices

@app.route('/', methods=['GET', 'POST'])
def index():
    form = RampInputForm()
    
    if form.validate_on_submit():
        # Process form data
        form_data = {
            'ramp_start_availability': form.ramp_start_availability.data,
            'ramp_start_date': form.ramp_start_date.data.isoformat() if form.ramp_start_date.data else None,
            'ramp_end_availability': form.ramp_end_availability.data,
            'ramp_end_date': form.ramp_end_date.data.isoformat() if form.ramp_end_date.data else None,
            'client_trainer': form.client_trainer.data,
            'internal_trainer': form.internal_trainer.data,
            'total_trainers': form.total_trainers.data,
            'training_duration': form.training_duration.data,
            'training_duration_number': form.training_duration_number.data,
            'nesting_duration': form.nesting_duration.data,
            'nesting_duration_number': form.nesting_duration_number.data,
            'batch_size': form.batch_size.data,
            'supervisor_ratio': form.supervisor_ratio.data,
            'qa_ratio': form.qa_ratio.data,
            'trainer_ratio': form.trainer_ratio.data,
            'languages_supported': form.languages_supported.data,
            'channels': {
                'voice_inbound': form.voice_inbound.data,
                'voice_outbound': form.voice_outbound.data,
                'chat': form.chat.data,
                'email': form.email.data,
                'back_office': form.back_office.data,
            }
        }
        
        # Save submission
        save_submission(form_data)
        flash('Form submitted successfully!', 'success')
        return redirect(url_for('index'))
    
    # Handle form errors
    if form.errors:
        for field, errors in form.errors.items():
            for error in errors:
                flash(f'{field}: {error}', 'error')
    
    return render_template('index.html', form=form)

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
