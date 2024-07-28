from flask import Flask, render_template, redirect, url_for, session
from flask_bootstrap import Bootstrap5
from wtforms import TelField, PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Length
from flask_wtf import FlaskForm
import requests

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

# Backend functions
def get_username(phone_number):
    url = f"{base_url}getUserCredintials"
    headers = {'Content-Type': 'application/json'}
    payload = {"mobileNumber": phone_number}
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
        print("Unauthorized access")  
        return 0, {"error": "Unauthorized access"}
    else:
        print(f"Error: {response.status_code}")  
        response.raise_for_status()

def do_user_login(data):
    url = f"{base_url}userLogin"
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return 1, response.json()
    elif response.status_code == 401:
       pass
    else:
        response.raise_for_status()

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
            return redirect(url_for('success'))
    return render_template('password.html', form=form)

@app.route('/success', methods=['GET'])
def success():
    token = session.get('access_token')
    if not token:
        return redirect(url_for('login'))
    return render_template('home.html')

@app.route('/logout')
def logout():
    session.pop('access_token', None)
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    base_url = "https://wowkhazanabackend.onrender.com/"
    app.run(host='0.0.0.0', port=8000)
