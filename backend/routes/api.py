import base64
import io
import logging

from flask import Blueprint, jsonify, request
from PIL import Image

from config import ALLOWED_EXTENSIONS, CODEFORMER_SPACE, MAX_FILE_SIZE, MODEL_ID
from services.detection import detect_image
from services.enhancement import enhance_image

logger = logging.getLogger(__name__)

api = Blueprint("api", __name__)


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_ID, "enhancer": CODEFORMER_SPACE})


@api.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Use the 'image' field."}), 400

    file = request.files["image"]

    if not file or file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify(
            {"error": f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"}
        ), 400

    file_bytes = file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum size is 10 MB."}), 400

    try:
        image = Image.open(io.BytesIO(file_bytes))
    except Exception:
        return jsonify({"error": "Invalid or corrupted image file."}), 400

    try:
        prediction, confidence = detect_image(image)
        return jsonify({"prediction": prediction, "confidence": confidence})
    except Exception as exc:
        logger.exception("Detection failed")
        return jsonify({"error": f"Detection failed: {str(exc)}"}), 500


@api.route("/enhance", methods=["POST"])
def enhance():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided. Use the 'image' field."}), 400

    file = request.files["image"]

    if not file or file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify(
            {"error": f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"}
        ), 400

    file_bytes = file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File too large. Maximum size is 10 MB."}), 400

    try:
        image = Image.open(io.BytesIO(file_bytes))
    except Exception:
        return jsonify({"error": "Invalid or corrupted image file."}), 400

    try:
        enhanced = enhance_image(image)
        buffer = io.BytesIO()
        enhanced.save(buffer, format="PNG")
        encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
        return jsonify(
            {
                "enhanced_image": f"data:image/png;base64,{encoded}",
                "width": enhanced.width,
                "height": enhanced.height,
                "model": CODEFORMER_SPACE,
            }
        )
    except Exception as exc:
        logger.exception("Enhancement failed")
        return jsonify({"error": f"Enhancement failed: {str(exc)}"}), 500
