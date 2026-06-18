import os

MODEL_ID = os.environ.get("DETECTION_MODEL", "prithivMLmods/deepfake-detector-model-v1")
CODEFORMER_SPACE = os.environ.get("CODEFORMER_SPACE", "sczhou/CodeFormer")
CODEFORMER_UPSCALE = float(os.environ.get("CODEFORMER_UPSCALE", "2"))
CODEFORMER_FIDELITY = float(os.environ.get("CODEFORMER_FIDELITY", "0.5"))
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif", "bmp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
PORT = int(os.environ.get("PORT", 5000))
DEBUG = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
