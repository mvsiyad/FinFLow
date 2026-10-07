# FinFlow 💸
> Sleek, modern personal finance and budget tracker designed to showcase clean full-stack architecture, responsive UI design, and interactive data visualization.

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database & ORM:** PostgreSQL ([Neon Serverless](https://neon.tech)), Prisma ORM
- **Authentication:** JWT with secure HTTP-only cookies, bcryptjs password hashing
- **Validation:** Zod schemas
- **Frontend (Upcoming):** Next.js 14+ (App Router), Tailwind CSS, Zustand, Recharts

---

## 📁 Project Architecture

```
finflow/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # Version-controlled DB migrations
│   │   └── schema.prisma           # Prisma models (User, Transaction, Budget)
│   ├── src/
│   │   ├── controllers/            # Route business logic (Auth, Transactions, Budgets)
│   │   ├── middleware/             # JWT auth & error middleware
│   │   ├── routes/                 # Express API endpoints
│   │   ├── lib/                    # Prisma singleton & shared utilities
│   │   └── server.ts               # Express application entry
│   ├── .env.example                # Sample environment variables
│   ├── package.json
│   └── tsconfig.json
└── frontend/                       # (Phase 3) Next.js App Router UI
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- PostgreSQL connection string (e.g. Neon, Supabase, or local Postgres)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file based on `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-jwt-secret-key"
   JWT_EXPIRES_IN="7d"
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will run at `http://localhost:5000`.

---

## 🔒 API Endpoints

### Authentication (Phase 1)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Server health status check | No |
| `POST` | `/api/auth/register` | Register new user & set auth cookie | No |
| `POST` | `/api/auth/login` | Login user & set auth cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes (JWT)** |

### Transactions (Phase 2)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/transactions` | List user transactions (supports filters: type, category, startDate, endDate, pagination) | **Yes (JWT)** |
| `GET` | `/api/transactions/:id` | Get transaction details by ID | **Yes (JWT)** |
| `POST` | `/api/transactions` | Create new income or expense transaction | **Yes (JWT)** |
| `PUT` | `/api/transactions/:id` | Update transaction record | **Yes (JWT)** |
| `DELETE` | `/api/transactions/:id` | Delete transaction record | **Yes (JWT)** |

### Budgets & Alerts (Phase 2)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/budgets` | Fetch monthly budgets with computed spending & alert levels (`green`, `amber`, `red`) | **Yes (JWT)** |
| `POST` | `/api/budgets` | Upsert monthly spending limit for category | **Yes (JWT)** |
| `DELETE` | `/api/budgets/:id` | Delete monthly category budget cap | **Yes (JWT)** |

### Summary & Analytics (Phase 2 & Extended Intelligence)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/summary` | Fetch net balance, total income/expenses, savings rate, and category breakdown | **Yes (JWT)** |
| `GET` | `/api/insights` | FinFlow AI Financial Health Score (0–100), daily burn rate, and predictive smart insights | **Yes (JWT)** |

---

### Frontend Setup (Phase 3)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The web dashboard will be available at `http://localhost:3000`.

---

## 🗺️ Roadmap
- [x] **Phase 1:** Backend Setup & Authentication (Express, TypeScript, Prisma, Neon Postgres, JWT)
- [x] **Phase 2:** Core Transactions & Budget API (CRUD, categorization, date filtering, summary)
- [x] **Phase 3:** Frontend Layout & Dashboard UI (Next.js 14, Tailwind CSS, Sidebar, Modals)
- [x] **Phase 4:** Interactive Charts & Budget Alerts (Recharts trend lines, doughnut charts, dynamic budget alerts, CSV export)
- [ ] **Phase 5:** Testing, Polish & Deployment (Jest tests, Render/Railway, Vercel)


