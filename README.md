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


1. Project Structure & Stack
Frontend: React (Vite), Tailwind CSS, component-based, modern UI.
Backend: FastAPI (Python), MongoDB, Pydantic models, async endpoints.
Other: Docker support for backend, RESTful API, JWT-based authentication.
2. Core Features
Frontend
Landing Page: Visually rich, highlights mission (waste management, food security, community development), call-to-action for registration, testimonials, and contact form.
Dashboards: Role-based (Admin, Donor, Recipient, Volunteer), each with tailored UI and data.
Authentication: Modal-based login/registration, minimal required fields (username, email, password, role).
Role Selection: Users choose their category (donor, recipient, volunteer) during registration, routed to the correct dashboard.
Reusable Components: Navbars, footers, toggles, sliders, cards, charts, etc., for a modular and maintainable UI.
Responsive Design: Mobile-friendly layouts, modern styling, and interactive elements.
Backend
User Management: Registration and login with minimal data; profile completion is optional and can be done later.
Role-Based Routing: Endpoints and logic for donors, recipients, volunteers, and admins.
Donations: Models and routes for creating, listing, and managing donations.
Reviews: Feedback and review system for users and donations.
Utilities: SMS notifications, JWT authentication, and utility functions for common backend tasks.
3. User Flow
Landing Page: User lands, sees mission, can register or log in.
Registration: User selects a role, provides minimal info, and is routed to their dashboard.
Dashboard: User sees data and actions relevant to their role (e.g., donors see donation stats, recipients see available donations).
Admin: Can manage users, donations, reviews, and see analytics.
Profile Completion: Users can optionally complete their profile after registration.
4. Design & UX
Modern, Clean UI: Uses Tailwind for styling, with a focus on accessibility and visual appeal.
Component-Driven: Easy to extend and maintain.
Dark/Light Mode: Planned for future implementation.
Charts & Stats: Visual insights for users, especially in dashboards.
5. Extensibility
Easy to Add Roles/Features: Modular backend and frontend.
API-First: Well-structured endpoints for future integrations (e.g., mobile app).
Dockerized Backend: Ready for deployment and scaling.
6. Current Status
Frontend and backend are integrated and aligned.
Minimal registration is working.
Landing page and dashboards are visually appealing and functional.
Pending: Dark/light mode toggle, further UI polish, and possibly more advanced analytics.
Summary:
Your system is a modern, full-stack platform for managing surplus donations, with a strong focus on role-based user experiences, minimal onboarding friction, and a visually engaging interface. It’s well-structured for future growth and easy to maintain or extend.
