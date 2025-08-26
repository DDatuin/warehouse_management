import os
from .blueprint import routes
from flask import Flask
from flask_cors import CORS

        
    
def create_app():
    app = Flask(__name__)
    CORS(app, resources = {r"/*": {"origins": ["http://localhost:8000"]}})

    app.register_blueprint(routes)

    return app
