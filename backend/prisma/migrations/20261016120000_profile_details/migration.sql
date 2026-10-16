ALTER TABLE "Profile"
  ADD COLUMN "headline" VARCHAR(160),
  ADD COLUMN "lokasi" VARCHAR(120),
  ADD COLUMN "avatarUrl" VARCHAR(500),
  ADD COLUMN "resumeUrl" VARCHAR(500),
  ADD COLUMN "pengalaman" JSONB,
  ADD COLUMN "pendidikan" JSONB;
