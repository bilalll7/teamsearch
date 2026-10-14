// Seed data for TeamSearch MVP - PD-03: idempotent skill catalog
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Skill categories (PD-03)
  const categories = [
    'Frontend',
    'Backend',
    'Mobile',
    'UI/UX Design',
    'Data Science',
    'DevOps',
    'Project Management',
    'Marketing',
  ];

  const createdCategories = await Promise.all(
    categories.map((nama) =>
      prisma.skillCategory.upsert({
        where: { nama },
        update: {},
        create: { nama },
      }),
    ),
  );

  console.log(`✓ Created ${createdCategories.length} skill categories`);

  // Skills per category (PD-03: seed data idempotent)
  const skills = [
    // Frontend
    { nama: 'React', kategori: 'Frontend' },
    { nama: 'Vue.js', kategori: 'Frontend' },
    { nama: 'Angular', kategori: 'Frontend' },
    { nama: 'TypeScript', kategori: 'Frontend' },
    { nama: 'JavaScript', kategori: 'Frontend' },
    { nama: 'HTML/CSS', kategori: 'Frontend' },
    { nama: 'Tailwind CSS', kategori: 'Frontend' },
    { nama: 'Next.js', kategori: 'Frontend' },
    
    // Backend
    { nama: 'Node.js', kategori: 'Backend' },
    { nama: 'NestJS', kategori: 'Backend' },
    { nama: 'Express.js', kategori: 'Backend' },
    { nama: 'Python', kategori: 'Backend' },
    { nama: 'Django', kategori: 'Backend' },
    { nama: 'Flask', kategori: 'Backend' },
    { nama: 'Java', kategori: 'Backend' },
    { nama: 'Spring Boot', kategori: 'Backend' },
    { nama: 'PHP', kategori: 'Backend' },
    { nama: 'Laravel', kategori: 'Backend' },
    { nama: 'PostgreSQL', kategori: 'Backend' },
    { nama: 'MongoDB', kategori: 'Backend' },
    { nama: 'MySQL', kategori: 'Backend' },
    { nama: 'REST API', kategori: 'Backend' },
    { nama: 'GraphQL', kategori: 'Backend' },
    
    // Mobile
    { nama: 'React Native', kategori: 'Mobile' },
    { nama: 'Flutter', kategori: 'Mobile' },
    { nama: 'Swift', kategori: 'Mobile' },
    { nama: 'Kotlin', kategori: 'Mobile' },
    
    // UI/UX Design
    { nama: 'Figma', kategori: 'UI/UX Design' },
    { nama: 'Adobe XD', kategori: 'UI/UX Design' },
    { nama: 'Sketch', kategori: 'UI/UX Design' },
    { nama: 'User Research', kategori: 'UI/UX Design' },
    { nama: 'Prototyping', kategori: 'UI/UX Design' },
    { nama: 'Wireframing', kategori: 'UI/UX Design' },
    
    // Data Science
    { nama: 'Python (Data Science)', kategori: 'Data Science' },
    { nama: 'Pandas', kategori: 'Data Science' },
    { nama: 'NumPy', kategori: 'Data Science' },
    { nama: 'TensorFlow', kategori: 'Data Science' },
    { nama: 'PyTorch', kategori: 'Data Science' },
    { nama: 'Machine Learning', kategori: 'Data Science' },
    { nama: 'Data Visualization', kategori: 'Data Science' },
    { nama: 'SQL', kategori: 'Data Science' },
    
    // DevOps
    { nama: 'Docker', kategori: 'DevOps' },
    { nama: 'Kubernetes', kategori: 'DevOps' },
    { nama: 'CI/CD', kategori: 'DevOps' },
    { nama: 'AWS', kategori: 'DevOps' },
    { nama: 'Google Cloud', kategori: 'DevOps' },
    { nama: 'Azure', kategori: 'DevOps' },
    { nama: 'Linux', kategori: 'DevOps' },
    
    // Project Management
    { nama: 'Agile/Scrum', kategori: 'Project Management' },
    { nama: 'Project Planning', kategori: 'Project Management' },
    { nama: 'Team Coordination', kategori: 'Project Management' },
    { nama: 'Documentation', kategori: 'Project Management' },
    
    // Marketing
    { nama: 'Digital Marketing', kategori: 'Marketing' },
    { nama: 'Content Creation', kategori: 'Marketing' },
    { nama: 'Social Media', kategori: 'Marketing' },
    { nama: 'SEO', kategori: 'Marketing' },
  ];

  let skillCount = 0;
  for (const skill of skills) {
    const kategori = createdCategories.find((c) => c.nama === skill.kategori);
    if (!kategori) continue;

    await prisma.skill.upsert({
      where: {
        nama_kategoriSkillId: {
          nama: skill.nama,
          kategoriSkillId: kategori.id,
        },
      },
      update: {},
      create: {
        nama: skill.nama,
        kategoriSkillId: kategori.id,
        status: 'aktif',
      },
    });
    skillCount++;
  }

  console.log(`✓ Created ${skillCount} skills`);

  // Campus seed - placeholder [INPUT PILOT] per PD-01
  // ponytail: Replace with actual campus name and domains from stakeholder
  const campusPlaceholder = await prisma.campus.upsert({
    where: { namaCampus: '[INPUT PILOT]' },
    update: {},
    create: {
      namaCampus: '[INPUT PILOT]',
    },
  });

  await prisma.allowedDomain.upsert({
    where: {
      campusId_domain: {
        campusId: campusPlaceholder.id,
        domain: '@student.[INPUT PILOT]',
      },
    },
    update: {},
    create: {
      campusId: campusPlaceholder.id,
      domain: '@student.[INPUT PILOT]',
      aktif: true,
    },
  });

  console.log(`✓ Created campus placeholder (awaiting real data from stakeholder)`);
  console.log('✓ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
