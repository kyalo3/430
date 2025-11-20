npm install
npm run dev
npm run dev -- --host
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Currently, two official plugins are available:

# Sustainashare Platform

A modern donation management platform for connecting donors, recipients, and volunteers. Built with a React (Vite + Tailwind CSS) frontend and a FastAPI backend.

## Features
- Admin, Donor, Recipient, and Volunteer dashboards
- Modern, responsive UI with Tailwind CSS
- Real-time activity, analytics, and system health
- User authentication and role management
- Donation tracking and management
- Feedback, announcements, and more

## Project Structure

```
├── src/                  # Frontend React app (Vite)
│   ├── pages/            # Dashboard pages (Admin, Donor, Recipient, Volunteer)
│   ├── components/       # UI components
│   └── ...
├── sustainashare_backend/ # FastAPI backend
│   ├── app/              # FastAPI app code (routes, models, utils)
│   └── ...
├── public/               # Static assets
├── package.json          # Frontend dependencies & scripts
├── requirements.txt      # Backend dependencies
└── README.md             # Project documentation
```

## Prerequisites
- Node.js (v16+ recommended)
- Python 3.8+
- (Optional) MongoDB for backend data

## Setup & Start Commands

### 1. Frontend (React + Vite)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev -- --host
```

The frontend will be available at `http://localhost:5173` by default.

### 2. Backend (FastAPI)

```bash
# Change to backend directory
cd sustainashare_backend

# (Optional) Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`.

## Environment Variables
- Configure your database and secret keys in `sustainashare_backend/app/database.py` and related config files.

## Useful Scripts
- `npm run build` — Build frontend for production
- `npm run lint` — Lint frontend code

## License
MIT

---

**Sustainashare** — Empowering communities through transparent giving.
