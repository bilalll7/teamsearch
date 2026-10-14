# Product Decisions Log (PDL)

## Aplikasi Pencarian Rekan Tim Lomba dan Proyek — TeamSearch

| Atribut | Keterangan |
|---|---|
| **Versi Dokumen** | 1.2 (Finalisasi Keputusan 2026-10-13) |
| **Status Dokumen** | Aktif — 7 keputusan accepted, 0 proposed, 1 open |
| **Dokumen Acuan** | `docs/PRD.md` versi 1.2 (2026-10-13) |
| **Tanggal** | 2026-10-13 |
| **Pemilik Keputusan** | Product Owner (kecuali ditentukan lain) |

---

## Tujuan Dokumen

Dokumen ini mencatat keputusan produk dan teknis yang **diangkat dari diskusi terbaru** untuk melengkapi PRD. Dokumen ini melengkapi — **bukan menggantikan** — `docs/PRD.md`.

**Aturan status:**

| Status | Arti |
|---|---|
| **accepted** | Keputusan telah disetujui secara eksplisit oleh pemilik keputusan dan menjadi acuan tetap. |
| **proposed** | Usulan yang tercatat, **belum disetujui secara eksplisit**. Belum boleh dianggap final. |
| **open** | Belum ada usulan atau pilihan yang disepakati; masih memerlukan diskusi. |

> **Catatan status per 2026-10-13 (v1.2):** 7 keputusan berstatus **accepted** (PD-01 s.d. PD-07) berdasarkan persetujuan eksplisit. **Tidak ada keputusan `proposed`** yang tersisa. 1 keputusan tetap **open** (PD-08) untuk durasi retensi, kebijakan penghapusan akun, dan target metrik final.

---

## Ringkasan Status Keputusan

| ID | Pokok Keputusan | Status | Tanggal Keputusan | Blokir Tahap Berikutnya? |
|---|---|---|---|---|
| PD-01 | Cakupan multi-kampus (arsitektur multi, pilot satu kampus) | **accepted** | 2026-10-13 | Ya (auth, filter kampus) |
| PD-02 | Definisi tim terbentuk (≥ 2 anggota aktif termasuk owner) | **accepted** | 2026-10-13 | Ya (metrik M4 & BR-10.2) |
| PD-03 | Pengelolaan katalog skill (seed data; UI admin post-MVP) | **accepted** | 2026-10-13 | Tidak (post-MVP) |
| PD-04 | Privasi email & pertukaran kontak opt-in | **accepted** | 2026-10-13 | Tidak (komunikasi MVP) |
| PD-05 | Bobot matching tetap (must_have = 5, nice_to_have = 2) | **accepted** | 2026-10-13 | Tidak (menutup Q-07) |
| PD-06 | Stack teknologi (React+TS+Vite, NestJS, PostgreSQL, Prisma, Tailwind) | **accepted** | 2026-10-13 | Ya (desain teknis) |
| PD-07 | Autentikasi (Argon2id + access/refresh + rotasi) | **accepted** | 2026-10-13 | Ya (auth) |
| PD-08 | Kebijakan retensi, penghapusan akun & target metrik | **open** | — | Ya (risiko & kepatuhan) |

---

## PD-01 — Cakupan Multi-Kampus

| Aspek | Detail |
|---|---|
| **ID** | PD-01 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Arsitektur **mendukung banyak kampus**, tetapi **pilot MVP dimulai dari satu kampus**. Registrasi menggunakan **daftar domain email kampus yang diizinkan** (allowlist). Pencarian dan rekomendasi kandidat **boleh lintas kampus** dalam MVP, dengan **filter kampus**. Daftar kampus dan domain dikelola **admin platform**. Nama kampus pilot: `[INPUT PILOT]`. Domain email yang diizinkan untuk pilot: `[INPUT PILOT]` (satu atau lebih domain, mis. `@student.[INPUT PILOT]` — nilai aktual harus dilengkapi). Alumni dan pengguna umum **belum termasuk** pengguna MVP. |
| **Alasan** | Memperluas jangkauan tanpa mengorbankan fokus pilot. Allowlist domain menjaga kepercayaan (verifikasi email kampus) sambil menyiapkan arsitektur untuk ekspansi. Filter lintas kampus memberi fleksibilitas tanpa memaksa pencocokan lintas kampus. |
| **Dampak Produk** | 1) Validasi registrasi mengacu pada allowlist, bukan satu domain tunggal.<br>2) FR-06/FR-07 memerlukan **filter kampus**.<br>3) Persona C (Admin Kampus) diberi catatan: untuk pilot satu kampus, tetapi peran admin platform disiapkan untuk multi-kampus.<br>4) Alumni/umum eksplisit di luar scope MVP. |
| **Dampak Arsitektur** | 1) Perlu entitas **`Campus` / `AllowedDomain`** (id, nama_kampus, domain, aktif).<br>2) `User`/`Profile` perlu atribut `campus_id` (FK ke Campus).<br>3) Validasi BR-01.1/AC-01.2 diubah menjadi berbasis allowlist.<br>4) Satu instance PostgreSQL cukup untuk MVP (multi-kampus logis, bukan multi-tenant fisik). |
| **Hal yang Masih Perlu Dilengkapi** | 1) Nama kampus pilot: `[INPUT PILOT]`.<br>2) Daftar domain yang diizinkan untuk pilot: `[INPUT PILOT]`.<br>3) Mekanisme pendaftaran kampus baru pasca-pilot (manual oleh admin platform). |
| **Bagian PRD Terkait** | Bagian 1.3; Bagian 1.6; Bagian 2.1 (Persona C); **BR-01.1 & AC-01.2** (FR-01); FR-06/FR-07 (filter kampus); Bagian 9.1 (`Campus`/`AllowedDomain`, `User.campus_id`); Q-02 |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan arah desain (arsitektur multi, pilot satu kampus, allowlist domain, filter lintas kampus, admin platform, placeholder kampus/domain). |

---

## PD-02 — Definisi Tim Terbentuk

| Aspek | Detail |
|---|---|
| **ID** | PD-02 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Tim dinyatakan **terbentuk** (`formed`) apabila memiliki minimal **2 (dua) anggota aktif**, **termasuk owner**. Owner dihitung sebagai anggota aktif dan **tidak boleh dihitung dua kali**. Jika jumlah anggota aktif **turun menjadi kurang dari 2** (yaitu 1), status peluang **kembali menjadi `open`**. Jika jumlah anggota aktif **kembali menjadi minimal 2**, status peluang kembali menjadi `formed`. |
| **Alasan** | Menghindari klaim tim yang tidak nyata; memastikan ada kolaborasi minimal dua pihak; menyelaraskan definisi internal dengan metrik keberhasilan M4. |
| **Dampak Produk** | 1) **Menjawab Q-03** (definisi resmi "tim terbentuk").<br>2) Status peluang berubah menjadi `formed` **hanya** setelah syarat ≥ 2 anggota aktif terpenuhi (memperkuat BR-10.2).<br>3) Anggota non-aktif (`keluar`/`dikeluarkan`) **tidak dihitung** dalam syarat terbentuk.<br>4) Transisi status: `open` → `formed` (saat mencapai 2 anggota aktif) dan `formed` → `open` (saat turun menjadi 1 anggota aktif). Tidak ada status baru yang diperkenalkan.<br>5) Owner dihitung **satu kali** dalam penghitungan anggota aktif. |
| **Dampak Arsitektur** | 1) Atribut status pada `TeamMembership` (`aktif` / `keluar` / `dikeluarkan`) menjadi sumber penghitungan jumlah anggota aktif.<br>2) Status `Opportunity` perlu **dihitung ulang** setiap kali keanggotaan berubah (anggota ditambah, keluar, atau dikeluarkan).<br>3) Tidak memerlukan perubahan skema konseptual baru (sudah tercakup di Bagian 9.1 PRD & AR-7 untuk invalidasi). |
| **Hal yang Masih Berstatus Belum Final (pertanyaan terbuka)** | 1) Apakah "anggota aktif" persis berarti `TeamMembership.status = aktif`, atau perlu flag ketersediaan terpisah? — **terbuka**.<br>2) Apakah penggantian anggota (keluar lalu masuk anggota lain) memengaruhi perhitungan ulang transisi `formed`/`open`? — **terbuka**.<br>3) Apakah perlu masa tunggu/kontribusi minimum sebelum dihitung aktif? — **terbuka**. |
| **Batasan MVP** | Tidak menambahkan status baru (mis. `incomplete`, `disbanded`). Hanya transisi `open` ↔ `formed` yang didefinisikan; perilaku status lain (`draft`/`closed`/`expired`) tidak diubah. |
| **Bagian PRD Terkait** | **BR-10.2** & **AC-10.2**, **AC-10.4–AC-10.6** (FR-10); M4 (Bagian 3.1); Bagian 7.5 (Alur 5); Bagian 9.1 (`TeamMembership`); Q-03 (Bagian 12.4) |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan eksplisit (minimal 2 anggota aktif termasuk owner, owner tidak dihitung dua kali, `formed` → `open` saat turun menjadi 1 anggota aktif, konsisten dengan status peluang yang sudah ada). |

---

## PD-03 — Pengelolaan Katalog Skill oleh Admin

| Aspek | Detail |
|---|---|
| **ID** | PD-03 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Katalog skill awal disediakan melalui **seed data**. **Antarmuka admin untuk mengelola katalog skill ditunda dari MVP** (diprioritaskan pasca-MVP / P1). Seed data harus **idempoten**: eksekusi ulang tidak boleh membuat entri skill duplikat. Skill yang digunakan pada profil pengguna, persyaratan peluang, dan perhitungan matching **harus mengacu pada katalog yang konsisten** (referensi by id, bukan teks bebas). |
| **Alasan** | Menjaga integritas taksonomi skill (menjawab RT-02: duplikasi skill merusak matching) sekaligus tidak menghambat validasi hipotesis inti MVP. User tidak dibiarkan menjadi kurator katalog secara bebas (BR-03.1). |
| **Dampak Produk** | 1) **Menjawab Q-04** (pemelihara katalog): katalog awal = seed data oleh developer; UI admin = P1.<br>2) Admin UI **berada di luar jalur kritis MVP**.<br>3) Selama admin UI belum ada, katalog diisi lewat **seed data idempoten** (bukan impor manual ad-hoc).<br>4) Skill yang sudah dipakai (profil/requirement) **tidak dapat dihapus tanpa konsekuensi**; perilaku ini menunggu definisi (lihat pertanyaan terbuka). |
| **Dampak Arsitektur** | 1) Perlu peran/role `admin` disiapkan untuk pasca-MVP (belum wajib dipakai di MVP).<br>2) Perlu mekanisme *seeding* idempoten (kunci unik pada `Skill.nama` + kategori, atau `upsert` berdasarkan slug) agar eksekusi ulang tidak menduplikasi.<br>3) `UserSkill` & `PositionSkillRequirement` **wajib mereferensikan `Skill.id`** (FK), sehingga perubahan nama katalog tidak memutus referensi.<br>4) Penghapusan skill yang masih direferensikan harus dicegah atau di-*soft* (lihat pertanyaan terbuka). |
| **Hal yang Masih Berstatus Belum Final (pertanyaan terbuka)** | 1) Kebijakan **skill nonaktif** (apakah tetap terlihat pada profil/requirement lama, dan bagaimana pengaruhnya ke matching) — **terbuka**.<br>2) Kebijakan **perubahan nama skill** yang sudah dipakai (apakah diperbolehkan, dan bagaimana riwayat/referensinya) — **terbuka**.<br>3) Perilaku saat **skill tidak ditemukan** (referensi hilang) pada profil atau requirement — **terbuka**.<br>4) Apakah usulan skill baru dari pengguna (BR-03.5) masuk MVP atau ikut ditunda bersama admin UI — **terbuka**. |
| **Batasan MVP** | Pengguna **tidak** dapat membuat skill bebas; skill diambil hanya dari katalog (BR-03.1). Skill yang sudah digunakan **tidak diasumsikan dapat dihapus** tanpa konsekuensi. UI admin tidak dikerjakan pada MVP. |
| **Bagian PRD Terkait** | **F-03a** (Bagian 5); BR-03.1, BR-03.5 (FR-03); F-16 (Laporan & moderasi, P1); Bagian 9.1 (`Skill`, `SkillCategory`); RT-02 (Bagian 12.2); Q-04 (Bagian 12.4) |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan eksplisit (seed data idempoten, admin UI ditunda dari MVP, katalog harus konsisten di profil/requirement/matching). |

---

## PD-04 — Privasi Email & Pertukaran Kontak Opt-In

| Aspek | Detail |
|---|---|
| **ID** | PD-04 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Email **tidak pernah ditampilkan** pada profil publik. Lamaran dapat berisi **pesan pengantar** (≤500 karakter, BR-08.5). Setelah lamaran berstatus **`accepted`**, **pemilik peluang dapat mengajukan pertukaran kontak**; **kandidat harus menyetujui (opt-in)** sebelum email dibagikan. **Nomor telepon tidak wajib** dalam MVP. **Status, waktu, dan pihak yang menyetujui** disimpan untuk **audit trail**. **Chat internal tetap di luar MVP** (F-17, P2). |
| **Alasan** | Melindungi data pribadi (RT-05), mengurangi spam, dan menjaga agar komunikasi terjadi atas persetujuan kedua pihak. Pesan pengantar memberi konteks sebelum pertukaran kontak. |
| **Dampak Produk** | 1) Memperjelas BR-02.4: email tidak pernah publik.<br>2) Menambahkan alur pasca-`accepted`: `contact_requested` → `contact_approved`/`rejected` dengan notifikasi.<br>3) F-17 (chat) tetap P2 — tidak terpengaruh.<br>4) Pesan pengantar sudah tercakup di BR-08.5. |
| **Dampak Arsitektur** | 1) Endpoint profil publik **wajib mengecualikan** `email`.<br>2) Perlu entitas **`ContactExchange`** (id, application_id, requested_by, requested_at, consented_by, consented_at, status: `pending`/`approved`/`rejected`).<br>3) FR-11 memerlukan dua event notifikasi baru.<br>4) Audit trail via field status/waktu/pihak. |
| **Hal yang Masih Perlu Dilengkapi** | Tidak ada placeholder yang belum terisi untuk PD-04. Jika nomor telepon dipertimbangkan di masa depan, perlu field profil tambahan. |
| **Bagian PRD Terkait** | **BR-02.4** (FR-02); BR-08.5 (FR-08); BR-06.3 (FR-06); F-17 (P2); FR-11 (Notifikasi `contact_requested`/`contact_approved`); Bagian 8 (Privasi Data); Bagian 9.1 (`ContactExchange`); RT-05; Q-06 |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan arah desain (opt-in dua pihak, owner mengajukan setelah accepted, kandidat menyetujui, tanpa telepon wajib, audit trail, chat di luar MVP). |

---

## PD-05 — Bobot Skill: Default Sistem & Dapat Disesuaikan

| Aspek | Detail |
|---|---|
| **ID** | PD-05 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Bobot matching bersifat **tetap**: `must_have` = **5**, `nice_to_have` = **2**. **Owner tidak dapat mengubah bobot**. Nilai kecocokan skill dipertahankan: memenuhi skill = **1,0**; kecocokan parsial = **0,7**; tidak memiliki skill = **0**. Rumus dipertahankan: **`S = 100 × Σ(wᵢ × mᵢ) / Σ(wᵢ)`**, dengan `wᵢ` = bobot tetap dan `mᵢ` = nilai kecocokan skill. **Input bobot oleh owner dihapus dari MVP.** |
| **Alasan** | Menyederhanakan alur bagi owner (menurunkan beban, lihat A-02) dan menghilangkan kebutuhan UI/validasi bobot pada MVP, tanpa mengubah definisi kecocokan skill yang sudah ada. Bobot tetap membuat hasil lebih mudah diprediksi dan diuji. |
| **Dampak Produk** | 1) **Menutup Q-07**: bobot tetap 5/2, tidak dapat diubah owner.<br>2) Memperkuat nilai default di BR-05.2 dan AR-5.<br>3) Field input bobot **dihilangkan** dari FR-05, Alur 2 (Bagian 7.2), dan UI.<br>4) Nilai Unik "Bobot skill yang bisa diatur pemilik proyek" **tidak berlaku** pada MVP (bobot tetap). |
| **Dampak Arsitektur** | 1) `PositionSkillRequirement.bobot` **tidak perlu** input dari owner; nilainya diturunkan dari `jenis` (must_have = 5, nice_to_have = 2).<br>2) `RecommendationService` memakai bobot tetap; penanganan bobot kosong/tidak valid (AR-5) tetap ada sebagai pengaman, bukan sebagai fitur.<br>3) Tidak ada kebutuhan UI/skema untuk pengaturan bobot oleh owner. |
| **Hal yang Masih Berstatus Belum Final (pertanyaan terbuka)** | 1) Definisi pasti **kriteria kecocokan parsial** (kapan tepatnya sebuah skill dihitung parsial vs penuh) — **terbuka**, tidak diubah tanpa dasar dokumen.<br>2) **Penanganan denominator nol** pada rumus `Σ(wᵢ) = 0` (mis. posisi tanpa requirement) — **terbuka**.<br>3) Apakah `level_minimum` (opsional) tetap dipertahankan persis seperti definisi saat ini — **terbuka**. |
| **Batasan MVP** | Owner **tidak** memiliki kontrol bobot. Definisi kecocokan skill, kriteria parsial, dan penanganan denominator nol **tidak diubah** dari dokumen yang ada; hal yang belum ditentukan tetap menjadi pertanyaan terbuka. |
| **Bagian PRD Terkait** | **BR-05.2 & BR-05.5** (FR-05); Bagian 6.1 (`Bobot w`); **AR-5 & AR-7** (Bagian 6.3); Bagian 6.2 (rumus); Bagian 6.4 (contoh perhitungan); Bagian 7.2 (Alur 2); Bagian 1.6 (Nilai Unik); Q-07 & A-02 (Bagian 12) |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan eksplisit (bobot tetap must_have = 5 & nice_to_have = 2, owner tidak dapat mengubah, input bobot dihapus dari MVP, rumus & nilai kecocokan dipertahankan). |

---

## PD-06 — Stack Teknologi

| Aspek | Detail |
|---|---|
| **ID** | PD-06 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Stack utama ditetapkan: **Frontend** = React + TypeScript + **Vite**; **Backend** = NestJS + TypeScript; **Database** = PostgreSQL; **ORM** = Prisma; **Styling** = Tailwind CSS. **TanStack Query, Zustand, shadcn/ui, dan library tambahan lainnya tidak diwajibkan** oleh keputusan ini — penggunaannya dapat ditentukan kemudian sesuai kebutuhan. |
| **Alasan** | React & NestJS sudah dikonfirmasi pada tahap sebelumnya (Bagian 10 PRD). PostgreSQL dipilih untuk integritas relasional & transaksional (slot/lamaran). Prisma menyederhanakan akses data & migrasi tipe-aman dengan TypeScript. Vite mempercepat pengembangan & build frontend. Tailwind mempercepat pembangunan UI yang konsisten. |
| **Dampak Produk** | Tidak ada perubahan perilaku produk; mempercepat eksekusi karena fondasi teknis jelas dan tidak menimbulkan keputusan teknologi tambahan yang belum disetujui. |
| **Dampak Arsitektur** | 1) **Menjawab Q-09** (database & ORM: PostgreSQL + Prisma).<br>2) PostgreSQL menjadi acuan untuk transaksi atomik slot (RT-03).<br>3) Prisma memengaruhi struktur layer akses data (perlu adaptasi pola repository NestJS).<br>4) Tailwind menambahkan standar styling pada frontend (perlu diselaraskan dengan target aksesibilitas WCAG 2.1 AA di Bagian 8).<br>5) Vite menjadi tooling build/dev frontend. |
| **Hal yang Masih Berstatus Belum Final (pertanyaan terbuka)** | 1) **State management / data fetching** frontend (mis. TanStack Query, Zustand, atau lainnya) — **belum diwajibkan**, dapat ditentukan kemudian.<br>2) Apakah memakai **komponen library** (mis. shadcn/ui) di atas Tailwind — **belum diwajibkan**.<br>3) Untuk multi-kampus (PD-01), apakah satu instance PostgreSQL cukup atau perlu pemisahan data per kampus — **terbuka**.<br>4) Strategi migrasi Prisma pada lingkungan multi-lingkungan — **terbuka**. |
| **Batasan MVP** | Tidak menambahkan **versi paket**, **dependency baru**, atau **keputusan teknologi tambahan** yang belum disetujui. TanStack Query / Zustand / shadcn/ui **tidak wajib**. |
| **Bagian PRD Terkait** | Bagian 10.1 & 10.2 (Arsitektur; baris **Frontend**, **Database**, **ORM**, **Styling**); Bagian 10.3 (Prinsip Arsitektur); Bagian 8 (Aksesibilitas); RT-03 (Bagian 12.2); Q-09 (Bagian 12.4) |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan eksplisit (React+TS+Vite, NestJS, PostgreSQL, Prisma, Tailwind; TanStack Query/Zustand/shadcn tidak diwajibkan). |

---

## PD-07 — Autentikasi (Argon2id + Access/Refresh + Rotasi)

| Aspek | Detail |
|---|---|
| **ID** | PD-07 |
| **Status** | **accepted** (2026-10-13) |
| **Keputusan** | Autentikasi **email + password**. **Hashing Argon2id** dengan **konfigurasi awal m=19456 KiB, t=2, p=1** (parameter **dapat disesuaikan setelah benchmark** lingkungan deployment). **Verifikasi email sebelum melamar** (BR-01.3). Reset password dan verifikasi email memakai **token sekali pakai yang kedaluwarsa** (TTL spesifik **belum final**). **Access token 15 menit**, **refresh token 7 hari** dan **dirotasi setiap kali digunakan**. Refresh token disimpan **secara aman sebagai hash** (jangan menyimpan token mentah). **Deteksi reuse refresh token** aktif — bila reuse terdeteksi, **cabut sesi terkait** (family/session). **Tanpa device fingerprinting** pada MVP. **Cookie, rotasi, logout, invalidasi sesi, rate limiting, dan perlindungan CSRF** dirancang secara **konsisten** (httpOnly, Secure, SameSite; TTL & batas rate limiting spesifik belum final). |
| **Alasan** | Argon2id resisten terhadap serangan GPU/ASIC. Access pendek + refresh 7 hari + rotasi menyeimbangkan keamanan & kenyamanan. Penyimpanan hash mencegah kebocoran token mentah. Reuse detection mencegah pencurian sesi. |
| **Dampak Produk** | 1) Q-09 (bagian autentikasi) terjawab untuk hashing & token.<br>2) Alur verifikasi email & reset password menjadi eksplisit.<br>3) Logout harus menginvalidasi refresh token. |
| **Dampak Arsitektur** | 1) Perlu entitas **`RefreshToken`** (id, user_id, token_hash, family_id, expires_at, revoked_at, created_at).<br>2) Endpoint `/auth/refresh`, `/auth/logout`, `/auth/verify-email`, `/auth/reset-password`.<br>3) Middleware access token (Bearer) + cookie refresh token.<br>4) Rate limiting pada login/refresh/reset (angka belum final).<br>5) CSRF via SameSite + Origin/Referer check (tanpa fingerprinting). |
| **Hal yang Masih Berstatus Belum Final** | 1) TTL token verifikasi email & reset password (belum disepakati).<br>2) Batas rate limiting (angka belum final).<br>3) Parameter Argon2id dapat disesuaikan setelah benchmark. |
| **Bagian PRD Terkait** | **FR-01** (BR-01.1–01.4, AC-01.1–01.4); Bagian 8 (Keamanan — Argon2id, rate limiting, CSRF); Bagian 10.2 (Autentikasi & Email verifikasi); Bagian 9.1 (`User.password_hash`, `RefreshToken`); RT-04; Q-09 |
| **Riwayat** | 2026-10-13 — status `proposed` → `accepted` berdasarkan persetujuan arah desain (15 menit/7 hari, rotasi, hash storage, reuse detection, tanpa fingerprinting, Argon2id m=19456 t=2 p=1 awal, token sekali pakai kedaluwarsa, cookie/CSRF/rate limit konsisten). |

---

## PD-08 — Kebijakan Retensi, Penghapusan Akun & Target Metrik

| Aspek | Detail |
|---|---|
| **ID** | PD-08 |
| **Status** | **open** |
| **Keputusan** | Kebijakan **retensi data**, **penghapusan akun**, dan **target metrik** harus ditinjau **sebelum pilot**. **Tidak ada angka retensi yang dianggap final** tanpa peninjauan. Kebijakan privasi & penghapusan akun wajib ditinjau sebelum pilot. Target **M1–M7 diperlakukan sebagai baseline hipotesis** yang akan dievaluasi setelah pilot. |
| **Alasan** | Menyangkut kepatuhan privasi (UU PDP), kepercayaan pengguna, dan keandalan pengukuran keberhasilan. Menunda keputusan berisiko pada masalah kepatuhan dan metrik yang tidak dapat diukur saat pilot. |
| **Dampak Produk** | 1) Mekanisme "hapus akun" belum dapat diimplementasikan final tanpa kebijakan.<br>2) Definisi metrik (M1–M7) belum final → instrumentasi tracking belum bisa dikunci.<br>3) Berpotensi menjadi penghambat rilis bila tidak diselesaikan sebelum pilot. |
| **Dampak Arsitektur** | 1) Perlu mekanisme soft delete + anonimisasi vs hard delete (masih `open`).<br>2) Perlu strategi arsip data untuk peluang kedaluwarsa (Bagian 9.5).<br>3) Perlu skema event tracking untuk M1–M7 (Bagian 3). |
| **Hal yang Perlu Dikonfirmasi** | 1) Durasi retensi lamaran ditolak, peluang kedaluwarsa, dan data akun terhapus — **tetap `open`, belum final**.<br>2) Soft delete + anonimisasi atau hard delete — **tetap `open`**.<br>3) Target M1–M7 — **hipotesis, belum final**.<br>4) Siapa yang bertanggung jawab meninjau kepatuhan (legal)? |
| **Bagian PRD Terkait** | Bagian 3 (M1–M7 — hipotesis); Bagian 8 (Privasi Data & hak hapus); **Bagian 9.5** (Retensi & Penghapusan — `open`); Bagian 11.2 (DoD — kebijakan privasi); Q-11 & Q-13 (Bagian 12.4) |
| **Catatan** | **Tetap `open`** sesuai instruksi. Tidak diubah menjadi `accepted`. Tidak ada angka retensi/target yang dianggap final. |

---

## Dialog Konflik dengan PRD

| # | Keputusan | Lokasi PRD | Jenis | Status Tindak Lanjut |
|---|---|---|---|---|
| **K1** | PD-01 (multi-kampus, pilot satu, allowlist, filter lintas kampus) | Bagian 1.3; **BR-01.1**; **AC-01.2**; Bagian 2.1 (Persona C); FR-06/FR-07; Bagian 9.1; Q-02 | **Konflik langsung** — **terselesaikan pada 2026-10-13** | PRD diperbarui: BR-01.1 & AC-01.2 berbasis allowlist, entitas `Campus`/`AllowedDomain`, atribut `campus_id`, filter kampus di FR-06/FR-07, Q-02 ditandai terjawab (lihat PRD v1.1). |
| **K2** | PD-02 (min 2 anggota aktif termasuk owner; `formed` ↔ `open`) | **BR-10.2**; **AC-10.2**, AC-10.4–10.6; M4; Bagian 7.5 | Konsistensi + penajaman — **terselesaikan pada 2026-10-13** | PRD diperbarui: BR-10.2 (min 2 anggota aktif termasuk owner, owner tidak dihitung dua kali, transisi `formed` → `open`), AC-10.4–10.6 (transisi 2→1→2), M4, Alur 5; Q-03 ditandai terjawab (lihat PRD v1.2). |
| **K3** | PD-05 (bobot tetap must_have = 5, nice_to_have = 2; owner tidak dapat mengubah) | BR-05.2; AC-05.1; AC-05.3; Bagian 6.1/6.2; AR-5; Bagian 7.2; Bagian 1.6; Q-07 | Penajaman — **terselesaikan pada 2026-10-13** | PRD diperbarui: bobot tetap 5/2, input bobot owner dihapus (FR-05, Alur 2), rumus `S = 100 × Σ(wᵢ×mᵢ) / Σ(wᵢ)` & nilai kecocokan 1,0/0,7/0 dipertahankan, Q-07 ditandai terjawab. |
| **K4** | PD-06 (React+TS+Vite, NestJS, PostgreSQL, Prisma, Tailwind) | Bagian 10.1; Bagian 10.2; Bagian 10.3; Q-09 | Penajaman — **terselesaikan pada 2026-10-13** | PRD diperbarui: stack ditandai accepted (Vite/PostgreSQL/Prisma/Tailwind), TanStack Query/Zustand/shadcn tidak diwajibkan, Q-09 ditandai terjawab (tanpa versi paket/dependency baru). |
| **K5** | PD-04 (email tidak publik + pertukaran opt-in) | BR-02.4; BR-06.3; FR-08; FR-11; Bagian 9.1; F-17 | Penajaman — **terselesaikan pada 2026-10-13** | PRD diperbarui: BR-02.4 (tidak pernah publik), FR-08/FR-11 (ContactExchange + notifikasi), entitas `ContactExchange`, Q-06 ditandai terjawab. |
| **K6** | PD-07 (Argon2id + access/refresh + rotasi) | Bagian 8; Bagian 10.2; FR-01; Bagian 9.1 | Penajaman — **terselesaikan pada 2026-10-13** | PRD diperbarui: Argon2id m=19456 t=2 p=1 (awal), access 15m/refresh 7d, hash storage, reuse detection, CSRF/rate limit konsisten, entitas `RefreshToken`, Q-09 (auth) ditandai terjawab. |

---

## Ketergantungan & Urutan Penyelesaian

| Urutan | Keputusan | Status | Alasan Urutan |
|---|---|---|---|
| 1 | **PD-01 (cakupan kampus)** | accepted | Menentukan aturan autentikasi & privasi; memengaruhi PD-04, PD-06, PD-07. |
| 2 | **PD-07 (autentikasi)** | accepted | Bergantung pada PD-01 (kebijakan domain email). |
| 3 | **PD-04 (privasi email & komunikasi)** | accepted | Bergantung pada PD-01 & PD-07. |
| 4 | **PD-02 (definisi tim)** | accepted | Menutup definisi metrik M4 & BR-10.2. |
| 5 | **PD-05 (bobot)** | accepted | Melengkapi algoritma; tidak menghambat. |
| 6 | **PD-03 (katalog skill)** | accepted | Admin UI post-MVP; tidak menghambat jalur kritis. |
| 7 | **PD-06 (stack)** | accepted | Menentukan fondasi teknis. |
| 8 | **PD-08 (retensi & metrik)** | open | Menghambat rilis; perlu ditinjau sebelum pilot. |

---

## Catatan Pemeliharaan

- Setiap perubahan status keputusan harus dicatat dengan tanggal & pemilik keputusan.
- Bila keputusan menjadi `accepted`, `docs/PRD.md` diperbarui secara **terarah** hanya pada bagian terkait (bagian "Dialog Konflik dengan PRD"), dengan tetap menjaga riwayat perubahan.
- Dokumen ini **tidak** menggantikan PRD; ia melengkapi dan menyelaraskan.
- 2026-10-13 — PD-01, PD-04, PD-07 dicatat `accepted` berdasarkan persetujuan arah desain eksplisit. PD-02, PD-03, PD-05, PD-06 tetap `proposed`. PD-08 tetap `open`.
- 2026-10-13 (v1.2) — PD-02, PD-03, PD-05, PD-06 diubah menjadi `accepted` berdasarkan persetujuan eksplisit (finalisasi keputusan produk). **Tidak ada keputusan `proposed` yang tersisa.** PD-08 tetap `open`. Riwayat sebelumnya tidak dihapus; status lama dicatat pada baris riwayat masing-masing keputusan.

---

**Akhir Dokumen — Product Decisions Log v1.2 (Finalisasi Keputusan, 2026-10-13).**
