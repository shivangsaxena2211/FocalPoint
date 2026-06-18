import logging

from flask import Flask
from flask_cors import CORS

from config import DEBUG, PORT
from routes.api import api
from services.detection import preload_model
from services.enhancement import preload_enhancer

logging.basicConfig(level=logging.INFO)


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(api)
    preload_model()
    preload_enhancer()
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
