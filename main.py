from flask import Flask, send_from_directory, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/admin/dashBoard' , methods=['GET'])
def dashBoard():
    return render_template('dashBoard.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

if __name__ == '__main__':
    app.run(debug=True)
