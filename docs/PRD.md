# Product Requirements Document (PRD)

## Aplikasi Pencarian Rekan Tim Lomba dan Proyek Berbasis Web dengan Rekomendasi Berdasarkan Kecocokan Keahlian

| Atribut | Keterangan |
|---|---|
| **Nama Produk (kerja)** | TeamSearch |
| **Versi Dokumen** | 1.2 (Finalisasi Keputusan 2026-10-13) |
| **Status** | Diperbarui — 7 keputusan accepted (PD-01 s.d. PD-07); PD-08 open; menunggu input kampus/domain pilot |
| **Penyusun** | Senior Product Manager & Business Analyst |
| **Tanggal** | 2026-10-13 |
| **Repositori** | `C:\Users\ASUS\Documents\AllProject\teamsearch` |
| **Target Rilis MVP** | _[Perlu konfirmasi — usulan 6–8 minggu]_ |
| **Dokumen Keputusan** | `docs/PRODUCT_DECISIONS.md` v1.2 (2026-10-13) |

> **Catatan Status (2026-10-13, v1.2):** PD-01 s.d. PD-07 berstatus **accepted** (finalisasi keputusan produk). **Tidak ada keputusan `proposed`** yang tersisa. PD-08 tetap **open** (retensi, penghapusan akun, target M1–M7 sebagai hipotesis). Placeholder `[INPUT PILOT]` menandai nama kampus pilot dan domain email yang belum dilengkapi — jangan dikarang. Belum ada source code, migrasi, atau konfigurasi aplikasi yang dibuat.

---

## Daftar Isi

1. [Product Overview](#1-product-overview)
2. [Target Users dan User Personas](#2-target-users-dan-user-personas)
3. [Product Goals dan Success Metrics](#3-product-goals-dan-success-metrics)
4. [Scope dan Prioritas Fitur](#4-scope-dan-prioritas-fitur)
5. [Functional Requirements](#5-functional-requirements)
6. [Skill Matching Recommendation](#6-skill-matching-recommendation)
7. [User Flow](#7-user-flow)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Data Requirements](#9-data-requirements)
10. [Proposed Technical Architecture](#10-proposed-technical-architecture)
11. [Acceptance Criteria dan MVP Definition of Done](#11-acceptance-criteria-dan-mvp-definition-of-done)
12. [Risks, Assumptions, dan Open Questions](#12-risks-assumptions-dan-open-questions)

---

## 1. Product Overview

### 1.1 Latar Belakang Masalah

Mahasiswa dan individu aktif sering kali harus membentuk tim untuk mengikuti kompetisi, hackathon, kompetisi akademik (PKM, GEMASTIK, lomba karya tulis), atau mengerjakan proyek bersama. Pembentukan tim saat ini sangat bergantung pada **jaringan pertemanan dan grup chat informal** (WhatsApp, LINE, Discord, Instagram Story).

Cara ini memiliki keterbatasan mendasar: jangkauan terbatas pada lingkaran sosial terdekat, tidak ada informasi terstruktur tentang keahlian calon rekan, dan tidak ada mekanisme objektif untuk menilai apakah komposisi tim sudah sesuai kebutuhan proyek. Akibatnya tim sering terbentuk **kebetulan**, bukan **berdasarkan kebutuhan**.

### 1.2 Permasalahan Utama Calon Anggota Tim

| # | Masalah | Dampak |
|---|---|---|
| P1 | **Sulit menemukan orang dengan keahlian spesifik** (mis. "backend developer yang paham NestJS") di luar lingkaran pertemanan. | Tim kekurangan peran kunci atau memaksa satu orang mengerjakan bidang yang tidak dikuasai. |
| P2 | **Tidak ada visibilitas atas keahlian orang lain.** Skill hanya diketahui lewat obrolan, bukan profil terstruktur. | Proses rekrutmen rekan tim memakan waktu lama dan berbasis tebakan. |
| P3 | **Komposisi tim tidak seimbang** — semua orang menguasai bidang yang sama. | Proyek gagal menyelesaikan komponen penting, gagal di tahap seleksi, atau kalah di penjurian. |
| P4 | **Tidak jelas siapa masih butuh anggota dan siapa yang tersedia.** | Banyak peluang terlewat; pengumuman tercecer di banyak grup berbeda. |
| P5 | **Proses ajakan bergabung berantakan** — via DM dengan informasi tidak lengkap, sering tidak direspons, dan statusnya tidak terlacak. | Kandidat maupun pemilik proyek tidak tahu posisi mereka; komunikasi berulang. |
| P6 | **Kritik terhadap solusi umum:** grup chat tidak bisa difilter, dicari, atau memberi alasan mengapa seseorang cocok. | Keputusan perekrutan tidak dapat dipertanggungjawabkan dan sulit diulang. |

### 1.3 Solusi yang Ditawarkan

TeamSearch adalah **platform web terpusat** di lingkungan kampus yang menghubungkan:

- **Pemilik peluang** (mahasiswa yang membuka tim untuk lomba atau proyek), dan
- **Kandidat** (mahasiswa yang mencari tim dan ingin menyumbangkan keahliannya).

Solusi inti:

1. **Profil keahlian terstruktur** — setiap pengguna mendefinisikan skill, level, dan portofolio (via tautan) sehingga keahlian menjadi data yang dapat dicari, bukan asumsi.
2. **Definisi kebutuhan tim yang eksplisit** — pemilik peluang mendefinisikan posisi yang dibutuhkan (mis. Frontend Developer, UI/UX Designer), masing-masing dengan daftar skill wajib (*must-have*) dan skill nilai tambah (*nice-to-have*) beserta bobot pentingnya.
3. **Rekomendasi berbasis kecocokan keahlian** — sistem menghitung *skill match score* 0–100 untuk setiap kandidat dan menampilkan **alasan transparan** mengapa kandidat tersebut direkomendasikan (skill mana yang cocok, mana yang kurang).
4. **Alur lamaran terstruktur** — kandidat mengajukan diri untuk posisi tertentu, pemilik peluang menerima/menolak, dan statusnya tercatat serta dinotifikasi.

### 1.4 Visi Produk

> "Menjadikan pembentukan tim di lingkungan kampus sebagai proses yang **berbasis data keahlian dan kebutuhan nyata**, bukan sekadar kedekatan sosial — sehingga setiap mahasiswa berkesempatan berkontribusi pada tim yang tepat."

### 1.5 Tujuan Produk

| # | Tujuan | Penjelasan |
|---|---|---|
| G1 | **Mempercepat penemuan kandidat** | Pemilik peluang dapat menemukan kandidat relevan melalui rekomendasi, bukan mengandalkan jaringan pribadi. |
| G2 | **Meningkatkan kualitas kecocokan tim** | Rekomendasi berbasis skill menaikkan proporsi kandidat yang benar-benar sesuai kebutuhan peran. |
| G3 | **Menyediakan transparansi rekomendasi** | Setiap skor disertai alasan yang bisa dipahami dan diverifikasi pengguna. |
| G4 | **Menyederhanakan alur rekrutmen tim** | Satu alur baku untuk mengajukan, mengelola, dan memutuskan lamaran beserta statusnya. |
| G5 | **Membentuk tim nyata** | Ukuran keberhasilan akhir: jumlah tim yang benar-benar terbentuk melalui platform. |

### 1.6 Nilai Unik Produk

| Nilai Unik | Mengapa Berbeda dari Alternatif |
|---|---|
| **Skill-first matchmaking** | Berbeda dari grup chat/forum. Kandidat diurutkan berdasarkan kecocokan terukur dengan kebutuhan peran. |
| **Penjelasan "kenapa direkomendasikan"** | Berbeda dari algoritma *black box*. Setiap rekomendasi menampilkan daftar skill cocok, skill kurang, dan skor per posisi. |
| **Bobot skill yang konsisten & terukur** | Berbeda dari pencarian teks biasa. Bobot bersifat **tetap** (must-have = 5, nice-to-have = 2) sesuai PD-05, sehingga prioritas rekomendasi konsisten dan dapat diverifikasi tanpa memerlukan konfigurasi manual oleh pemilik proyek. |
| **Berorientasi kampus** | Konteks akademik (PKM, GEMASTIK, hackathon internal) menjadi fokus awal, sehingga taksonomi skill dan kebutuhan cocok dengan realitas kampus. |

---

## 2. Target Users dan User Personas

### 2.1 Ringkasan Pengguna

| Tipe Pengguna | Deskripsi | Peran Utama |
|---|---|---|
| **Persona A: Pemilik Peluang (Team Owner)** | Mahasiswa yang membuka tim untuk lomba/proyek dan butuh mengisi posisi. | Membuat peluang, mendefinisikan skill, mencari & menilai kandidat, mengelola tim. |
| **Persona B: Kandidat (Team Seeker)** | Mahasiswa yang ingin bergabung ke tim dan menyumbangkan keahliannya. | Melengkapi profil, mencari peluang, mengajukan diri, memantau status. |
| **Persona C: Admin Kampus _(Post-MVP)_** | Dosen/staf/operator yang mengelola data kampus. | Moderasi, kurasi data lomba, penanganan laporan. |

> **Catatan keputusan:** Pada MVP, **Persona A dan Persona B adalah akun yang sama** — satu mahasiswa dapat berperan ganda (membuat peluang sekaligus mengajukan diri ke peluang lain). Pemisahan peran hanya diberlakukan jika validasi produk menunjukkan kebutuhan berbeda.

### 2.2 Persona A — Pemilik Peluang

| Aspek | Detail |
|---|---|
| **Profil contoh** | Rani, Mahasiswa Teknik Informatika semester 5. Ketua tim PKM-KC. |
| **Kebutuhan** | Mencari 3 anggota dengan skill spesifik: UI/UX Designer, Backend Developer, dan Data Analyst. |
| **Kesulitan saat ini** | Menyebar pengumuman di banyak grup, mendapat respons acak, tidak tahu level keahlian pelamar, harus menilai manual dari chat. |
| **Tujuan** | Dalam 1–2 minggu mendapatkan tim yang komposisinya seimbang. |
| **Kriteria nilai** | "Saya butuh tahu siapa yang paling cocok dengan peran yang saya butuhkan, dan kenapa." |
| **Risiko/beban utama** | Terlalu banyak pelamar tidak relevan sehingga waktu terkuras. |

### 2.3 Persona B — Kandidat

| Aspek | Detail |
|---|---|
| **Profil contoh** | Dimas, Mahasiswa Sistem Informasi semester 3. Menguasai React (Intermediate) dan Figma (Beginner). |
| **Kebutuhan** | Menemukan proyek/lomba yang cocok dengan keahliannya, terutama yang butuh frontend. |
| **Kesulitan saat ini** | Tidak tahu proyek apa yang sedang mencari keahliannya; merasa "tidak punya kenalan" untuk ikut tim. |
| **Tujuan** | Bergabung ke setidaknya satu tim nyata dan menambah portofolio. |
| **Kriteria nilai** | "Saya ingin tahu proyek mana yang keahlian saya benar-benar dibutuhkan." |
| **Risiko/beban utama** | Mengirim banyak lamaran tanpa umpan balik; menghabiskan waktu tanpa hasil. |

### 2.4 Kebutuhan, Kesulitan, dan Tujuan (Matriks)

| Dimensi | Pemilik Peluang | Kandidat |
|---|---|---|
| **Kebutuhan** | Kandidat relevan; penilaian cepat; kontrol atas komposisi tim. | Peluang yang cocok dengan skill; proses mengajukan yang jelas; umpan balik status. |
| **Kesulitan** | Jangkauan terbatas; penyaringan manual; pelamar tidak relevan. | Tidak tahu peluang mana yang butuh skill-nya; tanpa umpan balik. |
| **Tujuan** | Tim seimbang & siap lomba. | Masuk tim nyata, tambah pengalaman. |
| **Fitur MVP yang menjawab** | Definisi kebutuhan skill, rekomendasi kandidat, manajemen lamaran, manajemen anggota. | Profil skill, rekomendasi peluang, pengajuan diri, notifikasi status. |

---

## 3. Product Goals dan Success Metrics

### 3.1 Tujuan Produk dan Metrik Keberhasilan

| # | Tujuan | Metrik Utama | Baseline | Target MVP (3 bulan) | Cara Ukur |
|---|---|---|---|---|---|
| M1 | Profil pengguna terisi lengkap & layak untuk matching | **% pengguna dengan profil lengkap** (≥3 skill + minimal 1 posisi/keahlian) | 0% | **≥ 60%** dari pengguna terdaftar | Query DB (kelengkapan field wajib skill) |
| M2 | Rekomendasi relevan dan dipercaya | **Presisi rekomendasi** — % kandidat dengan skor ≥ 60 yang benar-benar di-*review* atau dilanjutkan oleh pemilik peluang | Tidak ada data | **≥ 40%** presisi | Analitik event: view rekomendasi → action (undang/terima) |
| M3 | Aktivitas lamaran | **Jumlah lamaran (application) per peluang aktif** | 0 | **≥ 3 lamaran** per peluang aktif | Agregasi tabel `application` |
| M4 | Keberhasilan inti produk | **Jumlah tim yang berhasil terbentuk** (peluang berstatus `formed` = minimal 2 anggota **aktif** termasuk owner; owner dihitung **satu kali**) | 0 | **≥ 10 tim** | Agregasi status peluang = `formed` |
| M5 | Retensi & kesehatan ekosistem | **% peluang yang terisi minimal 1 posisi** dalam 30 hari | 0 | **≥ 35%** | Query DB; cohort peluang |
| M6 | Pengalaman rekrutmen | **Median waktu dari buka peluang → anggota pertama diterima** | Tidak ada data | **≤ 10 hari** | Selisih timestamp |
| M7 | Transparansi diterima pengguna | **% pengguna yang membuka panel penjelasan skor** | Tidak ada | **≥ 30%** dari pengguna yang melihat daftar rekomendasi | Event tracking |

### 3.2 Metrik Pendukung (Opsional, Monitoring)

- Rasio lamaran diterima vs ditolak (indikator keseimbangan pasar dua sisi).
- Jumlah peluang aktif per kategori lomba/proyek (mendeteksi ketimpangan supply-demand).
- Waktu rata-rata pengisian profil.

> **Catatan (PD-08):** Target di atas (M1–M7, termasuk kolom "Target MVP (3 bulan)") adalah **baseline hipotesis** dan harus divalidasi setelah data uji coba terbatas (pilot) di satu program studi atau himpunan. **Jangan menganggap angka ini final.**

---

## 4. Scope dan Prioritas Fitur

### 4.1 Definisi Prioritas

| Prioritas | Arti | Kriteria Masuk |
|---|---|---|
| **P0 — MVP** | Wajib ada agar produk dapat memvalidasi tujuan utama (pencocokan skill → lamaran → tim terbentuk). | Tanpa fitur ini, hipotesis utama produk tidak dapat diuji. |
| **P1 — Pasca-MVP** | Penting untuk skala & kenyamanan setelah asumsi inti tervalidasi. | Menambah retensi/efisiensi, tetapi produk masih bisa diuji tanpa itu. |
| **P2 — Lanjutan** | Pengembangan jangka panjang, bergantung data & sumber daya tim. | Membutuhkan basis pengguna, data historis, atau infrastruktur tambahan. |

### 4.2 Tabel Scope Fitur

| ID | Fitur | Prioritas | Alasan Penempatan |
|---|---|---|---|
| F-01 | Registrasi & login (email kampus) | **P0** | Prasyarat semua fitur. |
| F-02 | Profil pengguna & portofolio via tautan | **P0** | Keahlian terstruktur adalah fondasi matching. |
| F-03 | Pengelolaan keahlian (tambah/ubah/hapus skill + level) | **P0** | Input utama algoritma rekomendasi. |
| F-04 | Pembuatan & pengelolaan peluang (lomba/proyek) | **P0** | Sisi *supply* pasar; tanpa ini tak ada yang dicari. |
| F-05 | Penentuan posisi & skill yang dibutuhkan (bobot wajib/nice-to-have) | **P0** | Menentukan target pencocokan. |
| F-06 | Pencarian & filter kandidat (skill, level, ketersediaan) | **P0** | Jalur eksplorasi manual saat rekomendasi belum dipercaya. |
| F-07 | **Rekomendasi kandidat berdasarkan kecocokan skill + penjelasan** | **P0** | Diferensiasi inti & hipotesis utama produk. |
| F-08 | Pengajuan bergabung (kandidat → peluang) | **P0** | Menghubungkan dua sisi. |
| F-09 | Pengelolaan lamaran (terima/tolak/shortlist) | **P0** | Pemilik peluang butuh keputusan tercatat. |
| F-10 | Manajemen anggota tim (daftar anggota, peran, status posisi) | **P0** | Menutup siklus "tim berhasil terbentuk". |
| F-11 | Notifikasi status lamaran (in-app) | **P0** | Umpan balik dasar; mencegah kandidat "menunggu tanpa kabar". |
| F-12 | Rekomendasi peluang untuk kandidat (reverse matching) | **P1** | Simetris dengan F-07; mempercepat sisi kandidat. |
| F-13 | Bookmark/disimpan peluang & kandidat | **P1** | Efisiensi, bukan kebutuhan validasi inti. |
| F-14 | Dashboard analitik pemilik peluang (jumlah pelamar, distribusi skill) | **P1** | Berguna setelah jumlah peluang bertambah. |
| F-15 | Email digest notifikasi | **P1** | Mengurangi kebergantungan pada kunjungan aktif. |
| F-16 | Laporan & moderasi konten | **P1** | Perlu saat skala pengguna & peluang bertambah. |
| F-17 | Chat internal antar pengguna | **P2** | Keputusan: MVP memakai notifikasi in-app + kontak via tautan/email kampus. Perlu upaya realtime & moderasi. |
| F-18 | Upload file (CV/portofolio PDF, gambar) | **P2** | Perlu object storage & antrean validasi; link portofolio cukup untuk MVP. |
| F-19 | Penjadwalan wawancara/onboarding otomatis | **P2** | Fitur kenyamanan tingkat lanjut. |
| F-20 | Verifikasi identitas & badge prestasi | **P2** | Bernilai saat skala lintas kampus; di lingkup internal kampus, email kampus sudah cukup. |
| F-21 | Model *learning-to-rank* berbasis data historis | **P2** | Memerlukan data lamaran dalam jumlah memadai; lihat Bagian 6.5. |
| F-22 | Aplikasi mobile native | **P2** | Web responsif sudah mencukupi untuk validasi. |

### 4.3 Fitur yang Sengaja **Dikeluarkan** dari MVP

| Dikecualikan | Justifikasi |
|---|---|
| Chat internal | Kompleksitas realtime, moderasi, dan penyimpanan tidak diperlukan untuk memvalidasi kecocokan skill. Notifikasi in-app + informasi kontak kampus sudah memadai. |
| Upload file | Link portofolio (GitHub/Behance/LinkedIn/Drive) memberikan nilai serupa dengan biaya infrastruktur jauh lebih rendah. |
| Verifikasi identitas berlapis | Login email kampus sudah menjadi sinyal kepercayaan memadai di lingkup internal. |
| Sistem poin/reputasi | Sulit dinilai secara adil tanpa data historis; berisiko memicu perilaku gamifikasi yang tidak diinginkan. |
| Pembayaran/monetisasi | Di luar tujuan produk saat ini. |
| Kategori skill yang dibuat bebas tanpa kurasi | Menimbulkan duplikat (mis. "React.js", "reactjs", "React JS") yang merusak matching. MVP memakai katalog terkurasi (lihat F-03a). |

---

## 5. Functional Requirements

### 5.0 Legenda

- **Aktor:** `Guest`, `User (Kandidat)`, `User (Pemilik Peluang)`, `Sistem`.
- **Aturan bisnis** ditandai `BR-xx`; **Acceptance Criteria (AC)** ditulis dalam format Given/When/Then ringkas.

---

### FR-01 — Registrasi, Login, dan Autentikasi  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-01 → F-01 |
| **Aktor** | Guest, User |
| **Deskripsi** | Pengguna mendaftar memakai email kampus dan kata sandi; dapat login, logout, dan mereset kata sandi. |
| **Aturan Bisnis** | **BR-01.1** Hanya email dengan **domain kampus yang terdaftar/diizinkan** (allowlist `AllowedDomain`/`Campus`) yang diterima. Arsitektur mendukung banyak kampus; pilot MVP dimulai dari satu kampus: **`[INPUT PILOT]`** dengan domain **`[INPUT PILOT]`** (nilai aktual harus dilengkapi; jangan dikarang). Alumni dan pengguna umum di luar scope MVP.<br>**BR-01.2** Kata sandi minimal 8 karakter, mengandung huruf dan angka. Penyimpanan menggunakan **Argon2id** (lihat Bagian 8).<br>**BR-01.3** Email harus unik dan **terverifikasi sebelum dapat melamar** (token sekali pakai yang kedaluwarsa; TTL belum final, lihat Bagian 8).<br>**BR-01.4** Sesi menggunakan **access token 15 menit** dan **refresh token 7 hari** (httpOnly cookie, rotasi tiap pakai, reuse detection; lihat Bagian 8 & 10.2). Akses endpoint terproteksi wajib menyertakan access token valid. Daftar kampus/domain dikelola **admin platform**. Pencarian & rekomendasi **boleh lintas kampus** dengan filter kampus (FR-06/FR-07). |
| **Alur Utama** | 1) Guest mengisi email kampus + kata sandi (domain dicek terhadap allowlist). 2) Sistem mengirim tautan verifikasi (token sekali pakai). 3) Pengguna memverifikasi. 4) Pengguna login (access 15m + refresh 7d via cookie) dan diarahkan melengkapi profil. 5) Reset password via token sekali pakai yang kedaluwarsa. |
| **Kondisi Sukses** | Akun aktif terverifikasi; sesi terbentuk (access + refresh); pengguna diarahkan ke langkah pelengkapan profil. |
| **Edge Cases** | Email dengan domain yang tidak terdaftar (tolak dengan pesan "Domain email belum terdaftar untuk kampus pilot"); email sudah terdaftar (pesan jelas); token verifikasi/reset kedaluwarsa (minta ulang); reuse refresh token terdeteksi → cabut sesi terkait; terlalu banyak percobaan login/refresh/reset (rate limiting, batas belum final). |

**Acceptance Criteria**
- **AC-01.1** Given email dengan domain yang terdaftar untuk kampus pilot, When saya mendaftar dengan kata sandi valid, Then akun dibuat berstatus `unverified` dan email verifikasi terkirim (token sekali pakai).
- **AC-01.2** Given email dengan domain yang **tidak terdaftar** pada allowlist, When saya mendaftar, Then sistem menolak dengan pesan "Domain email belum terdaftar untuk kampus pilot".
- **AC-01.3** Given akun belum terverifikasi, When mencoba mengajukan lamaran, Then sistem meminta verifikasi email terlebih dahulu.
- **AC-01.4** Given kata sandi kurang dari 8 karakter, Then sistem menampilkan galat validasi sebelum mengirim permintaan.

---

### FR-02 — Profil Pengguna dan Portofolio  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-02 → F-02 |
| **Aktor** | User |
| **Deskripsi** | Pengguna mengelola identitas profesional: nama tampilan, program studi, angkatan `[PERLU KONFIRMASI: apakah wajib?]`, bio singkat, lokasi/kampus, dan tautan portofolio eksternal. |
| **Aturan Bisnis** | **BR-02.1** Field wajib: nama tampilan, bio (≤ 300 karakter), minimal 1 skill.<br>**BR-02.2** Tautan portofolio harus berupa URL valid dengan skema `https`.<br>**BR-02.3** Indikator "Profil Lengkap" muncul bila pengguna memiliki ≥ 3 skill DAN ≥ 1 tautan portofolio ATAU bio terisi.<br>**BR-02.4** **Email tidak pernah ditampilkan pada profil publik.** Profil dapat dilihat oleh pemilik peluang, tetapi email **hanya dibagikan setelah pertukaran kontak opt-in**: pemilik peluang mengajukan pertukaran kontak setelah lamaran `accepted`, kandidat harus menyetujui sebelum email dibagikan (lihat FR-08/FR-11 dan entitas `ContactExchange` di Bagian 9.1). Nomor telepon tidak wajib dalam MVP. Status, waktu, dan pihak yang menyetujui disimpan untuk audit trail. Chat internal tetap di luar MVP (F-17, P2). | |
| **Kondisi Sukses** | Profil tersimpan, indikator kelengkapan ter-*update*, dan profil muncul pada hasil pencarian/rekomendasi. |
| **Edge Cases** | Bio melebihi batas (potong/validasi), tautan duplikat (izinkan tapi tandai), pengguna belum mengisi skill (profil tidak masuk kandidat rekomendasi — lihat BR-06.6). |

**Acceptance Criteria**
- **AC-02.1** Given pengguna login, When mengisi nama, bio, dan 3 skill, Then status profil berubah menjadi "Lengkap".
- **AC-02.2** Given URL portofolio tidak valid, When disimpan, Then sistem menolak dengan pesan kesalahan spesifik.
- **AC-02.3** Given profil lengkap, When pemilik peluang membuka detail kandidat, Then seluruh keahlian dan tautan portofolio tampil.

---

### FR-03 — Pengelolaan Keahlian Pengguna  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-03 → F-03 |
| **Aktor** | User |
| **Deskripsi** | Pengguna menambahkan, mengubah, dan menghapus skill dari katalog, masing-masing dengan **level proficiency**: `Beginner` / `Intermediate` / `Advanced`. Pengguna juga dapat menandai **ketersediaan** (mis. "tersedia untuk proyek") `[PERLU KONFIRMASI: apakah masuk MVP? — usulan: ya, sederhana boolean]`. |
| **Aturan Bisnis** | **BR-03.1** Skill diambil dari katalog terkurasi (F-03a), bukan input bebas, untuk mencegah duplikasi.<br>**BR-03.2** Maksimal 20 skill per pengguna.<br>**BR-03.3** Skill yang sama tidak dapat ditambahkan dua kali.<br>**BR-03.4** Level bersifat wajib; tanpa level, skill dianggap `Beginner`.<br>**BR-03.5** Usulan skill baru (di luar katalog) masuk antrean tinjauan, tidak langsung dipakai dalam matching. |
| **Kondisi Sukses** | Daftar skill pengguna tersimpan dan langsung memengaruhi skor pada rekomendasi berikutnya. |
| **Edge Cases** | Menambah skill duplikat (tolak), menghapus skill yang sedang dibutuhkan (diizinkan; skor rekomendasi peluang terkait turun otomatis), level tidak dipilih (default Beginner). |

**Acceptance Criteria**
- **AC-03.1** Given katalog skill terbuka, When saya memilih "React" dengan level `Intermediate`, Then skill tersimpan dan tampil di profil.
- **AC-03.2** Given saya sudah memiliki "React", When menambahkannya lagi, Then sistem menolak duplikasi dengan pesan jelas.
- **AC-03.3** Given saya menaikkan level skill dari `Beginner` ke `Advanced`, When rekomendasi dimuat ulang, Then skor kecocokan peluang terkait memperhitungkan level baru.

**FR-03a — Katalog Skill Terkurasi `[P0, bagian dari F-03]`**
- Katalog awal berisi kategori (Frontend, Backend, Mobile, UI/UX, Data Science, DevOps, Manajemen Proyek, Desain Grafis, dll.) dan minimal 50–80 skill umum.
- **BR-03.6** **[PD-03, accepted 2026-10-13]** Katalog awal disediakan melalui **seed data** oleh developer. **Antarmuka admin untuk mengelola katalog skill ditunda dari MVP** (P1).
- **BR-03.7** **[PD-03]** **Seed data wajib idempoten**: mengeksekusi seed berulang kali **tidak boleh** membuat entri skill duplikat (kunci unik berdasarkan nama/kategori atau `upsert`).
- **BR-03.8** **[PD-03]** Skill pada profil pengguna (`UserSkill`), persyaratan peluang (`PositionSkillRequirement`), dan perhitungan matching **wajib mengacu pada entri katalog yang konsisten** (referensi by id, bukan teks bebas). Pengguna **tidak** dapat membuat skill bebas; skill yang sudah digunakan **tidak diasumsikan dapat dihapus tanpa konsekuensi**.
- **Pertanyaan terbuka (PD-03):** kebijakan **skill nonaktif**, kebijakan **perubahan nama skill** yang telah dipakai, dan perilaku saat **skill tidak ditemukan** — **belum ditentukan**; lihat Bagian 12.4 (Q-04/Q-16).

---

### FR-04 — Pembuatan dan Pengelolaan Peluang (Lomba/Proyek)  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-04 → F-04 |
| **Aktor** | Pemilik Peluang |
| **Deskripsi** | Pengguna membuat peluang dengan judul, deskripsi, jenis (`lomba` / `proyek`), kategori, tenggat pendaftaran, durasi/estimasi, status (`open`/`closed`/`formed`), dan lokasi/mode (online/offline/hybrid). |
| **Aturan Bisnis** | **BR-04.1** Field wajib: judul, deskripsi (≤ 2000 karakter), jenis, tenggat, dan minimal 1 posisi dibutuhkan.<br>**BR-04.2** Sebuah peluang hanya dapat dibuat oleh akun terverifikasi dengan profil lengkap.<br>**BR-04.3** Peluang dengan tenggat yang sudah lewat otomatis berstatus `expired` dan tidak muncul di daftar aktif.<br>**BR-04.4** Pemilik peluang dapat mengubah dan menutup peluang kapan saja.<br>**BR-04.5** Peluang dapat disimpan sebagai draf. |
| **Kondisi Sukses** | Peluang tersimpan, tampil di daftar publik, dan dapat diakses kandidat untuk melamar. |
| **Edge Cases** | Tenggat di masa lampau (tolak), deskripsi kosong (tolak), menutup peluang dengan pelamar aktif (wajib konfirmasi + beri tahu pelamar). |

**Acceptance Criteria**
- **AC-04.1** Given akun terverifikasi & profil lengkap, When saya membuat peluang dengan 2 posisi, Then peluang tampil di daftar publik berstatus `open`.
- **AC-04.2** Given peluang dibuat dengan tenggat kemarin, Then sistem menolak penyimpanan.
- **AC-04.3** Given saya menutup peluang, Then peluang hilang dari daftar aktif dan semua pelamar menerima notifikasi status.

---

### FR-05 — Penentuan Posisi & Skill yang Dibutuhkan  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-05 → F-05 |
| **Aktor** | Pemilik Peluang |
| **Deskripsi** | Untuk setiap posisi (mis. "Frontend Developer"), pemilik menentukan daftar skill yang dibutuhkan dengan **jenis kebutuhan** (`must_have` / `nice_to_have`). Bobot bersifat **tetap** (`must_have` = 5, `nice_to_have` = 2; PD-05) dan **tidak dapat diubah** oleh pemilik. Setiap posisi juga punya jumlah slot. |
| **Aturan Bisnis** | **BR-05.1** Setiap posisi wajib memiliki minimal 1 skill `must_have`.<br>**BR-05.2** Bobot berjenis: `must_have` = **5**, `nice_to_have` = **2**. Bobot **bersifat tetap dan tidak dapat diubah oleh pemilik peluang** (PD-05, accepted 2026-10-13).<br>**BR-05.3** Jumlah slot ≥ 1.<br>**BR-05.4** Nama posisi diambil dari katalog peran (Frontend Developer, Backend Developer, UI/UX Designer, Data Scientist, dll.) `[PERLU KONFIRMASI: apakah boleh bebas? — usulan: katalog untuk konsistensi]`.<br>**BR-05.5** Perubahan komposisi skill (menambah/menghapus skill pada posisi) memicu penghitungan ulang skor kandidat. |
| **Kondisi Sukses** | Konfigurasi posisi & skill tersimpan; menjadi dasar vektor kebutuhan untuk algoritma rekomendasi (Bagian 6). |
| **Edge Cases** | Posisi tanpa skill `must_have` (tolak), posisi dengan requirement skill yang sama dua kali (tolak duplikat), skill dihapus dari posisi setelah ada pelamar (diizinkan; skor dihitung ulang, riwayat tidak diubah). |

**Acceptance Criteria**
- **AC-05.1** Given saya menambahkan posisi "Frontend Developer", When saya menetapkan `React` (must_have) dan `TypeScript` (nice_to_have), Then konfigurasi tersimpan dengan bobot tetap `React = 5` dan `TypeScript = 2`, dan **tidak ada input bobot** yang ditampilkan ke saya.
- **AC-05.2** Given posisi tanpa skill must_have, Then sistem menolak menyimpan posisi tersebut.
- **AC-05.3** Given saya menambahkan skill `Docker` (nice_to_have) ke posisi tersebut, When saya membuka halaman rekomendasi, Then urutan kandidat dihitung ulang menggunakan bobot tetap (`Docker = 2`; PD-05).

---

### FR-06 — Pencarian & Filter Kandidat  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-06 → F-06 |
| **Aktor** | Pemilik Peluang |
| **Deskripsi** | Pemilik peluang mencari kandidat dengan filter: skill (wajib dimiliki), level minimal, ketersediaan, program studi `[PERLU KONFIRMASI]`, dan kata kunci nama/bio. Hasil diurutkan default berdasarkan relevansi skill. |
| **Aturan Bisnis** | **BR-06.1** Pencarian hanya menampilkan pengguna dengan profil publik & minimal 1 skill.<br>**BR-06.2** Filter skill bersifat AND (kandidat harus punya semua skill yang dipilih).<br>**BR-06.3** Pemilik peluang tidak melihat data pribadi sensitif (email tidak pernah publik, lihat BR-02.4; alamat/nomor telepon juga tidak tampil).<br>**BR-06.4** Hasil pencarian dipaginasi (default 10–20 per halaman).<br>**BR-06.5** **[BARU]** Pencarian dan rekomendasi **boleh lintas kampus** dalam MVP, dengan **filter kampus** (berbasis `campus_id`). Tanpa filter, hasil lintas kampus ditampilkan. Arsitektur mendukung banyak kampus; pilot dari satu kampus `[INPUT PILOT]` (PD-01). |
| **Kondisi Sukses** | Daftar kandidat terfilter tampil dengan waktu muat wajar. |
| **Edge Cases** | Tidak ada hasil (tampilkan saran melonggarkan filter), filter terlalu ketat (peringatan), input kosong (kembali ke daftar default). |

**Acceptance Criteria**
- **AC-06.1** Given filter `skill = React AND level ≥ Intermediate`, When saya menerapkan filter, Then hanya kandidat yang memenuhi keduanya ditampilkan.
- **AC-06.2** Given tidak ada kandidat memenuhi filter, Then sistem menampilkan empty state dengan saran.
- **AC-06.3** Given 50 kandidat memenuhi filter, Then hasil ditampilkan dalam halaman terpaginasi tanpa memuat seluruh data sekaligus.

---

### FR-07 — Rekomendasi Kandidat Berdasarkan Kecocokan Keahlian  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-07 → F-07 |
| **Aktor** | Pemilik Peluang |
| **Deskripsi** | Untuk setiap posisi, sistem menghitung *skill match score* (0–100) setiap kandidat dan menampilkan daftar terurut beserta **penjelasan**: skill cocok, skill kurang (`missing`), kecocokan level, dan kontribusi bobot. |
| **Aturan Bisnis** | **BR-07.1** Skor dihitung dengan algoritma pada Bagian 6 (Weighted Skill Match + level + partial credit).<br>**BR-07.2** Rekomendasi **selalu** menyertakan penjelasan tekstual; skor tanpa penjelasan tidak boleh ditampilkan.<br>**BR-07.3** Kandidat dengan 0 skill `must_have` yang cocok tidak ditampilkan sebagai rekomendasi utama (masuk bagian "kandidat kurang cocok" bila ada).<br>**BR-07.4** Pemilik peluang tidak dapat melihat rekomendasi kandidat yang memblokir dirinya `[PERLU KONFIRMASI: apakah fitur blokir masuk MVP? — usulan: tidak]`.<br>**BR-07.5** Perhitungan bersifat deterministik: input sama → skor sama (dapat diuji).<br>**BR-07.6** **[BARU]** Rekomendasi **mendukung lintas kampus** dengan **filter kampus** opsional (PD-01). Tanpa filter kampus, kandidat dari berbagai kampus terdaftar dapat muncul; dengan filter, hasil dibatasi pada kampus terpilih. |
| **Kondisi Sukses** | Daftar kandidat terurut dengan skor dan penjelasan yang dapat diverifikasi secara manual dengan rumus Bagian 6. |
| **Edge Cases** | Tidak ada kandidat cocok (tampilkan saran), kandidat tanpa skill terisi (dikecualikan, BR-06.1/BR-07.3), bobot posisi belum diatur (pakai default), peluang tanpa skill lengkap (wajib dilengkapi sebelum rekomendasi aktif). |

**Acceptance Criteria**
- **AC-07.1** Given posisi "Backend Developer" membutuhkan `Node.js` (must, bobot 5) + `PostgreSQL` (must, bobot 4) + `Docker` (nice, bobot 2), When saya membuka tab rekomendasi, Then kandidat terurut dari skor tertinggi ke terendah.
- **AC-07.2** Given seorang kandidat cocok 2 dari 3 skill, Then skor mencerminkan kecocokan sebagian (partial credit) dan bukan 0.
- **AC-07.3** Given sebuah rekomendasi, When saya membuka panel penjelasan, Then sistem menampilkan daftar skill cocok, skill kurang, dan skor akhir + rincian perhitungan.
- **AC-07.4** Given data kandidat dan konfigurasi posisi tidak berubah, When rekomendasi dihitung dua kali, Then skor identik.

---

### FR-08 — Pengajuan Bergabung (Kandidat → Peluang)  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-08 → F-08 |
| **Aktor** | Kandidat |
| **Deskripsi** | Kandidat menjelajah peluang dan mengajukan diri untuk **posisi tertentu** dengan menyertakan pesan singkat (cover note). |
| **Aturan Bisnis** | **BR-08.1** Kandidat hanya dapat mengajukan pada posisi yang sesuai dengan skill yang dimilikinya `[PERLU KONFIRMASI: apakah ini batasan keras? — usulan: peringatan, bukan blokir]`.<br>**BR-08.2** Satu kandidat maksimal satu lamaran aktif per posisi.<br>**BR-08.3** Lamaran hanya bisa dibuat untuk peluang berstatus `open` dan belum lewat tenggat.<br>**BR-08.4** Pemilik peluang tidak dapat melamar ke posisi peluangnya sendiri.<br>**BR-08.5** Pesan pengajuan maksimal 500 karakter. |
| **Kondisi Sukses** | Lamaran tersimpan berstatus `pending`; pemilik peluang menerima notifikasi; kandidat melihat status lamarannya. |
| **Edge Cases** | Sudah melamar posisi sama (tolak duplikat), peluang ditutup saat proses (tolak dengan pesan), profil belum lengkap (arahkan melengkapi profil dulu). |

**Aturan Bisnis — Pertukaran Kontak (PD-04, accepted 2026-10-13)**
- **BR-08.6** Email tidak pernah ditampilkan pada profil publik. Pertukaran kontak **hanya setelah lamaran `accepted`**, melalui **permintaan pemilik peluang** dan **persetujuan kandidat (opt-in dua pihak)** sebelum email dibagikan. Nomor telepon tidak wajib dalam MVP. Status, waktu, dan pihak yang menyetujui disimpan untuk audit trail (entitas `ContactExchange`). Chat internal tetap di luar MVP (F-17, P2).

**Acceptance Criteria**
- **AC-08.1** Given peluang `open` dan profil saya lengkap, When saya melamar posisi "UI/UX Designer" dengan pesan pengantar (≤500 karakter), Then lamaran tersimpan berstatus `pending` dan muncul di daftar lamaran saya.
- **AC-08.2** Given saya sudah melamar posisi tersebut, When mencoba melamar lagi, Then sistem menolak dengan pesan duplikasi.
- **AC-08.3** Given peluang sudah ditutup, Then tombol melamar tidak tersedia dan endpoint mengembalikan penolakan yang jelas.
- **AC-08.4** Given lamaran berstatus `accepted`, When pemilik peluang mengajukan pertukaran kontak, Then sistem membuat `ContactExchange` berstatus `pending` dan kandidat menerima notifikasi `contact_requested`.
- **AC-08.5** Given `ContactExchange` berstatus `pending`, When kandidat menyetujui, Then status menjadi `approved`, email dibagikan kepada kedua pihak, dan audit trail (status/waktu/pihak) tercatat; When kandidat menolak, Then status menjadi `rejected` dan tidak ada email yang dibagikan.

---

### FR-09 — Pengelolaan Lamaran  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-09 → F-09 |
| **Aktor** | Pemilik Peluang |
| **Deskripsi** | Pemilik peluang melihat semua lamaran per peluang/posisi, dengan skor kecocokan sebagai kolom bantu, lalu menetapkan status: `shortlisted`, `accepted`, atau `rejected`. |
| **Aturan Bisnis** | **BR-09.1** Status lamaran: `pending` → `shortlisted` → `accepted`/`rejected`.<br>**BR-09.2** Status `accepted` tidak boleh melebihi jumlah slot posisi (mencegah tim kelebihan anggota).<br>**BR-09.3** Setiap perubahan status memicu notifikasi ke kandidat.<br>**BR-09.4** Keputusan `accepted`/`rejected` dapat dibatalkan (revert) sebelum tim dikunci `[PERLU KONFIRMASI: apakah perlu?]`.<br>**BR-09.5** Skor kecocokan hanya bersifat **informasi pendukung**; keputusan akhir tetap pada pemilik peluang. |
| **Kondisi Sukses** | Status tersimpan, tercatat pada riwayat, dan kandidat menerima notifikasi terkait. |
| **Edge Cases** | Menerima melebihi slot (tolak), pelamar membatalkan sebelum diputuskan (status `withdrawn`), peluang ditutup dengan lamaran `pending` (otomatis `rejected` + notifikasi). |

**Acceptance Criteria**
- **AC-09.1** Given slot posisi = 1 dan sudah ada 1 kandidat `accepted`, When saya mencoba menerima kandidat kedua, Then sistem menolak dengan pesan "Slot posisi penuh".
- **AC-09.2** Given saya mengubah status lamaran menjadi `accepted`, Then kandidat menerima notifikasi in-app dan masuk daftar anggota tim.
- **AC-09.3** Given saya mereview lamaran, Then skor kecocokan dan ringkasan skill kandidat tampil sebagai kolom pendukung.

---

### FR-10 — Pengelolaan Anggota Tim  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-10 → F-10 |
| **Aktor** | Pemilik Peluang, Anggota |
| **Deskripsi** | Setelah lamaran diterima, kandidat menjadi anggota tim. Pemilik peluang dapat melihat daftar anggota beserta peran/posisi, dan menandai posisi sebagai "terisi". |
| **Aturan Bisnis** | **BR-10.1** Anggota tim otomatis berstatus pemilik peluang.<br>**BR-10.2** **[PD-02, accepted 2026-10-13]** Peluang dianggap **`formed`** bila memiliki minimal **2 (dua) anggota aktif**, **termasuk owner**. Owner dihitung sebagai anggota aktif dan **tidak dihitung dua kali**. Jika jumlah anggota aktif **turun menjadi kurang dari 2** (yaitu 1), status peluang **kembali menjadi `open`**; bila kembali menjadi minimal 2 anggota aktif, status kembali `formed`. Anggota berstatus `keluar`/`dikeluarkan` **tidak dihitung**.<br>**BR-10.3** Pemilik dapat mengeluarkan anggota (dengan konfirmasi) dan memberi alasan.<br>**BR-10.4** Anggota dapat keluar dari tim sendiri `[PERLU KONFIRMASI: apakah masuk MVP? — usulan: ya, sederhana]`.<br>**BR-10.5** Riwayat perubahan anggota dicatat (berguna untuk audit). |
| **Kondisi Sukses** | Daftar anggota akurat, status posisi ter-*update*, dan status peluang (`open`/`formed`) dihitung ulang secara konsisten setiap kali keanggotaan aktif berubah. |
| **Edge Cases** | Owner mengeluarkan anggota sehingga anggota aktif turun menjadi 1 (peluang kembali `open`), anggota keluar sebelum tim dikunci, slot melebihi kapasitas (diatur oleh BR-09.2). |
| **Pertanyaan terbuka (PD-02)** | Apakah "anggota aktif" persis `TeamMembership.status = aktif` atau perlu flag tersendiri; apakah penggantian anggota (keluar–masuk) memicu perhitungan ulang; apakah perlu masa tunggu sebelum dihitung aktif — **belum ditentukan** (lihat Bagian 12.4, Q-03). |

**Acceptance Criteria**
- **AC-10.1** Given 1 kandidat `accepted`, Then ia muncul di daftar anggota dengan peran sesuai posisi yang dilamar.
- **AC-10.2** Given peluang memiliki **tepat 2 anggota aktif** (owner + 1 anggota lain), Then status peluang berubah menjadi **`formed`** dan tercatat pada metrik M4.
- **AC-10.3** Given saya mengeluarkan anggota, Then ia menerima notifikasi, slot posisinya kembali tersedia, dan riwayat tercatat.
- **AC-10.4** Given peluang berstatus `formed` dengan 2 anggota aktif, When satu anggota aktif keluar/dikeluarkan sehingga **jumlah anggota aktif turun menjadi 1**, Then status peluang **kembali menjadi `open`**.
- **AC-10.5** Given peluang berstatus `open` dengan 1 anggota aktif, When ditambahkan anggota aktif (mis. kandidat baru `accepted`) sehingga **jumlah anggota aktif kembali menjadi minimal 2**, Then status peluang **kembali menjadi `formed`**.
- **AC-10.6** Given peluang berstatus `formed`, When owner dihitung, Then owner dihitung **satu kali** dalam jumlah anggota aktif (tidak dihitung ganda).

---

### FR-11 — Notifikasi Status Lamaran (In-App)  `[P0]`

| Item | Detail |
|---|---|
| **ID** | FR-11 → F-11 |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem mencatat notifikasi untuk peristiwa kunci: lamaran baru, perubahan status lamaran, peluang ditutup, kandidat diterima/ditolak, dan anggota keluar/dikeluarkan. |
| **Aturan Bisnis** | **BR-11.1** Notifikasi in-app (belum email pada MVP; email digest P1).<br>**BR-11.2** Ada indikator jumlah notifikasi belum dibaca.<br>**BR-11.3** Notifikasi dapat ditandai terbaca (satu per satu atau massal).<br>**BR-11.4** Isi notifikasi memuat tautan langsung ke konteks terkait (lamaran/peluang).<br>**BR-11.5** **[BARU, PD-04]** Setelah lamaran `accepted`, sistem mengirim notifikasi `contact_requested` saat pemilik peluang mengajukan pertukaran kontak dan `contact_approved`/`contact_rejected` saat kandidat menyetujui/menolak (opt-in dua pihak). |
| **Kondisi Sukses** | Pengguna melihat notifikasi tepat waktu saat membuka aplikasi; status akurat. |
| **Edge Cases** | Penerima notifikasi menghapus akun/profil (notifikasi tetap tercatat secara internal), notifikasi duplikat (de-duplikasi berdasarkan peristiwa + entitas). |

**Acceptance Criteria**
- **AC-11.1** Given saya menerima lamaran baru, Then pemilik peluang melihat notifikasi "Lamaran baru untuk posisi X" dan indikator belum dibaca bertambah.
- **AC-11.2** Given lamaran saya berubah menjadi `accepted`, Then saya menerima notifikasi dengan tautan ke detail peluang.
- **AC-11.3** Given saya membuka daftar notifikasi, Then semua ditandai terbaca dan indikator hilang.
- **AC-11.4** Given pemilik peluang mengajukan pertukaran kontak, Then kandidat menerima notifikasi `contact_requested`.
- **AC-11.5** Given kandidat menyetujui pertukaran kontak, Then kedua pihak menerima notifikasi `contact_approved` dan email dibagikan; Given kandidat menolak, Then pemilik peluang menerima notifikasi `contact_rejected`.

---

### FR-12 — Rekomendasi Peluang untuk Kandidat (Reverse Matching)  `[P1]`

| Item | Detail |
|---|---|
| **ID** | FR-12 → F-12 |
| **Aktor** | Kandidat |
| **Deskripsi** | Sistem menampilkan peluang/posisi yang paling cocok dengan skill kandidat, memakai algoritma yang sama dari sisi kandidat. |
| **Aturan Bisnis** | **BR-12.1** Menggunakan skor simetris terhadap FR-07 (skill kandidat vs kebutuhan posisi).<br>**BR-12.2** Hanya peluang berstatus `open` dan belum lewat tenggat.<br>**BR-12.3** Menampilkan alasan "skill Anda cocok untuk posisi ini". |
| **Kondisi Sukses** | Kandidat melihat daftar peluang relevan dengan skor dan alasan. |

**Acceptance Criteria**
- **AC-12.1** Given saya punya skill `React (Advanced)` dan `Figma (Beginner)`, Then peluang yang membutuhkan React tampil lebih tinggi daripada yang membutuhkan Figma.
- **AC-12.2** Given tidak ada peluang cocok, Then sistem menampilkan empty state dan saran memperluas skill.

---

### FR-13 s.d. FR-16 — Fitur P1 (Ringkasan)

| ID | Fitur | Requirement Inti | AC Tingkat Tinggi |
|---|---|---|---|
| FR-13 | Bookmark peluang/kandidat | Simpan & buka kembali item untuk ditinjau. | Simpan lalu item muncul di daftar "Disimpan" dan dapat dihapus. |
| FR-14 | Dashboard analitik pemilik | Ringkasan jumlah pelamar, keterisian slot, distribusi skill pelamar. | Dashboard menampilkan angka sesuai data aktual `≤ 3 detik`. |
| FR-15 | Email digest notifikasi | Ringkasan harian/mingguan lamaran & status. | Digest terkirim sesuai jadwal dan dapat dimatikan di pengaturan. |
| FR-16 | Laporan & moderasi konten | Pengguna melaporkan peluang/profil tidak pantas; admin menindak. | Laporan tercatat dengan status tindak lanjut yang dapat diaudit. |

### FR-17 s.d. FR-22 — Fitur P2 (Ringkasan + Justifikasi)

| ID | Fitur | Prasyarat Sebelum Dikerjakan |
|---|---|---|
| FR-17 | Chat internal | Moderasi laporan (FR-16) dan kebijakan retensi pesan sudah ada. |
| FR-18 | Upload file | Object storage, pemindai file, dan kebijakan kuota ditetapkan. |
| FR-19 | Penjadwalan otomatis | Integrasi kalender dan preferensi waktu pengguna. |
| FR-20 | Verifikasi identitas & badge | Kebijakan data pribadi & sumber data prestasi yang dipercaya. |
| FR-21 | Learning-to-rank | Data historis lamaran (≥ 500–1000 interaksi) dan mekanisme evaluasi offline. |
| FR-22 | Aplikasi mobile native | Validasi web menunjukkan kebutuhan dan keterbatasan jelas. |

---

## 6. Skill Matching Recommendation

> **Pernyataan penting:** Algoritma ini adalah **perhitungan skor berbasis pembobotan (weighted scoring) dan pencocokan aturan**, **bukan** *machine learning*. Tidak ada pelatihan model, tidak ada pembelajaran dari data historis pada MVP. Semua rumus bersifat deterministik dan dapat dihitung ulang secara manual. Jalur evolusi ke pendekatan berbasis data dijelaskan di Bagian 6.5 — namun tidak dikerjakan sekarang.

### 6.1 Konsep Dasar

| Konsep | Definisi |
|---|---|
| **Skill** | Item dari katalog terkurasi (mis. `React`, `PostgreSQL`, `Figma`). |
| **Level Proficiency** | `Beginner = 1`, `Intermediate = 2`, `Advanced = 3`. |
| **Skill Requirement** | Pasangan (skill, jenis kebutuhan, bobot) pada sebuah posisi. |
| **Bobot (`w`)** | Tingkat kepentingan skill pada posisi, **bersifat tetap** (PD-05): `must_have = 5`, `nice_to_have = 2`. Owner tidak dapat mengubah bobot. |
| **Skor Kecocokan (`S`)** | Nilai 0–100 yang menyatakan seberapa cocok profil kandidat dengan satu posisi. |

### 6.2 Rumus Inti

Untuk seorang kandidat terhadap **satu posisi** dengan himpunan skill requirement $R$:

#### Langkah 1 — Skor per skill

Untuk setiap requirement $r \in R$:

```
match(r) = 1.0   jika kandidat memiliki skill r dengan level >= level yang dibutuhkan
         = 0.7   jika kandidat memiliki skill r dengan level <  level yang dibutuhkan (partial credit)
         = 0     jika kandidat tidak memiliki skill r
```

> Jika pemilik posisi **tidak menetapkan level minimum**, maka "level yang dibutuhkan" dianggap `Beginner` (1). Dengan demikian setiap kepemilikan skill bernilai penuh (1.0), dan partial credit hanya terjadi jika pemilik menetapkan level minimum lebih tinggi.

#### Langkah 2 — Bobot kontribusi

Setiap skill berkontribusi sebesar nilai bobotnya:

```
contrib(r) = w_r * match(r)
```

Bobot efektif ditentukan **tetap** oleh jenis kebutuhan (PD-05): `must_have` = 5, `nice_to_have` = 2. Owner tidak dapat mengubah bobot.

#### Langkah 3 — Skor akhir posisi (0–100)

```
S = 100 * ( SUM_r ( w_r * match(r) ) ) / ( SUM_r w_r )
```

Sifat rumus:
- **Normalisasi:** hasil selalu 0–100, tidak bergantung pada banyaknya skill.
- **Kandidat hanya cocok sebagian** tetap mendapat skor proporsional (bukan 0), sesuai partial credit.
- **Skill kosong / tidak terisi** dihitung sebagai `match = 0`, sehingga menurunkan skor secara proporsional — tidak dibuang dari perhitungan.

### 6.3 Aturan Tambahan (Business Rules Algoritma)

| Kode | Aturan |
|---|---|
| **AR-1** | Jika kandidat **tidak memiliki satu pun** skill `must_have` yang cocok, kandidat ditampilkan di bagian "Kandidat Kurang Cocok" (bukan rekomendasi utama). |
| **AR-2** | Jika kandidat tidak memiliki skill sama sekali (profil tidak lengkap), ia **dikecualikan** dari daftar rekomendasi (lihat BR-06.1). |
| **AR-3** | **Skill belum terisi / tidak ada di katalog:** dianggap tidak dimiliki (`match = 0`). Kandidat tidak dihukum karena skill di luar cakupan posisi (tidak ada penalti untuk skill berlebih). |
| **AR-4** | **Tie-breaker** (jika skor identik): (1) jumlah `must_have` yang cocok lebih banyak, lalu (2) total level proficiency pada skill yang cocok lebih tinggi, lalu (3) profil lebih lengkap (jumlah skill), lalu (4) waktu pembaruan profil terbaru. |
| **AR-5** | **Bobot bersifat tetap** (PD-05): `must_have` = 5, `nice_to_have` = 2. Nilai bobot yang tidak valid/kosong (mis. data lama) **dikembalikan ke bobot tetap** sesuai jenis kebutuhan — ini pengaman, bukan fitur konfigurasi. |
| **AR-6** | Semua kandidat dihitung terhadap **satu posisi pada satu waktu**, sehingga penjelasan selalu spesifik per posisi. |
| **AR-7** | Perubahan skill kandidat atau requirement posisi memicu invalidasi hasil rekomendasi (dihitung ulang saat diminta). |

### 6.4 Contoh Perhitungan dengan Data Fiktif

**Konteks:**
Posisi **"Backend Developer"** pada peluang "Hackathon Fintech 2026" memiliki requirement:

| Skill | Jenis | Bobot `w` | Level minimum |
|---|---|---|---|
| `Node.js` | must_have | 5 | Intermediate |
| `PostgreSQL` | must_have | 4 | Beginner |
| `Docker` | nice_to_have | 2 | Beginner |

Total bobot: `SUM w = 5 + 4 + 2 = 11`.

**Kandidat A — Dimas**

| Skill | Dimiliki? | Level | Butuh | `match` | `w × match` | Penjelasan |
|---|---|---|---|---|---|---|
| Node.js | Ya | Advanced (3) | Intermediate (2) | 1.0 | 5.0 | Level melebihi kebutuhan |
| PostgreSQL | Ya | Intermediate (2) | Beginner (1) | 1.0 | 4.0 | Level melebihi kebutuhan |
| Docker | Tidak | — | Beginner (1) | 0 | 0.0 | Skill belum dimiliki |

`S_A = 100 × (5.0 + 4.0 + 0.0) / 11 = 100 × 9/11 ≈` **81.8**

**Kandidat B — Sari**

| Skill | Dimiliki? | Level | Butuh | `match` | `w × match` | Penjelasan |
|---|---|---|---|---|---|---|
| Node.js | Ya | Beginner (1) | Intermediate (2) | 0.7 | 3.5 | Ada, tetapi level di bawah kebutuhan → partial credit |
| PostgreSQL | Ya | Beginner (1) | Beginner (1) | 1.0 | 4.0 | Sesuai kebutuhan |
| Docker | Ya | Intermediate (2) | Beginner (1) | 1.0 | 2.0 | Level melebihi kebutuhan |

`S_B = 100 × (3.5 + 4.0 + 2.0) / 11 = 100 × 9.5/11 ≈` **86.4**

**Kandidat C — Andi**

| Skill | Dimiliki? | Level | Butuh | `match` | `w × match` | Penjelasan |
|---|---|---|---|---|---|---|
| Node.js | Tidak | — | Intermediate (2) | 0 | 0.0 | Skill belum dimiliki |
| PostgreSQL | Ya | Advanced (3) | Beginner (1) | 1.0 | 4.0 | Level melebihi kebutuhan |
| Docker | Ya | Beginner (1) | Beginner (1) | 1.0 | 2.0 | Sesuai kebutuhan |

`S_C = 100 × (0.0 + 4.0 + 2.0) / 11 = 100 × 6/11 ≈` **54.5**

**Hasil dan Pengurutan:**

| Peringkat | Kandidat | Skor | Skill cocok | Skill kurang |
|---|---|---|---|---|
| 1 | Sari | **86.4** | PostgreSQL, Docker | Node.js (hanya level Beginner) |
| 2 | Dimas | **81.8** | Node.js, PostgreSQL | Docker |
| 3 | Andi | **54.5** | PostgreSQL, Docker | **Node.js (must_have)** |

**Interpretasi Transparan (yang ditampilkan ke pemilik peluang):**
- **Sari (86.4):** Cocok di ketiga skill; satu-satunya kekurangan adalah level Node.js yang di bawah kebutuhan (partial credit), sehingga skor tertinggi meski bukan yang paling mahir di Node.js.
- **Dimas (81.8):** Sangat kuat di dua skill `must_have`, tetapi sama sekali belum menguasai Docker (nice_to_have, bobot kecil) sehingga skor sedikit di bawah Sari.
- **Andi (54.5):** Diurutkan lebih rendah dan/atau ditempatkan di bagian "Kandidat Kurang Cocok" karena **tidak memiliki skill must_have `Node.js`** (lihat AR-1), meskipun menguasai PostgreSQL dan Docker.

**Catatan Tie-breaker:** Jika Sari dan Dimas memiliki skor identik, Dimas menang karena jumlah `must_have` yang cocok lebih banyak (2 vs 1) — lihat AR-4.

### 6.5 Jalur Evolusi (P2, bukan bagian MVP)

| Tahap | Pendekatan | Prasyarat |
|---|---|---|
| 1 (MVP) | Weighted Skill Match deterministik (di atas) | Tidak ada. |
| 2 | Tambah sinyal non-skill: ketersediaan waktu, pengalaman proyek sebelumnya, preferensi peran, riwayat kolaborasi. Tetap berbasis aturan + bobot. | Data tambahan dari pengguna. |
| 3 | Learning-to-rank / collaborative filtering untuk mempelajari bobot optimal dari data historis (lamaran diterima vs ditolak). | ≥ 500–1000 interaksi; mekanisme evaluasi offline (precision@k, NDCG). |

> Pada Tahap 3, PRD baru boleh menyebut *machine learning* secara eksplisit, disertai bukti evaluasi. Hingga saat itu, produk memakai istilah **"rekomendasi berbasis pembobotan kecocokan skill"** yang lebih akurat.

### 6.6 Kriteria Pengujian Algoritma

| ID | Skenario Uji | Hasil yang Diharapkan |
|---|---|---|
| TU-1 | Kandidat dengan semua skill & level memenuhi | Skor = 100. |
| TU-2 | Kandidat tanpa skill sama sekali | Dikecualikan dari rekomendasi (AR-2). |
| TU-3 | Kandidat cocok sebagian (2 dari 3 skill, satu bobot kecil) | Skor proporsional & terurut benar (contoh 6.4). |
| TU-4 | Kandidat memiliki skill tapi level di bawah minimum | Menerapkan partial credit 0.7, bukan 0. |
| TU-5 | Kandidat tanpa satu pun must_have cocok | Masuk "Kandidat Kurang Cocok" (AR-1). |
| TU-6 | Dua kandidat skor sama | Tie-breaker AR-4 diterapkan konsisten. |
| TU-7 | Bobot tidak valid/kosong (mis. data lama, 0, -1, 9) | Dikembalikan ke bobot tetap, tidak menyebabkan error (AR-5). |
| TU-8 | Requirement posisi kosong | Rekomendasi nonaktif dengan pesan "lengkapi kebutuhan skill". |

---

## 7. User Flow

### 7.1 Alur 1 — Mendaftar dan Melengkapi Profil

```
[Guest]
   │ Buka aplikasi
   ▼
[Halaman Landing] ──► "Daftar"
   │
   ▼
[Form Registrasi: email kampus + kata sandi]
   │
   ├─(email tidak valid/domain salah)─► [Pesan galat], tetap di form
   ▼
[Kirim email verifikasi] ──► [User verifikasi email]
   │
   ▼
[Login] ──► [Onboarding: lengkapi profil]
   │
   ├─ Isi nama, bio, program studi
   ├─ Tambah skill dari katalog + pilih level (≥1, target ≥3)
   └─ Tambah tautan portofolio (opsional untuk lengkap)
   │
   ▼
[Indikator "Profil Lengkap" aktif]
   │
   ▼
[Home: daftar peluang + rekomendasi peluang]
```

**Aturan pada alur:** pengguna tanpa profil lengkap tetap dapat menelusuri, tetapi tidak dapat melamar (BR-08) dan tidak muncul sebagai kandidat rekomendasi (AR-2).

### 7.2 Alur 2 — Membuat Peluang & Menentukan Kebutuhan Skill

```
[User terverifikasi & profil lengkap]
   │ "Buat Peluang"
   ▼
[Form Peluang: judul, deskripsi, jenis (lomba/proyek), kategori, tenggat, mode]
   │
   ▼
[Tambah Posisi, mis. "Frontend Developer", slot = 2]
   │
   ▼
[Untuk posisi ini, tambah skill dari katalog]
   ├─ Tentukan jenis: must_have / nice_to_have
   ├─ (bobot otomatis & tetap: must_have = 5, nice_to_have = 2; PD-05 — tidak ada input bobot)
   └─ (opsional) level minimum
   │
   ├─(tidak ada must_have)─► [Tolak simpan: "minimal 1 skill must-have"]
   ▼
[Simpan sebagai Draf] ──► [Publikasikan Peluang (status = open)]
   │
   ▼
[Sistem menghitung vektor kebutuhan per posisi]
   ▼
[Peluang tampil di daftar publik + notifikasi ke kandidat potensial (P1)]
```

### 7.3 Alur 3 — Melihat Rekomendasi Kandidat

```
[Pemilik Peluang] buka peluang → tab "Kandidat"
   │
   ├─ [Mode Eksplorasi] Buka "Cari Kandidat"
   │     └─ Filter: skill (AND), level minimal, ketersediaan, kata kunci
   │
   └─ [Mode Rekomendasi] Pilih posisi (mis. "Backend Developer")
         │
         ▼
      [Sistem menghitung skor tiap kandidat: Bagian 6]
         │
         ▼
      [Daftar terurut: nama, skor 0–100, skill cocok, skill kurang]
         │
         ├─(klik kandidat)─► [Detail: profil, portofolio, rincian perhitungan skor]
         │
         └─(0 kandidat must_have cocok)─► [Pesan: "Lengkapi kebutuhan skill / longgarkan filter"]
```

### 7.4 Alur 4 — Mengajukan Diri / Menerima Anggota

```
[Kandidat] buka detail peluang → pilih posisi → "Ajukan Diri"
   │
   ├─(profil belum lengkap)─► [Arahkan melengkapi profil]
   ├─(sudah melamar posisi ini)─► [Tolak duplikat]
   ├─(peluang ditutup/tenggat lewat)─► [Tombol nonaktif]
   ▼
[Tulis pesan pengajuan (≤500 karakter)] ──► [Kirim Lamaran (status = pending)]
   │
   ▼
[Sistem kirim notifikasi ke Pemilik Peluang]
   ▼
[Pemilik Peluang] buka "Lamaran" → review (lihat skor + profil)
   │
   ├─ "Shortlist" ──► status = shortlisted ──► notifikasi kandidat
   ├─ "Terima"    ──► (slot tersedia?) ──► status = accepted ──► masuk daftar anggota
   │                        └─(slot penuh)─► [Tolak: "Slot posisi penuh"]
   └─ "Tolak"     ──► status = rejected ──► notifikasi kandidat
```

### 7.5 Alur 5 — Mengelola Tim yang Terbentuk

```
[Peluang dengan ≥1 anggota accepted]
   │
   ▼
[Tab "Anggota Tim": daftar anggota + peran + status posisi]
   │
   ├─ (jumlah anggota aktif ≥ 2, owner dihitung sekali) ──► status peluang = "formed" → tercatat di metrik M4
   ├─ (jumlah anggota aktif turun menjadi 1) ──► status peluang kembali = "open"
   ├─ (jumlah anggota aktif kembali ≥ 2) ──► status peluang = "formed" lagi
   ├─ Keluarkan anggota (konfirmasi + alasan) → slot kembali tersedia + notifikasi → hitung ulang status
   ├─ Anggota keluar sendiri → slot kembali tersedia → hitung ulang status
   └─ Tutup peluang → pelamar pending otomatis rejected + notifikasi
```

---

## 8. Non-Functional Requirements

| Kategori | Requirement | Target Terukur | Prioritas |
|---|---|---|---|
| **Keamanan** | Kata sandi disimpan dengan **Argon2id** — konfigurasi awal **m=19456 KiB, t=2, p=1**, dapat disesuaikan setelah benchmark lingkungan deployment (PD-07, accepted 2026-10-13). | Tidak ada penyimpanan kata sandi plaintext. Parameter Argon2id tercatat di konfigurasi & dapat disesuaikan setelah benchmark. | P0 |
| | Autentikasi: **access token 15 menit** (Bearer), **refresh token 7 hari** via **httpOnly + Secure + SameSite** cookie, **dirotasi setiap kali digunakan**, disimpan sebagai **hash** (bukan token mentah), dengan **deteksi reuse** → cabut sesi/family terkait. **Tanpa device fingerprinting** pada MVP (PD-07, accepted 2026-10-13). | Sesi valid/invalid sesuai masa berlaku & rotasi; reuse terdeteksi dan sesi dicabut. | P0 |
| | Verifikasi email & reset password menggunakan **token sekali pakai yang kedaluwarsa** (PD-07). **TTL spesifik belum final** — jangan dianggap keputusan final. | Token sekali pakai kedaluwarsa; TTL dicatat saat peninjauan kebijakan sebelum pilot. | P0 |
| | Cookie, rotasi token, logout, invalidasi sesi, dan perlindungan **CSRF** dirancang **konsisten** (SameSite + Origin/Referer check; PD-07). | Kebijakan cookie & CSRF konsisten di seluruh endpoint auth. | P0 |
| | Semua endpoint terproteksi memerlukan token valid; operasi berdasarkan kepemilikan (ownership check). | Tidak ada IDOR (akses sumber daya milik orang lain). | P0 |
| | Proteksi terhadap injeksi (SQL/NoSQL), XSS. Validasi & sanitasi input pada semua endpoint; lapisan ORM/query builder. | Validasi & sanitasi diuji. | P0 |
| | **Rate limiting** pada login, refresh token, reset password & endpoint pengajuan — dirancang konsisten (PD-07). **Batas spesifik belum final** — jangan dianggap keputusan final. | Rate limiting aktif; angka final ditetapkan sebelum pilot. | P0 |
| | Transport terenkripsi (HTTPS) di semua lingkungan non-lokal. | Redirect HTTP → HTTPS. | P0 |
| **Privasi Data** | Data pribadi yang ditampilkan terbatas pada field profil publik. **Email tidak pernah ditampilkan pada profil publik**; pertukaran kontak hanya via **opt-in dua pihak** setelah lamaran `accepted` (PD-04, accepted 2026-10-13). | Email tidak terekspos publik; hanya dibagikan setelah kedua pihak menyetujui. | P0 |
| | Kepatuhan pada aturan pelindungan data yang berlaku. **Kebijakan privasi & penghapusan akun wajib ditinjau sebelum pilot** (PD-08, open). | Kebijakan privasi & persetujuan tercatat & ditinjau sebelum pilot. | P0 |
| | Hak menghapus akun — **status open** (PD-08). **Jangan menetapkan** soft vs hard delete atau durasi retensi sebagai final tanpa peninjauan. Target **M1–M7 sebagai baseline hipotesis** (PD-08). | Permintaan hapus diproses sesuai kebijakan yang ditinjau sebelum pilot. | P1 |
| **Validasi Input** | Validasi server-side wajib, client-side sebagai UX tambahan. | Semua field memiliki skema validasi yang diuji. | P0 |
| | Batas panjang teks (bio 300, deskripsi 2000, pesan 500 karakter). | Penolakan input melebihi batas. | P0 |
| | Validasi URL untuk tautan portofolio (https, host valid). | URL non-valid ditolak. | P0 |
| **Performa** | Waktu muat halaman utama & daftar peluang. | P75 < 2.5 detik pada koneksi standar. | P0 |
| | Respons API rekomendasi kandidat. | P95 < 1.5 detik untuk ≤ 500 kandidat `[PERLU KONFIRMASI: skala]`. | P0 |
| | Skalabilitas awal. | Mendukung ≥ 1.000 pengguna & 200 peluang aktif tanpa degradasi signifikan. | P1 |
| **Aksesibilitas** | Kontras warna, navigasi keyboard, label ARIA, struktur heading. | Memenuhi kriteria inti WCAG 2.1 level AA untuk alur utama. | P0 |
| | Status tidak hanya disampaikan lewat warna (mis. status lamaran). | Sertakan teks/ikon pendamping. | P0 |
| **Maintainability** | Pemisahan lapisan (controller–service–repository), penamaan konsisten, dokumentasi API. | Modul terstruktur sesuai pola NestJS; dokumentasi API tersedia. | P0 |
| | Konfigurasi via environment variable; rahasia tidak masuk repositori. | Tidak ada kredensial di kode; `.env.example` tersedia. | P0 |
| | Kualitas kode. | Linter + formatter berjalan di CI; tidak ada error lint pada build. | P0 |
| **Pengujian** | Unit test untuk algoritma matching. | Semua skenario TU-1 s.d. TU-8 lulus; cakupan modul scoring ≥ 80%. | P0 |
| | Test integrasi untuk alur lamaran & autentikasi. | Alur end-to-end utama teruji. | P0 |
| | Test E2E untuk alur USER (daftar → lengkapi profil → buat peluang → rekomendasi → lamaran → terima). | Skenario utama berjalan otomatis. | P1 |
| **Reliabilitas** | Backup data terjadwal `[PERLU KONFIRMASI: frekuensi & retensi]`. | RPO/RTO ditetapkan. | P1 |
| **Observabilitas** | Logging terstruktur untuk aksi penting (login, lamaran, keputusan). | Log tidak memuat data pribadi sensitif / kata sandi. | P0 |

---

## 9. Data Requirements

> **Catatan:** Bersifat **konseptual**. Tidak ada migrasi, skema SQL, atau kode database yang dibuat pada tahap ini. Nama relasi bersifat usulan.

### 9.1 Entitas Utama

| Entitas | Deskripsi | Atribut Kunci (konseptual) |
|---|---|---|
| **Campus** **[BARU, PD-01]** | Kampus yang terdaftar. | id, nama_kampus `[INPUT PILOT]`, created_at |
| **AllowedDomain** **[BARU, PD-01]** | Domain email kampus yang diizinkan. | id, campus_id (FK), domain `[INPUT PILOT]` (mis. `@student.[INPUT PILOT]`), aktif, created_at |
| **User** | Akun mahasiswa. | id, email, password_hash (Argon2id m=19456 t=2 p=1 awal, PD-07), campus_id (FK, PD-01), status_verifikasi, created_at |
| **Profile** | Data publik pengguna (1–1 dengan User). | user_id, nama_tampilan, bio, program_studi, angkatan, ketersediaan, updated_at |
| **PortfolioLink** | Tautan portofolio ke luar sistem. | id, profile_id, label, url, tipe (github/linkedin/behance/lainnya) |
| **Skill** | Item katalog keahlian terkurasi (seed data idempoten; UI admin post-MVP, PD-03). | id, nama, kategori_skill_id, status (aktif/antrean) |
| **SkillCategory** | Kategori skill (Frontend, Backend, dst.). | id, nama |
| **UserSkill** | Keahlian yang dimiliki pengguna + level. | id, profile_id, skill_id (FK ke `Skill`, PD-03), level (1–3) |
| **Opportunity** | Peluang lomba/proyek. | id, owner_id, judul, deskripsi, jenis, kategori, mode, tenggat, status (draft/open/closed/expired/formed), created_at |
| **Position** | Posisi/peran dalam sebuah peluang. | id, opportunity_id, nama, jumlah_slot, deskripsi |
| **PositionSkillRequirement** | Kebutuhan skill untuk sebuah posisi. | id, position_id, skill_id (FK ke `Skill`, PD-03), jenis (must_have/nice_to_have), bobot (tetap: must_have = 5, nice_to_have = 2; PD-05), level_minimum |
| **Application** | Lamaran kandidat untuk sebuah posisi. | id, position_id, applicant_id, pesan (≤500, pengantar, PD-04), status (pending/shortlisted/accepted/rejected/withdrawn), skor_kecocokan_saat_lamar, created_at, decided_at |
| **TeamMembership** | Keanggotaan tim yang terbentuk (dari lamaran diterima). | id, opportunity_id, position_id, user_id, peran, status (aktif/keluar/dikeluarkan), joined_at, left_at |
| **ContactExchange** **[BARU, PD-04]** | Pertukaran kontak opt-in setelah lamaran diterima. | id, application_id (FK), requested_by, requested_at, consented_by, consented_at, status (pending/approved/rejected), created_at |
| **RefreshToken** **[BARU, PD-07]** | Refresh token yang dirotasi & dideteksi reuse. | id, user_id (FK), token_hash (hash, bukan mentah), family_id, expires_at (7 hari), revoked_at, created_at |
| **Notification** | Notifikasi in-app. | id, user_id, tipe_peristiwa (`contact_requested`/`contact_approved`/`contact_rejected` termasuk, PD-04), entitas_ref, is_read, created_at |
| **AuditLog** `[PERLU KONFIRMASI: masuk MVP? — usulan: minimal untuk keputusan lamaran]` | Riwayat aksi penting. | id, aktor_id, aksi, entitas_ref, metadata, created_at |

### 9.2 Relasi Utama (Konseptual)

```
Campus 1 ──── * AllowedDomain                          [BARU, PD-01]
Campus 1 ──── * User ──── 1 Profile                    [campus_id, PD-01]
Profile 1 ──── * PortfolioLink
Profile 1 ──── * UserSkill * ──── 1 Skill * ──── 1 SkillCategory

User (owner) 1 ──── * Opportunity
Opportunity 1 ──── * Position
Position 1 ──── * PositionSkillRequirement * ──── 1 Skill

Position 1 ──── * Application * ──── 1 User (applicant)
Application 1 ──── 0..1 ContactExchange                [BARU, PD-04]
Opportunity 1 ──── * TeamMembership * ──── 1 User
Position 1 ──── * TeamMembership

User 1 ──── * Notification
User 1 ──── * RefreshToken                             [BARU, PD-07]
```

### 9.3 Kardinalitas & Aturan Integritas (Konseptual)

| Relasi | Kardinalitas | Aturan Integritas |
|---|---|---|
| Campus–AllowedDomain | 1–N | Domain unik per kampus; hanya domain aktif yang dipakai validasi registrasi (PD-01, `[INPUT PILOT]`). |
| User–Profile | 1–1 | Profil wajib dibuat setelah registrasi (dapat kosong sebagian). User memiliki `campus_id` (PD-01). |
| Profile–UserSkill | 1–N | Unik per (profile, skill); maks 20 per profil. `skill_id` FK ke `Skill` katalog (PD-03). |
| Skill–UserSkill / PositionSkillRequirement | 1–N | Referensi katalog konsisten by id; seed idempoten; skill yang dipakai tidak diasumsikan dapat dihapus tanpa konsekuensi (PD-03). |
| Opportunity–Position | 1–N | Minimal 1 posisi untuk peluang yang dipublikasikan. Peluang dapat difilter lintas kampus (PD-01). |
| Position–Requirement | 1–N | Minimal 1 `must_have`. Bobot tetap must_have = 5, nice_to_have = 2 (PD-05). |
| Application | N per posisi | Unik per (position, applicant) untuk status aktif. Pesan pengantar ≤500 (PD-04). |
| Application–ContactExchange | 1–0..1 | Pertukaran kontak hanya setelah `accepted`; opt-in dua pihak (PD-04). |
| TeamMembership | N per peluang | Unik per (opportunity, user). Status `Opportunity` = `formed` bila ≥ 2 anggota aktif (owner dihitung sekali); kembali `open` bila < 2 (PD-02). |
| User–RefreshToken | 1–N | Refresh token disimpan sebagai hash, dirotasi, reuse detection → revoke family (PD-07). |
| Notification | N per user | Diurutkan berdasarkan created_at; punya flag is_read. Mencakup `contact_requested`/`contact_approved`/`contact_rejected` (PD-04). |

### 9.4 Perhitungan yang Tidak Disimpan Permanen

Skor kecocokan **dihitung saat diminta** (on-the-fly) atau di-cache dengan invalidasi saat profil/requirement berubah (AR-7). Skor awal disimpan pada `Application.skor_kecocokan_saat_lamar` sebagai **rekam jejak keputusan**, bukan sebagai sumber utama rekomendasi.

### 9.5 Retensi & Penghapusan Data — Status `open` (PD-08, 2026-10-13)

> **Jangan menetapkan angka retensi, kebijakan penghapusan akun, atau durasi sebagai keputusan final tanpa peninjauan.** Kebijakan privasi & penghapusan akun **wajib ditinjau sebelum pilot** (PD-08). Target **M1–M7 sebagai baseline hipotesis** (bukan final).

- Lamaran ditolak: durasi retensi **belum final** (PD-08, `open`).
- Peluang kedaluwarsa: kebijakan arsip/hapus **belum final** (PD-08, `open`).
- Akun dihapus: kebijakan penghapusan/anonimisasi **belum final** (PD-08, `open`).

---

## 10. Proposed Technical Architecture

> **Status (2026-10-13, v1.2):** PD-01 s.d. PD-07 **accepted** (termasuk stack teknologi PD-06); PD-08 tetap **open**. Placeholder `[INPUT PILOT]` menandai nilai yang belum dilengkapi. TanStack Query / Zustand / shadcn/ui **tidak diwajibkan** (PD-06).

### 10.1 Ringkasan Arsitektur

```
┌──────────────────────────────┐
│  Frontend — React + TS + Vite│  [TERKONFIRMASI, PD-06]
│  (SPA, Tailwind CSS)         │
│  - Profil & skill            │
│  - Peluang & posisi          │
│  - Rekomendasi & filter      │
│  - Lamaran & notifikasi      │
└───────────────┬──────────────┘
                │ HTTPS / REST (JSON)
                ▼
┌──────────────────────────────┐
│  Backend — NestJS            │  [TERKONFIRMASI]
│  (TypeScript, moduler)       │
│  - Auth module               │
│  - User/Profile/Skill module │
│  - Opportunity/Position      │
│  - Application/Team          │
│  - Recommendation (scoring)  │
│  - Notification              │
└──────┬──────────────┬────────┘
       │              │
       ▼              ▼
┌────────────┐  ┌──────────────────┐
│ PostgreSQL │  │ External Services│
│ + Prisma   │  │ - Email (verif.) │
│ [PD-06]    │  │   [PERLU KONFIRM]│
└────────────┘  └──────────────────┘
```

### 10.2 Komponen & Keputusan

| Lapisan | Usulan | Status |
|---|---|---|
| **Frontend** | React + TypeScript + **Vite**; **Tailwind CSS** untuk styling (PD-06, accepted 2026-10-13). State management/data fetching (mis. TanStack Query/Zustand) & komponen library (mis. shadcn/ui) **tidak diwajibkan** — dapat ditentukan kemudian. | **TERKONFIRMASI (PD-06, 2026-10-13)** |
| **Backend** | NestJS + TypeScript, arsitektur modular (controller–service–repository) | **NestJS: TERKONFIRMASI** |
| **Database** | **PostgreSQL** (PD-06, accepted 2026-10-13) | **TERKONFIRMASI (PD-06)** |
| **ORM** | **Prisma** (PD-06, accepted 2026-10-13) | **TERKONFIRMASI (PD-06)** |
| **Styling** | **Tailwind CSS** (PD-06, accepted 2026-10-13) | **TERKONFIRMASI (PD-06)** |
| **Autentikasi** | **Access token 15 menit (Bearer) + refresh token 7 hari (httpOnly + Secure + SameSite cookie, rotasi tiap pakai, reuse detection → revoke family, tanpa fingerprinting di MVP)**; Argon2id m=19456 t=2 p=1 (awal, dapat disesuaikan setelah benchmark); verifikasi email & reset via token sekali pakai kedaluwarsa (TTL belum final); cookie/CSRF/rate limiting konsisten (PD-07, accepted 2026-10-13; TTL & batas rate belum final) | **TERKONFIRMASI (PD-07, 2026-10-13)** |
| **Validasi** | `class-validator` + `class-transformer` di NestJS (usulan). | **PERLU KONFIRMASI** |
| **Email verifikasi** | Token sekali pakai yang kedaluwarsa (TTL belum final, PD-07); layanan SMTP/transaksional `[PERLU KONFIRMASI: penyedia]` | **Mekanisme: TERKONFIRMASI; TTL & penyedia: PERLU KONFIRMASI** |
| **Notifikasi in-app** | Disimpan di database (mencakup `contact_requested`/`contact_approved`/`contact_rejected`, PD-04), ditampilkan di UI (polling). Realtime (WebSocket) ditunda ke P1/P2. **Chat internal tetap di luar MVP** (F-17, P2). | Usulan |
| **Deployment** | usulan container (Docker) + layanan hosting `[PERLU KONFIRMASI: penyedia & lingkungan kampus/cloud]`. | **PERLU KONFIRMASI** |
| **Penyimpanan file** | Tidak diperlukan pada MVP (portofolio via tautan). | Sesuai keputusan user |
| **Testing** | Jest (unit & integrasi), React Testing Library (frontend), Playwright/Cypress (E2E, P1). | **PERLU KONFIRMASI** |
| **Observabilitas** | Logging terstruktur; APM/monitoring `[PERLU KONFIRMASI]`. | **PERLU KONFIRMASI** |
| **CI/CD** | usulan pipeline lint + test + build pada setiap PR. | **PERLU KONFIRMASI** |
| **Kontainerisasi** | usulan Docker + docker-compose untuk pengembangan lokal. | **PERLU KONFIRMASI** |

### 10.3 Prinsip Arsitektur

1. **Modularitas domain** — setiap domain (auth, user, skill, opportunity, application, team, recommendation, notification, contact-exchange) dipisahkan sebagai modul NestJS agar mudah diuji dan dikembangkan.
2. **Logika matching terisolasi** — algoritma di Bagian 6 ditempatkan sebagai *service* murni (`RecommendationService`) tanpa dependensi I/O langsung, sehingga dapat diuji secara unit. Bobot bersifat tetap (PD-05).
3. **Kontrak API eksplisit** — dokumentasi OpenAPI/Swagger sebagai acuan frontend & backend.
4. **Konfigurasi terpusat** — semua rahasia & variabel lingkungan melalui mekanisme konfigurasi NestJS, bukan hardcoded. **Refresh token disimpan sebagai hash** (bukan mentah), rotasi + reuse detection (PD-07).
5. **Tidak ada penyimpanan file pada MVP** — menghindari kompleksitas object storage di tahap validasi.
6. **Multi-kampus logis** — satu instance PostgreSQL dengan entitas `Campus`/`AllowedDomain` dan `campus_id` pada User (PD-01, `[INPUT PILOT]`); filter lintas kampus (PD-01).
7. **Pertukaran kontak opt-in** — email tidak pernah publik; `ContactExchange` dengan audit trail (PD-04).
8. **Chat internal tetap di luar MVP** (F-17, P2).

---

## 11. Acceptance Criteria dan MVP Definition of Done

### 11.1 Definisi MVP (Minimum Viable Product)

MVP dianggap selesai bila **hipotesis inti** dapat diuji end-to-end:

> *"Jika seorang pemilik peluang mendefinisikan kebutuhan skill dengan bobot, maka sistem dapat menampilkan kandidat yang relevan beserta alasannya; kandidat dapat melamar; dan pemilik peluang dapat menerima kandidat hingga membentuk tim."*

MVP mencakup fitur **P0**: FR-01 s.d. FR-11 (termasuk FR-03a katalog skill).

### 11.2 Definition of Done Global

- [ ] Semua FR P0 diterapkan dengan acceptance criteria terverifikasi.
- [ ] Semua skenario uji algoritma (TU-1 s.d. TU-8) lulus otomatis.
- [ ] Alur E2E utama (daftar → profil → peluang → rekomendasi → lamaran → terima → tim terbentuk) berjalan tanpa error.
- [ ] Tidak ada kredensial di repositori; konfigurasi via environment.
- [ ] Linter & formatter bersih; build produksi berhasil.
- [ ] Dokumentasi API (Swagger) tersedia.
- [ ] Uji aksesibilitas dasar (keyboard & kontras) pada halaman utama lulus.
- [ ] Kebijakan privasi & penghapusan akun **wajib ditinjau sebelum pilot** (PD-08, `open`; jangan anggap final). Target M1–M7 sebagai **baseline hipotesis** (PD-08).
- [ ] Deployment staging dapat diakses penguji.

### 11.3 Acceptance Criteria per Fitur (Ringkasan Eksekutif)

| Fitur | Kriteria Kunci | Terverifikasi |
|---|---|---|
| FR-01 Auth | Registrasi email kampus (allowlist, `[INPUT PILOT]`), verifikasi, login (Argon2id, access 15m + refresh 7d, rotasi, reuse detection), reset kata sandi | AC-01.1–01.2 (allowlist), AC-01.3–01.4 + AC tambahan rotasi/reuse/CSRF (PD-07) |
| FR-02 Profil | Profil + portofolio tersimpan; email tidak pernah publik; pertukaran kontak opt-in | AC-02.1–02.3 + BR-02.4 (PD-04) |
| FR-03 Skill | Skill + level tersimpan; duplikasi dicegah; katalog terkurasi (seed idempoten, admin UI post-MVP) | AC-03.1–03.3 + BR-03.6–03.8 (PD-03) |
| FR-04 Peluang | Peluang dibuat, dipublikasikan, dan tampil di daftar publik | AC-04.1–04.3 |
| FR-05 Requirement | Posisi & requirement skill tersimpan; **bobot tetap 5/2** (tanpa input owner) | AC-05.1–05.3 (PD-05) |
| FR-06 Pencarian | Filter skill (AND) + **filter kampus** (lintas kampus) + paginasi | AC-06.1–06.3 + BR-06.5 (PD-01) |
| FR-07 Rekomendasi | Skor 0–100 + penjelasan; deterministic; partial credit; **lintas kampus dengan filter** | AC-07.1–07.4 + BR-07.6 (PD-01) |
| FR-08 Pengajuan | Lamaran + pesan pengantar; **pertukaran kontak opt-in dua pihak** setelah `accepted` | AC-08.1–08.5 (PD-04) |
| FR-09 Kelola Lamaran | Status & batas slot diterapkan; notifikasi terkirim | AC-09.1–09.3 |
| FR-10 Anggota Tim | Daftar anggota akurat; status `formed`/`open` benar (≥ 2 anggota aktif, owner sekali) | AC-10.1–10.6 (PD-02) |
| FR-11 Notifikasi | Notifikasi in-app termasuk `contact_requested`/`contact_approved`/`contact_rejected` | AC-11.1–11.5 (PD-04) |

### 11.4 Kriteria "MVP Siap Diuji" (Siap Pilot)

| # | Kriteria | Cara Verifikasi |
|---|---|---|
| 1 | Seluruh alur P0 berfungsi end-to-end di lingkungan staging | Demo manual + skrip E2E |
| 2 | Skor rekomendasi dapat diverifikasi manual menggunakan rumus Bagian 6 (bobot tetap 5/2, PD-05) | Audit sampel 10 kandidat |
| 3 | Setiap rekomendasi menampilkan penjelasan yang bisa dipahami penguji | Review UX |
| 4 | Tidak ada celah akses data (IDOR) pada endpoint utama | Uji manual/otomatis |
| 5 | Waktu respons rekomendasi sesuai target NFR | Uji beban sederhana |
| 6 | Umpan balik penguji pilot (≥ 5 pengguna) terkumpul | Kuesioner/observasi |
| 7 | Metrik M1–M4 dapat diukur dari data yang tersedia (M1–M7 sebagai **baseline hipotesis**, PD-08) | Validasi skema tracking |

---

## 12. Risks, Assumptions, dan Open Questions

### 12.1 Risiko Produk

| ID | Risiko | Dampak | Kemungkinan | Mitigasi |
|---|---|---|---|---|
| R-01 | **Masalah cold start** — sedikit peluang sehingga kandidat tidak menemukan yang cocok, dan sebaliknya. | Tinggi | Tinggi | Fokus pada satu komunitas/kampus; dorong seed peluang dari himpunan/kelas; sediakan daftar peluang yang selalu tampil. |
| R-02 | **Kualitas data skill rendah** — pengguna menilai level sendiri terlalu tinggi/rendah. | Sedang | Tinggi | Portofolio & tautan sebagai sinyal tambahan; gunakan katalog terkurasi; hindari klaim akurasi berlebihan. |
| R-03 | **Rekomendasi dianggap tidak akurat** oleh pengguna. | Tinggi | Sedang | Selalu tampilkan penjelasan skor; sediakan mode pencarian manual (FR-06) sebagai jalur alternatif. |
| R-04 | **Ketidakseimbangan supply–demand** (banyak kandidat, sedikit peluang). | Tinggi | Sedang | Kampanye sisi supply (pemilik peluang); rekomendasi peluang untuk kandidat (FR-12) di P1. |
| R-05 | **Peluang dibuat lalu ditinggalkan** (tidak ada tindak lanjut). | Sedang | Sedang | Notifikasi pengingat; tandai peluang kedaluwarsa; metrik M6. |
| R-06 | **Penyalahgunaan / spam peluang atau lamaran.** | Sedang | Sedang | Rate limiting; moderasi (P1); login email kampus. |
| R-07 | **Adopsi rendah karena kebiasaan grup chat** sulit diubah. | Tinggi | Sedang | Integrasikan nilai yang jelas (rekomendasi & penjelasan) yang tidak dimiliki grup chat. |

### 12.2 Risiko Teknis

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| RT-01 | Performa perhitungan skor memburuk saat data bertambah. | Sedang | Hitung per posisi, batasi kandidat via pre-filter, cache + invalidasi (AR-7). |
| RT-02 | Duplikasi/contoh skill tidak konsisten di katalog. | Tinggi (merusak matching) | Katalog terkurasi & proses peninjauan skill baru (BR-03.5). |
| RT-03 | Race condition pada batas slot (dua penerimaan bersamaan). | Sedang | Transaksi database + validasi slot atomik (BR-09.2). |
| RT-04 | Ketergantungan layanan email pihak ketiga. | Sedang | Antrean pengiriman ulang & status verifikasi jelas. |
| RT-05 | Kebocoran data pribadi. | Tinggi | Pembatasan field publik, audit endpoint, otorisasi berbasis kepemilikan. |

### 12.3 Asumsi yang Belum Divalidasi

| ID | Asumsi | Cara Validasi |
|---|---|---|
| A-01 | Mahasiswa bersedia melengkapi profil skill (≥3 skill) demi mendapat rekomendasi. | Uji pilot, ukur M1. |
| A-02 | ~~Pemilik peluang mau meluangkan waktu mengatur bobot skill.~~ **Tidak berlaku (PD-05, accepted 2026-10-13):** bobot bersifat tetap (5/2); owner tidak mengatur bobot. | — (tidak perlu divalidasi) |
| A-03 | Skor berbasis skill cukup untuk memprediksi kecocokan tim (bukan hanya skill, tetapi juga komitmen/waktu). | Bandingkan skor dengan keputusan aktual (M2). |
| A-04 | Satu akun berperan ganda sebagai kandidat & pemilik peluang dapat diterima. | Analisis penggunaan awal. |
| A-05 | Link portofolio cukup menggantikan unggahan berkas. | Wawancara pengguna pilot. |
| A-06 | Notifikasi in-app saja mencukupi (tanpa email). | Ukur tingkat respons lamaran. |

### 12.4 Pertanyaan Terbuka (Open Questions)

| ID | Pertanyaan | Pemilik Keputusan | Blokir Tahap Berikutnya? |
|---|---|---|---|
| Q-01 | Domain email kampus mana saja yang diterima? *(sebagian terjawab: allowlist domain terdaftar, admin platform; nilai pilot: `[INPUT PILOT]`, PD-01 accepted 2026-10-13)* | Stakeholder kampus | Ya — **tersisa input `[INPUT PILOT]`** |
| Q-02 | Apakah satu aplikasi melayani satu kampus, atau multi-kampus sejak awal? | Product Owner | **TERJAWAB — PD-01 accepted 2026-10-13** (arsitektur multi-kampus, pilot satu kampus) |
| Q-03 | Definisi resmi "tim berhasil terbentuk" (berapa anggota minimum)? | Product Owner | **TERJAWAB — PD-02 accepted 2026-10-13** (≥ 2 anggota aktif termasuk owner, owner dihitung sekali; `formed` ↔ `open`). Sisa detail (definisi "aktif") tetap **terbuka** |
| Q-04 | Siapa yang memelihara katalog skill, dan apakah UI admin masuk MVP? | Product Owner | **TERJAWAB — PD-03 accepted 2026-10-13** (seed data idempoten; UI admin ditunda/pasca-MVP). Detail kebijakan skill nonaktif/rename/tidak ditemukan tetap **terbuka (Q-16)** |
| Q-05 | Apakah field program studi & angkatan wajib di profil? | Product Owner | Tidak (dapat diubah cepat) |
| Q-06 | Kebijakan privasi kontak: kapan email kandidat terlihat oleh pemilik? | Legal/Stakeholder | **TERJAWAB — PD-04 accepted 2026-10-13** (tidak pernah publik; opt-in dua pihak setelah `accepted`) |
| Q-07 | Nilai default bobot & apakah pemilik peluang benar-benar mengaturnya, atau sistem memakai default saja pada MVP? | Product Owner | **TERJAWAB — PD-05 accepted 2026-10-13** (bobot tetap must_have = 5, nice_to_have = 2; owner tidak mengubah). Detail partial credit & denominator nol tetap **terbuka (Q-17)** |
| Q-08 | Apakah email digest atau email notifikasi masuk MVP? | Product Owner | Tidak (usulan: P1) |
| Q-09 | Pilihan database, ORM, dan strategi autentikasi? | Tech Lead | **TERJAWAB — PD-06 & PD-07 accepted 2026-10-13** (PostgreSQL + Prisma; Argon2id m=19456 t=2 p=1 awal; access 15m + refresh 7d, rotasi, hash, reuse detection). TanStack Query/Zustand/shadcn tidak diwajibkan |
| Q-10 | Lingkungan & penyedia deployment (hosting kampus atau cloud)? | Tech Lead/Stakeholder | Ya (deployment) |
| Q-11 | Kebijakan penghapusan & retensi data (soft/hard delete, durasi)? | Legal/Stakeholder | **Tetap `open` — PD-08 (jangan anggap final)** |
| Q-12 | Apakah fitur blokir pengguna diperlukan di MVP? | Product Owner | Tidak (usulan: tidak) |
| Q-13 | Target indikator keberhasilan (M1–M7) sudah disepakati? | Product Owner | **Tetap `open` — PD-08 (baseline hipotesis)** |
| Q-14 | Apakah perlu fitur "undang kandidat" (owner mengundang, bukan hanya kandidat melamar)? | Product Owner | Tidak (usulan: P1) |
| Q-15 | Apakah peluang boleh bersifat privat (undangan saja) atau selalu publik? | Product Owner | Tidak (usulan: publik saja di MVP) |
| Q-16 | **[PD-03, terbuka]** Kebijakan skill nonaktif, perubahan nama skill yang sudah dipakai, dan perilaku saat skill tidak ditemukan pada profil/requirement? | Product Owner | Tidak (dapat diputuskan kemudian; jangan menebak sekarang) |
| Q-17 | **[PD-02/PD-05, terbuka]** Definisi persis "anggota aktif" (apakah `TeamMembership.status = aktif`), pengaruh penggantian anggota terhadap transisi `formed`/`open`, kriteria pasti kecocokan parsial, dan penanganan denominator nol pada rumus? | Product Owner / Tech Lead | Tidak (detail algoritma; jangan diubah tanpa dasar dokumen) |

---

## Lampiran A — Matriks Traceability (Ringkas)

| Tujuan | Fitur Pendukung | Metrik |
|---|---|---|
| G1 Mempercepat penemuan kandidat | FR-06, FR-07 | M2, M6 |
| G2 Meningkatkan kualitas kecocokan | FR-05, FR-07 | M2, M4 |
| G3 Transparansi rekomendasi | FR-07 | M7 |
| G4 Menyederhanakan alur rekrutmen | FR-08, FR-09, FR-11 | M3, M6 |
| G5 Membentuk tim nyata | FR-10 | M4, M5 |

---

## Lampiran B — Rekomendasi Urutan Pengerjaan (Usulan, untuk Diskusi)

| Iterasi | Fokus | Fitur |
|---|---|---|
| Iterasi 0 | Fondasi | FR-01, FR-03a, kerangka arsitektur, skema data |
| Iterasi 1 | Profil & katalog skill | FR-02, FR-03 |
| Iterasi 2 | Peluang & kebutuhan skill | FR-04, FR-05 |
| Iterasi 3 | Algoritma & rekomendasi | FR-07 (+ unit test TU-1..TU-8), FR-06 |
| Iterasi 4 | Alur lamaran & tim | FR-08, FR-09, FR-10 |
| Iterasi 5 | Notifikasi & pengerasan | FR-11, NFR, uji E2E |
| Iterasi 6 | Pilot & evaluasi | Instrumentasi metrik M1–M7 |

---

**Riwayat Perubahan — v1.1 (2026-10-13):** PD-01, PD-04, PD-07 → accepted. BR-01.1/AC-01.2 (allowlist), BR-02.4/BR-08.6/AC-08.4-08.5/BR-11.5/AC-11.4-11.5 (pertukaran kontak opt-in), BR-06.5/BR-07.6 (filter kampus lintas kampus), Bagian 8/10.2 (Argon2id + access/refresh + reuse + CSRF), Bagian 9.1/9.2/9.3 (Campus, AllowedDomain, ContactExchange, RefreshToken), Q-01/Q-02/Q-06/Q-09 diperbarui, PD-08 tetap open. Placeholder `[INPUT PILOT]` untuk nama kampus & domain pilot.

**Riwayat Perubahan — v1.2 (2026-10-13):** PD-02, PD-03, PD-05, PD-06 → accepted (finalisasi keputusan produk; **tidak ada `proposed` tersisa**).
- **PD-02:** BR-10.2 (min 2 anggota aktif termasuk owner, owner dihitung sekali; transisi `formed` ↔ `open`), AC-10.2 & AC-10.4–10.6, M4, Alur 5 (Bagian 7.5), Q-03 ditandai terjawab.
- **PD-03:** FR-03a — seed data idempoten, UI admin ditunda dari MVP, referensi katalog konsisten (BR-03.6–03.8), Q-04 ditandai terjawab, detail kebijakan tetap terbuka (Q-16).
- **PD-05:** bobot tetap `must_have` = 5 / `nice_to_have` = 2; owner tidak mengubah; input bobot dihapus (FR-05, Bagian 6.1/6.2, AR-5, TU-7, Alur 2, Bagian 1.6); rumus & nilai kecocokan (1,0/0,7/0) dipertahankan; Q-07 ditandai terjawab.
- **PD-06:** stack accepted (React+TS+Vite, NestJS, PostgreSQL, Prisma, Tailwind); TanStack Query/Zustand/shadcn tidak diwajibkan; Bagian 10.1/10.2/10.3 diperbarui; Q-09 ditandai terjawab.
- Bagian 11.3/11.4, A-02, Q-03/Q-04/Q-07/Q-09 diperbarui; Q-16 & Q-17 ditambahkan sebagai pertanyaan terbuka. PD-08 tetap `open`. Placeholder `[INPUT PILOT]` dipertahankan.

**Akhir Dokumen — Versi 1.2 (Finalisasi Keputusan, 2026-10-13).**
Dokumen menunggu input `[INPUT PILOT]` (nama kampus & domain pilot) sebelum masuk ke desain user flow detail & desain database lanjutan. Keputusan terbuka yang tersisa: PD-08 (retensi, penghapusan akun, target metrik) serta detail Q-03/Q-16/Q-17.
