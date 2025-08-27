const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password_hash: passwordHash,
      points_balance: 100,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password_hash: passwordHash,
      points_balance: 50,
    },
  });
  console.log(`Created users: ${user1.email}, ${user2.email}`);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const service1 = await prisma.service.upsert({
    where: { title: 'service1' },
    update: {},
    create: {
      title: 'service1',
      start_time: today,
      end_time: new Date(today.getTime() + 60 * 60 * 1000),
      capacity: 1,
      is_group: false,
      price_points: 20,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { title: 'service2' },
    update: {},
    create: {
      title: 'service2',
      start_time: tomorrow,
      end_time: new Date(tomorrow.getTime() + 90 * 60 * 1000),
      capacity: 10,
      is_group: true,
      price_points: 15,
    },
  });

  const service3 = await prisma.service.upsert({
    where: { title: 'service3' },
    update: {},
    create: {
      title: 'service3',
      start_time: new Date(),
      end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
      capacity: 15,
      is_group: true,
      price_points: 25,
    },
  });

  console.log(
    `Created services: ${service1.title}, ${service2.title}, ${service3.title}`,
  );

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
