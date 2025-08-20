from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, BooleanField
from wtforms.validators import Optional, NumberRange

class SizingForm(FlaskForm):
    # Inbound channel fields
    inbound_annual_calls = IntegerField('Inbound Annual Calls', validators=[Optional(), NumberRange(min=0)])
    inbound_weekly_calls = IntegerField('Inbound Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    inbound_aht = StringField('Inbound AHT', validators=[Optional()])
    inbound_sl = FloatField('Inbound SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    inbound_asa = StringField('Inbound ASA', validators=[Optional()])
    inbound_abandon = FloatField('Inbound Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    inbound_ccr = FloatField('Inbound CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    inbound_tat = StringField('Inbound TAT', validators=[Optional()])
    inbound_cross_skill = BooleanField('Inbound Cross Skill')
    
    # Outbound channel fields
    outbound_annual_calls = IntegerField('Outbound Annual Calls', validators=[Optional(), NumberRange(min=0)])
    outbound_weekly_calls = IntegerField('Outbound Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    outbound_aht = StringField('Outbound AHT', validators=[Optional()])
    outbound_sl = FloatField('Outbound SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    outbound_asa = StringField('Outbound ASA', validators=[Optional()])
    outbound_abandon = FloatField('Outbound Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    outbound_ccr = FloatField('Outbound CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    outbound_tat = StringField('Outbound TAT', validators=[Optional()])
    outbound_cross_skill = BooleanField('Outbound Cross Skill')
    
    # Back-Office channel fields
    backoffice_annual_calls = IntegerField('Back-Office Annual Calls', validators=[Optional(), NumberRange(min=0)])
    backoffice_weekly_calls = IntegerField('Back-Office Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    backoffice_aht = StringField('Back-Office AHT', validators=[Optional()])
    backoffice_sl = FloatField('Back-Office SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    backoffice_asa = StringField('Back-Office ASA', validators=[Optional()])
    backoffice_abandon = FloatField('Back-Office Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    backoffice_ccr = FloatField('Back-Office CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    backoffice_tat = StringField('Back-Office TAT', validators=[Optional()])
    backoffice_cross_skill = BooleanField('Back-Office Cross Skill')
    
    # Social Media channel fields
    social_annual_calls = IntegerField('Social Media Annual Calls', validators=[Optional(), NumberRange(min=0)])
    social_weekly_calls = IntegerField('Social Media Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    social_aht = StringField('Social Media AHT', validators=[Optional()])
    social_sl = FloatField('Social Media SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    social_asa = StringField('Social Media ASA', validators=[Optional()])
    social_abandon = FloatField('Social Media Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    social_ccr = FloatField('Social Media CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    social_tat = StringField('Social Media TAT', validators=[Optional()])
    social_cross_skill = BooleanField('Social Media Cross Skill')
    
    # Chat channel fields
    chat_annual_calls = IntegerField('Chat Annual Calls', validators=[Optional(), NumberRange(min=0)])
    chat_weekly_calls = IntegerField('Chat Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    chat_aht = StringField('Chat AHT', validators=[Optional()])
    chat_sl = FloatField('Chat SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    chat_asa = StringField('Chat ASA', validators=[Optional()])
    chat_abandon = FloatField('Chat Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    chat_ccr = FloatField('Chat CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    chat_tat = StringField('Chat TAT', validators=[Optional()])
    chat_cross_skill = BooleanField('Chat Cross Skill')
    
    # Email channel fields
    email_annual_calls = IntegerField('Email Annual Calls', validators=[Optional(), NumberRange(min=0)])
    email_weekly_calls = IntegerField('Email Weekly Calls', validators=[Optional(), NumberRange(min=0)])
    email_aht = StringField('Email AHT', validators=[Optional()])
    email_sl = FloatField('Email SL %', validators=[Optional(), NumberRange(min=0, max=100)])
    email_asa = StringField('Email ASA', validators=[Optional()])
    email_abandon = FloatField('Email Abandon %', validators=[Optional(), NumberRange(min=0, max=100)])
    email_ccr = FloatField('Email CCR', validators=[Optional(), NumberRange(min=0, max=100)])
    email_tat = StringField('Email TAT', validators=[Optional()])
    email_cross_skill = BooleanField('Email Cross Skill')