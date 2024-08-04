from flask import Flask, send_from_directory, render_template


class MyApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SECRET_KEY'] = "your_default_secret_key"
        self._setup_routes()

    def _setup_routes(self):
        @self.app.route('/')
        def home():
            return render_template('login.html')

        @self.app.route('/admin/dashBoard', methods=['GET'])
        def dashBoard():
            return render_template('dashBoard.html')

        @self.app.route('/admin/userWalletAndKycUpdate', methods=['GET'])
        def userWalletKycUpdate():
            return render_template('manageUser.html')

        @self.app.route('/assets/<path:filename>')
        def serve_assets(filename):
            return send_from_directory('assets', filename)

    def run(self):
        self.app.run(host='0.0.0.0', port=8080, debug=False)

if __name__ == '__main__':
    app_instance = MyApp()
    app_instance.run()
