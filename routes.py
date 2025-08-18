import json
import os
from datetime import datetime
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
