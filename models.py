from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class RampFormSubmission(db.Model):
    __tablename__ = 'ramp_form_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Training Details
    ramp_start_availability = db.Column(db.String(20))
    ramp_start_date = db.Column(db.Date)
    ramp_end_availability = db.Column(db.String(20))
    ramp_end_date = db.Column(db.Date)
    client_trainer = db.Column(db.Integer)
    internal_trainer = db.Column(db.Integer)
    total_trainers = db.Column(db.Integer)
    training_duration = db.Column(db.String(50))
    training_duration_number = db.Column(db.String(10))
    nesting_duration = db.Column(db.String(50))
    nesting_duration_number = db.Column(db.String(10))
    batch_size = db.Column(db.String(10))
    
    # Operational Assumptions
    supervisor_ratio = db.Column(db.String(20))
    qa_ratio = db.Column(db.String(20))
    trainer_ratio = db.Column(db.String(20))
    
    # Language & Channel Support
    languages_supported = db.Column(db.String(50))
    voice_inbound = db.Column(db.Boolean, default=False)
    voice_outbound = db.Column(db.Boolean, default=False)
    chat = db.Column(db.Boolean, default=False)
    email = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('form_submissions', lazy=True))
    
    def __repr__(self):
        return f'<RampFormSubmission {self.id} by {self.user.username}>'