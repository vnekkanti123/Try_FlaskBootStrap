from flask import Flask, render_template
from http import HTTPStatus
import logging, secrets, bcrypt
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with your actual secret key


@app.route('/')
def home():
    return render_template('login.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
