# AI Image Detection Web Application

Portfolio-grade full-stack application for detecting AI-generated images using a Hugging Face Vision Transformer model. Built with a cybersecurity-themed dashboard UI, detection history, PDF reporting, and production-ready project structure.

## Highlights

- Drag-and-drop image upload with client & server validation
- Real-time deepfake classification with confidence scoring
- SVG confidence gauge and status badges
- Detection history persisted in localStorage
- Downloadable PDF analysis reports
- Responsive mobile-first dashboard layout
- Typed error handling across the stack
- Modular Flask backend with service layer

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, jsPDF |
| Backend  | Flask, Flask-CORS, Hugging Face Transformers, PyTorch |
| Model    | `prithivMLmods/deepfake-detector-model-v1` |

## Project Structure

```
deepfake-detector/
├── frontend/
│   └── src/
│       ├── app/                 # Root application
│       ├── components/
│       │   ├── dashboard/       # Layout & workspace
│       │   ├── detection/       # Scan UI, gauge, file details
│       │   ├── history/         # Detection history panel
│       │   ├── reports/         # PDF export
│       │   └── ui/              # Shared UI primitives
│       ├── constants/           # App config
│       ├── hooks/               # useDetection, useDetectionHistory
│       ├── lib/
│       │   ├── api/             # API client
│       │   ├── pdf/             # Report generator
│       │   ├── storage/         # localStorage helpers
│       │   └── utils/           # Validation, formatting, prediction
│       ├── styles/
│       └── types/
├── backend/
│   ├── app.py                   # Application factory & entry point
│   ├── wsgi.py                  # Production WSGI entry
│   ├── config.py                # Environment configuration
│   ├── routes/api.py            # REST endpoints
│   └── services/detection.py    # ML inference service
└── README.md
```

## Features

### Detection
- Upload via drag-and-drop or file picker
- Image preview with scan overlay
- File metadata panel (size, dimensions, MIME type)
- AI vs. Real classification with confidence gauge
- Analysis summary with risk level and signal strength

### History
- Stores last 50 scans in browser localStorage
- AI vs. authentic counts
- Per-item removal and full clear

### Reports
- One-click PDF export with classification, summary, file details, and risk metrics

### Error Handling
- Unsupported file types
- Oversized files (>10 MB)
- No file selected
- Network failures
- Server errors

## Prerequisites

- Node.js 18+
- Python 3.10+
- ~500 MB for model download (first run)

## Setup

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

API runs at **http://localhost:5000**

**Production (Gunicorn):**
```bash
gunicorn --bind 0.0.0.0:5000 --workers 1 wsgi:app
```

> Use 1 worker — the ML model is loaded in memory per process.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

**Production build:**
```bash
cp .env.example .env
npm run build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Frontend API base URL |
| `DETECTION_MODEL` | `prithivMLmods/deepfake-detector-model-v1` | Hugging Face model |
| `PORT` | `5000` | Flask port |
| `FLASK_DEBUG` | `false` | Debug mode |

## API

### `GET /health`
```json
{ "status": "ok", "model": "prithivMLmods/deepfake-detector-model-v1" }
```

### `POST /detect`
`multipart/form-data` with field `image`

```json
{
  "prediction": "AI Generated",
  "confidence": 93.5
}
```

## License

MIT
