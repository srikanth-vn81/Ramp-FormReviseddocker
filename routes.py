import json
import os
from datetime import datetime, timedelta
from flask import render_template, request, flash, redirect, url_for, jsonify
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
        
        # Save sizing data
        save_submission(sizing_data)
        flash('Sizing form submitted successfully!', 'success')
        return redirect(url_for('sizing_form'))
    
    return render_template('sizing_form.html', form=form)
