import * as bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '../generated/prisma';

const prisma = new PrismaClient();

// Catálogo completo de privilegios (19) — ver docs/01-architecture/implementacion.md §7.
const ALL_PRIVILEGES = [
  'CONTRACT_CREATE',
  'CONTRACT_EDIT',
  'CONTRACT_SUBMIT',
  'CONTRACT_CANCEL',
  'CONTRACT_RECOVER',
  'CONTRACT_REVIEW_ADMIN',
  'CONTRACT_REVIEW_LAWYER',
  'CONTRACT_APPROVE',
  'CONTRACT_SIGN',
  'CONTRACT_VIEW_ALL',
  'CONTRACT_VIEW_AREA',
  'DOCUMENT_UPLOAD',
  'DOCUMENT_VERSION',
  'WORKFLOW_CONFIG',
  'USERS_MANAGE',
  'AREAS_MANAGE',
  'APODERADOS_MANAGE',
  'TEMPLATES_MANAGE',
  'REPORTS_VIEW',
];

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@aletheia.com' },
    update: {},
    create: {
      email: 'admin@aletheia.com',
      name: 'Admin',
      lastName: 'ALETHEIA',
      password,
      roles: [Role.ADMINISTRADOR],
      privileges: ALL_PRIVILEGES,
    },
  });

  console.log('✅ Seed auth: admin@aletheia.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
