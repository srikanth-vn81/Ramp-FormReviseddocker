from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, SelectMultipleField, RadioField, IntegerField, DateField, BooleanField, TextAreaField, HiddenField
from wtforms.validators import DataRequired, NumberRange, Optional
from wtforms.widgets import CheckboxInput, ListWidget

class MultiCheckboxField(SelectMultipleField):
    """Custom field for multiple checkboxes"""
    widget = ListWidget(prefix_label=False)
    option_widget = CheckboxInput()

class RampInputForm(FlaskForm):
    # Ramp Details (Step 1)
    client_name = StringField('Client Name', validators=[Optional()])
    ramp_start_date = DateField('Ramp Start Date', validators=[Optional()])
    ramp_end_date = DateField('Ramp End Date', validators=[Optional()])
    ramp_requirement = IntegerField('Ramp Requirement', validators=[Optional(), NumberRange(min=1)])
    ramp_requirement_type = SelectField(
        'Requirement Type',
        choices=[('', 'Select Type'), ('FTE', 'FTE'), ('HC', 'HC')],
        validators=[Optional()]
    )
    
    # Ramp date availability fields (for Step 1)
    ramp_start_availability = SelectField(
        'Ramp Start Date Availability',
        choices=[('', 'Select'), ('available', 'Available'), ('not-available', 'Not Available')],
        validators=[Optional()]
    )
    ramp_end_availability = SelectField(
        'Ramp End Date Availability',
        choices=[('', 'Select'), ('available', 'Available'), ('not-available', 'Not Available')],
        validators=[Optional()]
    )
    
    # Training Support fields (moved to Step 2)
    training_support_type = RadioField(
        'Training Support Type',
        choices=[('client', 'Client'), ('internal', 'Internal'), ('both', 'Both')],
        validators=[Optional()]
    )
    
    # Internal Trainer Availability (conditional field for Internal selection)
    internal_trainer_available = RadioField(
        'Internal Trainer Available?',
        choices=[('yes', 'Yes'), ('no', 'No')],
        validators=[Optional()]
    )
    
    # Trainers
    client_trainer = SelectField(
        'Client Trainer',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[Optional()]
    )
    internal_trainer = SelectField(
        'Internal Trainer',
        choices=[('', 'Select')] + [(str(i), str(i)) for i in range(1, 11)],
        validators=[Optional()]
    )
    total_trainers = IntegerField(
        'Total Trainers',
        validators=[Optional()]
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
    
    # LOB Details
    lob_count = IntegerField('LOB Count', validators=[Optional(), NumberRange(min=1)])
    lob_names = SelectField(
        'LOB Names', 
        choices=[('', 'Select LOB'), ('Customer Service', 'Customer Service'), ('Technical Support', 'Technical Support'), 
                 ('Sales', 'Sales'), ('Billing', 'Billing'), ('Collections', 'Collections'),
                 ('Back Office Operations', 'Back Office Operations'), ('Quality Assurance', 'Quality Assurance'),
                 ('Retention', 'Retention'), ('Fraud Prevention', 'Fraud Prevention'), ('Others', 'Others')],
        validators=[Optional()]
    )
    
    # Language support
    languages_supported = SelectField(
        'Languages Supported',
        choices=[('', 'Select'), ('english_only', 'English Only'), ('bilingual', 'Bilingual'), ('multilingual', 'Multilingual')]
    )
    specify_languages = StringField('Specify the Languages', validators=[Optional()])
    
    # Channel support
    voice_inbound = BooleanField('Voice - Inbound')
    voice_outbound = BooleanField('Voice - Outbound')
    chat = BooleanField('Chat')
    email = BooleanField('Email')
    social_sms = BooleanField('Social Media/SMS')
    back_office = BooleanField('Back Office')
    others = BooleanField('Others')
    others_text = StringField('Others Text', validators=[Optional()])
    
    # Dynamic LOB Language & Channel Support Data (JSON)
    lob_language_channel_data = HiddenField('LOB Language Channel Data', validators=[Optional()])
    
    # Location Details
    requirement_type = SelectField(
        'Requirement Type',
        choices=[('headcount', 'Headcount'), ('fte', 'FTE')],
        default='headcount'
    )
    requirement_value = IntegerField(
        'Requirement Value',
        validators=[Optional()],
        default=100
    )
    geo_country = MultiCheckboxField(
        'Geo (Country)',
        choices=[
            ('CAN', 'Canada'),
            ('COL', 'Colombia'),
            ('HKG', 'Hong Kong'),
            ('IND', 'India'),
            ('MEX', 'Mexico'),
            ('PAN', 'Panama'),
            ('PHL', 'Philippines'),
            ('POL', 'Poland'),
            ('TTO', 'Trinidad and Tobago'),
            ('USA', 'USA')
        ],
        coerce=str
    )
    
    # Country headcount distribution
    can_headcount = IntegerField('Canada Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    col_headcount = IntegerField('Colombia Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    hkg_headcount = IntegerField('Hong Kong Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    ind_headcount = IntegerField('India Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    mex_headcount = IntegerField('Mexico Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    pan_headcount = IntegerField('Panama Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    phl_headcount = IntegerField('Philippines Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    pol_headcount = IntegerField('Poland Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    tto_headcount = IntegerField('Trinidad and Tobago Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    usa_headcount = IntegerField('USA Headcount', validators=[Optional(), NumberRange(min=0)], default=0)
    
    # Recruitment Details (Step 6)
    recruitment_lead_time = IntegerField('Lead Time to Hire (Days)', validators=[Optional(), NumberRange(min=1)], default=30)
    hiring_capacity_weekly = IntegerField('Weekly Hiring Capacity', validators=[Optional(), NumberRange(min=1)], default=10)
    hiring_capacity_monthly = IntegerField('Monthly Hiring Capacity', validators=[Optional(), NumberRange(min=1)], default=40)
    recruitment_notes = TextAreaField('Additional Recruitment Notes', validators=[Optional()])
