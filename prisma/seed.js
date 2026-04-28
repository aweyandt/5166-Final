import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

async function resetDatabase() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE task_labels, tasks, labels, projects, users
    RESTART IDENTITY CASCADE;
  `);
}

async function main() {
  await resetDatabase();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: passwordHash,
      role: 'ADMIN',
    },
  });

  const owner = await prisma.user.create({
    data: {
      username: 'owner',
      email: 'owner@example.com',
      password_hash: passwordHash,
      role: 'USER',
    },
  });

  const nonOwner = await prisma.user.create({
    data: {
      username: 'not-owner',
      email: 'not-owner@example.com',
      password_hash: passwordHash,
      role: 'USER',
    },
  });

  const project = await prisma.project.create({
    data: {
      user_id: owner.id,
      name: 'Database Final Project',
      description: 'Complete the final project implementation and deployment deliverables.',
      status: 'IN_PROGRESS',
      due_date: new Date('2026-04-28T23:59:00.000Z'),
    },
  });

  const secondProject = await prisma.project.create({
    data: {
      user_id: owner.id,
      name: 'Sprint Cleanup',
      description: 'Wrap up follow-up tasks and documentation.',
      status: 'PLANNING',
      due_date: new Date('2026-05-03T17:00:00.000Z'),
    },
  });

  const bugLabel = await prisma.label.create({
    data: {
      user_id: owner.id,
      name: 'bug',
      color: '#ef4444',
    },
  });

  const docsLabel = await prisma.label.create({
    data: {
      user_id: owner.id,
      name: 'docs',
      color: '#2563eb',
    },
  });

  const urgentLabel = await prisma.label.create({
    data: {
      user_id: owner.id,
      name: 'urgent',
      color: '#f97316',
    },
  });

  const taskOne = await prisma.task.create({
    data: {
      project_id: project.id,
      assigned_user_id: owner.id,
      title: 'Build Prisma schema',
      description: 'Translate the ER diagram into a working Prisma schema.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      due_date: new Date('2026-04-27T17:00:00.000Z'),
    },
  });

  const taskTwo = await prisma.task.create({
    data: {
      project_id: project.id,
      assigned_user_id: nonOwner.id,
      title: 'Write Swagger documentation',
      description: 'Document every endpoint with request and response examples.',
      priority: 'URGENT',
      status: 'TODO',
      due_date: new Date('2026-04-28T12:00:00.000Z'),
    },
  });

  const taskThree = await prisma.task.create({
    data: {
      project_id: secondProject.id,
      assigned_user_id: owner.id,
      title: 'Draft testing plan',
      description: 'Prepare step-by-step grading instructions in Swagger.',
      priority: 'MEDIUM',
      status: 'TODO',
      due_date: new Date('2026-05-01T15:00:00.000Z'),
    },
  });

  await prisma.taskLabel.createMany({
    data: [
      { task_id: taskOne.id, label_id: docsLabel.id },
      { task_id: taskTwo.id, label_id: urgentLabel.id },
      { task_id: taskTwo.id, label_id: bugLabel.id },
      { task_id: taskThree.id, label_id: docsLabel.id },
    ],
  });

  console.log('Seeded users:', {
    admin: admin.email,
    owner: owner.email,
    nonOwner: nonOwner.email,
  });
  console.log('Seed password: Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
