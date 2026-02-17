# Nisschay Khandelwal Portfolio

A modern, elegant full-stack portfolio platform built with Next.js 14, Express.js, and PostgreSQL.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Rich Text**: TipTap Editor

### Backend
- **Runtime**: Node.js + Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
portfolio-fullstack/
├── frontend/          # Next.js application
├── backend/           # Express API
├── docker-compose.yml # Docker configuration
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone and Install

```bash
# from repository root
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL=postgresql://nisschay:portfolio_secret_2025@localhost:5432/portfolio
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
PORT=5000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nisschaykhandelwal@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=nisschaykhandelwal@gmail.com
```

#### Frontend (.env.local)
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Ensure local PostgreSQL role + DB exist (Linux)
sudo -u postgres psql -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'nisschay') THEN CREATE ROLE nisschay LOGIN PASSWORD 'portfolio_secret_2025'; ELSE ALTER ROLE nisschay WITH LOGIN PASSWORD 'portfolio_secret_2025'; END IF; END \$\$;"
sudo -u postgres psql -c "ALTER ROLE nisschay CREATEDB;"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='portfolio'" | grep -q 1 || sudo -u postgres createdb -O nisschay portfolio

# Generate Prisma client
cd backend
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed
```

### 4. Run Development Servers

**Quick Start (Recommended):**
```bash
# Start both servers
./start

# Stop both servers
./stop.sh
```

**Alternative (npm scripts):**
```bash
# from repository root (runs backend + frontend together)
npm run dev

# or run separately
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

### Local Troubleshooting (No Docker)

- `P1000 (Authentication failed)`: verify `backend/.env` `DATABASE_URL` matches your local PostgreSQL user/password.
- `P3014 (shadow DB permission)`: run `sudo -u postgres psql -c "ALTER ROLE nisschay CREATEDB;"`.
- If port `5432` is not local PostgreSQL, update host/port in `DATABASE_URL`.

### Default Admin Credentials
- Email: admin@nisschay.dev
- Password: Admin@123

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your production values

# Build and start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run seed
```

### Services
- **postgres**: PostgreSQL database (port 5432)
- **backend**: Express API (port 5000)
- **frontend**: Next.js app (port 3000)

## 📡 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects (with filters) |
| GET | `/api/projects/:slug` | Get project by slug |
| GET | `/api/blog` | List all blog posts (paginated) |
| GET | `/api/blog/:slug` | Get blog post by slug |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/stats` | Public statistics |

### Protected Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/admin/projects` | Create project |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| POST | `/api/admin/blog` | Create blog post |
| PUT | `/api/admin/blog/:id` | Update blog post |
| DELETE | `/api/admin/blog/:id` | Delete blog post |
| GET | `/api/admin/contact` | Get all messages |
| PUT | `/api/admin/contact/:id` | Mark as read |
| DELETE | `/api/admin/contact/:id` | Delete message |

### Query Parameters

**Projects**
- `category`: Filter by category (ml, fullstack, data)
- `featured`: Filter featured projects (true/false)
- `limit`: Number of results

**Blog**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)
- `tag`: Filter by tag
- `search`: Search in title/content

## 🎨 Design System

### Typography
- **Headings**: Cormorant Garamond (serif)
- **Body**: DM Sans (sans-serif)

### Colors
```css
--color-base: #fdfcfa       /* Warm white */
--color-base-alt: #f9f7f4   /* Cream */
--color-ink: #1a1916        /* Rich black */
--color-ink-soft: #4a4845   /* Soft gray */
--color-accent: #c4956a     /* Bronze/Gold */
```

### Animations
- Hero entrance: Staggered fade-up (0.2s, 0.35s, 0.55s delays)
- Project cards: Dark overlay slides from bottom
- Custom cursor: Dot follows immediately, ring with lerp lag

## 🔒 Security

- JWT authentication with httpOnly cookies
- Bcrypt password hashing (10 rounds)
- Helmet.js security headers
- CORS configuration
- Rate limiting (5 contact submissions/hour)
- Input validation with Zod
- SQL injection prevention via Prisma

## 📦 Deployment

### Vercel (Frontend)
1. Import repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Railway/Render (Backend)
1. Create new service from `backend` directory
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy

### Environment Variables for Production
```env
# Backend
DATABASE_URL=your-production-db-url
JWT_SECRET=secure-random-string-min-32-chars
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## ➕ Adding Projects

To add your GitHub projects to the portfolio:

### Via Admin Panel (Recommended)
1. Navigate to http://localhost:3000/admin/login
2. Login with admin credentials
3. Go to **Projects** → **Add New Project**
4. Fill in details:
   - **Title**: Project name
   - **Description**: Short summary
   - **Long Description**: Detailed info (supports HTML)
   - **GitHub URL**: `https://github.com/nisschay/your-repo`
   - **Demo URL**: Live demo link (if available)
   - **Category**: ml, fullstack, or data
   - **Tags**: Technologies used
   - **Image**: Upload a cover image
5. Save the project

### Via API
```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nisschay.dev","password":"Admin@123"}' | jq -r '.token')

# Create project
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "RAG Education System",
    "slug": "rag-education-system",
    "description": "AI-powered education system using Retrieval-Augmented Generation",
    "longDescription": "<h2>Overview</h2><p>Details about the project...</p>",
    "category": "ml",
    "tags": ["Python", "RAG", "LangChain", "AI"],
    "githubUrl": "https://github.com/nisschay/rag-Education-system",
    "featured": true
  }'
```

### Via Database Seed
Add entries to `backend/prisma/seed.ts` and run:
```bash
cd backend && npm run seed
```

## 📄 License

MIT License © 2025 Nisschay Khandelwal
