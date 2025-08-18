import json
import os
from datetime import datetime
from flask import render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from app import app, db
from forms import RampInputForm, LoginForm, RegisterForm
from models import User, RampFormSubmission

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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('index'))
        flash('Invalid username or password', 'error')
    
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        # Check if user already exists
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            flash('Username already exists. Please choose a different username.', 'error')
            return render_template('register.html', form=form)
        
        existing_email = User.query.filter_by(email=form.email.data).first()
        if existing_email:
            flash('Email already registered. Please use a different email.', 'error')
            return render_template('register.html', form=form)
        
        # Create new user
        user = User(
            username=form.username.data,
            email=form.email.data
        )
        user.set_password(form.password.data)
        
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))


@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    form = RampInputForm()
    
    if form.validate_on_submit():
        # Create database submission
        submission = RampFormSubmission(
            user_id=current_user.id,
            ramp_start_availability=form.ramp_start_availability.data,
            ramp_start_date=form.ramp_start_date.data,
            ramp_end_availability=form.ramp_end_availability.data,
            ramp_end_date=form.ramp_end_date.data,
            client_trainer=int(form.client_trainer.data) if form.client_trainer.data else None,
            internal_trainer=int(form.internal_trainer.data) if form.internal_trainer.data else None,
            total_trainers=form.total_trainers.data,
            training_duration=form.training_duration.data,
            training_duration_number=form.training_duration_number.data,
            nesting_duration=form.nesting_duration.data,
            nesting_duration_number=form.nesting_duration_number.data,
            batch_size=form.batch_size.data,
            supervisor_ratio=form.supervisor_ratio.data,
            qa_ratio=form.qa_ratio.data,
            trainer_ratio=form.trainer_ratio.data,
            languages_supported=form.languages_supported.data,
            voice_inbound=form.voice_inbound.data,
            voice_outbound=form.voice_outbound.data,
            chat=form.chat.data,
            email=form.email.data
        )
        
        try:
            db.session.add(submission)
            db.session.commit()
            flash('Form submitted successfully!', 'success')
            return redirect(url_for('index'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error submitting form: {str(e)}', 'error')
    
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
