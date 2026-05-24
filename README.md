# Webster — Online Graphic Editor

## Screenshots

| Landing Page | Dashboard | Editor |
|---|---|---|
| Modern landing with feature showcase | Manage your designs & templates | Full Fabric.js canvas editor |

---

## Features

- **Fabric.js Canvas Editor** — drag & drop shapes, images, and text
- **Rich Text Tool** — fonts, size, color, bold/italic/underline, alignment
- **Image Upload & Filters** — upload images, apply grayscale/sepia/blur/sharpen/emboss/invert
- **Brightness Control** — fine-tune image brightness with a slider
- **Shapes** — rectangles, circles, triangles with fill/stroke control
- **Layers Panel** — view, select, show/hide, lock/unlock layers
- **Properties Panel** — live property editing for any selected object
- **Undo / Redo** — full history (Ctrl+Z / Ctrl+Y)
- **Export** — download as PNG or JPEG
- **Templates** — 10 pre-built templates (Instagram, Facebook, YouTube, Business Card, etc.)
- **Auto-save** — designs stored in PostgreSQL
- **Authentication** — JWT-based register/login
- **Responsive Design** — works on mobile, tablet, and desktop
- **Docker** — one-command deployment

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Fabric.js, Zustand, React Router |
| Backend | NestJS, TypeScript, TypeORM, Passport JWT |
| Database | PostgreSQL 16 |
| API Docs | Swagger (OpenAPI) |
| Container | Docker, Docker Compose |
| Web Server | Nginx (production) |

---

## Requirements

- **Node.js** 20+
- **npm** 9+
- **PostgreSQL** 16 (or Docker)
- **Docker** + **Docker Compose** (for containerized setup)

---

## How to Run

### Option 1 — Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd webster

# Start everything
docker compose up --build

# Open http://localhost:3000
```

### Option 2 — Local Development

**1. Start PostgreSQL** (or use Docker just for DB):
```bash
docker run -d --name webster-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=webster \
  -p 5432:5432 \
  postgres:16-alpine
```

**2. Backend:**
```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run start:dev
# Running on http://localhost:3001
# Swagger docs: http://localhost:3001/api/docs
```

**3. Frontend:**
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## Project Structure

```
webster/
├── backend/                   # NestJS API
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── users/             # User management
│   │   ├── designs/           # Canvas designs CRUD
│   │   ├── templates/         # Design templates
│   │   └── upload/            # File upload endpoint
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                  # React + TypeScript SPA
│   ├── src/
│   │   ├── api/               # Axios client
│   │   ├── components/
│   │   │   └── editor/        # Canvas, Toolbar, Layers, Properties
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Editor
│   │   ├── store/             # Zustand auth store
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | — |
| POST | `/auth/login` | Login | — |
| GET | `/users/me` | Current user | ✓ |
| PATCH | `/users/avatar` | Upload avatar | ✓ |
| GET | `/designs` | List user's designs | ✓ |
| POST | `/designs` | Create design | ✓ |
| GET | `/designs/:id` | Get design | ✓ |
| PATCH | `/designs/:id` | Update design | ✓ |
| DELETE | `/designs/:id` | Delete design | ✓ |
| GET | `/templates` | List templates | ✓ |
| GET | `/templates/:id` | Get template | ✓ |
| POST | `/upload/image` | Upload image | ✓ |

Full interactive docs at `http://localhost:3001/api/docs`

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save |
| `Delete` | Delete selected |

---

## Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | DB username |
| `DB_PASSWORD` | `postgres` | DB password |
| `DB_NAME` | `webster` | Database name |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `PORT` | `3001` | Server port |
