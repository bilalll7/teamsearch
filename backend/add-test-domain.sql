INSERT INTO "AllowedDomain" (id, "campusId", domain, aktif, "createdAt")
SELECT gen_random_uuid(), id, '@student.test', true, NOW()
FROM "Campus"
WHERE "namaCampus" = '[INPUT PILOT]';
