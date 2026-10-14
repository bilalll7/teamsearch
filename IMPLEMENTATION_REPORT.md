# TeamSearch MVP — Implementation Report

**Date:** 2026-10-13  
**Status:** Tahap A (Project Setup & Database) + Auth MVP Complete  
**PRD Version:** 1.2 (PD-01 to PD-07 accepted, PD-08 open)

---

## ✅ What Was Built

### 1. Project Structure & Infrastructure

**Backend (NestJS + TypeScript)**
- ✅ Project scaffolded with @nestjs/cli
- ✅ PostgreSQL 15 running in Docker container `teamsearch-db`
- ✅ Prisma 7 configured with `@prisma/adapter-pg` + `pg` driver
- ✅ Environment config via `.env` (example provided in `.env.example`)
- ✅ Global PrismaService with connection pooling
- ✅ Health check endpoint: `GET /health`

**Frontend (React + TypeScript + Vite)**
- ✅ Vite project with React 18 + TypeScript
- ✅ Tailwind CSS v3 configured (postcss + autoprefixer)
- ✅ React Router v6 for routing
- ✅ Axios client with interceptors (auto-refresh, token injection)

**Database Schema (17 entities)**
- ✅ Campus, AllowedDomain (PD-01: multi-campus architecture, pilot one campus)
- ✅ User (email allowlist validation), Profile, PortfolioLink
- ✅ Skill, SkillCategory, UserSkill
- ✅ Opportunity, Position, PositionSkillRequirement (bobot fixed per PD-05)
- ✅ Application, TeamMembership
- ✅ ContactExchange (PD-04: opt-in email exchange)
- ✅ RefreshToken (PD-07: hashed storage, rotation, reuse detection)
- ✅ Notification
- ✅ Migration `20261013165122_init` applied successfully

**Seed Data (idempotent per PD-03)**
- ✅ 8 skill categories
- ✅ 56 skills across categories (React, NestJS, Figma, Python, Docker, etc.)
- ✅ Campus placeholder `[INPUT PILOT]` + domain `@student.[INPUT PILOT]`

### 2. Authentication (PD-07 Compliant)

**Implemented Endpoints**
- ✅ `POST /auth/register` — email allowlist validation (PD-01), creates User + Profile
- ✅ `POST /auth/login` — returns access + refresh tokens
- ✅ `POST /auth/refresh` — token rotation with reuse detection (revokes family)
- ✅ `POST /auth/logout` — revokes refresh token

**Security Features (PD-07)**
- ✅ Access token: 15 minutes
- ✅ Refresh token: 7 days
- ✅ Refresh token rotation on use (new token, old revoked)
- ✅ Refresh token stored as **bcrypt hash** (not plaintext)
- ✅ Reuse detection: revokes entire token family if reused token detected
- ✅ JWT strategies: `jwt` (access) + `jwt-refresh` (refresh)
- ✅ Guards: `JwtAuthGuard`, `JwtRefreshGuard`

**⚠️ Deviation from PD-07:** bcrypt used instead of Argon2id (m=19456,t=2,p=1). Reason: Argon2id requires C++ build tools (Visual Studio) unavailable on Windows dev environment. bcrypt (rounds=10) still cryptographically strong but less memory-hard. Document in production security review.

### 3. Frontend Pages

- ✅ `/login` — Login form with error handling
- ✅ `/register` — Registration form (validates min 8 chars, password match)
- ✅ `/dashboard` — Authenticated placeholder page
- ✅ Axios interceptor: auto-refresh on 401, redirects to `/login` on refresh failure

### 4. Build & Run Verification

- ✅ Backend builds clean (`npm run build`)
- ✅ Frontend builds clean (317KB JS bundle gzipped to 102KB)
- ✅ Backend running on **http://localhost:3000**
- ✅ Frontend running on **http://localhost:5173**
- ✅ Health check: `GET /health` returns `{"status":"ok","timestamp":"..."}`
- ✅ Database connection active (Prisma adapter + pg pool)

---

## 📦 Dependencies Installed

### Backend
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`, `@nestjs/jwt`, `@nestjs/passport`
- `passport`, `passport-jwt`, `passport-local`
- `@prisma/client@7.10.0`, `prisma@7.10.0`
- `@prisma/adapter-pg`, `pg`, `@types/pg`
- `bcrypt`, `@types/bcrypt`
- `class-validator`, `class-transformer`
- `dotenv`, `ts-node` (for seed script)

### Frontend
- `react@18`, `react-dom@18`, `react-router-dom@6`
- `axios`
- `tailwindcss@3`, `postcss`, `autoprefixer`
- `vite@8`, `@vitejs/plugin-react`
- `typescript@5`

---

## 🗄️ Database Status

**Container:** `teamsearch-db` (postgres:15-alpine)  
**Connection:** `postgresql://teamsearch:teamsearch_dev_password@localhost:5432/teamsearch`  
**Migration:** Applied `init` migration  
**Seed:** Executed successfully (8 categories, 56 skills, campus placeholder)

**Sample seed data:**
```
✓ Created 8 skill categories
✓ Created 56 skills
✓ Created campus placeholder (awaiting real data from stakeholder)
✓ Seed complete
```

---

## 🚧 Known Limitations & Technical Debts

### 1. Authentication Gaps
- ❌ **Email verification not implemented** (D-07 open: stateful vs stateless token storage)
- ❌ Password reset not implemented (same blocker)
- ⚠️ `User.statusVerifikasi` created but not checked during login
- ⚠️ Registration succeeds but user unverified

### 2. Security Gaps (PD-07 partial)
- ❌ **CSRF protection not implemented** (PD-07 requirement)
- ❌ **Rate limiting not implemented** (PD-07 requirement, thresholds awaiting PD-08)
- ⚠️ bcrypt instead of Argon2id (see above)

### 3. Schema Design Issues (awaiting decisions)

**D-01 (HIGH):** TeamMembership owner representation unclear
- Schema includes owner as potential row with `position_id`
- Comment: `ponytail: D-01 decision pending — does owner have a TeamMembership row?`
- **Blocker:** Cannot implement FR-10 (team formation) correctly without this

**D-02/D-03 (HIGH):** "Anggota aktif" & `formed` status
- `Opportunity.status` includes `formed` as stored enum value
- Comment: `ponytail: D-03 decision pending — formed is derived or stored?`
- PD-02 says "≥2 anggota aktif termasuk owner" but "aktif" not precisely defined
- **Blocker:** M4 metric (formed teams count) will be incorrect

**D-04 (HIGH):** Application unique constraint
- Current: `@@unique([positionId, applicantId])` unconditional
- Comment: `ponytail: D-04 decision pending — may need partial unique WHERE status IN (...)`
- **Blocker:** Cannot determine if user can reapply after `rejected`/`withdrawn`

**D-06 (MEDIUM):** ContactExchange kardinalitas
- Current: `@unique` on `applicationId` (1-to-0..1)
- Comment: `ponytail: D-06 decision pending — 1-to-0..1 or 1-to-N if reapply after rejected allowed`
- **Impact:** If owner wants to re-request contact after rejection, current schema blocks it

**D-08 (MEDIUM):** Notification.entitasRef polymorphic
- No `entitasTipe` column → cannot reliably de-duplicate "event + entity"
- Comment: `ponytail: D-08 decision pending — entitas_ref needs entitas_tipe for proper de-dup`

**D-13 (LOW):** TeamMembership FK redundancy
- Both `opportunityId` and `positionId` stored
- `opportunityId` derivable from `Position` relation
- Risk: inconsistency if `position.opportunityId ≠ teamMembership.opportunityId`

### 4. Data Gaps
- ❌ **Campus name unknown** — `[INPUT PILOT]` placeholder (Q-01/D-12)
- ❌ **Allowed domains unknown** — `@student.[INPUT PILOT]` placeholder
- **Blocker:** Cannot test registration with real campus email until stakeholder provides data

---

## 🔴 Blockers for Next Features

Cannot proceed with these until decisions resolved:

| Feature | Blocker | Decision Needed |
|---------|---------|-----------------|
| **FR-10: Team formation** | D-01, D-02, D-03 | Owner in TeamMembership? "Aktif" definition? `formed` derived vs stored? |
| **FR-09: Application accept/reject** | D-04 | Status "aktif" definition, reapply rules, partial unique constraint |
| **FR-11: Contact exchange** | D-06 | Reapply after rejected allowed? 1-0..1 vs 1-N |
| **Email verification** | D-07 | Stateful (entities) vs stateless (JWT) token storage |
| **Campus pilot launch** | D-12 | Campus name + allowed domains from stakeholder |
| **PD-08 compliance** | D-10 | Retention policy, soft/hard delete, ON DELETE behavior |

---

## 🎯 What's Ready to Build (No Blockers)

These can proceed **now** without waiting for open decisions:

### Backend (Priority Order)
1. **Profile endpoints (FR-02)** — CRUD for nama, bio, program studi, angkatan, ketersediaan
2. **Skill endpoints** — list categories, list skills by category, get user skills
3. **Opportunity CRUD (FR-04)** — create, list, detail, filter (jenis, kategori, mode, **kampus** per PD-01)
4. **Position management** — add/edit/delete positions for opportunity
5. **Skill requirements** — add/edit/delete requirements per position (bobot fixed per PD-05)
6. **Matching algorithm (FR-05/FR-06)** — calculate `S = 100 × Σ(wᵢ×mᵢ) / Σ(wᵢ)` with must=5, nice=2
7. **Search & recommendation** — filter + sort by match score, show explanation (which skills match)

**Note:** Application flow (FR-08/FR-09) can be **partially** built (submit, list, view) but **accept/reject** blocked by D-04 (unique constraint) and D-01/D-02 (TeamMembership creation).

### Frontend (After Backend Ready)
1. **Profile page** — edit form for nama, bio, program studi, angkatan
2. **Skill selector** — multi-select from catalog, level 1-3, max 20
3. **Portfolio links** — CRUD UI for github/linkedin/behance/lainnya
4. **Opportunity list** — cards with filter sidebar (jenis, kategori, mode, kampus, status)
5. **Opportunity detail** — positions list, requirements per position, owner info
6. **Create opportunity form** — wizard: basic info → add positions → add requirements per position
7. **Search page** — candidate list with match score bars + "why recommended" breakdown

---

## 📋 Commands to Run

### Start Database
```bash
docker start teamsearch-db
```

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

### Test Auth Flow
```bash
# Register (replace [INPUT PILOT] with real domain once known)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@student.[INPUT PILOT]","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@student.[INPUT PILOT]","password":"password123"}'

# Health check
curl http://localhost:3000/health
```

### Rebuild
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## 📊 Metrics

- **Files created:** 30+ (backend controllers/services/guards/strategies/dto, frontend pages/lib, prisma schema/seed, configs)
- **Lines of code:** ~1,500+ (excluding node_modules)
- **Database tables:** 17
- **API endpoints:** 4 (health, register, login, refresh, logout)
- **Frontend routes:** 3 (login, register, dashboard)
- **Build time:** Backend <5s, Frontend ~2s
- **Bundle size:** Frontend 317KB JS (102KB gzipped)

---

## ✅ Acceptance Criteria Met

From PRD Section 11 (MVP Definition of Done):

- ✅ **AC-MVP.1** Database schema implemented & migrated
- ✅ **AC-MVP.2** Seed data loadable (skill catalog + campus placeholder)
- ✅ **AC-MVP.3** Backend builds without errors
- ✅ **AC-MVP.4** Frontend builds without errors
- ✅ **AC-MVP.5** Authentication flow functional (register, login, refresh with rotation)
- ⚠️ **AC-MVP.6** Email verification pending (D-07 blocker)
- ❌ **AC-MVP.7** Profile CRUD not yet implemented
- ❌ **AC-MVP.8** Opportunity CRUD not yet implemented
- ❌ **AC-MVP.9** Matching algorithm not yet implemented
- ❌ **AC-MVP.10** Application flow not yet implemented

**Status:** **4/10 core MVP criteria complete** (infrastructure + auth). Remaining 6 require additional backend endpoints (can proceed) and decision resolutions (blockers listed above).

---

## 🚀 Recommended Next Steps

### Immediate (No Blocker)
1. **Implement Profile endpoints** (FR-02) → allows users to complete their profiles
2. **Implement Skill endpoints** → allows skill selection from catalog
3. **Implement Opportunity CRUD** (FR-04) → allows owners to create opportunities
4. **Build matching algorithm** (FR-05/FR-06) → enables core value prop

### After Decision D-12 Resolved
5. **Replace `[INPUT PILOT]` placeholders** with real campus name + domains
6. **Test registration with real campus email**

### After Decision D-01/D-02/D-03 Resolved
7. **Implement Application accept/reject** (FR-09) with correct slot limits
8. **Implement TeamMembership auto-creation** (FR-10) with correct `formed` logic

### After Decision D-07 Resolved
9. **Implement email verification tokens**
10. **Implement password reset flow**

### After Decision D-06 Resolved
11. **Implement ContactExchange** (FR-11/PD-04)

### Parallel Track
12. **Build frontend UI** for Profile, Opportunity, Search (after backend APIs ready)

---

## 📄 Files Created

**Backend:**
- `src/prisma.service.ts`, `src/prisma.module.ts`
- `src/auth/auth.module.ts`, `auth.service.ts`, `auth.controller.ts`
- `src/auth/strategies/jwt.strategy.ts`, `jwt-refresh.strategy.ts`
- `src/auth/guards/jwt-auth.guard.ts`, `jwt-refresh.guard.ts`
- `src/auth/dto/auth.dto.ts`
- `prisma/schema.prisma` (17 models, 250+ lines)
- `prisma/seed.ts` (idempotent seed with 56 skills)
- `.env`, `.env.example`

**Frontend:**
- `src/pages/Login.tsx`, `Register.tsx`, `Dashboard.tsx`
- `src/lib/api.ts` (axios client with refresh interceptor)
- `src/App.tsx` (router config)
- `tailwind.config.js`, `postcss.config.js`

**Root:**
- `docker-compose.yml`
- `README.md` (comprehensive setup & run guide)

---

## 🔒 Security Notes

1. **Secrets in .env are placeholders** — regenerate for production
2. **bcrypt vs Argon2id** — document deviation in security review
3. **CSRF & rate limiting missing** — implement before pilot launch (PD-07 compliance)
4. **Email verification disabled** — users can login without verification (temporary until D-07 resolved)
5. **CORS open to localhost:5173** — restrict in production

---

## 🎓 Conformance to PRD & PD

- ✅ PD-01: Multi-campus architecture implemented (Campus, AllowedDomain, User.campusId)
- ✅ PD-02: TeamMembership schema prepared (pending D-01/D-02 decisions for full implementation)
- ✅ PD-03: Skill catalog via seed data, idempotent upsert, skill referenced by id (FK)
- ✅ PD-04: ContactExchange entity prepared (1-0..1, pending D-06 for reapply behavior)
- ✅ PD-05: PositionSkillRequirement.bobot stored (must=5, nice=2), formula documented
- ✅ PD-06: Stack confirmed (React+TS+Vite, NestJS+TS, PostgreSQL, Prisma, Tailwind)
- ⚠️ PD-07: Auth implemented with **bcrypt** (not Argon2id), access 15min, refresh 7d rotation + reuse detection ✅; CSRF ❌, rate limiting ❌
- ⏳ PD-08: Retention/deletion deferred (open decision)

---

**End of Report**
