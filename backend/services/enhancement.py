import io
import logging
import os
import tempfile
from pathlib import Path

from PIL import Image

from config import CODEFORMER_FIDELITY, CODEFORMER_SPACE, CODEFORMER_UPSCALE

logger = logging.getLogger(__name__)

_client = None


def get_client():
    global _client
    if _client is None:
        from gradio_client import Client

        logger.info("Connecting to CodeFormer Hugging Face Space: %s", CODEFORMER_SPACE)
        _client = Client(CODEFORMER_SPACE)
        logger.info("CodeFormer client ready.")
    return _client


def preload_enhancer() -> None:
    try:
        get_client()
    except Exception:
        logger.warning("CodeFormer client preload skipped; will connect on first request.", exc_info=True)


def _load_result_image(result) -> Image.Image:
    if isinstance(result, tuple):
        result = result[0]

    if isinstance(result, dict):
        if result.get("path") and os.path.exists(result["path"]):
            return Image.open(result["path"]).convert("RGB")
        if result.get("url"):
            import httpx

            response = httpx.get(result["url"], timeout=120.0)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content)).convert("RGB")

    if isinstance(result, str):
        if os.path.exists(result):
            return Image.open(result).convert("RGB")
        import httpx

        response = httpx.get(result, timeout=120.0)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGB")

    raise ValueError("Unexpected CodeFormer response format.")


def enhance_image(image: Image.Image) -> Image.Image:
    """Enhance a PIL image using sczhou/CodeFormer on Hugging Face."""
    from gradio_client import handle_file

    image = image.convert("RGB")
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            temp_path = tmp.name
            image.save(temp_path)

        client = get_client()
        result = client.predict(
            handle_file(temp_path),
            True,
            True,
            True,
            CODEFORMER_UPSCALE,
            CODEFORMER_FIDELITY,
            api_name="/inference",
        )
        return _load_result_image(result)
    finally:
        if temp_path and Path(temp_path).exists():
            Path(temp_path).unlink(missing_ok=True)
