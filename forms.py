from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, IntegerField, DateField, BooleanField, TextAreaField, PasswordField
from wtforms.validators import DataRequired, NumberRange, Optional, Email, ValidationError
from wtforms.widgets import CheckboxInput, ListWidget
import re

class MultiCheckboxField(SelectField):
    """Custom field for multiple checkboxes"""
    widget = ListWidget(prefix_label=False)
    option_widget = CheckboxInput()

class RampInputForm(FlaskForm):
    # Ramp dates
    ramp_start_availability = SelectField(
        'Ramp Start Date Availability',
        choices=[('', 'Select'), ('available', 'Available'), ('not-available', 'Not Available')],
        validators=[DataRequired()]
    )
    ramp_start_date = DateField('Ramp Start Date', validators=[Optional()])
    
    ramp_end_availability = SelectField(
        'Ramp End Date Availability',
        choices=[('', 'Select'), ('available', 'Available'), ('not-available', 'Not Available')],
        validators=[DataRequired()]
    )
    ramp_end_date = DateField('Ramp End Date', validators=[Optional()])
    
    # Trainers
    client_trainer = SelectField(
        'Client Trainer',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[DataRequired()]
    )
    internal_trainer = SelectField(
        'Internal Trainer',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[DataRequired()]
    )
    total_trainers = IntegerField(
        'Total Trainers',
        validators=[DataRequired(), NumberRange(min=1, max=100)]
    )
    
    # Training details (conditional fields)
    training_duration = SelectField(
        'Training Duration Type',
        choices=[('', 'Select'), ('days', 'Days'), ('weeks', 'Weeks')],
        validators=[Optional()]
    )
    training_duration_number = SelectField(
        'Training Duration Number',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[Optional()]
    )
    
    nesting_duration = SelectField(
        'Nesting Duration Type',
        choices=[('', 'Select'), ('days', 'Days'), ('weeks', 'Weeks')],
        validators=[Optional()]
    )
    nesting_duration_number = SelectField(
        'Nesting Duration Number',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[Optional()]
    )
    
    batch_size = SelectField(
        'Batch Size',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(5, 55, 5)],
        validators=[Optional()]
    )
    
    # Operational assumptions
    supervisor_ratio = StringField('Supervisor Ratio', default='1:1')
    qa_ratio = StringField('QA Ratio', default='1:1')
    trainer_ratio = StringField('Trainer Ratio', default='1:1')
    
    # Language support
    languages_supported = SelectField(
        'Languages Supported',
        choices=[('', 'Select'), ('single', 'Single'), ('bilingual', 'Bilingual')]
    )
    
    # Channel support
    voice_inbound = BooleanField('Voice - Inbound')
    voice_outbound = BooleanField('Voice - Outbound')
    chat = BooleanField('Chat')
    email = BooleanField('Email')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    
    def validate_username(self, username):
        if not username.data.endswith('@iqor.com'):
            raise ValidationError('Username must end with @iqor.com')


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    
    def validate_username(self, username):
        if not username.data.endswith('@iqor.com'):
            raise ValidationError('Username must end with @iqor.com')
    
    def validate_email(self, email):
        if not email.data.endswith('@iqor.com'):
            raise ValidationError('Email must be from @iqor.com domain')

    # Additional channel fields
    social_sms = BooleanField('Social Media/SMS')
    back_office = BooleanField('Back Office')
    others = BooleanField('Others')
    
    # Location Details
    requirement_type = SelectField(
        'Requirement Type',
        choices=[('headcount', 'Headcount'), ('fte', 'FTE')],
        default='headcount'
    )
    requirement_value = IntegerField(
        'Requirement Value',
        validators=[DataRequired(), NumberRange(min=1)],
        default=100
    )
    geo_country = SelectField(
        'Geo (Country)',
        choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4')],
        default='4'
    )
    
    # Country headcount distribution
    phl_headcount = IntegerField('Philippines Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    usa_headcount = IntegerField('USA Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    ind_headcount = IntegerField('India Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    col_headcount = IntegerField('Colombia Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
