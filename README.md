# TeamSearch MVP

Platform pencarian rekan tim berbasis skill matching untuk mahasiswa kampus.

## Stack Teknologi (PD-06)

- **Frontend:** React + TypeScript + Vite + Tailwind CSS v3
- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL 15 (via Docker)
- **ORM:** Prisma 7
- **Auth:** JWT (access 15min, refresh 7d with rotation per PD-07), bcrypt for hashing

## Prerequisites

- Node.js v20+
- Docker Desktop
- npm v11+

## Setup & Installation

### 1. Clone dan Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL container
docker start teamsearch-db

# Or if not exists yet:
# docker run -d --name teamsearch-db \
#   -e POSTGRES_USER=teamsearch \
#   -e POSTGRES_PASSWORD=teamsearch_dev_password \
#   -e POSTGRES_DB=teamsearch \
#   -p 5432:5432 \
#   postgres:15-alpine

# Run migrations
cd backend
npx prisma migrate dev

# Seed data (skill catalog + campus placeholder)
npm run seed
```

### 3. Environment Variables

Backend `.env` already configured with:
```
DATABASE_URL="postgresql://teamsearch:teamsearch_dev_password@localhost:5432/teamsearch"
JWT_ACCESS_SECRET="temp_access_secret_replace_in_production"
JWT_REFRESH_SECRET="temp_refresh_secret_replace_in_production"
```

**⚠️ Replace secrets before production deployment.**

## Running the Application

### Backend (port 3000)
```bash
cd backend
npm run start:dev
```

### Frontend (port 5173)
```bash
cd frontend
npm run dev
```

Access frontend at: **http://localhost:5173**

## API Endpoints Implemented

### Health Check
- `GET /health` - Server health status

### Authentication (PD-07)
- `POST /auth/register` - Register with campus email (allowlist validation per PD-01)
- `POST /auth/login` - Login with email + password
- `POST /auth/refresh` - Refresh access token (rotation + reuse detection)
- `POST /auth/logout` - Revoke refresh token

**Auth Flow:**
- Access token: 15 minutes
- Refresh token: 7 days, rotated on use
- Refresh token stored hashed in DB
- Reuse detection revokes entire token family

### Nota Bene
- Email verification tokens **not yet implemented** (D-07 open decision: stateful vs stateless storage)
- bcrypt used instead of Argon2id (PD-07 specified Argon2id but requires C++ build tools unavailable on Windows)

## Database Schema

Implemented entities per `docs/PRD.md` v1.2:
- Campus, AllowedDomain (PD-01: multi-campus architecture)
- User, Profile, PortfolioLink
- Skill, SkillCategory, UserSkill
- Opportunity, Position, PositionSkillRequirement (PD-05: fixed weights must=5, nice=2)
- Application, TeamMembership
- ContactExchange (PD-04: opt-in email exchange)
- RefreshToken (PD-07: rotation + reuse detection)
- Notification

**Seed Data:**
- 8 skill categories (Frontend, Backend, Mobile, UI/UX, Data Science, DevOps, PM, Marketing)
- 56 skills across categories
- Campus placeholder `[INPUT PILOT]` with domain `@student.[INPUT PILOT]` (Q-01: awaiting stakeholder input)

## Frontend Pages Implemented

- `/login` - Login form
- `/register` - Registration form (validates against allowlist)
- `/dashboard` - Basic authenticated dashboard placeholder

## Known Limitations & Open Decisions

### Blockers (cannot finalize without Product Owner approval)

**D-01:** Owner representation in TeamMembership — does owner get a row?  
**D-02/D-03:** "Anggota aktif" definition & `formed` status (stored vs derived)  
**D-04:** "Status aktif" definition for Application unique constraint & reapply rules  
**D-06:** ContactExchange 1-0..1 vs 1-N if reapply after rejected allowed  
**D-07:** Email verification / password reset token storage (stateful vs stateless)  
**D-09:** "Profil lengkap" gate definition (≥1 skill vs ≥3 skill + portfolio/bio)  
**D-10 (PD-08):** Retention, soft/hard delete, account deletion policy  
**D-11 (Q-16):** Skill inactive/rename/not-found behavior  
**D-12 (Q-01):** Campus name and allowed email domains for pilot  

### Technical Debts (marked with `ponytail:` comments)

1. **bcrypt vs Argon2id:** PD-07 specified Argon2id `m=19456,t=2,p=1` but Windows build constraints forced bcrypt (rounds=10). Security impact: bcrypt still strong but less memory-hard.

2. **Email verification skipped:** User registration creates unverified account; login does not check `statusVerifikasi`. Waiting D-07 decision on token storage.

3. **Bobot column redundant:** `PositionSkillRequirement.bobot` always derived from `jenis` (must=5, nice=2 per PD-05) but stored as column. Consider CHECK constraint or computed column.

4. **Notification.entitasRef polymorphic:** No `entitasTipe` column → de-duplication "event+entity" not guaranteed (D-08).

5. **TeamMembership FK redundancy:** Both `opportunity_id` and `position_id` stored; `opportunity_id` derivable from `Position`. Risk of inconsistency (D-13).

## What's NOT Implemented (MVP Scope)

Per PRD priorities, these P0/P1 features await completion:

### Backend (Tahap C)
- Profile management endpoints (FR-02: nama, bio, skill, portfolio)
- Skill endpoints (list categories, list skills by category)
- Opportunity CRUD (FR-04: create, list, filter by campus per PD-01)
- Position management (FR-04: positions per opportunity)
- Skill matching calculation (FR-05/FR-06: formula S=100×Σ(wᵢ×mᵢ)/Σ(wᵢ), PD-05 weights)
- Application endpoints (FR-08/FR-09: apply, shortlist, accept/reject with slot limits BR-09.2)
- TeamMembership logic (FR-10: auto-create on accept, BR-10.2 formed ≥2 aktif)
- ContactExchange endpoints (FR-11/PD-04: request after accept, opt-in consent)
- Notification endpoints (FR-11: list, mark read)

### Frontend (Tahap D)
- Profile page (edit nama, bio, program studi, angkatan, ketersediaan)
- Skill management UI (select from catalog, set level 1-3, max 20)
- Portfolio links UI (add/edit/delete, validate https)
- Opportunity list + filter (jenis, kategori, mode, kampus, status)
- Opportunity detail + positions
- Create opportunity form (judul, deskripsi, positions with skill requirements)
- Search + recommendation page (skill match score + explanation)
- Application management (owner: review, shortlist, accept/reject; candidate: withdraw)
- Team member list + status transitions
- Contact exchange flow
- Notification panel

### Missing Infrastructure
- CSRF protection (PD-07 requirement)
- Rate limiting (PD-07 requirement, thresholds not final per PD-08)
- Email sending service (verification, password reset)
- Input sanitization beyond class-validator
- Logging & monitoring
- Error tracking

## Testing

**Not yet implemented:**
- Unit tests (auth service, matching algorithm)
- Integration tests (API endpoints)
- E2E tests (user flows)

## Development Notes

### Prisma 7 Adapter
Prisma 7 requires explicit driver adapter. Using `@prisma/adapter-pg` with `pg` pool. PrismaService and seed both configure adapter.

### CORS
Backend CORS enabled for `http://localhost:5173` (Vite default). Adjust for production.

### Refresh Token Rotation (PD-07)
- On refresh: old token revoked, new token issued with same `familyId`
- Reuse detection: if revoked token used → revoke entire family
- Token stored as bcrypt hash (not plaintext)

## Next Steps (Ordered by Dependency)

1. **Resolve D-12** → replace `[INPUT PILOT]` with real campus name & domains
2. **Resolve D-01/D-02/D-03** → finalize TeamMembership & `formed` status logic
3. **Implement Profile endpoints** (FR-02) → unblocks skill management & profil lengkap gate
4. **Implement Opportunity CRUD** (FR-04) → unblocks position & requirements
5. **Implement matching algorithm** (FR-05/FR-06) → PD-05 formula with fixed weights
6. **Implement Application flow** (FR-08/FR-09) → includes slot validation BR-09.2
7. **Implement TeamMembership auto-creation** (FR-10) → requires D-01/D-02 resolved
8. **Implement ContactExchange** (FR-11/PD-04) → requires D-06 resolved
9. **Build frontend UI** for above features → parallel with backend after Profile ready
10. **Email verification & reset** → after D-07 resolved

## Documentation

- `docs/PRD.md` v1.2 - Product Requirements Document
- `docs/PRODUCT_DECISIONS.md` v1.2 - Decision Log (PD-01 to PD-08)

## License

[To be determined]
