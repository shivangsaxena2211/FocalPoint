import logging

from PIL import Image
from transformers import pipeline

from config import MODEL_ID

logger = logging.getLogger(__name__)

_detector = None


def get_detector():
    global _detector
    if _detector is None:
        logger.info("Loading model: %s", MODEL_ID)
        _detector = pipeline("image-classification", model=MODEL_ID)
        logger.info("Model loaded successfully.")
    return _detector


def preload_model() -> None:
    get_detector()


def normalize_prediction(label: str, score: float) -> tuple[str, float]:
    label_lower = label.lower()
    if label_lower in ("fake", "ai", "ai-generated", "artificial", "generated", "deepfake"):
        return "AI Generated", round(score * 100, 1)
    if label_lower in ("real", "authentic", "human", "natural"):
        return "Real", round(score * 100, 1)
    return label, round(score * 100, 1)


def detect_image(image: Image.Image) -> tuple[str, float]:
    """Run deepfake detection on a PIL image."""
    image = image.convert("RGB")
    results = get_detector()(image)
    top = results[0]
    return normalize_prediction(top["label"], top["score"])
