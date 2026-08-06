import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const [alice, bob, carol] = await Promise.all([
    prisma.user.create({ data: { name: 'Alice Nguyen', email: 'alice@example.com' } }),
    prisma.user.create({ data: { name: 'Bob Martinez', email: 'bob@example.com' } }),
    prisma.user.create({ data: { name: 'Carol Smith', email: 'carol@example.com' } }),
  ]);

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up CI pipeline',
        description: 'Configure GitHub Actions for lint, test, and build.',
        status: 'todo',
        assigneeId: alice.id,
      },
      {
        title: 'Design ER diagram',
        description: 'Model Task and User relationship for the board.',
        status: 'done',
        assigneeId: alice.id,
      },
      {
        title: 'Build task list UI',
        description: 'MUI-based board grouped by status.',
        status: 'in_progress',
        assigneeId: bob.id,
      },
      {
        title: 'Wire up Redux store',
        description: 'Async thunks for CRUD against the tasks API.',
        status: 'in_progress',
        assigneeId: carol.id,
      },
      {
        title: 'Write README',
        description: 'Document setup, ER diagram, and tradeoffs.',
        status: 'todo',
        assigneeId: null,
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
