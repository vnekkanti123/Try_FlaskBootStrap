from flask import Flask, render_template, redirect, url_for, session, request
from flask_bootstrap import Bootstrap5
from wtforms import TelField, PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Length
from flask_wtf import FlaskForm
import requests
from backend import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with your actual secret key

# Initialize Bootstrap
bootstrap = Bootstrap5(app)

# Forms
class PhoneNumberForm(FlaskForm):
    phone_number = TelField('Phone Number', validators=[DataRequired(), Length(1, 20)])
    submit = SubmitField()

class PasswordForm(FlaskForm):
    username = StringField('Username', render_kw={'readonly': True})
    password = PasswordField('Password', validators=[DataRequired(), Length(8, 150)])
    submit = SubmitField()

# Flask routes
@app.route('/', methods=['GET', 'POST'])
def login():
    form = PhoneNumberForm()
    if form.validate_on_submit():
        phone_number = form.phone_number.data
        print(f"Phone Number: {phone_number}")
        status, data = get_username(phone_number)
        if status:
            session['username'] = data.get('userName')
            return redirect(url_for('password'))
    return render_template('login.html', form=form)

@app.route('/password', methods=['GET', 'POST'])
def password():
    username = session.get('username')
    if not username:
        return redirect(url_for('login'))
    
    form = PasswordForm()
    form.username.data = username
    if form.validate_on_submit():
        password = form.password.data
        login_data = {'username': username, 'password': password}
        status, login_response = do_user_login(login_data)
        if status:
            session['access_token'] = login_response.get('access_token')
            return redirect(url_for('home'))
    return render_template('password.html', form=form)

@app.route('/home', methods=['GET'])
def home():
    token = session.get('access_token')
    if not token:
        return redirect(url_for('login'))
    return render_template('home.html')

@app.route('/history', methods=['GET'])
def history():
    return render_template('history.html')

@app.route('/self_recharge', methods=['GET'])
def self_recharge():
    return render_template('self_recharge.html')

@app.route('/logout')
def logout():
    session.pop('access_token', None)
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/payout', methods=['GET', 'POST'])
def payout():
    token = session.get('access_token')
    if not token:
        return redirect(url_for('login'))
    file = {"username" : session.get('username')}
    info = get_wallet(file,session.get('access_token'))  
    wallet_balance = info[1]['payout_wallet']
    if request.method == 'POST':
        mobile_number = request.form.get('mobile_number')
        bank_account_number = request.form.get('bank_account_number')
        ifsc_code = request.form.get('ifsc_code')
        amount = request.form.get('amount')
        name = request.form.get('name')
    return render_template('payout.html', wallet_balance=wallet_balance)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
